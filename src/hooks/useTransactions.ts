'use client';

import { useState, useCallback } from 'react';
import { ITransaction } from '@/types';

interface UseTransactionsReturn {
  transactions: ITransaction[];
  loading: boolean;
  error: string | null;
  fetchTransactions: () => Promise<void>;
  addTransaction: (transaction: Omit<ITransaction, 'id'>) => Promise<ITransaction | null>;
  refreshTransactions: () => Promise<void>;
}

export const useTransactions = (): UseTransactionsReturn => {
  const [transactions, setTransactions] = useState<ITransaction[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/transactions');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setTransactions(data.transactions || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch transactions');
      console.error('Error fetching transactions:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const addTransaction = useCallback(async (transaction: Omit<ITransaction, 'id'>): Promise<ITransaction | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(transaction),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      const newTransaction = data.transaction;
      
      // 既存の取引リストに新しい取引を追加
      setTransactions(prev => [...prev, newTransaction]);
      
      return newTransaction;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add transaction');
      console.error('Error adding transaction:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshTransactions = useCallback(async () => {
    await fetchTransactions();
  }, [fetchTransactions]);

  return {
    transactions,
    loading,
    error,
    fetchTransactions,
    addTransaction,
    refreshTransactions,
  };
};