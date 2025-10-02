'use client';

import React, { useState } from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Typography,
  Button,
  TableSortLabel,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Download as DownloadIcon,
} from '@mui/icons-material';
import { ITransaction, ICategory } from '@/types';

interface TransactionListProps {
  transactions: ITransaction[];
  categories: ICategory[];
  onEdit: (transaction: ITransaction) => void;
  onDelete: (id: string) => void;
}

export default function TransactionList({
  transactions,
  categories,
  onEdit,
  onDelete,
}: TransactionListProps) {
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [orderBy, setOrderBy] = useState<keyof ITransaction>('date');
  const [order, setOrder] = useState<'asc' | 'desc'>('desc');

  const handleSort = (property: keyof ITransaction) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleDelete = (id: string, description: string) => {
    if (window.confirm(`「${description}」を削除しますか？`)) {
      onDelete(id);
    }
  };

  const filteredTransactions = transactions
    .filter(transaction => {
      const typeMatch = filterType === 'all' || transaction.type === filterType;
      const categoryMatch = filterCategory === 'all' || transaction.category === filterCategory;
      const searchMatch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (transaction.tags || []).some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      return typeMatch && categoryMatch && searchMatch;
    })
    .sort((a, b) => {
      let aValue: string | number = a[orderBy] as string | number;
      let bValue: string | number = b[orderBy] as string | number;
      
      if (orderBy === 'date') {
        aValue = new Date(aValue as string).getTime();
        bValue = new Date(bValue as string).getTime();
      }
      
      if (order === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

  const exportToCSV = () => {
    const headers = ['日付', '摘要', 'カテゴリ', '金額', '種別', 'タグ'];
    const csvData = filteredTransactions.map(transaction => [
      transaction.date,
      transaction.description,
      transaction.category,
      transaction.amount.toString(),
      transaction.type === 'income' ? '収入' : '支出',
      (transaction.tags || []).join('; ')
    ]);

    const csvContent = [headers, ...csvData]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `取引履歴_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const getCategoryColor = (categoryName: string) => {
    const category = categories.find(cat => cat.name === categoryName);
    return category ? category.color : '#757575';
  };

  return (
    <Paper sx={{ p: 2 }}>
      {/* フィルターコントロール */}
      <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap', alignItems: 'center' }}>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>種別</InputLabel>
          <Select
            value={filterType}
            label="種別"
            onChange={e => setFilterType(e.target.value as 'all' | 'income' | 'expense')}
          >
            <MenuItem value="all">すべて</MenuItem>
            <MenuItem value="income">収入</MenuItem>
            <MenuItem value="expense">支出</MenuItem>
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>カテゴリ</InputLabel>
          <Select
            value={filterCategory}
            label="カテゴリ"
            onChange={e => setFilterCategory(e.target.value)}
          >
            <MenuItem value="all">すべて</MenuItem>
            {categories.map(category => (
              <MenuItem key={category.id} value={category.name}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box
                    sx={{
                      width: 12,
                      height: 12,
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
          size="small"
          label="検索"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          placeholder="摘要やタグで検索..."
          sx={{ minWidth: 200 }}
        />

        <Box sx={{ flexGrow: 1 }} />

        <Button
          variant="outlined"
          startIcon={<DownloadIcon />}
          onClick={exportToCSV}
          size="small"
        >
          CSV出力
        </Button>
      </Box>

      {/* 結果表示 */}
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        {filteredTransactions.length}件の取引
      </Typography>

      {/* テーブル */}
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'date'}
                  direction={orderBy === 'date' ? order : 'asc'}
                  onClick={() => handleSort('date')}
                >
                  日付
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'description'}
                  direction={orderBy === 'description' ? order : 'asc'}
                  onClick={() => handleSort('description')}
                >
                  摘要
                </TableSortLabel>
              </TableCell>
              <TableCell>カテゴリ</TableCell>
              <TableCell align="right">
                <TableSortLabel
                  active={orderBy === 'amount'}
                  direction={orderBy === 'amount' ? order : 'asc'}
                  onClick={() => handleSort('amount')}
                >
                  金額
                </TableSortLabel>
              </TableCell>
              <TableCell align="center">種別</TableCell>
              <TableCell>タグ</TableCell>
              <TableCell align="center">操作</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredTransactions.map(transaction => (
              <TableRow key={transaction.id} hover>
                <TableCell>{transaction.date}</TableCell>
                <TableCell>{transaction.description}</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box
                      sx={{
                        width: 12,
                        height: 12,
                        borderRadius: '50%',
                        backgroundColor: getCategoryColor(transaction.category),
                        mr: 1,
                      }}
                    />
                    {transaction.category}
                  </Box>
                </TableCell>
                <TableCell
                  align="right"
                  sx={{
                    color: transaction.type === 'income' ? 'success.main' : 'error.main',
                    fontWeight: 'bold',
                  }}
                >
                  {transaction.type === 'income' ? '+' : '-'}¥{transaction.amount.toLocaleString()}
                </TableCell>
                <TableCell align="center">
                  <Chip
                    label={transaction.type === 'income' ? '収入' : '支出'}
                    color={transaction.type === 'income' ? 'success' : 'error'}
                    size="small"
                    variant="outlined"
                  />
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {(transaction.tags || []).map(tag => (
                      <Chip
                        key={tag}
                        label={tag}
                        size="small"
                        variant="outlined"
                        sx={{ fontSize: '0.75rem' }}
                      />
                    ))}
                  </Box>
                </TableCell>
                <TableCell align="center">
                  <IconButton
                    size="small"
                    onClick={() => onEdit(transaction)}
                    color="primary"
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleDelete(transaction.id, transaction.description)}
                    color="error"
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {filteredTransactions.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography color="text.secondary">
            条件に一致する取引がありません
          </Typography>
        </Box>
      )}
    </Paper>
  );
}