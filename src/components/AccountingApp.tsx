'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Tabs,
  Tab,
  Grid,
  Card,
  CardContent,
  Fab,
  AppBar,
  Toolbar,
  CircularProgress,
  Alert,
  Snackbar,
} from '@mui/material';
import {
  Add as AddIcon,
  TrendingUp,
  TrendingDown,
  AccountBalance,
} from '@mui/icons-material';
import { ITransaction, ICategory } from '@/types';
import { useTransactions } from '@/hooks/useTransactions';
import TransactionDialog from './TransactionDialog';
import TransactionList from './TransactionList';
import Dashboard from './Dashboard';


export default function AccountingApp() {
  const {
    transactions,
    loading,
    error,
    fetchTransactions,
    addTransaction,
    refreshTransactions,
  } = useTransactions();

  const [categories, setCategories] = useState<ICategory[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<ITransaction | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

  // カテゴリ取得関数
  const fetchCategories = useCallback(async () => {
    setCategoriesLoading(true);
    try {
      const response = await fetch('/api/categories');
      if (response.ok) {
        const data = await response.json();
        setCategories(data.categories || []);
      }
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    } finally {
      setCategoriesLoading(false);
    }
  }, []);

  // 初回データ読み込み
  useEffect(() => {
    fetchTransactions();
    fetchCategories();
  }, [fetchTransactions, fetchCategories]);

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const netBalance = totalIncome - totalExpense;

  const handleAddTransaction = async (transaction: Omit<ITransaction, 'id'>) => {
    const result = await addTransaction(transaction);
    if (result) {
      setDialogOpen(false);
      setSnackbarMessage('取引が正常に追加されました');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    } else {
      setSnackbarMessage('取引の追加に失敗しました');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const handleEditTransaction = async (transaction: ITransaction) => {
    // 編集機能は将来実装予定
    setSnackbarMessage('編集機能は近日実装予定です');
    setSnackbarSeverity('error');
    setSnackbarOpen(true);
    setEditingTransaction(null);
    setDialogOpen(false);
  };

  const handleDeleteTransaction = async (id: string) => {
    // 削除機能は将来実装予定
    setSnackbarMessage('削除機能は近日実装予定です');
    setSnackbarSeverity('error');
    setSnackbarOpen(true);
  };

  const handleOpenEditDialog = (transaction: ITransaction) => {
    setEditingTransaction(transaction);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingTransaction(null);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <AccountBalance sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            個人経理管理
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ py: 3 }}>
        {/* 概要カード */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <TrendingUp sx={{ color: 'success.main', mr: 1 }} />
                  <Typography color="text.secondary" gutterBottom>
                    総収入
                  </Typography>
                </Box>
                <Typography variant="h5" component="h2" color="success.main">
                  ¥{totalIncome.toLocaleString()}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <TrendingDown sx={{ color: 'error.main', mr: 1 }} />
                  <Typography color="text.secondary" gutterBottom>
                    総支出
                  </Typography>
                </Box>
                <Typography variant="h5" component="h2" color="error.main">
                  ¥{totalExpense.toLocaleString()}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <AccountBalance sx={{ color: 'primary.main', mr: 1 }} />
                  <Typography color="text.secondary" gutterBottom>
                    純資産
                  </Typography>
                </Box>
                <Typography
                  variant="h5"
                  component="h2"
                  color={netBalance >= 0 ? 'success.main' : 'error.main'}
                >
                  ¥{netBalance.toLocaleString()}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* タブ */}
        <Paper sx={{ mb: 2 }}>
          <Tabs value={activeTab} onChange={handleTabChange} centered>
            <Tab label="ダッシュボード" />
            <Tab label="取引一覧" />
          </Tabs>
        </Paper>

        {/* エラー表示 */}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* ローディング表示 */}
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
            <CircularProgress />
          </Box>
        )}

        {/* コンテンツ */}
        <Box sx={{ mt: 2 }}>
          {activeTab === 0 && (
            <Dashboard
              transactions={transactions}
              categories={categories}
              totalIncome={totalIncome}
              totalExpense={totalExpense}
              netBalance={netBalance}
            />
          )}
          {activeTab === 1 && (
            <TransactionList
              transactions={transactions}
              categories={categories}
              onEdit={handleOpenEditDialog}
              onDelete={handleDeleteTransaction}
            />
          )}
        </Box>

        {/* 追加ボタン */}
        <Fab
          color="primary"
          aria-label="add transaction"
          sx={{
            position: 'fixed',
            bottom: 16,
            right: 16,
          }}
          onClick={() => setDialogOpen(true)}
        >
          <AddIcon />
        </Fab>

        {/* 取引追加・編集ダイアログ */}
        <TransactionDialog
          open={dialogOpen}
          onClose={handleCloseDialog}
          onSave={editingTransaction ? (transaction) => handleEditTransaction(transaction as ITransaction) : handleAddTransaction}
          categories={categories}
          transaction={editingTransaction}
        />

        {/* スナックバー */}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        >
          <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
}