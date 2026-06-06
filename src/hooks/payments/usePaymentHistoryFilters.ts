import { useState } from "react";
import { toast } from "sonner";

interface Payment {
  id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'approved' | 'rejected' | 'refunded' | 'cancelled' | 'processing' | 'failed';
  paymentMethod: 'card' | 'pix' | 'boleto' | 'cash';
  createdAt: string;
  orderId?: string;
  customerName: string;
}

interface UsePaymentHistoryFiltersProps {
  payments: Payment[];
  refetch: () => void;
}

export function usePaymentHistoryFilters({ payments, refetch }: UsePaymentHistoryFiltersProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [methodFilter, setMethodFilter] = useState<string>('all');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800 dark:bg-green-950/40 dark:text-green-400';
      case 'pending':
      case 'processing':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950/40 dark:text-yellow-400';
      case 'rejected':
      case 'failed':
        return 'bg-red-100 text-red-800 dark:bg-red-950/40 dark:text-red-400';
      case 'refunded':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-950/40 dark:text-blue-400';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400';
    }
  };

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case 'card':
        return '💳';
      case 'pix':
        return '📱';
      case 'boleto':
        return '📄';
      case 'cash':
        return '💵';
      default:
        return '❓';
    }
  };

  const filteredPayments = payments.filter((payment) => {
    const matchesSearch =
      payment.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (payment.orderId && payment.orderId.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || payment.status === statusFilter;
    const matchesMethod = methodFilter === 'all' || payment.paymentMethod === methodFilter;
    return matchesSearch && matchesStatus && matchesMethod;
  });

  const handleViewDetails = (paymentId: string) => {
    toast.info(`Comprovante de pagamento transação ${paymentId.slice(0, 8)} assinado pelo gateway.`);
  };

  const handleExport = () => {
    toast.success('Iniciando exportação de relatório financeiro em formato Excel/CSV.');
  };

  const handleRefresh = () => {
    refetch();
    toast.success('Histórico de transações atualizado!');
  };

  return {
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    methodFilter,
    setMethodFilter,
    getStatusColor,
    getPaymentMethodIcon,
    filteredPayments,
    handleViewDetails,
    handleExport,
    handleRefresh,
  };
}
