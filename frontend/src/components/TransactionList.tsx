import React from 'react';
import api from '../services/api';
import notify from '../utils/notify';
import { 
  Table, TableBody, TableCell, TableContainer, TableHead, 
  TableRow, Paper, IconButton, Chip, Typography, Box 
} from '@mui/material';
import { Delete as DeleteIcon, TrendingUp, TrendingDown } from '@mui/icons-material';

interface Transaction {
  id: number;
  amount: string;
  type: string;
  category_name: string;
  description: string;
  transaction_date: string;
}

const TransactionList: React.FC<{ transactions: Transaction[], onTransactionDeleted: () => void }> = ({ transactions, onTransactionDeleted }) => {
  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      try {
        await api.delete(`/transactions/${id}`);
        notify.success("Transaction removed");
        onTransactionDeleted();
      } catch (err) {
        console.error('Failed to delete transaction:', err);
        notify.error("Failed to remove transaction");
      }
    }
  };

  if (transactions.length === 0) {
    return (
      <Box sx={{ py: 6, textAlign: 'center' }}>
        <Typography color="text.secondary">No recent transactions found.</Typography>
      </Box>
    );
  }

  return (
    <TableContainer component={Box} sx={{ maxHeight: 600, overflow: 'auto' }}>
      <Table stickyHeader size="small">
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: '800', color: 'text.secondary', py: 2.5, px: 4, bgcolor: 'background.paper', letterSpacing: '0.05em' }}>DATE</TableCell>
            <TableCell sx={{ fontWeight: '800', color: 'text.secondary', py: 2.5, bgcolor: 'background.paper', letterSpacing: '0.05em' }}>DESCRIPTION</TableCell>
            <TableCell sx={{ fontWeight: '800', color: 'text.secondary', py: 2.5, bgcolor: 'background.paper', letterSpacing: '0.05em' }}>CATEGORY</TableCell>
            <TableCell sx={{ fontWeight: '800', color: 'text.secondary', py: 2.5, bgcolor: 'background.paper', letterSpacing: '0.05em' }}>AMOUNT</TableCell>
            <TableCell align="right" sx={{ fontWeight: '800', color: 'text.secondary', py: 2.5, px: 4, bgcolor: 'background.paper', letterSpacing: '0.05em' }}>ACTION</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {transactions.map((t, idx) => (
            <TableRow 
              key={t.id} 
              hover 
              sx={{ 
                bgcolor: idx % 2 === 0 ? 'transparent' : 'rgba(255, 255, 255, 0.01)',
                '&:last-child td, &:last-child th': { border: 0 },
                transition: 'background 0.2s',
                '& .MuiTableCell-root': { py: 2.5, borderBottom: '1px solid rgba(255, 255, 255, 0.03)' }
              }}
            >
              <TableCell sx={{ px: 4, color: 'text.secondary', fontWeight: 600 }}>
                {new Date(t.transaction_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
              </TableCell>
              <TableCell>
                <Typography fontWeight="700" sx={{ color: 'text.primary' }}>{t.description}</Typography>
              </TableCell>
              <TableCell>
                <Chip 
                  label={t.category_name} 
                  size="small" 
                  variant="outlined"
                  sx={{ 
                    borderRadius: '8px', 
                    fontWeight: 700, 
                    fontSize: '0.7rem',
                    bgcolor: 'rgba(255, 255, 255, 0.03)',
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                    color: 'text.secondary'
                  }} 
                />
              </TableCell>
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Box sx={{ 
                    width: 28, 
                    height: 28, 
                    borderRadius: '8px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    bgcolor: t.type === 'income' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)'
                  }}>
                    {t.type === 'income' ? (
                      <TrendingUp sx={{ color: 'success.main', fontSize: '1rem' }} />
                    ) : (
                      <TrendingDown sx={{ color: 'error.main', fontSize: '1rem' }} />
                    )}
                  </Box>
                  <Typography sx={{ fontWeight: '900', fontSize: '1rem', color: t.type === 'income' ? 'success.main' : 'error.main' }}>
                    {t.type === 'income' ? '+' : '-'}${parseFloat(t.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell align="right" sx={{ px: 4 }}>
                <IconButton 
                  size="small" 
                  onClick={() => handleDelete(t.id)}
                  sx={{ 
                    color: 'text.secondary', 
                    '&:hover': { color: 'error.main', bgcolor: 'rgba(239, 68, 68, 0.1)' },
                    transition: 'all 0.2s'
                  }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TransactionList;
