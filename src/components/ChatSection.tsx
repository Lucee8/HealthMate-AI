/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Send, 
  Paperclip, 
  Image, 
  FileText, 
  Mic, 
  Trash2, 
  Sparkles, 
  AlertCircle, 
  ShieldAlert, 
  Info,
  RefreshCw,
  Volume2
} from 'lucide-react';
import { DBState, ChatMessage } from '../types';

interface ChatSectionProps {
  dbState: DBState;
  onSendMessage: (text: string) => Promise<void>;
  onClearChats: () => Promise<void>;
  onNavigateToRecords: () => void;
}

export default function ChatSection({ 
  dbState, 
  onSendMessage, 
  onClearChats,
  onNavigateToRecords
}: ChatSectionProps) {
  const { chats, profile } = dbState;
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [speakingMsgId, setSpeakingMsgId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chats, isLoading]);

  // Recording timer
  useEffect(() => {
    let interval: any;
    if (isRecording) {
      setRecordingSeconds(0);
      interval = setInterval(() => {
        setRecordingSeconds((prev) => {
          if (prev >= 3) {
            clearInterval(interval);
            triggerTranscribe();
            return 3;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const triggerTranscribe = () => {
    const voiceQueries = [
      "What is the purpose of Telmisartan 40mg and are there any side effects?",
      "Can you analyze my blood panel and tell me what needs attention?",
      "Why is Vitamin D important and what foods can help increase it?",
      "What are the cardiovascular risks of chronic high blood pressure?"
    ];
    const query = voiceQueries[Math.floor(Math.random() * voiceQueries.length)];
    setInputText(query);
    setIsRecording(false);
  };

  const handleSpeak = (text: string, id: string) => {
    if ('speechSynthesis' in window) {
      if (speakingMsgId === id) {
        window.speechSynthesis.cancel();
        setSpeakingMsgId(null);
      } else {
        window.speechSynthesis.cancel();
        // Remove markdown or other characters
        const cleanText = text.replace(/[*#`_\-]/g, '').trim();
        const utterance = new SpeechSynthesisUtterance(cleanText);
        utterance.onend = () => setSpeakingMsgId(null);
        utterance.onerror = () => setSpeakingMsgId(null);
        setSpeakingMsgId(id);
        window.speechSynthesis.speak(utterance);
      }
    } else {
      alert("Speech synthesis is not supported on your browser.");
    }
  };

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || isLoading) return;

    const textToSend = inputText;
    setInputText('');
    setIsLoading(true);
    await onSendMessage(textToSend);
    setIsLoading(false);
  };

  const handleSuggestion = async (prompt: string) => {
    if (isLoading) return;
    setIsLoading(true);
    await onSendMessage(prompt);
    setIsLoading(false);
  };

  const suggestionPills = [
    { text: "Explain my blood report", query: "Can you analyze my most recent Comprehensive Blood Panel and summarize what's normal or needs attention?" },
    { text: "Explain Telmisartan 40mg", query: "What is the purpose of Telmisartan 40mg and are there any common side effects or dietary conflicts I should avoid?" },
    { text: "Vitamin D deficiency", query: "Why is Vitamin D important, what are the symptoms of low levels, and what foods can help increase it?" },
    { text: "Chronic High BP risks", query: "What are the general long-term risks of chronic high blood pressure, and what lifestyle modifications are typically suggested?" }
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] pb-16 relative">
      {/* Voice Assistant Overlay Modal */}
      {isRecording && (
        <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xs flex flex-col items-center justify-center z-50 text-white animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl flex flex-col items-center max-w-xs text-center space-y-6 shadow-2xl">
            <div className="relative">
              <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center animate-ping opacity-25 absolute inset-0"></div>
              <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center relative shadow-lg">
                <Mic size={32} className="text-white" />
              </div>
            </div>
            <div>
              <h3 className="text-sm font-black uppercase tracking-widest text-blue-400">Listening to Voice</h3>
              <p className="text-xs text-slate-300 mt-1">Talk now. HealthMate is transcribing...</p>
              <div className="mt-4 flex justify-center gap-1">
                <span className="w-1.5 h-6 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '0.1s' }}></span>
                <span className="w-1.5 h-10 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '0.3s' }}></span>
                <span className="w-1.5 h-8 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></span>
                <span className="w-1.5 h-11 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '0.7s' }}></span>
                <span className="w-1.5 h-5 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '0.9s' }}></span>
              </div>
            </div>
            <div className="text-[10px] text-slate-500 font-bold">
              Recording: 00:0{recordingSeconds}s
            </div>
            <button
              onClick={() => setIsRecording(false)}
              className="bg-red-500 hover:bg-red-600 text-white font-bold text-xs px-4 py-2 rounded-xl"
            >
              Cancel Dictation
            </button>
          </div>
        </div>
      )}

      {/* Disclaimer Banner at very top */}
      <div className="bg-blue-50 border-b border-blue-100 px-4 py-2 flex items-center gap-2 shrink-0">
        <Info className="text-blue-600 shrink-0" size={14} />
        <p className="text-[10px] md:text-xs font-semibold text-blue-800 leading-tight">
          Educational info only. Not a medical diagnosis. Consult a doctor.
        </p>
        <button 
          onClick={onClearChats}
          className="ml-auto text-slate-400 hover:text-red-500 p-1 rounded-md transition-colors cursor-pointer"
          title="Clear chat logs"
        >
          <Trash2 size={13} />
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {chats.length <= 1 && (
          <div className="flex flex-col items-center text-center py-6 max-w-sm mx-auto space-y-3">
            <div className="w-16 h-16 rounded-3xl bg-blue-600 flex items-center justify-center text-white shadow-md animate-bounce">
              🤖
            </div>
            <h2 className="text-lg font-bold text-slate-800">Good Afternoon. How can I assist?</h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              I'm your secure clinical assistant, trained to help you understand your medical data and health journey.
            </p>
          </div>
        )}

        {chats.map((msg) => {
          const isBot = msg.sender === 'assistant';
          const isEmergency = msg.isEmergency;

          return (
            <div 
              key={msg.id}
              className={`flex items-start gap-2.5 ${isBot ? 'justify-start' : 'justify-end'}`}
            >
              {isBot && (
                <div className="w-8 h-8 rounded-xl bg-blue-600 text-white shrink-0 flex items-center justify-center text-sm font-black shadow-xs">
                  🤖
                </div>
              )}
              <div className="max-w-[85%] space-y-1">
                {isEmergency ? (
                  <div className="bg-red-50 border-2 border-red-500 rounded-2xl p-4 text-red-950 shadow-xs flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-red-700 font-bold text-sm">
                      <ShieldAlert size={18} className="animate-pulse" />
                      EMERGENCY DISPATCH WARNED
                    </div>
                    <div className="text-xs leading-relaxed font-semibold whitespace-pre-wrap">
                      {msg.text}
                    </div>
                  </div>
                ) : (
                  <div className="relative group">
                    <div className={`p-3.5 pr-8 rounded-2xl text-xs leading-relaxed whitespace-pre-wrap shadow-3xs ${
                      isBot 
                        ? 'bg-white border border-slate-100 text-slate-800 rounded-tl-xs' 
                        : 'bg-blue-600 text-white rounded-tr-xs font-medium'
                    }`}>
                      {msg.text}
                    </div>
                    {isBot && (
                      <button
                        type="button"
                        onClick={() => handleSpeak(msg.text, msg.id)}
                        className={`absolute right-1.5 bottom-1.5 p-1 rounded-lg transition-colors cursor-pointer ${
                          speakingMsgId === msg.id 
                            ? 'text-rose-600 bg-rose-50' 
                            : 'text-slate-300 hover:text-blue-600 hover:bg-slate-50'
                        }`}
                        title="Read Aloud"
                      >
                        <Volume2 size={13} className={speakingMsgId === msg.id ? "animate-pulse" : ""} />
                      </button>
                    )}
                  </div>
                )}
                <div className={`text-[10px] text-slate-400 px-1 ${!isBot && 'text-right'}`}>
                  {msg.timestamp}
                </div>
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-center gap-2.5 justify-start">
            <div className="w-8 h-8 rounded-xl bg-blue-600 text-white shrink-0 flex items-center justify-center text-sm animate-spin">
              <RefreshCw size={14} />
            </div>
            <div className="bg-slate-100 text-slate-500 text-xs px-4 py-2.5 rounded-2xl rounded-tl-xs">
              Analyzing metrics with HealthMate AI...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggestion Pills */}
      {chats.length <= 2 && (
        <div className="px-4 py-2 overflow-x-auto shrink-0 flex gap-1.5 no-scrollbar">
          {suggestionPills.map((pill, i) => (
            <button
              key={i}
              onClick={() => handleSuggestion(pill.query)}
              disabled={isLoading}
              className="shrink-0 bg-white hover:bg-slate-50 transition-colors border border-slate-100 text-[10px] font-bold text-slate-600 px-3 py-1.5 rounded-full shadow-3xs cursor-pointer disabled:opacity-50"
            >
              {pill.text}
            </button>
          ))}
        </div>
      )}

      {/* Input Field Form */}
      <form 
        onSubmit={handleSend}
        className="px-4 py-2.5 bg-white border-t border-slate-100 flex items-center gap-2 shrink-0"
      >
        <div className="flex gap-1 shrink-0">
          <button 
            type="button"
            onClick={onNavigateToRecords}
            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer"
            title="Attach Blood Report File"
          >
            <Paperclip size={18} />
          </button>
          <button 
            type="button"
            onClick={() => setIsRecording(true)}
            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer"
            title="Voice assistant microphone dictation"
          >
            <Mic size={18} />
          </button>
        </div>

        <input 
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          disabled={isLoading}
          placeholder="Ask about medications, blood levels, allergies..."
          className="flex-1 text-xs border border-slate-100 rounded-xl px-3 py-2.5 focus:outline-hidden focus:border-blue-400 disabled:bg-slate-50 disabled:opacity-75"
        />

        <button 
          type="submit"
          disabled={!inputText.trim() || isLoading}
          className="p-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600 text-white rounded-xl transition-colors shadow-sm shrink-0 flex items-center justify-center cursor-pointer"
        >
          <Send size={15} />
        </button>
      </form>
    </div>
  );
}
