import { z } from 'zod';
import { paymentService } from '../../backend/modules/payments/services/payment.service';
import { hybridPaymentService } from '../../backend/modules/payments/services/hybrid-payment.service';
import { paymentSplitService } from '../../backend/modules/payments/services/payment-split.service';
import { financialAuditService } from '../../backend/modules/payments/services/financial-audit.service';

// Validation schemas
const createPaymentSchema = z.object({
  customerId: z.string().uuid(),
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
  customerId: z.string().uuid(),
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
    const result = await paymentService.createPayment(parsed, parsed.gatewayType);
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to create payment' };
  }
};

// Create hybrid payment
export const createHybridPayment = async (data: any) => {
  const parsed = hybridPaymentSchema.parse(data);
  try {
    const result = await hybridPaymentService.processHybridPayment(parsed);
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to process hybrid payment' };
  }
};

// Get hybrid payment preview
export const getHybridPaymentPreview = async (data: {
  customerId: string;
  originalAmount: number;
  useWallet?: boolean;
  useBonus?: boolean;
  usePoints?: boolean;
  couponCode?: string;
  productId?: string;
  categoryId?: string;
}) => {
  const parsed = z.object({
    customerId: z.string().uuid(),
    originalAmount: z.number().positive(),
    useWallet: z.boolean().default(false),
    useBonus: z.boolean().default(false),
    usePoints: z.boolean().default(false),
    couponCode: z.string().optional(),
    productId: z.string().optional(),
    categoryId: z.string().optional(),
  }).parse(data);

  try {
    const result = await hybridPaymentService.calculateHybridPaymentPreview(
      parsed.customerId,
      parsed.originalAmount,
      parsed.useWallet,
      parsed.useBonus,
      parsed.usePoints,
      parsed.couponCode,
      parsed.productId,
      parsed.categoryId
    );
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to calculate preview' };
  }
};

// Get payment by ID
export const getPayment = async (data: { id: string }) => {
  const parsed = z.object({ id: z.string().uuid() }).parse(data);
  try {
    const result = await paymentService.findById(parsed.id);
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to get payment' };
  }
};

// Get payments by customer
export const getCustomerPayments = async (data: {
  customerId: string;
  page?: number;
  limit?: number;
  status?: string;
}) => {
  const parsed = z.object({
    customerId: z.string().uuid(),
    page: z.number().default(1),
    limit: z.number().default(20),
    status: z.string().optional(),
  }).parse(data);

  try {
    const result = await paymentService.findAll({
      customer_id: parsed.customerId,
      status: parsed.status,
      page: parsed.page,
      limit: parsed.limit,
    });
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to get payments' };
  }
};

// Get payment statistics
export const getPaymentStats = async () => {
  try {
    const result = await paymentService.getStats();
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to get statistics' };
  }
};

// Create payment split
export const createPaymentSplit = async (data: any) => {
  const parsed = paymentSplitSchema.parse(data);
  try {
    const result = await paymentSplitService.createPaymentSplit(
      parsed.paymentId,
      parsed.totalAmount,
      parsed.splits
    );
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to create payment split' };
  }
};

// Process payment split
export const processPaymentSplit = async (data: { splitId: string }) => {
  const parsed = z.object({ splitId: z.string().uuid() }).parse(data);
  try {
    const result = await paymentSplitService.processSplitPayment(parsed.splitId);
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to process payment split' };
  }
};

// Get payment splits
export const getPaymentSplits = async (data: { paymentId: string }) => {
  const parsed = z.object({ paymentId: z.string().uuid() }).parse(data);
  try {
    const result = await paymentSplitService.getPaymentSplits(parsed.paymentId);
    return { success: true, data: result };
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
    const result = await financialAuditService.getFinancialSummary(
      new Date(parsed.startDate),
      new Date(parsed.endDate)
    );
    return { success: true, data: result };
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
    const result = await financialAuditService.getAuditLogs(
      parsed.entityType,
      parsed.entityId,
      parsed.userId,
      parsed.limit,
      parsed.offset
    );
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to get audit logs' };
  }
};

// Retry payment
export const retryPayment = async (data: { paymentId: string }) => {
  const parsed = z.object({ paymentId: z.string().uuid() }).parse(data);
  try {
    const result = await paymentService.retryPayment(parsed.paymentId);
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to retry payment' };
  }
};
