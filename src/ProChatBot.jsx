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
      return "bg-purple-50 dark:bg-purple-900 border-purple-200 dark:border-purple-700 text-purple-950 dark:text-purple-200 shadow-[0_0_20px_rgba(147,51,234,0.25)]";
    if (mood === "hyped")
      return "bg-orange-50 dark:bg-orange-900 border-orange-200 dark:border-orange-700 text-orange-950 dark:text-orange-200 shadow-[0_0_20px_rgba(249,115,22,0.25)]";
    return "bg-white dark:bg-gray-700 border-gray-100 dark:border-gray-600 text-gray-800 dark:text-gray-200";
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans flex flex-col items-end">
      <AnimatePresence>
        {showNotification && !isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.9 }}
            className="mb-3 bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 text-[12px] font-bold rounded-2xl px-4 py-2 shadow-2xl border border-blue-50 dark:border-blue-700 mr-2"
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
            className="w-[90vw] max-w-[340px] h-[500px] bg-white dark:bg-gray-800 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.15)] flex flex-col overflow-hidden border border-gray-100 dark:border-gray-700 mb-4"
          >
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-5 py-4 flex justify-between items-center">
              <div>
                <div className="font-bold text-[15px] leading-none">
                  BanoQabil AI
                </div>
                <div className="flex items-center gap-1.5 mt-1.5">
                  <span
                    className={`w-2 h-2 rounded-full animate-pulse ${
                      currentMood === "hyped"
                        ? "bg-orange-300 dark:bg-orange-500"
                        : currentMood === "empathy"
                        ? "bg-purple-300 dark:bg-purple-500"
                        : "bg-green-400 dark:bg-green-500"
                    }`}
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

            <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-gray-50 dark:bg-gray-900">
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex flex-col ${
                    msg.sender === "user" ? "items-end" : "items-start"
                  }`}
                >
                  <div
                    className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-[13px] shadow-sm ${
                      msg.sender === "user"
                        ? "bg-blue-600 text-white rounded-br-none"
                        : `rounded-bl-none border ${getMoodStyles(msg.mood)}`
                    }`}
                  >
                    <ReactMarkdown
                      components={{
                        p: ({ children }) => (
                          <p className="m-0 leading-relaxed">{children}</p>
                        ),
                        strong: ({ children }) => (
                          <strong className="font-bold text-blue-700 dark:text-blue-300">
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
                        Chat on WhatsApp
                      </motion.a>
                    )}
                </motion.div>
              ))}

              {showRoadmap && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-4 bg-white dark:bg-gray-700 rounded-2xl border-t-4 border-blue-600 shadow-xl my-2 border border-gray-100 dark:border-gray-600"
                >
                  <div className="flex justify-between">
                    <h4 className="font-bold text-blue-800 dark:text-blue-300 text-[13px]">
                      🚀 Success Roadmap
                    </h4>
                    <button
                      onClick={() => setShowRoadmap(false)}
                      className="text-gray-400 dark:text-gray-300 hover:text-gray-600"
                    >
                      ✕
                    </button>
                  </div>
                  <div className="text-[11px] mt-2 space-y-2 text-gray-700 dark:text-gray-200">
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
                  <div className="bg-white dark:bg-gray-700 border border-gray-100 dark:border-gray-600 px-4 py-3 rounded-2xl flex gap-1.5 shadow-sm">
                    <span className="dot" />
                    <span className="dot delay-1" />
                    <span className="dot delay-2" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-3 bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 flex gap-2 items-center">
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
                className="flex-1 bg-gray-50 dark:bg-gray-700 border-none rounded-xl px-4 py-2 text-[13px] text-gray-900 dark:text-gray-100 outline-none resize-none"
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
              d="M12 1C10.8954 1 10 1.89543 10 3C10 3.74028 10.4022 4.38663 11 4.73244V7H6C4.34315 7 3 8.34315 3 10V20C3 21.6569 4.34315 23 6 23H18C19.6569 23 21 21.6569 21 20V10C21 8.34315 19.6569 7 18 7H13V4.73244C13.5978 4.38663 14 3.74028 14 3C14 1.89543 13.1046 1 12 1Z"
              fill="white"
            />
          </svg>
        </motion.button>
      )}

      <style>{`
        .dot { width: 5px; height: 5px; background: #2563EB; border-radius: 50%; animation: dot-bounce 1.4s infinite ease-in-out both; }
        .delay-1 { animation-delay: 0.2s } 
        .delay-2 { animation-delay: 0.4s }
        @keyframes dot-bounce { 0%, 80%, 100% { transform: scale(0); opacity: 0.3 } 40% { transform: scale(1); opacity: 1 } }
      `}</style>
    </div>
  );
}
