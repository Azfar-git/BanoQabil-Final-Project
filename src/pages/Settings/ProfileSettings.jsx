import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Avatar,
  Divider,
  CircularProgress,
} from "@mui/material";
import { motion } from "framer-motion";
import { User, Camera } from "lucide-react";

export default function ProfileSettings() {
  const fileInputRef = useRef(null);
  const [profileImage, setProfileImage] = useState(null);
  const [formData, setFormData] = useState({
    name: "Muhammad Ali",
    email: "ali@student.com",
    phone: "+92-300-1234567",
    bio: "Computer Science Student",
  });

  const [loading, setLoading] = useState(false);

  // ✅ GLOBAL DARK MODE WATCHER
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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ PHOTO UPLOAD LOGIC
  const handlePhotoClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1500);
  };

  // ✅ THEME MAPPING
  const theme = {
    pageBg: isDark ? "!bg-gray-900" : "!bg-[#f8fafc]",
    cardBg: isDark
      ? "!bg-gray-800 !border-none"
      : "!bg-white !border-slate-100",
    textMain: isDark ? "!text-white" : "!text-[#1e293b]",
    textMuted: isDark ? "!text-gray-400" : "!text-slate-500",
    inputBg: isDark ? "#111827" : "#f8fafc",
    inputBorder: isDark ? "#374151" : "#e2e8f0",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Box
        className={`min-h-screen p-6 transition-colors duration-300 ${theme.pageBg}`}
      >
        <Box className="max-w-2xl mx-auto">
          {/* Header Section - Emoji Removed */}
          <Box className="mb-8">
            <Typography
              variant="h4"
              className={`font-black tracking-tight flex items-center gap-3 ${theme.textMain}`}
              sx={{ fontFamily: "Montserrat, sans-serif" }}
            >
              <User size={32} className="text-[#2563eb]" /> Profile Settings
            </Typography>
            <Typography
              variant="body2"
              className={`mt-1 font-medium ${theme.textMuted}`}
            >
              Manage your profile information and account preferences
            </Typography>
          </Box>

          <Card
            className={`shadow-2xl transition-all duration-300 border-none ${theme.cardBg}`}
            sx={{ borderRadius: "24px" }}
          >
            <CardContent className="p-8 space-y-8">
              {/* Profile Picture Section */}
              <Box
                className={`flex flex-col items-center pb-6 border-b ${isDark ? "border-gray-700" : "border-slate-50"}`}
              >
                <div className="relative group">
                  <Avatar
                    src={profileImage}
                    className="mb-4 shadow-xl transition-transform group-hover:scale-105"
                    sx={{
                      width: 110,
                      height: 110,
                      fontSize: "2.5rem",
                      bgcolor: "#2563eb",
                      fontWeight: "bold",
                      border: isDark ? "4px solid #1f2937" : "4px solid white",
                      boxShadow: "0 10px 25px -5px rgba(37, 99, 235, 0.4)",
                    }}
                  >
                    {!profileImage && formData.name.charAt(0)}
                  </Avatar>
                  <button
                    onClick={handlePhotoClick}
                    className="absolute bottom-4 right-0 p-2 bg-[#2563eb] text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors"
                  >
                    <Camera size={16} />
                  </button>
                </div>

                {/* Hidden File Input */}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />

                <Button
                  variant="outlined"
                  size="small"
                  onClick={handlePhotoClick}
                  className={`rounded-full capitalize font-bold px-6 mt-2 ${
                    isDark
                      ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                      : "border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  Change Photo
                </Button>
              </Box>

              {/* Input Fields Section */}
              <Box className="space-y-6">
                <Typography
                  variant="subtitle1"
                  className={`font-bold ${theme.textMain}`}
                >
                  Personal Information
                </Typography>

                <Box className="grid grid-cols-1 gap-5">
                  {[
                    { label: "Full Name", name: "name", value: formData.name },
                    {
                      label: "Email Address",
                      name: "email",
                      value: formData.email,
                      disabled: true,
                    },
                    {
                      label: "Phone Number",
                      name: "phone",
                      value: formData.phone,
                    },
                  ].map((field) => (
                    <TextField
                      key={field.name}
                      fullWidth
                      label={field.label}
                      name={field.name}
                      value={field.value}
                      disabled={field.disabled}
                      onChange={handleChange}
                      variant="outlined"
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "16px",
                          backgroundColor: field.disabled
                            ? isDark
                              ? "#1f2937"
                              : "#f1f5f9"
                            : theme.inputBg,
                          color: isDark ? "white" : "inherit",
                          "& fieldset": { borderColor: theme.inputBorder },
                          "&.Mui-focused fieldset": {
                            borderColor: "#2563eb !important",
                          },
                        },
                        "& .MuiInputLabel-root": {
                          color: isDark ? "#9ca3af" : "#64748b",
                        },
                        "& .Mui-disabled": {
                          WebkitTextFillColor: isDark ? "#6b7280" : "#94a3b8",
                        },
                      }}
                    />
                  ))}

                  <TextField
                    fullWidth
                    label="Bio"
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    multiline
                    rows={3}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "16px",
                        backgroundColor: theme.inputBg,
                        color: isDark ? "white" : "inherit",
                        "& fieldset": { borderColor: theme.inputBorder },
                      },
                      "& .MuiInputLabel-root": {
                        color: isDark ? "#9ca3af" : "#64748b",
                      },
                    }}
                  />
                </Box>
              </Box>

              <Divider
                className={isDark ? "border-gray-700" : "border-slate-50"}
              />

              {/* Privacy Footer */}
              <Box>
                <Typography
                  variant="subtitle2"
                  className={`font-bold mb-1 ${theme.textMain}`}
                >
                  Privacy
                </Typography>
                <Box
                  className={`p-4 rounded-2xl flex items-center gap-3 ${isDark ? "bg-gray-900/50" : "bg-slate-50"}`}
                >
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <Typography
                    variant="body2"
                    className={`font-medium ${theme.textMuted}`}
                  >
                    Profile visible to teachers and classmates only
                  </Typography>
                </Box>
              </Box>

              {/* Action Buttons */}
              <Box className="pt-4 flex gap-4">
                <Button
                  variant="contained"
                  onClick={handleSave}
                  disabled={loading}
                  className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-bold py-3 shadow-lg shadow-blue-500/30"
                  sx={{ borderRadius: "16px", textTransform: "none", flex: 2 }}
                >
                  {loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    "Save Changes"
                  )}
                </Button>
                <Button
                  variant="outlined"
                  className={`font-bold px-8 ${
                    isDark
                      ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                      : "border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                  sx={{ borderRadius: "16px", textTransform: "none", flex: 1 }}
                >
                  Cancel
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </motion.div>
  );
}
