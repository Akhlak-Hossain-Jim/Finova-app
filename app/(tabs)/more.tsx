import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Alert,
  useColorScheme,
} from 'react-native';
import {
  Surface,
  Card,
  Button,
  useTheme,
  Text,
  Divider,
  List,
  Switch,
  Avatar,
  TextInput,
  Modal,
  Portal,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  User,
  Settings,
  Target,
  Activity,
  Users,
  Bell,
  Shield,
  CircleHelp as HelpCircle,
  LogOut,
  Moon,
  Sun,
  DollarSign,
  X,
} from 'lucide-react-native';
import SavingsGoalsModal from '@/components/SavingsGoalsModal';
import HabitsModal from '@/components/HabitsModal';
import { useAuth } from '@/contexts/AuthContext';

export default function MoreScreen() {
  const theme = useTheme();
  const colorScheme = useColorScheme();
  const { user, signOut } = useAuth();
  const [isDarkMode, setIsDarkMode] = useState(colorScheme === 'dark');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [showSavingsModal, setShowSavingsModal] = useState(false);
  const [showHabitsModal, setShowHabitsModal] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);

  const [userProfile, setUserProfile] = useState({
    name: user?.user_metadata?.full_name || 'User',
    email: user?.email || '',
    currency: 'USD',
    monthlyIncome: 5000,
  });

  const [editForm, setEditForm] = useState({
    name: userProfile.name,
    monthlyIncome: userProfile.monthlyIncome.toString(),
  });

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

  const handleSaveProfile = () => {
    setUserProfile((prev) => ({
      ...prev,
      name: editForm.name,
      monthlyIncome: parseFloat(editForm.monthlyIncome) || 0,
    }));
    setShowEditProfile(false);
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

  const settingsOptions = [
    {
      title: 'Savings Goals',
      description: 'Manage your financial goals',
      icon: Target,
      onPress: () => setShowSavingsModal(true),
    },
    {
      title: 'Habit Tracking',
      description: 'Track your financial habits',
      icon: Activity,
      onPress: () => setShowHabitsModal(true),
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
  ];

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
            More
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
                  Monthly Income: ${userProfile.monthlyIncome.toLocaleString()}
                </Text>
              </View>
            </View>
            <Button
              mode="outlined"
              onPress={() => setShowEditProfile(true)}
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
                  $3,200
                </Text>
                <Text
                  style={[
                    styles.statLabel,
                    { color: theme.colors.onSurfaceVariant },
                  ]}
                >
                  This Month
                </Text>
              </View>
              <View style={styles.statItem}>
                <Text
                  style={[styles.statValue, { color: theme.colors.secondary }]}
                >
                  $1,800
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
                  3/5
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
              right={() => (
                <Switch value={isDarkMode} onValueChange={setIsDarkMode} />
              )}
            />

            <Divider />

            {/* Notifications Toggle */}
            <List.Item
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

            <Divider />

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
          </Card.Content>
        </Card>
      </ScrollView>

      {/* Edit Profile Modal */}
      <Portal>
        <Modal
          visible={showEditProfile}
          onDismiss={() => setShowEditProfile(false)}
          contentContainerStyle={[
            styles.modal,
            { backgroundColor: theme.colors.surface },
          ]}
        >
          <Card style={{ backgroundColor: theme.colors.surface }}>
            <Card.Content>
              <View style={styles.modalHeader}>
                <Text
                  variant="titleLarge"
                  style={[styles.modalTitle, { color: theme.colors.onSurface }]}
                >
                  Edit Profile
                </Text>
                <Button
                  mode="text"
                  onPress={() => setShowEditProfile(false)}
                  icon={() => <X size={20} color={theme.colors.onSurface} />}
                >
                  Close
                </Button>
              </View>

              <TextInput
                label="Full Name"
                value={editForm.name}
                onChangeText={(text) =>
                  setEditForm((prev) => ({ ...prev, name: text }))
                }
                mode="outlined"
                style={styles.input}
                left={
                  <TextInput.Icon
                    icon={() => (
                      <User size={20} color={theme.colors.onSurfaceVariant} />
                    )}
                  />
                }
              />

              <TextInput
                label="Monthly Income"
                value={editForm.monthlyIncome}
                onChangeText={(text) =>
                  setEditForm((prev) => ({ ...prev, monthlyIncome: text }))
                }
                keyboardType="numeric"
                mode="outlined"
                style={styles.input}
                left={
                  <TextInput.Icon
                    icon={() => (
                      <DollarSign
                        size={20}
                        color={theme.colors.onSurfaceVariant}
                      />
                    )}
                  />
                }
              />

              <Button
                mode="contained"
                onPress={handleSaveProfile}
                style={styles.saveButton}
              >
                Save Changes
              </Button>
            </Card.Content>
          </Card>
        </Modal>
      </Portal>

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
  modal: {
    margin: 20,
    borderRadius: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  input: {
    marginBottom: 16,
  },
  saveButton: {
    marginTop: 10,
  },
});
