import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  IconButton,
  Button,
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, Trash2, CheckCheck, Check, Inbox } from "lucide-react";
import { db } from "../../firebase/config";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  updateDoc,
  doc,
  deleteDoc,
  writeBatch,
} from "firebase/firestore";
import { useAuth } from "../../context/AuthContext";

export default function NotificationsPage() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDark, setIsDark] = useState(
    document.documentElement.classList.contains("dark"),
  );

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains("dark"));
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!user?.id) {
      setNotifications([]);
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, "notifications"),
      where("userId", "==", String(user.id)),
      orderBy("createdAt", "desc")
    );

    const unsub = onSnapshot(
      q,
      (snapshot) => {
        const notifs = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          timestamp: doc.data().createdAt?.toDate?.() || new Date(),
        }));
        setNotifications(notifs);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching notifications:", error);
        setLoading(false);
      }
    );

    return () => unsub();
  }, [user?.id]);

  const markAsRead = async (id) => {
    try {
      await updateDoc(doc(db, "notifications", id), { read: true });
    } catch (error) {
      console.error("Error marking as read:", error);
    }
  };

  const markAllAsRead = async () => {
    if (unreadCount === 0) return;
    const batch = writeBatch(db);
    notifications.forEach((notif) => {
      if (!notif.read) {
        batch.update(doc(db, "notifications", notif.id), { read: true });
      }
    });
    await batch.commit();
  };

  const deleteNotification = async (id) => {
    try {
      await deleteDoc(doc(db, "notifications", id));
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  const theme = {
    pageBg: isDark ? "!bg-gray-900" : "!bg-[#f8fafc]",
    textMain: isDark ? "!text-gray-100" : "!text-[#1e293b]",
    textMuted: isDark ? "!text-gray-400" : "!text-[#64748b]",
    btnSecondary: isDark
      ? "bg-gray-800 text-blue-400 border-gray-700 hover:bg-gray-700"
      : "bg-white text-[#2563eb] border-blue-100 hover:bg-blue-50",
  };

  if (loading) {
    return (
      <Box className={`min-h-screen p-6 ${theme.pageBg}`}>
        <Box className="max-w-3xl mx-auto text-center py-20">
          <Typography>Loading notifications...</Typography>
        </Box>
      </Box>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Box className={`min-h-screen p-6 transition-colors duration-300 ${theme.pageBg}`}>
        <Box className="max-w-3xl mx-auto">
          {/* Header */}
          <Box className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <Box>
              <div className="flex items-center gap-2 mb-1">
                <Bell size={20} className="text-[#2563eb]" />
                <span className="text-[10px] font-bold text-[#2563eb] uppercase tracking-[0.2em]">
                  Activity Center
                </span>
              </div>
              <Typography
                variant="h4"
                className={`font-extrabold tracking-tight ${theme.textMain}`}
              >
                Notifications
              </Typography>
              <Typography
                variant="body2"
                className={`mt-1 font-medium ${theme.textMuted}`}
              >
                You have{" "}
                <span className="text-[#2563eb] font-bold">{unreadCount}</span>{" "}
                unread messages
              </Typography>
            </Box>

            {unreadCount > 0 && (
              <Button
                onClick={markAllAsRead}
                startIcon={<CheckCheck size={18} />}
                className={`capitalize font-bold rounded-xl px-4 shadow-sm transition-all border ${theme.btnSecondary}`}
              >
                Mark all as read
              </Button>
            )}
          </Box>

          {/* Notifications List */}
          <Box className="space-y-3">
            <AnimatePresence mode="popLayout">
              {notifications.map((n, i) => (
                <motion.div
                  key={n.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: i * 0.05 }}
                  layout
                >
                  <Card
                    className={`rounded-2xl transition-all duration-300 border ${
                      !n.read
                        ? isDark
                          ? "!bg-blue-900/20 !border-blue-500/30 shadow-lg shadow-blue-900/10"
                          : "!bg-[#eff6ff] !border-[#3b82f6]/30 shadow-md shadow-blue-50"
                        : isDark
                          ? "!bg-gray-800 !border-gray-700"
                          : "!bg-white !border-slate-100"
                    }`}
                  >
                    <CardContent className="flex justify-between items-start p-5 !pb-5">
                      <Box className="flex gap-4">
                        <div
                          className={`mt-1.5 w-2.5 h-2.5 rounded-full shrink-0 ${
                            !n.read
                              ? "bg-blue-500 animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.5)]"
                              : isDark
                                ? "bg-gray-600"
                                : "bg-slate-200"
                          }`}
                        />

                        <Box>
                          <Typography
                            className={`font-bold tracking-tight text-sm md:text-base ${
                              !n.read
                                ? isDark
                                  ? "text-white"
                                  : "text-[#1e293b]"
                                : isDark
                                  ? "text-gray-400"
                                  : "text-[#64748b]"
                            }`}
                          >
                            {n.title}
                          </Typography>
                          <Typography
                            variant="body2"
                            className={`mt-1 leading-relaxed ${
                              !n.read
                                ? isDark
                                  ? "text-gray-200"
                                  : "text-slate-700"
                                : theme.textMuted
                            }`}
                          >
                            {n.message}
                          </Typography>
                          <Typography
                            className={`text-[10px] mt-3 font-bold uppercase tracking-wider ${
                              isDark ? "text-gray-500" : "text-slate-400"
                            }`}
                          >
                            {n.timestamp instanceof Date && !isNaN(n.timestamp)
                              ? n.timestamp.toLocaleString([], {
                                  month: "short",
                                  day: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })
                              : "Just now"}
                          </Typography>
                        </Box>
                      </Box>

                      <Box className="flex gap-1 ml-4">
                        {!n.read && (
                          <IconButton
                            size="small"
                            onClick={() => markAsRead(n.id)}
                            className={`rounded-lg transition-all ${
                              isDark
                                ? "text-blue-400 hover:bg-blue-500/10"
                                : "text-[#2563eb] hover:bg-blue-50"
                            }`}
                          >
                            <Check size={18} strokeWidth={3} />
                          </IconButton>
                        )}
                        <IconButton
                          size="small"
                          onClick={() => deleteNotification(n.id)}
                          className={`rounded-lg transition-all ${
                            isDark
                              ? "text-gray-500 hover:text-rose-400 hover:bg-rose-500/10"
                              : "text-slate-300 hover:text-rose-600 hover:bg-rose-50"
                          }`}
                        >
                          <Trash2 size={18} />
                        </IconButton>
                      </Box>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>

            {notifications.length === 0 && (
              <Box className="text-center py-20">
                <div
                  className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                    isDark ? "bg-gray-800" : "bg-slate-100"
                  }`}
                >
                  <Inbox
                    size={32}
                    className={isDark ? "text-gray-600" : "text-slate-300"}
                  />
                </div>
                <Typography className={`font-bold ${theme.textMain}`}>
                  Your inbox is empty
                </Typography>
                <Typography
                  variant="caption"
                  className={`uppercase tracking-widest mt-1 ${theme.textMuted}`}
                >
                  Check back later for updates
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </motion.div>
  );
}