import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { 
  Modal, 
  Portal, 
  Card, 
  Title, 
  Button, 
  TextInput,
  useTheme,
  Text
} from 'react-native-paper';
import { X, DollarSign, Briefcase, Calendar } from 'lucide-react-native';
import { useIncome } from '@/hooks/useIncome';

interface AddIncomeModalProps {
  visible: boolean;
  onDismiss: () => void;
}

export default function AddIncomeModal({ visible, onDismiss }: AddIncomeModalProps) {
  const theme = useTheme();
  const { addIncome } = useIncome();
  const [source, setSource] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const resetForm = () => {
    setSource('');
    setAmount('');
    setDescription('');
    setDate(new Date().toISOString().split('T')[0]);
  };

  const handleSubmit = () => {
    if (!source || !amount) {
      return;
    }

    const incomeData = {
      source,
      amount: parseFloat(amount),
      description: description || undefined,
      date
    };

    addIncome(incomeData).then(result => {
      if (result.success) {
        resetForm();
        onDismiss();
      }
    });
  };

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        contentContainerStyle={[styles.modal, { backgroundColor: theme.colors.surface }]}
      >
        <Card style={{ backgroundColor: theme.colors.surface }}>
          <Card.Content>
            <View style={styles.header}>
              <Title style={[styles.title, { color: theme.colors.onSurface }]}>
                Add Income
              </Title>
              <Button 
                mode="text" 
                onPress={onDismiss}
                icon={() => <X size={20} color={theme.colors.onSurface} />}
              >
                Close
              </Button>
            </View>

            {/* Source Input */}
            <TextInput
              label="Income Source"
              value={source}
              onChangeText={setSource}
              mode="outlined"
              style={styles.input}
              left={<TextInput.Icon icon={() => <Briefcase size={20} color={theme.colors.onSurfaceVariant} />} />}
              placeholder="e.g., Salary, Freelance, Investment"
            />

            {/* Amount Input */}
            <TextInput
              label="Amount"
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
              mode="outlined"
              style={styles.input}
              left={<TextInput.Icon icon={() => <DollarSign size={20} color={theme.colors.onSurfaceVariant} />} />}
              placeholder="0.00"
            />

            {/* Description Input */}
            <TextInput
              label="Description (Optional)"
              value={description}
              onChangeText={setDescription}
              mode="outlined"
              style={styles.input}
              placeholder="Additional details"
            />

            {/* Date Input */}
            <TextInput
              label="Date"
              value={date}
              onChangeText={setDate}
              mode="outlined"
              style={styles.input}
              left={<TextInput.Icon icon={() => <Calendar size={20} color={theme.colors.onSurfaceVariant} />} />}
              placeholder="YYYY-MM-DD"
            />

            {/* Submit Button */}
            <Button
              mode="contained"
              onPress={handleSubmit}
              style={styles.submitButton}
              disabled={!source || !amount}
            >
              Add Income
            </Button>
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
  input: {
    marginBottom: 16,
  },
  submitButton: {
    marginTop: 10,
  },
});