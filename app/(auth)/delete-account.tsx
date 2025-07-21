import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Alert } from 'react-native';
import {
  Card,
  Button,
  useTheme,
  Text,
  TextInput,
  IconButton,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';

export default function DeleteAccountScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { deleteUserAccount } = useAuth();
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleDeleteAccount = async () => {
    console.log('handleDeleteAccount called');
    Alert.alert(
      'Delete Account',
      'Are you sure you want to permanently delete your account? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            console.log('Delete button pressed');
            if (!password) {
              Alert.alert('Error', 'Please enter your password to confirm.');
              console.log('Password not entered');
              return;
            }
            setLoading(true);
            console.log('Loading set to true');
            // In a real application, you would re-authenticate the user here
            // before allowing account deletion for security reasons.
            // Supabase does not directly expose a client-side function to delete a user by password.
            // This operation should ideally be done on a secure backend/edge function.
            // The password entered here is for client-side confirmation only.
            // The actual deletion is handled by a Supabase Edge Function.

            console.log('Calling deleteUserAccount...');
            const { error } = await deleteUserAccount(password);
            if (error) {
              console.error('Error deleting account:', error);
              Alert.alert('Error', error.message);
            } else {
              console.log('Account deleted successfully');
              Alert.alert('Success', 'Your account has been deleted.');
              router.replace('/(auth)/signin');
            }
            setLoading(false);
            console.log('Loading set to false');
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <View style={styles.header}>
        <IconButton
          icon={() => <ArrowLeft size={24} color={theme.colors.onBackground} />}
          onPress={() => router.back()}
          style={styles.backButton}
        />
        <Text
          variant="titleLarge"
          style={[styles.title, { color: theme.colors.onBackground }]}
        >
          Delete Account
        </Text>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <Card.Content>
            <Text style={[styles.warningText, { color: theme.colors.error }]}>
              Deleting your account is permanent and cannot be undone.
            </Text>
            <Text
              style={[
                styles.infoText,
                { color: theme.colors.onSurfaceVariant },
              ]}
            >
              To confirm, please type your password below.
            </Text>
            <TextInput
              label="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              mode="outlined"
              style={styles.input}
            />
            <Button
              mode="contained"
              onPress={handleDeleteAccount}
              loading={loading}
              disabled={loading || !password}
              style={styles.deleteButton}
              buttonColor={theme.colors.error}
            >
              Delete My Account
            </Button>
          </Card.Content>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 10,
  },
  backButton: {
    marginRight: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  card: {
    elevation: 4,
    padding: 10,
  },
  warningText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    marginBottom: 20,
  },
  deleteButton: {
    marginTop: 10,
  },
});
