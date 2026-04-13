# Expense Tracker (Next.js 14)

Modern personal expense tracking app built with Next.js App Router, TypeScript, and Tailwind CSS.

## Features

- Add, edit, and delete expenses
- Category/date/search filtering
- Local persistence with `localStorage`
- Dashboard summaries (total, monthly, top category)
- Spending visualization by category (Pie chart)
- CSV export of current filtered expenses
- Responsive UI for mobile and desktop

## Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Recharts

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Build

```bash
npm run build
npm run start
```

## Manual test checklist

1. Add an expense with each required field.
2. Try invalid form values (empty description, zero amount) and verify validation messages.
3. Edit an expense and verify updates persist.
4. Delete an expense and verify it disappears.
5. Use search/category/date filters and verify list + summary cards update.
6. Click **Export CSV** and verify file content matches filtered rows.
7. Refresh the page and verify data persists via `localStorage`.
