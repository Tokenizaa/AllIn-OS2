import { jsxs, jsx } from "react/jsx-runtime";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { c as cn } from "./router-OVqp2Aj1.js";
function KpiCard({
  label,
  value,
  delta,
  hint,
  spark,
  accent = "primary"
}) {
  const up = (delta ?? 0) >= 0;
  return /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-border bg-card/60 p-4 hover:bg-card transition-colors", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsx("span", { className: "text-xs text-muted-foreground", children: label }),
      delta !== void 0 && /* @__PURE__ */ jsxs("span", { className: cn("inline-flex items-center gap-0.5 text-xs font-medium", up ? "text-success" : "text-destructive"), children: [
        up ? /* @__PURE__ */ jsx(ArrowUpRight, { className: "h-3 w-3" }) : /* @__PURE__ */ jsx(ArrowDownRight, { className: "h-3 w-3" }),
        Math.abs(delta).toFixed(1),
        "%"
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mt-2 flex items-end justify-between gap-2", children: [
      /* @__PURE__ */ jsx("div", { className: "text-2xl font-semibold tracking-tight", children: value }),
      spark && spark.length > 0 && /* @__PURE__ */ jsx(Sparkline, { values: spark, accent })
    ] }),
    hint && /* @__PURE__ */ jsx("p", { className: "mt-1.5 text-[11px] text-muted-foreground", children: hint })
  ] });
}
function Sparkline({ values, accent }) {
  const w = 80, h = 28;
  const max = Math.max(...values), min = Math.min(...values);
  const span = max - min || 1;
  const pts = values.map((v, i) => `${i / (values.length - 1) * w},${h - (v - min) / span * h}`).join(" ");
  const stroke = accent === "success" ? "var(--color-success)" : accent === "destructive" ? "var(--color-destructive)" : "var(--color-primary)";
  return /* @__PURE__ */ jsx("svg", { width: w, height: h, className: "opacity-90", children: /* @__PURE__ */ jsx("polyline", { points: pts, fill: "none", stroke, strokeWidth: "1.5" }) });
}
export {
  KpiCard as K
};
