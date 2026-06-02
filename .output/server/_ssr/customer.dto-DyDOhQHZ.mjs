import { o as objectType, s as stringType, e as enumType, n as numberType } from "../_libs/zod.mjs";
objectType({
  id: stringType().uuid(),
  name: stringType().min(1),
  email: stringType().email(),
  phone: stringType().optional(),
  cpf: stringType().optional(),
  status: enumType(["active", "inactive", "pending", "suspended"]),
  plan_id: stringType().uuid().nullable(),
  sponsor_id: stringType().uuid().nullable(),
  created_at: stringType().datetime(),
  updated_at: stringType().datetime()
});
const createCustomerSchema = objectType({
  name: stringType().min(1),
  email: stringType().email(),
  phone: stringType().optional(),
  cpf: stringType().optional(),
  sponsor_id: stringType().uuid().optional(),
  plan_id: stringType().uuid().optional()
});
const updateCustomerSchema = objectType({
  name: stringType().min(1).optional(),
  email: stringType().email().optional(),
  phone: stringType().optional(),
  cpf: stringType().optional(),
  status: enumType(["active", "inactive", "pending", "suspended"]).optional(),
  plan_id: stringType().uuid().nullable().optional()
});
objectType({
  id: stringType().uuid(),
  name: stringType(),
  email: stringType(),
  phone: stringType().nullable(),
  cpf: stringType().nullable(),
  status: stringType(),
  plan_id: stringType().nullable(),
  plan_name: stringType().nullable(),
  plan_status: stringType().nullable(),
  sponsor_id: stringType().nullable(),
  sponsor_name: stringType().nullable(),
  total_orders: numberType(),
  total_revenue: numberType(),
  total_downlines: numberType(),
  network_level: numberType(),
  created_at: stringType(),
  activated_at: stringType().nullable()
});
export {
  createCustomerSchema as c,
  updateCustomerSchema as u
};
