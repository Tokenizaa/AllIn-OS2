const MLM_PLAN_RULES = {
  afiliado: {
    key: "afiliado",
    label: "Plano Afiliado",
    investment: 0,
    directCommissionPct: 20,
    sponsorBonusPct: 18
  },
  avanco: {
    key: "avanco",
    label: "Plano Avanço",
    investment: 997,
    directCommissionPct: 0,
    generationBonuses: [
      { generation: 1, percentage: 5 },
      { generation: 2, percentage: 3 },
      { generation: 3, percentage: 2 }
    ]
  },
  excelencia: {
    key: "excelencia",
    label: "Plano Excelência",
    investment: 3980,
    directCommissionPct: 0,
    generationBonuses: [
      { generation: 1, percentage: 5 },
      { generation: 2, percentage: 3 },
      { generation: 3, percentage: 2 }
    ],
    extraDirectsBonuses: [
      { minDirects: 4, percentage: 2 },
      { minDirects: 8, percentage: 4 }
    ]
  }
};
function getPlanRule(key) {
  if (!key) return null;
  const normalized = key.toLowerCase().trim();
  if (normalized.includes("afili")) return MLM_PLAN_RULES.afiliado;
  if (normalized.includes("avan")) return MLM_PLAN_RULES.avanco;
  if (normalized.includes("excel")) return MLM_PLAN_RULES.excelencia;
  return null;
}
function computeGenerationBonus(planKey, orderAmount, directsActive = 0) {
  const rule = getPlanRule(planKey);
  if (!rule) return { total: 0, direct: 0, generations: [], extraDirects: [] };
  const generations = (rule.generationBonuses || []).map((g) => ({
    generation: g.generation,
    percentage: g.percentage,
    amount: orderAmount * (g.percentage / 100)
  }));
  const extraDirects = (rule.extraDirectsBonuses || []).filter((b) => directsActive >= b.minDirects).map((b) => ({
    minDirects: b.minDirects,
    percentage: b.percentage,
    amount: orderAmount * (b.percentage / 100)
  }));
  const direct = orderAmount * ((rule.directCommissionPct || 0) / 100);
  const total = direct + generations.reduce((sum, g) => sum + g.amount, 0) + extraDirects.reduce((sum, b) => sum + b.amount, 0);
  return { total, direct, generations, extraDirects };
}
export {
  computeGenerationBonus as c,
  getPlanRule as g
};
