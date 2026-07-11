export interface WalletStats {
  balance: number;
  availableBalance: number;
  frozenBalance: number;
  currency: string;
  bonusBalance: number;
  points: number;
}

export interface WalletTransaction {
  id: string;
  type: "credit" | "debit";
  amount: number;
  balance: number;
  description: string;
  date: string;
  created_at: string;
}

export interface BonusTransaction {
  id: string;
  amount: number;
  description: string;
  created_at: string;
  status: string;
  source_type?: string;
  type?: string;
}

export interface PointsTransaction {
  id: string;
  amount: number;
  description: string;
  created_at: string;
  source_type: string;
}

export interface WalletViewModel {
  stats: WalletStats;
  recentTransactions: WalletTransaction[];
  bonusTransactions: BonusTransaction[];
  pointsTransactions: PointsTransaction[];
}