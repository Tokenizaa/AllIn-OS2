import { z } from "zod";
import { computeGenerationBonus, getPlanRule } from "@/modules/plans/mlm-rules";
import { getActiveCustomerPlan as getActiveCustomerPlanApi, getPlanBonuses as getPlanBonusesApi, getPlanById as getPlanByIdApi } from "../../backend/api";
import { getCustomerLabel } from "@/lib/customer-label";
import { CustomerService } from "@/services/customers";
import { NetworkService } from "@/services/network";

type CustomerRow = {
  id: string;
  user_id?: string | null;
  usuario?: string | null;
  id_comprador?: string | null;
  patrocinador_comprador?: string | null;
  qualification?: string | null;
  status?: string | null;
  metadata?: Record<string, any> | null;
  plan_id?: string | null;
  plan_name?: string | null;
  plano_id?: string | null;
};

type NetworkRow = {
  customer_id: string;
  sponsor_customer_id: string | null;
  level?: number | null;
};

type PlanBonusRow = {
  generation?: number | null;
  bonus_percentage?: number | null;
  required_directs?: number | null;
  bonus_type?: "generation" | "direct_bonus" | string | null;
};

type PlanMetadata = {
  commission?: {
    direct?: number;
    sponsor?: number;
    generations?: Array<{ generation: number; percentage: number }>;
    extraDirects?: Array<{ minDirects: number; percentage: number }>;
    mode?: "direct_only" | "direct_plus_sponsor" | "mlm";
  };
  sponsor_bonus_pct?: number;
  sponsorBonusPct?: number;
  direct_bonus_pct?: number;
  directBonusPct?: number;
  generations?: Array<{ generation: number; percentage: number }>;
  extraDirects?: Array<{ minDirects: number; percentage: number }>;
};

async function fetchCustomer(customerId: string) {
  return (await CustomerService.fetchCustomerById(customerId)) as CustomerRow | null;
}

async function fetchSponsor(customerId: string) {
  return (await NetworkService.fetchSponsorRelationship(customerId)) as NetworkRow | null;
}

async function fetchUpline(customerId: string) {
  return (await NetworkService.fetchUplineRelationships(customerId)) as NetworkRow[];
}

async function countDirects(customerId: string) {
  return NetworkService.countDirectRelationships(customerId);
}

function resolvePlanKey(customer: CustomerRow | null): string | null {
  const raw =
    customer?.plan_name ||
    customer?.plano_id ||
    customer?.metadata?.plan_key ||
    customer?.metadata?.plan_name ||
    customer?.metadata?.plano ||
    "";
  const rule = getPlanRule(raw);
  return rule?.key || null;
}

async function resolvePlanConfig(customerId: string) {
  const activePlanResult = await getActiveCustomerPlanApi({ customerId });
  if (!activePlanResult.success || !activePlanResult.data?.plan_id) {
    return { planKey: null as string | null, directPct: 0, sponsorPct: 0, generationBonuses: [] as Array<{ generation: number; percentage: number }>, extraDirectsBonuses: [] as Array<{ minDirects: number; percentage: number }>, planName: null as string | null };
  }

  const planId = activePlanResult.data.plan_id;
  const planResult = await getPlanByIdApi({ id: planId });
  const bonusesResult = await getPlanBonusesApi({ planId });

  const plan = planResult.success ? planResult.data : null;
  const bonuses = bonusesResult.success ? (bonusesResult.data as PlanBonusRow[]) : [];
  const metadata = (plan?.metadata || {}) as PlanMetadata;

  const generationBonusesFromMetadata = (metadata.commission?.generations || metadata.generations || []).map((item) => ({
    generation: Number(item.generation || 0),
    percentage: Number(item.percentage || 0),
  }));

  const extraDirectsFromMetadata = (metadata.commission?.extraDirects || metadata.extraDirects || []).map((item) => ({
    minDirects: Number(item.minDirects || 0),
    percentage: Number(item.percentage || 0),
  }));

  const generationBonuses = generationBonusesFromMetadata.length
    ? generationBonusesFromMetadata
    : bonuses
    .filter((bonus) => bonus.bonus_type === "generation")
    .map((bonus) => ({
      generation: Number(bonus.generation || 0),
      percentage: Number(bonus.bonus_percentage || 0),
    }));

  const extraDirectsBonuses = extraDirectsFromMetadata.length
    ? extraDirectsFromMetadata
    : bonuses
    .filter((bonus) => bonus.bonus_type === "direct_bonus")
    .map((bonus) => ({
      minDirects: Number(bonus.required_directs || 0),
      percentage: Number(bonus.bonus_percentage || 0),
    }));

  const planKey = getPlanRule(plan?.slug || plan?.name || "")?.key || null;
  const directPct = Number(metadata.commission?.direct || metadata.direct_bonus_pct || metadata.directBonusPct || plan?.direct_bonus_percentage || 0);
  const sponsorPct = Number(metadata.commission?.sponsor || metadata.sponsor_bonus_pct || metadata.sponsorBonusPct || 0);

  return {
    planKey,
    directPct,
    sponsorPct,
    generationBonuses,
    extraDirectsBonuses,
    planName: plan?.name || null,
    planMode: metadata.commission?.mode || null,
  };
}

function hasExtraDirectBonus(config: Awaited<ReturnType<typeof resolvePlanConfig>>) {
  return config.extraDirectsBonuses.length > 0;
}

// Calculate commission for a single sale
export const calculateCommission = async (data: {
  order_id: string;
  seller_id: string;
  order_amount: number;
}) => {
  const parsed = z.object({
    order_id: z.string().uuid(),
    seller_id: z.string().uuid(),
    order_amount: z.number().min(0),
  }).parse(data);

  const seller = await fetchCustomer(parsed.seller_id);
  if (!seller) {
    return { direct_commission: 0, mlm_commissions: [], total_commission: 0, breakdown: [] };
  }

  const planConfig = await resolvePlanConfig(parsed.seller_id);
  const fallbackRule = getPlanRule(resolvePlanKey(seller));
  const directPct = planConfig.directPct || fallbackRule?.directCommissionPct || 0;
  const generationBonuses = planConfig.generationBonuses.length ? planConfig.generationBonuses : (fallbackRule?.generationBonuses || []);
  const extraDirectsBonuses = planConfig.extraDirectsBonuses.length ? planConfig.extraDirectsBonuses : (fallbackRule?.extraDirectsBonuses || []);
  const direct_commission = parsed.order_amount * (directPct / 100);
  const sponsor = await fetchSponsor(parsed.seller_id);
  const mlm_commissions: Array<any> = [];

  if (sponsor?.sponsor_customer_id && planConfig.sponsorPct > 0) {
    const sponsorCustomer = await fetchCustomer(sponsor.sponsor_customer_id);
    mlm_commissions.push({
      recipient_id: sponsor.sponsor_customer_id,
      recipient_name: getCustomerLabel(sponsorCustomer),
      generation: 0,
      percentage: planConfig.sponsorPct,
      amount: parsed.order_amount * (planConfig.sponsorPct / 100),
      bonus_type: "sponsor",
    });
  } else if (sponsor?.sponsor_customer_id && generationBonuses.length) {
    const sponsorCustomer = await fetchCustomer(sponsor.sponsor_customer_id);
    const sponsorPlanKey = resolvePlanKey(sponsorCustomer);
    if (sponsorPlanKey) {
      const generationBonus = computeGenerationBonus(planConfig.planKey || fallbackRule?.key || null, parsed.order_amount, 0);
      const firstGen = generationBonus.generations.find((g) => g.generation === 1);
      if (firstGen) {
        mlm_commissions.push({
          recipient_id: sponsor.sponsor_customer_id,
          recipient_name: getCustomerLabel(sponsorCustomer),
          generation: 1,
          percentage: firstGen.percentage,
          amount: firstGen.amount,
          bonus_type: "generation",
        });
      }
    }
  }

  const directCount = await countDirects(parsed.seller_id);
  const extraDirects = extraDirectsBonuses.filter((b) => b.minDirects <= directCount);
  const extraDirectBonus = extraDirects.reduce((sum, b) => sum + parsed.order_amount * (b.percentage / 100), 0);

  return {
    direct_commission,
    mlm_commissions,
    total_commission: direct_commission + mlm_commissions.reduce((sum, item) => sum + Number(item.amount || 0), 0) + extraDirectBonus,
    breakdown: [
      { type: "direct", recipient_id: parsed.seller_id, percentage: directPct, amount: direct_commission },
      ...mlm_commissions,
    ],
  };
};

// Calculate full MLM commission distribution for a sale
export const calculateMLMCommission = async (data: {
  order_id: string;
  seller_id: string;
  order_amount: number;
}) => {
  const parsed = z.object({
    order_id: z.string().uuid(),
    seller_id: z.string().uuid(),
    order_amount: z.number().min(0),
  }).parse(data);

  const seller = await fetchCustomer(parsed.seller_id);
  if (!seller) return { distribution: [], total_commission: 0 };

  const planConfig = await resolvePlanConfig(parsed.seller_id);
  const fallbackRule = getPlanRule(resolvePlanKey(seller));
  const planKey = planConfig.planKey || fallbackRule?.key || null;
  const rule = getPlanRule(planKey);
  if (!rule) return { distribution: [], total_commission: 0 };

  const distribution: Array<any> = [];
  const direct_commission = parsed.order_amount * ((planConfig.directPct || rule.directCommissionPct || 0) / 100);
  distribution.push({
    recipient_id: parsed.seller_id,
    recipient_name: getCustomerLabel(seller),
    generation: 0,
    type: "direct",
    percentage: planConfig.directPct || rule.directCommissionPct || 0,
    amount: direct_commission,
  });

  const upline = await fetchUpline(parsed.seller_id);
  let total_commission = direct_commission;

  for (const levelRow of upline) {
    const gen = Number(levelRow.level || 0);
    const bonus = (planConfig.generationBonuses.length ? planConfig.generationBonuses : (rule.generationBonuses || [])).find((b) => b.generation === gen);
    if (!bonus || !levelRow.sponsor_customer_id) continue;

    const sponsorCustomer = await fetchCustomer(levelRow.sponsor_customer_id);
    distribution.push({
      recipient_id: levelRow.sponsor_customer_id,
      recipient_name: getCustomerLabel(sponsorCustomer),
      generation: gen,
      type: "generation",
      percentage: bonus.percentage,
      amount: parsed.order_amount * (bonus.percentage / 100),
    });
    total_commission += parsed.order_amount * (bonus.percentage / 100);
  }

  if (hasExtraDirectBonus(planConfig) || rule.extraDirectsBonuses?.length) {
    const directCount = await countDirects(parsed.seller_id);
    const sellerExtraBonuses = (planConfig.extraDirectsBonuses.length ? planConfig.extraDirectsBonuses : (rule.extraDirectsBonuses || []));
    for (const bonus of sellerExtraBonuses) {
      if (directCount >= bonus.minDirects) {
        const amount = parsed.order_amount * (bonus.percentage / 100);
        distribution.push({
          recipient_id: parsed.seller_id,
          recipient_name: getCustomerLabel(seller),
          generation: 0,
          type: "direct_bonus",
          percentage: bonus.percentage,
          amount,
          required_directs: bonus.minDirects,
          actual_directs: directCount,
        });
        total_commission += amount;
      }
    }
  }

  return { distribution, total_commission };
};

// Simulate commission for a hypothetical sale
export const simulateCommission = async (data: {
  seller_id: string;
  order_amount: number;
}) => {
  const parsed = z.object({
    seller_id: z.string().uuid(),
    order_amount: z.number().min(0),
  }).parse(data);

  const seller = await fetchCustomer(parsed.seller_id);
  if (!seller) return { error: "Seller not found", simulation: null };

  const planConfig = await resolvePlanConfig(parsed.seller_id);
  const fallbackRule = getPlanRule(resolvePlanKey(seller));
  const planKey = planConfig.planKey || fallbackRule?.key || null;
  const rule = getPlanRule(planKey);
  if (!rule) return { error: "Seller has no active plan", simulation: null };

  const direct_commission = parsed.order_amount * ((planConfig.directPct || rule.directCommissionPct || 0) / 100);
  const directCount = await countDirects(parsed.seller_id);
  const generationSource = planConfig.generationBonuses.length
    ? planConfig.generationBonuses
    : (rule.generationBonuses || []);
  const extraDirectSource = planConfig.extraDirectsBonuses.length
    ? planConfig.extraDirectsBonuses
    : (rule.extraDirectsBonuses || []);

  const generationData = {
    direct: direct_commission,
    generations: generationSource.map((bonus) => ({
      generation: bonus.generation,
      percentage: bonus.percentage,
      amount: parsed.order_amount * (bonus.percentage / 100),
    })),
    extraDirects: extraDirectSource
      .filter((bonus) => directCount >= bonus.minDirects)
      .map((bonus) => ({
        minDirects: bonus.minDirects,
        percentage: bonus.percentage,
        amount: parsed.order_amount * (bonus.percentage / 100),
      })),
  };
  const direct_bonuses = generationData.extraDirects.map((bonus) => ({
    required_directs: bonus.minDirects,
    actual_directs: bonus.minDirects,
    percentage: bonus.percentage,
    amount: bonus.amount,
  }));

  return {
    simulation: {
      plan: {
        name: rule.label,
        slug: rule.key,
        price: rule.investment,
      },
      order_amount: parsed.order_amount,
      direct_commission,
      mlm_commissions: generationData.generations,
      direct_bonuses,
      total_commission: direct_commission + generationData.generations.reduce((sum, item) => sum + item.amount, 0) + generationData.extraDirects.reduce((sum, item) => sum + item.amount, 0),
      breakdown: {
        direct: direct_commission,
        mlm: generationData.generations.reduce((sum, item) => sum + item.amount, 0),
        direct_bonus: generationData.extraDirects.reduce((sum, item) => sum + item.amount, 0),
      },
    },
  };
};
