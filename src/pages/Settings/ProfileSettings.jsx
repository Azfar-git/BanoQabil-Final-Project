import React from "react";
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

export default function ProfileSettings() {
  const [formData, setFormData] = React.useState({
    name: "Muhammad Ali",
    email: "ali@student.com",
    phone: "+92-300-1234567",
    bio: "Computer Science Student",
  });

  const [loading, setLoading] = React.useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1500); // Functional feedback
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Background matches your dashboard exactly */}
      <Box className="min-h-screen bg-[#f8fafc] p-6">
        <Box className="max-w-2xl mx-auto">
          <Box className="mb-8">
            <Typography
              variant="h4"
              className="font-black text-[#1e293b]"
              style={{
                fontFamily: "Montserrat, sans-serif",
                letterSpacing: "-0.02em",
              }}
            >
              👤 Profile Settings
            </Typography>
            <Typography
              variant="body2"
              className="text-slate-500 font-medium mt-1"
            >
              Manage your profile information and account preferences
            </Typography>
          </Box>

          <Card
            className="shadow-xl shadow-slate-200/60 border border-slate-100"
            sx={{ borderRadius: "24px" }}
          >
            <CardContent className="p-8 space-y-8">
              {/* Profile Picture - Improved spacing and button size */}
              <Box className="flex flex-col items-center pb-6 border-b border-slate-100">
                <Avatar
                  className="mb-4 shadow-inner"
                  sx={{
                    width: 100,
                    height: 100,
                    fontSize: "2.5rem",
                    bgcolor: "#2563eb",
                    fontWeight: "bold",
                    border: "4px solid white",
                    boxShadow: "0 4px 14px 0 rgba(0,0,0,0.1)",
                  }}
                >
                  {formData.name.charAt(0)}
                </Avatar>
                <Button
                  variant="outlined"
                  size="small"
                  className="rounded-full capitalize font-bold border-slate-200 text-slate-600 hover:bg-slate-50"
                >
                  Change Photo
                </Button>
              </Box>

              {/* Personal Information - Cleaned up TextFields for 100% Zoom */}
              <Box>
                <Typography
                  variant="subtitle1"
                  className="font-bold text-[#1e293b] mb-4"
                >
                  Personal Information
                </Typography>
                <Box className="space-y-4">
                  <TextField
                    fullWidth
                    label="Full Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    variant="outlined"
                    sx={{
                      "& .MuiOutlinedInput-root": { borderRadius: "12px" },
                    }}
                  />
                  <TextField
                    fullWidth
                    label="Email Address"
                    name="email"
                    type="email"
                    value={formData.email}
                    disabled
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "12px",
                        bgcolor: "#f1f5f9",
                      },
                      "& .Mui-disabled": { WebkitTextFillColor: "#64748b" },
                    }}
                  />
                  <TextField
                    fullWidth
                    label="Phone Number"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    sx={{
                      "& .MuiOutlinedInput-root": { borderRadius: "12px" },
                    }}
                  />
                  <TextField
                    fullWidth
                    label="Bio"
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    multiline
                    rows={3}
                    sx={{
                      "& .MuiOutlinedInput-root": { borderRadius: "12px" },
                    }}
                  />
                </Box>
              </Box>

              <Divider className="border-slate-100" />

              {/* Privacy Settings */}
              <Box>
                <Typography
                  variant="subtitle1"
                  className="font-bold text-[#1e293b] mb-2"
                >
                  Privacy
                </Typography>
                <Typography
                  variant="body2"
                  className="text-slate-500 mb-4 font-medium"
                >
                  Control who can see your activity and profile details.
                </Typography>
                <Box className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <Typography className="text-slate-700 text-sm font-bold flex items-center gap-2">
                    <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                    Teachers and classmates only
                  </Typography>
                </Box>
              </Box>

              {/* Action Buttons - Solid colors for better visibility */}
              <Box className="pt-4 flex gap-4">
                <Button
                  variant="contained"
                  onClick={handleSave}
                  disabled={loading}
                  className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-bold py-3 px-8 shadow-lg shadow-blue-200"
                  sx={{ borderRadius: "14px", textTransform: "none", flex: 1 }}
                >
                  {loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    "Save Changes"
                  )}
                </Button>
                <Button
                  variant="outlined"
                  className="border-slate-200 text-slate-600 hover:bg-slate-50 font-bold px-8"
                  sx={{ borderRadius: "14px", textTransform: "none" }}
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
