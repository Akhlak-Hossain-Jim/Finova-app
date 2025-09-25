import { useThemeContext } from '@/contexts/ThemeContext';
import React from 'react';
import { Platform, View } from 'react-native';
import { PaperProvider } from 'react-native-paper';

export default function PaperClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const { theme } = useThemeContext();
  return (
    <PaperProvider theme={theme}>
      {Platform?.OS === 'web' ? (
        <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
          <View
            style={{
              maxWidth: 550,
              width: '100%',
              alignSelf: 'center',
              marginHorizontal: 'auto',
              flex: 1,
            }}
          >
            {children}
          </View>
        </View>
      ) : (
        children
      )}
    </PaperProvider>
  );
}
