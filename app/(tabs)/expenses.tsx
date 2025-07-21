import React, { useState } from 'react';
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
  Home,
  ShoppingBag,
  Car,
  Heart,
  CreditCard,
  Users,
  Gift,
  Calendar,
  Filter,
} from 'lucide-react-native';
import AddExpenseModal from '@/components/AddExpenseModal';
import { useExpensesContext } from '@/contexts/ExpensesContext';
import { useAuth } from '@/contexts/AuthContext';
import VerificationOverlay from '@/components/VerificationOverlay';
import { getCurrencySymbol } from '@/consts/currencySymbols';

export default function ExpensesScreen() {
  const theme = useTheme();
  const { expenses, categories, addExpense, deleteExpense } =
    useExpensesContext();
  const { user, sendVerificationEmail, resendEmailDisabled } = useAuth();
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredExpenses =
    selectedCategory === 'all'
      ? expenses
      : expenses.filter((expense) =>
          expense.category.toLowerCase().includes(selectedCategory)
        );

  const totalExpenses = filteredExpenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );

  const formatCurrency = (amount: number) => {
    const userCurrency = user?.user_metadata?.currency || 'USD';
    const symbol = getCurrencySymbol(userCurrency);
    return `${symbol}${new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount)}`;
  };

  const getCategoryIcon = (categoryName: string) => {
    const iconMap: { [key: string]: any } = {
      housing: Home,
      food: ShoppingBag,
      shopping: ShoppingBag,
      health: Heart,
      transport: Car,
      financial: CreditCard,
      family: Users,
      charity: Gift,
      annual: Calendar,
    };
    return iconMap[categoryName.toLowerCase()] || ShoppingBag;
  };

  const getCategoryColor = (categoryName: string) => {
    const colorMap: { [key: string]: string } = {
      housing: '#FF6384',
      food: '#36A2EB',
      shopping: '#ff6a00',
      health: '#4BC0C0',
      transport: '#9966FF',
      financial: '#FF9F40',
      family: '#FF6384',
      charity: '#4BC0C0',
      annual: '#36A2EB',
    };
    return colorMap[categoryName.toLowerCase()] || '#999999';
  };

  const handleDeleteExpense = (expenseId: string) => {
    Alert.alert(
      'Delete Expense',
      'Are you sure you want to delete this expense?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteExpense(expenseId),
        },
      ]
    );
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <View style={styles.header}>
        <Text
          variant="titleLarge"
          style={[styles.title, { color: theme.colors.onBackground }]}
        >
          Expenses
        </Text>
        <Text style={[styles.totalAmount, { color: theme.colors.primary }]}>
          Total: {formatCurrency(totalExpenses)}
        </Text>
      </View>

      {/* Category Filter */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoryFilter}
      >
        <Chip
          selected={selectedCategory === 'all'}
          onPress={() => setSelectedCategory('all')}
          style={styles.filterChip}
          icon={() => (
            <Filter size={16} color={theme.colors.onSurfaceVariant} />
          )}
        >
          All
        </Chip>
        {categories.map((category) => (
          <Chip
            key={category.id}
            selected={selectedCategory === category.id}
            onPress={() => setSelectedCategory(category.id)}
            style={styles.filterChip}
            icon={() => {
              const IconComponent = getCategoryIcon(category.name);
              return <IconComponent size={16} color={category.color} />;
            }}
          >
            {category.name}
          </Chip>
        ))}
      </ScrollView>

      {/* Expenses List */}
      <ScrollView
        style={styles.expensesList}
        showsVerticalScrollIndicator={false}
      >
        {filteredExpenses.map((expense, index) => {
          const IconComponent = getCategoryIcon(expense.category);
          return (
            <Card
              key={expense.id}
              style={[
                styles.expenseCard,
                { backgroundColor: theme.colors.surface },
              ]}
            >
              <Card.Content>
                <View style={styles.expenseItem}>
                  <View style={styles.expenseIcon}>
                    <IconComponent
                      size={24}
                      color={getCategoryColor(expense.category)}
                    />
                  </View>
                  <View style={styles.expenseDetails}>
                    <Text
                      style={[
                        styles.expenseDescription,
                        { color: theme.colors.onSurface },
                      ]}
                    >
                      {expense.description}
                    </Text>
                    <Text
                      style={[
                        styles.expenseInfo,
                        { color: theme.colors.onSurfaceVariant },
                      ]}
                    >
                      {expense.category} • {expense.subcategory}
                    </Text>
                    <Text
                      style={[
                        styles.expenseDate,
                        { color: theme.colors.onSurfaceVariant },
                      ]}
                    >
                      {expense.date} • {expense.family_member}
                    </Text>
                  </View>
                  <View style={styles.expenseAmount}>
                    <Text
                      style={[styles.amount, { color: theme.colors.error }]}
                    >
                      -{formatCurrency(expense.amount)}
                    </Text>
                    <IconButton
                      icon="delete"
                      size={18}
                      iconColor={theme.colors.error}
                      onPress={() => handleDeleteExpense(expense.id)}
                    />
                  </View>
                </View>
              </Card.Content>
            </Card>
          );
        })}
      </ScrollView>

      <FAB
        icon={() => <Plus size={24} color={theme.colors.onPrimary} />}
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        onPress={() => setShowAddModal(true)}
      />

      <AddExpenseModal
        visible={showAddModal}
        onDismiss={() => setShowAddModal(false)}
        categories={categories}
        addExpense={addExpense}
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
  header: {
    padding: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  categoryFilter: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    flexGrow: 0,
    flexShrink: 0,
    flexBasis: 'auto',
  },
  filterChip: {
    marginRight: 8,
  },
  expensesList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  expenseCard: {
    marginBottom: 8,
    elevation: 1,
  },
  expenseItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  expenseIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  expenseDetails: {
    flex: 1,
  },
  expenseDescription: {
    fontSize: 16,
    fontWeight: '500',
  },
  expenseInfo: {
    fontSize: 14,
    marginTop: 2,
  },
  expenseDate: {
    fontSize: 12,
    marginTop: 2,
  },
  expenseAmount: {
    alignItems: 'flex-end',
  },
  amount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    elevation: 6,
  },
});
