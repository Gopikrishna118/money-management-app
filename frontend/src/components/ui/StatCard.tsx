import React, { ReactNode } from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { SvgIconProps } from '@mui/material/SvgIcon';
import StatTrend from '../StatTrend';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactElement<SvgIconProps>;
  type: 'success' | 'error' | 'primary';
  trend?: string;
  trendPositive?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  icon, 
  type, 
  trend, 
  trendPositive = true 
}) => {
  const getColors = () => {
    switch (type) {
      case 'success':
        return { 
          bg: 'rgba(34, 197, 94, 0.1)', 
          color: 'success.main' 
        };
      case 'error':
        return { 
          bg: 'rgba(239, 68, 68, 0.1)', 
          color: 'error.main' 
        };
      case 'primary':
      default:
        return { 
          bg: 'rgba(99, 102, 241, 0.1)', 
          color: 'primary.main' 
        };
    }
  };

  const { bg, color } = getColors();

  return (
    <Paper 
      sx={{ 
        p: 3, 
        borderRadius: '12px', 
        bgcolor: '#1E293B',
        border: '1px solid #334155',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 12px 20px -10px rgba(0, 0, 0, 0.5)'
        },
        textAlign: 'left',
        justifyContent: 'center'
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <Box 
          sx={{ 
            p: 1.5, 
            borderRadius: '12px', 
            bgcolor: bg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 48,
            height: 48,
            flexShrink: 0
          }}
        >
          {React.cloneElement(icon, { sx: { color, fontSize: '1.8rem' } })}
        </Box>
        <Typography 
          color="text.secondary" 
          variant="caption" 
          fontWeight="700" 
          sx={{ 
            letterSpacing: '0.05em', 
            textTransform: 'uppercase', 
            fontSize: '0.75rem' 
          }}
        >
          {title}
        </Typography>
      </Box>
      
      <Typography 
        variant="h4" 
        fontWeight="900" 
        sx={{ 
          letterSpacing: '-1px', 
          mb: trend ? 1 : 0,
          color: type === 'success' ? 'success.main' : type === 'error' ? 'error.main' : 'text.primary',
          fontSize: '2rem'
        }}
      >
        {value}
      </Typography>
      
      {trend && (
        <StatTrend value={trend} isPositive={trendPositive} />
      )}
    </Paper>
  );
};

export default StatCard;
