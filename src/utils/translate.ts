/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type LanguageCode = 'en' | 'hi' | 'mr' | 'gu';

export interface TranslationDict {
  [key: string]: {
    en: string;
    hi: string;
    mr: string;
    gu: string;
  };
}

export const translations: TranslationDict = {
  // Navigation
  home: {
    en: "Home",
    hi: "मुख्य",
    mr: "होम",
    gu: "હોમ"
  },
  chat: {
    en: "Health Chat",
    hi: "स्वास्थ्य चैट",
    mr: "हेल्थ चॅट",
    gu: "હેલ્થ ચેટ"
  },
  records: {
    en: "Reports",
    hi: "रिपोर्ट्स",
    mr: "रेकॉर्ड्स",
    gu: "રિપોર્ટ"
  },
  vitals: {
    en: "Biomarkers",
    hi: "बायोमार्कर",
    mr: "व्हाइटल्स",
    gu: "બાયોમાર્કર્સ"
  },
  meds: {
    en: "Medications",
    hi: "दवाइयाँ",
    mr: "औषधे",
    gu: "દવાઓ"
  },
  profile: {
    en: "Profile",
    hi: "प्रोफ़ाइल",
    mr: "प्रोफाईल",
    gu: "પ્રોફાઇલ"
  },

  // General App Text
  healthScore: {
    en: "Dynamic Health Score",
    hi: "डायनेमिक स्वास्थ्य स्कोर",
    mr: "डायनॅमिक हेल्थ स्कोअर",
    gu: "ડાયનેમિક હેલ્થ સ્કોર"
  },
  scoreStatusExcellent: {
    en: "Excellent",
    hi: "उत्कृष्ट",
    mr: "उत्कृष्ट",
    gu: "ઉત્કૃષ્ટ"
  },
  scoreStatusGood: {
    en: "Good",
    hi: "अच्छा",
    mr: "चांगले",
    gu: "સારું"
  },
  scoreStatusNeedsCare: {
    en: "Needs Care",
    hi: "देखभाल की आवश्यकता",
    mr: "काळजी घेणे आवश्यक",
    gu: "સંભાળની જરૂર"
  },
  scoreTrend: {
    en: "Score is up 12% this week",
    hi: "इस सप्ताह स्कोर 12% बढ़ा है",
    mr: "या आठवड्यात स्कोअर १२% वाढला आहे",
    gu: "આ અઠવાડિયે સ્કોર ૧૨% વધ્યો છે"
  },

  // Greetings & Subtitles
  readyToOptimize: {
    en: "Ready to optimize your health today?",
    hi: "क्या आप आज अपना स्वास्थ्य बेहतर बनाने के लिए तैयार हैं?",
    mr: "आज तुमचे आरोग्य सुधारण्यासाठी तयार आहात का?",
    gu: "શું તમે આજે તમારું સ્વાસ્થ્ય સુધારવા માટે તૈયાર છો?"
  },
  goodMorning: {
    en: "Good Morning",
    hi: "शुभ प्रभात",
    mr: "शुभ सकाळ",
    gu: "શુભ સવાર"
  },
  goodAfternoon: {
    en: "Good Afternoon",
    hi: "नमस्कार",
    mr: "शुभ दुपार",
    gu: "શુભ બપોર"
  },

  // Core Sections & Headers
  aiInsights: {
    en: "AI Health Insights",
    hi: "एआई स्वास्थ्य अंतर्दृष्टि",
    mr: "एआय हेल्थ इनसाइट्स",
    gu: "AI હેલ્થ ઇનસાઇટ્સ"
  },
  viewTrends: {
    en: "View Trends",
    hi: "ट्रेंड्स देखें",
    mr: "ट्रेंड्स पहा",
    gu: "ટ્રેન્ડ જુઓ"
  },
  todayTrackers: {
    en: "Today's Trackers",
    hi: "आज के ट्रैकर्स",
    mr: "आजचे ट्रॅकर्स",
    gu: "આજના ટ્રેકર્સ"
  },
  upcomingAppointments: {
    en: "Upcoming Events",
    hi: "आने वाले कार्यक्रम",
    mr: "आगामी भेटी",
    gu: "આગામી મુલાકાતો"
  },
  quickActions: {
    en: "Quick Actions",
    hi: "त्वरित कार्रवाई",
    mr: "क्विक ॲक्शन्स",
    gu: "ઝડપી કાર્યો"
  },
  uploadReport: {
    en: "Upload Report",
    hi: "रिपोर्ट अपलोड करें",
    mr: "रिपोर्ट अपलोड करा",
    gu: "રિપોર્ટ અપલોડ કરો"
  },
  askAi: {
    en: "Ask AI",
    hi: "एआई से पूछें",
    mr: "एआय ला विचारा",
    gu: "AI ને પૂછો"
  },
  addMedicine: {
    en: "Add Medicine",
    hi: "दवा जोड़ें",
    mr: "औषध जोडा",
    gu: "દવા ઉમેરો"
  },
  bloodAnalysis: {
    en: "Blood Analysis",
    hi: "रक्त विश्लेषण",
    mr: "रक्त विश्लेषण",
    gu: "લોહીનું વિશ્લેષણ"
  },

  // Trackers
  water: {
    en: "Water",
    hi: "पानी",
    mr: "पाणी",
    gu: "પાણી"
  },
  exercise: {
    en: "Exercise",
    hi: "व्यायाम",
    mr: "व्यायाम",
    gu: "કસરત"
  },
  sleep: {
    en: "Sleep",
    hi: "नींद",
    mr: "झोप",
    gu: "ઊંઘ"
  },
  tapToLog: {
    en: "Tap to log",
    hi: "लॉग करने के लिए टैप करें",
    mr: "नोंदवण्यासाठी टॅप करा",
    gu: "નોંધવા માટે ટેપ કરો"
  },

  // Meds Section
  todayDoses: {
    en: "Today's Doses Checklist",
    hi: "आज की खुराक की सूची",
    mr: "आजच्या औषधांची यादी",
    gu: "આજની દવાની યાદી"
  },
  markTaken: {
    en: "Mark Taken",
    hi: "लिया गया",
    mr: "घेतले",
    gu: "લીધેલ છે"
  },
  taken: {
    en: "Taken",
    hi: "लिया",
    mr: "घेतले",
    gu: "લીધું"
  },
  medicationRegistry: {
    en: "Medication Registry",
    hi: "दवा रजिस्ट्री",
    mr: "औषध नोंदणी",
    gu: "દવા રજીસ્ટ્રી"
  },
  close: {
    en: "Close",
    hi: "बंद करें",
    mr: "बंद करा",
    gu: "બંધ કરો"
  },
  medicineName: {
    en: "Medication Name",
    hi: "दवा का नाम",
    mr: "औषधाचे नाव",
    gu: "દવાનું નામ"
  },
  dosageForm: {
    en: "Dosage Form",
    hi: "खुराक का रूप",
    mr: "औषध प्रमाण",
    gu: "દવાનું પ્રમાણ"
  },
  frequency: {
    en: "Frequency",
    hi: "आवृत्ति",
    mr: "वारंवारता",
    gu: "આવૃત્તિ"
  },
  saveMedication: {
    en: "Save Medication",
    hi: "दवा सहेजें",
    mr: "औषध सेव्ह करा",
    gu: "દવા સાચવો"
  },

  // Chat Section
  disclaimerText: {
    en: "Educational info only. Not a medical diagnosis. Consult a doctor.",
    hi: "केवल शैक्षिक जानकारी। चिकित्सा निदान नहीं। डॉक्टर से परामर्श करें।",
    mr: "फक्त शैक्षणिक माहिती. वैद्यकीय निदान नाही. डॉक्टरांचा सल्ला घ्या.",
    gu: "માત્ર શૈક્ષણિક માહિતી. તબીબી નિદાન નથી. ડૉક્ટરની સલાહ લો."
  },
  howCanIHelp: {
    en: "Good Afternoon. How can I assist?",
    hi: "नमस्कार। मैं आपकी क्या मदद कर सकता हूँ?",
    mr: "शुभ दुपार. मी तुम्हाला कशी मदत करू शकतो?",
    gu: "નમસ્કાર. હું આપને શું મદદ કરી શકું?"
  },
  placeholderChat: {
    en: "Ask about medications, blood levels, allergies...",
    hi: "दवाओं, रक्त स्तर, एलर्जी के बारे में पूछें...",
    mr: "औषधे, रक्ताची पातळी, ॲलर्जी बद्दल विचारा...",
    gu: "દવાઓ, બ્લડ લેવલ, એલર્જી વિશે પૂછો..."
  },

  // Wearables & Menstrual
  wearableTitle: {
    en: "Wearable Health Sync",
    hi: "वियरेबल हेल्थ सिंक",
    mr: "वेअरेबल हेल्थ सिंक",
    gu: "વેરેબલ હેલ્થ સિંક"
  },
  syncNow: {
    en: "Sync Now",
    hi: "अभी सिंक करें",
    mr: "आता सिंक करा",
    gu: "હમણાં સિંક કરો"
  },
  syncing: {
    en: "Syncing...",
    hi: "सिंक हो रहा है...",
    mr: "सिंक होत आहे...",
    gu: "સિંક થઈ રહ્યું છે..."
  },
  synced: {
    en: "Synced",
    hi: "सिंक किया गया",
    mr: "सिंक झाले",
    gu: "સિંક થઈ ગયું"
  },
  menstrualTracker: {
    en: "Menstrual Health Hub",
    hi: "मासिक धर्म स्वास्थ्य हब",
    mr: "मासिक पाळी आरोग्य हब",
    gu: "માસિક ધર્મ સ્વાસ્થ્ય હબ"
  },
  cycleDay: {
    en: "Cycle Day",
    hi: "चक्र दिवस",
    mr: "मासिक पाळी दिवस",
    gu: "ચક્ર દિવસ"
  },
  fertileWindow: {
    en: "Fertile Window",
    hi: "उर्वरक खिड़की (फर्टाइल)",
    mr: "फर्टाईल विंडो",
    gu: "ફર્ટાઇલ વિન્ડો"
  },
  nextPeriod: {
    en: "Next Period",
    hi: "अगली माहवारी",
    mr: "पुढील मासिक पाळी",
    gu: "આગામી માસિક ધર્મ"
  },

  // Family switcher
  familyProfile: {
    en: "Family Profile",
    hi: "पारिवारिक प्रोफ़ाइल",
    mr: "कौटुंबिक प्रोफाईल",
    gu: "કૌટુંબિક પ્રોફાઇલ"
  },
  switchProfile: {
    en: "Switch Profile",
    hi: "प्रोफ़ाइल बदलें",
    mr: "प्रोफाईल बदला",
    gu: "પ્રોફાઇલ બદલો"
  },

  // Notifications
  notificationsTitle: {
    en: "Smart Reminders & Alerts",
    hi: "स्मार्ट रिमाइंडर्स और अलर्ट",
    mr: "स्मार्ट रिमाइंडर्स आणि अलर्ट",
    gu: "સ્માર્ટ રીમાઇન્ડર્સ અને એલર્ટ"
  },

  // Caregiver
  caregiverConsole: {
    en: "Caregiver Monitoring",
    hi: "केयरगिवर मॉनिटरिंग",
    mr: "केअरगिव्हर मॉनिटरिंग",
    gu: "કેરગિવર મોનિટરિંગ"
  },
  caregiverStatus: {
    en: "Caregiver Access is Active",
    hi: "केयरगिवर एक्सेस सक्रिय है",
    mr: "केअरगिव्हर ॲक्सेस सक्रिय आहे",
    gu: "કેરગિવર એક્સેસ સક્રિય છે"
  },

  // Admin & Analytics
  adminAnalytics: {
    en: "Admin & Clinical Analytics",
    hi: "एडमिन और क्लिनिकल एनालिटिक्स",
    mr: "ॲडमिन आणि क्लिनिकल ॲनालिटिक्स",
    gu: "એડમિન અને ક્લિનિકલ એનાલિટિક્સ"
  }
};

export function getTranslation(key: string, lang: LanguageCode): string {
  const dict = translations[key];
  if (!dict) return key;
  return dict[lang] || dict['en'];
}
