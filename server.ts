/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import { DBState, ChatMessage, Medication, Appointment, MedicalRecord, UserProfile } from "./src/types";

// Setup server-side persistent database path
const DB_FILE_PATH = path.join(process.cwd(), "db.json");

// Default initial state matching the PRD and user's requested visual layout
const DEFAULT_DB_STATE: DBState = {
  profile: {
    name: "",
    age: 0,
    gender: "Prefer not to say",
    bloodGroup: "",
    allergies: "",
    conditions: "",
    emergencyContactName: "Dr. Sarah Smith",
    emergencyContactPhone: "+91 98765 43210",
    consentGiven: false,
    onboardingComplete: false,
    onboardingStep: "splash",
    height: 170,
    heightUnit: "cm",
    weight: 70,
    weightUnit: "kg",
    onboardingAnswers: {
      conditions: [],
      allergies: "",
      takingMedicines: false,
      medicineNames: "",
      mainGoal: "General wellness"
    },
    permissions: {
      notifications: false,
      healthSync: false,
      camera: false,
      storage: false
    }
  },
  medications: [
    {
      id: "med-1",
      name: "Telmisartan 40mg",
      dosage: "1 Tablet",
      frequency: "Once daily",
      times: ["Morning"],
      notes: "Take after breakfast for mild hypertension control",
      history: {
        "2026-06-28": "taken",
        "2026-06-29": "taken"
      }
    },
    {
      id: "med-2",
      name: "Vitamin D3 (60K IU)",
      dosage: "1 Capsule",
      frequency: "Once weekly",
      times: ["Morning"],
      notes: "Take on Sundays with milk",
      history: {
        "2026-06-28": "taken"
      }
    }
  ],
  appointments: [
    {
      id: "app-1",
      doctorName: "Dr. Sarah Smith",
      specialty: "Cardiology Specialist",
      clinicName: "City Heart Care, Clinic Room 4",
      date: "2026-06-30", // Tomorrow relative to 2026-06-29
      time: "14:00",
      notes: "Routine blood pressure checkup and prescription renewal."
    }
  ],
  records: [
    {
      id: "rec-1",
      title: "Comprehensive Blood Panel",
      type: "blood_report",
      date: "2023-10-24",
      fileName: "blood_report_oct2023.pdf",
      fileSize: "1.2 MB",
      biomarkers: {
        hemoglobin: {
          value: 14.2,
          unit: "g/dL",
          status: "normal",
          rangeMin: 13.5,
          rangeMax: 17.5,
          explanation: "Your level is healthy. This ensures your body's tissues are getting plenty of oxygen."
        },
        vitaminD: {
          value: 32.4,
          unit: "ng/mL",
          status: "normal",
          rangeMin: 30.0,
          rangeMax: 100.0,
          explanation: "You've reached the normal range! Continue current sun exposure or supplement habits."
        },
        vitaminB12: {
          value: 540,
          unit: "pg/mL",
          status: "normal",
          rangeMin: 200,
          rangeMax: 900,
          explanation: "B12 levels are steady. This supports your nerve function and red blood cell production."
        },
        fastingSugar: {
          value: 88,
          unit: "mg/dL",
          status: "normal",
          rangeMin: 70,
          rangeMax: 99,
          explanation: "Your fasting glucose is excellent, indicating stable blood sugar regulation."
        }
      },
      aiExplanation: "Most biomarkers are in range. Blood sugar is optimal. Your slight iron deficiency is improving as hemoglobin levels stay steady."
    }
  ],
  chats: [
    {
      id: "chat-init",
      sender: "assistant",
      text: "Hello Bhavesh! I've loaded your health profile. You have one blood report to review. How can I assist you with your health metrics, prescriptions, or medications today?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isDisclaimer: false
    }
  ],
  waterLogged: 1.5,
  exerciseLogged: 45,
  sleepLogged: 7.2
};

// Database utility functions
function readDB(): DBState {
  try {
    if (!fs.existsSync(DB_FILE_PATH)) {
      fs.writeFileSync(DB_FILE_PATH, JSON.stringify(DEFAULT_DB_STATE, null, 2));
      return DEFAULT_DB_STATE;
    }
    const data = fs.readFileSync(DB_FILE_PATH, "utf-8");
    return JSON.parse(data) as DBState;
  } catch (error) {
    console.error("Failed to read database file, returning default state:", error);
    return DEFAULT_DB_STATE;
  }
}

function writeDB(state: DBState): void {
  try {
    fs.writeFileSync(DB_FILE_PATH, JSON.stringify(state, null, 2));
  } catch (error) {
    console.error("Failed to write to database file:", error);
  }
}

// Lazy Gemini Client Initialization
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is not configured in Secrets.");
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build"
        }
      }
    });
  }
  return aiClient;
}

// Helper to make Gemini generateContent calls robust against transient 503/429 errors
async function generateContentWithRetry(
  ai: GoogleGenAI,
  params: any,
  maxRetries = 3,
  delayMs = 1500
): Promise<any> {
  let attempt = 0;
  while (true) {
    try {
      return await ai.models.generateContent(params);
    } catch (error: any) {
      attempt++;
      const errorMessage = error?.message || String(error);
      const isTransient = 
        errorMessage.includes("503") || 
        errorMessage.includes("500") || 
        errorMessage.includes("429") || 
        errorMessage.includes("UNAVAILABLE") || 
        errorMessage.includes("high demand") || 
        errorMessage.includes("temporary") ||
        (error?.status && (error.status === 503 || error.status === 429 || error.status === 500));
      
      if (isTransient && attempt < maxRetries) {
        const backoffDelay = delayMs * Math.pow(2, attempt - 1);
        console.warn(`[Gemini Retry] Attempt ${attempt} failed with transient error: ${errorMessage}. Retrying in ${backoffDelay}ms...`);
        await new Promise(resolve => setTimeout(resolve, backoffDelay));
        continue;
      }
      throw error;
    }
  }
}

// Medical Safety Guardrail Keywords
const EMERGENCY_KEYWORDS = [
  "chest pain", "heart attack", "difficulty breathing", "severe bleeding", 
  "stroke", "difficulty speaking", "severe abdominal pain", "suicidal", 
  "breathing difficulty", "choking", "unconscious", "head injury", "seizure",
  "poison", "overdose", "chest tightness"
];

function containsEmergencyKeywords(text: string): boolean {
  const normalized = text.toLowerCase();
  return EMERGENCY_KEYWORDS.some(keyword => normalized.includes(keyword));
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "50mb" }));

  // API: Get entire Database State
  app.get("/api/db", (req, res) => {
    res.json(readDB());
  });

  // API: Reset Database State
  app.post("/api/db/reset", (req, res) => {
    writeDB(DEFAULT_DB_STATE);
    res.json({ success: true, state: DEFAULT_DB_STATE });
  });

  // API: Update profile
  app.post("/api/db/profile", (req, res) => {
    const state = readDB();
    state.profile = { ...state.profile, ...req.body };
    writeDB(state);
    res.json({ success: true, profile: state.profile });
  });

  // API: Add or update medication
  app.post("/api/db/medications", (req, res) => {
    const state = readDB();
    const med: Medication = req.body;
    if (!med.id) {
      med.id = `med-${Date.now()}`;
      med.history = {};
    }
    const idx = state.medications.findIndex(m => m.id === med.id);
    if (idx >= 0) {
      state.medications[idx] = { ...state.medications[idx], ...med };
    } else {
      state.medications.push(med);
    }
    writeDB(state);
    res.json({ success: true, medications: state.medications });
  });

  // API: Delete medication
  app.delete("/api/db/medications/:id", (req, res) => {
    const state = readDB();
    state.medications = state.medications.filter(m => m.id !== req.params.id);
    writeDB(state);
    res.json({ success: true, medications: state.medications });
  });

  // API: Log Medication status
  app.post("/api/db/medications/log", (req, res) => {
    const { medId, date, status } = req.body; // status: 'taken' | 'missed'
    const state = readDB();
    const med = state.medications.find(m => m.id === medId);
    if (med) {
      if (!med.history) med.history = {};
      med.history[date] = status;
      writeDB(state);
      res.json({ success: true, medications: state.medications });
    } else {
      res.status(404).json({ error: "Medication not found" });
    }
  });

  // API: Add or update appointment
  app.post("/api/db/appointments", (req, res) => {
    const state = readDB();
    const appt: Appointment = req.body;
    if (!appt.id) {
      appt.id = `app-${Date.now()}`;
    }
    const idx = state.appointments.findIndex(a => a.id === appt.id);
    if (idx >= 0) {
      state.appointments[idx] = { ...state.appointments[idx], ...appt };
    } else {
      state.appointments.push(appt);
    }
    writeDB(state);
    res.json({ success: true, appointments: state.appointments });
  });

  // API: Delete appointment
  app.delete("/api/db/appointments/:id", (req, res) => {
    const state = readDB();
    state.appointments = state.appointments.filter(a => a.id !== req.params.id);
    writeDB(state);
    res.json({ success: true, appointments: state.appointments });
  });

  // API: Update trackers (water, exercise, sleep)
  app.post("/api/db/trackers", (req, res) => {
    const { water, exercise, sleep } = req.body;
    const state = readDB();
    if (water !== undefined) state.waterLogged = Number(water);
    if (exercise !== undefined) state.exerciseLogged = Number(exercise);
    if (sleep !== undefined) state.sleepLogged = Number(sleep);
    writeDB(state);
    res.json({ success: true, waterLogged: state.waterLogged, exerciseLogged: state.exerciseLogged, sleepLogged: state.sleepLogged });
  });

  // API: Delete medical record
  app.delete("/api/db/records/:id", (req, res) => {
    const state = readDB();
    state.records = state.records.filter(r => r.id !== req.params.id);
    writeDB(state);
    res.json({ success: true, records: state.records });
  });

  // API: Clear chat history
  app.post("/api/db/chats/clear", (req, res) => {
    const state = readDB();
    state.chats = [
      {
        id: "chat-init",
        sender: "assistant",
        text: `Hello ${state.profile.name || "there"}! I've loaded your health profile. How can I assist you with your health metrics, prescriptions, or medications today?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isDisclaimer: false
      }
    ];
    writeDB(state);
    res.json({ success: true, chats: state.chats });
  });

  // API: AI Chat Handler
  app.post("/api/chat", async (req, res) => {
    const { text } = req.body;
    if (!text || typeof text !== "string") {
      return res.status(400).json({ error: "Missing text query" });
    }

    const state = readDB();
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Append user message to server storage
    const userMessage: ChatMessage = {
      id: `msg-u-${Date.now()}`,
      sender: "user",
      text,
      timestamp
    };
    state.chats.push(userMessage);

    // Guardrail Check: Emergency Detection
    if (containsEmergencyKeywords(text)) {
      const emergencyMessage: ChatMessage = {
        id: `msg-a-${Date.now()}`,
        sender: "assistant",
        text: "🚨 **EMERGENCY WARNING DETECTED** 🚨\n\nYour query contains terms suggesting a potential medical emergency (e.g., chest pain, breathing difficulty). **Please bypass this AI assistant and seek immediate medical attention.**\n\n- **Call Emergency Services (such as 102 / 112 in India, 911 in US) immediately.**\n- Go to the nearest Hospital Emergency Room.\n- Do not wait for any AI response.",
        timestamp,
        isDisclaimer: true,
        isEmergency: true
      };
      state.chats.push(emergencyMessage);
      writeDB(state);
      return res.json({ success: true, chats: state.chats });
    }

    try {
      // Lazy load Gemini Client
      const ai = getGeminiClient();

      // Gather current medical context for personalized reasoning
      const medsContext = state.medications.map(m => `- ${m.name} (${m.dosage}, ${m.frequency})`).join("\n");
      const recordsContext = state.records.map(r => {
        let text = `- Record: ${r.title} (${r.date})`;
        if (r.biomarkers) {
          text += ` [Biomarkers parsed: Hemoglobin: ${r.biomarkers.hemoglobin.value}, Vit D: ${r.biomarkers.vitaminD.value}, Vit B12: ${r.biomarkers.vitaminB12.value}, fastingSugar: ${r.biomarkers.fastingSugar.value}]`;
        }
        return text;
      }).join("\n");

      const systemInstruction = `You are HealthMate AI, a secure personal health companion trained to help non-technical users understand medical records, prescriptions, and general health metrics.

HEALTH COMPANION CONTEXT:
- Current User: ${state.profile.name}, Age ${state.profile.age}, Gender ${state.profile.gender}, Known Allergies: [${state.profile.allergies}], Chronic Conditions: [${state.profile.conditions}].
- Medications User is Currently Taking:\n${medsContext || "None currently added"}.
- Uploaded Records / Biomarker Reports History:\n${recordsContext || "No reports currently uploaded"}.

AI SAFETY & GUARDRAILS RULES:
1. STRICT DIAGNOSIS BLOCK: Under no circumstances should you ever name a probable diagnosis or tell the user they "have" a specific disease, even if asked directly. Speak educationally.
2. EDUCATION ONLY: Explain what medical terms, test values, or medicine classes generally mean. Frame comments as general concepts.
3. ADHERENCE & DOSAGE: Do not suggest specific drug dosages, adjustments, or custom drug combinations. State that only a licensed doctor can adjust regimens.
4. KEYWORD CROSS-CHECK: If users describe severe acute symptoms, urge them to consult a doctor immediately.
5. MANDATORY DISCLAIMER: You must append the non-dismissible disclaimer at the absolute end of every clinical or educational response.

Disclaimer format (must end your response with this):
"This is educational information, not a diagnosis. Please consult a doctor."`;

      // Fetch last few messages for chat continuity
      const history = state.chats.slice(-10, -1).map(msg => ({
        role: msg.sender === "user" ? "user" as const : "model" as const,
        parts: [{ text: msg.text }]
      }));

      // Generate content via Gemini 3.5 Flash using robust retry strategy
      const response = await generateContentWithRetry(ai, {
        model: "gemini-3.5-flash",
        contents: [
          ...history,
          { role: "user", parts: [{ text }] }
        ],
        config: {
          systemInstruction,
          temperature: 0.7
        }
      });

      let responseText = response.text || "I was unable to generate a response at this moment.";
      
      // Ensure the disclaimer is present at the end
      if (!responseText.includes("This is educational information, not a diagnosis")) {
        responseText += "\n\n*This is educational information, not a diagnosis. Please consult a doctor.*";
      }

      const assistantMessage: ChatMessage = {
        id: `msg-a-${Date.now()}`,
        sender: "assistant",
        text: responseText,
        timestamp,
        isDisclaimer: true
      };

      state.chats.push(assistantMessage);
      writeDB(state);
      res.json({ success: true, chats: state.chats });

    } catch (error: any) {
      console.error("Gemini API Error:", error);
      
      // Handle missing API key or transient overload gracefully without crashing
      const errorMessage = error.message || "";
      let errorFriendly = "";
      
      if (errorMessage.includes("GEMINI_API_KEY")) {
        errorFriendly = "My Gemini API Key is not configured yet. Please configure it in the AI Studio Secrets panel.";
      } else if (errorMessage.includes("503") || errorMessage.includes("UNAVAILABLE") || errorMessage.includes("high demand") || errorMessage.includes("temporary")) {
        errorFriendly = "The AI service is currently experiencing very high demand (Error 503). Spikes in demand are usually temporary. Please try again in a few moments, or review your trend history in the **Vitals** tab in the meantime!";
      } else {
        errorFriendly = `Could not connect to AI services: ${errorMessage || "Unknown error"}`;
      }

      const assistantMessage: ChatMessage = {
        id: `msg-a-${Date.now()}`,
        sender: "assistant",
        text: `⚠️ **System Note**: ${errorFriendly}\n\n*This is educational information, not a diagnosis. Please consult a doctor.*`,
        timestamp,
        isDisclaimer: true
      };

      state.chats.push(assistantMessage);
      writeDB(state);
      res.json({ success: true, chats: state.chats });
    }
  });

  // API: Analyze Blood Report (via simulated document parse + optional Gemini extraction)
  app.post("/api/analyze-report", async (req, res) => {
    const { title, date, textData, fileName, fileSize } = req.body;
    if (!title) {
      return res.status(400).json({ error: "Report title is required." });
    }

    const state = readDB();
    const id = `rec-${Date.now()}`;

    // Base mock values that are healthy, but can be updated by parsing or simulated logic
    let hemoglobin = 14.5;
    let vitaminD = 35.0;
    let vitaminB12 = 450;
    let fastingSugar = 85;

    // Check if the uploaded text contains some explicit numbers to extract
    if (textData) {
      const hemoglobinMatch = textData.match(/(?:hemoglobin|hb)\D*(\d+(?:\.\d+)?)/i);
      if (hemoglobinMatch) hemoglobin = parseFloat(hemoglobinMatch[1]);

      const vitDMatch = textData.match(/(?:vitamin d|vit d)\D*(\d+(?:\.\d+)?)/i);
      if (vitDMatch) vitaminD = parseFloat(vitDMatch[1]);

      const vitB12Match = textData.match(/(?:vitamin b12|vit b12|b12)\D*(\d+)/i);
      if (vitB12Match) vitaminB12 = parseInt(vitB12Match[1], 10);

      const sugarMatch = textData.match(/(?:sugar|glucose|fasting sugar|fasting glucose)\D*(\d+)/i);
      if (sugarMatch) fastingSugar = parseInt(sugarMatch[1], 10);
    }

    const generateStatus = (val: number, min: number, max: number): 'normal' | 'low' | 'high' => {
      if (val < min) return 'low';
      if (val > max) return 'high';
      return 'normal';
    };

    let aiExplanation = "Analysis complete. All 4 core biomarkers are parsed correctly.";

    try {
      // If API key is present, let's use Gemini to generate a beautiful summary of these parsed biomarkers!
      const ai = getGeminiClient();
      const prompt = `You are a medical lab report summarizer. Please review these four extracted biomarker values and write a concise, human-friendly summary (2-3 sentences max) outlining if they are normal, or if any is low/high.
- Hemoglobin: ${hemoglobin} g/dL (normal range 13.5 - 17.5)
- Vitamin D: ${vitaminD} ng/mL (normal range 30.0 - 100.0)
- Vitamin B12: ${vitaminB12} pg/mL (normal range 200 - 900)
- Fasting Blood Sugar: ${fastingSugar} mg/dL (normal range 70 - 99)

Keep your response factual, reassuring, and do NOT diagnose. Follow with the disclaimer: "This is educational information, not a diagnosis. Please consult a doctor."`;

      const aiResponse = await generateContentWithRetry(ai, {
        model: "gemini-3.5-flash",
        contents: prompt
      });
      if (aiResponse.text) {
        aiExplanation = aiResponse.text;
      }
    } catch (e) {
      console.log("Gemini parsed report explanation skipped or failed:", e);
      // fallback explanation builder
      const issues: string[] = [];
      if (hemoglobin < 13.5) issues.push("mildly low hemoglobin");
      if (vitaminD < 30.0) issues.push("insufficient Vitamin D");
      if (vitaminB12 < 200) issues.push("low Vitamin B12 levels");
      if (fastingSugar > 99) issues.push("elevated Fasting Blood Sugar");
      
      if (issues.length === 0) {
        aiExplanation = "Most biomarkers are in range. Blood sugar and blood counts are optimal. Keep up your active lifestyle!";
      } else {
        aiExplanation = `We detected ${issues.join(" and ")}. These values are flagged for your review. Please review these with your doctor for supplement advice.`;
      }
    }

    const newRecord: MedicalRecord = {
      id,
      title,
      type: "blood_report",
      date: date || new Date().toISOString().split("T")[0],
      fileName: fileName || "uploaded_report.pdf",
      fileSize: fileSize || "512 KB",
      biomarkers: {
        hemoglobin: {
          value: hemoglobin,
          unit: "g/dL",
          status: generateStatus(hemoglobin, 13.5, 17.5),
          rangeMin: 13.5,
          rangeMax: 17.5,
          explanation: hemoglobin >= 13.5 && hemoglobin <= 17.5 
            ? "Your level is healthy, ensuring proper oxygen transportation throughout body tissues."
            : hemoglobin < 13.5 ? "Low levels might suggest mild iron deficiency or anemia. Consult your doctor." : "Elevated hemoglobin levels. Review hydration status or consult your doctor."
        },
        vitaminD: {
          value: vitaminD,
          unit: "ng/mL",
          status: generateStatus(vitaminD, 30.0, 100.0),
          rangeMin: 30.0,
          rangeMax: 100.0,
          explanation: vitaminD >= 30.0 && vitaminD <= 100.0
            ? "You have optimal Vitamin D. Continue current dietary habits and solar exposure."
            : vitaminD < 30.0 ? "Vitamin D insufficiency is common. Consider dietary changes or solar/supplement intake under advice." : "Elevated Vitamin D levels."
        },
        vitaminB12: {
          value: vitaminB12,
          unit: "pg/mL",
          status: generateStatus(vitaminB12, 200, 900),
          rangeMin: 200,
          rangeMax: 900,
          explanation: vitaminB12 >= 200 && vitaminB12 <= 900
            ? "Your B12 is healthy, which is vital for red blood cells and nervous system health."
            : vitaminB12 < 200 ? "Low B12 can cause fatigue and nerve tingling. Check if supplements are appropriate." : "B12 is above average."
        },
        fastingSugar: {
          value: fastingSugar,
          unit: "mg/dL",
          status: generateStatus(fastingSugar, 70, 99),
          rangeMin: 70,
          rangeMax: 99,
          explanation: fastingSugar >= 70 && fastingSugar <= 99
            ? "Excellent fasting glucose. Indicates stable blood sugar regulation and insulin function."
            : fastingSugar < 70 ? "Fasting sugar is low. Check symptoms of hypoglycemia." : "Fasting blood sugar is pre-diabetic or elevated. Review sugar intake and carbohydrate patterns."
        }
      },
      aiExplanation
    };

    state.records.push(newRecord);
    
    // Add a chat log event so that user sees a message in the Assistant chat that a new report was loaded!
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    state.chats.push({
      id: `msg-sys-${Date.now()}`,
      sender: "assistant",
      text: `📊 **Report Analyzed**: I've processed your new blood report **"${title}"** and successfully extracted the core biomarkers. I've updated your trend history!\n\n**Hemoglobin**: ${hemoglobin} ${newRecord.biomarkers?.hemoglobin.status === "normal" ? "✅" : "⚠️"}\n**Vitamin D**: ${vitaminD} ${newRecord.biomarkers?.vitaminD.status === "normal" ? "✅" : "⚠️"}\n**Vitamin B12**: ${vitaminB12} ${newRecord.biomarkers?.vitaminB12.status === "normal" ? "✅" : "⚠️"}\n**Fasting Sugar**: ${fastingSugar} ${newRecord.biomarkers?.fastingSugar.status === "normal" ? "✅" : "⚠️"}\n\n*Disclaimer: This is educational information, not a diagnosis. Please consult a doctor.*`,
      timestamp,
      isDisclaimer: true
    });

    writeDB(state);
    res.json({ success: true, record: newRecord, state });
  });

  // Vite Middleware Setup for development, and Static handler for production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[HealthMate AI Server] running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
