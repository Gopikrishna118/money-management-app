import React from 'react';
import { Box, Typography } from '@mui/material';
import { TrendingUp, TrendingDown } from '@mui/icons-material';

interface StatTrendProps {
  value: string;
  isPositive: boolean;
}

const StatTrend: React.FC<StatTrendProps> = ({ value, isPositive }) => {
  return (
    <Box sx={{ 
      display: 'flex', 
      alignItems: 'center', 
      gap: 0.5, 
      bgcolor: isPositive ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
      px: 1,
      py: 0.5,
      borderRadius: '8px',
      width: 'fit-content'
    }}>
      {isPositive ? (
        <TrendingUp sx={{ fontSize: '0.9rem', color: '#22c55e' }} />
      ) : (
        <TrendingDown sx={{ fontSize: '0.9rem', color: '#ef4444' }} />
      )}
      <Typography variant="caption" sx={{ color: isPositive ? '#22c55e' : '#ef4444', fontWeight: 700 }}>
        {value}
      </Typography>
    </Box>
  );
};

export default StatTrend;
