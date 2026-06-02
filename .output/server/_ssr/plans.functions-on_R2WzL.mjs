import { c as createServerRpc } from "./createServerRpc-CISKjDF_.mjs";
import { a as createServerFn } from "./server-BaJh_Ojk.mjs";
import { c as createSsrRpc } from "./createSsrRpc-BmDEujYz.mjs";
import { p as paginationSchema, f as filterSchema } from "./pagination.dto-D6rx1FA4.mjs";
import { c as createPlanSchema, u as updatePlanSchema, a as createPlanBonusSchema, b as activateCustomerPlanSchema } from "./plan.dto-CxZ8ZLMS.mjs";

import "../_libs/seroval.mjs";
import "../_libs/react.mjs";
import { o as objectType, c as coerce, s as stringType, e as enumType, r as recordType, a as anyType, n as numberType, b as booleanType } from "../_libs/zod.mjs";

import "../_libs/h3-v2.mjs";
import "../_libs/unenv.mjs";


import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";





import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval-plugins.mjs";

import "../_libs/tanstack__react-router.mjs";
import "../_libs/react-dom.mjs";
import "../_libs/isbot.mjs";
const getPlans = createServerFn({
  method: "GET"
}).inputValidator((data) => {
  return paginationSchema.merge(filterSchema).merge(objectType({
    is_active: coerce.boolean().optional(),
    is_affiliate: coerce.boolean().optional()
  })).parse(data);
}).handler(createSsrRpc("53d4862efd81578aebf22c5b2c92e8824a369a374f6d4117bcdc8336a14988d0"));
createServerFn({
  method: "GET"
}).inputValidator((data) => {
  return objectType({
    id: stringType().uuid()
  }).parse(data);
}).handler(createSsrRpc("846ee4e3894d176a77f402a547bc74a46f6ae29396900bab35a0489e44d7cce5"));
const getPlanBySlug$1 = createServerFn({
  method: "GET"
}).inputValidator((data) => {
  return objectType({
    slug: stringType()
  }).parse(data);
}).handler(createSsrRpc("412ffccfc4718f68950faffd0adc502da1e6c60b093cfcaabba100517b3ff253"));
const createPlan$1 = createServerFn({
  method: "POST"
}).inputValidator((data) => {
  return createPlanSchema.parse(data);
}).handler(createSsrRpc("8681bd9a1cb1ed592cccca030f92a0ebe8c78241ff00c61ba8ebf82f86056c1a"));
const updatePlan$1 = createServerFn({
  method: "POST"
}).inputValidator((data) => {
  return objectType({
    id: stringType().uuid(),
    data: updatePlanSchema
  }).parse(data);
}).handler(createSsrRpc("4c77ce5ae5818244183ed9051a953f5c4c62487ae465f72c7d1c2e827a6c2d98"));
createServerFn({
  method: "POST"
}).inputValidator((data) => {
  return objectType({
    id: stringType().uuid()
  }).parse(data);
}).handler(createSsrRpc("6dc16cdfcd49bbf57c3bd9d43b04237ee1f43b3d7e3cd1906988fbbc81198d16"));
const getPlanBonuses$1 = createServerFn({
  method: "GET"
}).inputValidator((data) => {
  return objectType({
    planId: stringType().uuid()
  }).parse(data);
}).handler(createSsrRpc("f0e57081dcfa46a51e95829c690d43be61bcf09a8605d2a6bdd3b5218d58f14d"));
const createPlanBonus$1 = createServerFn({
  method: "POST"
}).inputValidator((data) => {
  return createPlanBonusSchema.parse(data);
}).handler(createSsrRpc("58a1e2283567b72a901e79967bf925390f932c07ed2a816f93cdba16fd4fc36c"));
const deletePlanBonus$1 = createServerFn({
  method: "POST"
}).inputValidator((data) => {
  return objectType({
    id: stringType().uuid()
  }).parse(data);
}).handler(createSsrRpc("924d254b19907e94ec0d5eeee2d8151e549fcba5373a8993b0e0d4b2f26d7b80"));
const activateCustomerPlan$1 = createServerFn({
  method: "POST"
}).inputValidator((data) => {
  return activateCustomerPlanSchema.parse(data);
}).handler(createSsrRpc("c145a78d533019189a1b1341071d9a7a945cc7a22b2beb1ad1d9fb92f2083cf7"));
const deactivateCustomerPlan$1 = createServerFn({
  method: "POST"
}).inputValidator((data) => {
  return objectType({
    customerId: stringType().uuid()
  }).parse(data);
}).handler(createSsrRpc("42e60cbb39e7b215e6f5261677cb820dc95e52d3585eb88258eb464b26cd4d6f"));
const getCustomerPlans = createServerFn({
  method: "GET"
}).inputValidator((data) => {
  return objectType({
    customerId: stringType().uuid()
  }).parse(data);
}).handler(createSsrRpc("cbb3892846a7f1ee5eae7e702c2c9d4c7cc267d80db57e94619a71411c7f645d"));
createServerFn({
  method: "GET"
}).inputValidator((data) => {
  return objectType({
    customerId: stringType().uuid()
  }).parse(data);
}).handler(createSsrRpc("c81b20389bfc0e3774d401a0c9d493cf00ce54005407daddb9a25ce5d666263b"));
const getPlanStats$1 = createServerFn({
  method: "GET"
}).inputValidator((data) => {
  return objectType({
    planId: stringType().uuid()
  }).parse(data);
}).handler(createSsrRpc("99fd443517274485bc7516b535db08936cd0de7b0f49f378b1e08d9f721a272f"));
createServerFn({
  method: "GET"
}).handler(createSsrRpc("61e81d1a4bd95af9917111d18665547222f01dfbb8e71a836082cf44a53de5c4"));
createServerFn({
  method: "GET"
}).handler(createSsrRpc("81a73b8ea59ff8c4201be3a94a854eafc107fae4f202aaf84d5e7ca12bef2b24"));
createServerFn({
  method: "GET"
}).inputValidator((data) => {
  return objectType({
    period: enumType(["7d", "30d", "90d"]).default("30d")
  }).parse(data);
}).handler(createSsrRpc("c3b424399ad40bb07153e8262281e95638880fba889fe7f407d257bc8ccc4cb0"));
createServerFn({
  method: "GET"
}).handler(createSsrRpc("fb0682465b166ed92f93a2b1ff34607c2397f36ecf4aeb3990ede6124281c5eb"));
const getPlanAnalytics$1 = createServerFn({
  method: "GET"
}).handler(createSsrRpc("f0c29a1af2f7b8eab5409e48266d2f36269964776d9e47253124bedc9ca5dd9c"));
createServerFn({
  method: "GET"
}).inputValidator((data) => {
  return objectType({
    planId: stringType().uuid()
  }).parse(data);
}).handler(createSsrRpc("32c52d638d81801ae60ffdcc10f6a0a222cf8c44a63254fb25b47b7d64799f17"));
const getBonusDistribution$1 = createServerFn({
  method: "GET"
}).handler(createSsrRpc("f9207b79f05ed595f4c4694b78552f2f600307a0389a40a7844104b4f4d07533"));
const getAllPlans_createServerFn_handler = createServerRpc({
  id: "18b86dd39a0847c4987ec96c969d7c136e5c7de7c656c0969b0fa38f39bb6c35",
  name: "getAllPlans",
  filename: "src/lib/api/plans.functions.ts"
}, (opts) => getAllPlans.__executeServer(opts));
const getAllPlans = createServerFn({
  method: "GET"
}).handler(getAllPlans_createServerFn_handler, async () => {
  const result = await getPlans();
  if (!result.success) {
    throw new Error(result.error || "Failed to fetch plans");
  }
  return result.data.data;
});
const getPlanBySlug_createServerFn_handler = createServerRpc({
  id: "3071ff5575e65b754ef7bfc6391ad048f057ac17b85b40c0f5cc334e07ac7cb3",
  name: "getPlanBySlug",
  filename: "src/lib/api/plans.functions.ts"
}, (opts) => getPlanBySlug.__executeServer(opts));
const getPlanBySlug = createServerFn({
  method: "POST"
}).inputValidator(objectType({
  slug: stringType()
})).handler(getPlanBySlug_createServerFn_handler, async ({
  data
}) => {
  const result = await getPlanBySlug$1({
    slug: data.slug
  });
  if (!result.success) {
    throw new Error(result.error || "Failed to fetch plan");
  }
  return result.data;
});
const getPlanBonuses_createServerFn_handler = createServerRpc({
  id: "3ced513fb2a1fda72c6b5854c2c653ec130312af70f1a7200d63f4a4c3025803",
  name: "getPlanBonuses",
  filename: "src/lib/api/plans.functions.ts"
}, (opts) => getPlanBonuses.__executeServer(opts));
const getPlanBonuses = createServerFn({
  method: "POST"
}).inputValidator(objectType({
  planId: stringType()
})).handler(getPlanBonuses_createServerFn_handler, async ({
  data
}) => {
  const result = await getPlanBonuses$1({
    planId: data.planId
  });
  if (!result.success) {
    throw new Error(result.error || "Failed to fetch plan bonuses");
  }
  return result.data;
});
const createPlan_createServerFn_handler = createServerRpc({
  id: "050064d7975a31fb11f5d68088e654493c845574c552a79cefa9ece40fa24f18",
  name: "createPlan",
  filename: "src/lib/api/plans.functions.ts"
}, (opts) => createPlan.__executeServer(opts));
const createPlan = createServerFn({
  method: "POST"
}).inputValidator(objectType({
  name: stringType().min(1),
  slug: stringType().min(1),
  description: stringType().optional(),
  price: numberType().min(0),
  activation_fee: numberType().min(0).default(0),
  plan_type: stringType().optional(),
  is_affiliate: booleanType().default(false),
  is_active: booleanType().default(true),
  max_generations: numberType().min(1).default(1),
  direct_bonus_percentage: numberType().min(0).max(100).default(0),
  metadata: recordType(anyType()).optional()
})).handler(createPlan_createServerFn_handler, async ({
  data
}) => {
  const result = await createPlan$1(data);
  if (!result.success) {
    throw new Error(result.error || "Failed to create plan");
  }
  return result.data;
});
const updatePlan_createServerFn_handler = createServerRpc({
  id: "0c61013e79296bfd2f0e3d7a0f337c2d540b301128ba7a46ab95994485882257",
  name: "updatePlan",
  filename: "src/lib/api/plans.functions.ts"
}, (opts) => updatePlan.__executeServer(opts));
const updatePlan = createServerFn({
  method: "POST"
}).inputValidator(objectType({
  id: stringType().uuid(),
  name: stringType().min(1).optional(),
  description: stringType().optional(),
  price: numberType().min(0).optional(),
  activation_fee: numberType().min(0).optional(),
  plan_type: stringType().optional(),
  is_affiliate: booleanType().optional(),
  is_active: booleanType().optional(),
  max_generations: numberType().min(1).optional(),
  direct_bonus_percentage: numberType().min(0).max(100).optional(),
  metadata: recordType(anyType()).optional()
})).handler(updatePlan_createServerFn_handler, async ({
  data
}) => {
  const {
    id,
    ...updateData
  } = data;
  const result = await updatePlan$1({
    id,
    data: updateData
  });
  if (!result.success) {
    throw new Error(result.error || "Failed to update plan");
  }
  return result.data;
});
const createPlanBonus_createServerFn_handler = createServerRpc({
  id: "a737e29bae9dd7cc9bdb3a61f81f1c26d32a91d5c9fd79f317c62e0c8c76b457",
  name: "createPlanBonus",
  filename: "src/lib/api/plans.functions.ts"
}, (opts) => createPlanBonus.__executeServer(opts));
const createPlanBonus = createServerFn({
  method: "POST"
}).inputValidator(objectType({
  plan_id: stringType().uuid(),
  generation: numberType().min(0),
  bonus_percentage: numberType().min(0).max(100),
  required_directs: numberType().min(0).default(0),
  bonus_type: stringType().default("generation")
})).handler(createPlanBonus_createServerFn_handler, async ({
  data
}) => {
  const result = await createPlanBonus$1(data);
  if (!result.success) {
    throw new Error(result.error || "Failed to create plan bonus");
  }
  return result.data;
});
const deletePlanBonus_createServerFn_handler = createServerRpc({
  id: "6646d5692bff2387c957c29d3a191ef6d39ca21994ab2af619a819563fc00665",
  name: "deletePlanBonus",
  filename: "src/lib/api/plans.functions.ts"
}, (opts) => deletePlanBonus.__executeServer(opts));
const deletePlanBonus = createServerFn({
  method: "POST"
}).inputValidator(objectType({
  id: stringType().uuid()
})).handler(deletePlanBonus_createServerFn_handler, async ({
  data
}) => {
  const result = await deletePlanBonus$1({
    id: data.id
  });
  if (!result.success) {
    throw new Error(result.error || "Failed to delete plan bonus");
  }
  return result;
});
const activateCustomerPlan_createServerFn_handler = createServerRpc({
  id: "f7c35280584b64d251054fbdce10e5f4373bb750ffcb0c51ba73955ea80bd76b",
  name: "activateCustomerPlan",
  filename: "src/lib/api/plans.functions.ts"
}, (opts) => activateCustomerPlan.__executeServer(opts));
const activateCustomerPlan = createServerFn({
  method: "POST"
}).inputValidator(objectType({
  customer_id: stringType().uuid(),
  plan_id: stringType().uuid(),
  expires_at: stringType().optional()
})).handler(activateCustomerPlan_createServerFn_handler, async ({
  data
}) => {
  const result = await activateCustomerPlan$1(data);
  if (!result.success) {
    throw new Error(result.error || "Failed to activate customer plan");
  }
  return result.data;
});
const deactivateCustomerPlan_createServerFn_handler = createServerRpc({
  id: "2f79a501eef3e785e69c7615c8d1cc6ac6b44746a4ff706725ad37a7778f7a63",
  name: "deactivateCustomerPlan",
  filename: "src/lib/api/plans.functions.ts"
}, (opts) => deactivateCustomerPlan.__executeServer(opts));
const deactivateCustomerPlan = createServerFn({
  method: "POST"
}).inputValidator(objectType({
  customer_id: stringType().uuid()
})).handler(deactivateCustomerPlan_createServerFn_handler, async ({
  data
}) => {
  const result = await deactivateCustomerPlan$1({
    customerId: data.customer_id
  });
  if (!result.success) {
    throw new Error(result.error || "Failed to deactivate customer plan");
  }
  return result;
});
const getCustomerPlanHistory_createServerFn_handler = createServerRpc({
  id: "aecaee80caf6b4b21fefd99ac5907bb0e1c302a6e9dcdf67311018148bd6de62",
  name: "getCustomerPlanHistory",
  filename: "src/lib/api/plans.functions.ts"
}, (opts) => getCustomerPlanHistory.__executeServer(opts));
const getCustomerPlanHistory = createServerFn({
  method: "POST"
}).inputValidator(objectType({
  customerId: stringType().uuid()
})).handler(getCustomerPlanHistory_createServerFn_handler, async ({
  data
}) => {
  const result = await getCustomerPlans({
    customerId: data.customerId
  });
  if (!result.success) {
    throw new Error(result.error || "Failed to fetch customer plan history");
  }
  return result.data.data;
});
const getPlanAnalytics_createServerFn_handler = createServerRpc({
  id: "1ad5e57b505b4ae9415f3284011a61154b1346e34c7c7217ab593e84ee5afed9",
  name: "getPlanAnalytics",
  filename: "src/lib/api/plans.functions.ts"
}, (opts) => getPlanAnalytics.__executeServer(opts));
const getPlanAnalytics = createServerFn({
  method: "GET"
}).handler(getPlanAnalytics_createServerFn_handler, async () => {
  const result = await getPlanAnalytics$1();
  if (!result.success) {
    throw new Error(result.error || "Failed to fetch plan analytics");
  }
  return result.data;
});
const getBonusDistribution_createServerFn_handler = createServerRpc({
  id: "203bd02d39b60d512df9648a12382419ecd1d7145ce7deba9d30cf4ccea29327",
  name: "getBonusDistribution",
  filename: "src/lib/api/plans.functions.ts"
}, (opts) => getBonusDistribution.__executeServer(opts));
const getBonusDistribution = createServerFn({
  method: "GET"
}).handler(getBonusDistribution_createServerFn_handler, async () => {
  const result = await getBonusDistribution$1();
  if (!result.success) {
    throw new Error(result.error || "Failed to fetch bonus distribution");
  }
  return result.data;
});
const getPlanStats_createServerFn_handler = createServerRpc({
  id: "744d12898554b49d71ba6dd8b9b75fe5b489ee83bca8335df20e978e80063335",
  name: "getPlanStats",
  filename: "src/lib/api/plans.functions.ts"
}, (opts) => getPlanStats.__executeServer(opts));
const getPlanStats = createServerFn({
  method: "GET"
}).handler(getPlanStats_createServerFn_handler, async () => {
  const result = await getPlanStats$1();
  if (!result.success) {
    throw new Error(result.error || "Failed to fetch plan stats");
  }
  return result.data;
});
export {
  activateCustomerPlan_createServerFn_handler,
  createPlanBonus_createServerFn_handler,
  createPlan_createServerFn_handler,
  deactivateCustomerPlan_createServerFn_handler,
  deletePlanBonus_createServerFn_handler,
  getAllPlans_createServerFn_handler,
  getBonusDistribution_createServerFn_handler,
  getCustomerPlanHistory_createServerFn_handler,
  getPlanAnalytics_createServerFn_handler,
  getPlanBonuses_createServerFn_handler,
  getPlanBySlug_createServerFn_handler,
  getPlanStats_createServerFn_handler,
  updatePlan_createServerFn_handler
};
