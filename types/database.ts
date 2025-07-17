export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          currency: string;
          monthly_income: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          currency?: string;
          monthly_income?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string | null;
          currency?: string;
          monthly_income?: number | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      expense_categories: {
        Row: {
          id: string;
          name: string;
          icon: string | null;
          color: string | null;
          subcategories: string[] | null;
          is_annual: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          icon?: string | null;
          color?: string | null;
          subcategories?: string[] | null;
          is_annual?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          icon?: string | null;
          color?: string | null;
          subcategories?: string[] | null;
          is_annual?: boolean;
          created_at?: string;
        };
      };
      expenses: {
        Row: {
          id: string;
          user_id: string;
          category_id: string;
          amount: number;
          description: string;
          date: string;
          family_member: string | null;
          subcategory: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          category_id: string;
          amount: number;
          description: string;
          date: string;
          family_member?: string | null;
          subcategory?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          category_id?: string;
          amount?: number;
          description?: string;
          date?: string;
          family_member?: string | null;
          subcategory?: string | null;
          created_at?: string;
        };
      };
      income: {
        Row: {
          id: string;
          user_id: string;
          source: string;
          amount: number;
          date: string;
          description: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          source: string;
          amount: number;
          date: string;
          description?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          source?: string;
          amount?: number;
          date?: string;
          description?: string | null;
          created_at?: string;
        };
      };
      shopping_lists: {
        Row: {
          id: string;
          user_id: string;
          category: string;
          name: string;
          is_completed: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          category: string;
          name: string;
          is_completed?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          category?: string;
          name?: string;
          is_completed?: boolean;
          created_at?: string;
        };
      };
      shopping_items: {
        Row: {
          id: string;
          list_id: string;
          name: string;
          estimated_cost: number | null;
          actual_cost: number | null;
          is_purchased: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          list_id: string;
          name: string;
          estimated_cost?: number | null;
          actual_cost?: number | null;
          is_purchased?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          list_id?: string;
          name?: string;
          estimated_cost?: number | null;
          actual_cost?: number | null;
          is_purchased?: boolean;
          created_at?: string;
        };
      };
      savings_goals: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          target_amount: number;
          current_amount: number;
          target_date: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          target_amount: number;
          current_amount?: number;
          target_date?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          target_amount?: number;
          current_amount?: number;
          target_date?: string | null;
          created_at?: string;
        };
      };
      habits: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          category: string;
          frequency: string;
          current_streak: number;
          last_completed: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          category: string;
          frequency: string;
          current_streak?: number;
          last_completed?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          category?: string;
          frequency?: string;
          current_streak?: number;
          last_completed?: string | null;
          created_at?: string;
        };
      };
    };
  };
}