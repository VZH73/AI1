'use client';

import { useEffect, useState } from 'react';
import { CATEGORIES, Expense } from '@/lib/types';

interface ExpenseFormProps {
  onSubmit: (values: Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>) => void;
  editingExpense?: Expense | null;
  onCancelEdit: () => void;
}

interface FormValues {
  date: string;
  amount: string;
  category: (typeof CATEGORIES)[number];
  description: string;
}

const defaultValues: FormValues = {
  date: new Date().toISOString().split('T')[0],
  amount: '',
  category: 'Food',
  description: ''
};

export default function ExpenseForm({ onSubmit, editingExpense, onCancelEdit }: ExpenseFormProps) {
  const [values, setValues] = useState<FormValues>(defaultValues);
  const [errors, setErrors] = useState<Partial<Record<keyof FormValues, string>>>({});

  useEffect(() => {
    if (editingExpense) {
      setValues({
        date: editingExpense.date,
        amount: editingExpense.amount.toString(),
        category: editingExpense.category,
        description: editingExpense.description
      });
      return;
    }

    setValues(defaultValues);
  }, [editingExpense]);

  const validate = () => {
    const nextErrors: Partial<Record<keyof FormValues, string>> = {};

    if (!values.date) nextErrors.date = 'Date is required';

    const amount = Number(values.amount);
    if (!values.amount || Number.isNaN(amount) || amount <= 0) {
      nextErrors.amount = 'Amount must be greater than 0';
    }

    if (!values.description.trim()) {
      nextErrors.description = 'Description is required';
    } else if (values.description.trim().length < 3) {
      nextErrors.description = 'Description must be at least 3 characters';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!validate()) return;

    onSubmit({
      date: values.date,
      amount: Number(values.amount),
      category: values.category,
      description: values.description.trim()
    });

    if (!editingExpense) {
      setValues(defaultValues);
      setErrors({});
    }
  };

  return (
    <form className="space-y-4 rounded-2xl bg-white p-5 shadow-card" onSubmit={handleSubmit}>
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">{editingExpense ? 'Edit expense' : 'Add expense'}</h2>
        {editingExpense ? (
          <button className="text-sm font-medium text-slate-500 hover:text-slate-700" type="button" onClick={onCancelEdit}>
            Cancel
          </button>
        ) : null}
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <label className="space-y-1">
          <span className="text-sm font-medium text-slate-700">Date</span>
          <input
            aria-invalid={Boolean(errors.date)}
            type="date"
            value={values.date}
            onChange={(event) => setValues((prev) => ({ ...prev, date: event.target.value }))}
          />
          {errors.date ? <p className="text-xs text-red-600">{errors.date}</p> : null}
        </label>

        <label className="space-y-1">
          <span className="text-sm font-medium text-slate-700">Amount</span>
          <input
            aria-invalid={Boolean(errors.amount)}
            inputMode="decimal"
            min="0"
            placeholder="0.00"
            step="0.01"
            type="number"
            value={values.amount}
            onChange={(event) => setValues((prev) => ({ ...prev, amount: event.target.value }))}
          />
          {errors.amount ? <p className="text-xs text-red-600">{errors.amount}</p> : null}
        </label>
      </div>

      <label className="space-y-1">
        <span className="text-sm font-medium text-slate-700">Category</span>
        <select
          value={values.category}
          onChange={(event) =>
            setValues((prev) => ({ ...prev, category: event.target.value as (typeof CATEGORIES)[number] }))
          }
        >
          {CATEGORIES.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </label>

      <label className="space-y-1">
        <span className="text-sm font-medium text-slate-700">Description</span>
        <textarea
          aria-invalid={Boolean(errors.description)}
          placeholder="Groceries at Whole Foods"
          rows={3}
          value={values.description}
          onChange={(event) => setValues((prev) => ({ ...prev, description: event.target.value }))}
        />
        {errors.description ? <p className="text-xs text-red-600">{errors.description}</p> : null}
      </label>

      <button className="w-full rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-700" type="submit">
        {editingExpense ? 'Update expense' : 'Add expense'}
      </button>
    </form>
  );
}
