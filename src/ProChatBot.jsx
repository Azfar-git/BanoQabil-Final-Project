import { useState, useRef, useEffect } from "react";
//eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { auth } from "./firebase/config";
import { getUserRole } from "./firebase/getUserRole";

export default function ProChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [userRole, setUserRole] = useState("guest");
  const [currentMood, setCurrentMood] = useState("default");
  const [showRoadmap, setShowRoadmap] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: "ai",
      text: "Hi 👋 I’m **BanoQabil AI**. Ask me anything about Bano Qabil 5.0 courses, campuses, or admissions!",
      mood: "default",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const inputRef = useRef(null);
  const messagesEndRef = useRef(null);

  const WHATSAPP_URL = "https://wa.me/923178226242";

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          const role = await getUserRole(user.uid);
          setUserRole(role || "user");
        } catch (error) {
          console.error("Role fetch error:", error);
          setUserRole("user");
        }
      } else {
        setUserRole("guest");
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  useEffect(() => {
    const timer = setInterval(() => {
      if (!isOpen) {
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 3000);
      }
    }, 15000);
    return () => clearInterval(timer);
  }, [isOpen]);

  const sendMessage = async () => {
    if (!message.trim() || loading) return;

    const userMessage = message;

    const newHistory = [...messages, { sender: "user", text: userMessage }];
    setMessages(newHistory);
    setMessage("");
    setLoading(true);

    try {
      const res = await fetch("/.netlify/functions/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage,
          role: userRole,
          history: messages,
          userName: auth.currentUser?.displayName,
          userId: auth.currentUser?.uid || "Guest",
        }),
      });

      const data = await res.json();
      let botReply = data.reply;

      let detectedMood = "default";
      if (botReply.includes("[MOOD:EMPATHY]")) {
        detectedMood = "empathy";
        botReply = botReply.replace("[MOOD:EMPATHY]", "");
      } else if (botReply.includes("[MOOD:HYPED]")) {
        detectedMood = "hyped";
        botReply = botReply.replace("[MOOD:HYPED]", "");
      }

      setCurrentMood(detectedMood);

      if (botReply.includes("[COMMAND:ROADMAP]")) {
        setShowRoadmap(true);
        botReply = botReply.replace("[COMMAND:ROADMAP]", "");
      }

      setMessages((prev) => [
        ...prev,
        { sender: "ai", text: botReply, mood: detectedMood },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: `Error connecting. [Contact Support](${WHATSAPP_URL})`,
          mood: "default",
        },
      ]);
    } finally {
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const getMoodStyles = (mood) => {
    if (mood === "empathy")
      return "bg-purple-50 border-purple-200 shadow-[0_0_20px_rgba(147,51,234,0.25)] text-purple-950";
    if (mood === "hyped")
      return "bg-orange-50 border-orange-200 shadow-[0_0_20px_rgba(249,115,22,0.25)] text-orange-950";
    return "bg-white border-gray-100 text-gray-800";
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans flex flex-col items-end">
      <AnimatePresence>
        {showNotification && !isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.9 }}
            className="mb-3 bg-white text-blue-600 text-[12px] font-bold rounded-2xl px-4 py-2 shadow-2xl border border-blue-50 mr-2"
          >
            Need help? ✋
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.7,
              y: 50,
              transformOrigin: "bottom right",
            }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{
              opacity: 0,
              scale: 0.7,
              y: 50,
              transition: { duration: 0.2 },
            }}
            transition={{ type: "spring", stiffness: 260, damping: 25 }}
            className="w-[90vw] max-w-[340px] h-[500px] bg-white rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.15)] flex flex-col overflow-hidden border border-gray-100 mb-4"
          >
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-5 py-4 flex justify-between items-center">
              <div>
                <div className="font-bold text-[15px] leading-none">
                  BanoQabil AI
                </div>
                <div className="flex items-center gap-1.5 mt-1.5">
                  <span
                    className={`w-2 h-2 rounded-full animate-pulse ${currentMood === "hyped" ? "bg-orange-300" : currentMood === "empathy" ? "bg-purple-300" : "bg-green-400"}`}
                  />
                  <span className="text-[10px] opacity-90 uppercase tracking-widest font-semibold">
                    {userRole === "student"
                      ? "Student Mentor"
                      : "Online Assistant"}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="bg-white/10 hover:bg-white/20 p-1.5 rounded-full"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                >
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-[#f9fafb]">
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
                >
                  <div
                    className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-[13px] shadow-sm ${msg.sender === "user" ? "bg-blue-600 text-white rounded-br-none" : `rounded-bl-none border ${getMoodStyles(msg.mood)}`}`}
                  >
                    <ReactMarkdown
                      components={{
                        p: ({ children }) => (
                          <p className="m-0 leading-relaxed">{children}</p>
                        ),
                        strong: ({ children }) => (
                          <strong className="font-bold text-blue-700">
                            {children}
                          </strong>
                        ),
                        a: ({ href, children }) => {
                          if (href?.includes("wa.me")) return null;
                          return (
                            <a
                              href={href}
                              target="_blank"
                              rel="noreferrer"
                              className="underline font-bold text-inherit"
                            >
                              {children}
                            </a>
                          );
                        },
                      }}
                    >
                      {msg.text}
                    </ReactMarkdown>
                  </div>

                  {msg.sender === "ai" &&
                    (msg.text.includes("wa.me") ||
                      msg.text.includes("[Contact Support]")) && (
                      <motion.a
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        href={WHATSAPP_URL}
                        target="_blank"
                        className="mt-2 flex items-center gap-2 bg-[#25D366] text-white text-[12px] font-bold py-2 px-4 rounded-xl shadow-lg hover:scale-105 transition-all w-fit"
                      >
                        <svg
                          width="14"
                          height="14"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                        </svg>
                        Chat on WhatsApp
                      </motion.a>
                    )}
                </motion.div>
              ))}

              {showRoadmap && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-4 bg-white rounded-2xl border-t-4 border-blue-600 shadow-xl my-2 border border-gray-100"
                >
                  <div className="flex justify-between">
                    <h4 className="font-bold text-blue-800 text-[13px]">
                      🚀 Success Roadmap
                    </h4>
                    <button
                      onClick={() => setShowRoadmap(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      ✕
                    </button>
                  </div>
                  <div className="text-[11px] mt-2 space-y-2 text-gray-700">
                    <p>
                      <b>1.</b> Register & Clear Aptitude Test.
                    </p>
                    <p>
                      <b>2.</b> 3-Month Training (AI Integrated).
                    </p>
                    <p>
                      <b>3.</b> Refund & Job Placement.
                    </p>
                  </div>
                </motion.div>
              )}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-white border border-gray-100 px-4 py-3 rounded-2xl flex gap-1.5 shadow-sm">
                    <span className="dot" />
                    <span className="dot delay-1" />
                    <span className="dot delay-2" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-3 bg-white border-t border-gray-100 flex gap-2 items-center">
              <textarea
                ref={inputRef}
                rows="1"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={
                  userRole === "student"
                    ? "Ask your mentor..."
                    : "Ask me anything..."
                }
                className="flex-1 bg-gray-50 border-none rounded-xl px-4 py-2 text-[13px] outline-none resize-none"
              />
              <button
                onClick={sendMessage}
                className="bg-blue-600 text-white p-2.5 rounded-xl active:scale-95 transition-all shadow-md"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!isOpen && (
        <motion.button
          layoutId="chat-toggle"
          onClick={() => setIsOpen(true)}
          whileHover={{ scale: 1.05, rotate: 5 }}
          whileTap={{ scale: 0.95 }}
          className="bg-gradient-to-r from-blue-600 to-purple-600 w-16 h-16 rounded-full shadow-2xl flex items-center justify-center cursor-pointer border-2 border-white"
        >
          <svg width="32px" height="32px" viewBox="0 0 24 24" fill="white">
            <path
              d="M9 15C8.44771 15 8 15.4477 8 16C8 16.5523 8.44771 17 9 17C9.55229 17 10 16.5523 10 16C10 15.4477 9.55229 15 9 15Z"
              fill="white"
            />
            <path
              d="M14 16C14 15.4477 14.4477 15 15 15C15.5523 15 16 15.4477 16 16C16 16.5523 15.5523 17 15 17C14.4477 17 14 16.5523 14 16Z"
              fill="white"
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M12 1C10.8954 1 10 1.89543 10 3C10 3.74028 10.4022 4.38663 11 4.73244V7H6C4.34315 7 3 8.34315 3 10V20C3 21.6569 4.34315 23 6 23H18C19.6569 23 21 21.6569 21 20V10C21 8.34315 19.6569 7 18 7H13V4.73244C13.5978 4.38663 14 3.74028 14 3C14 1.89543 13.1046 1 12 1ZM5 10C5 9.44772 5.44772 9 6 9H7.38197L8.82918 11.8944C9.16796 12.572 9.86049 13 10.618 13H13.382C14.1395 13 14.832 12.572 15.1708 11.8944L16.618 9H18C18.5523 9 19 9.44772 19 10V20C19 20.5523 18.5523 21 18 21H6C5.44772 21 5 20.5523 5 20V10ZM13.382 11L14.382 9H9.61803L10.618 11H13.382Z"
              fill="white"
            />
          </svg>
        </motion.button>
      )}

      <style>{`
        .dot { width: 5px; height: 5px; background: #2563EB; border-radius: 50%; animation: dot-bounce 1.4s infinite ease-in-out both; }
        .delay-1 { animation-delay: 0.2s } .delay-2 { animation-delay: 0.4s }
        @keyframes dot-bounce { 0%, 80%, 100% { transform: scale(0); opacity: 0.3 } 40% { transform: scale(1); opacity: 1 } }
      `}</style>
    </div>
  );
}
