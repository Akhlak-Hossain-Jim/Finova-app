import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Text, useTheme, IconButton } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft } from 'lucide-react-native';
import { useRouter } from 'expo-router';

export default function PrivacyPolicyScreen() {
  const theme = useTheme();
  const router = useRouter();

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <IconButton
          icon={() => <ArrowLeft size={24} color={theme.colors.onBackground} />}
          onPress={() => router.back()}
          style={styles.backButton}
        />
        <Text variant="titleLarge" style={[styles.title, { color: theme.colors.onBackground }]}>
          Privacy Policy
        </Text>
      </View>
      <ScrollView style={styles.content}>
        <Text style={[styles.paragraph, { color: theme.colors.onSurface }]}>
          Your privacy is important to us. This Privacy Policy explains how Finova collects, uses, and protects your personal information.
        </Text>
        <Text style={[styles.paragraph, { color: theme.colors.onSurface }]}>
          We collect information that you provide directly to us, such as when you create an account, update your profile, or input financial data. This may include your name, email address, and financial transaction details.
        </Text>
        <Text style={[styles.paragraph, { color: theme.colors.onSurface }]}>
          We use the information we collect to provide, maintain, and improve our services, to process your transactions, and to communicate with you. We may also use the information to personalize your experience and to provide you with relevant content and offers.
        </Text>
        <Text style={[styles.paragraph, { color: theme.colors.onSurface }]}>
          We implement a variety of security measures to maintain the safety of your personal information when you enter, submit, or access your personal information. Your data is stored securely with Supabase.
        </Text>
        <Text style={[styles.paragraph, { color: theme.colors.onSurface }]}>
          We do not sell, trade, or otherwise transfer to outside parties your personally identifiable information. This does not include trusted third parties who assist us in operating our website, conducting our business, or servicing you, so long as those parties agree to keep this information confidential.
        </Text>
        <Text style={[styles.paragraph, { color: theme.colors.onSurface }]}>
          By using our app, you consent to our privacy policy.
        </Text>
        <Text style={[styles.paragraph, { color: theme.colors.onSurface }]}>
          This policy was last modified on July 18, 2025.
        </Text>
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
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  paragraph: {
    marginBottom: 10,
    lineHeight: 22,
  },
});
