'use client';

import { useMemo } from 'react';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { Expense } from '@/lib/types';
import { formatCurrency } from '@/lib/format';

interface SummaryDashboardProps {
  expenses: Expense[];
}

const COLORS = ['#2176ff', '#22c55e', '#eab308', '#f97316', '#ef4444', '#8b5cf6'];

export default function SummaryDashboard({ expenses }: SummaryDashboardProps) {
  const { totalSpending, monthlySpending, topCategory, chartData } = useMemo(() => {
    const now = new Date();
    const totalSpendingValue = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const monthlySpendingValue = expenses
      .filter((expense) => {
        const date = new Date(expense.date);
        return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
      })
      .reduce((sum, expense) => sum + expense.amount, 0);

    const categoryTotals = expenses.reduce<Record<string, number>>((acc, expense) => {
      acc[expense.category] = (acc[expense.category] ?? 0) + expense.amount;
      return acc;
    }, {});

    const categoryRows = Object.entries(categoryTotals)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);

    return {
      totalSpending: totalSpendingValue,
      monthlySpending: monthlySpendingValue,
      topCategory: categoryRows[0]?.name ?? 'N/A',
      chartData: categoryRows
    };
  }, [expenses]);

  return (
    <section className="space-y-4">
      <div className="grid gap-3 md:grid-cols-3">
        <article className="rounded-2xl bg-white p-4 shadow-card">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Total spending</p>
          <p className="mt-2 text-2xl font-bold text-slate-900">{formatCurrency(totalSpending)}</p>
        </article>

        <article className="rounded-2xl bg-white p-4 shadow-card">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">This month</p>
          <p className="mt-2 text-2xl font-bold text-slate-900">{formatCurrency(monthlySpending)}</p>
        </article>

        <article className="rounded-2xl bg-white p-4 shadow-card">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Top category</p>
          <p className="mt-2 text-2xl font-bold text-slate-900">{topCategory}</p>
        </article>
      </div>

      <article className="h-72 rounded-2xl bg-white p-4 shadow-card">
        <div className="mb-2">
          <h2 className="text-base font-semibold text-slate-900">Spending by category</h2>
        </div>
        {chartData.length ? (
          <ResponsiveContainer height="100%" width="100%">
            <PieChart>
              <Pie data={chartData} dataKey="value" nameKey="name" outerRadius={95}>
                {chartData.map((entry, index) => (
                  <Cell fill={COLORS[index % COLORS.length]} key={entry.name} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => formatCurrency(value)} />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <p className="pt-16 text-center text-sm text-slate-500">Add expenses to see your spending pattern.</p>
        )}
      </article>
    </section>
  );
}
