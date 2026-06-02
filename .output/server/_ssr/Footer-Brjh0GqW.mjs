import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { u as useSponsorLink, k as useCart, b as useAuth, f as getRoleRedirectPath } from "./router-BZaVudxP.mjs";
import { ap as House, a5 as UserPlus, w as Store, ah as ShoppingCart, H as Heart } from "../_libs/lucide-react.mjs";
const Footer = () => {
  const { handleCadastro } = useSponsorLink();
  const { getTotalItems } = useCart();
  const { user } = useAuth();
  const dashboardHref = user ? getRoleRedirectPath(user) : "/login";
  return /* @__PURE__ */ jsxRuntimeExports.jsx("footer", { className: "bg-allin-bg-light-2 dark:bg-allin-bg-dark-2 text-allin-dark dark:text-allin-white py-12 border-t border-allin-orange/20 dark:border-allin-bg-dark-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto px-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col md:flex-row justify-center items-center gap-8 mb-12", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Link,
        {
          to: "/",
          className: "flex flex-col items-center text-allin-dark dark:text-allin-white hover:text-allin-orange transition-all duration-300",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(House, { className: "w-6 h-6 mb-1" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Início" })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          onClick: handleCadastro,
          className: "flex flex-col items-center text-allin-dark dark:text-allin-white hover:text-allin-orange transition-all duration-300",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(UserPlus, { className: "w-6 h-6 mb-1" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Seja Distribuidor" })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Link,
        {
          to: "/loja",
          className: "flex flex-col items-center text-allin-dark dark:text-allin-white hover:text-allin-orange transition-all duration-300",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Store, { className: "w-6 h-6 mb-1" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Loja" })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Link,
        {
          to: dashboardHref,
          className: "flex flex-col items-center text-allin-dark dark:text-allin-white hover:text-allin-orange transition-all duration-300",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-6 h-6 mb-1 grid place-items-center rounded-md border border-current text-xs font-bold", children: "D" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: user ? "Dashboard" : "Entrar" })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          onClick: () => window.dispatchEvent(new CustomEvent("allin:open-cart")),
          className: "flex flex-col items-center text-allin-dark dark:text-allin-white hover:text-allin-orange transition-all duration-300",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingCart, { className: "w-6 h-6 mb-1" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute -top-2 -right-2 bg-allin-orange text-white text-xs rounded-full h-5 w-5 flex items-center justify-center", children: getTotalItems() })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Carrinho" })
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center mb-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-center items-center space-x-2 mb-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 bg-allin-orange rounded-lg flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-allin-dark font-bold text-xl", children: "A" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-2xl font-bold", children: "All-In" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-allin-dark/80 dark:text-allin-white/80 max-w-2xl mx-auto", children: "Revolucionando o mercado de calçados terapêuticos com tecnologia avançada e oportunidades reais de negócio." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-t border-allin-orange/20 pt-8 dark:border-allin-bg-dark-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col md:flex-row justify-between items-center gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-allin-dark/60 dark:text-allin-white/60 text-sm", children: "© 2025 All-in. Todos os direitos reservados." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-allin-dark/60 dark:text-allin-white/60 text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Feito com" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Heart, { className: "w-4 h-4 text-red-400 fill-current" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "para distribuidores de sucesso" })
      ] })
    ] }) })
  ] }) });
};
export {
  Footer as F
};
