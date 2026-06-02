import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import { useState, useEffect, memo } from "react";
import { UserPlus, Truck, RotateCcw, Shield, Package, Tag, Star, Zap, Waves, Wind, CheckCircle, Minus, Plus, ShoppingCart, ArrowRight, Trash2, MessageCircle } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { B as Button, a as Badge, k as useCart, h as useProducts, l as useStoreSettings } from "./router-C3cuB5ui.js";
import { C as Card, b as CardHeader, c as CardTitle, a as CardContent } from "./card-Cp4xOC4k.js";
import { S as Skeleton } from "./skeleton-BZZZo1SF.js";
import { f as formatPrice } from "./priceFormatter-BwKD4_Ti.js";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogDescription } from "./dialog-BcW_29Ir.js";
import { T as Tabs, a as TabsList, b as TabsTrigger, c as TabsContent } from "./tabs-BmI8ndQo.js";
import { S as Sheet, a as SheetContent, b as SheetHeader, c as SheetTitle } from "./sheet-Cs3qIN9i.js";
import { u as useToast } from "./use-toast-DdRhLTSk.js";
const useModal = (isOpen = false) => {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (isOpen) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  }, [isOpen]);
  const close = (callback) => {
    setVisible(false);
    setTimeout(() => {
      callback?.();
    }, 300);
  };
  return {
    isVisible: visible,
    close
  };
};
const AdditionalInfo = ({ onClose }) => {
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("div", { className: "border-t border-allin-orange/20 p-4 md:p-6 bg-allin-bg-light-2 dark:bg-allin-bg-dark-2 mx-4 md:mx-0", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs("h3", { className: "text-xl md:text-lg font-bold text-allin-orange flex items-center justify-center md:justify-start gap-2", children: [
          /* @__PURE__ */ jsx(UserPlus, { className: "w-5 h-5" }),
          "Gostou do produto? Torne-se um revendedor!"
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-lg md:text-base text-allin-dark/80 dark:text-allin-white/80 mt-1", children: "Transforme sua paixão em uma oportunidade de negócio com a All In Brasil." })
      ] }),
      /* @__PURE__ */ jsx(
        Button,
        {
          variant: "vibrantOutline",
          className: "flex items-center justify-center gap-2 h-11 text-base font-semibold px-6 shrink-0",
          onClick: () => {
            window.location.href = "/distribuidores";
            onClose();
          },
          children: "Saber Mais"
        }
      )
    ] }) }),
    /* @__PURE__ */ jsx("div", { className: "border-t border-allin-orange/20 p-4 md:p-6 bg-allin-bg-light-1 dark:bg-allin-bg-dark-2 hidden mx-4 md:mx-0", children: /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3", children: [
        /* @__PURE__ */ jsx(Truck, { className: "w-5 h-5 md:w-6 md:h-6 text-allin-orange mt-1" }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h4", { className: "text-xl md:text-lg font-bold text-allin-dark dark:text-allin-white", children: "Frete Grátis" }),
          /* @__PURE__ */ jsx("p", { className: "text-lg md:text-base text-allin-dark/80 dark:text-allin-white/80", children: "Para todo o Brasil" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3", children: [
        /* @__PURE__ */ jsx(RotateCcw, { className: "w-5 h-5 md:w-6 md:h-6 text-allin-orange mt-1" }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h4", { className: "text-xl md:text-lg font-bold text-allin-dark dark:text-allin-white", children: "Devolução Fácil" }),
          /* @__PURE__ */ jsx("p", { className: "text-lg md:text-base text-allin-dark/80 dark:text-allin-white/80", children: "30 dias para troca" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3", children: [
        /* @__PURE__ */ jsx(Shield, { className: "w-5 h-5 md:w-6 md:h-6 text-allin-orange mt-1" }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h4", { className: "text-xl md:text-lg font-bold text-allin-dark dark:text-allin-white", children: "Garantia" }),
          /* @__PURE__ */ jsx("p", { className: "text-lg md:text-base text-allin-dark/80 dark:text-allin-white/80", children: "90 dias contra defeitos" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3", children: [
        /* @__PURE__ */ jsx(Package, { className: "w-5 h-5 md:w-6 md:h-6 text-allin-orange mt-1" }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h4", { className: "text-xl md:text-lg font-bold text-allin-dark dark:text-allin-white", children: "Entrega Rápida" }),
          /* @__PURE__ */ jsx("p", { className: "text-lg md:text-base text-allin-dark/80 dark:text-allin-white/80", children: "Em até 5 dias úteis" })
        ] })
      ] })
    ] }) })
  ] });
};
const ImageGallery = ({ product, selectedImage, onImageSelect }) => {
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "relative overflow-hidden rounded-xl border border-allin-orange/30 bg-allin-bg-light-1 dark:bg-allin-bg-dark-1 aspect-square", children: [
      /* @__PURE__ */ jsx(
        "img",
        {
          src: selectedImage,
          alt: product.caption,
          className: "w-full h-full object-contain",
          onError: (e) => {
            const target = e.target;
            target.src = "https://placehold.co/600x600?text=Imagem+Indisponível";
          }
        }
      ),
      product.produtoTag && /* @__PURE__ */ jsx(Badge, { className: "absolute top-4 right-4 bg-allin-orange text-allin-dark px-3 py-1 text-sm font-bold", children: product.produtoTag })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex gap-4", children: [
      /* @__PURE__ */ jsx(
        "div",
        {
          className: `relative overflow-hidden rounded-lg border-2 cursor-pointer transition-all ${selectedImage === product.imgFluidSrc ? "border-allin-orange" : "border-allin-orange/20"}`,
          onClick: () => onImageSelect(product.imgFluidSrc),
          children: /* @__PURE__ */ jsx(
            "img",
            {
              src: product.imgFluidSrc,
              alt: `${product.caption} - vista 1`,
              className: "w-16 h-16 md:w-20 md:h-20 object-cover",
              onError: (e) => {
                const target = e.target;
                target.src = "https://placehold.co/300x300?text=Imagem+Indisponível";
              }
            }
          )
        }
      ),
      product.imgFluidSrc2 && /* @__PURE__ */ jsx(
        "div",
        {
          className: `relative overflow-hidden rounded-lg border-2 cursor-pointer transition-all ${selectedImage === product.imgFluidSrc2 ? "border-allin-orange" : "border-allin-orange/20"}`,
          onClick: () => onImageSelect(product.imgFluidSrc2),
          children: /* @__PURE__ */ jsx(
            "img",
            {
              src: product.imgFluidSrc2,
              alt: `${product.caption} - vista 2`,
              className: "w-16 h-16 md:w-20 md:h-20 object-cover",
              onError: (e) => {
                const target = e.target;
                target.src = "https://placehold.co/300x300?text=Imagem+Indisponível";
              }
            }
          )
        }
      )
    ] })
  ] });
};
const ProductInfo = ({
  product,
  selectedSize,
  quantity,
  onSizeSelect,
  onQuantityChange,
  onAddToCart
}) => {
  const sizes = [
    { size: "34", measure: "23,2" },
    { size: "35", measure: "23,9" },
    { size: "36", measure: "24,5" },
    { size: "37", measure: "25,2" },
    { size: "38", measure: "25,9" },
    { size: "39", measure: "26,5" },
    { size: "40", measure: "27,2" },
    { size: "41", measure: "27,9" },
    { size: "42", measure: "28,5" },
    { size: "43", measure: "29,2" },
    { size: "44", measure: "29,9" }
  ];
  const incrementQuantity = () => {
    onQuantityChange(quantity + 1);
  };
  const decrementQuantity = () => {
    onQuantityChange(Math.max(1, quantity - 1));
  };
  return /* @__PURE__ */ jsxs("div", { className: "space-y-8", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
        /* @__PURE__ */ jsx(Tag, { className: "w-6 h-6 text-allin-orange" }),
        /* @__PURE__ */ jsx("span", { className: "text-3xl md:text-4xl font-bold text-allin-orange", children: formatPrice(product.price) || "Preço não disponível" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex text-yellow-400", children: [
          /* @__PURE__ */ jsx(Star, { className: "w-5 h-5 fill-current" }),
          /* @__PURE__ */ jsx(Star, { className: "w-5 h-5 fill-current" }),
          /* @__PURE__ */ jsx(Star, { className: "w-5 h-5 fill-current" }),
          /* @__PURE__ */ jsx(Star, { className: "w-5 h-5 fill-current" }),
          /* @__PURE__ */ jsx(Star, { className: "w-5 h-5 fill-current" })
        ] }),
        /* @__PURE__ */ jsx("span", { className: "text-lg font-medium", children: "5.0" }),
        /* @__PURE__ */ jsx("span", { className: "text-base md:text-lg text-allin-dark/80 dark:text-allin-white/80", children: "(128 avaliações)" })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
      /* @__PURE__ */ jsx("h3", { className: "text-2xl md:text-xl font-bold text-allin-dark dark:text-allin-white", children: "Tecnologias Exclusivas" }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-3 gap-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center p-4 rounded-lg bg-allin-orange/10 border border-allin-orange/20", children: [
          /* @__PURE__ */ jsx("div", { className: "w-12 h-12 bg-allin-orange rounded-full flex items-center justify-center mb-3", children: /* @__PURE__ */ jsx(Zap, { className: "w-6 h-6 text-allin-dark" }) }),
          /* @__PURE__ */ jsx("span", { className: "text-lg md:text-sm font-medium text-center text-allin-dark dark:text-allin-white", children: "Magnetoterapia" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center p-4 rounded-lg bg-allin-orange/10 border border-allin-orange/20", children: [
          /* @__PURE__ */ jsx("div", { className: "w-12 h-12 bg-allin-orange rounded-full flex items-center justify-center mb-3", children: /* @__PURE__ */ jsx(Waves, { className: "w-6 h-6 text-allin-dark" }) }),
          /* @__PURE__ */ jsx("span", { className: "text-lg md:text-sm font-medium text-center text-allin-dark dark:text-allin-white", children: "Infravermelho" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center p-4 rounded-lg bg-allin-orange/10 border border-allin-orange/20", children: [
          /* @__PURE__ */ jsx("div", { className: "w-12 h-12 bg-allin-orange rounded-full flex items-center justify-center mb-3", children: /* @__PURE__ */ jsx(Wind, { className: "w-6 h-6 text-allin-dark" }) }),
          /* @__PURE__ */ jsx("span", { className: "text-lg md:text-sm font-medium text-center text-allin-dark dark:text-allin-white", children: "Tecido Knit" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs(Tabs, { defaultValue: "description", className: "w-full", children: [
      /* @__PURE__ */ jsxs(TabsList, { className: "grid w-full grid-cols-3", children: [
        /* @__PURE__ */ jsx(TabsTrigger, { value: "description", className: "text-lg md:text-sm py-3", children: "Descrição" }),
        /* @__PURE__ */ jsx(TabsTrigger, { value: "specifications", className: "text-lg md:text-sm py-3", children: "Especificações" }),
        /* @__PURE__ */ jsx(TabsTrigger, { value: "benefits", className: "text-lg md:text-sm py-3", children: "Benefícios" })
      ] }),
      /* @__PURE__ */ jsx(TabsContent, { value: "description", className: "mt-6", children: /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxs("p", { className: "text-lg md:text-sm text-allin-dark/90 dark:text-allin-white/90 leading-relaxed", children: [
          "O ",
          product.caption,
          " oferece a combinação perfeita de elegância, conforto e tecnologias terapêuticas. Equipado com magnetoterapia e infravermelho longo, ele proporciona alívio de dores, melhora da circulação e acelera a recuperação muscular, tudo isso em um design sofisticado e moderno, ideal para o seu dia a dia."
        ] }),
        /* @__PURE__ */ jsxs("p", { className: "text-lg md:text-sm text-allin-dark/90 dark:text-allin-white/90 leading-relaxed", children: [
          "O ",
          product.caption,
          " traz um visual clean e atemporal, fácil de combinar com diferentes looks. Além de seu design elegante, ele oferece todo o conforto que seus pés precisam, sendo perfeito para longos períodos de uso."
        ] })
      ] }) }),
      /* @__PURE__ */ jsx(TabsContent, { value: "specifications", className: "mt-6", children: /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
        /* @__PURE__ */ jsx("h4", { className: "text-xl md:text-base font-semibold text-allin-orange", children: "Design Sofisticado e Confortável" }),
        /* @__PURE__ */ jsxs("ul", { className: "list-disc list-inside text-lg md:text-sm text-allin-dark/90 dark:text-allin-white/90 space-y-3 pl-1", children: [
          /* @__PURE__ */ jsx("li", { children: "Design minimalista: O tênis é versátil e combina com qualquer estilo." }),
          /* @__PURE__ */ jsx("li", { children: "Conforto absoluto: Feito com materiais de alta qualidade para garantir o máximo de conforto durante todo o dia." }),
          /* @__PURE__ */ jsx("li", { children: "Estilo sofisticado: Um design simples e elegante que eleva qualquer visual." })
        ] }),
        /* @__PURE__ */ jsx("h4", { className: "text-xl md:text-base font-semibold text-allin-orange mt-6", children: "Tecnologia Terapêutica Avançada" }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsx("h5", { className: "text-lg md:text-sm font-medium text-allin-dark dark:text-allin-white", children: "Tecnologia Knit" }),
            /* @__PURE__ */ jsx("p", { className: "text-lg md:text-sm text-allin-dark/90 dark:text-allin-white/90 leading-relaxed", children: "Proporciona flexibilidade e respirabilidade. O tecido se adapta aos seus pés, garantindo conforto e liberdade de movimento." })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsx("h5", { className: "text-lg md:text-sm font-medium text-allin-dark dark:text-allin-white", children: "Magnetoterapia" }),
            /* @__PURE__ */ jsx("p", { className: "text-lg md:text-sm text-allin-dark/90 dark:text-allin-white/90 leading-relaxed", children: "Melhora a circulação sanguínea, alivia dores e reduz o cansaço nos pés." })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsx("h5", { className: "text-lg md:text-sm font-medium text-allin-dark dark:text-allin-white", children: "Infravermelho Longo" }),
            /* @__PURE__ */ jsx("p", { className: "text-lg md:text-sm text-allin-dark/90 dark:text-allin-white/90 leading-relaxed", children: "Age diretamente nas células musculares, promovendo recuperação e aliviando tensões." })
          ] })
        ] })
      ] }) }),
      /* @__PURE__ */ jsx(TabsContent, { value: "benefits", className: "mt-6", children: /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
        /* @__PURE__ */ jsxs("h4", { className: "text-xl md:text-base font-semibold text-allin-orange", children: [
          "Benefícios do ",
          product.caption
        ] }),
        /* @__PURE__ */ jsxs("ul", { className: "list-disc list-inside text-lg md:text-sm text-allin-dark/90 dark:text-allin-white/90 space-y-4 pl-1", children: [
          /* @__PURE__ */ jsx("li", { children: "Design atemporal: Um clássico que nunca sai de moda, combinando com qualquer visual." }),
          /* @__PURE__ */ jsx("li", { children: "Conforto durante o dia inteiro: Seu material macio e respirável garante o máximo de conforto, mesmo após longas horas de uso." }),
          /* @__PURE__ */ jsx("li", { children: "Tecnologias terapêuticas: Magnetoterapia e infravermelho longo para alívio de dores, recuperação muscular e melhora da circulação." }),
          /* @__PURE__ */ jsx("li", { children: "Estilo e saúde: Conforto, elegância e bem-estar, tudo em um único produto." })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4 mt-6", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsx("div", { className: "w-6 h-6 bg-allin-orange/20 rounded-full flex items-center justify-center", children: /* @__PURE__ */ jsx("div", { className: "w-3 h-3 bg-allin-orange rounded-full" }) }),
            /* @__PURE__ */ jsx("span", { className: "text-lg md:text-sm", children: "Alívio de dores" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsx("div", { className: "w-6 h-6 bg-allin-orange/20 rounded-full flex items-center justify-center", children: /* @__PURE__ */ jsx("div", { className: "w-3 h-3 bg-allin-orange rounded-full" }) }),
            /* @__PURE__ */ jsx("span", { className: "text-lg md:text-sm", children: "Melhora da circulação" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsx("div", { className: "w-6 h-6 bg-allin-orange/20 rounded-full flex items-center justify-center", children: /* @__PURE__ */ jsx("div", { className: "w-3 h-3 bg-allin-orange rounded-full" }) }),
            /* @__PURE__ */ jsx("span", { className: "text-lg md:text-sm", children: "Recuperação muscular" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsx("div", { className: "w-6 h-6 bg-allin-orange/20 rounded-full flex items-center justify-center", children: /* @__PURE__ */ jsx("div", { className: "w-3 h-3 bg-allin-orange rounded-full" }) }),
            /* @__PURE__ */ jsx("span", { className: "text-lg md:text-sm", children: "Conforto 24h" })
          ] })
        ] })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "p-5 bg-allin-orange/10 rounded-lg border border-allin-orange/20", children: [
      /* @__PURE__ */ jsxs("h4", { className: "text-xl md:text-base font-bold text-allin-orange flex items-center gap-3", children: [
        /* @__PURE__ */ jsx(CheckCircle, { className: "w-6 h-6" }),
        "OBSERVAÇÃO IMPORTANTE"
      ] }),
      /* @__PURE__ */ jsx("p", { className: "text-lg md:text-sm text-allin-dark/90 dark:text-allin-white/90 mt-3 leading-relaxed", children: "Para garantir o melhor ajuste, recomendamos que escolha um número a menos do que normalmente usa. O modelo tende a ser maior do que os modelos tradicionais." }),
      /* @__PURE__ */ jsxs("p", { className: "text-lg md:text-sm text-allin-dark/90 dark:text-allin-white/90 mt-2 leading-relaxed", children: [
        /* @__PURE__ */ jsx("strong", { children: "Exemplo:" }),
        " Se você usa o número 39, escolha o número 38."
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "border-t border-allin-orange/20 pt-6 mt-6", children: /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx("h3", { className: "text-xl md:text-base font-bold text-allin-dark dark:text-allin-white", children: "Tamanho" }),
            /* @__PURE__ */ jsx(Badge, { variant: "secondary", className: "text-xs py-1", children: "Escolha um número a menos" })
          ] }),
          selectedSize && /* @__PURE__ */ jsxs("div", { className: "text-lg md:text-sm text-allin-dark/80 dark:text-allin-white/80", children: [
            "Selecionado: ",
            /* @__PURE__ */ jsx("span", { className: "font-semibold text-allin-orange", children: selectedSize })
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "grid grid-cols-6 sm:grid-cols-11 gap-1.5", children: sizes.map((size) => /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => onSizeSelect(size.size),
            className: `aspect-square rounded-md border-2 flex items-center justify-center text-lg md:text-sm font-medium transition-all duration-200 ${selectedSize === size.size ? "border-allin-orange bg-allin-orange text-allin-dark shadow-md scale-105" : "border-allin-orange/30 hover:border-allin-orange hover:bg-allin-orange/10 text-allin-dark dark:text-allin-white"}`,
            children: size.size
          },
          size.size
        )) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("h3", { className: "text-xl md:text-base font-bold text-allin-dark dark:text-allin-white mb-1", children: "Quantidade" }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsx(
                  Button,
                  {
                    variant: "vibrantOutline",
                    size: "sm",
                    className: "w-9 h-9 p-0",
                    onClick: decrementQuantity,
                    disabled: quantity <= 1,
                    children: /* @__PURE__ */ jsx(Minus, { className: "w-4 h-4" })
                  }
                ),
                /* @__PURE__ */ jsx("span", { className: "text-xl md:text-lg font-semibold w-10 text-center", children: quantity }),
                /* @__PURE__ */ jsx(
                  Button,
                  {
                    variant: "vibrantOutline",
                    size: "sm",
                    className: "w-9 h-9 p-0",
                    onClick: incrementQuantity,
                    children: /* @__PURE__ */ jsx(Plus, { className: "w-4 h-4" })
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "h-10 w-px bg-allin-orange/20 hidden sm:block" }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx(Tag, { className: "w-5 h-5 text-allin-orange" }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("div", { className: "text-sm text-allin-dark/80 dark:text-allin-white/80", children: "Preço Total" }),
                /* @__PURE__ */ jsx("div", { className: "text-2xl md:text-xl font-bold text-allin-orange", children: formatPrice(product.price ? (parseFloat(product.price.replace("R$", "").replace(",", ".")) * quantity).toString() : "0") || "Preço não disponível" })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "sm:ml-auto", children: /* @__PURE__ */ jsxs(
            Button,
            {
              variant: "vibrant",
              className: "flex items-center justify-center gap-2 h-11 text-lg md:text-sm font-semibold px-4",
              onClick: onAddToCart,
              disabled: !selectedSize,
              children: [
                /* @__PURE__ */ jsx(ShoppingCart, { className: "w-4 h-4" }),
                "Adicionar ao Carrinho"
              ]
            }
          ) })
        ] }),
        !selectedSize && /* @__PURE__ */ jsx("div", { className: "text-center pt-1", children: /* @__PURE__ */ jsx("p", { className: "text-lg md:text-sm text-allin-orange font-medium", children: "⚠️ Por favor, selecione um tamanho para continuar" }) })
      ] })
    ] }) })
  ] });
};
const ProductModal = ({ product, isOpen, onOpenChange }) => {
  const { addItem } = useCart();
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState("");
  const { isVisible, close } = useModal(isOpen);
  useEffect(() => {
    if (isOpen && product) {
      setSelectedImage(product.imgFluidSrc);
      setSelectedSize("");
      setQuantity(1);
    }
  }, [isOpen, product]);
  const handleClose = () => {
    close(() => onOpenChange(false));
  };
  const handleAddToCart = () => {
    if (!selectedSize) {
      alert("Por favor, selecione um tamanho.");
      return;
    }
    addItem(product.caption.toLowerCase().replace(/\s+/g, "-"), quantity);
    setSelectedSize("");
    setQuantity(1);
    onOpenChange(false);
  };
  const handleImageSelect = (imageSrc) => {
    setSelectedImage(imageSrc);
  };
  return /* @__PURE__ */ jsx(Dialog, { open: isOpen, onOpenChange: handleClose, children: /* @__PURE__ */ jsxs(DialogContent, { className: `w-full max-w-full h-[100dvh] md:max-w-6xl md:h-[95vh] overflow-y-auto p-0 rounded-none md:rounded-lg transition-all duration-300 ease-in-out ${isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"}`, "aria-describedby": "product-modal-description", children: [
    /* @__PURE__ */ jsx(DialogHeader, { className: "p-4 md:p-6 pb-4 border-b border-allin-orange/20 mx-2 md:mx-0", children: /* @__PURE__ */ jsx("div", { className: "flex justify-between items-start", children: /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx(DialogTitle, { className: "text-2xl md:text-3xl text-allin-orange font-bold leading-tight", children: product.caption }),
      /* @__PURE__ */ jsxs(DialogDescription, { className: "text-lg md:text-base text-allin-dark/80 dark:text-allin-white/80 mt-2 md:mt-1 leading-relaxed", id: "product-modal-description", children: [
        "O ",
        product.caption,
        " combina design sofisticado com tecnologias terapêuticas avançadas"
      ] })
    ] }) }) }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 p-4 md:p-6 mx-4 md:mx-0", children: [
      /* @__PURE__ */ jsx(
        ImageGallery,
        {
          product,
          selectedImage,
          onImageSelect: handleImageSelect
        }
      ),
      /* @__PURE__ */ jsx(
        ProductInfo,
        {
          product,
          selectedSize,
          quantity,
          onSizeSelect: setSelectedSize,
          onQuantityChange: setQuantity,
          onAddToCart: handleAddToCart
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "border-t mt-6 pt-6 px-4 md:px-6 mx-4 md:mx-0 pb-6", children: [
      /* @__PURE__ */ jsx("h3", { className: "text-xl font-bold text-allin-orange mb-4", children: "Detalhes do Produto" }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6 text-allin-dark/80 dark:text-allin-white/80", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h4", { className: "font-semibold", children: "Design Sofisticado e Confortável" }),
          /* @__PURE__ */ jsxs("p", { children: [
            "O ",
            product.caption,
            " traz um visual clean e atemporal, fácil de combinar com diferentes looks. Seu design elegante oferece todo o conforto que seus pés precisam, sendo perfeito para longos períodos de uso."
          ] }),
          /* @__PURE__ */ jsxs("ul", { className: "list-disc list-inside mt-2 space-y-1", children: [
            /* @__PURE__ */ jsxs("li", { children: [
              /* @__PURE__ */ jsx("span", { className: "font-semibold", children: "Design minimalista:" }),
              " versátil e combina com qualquer estilo."
            ] }),
            /* @__PURE__ */ jsxs("li", { children: [
              /* @__PURE__ */ jsx("span", { className: "font-semibold", children: "Conforto absoluto:" }),
              " materiais de alta qualidade."
            ] }),
            /* @__PURE__ */ jsxs("li", { children: [
              /* @__PURE__ */ jsx("span", { className: "font-semibold", children: "Estilo sofisticado:" }),
              " design simples e elegante."
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h4", { className: "font-semibold", children: "Tecnologia Terapêutica Avançada" }),
          /* @__PURE__ */ jsx("p", { children: "Equipado com tecnologias exclusivas que oferecem benefícios terapêuticos comprovados." }),
          /* @__PURE__ */ jsx("h5", { className: "font-semibold mt-2", children: "Benefícios:" }),
          /* @__PURE__ */ jsxs("ul", { className: "list-disc list-inside space-y-1", children: [
            /* @__PURE__ */ jsx("li", { children: "Melhora significativa da circulação sanguínea." }),
            /* @__PURE__ */ jsx("li", { children: "Alívio eficaz de dores e inflamações." }),
            /* @__PURE__ */ jsx("li", { children: "Redução do estresse e cansaço nos pés." }),
            /* @__PURE__ */ jsx("li", { children: "Aceleração da recuperação muscular." }),
            /* @__PURE__ */ jsx("li", { children: "Conforto excepcional para longos períodos de uso." })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx(AdditionalInfo, { onClose: handleClose })
  ] }) });
};
const ProductGalleryContent = ({ limit }) => {
  const { setIsOpen } = useCart();
  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const { products, loading, error } = useProducts();
  useEffect(() => {
    if (products.length > 0) {
      if (limit !== void 0) {
        setDisplayedProducts(products.slice(0, limit));
      } else {
        setDisplayedProducts(products);
      }
    }
  }, [products, limit]);
  if (loading && displayedProducts.length === 0) {
    return /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsxs("div", { className: "text-center mb-16", children: [
        /* @__PURE__ */ jsx(Skeleton, { className: "h-12 w-64 mx-auto mb-6" }),
        /* @__PURE__ */ jsx(Skeleton, { className: "h-6 w-96 mx-auto" })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4", children: Array.from({ length: limit || 8 }).map((_, index) => /* @__PURE__ */ jsxs(Card, { className: "overflow-hidden", children: [
        /* @__PURE__ */ jsx(Skeleton, { className: "h-48 w-full" }),
        /* @__PURE__ */ jsxs(CardHeader, { className: "p-4", children: [
          /* @__PURE__ */ jsx(Skeleton, { className: "h-6 w-3/4 mb-2" }),
          /* @__PURE__ */ jsx(Skeleton, { className: "h-4 w-full" })
        ] })
      ] }, index)) })
    ] });
  }
  if (error && displayedProducts.length === 0) {
    return /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
      /* @__PURE__ */ jsxs("div", { className: "text-red-500 text-xl", children: [
        "Erro: ",
        error
      ] }),
      /* @__PURE__ */ jsx("div", { className: "mt-4 text-allin-dark/80 dark:text-allin-white/80", children: "Não foi possível carregar os produtos. Por favor, tente novamente mais tarde." })
    ] });
  }
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs("div", { className: "text-center mb-16 animate-fade-in", children: [
      /* @__PURE__ */ jsxs("h2", { className: "text-4xl md:text-5xl font-bold mb-6 text-allin-dark dark:text-allin-white", children: [
        "Nossos ",
        /* @__PURE__ */ jsx("span", { className: "text-allin-orange", children: "Produtos" })
      ] }),
      /* @__PURE__ */ jsx("p", { className: "text-xl text-allin-dark/80 dark:text-allin-white/80 max-w-3xl mx-auto", children: "Conheça nossa linha completa de calçados terapêuticos com tecnologias exclusivas da Allin." })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "hidden md:block fixed top-4 right-4 z-50", children: /* @__PURE__ */ jsx(
      Button,
      {
        variant: "default",
        className: "rounded-full w-14 h-14 shadow-lg bg-allin-orange hover:bg-allin-orange/90 text-allin-dark",
        onClick: () => setIsOpen(true),
        "aria-label": "Abrir carrinho",
        children: /* @__PURE__ */ jsx(ShoppingCart, { className: "w-6 h-6" })
      }
    ) }),
    displayedProducts.length > 0 ? /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-8", children: displayedProducts.map((product, index) => /* @__PURE__ */ jsxs(
        Card,
        {
          className: "overflow-hidden border border-allin-orange/40 shadow-lg hover:shadow-xl transition-all duration-300 bg-allin-bg-light-1 dark:bg-allin-bg-dark-1 group animate-slide-up glass-card h-full flex flex-col dark:dark:bg-allin-bg-dark-3 dark:dark:border-allin-bg-dark-2 cursor-pointer",
          style: { animationDelay: `${0.05 * index}s` },
          onClick: () => {
            setSelectedProduct(product);
            setIsModalOpen(true);
          },
          children: [
            /* @__PURE__ */ jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsx(
                "img",
                {
                  src: product.imgSrc,
                  alt: product.caption,
                  className: "w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105",
                  onError: (e) => {
                    const target = e.target;
                    target.src = "https://placehold.co/400x400?text=Imagem+Indispon%C3%ADvel";
                  }
                }
              ),
              product.produtoTag && /* @__PURE__ */ jsx("div", { className: "absolute top-2 right-2 bg-allin-orange text-allin-dark text-xs font-bold px-2 py-1 rounded-full", children: product.produtoTag })
            ] }),
            /* @__PURE__ */ jsxs(CardHeader, { className: "p-4", children: [
              /* @__PURE__ */ jsx(CardTitle, { className: "text-lg font-bold text-allin-orange line-clamp-1", children: product.caption }),
              /* @__PURE__ */ jsxs("p", { className: "text-sm text-allin-dark/80 dark:text-allin-white/80 line-clamp-2", children: [
                (product.caption2 || "").substring(0, 100),
                "..."
              ] }),
              /* @__PURE__ */ jsx("p", { className: "text-xl font-bold text-allin-orange mt-2", children: formatPrice(product.price) || "Preço não disponível" })
            ] }),
            /* @__PURE__ */ jsx(CardContent, { className: "p-4 mt-auto", children: /* @__PURE__ */ jsx(
              Button,
              {
                variant: "default",
                className: "w-full bg-allin-orange hover:bg-allin-orange/90 text-allin-dark",
                onClick: (e) => {
                  e.stopPropagation();
                  setSelectedProduct(product);
                  setIsModalOpen(true);
                },
                children: "Ver Detalhes"
              }
            ) })
          ]
        },
        index
      )) }),
      limit !== void 0 && /* @__PURE__ */ jsx("div", { className: "text-center mt-12", children: /* @__PURE__ */ jsxs(
        Button,
        {
          variant: "default",
          onClick: () => navigate({ to: "/loja" }),
          className: "px-8 py-3 text-lg font-semibold transition-all duration-300 hover:scale-105 gap-2 bg-allin-orange hover:bg-allin-orange/90 text-allin-dark",
          children: [
            "Ver Mais Produtos",
            /* @__PURE__ */ jsx(ArrowRight, { className: "w-5 h-5" })
          ]
        }
      ) })
    ] }) : /* @__PURE__ */ jsx("div", { className: "text-center py-12", children: /* @__PURE__ */ jsx("p", { className: "text-allin-dark/80 dark:text-allin-white/80", children: "Nenhum produto disponível no momento." }) }),
    selectedProduct && /* @__PURE__ */ jsx(
      ProductModal,
      {
        product: {
          caption: selectedProduct.caption,
          caption2: selectedProduct.caption2,
          imgFluidSrc: selectedProduct.imgSrc,
          imgFluidSrc2: selectedProduct.imgSrc2,
          produtoTag: selectedProduct.produtoTag,
          linkProdutoHref: selectedProduct.linkProduto || "",
          price: selectedProduct.price
        },
        isOpen: isModalOpen,
        onOpenChange: (open) => {
          setIsModalOpen(open);
          if (!open) setSelectedProduct(null);
        }
      }
    )
  ] });
};
const ProductGallery = ({ limit }) => {
  return /* @__PURE__ */ jsx(ProductGalleryContent, { limit });
};
const CartSidebarComponent = () => {
  const { items, removeItem, updateQuantity, clearCart, getTotalItems, isOpen, setIsOpen } = useCart();
  const { toast } = useToast();
  const generateWhatsAppMessage = () => {
    if (items.length === 0) return "";
    const message = items.map(
      (item) => `Produto: ${item.name}
Tamanho: ${item.selectedSize}
Quantidade: ${item.quantity}
Imagem: ${item.imageUrl}
---`
    ).join("\n");
    const fullMessage = `Olá! Gostaria de finalizar a compra dos seguintes itens:

${message}

Total de itens: ${getTotalItems()}`;
    return encodeURIComponent(fullMessage);
  };
  const { whatsapp } = useStoreSettings();
  const calculateTotal = () => {
    return items.reduce((total, item) => {
      const price = parseFloat(item.price?.replace(/[^0-9,-]+/g, "").replace(",", ".")) || 0;
      return total + price * item.quantity;
    }, 0);
  };
  const handleOverlayClick = () => {
    setIsOpen(false);
  };
  return /* @__PURE__ */ jsx(Sheet, { open: isOpen, onOpenChange: setIsOpen, children: /* @__PURE__ */ jsxs(
    SheetContent,
    {
      className: "w-full sm:max-w-md p-0 bg-allin-bg-light-1 dark:bg-allin-bg-dark-1 border-l border-allin-orange/40 flex flex-col",
      onPointerDownOutside: handleOverlayClick,
      onEscapeKeyDown: () => setIsOpen(false),
      onClick: (e) => e.stopPropagation(),
      children: [
        /* @__PURE__ */ jsx(SheetHeader, { className: "p-4 border-b border-allin-orange/20", children: /* @__PURE__ */ jsxs(SheetTitle, { className: "text-xl font-bold text-allin-orange flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(ShoppingCart, { className: "w-5 h-5" }),
          "Meu Carrinho"
        ] }) }),
        /* @__PURE__ */ jsx("div", { className: "flex-1 flex flex-col overflow-hidden", children: /* @__PURE__ */ jsx("div", { className: "flex-1 overflow-y-auto p-4", children: items.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center h-full py-12", children: [
          /* @__PURE__ */ jsx(ShoppingCart, { className: "w-16 h-16 text-allin-dark/40 dark:text-allin-white/40 mb-4" }),
          /* @__PURE__ */ jsx("p", { className: "text-allin-dark/80 dark:text-allin-white/80 text-lg", children: "Seu carrinho está vazio" }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-allin-dark/60 dark:text-allin-white/60 mt-1", children: "Adicione produtos para começar!" }),
          /* @__PURE__ */ jsx(
            Button,
            {
              variant: "default",
              className: "mt-6 bg-allin-orange hover:bg-allin-orange/90 text-allin-dark",
              onClick: () => setIsOpen(false),
              children: "Continuar comprando"
            }
          )
        ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx("div", { className: "space-y-4", children: items.map((item) => /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 p-4 bg-allin-bg-light-2 dark:bg-allin-bg-dark-2 rounded-lg border border-allin-orange/20", children: [
            /* @__PURE__ */ jsx(
              "img",
              {
                src: item.imageUrl,
                alt: item.name,
                className: "w-16 h-16 object-cover rounded-md border border-allin-orange/30",
                onError: (e) => {
                  const target = e.target;
                  target.src = "https://placehold.co/64x64?text=Imagem";
                }
              }
            ),
            /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
              /* @__PURE__ */ jsx("h3", { className: "font-semibold text-allin-dark dark:text-allin-white line-clamp-1", children: item.name }),
              /* @__PURE__ */ jsxs("p", { className: "text-sm text-allin-dark/80 dark:text-allin-white/80", children: [
                "Tamanho: ",
                item.selectedSize
              ] }),
              /* @__PURE__ */ jsx("p", { className: "text-sm text-allin-orange font-bold", children: formatPrice(item.price) || "Preço não disponível" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx(
                Button,
                {
                  variant: "outline",
                  size: "icon",
                  className: "h-8 w-8 border-allin-orange/50",
                  onClick: () => updateQuantity(item.id, item.selectedSize || item.quantity - 1, item.selectedSize ? item.quantity - 1 : void 0),
                  children: /* @__PURE__ */ jsx(Minus, { className: "w-4 h-4" })
                }
              ),
              /* @__PURE__ */ jsx("span", { className: "w-8 text-center text-allin-dark dark:text-allin-white", children: item.quantity }),
              /* @__PURE__ */ jsx(
                Button,
                {
                  variant: "outline",
                  size: "icon",
                  className: "h-8 w-8 border-allin-orange/50",
                  onClick: () => updateQuantity(item.id, item.selectedSize || item.quantity + 1, item.selectedSize ? item.quantity + 1 : void 0),
                  children: /* @__PURE__ */ jsx(Plus, { className: "w-4 h-4" })
                }
              ),
              /* @__PURE__ */ jsx(
                Button,
                {
                  variant: "ghost",
                  size: "icon",
                  className: "h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20",
                  onClick: () => removeItem(item.id, item.selectedSize),
                  children: /* @__PURE__ */ jsx(Trash2, { className: "w-4 h-4" })
                }
              )
            ] })
          ] }, `${item.id}-${item.selectedSize || "default"}`)) }),
          /* @__PURE__ */ jsxs("div", { className: "mt-6 border-t border-allin-orange/20 pt-4 space-y-4", children: [
            /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-allin-dark/80 dark:text-allin-white/80", children: [
                /* @__PURE__ */ jsxs("span", { children: [
                  "Subtotal (",
                  getTotalItems(),
                  " itens):"
                ] }),
                /* @__PURE__ */ jsx("span", { className: "font-semibold", children: formatPrice(calculateTotal().toFixed(2)) })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-allin-dark/80 dark:text-allin-white/80", children: [
                /* @__PURE__ */ jsx("span", { children: "Frete:" }),
                /* @__PURE__ */ jsx("span", { className: "text-green-600 dark:text-green-400 font-semibold", children: "A calcular" })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "border-t border-allin-orange/20 pt-2 mt-2 flex justify-between text-lg font-bold text-allin-orange", children: [
                /* @__PURE__ */ jsx("span", { children: "Total:" }),
                /* @__PURE__ */ jsx("span", { children: formatPrice(calculateTotal().toFixed(2)) })
              ] })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "text-center text-sm text-allin-dark/60 dark:text-allin-white/60", children: "* O frete será calculado no fechamento do pedido" }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-3 pt-2", children: [
              /* @__PURE__ */ jsxs(
                Button,
                {
                  variant: "default",
                  className: "w-full h-12 text-base font-semibold bg-allin-orange hover:bg-allin-orange/90 text-allin-dark",
                  onClick: () => {
                    const message = generateWhatsAppMessage();
                    if (message) {
                      window.open(`https://wa.me/${whatsapp}?text=${message}`, "_blank");
                      toast({
                        title: "Pedido enviado!",
                        description: "Agora é só finalizar seu pedido pelo WhatsApp.",
                        variant: "default"
                      });
                      setTimeout(() => {
                        clearCart();
                        setIsOpen(false);
                      }, 1e3);
                    }
                  },
                  "aria-label": "Finalizar compra via WhatsApp",
                  children: [
                    /* @__PURE__ */ jsx(MessageCircle, { className: "w-5 h-5 mr-2" }),
                    "Finalizar pedido"
                  ]
                }
              ),
              /* @__PURE__ */ jsx(
                Button,
                {
                  variant: "outline",
                  className: "w-full h-10 text-sm text-allin-dark/80 dark:text-allin-white/80 border-allin-orange/40 hover:bg-allin-orange/5",
                  onClick: () => setIsOpen(false),
                  children: "Continuar comprando"
                }
              ),
              /* @__PURE__ */ jsxs(
                Button,
                {
                  variant: "ghost",
                  className: "w-full h-10 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20",
                  onClick: () => {
                    if (confirm("Tem certeza que deseja limpar o carrinho?")) {
                      clearCart();
                      toast({
                        title: "Carrinho limpo",
                        description: "Todos os itens foram removidos do carrinho.",
                        variant: "default"
                      });
                    }
                  },
                  "aria-label": "Limpar todos os itens do carrinho",
                  children: [
                    /* @__PURE__ */ jsx(Trash2, { className: "w-4 h-4 mr-2" }),
                    "Limpar carrinho"
                  ]
                }
              )
            ] })
          ] })
        ] }) }) })
      ]
    }
  ) });
};
CartSidebarComponent.displayName = "CartSidebar";
const CartSidebar = memo(CartSidebarComponent);
export {
  CartSidebar as C,
  ProductGallery as P
};
