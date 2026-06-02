import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { u as useQuery } from "../_libs/tanstack__react-query.mjs";
import { P as PageHeader } from "./page-header-R4VVQEB2.mjs";
import { c as cn, B as Button } from "./router-BZaVudxP.mjs";
import { S as Skeleton } from "./skeleton-ATJguDyB.mjs";
import { g as getCustomerLabel } from "./customer-label-CvKl2zbr.mjs";
import { c as createSsrRpc } from "./createSsrRpc-BmDEujYz.mjs";
import { a as createServerFn } from "./server-BaJh_Ojk.mjs";
import { p as paginationSchema, f as filterSchema } from "./pagination.dto-D6rx1FA4.mjs";
import { c as createPaymentSchema, u as updatePaymentSchema, w as webhookPayloadSchema } from "./payment.dto-BSYPhuVH.mjs";
import { g as getOrders } from "./orders.api-Cc__Njw8.mjs";
import { c as createCustomerSchema, u as updateCustomerSchema } from "./customer.dto-DyDOhQHZ.mjs";
import "../_libs/sonner.mjs";

import "../_libs/seroval.mjs";
import { aC as Info, c as CircleCheck, ac as TriangleAlert, q as Sparkles } from "../_libs/lucide-react.mjs";
import { o as objectType, s as stringType } from "../_libs/zod.mjs";

import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-router.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval-plugins.mjs";


import "../_libs/react-dom.mjs";
import "../_libs/isbot.mjs";
import "./supabase-client-BdpvIS_G.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/unenv.mjs";


import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "../_libs/tslib.mjs";
import "../_libs/supabase__functions-js.mjs";
import "./roles-DEW722fr.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/framer-motion.mjs";
import "../_libs/motion-dom.mjs";
import "../_libs/motion-utils.mjs";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";




import "./order.dto-LsqToPpL.mjs";
const getCustomers = createServerFn({
  method: "GET"
}).inputValidator((data) => {
  return paginationSchema.merge(filterSchema).parse(data);
}).handler(createSsrRpc("02ed2db877d1329c3f89f2d0123785a24e1de4a932eef4ba90471d8774175029"));
createServerFn({
  method: "GET"
}).inputValidator((data) => {
  return objectType({
    id: stringType().uuid()
  }).parse(data);
}).handler(createSsrRpc("4eceb507747e1c868792089856e9bcbd4a17e74e7791b8fd58e650dbf8ca8105"));
createServerFn({
  method: "GET"
}).inputValidator((data) => {
  return objectType({
    id: stringType().uuid()
  }).parse(data);
}).handler(createSsrRpc("d1761d2b4501607114d7c50a1280e22c3da01d6d6268171d611051940eebb70e"));
createServerFn({
  method: "POST"
}).inputValidator((data) => {
  return createCustomerSchema.parse(data);
}).handler(createSsrRpc("9ce74d56ab10e90f28f2e429e94c51bf32876c96e72f9fb625dbf596d2132039"));
createServerFn({
  method: "POST"
}).inputValidator((data) => {
  return objectType({
    id: stringType().uuid(),
    data: updateCustomerSchema
  }).parse(data);
}).handler(createSsrRpc("58e1a547d3e3f2d3313faf4b5e6e7b161ce3f1a4d095949927aa1c67cb3ca850"));
createServerFn({
  method: "POST"
}).inputValidator((data) => {
  return objectType({
    id: stringType().uuid()
  }).parse(data);
}).handler(createSsrRpc("f9cd1413aa36a15a5a64ba3ab7c0ba3a39d48448a5e85091c1fcca39231134d8"));
createServerFn({
  method: "GET"
}).handler(createSsrRpc("2638aa65bcb56a71bb06629bdf7ca0f265523e4c4d344109a004b09cd1305a21"));
createServerFn({
  method: "GET"
}).inputValidator((data) => {
  return objectType({
    sponsorId: stringType().uuid(),
    ...paginationSchema.shape
  }).parse(data);
}).handler(createSsrRpc("c71e207075728f54c0952e19a61639519ef727356c74f211fa9240f8da0beb17"));
const getPayments = createServerFn({
  method: "GET"
}).inputValidator((data) => {
  return paginationSchema.merge(filterSchema).merge(objectType({
    customer_id: stringType().uuid().optional(),
    status: stringType().optional()
  })).parse(data);
}).handler(createSsrRpc("76ad2c9281fd9f60011c8d30032b92d44b9c64b096a8659a7873e12ddec1ee24"));
createServerFn({
  method: "GET"
}).inputValidator((data) => {
  return objectType({
    id: stringType().uuid()
  }).parse(data);
}).handler(createSsrRpc("dd248f39a83469c7d361e3680b1a32a1d309044a0499d5dfcfb6b525705d504a"));
createServerFn({
  method: "POST"
}).inputValidator((data) => {
  return createPaymentSchema.parse(data);
}).handler(createSsrRpc("583003cff818fc47b6b5ada90eaace02aa854f2f8729d444ddb1549e1831a2af"));
createServerFn({
  method: "POST"
}).inputValidator((data) => {
  return objectType({
    id: stringType().uuid(),
    data: updatePaymentSchema
  }).parse(data);
}).handler(createSsrRpc("f60025c745c86a893362d8b3ed78d1b9ec647cb68811a250081744f38661de3b"));
createServerFn({
  method: "POST"
}).inputValidator((data) => {
  return objectType({
    id: stringType().uuid()
  }).parse(data);
}).handler(createSsrRpc("5d640bfa64aa445b91cf37ec73d4977011228a8e66662f6665cb9158763d0c8a"));
createServerFn({
  method: "POST"
}).inputValidator((data) => {
  return webhookPayloadSchema.parse(data);
}).handler(createSsrRpc("58effe2d275d301a43852edbe632f55514e21de45d0d8218a6d549501485e0ea"));
createServerFn({
  method: "GET"
}).handler(createSsrRpc("2ea986054725e9711cffaad782f4011a61391904fdc64d1ca0867e396eecdb65"));
const styleMap = {
  critical: { ring: "border-destructive/40 bg-destructive/5", icon: TriangleAlert, color: "text-destructive" },
  warning: { ring: "border-warning/40 bg-warning/5", icon: TriangleAlert, color: "text-warning" },
  success: { ring: "border-success/40 bg-success/5", icon: CircleCheck, color: "text-success" },
  info: { ring: "border-info/40 bg-info/5", icon: Info, color: "text-info" }
};
function InsightCard({ insight }) {
  const s = styleMap[insight.severity];
  const Icon = s.icon;
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn("rounded-xl border p-4", s.ring), children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn("rounded-md bg-background/40 p-1.5", s.color), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-4 w-4" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] uppercase tracking-wider text-muted-foreground", children: insight.scope }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 text-[10px] text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-2.5 w-2.5" }),
          " IA"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "mt-0.5 text-sm font-medium leading-snug", children: insight.title }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-xs text-muted-foreground", children: insight.detail }),
      insight.action && /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", variant: "outline", className: "mt-2 h-7 text-xs", children: insight.action })
    ] })
  ] }) });
}
function InsightsPage() {
  const {
    data: paymentsResult,
    isLoading: paymentsLoading
  } = useQuery({
    queryKey: ["insights", "payments"],
    queryFn: () => getPayments({
      page: 1,
      limit: 5
    })
  });
  const {
    data: ordersResult,
    isLoading: ordersLoading
  } = useQuery({
    queryKey: ["insights", "orders"],
    queryFn: () => getOrders({
      page: 1,
      limit: 5
    })
  });
  const {
    data: customersResult,
    isLoading: customersLoading
  } = useQuery({
    queryKey: ["insights", "customers"],
    queryFn: () => getCustomers({
      page: 1,
      limit: 5
    })
  });
  const insights = reactExports.useMemo(() => {
    const payments = paymentsResult?.data?.data || [];
    const orders = ordersResult?.data?.data || [];
    const customers = customersResult?.data?.data || [];
    return [...payments.map((p) => ({
      id: `pay-${p.id}`,
      title: "Pagamento registrado",
      detail: `Método ${p.payment_method || p.payment_method_type || "-"}`,
      severity: "success",
      action: "Abrir"
    })), ...orders.map((o) => ({
      id: `ord-${o.id}`,
      title: "Pedido atualizado",
      detail: `Status ${o.status_pedido || o.status || "-"}`,
      severity: "info",
      action: "Abrir"
    })), ...customers.map((c) => ({
      id: `cus-${c.id}`,
      title: "Cliente ativo",
      detail: getCustomerLabel(c),
      severity: "warning",
      action: "Abrir"
    }))].slice(0, 9);
  }, [paymentsResult, ordersResult, customersResult]);
  const loading = paymentsLoading || ordersLoading || customersLoading;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PageHeader, { eyebrow: "Executive · Intelligence", title: "Insights da IA", subtitle: "Sinais derivados de eventos reais no Supabase." }),
    loading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid md:grid-cols-2 xl:grid-cols-3 gap-3", children: Array.from({
      length: 6
    }).map((_, index) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-28 rounded-xl" }, index)) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid md:grid-cols-2 xl:grid-cols-3 gap-3", children: insights.map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(InsightCard, { insight: i }, i.id)) })
  ] });
}
export {
  InsightsPage as component
};
