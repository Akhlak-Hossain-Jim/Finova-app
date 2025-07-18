import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

export interface Income {
  id: string;
  source: string;
  amount: number;
  date: string;
  description?: string;
  created_at: string;
}

interface IncomeContextType {
  income: Income[];
  loading: boolean;
  addIncome: (incomeData: { source: string; amount: number; date: string; description?: string; }) => Promise<{ success: boolean; error?: any }>;
  deleteIncome: (incomeId: string) => Promise<{ success: boolean; error?: any }>;
  refetch: () => Promise<void>;
}

const IncomeContext = createContext<IncomeContextType | undefined>(undefined);

export function IncomeProvider({ children }: { children: React.ReactNode }) {
  const { user, loading: authLoading } = useAuth();
  const [income, setIncome] = useState<Income[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchIncome = useCallback(async () => {
    if (!user || !user.id) {
      setLoading(false);
      setIncome([]);
      return;
    }
    try {
      const { data, error } = await supabase
        .from('income')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false });

      if (error) throw error;
      setIncome(data || []);
    } catch (error) {
      console.error('Error fetching income:', error);
    } finally {
      setLoading(false);
    }
  }, [user, setIncome, setLoading]);

  useEffect(() => {
    if (!authLoading && user?.id) {
      fetchIncome();
    } else if (!authLoading && !user?.id) {
      setLoading(false);
      setIncome([]);
    }
  }, [user, authLoading, fetchIncome]);

  const addIncome = async (incomeData: {
    source: string;
    amount: number;
    date: string;
    description?: string;
  }) => {
    try {
      const { data, error } = await supabase
        .from('income')
        .insert([
          {
            ...incomeData,
            user_id: user?.id,
          }
        ])
        .select()
        .single();

      if (error) throw error;

      setIncome(prev => [data, ...prev]);
      return { success: true };
    } catch (error) {
      console.error('Error adding income:', error);
      return { success: false, error };
    }
  };

  const deleteIncome = async (incomeId: string) => {
    try {
      const { error } = await supabase
        .from('income')
        .delete()
        .eq('id', incomeId);

      if (error) throw error;

      setIncome(prev => prev.filter(item => item.id !== incomeId));
      return { success: true };
    } catch (error) {
      console.error('Error deleting income:', error);
      return { success: false, error };
    }
  };

  const value = {
    income,
    loading,
    addIncome,
    deleteIncome,
    refetch: fetchIncome,
  };

  return (
    <IncomeContext.Provider value={value}>
      {children}
    </IncomeContext.Provider>
  );
}

export function useIncomeContext() {
  const context = useContext(IncomeContext);
  if (context === undefined) {
    throw new Error('useIncomeContext must be used within an IncomeProvider');
  }
  return context;
}
