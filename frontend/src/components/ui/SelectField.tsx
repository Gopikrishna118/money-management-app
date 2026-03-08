import React from 'react';
import { 
  Box, Typography, Select, SelectProps, 
  MenuItem, FormControl, alpha, useTheme 
} from '@mui/material';

interface SelectFieldProps extends Omit<SelectProps, 'variant'> {
  label?: string;
  placeholder?: string;
  options: { value: string | number; label: string }[];
}

const SelectField: React.FC<SelectFieldProps> = ({ 
  label, 
  options, 
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
      <FormControl fullWidth variant="filled">
        <Select
          {...props}
          disableUnderline
          sx={{ 
            borderRadius: '10px', 
            bgcolor: 'rgba(15, 23, 42, 0.5)', 
            border: '1px solid #334155', 
            height: 52, 
            px: 1.5, 
            fontWeight: 500,
            transition: 'all 0.2s ease-in-out',
            '&.Mui-focused': {
              bgcolor: 'rgba(15, 23, 42, 0.8)',
              borderColor: 'primary.main',
              boxShadow: `0 0 0 4px ${alpha(theme.palette.primary.main, 0.15)}`,
            },
            '&:hover': {
              bgcolor: 'rgba(15, 23, 42, 0.7)',
              borderColor: 'rgba(255, 255, 255, 0.2)',
            },
            '& .MuiSelect-select': {
              py: 0,
              height: '100%',
              display: 'flex',
              alignItems: 'center',
            },
            ...props.sx
          }}
        >
          {props.displayEmpty && props.value === '' && (
            <MenuItem value="" disabled>
              {props.placeholder || 'Select'}
            </MenuItem>
          )}
          {options.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default SelectField;
