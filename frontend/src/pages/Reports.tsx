import React, { useEffect, useState } from 'react';
import { Box, Grid, Paper, Typography, Divider } from '@mui/material';
import { Pie, Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import api from '../services/api';
import StatusBadge from '../components/StatusBadge';

ChartJS.register(
  CategoryScale, LinearScale, BarElement, Title, Tooltip, 
  Legend, ArcElement, PointElement, LineElement
);

const Reports: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [rankings, setRankings] = useState<any>(null);
  const user = JSON.parse(sessionStorage.getItem('user') || '{}');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/transactions');
        const transactions = response.data;

        // Process Category Spending
        const expenses = transactions.filter((t: any) => t.type === 'expense');
        const catMap: any = {};
        expenses.forEach((e: any) => {
          catMap[e.category_name] = (catMap[e.category_name] || 0) + parseFloat(e.amount);
        });

        // Process Income vs Expense
        const totalIncome = transactions.filter((t: any) => t.type === 'income').reduce((acc: number, t: any) => acc + parseFloat(t.amount), 0);
        const totalExpense = transactions.filter((t: any) => t.type === 'expense').reduce((acc: number, t: any) => acc + parseFloat(t.amount), 0);

        setData({
          categoryLabels: Object.keys(catMap),
          categoryValues: Object.values(catMap),
          totalIncome,
          totalExpense,
        });

        if (user.role === 'admin') {
          const rankRes = await api.get('/admin/reports/rankings');
          setRankings(rankRes.data);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchStats();
  }, []);

  if (!data) return <Typography>Loading...</Typography>;

  const getRankEmoji = (index: number) => {
    if (index === 0) return '🥇';
    if (index === 1) return '🥈';
    if (index === 2) return '🥉';
    return `#${index + 1}`;
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
        padding: 12,
        cornerRadius: 8,
      }
    },
    scales: {
      x: { grid: { display: false }, ticks: { font: { family: 'Inter', weight: 'bold' as const } } },
      y: { grid: { color: '#334155' }, ticks: { font: { family: 'Inter' } } }
    }
  };

  return (
    <Box sx={{ animation: 'fadeIn 0.5s ease-out' }}>
      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" fontWeight="900" sx={{ letterSpacing: '-1.5px', mb: 1 }}>
          Financial Reports
        </Typography>
        <Typography variant="body1" color="text.secondary" fontWeight="500">
          In-depth analysis of your group's earning and spending patterns.
        </Typography>
      </Box>
      
      <Grid container spacing={4}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 3, height: '450px', borderRadius: '12px' }}>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: '800', letterSpacing: '-0.5px' }}>
              Income vs Expense Summary
            </Typography>
            <Box sx={{ height: '320px' }}>
              <Pie 
                data={{
                  labels: ['Income', 'Expense'],
                  datasets: [{
                    data: [data.totalIncome, data.totalExpense],
                    backgroundColor: ['#22c55e', '#ef4444'],
                    borderWidth: 0,
                  }]
                }} 
                options={chartOptions}
              />
            </Box>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 3, height: '450px', borderRadius: '12px' }}>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: '800', letterSpacing: '-0.5px' }}>
              Spending by Category
            </Typography>
            <Box sx={{ height: '320px' }}>
              <Bar 
                data={{
                  labels: data.categoryLabels,
                  datasets: [{
                    label: 'Amount ($)',
                    data: data.categoryValues,
                    backgroundColor: '#6366f1',
                    borderRadius: 8,
                  }]
                }}
                options={chartOptions}
              />
            </Box>
          </Paper>
        </Grid>

        {rankings && (
          <Grid size={{ xs: 12 }}>
            <Box sx={{ mt: 6, mb: 4 }}>
              <Typography variant="h5" sx={{ fontWeight: '900', letterSpacing: '-1px' }}>
                Top Financial Rankings
              </Typography>
              <Typography variant="body2" color="text.secondary" fontWeight="500">
                Leaderboard of the highest earners and spenders in the group.
              </Typography>
            </Box>
            <Grid container spacing={4}>
              {/* Top Earners Card */}
              <Grid size={{ xs: 12, md: 6 }}>
                <Paper sx={{ p: 3, borderRadius: '12px', position: 'relative', overflow: 'hidden' }}>
                  <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '4px', bgcolor: 'success.main' }} />
                  <Typography variant="h6" sx={{ mb: 4, fontWeight: '800', display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box sx={{ p: 1, bgcolor: 'rgba(34, 197, 94, 0.1)', borderRadius: '10px', display: 'flex' }}>
                      🚀
                    </Box>
                    Top Earners
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    {rankings.topEarners.length > 0 ? rankings.topEarners.map((u: any, i: number) => (
                      <Box 
                        key={i} 
                        sx={{ 
                          display: 'flex', 
                          justifyContent: 'space-between', 
                          alignItems: 'center',
                          p: 2, 
                          borderRadius: '16px',
                          bgcolor: i === 0 ? 'rgba(34, 197, 94, 0.05)' : 'transparent',
                          border: i === 0 ? '1px solid rgba(34, 197, 94, 0.1)' : '1px solid transparent',
                          transition: 'all 0.2s',
                          '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.02)', borderColor: 'rgba(255, 255, 255, 0.05)' }
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5 }}>
                          <Typography sx={{ fontSize: '1.4rem', filter: i > 2 ? 'grayscale(1)' : 'none' }}>{getRankEmoji(i)}</Typography>
                          <Box>
                            <Typography sx={{ fontWeight: 800 }}>{u.name}</Typography>
                            <StatusBadge 
                              type={i === 0 ? 'healthy' : 'neutral'} 
                              label={`RANK #${i + 1}`} 
                            />
                          </Box>
                        </Box>
                        <Box sx={{ textAlign: 'right' }}>
                          <Typography sx={{ fontWeight: 900, color: 'success.main', fontSize: '1.1rem' }}>
                            +${u.totalIncome.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                          </Typography>
                        </Box>
                      </Box>
                    )) : (
                      <Typography color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>No data available</Typography>
                    )}
                  </Box>
                </Paper>
              </Grid>

              {/* Top Spenders Card */}
              <Grid size={{ xs: 12, md: 6 }}>
                <Paper sx={{ p: 3, borderRadius: '12px', position: 'relative', overflow: 'hidden' }}>
                  <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '4px', bgcolor: 'error.main' }} />
                  <Typography variant="h6" sx={{ mb: 4, fontWeight: '800', display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box sx={{ p: 1, bgcolor: 'rgba(239, 68, 68, 0.1)', borderRadius: '10px', display: 'flex' }}>
                       💸
                    </Box>
                    Top Spenders
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    {rankings.topSpenders.length > 0 ? rankings.topSpenders.map((u: any, i: number) => (
                      <Box 
                        key={i} 
                        sx={{ 
                          display: 'flex', 
                          justifyContent: 'space-between', 
                          alignItems: 'center',
                          p: 2, 
                          borderRadius: '16px',
                          bgcolor: i === 0 ? 'rgba(239, 68, 68, 0.05)' : 'transparent',
                          border: i === 0 ? '1px solid rgba(239, 68, 68, 0.1)' : '1px solid transparent',
                          transition: 'all 0.2s',
                          '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.02)', borderColor: 'rgba(255, 255, 255, 0.05)' }
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5 }}>
                          <Typography sx={{ fontSize: '1.4rem', filter: i > 2 ? 'grayscale(1)' : 'none' }}>{getRankEmoji(i)}</Typography>
                          <Box>
                            <Typography sx={{ fontWeight: 800 }}>{u.name}</Typography>
                            <StatusBadge 
                              type={i === 0 ? 'overspending' : 'neutral'} 
                              label={`RANK #${i + 1}`} 
                            />
                          </Box>
                        </Box>
                        <Box sx={{ textAlign: 'right' }}>
                          <Typography sx={{ fontWeight: 900, color: 'error.main', fontSize: '1.1rem' }}>
                            -${u.totalExpense.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                          </Typography>
                        </Box>
                      </Box>
                    )) : (
                      <Typography color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>No data available</Typography>
                    )}
                  </Box>
                </Paper>
              </Grid>
            </Grid>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default Reports;
