import { jsxs, jsx } from "react/jsx-runtime";
import { Sparkles } from "lucide-react";
import { B as Button, c as cn } from "./router-OVqp2Aj1.js";
function PageHeader({
  title,
  subtitle,
  actions,
  eyebrow,
  className
}) {
  return /* @__PURE__ */ jsxs("div", { className: cn("flex flex-wrap items-end justify-between gap-3 pb-4 border-b border-border/60", className), children: [
    /* @__PURE__ */ jsxs("div", { children: [
      eyebrow && /* @__PURE__ */ jsx("div", { className: "text-[10px] uppercase tracking-[0.18em] text-muted-foreground", children: eyebrow }),
      /* @__PURE__ */ jsx("h1", { className: "mt-1 text-2xl font-semibold tracking-tight text-balance", children: title }),
      subtitle && /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-muted-foreground max-w-2xl", children: subtitle })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
      actions,
      /* @__PURE__ */ jsxs(Button, { variant: "outline", size: "sm", className: "gap-1.5", children: [
        /* @__PURE__ */ jsx(Sparkles, { className: "h-3.5 w-3.5 text-primary" }),
        " Pedir ao Copiloto"
      ] })
    ] })
  ] });
}
export {
  PageHeader as P
};
