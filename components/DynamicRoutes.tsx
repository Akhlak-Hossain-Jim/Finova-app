import React from "react";
import { useAuth } from '@/contexts/AuthContext';

export function DynamicRoutes() {
  const { session } = useAuth();
  return <>
  {session ? (
            <Stack.Screen name="(tabs)" />
          ) : (
            <Stack.Screen name="(auth)" />
          )}
  </>
}