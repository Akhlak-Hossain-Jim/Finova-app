import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Dimensions } from 'react-native';
import {
  Surface,
  Card,
  Button,
  FAB,
  useTheme,
  Text,
  Divider,
} from 'react-native-paper';
import { LineChart, PieChart } from 'react-native-chart-kit';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Plus,
  TrendingUp,
  TrendingDown,
  Target,
  Calendar,
} from 'lucide-react-native';
import { useExpensesContext } from '@/contexts/ExpensesContext';
import { useIncome } from '@/hooks/useIncome';
import { useSavingsGoals } from '@/hooks/useSavingsGoals';
import AddIncomeModal from '@/components/AddIncomeModal';

const { width: screenWidth } = Dimensions.get('window');

export default function HomeScreen() {
  const theme = useTheme();
  const { expenses, loading: expensesLoading } = useExpensesContext();
  const { income, loading: incomeLoading } = useIncome();
  const { goals, loading: goalsLoading } = useSavingsGoals();
  const [showAddIncomeModal, setShowAddIncomeModal] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  // Calculate current month data
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const monthlyIncome = income
    .filter((item) => {
      const itemDate = new Date(item.date);
      return (
        itemDate.getMonth() === currentMonth &&
        itemDate.getFullYear() === currentYear
      );
    })
    .reduce((sum, item) => sum + item.amount, 0);

  const monthlyExpenses = expenses
    .filter((expense) => {
      const expenseDate = new Date(expense.date);
      return (
        expenseDate.getMonth() === currentMonth &&
        expenseDate.getFullYear() === currentYear
      );
    })
    .reduce((sum, expense) => sum + expense.amount, 0);

  const monthlySavings = monthlyIncome - monthlyExpenses;
  const savingsRate =
    monthlyIncome > 0 ? Math.round((monthlySavings / monthlyIncome) * 100) : 0;

  // Get expense breakdown for pie chart
  const expensesByCategory = expenses
    .filter((expense) => {
      const expenseDate = new Date(expense.date);
      return (
        expenseDate.getMonth() === currentMonth &&
        expenseDate.getFullYear() === currentYear
      );
    })
    .reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
      return acc;
    }, {} as Record<string, number>);

  const expenseData = Object.entries(expensesByCategory).map(
    ([category, amount], index) => ({
      name: category,
      amount,
      color: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'][
        index % 6
      ],
      legendFontColor: '#7F7F7F',
    })
  );

  // Get recent transactions
  const recentTransactions = [
    ...expenses.slice(0, 3).map((expense) => ({
      id: expense.id,
      description: expense.description,
      amount: -expense.amount,
      category: expense.category,
      date: expense.date,
    })),
    ...income.slice(0, 2).map((incomeItem) => ({
      id: incomeItem.id,
      description: incomeItem.source,
      amount: incomeItem.amount,
      category: 'Income',
      date: incomeItem.date,
    })),
  ]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 4);

  const chartConfig = {
    backgroundGradientFrom: theme.colors.surface,
    backgroundGradientTo: theme.colors.surface,
    color: (opacity = 1) => `rgba(25, 118, 210, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.5,
    useShadowColorFromDataset: false,
  };

  const hasData = expenses.length > 0 || income.length > 0;
  const loading = expensesLoading || incomeLoading || goalsLoading;

  if (loading) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: theme.colors.background }]}
      >
        <View style={styles.loadingContainer}>
          <Text>Loading your financial data...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text
            variant="titleLarge"
            style={[styles.title, { color: theme.colors.onBackground }]}
          >
            Welcome to Finova
          </Text>
          <Text
            variant="bodyMedium"
            style={{ color: theme.colors.onSurfaceVariant }}
          >
            Track your finances efficiently
          </Text>
        </View>

        {!hasData ? (
          <Card
            style={[
              styles.noDataCard,
              { backgroundColor: theme.colors.surface },
            ]}
          >
            <Card.Content>
              <Text
                style={[styles.noDataTitle, { color: theme.colors.onSurface }]}
              >
                Not Enough Data Available
              </Text>
              <Text
                style={[
                  styles.noDataText,
                  { color: theme.colors.onSurfaceVariant },
                ]}
              >
                Start by adding your income and expenses to see your financial
                overview.
              </Text>
              <View style={styles.noDataButtons}>
                <Button
                  mode="contained"
                  onPress={() => setShowAddIncomeModal(true)}
                  style={styles.addButton}
                >
                  Add Income
                </Button>
                <Button
                  mode="outlined"
                  onPress={() => {
                    /* Navigate to expenses tab */
                  }}
                  style={styles.addButton}
                >
                  Add Expense
                </Button>
              </View>
            </Card.Content>
          </Card>
        ) : (
          <>
            {/* Financial Summary Cards */}
            <View style={styles.summaryContainer}>
              <Card
                style={[
                  styles.summaryCard,
                  { backgroundColor: theme.colors.primaryContainer },
                ]}
              >
                <Card.Content>
                  <View style={styles.summaryCardContent}>
                    <TrendingUp size={24} color={theme.colors.primary} />
                    <View style={styles.summaryText}>
                      <Text
                        style={[
                          styles.summaryAmount,
                          { color: theme.colors.onPrimaryContainer },
                        ]}
                      >
                        {formatCurrency(monthlyIncome)}
                      </Text>
                      <Text
                        style={[
                          styles.summaryLabel,
                          { color: theme.colors.onPrimaryContainer },
                        ]}
                      >
                        Monthly Income
                      </Text>
                    </View>
                  </View>
                </Card.Content>
              </Card>

              <Card
                style={[
                  styles.summaryCard,
                  { backgroundColor: theme.colors.errorContainer },
                ]}
              >
                <Card.Content>
                  <View style={styles.summaryCardContent}>
                    <TrendingDown size={24} color={theme.colors.error} />
                    <View style={styles.summaryText}>
                      <Text
                        style={[
                          styles.summaryAmount,
                          { color: theme.colors.onErrorContainer },
                        ]}
                      >
                        {formatCurrency(monthlyExpenses)}
                      </Text>
                      <Text
                        style={[
                          styles.summaryLabel,
                          { color: theme.colors.onErrorContainer },
                        ]}
                      >
                        Monthly Expenses
                      </Text>
                    </View>
                  </View>
                </Card.Content>
              </Card>
            </View>

            <View style={styles.summaryContainer}>
              <Card
                style={[
                  styles.summaryCard,
                  { backgroundColor: theme.colors.secondaryContainer },
                ]}
              >
                <Card.Content>
                  <View style={styles.summaryCardContent}>
                    <Target size={24} color={theme.colors.secondary} />
                    <View style={styles.summaryText}>
                      <Text
                        style={[
                          styles.summaryAmount,
                          { color: theme.colors.onSecondaryContainer },
                        ]}
                      >
                        {formatCurrency(monthlySavings)}
                      </Text>
                      <Text
                        style={[
                          styles.summaryLabel,
                          { color: theme.colors.onSecondaryContainer },
                        ]}
                      >
                        Savings
                      </Text>
                    </View>
                  </View>
                </Card.Content>
              </Card>

              <Card
                style={[
                  styles.summaryCard,
                  { backgroundColor: theme.colors.tertiaryContainer },
                ]}
              >
                <Card.Content>
                  <View style={styles.summaryCardContent}>
                    <Calendar size={24} color={theme.colors.tertiary} />
                    <View style={styles.summaryText}>
                      <Text
                        style={[
                          styles.summaryAmount,
                          { color: theme.colors.onTertiaryContainer },
                        ]}
                      >
                        {savingsRate}%
                      </Text>
                      <Text
                        style={[
                          styles.summaryLabel,
                          { color: theme.colors.onTertiaryContainer },
                        ]}
                      >
                        Savings Rate
                      </Text>
                    </View>
                  </View>
                </Card.Content>
              </Card>
            </View>

            {/* Expense Breakdown Chart */}
            {expenseData.length > 0 && (
              <Card
                style={[
                  styles.chartCard,
                  { backgroundColor: theme.colors.surface },
                ]}
              >
                <Card.Content>
                  <Text
                    variant="titleLarge"
                    style={[
                      styles.chartTitle,
                      { color: theme.colors.onSurface },
                    ]}
                  >
                    Expense Breakdown
                  </Text>
                  <PieChart
                    data={expenseData}
                    width={screenWidth - 60}
                    height={220}
                    chartConfig={chartConfig}
                    accessor="amount"
                    backgroundColor="transparent"
                    paddingLeft="15"
                    center={[10, 10]}
                  />
                </Card.Content>
              </Card>
            )}

            {/* Recent Transactions */}
            {recentTransactions.length > 0 && (
              <Card
                style={[
                  styles.transactionsCard,
                  { backgroundColor: theme.colors.surface },
                ]}
              >
                <Card.Content>
                  <Text
                    variant="titleLarge"
                    style={[
                      styles.chartTitle,
                      { color: theme.colors.onSurface },
                    ]}
                  >
                    Recent Transactions
                  </Text>
                  {recentTransactions.map((transaction, index) => (
                    <View key={transaction.id}>
                      <View style={styles.transactionItem}>
                        <View style={styles.transactionDetails}>
                          <Text
                            style={[
                              styles.transactionDescription,
                              { color: theme.colors.onSurface },
                            ]}
                          >
                            {transaction.description}
                          </Text>
                          <Text
                            style={[
                              styles.transactionCategory,
                              { color: theme.colors.onSurfaceVariant },
                            ]}
                          >
                            {transaction.category} • {transaction.date}
                          </Text>
                        </View>
                        <Text
                          style={[
                            styles.transactionAmount,
                            {
                              color:
                                transaction.amount > 0
                                  ? theme.colors.primary
                                  : theme.colors.error,
                            },
                          ]}
                        >
                          {transaction.amount > 0 ? '+' : ''}
                          {formatCurrency(transaction.amount)}
                        </Text>
                      </View>
                      {index < recentTransactions.length - 1 && (
                        <Divider style={{ marginVertical: 8 }} />
                      )}
                    </View>
                  ))}
                </Card.Content>
              </Card>
            )}
          </>
        )}
      </ScrollView>

      <FAB
        icon={() => <Plus size={24} color={theme.colors.onPrimary} />}
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        onPress={() => setShowAddIncomeModal(true)}
      />

      <AddIncomeModal
        visible={showAddIncomeModal}
        onDismiss={() => setShowAddIncomeModal(false)}
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
  noDataCard: {
    margin: 16,
    elevation: 2,
  },
  noDataTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  noDataText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  noDataButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  addButton: {
    flex: 1,
  },
  summaryContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 12,
  },
  summaryCard: {
    flex: 1,
    elevation: 2,
  },
  summaryCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  summaryText: {
    flex: 1,
  },
  summaryAmount: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  summaryLabel: {
    fontSize: 12,
    marginTop: 2,
  },
  chartCard: {
    margin: 16,
    elevation: 2,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  transactionsCard: {
    margin: 16,
    marginBottom: 100,
    elevation: 2,
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionDescription: {
    fontSize: 16,
    fontWeight: '500',
  },
  transactionCategory: {
    fontSize: 12,
    marginTop: 2,
  },
  transactionAmount: {
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
