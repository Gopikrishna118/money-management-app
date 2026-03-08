import React, { useState } from 'react';
import {
  Box, Drawer, AppBar, Toolbar, List, Typography, Divider,
  IconButton, ListItem, ListItemButton, ListItemIcon, ListItemText,
  useMediaQuery, useTheme, Avatar, Menu, MenuItem
} from '@mui/material';
import {
  Menu as MenuIcon, Dashboard as DashboardIcon, Receipt,
  Assessment, AdminPanelSettings, Logout,
  AccountBalanceWallet
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const drawerWidth = 280;

interface MenuItem {
  text: string;
  icon: React.ReactNode;
  path: string;
}

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  const menuItems: MenuItem[] = [
    { text: 'Overview', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'Income', icon: <Receipt />, path: '/income' },
    { text: 'Expenses', icon: <AccountBalanceWallet />, path: '/expenses' },
    { text: 'Reports', icon: <Assessment />, path: '/reports' },
  ];

  if (user?.role === 'admin') {
    menuItems.push({ text: 'Admin', icon: <AdminPanelSettings />, path: '/admin' });
  }

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: 'background.paper', borderRight: '1px solid rgba(255, 255, 255, 0.05)' }}>
      <Toolbar sx={{ py: 3, display: 'flex', justifyContent: 'center' }}>
        <Typography 
          variant="h5" 
          sx={{ 
            fontWeight: 900, 
            letterSpacing: '-1px', 
            background: 'linear-gradient(135deg, #818cf8 0%, #6366f1 100%)', 
            WebkitBackgroundClip: 'text', 
            WebkitTextFillColor: 'transparent',
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}
        >
          <AccountBalanceWallet sx={{ WebkitTextFillColor: '#6366f1', fontSize: '1.8rem' }} />
          MONEYTRACKER
        </Typography>
      </Toolbar>
      
      <Box sx={{ px: 2, mb: 2 }}>
        <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, px: 2, mb: 1, display: 'block', letterSpacing: '1px' }}>
          MAIN MENU
        </Typography>
        <List sx={{ pt: 0 }}>
          {menuItems.map((item) => (
            <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
              <ListItemButton 
                onClick={() => { navigate(item.path); if (isMobile) setMobileOpen(false); }}
                selected={location.pathname === item.path}
                sx={{ 
                  borderRadius: '10px',
                  py: 1.5,
                  px: 2,
                  transition: 'all 0.2s',
                  '&.Mui-selected': {
                    bgcolor: '#6366F1', // Accent Background for Active
                    color: '#ffffff',
                    '& .MuiListItemIcon-root': { color: '#ffffff' },
                    '&:hover': { bgcolor: '#4F46E5' }
                  },
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 0.05)',
                  }
                }}
              >
                <ListItemIcon sx={{ minWidth: 36, color: location.pathname === item.path ? 'primary.light' : 'text.secondary' }}>
                  {React.cloneElement(item.icon as React.ReactElement, { sx: { fontSize: 20 } })}
                </ListItemIcon>
                <ListItemText 
                  primary={item.text} 
                  primaryTypographyProps={{ fontWeight: location.pathname === item.path ? 700 : 500, fontSize: '0.9rem' }} 
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>

      <Box sx={{ mt: 'auto', p: 2 }}>
        <Divider sx={{ mb: 2, opacity: 0.05 }} />
        <ListItem disablePadding>
          <ListItemButton 
            onClick={() => { logout(); navigate('/login'); }}
            sx={{ 
              borderRadius: '8px', 
              color: 'text.secondary',
              '&:hover': { 
                bgcolor: 'rgba(239, 68, 68, 0.08)', 
                color: '#ef4444', 
                '& .MuiListItemIcon-root': { color: '#ef4444' } 
              } 
            }}
          >
            <ListItemIcon sx={{ minWidth: 36, color: 'inherit' }}><Logout sx={{ fontSize: 20 }} /></ListItemIcon>
            <ListItemText primary="Sign Out" primaryTypographyProps={{ fontWeight: 600, fontSize: '0.9rem' }} />
          </ListItemButton>
        </ListItem>
      </Box>
    </Box>
  );

  if (!user) return <>{children}</>;

  return (
    <Box sx={{ display: 'flex', bgcolor: 'background.default', minHeight: '100vh' }}>
      <AppBar 
        position="fixed" 
        sx={{ 
          width: { sm: `calc(100% - ${drawerWidth}px)` }, 
          ml: { sm: `${drawerWidth}px` },
          bgcolor: 'rgba(15, 23, 42, 0.7)',
          backdropFilter: 'blur(12px)',
          boxShadow: 'none',
          zIndex: (theme) => theme.zIndex.drawer + 1
        }}
      >
        <Toolbar sx={{ px: { xs: 2, sm: 4 } }}>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h6" fontWeight="800" sx={{ color: 'text.primary', letterSpacing: '-0.5px' }}>
              {menuItems.find(m => m.path === location.pathname)?.text || 'Overview'}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary', display: { xs: 'none', sm: 'block' } }}>
              Welcome back, {user.username}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <Box sx={{ textAlign: 'right', display: { xs: 'none', md: 'block' } }}>
              <Typography variant="subtitle2" fontWeight="700" sx={{ lineHeight: 1.2 }}>{user.username}</Typography>
              <Typography variant="caption" color="primary.light" sx={{ fontWeight: 700, letterSpacing: '0.5px' }}>{user.role.toUpperCase()}</Typography>
            </Box>
            <IconButton 
              onClick={(e) => setAnchorEl(e.currentTarget)} 
              sx={{ 
                p: 0, 
                border: '2px solid', 
                borderColor: 'rgba(99, 102, 241, 0.2)',
                transition: 'border-color 0.2s',
                '&:hover': { borderColor: 'primary.main' }
              }}
            >
              <Avatar 
                alt={user.username} 
                sx={{ 
                  width: 36, 
                  height: 36, 
                  bgcolor: 'primary.main',
                  fontWeight: 700,
                  fontSize: '0.9rem'
                }}
              >
                {user.username[0].toUpperCase()}
              </Avatar>
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, border: 'none' },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, border: 'none' },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{ 
          flexGrow: 1, 
          p: { xs: 2, sm: 4, md: 6 }, 
          width: { sm: `calc(100% - ${drawerWidth}px)` }, 
          mt: '64px',
          bgcolor: 'background.default'
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default Layout;
