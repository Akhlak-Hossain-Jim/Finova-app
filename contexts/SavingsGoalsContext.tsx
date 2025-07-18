import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
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

interface SavingsGoalsContextType {
  goals: SavingsGoal[];
  loading: boolean;
  addGoal: (goalData: { title: string; target_amount: number; target_date?: string; }) => Promise<{ success: boolean; error?: any }>;
  updateGoal: (goalId: string, updates: Partial<SavingsGoal>) => Promise<{ success: boolean; error?: any }>;
  deleteGoal: (goalId: string) => Promise<{ success: boolean; error?: any }>;
  refetch: () => Promise<void>;
}

const SavingsGoalsContext = createContext<SavingsGoalsContextType | undefined>(undefined);

export function SavingsGoalsProvider({ children }: { children: React.ReactNode }) {
  const { user, loading: authLoading } = useAuth();
  const [goals, setGoals] = useState<SavingsGoal[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchGoals = useCallback(async () => {
    if (!user || !user.id) {
      setLoading(false);
      setGoals([]);
      return;
    }
    try {
      const { data, error } = await supabase
        .from('savings_goals')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setGoals(data || []);
    } catch (error) {
      console.error('Error fetching savings goals:', error);
    } finally {
      setLoading(false);
    }
  }, [user, setGoals, setLoading]);

  useEffect(() => {
    if (!authLoading && user?.id) {
      fetchGoals();
    } else if (!authLoading && !user?.id) {
      setLoading(false);
      setGoals([]);
    }
  }, [user, authLoading, fetchGoals]);

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
          }
        ])
        .select()
        .single();

      if (error) throw error;

      setGoals(prev => [data, ...prev]);
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

      setGoals(prev => prev.map(goal => 
        goal.id === goalId ? data : goal
      ));
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

      setGoals(prev => prev.filter(goal => goal.id !== goalId));
      return { success: true };
    } catch (error) {
      console.error('Error deleting savings goal:', error);
      return { success: false, error };
    }
  };

  const value = {
    goals,
    loading,
    addGoal,
    updateGoal,
    deleteGoal,
    refetch: fetchGoals,
  };

  return (
    <SavingsGoalsContext.Provider value={value}>
      {children}
    </SavingsGoalsContext.Provider>
  );
}

export function useSavingsGoalsContext() {
  const context = useContext(SavingsGoalsContext);
  if (context === undefined) {
    throw new Error('useSavingsGoalsContext must be used within a SavingsGoalsProvider');
  }
  return context;
}
