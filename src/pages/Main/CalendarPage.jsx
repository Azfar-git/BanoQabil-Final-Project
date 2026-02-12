import React, { useEffect, useState } from "react";
import { Box, Typography, Card, CardContent, Grid } from "@mui/material";
import { motion } from "framer-motion";
import {
  Calendar as CalendarIcon,
  MapPin,
  ChevronRight,
  BookOpen,
} from "lucide-react";
import { DUMMY_CALENDAR_EVENTS } from "../../data/dummyData";

export default function CalendarPage() {
  const [currentDate] = React.useState(new Date());
  // This state will track if the "dark" class is on the <html> tag
  const [isDark, setIsDark] = useState(
    document.documentElement.classList.contains("dark"),
  );

  // This "Watcher" detects when you click the toggle button in the sidebar
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

  const daysInMonth = (date) =>
    new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = (date) =>
    new Date(date.getFullYear(), date.getMonth(), 1).getDay();

  const days = [];
  const firstDay = firstDayOfMonth(currentDate);
  const numDays = daysInMonth(currentDate);

  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let i = 1; i <= numDays; i++) days.push(i);

  const hasEvent = (day) => {
    if (!day) return false;
    return DUMMY_CALENDAR_EVENTS.some((event) => {
      const eventDate = new Date(event.date);
      return (
        eventDate.getDate() === day &&
        eventDate.getMonth() === currentDate.getMonth() &&
        eventDate.getFullYear() === currentDate.getFullYear()
      );
    });
  };

  // Automated theme mapping based on the global state
  const theme = {
    pageBg: isDark ? "!bg-gray-900" : "!bg-[#f8fafc]",
    card: isDark
      ? "!bg-gray-800 !border-gray-700"
      : "!bg-white !border-slate-200",
    textMain: isDark ? "!text-gray-100" : "!text-[#1e293b]",
    textMuted: isDark ? "!text-gray-400" : "!text-[#64748b]",
    headerBg: isDark
      ? "!bg-gray-900 !border-gray-700"
      : "!bg-[#f8fafc] !border-slate-200",
    itemHover: isDark ? "hover:!bg-gray-700" : "hover:!bg-slate-50",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Box
        className={`min-h-screen p-6 transition-all duration-300 ${theme.pageBg}`}
      >
        <Box className="max-w-6xl mx-auto">
          {/* Header */}
          <Box className="flex items-center justify-between mb-8">
            <Box>
              <div className="flex items-center gap-2 mb-1">
                <CalendarIcon size={20} className="text-[#2563eb]" />
                <span className="text-[10px] font-bold text-[#2563eb] uppercase tracking-[0.2em]">
                  Academic Planner
                </span>
              </div>
              <Typography
                variant="h4"
                className={`font-extrabold tracking-tight ${theme.textMain}`}
              >
                Calendar
              </Typography>
            </Box>
            <Box className="text-right">
              <Typography className={`${theme.textMuted} font-semibold`}>
                {currentDate.toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                })}
              </Typography>
            </Box>
          </Box>

          <Grid container spacing={4}>
            {/* Main Calendar */}
            <Grid item xs={12} md={8}>
              <Card
                className={`rounded-2xl border shadow-sm !overflow-hidden ${theme.card}`}
              >
                <CardContent className="p-6">
                  <Box className="grid grid-cols-7 gap-2">
                    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                      (day) => (
                        <Typography
                          key={day}
                          className={`text-center text-[11px] font-bold uppercase tracking-widest py-4 ${theme.textMuted}`}
                        >
                          {day}
                        </Typography>
                      ),
                    )}

                    {days.map((day, i) => {
                      const isToday = day === currentDate.getDate();
                      const dayHasEvent = hasEvent(day);
                      return (
                        <Box
                          key={i}
                          className={`relative h-20 p-2 rounded-xl transition-all border ${
                            day === null
                              ? "border-transparent"
                              : isToday
                                ? isDark
                                  ? "!bg-blue-900/40 !border-blue-600 !text-blue-400"
                                  : "!bg-[#eff6ff] !border-[#3b82f6] !text-[#2563eb]"
                                : `${theme.card} ${theme.itemHover} hover:!border-blue-400`
                          } ${day === null ? "" : "cursor-pointer"}`}
                        >
                          <Typography
                            className={`text-sm font-bold ${isToday ? "!text-blue-400" : theme.textMain}`}
                          >
                            {day}
                          </Typography>
                          {dayHasEvent && (
                            <div className="absolute bottom-2 right-2">
                              <BookOpen
                                size={14}
                                className={
                                  isToday || isDark
                                    ? "text-blue-400"
                                    : "text-[#3b82f6]"
                                }
                              />
                            </div>
                          )}
                        </Box>
                      );
                    })}
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Sidebar Events */}
            <Grid item xs={12} md={4}>
              <Card
                className={`rounded-2xl border shadow-sm !overflow-hidden ${theme.card}`}
              >
                <div
                  className={`px-5 py-4 border-b flex items-center justify-between ${theme.headerBg}`}
                >
                  <div className="flex items-center gap-2">
                    <MapPin size={18} className="text-[#2563eb]" />
                    <Typography
                      className={`font-bold text-sm uppercase tracking-wide ${theme.textMain}`}
                    >
                      Upcoming Events
                    </Typography>
                  </div>
                  <ChevronRight size={16} className={theme.textMuted} />
                </div>
                <CardContent className="p-4">
                  <Box className="space-y-3">
                    {DUMMY_CALENDAR_EVENTS.slice(0, 4).map((event, i) => (
                      <Box
                        key={i}
                        className={`p-4 rounded-xl border transition-all cursor-pointer group ${
                          isDark
                            ? "!bg-gray-700/50 !border-gray-600 hover:!bg-gray-700"
                            : "!bg-white !border-slate-100 hover:shadow-md hover:!border-blue-100"
                        }`}
                      >
                        <Typography
                          className={`text-sm font-bold transition-colors group-hover:text-[#2563eb] ${theme.textMain}`}
                        >
                          {event.title}
                        </Typography>
                        <div className="flex items-center gap-2 mt-2">
                          <div
                            className={`w-1.5 h-1.5 rounded-full ${isDark ? "bg-blue-500" : "bg-[#3b82f6]"}`}
                          />
                          <Typography
                            variant="caption"
                            className={`font-medium ${theme.textMuted}`}
                          >
                            {event.date
                              ? new Date(event.date).toLocaleDateString(
                                  "en-US",
                                  { month: "short", day: "numeric" },
                                )
                              : "TBA"}
                          </Typography>
                        </div>
                      </Box>
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </motion.div>
  );
}
