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
  Chip,
  SegmentedButtons,
} from 'react-native-paper';
import {
  X,
  DollarSign,
  Home,
  ShoppingBag,
  Car,
  Heart,
  CreditCard,
  Users,
  Gift,
  Calendar,
} from 'lucide-react-native';
import { useExpensesContext } from '@/contexts/ExpensesContext';

interface AddExpenseModalProps {
  visible: boolean;
  onDismiss: () => void;
  categories: any[];
  addExpense: (expenseData: any) => Promise<{ success: boolean; error?: any }>;
}

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

export default function AddExpenseModal({
  visible,
  onDismiss,
}: AddExpenseModalProps) {
  const theme = useTheme();
  const { categories, addExpense } = useExpensesContext();
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubcategory, setSelectedSubcategory] = useState('');
  const [familyMember, setFamilyMember] = useState('self');

  const familyMembers = [
    { value: 'self', label: 'Self' },
    { value: 'spouse', label: 'Spouse' },
    { value: 'children', label: 'Children' },
    { value: 'parents', label: 'Parents' },
  ];

  const resetForm = () => {
    setAmount('');
    setDescription('');
    setSelectedCategory('');
    setSelectedSubcategory('');
    setFamilyMember('self');
  };

  const handleSubmit = () => {
    if (!amount || !description || !selectedCategory || !selectedSubcategory) {
      return;
    }

    const expenseData = {
      amount: parseFloat(amount),
      description,
      category_id: selectedCategory,
      subcategory: selectedSubcategory,
      family_member:
        familyMembers.find((member) => member.value === familyMember)?.label ||
        'Self',
      date: new Date().toISOString().split('T')[0],
    };

    addExpense(expenseData).then((result) => {
      if (result.success) {
        resetForm();
        onDismiss();
      }
    });
  };

  const safeCategories = categories || [];
  const selectedCategoryData = safeCategories.find(
    (cat) => cat.id === selectedCategory
  );

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
                Add Expense
              </Title>
              <Button
                mode="text"
                onPress={onDismiss}
                icon={() => <X size={20} color={theme.colors.onSurface} />}
              >
                Close
              </Button>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Amount Input */}
              <TextInput
                label="Amount"
                value={amount}
                onChangeText={setAmount}
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

              {/* Description Input */}
              <TextInput
                label="Description"
                value={description}
                onChangeText={setDescription}
                mode="outlined"
                style={styles.input}
                placeholder="e.g., Grocery shopping"
              />

              {/* Category Selection */}
              <Text style={[styles.label, { color: theme.colors.onSurface }]}>
                Category
              </Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.categoryScroll}
              >
                {safeCategories.map((category) => (
                  <Chip
                    key={category.id}
                    selected={selectedCategory === category.id}
                    onPress={() => {
                      setSelectedCategory(category.id);
                      setSelectedSubcategory('');
                    }}
                    style={styles.categoryChip}
                    icon={() => {
                      const IconComponent = getCategoryIcon(category.name);
                      return <IconComponent size={16} color={category.color} />;
                    }}
                  >
                    {category.name}
                  </Chip>
                ))}
              </ScrollView>

              {/* Subcategory Selection */}
              {selectedCategoryData && (
                <>
                  <Text
                    style={[styles.label, { color: theme.colors.onSurface }]}
                  >
                    Subcategory
                  </Text>
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.subcategoryScroll}
                  >
                    {(selectedCategoryData.subcategories || []).map(
                      (subcategory: string) => (
                        <Chip
                          key={subcategory}
                          selected={selectedSubcategory === subcategory}
                          onPress={() => setSelectedSubcategory(subcategory)}
                          style={styles.subcategoryChip}
                        >
                          {subcategory}
                        </Chip>
                      )
                    )}
                  </ScrollView>
                </>
              )}

              {/* Family Member Selection */}
              <Text style={[styles.label, { color: theme.colors.onSurface }]}>
                Family Member
              </Text>
              <SegmentedButtons
                value={familyMember}
                onValueChange={setFamilyMember}
                buttons={familyMembers}
                style={styles.familySelector}
              />

              {/* Submit Button */}
              <Button
                mode="contained"
                onPress={handleSubmit}
                style={styles.submitButton}
                disabled={
                  !amount ||
                  !description ||
                  !selectedCategory ||
                  !selectedSubcategory
                }
              >
                Add Expense
              </Button>
            </ScrollView>
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
  categoryChip: {
    marginRight: 8,
  },
  subcategoryScroll: {
    marginBottom: 16,
  },
  subcategoryChip: {
    marginRight: 8,
  },
  familySelector: {
    marginBottom: 20,
  },
  submitButton: {
    marginTop: 10,
  },
});
