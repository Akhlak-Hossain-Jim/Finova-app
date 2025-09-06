import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from 'react';
import { Session, User } from '@supabase/supabase-js';
import { router } from 'expo-router';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

export interface Profile {
  id: string;
  full_name: string;
  currency: string;
  monthly_income: number;
}

interface AuthContextType {
  session: Session | null; // Session is complex, but let's see if we can avoid serializing it directly
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  isConfigured: boolean;
  resendEmailDisabled: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (
    email: string,
    password: string,
    fullName: string
  ) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  sendVerificationEmail: () => Promise<{ error: any | null }>;
  updateUserProfile: (fullName: string) => Promise<{ error: any | null }>;
  updateUserProfileDB: (
    fullName: string,
    currency: string,
    monthlyIncome: number
  ) => Promise<{ error: any | null }>;
  deleteUserAccount: (password: string) => Promise<{ error: any | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [resendEmailDisabled, setResendEmailDisabled] = useState(false);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setSession(null);
      setUser(null);
      setLoading(false);
      console.log("Setting loading to false because Supabase isn't configured");
      return;
    }

    const initializeAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const sendVerificationEmail = useCallback(async () => {
    if (!isSupabaseConfigured || !user?.email) {
      return {
        error: {
          message: 'Supabase is not configured or user email is missing.',
        },
      };
    }
    if (resendEmailDisabled) {
      return { error: { message: 'Please wait before resending the email.' } };
    }

    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: user.email,
    });
    if (!error) {
      setResendEmailDisabled(true);
      setTimeout(() => setResendEmailDisabled(false), 60000);
    }
    return { error };
  }, [user, resendEmailDisabled]);

  const signIn = useCallback(async (email: string, password: string) => {
    if (!isSupabaseConfigured) {
      return { error: { message: 'Supabase is not configured.' } };
    }
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  }, []);

  const signUp = useCallback(
    async (email: string, password: string, fullName: string) => {
      if (!isSupabaseConfigured) {
        return { error: { message: 'Supabase is not configured.' } };
      }
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName } },
      });

      if (!error && data.user) {
        // If signup is successful and user exists, redirect to check-email screen
        // This assumes that email verification is enabled and required.
        router.replace('/check-email');
      }
      return { error };
    },
    []
  );

  const signOut = useCallback(async () => {
    if (!isSupabaseConfigured) return;
    await supabase.auth.signOut();
    router.replace('/');
  }, []);

  const updateUserProfileDB = useCallback(
    async (fullName: string, currency: string, monthlyIncome: number) => {
      let isMounted = true;
      if (!isSupabaseConfigured || !user) {
        console.error('Supabase not configured or user not logged in:', {
          isSupabaseConfigured,
          user,
        });
        return {
          error: { message: 'User not logged in or Supabase not configured.' },
        };
      }

      try {
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .update({
            full_name: fullName,
            currency: currency,
            monthly_income: monthlyIncome,
          })
          .eq('id', user.id)
          .select();
        if (profileError) {
          console.error(
            'Error updating profile:',
            JSON.stringify(profileError, null, 2)
          );
          return { error: profileError };
        }

        if (profileData) {
          setProfile(profileData[0]);
        }

        return { error: null };
      } catch (err) {
        if (!isMounted) return { error: { message: 'Component unmounted' } };
        console.error('Unexpected error in updateUserProfile:', err);
        return { error: { message: 'Unexpected error', details: err } };
      }
    },
    [user]
  );

  const updateUserProfile = useCallback(
    async (fullName: string) => {
      let isMounted = true;
      if (!isSupabaseConfigured || !user) {
        console.error('Supabase not configured or user not logged in:', {
          isSupabaseConfigured,
          user,
        });
        return {
          error: { message: 'User not logged in or Supabase not configured.' },
        };
      }

      try {
        const response = supabase.auth.updateUser({
          data: { full_name: fullName },
        });
        const { error } = await response;
        if (!isMounted) return { error: { message: 'Component unmounted' } };

        if (error) {
          console.error(
            'Error updating user auth:',
            JSON.stringify(error, null, 2)
          );
          return { error };
        }

        return { error: null };
      } catch (err) {
        if (!isMounted) return { error: { message: 'Component unmounted' } };
        console.error('Unexpected error in updateUserProfile:', err);
        return { error: { message: 'Unexpected error', details: err } };
      }
    },
    [user]
  );

  const deleteUserAccount = useCallback(async () => {
    if (!isSupabaseConfigured || !user || !session) {
      return { error: { message: 'User not logged in or session missing.' } };
    }
    const { error } = await supabase.functions.invoke('delete-user', {
      body: { userId: user.id },
      headers: { Authorization: `Bearer ${session.access_token}` },
    });
    if (error) return { error };
    await signOut();
    return { error: null };
  }, [user, session, signOut]);

  const value = {
    session,
    user,
    profile,
    loading,
    isConfigured: isSupabaseConfigured,
    signIn,
    signUp,
    signOut,
    sendVerificationEmail,
    resendEmailDisabled,
    updateUserProfile,
    updateUserProfileDB,
    deleteUserAccount,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
