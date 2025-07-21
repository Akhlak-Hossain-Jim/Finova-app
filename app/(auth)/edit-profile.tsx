import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import {
  Card,
  Button,
  useTheme,
  Text,
  TextInput,
  IconButton,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { User, Mail, ArrowLeft } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';

import { currencies } from '@/consts/currencies';

export default function EditProfileScreen() {
  const theme = useTheme();
  const {
    user,
    sendVerificationEmail,
    resendEmailDisabled,
    updateUserProfile,
  } = useAuth();

  const [userProfile] = useState({
    name: user?.user_metadata?.full_name || 'User',
    email: user?.email || '',
    currency: 'USD',
  });

  const [editForm, setEditForm] = useState({
    name: userProfile.name,
    currency: userProfile.currency,
  });

  const handleSaveProfile = async () => {
    const { error } = await updateUserProfile(editForm.name, editForm.currency);
    if (error) {
      Alert.alert('Error', error.message);
    } else {
      Alert.alert('Success', 'Profile updated successfully!');
      router.back();
    }
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <IconButton
            icon={() => (
              <ArrowLeft size={24} color={theme.colors.onBackground} />
            )}
            onPress={() => router.back()}
            style={styles.backButton}
          />
          <Text
            variant="titleLarge"
            style={[styles.title, { color: theme.colors.onBackground }]}
          >
            Edit Profile
          </Text>
        </View>

        <Card
          style={[
            styles.profileCard,
            { backgroundColor: theme.colors.surface },
          ]}
        >
          <Card.Content>
            <Button
              mode="outlined"
              onPress={sendVerificationEmail}
              disabled={
                user?.email_confirmed_at ? true : false || resendEmailDisabled
              }
              style={styles.verificationButton}
              icon={() => (
                <Mail size={20} color={theme.colors.onSurfaceVariant} />
              )}
            >
              {user?.email_confirmed_at
                ? 'Verified'
                : resendEmailDisabled
                ? 'Email Sent (wait a moment)'
                : 'Send Verification Email'}
            </Button>
            <TextInput
              label="Full Name"
              value={editForm.name}
              onChangeText={(text) =>
                setEditForm((prev) => ({ ...prev, name: text }))
              }
              mode="outlined"
              style={styles.input}
              left={
                <TextInput.Icon
                  icon={() => (
                    <User size={20} color={theme.colors.onSurfaceVariant} />
                  )}
                />
              }
            />

            <Text
              style={[styles.pickerLabel, { color: theme.colors.onSurface }]}
            >
              Currency
            </Text>
            <View
              style={[
                styles.pickerContainer,
                { borderColor: theme.colors.outline },
              ]}
            >
              <Picker
                selectedValue={editForm.currency}
                onValueChange={(itemValue) =>
                  setEditForm((prev) => ({ ...prev, currency: itemValue }))
                }
                style={[
                  styles.picker,
                  {
                    color: theme.colors.onSurface,
                    backgroundColor: theme.colors.surface,
                  },
                ]}
              >
                {currencies.map((currency) => (
                  <Picker.Item
                    key={currency.value}
                    label={currency.label}
                    value={currency.value}
                  />
                ))}
              </Picker>
            </View>

            <Button
              mode="contained"
              onPress={handleSaveProfile}
              style={styles.saveButton}
            >
              Save Changes
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
    padding: 20,
    paddingBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  profileCard: {
    margin: 16,
    elevation: 2,
  },
  input: {
    marginBottom: 16,
  },
  saveButton: {
    marginTop: 10,
  },
  verificationButton: {
    marginTop: 10,
  },
  pickerLabel: {
    fontSize: 16,
    marginBottom: 8,
    marginTop: 16,
  },
  pickerContainer: {
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 16,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    width: '100%',
    paddingHorizontal: 12,
  },
});
