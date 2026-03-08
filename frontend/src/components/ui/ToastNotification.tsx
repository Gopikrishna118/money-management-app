import React, { useEffect, useState } from 'react';
import { Box, Typography, IconButton, Paper, Slide, Fade } from '@mui/material';
import { 
  CheckCircle, 
  Error as ErrorIcon, 
  Warning, 
  Info, 
  Close 
} from '@mui/icons-material';
import { NotificationType } from '../../context/NotificationContext';

interface ToastNotificationProps {
  message: string;
  type: NotificationType;
  onClose: () => void;
  duration?: number;
}

const ToastNotification: React.FC<ToastNotificationProps> = ({ 
  message, 
  type, 
  onClose, 
  duration = 4000 
}) => {
  const [open, setOpen] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setOpen(false);
      setTimeout(onClose, 300); // Wait for exit animation
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const handleManualClose = () => {
    setOpen(false);
    setTimeout(onClose, 300);
  };

  const getConfig = () => {
    switch (type) {
      case 'success':
        return { icon: <CheckCircle sx={{ color: '#22C55E' }} />, color: '#22C55E' };
      case 'error':
        return { icon: <ErrorIcon sx={{ color: '#EF4444' }} />, color: '#EF4444' };
      case 'warning':
        return { icon: <Warning sx={{ color: '#F59E0B' }} />, color: '#F59E0B' };
      case 'info':
        return { icon: <Info sx={{ color: '#3B82F6' }} />, color: '#3B82F6' };
      default:
        return { icon: <Info sx={{ color: '#3B82F6' }} />, color: '#3B82F6' };
    }
  };

  const { icon, color } = getConfig();

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 24,
        right: 24,
        zIndex: 9999,
        pointerEvents: 'none'
      }}
    >
      <Slide direction="left" in={open} mountOnEnter unmountOnExit>
        <Paper
          elevation={6}
          sx={{
            pointerEvents: 'auto',
            minWidth: 300,
            maxWidth: 450,
            bgcolor: '#1E293B',
            color: '#E5E7EB',
            borderRadius: '10px',
            p: '12px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            borderLeft: `4px solid ${color}`,
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.1)'
          }}
        >
          <Box sx={{ display: 'flex' }}>
            {icon}
          </Box>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="body2" fontWeight="600">
              {message}
            </Typography>
          </Box>
          <IconButton 
            size="small" 
            onClick={handleManualClose}
            sx={{ color: 'text.secondary', '&:hover': { color: '#ffffff' } }}
          >
            <Close fontSize="small" />
          </IconButton>
        </Paper>
      </Slide>
    </Box>
  );
};

export default ToastNotification;
