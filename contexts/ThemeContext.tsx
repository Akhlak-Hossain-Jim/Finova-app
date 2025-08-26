import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
} from 'react';
import { MD3LightTheme, MD3DarkTheme } from 'react-native-paper';
import { useColorScheme } from 'react-native';

interface ThemeContextType {
  isDarkMode: boolean;
  toggleTheme: () => void;
  theme: typeof MD3LightTheme | typeof MD3DarkTheme;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const lightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#1976D2',
    secondary: '#388E3C',
    tertiary: '#ff6a00',
    surface: '#FFFFFF',
    background: '#F5F5F5',
    error: '#F44336',
    onPrimary: '#FFFFFF',
    onSecondary: '#FFFFFF',
    onTertiary: '#000000',
    onSurface: '#212121',
    onBackground: '#212121',
    onError: '#FFFFFF',
  },
};

const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#64B5F6',
    secondary: '#81C784',
    tertiary: '#FFD54F',
    surface: '#1E1E1E',
    background: '#121212',
    error: '#EF5350',
    onPrimary: '#000000',
    onSecondary: '#000000',
    onTertiary: '#000000',
    onSurface: '#FFFFFF',
    onBackground: '#FFFFFF',
    onError: '#000000',
  },
};

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const colorScheme = useColorScheme();
  const [isDarkMode, setIsDarkMode] = useState(colorScheme === 'dark'); // Initialize with system preference

  const toggleTheme = useCallback(() => {
    setIsDarkMode((prevMode) => !prevMode);
  }, []);

  const theme = useMemo(
    () => (isDarkMode ? darkTheme : lightTheme),
    [isDarkMode]
  );

  const value = useMemo(
    () => ({
      isDarkMode,
      toggleTheme,
      theme,
    }),
    [isDarkMode, toggleTheme, theme]
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useThemeContext() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useThemeContext must be used within a ThemeProvider');
  }
  return context;
}
