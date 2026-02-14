import React, { useState, useEffect } from "react";
import { useClassroom } from "./Classroom";
import { UserPlus, Trash2, User } from "lucide-react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Autocomplete,
  TextField,
  Chip,
  CircularProgress,
  Box,
} from "@mui/material";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebase/config";

const ClassroomPeople = () => {
  const { roster, theme, mockUser, handlers } = useClassroom();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [studentsList, setStudentsList] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [loading, setLoading] = useState(false);

  const isTeacher = mockUser.role === "teacher";

  useEffect(() => {
    if (isModalOpen) {
      const fetchStudents = async () => {
        setLoading(true);
        try {
          const q = query(collection(db, "users"), where("roleName", "==", "student"));
          const querySnapshot = await getDocs(q);
          const allStudents = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            name: doc.data().name || doc.data().displayName || "Unnamed Student",
            email: doc.data().email,
          }));
          // Filter out those already in roster
          const available = allStudents.filter(
            (s) => !roster.some((r) => r.id === s.id)
          );
          setStudentsList(available);
        } catch (error) {
          console.error("Error fetching students:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchStudents();
    } else {
      setSelectedStudents([]);
    }
  }, [isModalOpen, roster]);

  const handleAddMultiple = async () => {
    if (selectedStudents.length === 0) return;
    for (const student of selectedStudents) {
      await handlers.onAddStudent(student);
    }
    setIsModalOpen(false);
    setSelectedStudents([]);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black">Classroom Roster</h2>
          <p className={theme.textSecondary}>
            {roster.length} Members Enrolled
          </p>
        </div>
        {isTeacher && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold transition-all active:scale-95 shadow-lg shadow-blue-500/20"
          >
            <UserPlus size={18} />
            Add Students
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {roster.map((student) => (
          <div
            key={student.id}
            className={`group flex items-center justify-between p-4 rounded-2xl border ${theme.surface} ${theme.border} hover:shadow-md transition-all`}
          >
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold uppercase ring-2 ring-offset-2 ring-transparent group-hover:ring-blue-500 transition-all">
                {student.name?.charAt(0) || <User size={20} />}
              </div>
              <div>
                <p className="font-bold">{student.name || "Unknown User"}</p>
                {/* Show email and ID only for teachers */}
                {isTeacher && (
                  <>
                    <p className={`text-xs ${theme.textSecondary}`}>
                      {student.email || "No email"}
                    </p>
                    <p className={`text-[10px] font-mono ${theme.textSecondary}`}>
                      ID: {student.id}
                    </p>
                  </>
                )}
              </div>
            </div>

            {/* Remove button only for teachers */}
            {isTeacher && (
              <button
                onClick={() => handlers.onRemoveStudent(student.id)}
                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                title="Remove Student"
              >
                <Trash2 size={18} />
              </button>
            )}
          </div>
        ))}
      </div>

      {/* MUI Dialog for multi‑select (only for teachers) */}
      <Dialog
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: "24px",
            bgcolor: theme.surface,
            color: theme.textPrimary,
            backgroundImage: "none",
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 800, fontSize: "1.5rem", pb: 1 }}>
          Add Students
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Autocomplete
              multiple
              loading={loading}
              options={studentsList}
              getOptionLabel={(option) => option.name}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              value={selectedStudents}
              onChange={(event, newValue) => setSelectedStudents(newValue)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  label="Search students"
                  placeholder="Type name or email..."
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {loading && <CircularProgress color="inherit" size={20} />}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                />
              )}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    label={option.name}
                    {...getTagProps({ index })}
                    size="small"
                  />
                ))
              }
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                },
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button
            onClick={() => setIsModalOpen(false)}
            sx={{ color: theme.textSecondary }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleAddMultiple}
            variant="contained"
            disabled={selectedStudents.length === 0}
            sx={{
              borderRadius: "12px",
              px: 4,
              bgcolor: "#2563eb",
              "&:hover": { bgcolor: "#1d4ed8" },
            }}
          >
            Add {selectedStudents.length} Student
            {selectedStudents.length !== 1 && "s"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ClassroomPeople;