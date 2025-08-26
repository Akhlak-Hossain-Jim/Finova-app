import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

export interface Expense {
  id: string;
  amount: number;
  description: string;
  category: string;
  subcategory?: string;
  date: string;
  family_member?: string;
  created_at: string;
}

export function useExpenses() {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    let isMounted = true;

    if (user) {
      const loadData = async () => {
        await fetchExpenses();
        await fetchCategories();
      };
      loadData();
    }

    return () => {
      isMounted = false;
    };
  }, [user]);

  const fetchExpenses = async () => {
    let isMounted = true;
    try {
      const { data, error } = await supabase
        .from('expenses')
        .select(
          `
          *,
          expense_categories (
            name,
            color,
            icon
          )
        `
        )
        .eq('user_id', user?.id)
        .order('date', { ascending: false });

      if (error) throw error;

      const formattedExpenses =
        data?.map((expense) => ({
          id: expense.id,
          amount: expense.amount,
          description: expense.description,
          category: expense.expense_categories.name,
          subcategory: expense.subcategory,
          date: expense.date,
          family_member: expense.family_member,
          created_at: expense.created_at,
        })) || [];

      if (isMounted) {
        setExpenses(formattedExpenses);
      }
    } catch (error) {
      console.error('Error fetching expenses:', error);
    } finally {
      if (isMounted) {
        setLoading(false);
      }
    }

    return () => {
      isMounted = false;
    };
  };

  const fetchCategories = async () => {
    let isMounted = true;
    try {
      const { data, error } = await supabase
        .from('expense_categories')
        .select('*')
        .order('name');

      if (error) throw error;
      if (isMounted) {
        setCategories(data || []);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }

    return () => {
      isMounted = false;
    };
  };

  const addExpense = async (expenseData: {
    amount: number;
    description: string;
    category_id: string;
    subcategory?: string;
    family_member?: string;
    date: string;
  }) => {
    try {
      const { data, error } = await supabase
        .from('expenses')
        .insert([
          {
            ...expenseData,
            user_id: user?.id,
          },
        ])
        .select(
          `
          *,
          expense_categories (
            name,
            color,
            icon
          )
        `
        )
        .single();

      if (error) throw error;

      const newExpense = {
        id: data.id,
        amount: data.amount,
        description: data.description,
        category: data.expense_categories.name,
        subcategory: data.subcategory,
        date: data.date,
        family_member: data.family_member,
        created_at: data.created_at,
      };

      setExpenses((prev) => [newExpense, ...prev]);
      return { success: true };
    } catch (error) {
      console.error('Error adding expense:', error);
      return { success: false, error };
    }
  };

  const deleteExpense = async (expenseId: string) => {
    try {
      const { error } = await supabase
        .from('expenses')
        .delete()
        .eq('id', expenseId);

      if (error) throw error;

      setExpenses((prev) => prev.filter((expense) => expense.id !== expenseId));
      return { success: true };
    } catch (error) {
      console.error('Error deleting expense:', error);
      return { success: false, error };
    }
  };

  return {
    expenses,
    categories,
    loading,
    addExpense,
    deleteExpense,
    refetch: fetchExpenses,
  };
}
