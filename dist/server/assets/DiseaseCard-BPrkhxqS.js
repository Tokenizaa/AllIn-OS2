import { jsxs, jsx } from "react/jsx-runtime";
import { c as CardTitle } from "./card-Cp4xOC4k.js";
const DiseaseCard = ({
  title,
  description,
  icon: Icon,
  image,
  details,
  className = ""
}) => {
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: `group relative bg-white/15 backdrop-blur-lg rounded-2xl overflow-hidden border border-white/30 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ${className}`,
      children: [
        /* @__PURE__ */ jsx("div", { className: "overflow-hidden rounded-t-2xl h-48", children: /* @__PURE__ */ jsx(
          "img",
          {
            src: image,
            alt: title,
            className: "w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          }
        ) }),
        /* @__PURE__ */ jsxs("div", { className: "p-6", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 mb-4", children: [
            /* @__PURE__ */ jsx("div", { className: "p-2 bg-primary/10 rounded-lg text-primary", children: /* @__PURE__ */ jsx(Icon, { className: "h-6 w-6" }) }),
            /* @__PURE__ */ jsx(CardTitle, { className: "text-2xl font-semibold text-foreground", children: title })
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-lg text-foreground mb-4 leading-relaxed", children: description }),
          /* @__PURE__ */ jsx("div", { className: "border-t border-white/20 pt-4 mt-4", children: /* @__PURE__ */ jsx("p", { className: "text-base text-foreground leading-relaxed", children: details }) })
        ] })
      ]
    }
  );
};
export {
  DiseaseCard as D
};
