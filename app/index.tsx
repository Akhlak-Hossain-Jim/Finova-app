import LoadingScreen from '@/components/LoadingScreen';
import { useAuth } from '@/contexts/AuthContext';
import { router } from 'expo-router';
import { useEffect } from 'react';

export default function App() {
  const { session, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (!session) {
        router.replace('/(auth)/welcome');
      } else {
        router.replace('/(tabs)');
      }
    }
  }, [loading, session]);

  return <LoadingScreen />;
}
