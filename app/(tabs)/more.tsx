import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Alert } from 'react-native';
import { useThemeContext } from '@/contexts/ThemeContext';
import {
  Card,
  Button,
  useTheme,
  Text,
  Divider,
  List,
  Switch,
  Avatar,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Target,
  Activity,
  Users,
  // Bell,
  Shield,
  CircleHelp as HelpCircle,
  LogOut,
  Moon,
} from 'lucide-react-native';
import SavingsGoalsModal from '@/components/SavingsGoalsModal';
import HabitsModal from '@/components/HabitsModal';
import { useAuth } from '@/contexts/AuthContext';
import { useSavingsGoals } from '@/hooks/useSavingsGoals';

import { useRouter } from 'expo-router';

import { formatCurrency } from '@/consts/currencySymbols';
import { useIncomeContext } from '@/contexts/IncomeContext';

export default function MoreScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { isDarkMode: idm, toggleTheme } = useThemeContext();
  const { user, signOut, profile } = useAuth();
  const { income } = useIncomeContext();

  const { totalSaved, completedGoalsCount, totalGoalsCount } =
    useSavingsGoals();
  // const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [showSavingsModal, setShowSavingsModal] = useState(false);
  const [showHabitsModal, setShowHabitsModal] = useState(false);

  const [userProfile, setUserProfile] = useState({
    name: user?.user_metadata?.full_name || 'User',
    email: user?.email || '',
    currency: profile?.currency || 'USD',
  });

  useEffect(() => {
    setUserProfile({
      name: user?.user_metadata?.full_name || 'User',
      email: user?.email || '',
      currency: profile?.currency || 'USD',
    });
  }, [user, profile]);

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: signOut,
      },
    ]);
  };

  const handleFamilyMembers = () => {
    Alert.alert(
      'Family Members',
      'This feature allows you to track expenses for different family members. Coming soon!',
      [{ text: 'OK' }]
    );
  };

  const handleSecurity = () => {
    Alert.alert(
      'Security Settings',
      'Manage your account security, password, and privacy settings. Coming soon!',
      [{ text: 'OK' }]
    );
  };

  const handleHelp = () => {
    Alert.alert(
      'Help & Support',
      'Get help with using Finova, report issues, or contact support. Coming soon!',
      [{ text: 'OK' }]
    );
  };
  const handleSavingGoal = () => {
    Alert.alert(
      'Saving Goals',
      'Adding & Managing goals are in progress. Coming soon!',
      [{ text: 'OK' }]
    );
  };
  const handleHabit = () => {
    Alert.alert(
      'Habit Tracking',
      'Adding custom habit tracking is on progress of making. Coming soon!',
      [{ text: 'OK' }]
    );
  };

  const settingsOptions = [
    {
      title: 'Savings Goals',
      description: 'Manage your financial goals',
      icon: Target,
      // onPress: () => setShowSavingsModal(true),
      onPress: () => handleSavingGoal(),
    },
    {
      title: 'Habit Tracking',
      description: 'Track your financial habits',
      icon: Activity,
      // onPress: () => setShowHabitsModal(true),
      onPress: () => handleHabit(),
    },
    {
      title: 'Family Members',
      description: 'Manage family expense tracking',
      icon: Users,
      onPress: handleFamilyMembers,
    },
    {
      title: 'Security',
      description: 'Privacy and security settings',
      icon: Shield,
      onPress: handleSecurity,
    },
    {
      title: 'Help & Support',
      description: 'Get help and support',
      icon: HelpCircle,
      onPress: handleHelp,
    },
    {
      title: 'Privacy Policy',
      description: 'Learn about our policies',
      icon: Shield,
      onPress: () => router.push('/privacy-policy'),
    },
  ];

  const currentYear = new Date().getFullYear();

  const monthlyIncome = income
    .filter((item) => {
      const itemDate = new Date(item.date);
      return (
        itemDate.getMonth() === new Date().getMonth() &&
        itemDate.getFullYear() === currentYear
      );
    })
    .reduce((sum, item) => sum + item.amount, 0);

  const YearlyIncome = income
    .filter((item) => {
      const itemDate = new Date(item.date);
      return itemDate.getFullYear() === currentYear;
    })
    .reduce((sum, item) => sum + item.amount, 0);

  const calculateAverageMonthlyIncome = () => {
    const incomeByMonth: Record<string, number> = {};

    for (const item of income) {
      const date = new Date(item.date);
      const key = `${date.getFullYear()}-${date.getMonth() + 1}`; // e.g., '2025-7'

      if (!incomeByMonth[key]) {
        incomeByMonth[key] = 0;
      }

      incomeByMonth[key] += item.amount;
    }

    const monthlyTotals = Object.values(incomeByMonth);
    const total = monthlyTotals.reduce((sum, value) => sum + value, 0);
    const average = monthlyTotals.length > 0 ? total / monthlyTotals.length : 0;

    return average;
  };

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
            Options
          </Text>
        </View>

        {/* Profile Section */}
        <Card
          style={[
            styles.profileCard,
            { backgroundColor: theme.colors.surface },
          ]}
        >
          <Card.Content>
            <View style={styles.profileHeader}>
              <Avatar.Text
                size={60}
                label={userProfile.name
                  .split(' ')
                  .map((n: string) => n[0])
                  .splice(0, 2)
                  .join('')
                  .toUpperCase()}
                style={{ backgroundColor: theme.colors.primary }}
              />
              <View style={styles.profileInfo}>
                <Text
                  style={[
                    styles.profileName,
                    { color: theme.colors.onSurface },
                  ]}
                >
                  {userProfile.name}
                </Text>
                <Text
                  style={[
                    styles.profileEmail,
                    { color: theme.colors.onSurfaceVariant },
                  ]}
                >
                  {userProfile.email}
                </Text>
                <Text
                  style={[
                    styles.profileIncome,
                    { color: theme.colors.primary },
                  ]}
                >
                  Avg. Earning(M):{' '}
                  {formatCurrency(calculateAverageMonthlyIncome(), profile)}
                </Text>

                <Text
                  style={[
                    styles.profileIncome,
                    { color: theme.colors.primary },
                  ]}
                >
                  Earned this Month: {formatCurrency(monthlyIncome, profile)}
                </Text>
              </View>
            </View>
            <Button
              mode="outlined"
              onPress={() => router.push('/edit-profile')}
              style={styles.editButton}
            >
              Edit Profile
            </Button>
          </Card.Content>
        </Card>

        {/* Quick Stats */}
        <Card
          style={[styles.statsCard, { backgroundColor: theme.colors.surface }]}
        >
          <Card.Content>
            <Text
              variant="titleLarge"
              style={[styles.sectionTitle, { color: theme.colors.onSurface }]}
            >
              Quick Stats
            </Text>
            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <Text
                  style={[styles.statValue, { color: theme.colors.primary }]}
                >
                  {formatCurrency(YearlyIncome, profile)}
                </Text>
                <Text
                  style={[
                    styles.statLabel,
                    { color: theme.colors.onSurfaceVariant },
                  ]}
                >
                  This Year
                </Text>
              </View>
              <View style={styles.statItem}>
                <Text
                  style={[styles.statValue, { color: theme.colors.secondary }]}
                >
                  {formatCurrency(totalSaved, profile)}
                </Text>
                <Text
                  style={[
                    styles.statLabel,
                    { color: theme.colors.onSurfaceVariant },
                  ]}
                >
                  Saved
                </Text>
              </View>
              <View style={styles.statItem}>
                <Text
                  style={[styles.statValue, { color: theme.colors.tertiary }]}
                >
                  {completedGoalsCount}/{totalGoalsCount}
                </Text>
                <Text
                  style={[
                    styles.statLabel,
                    { color: theme.colors.onSurfaceVariant },
                  ]}
                >
                  Goals
                </Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Settings */}
        <Card
          style={[
            styles.settingsCard,
            { backgroundColor: theme.colors.surface },
          ]}
        >
          <Card.Content>
            <Text
              variant="titleLarge"
              style={[styles.sectionTitle, { color: theme.colors.onSurface }]}
            >
              Settings
            </Text>

            {/* Theme Toggle */}
            <List.Item
              title="Dark Mode"
              description="Switch between light and dark theme"
              left={(props) => (
                <Moon
                  {...props}
                  size={24}
                  color={theme.colors.onSurfaceVariant}
                />
              )}
              right={() => <Switch value={idm} onValueChange={toggleTheme} />}
            />

            <Divider />

            {/* Notifications Toggle */}
            {/* <List.Item
              title="Notifications"
              description="Enable push notifications"
              left={(props) => (
                <Bell
                  {...props}
                  size={24}
                  color={theme.colors.onSurfaceVariant}
                />
              )}
              right={() => (
                <Switch
                  value={notificationsEnabled}
                  onValueChange={setNotificationsEnabled}
                />
              )}
            />

            <Divider /> */}

            {/* Settings Options */}
            {settingsOptions.map((option, index) => (
              <View key={index}>
                <List.Item
                  title={option.title}
                  description={option.description}
                  left={(props) => (
                    <option.icon
                      {...props}
                      size={24}
                      color={theme.colors.onSurfaceVariant}
                    />
                  )}
                  right={(props) => (
                    <List.Icon {...props} icon="chevron-right" />
                  )}
                  onPress={option.onPress}
                />
                {index < settingsOptions.length - 1 && <Divider />}
              </View>
            ))}
          </Card.Content>
        </Card>

        {/* Logout */}
        <Card
          style={[styles.logoutCard, { backgroundColor: theme.colors.surface }]}
        >
          <Card.Content>
            <List.Item
              title="Logout"
              description="Sign out of your account"
              left={(props) => (
                <LogOut {...props} size={24} color={theme.colors.error} />
              )}
              onPress={handleLogout}
              titleStyle={{ color: theme.colors.error }}
            />
            <Divider />
            <List.Item
              title="Delete Account"
              description="Permanently delete your account"
              left={(props) => (
                <Shield {...props} size={24} color={theme.colors.error} />
              )}
              onPress={() => router.push('/(auth)/delete-account')}
              titleStyle={{ color: theme.colors.error }}
            />
          </Card.Content>
        </Card>
      </ScrollView>

      <SavingsGoalsModal
        visible={showSavingsModal}
        onDismiss={() => setShowSavingsModal(false)}
      />

      <HabitsModal
        visible={showHabitsModal}
        onDismiss={() => setShowHabitsModal(false)}
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
  profileCard: {
    margin: 16,
    elevation: 2,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  profileInfo: {
    flex: 1,
    marginLeft: 16,
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  profileEmail: {
    fontSize: 14,
    marginTop: 4,
  },
  profileIncome: {
    fontSize: 14,
    marginTop: 4,
    fontWeight: '500',
  },
  editButton: {
    marginTop: 8,
  },
  statsCard: {
    margin: 16,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 12,
    marginTop: 4,
  },
  settingsCard: {
    margin: 16,
    elevation: 2,
  },
  logoutCard: {
    margin: 16,
    marginBottom: 32,
    elevation: 2,
  },
});
