import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

export interface Habit {
  id: string;
  title: string;
  category: string;
  frequency: string;
  current_streak: number;
  last_completed?: string;
  created_at: string;
}

export function useHabits() {
  const { user } = useAuth();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    if (user) {
      fetchHabits();
    }

    return () => {
      isMounted = false;
    };
  }, [user]);

  const fetchHabits = async () => {
    let isMounted = true;
    try {
      const { data, error } = await supabase
        .from('habits')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (isMounted) {
        setHabits(data || []);
      }
    } catch (error) {
      console.error('Error fetching habits:', error);
    } finally {
      if (isMounted) {
        setLoading(false);
      }
    }

    return () => {
      isMounted = false;
    };
  };

  const addHabit = async (habitData: {
    title: string;
    category: string;
    frequency: string;
  }) => {
    try {
      const { data, error } = await supabase
        .from('habits')
        .insert([
          {
            ...habitData,
            user_id: user?.id,
          }
        ])
        .select()
        .single();

      if (error) throw error;

      setHabits(prev => [data, ...prev]);
      return { success: true };
    } catch (error) {
      console.error('Error adding habit:', error);
      return { success: false, error };
    }
  };

  const toggleHabit = async (habitId: string) => {
    try {
      const habit = habits.find(h => h.id === habitId);
      if (!habit) return { success: false };

      const today = new Date().toISOString().split('T')[0];
      const isCompletedToday = habit.last_completed === today;

      const updates = {
        last_completed: isCompletedToday ? null : today,
        current_streak: isCompletedToday 
          ? Math.max(0, habit.current_streak - 1)
          : habit.current_streak + 1
      };

      const { data, error } = await supabase
        .from('habits')
        .update(updates)
        .eq('id', habitId)
        .select()
        .single();

      if (error) throw error;

      setHabits(prev => prev.map(h => 
        h.id === habitId ? data : h
      ));
      return { success: true };
    } catch (error) {
      console.error('Error toggling habit:', error);
      return { success: false, error };
    }
  };

  const deleteHabit = async (habitId: string) => {
    try {
      const { error } = await supabase
        .from('habits')
        .delete()
        .eq('id', habitId);

      if (error) throw error;

      setHabits(prev => prev.filter(habit => habit.id !== habitId));
      return { success: true };
    } catch (error) {
      console.error('Error deleting habit:', error);
      return { success: false, error };
    }
  };

  return {
    habits,
    loading,
    addHabit,
    toggleHabit,
    deleteHabit,
    refetch: fetchHabits,
  };
}