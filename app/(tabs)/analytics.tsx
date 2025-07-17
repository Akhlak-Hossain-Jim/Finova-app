import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { 
  Surface, 
  Card, 
  Title, 
  Button, 
  useTheme,
  Text,
  Divider,
  Chip,
  SegmentedButtons
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LineChart, PieChart, BarChart, ProgressChart } from 'react-native-chart-kit';
import { Calendar, TrendingUp, TrendingDown, Target, DollarSign } from 'lucide-react-native';
import { useExpenses } from '@/hooks/useExpenses';
import { useIncome } from '@/hooks/useIncome';
import { useSavingsGoals } from '@/hooks/useSavingsGoals';

const { width: screenWidth } = Dimensions.get('window');

export default function AnalyticsScreen() {
  const theme = useTheme();
  const { expenses, loading: expensesLoading } = useExpenses();
  const { income, loading: incomeLoading } = useIncome();
  const { goals, loading: goalsLoading } = useSavingsGoals();
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const chartConfig = {
    backgroundGradientFrom: theme.colors.surface,
    backgroundGradientTo: theme.colors.surface,
    color: (opacity = 1) => `rgba(25, 118, 210, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.5,
    useShadowColorFromDataset: false
  };

  const hasData = expenses.length > 0 || income.length > 0 || goals.length > 0;
  const loading = expensesLoading || incomeLoading || goalsLoading;

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.loadingContainer}>
          <Text>Loading analytics...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!hasData) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.header}>
          <Title style={[styles.title, { color: theme.colors.onBackground }]}>
            Analytics
          </Title>
        </View>
        
        <Card style={[styles.noDataCard, { backgroundColor: theme.colors.surface }]}>
          <Card.Content>
            <Text style={[styles.noDataTitle, { color: theme.colors.onSurface }]}>
              Not Enough Data Available
            </Text>
            <Text style={[styles.noDataText, { color: theme.colors.onSurfaceVariant }]}>
              Add income, expenses, and savings goals to see detailed analytics and insights.
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
    .filter(item => {
      const itemDate = new Date(item.date);
      return itemDate.getMonth() === currentMonth && itemDate.getFullYear() === currentYear;
    })
    .reduce((sum, item) => sum + item.amount, 0);

  const monthlyExpenses = expenses
    .filter(expense => {
      const expenseDate = new Date(expense.date);
      return expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear;
    })
    .reduce((sum, expense) => sum + expense.amount, 0);

  const monthlySavings = monthlyIncome - monthlyExpenses;
  const savingsRate = monthlyIncome > 0 ? Math.round((monthlySavings / monthlyIncome) * 100) : 0;

  // Get expense breakdown
  const expensesByCategory = expenses
    .filter(expense => {
      const expenseDate = new Date(expense.date);
      return expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear;
    })
    .reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
      return acc;
    }, {} as Record<string, number>);

  const expenseData = Object.entries(expensesByCategory).map(([category, amount], index) => ({
    name: category,
    amount,
    color: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'][index % 6],
    legendFontColor: '#7F7F7F'
  }));

  // Savings goals progress
  const savingsData = {
    labels: goals.slice(0, 4).map(goal => goal.title.substring(0, 8)),
    data: goals.slice(0, 4).map(goal => Math.min(goal.current_amount / goal.target_amount, 1))
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <Title style={[styles.title, { color: theme.colors.onBackground }]}>
          Analytics
        </Title>
        <SegmentedButtons
          value={selectedPeriod}
          onValueChange={setSelectedPeriod}
          buttons={[
            { value: 'monthly', label: 'Monthly' },
            { value: 'yearly', label: 'Yearly' }
          ]}
          style={styles.periodSelector}
        />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Financial Overview */}
        <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <Card.Content>
            <Title style={[styles.cardTitle, { color: theme.colors.onSurface }]}>
              Financial Overview
            </Title>
            <View style={styles.overviewGrid}>
              <View style={styles.overviewItem}>
                <View style={[styles.overviewIcon, { backgroundColor: theme.colors.primaryContainer }]}>
                  <TrendingUp size={24} color={theme.colors.primary} />
                </View>
                <Text style={[styles.overviewAmount, { color: theme.colors.onSurface }]}>
                  {formatCurrency(monthlyIncome)}
                </Text>
                <Text style={[styles.overviewLabel, { color: theme.colors.onSurfaceVariant }]}>
                  Monthly Income
                </Text>
              </View>
              <View style={styles.overviewItem}>
                <View style={[styles.overviewIcon, { backgroundColor: theme.colors.errorContainer }]}>
                  <TrendingDown size={24} color={theme.colors.error} />
                </View>
                <Text style={[styles.overviewAmount, { color: theme.colors.onSurface }]}>
                  {formatCurrency(monthlyExpenses)}
                </Text>
                <Text style={[styles.overviewLabel, { color: theme.colors.onSurfaceVariant }]}>
                  Monthly Expenses
                </Text>
              </View>
              <View style={styles.overviewItem}>
                <View style={[styles.overviewIcon, { backgroundColor: theme.colors.secondaryContainer }]}>
                  <Target size={24} color={theme.colors.secondary} />
                </View>
                <Text style={[styles.overviewAmount, { color: theme.colors.onSurface }]}>
                  {formatCurrency(monthlySavings)}
                </Text>
                <Text style={[styles.overviewLabel, { color: theme.colors.onSurfaceVariant }]}>
                  Monthly Savings
                </Text>
              </View>
              <View style={styles.overviewItem}>
                <View style={[styles.overviewIcon, { backgroundColor: theme.colors.tertiaryContainer }]}>
                  <DollarSign size={24} color={theme.colors.tertiary} />
                </View>
                <Text style={[styles.overviewAmount, { color: theme.colors.onSurface }]}>
                  {savingsRate}%
                </Text>
                <Text style={[styles.overviewLabel, { color: theme.colors.onSurfaceVariant }]}>
                  Savings Rate
                </Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Expense Breakdown */}
        {expenseData.length > 0 && (
          <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
            <Card.Content>
              <Title style={[styles.cardTitle, { color: theme.colors.onSurface }]}>
                Expense Breakdown
              </Title>
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

        {/* Savings Goals Progress */}
        {goals.length > 0 && (
          <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
            <Card.Content>
              <Title style={[styles.cardTitle, { color: theme.colors.onSurface }]}>
                Savings Goals Progress
              </Title>
              <ProgressChart
                data={savingsData}
                width={screenWidth - 60}
                height={220}
                strokeWidth={16}
                radius={32}
                chartConfig={chartConfig}
                hideLegend={false}
              />
            </Card.Content>
          </Card>
        )}

        {/* Financial Insights */}
        <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <Card.Content>
            <Title style={[styles.cardTitle, { color: theme.colors.onSurface }]}>
              Financial Insights
            </Title>
            <View style={styles.insightsList}>
              {savingsRate > 20 && (
                <View style={styles.insightItem}>
                  <View style={[styles.insightIcon, { backgroundColor: theme.colors.primaryContainer }]}>
                    <TrendingUp size={16} color={theme.colors.primary} />
                  </View>
                  <View style={styles.insightText}>
                    <Text style={[styles.insightTitle, { color: theme.colors.onSurface }]}>
                      Great Savings Rate!
                    </Text>
                    <Text style={[styles.insightDescription, { color: theme.colors.onSurfaceVariant }]}>
                      Your {savingsRate}% savings rate is excellent
                    </Text>
                  </View>
                </View>
              )}
              {monthlyExpenses > monthlyIncome && (
                <View style={styles.insightItem}>
                  <View style={[styles.insightIcon, { backgroundColor: theme.colors.errorContainer }]}>
                    <TrendingDown size={16} color={theme.colors.error} />
                  </View>
                  <View style={styles.insightText}>
                    <Text style={[styles.insightTitle, { color: theme.colors.onSurface }]}>
                      Spending Alert
                    </Text>
                    <Text style={[styles.insightDescription, { color: theme.colors.onSurfaceVariant }]}>
                      Your expenses exceed your income this month
                    </Text>
                  </View>
                </View>
              )}
              {goals.length > 0 && (
                <View style={styles.insightItem}>
                  <View style={[styles.insightIcon, { backgroundColor: theme.colors.secondaryContainer }]}>
                    <Target size={16} color={theme.colors.secondary} />
                  </View>
                  <View style={styles.insightText}>
                    <Text style={[styles.insightTitle, { color: theme.colors.onSurface }]}>
                      Savings Goals
                    </Text>
                    <Text style={[styles.insightDescription, { color: theme.colors.onSurfaceVariant }]}>
                      You have {goals.length} active savings goals
                    </Text>
                  </View>
                </View>
              )}
            </View>
          </Card.Content>
        </Card>
      </ScrollView>
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
    margin: 16,
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