import 'core-js/actual/structured-clone';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { LogBox } from 'react-native';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { AuthProvider } from '@/contexts/AuthContext';
import { ExpensesProvider } from '@/contexts/ExpensesContext';
import { ShoppingListsProvider } from '@/contexts/ShoppingListsContext';
import { IncomeProvider } from '@/contexts/IncomeContext';
import { SavingsGoalsProvider } from '@/contexts/SavingsGoalsContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import PaperClient from '@/components/app/PaperClient';

LogBox.ignoreLogs([
  'setLayoutAnimationEnabledExperimental is currently a no-op in the New Architecture.',
]);
export default function RootLayout() {
  useFrameworkReady();

  return (
    <AuthProvider>
      <ExpensesProvider>
        <ShoppingListsProvider>
          <IncomeProvider>
            <SavingsGoalsProvider>
              <ThemeProvider>
                <PaperClient>
                  <Stack screenOptions={{ headerShown: false }}>
                    <Stack.Screen name="(auth)" />
                    <Stack.Screen name="(tabs)" />
                    <Stack.Screen name="+not-found" />
                  </Stack>
                  <StatusBar style="auto" />
                </PaperClient>
              </ThemeProvider>
            </SavingsGoalsProvider>
          </IncomeProvider>
        </ShoppingListsProvider>
      </ExpensesProvider>
    </AuthProvider>
  );
}
