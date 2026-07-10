import { useState, useMemo } from "react";

interface UsePaymentHistoryFiltersProps {
  payments: any[];
  refetch?: () => void;
}

export function usePaymentHistoryFilters({ payments, refetch }: UsePaymentHistoryFiltersProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [methodFilter, setMethodFilter] = useState<string>("all");

  const filteredPayments = useMemo(() => {
    let result = payments || [];
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      result = result.filter((p: any) =>
        p.id?.toLowerCase().includes(q) ||
        p.customerName?.toLowerCase().includes(q)
      );
    }
    if (statusFilter !== "all") result = result.filter((p: any) => p.status === statusFilter);
    if (methodFilter !== "all") result = result.filter((p: any) => p.paymentMethod === methodFilter);
    return result;
  }, [payments, searchTerm, statusFilter, methodFilter]);

  const getStatusColor = (status: string): string => {
    const colors: Record<string, string> = {
      approved: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
      pending: "bg-yellow-500/10 text-yellow-400 border-yellow-500/30",
      rejected: "bg-red-500/10 text-red-400 border-red-500/30",
      failed: "bg-red-500/10 text-red-400 border-red-500/30",
      processing: "bg-blue-500/10 text-blue-400 border-blue-500/30",
      refunded: "bg-purple-500/10 text-purple-400 border-purple-500/30",
      cancelled: "bg-gray-500/10 text-gray-400 border-gray-500/30",
    };
    return colors[status] || "bg-gray-500/10 text-gray-400 border-gray-500/30";
  };

  const getPaymentMethodIcon = (method: string): string => {
    const icons: Record<string, string> = { card: "💳", pix: "⚡", boleto: "📄", cash: "💵" };
    return icons[method] || "💰";
  };

  const handleViewDetails = (paymentId: string) => {
    console.log("View details for payment:", paymentId);
  };

  const handleExport = () => {
    if (typeof window === "undefined") return;
    const headers = ["id", "customerName", "amount", "status", "paymentMethod", "createdAt"];
    const rows = filteredPayments.map((p: any) =>
      headers.map((h: string) => `"${String(p[h] ?? "").replace(/"/g, '""')}"`).join(",")
    );
    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `payment-history-${Date.now()}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleRefresh = () => {
    refetch?.();
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
