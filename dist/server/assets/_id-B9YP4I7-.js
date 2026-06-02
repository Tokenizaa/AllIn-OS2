import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { Link } from "@tanstack/react-router";
import { useState, useEffect, useMemo } from "react";
import { ShieldAlert, Bot, FileText, Sparkles, CheckCircle2, Wallet, CreditCard, ShoppingBag, Mail, Phone, MapPin, Shield, ArrowUpRight, Coins, Users, Clock, Trash2, Upload } from "lucide-react";
import { P as PageHeader } from "./page-header-DZhedIL1.js";
import { c as cn$1, n as Route, B as Button, a as Badge } from "./router-OVqp2Aj1.js";
import { T as Tabs, a as TabsList, b as TabsTrigger, c as TabsContent } from "./tabs-vlCUvq5M.js";
import { K as KpiCard } from "./kpi-card-DXitwrQl.js";
import { s as supabase } from "./supabase-client-BdpvIS_G.js";
import { g as getCustomerLabel, a as getCustomerInitials } from "./customer-label-CvKl2zbr.js";
import { toast } from "sonner";
import "@tanstack/react-query";
import "./roles-DEW722fr.js";
import "framer-motion";
import "class-variance-authority";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-slot";
import "@radix-ui/react-tabs";
import "@supabase/supabase-js";
const iconMap = {
  order: ShoppingBag,
  payment: CreditCard,
  bonus: Wallet,
  verification: CheckCircle2,
  activation: Sparkles,
  note: FileText,
  automation: Bot,
  risk: ShieldAlert
};
const colorMap = {
  order: "text-primary",
  payment: "text-info",
  bonus: "text-success",
  verification: "text-success",
  activation: "text-primary",
  note: "text-muted-foreground",
  automation: "text-fuchsia-400",
  risk: "text-destructive"
};
function Timeline({ events }) {
  return /* @__PURE__ */ jsx("ol", { className: "relative border-l border-border/60 pl-5 space-y-4", children: events.map((e) => {
    const Icon = iconMap[e.type];
    return /* @__PURE__ */ jsxs("li", { className: "relative", children: [
      /* @__PURE__ */ jsx("span", { className: cn$1("absolute -left-[27px] grid h-5 w-5 place-items-center rounded-full border border-border bg-card", colorMap[e.type]), children: /* @__PURE__ */ jsx(Icon, { className: "h-3 w-3" }) }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-baseline justify-between gap-2", children: [
        /* @__PURE__ */ jsx("h5", { className: "text-sm font-medium", children: e.title }),
        /* @__PURE__ */ jsx("time", { className: "text-[11px] text-muted-foreground whitespace-nowrap", children: new Date(e.at).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }) })
      ] }),
      /* @__PURE__ */ jsx("p", { className: "mt-0.5 text-xs text-muted-foreground", children: e.description }),
      e.actor && /* @__PURE__ */ jsxs("span", { className: "mt-1 inline-block text-[10px] text-fuchsia-300/80", children: [
        "por ",
        e.actor
      ] })
    ] }, e.id);
  }) });
}
const statusStyles = {
  active: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
  pending: "bg-amber-500/10 text-amber-400 border-amber-500/30",
  inactive: "bg-red-500/10 text-red-500/30 border-red-500/30",
  churned: "bg-muted text-muted-foreground border-border"
};
function formatBRL(value) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL"
  }).format(value);
}
const cn = (...classes) => classes.filter(Boolean).join(" ");
function Customer360() {
  const {
    customer: c
  } = Route.useLoaderData();
  const [orders, setOrders] = useState([]);
  const [sponsor, setSponsor] = useState(null);
  const [wallet, setWallet] = useState(null);
  const [pointsWallet, setPointsWallet] = useState(null);
  const [walletTransactions, setWalletTransactions] = useState([]);
  const [downlines, setDownlines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [customNotes, setCustomNotes] = useState([]);
  const [noteText, setNoteText] = useState("");
  const [showAddTx, setShowAddTx] = useState(false);
  const [txType, setTxType] = useState("credit");
  const [txAmount, setTxAmount] = useState("");
  const [txDesc, setTxDesc] = useState("");
  const [documents, setDocuments] = useState([{
    id: "doc-1",
    name: "Contrato de Distribuidor Associado",
    required: true,
    status: "approved",
    type: "PDF",
    updatedAt: "2026-05-15T10:00:00Z"
  }, {
    id: "doc-2",
    name: "Cédula de Identidade (RG/CNH)",
    required: true,
    status: "approved",
    type: "JPG",
    updatedAt: "2026-05-15T10:05:00Z"
  }, {
    id: "doc-3",
    name: "Comprovante de Residência Recente",
    required: true,
    status: "pending",
    type: "PNG",
    updatedAt: "2026-06-01T14:30:00Z"
  }, {
    id: "doc-4",
    name: "Inscrição PIS/NIT (Pessoa Física)",
    required: false,
    status: "missing",
    type: "-",
    updatedAt: null
  }, {
    id: "doc-5",
    name: "Declaração de Conta Bancária para Recebimentos",
    required: true,
    status: "missing",
    type: "-",
    updatedAt: null
  }]);
  const [automations, setAutomations] = useState([{
    id: "auto-1",
    name: "E-mail de Boas-Vindas",
    description: "Disparado automaticamente no instante do cadastro da conta do distribuidor.",
    type: "E-mail",
    active: true,
    runs: 124
  }, {
    id: "auto-2",
    name: "Alerta de Upgrade de Nível",
    description: "Incentiva o distribuidor enviando metas quando está próximo de atingir graduação.",
    type: "WhatsApp",
    active: true,
    runs: 45
  }, {
    id: "auto-3",
    name: "Detecção de Inatividade (Churn)",
    description: "Notifica o patrocinador associado caso o distribuidor fique mais de 25 dias sem pedidos.",
    type: "Sistema",
    active: false,
    runs: 0
  }, {
    id: "auto-4",
    name: "Cobrança de Renovação Periódica",
    description: "Dispara lembretes 30 e 15 dias antes de expirar o licenciamento ativo.",
    type: "SMS",
    active: true,
    runs: 12
  }, {
    id: "auto-5",
    name: "WhatsApp de Cashback de Rede",
    description: "Mensagem automática comunicando crédito imediato de pontos de rede no ledger.",
    type: "WhatsApp",
    active: true,
    runs: 312
  }]);
  const fetch360Data = async () => {
    setLoading(true);
    try {
      const [{
        data: orderData
      }, {
        data: sponsorData
      }] = await Promise.all([supabase.from("orders").select("*").eq("customer_id", c.id).order("created_at", {
        ascending: false
      }), c.patrocinador_comprador ? supabase.from("customers").select("*").eq("id_comprador", c.patrocinador_comprador).maybeSingle() : Promise.resolve({
        data: null
      })]);
      setOrders(orderData || []);
      setSponsor(sponsorData || null);
      const {
        data: walletData
      } = await supabase.from("wallets").select("*").eq("customer_id", c.id).maybeSingle();
      setWallet(walletData || null);
      if (walletData) {
        const {
          data: txData
        } = await supabase.from("wallet_transactions").select("*").eq("wallet_id", walletData.id).order("created_at", {
          ascending: false
        });
        setWalletTransactions(txData || []);
      } else {
        setWalletTransactions([]);
      }
      const {
        data: ptsData
      } = await supabase.from("points_wallets").select("*").eq("customer_id", c.id).maybeSingle();
      setPointsWallet(ptsData || null);
      if (c.id_comprador) {
        const {
          data: downlineData
        } = await supabase.from("customers").select("id, usuario, id_comprador, qualification, status, telefone, created_at, cidade, estado, name").eq("patrocinador_comprador", c.id_comprador).order("created_at", {
          ascending: false
        });
        setDownlines(downlineData || []);
      } else {
        setDownlines([]);
      }
    } catch (err) {
      console.error("Erro ao buscar dados completos de CRM 360:", err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetch360Data();
  }, [c.id, c.patrocinador_comprador, c.id_comprador]);
  const ltv = useMemo(() => {
    return orders.filter((o) => ["pago", "entregue", "enviado"].includes((o.status_pedido || o.status || "").toLowerCase())).reduce((acc, o) => acc + Number(o.valor_total_pedido || o.valor_total || 0), 0);
  }, [orders]);
  const totalComprado = useMemo(() => {
    return orders.reduce((acc, o) => acc + Number(o.valor_total_pedido || o.valor_total || 0), 0);
  }, [orders]);
  const churnRisk = useMemo(() => {
    if (c.status === "inactive" || c.status === "churned") return "95% (Crítico)";
    if (orders.length === 0) return "75% (Sem Compras)";
    const lastOrderDate = new Date(Math.max(...orders.map((o) => new Date(o.created_at || 0).getTime())));
    const daysSinceLastOrder = ((/* @__PURE__ */ new Date()).getTime() - lastOrderDate.getTime()) / (1e3 * 3600 * 24);
    if (daysSinceLastOrder > 60) return "85% (Crítico - Inativo)";
    if (daysSinceLastOrder > 30) return "60% (Risco Médio)";
    if (daysSinceLastOrder > 15) return "35% (Alerta Leve)";
    return "12% (Estável / Baixo)";
  }, [c.status, orders]);
  const handleCreateWallet = async () => {
    try {
      const {
        data: newWallet,
        error
      } = await supabase.from("wallets").insert({
        customer_id: c.id,
        balance: 0,
        available_balance: 0,
        frozen_balance: 0,
        currency: "BRL",
        status: "active"
      }).select().single();
      if (error) throw error;
      setWallet(newWallet);
      toast.success("Carteira financeira criada com sucesso no banco de dados!");
    } catch (err) {
      toast.error("Erro ao provisionar carteira: " + err.message);
    }
  };
  const handleCreatePointsWallet = async () => {
    try {
      const {
        data: newPtsWallet,
        error
      } = await supabase.from("points_wallets").insert({
        customer_id: c.id,
        balance: 0,
        available_balance: 0,
        frozen_balance: 0,
        total_earned: 0,
        total_redeemed: 0,
        currency: "PTS",
        status: "active"
      }).select().single();
      if (error) throw error;
      setPointsWallet(newPtsWallet);
      toast.success("Carteira de pontos criada com sucesso no banco de dados!");
    } catch (err) {
      toast.error("Erro ao provisionar pontos: " + err.message);
    }
  };
  const handleAddTransaction = async (e) => {
    e.preventDefault();
    if (!wallet) {
      toast.error("Inicialize a carteira antes de lançar movimentações.");
      return;
    }
    const amt = parseFloat(txAmount);
    if (!amt || amt <= 0) {
      toast.error("Por favor, digite um valor numérico válido.");
      return;
    }
    const change = txType === "credit" ? amt : -amt;
    const balanceBefore = wallet.balance || 0;
    const balanceAfter = balanceBefore + change;
    try {
      const {
        error: walletErr
      } = await supabase.from("wallets").update({
        balance: balanceAfter,
        available_balance: balanceAfter
      }).eq("id", wallet.id);
      if (walletErr) throw walletErr;
      const {
        data: newTx,
        error: txErr
      } = await supabase.from("wallet_transactions").insert({
        wallet_id: wallet.id,
        transaction_type: txType,
        amount: amt,
        balance_before: balanceBefore,
        balance_after: balanceAfter,
        description: txDesc || "Lançamento de ajuste administrativo",
        reference_type: "adjustment",
        reference_id: "manual-" + Date.now().toString().slice(-6)
      }).select().single();
      if (txErr) throw txErr;
      setWallet({
        ...wallet,
        balance: balanceAfter,
        available_balance: balanceAfter
      });
      setWalletTransactions([newTx, ...walletTransactions]);
      setTxAmount("");
      setTxDesc("");
      setShowAddTx(false);
      toast.success(`Saldo atualizado com sucesso (${txType === "credit" ? "Crédito" : "Débito"} de ${formatBRL(amt)}).`);
    } catch (err) {
      toast.error("Erro ao lançar transação financeira: " + err.message);
    }
  };
  const handleAddNote = (e) => {
    e.preventDefault();
    if (!noteText.trim()) return;
    const newNote = {
      id: "note-" + Date.now().toString(),
      type: "note",
      title: "Observação CRM",
      description: noteText,
      at: (/* @__PURE__ */ new Date()).toISOString()
    };
    setCustomNotes([newNote, ...customNotes]);
    setNoteText("");
    toast.success("Nota salva com sucesso na linha do tempo!");
  };
  const tl = useMemo(() => {
    return [...customNotes, {
      id: "1",
      type: "note",
      title: "Ficha Operacional",
      description: "Distribuidor sincronizado com os dados do Supabase.",
      at: c.created_at || (/* @__PURE__ */ new Date()).toISOString()
    }, ...orders.slice(0, 4).map((o, index) => ({
      id: `order-tl-${index}`,
      type: "order",
      title: `Pedido ${o.numero_pedido || o.id.slice(0, 8)}`,
      description: `Status de processamento: ${o.status_pedido || o.status || "Pendente"}`,
      at: o.created_at || (/* @__PURE__ */ new Date()).toISOString()
    }))];
  }, [customNotes, orders, c.created_at]);
  if (loading) {
    return /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center min-h-[400px] gap-3 bg-background", children: [
      /* @__PURE__ */ jsx("div", { className: "h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" }),
      /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground animate-pulse font-medium", children: "Carregando dados estruturados do Supabase..." })
    ] });
  }
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6 pb-12 animate-fade-in", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-xs text-muted-foreground", children: [
      /* @__PURE__ */ jsx(Link, { to: "/customers", className: "hover:text-foreground transition-colors", children: "Distribuidores" }),
      /* @__PURE__ */ jsx("span", { children: "/" }),
      /* @__PURE__ */ jsx("span", { className: "text-foreground", children: getCustomerLabel(c) })
    ] }),
    /* @__PURE__ */ jsx(PageHeader, { eyebrow: "Customer 360", title: getCustomerLabel(c), subtitle: `${c.plano_id || c.plan_id || "Plano Integral"} · ${c.qualification || "Bronze"} · Ativo desde ${c.created_at ? new Date(c.created_at).toLocaleDateString("pt-BR") : "-"}`, actions: /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx(Button, { size: "sm", variant: "outline", className: "gap-1.5", onClick: fetch360Data, children: "Re-sincronizar" }),
      /* @__PURE__ */ jsx(Button, { size: "sm", className: "gap-1.5", children: "Acionar Suporte" })
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-4 gap-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "lg:col-span-1 rounded-xl border border-border bg-card/60 p-5 space-y-4 shadow-sm", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsx("div", { className: "h-14 w-14 rounded-full bg-gradient-to-br from-primary to-fuchsia-500 grid place-items-center text-lg font-semibold text-white shadow-md", children: getCustomerInitials(c) }),
          /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1", children: [
            /* @__PURE__ */ jsx("p", { className: "font-semibold truncate text-white", children: getCustomerLabel(c) }),
            /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground truncate", children: c.id_comprador || c.usuario })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2 text-xs border-t border-border/60 pt-3", children: [
          /* @__PURE__ */ jsxs("p", { className: "flex items-center gap-2 text-muted-foreground", children: [
            /* @__PURE__ */ jsx(Mail, { className: "h-3.5 w-3.5 shrink-0" }),
            " ",
            /* @__PURE__ */ jsx("span", { className: "truncate", children: c.user_id || c.id_comprador || "Sem ID" })
          ] }),
          /* @__PURE__ */ jsxs("p", { className: "flex items-center gap-2 text-muted-foreground", children: [
            /* @__PURE__ */ jsx(Phone, { className: "h-3.5 w-3.5 shrink-0" }),
            " ",
            /* @__PURE__ */ jsx("span", { children: c.telefone || "-" })
          ] }),
          /* @__PURE__ */ jsxs("p", { className: "flex items-center gap-2 text-muted-foreground", children: [
            /* @__PURE__ */ jsx(MapPin, { className: "h-3.5 w-3.5 shrink-0" }),
            " ",
            /* @__PURE__ */ jsxs("span", { children: [
              c.cidade || "-",
              "/",
              c.estado || "-"
            ] })
          ] }),
          /* @__PURE__ */ jsxs("p", { className: "flex items-center gap-2 text-muted-foreground", children: [
            /* @__PURE__ */ jsx(Shield, { className: "h-3.5 w-3.5 shrink-0" }),
            " ",
            /* @__PURE__ */ jsxs("span", { children: [
              "CPF ",
              c.metadata?.cpf || c.cpf || "-"
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-1.5 pt-1", children: [
          /* @__PURE__ */ jsx(Badge, { variant: "outline", className: "bg-primary/5 ", children: c.qualification || "Bronze" }),
          /* @__PURE__ */ jsx(Badge, { variant: "outline", className: "bg-primary/5", children: c.plano_id || c.plan_id || "Integral" }),
          /* @__PURE__ */ jsx(Badge, { variant: "outline", className: cn("capitalize font-semibold", statusStyles[c.status || "pending"]), children: c.status || "pending" })
        ] }),
        sponsor && /* @__PURE__ */ jsxs("div", { className: "rounded-lg border border-border bg-background/40 p-2.5 text-xs shadow-inner", children: [
          /* @__PURE__ */ jsx("p", { className: "text-[10px] text-muted-foreground font-semibold uppercase tracking-wider", children: "Patrocinador" }),
          /* @__PURE__ */ jsxs(Link, { to: "/customers/$id", params: {
            id: sponsor.id
          }, className: "mt-1 font-semibold hover:text-primary transition-all flex items-center gap-1 text-white", children: [
            getCustomerLabel(sponsor),
            " ",
            /* @__PURE__ */ jsx(ArrowUpRight, { className: "h-3 w-3 text-muted-foreground" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "lg:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-3", children: [
        /* @__PURE__ */ jsx(KpiCard, { label: "LTV", value: formatBRL(ltv) }),
        /* @__PURE__ */ jsx(KpiCard, { label: "Total Comprado", value: formatBRL(totalComprado), hint: `${orders.length} pedidos em folha` }),
        /* @__PURE__ */ jsx(KpiCard, { label: "Pedidos na Conta", value: String(orders.length) }),
        /* @__PURE__ */ jsx(KpiCard, { label: "Risco de Churn", value: churnRisk }),
        /* @__PURE__ */ jsxs("div", { className: "col-span-2 md:col-span-4 rounded-xl border border-primary/30 bg-primary/5 p-4 flex items-start gap-3", children: [
          /* @__PURE__ */ jsx(Sparkles, { className: "h-4 w-4 text-primary mt-0.5" }),
          /* @__PURE__ */ jsx("div", { className: "flex-1", children: /* @__PURE__ */ jsxs("p", { className: "text-xs md:text-sm text-amber-550", children: [
            /* @__PURE__ */ jsx("span", { className: "font-semibold text-primary", children: "Sincronização Ativa de Ledger:" }),
            " Os dados financeiros, pontos de rede, downlines de genealogia e o histórico detalhado estão sendo carregados e operacionalizados em tempo real a partir das tabelas relacionais do Supabase."
          ] }) })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs(Tabs, { defaultValue: "timeline", className: "space-y-4", children: [
      /* @__PURE__ */ jsxs(TabsList, { className: "bg-card/60 border border-border gap-1 p-1", children: [
        /* @__PURE__ */ jsx(TabsTrigger, { value: "timeline", children: "Timeline" }),
        /* @__PURE__ */ jsxs(TabsTrigger, { value: "orders", children: [
          "Pedidos (",
          orders.length,
          ")"
        ] }),
        /* @__PURE__ */ jsx(TabsTrigger, { value: "wallet", children: "Carteira" }),
        /* @__PURE__ */ jsxs(TabsTrigger, { value: "network", children: [
          "Rede (",
          downlines.length,
          ")"
        ] }),
        /* @__PURE__ */ jsx(TabsTrigger, { value: "docs", children: "Documentos" }),
        /* @__PURE__ */ jsx(TabsTrigger, { value: "automations", children: "Automações" })
      ] }),
      /* @__PURE__ */ jsxs(TabsContent, { value: "timeline", className: "grid grid-cols-1 lg:grid-cols-3 gap-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "lg:col-span-2 rounded-xl border border-border bg-card/60 p-5 space-y-4", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-sm font-semibold text-white", children: "Linha do Tempo e Histórico do Distribuidor" }),
          /* @__PURE__ */ jsx(Timeline, { events: tl })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "lg:col-span-1 rounded-xl border border-border bg-card/60 p-5 h-fit space-y-4 shadow-sm", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-sm font-semibold text-white", children: "Registrar Anotação de CRM" }),
          /* @__PURE__ */ jsxs("form", { onSubmit: handleAddNote, className: "space-y-3", children: [
            /* @__PURE__ */ jsx("textarea", { value: noteText, onChange: (e) => setNoteText(e.target.value), placeholder: "Insira notas de contato, pendências de suporte, acordos de rede...", className: "w-full h-24 bg-background border border-border rounded-lg p-2.5 text-xs text-foreground focus:ring-1 focus:ring-primary focus:outline-none" }),
            /* @__PURE__ */ jsx(Button, { type: "submit", size: "sm", className: "w-full", children: "Salvar Histórico" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsx(TabsContent, { value: "orders", children: /* @__PURE__ */ jsx("div", { className: "rounded-xl border border-border bg-card/40 overflow-hidden shadow-sm", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-sm", children: [
        /* @__PURE__ */ jsx("thead", { className: "bg-background/40 text-[11px] uppercase tracking-wider text-muted-foreground", children: /* @__PURE__ */ jsxs("tr", { children: [
          /* @__PURE__ */ jsx("th", { className: "px-4 py-2.5 text-left", children: "Nº Pedido" }),
          /* @__PURE__ */ jsx("th", { className: "px-4 py-2.5 text-left", children: "Status" }),
          /* @__PURE__ */ jsx("th", { className: "px-4 py-2.5 text-left", children: "Método de pagamento" }),
          /* @__PURE__ */ jsx("th", { className: "px-4 py-2.5 text-right", children: "Valor do pedido" }),
          /* @__PURE__ */ jsx("th", { className: "px-4 py-2.5 text-left", children: "Data de emissão" })
        ] }) }),
        /* @__PURE__ */ jsxs("tbody", { className: "divide-y divide-border/60 text-white/90", children: [
          orders.map((o) => /* @__PURE__ */ jsxs("tr", { className: "hover:bg-accent/30 transition-all", children: [
            /* @__PURE__ */ jsx("td", { className: "px-4 py-3 font-mono text-xs", children: o.numero_pedido || o.id.slice(0, 10) }),
            /* @__PURE__ */ jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsx("span", { className: "capitalize text-xs font-semibold px-2 py-0.5 rounded bg-muted text-foreground", children: o.status_pedido || o.status || "pendente" }) }),
            /* @__PURE__ */ jsxs("td", { className: "px-4 py-3 text-xs text-muted-foreground capitalize", children: [
              o.payment_method || "pix",
              " · ",
              o.payment_status || "pago"
            ] }),
            /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-right tabular-nums text-white font-medium", children: formatBRL(Number(o.valor_total_pedido || o.valor_total || 0)) }),
            /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-xs text-muted-foreground", children: o.created_at ? new Date(o.created_at).toLocaleDateString("pt-BR") : "-" })
          ] }, o.id)),
          orders.length === 0 && /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", { colSpan: 5, className: "px-4 py-12 text-center text-sm text-muted-foreground", children: "Sem pedidos cadastrados para esse cliente." }) })
        ] })
      ] }) }) }),
      /* @__PURE__ */ jsxs(TabsContent, { value: "wallet", className: "space-y-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "grid md:grid-cols-3 gap-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-border bg-card/60 p-5 space-y-2 relative overflow-hidden shadow-sm", children: [
            /* @__PURE__ */ jsx(Wallet, { className: "h-6 w-6 text-primary absolute right-4 top-4" }),
            /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground uppercase tracking-wider font-semibold", children: "Carteira Monetária (All In Pay)" }),
            wallet ? /* @__PURE__ */ jsxs("div", { className: "space-y-2 mt-2", children: [
              /* @__PURE__ */ jsx("p", { className: "text-3xl font-bold text-white", children: formatBRL(wallet.balance || 0) }),
              /* @__PURE__ */ jsxs("p", { className: "text-[11px] text-muted-foreground", children: [
                "Disponível para saque imediato: ",
                /* @__PURE__ */ jsx("strong", { className: "text-white", children: formatBRL(wallet.available_balance || 0) })
              ] })
            ] }) : /* @__PURE__ */ jsxs("div", { className: "pt-2", children: [
              /* @__PURE__ */ jsx("p", { className: "text-xs text-yellow-500 mb-2", children: "Carteira não inicializada neste distribuidor" }),
              /* @__PURE__ */ jsx(Button, { size: "sm", variant: "outline", onClick: handleCreateWallet, children: "Criar Carteira" })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-border bg-card/60 p-5 space-y-2 relative overflow-hidden shadow-sm", children: [
            /* @__PURE__ */ jsx(Coins, { className: "h-6 w-6 text-emerald-500 absolute right-4 top-4" }),
            /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground uppercase tracking-wider font-semibold", children: "Conta Fidelidade (Cashback/Network)" }),
            pointsWallet ? /* @__PURE__ */ jsxs("div", { className: "space-y-2 mt-2", children: [
              /* @__PURE__ */ jsxs("p", { className: "text-3xl font-bold text-emerald-400", children: [
                (pointsWallet.balance || 0).toLocaleString("pt-BR"),
                " PTS"
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "text-[10px] text-muted-foreground flex justify-between", children: [
                /* @__PURE__ */ jsxs("span", { children: [
                  "Ganhos: ",
                  pointsWallet.total_earned || 0
                ] }),
                /* @__PURE__ */ jsxs("span", { children: [
                  "Resgatados: ",
                  pointsWallet.total_redeemed || 0
                ] })
              ] })
            ] }) : /* @__PURE__ */ jsxs("div", { className: "pt-2", children: [
              /* @__PURE__ */ jsx("p", { className: "text-xs text-yellow-500 mb-2", children: "Carteira de Pontos não inicializada" }),
              /* @__PURE__ */ jsx(Button, { size: "sm", variant: "outline", onClick: handleCreatePointsWallet, children: "Criar Conta de Pontos" })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-border bg-card/60 p-5 flex flex-col justify-between shadow-sm", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("h4", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1", children: "Ações de Ajuste de Saldo" }),
              /* @__PURE__ */ jsx("p", { className: "text-[11px] text-muted-foreground", children: "Adicione créditos de bônus comercial, comissões de rede, ou debite por reajuste administrativo em lote." })
            ] }),
            /* @__PURE__ */ jsx(Button, { size: "sm", className: "mt-3 w-full", onClick: () => setShowAddTx(!showAddTx), disabled: !wallet, children: showAddTx ? "Esconder Lançador" : "Lançar Movimentação" })
          ] })
        ] }),
        showAddTx && /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-primary/30 bg-primary/5 p-5 max-w-xl transition-all shadow-md", children: [
          /* @__PURE__ */ jsx("h4", { className: "text-sm font-semibold mb-3 text-white", children: "Lançamento Financeiro Manual" }),
          /* @__PURE__ */ jsxs("form", { onSubmit: handleAddTransaction, className: "space-y-3", children: [
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("label", { className: "text-[10px] uppercase font-semibold text-muted-foreground", children: "Tipo" }),
                /* @__PURE__ */ jsxs("select", { value: txType, onChange: (e) => setTxType(e.target.value), className: "bg-background border border-border rounded-lg px-3 py-2 w-full text-xs text-foreground focus:outline-none", children: [
                  /* @__PURE__ */ jsx("option", { value: "credit", children: "Crédito (Acréscimo (+))" }),
                  /* @__PURE__ */ jsx("option", { value: "debit", children: "Débito (Retirada (-))" })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("label", { className: "text-[10px] uppercase font-semibold text-muted-foreground", children: "Valor (R$)" }),
                /* @__PURE__ */ jsx("input", { type: "number", step: "0.01", required: true, placeholder: "0.00", value: txAmount, onChange: (e) => setTxAmount(e.target.value), className: "bg-background border border-border rounded-lg px-3 py-2 w-full text-xs text-foreground focus:outline-none" })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "text-[10px] uppercase font-semibold text-muted-foreground", children: "Descrição / Motivo" }),
              /* @__PURE__ */ jsx("input", { type: "text", required: true, placeholder: "Ex: Pagamento de bônus binário residual ciclo maio", value: txDesc, onChange: (e) => setTxDesc(e.target.value), className: "bg-background border border-border rounded-lg px-3 py-2 w-full text-xs text-foreground focus:outline-none" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex justify-end gap-2 pt-2", children: [
              /* @__PURE__ */ jsx(Button, { type: "button", size: "xs", variant: "outline", onClick: () => setShowAddTx(false), children: "Cancelar" }),
              /* @__PURE__ */ jsx(Button, { type: "submit", size: "xs", children: "Confirmar Transação" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-sm font-semibold text-white", children: "Extrato Histórico da Carteira Financeira" }),
          /* @__PURE__ */ jsx("div", { className: "rounded-xl border border-border bg-card/40 overflow-hidden shadow-inner", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-sm", children: [
            /* @__PURE__ */ jsx("thead", { className: "bg-background/40 text-[11px] uppercase tracking-wider text-muted-foreground", children: /* @__PURE__ */ jsxs("tr", { children: [
              /* @__PURE__ */ jsx("th", { className: "px-4 py-2.5 text-left", children: "ID Ref" }),
              /* @__PURE__ */ jsx("th", { className: "px-4 py-2.5 text-left", children: "Data" }),
              /* @__PURE__ */ jsx("th", { className: "px-4 py-2.5 text-left", children: "Evento / Detalhes" }),
              /* @__PURE__ */ jsx("th", { className: "px-4 py-2.5 text-left", children: "Natureza" }),
              /* @__PURE__ */ jsx("th", { className: "px-4 py-2.5 text-right", children: "Valor" }),
              /* @__PURE__ */ jsx("th", { className: "px-4 py-2.5 text-right font-medium", children: "Saldo Resultante" })
            ] }) }),
            /* @__PURE__ */ jsxs("tbody", { className: "divide-y divide-border/60 text-white/90", children: [
              walletTransactions.map((tx) => /* @__PURE__ */ jsxs("tr", { className: "hover:bg-accent/30 transition-all", children: [
                /* @__PURE__ */ jsx("td", { className: "px-4 py-3 font-mono text-xs text-muted-foreground", children: tx.reference_id || tx.id.slice(0, 8) }),
                /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-xs text-muted-foreground", children: tx.created_at ? new Date(tx.created_at).toLocaleString("pt-BR") : "-" }),
                /* @__PURE__ */ jsxs("td", { className: "px-4 py-3 text-xs", children: [
                  /* @__PURE__ */ jsx("p", { className: "font-semibold text-white", children: tx.description || "Ajuste manual" }),
                  /* @__PURE__ */ jsx("p", { className: "text-[10px] text-muted-foreground", children: tx.reference_type || "ajuste" })
                ] }),
                /* @__PURE__ */ jsx("td", { className: "px-4 py-3", children: tx.transaction_type === "credit" ? /* @__PURE__ */ jsx(Badge, { className: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30 text-[9px] font-medium", children: "Crédito" }) : /* @__PURE__ */ jsx(Badge, { className: "bg-red-500/10 text-red-450 border-red-500/30 text-[9px] font-medium", children: "Débito" }) }),
                /* @__PURE__ */ jsxs("td", { className: cn("px-4 py-3 text-right font-bold tabular-nums", tx.transaction_type === "credit" ? "text-emerald-400" : "text-red-400"), children: [
                  tx.transaction_type === "credit" ? "+" : "-",
                  " ",
                  formatBRL(tx.amount || 0)
                ] }),
                /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-right font-medium text-white tabular-nums", children: formatBRL(tx.balance_after ?? 0) })
              ] }, tx.id)),
              walletTransactions.length === 0 && /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", { colSpan: 6, className: "px-4 py-12 text-center text-sm text-muted-foreground", children: "Nenhum lançamento ou movimentação financeira disponível no extrato desta conta." }) })
            ] })
          ] }) })
        ] })
      ] }),
      /* @__PURE__ */ jsx(TabsContent, { value: "network", children: /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h3", { className: "text-sm font-semibold text-white", children: "Parceiros da Rede (Indicações Diretas)" }),
            /* @__PURE__ */ jsxs("p", { className: "text-xs text-muted-foreground", children: [
              "Listagem em tempo real de distribuidores cujo sponsor direta é @",
              c.id_comprador || c.usuario
            ] })
          ] }),
          /* @__PURE__ */ jsxs(Badge, { variant: "outline", className: "px-2.5 py-1 text-xs text-white border-white/20", children: [
            downlines.length,
            " Diretos Cadastrados"
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "rounded-xl border border-border bg-card/45 overflow-hidden shadow-sm", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-sm", children: [
          /* @__PURE__ */ jsx("thead", { className: "bg-background/40 text-[11px] uppercase tracking-wider text-muted-foreground", children: /* @__PURE__ */ jsxs("tr", { children: [
            /* @__PURE__ */ jsx("th", { className: "px-4 py-2.5 text-left", children: "Distribuidor" }),
            /* @__PURE__ */ jsx("th", { className: "px-4 py-2.5 text-left", children: "Código / ID com." }),
            /* @__PURE__ */ jsx("th", { className: "px-4 py-2.5 text-left", children: "Graduação" }),
            /* @__PURE__ */ jsx("th", { className: "px-4 py-2.5 text-left", children: "Status de Conta" }),
            /* @__PURE__ */ jsx("th", { className: "px-4 py-2.5 text-left", children: "Cidade/UF" }),
            /* @__PURE__ */ jsx("th", { className: "px-4 py-2.5 text-left", children: "Data Cadastro" }),
            /* @__PURE__ */ jsx("th", { className: "px-4 py-2.5 text-right", children: "Ação" })
          ] }) }),
          /* @__PURE__ */ jsxs("tbody", { className: "divide-y divide-border/60 text-white/90", children: [
            downlines.map((dl) => /* @__PURE__ */ jsxs("tr", { className: "hover:bg-accent/30 transition-all", children: [
              /* @__PURE__ */ jsx("td", { className: "px-4 py-3 font-semibold text-white", children: dl.usuario || "Distribuidor S/N" }),
              /* @__PURE__ */ jsx("td", { className: "px-4 py-3 font-mono text-xs text-muted-foreground", children: dl.id_comprador || dl.id.slice(0, 8) }),
              /* @__PURE__ */ jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsx(Badge, { variant: "outline", className: "text-[10px]", children: dl.qualification || "Afiliado" }) }),
              /* @__PURE__ */ jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsx("span", { className: cn("inline-flex rounded-md border px-1.5 py-0.5 text-[10px] capitalize font-medium", statusStyles[dl.status || "pending"]), children: dl.status || "pending" }) }),
              /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-xs text-muted-foreground", children: dl.cidade && dl.estado ? `${dl.cidade}/${dl.estado}` : "-" }),
              /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-xs text-muted-foreground", children: dl.created_at ? new Date(dl.created_at).toLocaleDateString("pt-BR") : "-" }),
              /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-right", children: /* @__PURE__ */ jsxs(Link, { to: "/customers/$id", params: {
                id: dl.id
              }, className: "text-xs text-primary font-medium hover:underline inline-flex items-center gap-0.5", children: [
                "Ver 360 ",
                /* @__PURE__ */ jsx(ArrowUpRight, { className: "h-3 w-3" })
              ] }) })
            ] }, dl.id)),
            downlines.length === 0 && /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", { colSpan: 7, className: "px-4 py-12 text-center text-sm text-muted-foreground", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center gap-2 py-4", children: [
              /* @__PURE__ */ jsx(Users, { className: "h-8 w-8 text-muted-foreground/60" }),
              /* @__PURE__ */ jsx("p", { className: "font-semibold text-foreground", children: "Sem indicações diretas" }),
              /* @__PURE__ */ jsx("span", { className: "text-xs text-muted-foreground", children: "Esse distribuidor ainda não possui indicados ou downlines posicionados em sua rede de bônus." })
            ] }) }) })
          ] })
        ] }) })
      ] }) }),
      /* @__PURE__ */ jsx(TabsContent, { value: "docs", children: /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h3", { className: "text-sm font-semibold text-white", children: "Compliance Regulatório e Documentação" }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Controle, auditoria e validação de envios obrigatórios para garantir repasse legal e fiscal de comissões" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [
          /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-border bg-card/60 p-5 space-y-4 shadow-sm", children: [
            /* @__PURE__ */ jsx("h4", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider", children: "Lista de Envio de Documentos" }),
            /* @__PURE__ */ jsx("div", { className: "space-y-3", children: documents.map((doc) => /* @__PURE__ */ jsxs("div", { className: "p-3 border border-border bg-background/20 rounded-lg flex items-center justify-between gap-4", children: [
              /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsx("span", { className: "font-medium text-xs truncate text-white", children: doc.name }),
                  doc.required && /* @__PURE__ */ jsx(Badge, { className: "text-[9px] bg-red-500/15 text-red-450 border-red-500/30 shrink-0", children: "Obrigatório" })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "text-[10px] text-muted-foreground flex flex-wrap items-center gap-2 mt-1", children: [
                  /* @__PURE__ */ jsxs("span", { children: [
                    "Tipo: ",
                    doc.type || "-"
                  ] }),
                  doc.updatedAt && /* @__PURE__ */ jsxs(Fragment, { children: [
                    /* @__PURE__ */ jsx("span", { children: "•" }),
                    /* @__PURE__ */ jsxs("span", { children: [
                      "Atualizado: ",
                      new Date(doc.updatedAt).toLocaleDateString("pt-BR")
                    ] })
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 shrink-0", children: [
                doc.status === "approved" && /* @__PURE__ */ jsxs(Badge, { className: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30 text-[10px] flex items-center gap-1", children: [
                  /* @__PURE__ */ jsx(CheckCircle2, { className: "h-3 w-3" }),
                  " Aprovado"
                ] }),
                doc.status === "pending" && /* @__PURE__ */ jsxs(Badge, { className: "bg-amber-500/10 text-amber-500 border-amber-500/30 text-[10px] flex items-center gap-1", children: [
                  /* @__PURE__ */ jsx(Clock, { className: "h-3 w-3 animate-pulse" }),
                  " Pendente"
                ] }),
                doc.status === "missing" && /* @__PURE__ */ jsx(Badge, { className: "bg-zinc-500/10 text-zinc-400 border-zinc-500/30 text-[10px]", children: "Não Enviado" }),
                /* @__PURE__ */ jsxs("div", { className: "flex gap-1", children: [
                  doc.status !== "approved" && /* @__PURE__ */ jsx(Button, { size: "icon", variant: "outline", className: "h-7 w-7 text-emerald-500 hover:text-emerald-400 hover:bg-emerald-500/10", onClick: () => {
                    const updated = documents.map((d) => d.id === doc.id ? {
                      ...d,
                      status: "approved",
                      type: "PDF",
                      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
                    } : d);
                    setDocuments(updated);
                    toast.success(`Documento "${doc.name}" aprovado com sucesso.`);
                  }, title: "Aprovar Documento", children: /* @__PURE__ */ jsx(CheckCircle2, { className: "h-3.5 w-3.5" }) }),
                  doc.status !== "missing" && /* @__PURE__ */ jsx(Button, { size: "icon", variant: "outline", className: "h-7 w-7 text-red-500 hover:text-red-400 hover:bg-red-500/10", onClick: () => {
                    const updated = documents.map((d) => d.id === doc.id ? {
                      ...d,
                      status: "missing",
                      type: "-",
                      updatedAt: null
                    } : d);
                    setDocuments(updated);
                    toast.warning(`Documento "${doc.name}" removido ou reprovado.`);
                  }, title: "Recusar / Excluir", children: /* @__PURE__ */ jsx(Trash2, { className: "h-3.5 w-3.5" }) }),
                  doc.status === "missing" && /* @__PURE__ */ jsx(Button, { size: "icon", variant: "outline", className: "h-7 w-7 text-primary hover:text-primary hover:bg-primary/10", onClick: () => {
                    const updated = documents.map((d) => d.id === doc.id ? {
                      ...d,
                      status: "pending",
                      type: "PDF",
                      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
                    } : d);
                    setDocuments(updated);
                    toast.info(`Documento "${doc.name}" enviado para análise de compliance.`);
                  }, title: "Simular Upload", children: /* @__PURE__ */ jsx(Upload, { className: "h-3.5 w-3.5" }) })
                ] })
              ] })
            ] }, doc.id)) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-border bg-card/60 p-5 space-y-4 flex flex-col justify-between shadow-sm", children: [
            /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
              /* @__PURE__ */ jsx("h4", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider text-white", children: "Compliance Geral de Cadastro" }),
              /* @__PURE__ */ jsxs("div", { className: "p-4 border border-border/60 bg-background/30 rounded-lg flex items-center gap-3", children: [
                /* @__PURE__ */ jsx(Shield, { className: "h-10 w-10 text-emerald-500 shrink-0" }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("p", { className: "text-sm font-semibold text-white", children: "Identidade Parcialmente Aprovada" }),
                  /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Status atual autoriza o recebimento de comissões passivas de rede em pontos, mas bloqueia resgates monetários até aprovação da conta bancária e envio do comprovante de endereço." })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "text-xs text-muted-foreground space-y-1.5 p-3 rounded-lg border border-border/40", children: [
                /* @__PURE__ */ jsx("p", { className: "text-white", children: /* @__PURE__ */ jsx("strong", { children: "Notas de Compliance:" }) }),
                /* @__PURE__ */ jsxs("p", { children: [
                  "1. O documento bancário deve estar no CPF/CNPJ titular cadastrado (",
                  c.metadata?.cpf || c.cpf || "CPF ausente",
                  "). Não são permitidos pagamentos para terceiros."
                ] }),
                /* @__PURE__ */ jsx("p", { children: "2. Os limites anuais de pagamento tributado são recalculados com base no envio do PIS/NIT para recolhimento de INSS." })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "border-t border-border pt-4 flex gap-2", children: [
              /* @__PURE__ */ jsx(Button, { size: "sm", variant: "outline", className: "flex-1 text-white border-white/20", onClick: () => {
                setDocuments(documents.map((d) => ({
                  ...d,
                  status: "approved",
                  type: "PDF",
                  updatedAt: (/* @__PURE__ */ new Date()).toISOString()
                })));
                toast.success("Todos os documentos regulatórios foram aprovados automaticamente!");
              }, children: "Aprovar Todos" }),
              /* @__PURE__ */ jsx(Button, { size: "sm", className: "flex-1 animate-pulse", onClick: () => {
                toast.success("Exportado relatório legal desta conta!");
              }, children: "Exportar Compliance" })
            ] })
          ] })
        ] })
      ] }) }),
      /* @__PURE__ */ jsx(TabsContent, { value: "automations", children: /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h3", { className: "text-sm font-semibold text-white", children: "Réguas e Gatilhos de Comunicação Ativas" }),
            /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Monitore o relacionamento do distribuidor através dos disparos sistêmicos de notificação" })
          ] }),
          /* @__PURE__ */ jsx(Button, { size: "sm", variant: "outline", className: "text-xs text-white border-white/20", onClick: () => {
            toast.success("Estatísticas de disparo limpas e reiniciadas!");
          }, children: "Limpar Logs" })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4", children: automations.map((aut) => /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-border bg-card/60 p-4 space-y-3 flex flex-col justify-between shadow-sm", children: [
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-2", children: [
              /* @__PURE__ */ jsx(Badge, { className: "text-[10px] bg-primary/10 text-primary border-primary/20 shrink-0", children: aut.type }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxs("span", { className: "text-[10px] text-muted-foreground shrink-0", children: [
                  "Runs: ",
                  /* @__PURE__ */ jsx("strong", { className: "text-white", children: aut.runs })
                ] }),
                /* @__PURE__ */ jsx("button", { type: "button", onClick: () => {
                  const updated = automations.map((a) => a.id === aut.id ? {
                    ...a,
                    active: !a.active
                  } : a);
                  setAutomations(updated);
                  toast.success(`Automação "${aut.name}" ${!aut.active ? "ativada" : "pausada"}.`);
                }, className: "focus:outline-none shrink-0", children: aut.active ? /* @__PURE__ */ jsx(Badge, { className: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30 text-[9px] font-bold", children: "Ativo" }) : /* @__PURE__ */ jsx(Badge, { className: "bg-zinc-500/10 text-zinc-400 border-zinc-500/30 text-[9px] font-bold", children: "Pausado" }) })
              ] })
            ] }),
            /* @__PURE__ */ jsx("h4", { className: "font-semibold text-xs text-white truncate", children: aut.name }),
            /* @__PURE__ */ jsx("p", { className: "text-[11px] text-muted-foreground leading-relaxed line-clamp-2", children: aut.description })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "border-t border-border pt-3 flex items-center justify-between", children: [
            /* @__PURE__ */ jsx("button", { onClick: () => {
              const updated = automations.map((a) => a.id === aut.id ? {
                ...a,
                active: !a.active
              } : a);
              setAutomations(updated);
              toast.success(`Gatilho de rede "${aut.name}" foi ${!aut.active ? "ativado" : "desativado"}.`);
            }, className: "text-[11px] text-muted-foreground font-semibold hover:text-white transition-all", children: "Alternar" }),
            /* @__PURE__ */ jsx(Button, { size: "sm", variant: "ghost", className: "h-7 text-[11px] text-primary hover:bg-primary/10 font-bold", onClick: () => {
              const updated = automations.map((a) => a.id === aut.id ? {
                ...a,
                runs: a.runs + 1
              } : a);
              setAutomations(updated);
              toast.success(`Disparando webhook/mensagem para ${getCustomerLabel(c)} com sucesso.`);
            }, children: "Forçar Gatilho" })
          ] })
        ] }, aut.id)) })
      ] }) })
    ] })
  ] });
}
export {
  Customer360 as component
};
