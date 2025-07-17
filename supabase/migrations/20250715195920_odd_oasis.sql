/*
  # Seed Expense Categories

  1. Insert predefined expense categories with subcategories
  2. Categories include Housing, Food, Shopping, Health, Transport, etc.
*/

INSERT INTO expense_categories (name, icon, color, subcategories, is_annual) VALUES
('Housing', 'home', '#FF6384', ARRAY['Rent', 'Utilities', 'Electricity', 'Gas', 'Water', 'Internet', 'Maintenance'], false),
('Food', 'utensils', '#36A2EB', ARRAY['Groceries', 'Restaurants', 'Fresh Foods', 'Fish', 'Meat', 'Chicken'], false),
('Shopping', 'shopping-bag', '#FFCE56', ARRAY['Clothing', 'Online Shopping', 'General Shopping', 'Electronics'], false),
('Health', 'heart', '#4BC0C0', ARRAY['Medical', 'Personal Care', 'Fitness', 'Pharmacy', 'Doctor Visits'], false),
('Transport', 'car', '#9966FF', ARRAY['Public Transport', 'Fuel', 'Maintenance', 'Parking', 'Travel'], false),
('Financial', 'credit-card', '#FF9F40', ARRAY['Credit Cards', 'Loans', 'Banking Fees', 'Insurance'], false),
('Family', 'users', '#FF6384', ARRAY['Pocket Money', 'Gifts', 'Support', 'Children', 'Parents'], false),
('Charity', 'gift', '#4BC0C0', ARRAY['Donations', 'Zakat', 'Organizations', 'Masjid', 'NGOs'], false),
('Annual', 'calendar', '#36A2EB', ARRAY['Tax', 'Qurbani', 'Zakat', 'Fitra', 'Eid Expenses', 'Insurance'], true),
('Household', 'package', '#FFCE56', ARRAY['Cookeries', 'Household Items', 'Furniture', 'Appliances'], false),
('Services', 'briefcase', '#9966FF', ARRAY['Maid Fees', 'Household Services', 'Repairs', 'Professional Services'], false),
('Vehicle', 'truck', '#FF9F40', ARRAY['Maintenance', 'Renovations', 'Registration', 'Insurance'], false);