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
      const [orders, payments, customers, products, withdrawals, lastProfile] = await Promise.all([
        OrderService.fetchOrdersForDashboard(),
        PaymentService.fetchPaymentsForDashboard(),
        CustomerService.fetchCustomersList(),
        ProductService.fetchProducts(20),
        WalletService.fetchRecentWithdrawals(20),
        ProfileService.fetchLastProfile(),
      ]);

      const totalVendido = orders.reduce((sum, row) => sum + Number(row.valor_total_pedido || row.valor_total || 0), 0);
      const totalPago = payments.reduce((sum, row) => sum + Number(row.amount || 0), 0);
      const pedidosMes = orders.length;
      const redeTotal = customers.length;
      const ticketMedio = orders.length ? totalVendido / orders.length : 0;
      const conversion = customers.length ? Math.round((orders.length / customers.length) * 100) : 0;
      const saldoDisponivel = Math.max(0, totalPago - withdrawals.reduce((sum, row) => sum + Number(row.amount || 0), 0));

      // Get customer bonus and plan data
      const currentProfile = lastProfile; // Assuming logged-in profile
      let customerBonus = null;
      let customerPlan = null;
      let totalBonus = 0;
      let directBonus = 0;
      let networkBonus = 0;
      let planName = "Plano Padrão";

      // MIGRAÇÃO EM PROGRESSO: Usando ProfileService em vez de CustomerService
      if (currentProfile?.id) {
        try {
          const [bonusData, planData] = await Promise.all([
            ProfileService.fetchProfileBonus(currentProfile.id),
            ProfileService.fetchProfilePlan(currentProfile.id),
          ]);
          customerBonus = bonusData;
          customerPlan = planData;
          
          if (customerBonus) {
            totalBonus = Number(customerBonus.total_bonus || 0);
            directBonus = Number(customerBonus.direct_bonus || 0);
            networkBonus = Number(customerBonus.network_bonus || 0);
          }
          
          if (customerPlan?.plans) {
            planName = customerPlan.plans.name || "Plano Padrão";
          }
        } catch (error) {
          console.error("Error fetching customer bonus/plan:", error);
        }
      }

      const stats = {
        saldoDisponivel,
        comissaoAcumulada: totalBonus, // Use real bonus from database
        totalVendido,
        pedidosMes,
        redeTotal,
        ticketMedio,
        conversaoLoja: conversion,
        crescimentoRedeMes: 0,
        nome: lastProfile?.name || "Usuário",
        qualification: "Ativo",
        plano: planName,
        progresso: Math.min(100, conversion),
        proximaQualification: "Meta seguinte",
        linkLoja: window.location.origin,
      };

      const grouped = new Map<string, { vendas: number; bonus: number }>();
      orders.slice(0, 30).forEach((row) => {
        const day = new Date(row.created_at || Date.now()).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
        const current = grouped.get(day) || { vendas: 0, bonus: 0 };
        const orderAmount = Number(row.valor_total_pedido || row.valor_total || 0);
        current.vendas += orderAmount;
        // Use real bonus percentage from plan if available, otherwise default to 10%
        const bonusPercentage = customerPlan?.plans?.direct_bonus_percentage ? Number(customerPlan.plans.direct_bonus_percentage) / 100 : 0.1;
        current.bonus += orderAmount * bonusPercentage;
        grouped.set(day, current);
      });
      const salesSeries = Array.from(grouped.entries()).map(([day, value]) => ({ day, vendas: value.vendas, bonus: value.bonus }));
      
      // Calculate real bonus origin from payments data
      const totalBonusFromSeries = salesSeries.reduce((sum, s) => sum + s.bonus, 0);
      const totalSales = salesSeries.reduce((sum, s) => sum + s.vendas, 0);
      const totalPayments = totalPago;
      
      const bonusOrigin = [
        { name: "Vendas Diretas", value: directBonus > 0 ? Math.round((directBonus / (directBonus + networkBonus)) * 100) : 70 },
        { name: "Rede", value: networkBonus > 0 ? Math.round((networkBonus / (directBonus + networkBonus)) * 100) : 30 },
      ];
      
      // Calculate real top products from orders
      const productSales = new Map<string, number>();
      orders.forEach((order: any) => {
        if (order.items && Array.isArray(order.items)) {
          order.items.forEach((item: any) => {
            const productName = item.name || item.product_name || "Produto Desconhecido";
            const qty = Number(item.quantity || item.qtd || 1);
            productSales.set(productName, (productSales.get(productName) || 0) + qty);
          });
        }
      });
      
      const topProducts = Array.from(productSales.entries())
        .map(([name, qtd]) => {
          const product = products.find((p: any) => p.name === name);
          const price = Number(product?.price || 0);
          return { name, qtd, receita: price * qtd };
        })
        .sort((a, b) => b.qtd - a.qtd)
        .slice(0, 5);
      const timeline = [
        ...orders.slice(0, 3).map((o: any) => ({ id: `o-${o.id}`, title: "Pedido registrado", description: `Pedido ${o.numero_pedido || o.id} carregado do Supabase.`, at: o.created_at, type: "order" })),
        ...payments.slice(0, 3).map((p: any) => ({ id: `p-${p.id}`, title: "Pagamento recebido", description: `Pagamento de R$${Number(p.amount || 0).toLocaleString("pt-BR")} processado.`, at: p.created_at, type: "payment" })),
      ];

      return { stats, salesSeries, bonusOrigin, topProducts, timeline, orders, payments, customers, products, withdrawals, customerBonus, customerPlan };
    },
  });
}
