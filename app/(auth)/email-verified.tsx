import { View, Text, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';

export default function EmailVerifiedScreen() {
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Email Verified' }} />
      <Text style={styles.message}>Your email has been successfully verified!</Text>
      <Text style={styles.message}>You can now close this tab and sign in to the Finova app.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F6EBE4',
  },
  message: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 10,
    color: '#171717',
  },
});
