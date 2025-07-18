import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Alert } from 'react-native';
import {
  Surface,
  Card,
  Button,
  FAB,
  useTheme,
  Text,
  Divider,
  Chip,
  IconButton,
  List,
  Checkbox,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Plus,
  ShoppingBag,
  Chrome as Home,
  Car,
  Heart,
  Package,
  Utensils,
  Shirt,
} from 'lucide-react-native';
import AddShoppingItemModal from '@/components/AddShoppingItemModal';
import { useShoppingListsContext } from '@/contexts/ShoppingListsContext';
import { ShoppingList } from '@/hooks/useShoppingLists';
import { useAuth } from '@/contexts/AuthContext';

const shoppingCategories = [
  { id: 'groceries', name: 'Groceries', icon: Utensils, color: '#36A2EB' },
  { id: 'clothing', name: 'Clothing', icon: Shirt, color: '#FF6384' },
  { id: 'household', name: 'Household', icon: Home, color: '#4BC0C0' },
  { id: 'electronics', name: 'Electronics', icon: Package, color: '#9966FF' },
  { id: 'health', name: 'Health & Beauty', icon: Heart, color: '#FFCE56' },
  { id: 'general', name: 'General', icon: ShoppingBag, color: '#FF9F40' },
];

export default function ShoppingScreen() {
  const theme = useTheme();
  const { lists, loading, addList, addItem, toggleItem, deleteItem, refetch } =
    useShoppingListsContext();
  const [activeCategory, setActiveCategory] = useState('groceries');
  const { user } = useAuth();
  const [showAddModal, setShowAddModal] = useState(false);
  const [currentActiveList, setCurrentActiveList] = useState<
    ShoppingList | undefined
  >(undefined);

  useEffect(() => {
    const updateActiveList = async () => {
      // Only proceed if loading is false, meaning lists have been fetched
      if (!loading) {
        const categoryData = shoppingCategories.find(
          (cat) => cat.id === activeCategory
        );
        let foundList = lists.find((list) => list.category === activeCategory);

        if (!foundList && categoryData && user?.id) {
          // Create a new list for this category and await its creation
          const result = await addList({
            category: activeCategory,
            name: categoryData.name,
          });

          if (result.success && result.data) {
            foundList = result.data; // Use the actual list data returned from the database
            await refetch(); // Ensure lists are re-fetched after adding a new one
          }
        }
        setCurrentActiveList(foundList);
      }
    };

    updateActiveList();
  }, [activeCategory, lists, addList, refetch, loading, user?.id]);

  const activeItems = currentActiveList?.shopping_items || [];
  const activeCategoryData = shoppingCategories.find(
    (cat) => cat.id === activeCategory
  );

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const getTotalEstimated = () => {
    return activeItems.reduce(
      (sum, item) => sum + (item.estimated_cost || 0),
      0
    );
  };

  const getTotalActual = () => {
    return activeItems.reduce((sum, item) => sum + (item.actual_cost || 0), 0);
  };

  const getPurchasedCount = () => {
    return activeItems.filter((item) => item.is_purchased).length;
  };

  const handleToggleItem = (itemId: string) => {
    toggleItem(itemId);
  };

  const handleAddItem = (itemData: any) => {
    if (currentActiveList && currentActiveList.id) {
      addItem(currentActiveList.id, itemData);
    }
    setShowAddModal(false);
  };

  const handleDeleteItem = (itemId: string) => {
    Alert.alert('Delete Item', 'Are you sure you want to delete this item?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => deleteItem(itemId),
      },
    ]);
  };

  if (loading) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: theme.colors.background }]}
      >
        <View style={styles.loadingContainer}>
          <Text>Loading shopping lists...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <View style={styles.header}>
        <Text
          variant="titleLarge"
          style={[styles.title, { color: theme.colors.onBackground }]}
        >
          Shopping Lists
        </Text>
      </View>

      {/* Category Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoryTabs}
      >
        {shoppingCategories.map((category) => (
          <Chip
            key={category.id}
            selected={activeCategory === category.id}
            onPress={() => setActiveCategory(category.id)}
            style={styles.categoryChip}
            icon={() => <category.icon size={16} color={category.color} />}
          >
            {category.name}
          </Chip>
        ))}
      </ScrollView>

      {/* Shopping Summary */}
      <Card
        style={[styles.summaryCard, { backgroundColor: theme.colors.surface }]}
      >
        <Card.Content>
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Text
                style={[
                  styles.summaryLabel,
                  { color: theme.colors.onSurfaceVariant },
                ]}
              >
                Total Items
              </Text>
              <Text
                style={[styles.summaryValue, { color: theme.colors.onSurface }]}
              >
                {activeItems.length}
              </Text>
            </View>
            <View style={styles.summaryItem}>
              <Text
                style={[
                  styles.summaryLabel,
                  { color: theme.colors.onSurfaceVariant },
                ]}
              >
                Purchased
              </Text>
              <Text
                style={[styles.summaryValue, { color: theme.colors.primary }]}
              >
                {getPurchasedCount()}
              </Text>
            </View>
            <View style={styles.summaryItem}>
              <Text
                style={[
                  styles.summaryLabel,
                  { color: theme.colors.onSurfaceVariant },
                ]}
              >
                Estimated
              </Text>
              <Text
                style={[styles.summaryValue, { color: theme.colors.onSurface }]}
              >
                {formatCurrency(getTotalEstimated())}
              </Text>
            </View>
            <View style={styles.summaryItem}>
              <Text
                style={[
                  styles.summaryLabel,
                  { color: theme.colors.onSurfaceVariant },
                ]}
              >
                Actual
              </Text>
              <Text
                style={[styles.summaryValue, { color: theme.colors.error }]}
              >
                {formatCurrency(getTotalActual())}
              </Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* Shopping Items */}
      <ScrollView style={styles.itemsList} showsVerticalScrollIndicator={false}>
        {activeItems.length === 0 ? (
          <Card
            style={[
              styles.emptyCard,
              { backgroundColor: theme.colors.surface },
            ]}
          >
            <Card.Content>
              <Text
                style={[
                  styles.emptyText,
                  { color: theme.colors.onSurfaceVariant },
                ]}
              >
                No items in this category yet. Add some items to get started!
              </Text>
            </Card.Content>
          </Card>
        ) : (
          activeItems.map((item) => (
            <Card
              key={item.id}
              style={[
                styles.itemCard,
                { backgroundColor: theme.colors.surface },
              ]}
            >
              <Card.Content>
                <View style={styles.itemRow}>
                  <Checkbox
                    status={item.is_purchased ? 'checked' : 'unchecked'}
                    onPress={() => handleToggleItem(item.id)}
                  />
                  <View style={styles.itemDetails}>
                    <Text
                      style={[
                        styles.itemName,
                        {
                          color: theme.colors.onSurface,
                          textDecorationLine: item.is_purchased
                            ? 'line-through'
                            : 'none',
                        },
                      ]}
                    >
                      {item.name}
                    </Text>
                    <View style={styles.itemCosts}>
                      <Text
                        style={[
                          styles.estimatedCost,
                          { color: theme.colors.onSurfaceVariant },
                        ]}
                      >
                        Est: {formatCurrency(item.estimated_cost || 0)}
                      </Text>
                      {item.is_purchased && (
                        <Text
                          style={[
                            styles.actualCost,
                            { color: theme.colors.error },
                          ]}
                        >
                          Actual: {formatCurrency(item.actual_cost || 0)}
                        </Text>
                      )}
                    </View>
                  </View>
                  <IconButton
                    icon="delete"
                    size={18}
                    iconColor={theme.colors.error}
                    onPress={() => handleDeleteItem(item.id)}
                  />
                </View>
              </Card.Content>
            </Card>
          ))
        )}
      </ScrollView>

      <FAB
        icon={() => <Plus size={24} color={theme.colors.onPrimary} />}
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        onPress={() => {
          if (currentActiveList && currentActiveList.id) {
            setShowAddModal(true);
          } else {
            Alert.alert(
              'Please wait',
              'Shopping list is being prepared. Please try again in a moment.'
            );
          }
        }}
      />

      <AddShoppingItemModal
        visible={showAddModal}
        onDismiss={() => setShowAddModal(false)}
        onAddItem={handleAddItem}
        categoryName={activeCategoryData?.name || 'Shopping'}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  categoryTabs: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    flexGrow: 0,
    flexShrink: 0,
    flexBasis: 'auto',
  },
  categoryChip: {
    marginRight: 8,
  },
  summaryCard: {
    margin: 16,
    elevation: 2,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  itemsList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  emptyCard: {
    marginBottom: 8,
    elevation: 1,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    padding: 20,
  },
  itemCard: {
    marginBottom: 8,
    elevation: 1,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemDetails: {
    flex: 1,
    marginLeft: 8,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '500',
  },
  itemCosts: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 4,
  },
  estimatedCost: {
    fontSize: 14,
  },
  actualCost: {
    fontSize: 14,
    fontWeight: '500',
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    elevation: 6,
  },
});
