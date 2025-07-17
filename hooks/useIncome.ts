import { useState, useEffect } from 'react';
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

export function useIncome() {
  const { user } = useAuth();
  const [income, setIncome] = useState<Income[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    if (user) {
      fetchIncome();
    }

    return () => {
      isMounted = false;
    };
  }, [user]);

  const fetchIncome = async () => {
    let isMounted = true;
    try {
      const { data, error } = await supabase
        .from('income')
        .select('*')
        .eq('user_id', user?.id)
        .order('date', { ascending: false });

      if (error) throw error;
      if (isMounted) {
        setIncome(data || []);
      }
    } catch (error) {
      console.error('Error fetching income:', error);
    } finally {
      if (isMounted) {
        setLoading(false);
      }
    }

    return () => {
      isMounted = false;
    };
  };

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

  return {
    income,
    loading,
    addIncome,
    deleteIncome,
    refetch: fetchIncome,
  };
}