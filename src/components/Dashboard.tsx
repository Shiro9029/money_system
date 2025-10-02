'use client';

import React from 'react';
import {
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  LinearProgress,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  Category as CategoryIcon,
  History as HistoryIcon,
} from '@mui/icons-material';
import { ITransaction, ICategory } from '@/types';

interface DashboardProps {
  transactions: ITransaction[];
  categories: ICategory[];
  totalIncome: number;
  totalExpense: number;
  netBalance: number;
}

export default function Dashboard({
  transactions,
  categories,
  totalIncome,
  totalExpense,
  netBalance,
}: DashboardProps) {
  // カテゴリ別統計を計算
  const categoryStats = categories.map(category => {
    const categoryTransactions = transactions.filter(t => t.category === category.name);
    const total = categoryTransactions.reduce((sum, t) => sum + t.amount, 0);
    return {
      ...category,
      total,
      count: categoryTransactions.length,
      percentage: category.type === 'income' 
        ? totalIncome > 0 ? (total / totalIncome) * 100 : 0
        : totalExpense > 0 ? (total / totalExpense) * 100 : 0,
    };
  }).filter(stat => stat.total > 0).sort((a, b) => b.total - a.total);

  // 最近の取引（最新5件）
  const recentTransactions = transactions
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  // 月別統計（直近6ヶ月）
  const monthlyStats = Array.from({ length: 6 }, (_, i) => {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    
    const monthTransactions = transactions.filter(t => t.date.startsWith(monthKey));
    const income = monthTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const expense = monthTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    
    return {
      month: date.toLocaleDateString('ja-JP', { year: 'numeric', month: 'long' }),
      income,
      expense,
      net: income - expense,
    };
  }).reverse();

  return (
    <Grid container spacing={3}>
      {/* カテゴリ別統計 */}
      <Grid item xs={12} lg={8}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
            <CategoryIcon sx={{ mr: 1 }} />
            カテゴリ別統計
          </Typography>
          <Grid container spacing={2}>
            {categoryStats.map(stat => (
              <Grid item xs={12} sm={6} md={4} key={stat.id}>
                <Card variant="outlined">
                  <CardContent sx={{ pb: '16px !important' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Avatar
                        sx={{
                          width: 24,
                          height: 24,
                          backgroundColor: stat.color,
                          mr: 1,
                        }}
                      >
                        <Box sx={{ fontSize: '0.75rem' }}>
                          {stat.type === 'income' ? '+' : '-'}
                        </Box>
                      </Avatar>
                      <Typography variant="body2" color="text.secondary">
                        {stat.name}
                      </Typography>
                    </Box>
                    <Typography variant="h6" sx={{ mb: 1 }}>
                      ¥{stat.total.toLocaleString()}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Typography variant="caption" color="text.secondary">
                        {stat.count}件
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {stat.percentage.toFixed(1)}%
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={stat.percentage}
                      sx={{
                        height: 4,
                        borderRadius: 2,
                        backgroundColor: 'grey.200',
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: stat.color,
                        },
                      }}
                    />
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Paper>
      </Grid>

      {/* 最近の取引 */}
      <Grid item xs={12} lg={4}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
            <HistoryIcon sx={{ mr: 1 }} />
            最近の取引
          </Typography>
          <List>
            {recentTransactions.map((transaction, index) => (
              <React.Fragment key={transaction.id}>
                <ListItem sx={{ px: 0 }}>
                  <ListItemAvatar>
                    <Avatar
                      sx={{
                        backgroundColor: transaction.type === 'income' ? 'success.main' : 'error.main',
                        width: 32,
                        height: 32,
                      }}
                    >
                      {transaction.type === 'income' ? (
                        <TrendingUp fontSize="small" />
                      ) : (
                        <TrendingDown fontSize="small" />
                      )}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={transaction.description}
                    secondary={
                      <Box>
                        <Typography variant="caption" display="block">
                          {transaction.category} • {transaction.date}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color: transaction.type === 'income' ? 'success.main' : 'error.main',
                            fontWeight: 'bold',
                          }}
                        >
                          {transaction.type === 'income' ? '+' : '-'}¥{transaction.amount.toLocaleString()}
                        </Typography>
                      </Box>
                    }
                  />
                </ListItem>
                {index < recentTransactions.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
          {recentTransactions.length === 0 && (
            <Typography color="text.secondary" align="center" sx={{ py: 3 }}>
              取引データがありません
            </Typography>
          )}
        </Paper>
      </Grid>

      {/* 月別推移 */}
      <Grid item xs={12}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            月別推移（直近6ヶ月）
          </Typography>
          <Grid container spacing={2}>
            {monthlyStats.map((stat, index) => (
              <Grid item xs={12} sm={6} md={2} key={index}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="subtitle2" gutterBottom>
                      {stat.month}
                    </Typography>
                    <Box sx={{ mb: 1 }}>
                      <Typography variant="caption" color="text.secondary">
                        収入
                      </Typography>
                      <Typography variant="body2" color="success.main" sx={{ fontWeight: 'bold' }}>
                        ¥{stat.income.toLocaleString()}
                      </Typography>
                    </Box>
                    <Box sx={{ mb: 1 }}>
                      <Typography variant="caption" color="text.secondary">
                        支出
                      </Typography>
                      <Typography variant="body2" color="error.main" sx={{ fontWeight: 'bold' }}>
                        ¥{stat.expense.toLocaleString()}
                      </Typography>
                    </Box>
                    <Divider sx={{ my: 1 }} />
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        純額
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 'bold',
                          color: stat.net >= 0 ? 'success.main' : 'error.main',
                        }}
                      >
                        ¥{stat.net.toLocaleString()}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Paper>
      </Grid>
    </Grid>
  );
}