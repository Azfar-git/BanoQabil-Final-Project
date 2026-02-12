import React from "react";
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

  const daysInMonth = (date) =>
    new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = (date) =>
    new Date(date.getFullYear(), date.getMonth(), 1).getDay();

  const days = [];
  const firstDay = firstDayOfMonth(currentDate);
  const numDays = daysInMonth(currentDate);

  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let i = 1; i <= numDays; i++) days.push(i);

  // Helper to check if a specific day has an event
  const hasEvent = (day) => {
    return DUMMY_CALENDAR_EVENTS.some((event) => {
      const eventDate = new Date(event.date);
      return (
        eventDate.getDate() === day &&
        eventDate.getMonth() === currentDate.getMonth() &&
        eventDate.getFullYear() === currentDate.getFullYear()
      );
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Box className="min-h-screen bg-[#f8fafc] p-6">
        <Box className="max-w-6xl mx-auto">
          {/* Header Section */}
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
                className="font-extrabold text-[#1e293b] tracking-tight"
              >
                Calendar
              </Typography>
            </Box>
            <Box className="text-right">
              <Typography className="text-[#64748b] font-semibold">
                {currentDate.toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                })}
              </Typography>
            </Box>
          </Box>

          <Grid container spacing={4}>
            {/* Main Calendar Grid */}
            <Grid item xs={12} md={8}>
              <Card className="rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <CardContent className="p-6">
                  <Box className="grid grid-cols-7 gap-2">
                    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                      (day) => (
                        <Typography
                          key={day}
                          className="text-center text-[11px] font-bold text-[#64748b] uppercase tracking-widest py-4"
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
                                ? "bg-[#eff6ff] border-[#3b82f6] text-[#2563eb]" // Matches unread notification blue
                                : "bg-white border-slate-100 hover:border-[#2563eb] hover:bg-slate-50"
                          } ${day === null ? "" : "cursor-pointer"}`}
                        >
                          <Typography
                            className={`text-sm font-bold ${isToday ? "text-[#2563eb]" : "text-[#1e293b]"}`}
                          >
                            {day}
                          </Typography>

                          {/* SVG Event Dot/Icon */}
                          {dayHasEvent && (
                            <div className="absolute bottom-2 right-2">
                              <BookOpen
                                size={14}
                                className={
                                  isToday ? "text-[#2563eb]" : "text-[#3b82f6]"
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

            {/* Side Events Column */}
            <Grid item xs={12} md={4}>
              <Card className="rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="bg-[#f8fafc] px-5 py-4 border-b border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MapPin size={18} className="text-[#2563eb]" />
                    <Typography className="font-bold text-[#1e293b] text-sm uppercase tracking-wide">
                      Upcoming Events
                    </Typography>
                  </div>
                  <ChevronRight size={16} className="text-slate-400" />
                </div>
                <CardContent className="p-4">
                  <Box className="space-y-3">
                    {DUMMY_CALENDAR_EVENTS.slice(0, 4).map((event, i) => (
                      <Box
                        key={i}
                        className="p-4 bg-white border border-slate-100 rounded-xl hover:shadow-md hover:border-blue-100 transition-all cursor-pointer group"
                      >
                        <Typography className="text-[#1e293b] font-bold text-sm group-hover:text-[#2563eb] transition-colors">
                          {event.title}
                        </Typography>
                        <div className="flex items-center gap-2 mt-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#3b82f6]" />
                          <Typography
                            variant="caption"
                            className="text-[#64748b] font-medium"
                          >
                            {new Date(event.date).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                            })}
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
