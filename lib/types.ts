export const CATEGORIES = ['Food', 'Transportation', 'Entertainment', 'Shopping', 'Bills', 'Other'] as const;

export type Category = (typeof CATEGORIES)[number];

export interface Expense {
  id: string;
  date: string;
  amount: number;
  category: Category;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface ExpenseFilters {
  search: string;
  category: 'All' | Category;
  startDate: string;
  endDate: string;
}
