import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Dimensions,
  Platform,
} from 'react-native';
import { Card, useTheme, Text, SegmentedButtons } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PieChart, BarChart } from 'react-native-gifted-charts';
import {
  TrendingUp,
  TrendingDown,
  Target,
  DollarSign,
} from 'lucide-react-native';
import { useExpensesContext } from '@/contexts/ExpensesContext';
import { useIncomeContext } from '@/contexts/IncomeContext';
import { useSavingsGoalsContext } from '@/contexts/SavingsGoalsContext';
import { useAuth } from '@/contexts/AuthContext';
import { formatCurrency } from '@/consts/currencySymbols';
import { useShoppingListsContext } from '@/contexts/ShoppingListsContext';

const { width: screenWidth } = Dimensions.get('window');

export default function AnalyticsScreen() {
  const theme = useTheme();
  const { profile } = useAuth();
  const { expenses, loading: expensesLoading } = useExpensesContext();
  const { lists: ShoppingList } = useShoppingListsContext();
  const { income, loading: incomeLoading } = useIncomeContext();
  const { goals, loading: goalsLoading } = useSavingsGoalsContext();
  const [selectedPeriod, setSelectedPeriod] = useState<'monthly' | 'yearly'>(
    'monthly'
  );

  const hasData = expenses.length > 0 || income.length > 0 || goals.length > 0;
  const loading = expensesLoading || incomeLoading || goalsLoading;

  if (loading) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: theme.colors.background }]}
      >
        <View style={styles.loadingContainer}>
          <Text>Loading analytics...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!hasData) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: theme.colors.background }]}
      >
        <View style={styles.header}>
          <Text
            variant="titleLarge"
            style={[styles.title, { color: theme.colors.onBackground }]}
          >
            Analytics
          </Text>
        </View>

        <Card
          style={[styles.noDataCard, { backgroundColor: theme.colors.surface }]}
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
              Add income, expenses, and savings goals to see detailed analytics
              and insights.
            </Text>
          </Card.Content>
        </Card>
      </SafeAreaView>
    );
  }

  // Calculate analytics data
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

  const monthlyShoppingExpenses = ShoppingList.map(
    (lists) => lists.shopping_items
  )
    .flat()
    .filter((listItem) => {
      if (listItem?.is_purchased && listItem?.purchased_at) {
        const purchaseDate = new Date(listItem.purchased_at);
        return (
          purchaseDate.getMonth() === currentMonth &&
          purchaseDate.getFullYear() === currentYear
        );
      }
    })
    .reduce((sum, listItem) => sum + (listItem?.actual_cost ?? 0), 0);

  const monthlySavings =
    monthlyIncome - (monthlyExpenses + monthlyShoppingExpenses);
  const savingsRate =
    monthlyIncome > 0 ? Math.round((monthlySavings / monthlyIncome) * 100) : 0;

  // Get expense breakdown
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

  const expensePieData = Object.entries(expensesByCategory).map(
    ([category, amount], index) => ({
      value: amount,
      text: category,
      color: ['#FF6384', '#36A2EB', '#ff6a00', '#4BC0C0', '#9966FF', '#ff6a00'][
        index % 6
      ],
    })
  );

  // Savings goals progress
  const savingsProgressData = goals.slice(0, 4).map((goal) => ({
    value: (goal.current_amount / goal.target_amount) * 100,
    label: goal.title.substring(0, 8),
    frontColor: theme.colors.primary,
  }));

  // Yearly
  const yearlyIncome = income
    .filter((item) => {
      const itemDate = new Date(item.date);
      return itemDate.getFullYear() === currentYear;
    })
    .reduce((sum, item) => sum + item.amount, 0);

  const yearlyExpenses = expenses
    .filter((expense) => {
      const expenseDate = new Date(expense.date);
      return expenseDate.getFullYear() === currentYear;
    })
    .reduce((sum, expense) => sum + expense.amount, 0);

  const yearlyShoppingExpenses = ShoppingList.map(
    (lists) => lists.shopping_items
  )
    .flat()
    .filter((listItem) => {
      if (listItem?.is_purchased && listItem?.purchased_at) {
        const purchaseDate = new Date(listItem.purchased_at);
        return purchaseDate.getFullYear() === currentYear;
      }
    })
    .reduce((sum, listItem) => sum + (listItem?.actual_cost ?? 0), 0);

  const yearlySavings =
    yearlyIncome - (yearlyExpenses + yearlyShoppingExpenses);
  const yearlySavingsRate =
    yearlyIncome > 0 ? Math.round((yearlySavings / yearlyIncome) * 100) : 0;

  // Get expense breakdown
  const yearlyExpensesByCategory = expenses
    .filter((expense) => {
      const expenseDate = new Date(expense.date);
      return expenseDate.getFullYear() === currentYear;
    })
    .reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
      return acc;
    }, {} as Record<string, number>);

  const yearlyExpensePieData = Object.entries(yearlyExpensesByCategory).map(
    ([category, amount], index) => ({
      value: amount,
      text: category,
      color: ['#FF6384', '#36A2EB', '#ff6a00', '#4BC0C0', '#9966FF', '#ff6a00'][
        index % 6
      ],
    })
  );

  // Savings goals progress
  const yearlySavingsProgressData = goals.slice(0, 4).map((goal) => ({
    value: (goal.current_amount / goal.target_amount) * 100,
    label: goal.title.substring(0, 8),
    frontColor: theme.colors.primary,
  }));

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <View style={styles.header}>
        <Text
          variant="titleLarge"
          style={[styles.title, { color: theme.colors.onBackground }]}
        >
          Analytics
        </Text>
        <SegmentedButtons
          value={selectedPeriod}
          onValueChange={setSelectedPeriod}
          buttons={[
            { value: 'monthly', label: 'Monthly' },
            { value: 'yearly', label: 'Yearly' },
          ]}
          style={styles.periodSelector}
        />
      </View>

      {selectedPeriod === 'monthly' ? (
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Financial Overview */}
          <Card
            style={[styles.card, { backgroundColor: theme.colors.surface }]}
          >
            <Card.Content>
              <Text
                variant="titleLarge"
                style={[styles.cardTitle, { color: theme.colors.onSurface }]}
              >
                Financial Overview
              </Text>
              <View style={styles.overviewGrid}>
                <View style={styles.overviewItem}>
                  <View
                    style={[
                      styles.overviewIcon,
                      { backgroundColor: theme.colors.primaryContainer },
                    ]}
                  >
                    <TrendingUp size={24} color={theme.colors.primary} />
                  </View>
                  <Text
                    style={[
                      styles.overviewAmount,
                      { color: theme.colors.onSurface },
                    ]}
                  >
                    {formatCurrency(monthlyIncome, profile)}
                  </Text>
                  <Text
                    style={[
                      styles.overviewLabel,
                      { color: theme.colors.onSurfaceVariant },
                    ]}
                  >
                    Monthly Income
                  </Text>
                </View>
                <View style={styles.overviewItem}>
                  <View
                    style={[
                      styles.overviewIcon,
                      { backgroundColor: theme.colors.errorContainer },
                    ]}
                  >
                    <TrendingDown size={24} color={theme.colors.error} />
                  </View>
                  <Text
                    style={[
                      styles.overviewAmount,
                      { color: theme.colors.onSurface },
                    ]}
                  >
                    {formatCurrency(
                      monthlyExpenses + monthlyShoppingExpenses,
                      profile
                    )}
                  </Text>
                  <Text
                    style={[
                      styles.overviewLabel,
                      { color: theme.colors.onSurfaceVariant },
                    ]}
                  >
                    Monthly Expenses
                  </Text>
                </View>
                <View style={styles.overviewItem}>
                  <View
                    style={[
                      styles.overviewIcon,
                      { backgroundColor: theme.colors.secondaryContainer },
                    ]}
                  >
                    <Target size={24} color={theme.colors.secondary} />
                  </View>
                  <Text
                    style={[
                      styles.overviewAmount,
                      { color: theme.colors.onSurface },
                    ]}
                  >
                    {formatCurrency(monthlySavings, profile)}
                  </Text>
                  <Text
                    style={[
                      styles.overviewLabel,
                      { color: theme.colors.onSurfaceVariant },
                    ]}
                  >
                    Monthly Savings
                  </Text>
                </View>
                <View style={styles.overviewItem}>
                  <View
                    style={[
                      styles.overviewIcon,
                      { backgroundColor: theme.colors.tertiaryContainer },
                    ]}
                  >
                    <DollarSign size={24} color={theme.colors.tertiary} />
                  </View>
                  <Text
                    style={[
                      styles.overviewAmount,
                      { color: theme.colors.onSurface },
                    ]}
                  >
                    {savingsRate}%
                  </Text>
                  <Text
                    style={[
                      styles.overviewLabel,
                      { color: theme.colors.onSurfaceVariant },
                    ]}
                  >
                    Savings Rate
                  </Text>
                </View>
              </View>
            </Card.Content>
          </Card>

          {/* Expense Breakdown */}
          {expensePieData.length > 0 && (
            <Card
              style={[styles.card, { backgroundColor: theme.colors.surface }]}
            >
              <Card.Content>
                <Text
                  variant="titleLarge"
                  style={[styles.cardTitle, { color: theme.colors.onSurface }]}
                >
                  Expense Breakdown
                </Text>
                <View
                  style={{
                    alignItems: 'center',
                    transform: [{ scale: Platform?.OS === 'web' ? 0.42 : 1 }],
                    marginVertical: Platform?.OS === 'web' ? '-60%' : 0,
                  }}
                >
                  <PieChart
                    data={expensePieData}
                    donut
                    showText
                    textColor="black"
                    radius={(screenWidth - 120) / 2}
                    textSize={12}
                    textBackgroundColor="white"
                    textBackgroundRadius={12}
                  />
                </View>
              </Card.Content>
            </Card>
          )}

          {/* Savings Goals Progress */}
          {goals.length > 0 && (
            <Card
              style={[styles.card, { backgroundColor: theme.colors.surface }]}
            >
              <Card.Content>
                <Text
                  variant="titleLarge"
                  style={[styles.cardTitle, { color: theme.colors.onSurface }]}
                >
                  Savings Goals Progress
                </Text>
                <View style={{ alignItems: 'center', paddingLeft: 20 }}>
                  <BarChart
                    data={savingsProgressData}
                    width={screenWidth - 120}
                    height={220}
                    barWidth={22}
                    maxValue={100}
                    yAxisLabelSuffix="%"
                    noOfSections={4}
                    yAxisTextStyle={{ color: theme.colors.onSurfaceVariant }}
                    xAxisLabelTextStyle={{
                      color: theme.colors.onSurfaceVariant,
                      width: 50,
                      marginLeft: 10,
                    }}
                    yAxisLabelContainerStyle={{ width: 50 }}
                  />
                </View>
              </Card.Content>
            </Card>
          )}

          {/* Financial Insights */}
          <Card
            style={[styles.card, { backgroundColor: theme.colors.surface }]}
          >
            <Card.Content>
              <Text
                variant="titleLarge"
                style={[styles.cardTitle, { color: theme.colors.onSurface }]}
              >
                Financial Insights
              </Text>
              <View style={styles.insightsList}>
                {savingsRate > 20 && (
                  <View style={styles.insightItem}>
                    <View
                      style={[
                        styles.insightIcon,
                        { backgroundColor: theme.colors.primaryContainer },
                      ]}
                    >
                      <TrendingUp size={16} color={theme.colors.primary} />
                    </View>
                    <View style={styles.insightText}>
                      <Text
                        style={[
                          styles.insightTitle,
                          { color: theme.colors.onSurface },
                        ]}
                      >
                        Great Savings Rate!
                      </Text>
                      <Text
                        style={[
                          styles.insightDescription,
                          { color: theme.colors.onSurfaceVariant },
                        ]}
                      >
                        Your {savingsRate}% savings rate is excellent
                      </Text>
                    </View>
                  </View>
                )}
                {monthlyExpenses > monthlyIncome && (
                  <View style={styles.insightItem}>
                    <View
                      style={[
                        styles.insightIcon,
                        { backgroundColor: theme.colors.errorContainer },
                      ]}
                    >
                      <TrendingDown size={16} color={theme.colors.error} />
                    </View>
                    <View style={styles.insightText}>
                      <Text
                        style={[
                          styles.insightTitle,
                          { color: theme.colors.onSurface },
                        ]}
                      >
                        Spending Alert
                      </Text>
                      <Text
                        style={[
                          styles.insightDescription,
                          { color: theme.colors.onSurfaceVariant },
                        ]}
                      >
                        Your expenses exceed your income this month
                      </Text>
                    </View>
                  </View>
                )}
                {goals.length > 0 && (
                  <View style={styles.insightItem}>
                    <View
                      style={[
                        styles.insightIcon,
                        { backgroundColor: theme.colors.secondaryContainer },
                      ]}
                    >
                      <Target size={16} color={theme.colors.secondary} />
                    </View>
                    <View style={styles.insightText}>
                      <Text
                        style={[
                          styles.insightTitle,
                          { color: theme.colors.onSurface },
                        ]}
                      >
                        Savings Goals
                      </Text>
                      <Text
                        style={[
                          styles.insightDescription,
                          { color: theme.colors.onSurfaceVariant },
                        ]}
                      >
                        You have {goals.length} active savings goals
                      </Text>
                    </View>
                  </View>
                )}
              </View>
            </Card.Content>
          </Card>
        </ScrollView>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Financial Overview */}
          <Card
            style={[styles.card, { backgroundColor: theme.colors.surface }]}
          >
            <Card.Content>
              <Text
                variant="titleLarge"
                style={[styles.cardTitle, { color: theme.colors.onSurface }]}
              >
                Yearly Financial Overview
              </Text>
              <View style={styles.overviewGrid}>
                <View style={styles.overviewItem}>
                  <View
                    style={[
                      styles.overviewIcon,
                      { backgroundColor: theme.colors.primaryContainer },
                    ]}
                  >
                    <TrendingUp size={24} color={theme.colors.primary} />
                  </View>
                  <Text
                    style={[
                      styles.overviewAmount,
                      { color: theme.colors.onSurface },
                    ]}
                  >
                    {formatCurrency(yearlyIncome, profile)}
                  </Text>
                  <Text
                    style={[
                      styles.overviewLabel,
                      { color: theme.colors.onSurfaceVariant },
                    ]}
                  >
                    Yearly Income
                  </Text>
                </View>
                <View style={styles.overviewItem}>
                  <View
                    style={[
                      styles.overviewIcon,
                      { backgroundColor: theme.colors.errorContainer },
                    ]}
                  >
                    <TrendingDown size={24} color={theme.colors.error} />
                  </View>
                  <Text
                    style={[
                      styles.overviewAmount,
                      { color: theme.colors.onSurface },
                    ]}
                  >
                    {formatCurrency(
                      yearlyExpenses + yearlyShoppingExpenses,
                      profile
                    )}
                  </Text>
                  <Text
                    style={[
                      styles.overviewLabel,
                      { color: theme.colors.onSurfaceVariant },
                    ]}
                  >
                    Yearly Expenses
                  </Text>
                </View>
                <View style={styles.overviewItem}>
                  <View
                    style={[
                      styles.overviewIcon,
                      { backgroundColor: theme.colors.secondaryContainer },
                    ]}
                  >
                    <Target size={24} color={theme.colors.secondary} />
                  </View>
                  <Text
                    style={[
                      styles.overviewAmount,
                      { color: theme.colors.onSurface },
                    ]}
                  >
                    {formatCurrency(yearlySavings, profile)}
                  </Text>
                  <Text
                    style={[
                      styles.overviewLabel,
                      { color: theme.colors.onSurfaceVariant },
                    ]}
                  >
                    Yearly Savings
                  </Text>
                </View>
                <View style={styles.overviewItem}>
                  <View
                    style={[
                      styles.overviewIcon,
                      { backgroundColor: theme.colors.tertiaryContainer },
                    ]}
                  >
                    <DollarSign size={24} color={theme.colors.tertiary} />
                  </View>
                  <Text
                    style={[
                      styles.overviewAmount,
                      { color: theme.colors.onSurface },
                    ]}
                  >
                    {yearlySavingsRate}%
                  </Text>
                  <Text
                    style={[
                      styles.overviewLabel,
                      { color: theme.colors.onSurfaceVariant },
                    ]}
                  >
                    Savings Rate
                  </Text>
                </View>
              </View>
            </Card.Content>
          </Card>

          {/* Expense Breakdown */}
          {expensePieData.length > 0 && (
            <Card
              style={[styles.card, { backgroundColor: theme.colors.surface }]}
            >
              <Card.Content>
                <Text
                  variant="titleLarge"
                  style={[styles.cardTitle, { color: theme.colors.onSurface }]}
                >
                  Expense Breakdown
                </Text>
                <View
                  style={{
                    alignItems: 'center',
                    transform: [{ scale: Platform?.OS === 'web' ? 0.42 : 1 }],
                    marginVertical: Platform?.OS === 'web' ? '-60%' : 0,
                  }}
                >
                  <PieChart
                    data={yearlyExpensePieData}
                    donut
                    showText
                    textColor="black"
                    radius={(screenWidth - 120) / 2}
                    textSize={12}
                    textBackgroundColor="white"
                    textBackgroundRadius={12}
                  />
                </View>
              </Card.Content>
            </Card>
          )}

          {/* Savings Goals Progress */}
          {goals.length > 0 && (
            <Card
              style={[styles.card, { backgroundColor: theme.colors.surface }]}
            >
              <Card.Content>
                <Text
                  variant="titleLarge"
                  style={[styles.cardTitle, { color: theme.colors.onSurface }]}
                >
                  Savings Goals Progress
                </Text>
                <View style={{ alignItems: 'center', paddingLeft: 20 }}>
                  <BarChart
                    data={yearlySavingsProgressData}
                    width={screenWidth - 120}
                    height={220}
                    barWidth={22}
                    maxValue={100}
                    yAxisLabelSuffix="%"
                    noOfSections={4}
                    yAxisTextStyle={{ color: theme.colors.onSurfaceVariant }}
                    xAxisLabelTextStyle={{
                      color: theme.colors.onSurfaceVariant,
                      width: 50,
                      marginLeft: 10,
                    }}
                    yAxisLabelContainerStyle={{ width: 50 }}
                  />
                </View>
              </Card.Content>
            </Card>
          )}

          {/* Financial Insights */}
          <Card
            style={[styles.card, { backgroundColor: theme.colors.surface }]}
          >
            <Card.Content>
              <Text
                variant="titleLarge"
                style={[styles.cardTitle, { color: theme.colors.onSurface }]}
              >
                Financial Insights
              </Text>
              <View style={styles.insightsList}>
                {yearlySavingsRate > 20 && (
                  <View style={styles.insightItem}>
                    <View
                      style={[
                        styles.insightIcon,
                        { backgroundColor: theme.colors.primaryContainer },
                      ]}
                    >
                      <TrendingUp size={16} color={theme.colors.primary} />
                    </View>
                    <View style={styles.insightText}>
                      <Text
                        style={[
                          styles.insightTitle,
                          { color: theme.colors.onSurface },
                        ]}
                      >
                        Great Savings Rate!
                      </Text>
                      <Text
                        style={[
                          styles.insightDescription,
                          { color: theme.colors.onSurfaceVariant },
                        ]}
                      >
                        Your {yearlySavingsRate}% savings rate is excellent
                      </Text>
                    </View>
                  </View>
                )}
                {yearlyExpenses > yearlyIncome && (
                  <View style={styles.insightItem}>
                    <View
                      style={[
                        styles.insightIcon,
                        { backgroundColor: theme.colors.errorContainer },
                      ]}
                    >
                      <TrendingDown size={16} color={theme.colors.error} />
                    </View>
                    <View style={styles.insightText}>
                      <Text
                        style={[
                          styles.insightTitle,
                          { color: theme.colors.onSurface },
                        ]}
                      >
                        Spending Alert
                      </Text>
                      <Text
                        style={[
                          styles.insightDescription,
                          { color: theme.colors.onSurfaceVariant },
                        ]}
                      >
                        Your expenses exceed your income this year
                      </Text>
                    </View>
                  </View>
                )}
                {goals.length > 0 && (
                  <View style={styles.insightItem}>
                    <View
                      style={[
                        styles.insightIcon,
                        { backgroundColor: theme.colors.secondaryContainer },
                      ]}
                    >
                      <Target size={16} color={theme.colors.secondary} />
                    </View>
                    <View style={styles.insightText}>
                      <Text
                        style={[
                          styles.insightTitle,
                          { color: theme.colors.onSurface },
                        ]}
                      >
                        Savings Goals
                      </Text>
                      <Text
                        style={[
                          styles.insightDescription,
                          { color: theme.colors.onSurfaceVariant },
                        ]}
                      >
                        You have {goals.length} active savings goals
                      </Text>
                    </View>
                  </View>
                )}
              </View>
            </Card.Content>
          </Card>
        </ScrollView>
      )}
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
    marginBottom: 16,
  },
  periodSelector: {
    marginBottom: 8,
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
  },
  card: {
    marginHorizontal: 16,
    marginVertical: 8,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  overviewGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  overviewItem: {
    flex: 1,
    minWidth: '45%',
    alignItems: 'center',
    padding: 16,
  },
  overviewIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  overviewAmount: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  overviewLabel: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 4,
  },
  insightsList: {
    gap: 16,
  },
  insightItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  insightIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  insightText: {
    flex: 1,
  },
  insightTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  insightDescription: {
    fontSize: 14,
    marginTop: 2,
  },
});
