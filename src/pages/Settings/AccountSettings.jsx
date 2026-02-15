import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  Card,
  CardContent,
  Avatar,
  Divider,
  FormControlLabel,
  Checkbox,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Security as SecurityIcon,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { db, auth } from "../../firebase/config";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import {
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from "firebase/auth";
import toast from "react-hot-toast";

export default function AccountSettings() {
  const { user, loading: authLoading } = useAuth();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    phone: "",
    bio: "",
  });
  const [originalData, setOriginalData] = useState({});

  // Password change dialog
  const [passwordDialog, setPasswordDialog] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // Load user data from Firestore
  useEffect(() => {
    if (!user?.id) return;

    const fetchUserData = async () => {
      try {
        const userDoc = await getDoc(doc(db, "users", user.id));
        if (userDoc.exists()) {
          const data = userDoc.data();
          const loadedData = {
            name: data.name || user.name || "",
            email: user.email || "",
            phone: data.phone || "",
            bio: data.bio || "",
          };
          setUserData(loadedData);
          setOriginalData(loadedData);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast.error("Failed to load user data");
      }
    };

    fetchUserData();
  }, [user]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const userRef = doc(db, "users", user.id);
      await updateDoc(userRef, {
        name: userData.name,
        phone: userData.phone,
        bio: userData.bio,
      });
      setOriginalData(userData);
      setEditing(false);
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setUserData(originalData);
    setEditing(false);
  };

  // Password change
  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      return;
    }

    setPasswordError("");
    const credential = EmailAuthProvider.credential(user.email, currentPassword);

    try {
      await reauthenticateWithCredential(auth.currentUser, credential);
      await updatePassword(auth.currentUser, newPassword);
      toast.success("Password updated successfully");
      setPasswordDialog(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.error("Password change error:", error);
      if (error.code === "auth/wrong-password") {
        setPasswordError("Current password is incorrect");
      } else {
        setPasswordError("Failed to update password. Try again.");
      }
    }
  };

  if (authLoading) {
    return (
      <Box className="min-h-screen flex items-center justify-center">
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return (
      <Box className="min-h-screen flex items-center justify-center">
        <Typography>Please log in to view settings.</Typography>
      </Box>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Box className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 p-6">
        <Box className="max-w-2xl mx-auto">
          {/* Header */}
          <Box className="mb-8">
            <Typography
              variant="h4"
              className="font-bold text-gray-900 dark:text-white mb-2"
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              ⚙️ Account Settings
            </Typography>
            <Typography variant="body2" className="text-gray-600 dark:text-gray-400">
              Manage your account information and security settings
            </Typography>
          </Box>

          {/* Profile Section */}
          <Card className="mb-6 dark:bg-gray-800">
            <CardContent className="p-6">
              <Box className="flex items-center gap-6 mb-6">
                <Avatar
                  sx={{ width: 100, height: 100 }}
                  src={`https://i.pravatar.cc/100?u=${user.id}`}
                />
                <Box>
                  <Typography variant="h6" className="font-bold text-gray-900 dark:text-white">
                    {userData.name || user.name}
                  </Typography>
                  <Typography variant="body2" className="text-gray-600 dark:text-gray-400">
                    {user.email}
                  </Typography>
                  <Button size="small" className="mt-2" disabled>
                    Change Avatar (coming soon)
                  </Button>
                </Box>
              </Box>
            </CardContent>
          </Card>

          {/* Personal Information */}
          <Card className="mb-6 dark:bg-gray-800">
            <CardContent className="p-6">
              <Box className="flex justify-between items-center mb-6">
                <Typography variant="h6" className="font-bold text-gray-900 dark:text-white">
                  Personal Information
                </Typography>
                {editing ? (
                  <Box className="flex gap-2">
                    <Button
                      onClick={handleCancel}
                      disabled={saving}
                      variant="outlined"
                      size="small"
                    >
                      Cancel
                    </Button>
                    <Button
                      startIcon={saving ? <CircularProgress size={16} /> : <SaveIcon />}
                      onClick={handleSave}
                      disabled={saving}
                      variant="contained"
                      size="small"
                    >
                      {saving ? "Saving..." : "Save"}
                    </Button>
                  </Box>
                ) : (
                  <Button
                    startIcon={<EditIcon />}
                    onClick={() => setEditing(true)}
                    size="small"
                  >
                    Edit
                  </Button>
                )}
              </Box>

              <Box className="space-y-4">
                <TextField
                  label="Full Name"
                  fullWidth
                  value={userData.name}
                  disabled={!editing}
                  variant="outlined"
                  onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                />
                <TextField
                  label="Email"
                  fullWidth
                  value={user.email}
                  disabled={true}
                  variant="outlined"
                  helperText="Email cannot be changed"
                />
                <TextField
                  label="Phone"
                  fullWidth
                  value={userData.phone}
                  disabled={!editing}
                  variant="outlined"
                  onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
                />
                <TextField
                  label="Bio"
                  fullWidth
                  multiline
                  rows={3}
                  value={userData.bio}
                  disabled={!editing}
                  variant="outlined"
                  onChange={(e) => setUserData({ ...userData, bio: e.target.value })}
                />
              </Box>
            </CardContent>
          </Card>

          {/* Security Section */}
          <Card className="mb-6 dark:bg-gray-800">
            <CardContent className="p-6">
              <Typography
                variant="h6"
                className="font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2"
              >
                <SecurityIcon /> Security
              </Typography>
              <Box className="space-y-4">
                <Box>
                  <Typography variant="subtitle2" className="font-semibold text-gray-900 dark:text-white mb-2">
                    Password
                  </Typography>
                  <Button
                    variant="outlined"
                    fullWidth
                    onClick={() => setPasswordDialog(true)}
                  >
                    Change Password
                  </Button>
                </Box>
                <Divider />
                <Box>
                  <Typography variant="subtitle2" className="font-semibold text-gray-900 dark:text-white mb-2">
                    Two-Factor Authentication
                  </Typography>
                  <FormControlLabel
                    control={<Checkbox defaultChecked disabled />}
                    label="Enable 2FA for added security (coming soon)"
                  />
                </Box>
                <Divider />
                <Box>
                  <Typography variant="subtitle2" className="font-semibold text-gray-900 dark:text-white mb-2">
                    Active Sessions
                  </Typography>
                  <Typography variant="body2" className="text-gray-600 dark:text-gray-400 mb-4">
                    Sign out from all other devices
                  </Typography>
                  <Button variant="contained" color="error" disabled>
                    Sign Out All Devices (coming soon)
                  </Button>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* Change Password Dialog */}
      <Dialog
        open={passwordDialog}
        onClose={() => setPasswordDialog(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: "24px",
            p: 1,
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 800, fontSize: "1.5rem", pb: 1 }}>
          Change Password
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            {passwordError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {passwordError}
              </Alert>
            )}
            <TextField
              label="Current Password"
              type="password"
              fullWidth
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              label="New Password"
              type="password"
              fullWidth
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              label="Confirm New Password"
              type="password"
              fullWidth
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              sx={{ mb: 2 }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button onClick={() => setPasswordDialog(false)}>Cancel</Button>
          <Button
            onClick={handlePasswordChange}
            variant="contained"
            disabled={!currentPassword || !newPassword || !confirmPassword}
          >
            Update Password
          </Button>
        </DialogActions>
      </Dialog>
    </motion.div>
  );
}