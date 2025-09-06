import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Alert } from 'react-native';
import {
  Card,
  FAB,
  useTheme,
  Text,
  IconButton,
  Chip,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus, Briefcase, Gift, TrendingUp } from 'lucide-react-native';
import AddIncomeModal from '@/components/AddIncomeModal';
import { useIncomeContext } from '@/contexts/IncomeContext';
import { useAuth } from '@/contexts/AuthContext';
import VerificationOverlay from '@/components/VerificationOverlay';
import { formatCurrency } from '@/consts/currencySymbols';

export default function IncomesScreen() {
  const theme = useTheme();
  const { income, deleteIncome } = useIncomeContext();
  const { user, profile, sendVerificationEmail, resendEmailDisabled } =
    useAuth();
  const [showAddModal, setShowAddModal] = useState(false);
  const [filter, setFilter] = useState('This Month');

  const filteredIncome = income.filter((item) => {
    const itemDate = new Date(item.date);
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    if (filter === 'This Month') {
      return (
        itemDate.getMonth() === currentMonth &&
        itemDate.getFullYear() === currentYear
      );
    }
    if (filter === 'This Year') {
      return itemDate.getFullYear() === currentYear;
    }
    return true; // 'All'
  });

  const totalIncome = filteredIncome.reduce(
    (sum, item) => sum + item.amount,
    0
  );

  const getSourceIcon = (source: string) => {
    const iconMap: { [key: string]: any } = {
      salary: Briefcase,
      gift: Gift,
      investment: TrendingUp,
    };
    return iconMap[source.toLowerCase()] || Briefcase;
  };

  const handleDeleteIncome = (incomeId: string) => {
    Alert.alert(
      'Delete Income',
      'Are you sure you want to delete this income?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteIncome(incomeId),
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
          Incomes
        </Text>
        <Text style={[styles.totalAmount, { color: theme.colors.primary }]}>
          Total: {formatCurrency(totalIncome, profile)}
        </Text>
      </View>

      <View style={styles.filterContainer}>
        <Chip
          selected={filter === 'This Month'}
          onPress={() => setFilter('This Month')}
          style={styles.filterChip}
        >
          This Month
        </Chip>
        <Chip
          selected={filter === 'This Year'}
          onPress={() => setFilter('This Year')}
          style={styles.filterChip}
        >
          This Year
        </Chip>
        <Chip
          selected={filter === 'All'}
          onPress={() => setFilter('All')}
          style={styles.filterChip}
        >
          All
        </Chip>
      </View>

      {/* Incomes List */}
      <ScrollView
        style={styles.incomesList}
        showsVerticalScrollIndicator={false}
      >
        {filteredIncome.map((item) => {
          const IconComponent = getSourceIcon(item.source);
          return (
            <Card
              key={item.id}
              style={[
                styles.incomeCard,
                { backgroundColor: theme.colors.surface },
              ]}
            >
              <Card.Content>
                <View style={styles.incomeItem}>
                  <View style={styles.incomeIcon}>
                    <IconComponent size={24} color={theme.colors.primary} />
                  </View>
                  <View style={styles.incomeDetails}>
                    <Text
                      style={[
                        styles.incomeDescription,
                        { color: theme.colors.onSurface },
                      ]}
                    >
                      {item.source}
                    </Text>
                    <Text
                      style={[
                        styles.incomeDate,
                        { color: theme.colors.onSurfaceVariant },
                      ]}
                    >
                      {item.date}
                    </Text>
                  </View>
                  <View style={styles.incomeAmount}>
                    <Text
                      style={[styles.amount, { color: theme.colors.primary }]}
                    >
                      +{formatCurrency(item.amount, profile)}
                    </Text>
                    {filter === 'This Month' && (
                      <IconButton
                        icon="delete"
                        size={18}
                        iconColor={theme.colors.error}
                        onPress={() => handleDeleteIncome(item.id)}
                      />
                    )}
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

      <AddIncomeModal
        visible={showAddModal}
        onDismiss={() => setShowAddModal(false)}
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
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
  },
  filterChip: {
    marginRight: 8,
  },
  incomesList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  incomeCard: {
    marginBottom: 8,
    elevation: 1,
  },
  incomeItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  incomeIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  incomeDetails: {
    flex: 1,
  },
  incomeDescription: {
    fontSize: 16,
    fontWeight: '500',
  },
  incomeDate: {
    fontSize: 12,
    marginTop: 2,
  },
  incomeAmount: {
    alignItems: 'center',
    flexDirection: 'row',
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
