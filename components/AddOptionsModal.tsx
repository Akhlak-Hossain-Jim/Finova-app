import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Modal, Portal, Text, Button, useTheme } from 'react-native-paper';

interface AddOptionsModalProps {
  visible: boolean;
  onDismiss: () => void;
  onAddNewItem: () => void;
  onImportFromPrevious: () => void;
}

export default function AddOptionsModal({
  visible,
  onDismiss,
  onAddNewItem,
  onImportFromPrevious,
}: AddOptionsModalProps) {
  const theme = useTheme();

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        contentContainerStyle={[
          styles.modalContainer,
          { backgroundColor: theme.colors.surface },
        ]}
      >
        <Text variant="titleLarge" style={styles.modalTitle}>
          Add Shopping Item
        </Text>
        <View style={styles.buttonContainer}>
          <Button
            mode="contained"
            onPress={() => {
              onDismiss();
              onAddNewItem();
            }}
            style={styles.button}
          >
            Add New Item
          </Button>
          <Button
            mode="outlined"
            onPress={() => {
              onDismiss();
              onImportFromPrevious();
            }}
            style={styles.button}
          >
            Import from Previous Lists
          </Button>
        </View>
      </Modal>
    </Portal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 8,
  },
  modalTitle: {
    marginBottom: 20,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'column',
    gap: 10,
  },
  button: {
    width: '100%',
  },
});
