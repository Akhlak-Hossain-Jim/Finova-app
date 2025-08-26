import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="email-verified" />
      <Stack.Screen name="privacy-policy" />
    </Stack>
  );
}
