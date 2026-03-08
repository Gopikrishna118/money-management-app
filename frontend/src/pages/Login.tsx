import React, { useState, useEffect } from 'react';
import { 
  Box, Container, Paper, Typography, TextField, Button, 
  Link as MuiLink, Alert, InputAdornment, IconButton, CircularProgress 
} from '@mui/material';
import { Visibility, VisibilityOff, Email, Lock } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import notify from '../utils/notify';
import InputField from '../components/ui/InputField';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Force reset form state on page load
    setEmail('');
    setPassword('');
    setError('');
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await api.post('/auth/login', { email, password });
      login(response.data.token, response.data.user);
      notify.success("Login successful");
      navigate('/');
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Login failed. Please check your credentials.';
      setError(msg);
      notify.error("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box 
      sx={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: 'radial-gradient(circle at top left, rgba(99, 102, 241, 0.05), transparent), radial-gradient(circle at bottom right, rgba(99, 102, 241, 0.05), transparent)',
        bgcolor: 'background.default'
      }}
    >
      <Container maxWidth="xs" sx={{ animation: 'fadeInUp 0.6s ease-out' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
          <Box 
            sx={{ 
              mb: 4, 
              width: 48, 
              height: 48, 
              borderRadius: '14px', 
              background: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 16px -4px rgba(99, 102, 241, 0.5)'
            }}
          >
            <Lock sx={{ color: 'white' }} />
          </Box>
          
          <Paper 
            elevation={0} 
            sx={{ 
              p: 5, 
              width: '100%', 
              borderRadius: '12px', 
              bgcolor: 'rgba(30, 41, 59, 0.7)',
              backdropFilter: 'blur(10px)',
              border: '1px solid #334155',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
              textAlign: 'left',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start'
            }}
          >
            <Typography variant="h4" fontWeight="900" sx={{ mb: 1, letterSpacing: '-1.5px', width: '100%', textAlign: 'center' }}>
              Welcome back
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 4, fontWeight: 500, width: '100%', textAlign: 'center' }}>
              Enter your credentials to access your dashboard
            </Typography>

            {error && (
              <Alert 
                severity="error" 
                variant="outlined" 
                sx={{ mb: 3, borderRadius: '12px', bgcolor: 'rgba(239, 68, 68, 0.05)', borderColor: 'rgba(239, 68, 68, 0.2)', color: 'error.main' }}
              >
                {error}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit} noValidate autoComplete="off" sx={{ width: '100%' }}>
              {/* Autofill Trap for Edge/Chrome */}
              <input type="text" name="fake-username" style={{ display: 'none' }} aria-hidden="true" />
              <input type="password" name="fake-password" style={{ display: 'none' }} aria-hidden="true" />

              <InputField
                label="Email Address"
                placeholder="name@gmail.com"
                icon={<Email sx={{ color: 'text.secondary', fontSize: '1.2rem' }} />}
                required
                autoComplete="username"
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <InputField
                label="Password"
                placeholder="••••••••"
                type={showPassword ? 'text' : 'password'}
                icon={<Lock sx={{ color: 'text.secondary', fontSize: '1.2rem' }} />}
                endIcon={
                  <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" sx={{ color: 'text.secondary' }}>
                    {showPassword ? <VisibilityOff sx={{ fontSize: '1.2rem' }} /> : <Visibility sx={{ fontSize: '1.2rem' }} />}
                  </IconButton>
                }
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading}
                sx={{ 
                  height: 52, 
                  borderRadius: '10px', 
                  textTransform: 'none', 
                  fontSize: '1rem', 
                  fontWeight: 800,
                  boxShadow: '0 10px 15px -3px rgba(99, 102, 241, 0.3)',
                  mb: 3
                }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Log in to account'}
              </Button>

              <Box sx={{ textAlign: 'center', width: '100%' }}>
                <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500, textAlign: 'center' }}>
                  Dont have an account?{' '}
                  <MuiLink 
                    component={Link} 
                    to="/register" 
                    variant="body2" 
                    sx={{ color: 'primary.main', fontWeight: 700, textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
                  >
                    Create one here
                  </MuiLink>
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Box>
      </Container>
    </Box>
  );
};

export default Login;
