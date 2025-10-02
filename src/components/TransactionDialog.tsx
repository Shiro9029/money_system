'use client';

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormLabel,
  Chip,
  Box,
  InputAdornment,
} from '@mui/material';
import { ITransaction, ICategory } from '@/types';

interface TransactionDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (transaction: ITransaction | Omit<ITransaction, 'id'>) => Promise<void>;
  categories: ICategory[];
  transaction?: ITransaction | null;
}

export default function TransactionDialog({
  open,
  onClose,
  onSave,
  categories,
  transaction,
}: TransactionDialogProps) {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    description: '',
    category: '',
    amount: '',
    type: 'expense' as 'income' | 'expense',
    tags: [] as string[],
    tagInput: '',
  });

  const [errors, setErrors] = useState({
    description: false,
    category: false,
    amount: false,
  });

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (transaction) {
      setFormData({
        date: transaction.date,
        description: transaction.description,
        category: transaction.category,
        amount: transaction.amount.toString(),
        type: transaction.type,
        tags: transaction.tags || [],
        tagInput: '',
      });
    } else {
      setFormData({
        date: new Date().toISOString().split('T')[0],
        description: '',
        category: '',
        amount: '',
        type: 'expense',
        tags: [],
        tagInput: '',
      });
    }
    setErrors({ description: false, category: false, amount: false });
  }, [transaction, open]);

  const validateForm = () => {
    const newErrors = {
      description: !formData.description.trim(),
      category: !formData.category,
      amount: !formData.amount || isNaN(parseFloat(formData.amount)) || parseFloat(formData.amount) <= 0,
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error);
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setSaving(true);
    
    try {
      const transactionData = {
        date: formData.date,
        description: formData.description.trim(),
        category: formData.category,
        amount: parseFloat(formData.amount),
        type: formData.type,
        tags: formData.tags,
      };

      if (transaction) {
        await onSave({ ...transactionData, id: transaction.id });
      } else {
        await onSave(transactionData);
      }
    } catch (error) {
      console.error('Error saving transaction:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleAddTag = () => {
    if (formData.tagInput.trim() && !formData.tags.includes(formData.tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, prev.tagInput.trim()],
        tagInput: '',
      }));
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove),
    }));
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && formData.tagInput.trim()) {
      event.preventDefault();
      handleAddTag();
    }
  };

  const filteredCategories = categories.filter(cat => cat.type === formData.type);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{transaction ? '取引を編集' : '新しい取引を追加'}</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <TextField
            label="日付"
            type="date"
            value={formData.date}
            onChange={e => setFormData(prev => ({ ...prev, date: e.target.value }))}
            fullWidth
            InputLabelProps={{ shrink: true }}
          />

          <FormControl component="fieldset">
            <FormLabel component="legend">種別</FormLabel>
            <RadioGroup
              row
              value={formData.type}
              onChange={e => setFormData(prev => ({ ...prev, type: e.target.value as 'income' | 'expense', category: '' }))}
            >
              <FormControlLabel value="income" control={<Radio />} label="収入" />
              <FormControlLabel value="expense" control={<Radio />} label="支出" />
            </RadioGroup>
          </FormControl>

          <TextField
            label="摘要"
            value={formData.description}
            onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
            fullWidth
            error={errors.description}
            helperText={errors.description ? '摘要を入力してください' : ''}
          />

          <FormControl fullWidth error={errors.category}>
            <InputLabel>カテゴリ</InputLabel>
            <Select
              value={formData.category}
              label="カテゴリ"
              onChange={e => setFormData(prev => ({ ...prev, category: e.target.value }))}
            >
              {filteredCategories.map(category => (
                <MenuItem key={category.id} value={category.name}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box
                      sx={{
                        width: 16,
                        height: 16,
                        borderRadius: '50%',
                        backgroundColor: category.color,
                        mr: 1,
                      }}
                    />
                    {category.name}
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="金額"
            type="number"
            value={formData.amount}
            onChange={e => setFormData(prev => ({ ...prev, amount: e.target.value }))}
            fullWidth
            error={errors.amount}
            helperText={errors.amount ? '正しい金額を入力してください' : ''}
            InputProps={{
              startAdornment: <InputAdornment position="start">¥</InputAdornment>,
            }}
          />

          <TextField
            label="タグを追加"
            value={formData.tagInput}
            onChange={e => setFormData(prev => ({ ...prev, tagInput: e.target.value }))}
            onKeyPress={handleKeyPress}
            fullWidth
            helperText="Enterキーでタグを追加"
            InputProps={{
              endAdornment: (
                <Button size="small" onClick={handleAddTag} disabled={!formData.tagInput.trim()}>
                  追加
                </Button>
              ),
            }}
          />

          {formData.tags.length > 0 && (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {formData.tags.map(tag => (
                <Chip
                  key={tag}
                  label={tag}
                  onDelete={() => handleRemoveTag(tag)}
                  size="small"
                />
              ))}
            </Box>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={saving}>キャンセル</Button>
        <Button 
          onClick={handleSave} 
          variant="contained" 
          disabled={saving}
        >
          {saving ? '保存中...' : (transaction ? '更新' : '追加')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}