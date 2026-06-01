export type Rank = 'Retailer' | 'Distributor' | 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Diamond' | 'Crown President';

export interface Distributor {
  id: string;
  name: string;
  rank: Rank;
  status: 'Active' | 'Inactive' | 'Pending';
  email: string;
  phone: string;
  sponsorId: string | null;
  joinDate: string;
  monthlyPV: number; // Personal Volume
  monthlyGV: number; // Group Volume
  totalCommissions: number;
  downlineCount: number;
  avatarUrl?: string;
  location: string;
}

export interface TreeNode {
  id: string;
  name: string;
  rank: Rank;
  status: 'Active' | 'Inactive' | 'Pending';
  level: number;
  monthlyPV: number;
  monthlyGV: number;
  children?: TreeNode[];
}

export interface Transaction {
  id: string;
  date: string;
  type: 'Commission' | 'Bonus' | 'Withdrawal' | 'Retail Sale' | 'License Fee';
  amount: number;
  status: 'Completed' | 'Pending' | 'Failed';
  description: string;
  recipient: string;
}

export interface ProductItem {
  id: string;
  name: string;
  sku: string;
  category: 'Supplements' | 'E-commerce Pack' | 'Software License' | 'Marketing Suite';
  price: number;
  pv: number; // Personal volume rewards
  stock: number;
  salesCount: number;
  imageUrl: string;
}

export interface CopilotMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
}

export interface SalesOrder {
  id: string;
  customerName: string;
  products: { name: string; quantity: number; price: number }[];
  totalAmount: number;
  totalPV: number;
  status: 'Shipped' | 'Processing' | 'Pending' | 'Cancelled';
  date: string;
  distributorId?: string;
}

export interface SystemIntegration {
  id: string;
  name: string;
  type: 'PaymentGateway' | 'CRM' | 'E-commerce' | 'AI' | 'TaxService';
  status: 'Connected' | 'Disconnected' | 'Error';
  lastSync: string;
  details: string;
}
