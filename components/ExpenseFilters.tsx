'use client';

import { CATEGORIES, ExpenseFilters as FilterValues } from '@/lib/types';

interface ExpenseFiltersProps {
  values: FilterValues;
  onChange: (values: FilterValues) => void;
}

export default function ExpenseFilters({ values, onChange }: ExpenseFiltersProps) {
  return (
    <div className="grid gap-3 rounded-2xl bg-white p-4 shadow-card md:grid-cols-4">
      <label className="space-y-1 md:col-span-2">
        <span className="text-sm font-medium text-slate-700">Search</span>
        <input
          placeholder="Search by description"
          type="text"
          value={values.search}
          onChange={(event) => onChange({ ...values, search: event.target.value })}
        />
      </label>

      <label className="space-y-1">
        <span className="text-sm font-medium text-slate-700">Start date</span>
        <input
          type="date"
          value={values.startDate}
          onChange={(event) => onChange({ ...values, startDate: event.target.value })}
        />
      </label>

      <label className="space-y-1">
        <span className="text-sm font-medium text-slate-700">End date</span>
        <input
          type="date"
          value={values.endDate}
          onChange={(event) => onChange({ ...values, endDate: event.target.value })}
        />
      </label>

      <label className="space-y-1 md:col-span-2">
        <span className="text-sm font-medium text-slate-700">Category</span>
        <select
          value={values.category}
          onChange={(event) => onChange({ ...values, category: event.target.value as FilterValues['category'] })}
        >
          <option value="All">All categories</option>
          {CATEGORIES.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
