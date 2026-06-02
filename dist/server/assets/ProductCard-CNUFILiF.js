import { jsxs, jsx } from "react/jsx-runtime";
import { memo } from "react";
import { B as Button } from "./router-OVqp2Aj1.js";
import { C as Card, b as CardHeader, c as CardTitle, a as CardContent } from "./card-DLLoBO9R.js";
import { f as formatPrice } from "./priceFormatter-BwKD4_Ti.js";
const ProductCardComponent = ({
  image,
  title,
  description,
  price,
  tag,
  onDetailsClick,
  onAddToCart,
  className = ""
}) => {
  const formattedPrice = formatPrice(price);
  return /* @__PURE__ */ jsxs(Card, { className: `overflow-hidden border border-allin-orange/40 shadow-lg hover:shadow-xl transition-all duration-300 bg-allin-bg-light-1 dark:bg-allin-bg-dark-1 group animate-slide-up glass-card h-full flex flex-col dark:dark:bg-allin-bg-dark-3 dark:dark:border-allin-bg-dark-2 ${className}`, children: [
    /* @__PURE__ */ jsxs("div", { className: "relative", children: [
      /* @__PURE__ */ jsx(
        "img",
        {
          src: image,
          alt: title,
          className: "w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105",
          onError: (e) => {
            const target = e.target;
            target.src = "https://placehold.co/400x400?text=Imagem+Indispon%C3%ADvel";
          }
        }
      ),
      tag && /* @__PURE__ */ jsx("div", { className: "absolute top-2 right-2 bg-allin-orange text-allin-dark text-xs font-bold px-2 py-1 rounded-full", children: tag })
    ] }),
    /* @__PURE__ */ jsxs(CardHeader, { className: "p-4", children: [
      /* @__PURE__ */ jsx(CardTitle, { className: "text-lg font-bold text-allin-orange line-clamp-1", children: title }),
      /* @__PURE__ */ jsxs("p", { className: "text-sm text-allin-dark/80 dark:text-allin-white/80 line-clamp-2", children: [
        description.substring(0, 100),
        "..."
      ] }),
      /* @__PURE__ */ jsx("p", { className: "text-xl font-bold text-allin-orange mt-2", children: formattedPrice || "Preço não disponível" })
    ] }),
    /* @__PURE__ */ jsx(CardContent, { className: "p-4 mt-auto", children: /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
      onDetailsClick && /* @__PURE__ */ jsx(
        Button,
        {
          variant: "vibrantOutline",
          className: "flex-1",
          onClick: onDetailsClick,
          children: "Detalhes"
        }
      ),
      onAddToCart && /* @__PURE__ */ jsx(
        Button,
        {
          variant: "vibrant",
          className: "flex-1",
          onClick: onAddToCart,
          children: "Comprar"
        }
      )
    ] }) })
  ] });
};
ProductCardComponent.displayName = "ProductCard";
const ProductCard = memo(ProductCardComponent);
export {
  ProductCard as P
};
