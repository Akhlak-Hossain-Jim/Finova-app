import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

export interface ShoppingItem {
  id: string;
  name: string;
  estimated_cost: number | null;
  actual_cost: number | null;
  is_purchased: boolean;
  created_at: string;
}

export interface ShoppingList {
  id: string;
  category: string;
  name: string;
  is_completed: boolean;
  created_at: string;
  shopping_items?: ShoppingItem[];
}

export function useShoppingLists() {
  const { user, loading: authLoading } = useAuth();
  const [lists, setLists] = useState<ShoppingList[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLists = useCallback(async () => {
    if (!user || !user.id) {
      setLoading(false);
      setLists([]);
      return;
    }
    try {
      const { data, error } = await supabase
        .from('shopping_lists')
        .select(
          `
          *,
          shopping_items (*)
        `
        )
        .eq('user_id', user.id) // Use user.id directly
        .order('created_at', { ascending: false });

      if (error) throw error;
      setLists(data || []);
    } catch (error) {
      console.error('Error fetching shopping lists:', error);
    } finally {
      setLoading(false);
    }
  }, [user, setLists, setLoading]); // Dependencies for useCallback

  useEffect(() => {
    if (!authLoading && user?.id) {
      fetchLists();
    } else if (!authLoading && !user?.id) {
      setLoading(false); // If auth is done and no user, stop loading and clear lists
      setLists([]);
    }
  }, [user, authLoading, fetchLists]);

  const addList = async (listData: { category: string; name: string }) => {
    try {
      const { data, error } = await supabase
        .from('shopping_lists')
        .insert([
          {
            ...listData,
            user_id: user?.id,
          },
        ])
        .select()
        .single();

      if (error) throw error;

      setLists((prev) => [{ ...data, shopping_items: [] }, ...prev]);
      return { success: true, data };
    } catch (error) {
      console.error('Error adding shopping list:', error);
      return { success: false, error };
    }
  };

  const addItem = async (
    listId: string,
    itemData: {
      name: string;
      estimated_cost: number;
    }
  ) => {
    try {
      const { data, error } = await supabase
        .from('shopping_items')
        .insert([
          {
            ...itemData,
            list_id: listId,
          },
        ])
        .select()
        .single();

      if (error) throw error;
      console.log('Added shopping item data:', data);

      setLists((prev) =>
        prev.map((list) =>
          list.id === listId
            ? {
                ...list,
                shopping_items: [...(list.shopping_items || []), data],
              }
            : list
        )
      );
      return { success: true };
    } catch (error) {
      console.error('Error adding shopping item:', error);
      return { success: false, error };
    }
  };

  const toggleItem = async (itemId: string) => {
    try {
      // Find the item first
      const item = lists
        .flatMap((list) => list.shopping_items || [])
        .find((item) => item.id === itemId);
      if (!item) return { success: false };

      const updates = {
        is_purchased: !item.is_purchased,
        actual_cost: !item.is_purchased ? item.estimated_cost : null,
      };

      const { data, error } = await supabase
        .from('shopping_items')
        .update(updates)
        .eq('id', itemId)
        .select()
        .single();

      if (error) throw error;

      setLists((prev) =>
        prev.map((list) => ({
          ...list,
          shopping_items: list.shopping_items?.map((item) =>
            item.id === itemId ? data : item
          ),
        }))
      );
      return { success: true };
    } catch (error) {
      console.error('Error toggling shopping item:', error);
      return { success: false, error };
    }
  };

  const deleteItem = async (itemId: string) => {
    try {
      const { error } = await supabase
        .from('shopping_items')
        .delete()
        .eq('id', itemId);

      if (error) throw error;

      setLists((prev) =>
        prev.map((list) => ({
          ...list,
          shopping_items: list.shopping_items?.filter(
            (item) => item.id !== itemId
          ),
        }))
      );
      return { success: true };
    } catch (error) {
      console.error('Error deleting shopping item:', error);
      return { success: false, error };
    }
  };

  const deleteList = async (listId: string) => {
    try {
      const { error } = await supabase
        .from('shopping_lists')
        .delete()
        .eq('id', listId);

      if (error) throw error;

      setLists((prev) => prev.filter((list) => list.id !== listId));
      return { success: true };
    } catch (error) {
      console.error('Error deleting shopping list:', error);
      return { success: false, error };
    }
  };

  return {
    lists,
    loading,
    addList,
    addItem,
    toggleItem,
    deleteItem,
    deleteList,
    refetch: fetchLists,
  };
}
