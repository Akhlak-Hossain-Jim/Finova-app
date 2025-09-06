import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import {
  Modal,
  Portal,
  Text,
  Button,
  TextInput,
  useTheme,
} from 'react-native-paper';
import { ShoppingItem } from '@/hooks/useShoppingLists';
import { useAuth } from '@/contexts/AuthContext';

interface EditShoppingItemCostModalProps {
  visible: boolean;
  onDismiss: () => void;
  item: ShoppingItem | null;
  onSave: (itemId: string, newCost: number) => void;
}

export default function EditShoppingItemCostModal({
  visible,
  onDismiss,
  item,
  onSave,
}: EditShoppingItemCostModalProps) {
  const theme = useTheme();
  const [actualCost, setActualCost] = useState('');
  const { profile } = useAuth();

  useEffect(() => {
    if (item) {
      setActualCost(item.actual_cost?.toString() || '');
    }
  }, [item]);

  const handleSave = () => {
    if (item) {
      const cost = parseFloat(actualCost);
      if (!isNaN(cost)) {
        onSave(item.id, cost);
        onDismiss();
      } else {
        // Optionally show an error message for invalid input
        console.error('Invalid cost input');
      }
    }
  };

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
          Edit Actual Cost
        </Text>
        <TextInput
          label="Actual Cost"
          value={actualCost}
          onChangeText={setActualCost}
          keyboardType="numeric"
          mode="outlined"
          style={styles.textInput}
          right={<TextInput.Affix text={profile?.currency ?? 'BDT'} />}
        />
        <View style={styles.buttonContainer}>
          <Button onPress={onDismiss} mode="outlined" style={styles.button}>
            Cancel
          </Button>
          <Button onPress={handleSave} mode="contained" style={styles.button}>
            Save
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
  textInput: {
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  button: {
    flex: 1,
    marginHorizontal: 5,
  },
});
