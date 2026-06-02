import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { d as useDistributor, h as useProducts, P as PublicHeader, B as Button } from "./router-BZaVudxP.mjs";
import { F as Footer } from "./Footer-Brjh0GqW.mjs";
import { P as ProductCard } from "./ProductCard-0qNYhPet.mjs";
import "../_libs/sonner.mjs";
import { F as Search, a6 as Funnel } from "../_libs/lucide-react.mjs";

import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/unenv.mjs";


import "../_libs/seroval-plugins.mjs";


import "../_libs/react-dom.mjs";
import "../_libs/isbot.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-query.mjs";
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
import "./card-JWqKexpr.mjs";
import "./priceFormatter-BwKD4_Ti.mjs";
function ProductSearchPage() {
  const {
    currentDistributor
  } = useDistributor();
  const sponsorSlug = currentDistributor.slug;
  const isDefaultTenant = !sponsorSlug || currentDistributor.isFallback;
  const {
    products,
    loading
  } = useProducts();
  const [searchTerm, setSearchTerm] = reactExports.useState("");
  const [selectedCategory, setSelectedCategory] = reactExports.useState("all");
  const categories = ["all", "Calçados", "Palmilhas", "Acessórios"];
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.caption.toLowerCase().includes(searchTerm.toLowerCase()) || product.caption2?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || product.categorias === selectedCategory;
    return matchesSearch && matchesCategory;
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-allin-bg-light-1 dark:bg-allin-bg-dark-1", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PublicHeader, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pt-20", children: /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "py-20", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto px-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center mb-12", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-4xl md:text-5xl font-bold mb-6 text-allin-dark dark:text-allin-white", children: [
          "Buscar ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-allin-orange", children: "Produtos" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xl text-allin-dark/80 dark:text-allin-white/80 max-w-2xl mx-auto", children: "Encontre o produto ideal para suas necessidades" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-8 flex flex-col md:flex-row gap-4 items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-1 max-w-md", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-allin-dark/50 dark:text-allin-white/50 h-5 w-5" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", placeholder: "Buscar produtos...", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value), className: "w-full pl-10 pr-4 py-3 rounded-xl border border-allin-orange/30 bg-white dark:bg-allin-bg-dark-2 text-allin-dark dark:text-allin-white focus:outline-none focus:ring-2 focus:ring-allin-orange" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 items-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Funnel, { className: "text-allin-orange h-5 w-5" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("select", { value: selectedCategory, onChange: (e) => setSelectedCategory(e.target.value), className: "px-4 py-3 rounded-xl border border-allin-orange/30 bg-white dark:bg-allin-bg-dark-2 text-allin-dark dark:text-allin-white focus:outline-none focus:ring-2 focus:ring-allin-orange", children: categories.map((cat) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: cat, children: cat === "all" ? "Todas as Categorias" : cat }, cat)) })
        ] })
      ] }),
      loading ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-20", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-allin-orange border-r-transparent" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4 text-allin-dark/80 dark:text-allin-white/80", children: "Carregando produtos..." })
      ] }) : filteredProducts.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center py-20", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xl text-allin-dark/80 dark:text-allin-white/80", children: [
        'Nenhum produto encontrado para "',
        searchTerm,
        '"'
      ] }) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", children: filteredProducts.map((product) => /* @__PURE__ */ jsxRuntimeExports.jsx(ProductCard, { image: product.imgSrc, title: product.caption, description: product.caption2, price: product.price, tag: product.produtoTag, onDetailsClick: () => console.log("Details clicked", product.id), onAddToCart: () => console.log("Add to cart", product.id) }, product.id)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-16 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: isDefaultTenant ? "/loja" : `/loja/${sponsorSlug}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "vibrantOutline", size: "lg", className: "text-lg px-8 py-6", children: "Voltar para a Loja" }) }) })
    ] }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Footer, {})
  ] });
}
export {
  ProductSearchPage as component
};
