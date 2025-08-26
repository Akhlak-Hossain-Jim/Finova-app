import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import {
  Modal,
  Portal,
  Text,
  Button,
  useTheme,
  Checkbox,
  List,
} from 'react-native-paper';
import { ShoppingItem } from '@/hooks/useShoppingLists';

interface ImportFromPreviousModalProps {
  visible: boolean;
  onDismiss: () => void;
  previousItems: ShoppingItem[];
  onImport: (items: ShoppingItem[]) => void;
}

export default function ImportFromPreviousModal({
  visible,
  onDismiss,
  previousItems,
  onImport,
}: ImportFromPreviousModalProps) {
  const theme = useTheme();
  const [selectedItems, setSelectedItems] = useState<ShoppingItem[]>([]);

  useEffect(() => {
    if (!visible) {
      setSelectedItems([]); // Clear selections when modal is dismissed
    }
  }, [visible]);

  const toggleItemSelection = (item: ShoppingItem) => {
    setSelectedItems((prevSelected) =>
      prevSelected.some((selected) => selected.id === item.id)
        ? prevSelected.filter((selected) => selected.id !== item.id)
        : [...prevSelected, item]
    );
  };

  const handleImport = () => {
    onImport(selectedItems);
    onDismiss();
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
          Import from Previous Lists
        </Text>
        <ScrollView style={styles.itemsContainer}>
          {previousItems.length === 0 ? (
            <Text style={styles.emptyText}>No previous items found.</Text>
          ) : (
            previousItems.map((item) => (
              <List.Item
                key={item.id}
                title={item.name}
                description={`Est: ${item.estimated_cost || 0}`}
                left={() => (
                  <Checkbox
                    status={selectedItems.some((selected) => selected.id === item.id)
                      ? 'checked'
                      : 'unchecked'
                    }
                    onPress={() => toggleItemSelection(item)}
                  />
                )}
                onPress={() => toggleItemSelection(item)}
              />
            ))
          )}
        </ScrollView>
        <View style={styles.buttonContainer}>
          <Button onPress={onDismiss} mode="outlined" style={styles.button}>
            Cancel
          </Button>
          <Button
            onPress={handleImport}
            mode="contained"
            style={styles.button}
            disabled={selectedItems.length === 0}
          >
            Import ({selectedItems.length})
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
    maxHeight: '80%',
  },
  modalTitle: {
    marginBottom: 20,
    textAlign: 'center',
  },
  itemsContainer: {
    flexGrow: 1,
    marginBottom: 20,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
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
