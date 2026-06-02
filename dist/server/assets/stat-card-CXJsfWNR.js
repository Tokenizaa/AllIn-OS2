import { jsxs, jsx } from "react/jsx-runtime";
import { motion } from "framer-motion";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { c as cn } from "./router-C3cuB5ui.js";
const accents = {
  primary: "from-primary/20 to-primary/0 text-primary",
  success: "from-success/20 to-success/0 text-success",
  warning: "from-warning/20 to-warning/0 text-warning",
  info: "from-info/20 to-info/0 text-info"
};
function StatCard({ label, value, delta, icon: Icon, accent = "primary", hint }) {
  const positive = (delta ?? 0) >= 0;
  return /* @__PURE__ */ jsxs(
    motion.div,
    {
      initial: { opacity: 0, y: 8 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.35 },
      className: "relative overflow-hidden rounded-2xl border border-border/60 bg-card/60 p-5 backdrop-blur",
      children: [
        /* @__PURE__ */ jsx("div", { className: cn("absolute -top-12 -right-12 h-32 w-32 rounded-full bg-gradient-to-br blur-2xl opacity-60", accents[accent]) }),
        /* @__PURE__ */ jsxs("div", { className: "relative flex items-start justify-between", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground uppercase tracking-wider", children: label }),
            /* @__PURE__ */ jsx("p", { className: "mt-2 text-2xl font-semibold tracking-tight", children: value }),
            hint && /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-muted-foreground", children: hint })
          ] }),
          Icon && /* @__PURE__ */ jsx("div", { className: cn("rounded-xl border border-border/60 bg-background/40 p-2.5", accents[accent].split(" ").pop()), children: /* @__PURE__ */ jsx(Icon, { className: "h-4 w-4" }) })
        ] }),
        typeof delta === "number" && /* @__PURE__ */ jsxs("div", { className: "relative mt-3 flex items-center gap-1 text-xs", children: [
          /* @__PURE__ */ jsxs("span", { className: cn(
            "inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 font-medium",
            positive ? "bg-success/15 text-success" : "bg-destructive/15 text-destructive"
          ), children: [
            positive ? /* @__PURE__ */ jsx(ArrowUpRight, { className: "h-3 w-3" }) : /* @__PURE__ */ jsx(ArrowDownRight, { className: "h-3 w-3" }),
            Math.abs(delta).toFixed(1),
            "%"
          ] }),
          /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: "vs mês anterior" })
        ] })
      ]
    }
  );
}
export {
  StatCard as S
};
