import { currencies } from './currencies';
import { Profile } from '@/contexts/AuthContext';

export const getCurrencySymbol = (currencyCode: string): string => {
  const currency = currencies.find((c) => c.value === currencyCode);
  return currency ? currency.symbol : '$'; // Default to dollar sign
};

export const formatCurrency = (amount: number, profile: Profile | null) => {
  const userCurrency = profile?.currency || 'USD';
  const symbol = getCurrencySymbol(userCurrency);
  return `${symbol}${new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)}`;
};
