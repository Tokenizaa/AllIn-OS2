import { z } from 'zod';
import { supabase } from '@/lib/supabase-client';

// Validation schemas
const createPaymentSchema = z.object({
  idComprador: z.string(),
  orderId: z.string().uuid().optional(),
  amount: z.number().positive(),
  currency: z.string().default('BRL'),
  paymentMethod: z.enum(['pix', 'boleto', 'card', 'cash']),
  gatewayType: z.enum(['belluno', 'pagseguro']),
  customer: z.object({
    name: z.string(),
    email: z.string().email(),
    phone: z.string().optional(),
    cpf: z.string().optional(),
  }).optional(),
  card: z.any().optional(),
  boleto: z.any().optional(),
  pix: z.any().optional(),
});

const hybridPaymentSchema = z.object({
  idComprador: z.string(),
  orderId: z.string().uuid().optional(),
  originalAmount: z.number().positive(),
  currency: z.string().default('BRL'),
  paymentMethod: z.enum(['pix', 'boleto', 'card', 'cash']),
  gatewayType: z.enum(['belluno', 'pagseguro']),
  customer: z.object({
    name: z.string(),
    email: z.string().email(),
    phone: z.string().optional(),
    cpf: z.string().optional(),
  }).optional(),
  card: z.any().optional(),
  boleto: z.any().optional(),
  pix: z.any().optional(),
  useWallet: z.boolean().default(false),
  useBonus: z.boolean().default(false),
  usePoints: z.boolean().default(false),
  couponCode: z.string().optional(),
  productId: z.string().optional(),
  categoryId: z.string().optional(),
});

const paymentSplitSchema = z.object({
  paymentId: z.string().uuid(),
  totalAmount: z.number().positive(),
  splits: z.array(z.object({
    recipientId: z.string().uuid(),
    recipientType: z.enum(['distributor', 'company', 'affiliate']),
    recipientName: z.string(),
    percentage: z.number().min(0).max(100),
    fixedAmount: z.number().optional(),
    priority: z.number().default(0),
  })),
});

// Create payment
export const createPayment = async (data: any) => {
  const parsed = createPaymentSchema.parse(data);
  try {
    const { data: payment, error } = await supabase.rpc('create_payment', {
      p_id_comprador: parsed.idComprador,
      p_order_id: parsed.orderId,
      p_amount: parsed.amount,
      p_currency: parsed.currency,
      p_payment_method: parsed.paymentMethod,
      p_gateway_type: parsed.gatewayType,
      p_customer: parsed.customer,
      p_card: parsed.card,
      p_boleto: parsed.boleto,
      p_pix: parsed.pix,
    });
    
    if (error) throw error;
    return { success: true, data: payment };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to create payment' };
  }
};

// Create hybrid payment
export const createHybridPayment = async (data: any) => {
  const parsed = hybridPaymentSchema.parse(data);
  try {
    const { data: payment, error } = await supabase.rpc('process_hybrid_payment', {
      p_id_comprador: parsed.idComprador,
      p_order_id: parsed.orderId,
      p_original_amount: parsed.originalAmount,
      p_currency: parsed.currency,
      p_payment_method: parsed.paymentMethod,
      p_gateway_type: parsed.gatewayType,
      p_customer: parsed.customer,
      p_card: parsed.card,
      p_boleto: parsed.boleto,
      p_pix: parsed.pix,
      p_use_wallet: parsed.useWallet,
      p_use_bonus: parsed.useBonus,
      p_use_points: parsed.usePoints,
      p_coupon_code: parsed.couponCode,
      p_product_id: parsed.productId,
      p_category_id: parsed.categoryId,
    });
    
    if (error) throw error;
    return { success: true, data: payment };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to process hybrid payment' };
  }
};

// Get hybrid payment preview
export const getHybridPaymentPreview = async (data: {
  idComprador: string;
  originalAmount: number;
  useWallet?: boolean;
  useBonus?: boolean;
  usePoints?: boolean;
  couponCode?: string;
  productId?: string;
  categoryId?: string;
}) => {
  const parsed = z.object({
    idComprador: z.string(),
    originalAmount: z.number().positive(),
    useWallet: z.boolean().default(false),
    useBonus: z.boolean().default(false),
    usePoints: z.boolean().default(false),
    couponCode: z.string().optional(),
    productId: z.string().optional(),
    categoryId: z.string().optional(),
  }).parse(data);

  try {
    const { data: preview, error } = await supabase.rpc('calculate_hybrid_payment_preview', {
      p_id_comprador: parsed.idComprador,
      p_original_amount: parsed.originalAmount,
      p_use_wallet: parsed.useWallet,
      p_use_bonus: parsed.useBonus,
      p_use_points: parsed.usePoints,
      p_coupon_code: parsed.couponCode,
      p_product_id: parsed.productId,
      p_category_id: parsed.categoryId,
    });
    
    if (error) throw error;
    return { success: true, data: preview };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to calculate preview' };
  }
};

// Get payment by ID
export const getPayment = async (data: { id: string }) => {
  const parsed = z.object({ id: z.string().uuid() }).parse(data);
  try {
    const { data: payment, error } = await supabase
      .schema('commerce')
      .from('payments')
      .select('*')
      .eq('id', parsed.id)
      .single();
    
    if (error) throw error;
    return { success: true, data: payment };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to get payment' };
  }
};

// Get payments by customer
export const getCustomerPayments = async (data: {
  idComprador: string;
  page?: number;
  limit?: number;
  status?: string;
}) => {
  const parsed = z.object({
    idComprador: z.string(),
    page: z.number().default(1),
    limit: z.number().default(20),
    status: z.string().optional(),
  }).parse(data);

  try {
    const from = (parsed.page - 1) * parsed.limit;
    const to = from + parsed.limit - 1;

    let query = supabase
      .schema('commerce')
      .from('payments')
      .select('*')
      .eq('id_comprador', parsed.idComprador);
    
    if (parsed.status) {
      query = query.eq('status', parsed.status);
    }
    
    const { data: payments, error } = await query
      .order('created_at', { ascending: false })
      .range(from, to);
    
    if (error) throw error;
    return { success: true, data: payments || [] };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to get payments' };
  }
};

// Get payment statistics
export const getPaymentStats = async () => {
  try {
    const { data: stats, error } = await supabase.rpc('get_payment_stats');
    
    if (error) throw error;
    return { success: true, data: stats };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to get statistics' };
  }
};

// Create payment split
export const createPaymentSplit = async (data: any) => {
  const parsed = paymentSplitSchema.parse(data);
  try {
    const { data: split, error } = await supabase.rpc('create_payment_split', {
      p_payment_id: parsed.paymentId,
      p_total_amount: parsed.totalAmount,
      p_splits: parsed.splits,
    });
    
    if (error) throw error;
    return { success: true, data: split };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to create payment split' };
  }
};

// Process payment split
export const processPaymentSplit = async (data: { splitId: string }) => {
  const parsed = z.object({ splitId: z.string().uuid() }).parse(data);
  try {
    const { data: result, error } = await supabase.rpc('process_split_payment', {
      p_split_id: parsed.splitId,
    });
    
    if (error) throw error;
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to process payment split' };
  }
};

// Get payment splits
export const getPaymentSplits = async (data: { paymentId: string }) => {
  const parsed = z.object({ paymentId: z.string().uuid() }).parse(data);
  try {
    const { data: splits, error } = await supabase
      .schema('commerce')
      .from('payment_splits')
      .select('*')
      .eq('payment_id', parsed.paymentId);
    
    if (error) throw error;
    return { success: true, data: splits || [] };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to get payment splits' };
  }
};

// Get financial summary
export const getFinancialSummary = async (data: { startDate: string; endDate: string }) => {
  const parsed = z.object({
    startDate: z.string(),
    endDate: z.string(),
  }).parse(data);

  try {
    const { data: summary, error } = await supabase.rpc('get_financial_summary', {
      p_start_date: parsed.startDate,
      p_end_date: parsed.endDate,
    });
    
    if (error) throw error;
    return { success: true, data: summary };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to get financial summary' };
  }
};

// Get audit logs
export const getAuditLogs = async (data: {
  entityType?: string;
  entityId?: string;
  userId?: string;
  limit?: number;
  offset?: number;
}) => {
  const parsed = z.object({
    entityType: z.string().optional(),
    entityId: z.string().optional(),
    userId: z.string().optional(),
    limit: z.number().default(100),
    offset: z.number().default(0),
  }).parse(data);

  try {
    let query = supabase
      .schema('commerce')
      .from('financial_audit_logs')
      .select('*')
      .range(parsed.offset, parsed.offset + parsed.limit - 1);
    
    if (parsed.entityType) {
      query = query.eq('entity_type', parsed.entityType);
    }
    if (parsed.entityId) {
      query = query.eq('entity_id', parsed.entityId);
    }
    if (parsed.userId) {
      query = query.eq('user_id', parsed.userId);
    }
    
    const { data: logs, error } = await query.order('created_at', { ascending: false });
    
    if (error) throw error;
    return { success: true, data: logs || [] };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to get audit logs' };
  }
};

// Retry payment
export const retryPayment = async (data: { paymentId: string }) => {
  const parsed = z.object({ paymentId: z.string().uuid() }).parse(data);
  try {
    const { data: result, error } = await supabase.rpc('retry_payment', {
      p_payment_id: parsed.paymentId,
    });
    
    if (error) throw error;
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to retry payment' };
  }
};
