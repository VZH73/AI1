'use client';

import { Expense } from '@/lib/types';
import { formatCurrency, formatDate } from '@/lib/format';

interface ExpenseListProps {
  expenses: Expense[];
  onDelete: (id: string) => void;
  onEdit: (expense: Expense) => void;
}

export default function ExpenseList({ expenses, onDelete, onEdit }: ExpenseListProps) {
  if (!expenses.length) {
    return <p className="rounded-2xl bg-white p-6 text-center text-sm text-slate-500 shadow-card">No expenses found.</p>;
  }

  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-card">
      <table className="min-w-full divide-y divide-slate-200 text-sm">
        <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
          <tr>
            <th className="px-4 py-3">Date</th>
            <th className="px-4 py-3">Description</th>
            <th className="px-4 py-3">Category</th>
            <th className="px-4 py-3 text-right">Amount</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {expenses.map((expense) => (
            <tr className="hover:bg-slate-50" key={expense.id}>
              <td className="px-4 py-3 text-slate-600">{formatDate(expense.date)}</td>
              <td className="px-4 py-3 font-medium text-slate-800">{expense.description}</td>
              <td className="px-4 py-3">
                <span className="rounded-full bg-brand-50 px-2.5 py-1 text-xs font-semibold text-brand-700">{expense.category}</span>
              </td>
              <td className="px-4 py-3 text-right font-semibold text-slate-800">{formatCurrency(expense.amount)}</td>
              <td className="space-x-2 px-4 py-3 text-right">
                <button className="rounded-md border border-slate-300 px-2 py-1 text-xs font-medium hover:bg-slate-100" onClick={() => onEdit(expense)}>
                  Edit
                </button>
                <button className="rounded-md border border-red-200 px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50" onClick={() => onDelete(expense.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
