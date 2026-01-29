import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Box, TextField, Button, Typography, Card, CardContent } from '@mui/material';
import { motion } from 'framer-motion';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      setMessage('✅ Reset link sent to your email');
      setSent(true);
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setMessage('❌ Error sending reset link');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Box className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <Box className="max-w-md w-full">
          <Card className="dark:bg-gray-800 shadow-2xl border-t-4 border-blue-600">
            <CardContent className="p-8">
              <Typography variant="h5" className="font-bold text-gray-900 dark:text-white" style={{ fontFamily: "Montserrat, sans-serif" }} className="mb-2 text-center">
                Reset Password
              </Typography>
              <Typography variant="body2" className="text-gray-600 dark:text-gray-400 text-center mb-6">
                Enter your email to receive a password reset link
              </Typography>

              {message && (
                <Box className={`p-3 rounded mb-4 ${sent ? 'bg-green-50 dark:bg-green-900' : 'bg-red-50 dark:bg-red-900'}`}>
                  <Typography className={sent ? 'text-green-700 dark:text-green-200' : 'text-red-700 dark:text-red-200'}>
                    {message}
                  </Typography>
                </Box>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <TextField
                  fullWidth
                  label="Email Address"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  size="small"
                  disabled={sent}
                />

                <Button
                  fullWidth
                  variant="contained" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90 text-white font-semibold"
                  type="submit"
                  disabled={loading || sent}
                  className="py-2"
                >
                  {loading ? 'Sending...' : sent ? 'Link Sent!' : 'Send Reset Link'}
                </Button>
              </form>

              <Box className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <Link to="/login" className="flex items-center justify-center gap-2 text-blue-600 hover:text-blue-700 font-medium">
                  ← Back to Sign In
                </Link>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </motion.div>
  );
}
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-2xl font-bold">GC</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Forgot Password?</h1>
            <p className="text-gray-600 mt-2">Enter your email to receive a reset link</p>
          </div>

          {message && (
            <Toast
              type={message.includes('Error') ? 'error' : 'success'}
              message={message}
              onClose={() => setMessage('')}
            />
          )}

          <form onSubmit={handleSubmit} className="space-y-4 mt-6">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 px-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>

          <Link
            to="/login"
            className="flex items-center justify-center gap-2 mt-6 text-blue-600 hover:text-blue-700 font-medium"
          >
            <ArrowLeft size={16} />
            Back to login
          </Link>
        </div>
      </div>
    </div>
  );
}
