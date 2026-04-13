'use client';

import { useEffect, useMemo, useState } from 'react';
import ExpenseFilters from '@/components/ExpenseFilters';
import ExpenseForm from '@/components/ExpenseForm';
import ExpenseList from '@/components/ExpenseList';
import SummaryDashboard from '@/components/SummaryDashboard';
import { Expense, ExpenseFilters as FilterValues } from '@/lib/types';

const STORAGE_KEY = 'expense-tracker-v1';

const defaultFilters: FilterValues = {
  search: '',
  category: 'All',
  startDate: '',
  endDate: ''
};

export default function HomePage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [filters, setFilters] = useState<FilterValues>(defaultFilters);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Expense[];
        setExpenses(parsed);
      }
    } catch {
      setErrorMessage('Failed to load expenses from local storage.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isLoading) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
  }, [expenses, isLoading]);

  const filteredExpenses = useMemo(
    () =>
      expenses
        .filter((expense) => {
          const matchesSearch = expense.description.toLowerCase().includes(filters.search.toLowerCase());
          const matchesCategory = filters.category === 'All' || expense.category === filters.category;
          const matchesStart = !filters.startDate || new Date(expense.date) >= new Date(filters.startDate);
          const matchesEnd = !filters.endDate || new Date(expense.date) <= new Date(filters.endDate);
          return matchesSearch && matchesCategory && matchesStart && matchesEnd;
        })
        .sort((a, b) => (a.date > b.date ? -1 : 1)),
    [expenses, filters]
  );

  const handleSubmitExpense = (values: Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>) => {
    setErrorMessage(null);
    if (editingExpense) {
      setExpenses((prev) =>
        prev.map((expense) =>
          expense.id === editingExpense.id
            ? { ...expense, ...values, updatedAt: new Date().toISOString() }
            : expense
        )
      );
      setEditingExpense(null);
      return;
    }

    const now = new Date().toISOString();
    const newExpense: Expense = {
      id: crypto.randomUUID(),
      ...values,
      createdAt: now,
      updatedAt: now
    };

    setExpenses((prev) => [newExpense, ...prev]);
  };

  const handleDeleteExpense = (id: string) => {
    setExpenses((prev) => prev.filter((expense) => expense.id !== id));
    if (editingExpense?.id === id) setEditingExpense(null);
  };

  const handleExportCsv = () => {
    const rows = [
      ['Date', 'Amount', 'Category', 'Description'],
      ...filteredExpenses.map((expense) => [expense.date, expense.amount.toString(), expense.category, expense.description])
    ];

    const csvContent = rows.map((row) => row.map((cell) => `"${cell.replaceAll('"', '""')}"`).join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `expenses-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-6 px-4 py-8 md:px-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Expense Tracker</h1>
        <p className="text-slate-600">Track, analyze, and manage your personal spending in one place.</p>
      </header>

      {errorMessage ? <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{errorMessage}</p> : null}

      <SummaryDashboard expenses={filteredExpenses} />

      <div className="grid gap-6 lg:grid-cols-[360px,1fr]">
        <ExpenseForm editingExpense={editingExpense} onCancelEdit={() => setEditingExpense(null)} onSubmit={handleSubmitExpense} />

        <section className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-lg font-semibold text-slate-900">Expenses</h2>
            <button
              className="inline-flex w-full items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 sm:w-auto"
              onClick={handleExportCsv}
              type="button"
            >
              Export CSV
            </button>
          </div>

          <ExpenseFilters onChange={setFilters} values={filters} />

          {isLoading ? (
            <p className="rounded-2xl bg-white p-6 text-center text-sm text-slate-500 shadow-card">Loading expenses…</p>
          ) : (
            <ExpenseList expenses={filteredExpenses} onDelete={handleDeleteExpense} onEdit={setEditingExpense} />
          )}
        </section>
      </div>
    </main>
  );
}
