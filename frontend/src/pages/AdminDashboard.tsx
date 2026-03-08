import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Avatar, Chip, Button, Divider } from '@mui/material';
import { Refresh as RefreshIcon } from '@mui/icons-material';
import api from '../services/api';
import notify from '../utils/notify';
import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const AdminDashboard: React.FC = () => {
  const [data, setData] = useState<any>(null);

  const fetchData = async () => {
    try {
      const response = await api.get('/admin/dashboard');
      console.log('Admin Dashboard Data:', response.data);
      setData(response.data);
      notify.success("Data refreshed successfully");
    } catch (err) {
      console.error('Failed to fetch admin data:', err);
      notify.error("Failed to refresh data");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (!data) return <Typography>Loading Admin Analytics...</Typography>;

  const barData = {
    labels: data.users.map((u: any) => u.name),
    datasets: [
      {
        label: 'Income',
        data: data.users.map((u: any) => u.totalIncome),
        backgroundColor: '#10b981', // Keep success green for clarity
        borderRadius: 4,
      },
      {
        label: 'Expense',
        data: data.users.map((u: any) => u.totalExpense),
        backgroundColor: '#ef4444', // Keep error red for clarity
        borderRadius: 4,
      },
    ],
  };

  const pieData = {
    labels: ['Group Income', 'Group Expense'],
    datasets: [
      {
        data: [data.totalIncome, data.totalExpense],
        backgroundColor: ['#10b981', '#ef4444'],
        borderWidth: 0,
      },
    ],
  };

  const chartOptions = {
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          usePointStyle: true,
          padding: 20,
          font: { family: 'Inter', size: 12, weight: 'bold' as const }
        }
      },
      tooltip: {
        backgroundColor: '#1e293b',
        titleFont: { family: 'Inter', size: 14, weight: 'bold' as const },
        bodyFont: { family: 'Inter', size: 13 },
        padding: 12,
        cornerRadius: 8,
        displayColors: true,
      }
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { font: { family: 'Inter', weight: 'bold' as const } }
      },
      y: {
        grid: { color: '#334155' }, // Centralized Border Color
        ticks: { font: { family: 'Inter' } }
      }
    }
  };

  return (
    <Box sx={{ animation: 'fadeIn 0.5s ease-out' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 6 }}>
        <Box>
          <Typography variant="h4" fontWeight="900" sx={{ letterSpacing: '-1.5px', mb: 1 }}>
            Admin Dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary" fontWeight="500">
            System-wide overview of family financial activity.
          </Typography>
        </Box>
        <Button 
          variant="contained" 
          onClick={fetchData}
          startIcon={<RefreshIcon />}
          sx={{ 
            borderRadius: '10px', // Button System Spec (10px)
            textTransform: 'none',
            fontWeight: 700,
            py: 1.5,
            px: 2.5
          }}
        >
          Refresh Analytics
        </Button>
      </Box>
      
      <Grid container spacing={4} sx={{ mb: 6 }}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 3, height: '450px', borderRadius: '12px', position: 'relative' }}>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: '800', letterSpacing: '-0.5px' }}>
              Group Total Overview
            </Typography>
            <Box sx={{ height: '320px' }}>
              <Pie data={pieData} options={chartOptions} />
            </Box>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 3, height: '450px', borderRadius: '12px', position: 'relative' }}>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: '800', letterSpacing: '-0.5px' }}>
              User Activity Comparison
            </Typography>
            <Box sx={{ height: '320px' }}>
              <Bar data={barData} options={chartOptions} />
            </Box>
          </Paper>
        </Grid>
      </Grid>

      <Typography variant="h5" sx={{ mb: 3, fontWeight: '900', letterSpacing: '-0.5px' }}>
        Family Members Analysis
      </Typography>
      <TableContainer component={Paper} sx={{ p: 0, borderRadius: '12px', overflow: 'hidden' }}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: 'rgba(255, 255, 255, 0.02)' }}>
              <TableCell sx={{ fontWeight: '800', color: 'text.secondary', py: 2.5, px: 4 }}>MEMBER</TableCell>
              <TableCell sx={{ fontWeight: '800', color: 'text.secondary', py: 2.5 }}>EMAIL</TableCell>
              <TableCell align="right" sx={{ fontWeight: '800', color: 'text.secondary', py: 2.5 }}>TOTAL INCOME</TableCell>
              <TableCell align="right" sx={{ fontWeight: '800', color: 'text.secondary', py: 2.5 }}>TOTAL EXPENSE</TableCell>
              <TableCell align="center" sx={{ fontWeight: '800', color: 'text.secondary', py: 2.5, px: 4 }}>STATUS</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.users.map((user: any, idx: number) => (
              <TableRow 
                key={user.email} 
                hover 
                sx={{ 
                  bgcolor: idx % 2 === 0 ? 'transparent' : 'rgba(255, 255, 255, 0.01)',
                  '&:last-child td, &:last-child th': { border: 0 },
                  transition: 'background 0.2s'
                }}
              >
                <TableCell sx={{ px: 4, py: 2.5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar 
                      sx={{ 
                        bgcolor: 'primary.main', 
                        width: 40, 
                        height: 40, 
                        fontWeight: 700,
                        fontSize: '0.9rem',
                        border: '2px solid rgba(255, 255, 255, 0.1)'
                      }}
                    >
                      {user.name?.[0].toUpperCase() || 'U'}
                    </Avatar>
                    <Typography fontWeight="700">{user.name}</Typography>
                  </Box>
                </TableCell>
                <TableCell sx={{ color: 'text.secondary', fontWeight: 500 }}>{user.email}</TableCell>
                <TableCell align="right">
                  <Typography fontWeight="800" sx={{ color: 'success.main' }}>
                    +${user.totalIncome.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography fontWeight="800" sx={{ color: 'error.main' }}>
                    -${user.totalExpense.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </Typography>
                </TableCell>
                <TableCell align="center" sx={{ px: 4 }}>
                  <Chip 
                    label={user.totalIncome >= user.totalExpense ? 'Healthy' : 'Overspending'} 
                    size="small"
                    variant="outlined"
                    sx={{ 
                      fontWeight: '700', 
                      borderRadius: '8px', 
                      border: 'none', 
                      bgcolor: user.totalIncome >= user.totalExpense ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                      color: user.totalIncome >= user.totalExpense ? 'success.main' : 'error.main',
                      px: 1
                    }}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default AdminDashboard;
