import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Portal, Modal, Text, Button, useTheme } from 'react-native-paper';

interface VerificationOverlayProps {
  isVerified: boolean;
  onResendEmail: () => void;
  resendDisabled: boolean;
}

export default function VerificationOverlay({
  isVerified,
  onResendEmail,
  resendDisabled,
}: VerificationOverlayProps) {
  const theme = useTheme();

  if (isVerified) {
    return null;
  }

  return (
    <Portal>
      <Modal
        visible={!isVerified}
        dismissable={false}
        contentContainerStyle={[
          styles.modalContainer,
          { backgroundColor: theme.colors.surface },
        ]}
      >
        <View style={styles.content}>
          <Text variant="titleLarge" style={styles.title}>
            Account Not Verified
          </Text>
          <Text variant="bodyMedium" style={styles.message}>
            Please check your email for a verification link.
          </Text>
          <Button
            mode="contained"
            onPress={onResendEmail}
            disabled={resendDisabled}
            style={styles.button}
          >
            {resendDisabled ? 'Email Sent (wait a moment)' : 'Resend Verification Email'}
          </Button>
        </View>
      </Modal>
    </Portal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    margin: 20,
    padding: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
  },
  title: {
    marginBottom: 10,
    fontWeight: 'bold',
  },
  message: {
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    marginTop: 10,
  },
});
