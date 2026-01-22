import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";

export default function ProChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    {
      sender: "ai",
      text: "Hi 👋 I’m **BanoQabil AI**. Ask me anything about courses, campuses, admissions, or programs.",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const inputRef = useRef(null);
  const messagesEndRef = useRef(null);

  const WHATSAPP_URL = "https://wa.me/03178226242";

  // Scroll auto
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Notification timer
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
    setMessages((prev) => [...prev, { sender: "user", text: userMessage }]);
    setMessage("");
    setLoading(true);

    try {
      const res = await fetch("/.netlify/functions/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { sender: "ai", text: data.reply }]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: "Sorry, I’m having trouble connecting right now. Would you like to contact our support team on WhatsApp?",
        },
      ]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans flex flex-col items-end">
      {/* Floating Button Container */}
      <div className="relative">
        {/* Notification outside button */}
        <AnimatePresence>
          {showNotification && !isOpen && (
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="absolute -left-28 top-1/2 -translate-y-1/2 bg-white text-blue-600 text-[10px] font-semibold rounded-full px-2 py-1 shadow-lg select-none"
            >
              Need help?
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Floating Button */}
        {!isOpen && (
          <motion.button
            onClick={() => setIsOpen(true)}
            whileHover={{ scale: 1.2, boxShadow: "0 0 30px #7C3AEDAA" }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-blue-600 to-purple-600 w-16 h-16 rounded-full shadow-xl flex items-center justify-center cursor-pointer border-2 border-white relative"
          >
            {/* Original Robot SVG */}
            <svg
              width="32px"
              height="32px"
              viewBox="0 0 24 24"
              fill="white"
              xmlns="http://www.w3.org/2000/svg"
            >
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
              <path
                d="M1 14C0.447715 14 0 14.4477 0 15V17C0 17.5523 0.447715 18 1 18C1.55228 18 2 17.5523 2 17V15C2 14.4477 1.55228 14 1 14Z"
                fill="white"
              />
              <path
                d="M22 15C22 14.4477 22.4477 14 23 14C23.5523 14 24 14.4477 24 15V17C24 17.5523 23.5523 18 23 18C22.4477 18 22 17.5523 22 17V15Z"
                fill="white"
              />
            </svg>
          </motion.button>
        )}
      </div>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="w-[380px] h-[560px] bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden border-2 border-blue-600 mt-4"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-3 flex justify-between items-center rounded-t-3xl font-montserrat select-none">
              <div>
                <div className="font-bold leading-tight">BanoQabil AI</div>
                <div className="text-xs opacity-90">
                  Official Program Assistant
                </div>
              </div>
              <motion.button
                onClick={() => setIsOpen(false)}
                whileHover={{ rotate: 15, scale: 1.2 }}
                className="text-lg transition-transform"
              >
                ✕
              </motion.button>
            </div>

            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-gray-50">
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className={`max-w-[82%] px-4 py-2 rounded-2xl text-sm leading-relaxed shadow-sm font-inter ${
                    msg.sender === "user"
                      ? "ml-auto bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                      : "bg-white text-gray-900"
                  }`}
                >
                  <ReactMarkdown
                    components={{
                      p: ({ children }) => <span>{children}</span>,
                      li: ({ children }) => (
                        <li className="ml-4 list-disc">{children}</li>
                      ),
                      strong: ({ children }) => (
                        <strong className="font-semibold text-blue-600">
                          {children}
                        </strong>
                      ),
                    }}
                  >
                    {msg.text}
                  </ReactMarkdown>
                </motion.div>
              ))}

              {loading && (
                <div className="max-w-[60%] px-4 py-2 rounded-2xl bg-white shadow-sm text-gray-500 text-sm flex items-center gap-2 font-inter">
                  <span>Typing</span>
                  <div className="flex gap-1">
                    <span className="dot" />
                    <span className="dot delay-1" />
                    <span className="dot delay-2" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-3 border-t bg-white flex gap-2">
              <textarea
                ref={inputRef}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={loading}
                placeholder="Ask about BanoQabil.pk..."
                className="flex-1 border rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 disabled:opacity-60 resize-none h-10 font-inter"
              />
              <motion.button
                onClick={sendMessage}
                whileHover={{ scale: 1.1, rotate: [0, 2, -2, 0] }}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-5 rounded-full text-sm font-inter hover:shadow-lg"
              >
                Send
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Typing dots */}
      <style>{`
        .dot {
          width: 6px;
          height: 6px;
          background: #2563EB;
          border-radius: 50%;
          animation: bounce-dot 1.4s infinite both;
        }
        .delay-1 { animation-delay: .2s }
        .delay-2 { animation-delay: .4s }
        @keyframes bounce-dot {
          0%, 100% { transform: translateY(0); opacity: 0.3 }
          50% { transform: translateY(-6px); opacity: 1 }
        }
      `}</style>
    </div>
  );
}
