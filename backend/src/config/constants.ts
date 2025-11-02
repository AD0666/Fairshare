export const EXPENSE_CATEGORIES = [
  'Food & Dining',
  'Transportation',
  'Shopping',
  'Entertainment',
  'Utilities',
  'Rent',
  'Other',
] as const;

export const SPLIT_TYPES = {
  EQUAL: 'equal',
  UNEQUAL: 'unequal',
  PERCENTAGE: 'percentage',
  SHARES: 'shares',
} as const;

export type ExpenseCategory = typeof EXPENSE_CATEGORIES[number];
export type SplitType = typeof SPLIT_TYPES[keyof typeof SPLIT_TYPES];

