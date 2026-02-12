import React from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  IconButton,
  Button,
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import { DUMMY_NOTIFICATIONS } from "../../data/dummyData";
import { Bell, Trash2, CheckCheck, Check, Inbox } from "lucide-react";

export default function NotificationsPage() {
  const [notifications, setNotifications] = React.useState(DUMMY_NOTIFICATIONS);

  const markAsRead = (id) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  const deleteNotification = (id) => {
    setNotifications(notifications.filter((n) => n.id !== id));
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Box className="min-h-screen bg-[#f8fafc] p-6">
        <Box className="max-w-3xl mx-auto">
          {/* Header Section */}
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
                className="font-extrabold text-[#1e293b] tracking-tight"
              >
                Notifications
              </Typography>
              <Typography
                variant="body2"
                className="text-[#64748b] mt-1 font-medium"
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
                className="bg-white text-[#2563eb] border border-blue-100 hover:bg-blue-50 capitalize font-bold rounded-xl px-4 shadow-sm"
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
                        ? "bg-[#eff6ff] border-[#3b82f6]/30 shadow-md shadow-blue-50"
                        : "bg-white border-slate-100"
                    }`}
                  >
                    <CardContent className="flex justify-between items-start p-5 !pb-5">
                      <Box className="flex gap-4">
                        {/* Status Indicator Dot */}
                        <div
                          className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${!n.read ? "bg-[#2563eb] animate-pulse" : "bg-slate-200"}`}
                        />

                        <Box>
                          <Typography
                            className={`font-bold tracking-tight text-sm md:text-base ${!n.read ? "text-[#1e293b]" : "text-[#64748b]"}`}
                          >
                            {n.title}
                          </Typography>
                          <Typography
                            variant="body2"
                            className={`mt-1 leading-relaxed ${!n.read ? "text-slate-700" : "text-slate-500"}`}
                          >
                            {n.message}
                          </Typography>
                          <Typography className="text-[10px] text-slate-400 mt-3 font-bold uppercase tracking-wider">
                            {new Date(n.timestamp).toLocaleString([], {
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </Typography>
                        </Box>
                      </Box>

                      <Box className="flex gap-1 ml-4">
                        {!n.read && (
                          <IconButton
                            size="small"
                            onClick={() => markAsRead(n.id)}
                            className="text-[#2563eb] hover:bg-white rounded-lg transition-all"
                          >
                            <Check size={18} strokeWidth={3} />
                          </IconButton>
                        )}
                        <IconButton
                          size="small"
                          onClick={() => deleteNotification(n.id)}
                          className="text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
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
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Inbox size={32} className="text-slate-300" />
                </div>
                <Typography className="text-slate-500 font-bold">
                  Your inbox is empty
                </Typography>
                <Typography
                  variant="caption"
                  className="text-slate-400 uppercase tracking-widest mt-1"
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
