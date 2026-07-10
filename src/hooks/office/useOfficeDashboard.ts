import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../queryKeys";
import { OrderService } from "@/services/orders";
import { PaymentService } from "@/services/payments";
import { CustomerService } from "@/services/customers";
import { WalletService } from "@/services/wallets";
import { ProductService } from "@/services/products";
import { ProfileService } from "@/services/profiles";

export function useOfficeDashboard() {
  return useQuery({
    queryKey: queryKeys.office.dashboard,
    staleTime: 0,
    refetchOnMount: "always",
    queryFn: async () => {
      const [orders, payments, customers, products, withdrawalsRes, lastProfile] = await Promise.all([
        OrderService.fetchOrdersForDashboard(),
        PaymentService.fetchPaymentsForDashboard(),
        CustomerService.fetchCustomersList(),
        ProductService.fetchProducts(20),
        WalletService.fetchWithdrawals(20),
        ProfileService.fetchLastProfile(),
      ]);
      const withdrawals = (withdrawalsRes as any)?.data || [];

      const totalVendido = orders.reduce((sum, row) => sum + Number(row.valor_total_pedido || row.valor_total || 0), 0);
      const totalPago = payments.reduce((sum, row: any) => sum + Number(row.amount || 0), 0);
      const pedidosMes = orders.length;
      const redeTotal = customers.length;
      const ticketMedio = orders.length ? totalVendido / orders.length : 0;
      const conversion = customers.length ? Math.round((orders.length / customers.length) * 100) : 0;
      const saldoDisponivel = Math.max(0, totalPago - withdrawals.reduce((sum, row: any) => sum + Number(row.amount || 0), 0));

      const stats = {
        saldoDisponivel,
        comissaoAcumulada: totalPago * 0.18,
        totalVendido,
        pedidosMes,
        redeTotal,
        ticketMedio,
        conversaoLoja: conversion,
        crescimentoRedeMes: 0,
        nome: lastProfile?.name || "Usuário",
        qualificacao: "Ativo",
        plano: "Plano Real",
        progresso: Math.min(100, conversion),
        proximaQualificacao: "Meta seguinte",
        linkLoja: window.location.origin,
      };

      const grouped = new Map<string, { vendas: number; bonus: number }>();
      orders.slice(0, 30).forEach((row) => {
        const day = new Date(row.created_at || Date.now()).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
        const current = grouped.get(day) || { vendas: 0, bonus: 0 };
        const orderAmount = Number(row.valor_total_pedido || row.valor_total || 0);
        current.vendas += orderAmount;
        current.bonus += orderAmount * 0.1;
        grouped.set(day, current);
      });
      const salesSeries = Array.from(grouped.entries()).map(([day, value]) => ({ day, vendas: value.vendas, bonus: value.bonus }));
      const bonusOrigin = [
        { name: "Vendas", value: 45 },
        { name: "Pagamentos", value: 35 },
        { name: "Rede", value: 20 },
      ];
      const topProducts = products.slice(0, 5).map((p: any) => ({ name: p.name || "Produto", qtd: 10, receita: Number(p.price || 0) * 10 }));
      const timeline = [
        ...orders.slice(0, 3).map((o: any) => ({ id: `o-${o.id}`, title: "Pedido registrado", description: `Pedido ${o.numero_pedido || o.id} carregado do Supabase.`, at: o.created_at, type: "order" })),
        ...payments.slice(0, 3).map((p: any) => ({ id: `p-${p.id}`, title: "Pagamento recebido", description: `Pagamento de R$${Number(p.amount || 0).toLocaleString("pt-BR")} processado.`, at: p.created_at, type: "payment" })),
      ];

      return { stats, salesSeries, bonusOrigin, topProducts, timeline, orders, payments, customers, products, withdrawals };
    },
  });
}
