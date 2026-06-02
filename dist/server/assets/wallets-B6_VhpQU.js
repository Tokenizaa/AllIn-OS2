import { jsxs, jsx } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { P as PageHeader } from "./page-header-BiG0inxH.js";
import { K as KpiCard } from "./kpi-card-DWxdq3sg.js";
import { B as Button, a as Badge, i as SupabaseService } from "./router-C3cuB5ui.js";
import { Wallet, Gift, Star, ArrowUpRight, ArrowDownLeft, CreditCard, History, RefreshCw, Download, Search, Eye, ShieldAlert } from "lucide-react";
import { T as Tabs, a as TabsList, b as TabsTrigger, c as TabsContent } from "./tabs-BmI8ndQo.js";
import { C as Card, b as CardHeader, c as CardTitle, a as CardContent, d as CardDescription } from "./card-Cp4xOC4k.js";
import { I as Input } from "./input-CnOu4Y2I.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem, T as Table, e as TableHeader, f as TableRow, g as TableHead, h as TableBody, i as TableCell } from "./select-CSEXN4CB.js";
import "@tanstack/react-query";
import "@tanstack/react-router";
import "./supabase-client-BdpvIS_G.js";
import "@supabase/supabase-js";
import "./roles-DEW722fr.js";
import "framer-motion";
import "sonner";
import "class-variance-authority";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-slot";
import "@radix-ui/react-tabs";
import "@radix-ui/react-select";
function WalletDashboard() {
  const [walletData] = useState({
    balance: 1250.5,
    currency: "BRL",
    bonusBalance: 150,
    points: 2500,
    recentTransactions: [
      { id: "1", type: "credit", amount: 500, description: "Payment received", date: "2024-01-15" },
      { id: "2", type: "debit", amount: 150, description: "Purchase at Store A", date: "2024-01-14" },
      { id: "3", type: "credit", amount: 100, description: "Bonus earned", date: "2024-01-13" },
      { id: "4", type: "debit", amount: 75.5, description: "Purchase at Store B", date: "2024-01-12" }
    ]
  });
  const handleAddFunds = () => {
  };
  const handleWithdraw = () => {
  };
  const handleTransfer = () => {
  };
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("h2", { className: "text-3xl font-bold tracking-tight", children: "Wallet Dashboard" }),
      /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: "Manage your wallets and view transaction history" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid gap-4 md:grid-cols-3", children: [
      /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [
          /* @__PURE__ */ jsx(CardTitle, { className: "text-sm font-medium", children: "Main Balance" }),
          /* @__PURE__ */ jsx(Wallet, { className: "h-4 w-4 text-muted-foreground" })
        ] }),
        /* @__PURE__ */ jsxs(CardContent, { children: [
          /* @__PURE__ */ jsxs("div", { className: "text-2xl font-bold", children: [
            walletData.currency,
            " ",
            walletData.balance.toFixed(2)
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Available for use" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [
          /* @__PURE__ */ jsx(CardTitle, { className: "text-sm font-medium", children: "Bonus Balance" }),
          /* @__PURE__ */ jsx(Gift, { className: "h-4 w-4 text-muted-foreground" })
        ] }),
        /* @__PURE__ */ jsxs(CardContent, { children: [
          /* @__PURE__ */ jsxs("div", { className: "text-2xl font-bold", children: [
            walletData.currency,
            " ",
            walletData.bonusBalance.toFixed(2)
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Promotional credits" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [
          /* @__PURE__ */ jsx(CardTitle, { className: "text-sm font-medium", children: "Points" }),
          /* @__PURE__ */ jsx(Star, { className: "h-4 w-4 text-muted-foreground" })
        ] }),
        /* @__PURE__ */ jsxs(CardContent, { children: [
          /* @__PURE__ */ jsx("div", { className: "text-2xl font-bold", children: walletData.points.toLocaleString() }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Redeemable for rewards" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
      /* @__PURE__ */ jsxs(Button, { onClick: handleAddFunds, children: [
        /* @__PURE__ */ jsx(ArrowUpRight, { className: "mr-2 h-4 w-4" }),
        "Add Funds"
      ] }),
      /* @__PURE__ */ jsxs(Button, { variant: "outline", onClick: handleWithdraw, children: [
        /* @__PURE__ */ jsx(ArrowDownLeft, { className: "mr-2 h-4 w-4" }),
        "Withdraw"
      ] }),
      /* @__PURE__ */ jsxs(Button, { variant: "outline", onClick: handleTransfer, children: [
        /* @__PURE__ */ jsx(CreditCard, { className: "mr-2 h-4 w-4" }),
        "Transfer"
      ] })
    ] }),
    /* @__PURE__ */ jsxs(Tabs, { defaultValue: "transactions", className: "space-y-4", children: [
      /* @__PURE__ */ jsxs(TabsList, { children: [
        /* @__PURE__ */ jsxs(TabsTrigger, { value: "transactions", children: [
          /* @__PURE__ */ jsx(History, { className: "mr-2 h-4 w-4" }),
          "Transactions"
        ] }),
        /* @__PURE__ */ jsxs(TabsTrigger, { value: "bonus", children: [
          /* @__PURE__ */ jsx(Gift, { className: "mr-2 h-4 w-4" }),
          "Bonus Wallet"
        ] }),
        /* @__PURE__ */ jsxs(TabsTrigger, { value: "points", children: [
          /* @__PURE__ */ jsx(Star, { className: "mr-2 h-4 w-4" }),
          "Points"
        ] })
      ] }),
      /* @__PURE__ */ jsx(TabsContent, { value: "transactions", className: "space-y-4", children: /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsxs(CardHeader, { children: [
          /* @__PURE__ */ jsx(CardTitle, { children: "Recent Transactions" }),
          /* @__PURE__ */ jsx(CardDescription, { children: "Your latest wallet activity" })
        ] }),
        /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsx("div", { className: "space-y-4", children: walletData.recentTransactions.map((transaction) => /* @__PURE__ */ jsxs(
          "div",
          {
            className: "flex items-center justify-between p-4 border rounded-lg",
            children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
                /* @__PURE__ */ jsx(
                  "div",
                  {
                    className: `p-2 rounded-full ${transaction.type === "credit" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`,
                    children: transaction.type === "credit" ? /* @__PURE__ */ jsx(ArrowUpRight, { className: "h-4 w-4" }) : /* @__PURE__ */ jsx(ArrowDownLeft, { className: "h-4 w-4" })
                  }
                ),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("p", { className: "font-medium", children: transaction.description }),
                  /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: transaction.date })
                ] })
              ] }),
              /* @__PURE__ */ jsxs(
                "div",
                {
                  className: `font-semibold ${transaction.type === "credit" ? "text-green-600" : "text-red-600"}`,
                  children: [
                    transaction.type === "credit" ? "+" : "-",
                    walletData.currency,
                    " ",
                    transaction.amount.toFixed(2)
                  ]
                }
              )
            ]
          },
          transaction.id
        )) }) })
      ] }) }),
      /* @__PURE__ */ jsx(TabsContent, { value: "bonus", className: "space-y-4", children: /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsxs(CardHeader, { children: [
          /* @__PURE__ */ jsx(CardTitle, { children: "Bonus Wallet" }),
          /* @__PURE__ */ jsx(CardDescription, { children: "Manage your promotional credits" })
        ] }),
        /* @__PURE__ */ jsxs(CardContent, { className: "space-y-4", children: [
          /* @__PURE__ */ jsx("div", { className: "p-4 bg-yellow-50 border border-yellow-200 rounded-lg", children: /* @__PURE__ */ jsxs("p", { className: "text-sm text-yellow-800", children: [
            /* @__PURE__ */ jsx("strong", { children: "Bonus credits:" }),
            " Can be used for purchases but cannot be withdrawn. Expires after 90 days of inactivity."
          ] }) }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-sm", children: [
              /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: "Available Bonus" }),
              /* @__PURE__ */ jsxs("span", { className: "font-semibold", children: [
                walletData.currency,
                " ",
                walletData.bonusBalance.toFixed(2)
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-sm", children: [
              /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: "Total Earned" }),
              /* @__PURE__ */ jsxs("span", { className: "font-semibold", children: [
                walletData.currency,
                " ",
                (walletData.bonusBalance * 2).toFixed(2)
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-sm", children: [
              /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: "Total Used" }),
              /* @__PURE__ */ jsxs("span", { className: "font-semibold", children: [
                walletData.currency,
                " ",
                walletData.bonusBalance.toFixed(2)
              ] })
            ] })
          ] })
        ] })
      ] }) }),
      /* @__PURE__ */ jsx(TabsContent, { value: "points", className: "space-y-4", children: /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsxs(CardHeader, { children: [
          /* @__PURE__ */ jsx(CardTitle, { children: "Points Wallet" }),
          /* @__PURE__ */ jsx(CardDescription, { children: "Earn and redeem loyalty points" })
        ] }),
        /* @__PURE__ */ jsxs(CardContent, { className: "space-y-4", children: [
          /* @__PURE__ */ jsx("div", { className: "p-4 bg-purple-50 border border-purple-200 rounded-lg", children: /* @__PURE__ */ jsxs("p", { className: "text-sm text-purple-800", children: [
            /* @__PURE__ */ jsx("strong", { children: "Loyalty Points:" }),
            " Earn 1 point for every ",
            walletData.currency,
            " 10 spent. 100 points = ",
            walletData.currency,
            " 5 discount."
          ] }) }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-sm", children: [
              /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: "Available Points" }),
              /* @__PURE__ */ jsx("span", { className: "font-semibold", children: walletData.points.toLocaleString() })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-sm", children: [
              /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: "Points Value" }),
              /* @__PURE__ */ jsxs("span", { className: "font-semibold", children: [
                walletData.currency,
                " ",
                (walletData.points / 20).toFixed(2)
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-sm", children: [
              /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: "Tier Status" }),
              /* @__PURE__ */ jsx("span", { className: "font-semibold text-purple-600", children: "Gold Member" })
            ] })
          ] }),
          /* @__PURE__ */ jsx(Button, { variant: "outline", className: "w-full", children: "Redeem Points" })
        ] })
      ] }) })
    ] })
  ] });
}
function PaymentHistory() {
  const [payments] = useState([
    {
      id: "pay_001",
      amount: 150,
      currency: "BRL",
      status: "approved",
      paymentMethod: "card",
      createdAt: "2024-01-15T10:30:00Z",
      orderId: "ord_123",
      customerName: "John Doe"
    },
    {
      id: "pay_002",
      amount: 75.5,
      currency: "BRL",
      status: "pending",
      paymentMethod: "pix",
      createdAt: "2024-01-14T14:20:00Z",
      orderId: "ord_124",
      customerName: "Jane Smith"
    },
    {
      id: "pay_003",
      amount: 200,
      currency: "BRL",
      status: "rejected",
      paymentMethod: "card",
      createdAt: "2024-01-13T09:15:00Z",
      orderId: "ord_125",
      customerName: "Bob Johnson"
    },
    {
      id: "pay_004",
      amount: 50,
      currency: "BRL",
      status: "refunded",
      paymentMethod: "boleto",
      createdAt: "2024-01-12T16:45:00Z",
      orderId: "ord_126",
      customerName: "Alice Williams"
    },
    {
      id: "pay_005",
      amount: 300,
      currency: "BRL",
      status: "approved",
      paymentMethod: "cash",
      createdAt: "2024-01-11T11:00:00Z",
      orderId: "ord_127",
      customerName: "Charlie Brown"
    }
  ]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [methodFilter, setMethodFilter] = useState("all");
  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "refunded":
        return "bg-blue-100 text-blue-800";
      case "cancelled":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  const getPaymentMethodIcon = (method) => {
    switch (method) {
      case "card":
        return "💳";
      case "pix":
        return "📱";
      case "boleto":
        return "📄";
      case "cash":
        return "💵";
      default:
        return "❓";
    }
  };
  const filteredPayments = payments.filter((payment) => {
    const matchesSearch = payment.id.toLowerCase().includes(searchTerm.toLowerCase()) || payment.customerName.toLowerCase().includes(searchTerm.toLowerCase()) || payment.orderId && payment.orderId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || payment.status === statusFilter;
    const matchesMethod = methodFilter === "all" || payment.paymentMethod === methodFilter;
    return matchesSearch && matchesStatus && matchesMethod;
  });
  const handleViewDetails = (_paymentId) => {
  };
  const handleExport = () => {
  };
  const handleRefresh = () => {
  };
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h2", { className: "text-3xl font-bold tracking-tight", children: "Payment History" }),
        /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: "View and manage all payment transactions" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsxs(Button, { variant: "outline", onClick: handleRefresh, children: [
          /* @__PURE__ */ jsx(RefreshCw, { className: "mr-2 h-4 w-4" }),
          "Refresh"
        ] }),
        /* @__PURE__ */ jsxs(Button, { variant: "outline", onClick: handleExport, children: [
          /* @__PURE__ */ jsx(Download, { className: "mr-2 h-4 w-4" }),
          "Export"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs(Card, { children: [
      /* @__PURE__ */ jsxs(CardHeader, { children: [
        /* @__PURE__ */ jsx(CardTitle, { children: "Filter Payments" }),
        /* @__PURE__ */ jsx(CardDescription, { children: "Search and filter payment transactions" })
      ] }),
      /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsxs("div", { className: "flex gap-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex-1 relative", children: [
          /* @__PURE__ */ jsx(Search, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" }),
          /* @__PURE__ */ jsx(
            Input,
            {
              placeholder: "Search by ID, customer name, or order ID...",
              value: searchTerm,
              onChange: (e) => setSearchTerm(e.target.value),
              className: "pl-10"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs(Select, { value: statusFilter, onValueChange: setStatusFilter, children: [
          /* @__PURE__ */ jsx(SelectTrigger, { className: "w-[180px]", children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Status" }) }),
          /* @__PURE__ */ jsxs(SelectContent, { children: [
            /* @__PURE__ */ jsx(SelectItem, { value: "all", children: "All Statuses" }),
            /* @__PURE__ */ jsx(SelectItem, { value: "approved", children: "Approved" }),
            /* @__PURE__ */ jsx(SelectItem, { value: "pending", children: "Pending" }),
            /* @__PURE__ */ jsx(SelectItem, { value: "rejected", children: "Rejected" }),
            /* @__PURE__ */ jsx(SelectItem, { value: "refunded", children: "Refunded" }),
            /* @__PURE__ */ jsx(SelectItem, { value: "cancelled", children: "Cancelled" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs(Select, { value: methodFilter, onValueChange: setMethodFilter, children: [
          /* @__PURE__ */ jsx(SelectTrigger, { className: "w-[180px]", children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Method" }) }),
          /* @__PURE__ */ jsxs(SelectContent, { children: [
            /* @__PURE__ */ jsx(SelectItem, { value: "all", children: "All Methods" }),
            /* @__PURE__ */ jsx(SelectItem, { value: "card", children: "Card" }),
            /* @__PURE__ */ jsx(SelectItem, { value: "pix", children: "PIX" }),
            /* @__PURE__ */ jsx(SelectItem, { value: "boleto", children: "Boleto" }),
            /* @__PURE__ */ jsx(SelectItem, { value: "cash", children: "Cash" })
          ] })
        ] })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxs(Card, { children: [
      /* @__PURE__ */ jsxs(CardHeader, { children: [
        /* @__PURE__ */ jsx(CardTitle, { children: "Transactions" }),
        /* @__PURE__ */ jsxs(CardDescription, { children: [
          "Showing ",
          filteredPayments.length,
          " of ",
          payments.length,
          " payments"
        ] })
      ] }),
      /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsxs(Table, { children: [
        /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
          /* @__PURE__ */ jsx(TableHead, { children: "Payment ID" }),
          /* @__PURE__ */ jsx(TableHead, { children: "Customer" }),
          /* @__PURE__ */ jsx(TableHead, { children: "Amount" }),
          /* @__PURE__ */ jsx(TableHead, { children: "Method" }),
          /* @__PURE__ */ jsx(TableHead, { children: "Status" }),
          /* @__PURE__ */ jsx(TableHead, { children: "Date" }),
          /* @__PURE__ */ jsx(TableHead, { children: "Order ID" }),
          /* @__PURE__ */ jsx(TableHead, { className: "text-right", children: "Actions" })
        ] }) }),
        /* @__PURE__ */ jsxs(TableBody, { children: [
          filteredPayments.map((payment) => /* @__PURE__ */ jsxs(TableRow, { children: [
            /* @__PURE__ */ jsx(TableCell, { className: "font-mono text-sm", children: payment.id }),
            /* @__PURE__ */ jsx(TableCell, { children: payment.customerName }),
            /* @__PURE__ */ jsxs(TableCell, { className: "font-semibold", children: [
              payment.currency,
              " ",
              payment.amount.toFixed(2)
            ] }),
            /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx("span", { className: "text-xl", children: getPaymentMethodIcon(payment.paymentMethod) }) }),
            /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(Badge, { className: getStatusColor(payment.status), children: payment.status }) }),
            /* @__PURE__ */ jsx(TableCell, { children: new Date(payment.createdAt).toLocaleDateString() }),
            /* @__PURE__ */ jsx(TableCell, { className: "font-mono text-sm", children: payment.orderId || "-" }),
            /* @__PURE__ */ jsx(TableCell, { className: "text-right", children: /* @__PURE__ */ jsx(
              Button,
              {
                variant: "ghost",
                size: "sm",
                onClick: () => handleViewDetails(payment.id),
                children: /* @__PURE__ */ jsx(Eye, { className: "h-4 w-4" })
              }
            ) })
          ] }, payment.id)),
          filteredPayments.length === 0 && /* @__PURE__ */ jsx(TableRow, { children: /* @__PURE__ */ jsx(TableCell, { colSpan: 8, className: "text-center py-8 text-muted-foreground", children: "No payments found matching your filters" }) })
        ] })
      ] }) })
    ] })
  ] });
}
function WalletsPage() {
  const [saques, setSaques] = useState([]);
  const [summary, setSummary] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    anomalies: 0
  });
  useEffect(() => {
    (async () => {
      const withdrawalsData = await SupabaseService.fetchWithdrawals();
      const transformedWithdrawals = withdrawalsData.map((w) => ({
        id: w.id,
        user: w.user_name,
        valor: Number(w.valor || 0),
        metodo: w.metodo,
        status: w.status,
        risco: w.risco
      }));
      setSaques(transformedWithdrawals);
      setSummary({
        total: transformedWithdrawals.reduce((sum, w) => sum + Number(w.valor || 0), 0),
        pending: transformedWithdrawals.filter((w) => w.status === "pendente").length,
        approved: transformedWithdrawals.filter((w) => w.status === "aprovado").length,
        anomalies: transformedWithdrawals.filter((w) => w.risco).length
      });
    })();
  }, []);
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsx(PageHeader, { eyebrow: "Financeiro", title: "Carteiras & Saques", subtitle: "Operações financeiras com dados reais do Supabase.", actions: /* @__PURE__ */ jsx(Button, { size: "sm", children: "Aprovar em massa" }) }),
    /* @__PURE__ */ jsxs(Tabs, { defaultValue: "saques", className: "space-y-4", children: [
      /* @__PURE__ */ jsxs(TabsList, { children: [
        /* @__PURE__ */ jsx(TabsTrigger, { value: "saques", children: "Saques" }),
        /* @__PURE__ */ jsx(TabsTrigger, { value: "dashboard", children: "Dashboard" }),
        /* @__PURE__ */ jsx(TabsTrigger, { value: "historico", children: "Histórico de Pagamentos" })
      ] }),
      /* @__PURE__ */ jsxs(TabsContent, { value: "saques", className: "space-y-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-3", children: [
          /* @__PURE__ */ jsx(KpiCard, { label: "Saldo total carteiras", value: `R$ ${summary.total.toLocaleString("pt-BR", {
            minimumFractionDigits: 2
          })}`, accent: "primary" }),
          /* @__PURE__ */ jsx(KpiCard, { label: "Saques pendentes", value: String(summary.pending), accent: "warning" }),
          /* @__PURE__ */ jsx(KpiCard, { label: "Saques aprovados", value: String(summary.approved) }),
          /* @__PURE__ */ jsx(KpiCard, { label: "Anomalias detectadas", value: String(summary.anomalies), accent: "destructive" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-warning/30 bg-warning/5 p-3 flex items-center gap-3", children: [
          /* @__PURE__ */ jsx(ShieldAlert, { className: "h-4 w-4 text-warning" }),
          /* @__PURE__ */ jsxs("p", { className: "text-sm flex-1", children: [
            /* @__PURE__ */ jsxs("span", { className: "font-medium", children: [
              summary.anomalies,
              " saques"
            ] }),
            " marcados com risco."
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "rounded-xl border border-border bg-card/40 overflow-hidden", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-sm", children: [
          /* @__PURE__ */ jsx("thead", { className: "bg-background/40 text-[11px] uppercase tracking-wider text-muted-foreground", children: /* @__PURE__ */ jsxs("tr", { children: [
            /* @__PURE__ */ jsx("th", { className: "px-4 py-2.5 text-left", children: "Distribuidor" }),
            /* @__PURE__ */ jsx("th", { className: "px-4 py-2.5 text-right", children: "Valor" }),
            /* @__PURE__ */ jsx("th", { className: "px-4 py-2.5 text-left", children: "Método" }),
            /* @__PURE__ */ jsx("th", { className: "px-4 py-2.5 text-left", children: "Status" }),
            /* @__PURE__ */ jsx("th", { className: "px-4 py-2.5 text-left", children: "IA" })
          ] }) }),
          /* @__PURE__ */ jsx("tbody", { className: "divide-y divide-border/60", children: saques.map((s) => /* @__PURE__ */ jsxs("tr", { className: "hover:bg-accent/30", children: [
            /* @__PURE__ */ jsx("td", { className: "px-4 py-3", children: s.user }),
            /* @__PURE__ */ jsxs("td", { className: "px-4 py-3 text-right tabular-nums font-medium", children: [
              "R$ ",
              s.valor.toLocaleString("pt-BR", {
                minimumFractionDigits: 2
              })
            ] }),
            /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-xs text-muted-foreground", children: s.metodo }),
            /* @__PURE__ */ jsx("td", { className: "px-4 py-3 capitalize", children: s.status }),
            /* @__PURE__ */ jsx("td", { className: "px-4 py-3", children: s.risco && /* @__PURE__ */ jsx("span", { className: "text-xs text-destructive", children: "⚠ anomalia" }) })
          ] }, s.id)) })
        ] }) })
      ] }),
      /* @__PURE__ */ jsx(TabsContent, { value: "dashboard", children: /* @__PURE__ */ jsx(WalletDashboard, {}) }),
      /* @__PURE__ */ jsx(TabsContent, { value: "historico", children: /* @__PURE__ */ jsx(PaymentHistory, {}) })
    ] })
  ] });
}
export {
  WalletsPage as component
};
