import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import {
  Modal,
  Portal,
  Card,
  Title,
  Button,
  TextInput,
  useTheme,
  Text,
  FAB,
  Chip,
  IconButton,
} from 'react-native-paper';
import {
  X,
  Activity,
  Plus,
  Flame,
  CircleCheck as CheckCircle,
} from 'lucide-react-native';
import { useHabits } from '@/hooks/useHabits';

interface HabitsModalProps {
  visible: boolean;
  onDismiss: () => void;
}

export default function HabitsModal({ visible, onDismiss }: HabitsModalProps) {
  const theme = useTheme();
  const { habits, addHabit, toggleHabit } = useHabits();
  const [showAddHabit, setShowAddHabit] = useState(false);
  const [habitTitle, setHabitTitle] = useState('');
  const [habitCategory, setHabitCategory] = useState('financial');
  const [habitFrequency, setHabitFrequency] = useState('daily');

  const categories = [
    { id: 'financial', label: 'Financial', color: '#1976D2' },
    { id: 'earning', label: 'Earning', color: '#388E3C' },
    { id: 'saving', label: 'Saving', color: '#FBC02D' },
    { id: 'health', label: 'Health', color: '#D32F2F' },
  ];

  const frequencies = [
    { id: 'daily', label: 'Daily' },
    { id: 'weekly', label: 'Weekly' },
    { id: 'monthly', label: 'Monthly' },
  ];

  const handleAddHabit = () => {
    if (!habitTitle || !habitCategory || !habitFrequency) {
      return;
    }

    const habitData = {
      title: habitTitle,
      category:
        categories.find((cat) => cat.id === habitCategory)?.label ||
        'Financial',
      frequency:
        frequencies.find((freq) => freq.id === habitFrequency)?.label ||
        'Daily',
    };

    addHabit(habitData).then((result) => {
      if (result.success) {
        setHabitTitle('');
        setHabitCategory('financial');
        setHabitFrequency('daily');
        setShowAddHabit(false);
      }
    });
  };

  const resetAddHabitForm = () => {
    setHabitTitle('');
    setHabitCategory('financial');
    setHabitFrequency('daily');
    setShowAddHabit(false);
  };

  const toggleHabitCompletion = (habitId: string) => {
    toggleHabit(habitId);
  };

  const getCategoryColor = (category: string) => {
    const cat = categories.find((c) => c.label === category);
    return cat ? cat.color : '#1976D2';
  };

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        contentContainerStyle={[
          styles.modal,
          { backgroundColor: theme.colors.surface },
        ]}
      >
        <Card style={{ backgroundColor: theme.colors.surface }}>
          <Card.Content>
            <View style={styles.header}>
              <Title style={[styles.title, { color: theme.colors.onSurface }]}>
                Habit Tracker
              </Title>
              <Button
                mode="text"
                onPress={onDismiss}
                icon={() => <X size={20} color={theme.colors.onSurface} />}
              >
                Close
              </Button>
            </View>

            {!showAddHabit ? (
              <ScrollView
                showsVerticalScrollIndicator={false}
                style={styles.habitsList}
              >
                {habits.map((habit) => (
                  <Card
                    key={habit.id}
                    style={[
                      styles.habitCard,
                      { backgroundColor: theme.colors.surfaceVariant },
                    ]}
                  >
                    <Card.Content>
                      <View style={styles.habitHeader}>
                        <View style={styles.habitInfo}>
                          <Text
                            style={[
                              styles.habitTitle,
                              { color: theme.colors.onSurface },
                            ]}
                          >
                            {habit.title}
                          </Text>
                          <View style={styles.habitMeta}>
                            <Chip
                              mode="outlined"
                              style={[
                                styles.categoryChip,
                                {
                                  borderColor: getCategoryColor(habit.category),
                                },
                              ]}
                              textStyle={{
                                color: getCategoryColor(habit.category),
                              }}
                            >
                              {habit.category}
                            </Chip>
                            <Text
                              style={[
                                styles.frequency,
                                { color: theme.colors.onSurfaceVariant },
                              ]}
                            >
                              {habit.frequency}
                            </Text>
                          </View>
                        </View>
                        <IconButton
                          icon={() => {
                            const today = new Date()
                              .toISOString()
                              .split('T')[0];
                            const completedToday =
                              habit.last_completed === today;
                            return completedToday ? (
                              <CheckCircle
                                size={24}
                                color={theme.colors.primary}
                              />
                            ) : (
                              <CheckCircle
                                size={24}
                                color={theme.colors.outline}
                              />
                            );
                          }}
                          onPress={() => toggleHabitCompletion(habit.id)}
                        />
                      </View>

                      <View style={styles.streakInfo}>
                        <View style={styles.streakItem}>
                          <Flame
                            size={16}
                            color={
                              habit.current_streak > 0
                                ? '#FF6B35'
                                : theme.colors.outline
                            }
                          />
                          <Text
                            style={[
                              styles.streakText,
                              { color: theme.colors.onSurfaceVariant },
                            ]}
                          >
                            {habit.current_streak} day streak
                          </Text>
                        </View>
                        {(() => {
                          const today = new Date().toISOString().split('T')[0];
                          const completedToday = habit.last_completed === today;
                          return (
                            <Text
                              style={[
                                styles.streakStatus,
                                {
                                  color: completedToday
                                    ? theme.colors.primary
                                    : theme.colors.error,
                                },
                              ]}
                            >
                              {completedToday
                                ? 'Completed Today'
                                : 'Not Done Yet'}
                            </Text>
                          );
                        })()}
                      </View>
                    </Card.Content>
                  </Card>
                ))}
              </ScrollView>
            ) : (
              <View style={styles.addHabitForm}>
                <TextInput
                  label="Habit Title"
                  value={habitTitle}
                  onChangeText={setHabitTitle}
                  mode="outlined"
                  style={styles.input}
                  left={
                    <TextInput.Icon
                      icon={() => (
                        <Activity
                          size={20}
                          color={theme.colors.onSurfaceVariant}
                        />
                      )}
                    />
                  }
                  placeholder="e.g., Log daily expenses"
                />

                <Text style={[styles.label, { color: theme.colors.onSurface }]}>
                  Category
                </Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  style={styles.categoryScroll}
                >
                  {categories.map((category) => (
                    <Chip
                      key={category.id}
                      selected={habitCategory === category.id}
                      onPress={() => setHabitCategory(category.id)}
                      style={styles.categoryChip}
                      selectedColor={category.color}
                    >
                      {category.label}
                    </Chip>
                  ))}
                </ScrollView>

                <Text style={[styles.label, { color: theme.colors.onSurface }]}>
                  Frequency
                </Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  style={styles.frequencyScroll}
                >
                  {frequencies.map((frequency) => (
                    <Chip
                      key={frequency.id}
                      selected={habitFrequency === frequency.id}
                      onPress={() => setHabitFrequency(frequency.id)}
                      style={styles.frequencyChip}
                    >
                      {frequency.label}
                    </Chip>
                  ))}
                </ScrollView>

                <View style={styles.addHabitButtons}>
                  <Button
                    mode="outlined"
                    onPress={resetAddHabitForm}
                    style={styles.cancelButton}
                  >
                    Cancel
                  </Button>
                  <Button
                    mode="contained"
                    onPress={handleAddHabit}
                    style={styles.addButton}
                    disabled={!habitTitle}
                  >
                    Add Habit
                  </Button>
                </View>
              </View>
            )}
            {!showAddHabit && (
              <FAB
                icon={() => <Plus size={24} color={theme.colors.onPrimary} />}
                style={[styles.fab, { backgroundColor: theme.colors.primary }]}
                onPress={() => setShowAddHabit(true)}
              />
            )}
          </Card.Content>
        </Card>
      </Modal>
    </Portal>
  );
}

const styles = StyleSheet.create({
  modal: {
    margin: 20,
    borderRadius: 8,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  habitsList: {
    maxHeight: 400,
  },
  habitCard: {
    marginBottom: 12,
    elevation: 1,
  },
  habitHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  habitInfo: {
    flex: 1,
  },
  habitTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  habitMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  categoryChip: {
    height: 28,
  },
  frequency: {
    fontSize: 12,
  },
  streakInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  streakItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  streakText: {
    fontSize: 12,
  },
  streakStatus: {
    fontSize: 12,
    fontWeight: '500',
  },
  addHabitForm: {
    paddingBottom: 20,
  },
  input: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    marginTop: 8,
  },
  categoryScroll: {
    marginBottom: 16,
  },
  frequencyScroll: {
    marginBottom: 16,
  },
  frequencyChip: {
    marginRight: 8,
  },
  addHabitButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 10,
  },
  cancelButton: {
    flex: 1,
  },
  addButton: {
    flex: 1,
  },
  fab: {
    alignItems: 'center',
    marginHorizontal: 'auto',
    elevation: 6,
  },
});
