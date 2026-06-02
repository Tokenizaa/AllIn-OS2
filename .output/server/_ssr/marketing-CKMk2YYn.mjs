import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { P as PageHeader } from "./page-header-R4VVQEB2.mjs";
import { B as Button } from "./router-BZaVudxP.mjs";
import "../_libs/sonner.mjs";
import { a9 as Megaphone, aX as Link, _ as Mail, aY as Image, y as Download } from "../_libs/lucide-react.mjs";

import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-query.mjs";
import "../_libs/tanstack__react-router.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/unenv.mjs";


import "../_libs/seroval-plugins.mjs";


import "../_libs/react-dom.mjs";
import "../_libs/isbot.mjs";
import "./supabase-client-BdpvIS_G.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
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
const cards = [{
  icon: Megaphone,
  title: "Campanhas ativas",
  value: "12",
  hint: "4 com IA generativa"
}, {
  icon: Link,
  title: "Links inteligentes",
  value: "284",
  hint: "62% de conversão média"
}, {
  icon: Mail,
  title: "Comunicações",
  value: "8 trilhas",
  hint: "Multicanal · email/SMS/WhatsApp"
}, {
  icon: Image,
  title: "Banners",
  value: "36",
  hint: "AB testing ativo"
}];
function MarketingPage() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PageHeader, { eyebrow: "Marketing", title: "Campanhas & Comunicação", subtitle: "Disparos contextuais, links rastreáveis e ativos da marca.", actions: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", children: "Nova campanha" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 xl:grid-cols-4 gap-3", children: cards.map((c) => {
      const Icon = c.icon;
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-card/60 p-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-5 w-5 text-primary" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-xs text-muted-foreground", children: c.title }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-semibold mt-0.5", children: c.value }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-muted-foreground mt-1", children: c.hint })
      ] }, c.title);
    }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-card/60 p-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-sm font-semibold mb-3 flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "h-4 w-4 text-primary" }),
        " Materiais para a rede"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid md:grid-cols-3 gap-3", children: ["Kit institucional", "Banners Q4", "Pitch Black"].map((m) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-border bg-background/40 p-3 flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm", children: m }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", variant: "outline", children: "Baixar" })
      ] }, m)) })
    ] })
  ] });
}
export {
  MarketingPage as component
};
