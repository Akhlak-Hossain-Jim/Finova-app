import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Link, Stack } from 'expo-router';

export default function CheckEmailScreen() {
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Check Your Email' }} />
      <Text style={styles.message}>Check your email and follow the process to confirm your signup.</Text>
      <Text style={styles.message}>Then, sign in with your app afterwards.</Text>
      <Link href="/signin" asChild>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Sign In</Text>
        </TouchableOpacity>
      </Link>
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
  button: {
    backgroundColor: '#171717',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 16,
    marginTop: 20,
  },
  buttonText: {
    color: '#F6EBE4',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
