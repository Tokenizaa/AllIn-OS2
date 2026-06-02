import { o as objectType, s as stringType, n as numberType, r as recordType, a as anyType, e as enumType } from "../_libs/zod.mjs";
objectType({
  id: stringType().uuid(),
  order_id: stringType().uuid(),
  customer_id: stringType().uuid(),
  amount: numberType(),
  status: enumType(["pending", "processing", "approved", "rejected", "refunded", "cancelled", "failed"]),
  payment_method: stringType(),
  payment_gateway: stringType(),
  gateway_transaction_id: stringType().nullable(),
  gateway_response: recordType(anyType()).nullable(),
  metadata: recordType(anyType()).nullable().optional(),
  amount_paid: numberType().nullable().optional(),
  currency: stringType().optional(),
  payment_method_type: stringType().optional(),
  paid_at: stringType().datetime().nullable(),
  refunded_at: stringType().datetime().nullable().optional(),
  cancelled_at: stringType().datetime().nullable().optional(),
  created_at: stringType().datetime(),
  updated_at: stringType().datetime()
});
const createPaymentSchema = objectType({
  order_id: stringType().uuid(),
  customer_id: stringType().uuid(),
  amount: numberType().min(0),
  payment_method: stringType(),
  payment_gateway: stringType()
});
const updatePaymentSchema = objectType({
  status: enumType(["pending", "processing", "approved", "rejected", "refunded", "cancelled", "failed"]).optional(),
  gateway_transaction_id: stringType().optional(),
  gateway_response: recordType(anyType()).optional(),
  metadata: recordType(anyType()).optional(),
  amount_paid: numberType().optional(),
  currency: stringType().optional(),
  payment_method_type: stringType().optional(),
  paid_at: stringType().datetime().optional(),
  refunded_at: stringType().datetime().optional(),
  cancelled_at: stringType().datetime().optional()
});
const webhookPayloadSchema = objectType({
  event: stringType(),
  data: recordType(anyType()),
  timestamp: stringType()
});
export {
  createPaymentSchema as c,
  updatePaymentSchema as u,
  webhookPayloadSchema as w
};
