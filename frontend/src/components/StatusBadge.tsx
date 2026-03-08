import React from 'react';
import { Chip, Box } from '@mui/material';

interface StatusBadgeProps {
  type: 'healthy' | 'overspending' | 'neutral';
  label: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ type, label }) => {
  const getStyles = () => {
    switch (type) {
      case 'healthy':
        return {
          bgcolor: 'rgba(34, 197, 94, 0.1)',
          color: '#22c55e',
        };
      case 'overspending':
        return {
          bgcolor: 'rgba(239, 68, 68, 0.1)',
          color: '#ef4444',
        };
      default:
        return {
          bgcolor: 'rgba(148, 163, 184, 0.1)',
          color: '#94a3b8',
        };
    }
  };

  const styles = getStyles();

  return (
    <Chip 
      label={label}
      size="small"
      sx={{ 
        fontWeight: '700', 
        borderRadius: '8px', 
        border: 'none', 
        bgcolor: styles.bgcolor,
        color: styles.color,
        fontSize: '0.75rem',
        height: '24px',
        px: 0.5
      }}
    />
  );
};

export default StatusBadge;
