import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, TextField, Button, MenuItem, 
  Select, FormControl, InputLabel, Paper, InputAdornment 
} from '@mui/material';
import { AttachMoney, Category as CategoryIcon, Description, List, SwapHoriz } from '@mui/icons-material';
import api from '../services/api';
import InputField from './ui/InputField';
import SelectField from './ui/SelectField';

interface Category {
  id: number;
  name: string;
  type: string;
}

const TransactionForm: React.FC<{ onTransactionAdded: () => void }> = ({ onTransactionAdded }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('expense');
  const [categoryId, setCategoryId] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const resp = await api.get('/categories');
        setCategories(resp.data);
      } catch (err) {
        console.error('Failed to fetch categories', err);
      }
    };
    fetchCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/transactions', {
        amount: parseFloat(amount),
        type,
        category_id: parseInt(categoryId),
        description,
      });
      setAmount('');
      setDescription('');
      setCategoryId('');
      onTransactionAdded();
    } catch (err) {
      console.error('Failed to add transaction', err);
      alert('Failed to add transaction');
    }
  };

  return (
    <Paper 
      elevation={0} 
      sx={{ 
        p: 4, 
        borderRadius: '24px', 
        bgcolor: 'background.paper',
        border: '1px solid rgba(255, 255, 255, 0.05)'
      }}
    >
      <Typography variant="h6" fontWeight="800" sx={{ mb: 3, letterSpacing: '-0.5px' }}>
        Add Quick Transaction
      </Typography>
      
      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
        <InputField
          label="Amount"
          type="number"
          placeholder="0.00"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
          icon={<AttachMoney sx={{ fontSize: '1.2rem', color: 'text.secondary' }} />}
        />

        <Box sx={{ display: 'flex', gap: 2 }}>
          <Box sx={{ flex: 1 }}>
            <SelectField
              label="Type"
              value={type}
              onChange={(e) => setType(e.target.value as string)}
              options={[
                { value: 'expense', label: 'Expense' },
                { value: 'income', label: 'Income' }
              ]}
            />
          </Box>

          <Box sx={{ flex: 1 }}>
            <SelectField
              label="Category"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value as string)}
              required
              options={categories.filter(c => c.type === type).map(c => ({ value: c.id, label: c.name }))}
              displayEmpty
            />
          </Box>
        </Box>

        <InputField
          label="Description"
          placeholder="What was this for?"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          icon={<Description sx={{ fontSize: '1.2rem', color: 'text.secondary' }} />}
        />

        <Button 
          type="submit" 
          variant="contained" 
          fullWidth
          sx={{ 
            mt: 1, 
            height: 48, 
            borderRadius: '12px', 
            fontWeight: 800, 
            fontSize: '0.9rem',
            boxShadow: '0 8px 16px -4px rgba(99, 102, 241, 0.3)'
          }}
        >
          Add Transaction
        </Button>
      </Box>
    </Paper>
  );
};

export default TransactionForm;
