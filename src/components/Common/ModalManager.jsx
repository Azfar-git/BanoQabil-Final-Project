import React, { useState, useCallback } from 'react';
import { Box, Typography } from '@mui/material';

const ModalManager = ({ modals = {} }) => {
  const [openModals, setOpenModals] = useState({});

  const openModal = useCallback((modalId) => {
    setOpenModals((prev) => ({ ...prev, [modalId]: true }));
  }, []);

  const closeModal = useCallback((modalId) => {
    setOpenModals((prev) => ({ ...prev, [modalId]: false }));
  }, []);

  const toggleModal = useCallback((modalId) => {
    setOpenModals((prev) => ({ ...prev, [modalId]: !prev[modalId] }));
  }, []);

  return {
    openModals,
    openModal,
    closeModal,
    toggleModal,
    renderModals: () => (
      <Box>
        {Object.entries(modals).map(([id, Modal]) => (
          <div key={id}>
            {Modal && openModals[id] && (
              <Modal isOpen={openModals[id]} onClose={() => closeModal(id)} />
            )}
          </div>
        ))}
      </Box>
    ),
  };
};

export default ModalManager;
