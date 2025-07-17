import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { 
  Modal, 
  Portal, 
  Card, 
  Title, 
  Button, 
  TextInput,
  useTheme,
  Text
} from 'react-native-paper';
import { X, DollarSign, ShoppingCart } from 'lucide-react-native';

interface AddShoppingItemModalProps {
  visible: boolean;
  onDismiss: () => void;
  onAddItem: (item: any) => void;
  categoryName: string;
}

export default function AddShoppingItemModal({ visible, onDismiss, onAddItem, categoryName }: AddShoppingItemModalProps) {
  const theme = useTheme();
  const [name, setName] = useState('');
  const [estimatedCost, setEstimatedCost] = useState('');

  const resetForm = () => {
    setName('');
    setEstimatedCost('');
  };

  const handleSubmit = () => {
    if (!name || !estimatedCost) {
      return;
    }

    const item = {
      name,
      estimatedCost: parseFloat(estimatedCost)
    };

    onAddItem(item);
    resetForm();
  };

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        contentContainerStyle={[styles.modal, { backgroundColor: theme.colors.surface }]}
      >
        <Card style={{ backgroundColor: theme.colors.surface }}>
          <Card.Content>
            <View style={styles.header}>
              <Title style={[styles.title, { color: theme.colors.onSurface }]}>
                Add Item to {categoryName}
              </Title>
              <Button 
                mode="text" 
                onPress={onDismiss}
                icon={() => <X size={20} color={theme.colors.onSurface} />}
              >
                Close
              </Button>
            </View>

            {/* Item Name Input */}
            <TextInput
              label="Item Name"
              value={name}
              onChangeText={setName}
              mode="outlined"
              style={styles.input}
              left={<TextInput.Icon icon={() => <ShoppingCart size={20} color={theme.colors.onSurfaceVariant} />} />}
              placeholder="e.g., Milk, Bread, T-Shirt"
            />

            {/* Estimated Cost Input */}
            <TextInput
              label="Estimated Cost"
              value={estimatedCost}
              onChangeText={setEstimatedCost}
              keyboardType="numeric"
              mode="outlined"
              style={styles.input}
              left={<TextInput.Icon icon={() => <DollarSign size={20} color={theme.colors.onSurfaceVariant} />} />}
              placeholder="0.00"
            />

            {/* Submit Button */}
            <Button
              mode="contained"
              onPress={handleSubmit}
              style={styles.submitButton}
              disabled={!name || !estimatedCost}
            >
              Add Item
            </Button>
          </Card.Content>
        </Card>
      </Modal>
    </Portal>
  );
}

const styles = StyleSheet.create({
  modal: {
    margin: 20,
    borderRadius: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  input: {
    marginBottom: 16,
  },
  submitButton: {
    marginTop: 10,
  },
});