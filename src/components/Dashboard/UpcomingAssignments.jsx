import React from "react";
import { Box, Typography, Card, CardContent } from "@mui/material";
import { Calendar, ChevronRight } from "lucide-react";

const UpcomingAssignments = ({ assignments, darkMode }) => {
  const theme = {
    card: darkMode
      ? "!bg-gray-800 !border-gray-700"
      : "!bg-white !border-slate-200",
    textMain: darkMode ? "!text-gray-100" : "!text-[#1e293b]",
    textMuted: darkMode ? "!text-gray-400" : "!text-[#64748b]",
    headerBg: darkMode
      ? "!bg-gray-900 !border-gray-700"
      : "!bg-[#f8fafc] !border-slate-200",
    itemHover: darkMode ? "hover:!bg-gray-700" : "hover:!bg-slate-50",
  };

  return (
    <Card
      className={`rounded-2xl border shadow-sm !overflow-hidden ${theme.card}`}
    >
      <div
        className={`px-5 py-4 border-b flex items-center justify-between ${theme.headerBg}`}
      >
        <div className="flex items-center gap-2">
          <Calendar size={18} className="text-[#2563eb]" />
          <Typography
            className={`font-bold text-sm uppercase tracking-wide ${theme.textMain}`}
          >
            Upcoming Assignments
          </Typography>
        </div>
        <ChevronRight size={16} className={theme.textMuted} />
      </div>
      <CardContent className="p-4">
        {assignments.length === 0 ? (
          <Box className="text-center py-8">
            <Typography className={theme.textMuted}>
              No pending assignments
            </Typography>
          </Box>
        ) : (
          <Box className="space-y-3">
            {assignments.slice(0, 5).map((assignment) => (
              <Box
                key={assignment.id}
                className={`p-4 rounded-xl border transition-all cursor-pointer group ${
                  darkMode
                    ? "!bg-gray-700/50 !border-gray-600 hover:!bg-gray-700"
                    : "!bg-white !border-slate-100 hover:shadow-md hover:!border-blue-100"
                }`}
              >
                <Typography
                  className={`text-sm font-bold transition-colors group-hover:text-[#2563eb] ${theme.textMain}`}
                >
                  {assignment.title}
                </Typography>
                <div className="flex items-center gap-2 mt-2">
                  <div
                    className={`w-1.5 h-1.5 rounded-full ${
                      darkMode ? "bg-blue-500" : "bg-[#3b82f6]"
                    }`}
                  />
                  <Typography
                    variant="caption"
                    className={`font-medium ${theme.textMuted}`}
                  >
                    {assignment.className} • Due{" "}
                    {new Date(assignment.dueDate).toLocaleDateString()}
                  </Typography>
                </div>
              </Box>
            ))}
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default UpcomingAssignments;
