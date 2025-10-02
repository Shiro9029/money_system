export interface ITransaction {
  id: string;
  date: string;
  description: string;
  category: string;
  amount: number;
  type: 'income' | 'expense';
  tags?: string[];
}

export interface ICategory {
  id: string;
  name: string;
  type: 'income' | 'expense';
  color: string;
}

export interface IApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

export interface ITransactionCreateRequest {
  date: string;
  description: string;
  category: string;
  amount: number;
  type: 'income' | 'expense';
  tags?: string[];
}