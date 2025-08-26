import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

export interface SavingsGoal {
  id: string;
  title: string;
  target_amount: number;
  current_amount: number;
  target_date?: string;
  created_at: string;
}

export function useSavingsGoals() {
  const { user } = useAuth();
  const [goals, setGoals] = useState<SavingsGoal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    if (user) {
      fetchGoals();
    }

    return () => {
      isMounted = false;
    };
  }, [user]);

  const fetchGoals = async () => {
    let isMounted = true;
    try {
      const { data, error } = await supabase
        .from('savings_goals')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (isMounted) {
        setGoals(data || []);
      }
    } catch (error) {
      console.error('Error fetching savings goals:', error);
    } finally {
      if (isMounted) {
        setLoading(false);
      }
    }

    return () => {
      isMounted = false;
    };
  };

  const addGoal = async (goalData: {
    title: string;
    target_amount: number;
    target_date?: string;
  }) => {
    try {
      const { data, error } = await supabase
        .from('savings_goals')
        .insert([
          {
            ...goalData,
            user_id: user?.id,
          },
        ])
        .select()
        .single();

      if (error) throw error;

      setGoals((prev) => [data, ...prev]);
      return { success: true };
    } catch (error) {
      console.error('Error adding savings goal:', error);
      return { success: false, error };
    }
  };

  const updateGoal = async (goalId: string, updates: Partial<SavingsGoal>) => {
    try {
      const { data, error } = await supabase
        .from('savings_goals')
        .update(updates)
        .eq('id', goalId)
        .select()
        .single();

      if (error) throw error;

      setGoals((prev) =>
        prev.map((goal) => (goal.id === goalId ? data : goal))
      );
      return { success: true };
    } catch (error) {
      console.error('Error updating savings goal:', error);
      return { success: false, error };
    }
  };

  const deleteGoal = async (goalId: string) => {
    try {
      const { error } = await supabase
        .from('savings_goals')
        .delete()
        .eq('id', goalId);

      if (error) throw error;

      setGoals((prev) => prev.filter((goal) => goal.id !== goalId));
      return { success: true };
    } catch (error) {
      console.error('Error deleting savings goal:', error);
      return { success: false, error };
    }
  };

  // const totalSaved = goals.reduce((sum, goal) => sum + goal.current_amount, 0);
  const totalSaved = goals.reduce((sum, goal) => sum + goal.current_amount, 0);
  const completedGoalsCount = goals.filter(
    (goal) => goal.current_amount >= goal.target_amount
  ).length;
  const totalGoalsCount = goals.length;

  return {
    goals,
    loading,
    addGoal,
    updateGoal,
    deleteGoal,
    refetch: fetchGoals,
    totalSaved,
    completedGoalsCount,
    totalGoalsCount,
  };
}
