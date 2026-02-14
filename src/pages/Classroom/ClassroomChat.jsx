import React, { useState, useRef, useEffect, useMemo } from "react";
import { useClassroom } from "./Classroom";
import {
  Send,
  Edit2,
  Trash2,
  AlertTriangle,
  MoreVertical,
  X,
  Check
} from "lucide-react";
import { db } from "../../firebase/config";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";

// --- Constants & Helpers ---

const PROFANITY_LIST = [
  "badword1", "badword2", "spam", "offensive", "dumb", "stupid",
  "idiot", "hate", "kill", "fuck", "shit", "ass", "bitch",
  "cunt", "dick", "pussy", "whore", "slut", "nigger", "faggot",
];

const getInitials = (name) => {
  if (!name) return "?";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();
};

const formatTime = (timestamp) => {
  if (!timestamp?.toDate) return "Just now";
  return timestamp.toDate().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
};

// --- Sub-Components ---

// 1. Custom Modal
const Modal = ({ isOpen, type, title, message, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-sm w-full p-6 border border-gray-100 dark:border-gray-700">
        <div className="flex flex-col items-center text-center gap-4">
          <div className={`p-3 rounded-full ${type === 'danger' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
            {type === 'danger' ? <Trash2 size={24} /> : <AlertTriangle size={24} />}
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">{title}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 leading-relaxed">{message}</p>
          </div>
          <div className="flex gap-3 w-full mt-2">
            <button
              onClick={onCancel}
              className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 dark:bg-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className={`flex-1 px-4 py-2.5 text-sm font-medium text-white rounded-xl transition-colors shadow-lg ${
                type === 'danger' 
                  ? 'bg-red-500 hover:bg-red-600 shadow-red-500/30' 
                  : 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/30'
              }`}
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// 2. Avatar Component
const UserAvatar = ({ name, role, isOwn }) => {
  const initials = getInitials(name);
  const bgClass = isOwn
    ? "bg-blue-600"
    : role === "teacher"
    ? "bg-orange-500"
    : "bg-gray-500";

  return (
    <div
      className={`w-8 h-8 rounded-full ${bgClass} flex items-center justify-center text-white text-xs font-bold shadow-md ring-2 ring-white dark:ring-gray-800 shrink-0 select-none`}
      title={role}
    >
      {initials}
    </div>
  );
};

// --- Main Component ---

const ClassroomChat = () => {
  const { messages, mockUser, theme, classId, handlers } = useClassroom();
  
  // State
  const [newMessage, setNewMessage] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const [isSending, setIsSending] = useState(false);
  
  // Modal State
  const [modal, setModal] = useState({ isOpen: false, type: 'info', title: '', message: '', onConfirm: () => {} });

  // Refs
  const messagesEndRef = useRef(null);
  const isTeacher = mockUser.role === "teacher";

  // Auto-scroll on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  // --- Logic Helpers ---

  const openModal = (title, message, onConfirm, type = 'info') => {
    setModal({
      isOpen: true,
      title,
      message,
      type,
      onConfirm: () => {
        onConfirm();
        setModal({ isOpen: false });
      },
    });
  };

  const closeModal = () => setModal({ ...modal, isOpen: false });

  // Memoized Profanity Filter
  const filterProfanity = useMemo(() => (text) => {
    let filtered = text;
    PROFANITY_LIST.forEach((word) => {
      const regex = new RegExp(`\\b${word}\\b`, "gi");
      filtered = filtered.replace(regex, "*".repeat(word.length));
    });
    return filtered;
  }, []);

  // --- Handlers ---

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || isSending) return;

    setIsSending(true);
    try {
      const filteredText = filterProfanity(newMessage.trim());
      // Pass empty array for attachments since we removed image logic
      await handlers.onSendMessage(filteredText, []); 
      setNewMessage("");
    } catch (error) {
      console.error(error);
      // We don't use the modal here for speed, just a quick alert or silent fail is often better for chat,
      // but let's be safe:
      alert("Failed to send message. Please check your connection.");
    } finally {
      setIsSending(false);
    }
  };

  const handleStartEdit = (msg) => {
    setEditingId(msg.id);
    setEditText(msg.text);
  };

  const handleSaveEdit = async (msgId) => {
    if (!editText.trim()) return;
    try {
      const msgRef = doc(db, "classes", classId, "chat", msgId);
      await updateDoc(msgRef, {
        text: filterProfanity(editText.trim()),
        edited: true,
        editedAt: new Date().toISOString(),
      });
      setEditingId(null);
    } catch (err) {
      console.error("Edit failed", err);
      openModal("Error", "Could not save your changes.", () => {}, 'danger');
    }
  };

  const handleDelete = (msgId) => {
    openModal(
      "Delete Message", 
      "Are you sure? This message will be permanently removed for everyone.", 
      async () => {
        try {
          await deleteDoc(doc(db, "classes", classId, "chat", msgId));
        } catch (err) {
          console.error("Delete failed", err);
        }
      },
      'danger'
    );
  };

  return (
    <div className={`relative rounded-3xl border ${theme.surface} ${theme.border} flex flex-col h-[75vh] overflow-hidden shadow-2xl`}>
      
      {/* Modal Overlay */}
      <Modal {...modal} onCancel={closeModal} />

      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md sticky top-0 z-10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-bold tracking-tight text-gray-800 dark:text-gray-100">Class Discussion</h3>
          <span className="px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-xs font-bold border border-gray-200 dark:border-gray-700">
            {messages.length}
          </span>
        </div>
      </div>

      {/* Messages List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5 scroll-smooth">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-400 opacity-60">
            <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-full mb-3">
              <MoreVertical size={32} />
            </div>
            <p className="text-sm font-medium">No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((msg) => {
            const isOwn = msg.userId === mockUser.id;
            const isEditing = editingId === msg.id;

            return (
              <div key={msg.id} className={`flex items-end gap-3 group ${isOwn ? "flex-row-reverse" : ""}`}>
                {/* Avatar */}
                <UserAvatar name={msg.userName} role={msg.userRole} isOwn={isOwn} />

                <div className={`flex flex-col max-w-[80%] md:max-w-[70%] ${isOwn ? "items-end" : "items-start"}`}>
                  
                  {/* Name Label (for others) */}
                  {!isOwn && (
                    <span className="text-[10px] font-bold text-gray-500 mb-1 ml-1 flex items-center gap-2">
                      {msg.userName}
                      {msg.userRole === "teacher" && (
                        <span className="bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 px-1.5 py-0.5 rounded text-[9px] uppercase tracking-wider">Teacher</span>
                      )}
                    </span>
                  )}

                  {/* Message Bubble */}
                  <div className={`relative px-4 py-3 rounded-2xl shadow-sm text-sm transition-all ${
                    isOwn 
                      ? "bg-blue-600 text-white rounded-br-none" 
                      : "bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700 rounded-bl-none"
                  }`}>
                    
                    {isEditing ? (
                      <div className="min-w-[220px]">
                        <textarea
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          className="w-full bg-black/5 dark:bg-white/10 text-inherit rounded-lg p-2 text-sm outline-none resize-none mb-2 focus:ring-2 focus:ring-blue-400/50"
                          rows={2}
                          autoFocus
                        />
                        <div className="flex justify-end gap-2">
                          <button 
                            onClick={() => setEditingId(null)} 
                            className="p-1.5 rounded-md hover:bg-black/10 dark:hover:bg-white/10 transition"
                            title="Cancel"
                          >
                            <X size={14} />
                          </button>
                          <button 
                            onClick={() => handleSaveEdit(msg.id)} 
                            className="p-1.5 rounded-md bg-white/20 hover:bg-white/30 text-inherit transition font-bold"
                            title="Save"
                          >
                            <Check size={14} />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p className="whitespace-pre-wrap leading-relaxed break-words">{msg.text}</p>
                    )}
                  </div>

                  {/* Footer (Timestamp & Actions) */}
                  <div className="flex items-center gap-2 mt-1 px-1 h-4">
                     <span className="text-[10px] text-gray-400 font-medium select-none">
                      {formatTime(msg.timestamp)}
                      {msg.edited && " (edited)"}
                     </span>
                     
                     {/* Action Buttons */}
                     {(isOwn || isTeacher) && !isEditing && (
                       <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          {isOwn && (
                            <button 
                              onClick={() => handleStartEdit(msg)} 
                              className="text-gray-400 hover:text-blue-500 transition-colors"
                              title="Edit message"
                            >
                              <Edit2 size={12} />
                            </button>
                          )}
                          <button 
                            onClick={() => handleDelete(msg.id)} 
                            className="text-gray-400 hover:text-red-500 transition-colors"
                            title="Delete message"
                          >
                            <Trash2 size={12} />
                          </button>
                       </div>
                     )}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
        <form onSubmit={handleSubmit} className="flex items-end gap-2">
          <div className="flex-1 relative">
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => {
                 if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmit(e); }
              }}
              placeholder="Type your message..."
              className="w-full px-4 py-3.5 bg-gray-50 dark:bg-gray-800 border-none rounded-2xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:bg-white dark:focus:bg-gray-900 transition-all outline-none resize-none shadow-inner text-gray-800 dark:text-gray-100 placeholder:text-gray-400"
              rows={1}
              style={{ minHeight: '48px', maxHeight: '120px' }}
            />
          </div>

          <button
            type="submit"
            disabled={!newMessage.trim() || isSending}
            className={`p-3.5 rounded-2xl shadow-lg transition-all transform hover:scale-105 active:scale-95 ${
               newMessage.trim() && !isSending
                ? "bg-blue-600 text-white shadow-blue-500/25"
                : "bg-gray-200 dark:bg-gray-800 text-gray-400 cursor-not-allowed shadow-none"
            }`}
          >
            <Send size={20} className={isSending ? "opacity-0" : ""} />
            {isSending && (
              <div className="absolute inset-0 m-auto w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            )}
          </button>
        </form>
        
        {/* Helper Note */}
        <div className="text-center mt-2">
            <span className="text-[10px] text-gray-400">Press Enter to send • Shift + Enter for new line</span>
        </div>
      </div>
    </div>
  );
};

export default ClassroomChat;