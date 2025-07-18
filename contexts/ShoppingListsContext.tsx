import React, { createContext, useContext } from 'react';
import {
  useShoppingLists as useShoppingListsData,
  ShoppingList,
} from '@/hooks/useShoppingLists';

interface ShoppingListsContextType {
  lists: ShoppingList[];
  loading: boolean;
  addList: (listData: {
    category: string;
    name: string;
  }) => Promise<{ success: boolean; error?: any; data?: ShoppingList }>;
  addItem: (
    listId: string,
    itemData: { name: string; estimated_cost: number }
  ) => Promise<{ success: boolean; error?: any }>;
  toggleItem: (itemId: string) => Promise<{ success: boolean; error?: any }>;
  deleteItem: (itemId: string) => Promise<{ success: boolean; error?: any }>;
  deleteList: (listId: string) => Promise<{ success: boolean; error?: any }>;
  refetch: () => Promise<void>;
}

const ShoppingListsContext = createContext<
  ShoppingListsContextType | undefined
>(undefined);

export function ShoppingListsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const shoppingListsData = useShoppingListsData();

  return (
    <ShoppingListsContext.Provider value={shoppingListsData}>
      {children}
    </ShoppingListsContext.Provider>
  );
}

export function useShoppingListsContext() {
  const context = useContext(ShoppingListsContext);
  if (context === undefined) {
    throw new Error(
      'useShoppingListsContext must be used within a ShoppingListsProvider'
    );
  }
  return context;
}
