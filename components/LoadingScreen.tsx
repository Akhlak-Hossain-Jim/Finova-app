import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';

export default function LoadingScreen() {
  const theme = useTheme();
  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <Image
        source={require('@/assets/images/finova_icon.png')}
        accessibilityLabel="Finova Logo"
        style={[styles.image]}
      />
      <Text
        style={{
          textAlign: 'center',
          color: theme?.colors.onBackground,
          marginTop: 24,
          marginRight: 20,
          fontSize: 18,
        }}
      >
        Loading...
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 100,
    height: 100,
    aspectRatio: 1 / 1,
    objectFit: 'contain',
  },
});
