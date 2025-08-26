import { router } from 'expo-router';
import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Button, Text, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function WelcomeScreen() {
  const theme = useTheme();
  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <View style={styles.content}>
        <Image
          source={require('@/assets/images/finova_icon.png')}
          style={styles.logo}
        />
        <Text
          variant="displayMedium"
          style={[styles.title, { color: theme.colors.onBackground }]}
        >
          Finova
        </Text>
        <Text
          variant="headlineSmall"
          style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}
        >
          Your Personal Finance Companion
        </Text>
      </View>
      <View style={styles.buttonContainer}>
        <Button
          mode="contained"
          onPress={() => router.push('/signup')}
          style={styles.button}
          labelStyle={styles.buttonLabel}
        >
          Get Started
        </Button>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 24,
    objectFit: 'contain',
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 40,
  },
  buttonContainer: {
    width: '100%',
    // paddingVertical: 20,
  },
  button: {
    marginBottom: 12,
    // paddingVertical: 8,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: 'semibold',
  },
});
