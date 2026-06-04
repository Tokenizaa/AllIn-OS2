import { jsxs, jsx } from "react/jsx-runtime";
import { P as PageHeader } from "./page-header-D_YhEPyH.js";
import { Megaphone, Link, Mail, Image, Download } from "lucide-react";
import { B as Button } from "./router-Piw3VGP8.js";
import "@tanstack/react-query";
import "@tanstack/react-router";
import "react";
import "./supabase-client-BdpvIS_G.js";
import "@supabase/supabase-js";
import "framer-motion";
import "sonner";
import "class-variance-authority";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-slot";
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
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsx(PageHeader, { eyebrow: "Marketing", title: "Campanhas & Comunicação", subtitle: "Disparos contextuais, links rastreáveis e ativos da marca.", actions: /* @__PURE__ */ jsx(Button, { size: "sm", children: "Nova campanha" }) }),
    /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 xl:grid-cols-4 gap-3", children: cards.map((c) => {
      const Icon = c.icon;
      return /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-border bg-card/60 p-4", children: [
        /* @__PURE__ */ jsx(Icon, { className: "h-5 w-5 text-primary" }),
        /* @__PURE__ */ jsx("p", { className: "mt-3 text-xs text-muted-foreground", children: c.title }),
        /* @__PURE__ */ jsx("p", { className: "text-2xl font-semibold mt-0.5", children: c.value }),
        /* @__PURE__ */ jsx("p", { className: "text-[11px] text-muted-foreground mt-1", children: c.hint })
      ] }, c.title);
    }) }),
    /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-border bg-card/60 p-5", children: [
      /* @__PURE__ */ jsxs("h3", { className: "text-sm font-semibold mb-3 flex items-center gap-2", children: [
        /* @__PURE__ */ jsx(Download, { className: "h-4 w-4 text-primary" }),
        " Materiais para a rede"
      ] }),
      /* @__PURE__ */ jsx("div", { className: "grid md:grid-cols-3 gap-3", children: ["Kit institucional", "Banners Q4", "Pitch Black"].map((m) => /* @__PURE__ */ jsxs("div", { className: "rounded-lg border border-border bg-background/40 p-3 flex items-center justify-between", children: [
        /* @__PURE__ */ jsx("span", { className: "text-sm", children: m }),
        /* @__PURE__ */ jsx(Button, { size: "sm", variant: "outline", children: "Baixar" })
      ] }, m)) })
    ] })
  ] });
}
export {
  MarketingPage as component
};
