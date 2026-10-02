export interface Product {
  id: string;
  name: string;
  category: 'Beverages' | 'Grains & Food' | 'Toiletries' | 'Snacks';
  price: number;
  stock: number;
  initialStock: number;
  image: string;
  imageAlt: string;
  isFastMover?: boolean;
  isStaple?: boolean;
  lowStockThreshold?: number;
}

export interface CartItem {
  id: string;
  name: string;
  unitPrice: number;
  quantity: number;
}

export interface CustomerDebt {
  id: string;
  name: string;
  initials: string;
  phone: string;
  amount: number;
  itemDescription: string;
  timeLabel: string;
  status: 'pending' | 'overdue' | 'settled' | 'partial';
  isVerified?: boolean;
  invoiceRef?: string;
  settledTodayAmount?: number;
  daysOverdue?: number;
}

export interface LedgerTransaction {
  id: string;
  refCode: string;
  timeAgo: string;
  amount: number;
  type: 'sale' | 'debt_pending' | 'debt_settle';
  paymentMode?: 'cash' | 'pos' | 'credit';
  title: string;
  subtitle: string;
  isCreditRecovery?: boolean;
}

export interface DailyCashFlow {
  grossSales: number;
  debtRepaymentsCollected: number;
  cashPurchasesRestock: number;
  netDailyCashInHand: number;
}

export type ScreenId = 'dashboard' | 'sell' | 'inventory' | 'debts' | 'analytics';

export interface AssistantResponse {
  screen?: ScreenId;
  component?: string;
  action?: string;
  payload?: Record<string, any>;
  error?: 'missing_field' | 'not_in_ui';
  field?: string;
  request?: string;
}
