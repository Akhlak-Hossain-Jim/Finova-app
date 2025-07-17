import { Stack } from 'expo-router';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect } from "react"

export default function AuthLayout() {
  const router = useRouter();
  const { session,loading } = useAuth();

  useEffect(() => {
    if (loading) return;
    if (session) {
      console.log("user is here")
    }else {
      router.replace("/(auth)/signin");
    }
  }, [session, loading, router]);
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="signin" />
      <Stack.Screen name="signup" />
    </Stack>
  );
}