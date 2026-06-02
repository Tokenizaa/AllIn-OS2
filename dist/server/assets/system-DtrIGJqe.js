import { jsxs, jsx } from "react/jsx-runtime";
import { c as cn, B as Button, a as Badge, b as useAuth } from "./router-OVqp2Aj1.js";
import { P as PageHeader } from "./page-header-DZhedIL1.js";
import * as React from "react";
import { useState } from "react";
import { C as Card, b as CardHeader, c as CardTitle, d as CardDescription, a as CardContent } from "./card-DLLoBO9R.js";
import { I as Input } from "./input-DlRe9qBQ.js";
import { S as Switch, L as Label } from "./switch-DGE6TjK1.js";
import { T as Tabs, a as TabsList, b as TabsTrigger, c as TabsContent } from "./tabs-vlCUvq5M.js";
import { T as Table, e as TableHeader, f as TableRow, g as TableHead, h as TableBody, i as TableCell, S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-C8IWmyPQ.js";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { Plus, Gift, Users, Percent, Edit, Trash2, RefreshCw, Download, DollarSign, TrendingUp, CreditCard, Wallet, TrendingDown, AlertTriangle, Calendar, Star, Settings, Key, CheckCircle2, XCircle, Check, Copy, Search, Mail, Layers, Send, Info, Shield, Clock, Filter, UserX, ArrowUpDown, Fingerprint, Ban, UserCheck, ChevronLeft, ChevronRight } from "lucide-react";
import { D as Dialog, e as DialogTrigger, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogDescription, f as DialogFooter } from "./dialog-BgRseQ54.js";
import { g as getRoleLabel, a as getRoleBadgeStyle } from "./rbac-utils-CjftAXfU.js";
import { toast } from "sonner";
import "@tanstack/react-query";
import "@tanstack/react-router";
import "./supabase-client-BdpvIS_G.js";
import "@supabase/supabase-js";
import "./roles-DEW722fr.js";
import "framer-motion";
import "class-variance-authority";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-slot";
import "@radix-ui/react-label";
import "@radix-ui/react-switch";
import "@radix-ui/react-tabs";
import "@radix-ui/react-select";
import "@radix-ui/react-dialog";
const Slider = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxs(
  SliderPrimitive.Root,
  {
    ref,
    className: cn("relative flex w-full touch-none select-none items-center", className),
    ...props,
    children: [
      /* @__PURE__ */ jsx(SliderPrimitive.Track, { className: "relative h-1.5 w-full grow overflow-hidden rounded-full bg-primary/20", children: /* @__PURE__ */ jsx(SliderPrimitive.Range, { className: "absolute h-full bg-primary" }) }),
      /* @__PURE__ */ jsx(SliderPrimitive.Thumb, { className: "block h-4 w-4 rounded-full border border-primary/50 bg-background shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50" })
    ]
  }
));
Slider.displayName = SliderPrimitive.Root.displayName;
function BonusConfiguration() {
  const [bonusRules] = useState([
    {
      id: "bonus_001",
      name: "Welcome Bonus",
      type: "percentage",
      value: 10,
      maxBonus: 50,
      minPurchaseAmount: 100,
      customerTiers: ["new"],
      startDate: "2024-01-01",
      endDate: "2024-12-31",
      isActive: true,
      usageCount: 150,
      maxUsage: 1e3
    },
    {
      id: "bonus_002",
      name: "VIP Bonus",
      type: "percentage",
      value: 15,
      maxBonus: 100,
      minPurchaseAmount: 200,
      customerTiers: ["vip", "premium"],
      startDate: "2024-01-01",
      endDate: "2024-12-31",
      isActive: true,
      usageCount: 75,
      maxUsage: 500
    },
    {
      id: "bonus_003",
      name: "Weekend Special",
      type: "fixed",
      value: 20,
      minPurchaseAmount: 50,
      customerTiers: ["all"],
      startDate: "2024-01-01",
      endDate: "2024-12-31",
      isActive: false,
      usageCount: 200
    }
  ]);
  const [selectedRule, setSelectedRule] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const handleToggleActive = (ruleId) => {
  };
  const handleEdit = (rule) => {
    setSelectedRule(rule);
    setIsEditing(true);
  };
  const handleDelete = (ruleId) => {
  };
  const handleAddRule = () => {
    setSelectedRule(null);
    setIsEditing(true);
  };
  const handleSave = (config) => {
    setIsEditing(false);
    setSelectedRule(null);
  };
  const handleCancel = () => {
    setIsEditing(false);
    setSelectedRule(null);
  };
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h2", { className: "text-3xl font-bold tracking-tight", children: "Bonus Configuration" }),
        /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: "Configure bonus and promotional credit rules" })
      ] }),
      /* @__PURE__ */ jsxs(Button, { onClick: handleAddRule, children: [
        /* @__PURE__ */ jsx(Plus, { className: "mr-2 h-4 w-4" }),
        "Add Bonus Rule"
      ] })
    ] }),
    /* @__PURE__ */ jsxs(Tabs, { defaultValue: "rules", className: "space-y-4", children: [
      /* @__PURE__ */ jsxs(TabsList, { children: [
        /* @__PURE__ */ jsxs(TabsTrigger, { value: "rules", children: [
          /* @__PURE__ */ jsx(Gift, { className: "mr-2 h-4 w-4" }),
          "Bonus Rules"
        ] }),
        /* @__PURE__ */ jsxs(TabsTrigger, { value: "tiers", children: [
          /* @__PURE__ */ jsx(Users, { className: "mr-2 h-4 w-4" }),
          "Customer Tiers"
        ] }),
        /* @__PURE__ */ jsxs(TabsTrigger, { value: "settings", children: [
          /* @__PURE__ */ jsx(Percent, { className: "mr-2 h-4 w-4" }),
          "General Settings"
        ] })
      ] }),
      /* @__PURE__ */ jsxs(TabsContent, { value: "rules", className: "space-y-4", children: [
        /* @__PURE__ */ jsxs(Card, { children: [
          /* @__PURE__ */ jsxs(CardHeader, { children: [
            /* @__PURE__ */ jsx(CardTitle, { children: "Active Bonus Rules" }),
            /* @__PURE__ */ jsx(CardDescription, { children: "Manage promotional credit and bonus configurations" })
          ] }),
          /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsxs(Table, { children: [
            /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
              /* @__PURE__ */ jsx(TableHead, { children: "Name" }),
              /* @__PURE__ */ jsx(TableHead, { children: "Type" }),
              /* @__PURE__ */ jsx(TableHead, { children: "Value" }),
              /* @__PURE__ */ jsx(TableHead, { children: "Status" }),
              /* @__PURE__ */ jsx(TableHead, { children: "Tiers" }),
              /* @__PURE__ */ jsx(TableHead, { children: "Usage" }),
              /* @__PURE__ */ jsx(TableHead, { children: "Valid Until" }),
              /* @__PURE__ */ jsx(TableHead, { className: "text-right", children: "Actions" })
            ] }) }),
            /* @__PURE__ */ jsx(TableBody, { children: bonusRules.map((rule) => /* @__PURE__ */ jsxs(TableRow, { children: [
              /* @__PURE__ */ jsx(TableCell, { className: "font-semibold", children: rule.name }),
              /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(Badge, { variant: "outline", children: rule.type }) }),
              /* @__PURE__ */ jsx(TableCell, { children: rule.type === "percentage" ? `${rule.value}%` : `R$ ${rule.value}` }),
              /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsx(
                  Switch,
                  {
                    checked: rule.isActive,
                    onCheckedChange: () => handleToggleActive(rule.id)
                  }
                ),
                rule.isActive ? /* @__PURE__ */ jsx(Badge, { variant: "default", children: "Active" }) : /* @__PURE__ */ jsx(Badge, { variant: "secondary", children: "Inactive" })
              ] }) }),
              /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx("div", { className: "flex gap-1 flex-wrap", children: rule.customerTiers.map((tier) => /* @__PURE__ */ jsx(Badge, { variant: "outline", className: "text-xs", children: tier }, tier)) }) }),
              /* @__PURE__ */ jsxs(TableCell, { children: [
                rule.usageCount,
                rule.maxUsage && ` / ${rule.maxUsage}`
              ] }),
              /* @__PURE__ */ jsx(TableCell, { children: new Date(rule.endDate).toLocaleDateString() }),
              /* @__PURE__ */ jsx(TableCell, { className: "text-right", children: /* @__PURE__ */ jsxs("div", { className: "flex justify-end gap-2", children: [
                /* @__PURE__ */ jsx(
                  Button,
                  {
                    variant: "ghost",
                    size: "sm",
                    onClick: () => handleEdit(rule),
                    children: /* @__PURE__ */ jsx(Edit, { className: "h-4 w-4" })
                  }
                ),
                /* @__PURE__ */ jsx(
                  Button,
                  {
                    variant: "ghost",
                    size: "sm",
                    onClick: () => handleDelete(rule.id),
                    children: /* @__PURE__ */ jsx(Trash2, { className: "h-4 w-4" })
                  }
                )
              ] }) })
            ] }, rule.id)) })
          ] }) })
        ] }),
        isEditing && /* @__PURE__ */ jsxs(Card, { children: [
          /* @__PURE__ */ jsxs(CardHeader, { children: [
            /* @__PURE__ */ jsx(CardTitle, { children: selectedRule ? "Edit Bonus Rule" : "Add New Bonus Rule" }),
            /* @__PURE__ */ jsx(CardDescription, { children: selectedRule ? "Update bonus configuration" : "Create a new bonus rule" })
          ] }),
          /* @__PURE__ */ jsxs(CardContent, { className: "space-y-4", children: [
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
              /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsx(Label, { htmlFor: "bonus-name", children: "Rule Name" }),
                /* @__PURE__ */ jsx(
                  Input,
                  {
                    id: "bonus-name",
                    defaultValue: selectedRule?.name,
                    placeholder: "e.g., Welcome Bonus"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsx(Label, { htmlFor: "bonus-type", children: "Bonus Type" }),
                /* @__PURE__ */ jsxs(Select, { defaultValue: selectedRule?.type, children: [
                  /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Select type" }) }),
                  /* @__PURE__ */ jsxs(SelectContent, { children: [
                    /* @__PURE__ */ jsx(SelectItem, { value: "percentage", children: "Percentage" }),
                    /* @__PURE__ */ jsx(SelectItem, { value: "fixed", children: "Fixed Amount" }),
                    /* @__PURE__ */ jsx(SelectItem, { value: "tiered", children: "Tiered" })
                  ] })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
              /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsx(Label, { htmlFor: "bonus-value", children: "Bonus Value" }),
                /* @__PURE__ */ jsx(
                  Input,
                  {
                    id: "bonus-value",
                    type: "number",
                    defaultValue: selectedRule?.value,
                    placeholder: "10"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsx(Label, { htmlFor: "max-bonus", children: "Maximum Bonus (optional)" }),
                /* @__PURE__ */ jsx(
                  Input,
                  {
                    id: "max-bonus",
                    type: "number",
                    defaultValue: selectedRule?.maxBonus,
                    placeholder: "50"
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsx(Label, { htmlFor: "min-purchase", children: "Minimum Purchase Amount" }),
              /* @__PURE__ */ jsx(
                Input,
                {
                  id: "min-purchase",
                  type: "number",
                  defaultValue: selectedRule?.minPurchaseAmount,
                  placeholder: "100"
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsx(Label, { children: "Customer Tiers" }),
              /* @__PURE__ */ jsx("div", { className: "flex gap-2 flex-wrap", children: ["new", "standard", "vip", "premium", "all"].map((tier) => /* @__PURE__ */ jsx(Badge, { variant: "outline", className: "cursor-pointer", children: tier }, tier)) })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
              /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsx(Label, { htmlFor: "start-date", children: "Start Date" }),
                /* @__PURE__ */ jsx(
                  Input,
                  {
                    id: "start-date",
                    type: "date",
                    defaultValue: selectedRule?.startDate
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsx(Label, { htmlFor: "end-date", children: "End Date" }),
                /* @__PURE__ */ jsx(
                  Input,
                  {
                    id: "end-date",
                    type: "date",
                    defaultValue: selectedRule?.endDate
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsx(Label, { htmlFor: "max-usage", children: "Maximum Usage (optional)" }),
              /* @__PURE__ */ jsx(
                Input,
                {
                  id: "max-usage",
                  type: "number",
                  defaultValue: selectedRule?.maxUsage,
                  placeholder: "1000"
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex justify-end gap-2", children: [
              /* @__PURE__ */ jsx(Button, { variant: "outline", onClick: handleCancel, children: "Cancel" }),
              /* @__PURE__ */ jsx(Button, { onClick: () => handleSave(), children: "Save Rule" })
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsx(TabsContent, { value: "tiers", className: "space-y-4", children: /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsxs(CardHeader, { children: [
          /* @__PURE__ */ jsx(CardTitle, { children: "Customer Tiers" }),
          /* @__PURE__ */ jsx(CardDescription, { children: "Configure customer loyalty tiers and benefits" })
        ] }),
        /* @__PURE__ */ jsx(CardContent, { className: "space-y-4", children: [
          { name: "New", bonus: "10%", minSpend: 0 },
          { name: "Standard", bonus: "5%", minSpend: 500 },
          { name: "VIP", bonus: "15%", minSpend: 2e3 },
          { name: "Premium", bonus: "20%", minSpend: 5e3 }
        ].map((tier) => /* @__PURE__ */ jsxs("div", { className: "p-4 border rounded-lg space-y-3", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-start", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsxs("h4", { className: "font-semibold", children: [
                tier.name,
                " Tier"
              ] }),
              /* @__PURE__ */ jsxs("p", { className: "text-sm text-muted-foreground", children: [
                "Bonus: ",
                tier.bonus,
                " | Min Spend: R$ ",
                tier.minSpend
              ] })
            ] }),
            /* @__PURE__ */ jsx(Badge, { variant: "outline", children: "Active" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsx(Label, { children: "Bonus Percentage" }),
            /* @__PURE__ */ jsx(
              Slider,
              {
                defaultValue: [parseInt(tier.bonus)],
                max: 30,
                step: 1,
                className: "w-full"
              }
            )
          ] })
        ] }, tier.name)) })
      ] }) }),
      /* @__PURE__ */ jsx(TabsContent, { value: "settings", className: "space-y-4", children: /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsxs(CardHeader, { children: [
          /* @__PURE__ */ jsx(CardTitle, { children: "General Bonus Settings" }),
          /* @__PURE__ */ jsx(CardDescription, { children: "Configure global bonus system settings" })
        ] }),
        /* @__PURE__ */ jsxs(CardContent, { className: "space-y-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between p-4 border rounded-lg", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("h4", { className: "font-semibold", children: "Auto-apply Bonuses" }),
              /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Automatically apply eligible bonuses at checkout" })
            ] }),
            /* @__PURE__ */ jsx(Switch, { defaultChecked: true })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between p-4 border rounded-lg", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("h4", { className: "font-semibold", children: "Bonus Stacking" }),
              /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Allow multiple bonuses to be combined" })
            ] }),
            /* @__PURE__ */ jsx(Switch, {})
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between p-4 border rounded-lg", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("h4", { className: "font-semibold", children: "Bonus Expiry Notification" }),
              /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Notify customers before bonuses expire" })
            ] }),
            /* @__PURE__ */ jsx(Switch, { defaultChecked: true })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsx(Label, { htmlFor: "expiry-days", children: "Bonus Expiry Days" }),
            /* @__PURE__ */ jsx(
              Input,
              {
                id: "expiry-days",
                type: "number",
                defaultValue: 90,
                placeholder: "90"
              }
            )
          ] })
        ] })
      ] }) })
    ] })
  ] });
}
function FinancialDashboard() {
  const [dateRange, setDateRange] = useState("30d");
  const [stats] = useState({
    totalRevenue: 125000.5,
    totalPayments: 842,
    successRate: 94.5,
    averageOrderValue: 148.45,
    refunds: 3200,
    chargebacks: 850,
    pendingAmount: 12500,
    currency: "BRL"
  });
  const [gatewayStats] = useState([
    {
      name: "Belluno",
      totalTransactions: 520,
      successRate: 96.2,
      totalVolume: 75e3,
      fees: 2250
    },
    {
      name: "PagSeguro",
      totalTransactions: 322,
      successRate: 91.8,
      totalVolume: 50000.5,
      fees: 1750
    }
  ]);
  const [recentTransactions] = useState([
    {
      id: "pay_001",
      amount: 150,
      status: "approved",
      method: "card",
      date: "2024-01-15T10:30:00Z",
      customer: "John Doe"
    },
    {
      id: "pay_002",
      amount: 75.5,
      status: "pending",
      method: "pix",
      date: "2024-01-15T09:20:00Z",
      customer: "Jane Smith"
    },
    {
      id: "pay_003",
      amount: 200,
      status: "refunded",
      method: "card",
      date: "2024-01-14T16:45:00Z",
      customer: "Bob Johnson"
    }
  ]);
  const handleExport = () => {
  };
  const handleRefresh = () => {
  };
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
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h2", { className: "text-3xl font-bold tracking-tight", children: "Financial Dashboard" }),
        /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: "Overview of payment performance and financial metrics" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsxs(Select, { value: dateRange, onValueChange: setDateRange, children: [
          /* @__PURE__ */ jsx(SelectTrigger, { className: "w-[180px]", children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Date range" }) }),
          /* @__PURE__ */ jsxs(SelectContent, { children: [
            /* @__PURE__ */ jsx(SelectItem, { value: "7d", children: "Last 7 days" }),
            /* @__PURE__ */ jsx(SelectItem, { value: "30d", children: "Last 30 days" }),
            /* @__PURE__ */ jsx(SelectItem, { value: "90d", children: "Last 90 days" }),
            /* @__PURE__ */ jsx(SelectItem, { value: "1y", children: "Last year" })
          ] })
        ] }),
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
    /* @__PURE__ */ jsxs("div", { className: "grid gap-4 md:grid-cols-2 lg:grid-cols-4", children: [
      /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [
          /* @__PURE__ */ jsx(CardTitle, { className: "text-sm font-medium", children: "Total Revenue" }),
          /* @__PURE__ */ jsx(DollarSign, { className: "h-4 w-4 text-muted-foreground" })
        ] }),
        /* @__PURE__ */ jsxs(CardContent, { children: [
          /* @__PURE__ */ jsxs("div", { className: "text-2xl font-bold", children: [
            stats.currency,
            " ",
            stats.totalRevenue.toLocaleString()
          ] }),
          /* @__PURE__ */ jsxs("p", { className: "text-xs text-muted-foreground flex items-center", children: [
            /* @__PURE__ */ jsx(TrendingUp, { className: "h-3 w-3 mr-1 text-green-600" }),
            "+12.5% from last period"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [
          /* @__PURE__ */ jsx(CardTitle, { className: "text-sm font-medium", children: "Total Payments" }),
          /* @__PURE__ */ jsx(CreditCard, { className: "h-4 w-4 text-muted-foreground" })
        ] }),
        /* @__PURE__ */ jsxs(CardContent, { children: [
          /* @__PURE__ */ jsx("div", { className: "text-2xl font-bold", children: stats.totalPayments }),
          /* @__PURE__ */ jsxs("p", { className: "text-xs text-muted-foreground flex items-center", children: [
            /* @__PURE__ */ jsx(TrendingUp, { className: "h-3 w-3 mr-1 text-green-600" }),
            "+8.2% from last period"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [
          /* @__PURE__ */ jsx(CardTitle, { className: "text-sm font-medium", children: "Success Rate" }),
          /* @__PURE__ */ jsx(TrendingUp, { className: "h-4 w-4 text-muted-foreground" })
        ] }),
        /* @__PURE__ */ jsxs(CardContent, { children: [
          /* @__PURE__ */ jsxs("div", { className: "text-2xl font-bold", children: [
            stats.successRate,
            "%"
          ] }),
          /* @__PURE__ */ jsxs("p", { className: "text-xs text-muted-foreground flex items-center", children: [
            /* @__PURE__ */ jsx(TrendingUp, { className: "h-3 w-3 mr-1 text-green-600" }),
            "+2.1% from last period"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [
          /* @__PURE__ */ jsx(CardTitle, { className: "text-sm font-medium", children: "Avg Order Value" }),
          /* @__PURE__ */ jsx(Wallet, { className: "h-4 w-4 text-muted-foreground" })
        ] }),
        /* @__PURE__ */ jsxs(CardContent, { children: [
          /* @__PURE__ */ jsxs("div", { className: "text-2xl font-bold", children: [
            stats.currency,
            " ",
            stats.averageOrderValue.toFixed(2)
          ] }),
          /* @__PURE__ */ jsxs("p", { className: "text-xs text-muted-foreground flex items-center", children: [
            /* @__PURE__ */ jsx(TrendingDown, { className: "h-3 w-3 mr-1 text-red-600" }),
            "-3.4% from last period"
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid gap-4 md:grid-cols-3", children: [
      /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [
          /* @__PURE__ */ jsx(CardTitle, { className: "text-sm font-medium", children: "Refunds" }),
          /* @__PURE__ */ jsx(TrendingDown, { className: "h-4 w-4 text-muted-foreground" })
        ] }),
        /* @__PURE__ */ jsxs(CardContent, { children: [
          /* @__PURE__ */ jsxs("div", { className: "text-2xl font-bold text-red-600", children: [
            stats.currency,
            " ",
            stats.refunds.toLocaleString()
          ] }),
          /* @__PURE__ */ jsxs("p", { className: "text-xs text-muted-foreground", children: [
            (stats.refunds / stats.totalRevenue * 100).toFixed(1),
            "% of revenue"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [
          /* @__PURE__ */ jsx(CardTitle, { className: "text-sm font-medium", children: "Chargebacks" }),
          /* @__PURE__ */ jsx(AlertTriangle, { className: "h-4 w-4 text-muted-foreground" })
        ] }),
        /* @__PURE__ */ jsxs(CardContent, { children: [
          /* @__PURE__ */ jsxs("div", { className: "text-2xl font-bold text-orange-600", children: [
            stats.currency,
            " ",
            stats.chargebacks.toLocaleString()
          ] }),
          /* @__PURE__ */ jsxs("p", { className: "text-xs text-muted-foreground", children: [
            (stats.chargebacks / stats.totalRevenue * 100).toFixed(2),
            "% of revenue"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [
          /* @__PURE__ */ jsx(CardTitle, { className: "text-sm font-medium", children: "Pending" }),
          /* @__PURE__ */ jsx(Calendar, { className: "h-4 w-4 text-muted-foreground" })
        ] }),
        /* @__PURE__ */ jsxs(CardContent, { children: [
          /* @__PURE__ */ jsxs("div", { className: "text-2xl font-bold text-yellow-600", children: [
            stats.currency,
            " ",
            stats.pendingAmount.toLocaleString()
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Awaiting confirmation" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs(Tabs, { defaultValue: "gateways", className: "space-y-4", children: [
      /* @__PURE__ */ jsxs(TabsList, { children: [
        /* @__PURE__ */ jsxs(TabsTrigger, { value: "gateways", children: [
          /* @__PURE__ */ jsx(CreditCard, { className: "mr-2 h-4 w-4" }),
          "Gateway Performance"
        ] }),
        /* @__PURE__ */ jsxs(TabsTrigger, { value: "transactions", children: [
          /* @__PURE__ */ jsx(Wallet, { className: "mr-2 h-4 w-4" }),
          "Recent Transactions"
        ] }),
        /* @__PURE__ */ jsxs(TabsTrigger, { value: "wallets", children: [
          /* @__PURE__ */ jsx(Gift, { className: "mr-2 h-4 w-4" }),
          "Wallet Activity"
        ] })
      ] }),
      /* @__PURE__ */ jsx(TabsContent, { value: "gateways", className: "space-y-4", children: /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsxs(CardHeader, { children: [
          /* @__PURE__ */ jsx(CardTitle, { children: "Gateway Performance" }),
          /* @__PURE__ */ jsx(CardDescription, { children: "Transaction volume and success rates by gateway" })
        ] }),
        /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsxs(Table, { children: [
          /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
            /* @__PURE__ */ jsx(TableHead, { children: "Gateway" }),
            /* @__PURE__ */ jsx(TableHead, { children: "Transactions" }),
            /* @__PURE__ */ jsx(TableHead, { children: "Success Rate" }),
            /* @__PURE__ */ jsx(TableHead, { children: "Total Volume" }),
            /* @__PURE__ */ jsx(TableHead, { children: "Fees" }),
            /* @__PURE__ */ jsx(TableHead, { children: "Net Revenue" })
          ] }) }),
          /* @__PURE__ */ jsx(TableBody, { children: gatewayStats.map((gateway) => /* @__PURE__ */ jsxs(TableRow, { children: [
            /* @__PURE__ */ jsx(TableCell, { className: "font-semibold", children: gateway.name }),
            /* @__PURE__ */ jsx(TableCell, { children: gateway.totalTransactions }),
            /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsxs(Badge, { variant: gateway.successRate > 95 ? "default" : "secondary", children: [
              gateway.successRate,
              "%"
            ] }) }),
            /* @__PURE__ */ jsxs(TableCell, { children: [
              stats.currency,
              " ",
              gateway.totalVolume.toLocaleString()
            ] }),
            /* @__PURE__ */ jsxs(TableCell, { className: "text-red-600", children: [
              "-",
              stats.currency,
              " ",
              gateway.fees.toLocaleString()
            ] }),
            /* @__PURE__ */ jsxs(TableCell, { className: "font-semibold text-green-600", children: [
              stats.currency,
              " ",
              (gateway.totalVolume - gateway.fees).toLocaleString()
            ] })
          ] }, gateway.name)) })
        ] }) })
      ] }) }),
      /* @__PURE__ */ jsx(TabsContent, { value: "transactions", className: "space-y-4", children: /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsxs(CardHeader, { children: [
          /* @__PURE__ */ jsx(CardTitle, { children: "Recent Transactions" }),
          /* @__PURE__ */ jsx(CardDescription, { children: "Latest payment activity across all gateways" })
        ] }),
        /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsxs(Table, { children: [
          /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
            /* @__PURE__ */ jsx(TableHead, { children: "Transaction ID" }),
            /* @__PURE__ */ jsx(TableHead, { children: "Customer" }),
            /* @__PURE__ */ jsx(TableHead, { children: "Amount" }),
            /* @__PURE__ */ jsx(TableHead, { children: "Method" }),
            /* @__PURE__ */ jsx(TableHead, { children: "Status" }),
            /* @__PURE__ */ jsx(TableHead, { children: "Date" })
          ] }) }),
          /* @__PURE__ */ jsx(TableBody, { children: recentTransactions.map((transaction) => /* @__PURE__ */ jsxs(TableRow, { children: [
            /* @__PURE__ */ jsx(TableCell, { className: "font-mono text-sm", children: transaction.id }),
            /* @__PURE__ */ jsx(TableCell, { children: transaction.customer }),
            /* @__PURE__ */ jsxs(TableCell, { className: "font-semibold", children: [
              stats.currency,
              " ",
              transaction.amount.toFixed(2)
            ] }),
            /* @__PURE__ */ jsx(TableCell, { children: transaction.method }),
            /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(Badge, { className: getStatusColor(transaction.status), children: transaction.status }) }),
            /* @__PURE__ */ jsx(TableCell, { children: new Date(transaction.date).toLocaleDateString() })
          ] }, transaction.id)) })
        ] }) })
      ] }) }),
      /* @__PURE__ */ jsx(TabsContent, { value: "wallets", className: "space-y-4", children: /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsxs(CardHeader, { children: [
          /* @__PURE__ */ jsx(CardTitle, { children: "Wallet Activity" }),
          /* @__PURE__ */ jsx(CardDescription, { children: "Overview of wallet balances and transactions" })
        ] }),
        /* @__PURE__ */ jsx(CardContent, { className: "space-y-4", children: /* @__PURE__ */ jsxs("div", { className: "grid gap-4 md:grid-cols-3", children: [
          /* @__PURE__ */ jsxs("div", { className: "p-4 border rounded-lg", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-2", children: [
              /* @__PURE__ */ jsx("h4", { className: "font-semibold", children: "Main Wallet" }),
              /* @__PURE__ */ jsx(Wallet, { className: "h-4 w-4 text-muted-foreground" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "text-2xl font-bold", children: [
              stats.currency,
              " 45,250.00"
            ] }),
            /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Total balance" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "p-4 border rounded-lg", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-2", children: [
              /* @__PURE__ */ jsx("h4", { className: "font-semibold", children: "Bonus Wallet" }),
              /* @__PURE__ */ jsx(Gift, { className: "h-4 w-4 text-muted-foreground" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "text-2xl font-bold", children: [
              stats.currency,
              " 8,500.00"
            ] }),
            /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Promotional credits" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "p-4 border rounded-lg", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-2", children: [
              /* @__PURE__ */ jsx("h4", { className: "font-semibold", children: "Points Wallet" }),
              /* @__PURE__ */ jsx(Star, { className: "h-4 w-4 text-muted-foreground" })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "text-2xl font-bold", children: "125,000 pts" }),
            /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Loyalty points" })
          ] })
        ] }) })
      ] }) })
    ] })
  ] });
}
function GatewayManagement() {
  const [gateways] = useState([
    {
      id: "gw_001",
      name: "Belluno Production",
      type: "belluno",
      isActive: true,
      priority: 1,
      apiKey: "bell_live_****************",
      webhookSecret: "whsec_****************",
      supportedMethods: ["card", "pix", "boleto"],
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-15T10:30:00Z"
    },
    {
      id: "gw_002",
      name: "PagSeguro Sandbox",
      type: "pagseguro",
      isActive: false,
      priority: 2,
      apiKey: "pagseg_sandbox_****************",
      webhookSecret: "whsec_****************",
      supportedMethods: ["card", "boleto"],
      createdAt: "2024-01-05T00:00:00Z",
      updatedAt: "2024-01-10T14:20:00Z"
    }
  ]);
  const [selectedGateway, setSelectedGateway] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const handleToggleActive = (gatewayId) => {
  };
  const handleEdit = (gateway) => {
    setSelectedGateway(gateway);
    setIsEditing(true);
  };
  const handleDelete = (gatewayId) => {
  };
  const handleAddGateway = () => {
    setSelectedGateway(null);
    setIsEditing(true);
  };
  const handleSave = (config) => {
    setIsEditing(false);
    setSelectedGateway(null);
  };
  const handleCancel = () => {
    setIsEditing(false);
    setSelectedGateway(null);
  };
  const handleTestConnection = (gatewayId) => {
  };
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h2", { className: "text-3xl font-bold tracking-tight", children: "Gateway Management" }),
        /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: "Configure and manage payment gateway integrations" })
      ] }),
      /* @__PURE__ */ jsxs(Button, { onClick: handleAddGateway, children: [
        /* @__PURE__ */ jsx(Plus, { className: "mr-2 h-4 w-4" }),
        "Add Gateway"
      ] })
    ] }),
    /* @__PURE__ */ jsxs(Tabs, { defaultValue: "list", className: "space-y-4", children: [
      /* @__PURE__ */ jsxs(TabsList, { children: [
        /* @__PURE__ */ jsxs(TabsTrigger, { value: "list", children: [
          /* @__PURE__ */ jsx(Settings, { className: "mr-2 h-4 w-4" }),
          "Gateway List"
        ] }),
        /* @__PURE__ */ jsxs(TabsTrigger, { value: "webhooks", children: [
          /* @__PURE__ */ jsx(Key, { className: "mr-2 h-4 w-4" }),
          "Webhook Configuration"
        ] })
      ] }),
      /* @__PURE__ */ jsxs(TabsContent, { value: "list", className: "space-y-4", children: [
        /* @__PURE__ */ jsxs(Card, { children: [
          /* @__PURE__ */ jsxs(CardHeader, { children: [
            /* @__PURE__ */ jsx(CardTitle, { children: "Active Gateways" }),
            /* @__PURE__ */ jsx(CardDescription, { children: "Manage your payment gateway configurations" })
          ] }),
          /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsxs(Table, { children: [
            /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
              /* @__PURE__ */ jsx(TableHead, { children: "Name" }),
              /* @__PURE__ */ jsx(TableHead, { children: "Type" }),
              /* @__PURE__ */ jsx(TableHead, { children: "Status" }),
              /* @__PURE__ */ jsx(TableHead, { children: "Priority" }),
              /* @__PURE__ */ jsx(TableHead, { children: "Methods" }),
              /* @__PURE__ */ jsx(TableHead, { children: "Last Updated" }),
              /* @__PURE__ */ jsx(TableHead, { className: "text-right", children: "Actions" })
            ] }) }),
            /* @__PURE__ */ jsx(TableBody, { children: gateways.map((gateway) => /* @__PURE__ */ jsxs(TableRow, { children: [
              /* @__PURE__ */ jsx(TableCell, { className: "font-semibold", children: gateway.name }),
              /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(Badge, { variant: "outline", children: gateway.type }) }),
              /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsx(
                  Switch,
                  {
                    checked: gateway.isActive,
                    onCheckedChange: () => handleToggleActive(gateway.id)
                  }
                ),
                gateway.isActive ? /* @__PURE__ */ jsx(CheckCircle2, { className: "h-4 w-4 text-green-600" }) : /* @__PURE__ */ jsx(XCircle, { className: "h-4 w-4 text-gray-400" })
              ] }) }),
              /* @__PURE__ */ jsx(TableCell, { children: gateway.priority }),
              /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx("div", { className: "flex gap-1 flex-wrap", children: gateway.supportedMethods.map((method) => /* @__PURE__ */ jsx(Badge, { variant: "secondary", className: "text-xs", children: method }, method)) }) }),
              /* @__PURE__ */ jsx(TableCell, { children: new Date(gateway.updatedAt).toLocaleDateString() }),
              /* @__PURE__ */ jsx(TableCell, { className: "text-right", children: /* @__PURE__ */ jsxs("div", { className: "flex justify-end gap-2", children: [
                /* @__PURE__ */ jsx(
                  Button,
                  {
                    variant: "ghost",
                    size: "sm",
                    onClick: () => handleTestConnection(gateway.id),
                    children: "Test"
                  }
                ),
                /* @__PURE__ */ jsx(
                  Button,
                  {
                    variant: "ghost",
                    size: "sm",
                    onClick: () => handleEdit(gateway),
                    children: /* @__PURE__ */ jsx(Edit, { className: "h-4 w-4" })
                  }
                ),
                /* @__PURE__ */ jsx(
                  Button,
                  {
                    variant: "ghost",
                    size: "sm",
                    onClick: () => handleDelete(gateway.id),
                    children: /* @__PURE__ */ jsx(Trash2, { className: "h-4 w-4" })
                  }
                )
              ] }) })
            ] }, gateway.id)) })
          ] }) })
        ] }),
        isEditing && /* @__PURE__ */ jsxs(Card, { children: [
          /* @__PURE__ */ jsxs(CardHeader, { children: [
            /* @__PURE__ */ jsx(CardTitle, { children: selectedGateway ? "Edit Gateway" : "Add New Gateway" }),
            /* @__PURE__ */ jsx(CardDescription, { children: selectedGateway ? "Update gateway configuration" : "Configure a new payment gateway" })
          ] }),
          /* @__PURE__ */ jsxs(CardContent, { className: "space-y-4", children: [
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
              /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsx(Label, { htmlFor: "gateway-name", children: "Gateway Name" }),
                /* @__PURE__ */ jsx(
                  Input,
                  {
                    id: "gateway-name",
                    defaultValue: selectedGateway?.name,
                    placeholder: "e.g., Belluno Production"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsx(Label, { htmlFor: "gateway-type", children: "Gateway Type" }),
                /* @__PURE__ */ jsxs(
                  "select",
                  {
                    id: "gateway-type",
                    className: "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm",
                    defaultValue: selectedGateway?.type,
                    children: [
                      /* @__PURE__ */ jsx("option", { value: "belluno", children: "Belluno" }),
                      /* @__PURE__ */ jsx("option", { value: "pagseguro", children: "PagSeguro" }),
                      /* @__PURE__ */ jsx("option", { value: "stripe", children: "Stripe" }),
                      /* @__PURE__ */ jsx("option", { value: "mercadopago", children: "Mercado Pago" })
                    ]
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsx(Label, { htmlFor: "api-key", children: "API Key" }),
              /* @__PURE__ */ jsx(
                Input,
                {
                  id: "api-key",
                  type: "password",
                  defaultValue: selectedGateway?.apiKey,
                  placeholder: "Enter API key"
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsx(Label, { htmlFor: "webhook-secret", children: "Webhook Secret" }),
              /* @__PURE__ */ jsx(
                Input,
                {
                  id: "webhook-secret",
                  type: "password",
                  defaultValue: selectedGateway?.webhookSecret,
                  placeholder: "Enter webhook secret"
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsx(Label, { htmlFor: "priority", children: "Priority" }),
              /* @__PURE__ */ jsx(
                Input,
                {
                  id: "priority",
                  type: "number",
                  defaultValue: selectedGateway?.priority || 1,
                  placeholder: "1 (highest) to 10 (lowest)"
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex justify-end gap-2", children: [
              /* @__PURE__ */ jsx(Button, { variant: "outline", onClick: handleCancel, children: "Cancel" }),
              /* @__PURE__ */ jsx(Button, { onClick: () => handleSave(), children: "Save Configuration" })
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsx(TabsContent, { value: "webhooks", className: "space-y-4", children: /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsxs(CardHeader, { children: [
          /* @__PURE__ */ jsx(CardTitle, { children: "Webhook Endpoints" }),
          /* @__PURE__ */ jsx(CardDescription, { children: "Configure webhook URLs for each gateway" })
        ] }),
        /* @__PURE__ */ jsx(CardContent, { className: "space-y-4", children: gateways.map((gateway) => /* @__PURE__ */ jsxs("div", { className: "p-4 border rounded-lg space-y-3", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-start", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("h4", { className: "font-semibold", children: gateway.name }),
              /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: gateway.type })
            ] }),
            /* @__PURE__ */ jsx(Badge, { variant: gateway.isActive ? "default" : "secondary", children: gateway.isActive ? "Active" : "Inactive" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsx(Label, { htmlFor: `webhook-url-${gateway.id}`, children: "Webhook URL" }),
            /* @__PURE__ */ jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsx(
                Input,
                {
                  id: `webhook-url-${gateway.id}`,
                  value: typeof window !== "undefined" ? `${window.location.origin}/api/payments/webhook/${gateway.id}` : `https://api.allinlife.com.br/api/payments/webhook/${gateway.id}`,
                  readOnly: true,
                  className: "pr-10 font-mono text-xs"
                }
              ),
              /* @__PURE__ */ jsx(
                Button,
                {
                  type: "button",
                  size: "icon",
                  variant: "ghost",
                  id: `copy-webhook-url-${gateway.id}`,
                  className: "absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent hover:text-foreground text-muted-foreground",
                  onClick: () => {
                    const url = typeof window !== "undefined" ? `${window.location.origin}/api/payments/webhook/${gateway.id}` : `https://api.allinlife.com.br/api/payments/webhook/${gateway.id}`;
                    navigator.clipboard.writeText(url);
                    setCopiedId(gateway.id);
                    setTimeout(() => setCopiedId(null), 2e3);
                  },
                  children: copiedId === gateway.id ? /* @__PURE__ */ jsx(Check, { className: "h-4 w-4 text-emerald-500" }) : /* @__PURE__ */ jsx(Copy, { className: "h-4 w-4" })
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsx(Label, { htmlFor: `webhook-events-${gateway.id}`, children: "Events" }),
            /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2", children: ["payment.created", "payment.approved", "payment.rejected", "payment.refunded"].map((event) => /* @__PURE__ */ jsx(Badge, { variant: "outline", className: "cursor-pointer", children: event }, event)) })
          ] })
        ] }, gateway.id)) })
      ] }) })
    ] })
  ] });
}
const PERMISSION_OPTIONS = [
  { id: "dashboard", label: "Dashboard Executivo", desc: "Leitura de KPIs e estatísticas rápidas." },
  { id: "analytics", label: "Relatórios & Analytics", desc: "Análise avançada e projeções MLM." },
  { id: "finance", label: "Painel Financeiro", desc: "Visualizar e movimentar carteiras." },
  { id: "support", label: "Suporte e Documentos", desc: "Central de tickets e compliance de KYC." },
  { id: "orders", label: "Faturamento de Pedidos", desc: "Expedição de mercadorias e status de compras." },
  { id: "products", label: "Gestão do Catálogo", desc: "Preços, itens e planos cadastrados." },
  { id: "marketing", label: "Campanhas Corporativas", desc: "Notificações push, cupons e banners." },
  { id: "system", label: "Auditoria & Logs", desc: "Monitoramento detalhado e segurança de rede." }
];
function InvitesManagement() {
  const {
    adminInvites,
    createAdminInvite,
    revokeAdminInvite,
    resendAdminInvite
  } = useAuth();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [openInviteModal, setOpenInviteModal] = useState(false);
  const [copiedToken, setCopiedToken] = useState(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [selectedRole, setSelectedRole] = useState("gestão_admin");
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [notes, setNotes] = useState("");
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);
  const handleTogglePermission = (permId) => {
    setSelectedPermissions(
      (prev) => prev.includes(permId) ? prev.filter((id) => id !== permId) : [...prev, permId]
    );
  };
  const handleCreateInvite = async (e) => {
    e.preventDefault();
    if (!fullName || !email) {
      toast.error("Por favor, preencha o Nome Completo e o E-mail.");
      return;
    }
    if (!email.includes("@")) {
      toast.error("Insira um endereço de e-mail corporativo válido.");
      return;
    }
    setIsSubmitLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      const newInv = await createAdminInvite({
        full_name: fullName,
        email,
        role: selectedRole,
        permissions: selectedPermissions,
        notes
      });
      toast.success(
        `Convite administrativo criado e enviado com sucesso para ${email}!`
      );
      try {
        await navigator.clipboard.writeText(newInv.invite_link);
        toast.info("Link do convite copiado automaticamente na Área de Trabalho!");
      } catch {
      }
      setFullName("");
      setEmail("");
      setSelectedRole("gestão_admin");
      setSelectedPermissions([]);
      setNotes("");
      setOpenInviteModal(false);
    } catch {
      toast.error("Não foi possível gerar a credencial.");
    } finally {
      setIsSubmitLoading(false);
    }
  };
  const handleCopyLink = async (inviteLink, token) => {
    try {
      await navigator.clipboard.writeText(inviteLink);
      setCopiedToken(token);
      toast.success("Link do convite copiado!");
      setTimeout(() => setCopiedToken(null), 1500);
    } catch {
      toast.error("Erro ao copiar para a área de transferência.");
    }
  };
  const handleRevokeInvite = async (inviteId) => {
    try {
      await revokeAdminInvite(inviteId);
      toast.success("Convite revogado com sucesso. Token cancelado e inutilizável.");
    } catch {
      toast.error("Não foi possível cancelar o enlace.");
    }
  };
  const handleResendInvite = async (inviteId) => {
    try {
      await resendAdminInvite(inviteId);
      toast.success("Convite renovado com sucesso! Novo token gerado e estendido por mais 48h.");
    } catch {
      toast.error("Erro ao reemitir credencial temporária.");
    }
  };
  const filteredInvites = adminInvites.filter((inv) => {
    const matchesSearch = inv.full_name.toLowerCase().includes(search.toLowerCase()) || inv.email.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || inv.status === statusFilter;
    return matchesSearch && matchesStatus;
  });
  return /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col md:flex-row gap-3 items-center justify-between", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxs("div", { className: "relative w-full md:w-80", children: [
          /* @__PURE__ */ jsx(Search, { className: "absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" }),
          /* @__PURE__ */ jsx(
            Input,
            {
              placeholder: "Pesquisar por nome do convidado...",
              className: "pl-9 bg-background/50",
              value: search,
              onChange: (e) => setSearch(e.target.value)
            }
          )
        ] }),
        /* @__PURE__ */ jsxs(Select, { value: statusFilter, onValueChange: setStatusFilter, children: [
          /* @__PURE__ */ jsx(SelectTrigger, { className: "w-36 bg-card/60 border-border text-xs h-9", children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Filtrar Status" }) }),
          /* @__PURE__ */ jsxs(SelectContent, { children: [
            /* @__PURE__ */ jsx(SelectItem, { value: "all font-sans", children: "Todos os Enlaces" }),
            /* @__PURE__ */ jsx(SelectItem, { value: "pending", children: "Pendente (Ativo)" }),
            /* @__PURE__ */ jsx(SelectItem, { value: "accepted", children: "Aceito / Ativado" }),
            /* @__PURE__ */ jsx(SelectItem, { value: "expired", children: "Expirado" }),
            /* @__PURE__ */ jsx(SelectItem, { value: "revoked", children: "Revogado" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs(Dialog, { open: openInviteModal, onOpenChange: setOpenInviteModal, children: [
        /* @__PURE__ */ jsx(DialogTrigger, { asChild: true, children: /* @__PURE__ */ jsxs(Button, { className: "w-full md:w-auto bg-gradient-to-r from-primary to-fuchsia-600 hover:from-primary/95 hover:to-fuchsia-600/95 font-medium rounded-lg text-xs tracking-wide", children: [
          /* @__PURE__ */ jsx(Plus, { className: "h-4 w-4 mr-1 shrink-0" }),
          "Novo Convite Admin"
        ] }) }),
        /* @__PURE__ */ jsxs(DialogContent, { className: "max-w-xl bg-[#090d16] border border-border shadow-2xl p-6 overflow-y-auto max-h-[90vh]", children: [
          /* @__PURE__ */ jsxs(DialogHeader, { children: [
            /* @__PURE__ */ jsxs(DialogTitle, { className: "text-lg font-bold text-white flex items-center gap-1.5", children: [
              /* @__PURE__ */ jsx(Mail, { className: "h-5 w-5 text-primary" }),
              "Criar Enlace de Convite Corporativo"
            ] }),
            /* @__PURE__ */ jsx(DialogDescription, { className: "text-xs text-muted-foreground", children: "Crie um cadastro temporário seguro com privilégios de controle da empresa. O destinatário receberá um e-mail securitizado para configurar sua própria senha de login." })
          ] }),
          /* @__PURE__ */ jsxs("form", { onSubmit: handleCreateInvite, className: "space-y-4 py-3", children: [
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-3.5", children: [
              /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsx("label", { className: "text-xs font-semibold text-muted-foreground", children: "Nome Completo do Convidado *" }),
                /* @__PURE__ */ jsx(
                  Input,
                  {
                    placeholder: "Ex: Gabriel Oliver",
                    className: "bg-background/40",
                    value: fullName,
                    onChange: (e) => setFullName(e.target.value),
                    required: true
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsx("label", { className: "text-xs font-semibold text-muted-foreground", children: "E-mail Corporativo *" }),
                /* @__PURE__ */ jsx(
                  Input,
                  {
                    type: "email",
                    placeholder: "gabriel@allin.io",
                    className: "bg-background/40",
                    value: email,
                    onChange: (e) => setEmail(e.target.value),
                    required: true
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 gap-1.5", children: [
              /* @__PURE__ */ jsx("label", { className: "text-xs font-semibold text-muted-foreground", children: "Cargo com Políticas de Permissão Padrão (RBAC) *" }),
              /* @__PURE__ */ jsxs(Select, { value: selectedRole, onValueChange: (val) => {
                setSelectedRole(val);
                const defaults = {
                  gestão_admin: ["dashboard", "analytics", "support", "orders", "products"],
                  financeiro: ["dashboard", "analytics", "finance", "orders"],
                  suporte: ["dashboard", "support", "orders"],
                  logística: ["dashboard", "orders", "products"],
                  marketing: ["dashboard", "marketing", "products"],
                  analytics: ["dashboard", "analytics"],
                  auditor: ["dashboard", "analytics", "finance", "system"],
                  operador: ["dashboard", "orders"]
                };
                setSelectedPermissions(defaults[val] || []);
              }, children: [
                /* @__PURE__ */ jsx(SelectTrigger, { className: "bg-background/40 border-border", children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Selecione o cargo estratégico" }) }),
                /* @__PURE__ */ jsxs(SelectContent, { children: [
                  /* @__PURE__ */ jsx(SelectItem, { value: "gestão_admin", children: "Gestão Admin (Acesso amplo de equipe, produtos e pedidos)" }),
                  /* @__PURE__ */ jsx(SelectItem, { value: "financeiro", children: "Financeiro (Gerenciador de saques e liquidações de bônus)" }),
                  /* @__PURE__ */ jsx(SelectItem, { value: "suporte", children: "Suporte Técnico (Tratamento de chamados e aprovação de KYC)" }),
                  /* @__PURE__ */ jsx(SelectItem, { value: "logística", children: "Logística (Faturamento e despacho operacional de compras)" }),
                  /* @__PURE__ */ jsx(SelectItem, { value: "marketing", children: "Marketing (Organização de banners e campanhas MLM)" }),
                  /* @__PURE__ */ jsx(SelectItem, { value: "analytics", children: "Analytics (Leitor de faturamento, rede e conexões)" }),
                  /* @__PURE__ */ jsx(SelectItem, { value: "auditor", children: "Auditor Estrito (Leitor em tempo real imutável de logs e caixas)" }),
                  /* @__PURE__ */ jsx(SelectItem, { value: "operador", children: "Operador de Staff (Organizador de expedição e tickets básicos)" })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-2 rounded-lg border border-border bg-black/30 p-3", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1", children: [
                /* @__PURE__ */ jsx(Layers, { className: "h-3.5 w-3.5 text-primary" }),
                /* @__PURE__ */ jsx("span", { className: "text-xs font-bold text-white", children: "Módulos Adicionais Concedidos" })
              ] }),
              /* @__PURE__ */ jsx("p", { className: "text-[10px] text-muted-foreground leading-snug", children: "Personalize acessos à parte das regras padrão herdadas pela role administrativa." }),
              /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 gap-2 mt-2 pt-1.5 border-t border-border/40", children: PERMISSION_OPTIONS.map((opt) => {
                const checked = selectedPermissions.includes(opt.id);
                return /* @__PURE__ */ jsxs(
                  "div",
                  {
                    onClick: () => handleTogglePermission(opt.id),
                    className: `flex items-start gap-2 p-1.5 rounded-md border cursor-pointer select-none transition-colors ${checked ? "bg-primary/5 border-primary/40 text-white" : "border-slate-800/60 hover:border-slate-700/80 text-muted-foreground/90"}`,
                    children: [
                      /* @__PURE__ */ jsx("div", { className: `h-3.5 w-3.5 rounded mt-0.5 border flex items-center justify-center shrink-0 ${checked ? "border-primary bg-primary text-primary-foreground" : "border-slate-700"}`, children: checked && /* @__PURE__ */ jsx(Check, { className: "h-2.5 w-2.5 stroke-[3]" }) }),
                      /* @__PURE__ */ jsxs("div", { className: "flex flex-col min-w-0 leading-tight", children: [
                        /* @__PURE__ */ jsx("span", { className: "text-[11px] font-semibold", children: opt.label }),
                        /* @__PURE__ */ jsx("span", { className: "text-[9px] opacity-70 truncate", children: opt.desc })
                      ] })
                    ]
                  },
                  opt.id
                );
              }) })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsx("label", { className: "text-xs font-semibold text-muted-foreground", children: "Observações Internas (Opcional)" }),
              /* @__PURE__ */ jsx(
                "textarea",
                {
                  placeholder: "Instruções internas ou escopo da contração...",
                  className: "w-full h-16 rounded-md bg-background/40 border border-border p-2 text-xs focus:ring-1 focus:ring-primary outline-none",
                  value: notes,
                  onChange: (e) => setNotes(e.target.value)
                }
              )
            ] }),
            /* @__PURE__ */ jsxs(DialogFooter, { className: "pt-2 items-center flex gap-2", children: [
              /* @__PURE__ */ jsx(
                Button,
                {
                  type: "button",
                  variant: "outline",
                  onClick: () => setOpenInviteModal(false),
                  className: "rounded-lg h-9 text-xs",
                  children: "Cancelar"
                }
              ),
              /* @__PURE__ */ jsx(
                Button,
                {
                  type: "submit",
                  disabled: isSubmitLoading,
                  className: "bg-primary hover:bg-primary/95 text-xs h-9 font-medium tracking-wide rounded-lg shrink-0",
                  children: isSubmitLoading ? /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1.5", children: [
                    /* @__PURE__ */ jsx(RefreshCw, { className: "h-3.5 w-3.5 animate-spin" }),
                    "Emitindo Credencial..."
                  ] }) : /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1", children: [
                    /* @__PURE__ */ jsx(Send, { className: "h-3 w-3 mr-1" }),
                    "Registrar & Salvar Convite"
                  ] })
                }
              )
            ] })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-border bg-card/40 overflow-hidden", children: [
      /* @__PURE__ */ jsxs("div", { className: "px-4 py-3 bg-card/60 border-b border-border flex items-center gap-1.5", children: [
        /* @__PURE__ */ jsx(Mail, { className: "h-4 w-4 text-primary" }),
        /* @__PURE__ */ jsxs("h3", { className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground", children: [
          "Enlaces Digitais de Admissão (",
          filteredInvites.length,
          ")"
        ] })
      ] }),
      filteredInvites.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center py-12 text-center", children: [
        /* @__PURE__ */ jsx(Mail, { className: "h-10 w-10 text-muted-foreground/30 mb-2.5" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-muted-foreground", children: "Nenhum convite listado." }),
        /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground/60", children: "Tente ajustar seus termos de busca ou crie um novo convite administrativo utilizando as diretrizes acima." })
      ] }) : /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-sm", children: [
        /* @__PURE__ */ jsx("thead", { className: "bg-[#0b0f19]/80 border-b border-border/80 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider", children: /* @__PURE__ */ jsxs("tr", { children: [
          /* @__PURE__ */ jsx("th", { className: "px-4 py-3 text-left", children: "Convidado" }),
          /* @__PURE__ */ jsx("th", { className: "px-4 py-3 text-left", children: "Nível / Role Proposta" }),
          /* @__PURE__ */ jsx("th", { className: "px-4 py-3 text-left", children: "Audit Emitente" }),
          /* @__PURE__ */ jsx("th", { className: "px-4 py-3 text-left", children: "Validade Link (48h)" }),
          /* @__PURE__ */ jsx("th", { className: "px-4 py-3 text-left", children: "Status Evento" }),
          /* @__PURE__ */ jsx("th", { className: "px-4 py-3 text-right", children: "Controles Enterprise" })
        ] }) }),
        /* @__PURE__ */ jsx("tbody", { className: "divide-y divide-border/40", children: filteredInvites.map((inv) => /* @__PURE__ */ jsxs("tr", { className: "hover:bg-accent/20 transition-colors", children: [
          /* @__PURE__ */ jsx("td", { className: "px-4 py-3.5", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col leading-tight max-w-[150px] md:max-w-none", children: [
            /* @__PURE__ */ jsx("span", { className: "font-medium text-white truncate", children: inv.full_name }),
            /* @__PURE__ */ jsx("span", { className: "text-xs text-muted-foreground font-mono truncate", children: inv.email }),
            inv.notes && /* @__PURE__ */ jsxs("div", { className: "text-[10px] text-muted-foreground/75 mt-0.5 italic flex items-center gap-1", children: [
              /* @__PURE__ */ jsx(Info, { className: "h-2.5 w-2.5 text-primary/80 shrink-0" }),
              /* @__PURE__ */ jsx("span", { className: "truncate", children: inv.notes })
            ] })
          ] }) }),
          /* @__PURE__ */ jsx("td", { className: "px-4 py-3.5", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1 w-fit", children: [
            /* @__PURE__ */ jsxs(Badge, { variant: "outline", className: `text-[10px] font-medium leading-none py-0.5 px-1.5 ${getRoleBadgeStyle(inv.role)}`, children: [
              /* @__PURE__ */ jsx(Shield, { className: "h-2.5 w-2.5 mr-1" }),
              getRoleLabel(inv.role)
            ] }),
            inv.permissions.length > 0 && /* @__PURE__ */ jsxs("span", { className: "text-[9px] text-muted-foreground font-mono", children: [
              "Mod: ",
              inv.permissions.join(", ")
            ] })
          ] }) }),
          /* @__PURE__ */ jsx("td", { className: "px-4 py-3.5", children: /* @__PURE__ */ jsx("div", { className: "text-xs text-muted-foreground/90 font-mono", children: inv.invited_by }) }),
          /* @__PURE__ */ jsx("td", { className: "px-4 py-3.5", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col text-[11px] font-mono leading-tight", children: [
            /* @__PURE__ */ jsxs("span", { className: "text-muted-foreground/85", children: [
              "Até: ",
              new Date(inv.expires_at).toLocaleDateString("pt-BR")
            ] }),
            /* @__PURE__ */ jsxs("span", { className: "text-[10px] opacity-65", children: [
              "Hora: ",
              new Date(inv.expires_at).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
            ] })
          ] }) }),
          /* @__PURE__ */ jsx("td", { className: "px-4 py-3.5", children: inv.status === "pending" ? /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1 text-xs text-cyan-400 font-medium", children: [
            /* @__PURE__ */ jsx(Clock, { className: "h-3 w-3 animate-pulse text-cyan-400 shrink-0" }),
            "Pendente"
          ] }) : inv.status === "accepted" ? /* @__PURE__ */ jsxs("div", { className: "flex flex-col leading-tight", children: [
            /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1 text-xs text-emerald-400 font-medium", children: [
              /* @__PURE__ */ jsx(CheckCircle2, { className: "h-3.5 w-3.5 text-emerald-400 shrink-0" }),
              "Ativado"
            ] }),
            inv.accepted_at && /* @__PURE__ */ jsxs("span", { className: "text-[9px] font-mono text-muted-foreground/60", children: [
              "Em: ",
              new Date(inv.accepted_at).toLocaleDateString("pt-BR")
            ] })
          ] }) : inv.status === "expired" ? /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1 text-xs text-slate-400 font-medium", children: [
            /* @__PURE__ */ jsx(XCircle, { className: "h-3.5 w-3.5 text-slate-500 shrink-0" }),
            "Expirado"
          ] }) : /* @__PURE__ */ jsxs("div", { className: "flex flex-col leading-tight", children: [
            /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1 text-xs text-rose-400 font-medium", children: [
              /* @__PURE__ */ jsx(XCircle, { className: "h-3.5 w-3.5 text-rose-500 shrink-0" }),
              "Cancelado"
            ] }),
            inv.revoked_at && /* @__PURE__ */ jsxs("span", { className: "text-[9px] font-mono text-muted-foreground/60", children: [
              "Em: ",
              new Date(inv.revoked_at).toLocaleDateString("pt-BR")
            ] })
          ] }) }),
          /* @__PURE__ */ jsx("td", { className: "px-4 py-3.5 text-right", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-end gap-1.5", children: [
            inv.status === "pending" && /* @__PURE__ */ jsx(
              Button,
              {
                onClick: () => handleCopyLink(inv.invite_link, inv.invite_token),
                variant: "outline",
                className: "h-8 w-8 p-0 rounded-md border-slate-800 text-slate-400 hover:text-white",
                title: "Copiar Link Seguro",
                children: copiedToken === inv.invite_token ? /* @__PURE__ */ jsx(Check, { className: "h-3.5 w-3.5 text-emerald-400" }) : /* @__PURE__ */ jsx(Copy, { className: "h-3.5 w-3.5" })
              }
            ),
            inv.status === "pending" && /* @__PURE__ */ jsx(
              "a",
              {
                href: `/auth/invite/${inv.invite_token}`,
                className: "inline-flex h-8 px-2.5 items-center justify-center rounded-md border border-primary/20 bg-primary/10 text-[10px] font-bold text-primary hover:bg-primary/20 transition-colors",
                title: "Simular Acesso do Candidato",
                children: "Ir p/ Ativação"
              }
            ),
            (inv.status === "expired" || inv.status === "revoked") && /* @__PURE__ */ jsx(
              Button,
              {
                onClick: () => handleResendInvite(inv.id),
                variant: "outline",
                className: "h-8 w-8 p-0 rounded-md border-slate-800 text-slate-400 hover:text-white hover:bg-slate-850",
                title: "Reenviar de Formato Renovado (+48h)",
                children: /* @__PURE__ */ jsx(RefreshCw, { className: "h-3.5 w-3.5" })
              }
            ),
            inv.status === "pending" && /* @__PURE__ */ jsx(
              Button,
              {
                onClick: () => handleRevokeInvite(inv.id),
                variant: "outline",
                className: "h-8 w-8 p-0 rounded-md border-rose-500/15 text-rose-500 hover:bg-rose-500/10 hover:border-rose-500/30",
                title: "Revogar e Invalidar Token",
                children: /* @__PURE__ */ jsx(Trash2, { className: "h-3.5 w-3.5" })
              }
            )
          ] }) })
        ] }, inv.id)) })
      ] }) })
    ] })
  ] });
}
function UserManagement() {
  const { usersList, changeUserRole, deleteUserAndInviteSession, user: currentUser } = useAuth();
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const [sortField, setSortField] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const toggleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };
  const handleToggleStatus = async (userId, currentStatus) => {
    if (userId === currentUser?.id) {
      toast.error("Operação negada: Você não pode suspender sua própria conta.");
      return;
    }
    try {
      const nextStatus = currentStatus === "active" ? "suspended" : "active";
      window.dispatchEvent(new Event("storage"));
      toast.success(
        `Usuário ${nextStatus === "active" ? "reativado" : "suspenso"} com sucesso!`
      );
      setTimeout(() => {
        window.location.reload();
      }, 600);
    } catch {
      toast.error("Erro ao modificar status do usuário.");
    }
  };
  const handleRoleChange = async (userId, newRole) => {
    if (userId === currentUser?.id) {
      toast.error("Operação negada: Você não pode rebaixar sua própria role master.");
      return;
    }
    try {
      await changeUserRole(userId, newRole);
      toast.success("Privilégios atualizados com sucesso!");
      setTimeout(() => {
        window.location.reload();
      }, 600);
    } catch {
      toast.error("Sem permissão para reatribuir níveis.");
    }
  };
  const filteredUsers = usersList.filter((u) => {
    const matchesSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()) || u.phone && u.phone.includes(search);
    const matchesRole = roleFilter === "all" || u.role === roleFilter;
    const matchesStatus = statusFilter === "all" || u.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });
  const sortedUsers = [...filteredUsers].sort((a, b) => {
    const valA = a[sortField] || "";
    const valB = b[sortField] || "";
    if (valA < valB) return sortOrder === "asc" ? -1 : 1;
    if (valA > valB) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });
  const totalItems = sortedUsers.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = sortedUsers.slice(startIndex, startIndex + itemsPerPage);
  const handleRemoveSimulation = (userId) => {
    if (userId === currentUser?.id) {
      toast.error("Você não pode remover a si mesmo da própria simulação ativa.");
      return;
    }
    deleteUserAndInviteSession(userId);
    toast.success("Simulador limpado. Instância removida da persistência de mentira.");
    setTimeout(() => {
      window.location.reload();
    }, 600);
  };
  return /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col md:flex-row gap-3 items-center justify-between", children: [
      /* @__PURE__ */ jsxs("div", { className: "relative w-full md:w-80", children: [
        /* @__PURE__ */ jsx(Search, { className: "absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" }),
        /* @__PURE__ */ jsx(
          Input,
          {
            placeholder: "Buscar por nome, e-mail...",
            className: "pl-9 bg-background/50",
            value: search,
            onChange: (e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-2 w-full md:w-auto items-center justify-end", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5 bg-card/40 border border-border px-2.5 py-1.5 rounded-lg text-xs font-medium", children: [
          /* @__PURE__ */ jsx(Filter, { className: "h-3.5 w-3.5 text-muted-foreground" }),
          /* @__PURE__ */ jsx("span", { className: "text-muted-foreground/80", children: "Filtrar:" })
        ] }),
        /* @__PURE__ */ jsxs(Select, { value: roleFilter, onValueChange: (val) => {
          setRoleFilter(val);
          setCurrentPage(1);
        }, children: [
          /* @__PURE__ */ jsx(SelectTrigger, { className: "w-40 bg-card/60 border-border text-xs h-9", children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Cargo / Nível" }) }),
          /* @__PURE__ */ jsxs(SelectContent, { children: [
            /* @__PURE__ */ jsx(SelectItem, { value: "all", children: "Todas as Roles" }),
            /* @__PURE__ */ jsx(SelectItem, { value: "admin_master", children: "Admin Master" }),
            /* @__PURE__ */ jsx(SelectItem, { value: "gestão_admin", children: "Gestão Admin" }),
            /* @__PURE__ */ jsx(SelectItem, { value: "financeiro", children: "Financeiro" }),
            /* @__PURE__ */ jsx(SelectItem, { value: "suporte", children: "Suporte Técnico" }),
            /* @__PURE__ */ jsx(SelectItem, { value: "logística", children: "Logística" }),
            /* @__PURE__ */ jsx(SelectItem, { value: "marketing", children: "Marketing" }),
            /* @__PURE__ */ jsx(SelectItem, { value: "analytics", children: "Analytics" }),
            /* @__PURE__ */ jsx(SelectItem, { value: "auditor", children: "Auditor" }),
            /* @__PURE__ */ jsx(SelectItem, { value: "operador", children: "Operador (Staff)" }),
            /* @__PURE__ */ jsx(SelectItem, { value: "distributor", children: "Distribuidor MLM" }),
            /* @__PURE__ */ jsx(SelectItem, { value: "customer", children: "Cliente Final" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs(Select, { value: statusFilter, onValueChange: (val) => {
          setStatusFilter(val);
          setCurrentPage(1);
        }, children: [
          /* @__PURE__ */ jsx(SelectTrigger, { className: "w-36 bg-card/60 border-border text-xs h-9", children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Status" }) }),
          /* @__PURE__ */ jsxs(SelectContent, { children: [
            /* @__PURE__ */ jsx(SelectItem, { value: "all", children: "Todos os Status" }),
            /* @__PURE__ */ jsx(SelectItem, { value: "active", children: "Ativo" }),
            /* @__PURE__ */ jsx(SelectItem, { value: "suspended", children: "Suspenso" }),
            /* @__PURE__ */ jsx(SelectItem, { value: "pending", children: "Pendente (Simulado)" })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-border bg-card/40 overflow-hidden", children: [
      /* @__PURE__ */ jsxs("div", { className: "px-4 py-3 bg-card/60 border-b border-border flex items-center justify-between", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(Users, { className: "h-4 w-4 text-primary" }),
          /* @__PURE__ */ jsxs("h3", { className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground", children: [
            "Usuários Administrativos Integrados (",
            totalItems,
            ")"
          ] })
        ] }),
        /* @__PURE__ */ jsx(Badge, { variant: "outline", className: "text-[10px] font-mono border-emerald-500/20 text-emerald-400 bg-emerald-500/5", children: "Supabase Auth + RBAC ativo" })
      ] }),
      totalItems === 0 ? /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center py-12 text-center", children: [
        /* @__PURE__ */ jsx(UserX, { className: "h-10 w-10 text-muted-foreground/40 mb-3" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-muted-foreground", children: "Nenhum administrador encontrado." }),
        /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground/60", children: "Tente ajustar seus termos de busca ou filtros de cargos." })
      ] }) : /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-sm", children: [
        /* @__PURE__ */ jsx("thead", { className: "bg-[#0b0f19]/80 border-b border-border/80 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider", children: /* @__PURE__ */ jsxs("tr", { children: [
          /* @__PURE__ */ jsx("th", { className: "px-4 py-3 text-left cursor-pointer hover:text-white", onClick: () => toggleSort("name"), children: /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1", children: [
            "Nome ",
            sortField === "name" && /* @__PURE__ */ jsx(ArrowUpDown, { className: "h-3 w-3" })
          ] }) }),
          /* @__PURE__ */ jsx("th", { className: "px-4 py-3 text-left", children: "Função Comercial / Role" }),
          /* @__PURE__ */ jsx("th", { className: "px-4 py-3 text-left", children: "Identificador UID" }),
          /* @__PURE__ */ jsx("th", { className: "px-4 py-3 text-left", children: "Status" }),
          /* @__PURE__ */ jsx("th", { className: "px-4 py-3 text-left cursor-pointer hover:text-white", onClick: () => toggleSort("created_at"), children: /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1", children: [
            "Ativação ",
            sortField === "created_at" && /* @__PURE__ */ jsx(ArrowUpDown, { className: "h-3 w-3" })
          ] }) }),
          /* @__PURE__ */ jsx("th", { className: "px-4 py-3 text-right", children: "Aparência & Ações Rápidas" })
        ] }) }),
        /* @__PURE__ */ jsx("tbody", { className: "divide-y divide-border/40", children: paginatedUsers.map((u) => /* @__PURE__ */ jsxs("tr", { className: "hover:bg-accent/20 transition-colors group", children: [
          /* @__PURE__ */ jsx("td", { className: "px-4 py-3.5", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2.5", children: [
            /* @__PURE__ */ jsx("div", { className: "h-8 w-8 rounded-full bg-slate-800/80 border border-border flex items-center justify-center font-bold text-xs text-white uppercase shrink-0", children: u.avatar ? /* @__PURE__ */ jsx("img", { src: u.avatar, className: "h-full w-full rounded-full object-crop", referrerPolicy: "no-referrer", alt: "" }) : u.name.substring(0, 2) }),
            /* @__PURE__ */ jsxs("div", { className: "flex flex-col min-w-0", children: [
              /* @__PURE__ */ jsx("span", { className: "font-medium text-white truncate max-w-[160px]", children: u.name }),
              /* @__PURE__ */ jsx("span", { className: "text-xs text-muted-foreground font-mono truncate max-w-[160px]", children: u.email })
            ] })
          ] }) }),
          /* @__PURE__ */ jsx("td", { className: "px-4 py-3.5", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1", children: [
            /* @__PURE__ */ jsxs(Badge, { variant: "outline", className: `w-fit text-[10px] font-medium leading-none py-1 px-1.5 ${getRoleBadgeStyle(u.role)}`, children: [
              /* @__PURE__ */ jsx(Shield, { className: "h-2.5 w-2.5 mr-1" }),
              getRoleLabel(u.role)
            ] }),
            /* @__PURE__ */ jsx("span", { className: "text-[10px] text-muted-foreground/60 italic font-mono", children: ROLE_PERMISSIONS_SUMMARY[u.role] || "Acesso de leitura" })
          ] }) }),
          /* @__PURE__ */ jsx("td", { className: "px-4 py-3.5", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1 text-[11px] font-mono text-muted-foreground/80 max-w-[120px] truncate", children: [
            /* @__PURE__ */ jsx(Fingerprint, { className: "h-3 w-3 text-muted-foreground/40 shrink-0" }),
            /* @__PURE__ */ jsx("span", { className: "truncate", children: u.id })
          ] }) }),
          /* @__PURE__ */ jsx("td", { className: "px-4 py-3.5", children: u.status === "active" ? /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1 text-xs text-emerald-400 font-medium", children: [
            /* @__PURE__ */ jsx("span", { className: "h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" }),
            "Ativo"
          ] }) : u.status === "suspended" ? /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1 text-xs text-rose-400 font-medium", children: [
            /* @__PURE__ */ jsx("span", { className: "h-1.5 w-1.5 rounded-full bg-rose-500" }),
            "Suspenso"
          ] }) : /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1 text-xs text-amber-400 font-medium", children: [
            /* @__PURE__ */ jsx("span", { className: "h-1.5 w-1.5 rounded-full bg-amber-500" }),
            "Pendente"
          ] }) }),
          /* @__PURE__ */ jsx("td", { className: "px-4 py-3.5", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col text-[11px] text-muted-foreground font-mono leading-tight", children: [
            /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1", children: [
              /* @__PURE__ */ jsx(Calendar, { className: "h-3 w-3 text-muted-foreground/40" }),
              new Date(u.created_at).toLocaleDateString("pt-BR")
            ] }),
            /* @__PURE__ */ jsxs("span", { className: "text-[10px] opacity-65", children: [
              "Login: ",
              u.last_login ? new Date(u.last_login).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }) : "Nunca"
            ] })
          ] }) }),
          /* @__PURE__ */ jsx("td", { className: "px-4 py-3.5 text-right", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-end gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity", children: [
            /* @__PURE__ */ jsxs(
              Select,
              {
                value: u.role,
                onValueChange: (val) => handleRoleChange(u.id, val),
                disabled: u.id === currentUser?.id || currentUser?.role !== "admin_master",
                children: [
                  /* @__PURE__ */ jsx(SelectTrigger, { className: "w-28 bg-transparent hover:bg-slate-800 border-none text-[11px] h-7 px-1.5 text-muted-foreground hover:text-white", children: /* @__PURE__ */ jsx("span", { className: "truncate", children: "Atribuir" }) }),
                  /* @__PURE__ */ jsxs(SelectContent, { children: [
                    /* @__PURE__ */ jsx(SelectItem, { value: "admin_master", children: "Admin Master" }),
                    /* @__PURE__ */ jsx(SelectItem, { value: "gestão_admin", children: "Gestão Admin" }),
                    /* @__PURE__ */ jsx(SelectItem, { value: "financeiro", children: "Financeiro" }),
                    /* @__PURE__ */ jsx(SelectItem, { value: "suporte", children: "Suporte Técnico" }),
                    /* @__PURE__ */ jsx(SelectItem, { value: "logística", children: "Logística" }),
                    /* @__PURE__ */ jsx(SelectItem, { value: "marketing", children: "Marketing" }),
                    /* @__PURE__ */ jsx(SelectItem, { value: "analytics", children: "Analytics" }),
                    /* @__PURE__ */ jsx(SelectItem, { value: "auditor", children: "Auditor" }),
                    /* @__PURE__ */ jsx(SelectItem, { value: "operador", children: "Operador" })
                  ] })
                ]
              }
            ),
            u.id !== currentUser?.id && /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => handleToggleStatus(u.id, u.status),
                className: `p-1.5 rounded-md border text-xs leading-none transition-colors ${u.status === "active" ? "border-rose-500/20 text-rose-400 hover:bg-rose-500/10" : "border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/10"}`,
                title: u.status === "active" ? "Suspender Acesso" : "Reativar Acesso",
                children: u.status === "active" ? /* @__PURE__ */ jsx(Ban, { className: "h-3.5 w-3.5" }) : /* @__PURE__ */ jsx(UserCheck, { className: "h-3.5 w-3.5" })
              }
            ),
            u.id.startsWith("user-admin-") && u.id !== currentUser?.id && /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => handleRemoveSimulation(u.id),
                className: "p-1.5 rounded-md border border-slate-700/65 text-slate-400 hover:bg-rose-500/20 hover:text-white hover:border-rose-500/40 transition-colors",
                title: "Limpar Instância Simulador",
                children: /* @__PURE__ */ jsx(UserX, { className: "h-3.5 w-3.5" })
              }
            )
          ] }) })
        ] }, u.id)) })
      ] }) }),
      totalPages > 1 && /* @__PURE__ */ jsxs("div", { className: "px-4 py-2 border-t border-border flex items-center justify-between text-xs bg-slate-900/45", children: [
        /* @__PURE__ */ jsxs("span", { className: "text-muted-foreground font-medium", children: [
          "Página ",
          /* @__PURE__ */ jsx("span", { className: "text-white font-semibold", children: currentPage }),
          " de ",
          /* @__PURE__ */ jsx("span", { className: "text-white font-semibold", children: totalPages }),
          " (",
          totalItems,
          " registros)"
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1", children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              disabled: currentPage === 1,
              onClick: () => setCurrentPage((c) => Math.max(1, c - 1)),
              className: "p-1.5 rounded-md border border-border text-muted-foreground hover:text-white hover:bg-slate-800 disabled:opacity-40",
              children: /* @__PURE__ */ jsx(ChevronLeft, { className: "h-3.5 w-3.5" })
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              disabled: currentPage === totalPages,
              onClick: () => setCurrentPage((c) => Math.min(totalPages, c + 1)),
              className: "p-1.5 rounded-md border border-border text-muted-foreground hover:text-white hover:bg-slate-800 disabled:opacity-40",
              children: /* @__PURE__ */ jsx(ChevronRight, { className: "h-3.5 w-3.5" })
            }
          )
        ] })
      ] })
    ] })
  ] });
}
const ROLE_PERMISSIONS_SUMMARY = {
  admin_master: "Acesso global total, gerência do banco & escalações.",
  gestão_admin: "Controle da equipe, produtos, marketing e pedidos.",
  financeiro: "Conciliações, pagamentos de bônus e saques.",
  suporte: "Análise de KYC, tickets administrativos e logs.",
  logística: "Gestão operacional de expedição e transportadoras.",
  marketing: "Painel de campanhas e banners comerciais.",
  analytics: "Disparo e acompanhamento de relatórios executivos.",
  auditor: "Acesso read-only estrito em logs e trilhas.",
  operador: "Aprovação rápida e faturamento operacional de pedidos."
};
const auditLogs = [{
  id: "1",
  actor: "admin@allin.io",
  action: "CREATE_USER",
  entity: "profiles",
  at: "Hoje 09:20"
}, {
  id: "2",
  actor: "gestao@allin.io",
  action: "APPROVE_INVITE",
  entity: "admin_invites",
  at: "Hoje 08:52"
}, {
  id: "3",
  actor: "financeiro@allin.io",
  action: "UPDATE_GATEWAY",
  entity: "payments_gateways",
  at: "Ontem 17:15"
}];
function SystemPage() {
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsx(PageHeader, { eyebrow: "Sistema", title: "Admin & Auditoria", subtitle: "Gestao de usuarios, convites, integracoes e controles financeiros." }),
    /* @__PURE__ */ jsxs(Tabs, { defaultValue: "users", className: "space-y-4", children: [
      /* @__PURE__ */ jsxs(TabsList, { className: "flex flex-wrap h-auto gap-1 rounded-xl border border-border bg-card/60 p-1", children: [
        /* @__PURE__ */ jsx(TabsTrigger, { value: "users", children: "Usuarios" }),
        /* @__PURE__ */ jsx(TabsTrigger, { value: "invites", children: "Convites" }),
        /* @__PURE__ */ jsx(TabsTrigger, { value: "audit", children: "Auditoria" }),
        /* @__PURE__ */ jsx(TabsTrigger, { value: "gateways", children: "Gateways" }),
        /* @__PURE__ */ jsx(TabsTrigger, { value: "bonus", children: "Bonus" }),
        /* @__PURE__ */ jsx(TabsTrigger, { value: "financeiro", children: "Financeiro" })
      ] }),
      /* @__PURE__ */ jsx(TabsContent, { value: "users", className: "space-y-4", children: /* @__PURE__ */ jsx(UserManagement, {}) }),
      /* @__PURE__ */ jsx(TabsContent, { value: "invites", className: "space-y-4", children: /* @__PURE__ */ jsx(InvitesManagement, {}) }),
      /* @__PURE__ */ jsxs(TabsContent, { value: "audit", className: "space-y-4", children: [
        /* @__PURE__ */ jsx("div", { className: "grid gap-3 md:grid-cols-3", children: [{
          title: "Usuarios admin",
          value: "14 ativos",
          hint: "RBAC + SSO"
        }, {
          title: "Integracoes",
          value: "9 conectores",
          hint: "Pix, ERP, CRM, Email"
        }, {
          title: "Feature flags",
          value: "28 flags",
          hint: "Multi-tenant"
        }].map((card) => /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-border bg-card/60 p-4", children: [
          /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: card.title }),
          /* @__PURE__ */ jsx("p", { className: "mt-1 text-xl font-semibold", children: card.value }),
          /* @__PURE__ */ jsx("p", { className: "mt-1 text-[11px] text-muted-foreground", children: card.hint })
        ] }, card.title)) }),
        /* @__PURE__ */ jsxs("div", { className: "overflow-hidden rounded-xl border border-border bg-card/40", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between border-b border-border px-4 py-3", children: [
            /* @__PURE__ */ jsx("h3", { className: "text-sm font-semibold", children: "Audit log" }),
            /* @__PURE__ */ jsx(Badge, { variant: "outline", className: "text-[10px]", children: "imutavel" })
          ] }),
          /* @__PURE__ */ jsxs("table", { className: "w-full text-sm", children: [
            /* @__PURE__ */ jsx("thead", { className: "bg-background/40 text-[11px] uppercase tracking-wider text-muted-foreground", children: /* @__PURE__ */ jsxs("tr", { children: [
              /* @__PURE__ */ jsx("th", { className: "px-4 py-2.5 text-left", children: "Quem" }),
              /* @__PURE__ */ jsx("th", { className: "px-4 py-2.5 text-left", children: "Acao" }),
              /* @__PURE__ */ jsx("th", { className: "px-4 py-2.5 text-left", children: "Entidade" }),
              /* @__PURE__ */ jsx("th", { className: "px-4 py-2.5 text-left", children: "Quando" })
            ] }) }),
            /* @__PURE__ */ jsx("tbody", { className: "divide-y divide-border/60", children: auditLogs.map((log) => /* @__PURE__ */ jsxs("tr", { className: "hover:bg-accent/30", children: [
              /* @__PURE__ */ jsx("td", { className: "px-4 py-3 font-mono text-xs", children: log.actor }),
              /* @__PURE__ */ jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsx("code", { className: "text-xs", children: log.action }) }),
              /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-xs text-muted-foreground", children: log.entity }),
              /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-xs text-muted-foreground", children: log.at })
            ] }, log.id)) })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsx(TabsContent, { value: "gateways", children: /* @__PURE__ */ jsx(GatewayManagement, {}) }),
      /* @__PURE__ */ jsx(TabsContent, { value: "bonus", children: /* @__PURE__ */ jsx(BonusConfiguration, {}) }),
      /* @__PURE__ */ jsx(TabsContent, { value: "financeiro", children: /* @__PURE__ */ jsx(FinancialDashboard, {}) })
    ] })
  ] });
}
export {
  SystemPage as component
};
