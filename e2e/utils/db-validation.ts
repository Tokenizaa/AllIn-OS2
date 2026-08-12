import { getSupabaseAdmin } from "./supabase-admin";
import { e2eEnv } from "./env";

const admin = getSupabaseAdmin();

function isUuidLike(value: unknown): boolean {
  if (typeof value !== "string") return false;
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);
}

function isIdCompradorLike(value: unknown): boolean {
  if (typeof value !== "string") return false;
  return /^[A-Z]{2}-\d{4,}$/i.test(value) || /^\d{6,}$/.test(value);
}

export interface BusinessValidationResult {
  screen: string;
  passed: boolean;
  issues: string[];
  details: Record<string, unknown>;
}

export async function fetchCustomerByIdComprador(idComprador: string) {
  const { data } = await admin.schema("crm").from("customers").select("*").eq("id_comprador", idComprador).single();
  return data;
}

export async function fetchDistributorById(id: string) {
  const { data } = await admin.schema("mlm").from("distribuidores").select("*").eq("id", id).single();
  return data;
}

export async function fetchOrderById(id: string) {
  const { data } = await admin.schema("commerce").from("pedidos").select("*").eq("id", id).single();
  return data;
}

export async function fetchWalletByIdComprador(idComprador: string) {
  const { data } = await admin.schema("finance").from("wallets").select("*").eq("id_comprador", idComprador).single();
  return data;
}

export async function fetchPlanById(id: string) {
  const { data } = await admin.schema("mlm").from("planos").select("*").eq("id", id).single();
  return data;
}

export function validateNoTechnicalData(screen: string, data: Record<string, unknown>): string[] {
  const issues: string[] = [];
  for (const [key, value] of Object.entries(data)) {
    if (value == null) continue;
    if (typeof value === "object") {
      issues.push(...validateNoTechnicalData(screen, value as Record<string, unknown>));
      continue;
    }
    const str = String(value);
    if (isUuidLike(str) && !key.toLowerCase().includes("id_comprador") && !key.toLowerCase().includes("auth_user")) {
      issues.push(`[${screen}] UUID exposto em campo '${key}': ${str.slice(0, 8)}...`);
    }
    if (/^(undefined|null|NaN)$/.test(str)) {
      issues.push(`[${screen}] Valor técnico em '${key}': ${str}`);
    }
  }
  return issues;
}

export function validateDisplayName(screen: string, data: Record<string, unknown>): string[] {
  const issues: string[] = [];
  for (const [key, value] of Object.entries(data)) {
    if (value == null || typeof value !== "string") continue;
    const lowerKey = key.toLowerCase();
    const str = value.trim();
    if ((lowerKey.includes("nome") || lowerKey.includes("name")) && !lowerKey.includes("razao") && !lowerKey.includes("fantasia")) {
      if (str.length < 2) issues.push(`[${screen}] Nome muito curto em '${key}': '${str}'`);
      if (/@/.test(str) && !lowerKey.includes("email")) issues.push(`[${screen}] Email usado como nome em '${key}': ${str}`);
    }
  }
  return issues;
}

export function formatCurrency(value: number | string | null): string {
  const num = typeof value === "string" ? parseFloat(value) : value;
  if (isNaN(num)) return String(value);
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(num);
}

export function formatDate(value: string | null): string {
  if (!value) return "(vazio)";
  const d = new Date(value);
  if (isNaN(d.getTime())) return String(value);
  return d.toLocaleDateString("pt-BR");
}

export function formatPhone(value: string | null): string {
  if (!value) return "(vazio)";
  const digits = value.replace(/\D/g, "");
  if (digits.length === 11) return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  if (digits.length === 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  return value;
}

export function formatCPF(value: string | null): string {
  if (!value) return "(vazio)";
  const digits = value.replace(/\D/g, "");
  if (digits.length === 11) return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
  return value;
}

export function formatCEP(value: string | null): string {
  if (!value) return "(vazio)";
  const digits = value.replace(/\D/g, "");
  if (digits.length === 8) return `${digits.slice(0, 5)}-${digits.slice(5)}`;
  return value;
}

export async function validateOrderData(orderId: string): Promise<BusinessValidationResult> {
  const [order, customer, items] = await Promise.all([
    fetchOrderById(orderId),
    admin.schema("crm").from("customers").select("id, nome, email, id_comprador").eq("id", (await fetchOrderById(orderId))?.cliente_id ?? "").single(),
    admin.schema("commerce").from("pedidos_itens").select("*").eq("pedido_id", orderId),
  ]);

  const issues: string[] = [];
  if (!order) return { screen: `order:${orderId}`, passed: false, issues: ["Pedido não encontrado"], details: {} };

  const custName = customer?.data?.nome;
  if (!custName && order.cliente_nome) issues.push(`Cliente sem nome (cliente_id=${order.cliente_id})`);
  if (!order.cliente_nome && custName) issues.push(`Pedido sem cache de nome do cliente`);

  if (order.valor_total == null || parseFloat(order.valor_total) < 0) issues.push("Valor total inválido");
  if (!order.numero_pedido) issues.push("Número do pedido ausente");

  const itemsCount = items.data?.length ?? 0;
  if (itemsCount === 0) issues.push("Pedido sem itens");

  issues.push(...validateNoTechnicalData(`order:${orderId}`, order as Record<string, unknown>));

  return {
    screen: `order:${orderId}`,
    passed: issues.length === 0,
    issues,
    details: {
      numero: order.numero_pedido,
      cliente_nome: order.cliente_nome ?? custName,
      valor_total: formatCurrency(order.valor_total),
      itens: itemsCount,
      status: order.status_pedido,
      data_criacao: formatDate(order.data_criacao),
    },
  };
}

export async function validateDistributorData(distributorId: string): Promise<BusinessValidationResult> {
  const { data: dist } = await admin.schema("mlm").from("distribuidores").select("*").eq("id", distributorId).single();
  if (!dist) return { screen: `distributor:${distributorId}`, passed: false, issues: ["Distribuidor não encontrado"], details: {} };

  const issues: string[] = [];
  if (!dist.nome || dist.nome.length < 2) issues.push("Nome do distribuidor ausente ou muito curto");
  if (!dist.usuario) issues.push("Username ausente");
  if (!dist.cidade) issues.push("Cidade ausente");

  const plan = await admin.schema("mlm").from("planos_distribuidores").select("*").eq("distribuidor_id", distributorId).single();
  if (!plan.data && dist.status !== "pending") issues.push("Plano do distribuidor não encontrado");

  if (dist.patrocinador_id) {
    const sponsor = await admin.schema("crm").from("customers").select("nome, id_comprador").eq("id_comprador", dist.patrocinador_id).single();
    if (!sponsor.data?.nome) issues.push(`Sponsor não encontrado: ${dist.patrocinador_id}`);
  }

  issues.push(...validateNoTechnicalData(`distributor:${distributorId}`, dist as Record<string, unknown>));

  return {
    screen: `distributor:${distributorId}`,
    passed: issues.length === 0,
    issues,
    details: {
      nome: dist.nome,
      usuario: dist.usuario,
      cidade: dist.cidade,
      status: dist.status,
      plano: plan.data?.status ?? "sem plano",
      patrocinador: dist.patrocinador_id,
    },
  };
}

export async function validateCustomerData(customerId: string): Promise<BusinessValidationResult> {
  const { data: cust } = await admin.schema("crm").from("customers").select("*").eq("id", customerId).single();
  if (!cust) return { screen: `customer:${customerId}`, passed: false, issues: ["Cliente não encontrado"], details: {} };

  const issues: string[] = [];
  if (!cust.nome || cust.nome.length < 2) issues.push("Nome do cliente ausente");
  if (!cust.email) issues.push("Email do cliente ausente");
  if (!isIdCompradorLike(cust.id_comprador)) issues.push(`id_comprador em formato inválido: ${cust.id_comprador}`);

  issues.push(...validateNoTechnicalData(`customer:${customerId}`, cust as Record<string, unknown>));

  return {
    screen: `customer:${customerId}`,
    passed: issues.length === 0,
    issues,
    details: {
      nome: cust.nome,
      email: cust.email,
      cidade: cust.cidade,
      uf: cust.numero?.slice(0, 2),
      tipo_cliente: cust.tipo_cliente,
      id_comprador: cust.id_comprador,
    },
  };
}
