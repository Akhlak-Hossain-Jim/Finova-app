import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import {
  Modal,
  Portal,
  Card,
  Button,
  TextInput,
  useTheme,
  Text,
  ProgressBar,
  FAB,
} from 'react-native-paper';
import { X, Target, Plus, Calendar, DollarSign } from 'lucide-react-native';
import { formatCurrency } from '@/consts/currencySymbols';
import { useSavingsGoalsContext } from '@/contexts/SavingsGoalsContext';
import { useAuth } from '@/contexts/AuthContext';

interface SavingsGoalsModalProps {
  visible: boolean;
  onDismiss: () => void;
}

export default function SavingsGoalsModal({
  visible,
  onDismiss,
}: SavingsGoalsModalProps) {
  const theme = useTheme();
  const { goals, addGoal } = useSavingsGoalsContext();
  const { profile } = useAuth();
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [goalTitle, setGoalTitle] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [targetDate, setTargetDate] = useState('');

  const getProgress = (current: number, target: number) => {
    return Math.min(current / target, 1);
  };

  const getDaysRemaining = (targetDate: string) => {
    const today = new Date();
    const target = new Date(targetDate);
    const timeDiff = target.getTime() - today.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return daysDiff;
  };

  const handleAddGoal = () => {
    if (!goalTitle || !targetAmount) {
      return;
    }

    const goalData = {
      title: goalTitle,
      target_amount: parseFloat(targetAmount),
      target_date: targetDate || undefined,
    };

    addGoal(goalData).then((result) => {
      if (result.success) {
        setGoalTitle('');
        setTargetAmount('');
        setTargetDate('');
        setShowAddGoal(false);
      }
    });
  };

  const resetAddGoalForm = () => {
    setGoalTitle('');
    setTargetAmount('');
    setTargetDate('');
    setShowAddGoal(false);
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
              <Text
                variant="titleLarge"
                style={[styles.title, { color: theme.colors.onSurface }]}
              >
                Savings Goals
              </Text>
              <Button
                mode="text"
                onPress={onDismiss}
                icon={() => <X size={20} color={theme.colors.onSurface} />}
              >
                Close
              </Button>
            </View>

            {!showAddGoal ? (
              <ScrollView
                showsVerticalScrollIndicator={false}
                style={styles.goalsList}
              >
                {goals.map((goal) => (
                  <Card
                    key={goal.id}
                    style={[
                      styles.goalCard,
                      { backgroundColor: theme.colors.surfaceVariant },
                    ]}
                  >
                    <Card.Content>
                      <View style={styles.goalHeader}>
                        <Text
                          style={[
                            styles.goalTitle,
                            { color: theme.colors.onSurface },
                          ]}
                        >
                          {goal.title}
                        </Text>
                        <Text
                          style={[
                            styles.goalAmount,
                            { color: theme.colors.primary },
                          ]}
                        >
                          {formatCurrency(goal.current_amount, profile)} /{' '}
                          {formatCurrency(goal.target_amount, profile)}
                        </Text>
                      </View>

                      <ProgressBar
                        progress={getProgress(
                          goal.current_amount,
                          goal.target_amount
                        )}
                        color={theme.colors.primary}
                        style={styles.progressBar}
                      />

                      <View style={styles.goalInfo}>
                        <Text
                          style={[
                            styles.goalProgress,
                            { color: theme.colors.onSurfaceVariant },
                          ]}
                        >
                          {Math.round(
                            getProgress(
                              goal.current_amount,
                              goal.target_amount
                            ) * 100
                          )}
                          % Complete
                        </Text>
                        {goal.target_date && (
                          <Text
                            style={[
                              styles.goalDate,
                              { color: theme.colors.onSurfaceVariant },
                            ]}
                          >
                            {getDaysRemaining(goal.target_date)} days remaining
                          </Text>
                        )}
                      </View>
                    </Card.Content>
                  </Card>
                ))}
              </ScrollView>
            ) : (
              <View style={styles.addGoalForm}>
                <TextInput
                  label="Goal Title"
                  value={goalTitle}
                  onChangeText={setGoalTitle}
                  mode="outlined"
                  style={styles.input}
                  left={
                    <TextInput.Icon
                      icon={() => (
                        <Target
                          size={20}
                          color={theme.colors.onSurfaceVariant}
                        />
                      )}
                    />
                  }
                  placeholder="e.g., Emergency Fund, Vacation"
                />

                <TextInput
                  label="Target Amount"
                  value={targetAmount}
                  onChangeText={setTargetAmount}
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
                  placeholder="0.00"
                />

                <TextInput
                  label="Target Date"
                  value={targetDate}
                  onChangeText={setTargetDate}
                  mode="outlined"
                  style={styles.input}
                  left={
                    <TextInput.Icon
                      icon={() => (
                        <Calendar
                          size={20}
                          color={theme.colors.onSurfaceVariant}
                        />
                      )}
                    />
                  }
                  placeholder="YYYY-MM-DD"
                />

                <View style={styles.addGoalButtons}>
                  <Button
                    mode="outlined"
                    onPress={resetAddGoalForm}
                    style={styles.cancelButton}
                  >
                    Cancel
                  </Button>
                  <Button
                    mode="contained"
                    onPress={handleAddGoal}
                    style={styles.addButton}
                    disabled={!goalTitle || !targetAmount}
                  >
                    Add Goal
                  </Button>
                </View>
              </View>
            )}
            {!showAddGoal && (
              <FAB
                icon={() => <Plus size={24} color={theme.colors.onPrimary} />}
                style={[styles.fab, { backgroundColor: theme.colors.primary }]}
                onPress={() => setShowAddGoal(true)}
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
  goalsList: {
    maxHeight: 400,
  },
  goalCard: {
    marginBottom: 12,
    elevation: 1,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  goalTitle: {
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
  },
  goalAmount: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    marginBottom: 8,
  },
  goalInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  goalProgress: {
    fontSize: 12,
  },
  goalDate: {
    fontSize: 12,
  },
  addGoalForm: {
    paddingBottom: 20,
  },
  input: {
    marginBottom: 16,
  },
  addGoalButtons: {
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
