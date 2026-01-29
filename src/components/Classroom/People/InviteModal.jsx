import React, { useState } from 'react';
import { 
  Box, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions,
  TextField,
  Button,
  Typography,
  Alert,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Checkbox,
} from '@mui/material';
import { PersonAdd as PersonAddIcon, Email as EmailIcon } from '@mui/icons-material';
import { motion } from 'framer-motion';

const InviteModal = ({ open, onClose, classId, className }) => {
  const [inviteType, setInviteType] = useState('email'); // email or code
  const [emails, setEmails] = useState('');
  const [inviteCode, setInviteCode] = useState(`CLASS-${classId}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`);
  const [invitedUsers, setInvitedUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleInviteByEmail = async () => {
    if (!emails.trim()) return;

    setLoading(true);
    const emailList = emails.split(/[\s,]+/).filter(e => e.includes('@'));
    
    // Simulate API call
    setTimeout(() => {
      setInvitedUsers([
        ...invitedUsers,
        ...emailList.map(email => ({
          id: Date.now() + Math.random(),
          email,
          status: 'pending',
          invitedAt: new Date().toISOString(),
        }))
      ]);
      setEmails('');
      setLoading(false);
    }, 1000);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(inviteCode);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle className="flex items-center gap-2">
        <PersonAddIcon />
        Invite Students to {className}
      </DialogTitle>

      <DialogContent className="pt-6">
        <Box className="space-y-4">
          {/* Tab Selection */}
          <Box className="flex gap-2">
            <Button
              variant={inviteType === 'email' ? 'contained' : 'outlined'}
              onClick={() => setInviteType('email')}
              fullWidth
              startIcon={<EmailIcon />}
            >
              By Email
            </Button>
            <Button
              variant={inviteType === 'code' ? 'contained' : 'outlined'}
              onClick={() => setInviteType('code')}
              fullWidth
            >
              By Code
            </Button>
          </Box>

          {/* Email Invite */}
          {inviteType === 'email' && (
            <>
              <TextField
                label="Enter email addresses"
                placeholder="student1@example.com, student2@example.com"
                fullWidth
                multiline
                rows={3}
                value={emails}
                onChange={(e) => setEmails(e.target.value)}
                helperText="Separate multiple emails with commas or line breaks"
              />
              <Button
                variant="contained"
                color="primary"
                onClick={handleInviteByEmail}
                disabled={loading || !emails.trim()}
                fullWidth
              >
                {loading ? 'Sending Invites...' : 'Send Invites'}
              </Button>
            </>
          )}

          {/* Code Invite */}
          {inviteType === 'code' && (
            <>
              <Alert severity="info">
                Share this code with students. They can use it to join the class.
              </Alert>
              <Box className="p-4 bg-gray-100 dark:bg-gray-700 rounded">
                <Typography variant="body2" className="text-gray-600 dark:text-gray-400 mb-2">
                  Class Code
                </Typography>
                <Box className="flex gap-2">
                  <TextField
                    value={inviteCode}
                    readOnly
                    fullWidth
                    variant="outlined"
                    size="small"
                  />
                  <Button
                    variant="contained"
                    onClick={handleCopyCode}
                  >
                    Copy
                  </Button>
                </Box>
              </Box>
            </>
          )}

          {/* Invited Users List */}
          {invitedUsers.length > 0 && (
            <Box>
              <Typography variant="subtitle2" className="font-semibold mb-2">
                Pending Invitations ({invitedUsers.length})
              </Typography>
              <List className="max-h-48 overflow-y-auto">
                {invitedUsers.map((user, index) => (
                  <motion.div
                    key={user.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <ListItem>
                      <ListItemIcon>
                        <Checkbox checked disabled />
                      </ListItemIcon>
                      <ListItemText
                        primary={user.email}
                        secondary={`Invited ${new Date(user.invitedAt).toLocaleDateString()}`}
                      />
                    </ListItem>
                  </motion.div>
                ))}
              </List>
            </Box>
          )}
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default InviteModal;
