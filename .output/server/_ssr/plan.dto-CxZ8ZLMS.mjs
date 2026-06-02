import { o as objectType, r as recordType, a as anyType, n as numberType, b as booleanType, e as enumType, s as stringType } from "../_libs/zod.mjs";
objectType({
  id: stringType().uuid(),
  name: stringType(),
  slug: stringType(),
  description: stringType().nullable(),
  price: numberType(),
  activation_fee: numberType(),
  plan_type: enumType(["standard", "premium", "enterprise"]),
  is_affiliate: booleanType(),
  is_active: booleanType(),
  max_generations: numberType(),
  direct_bonus_percentage: numberType(),
  metadata: recordType(anyType()).nullable(),
  created_at: stringType().datetime(),
  updated_at: stringType().datetime()
});
const createPlanSchema = objectType({
  name: stringType().min(1),
  slug: stringType().min(1),
  description: stringType().optional(),
  price: numberType().min(0),
  activation_fee: numberType().min(0),
  plan_type: enumType(["standard", "premium", "enterprise"]),
  is_affiliate: booleanType(),
  is_active: booleanType(),
  max_generations: numberType().min(0),
  direct_bonus_percentage: numberType().min(0).max(100),
  metadata: recordType(anyType()).optional()
});
const updatePlanSchema = objectType({
  name: stringType().min(1).optional(),
  slug: stringType().min(1).optional(),
  description: stringType().optional(),
  price: numberType().min(0).optional(),
  activation_fee: numberType().min(0).optional(),
  plan_type: enumType(["standard", "premium", "enterprise"]).optional(),
  is_affiliate: booleanType().optional(),
  is_active: booleanType().optional(),
  max_generations: numberType().min(0).optional(),
  direct_bonus_percentage: numberType().min(0).max(100).optional(),
  metadata: recordType(anyType()).optional()
});
objectType({
  id: stringType().uuid(),
  plan_id: stringType().uuid(),
  generation: numberType(),
  bonus_percentage: numberType(),
  required_directs: numberType(),
  bonus_type: enumType(["generation", "direct_bonus"]),
  created_at: stringType().datetime()
});
const createPlanBonusSchema = objectType({
  plan_id: stringType().uuid(),
  generation: numberType().min(0),
  bonus_percentage: numberType().min(0).max(100),
  required_directs: numberType().min(0),
  bonus_type: enumType(["generation", "direct_bonus"])
});
objectType({
  id: stringType().uuid(),
  customer_id: stringType().uuid(),
  plan_id: stringType().uuid(),
  status: enumType(["active", "inactive", "pending", "expired"]),
  activated_at: stringType().datetime().nullable(),
  expires_at: stringType().datetime().nullable(),
  created_at: stringType().datetime()
});
const activateCustomerPlanSchema = objectType({
  customer_id: stringType().uuid(),
  plan_id: stringType().uuid()
});
export {
  createPlanBonusSchema as a,
  activateCustomerPlanSchema as b,
  createPlanSchema as c,
  updatePlanSchema as u
};
