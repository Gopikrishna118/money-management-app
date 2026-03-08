import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid, Paper, Card, CardContent, Divider } from '@mui/material';
import { TrendingUp, TrendingDown, AccountBalanceWallet } from '@mui/icons-material';
import api from '../services/api';
import StatCard from '../components/ui/StatCard';
import TransactionList from '../components/TransactionList';

const Dashboard: React.FC = () => {
  const [summary, setSummary] = useState({ income: 0, expense: 0, balance: 0 });
  const [recentTransactions, setRecentTransactions] = useState([]);

  const fetchData = async () => {
    try {
      const response = await api.get('/transactions');
      const transactions = response.data;
      
      const income = transactions.filter((t: any) => t.type === 'income').reduce((acc: number, t: any) => acc + parseFloat(t.amount), 0);
      const expense = transactions.filter((t: any) => t.type === 'expense').reduce((acc: number, t: any) => acc + parseFloat(t.amount), 0);
      
      setSummary({ income, expense, balance: income - expense });
      setRecentTransactions(transactions.slice(0, 5));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Box sx={{ animation: 'fadeIn 0.5s ease-out' }}>
      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" fontWeight="900" sx={{ letterSpacing: '-1.5px', color: 'text.primary', mb: 1 }}>
          Financial Overview
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary', fontWeight: 500 }}>
          Manage your transactions and track your financial health in real-time.
        </Typography>
      </Box>
      
      <Grid container spacing={4} sx={{ mb: 6 }}>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <StatCard
            title="Current Balance"
            value={`$${summary.balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
            icon={<AccountBalanceWallet />}
            type="primary"
            trend="+12.5% from last month"
            trendPositive={true}
          />
        </Grid>
        
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <StatCard
            title="Total Income"
            value={`$${summary.income.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
            icon={<TrendingUp />}
            type="success"
            trend="+8.2% vs avg"
            trendPositive={true}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 12, md: 4 }}>
          <StatCard
            title="Total Expenses"
            value={`$${summary.expense.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
            icon={<TrendingDown />}
            type="error"
            trend="-3.1% reduction"
            trendPositive={false}
          />
        </Grid>
      </Grid>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" sx={{ mb: 1, fontWeight: '900', letterSpacing: '-0.5px' }}>
          Recent Activity
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Your latest financial movements at a glance.
        </Typography>
        <Paper sx={{ borderRadius: '12px', overflow: 'hidden', bgcolor: 'background.paper' }}>
          <TransactionList transactions={recentTransactions} onTransactionDeleted={fetchData} />
        </Paper>
      </Box>
    </Box>
  );
};

export default Dashboard;
