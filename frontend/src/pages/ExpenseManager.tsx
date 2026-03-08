import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, Paper, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, IconButton, Button, 
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, 
  MenuItem, Select, FormControl, InputLabel, Chip 
} from '@mui/material';
import { Add, Delete, Edit } from '@mui/icons-material';
import api from '../services/api';
import notify from '../utils/notify';
import InputField from '../components/ui/InputField';
import SelectField from '../components/ui/SelectField';
import { AttachMoney, Description, CalendarToday } from '@mui/icons-material';

const ExpenseManager: React.FC = () => {
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const fetchData = async () => {
    try {
      const [transResp, catResp] = await Promise.all([
        api.get('/transactions?type=expense'),
        api.get('/categories')
      ]);
      setExpenses(transResp.data);
      setCategories(catResp.data.filter((c: any) => c.type === 'expense'));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async () => {
    if (!amount || Number(amount) <= 0) {
      notify.error('Amount must be greater than 0');
      setLoading(false);
      return;
    }
    if (!categoryId) {
      notify.error('Please select a category');
      setLoading(false);
      return;
    }
    if (!description.trim()) {
      notify.error('Description cannot be empty');
      setLoading(false);
      return;
    }
    try {
      await api.post('/transactions', {
        amount: parseFloat(amount),
        type: 'expense',
        category_id: categoryId,
        description,
        transaction_date: date
      });
      setOpen(false);
      setAmount('');
      setDescription('');
      notify.success("Expense added successfully");
      fetchData();
    } catch (err) {
      notify.error('Failed to add expense');
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Delete this record?')) {
      try {
        await api.delete(`/transactions/${id}`);
        notify.success("Expense removed");
        fetchData();
      } catch (err) {
        notify.error("Failed to remove expense");
      }
    }
  };

  return (
    <Box sx={{ animation: 'fadeIn 0.5s ease-out' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 6, alignItems: 'flex-start' }}>
        <Box>
          <Typography variant="h4" fontWeight="900" sx={{ letterSpacing: '-1.5px', mb: 1 }}>Expense Manager</Typography>
          <Typography variant="body1" color="text.secondary" fontWeight="500">Track and optimize your spending habits.</Typography>
        </Box>
        <Button 
          variant="contained" 
          color="error"
          startIcon={<Add />} 
          onClick={() => setOpen(true)}
          sx={{ borderRadius: '12px', textTransform: 'none', fontWeight: 700, py: 1.5, px: 3 }}
        >
          Add Expense
        </Button>
      </Box>

      <TableContainer component={Paper} sx={{ borderRadius: '24px', overflow: 'hidden', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: 'rgba(255, 255, 255, 0.02)' }}>
              <TableCell sx={{ fontWeight: '800', color: 'text.secondary', py: 2.5, px: 4 }}>DATE</TableCell>
              <TableCell sx={{ fontWeight: '800', color: 'text.secondary', py: 2.5 }}>CATEGORY</TableCell>
              <TableCell sx={{ fontWeight: '800', color: 'text.secondary', py: 2.5 }}>DESCRIPTION</TableCell>
              <TableCell align="right" sx={{ fontWeight: '800', color: 'text.secondary', py: 2.5 }}>AMOUNT</TableCell>
              <TableCell align="center" sx={{ fontWeight: '800', color: 'text.secondary', py: 2.5, px: 4 }}>ACTIONS</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {expenses.map((row: any, idx: number) => (
              <TableRow 
                key={row.id} 
                hover
                sx={{ 
                  bgcolor: idx % 2 === 0 ? 'transparent' : 'rgba(255, 255, 255, 0.01)',
                  '&:last-child td, &:last-child th': { border: 0 },
                  transition: 'background 0.2s'
                }}
              >
                <TableCell sx={{ px: 4, py: 2.5, color: 'text.secondary', fontWeight: 600 }}>
                  {new Date(row.transaction_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                </TableCell>
                <TableCell>
                  <Chip 
                    label={row.category_name} 
                    size="small" 
                    variant="outlined" 
                    sx={{ 
                      bgcolor: 'rgba(239, 68, 68, 0.1)', 
                      color: 'error.main', 
                      fontWeight: 800, 
                      border: 'none', 
                      borderRadius: '8px',
                      fontSize: '0.7rem'
                    }} 
                  />
                </TableCell>
                <TableCell sx={{ fontWeight: 700 }}>{row.description}</TableCell>
                <TableCell align="right" sx={{ fontWeight: '900', color: 'error.main', fontSize: '1rem' }}>
                  -${parseFloat(row.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </TableCell>
                <TableCell align="center" sx={{ px: 4 }}>
                  <IconButton size="small" sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main', bgcolor: 'rgba(99, 102, 241, 0.1)' } }}>
                    <Edit fontSize="small" />
                  </IconButton>
                  <IconButton size="small" onClick={() => handleDelete(row.id)} sx={{ color: 'text.secondary', '&:hover': { color: 'error.main', bgcolor: 'rgba(239, 68, 68, 0.1)' } }}>
                    <Delete fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog 
        open={open} 
        onClose={() => setOpen(false)} 
        fullWidth 
        maxWidth="xs"
        PaperProps={{
          sx: { borderRadius: '28px', p: 1, bgcolor: 'background.paper', backgroundImage: 'none' }
        }}
      >
        <DialogTitle sx={{ fontWeight: 900, letterSpacing: '-0.5px', pt: 3, px: 3 }}>Add New Expense</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', pt: 1, px: 3 }}>
          <InputField
            label="Amount ($)"
            type="number"
            placeholder="0.00"
            icon={<AttachMoney sx={{ color: 'text.secondary', fontSize: '1.2rem' }} />}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          
          <SelectField
            label="Category"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value as string)}
            options={categories.map((c: any) => ({ value: c.id, label: c.name }))}
          />

          <InputField
            label="Description"
            placeholder="E.g. Grocery shopping"
            icon={<Description sx={{ color: 'text.secondary', fontSize: '1.2rem' }} />}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <InputField
            label="Date"
            type="date"
            icon={<CalendarToday sx={{ color: 'text.secondary', fontSize: '1.2rem' }} />}
            value={date}
            onChange={(e) => setDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 1 }}>
          <Button onClick={() => setOpen(false)} sx={{ fontWeight: 700, textTransform: 'none', color: 'text.secondary' }}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" color="error" sx={{ fontWeight: 800, textTransform: 'none', px: 4, borderRadius: '10px' }}>Save Expense</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ExpenseManager;
