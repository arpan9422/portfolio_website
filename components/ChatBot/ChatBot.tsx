"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
declare global {
  interface Window {
    SpeechRecognition: new () => ISpeechRecognition;
    webkitSpeechRecognition: new () => ISpeechRecognition;
  }
}

interface ISpeechRecognition extends EventTarget {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  start(): void;
  stop(): void;
  onstart: (() => void) | null;
  onend: (() => void) | null;
  onerror: (() => void) | null;
  onresult: ((event: ISpeechRecognitionEvent) => void) | null;
}

interface ISpeechRecognitionEvent {
  results: { [index: number]: { [index: number]: { transcript: string } } };
}

import React, { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import styles from "./ChatBot.module.css";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Message {
  id: string;
  role: "user" | "bot";
  text: string;
  timestamp: Date;
}

interface HistoryEntry {
  role: "user" | "assistant";
  content: string;
}

// ─── LocalStorage helpers ─────────────────────────────────────────────────────

const STORAGE_KEY = "chatbot_history";
const MAX_HISTORY = 10; // 5 Q&A pairs (10 messages)

function loadHistory(): HistoryEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveHistory(history: HistoryEntry[]) {
  try {
    // Keep only latest MAX_HISTORY entries
    const trimmed = history.slice(-MAX_HISTORY);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
  } catch {
    // localStorage may not be available in SSR; ignore
  }
}

// ─── Audio helpers ────────────────────────────────────────────────────────────

async function playStreamingAudio(response: Response) {
  if (!response.body) return;

  // Progressive streaming via MediaSource — audio plays as soon as first chunk arrives
  const mimeType = "audio/mpeg";
  const supportsMediaSource =
    typeof MediaSource !== "undefined" && MediaSource.isTypeSupported(mimeType);

  if (supportsMediaSource) {
    const mediaSource = new MediaSource();
    const audio = new Audio();
    const objectUrl = URL.createObjectURL(mediaSource);
    audio.src = objectUrl;

    await new Promise<void>((resolve) => {
      mediaSource.addEventListener("sourceopen", () => resolve(), { once: true });
    });

    const sourceBuffer = mediaSource.addSourceBuffer(mimeType);
    const reader = response.body.getReader();

    const waitForUpdateEnd = () =>
      new Promise<void>((resolve) => {
        if (!sourceBuffer.updating) return resolve();
        sourceBuffer.addEventListener("updateend", () => resolve(), { once: true });
      });

    let started = false;
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        await waitForUpdateEnd();
        sourceBuffer.appendBuffer(value);
        // Start playback as soon as first chunk is buffered
        if (!started) {
          started = true;
          await audio.play().catch(() => {});
        }
      }
      await waitForUpdateEnd();
      mediaSource.endOfStream();
    } catch (e) {
      console.error("Streaming playback error:", e);
      try { mediaSource.endOfStream("decode"); } catch { /* ignore */ }
    } finally {
      audio.onended = () => URL.revokeObjectURL(objectUrl);
    }
  } else {
    // Fallback: buffer everything (Safari / older browsers)
    try {
      const arrayBuffer = await response.arrayBuffer();
      const blob = new Blob([arrayBuffer], { type: "audio/mpeg" });
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audio.play();
      audio.onended = () => URL.revokeObjectURL(url);
    } catch (e) {
      console.error("Audio playback failed:", e);
    }
  }
}

// ─── Markdown-lite formatter ─────────────────────────────────────────────────
// Handles: **bold**, *italic*, \n newlines, and - bullet lists

function formatMessage(text: string): React.ReactNode[] {
  const lines = text.split("\n");
  return lines.map((line, lineIdx) => {
    // Detect bullet lines (- item or * item)
    const isBullet = /^[\-\*]\s+/.test(line);
    const content = isBullet ? line.replace(/^[\-\*]\s+/, "") : line;

    // Parse inline bold/italic within the line
    const parts: React.ReactNode[] = [];
    const regex = /\*\*(.+?)\*\*|\*(.+?)\*/g;
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = regex.exec(content)) !== null) {
      if (match.index > lastIndex) {
        parts.push(content.slice(lastIndex, match.index));
      }
      if (match[1] !== undefined) {
        // **bold**
        parts.push(<strong key={`b-${lineIdx}-${match.index}`}>{match[1]}</strong>);
      } else if (match[2] !== undefined) {
        // *italic*
        parts.push(<em key={`i-${lineIdx}-${match.index}`}>{match[2]}</em>);
      }
      lastIndex = regex.lastIndex;
    }
    if (lastIndex < content.length) {
      parts.push(content.slice(lastIndex));
    }

    if (isBullet) {
      return (
        <div key={lineIdx} style={{ display: "flex", gap: "6px", margin: "1px 0" }}>
          <span style={{ opacity: 0.6, flexShrink: 0 }}>•</span>
          <span>{parts}</span>
        </div>
      );
    }

    // Empty line → spacer
    if (parts.length === 0 || (parts.length === 1 && parts[0] === "")) {
      return <br key={lineIdx} />;
    }

    return <span key={lineIdx} style={{ display: "block" }}>{parts}</span>;
  });
}

// ─── Initial greeting ─────────────────────────────────────────────────────────

const INITIAL_MESSAGES: Message[] = [
  {
    id: "1",
    role: "bot",
    text: "Hey there! 👋 I'm Arpan's AI assistant. Ask me anything about his skills, projects, or experience!",
    timestamp: new Date(),
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showBubble, setShowBubble] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<ISpeechRecognition | null>(null);
  const historyRef = useRef<HistoryEntry[]>([]);

  // Load history from localStorage on mount
  useEffect(() => {
    historyRef.current = loadHistory();
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
      setShowBubble(false);
    }
  }, [isOpen]);

  // Show bubble periodically
  useEffect(() => {
    const hideTimer = setTimeout(() => setShowBubble(false), 8000);
    const showInterval = setInterval(() => {
      if (!isOpen) setShowBubble(true);
      setTimeout(() => setShowBubble(false), 4000);
    }, 15000);
    return () => {
      clearTimeout(hideTimer);
      clearInterval(showInterval);
    };
  }, [isOpen]);

  // ── TTS: speak a bot reply via Sarvam ──────────────────────────────────────

  const speakWithSarvam = useCallback(async (text: string) => {
    setIsSpeaking(true);
    try {
      const res = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      // The TTS route now streams raw MP3 binary — play it directly
      if (!res.ok) return;
      await playStreamingAudio(res);
    } catch (e) {
      console.error("TTS error:", e);
    } finally {
      setIsSpeaking(false);
    }
  }, []);

  // ── Core send message (calls Ollama LLM) ──────────────────────────────────

  const sendMessage = useCallback(
    async (text: string, shouldSpeak = false) => {
      if (!text.trim() || isTyping) return;

      const userMsg: Message = {
        id: Date.now().toString(),
        role: "user",
        text: text.trim(),
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMsg]);
      setInputText("");
      setIsTyping(true);

      // Append to history
      const userEntry: HistoryEntry = { role: "user", content: text.trim() };
      const updatedHistory = [...historyRef.current, userEntry];

      let botReply = "";

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: text.trim(),
            history: updatedHistory.slice(-MAX_HISTORY),
          }),
        });

        if (!res.ok || !res.body) {
          // Non-streaming error path — parse JSON error message
          const err = await res.json().catch(() => ({ error: "Unknown error" }));
          botReply = err.error || "Sorry, I couldn't get a response right now.";
        } else {
          // Consume the plain-text stream from Ollama
          const reader = res.body.getReader();
          const decoder = new TextDecoder();
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            botReply += decoder.decode(value, { stream: true });
          }
          botReply = botReply.trim() || "Sorry, I couldn't get a response right now.";
        }
      } catch (e) {
        console.error("Chat error:", e);
        botReply = "⚠️ I'm having trouble connecting. Please check the server and try again.";
      }

      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "bot",
        text: botReply,
        timestamp: new Date(),
      };

      // Save full history (user + bot)
      const assistantEntry: HistoryEntry = { role: "assistant", content: botReply };
      historyRef.current = [...updatedHistory, assistantEntry].slice(-MAX_HISTORY);
      saveHistory(historyRef.current);

      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);

      // Voice-triggered messages always get a spoken reply via Sarvam TTS
      if (shouldSpeak) {
        speakWithSarvam(botReply);
      }
    },
    [isTyping, speakWithSarvam]
  );

  // ── Speak greeting on first open ──────────────────────────────────────────

  const hasSpokenGreetingRef = useRef(false);

  useEffect(() => {
    if (isOpen && !hasSpokenGreetingRef.current) {
      hasSpokenGreetingRef.current = true;
      speakWithSarvam(INITIAL_MESSAGES[0].text);
    }
  }, [isOpen, speakWithSarvam]);

  // ── Voice: browser Web Speech API → on result, send + speak ─────────────

  const startListening = () => {
    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
      alert("Speech recognition is not supported in your browser.");
      return;
    }
    const SRAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SRAPI();
    recognitionRef.current = recognition;
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);
    recognition.onresult = (event: ISpeechRecognitionEvent) => {
      const transcript = event.results[0][0].transcript;
      sendMessage(transcript, true); // always speak the bot reply for voice input
    };
    recognition.start();
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
    setIsListening(false);
  };

  const handleVoiceClick = () => {
    isListening ? stopListening() : startListening();
  };

  // ── Clear history ─────────────────────────────────────────────────────────

  const clearHistory = () => {
    historyRef.current = [];
    localStorage.removeItem(STORAGE_KEY);
    setMessages(INITIAL_MESSAGES);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") sendMessage(inputText);
  };

  const formatTime = (date: Date) =>
    date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <>
      {/* Chatbot Trigger Button */}
      <div className={styles.chatbotWrapper}>
        {showBubble && !isOpen && (
          <div className={styles.bubble}>
            <span>Ask me!</span>
            <div className={styles.bubbleTail} />
          </div>
        )}

        <button
          className={`${styles.botButton} ${isOpen ? styles.botButtonOpen : styles.bouncing}`}
          onClick={() => setIsOpen((o) => !o)}
          aria-label="Open chat"
          id="chatbot-trigger"
        >
          <Image
            src="/botPic.png"
            alt="Chat Bot"
            width={64}
            height={64}
            className={styles.botImage}
            priority
          />
          {!isOpen && <span className={styles.onlineDot} />}
        </button>
      </div>

      {/* Chat Window */}
      <div className={`${styles.chatWindow} ${isOpen ? styles.chatWindowOpen : ""} ${isExpanded ? styles.chatWindowExpanded : ""}`}>

        {/* Header */}
        <div className={styles.chatHeader}>
          <div className={styles.headerLeft}>
            <div className={styles.headerAvatar}>
              <Image
                src="/botPic.png"
                alt="Bot"
                width={36}
                height={36}
                className={styles.headerAvatarImg}
              />
              <span className={styles.headerOnlineDot} />
            </div>
            <div>
              <p className={styles.headerName}>Arpan&apos;s AI</p>
              <p className={styles.headerStatus}>
                {isTyping ? (
                  <span className={styles.typingStatus}>typing...</span>
                ) : isSpeaking ? (
                  <span className={styles.typingStatus}>speaking...</span>
                ) : (
                  "Online · Ollama LLM"
                )}
              </p>
            </div>
          </div>

          <div className={styles.headerActions}>
            {/* Expand / Collapse */}
            <button
              className={styles.expandBtn}
              onClick={() => setIsExpanded((v) => !v)}
              title={isExpanded ? "Collapse" : "Expand"}
              id="chatbot-expand"
            >
              {isExpanded ? (
                /* Collapse icon — two inward arrows */
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <polyline points="4 14 10 14 10 20" />
                  <polyline points="20 10 14 10 14 4" />
                  <line x1="10" y1="14" x2="3" y2="21" />
                  <line x1="21" y1="3" x2="14" y2="10" />
                </svg>
              ) : (
                /* Expand icon — two outward arrows */
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <polyline points="15 3 21 3 21 9" />
                  <polyline points="9 21 3 21 3 15" />
                  <line x1="21" y1="3" x2="14" y2="10" />
                  <line x1="3" y1="21" x2="10" y2="14" />
                </svg>
              )}
            </button>

            {/* Clear history */}
            <button
              className={styles.clearBtn}
              onClick={clearHistory}
              title="Clear chat history"
              id="chatbot-clear"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6l-1 14H6L5 6" />
                <path d="M10 11v6M14 11v6" />
                <path d="M9 6V4h6v2" />
              </svg>
            </button>

            {/* Close */}
            <button
              className={styles.closeBtn}
              onClick={() => setIsOpen(false)}
              aria-label="Close chat"
              id="chatbot-close"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>

        {/* History badge */}
        {historyRef.current.length > 0 && (
          <div className={styles.historyBadge}>
            💾 {Math.floor(historyRef.current.length / 2)} past Q&amp;A(s) loaded as context
          </div>
        )}

        {/* Messages */}
        <div className={styles.messagesArea}>
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`${styles.messageRow} ${msg.role === "user" ? styles.messageRowUser : styles.messageRowBot}`}
            >
              {msg.role === "bot" && (
                <div className={styles.msgAvatar}>
                  <Image src="/botPic.png" alt="Bot" width={28} height={28} className={styles.msgAvatarImg} />
                </div>
              )}
              <div className={`${styles.messageBubble} ${msg.role === "user" ? styles.userBubble : styles.botBubble}`}>
                {msg.role === "bot" ? (
                  <div className={styles.messageText}>{formatMessage(msg.text)}</div>
                ) : (
                  <p className={styles.messageText}>{msg.text}</p>
                )}
                <span className={styles.messageTime}>{formatTime(msg.timestamp)}</span>
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className={`${styles.messageRow} ${styles.messageRowBot}`}>
              <div className={styles.msgAvatar}>
                <Image src="/botPic.png" alt="Bot" width={28} height={28} className={styles.msgAvatarImg} />
              </div>
              <div className={`${styles.messageBubble} ${styles.botBubble} ${styles.typingBubble}`}>
                <span className={styles.dot} />
                <span className={styles.dot} />
                <span className={styles.dot} />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Replies */}
        <div className={styles.quickReplies}>
          {["Skills", "Projects", "Experience", "Contact"].map((q) => (
            <button
              key={q}
              className={styles.quickBtn}
              onClick={() => sendMessage(q)}
              id={`quick-${q.toLowerCase()}`}
              disabled={isTyping}
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input Area */}
        <div className={styles.inputArea}>
          <input
            ref={inputRef}
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isListening ? "Listening…" : "Type a message…"}
            className={styles.textInput}
            id="chatbot-input"
            aria-label="Chat message input"
            disabled={isTyping}
          />

          {/* Voice button */}
          <button
            className={`${styles.voiceBtn} ${isListening ? styles.voiceBtnActive : ""}`}
            onClick={handleVoiceClick}
            aria-label={isListening ? "Stop listening" : "Start voice input"}
            id="chatbot-voice"
            disabled={isTyping}
          >
            {isListening ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <rect x="5" y="5" width="14" height="14" rx="2" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <rect x="9" y="2" width="6" height="13" rx="3" />
                <path d="M5 10a7 7 0 0 0 14 0" />
                <line x1="12" y1="20" x2="12" y2="23" />
                <line x1="8" y1="23" x2="16" y2="23" />
              </svg>
            )}
          </button>

          {/* Send button */}
          <button
            className={styles.sendBtn}
            onClick={() => sendMessage(inputText)}
            disabled={!inputText.trim() || isTyping}
            aria-label="Send message"
            id="chatbot-send"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </div>

      </div>
    </>
  );
}
