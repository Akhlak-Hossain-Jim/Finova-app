import React, { createContext, useContext } from 'react';
import { useExpenses as useExpensesData, Expense } from '@/hooks/useExpenses';

interface ExpensesContextType {
  expenses: Expense[];
  categories: any[];
  loading: boolean;
  addExpense: (expenseData: any) => Promise<{ success: boolean; error?: any }>;
  deleteExpense: (
    expenseId: string
  ) => Promise<{ success: boolean; error?: any }>;
  refetch: () => Promise<() => void>;
}

const ExpensesContext = createContext<ExpensesContextType | undefined>(
  undefined
);

export function ExpensesProvider({ children }: { children: React.ReactNode }) {
  const expensesData = useExpensesData();

  return (
    <ExpensesContext.Provider value={expensesData}>
      {children}
    </ExpensesContext.Provider>
  );
}

export function useExpensesContext() {
  const context = useContext(ExpensesContext);
  if (context === undefined) {
    throw new Error(
      'useExpensesContext must be used within a ExpensesProvider'
    );
  }
  return context;
}
