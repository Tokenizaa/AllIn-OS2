import { R as React, j as jsxRuntimeExports, r as reactExports } from "../_libs/react.mjs";
import { F as Footer } from "./Footer-Brjh0GqW.mjs";
import { S as StyleProvider, P as PublicHeader, B as Button, e as useSharedStyles, p as productsService } from "./router-BZaVudxP.mjs";
import { A as Avatar, b as AvatarImage, a as AvatarFallback } from "./avatar-BEKH3ihV.mjs";
import { C as Card, a as CardContent } from "./card-JWqKexpr.mjs";
import { P as ProductGallery, C as CartSidebar } from "./CartSidebar-DkYld7sC.mjs";
import { u as useToast } from "./use-toast-DdRhLTSk.mjs";
import "../_libs/sonner.mjs";
import { O as MapPin, R as MessageCircle, S as ShoppingBag, n as Star, V as Phone, Y as Instagram, _ as Mail } from "../_libs/lucide-react.mjs";

import "../_libs/tanstack__react-router.mjs";
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
import "../_libs/radix-ui__react-avatar.mjs";
import "../_libs/radix-ui__react-context.mjs";
import "../_libs/@radix-ui/react-use-callback-ref+[...].mjs";
import "../_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "../_libs/radix-ui__react-primitive.mjs";
import "../_libs/@radix-ui/react-use-is-hydrated+[...].mjs";
import "../_libs/use-sync-external-store.mjs";
import "./skeleton-ATJguDyB.mjs";
import "./priceFormatter-BwKD4_Ti.mjs";
import "./dialog-CA20Qzyy.mjs";
import "../_libs/radix-ui__react-dialog.mjs";
import "../_libs/radix-ui__primitive.mjs";
import "../_libs/radix-ui__react-id.mjs";
import "../_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "../_libs/@radix-ui/react-dismissable-layer+[...].mjs";
import "../_libs/@radix-ui/react-use-escape-keydown+[...].mjs";
import "../_libs/radix-ui__react-focus-scope.mjs";
import "../_libs/radix-ui__react-portal.mjs";
import "../_libs/radix-ui__react-presence.mjs";
import "../_libs/radix-ui__react-focus-guards.mjs";
import "../_libs/react-remove-scroll.mjs";
import "../_libs/react-remove-scroll-bar.mjs";
import "../_libs/react-style-singleton.mjs";
import "../_libs/get-nonce.mjs";
import "../_libs/use-sidecar.mjs";
import "../_libs/use-callback-ref.mjs";
import "../_libs/aria-hidden.mjs";
import "./tabs-DH3dyAiq.mjs";
import "../_libs/radix-ui__react-tabs.mjs";
import "../_libs/radix-ui__react-roving-focus.mjs";
import "../_libs/radix-ui__react-collection.mjs";
import "../_libs/radix-ui__react-direction.mjs";
import "./sheet-1svGASis.mjs";
const ContactInfo = ({
  contact,
  onWhatsAppClick,
  onInstagramClick,
  className = ""
}) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `space-y-4 ${className}`, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 p-4 bg-white/30 dark:bg-allin-bg-dark-2/30 rounded-lg border border-allin-orange/10", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 bg-green-500 rounded-full flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { className: "w-6 h-6 text-white" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-bold text-allin-dark dark:text-allin-white", children: "WhatsApp" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-allin-dark/80 dark:text-allin-white/80", children: contact.whatsapp })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          onClick: onWhatsAppClick,
          className: "bg-green-500 hover:bg-green-600 text-white",
          children: "Chamar"
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 p-4 bg-white/30 dark:bg-allin-bg-dark-2/30 rounded-lg border border-allin-orange/10", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 bg-pink-500 rounded-full flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Instagram, { className: "w-6 h-6 text-white" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-bold text-allin-dark dark:text-allin-white", children: "Instagram" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-allin-dark/80 dark:text-allin-white/80", children: [
          "@",
          contact.instagram
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          onClick: onInstagramClick,
          className: "bg-pink-500 hover:bg-pink-600 text-white",
          children: "Seguir"
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 p-4 bg-white/30 dark:bg-allin-bg-dark-2/30 rounded-lg border border-allin-orange/10", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "w-6 h-6 text-white" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-bold text-allin-dark dark:text-allin-white", children: "Email" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-allin-dark/80 dark:text-allin-white/80", children: contact.email })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 p-4 bg-white/30 dark:bg-allin-bg-dark-2/30 rounded-lg border border-allin-orange/10", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "w-6 h-6 text-white" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-bold text-allin-dark dark:text-allin-white", children: "Endereço" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-allin-dark/80 dark:text-allin-white/80", children: contact.address })
      ] })
    ] })
  ] });
};
const ReviewCard = ({ review, className = "" }) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `flex gap-4 p-4 bg-white/30 dark:bg-allin-bg-dark-2/30 rounded-lg border border-allin-orange/10 ${className}`, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Avatar, { className: "w-12 h-12 border-2 border-allin-orange", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarImage, { src: review.avatar, alt: review.name }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarFallback, { className: "bg-allin-orange text-allin-dark font-bold", children: review.name.charAt(0) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-bold text-allin-dark dark:text-allin-white", children: review.name }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex", children: [...Array(5)].map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          Star,
          {
            className: `w-4 h-4 ${i < review.rating ? "text-yellow-400 fill-current" : "text-gray-300"}`
          },
          i
        )) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-allin-dark/80 dark:text-allin-white/80 text-sm leading-relaxed", children: review.comment })
    ] })
  ] });
};
const ReviewsAndContact = ({
  reviews,
  storeInfo,
  onWhatsAppClick,
  onInstagramClick
}) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "py-16 px-4 bg-allin-bg-light-2 dark:bg-allin-bg-dark-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "container mx-auto max-w-6xl", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid md:grid-cols-2 gap-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-3xl font-bold text-allin-dark dark:text-allin-white mb-6", children: "O que nossos clientes dizem" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", children: reviews.map((review) => /* @__PURE__ */ jsxRuntimeExports.jsx(ReviewCard, { review }, review.id)) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-3xl font-bold text-allin-dark dark:text-allin-white mb-6", children: "Entre em contato" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        ContactInfo,
        {
          contact: storeInfo.contact,
          onWhatsAppClick,
          onInstagramClick
        }
      )
    ] })
  ] }) }) });
};
const AllInLogo = ({ className = "", size = "md" }) => {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
    xl: "w-24 h-24"
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `inline-flex items-center justify-center ${sizeClasses[size]} ${className}`, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "svg",
    {
      viewBox: "0 0 100 100",
      className: "w-full h-full",
      xmlns: "http://www.w3.org/2000/svg",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "path",
          {
            d: "M50 10 C30 10 15 25 15 45 C15 65 25 80 40 85 C45 87 50 88 55 87 C70 82 80 67 80 47 C80 27 65 10 50 10 Z",
            fill: "currentColor",
            className: "text-allin-orange"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "path",
          {
            d: "M30 40 L45 55 L55 45 L70 60",
            stroke: "currentColor",
            strokeWidth: "3",
            fill: "none",
            className: "text-allin-dark dark:text-allin-white"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "path",
          {
            d: "M35 50 L45 60 L55 50 L65 60",
            stroke: "currentColor",
            strokeWidth: "3",
            fill: "none",
            className: "text-allin-dark dark:text-allin-white"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "text",
          {
            x: "50",
            y: "95",
            textAnchor: "middle",
            fontSize: "12",
            fontWeight: "bold",
            fill: "currentColor",
            className: "text-allin-dark dark:text-allin-white",
            children: "ALL IN"
          }
        )
      ]
    }
  ) });
};
const RatingDisplay = ({
  rating,
  reviewCount,
  size = "md",
  showText = true,
  className = ""
}) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6"
  };
  const textSizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg"
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `flex items-center gap-1 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 ${className}`, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex", children: [...Array(5)].map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      Star,
      {
        className: `${sizeClasses[size]} ${i < Math.floor(rating) ? "text-yellow-400 fill-current" : "text-gray-300"}`
      },
      i
    )) }),
    showText && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `ml-2 font-bold ${textSizeClasses[size]}`, children: rating }),
      reviewCount && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: `ml-1 ${textSizeClasses[size]} opacity-80`, children: [
        "(",
        reviewCount,
        " avaliações)"
      ] })
    ] })
  ] });
};
const StoreHeroSection = ({
  storeInfo,
  onWhatsAppClick,
  onProductsClick
}) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "relative", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative h-80 bg-gradient-to-r from-allin-bg-light-1 to-allin-bg-light-2 dark:bg-allin-bg-dark-1", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-black/30 dark:bg-black/40" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center text-white space-y-4 max-w-4xl mx-auto px-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-4 mb-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(AllInLogo, { size: "xl", className: "border-4 border-white/50" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-left", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-4xl md:text-5xl font-bold mb-2", children: storeInfo.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xl text-white/90 mb-2", children: storeInfo.category }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "w-5 h-5" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-lg", children: storeInfo.city })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center gap-4 mb-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(RatingDisplay, { rating: storeInfo.rating, reviewCount: storeInfo.reviewCount }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-3 justify-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            onClick: onWhatsAppClick,
            className: "bg-green-500 hover:bg-green-600 text-white gap-2 px-6 py-3",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(MessageCircle, { className: "w-5 h-5" }),
              " Fale com o Lojista"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            variant: "outline",
            onClick: onProductsClick,
            className: "border-white text-white hover:bg-white hover:text-allin-orange gap-2 px-6 py-3",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingBag, { className: "w-5 h-5" }),
              " Ver Produtos"
            ]
          }
        )
      ] })
    ] }) })
  ] }) });
};
const OptimizedImage = ({
  src,
  alt,
  className = "",
  fallbackSrc = "https://placehold.co/400x400?text=Imagem+Indisponível",
  onError
}) => {
  const [imageSrc, setImageSrc] = React.useState(src);
  const [isLoading, setIsLoading] = React.useState(true);
  const [hasError, setHasError] = React.useState(false);
  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      setImageSrc(fallbackSrc);
      onError?.();
    }
  };
  const handleLoad = () => {
    setIsLoading(false);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `relative ${className}`, children: [
    isLoading && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-lg flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 border-2 border-allin-orange border-t-transparent rounded-full animate-spin" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "img",
      {
        src: imageSrc,
        alt,
        className: `transition-opacity duration-300 ${isLoading ? "opacity-0" : "opacity-100"} ${className}`,
        onError: handleError,
        onLoad: handleLoad
      }
    )
  ] });
};
const StoreCategories = ({
  loading,
  categories,
  products,
  hidden = false
}) => {
  const { section, title, subtitle } = useSharedStyles();
  if (hidden) {
    return null;
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: section, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto max-w-7xl", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center mb-12", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: title, children: [
        "Explore por ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-allin-orange", children: "Categorias" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: subtitle, children: "Navegue pelas nossas categorias e encontre exatamente o que você procura." })
    ] }),
    loading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6", children: Array.from({ length: 4 }).map((_, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-48 bg-allin-bg-light-2 dark:bg-allin-bg-dark-2 animate-pulse" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-6 bg-allin-bg-light-3 dark:bg-allin-bg-dark-3 animate-pulse mb-2" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-4 bg-allin-bg-light-3 dark:bg-allin-bg-dark-3 animate-pulse w-3/4" })
      ] })
    ] }, index)) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6", children: categories.slice(0, 4).map((category) => {
      const mainProduct = products.find((p) => p.categorias === category.name);
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "group cursor-pointer overflow-hidden bg-white/50 dark:bg-allin-bg-dark-1/50 backdrop-blur-sm border border-allin-orange/20 hover:border-allin-orange/50 transition-all duration-300 hover:shadow-xl", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative h-48 overflow-hidden", children: [
          mainProduct ? /* @__PURE__ */ jsxRuntimeExports.jsx(
            OptimizedImage,
            {
              src: mainProduct.imgSrc,
              alt: category.name,
              className: "w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-full bg-allin-bg-light-2 dark:bg-allin-bg-dark-2 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-allin-dark dark:text-allin-white", children: "Imagem não disponível" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute bottom-4 left-4 right-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xl font-bold text-white mb-1", children: category.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-white/80 text-sm", children: [
              category.productCount,
              " produtos"
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "default", className: "w-full bg-allin-orange hover:bg-allin-orange/90 text-allin-dark", children: "Ver Produtos" }) })
      ] }, category.id);
    }) })
  ] }) });
};
const useProductsFromCSV = () => {
  const [products, setProducts] = reactExports.useState([]);
  const [categories, setCategories] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  const [error, setError] = reactExports.useState(null);
  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const productsData = await productsService.getAllProducts();
      setProducts(productsData);
      const categoryMap = /* @__PURE__ */ new Map();
      productsData.forEach((product) => {
        const categoryName = product.categorias;
        if (categoryName) {
          categoryMap.set(categoryName, (categoryMap.get(categoryName) || 0) + 1);
        }
      });
      const categoriesData = Array.from(categoryMap.entries()).map(([name, count], index) => ({
        id: index + 1,
        name,
        productCount: count
      }));
      setCategories(categoriesData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load products");
      console.error("Error loading products:", err);
    } finally {
      setLoading(false);
    }
  };
  reactExports.useEffect(() => {
    loadProducts();
  }, []);
  const getProductsByCategory = (categoryName) => {
    return products.filter((product) => product.categorias === categoryName);
  };
  const refreshProducts = async () => {
    await loadProducts();
  };
  return {
    products,
    categories,
    loading,
    error,
    getProductsByCategory,
    refreshProducts
  };
};
const neutralStore = {
  id: "store-placeholder",
  name: "Loja",
  slug: "store",
  description: "Loja pública carregada em runtime.",
  category: "Geral",
  city: "Brasil",
  rating: 0,
  reviewCount: 0,
  contact: {
    whatsapp: "",
    instagram: "",
    email: "",
    address: ""
  }
};
function LojaPage() {
  const {
    toast
  } = useToast();
  const {
    products,
    loading,
    error
  } = useProductsFromCSV();
  const [storeInfo, setStoreInfo] = React.useState(neutralStore);
  const [reviews] = React.useState([]);
  const [isLoadingStore, setIsLoadingStore] = React.useState(true);
  React.useEffect(() => {
    setStoreInfo(neutralStore);
    setIsLoadingStore(false);
  }, [toast]);
  const getSmartCategories = () => {
    if (!products || products.length === 0) return [];
    const categoryMap = /* @__PURE__ */ new Map();
    products.forEach((product) => {
      const categoryName = product.categorias;
      if (categoryName) {
        categoryMap.set(categoryName, (categoryMap.get(categoryName) || 0) + 1);
      }
    });
    return Array.from(categoryMap.entries()).map(([name, count], index) => ({
      id: index + 1,
      name,
      productCount: count
    }));
  };
  const smartCategories = getSmartCategories();
  const handleWhatsAppContact = () => {
    window.open(`https://wa.me/${storeInfo.contact.whatsapp.replace(/\D/g, "")}`, "_blank");
    toast({
      title: "Redirecionando...",
      description: "Abrindo WhatsApp para contato."
    });
  };
  const handleInstagramContact = () => {
    if (storeInfo.contact.instagram) {
      window.open(`https://instagram.com/${storeInfo.contact.instagram.replace("@", "")}`, "_blank");
      toast({
        title: "Redirecionando...",
        description: "Abrindo Instagram da loja."
      });
    }
  };
  const handleScrollToProducts = () => {
    const productsSection = document.getElementById("produtos-destaque");
    productsSection?.scrollIntoView({
      behavior: "smooth"
    });
  };
  React.useEffect(() => {
    if (error) {
      console.error("Erro ao carregar produtos:", error);
      toast({
        title: "Erro ao carregar produtos",
        description: "Estamos trabalhando para resolver o problema. Por favor, tente novamente mais tarde.",
        variant: "destructive"
      });
    }
  }, [error, toast]);
  if (isLoadingStore) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-allin-orange" }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(StyleProvider, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen flex flex-col", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PublicHeader, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "flex-1 pt-20", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(StoreHeroSection, { storeInfo, onWhatsAppClick: handleWhatsAppContact, onProductsClick: handleScrollToProducts }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StoreCategories, { loading, categories: smartCategories, products, hidden: false }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("section", { id: "produtos-destaque", className: "py-16 bg-white dark:bg-allin-bg-dark-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "container mx-auto px-4 max-w-7xl", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ProductGallery, {}) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(ReviewsAndContact, { reviews, storeInfo, onWhatsAppClick: handleWhatsAppContact, onInstagramClick: handleInstagramContact })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Footer, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: storeInfo.contact.whatsapp ? `https://wa.me/${storeInfo.contact.whatsapp.replace(/\D/g, "")}` : "#", target: "_blank", rel: "noopener noreferrer", className: "fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-[#25D366] hover:bg-[#128C7E] flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300", "aria-label": "Fale conosco pelo WhatsApp", children: /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: "currentColor", className: "text-white", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M17.472 14.382c-.297-.149-1.758-.867-2.03-.966-.273-.099-.471-.148-.67.15-.197.297-.767.963-.94 1.16-.173.199-.347.221-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.795-1.484-1.784-1.66-2.087-.173-.297-.018-.458.13-.605.136-.135.298-.354.446-.471.149-.148.198-.248.298-.413.099-.167.05-.31-.025-.434-.075-.124-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.508a.704.703 0 0 0-.509.174l-.38.383c-.13.124-.347.36-.347.869s.347.99.396 1.06c.05.061.72 1.088 1.746 1.726 1.015.628 1.115.525 1.23.486.114-.04.695-.286.793-.888.099-.603.099-1.121.149-1.145s.183-.04.297-.025c.114.016.741.105 1.737.893.47.372.815.85 1.002 1.362.198.54.19 1.09.14 1.34-.05.25-.298.4-.546.606-.173.136-.372.283-.521.424-.173.157-.361.161-.669.05-.297-.112-1.265-.463-2.04-1.524-.694-.94-1.164-2.01-1.294-2.35-.13-.34-.015-.524.09-.692.096-.157.223-.37.33-.504.1-.136.149-.224.223-.36.05-.136.025-.255-.013-.355-.04-.099-.367-.9-.503-1.235-.13-.32-.26-.278-.367-.278h-.313c-.099 0-.272.04-.417.186-.148.15-.559.548-.559 1.335 0 .785.57 1.549.64 1.649.074.1.992 1.573 2.45 2.163.694.302 1.236.48 1.658.613.694.223 1.33.193 1.83.117.57-.09 1.757-.721 2.004-1.426.248-.704.248-1.307.173-1.43-.074-.124-.273-.198-.57-.347m-5.446 7.443h-.016a7.455 7.455 0 0 1-3.73-1.001l-.268-.16-2.71.711.724-2.64-.17-.268a7.44 7.44 0 0 1-1.14-3.965c0-4.12 3.36-7.48 7.492-7.48 2.008 0 3.89.78 5.303 2.196 1.415 1.418 2.192 3.305 2.192 5.296-.008 4.128-3.368 7.488-7.497 7.488m4.498-18.825h-8.994c-5.25 0-9.506 4.275-9.506 9.526 0 1.708.45 3.37 1.304 4.823l-1.368 4.99 5.118-1.346a9.48 9.48 0 0 0 4.86 1.328h.006c5.25 0 9.526-4.274 9.526-9.526 0-5.251-4.275-9.526-9.526-9.526" }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(CartSidebar, {})
  ] }) });
}
export {
  LojaPage as component
};
