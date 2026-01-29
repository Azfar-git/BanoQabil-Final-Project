import React, { useState, useEffect } from 'react';
import { Box, Snackbar, Alert } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';

const ToastContainer = ({ toasts = [] }) => {
  const [visibleToasts, setVisibleToasts] = useState(toasts);

  useEffect(() => {
    setVisibleToasts(toasts);
  }, [toasts]);

  const removeToast = (id) => {
    setVisibleToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <Box className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      <AnimatePresence>
        {visibleToasts.map((toast, index) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ duration: 0.3 }}
          >
            <Snackbar
              open={true}
              autoHideDuration={toast.duration || 5000}
              onClose={() => removeToast(toast.id)}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
              <Alert
                onClose={() => removeToast(toast.id)}
                severity={toast.type || 'info'}
                sx={{ width: '100%' }}
              >
                {toast.message}
              </Alert>
            </Snackbar>
          </motion.div>
        ))}
      </AnimatePresence>
    </Box>
  );
};

export default ToastContainer;
