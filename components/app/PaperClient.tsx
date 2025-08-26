import { useThemeContext } from '@/contexts/ThemeContext';
import React from 'react';
import { PaperProvider } from 'react-native-paper';

export default function PaperClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const { theme } = useThemeContext();
  return <PaperProvider theme={theme}>{children}</PaperProvider>;
}
