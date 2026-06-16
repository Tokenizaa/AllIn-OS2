import { z } from 'zod';
import { supabase } from '@/lib/supabase-client';

// Validation schemas
const calculateDiscountSchema = z.object({
  originalAmount: z.number().positive(),
  idComprador: z.string().optional(),
  productId: z.string().optional(),
  categoryId: z.string().optional(),
  couponCode: z.string().optional(),
});

const createCouponSchema = z.object({
  code: z.string().min(3),
  discountRuleId: z.string().uuid(),
  idComprador: z.string().optional(),
  expiresAt: z.string().optional(),
  usageLimit: z.number().optional(),
});

const createDiscountRuleSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  discount_type: z.enum(['percentage', 'fixed_amount', 'buy_x_get_y']),
  discount_value: z.number().positive(),
  min_order_amount: z.number().optional(),
  max_discount_amount: z.number().optional(),
  applicable_products: z.array(z.string()).optional(),
  applicable_categories: z.array(z.string()).optional(),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  usage_limit: z.number().optional(),
  is_active: z.boolean().default(true),
});

const validateCouponSchema = z.object({
  couponCode: z.string().min(3),
  idComprador: z.string().optional(),
});

// Calculate discount
export const calculateDiscount = async (data: any) => {
  const parsed = calculateDiscountSchema.parse(data);
  try {
    const { data: result, error } = await supabase.rpc('calculate_discount', {
      p_original_amount: parsed.originalAmount,
      p_id_comprador: parsed.idComprador,
      p_product_id: parsed.productId,
      p_category_id: parsed.categoryId,
      p_coupon_code: parsed.couponCode,
    });
    
    if (error) throw error;
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to calculate discount' };
  }
};

// Create coupon
export const createCoupon = async (data: any) => {
  const parsed = createCouponSchema.parse(data);
  try {
    const { data: coupon, error } = await supabase
      .schema('commerce')
      .from('coupons')
      .insert({
        code: parsed.code,
        discount_rule_id: parsed.discountRuleId,
        id_comprador: parsed.idComprador,
        expires_at: parsed.expiresAt,
        usage_limit: parsed.usageLimit,
        usage_count: 0,
        is_active: true,
      })
      .select()
      .single();
    
    if (error) throw error;
    return { success: true, data: coupon };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to create coupon' };
  }
};

// Create discount rule
export const createDiscountRule = async (data: any) => {
  const parsed = createDiscountRuleSchema.parse(data);
  try {
    const { data: rule, error } = await supabase
      .schema('commerce')
      .from('discount_rules')
      .insert({
        name: parsed.name,
        description: parsed.description,
        discount_type: parsed.discount_type,
        discount_value: parsed.discount_value,
        min_order_amount: parsed.min_order_amount,
        max_discount_amount: parsed.max_discount_amount,
        applicable_products: parsed.applicable_products,
        applicable_categories: parsed.applicable_categories,
        start_date: parsed.start_date,
        end_date: parsed.end_date,
        usage_limit: parsed.usage_limit,
        is_active: parsed.is_active,
      })
      .select()
      .single();
    
    if (error) throw error;
    return { success: true, data: rule };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to create discount rule' };
  }
};

// Validate coupon
export const validateCoupon = async (data: any) => {
  const parsed = validateCouponSchema.parse(data);
  try {
    const { data: result, error } = await supabase.rpc('validate_coupon', {
      p_coupon_code: parsed.couponCode,
      p_id_comprador: parsed.idComprador,
    });
    
    if (error) throw error;
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to validate coupon' };
  }
};
