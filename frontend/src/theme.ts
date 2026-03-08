import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#6366F1', // Primary Accent
      dark: '#4F46E5', // Accent Hover
    },
    background: {
      default: '#0F172A', // Primary Background
      paper: '#1E293B',   // Card Background
    },
    text: {
      primary: '#E5E7EB',
      secondary: '#94A3B8',
    },
    success: {
      main: '#22C55E', // Income
    },
    error: {
      main: '#EF4444', // Expense
    },
    divider: '#334155', // Border Color
  },
  typography: {
    fontFamily: '"Inter", sans-serif',
    h1: { fontSize: '32px', fontWeight: 800, letterSpacing: '-0.02em' },
    h2: { fontSize: '24px', fontWeight: 800, letterSpacing: '-0.02em' },
    h3: { fontSize: '20px', fontWeight: 700, letterSpacing: '-0.01em' },
    body1: { fontSize: '16px', lineHeight: 1.6 },
    body2: { fontSize: '14px' },
    caption: { fontSize: '12px' },
    button: { fontWeight: 600, textTransform: 'none' },
  },
  spacing: [0, 4, 8, 16, 24, 32, 48], // xs, sm, md, lg, xl, xxl
  shape: {
    borderRadius: 12, // Standard Card Radius
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '10px', // Button System Spec
          padding: '12px 20px',
          fontWeight: 700,
        },
        containedPrimary: {
          '&:hover': {
            backgroundColor: '#4F46E5', // Accent Hover
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          padding: '24px', // Standard Card Padding
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          backgroundImage: 'none',
          border: '1px solid #334155',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '10px', // Input Field System Spec
            backgroundColor: 'rgba(0, 0, 0, 0.2)',
            '& fieldset': { borderColor: '#334155' },
            '&:hover fieldset': { borderColor: '#94A3B8' },
            '&.Mui-focused fieldset': { borderColor: '#6366F1' },
          },
        },
      },
    },
  },
});

export default theme;
