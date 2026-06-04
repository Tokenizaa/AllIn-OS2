import { jsxs, jsx } from "react/jsx-runtime";
import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { d as useDistributor, h as useProducts, P as PublicHeader, B as Button } from "./router-Piw3VGP8.js";
import { F as Footer } from "./Footer-iTvid4VX.js";
import { P as ProductCard } from "./ProductCard-BX_cn1Z-.js";
import { Search, Filter } from "lucide-react";
import "@tanstack/react-query";
import "./supabase-client-BdpvIS_G.js";
import "@supabase/supabase-js";
import "framer-motion";
import "sonner";
import "class-variance-authority";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-slot";
import "./card-Cyhv06K2.js";
import "./priceFormatter-BwKD4_Ti.js";
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
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const categories = ["all", "Calçados", "Palmilhas", "Acessórios"];
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.caption.toLowerCase().includes(searchTerm.toLowerCase()) || product.caption2?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || product.categorias === selectedCategory;
    return matchesSearch && matchesCategory;
  });
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-allin-bg-light-1 dark:bg-allin-bg-dark-1", children: [
    /* @__PURE__ */ jsx(PublicHeader, {}),
    /* @__PURE__ */ jsx("div", { className: "pt-20", children: /* @__PURE__ */ jsx("section", { className: "py-20", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "text-center mb-12", children: [
        /* @__PURE__ */ jsxs("h1", { className: "text-4xl md:text-5xl font-bold mb-6 text-allin-dark dark:text-allin-white", children: [
          "Buscar ",
          /* @__PURE__ */ jsx("span", { className: "text-allin-orange", children: "Produtos" })
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-xl text-allin-dark/80 dark:text-allin-white/80 max-w-2xl mx-auto", children: "Encontre o produto ideal para suas necessidades" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mb-8 flex flex-col md:flex-row gap-4 items-center justify-between", children: [
        /* @__PURE__ */ jsxs("div", { className: "relative flex-1 max-w-md", children: [
          /* @__PURE__ */ jsx(Search, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-allin-dark/50 dark:text-allin-white/50 h-5 w-5" }),
          /* @__PURE__ */ jsx("input", { type: "text", placeholder: "Buscar produtos...", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value), className: "w-full pl-10 pr-4 py-3 rounded-xl border border-allin-orange/30 bg-white dark:bg-allin-bg-dark-2 text-allin-dark dark:text-allin-white focus:outline-none focus:ring-2 focus:ring-allin-orange" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex gap-2 items-center", children: [
          /* @__PURE__ */ jsx(Filter, { className: "text-allin-orange h-5 w-5" }),
          /* @__PURE__ */ jsx("select", { value: selectedCategory, onChange: (e) => setSelectedCategory(e.target.value), className: "px-4 py-3 rounded-xl border border-allin-orange/30 bg-white dark:bg-allin-bg-dark-2 text-allin-dark dark:text-allin-white focus:outline-none focus:ring-2 focus:ring-allin-orange", children: categories.map((cat) => /* @__PURE__ */ jsx("option", { value: cat, children: cat === "all" ? "Todas as Categorias" : cat }, cat)) })
        ] })
      ] }),
      loading ? /* @__PURE__ */ jsxs("div", { className: "text-center py-20", children: [
        /* @__PURE__ */ jsx("div", { className: "inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-allin-orange border-r-transparent" }),
        /* @__PURE__ */ jsx("p", { className: "mt-4 text-allin-dark/80 dark:text-allin-white/80", children: "Carregando produtos..." })
      ] }) : filteredProducts.length === 0 ? /* @__PURE__ */ jsx("div", { className: "text-center py-20", children: /* @__PURE__ */ jsxs("p", { className: "text-xl text-allin-dark/80 dark:text-allin-white/80", children: [
        'Nenhum produto encontrado para "',
        searchTerm,
        '"'
      ] }) }) : /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", children: filteredProducts.map((product) => /* @__PURE__ */ jsx(ProductCard, { image: product.imgSrc, title: product.caption, description: product.caption2, price: product.price, tag: product.produtoTag, onDetailsClick: () => console.log("Details clicked", product.id), onAddToCart: () => console.log("Add to cart", product.id) }, product.id)) }),
      /* @__PURE__ */ jsx("div", { className: "mt-16 text-center", children: isDefaultTenant ? /* @__PURE__ */ jsx(Link, { to: "/loja", children: /* @__PURE__ */ jsx(Button, { variant: "vibrantOutline", size: "lg", className: "text-lg px-8 py-6", children: "Voltar para a Loja" }) }) : /* @__PURE__ */ jsx(Link, { to: "/loja/$slug", params: {
        slug: sponsorSlug
      }, children: /* @__PURE__ */ jsx(Button, { variant: "vibrantOutline", size: "lg", className: "text-lg px-8 py-6", children: "Voltar para a Loja" }) }) })
    ] }) }) }),
    /* @__PURE__ */ jsx(Footer, {})
  ] });
}
export {
  ProductSearchPage as component
};
