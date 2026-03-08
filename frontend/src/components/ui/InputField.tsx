import React from 'react';
import { 
  Box, Typography, TextField, TextFieldProps, 
  InputAdornment, alpha, useTheme 
} from '@mui/material';

interface InputFieldProps extends Omit<TextFieldProps, 'variant'> {
  label?: string;
  icon?: React.ReactNode;
  endIcon?: React.ReactNode;
}

const InputField: React.FC<InputFieldProps> = ({ 
  label, 
  icon, 
  endIcon, 
  ...props 
}) => {
  const theme = useTheme();

  return (
    <Box sx={{ mb: 2.5, width: '100%', textAlign: 'left' }}>
      {label && (
        <Typography 
          variant="caption" 
          sx={{ 
            ml: 0, 
            mb: 1, 
            display: 'block', 
            fontWeight: 700, 
            color: 'text.secondary', 
            textTransform: 'uppercase', 
            letterSpacing: '0.05em',
            fontSize: '0.7rem'
          }}
        >
          {label}
        </Typography>
      )}
      <TextField
        {...props}
        fullWidth
        variant="filled"
        InputProps={{
          ...props.InputProps,
          disableUnderline: true,
          startAdornment: icon ? (
            <InputAdornment 
              position="start" 
              sx={{ 
                width: 40, 
                height: '100%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                mr: 0.5,
                mt: '0 !important' // Force center
              }}
            >
              {icon}
            </InputAdornment>
          ) : null,
          endAdornment: endIcon ? (
            <InputAdornment position="end" sx={{ mt: '0 !important' }}>
              {endIcon}
            </InputAdornment>
          ) : null,
          sx: { 
            borderRadius: '10px', 
            bgcolor: 'rgba(15, 23, 42, 0.5)', 
            border: '1px solid #334155', 
            height: 52, 
            px: 1.5, 
            fontWeight: 500,
            transition: 'all 0.2s ease-in-out',
            display: 'flex',
            alignItems: 'center',
            '&.Mui-focused': {
              bgcolor: 'rgba(15, 23, 42, 0.8)',
              borderColor: 'primary.main',
              boxShadow: `0 0 0 4px ${alpha(theme.palette.primary.main, 0.15)}`,
            },
            '&:hover': {
              bgcolor: 'rgba(15, 23, 42, 0.7)',
              borderColor: 'rgba(255, 255, 255, 0.2)',
            },
            '& .MuiInputBase-input': {
              py: 0,
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              '&::placeholder': {
                color: 'text.secondary',
                opacity: 0.7,
              },
              '&:-webkit-autofill': {
                WebkitBoxShadow: '0 0 0 1000px #0f172a inset !important',
                WebkitTextFillColor: '#e5e7eb !important',
                transition: 'background-color 5000s ease-in-out 0s',
              },
            },
            ...props.InputProps?.sx
          },
        }}
      />
    </Box>
  );
};

export default InputField;
