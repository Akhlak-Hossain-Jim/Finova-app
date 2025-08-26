import { useAuth } from '@/contexts/AuthContext';
import { router, Stack } from 'expo-router';
import { useEffect } from 'react';

export default function AuthLayout() {
  const { session, loading } = useAuth();

  useEffect(() => {
    if (loading) return;
    if (session) return;
    router.replace('/(auth)/welcome');
  }, [session, loading]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="welcome" />
      <Stack.Screen name="signin" />
      <Stack.Screen name="signup" />
      <Stack.Screen name="delete-account" />
      <Stack.Screen name="check-email" />
    </Stack>
  );
}
