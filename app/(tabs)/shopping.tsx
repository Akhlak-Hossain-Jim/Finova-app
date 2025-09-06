import React, { useState, useEffect, useMemo } from 'react';
import { View, ScrollView, StyleSheet, Alert } from 'react-native';
import {
  Card,
  FAB,
  useTheme,
  Text,
  Chip,
  IconButton,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Plus,
  ShoppingBag,
  Home,
  Heart,
  Package,
  Utensils,
  Shirt,
  CheckCircle,
  Circle,
  Pencil,
} from 'lucide-react-native';
import AddShoppingItemModal from '@/components/AddShoppingItemModal';
import EditShoppingItemCostModal from '@/components/EditShoppingItemCostModal';
import AddOptionsModal from '@/components/AddOptionsModal';
import ImportFromPreviousModal from '@/components/ImportFromPreviousModal';
import { useShoppingListsContext } from '@/contexts/ShoppingListsContext';
import { ShoppingItem, ShoppingList } from '@/hooks/useShoppingLists';
import { useAuth } from '@/contexts/AuthContext';
import VerificationOverlay from '@/components/VerificationOverlay';
import { formatCurrency } from '@/consts/currencySymbols';

const shoppingCategories = [
  { id: 'groceries', name: 'Groceries', icon: Utensils, color: '#36A2EB' },
  { id: 'clothing', name: 'Clothing', icon: Shirt, color: '#FF6384' },
  { id: 'household', name: 'Household', icon: Home, color: '#4BC0C0' },
  { id: 'electronics', name: 'Electronics', icon: Package, color: '#9966FF' },
  { id: 'health', name: 'Health & Beauty', icon: Heart, color: '#ff6a00' },
  { id: 'general', name: 'General', icon: ShoppingBag, color: '#FF9F40' },
];

export default function ShoppingScreen() {
  const theme = useTheme();
  const {
    lists,
    loading,
    addList,
    addItem,
    toggleItem,
    deleteItem,
    refetch,
    updateItem,
  } = useShoppingListsContext();
  const [activeCategory, setActiveCategory] = useState('groceries');
  const { user, profile, sendVerificationEmail, resendEmailDisabled } =
    useAuth();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAddOptionsModal, setShowAddOptionsModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [previousShoppingItems, setPreviousShoppingItems] = useState<
    ShoppingItem[]
  >([]);
  const [currentActiveList, setCurrentActiveList] = useState<
    ShoppingList | undefined
  >(undefined);
  const [filteredItems, setFilteredItems] = useState<ShoppingItem[]>([]);

  useEffect(() => {
    const updateActiveList = async () => {
      if (!loading) {
        const categoryData = shoppingCategories.find(
          (cat) => cat.id === activeCategory
        );
        let foundList = lists.find((list) => list.category === activeCategory);

        if (!foundList && categoryData && user?.id) {
          const result = await addList({
            category: activeCategory,
            name: categoryData.name,
          });

          if (result.success && result.data) {
            foundList = result.data;
            await refetch();
          }
        }
        setCurrentActiveList(foundList);
      }
    };

    updateActiveList();
  }, [activeCategory, lists, addList, refetch, loading, user?.id]);

  const activeItems = useMemo(
    () => currentActiveList?.shopping_items || [],
    [currentActiveList]
  );

  useEffect(() => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    const items = activeItems.filter((item) => {
      if (!item.is_purchased) {
        return true;
      }

      if (item.purchased_at) {
        const purchasedDate = new Date(item.purchased_at);
        return (
          purchasedDate.getMonth() === currentMonth &&
          purchasedDate.getFullYear() === currentYear
        );
      }

      return false;
    });

    setFilteredItems(items);
  }, [activeItems]);
  const activeCategoryData = shoppingCategories.find(
    (cat) => cat.id === activeCategory
  );

  const getTotalEstimated = () => {
    return filteredItems.reduce(
      (sum, item) => sum + (item.estimated_cost || 0),
      0
    );
  };

  const getTotalActual = () => {
    return filteredItems.reduce(
      (sum, item) => sum + (item.actual_cost || 0),
      0
    );
  };

  const getPurchasedCount = () => {
    return filteredItems.filter((item) => item.is_purchased).length;
  };

  const handleToggleItem = (itemId: string) => {
    toggleItem(itemId);
  };

  const [showEditCostModal, setShowEditCostModal] = useState(false);
  const [itemToEdit, setItemToEdit] = useState<ShoppingItem | null>(null);

  const handleEditActualCost = (item: ShoppingItem) => {
    setItemToEdit(item);
    setShowEditCostModal(true);
  };

  const handleSaveActualCost = (itemId: string, newCost: number) => {
    updateItem(itemId, { actual_cost: newCost });
  };

  const handleAddItem = (itemData: any) => {
    if (currentActiveList && currentActiveList.id) {
      addItem(currentActiveList.id, itemData);
    }
    setShowAddModal(false);
  };

  const handleImportFromPrevious = async () => {
    const allItems = activeItems;
    setPreviousShoppingItems(allItems);
    setShowImportModal(true);
  };

  const handleImportItems = (itemsToImport: ShoppingItem[]) => {
    if (currentActiveList && currentActiveList.id) {
      itemsToImport.forEach((item) => {
        addItem(currentActiveList.id, {
          name: item.name,
          estimated_cost: item.estimated_cost || 0,
        });
      });
    }
    setShowImportModal(false);
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
                {filteredItems.length}
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
                {formatCurrency(getTotalEstimated(), profile)}
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
                {formatCurrency(getTotalActual(), profile)}
              </Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* Shopping Items */}
      <ScrollView style={styles.itemsList} showsVerticalScrollIndicator={false}>
        {filteredItems.length === 0 ? (
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
          filteredItems.map((item) => (
            <Card
              key={item.id}
              style={[
                styles.itemCard,
                { backgroundColor: theme.colors.surface },
              ]}
            >
              <Card.Content>
                <View
                  style={[
                    styles.itemRow,
                    { opacity: item.is_purchased ? 0.6 : 1 },
                  ]}
                >
                  <View style={styles.checkboxContainer}>
                    {item.is_purchased ? (
                      <CheckCircle
                        size={24}
                        color={theme.colors.primary}
                        onPress={() => handleToggleItem(item.id)}
                      />
                    ) : (
                      <Circle
                        size={24}
                        color={theme.colors.onSurfaceVariant}
                        onPress={() => handleToggleItem(item.id)}
                      />
                    )}
                  </View>
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
                        Est: {formatCurrency(item.estimated_cost || 0, profile)}
                      </Text>
                      {item.is_purchased && (
                        <View style={styles.actualCostContainer}>
                          <Text
                            style={[
                              styles.actualCost,
                              { color: theme.colors.error },
                            ]}
                            onPress={() => handleEditActualCost(item)}
                          >
                            Actual:{' '}
                            {formatCurrency(item.actual_cost || 0, profile)}
                          </Text>
                          <Pencil
                            size={14}
                            color={theme.colors.error}
                            onPress={() => handleEditActualCost(item)}
                          />
                        </View>
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
            setShowAddOptionsModal(true);
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

      <EditShoppingItemCostModal
        visible={showEditCostModal}
        onDismiss={() => setShowEditCostModal(false)}
        item={itemToEdit}
        onSave={handleSaveActualCost}
      />

      <AddOptionsModal
        visible={showAddOptionsModal}
        onDismiss={() => setShowAddOptionsModal(false)}
        onAddNewItem={() => setShowAddModal(true)}
        onImportFromPrevious={handleImportFromPrevious}
      />

      <ImportFromPreviousModal
        visible={showImportModal}
        onDismiss={() => setShowImportModal(false)}
        previousItems={previousShoppingItems}
        onImport={handleImportItems}
      />

      <VerificationOverlay
        isVerified={user?.email_confirmed_at ? true : false}
        onResendEmail={sendVerificationEmail}
        resendDisabled={resendEmailDisabled}
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
  checkboxContainer: {
    width: 40,
    height: 40,
    justifyContent: 'center',
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
  actualCostContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  actualCostInput: {
    height: 30,
    width: 120,
    fontSize: 14,
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    elevation: 6,
  },
});
