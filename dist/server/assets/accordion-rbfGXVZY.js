import { jsxs, jsx } from "react/jsx-runtime";
import { Zap, ArrowRight, ChevronDown } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { u as useSponsorLink, B as Button, c as cn } from "./router-C3cuB5ui.js";
import * as React from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
const HeroIntroSection = ({
  id = "inicio",
  badgeIcon: BadgeIcon = Zap,
  badgeText = "Revolucione sua vida financeira!",
  title = "Transforme sua paixão em renda extra com a All In Brasil",
  subtitle = "Junte-se a milhares de distribuidores que já transformaram suas vidas. Trabalhe de onde estiver e quando quiser.",
  primaryButtonText = "Quero garantir minha vaga.",
  primaryButtonAction,
  primaryButtonLink,
  secondaryButtonText = "Ver depoimentos de sucesso.",
  secondaryButtonLink,
  className = ""
}) => {
  const { handleCadastro } = useSponsorLink();
  return /* @__PURE__ */ jsxs("section", { id, className: `min-h-screen bg-gradient-to-br from-allin-bg-dark-1 to-allin-bg-dark-2 dark:from-allin-bg-dark-1 dark:to-allin-bg-dark-2 pt-20 relative overflow-hidden ${className}`, children: [
    /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-br from-allin-orange/5 to-transparent dark:from-allin-orange/10" }),
    /* @__PURE__ */ jsx("div", { className: "absolute top-1/4 left-1/4 w-64 h-64 bg-allin-orange/5 rounded-full blur-3xl animate-float" }),
    /* @__PURE__ */ jsx("div", { className: "absolute bottom-1/4 right-1/4 w-48 h-48 bg-allin-orange/5 rounded-full blur-3xl animate-float", style: { animationDelay: "2s" } }),
    /* @__PURE__ */ jsx("div", { className: "container mx-auto px-4 py-20 relative z-10", children: /* @__PURE__ */ jsxs("div", { className: "text-center max-w-4xl mx-auto animate-fade-in", children: [
      /* @__PURE__ */ jsxs("div", { className: "inline-flex items-center gap-2 bg-allin-orange/10 backdrop-blur-sm rounded-full px-4 py-2 text-sm glass-card mb-8", children: [
        /* @__PURE__ */ jsx(BadgeIcon, { className: "w-4 h-4 text-allin-orange" }),
        /* @__PURE__ */ jsx("span", { className: "font-medium text-allin-dark dark:text-allin-white", children: badgeText })
      ] }),
      /* @__PURE__ */ jsx("h1", { className: "text-4xl md:text-6xl font-bold leading-tight mb-8 text-allin-dark dark:text-allin-white", children: (title || "").split(" ").map((word, index) => word.startsWith("<span") ? /* @__PURE__ */ jsx("span", { className: "text-allin-orange", dangerouslySetInnerHTML: { __html: word } }, index) : /* @__PURE__ */ jsxs("span", { children: [
        word,
        " "
      ] }, index)) }),
      /* @__PURE__ */ jsx("p", { className: "text-xl md:text-2xl text-allin-dark/90 dark:text-allin-white/90 leading-relaxed mb-8", children: subtitle || "" }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row gap-4 justify-center mb-12", children: [
        primaryButtonLink ? /* @__PURE__ */ jsxs(
          Button,
          {
            variant: "default",
            size: "lg",
            onClick: handleCadastro,
            className: "group font-semibold shadow-lg bg-allin-orange hover:bg-allin-orange/90 text-allin-dark",
            children: [
              primaryButtonText,
              /* @__PURE__ */ jsx(ArrowRight, { className: "w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" })
            ]
          }
        ) : /* @__PURE__ */ jsxs(
          Button,
          {
            variant: "default",
            size: "lg",
            onClick: primaryButtonAction || handleCadastro,
            className: "group font-semibold shadow-lg bg-allin-orange hover:bg-allin-orange/90 text-allin-dark",
            children: [
              primaryButtonText,
              /* @__PURE__ */ jsx(ArrowRight, { className: "w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" })
            ]
          }
        ),
        secondaryButtonLink && /* @__PURE__ */ jsx(Link, { to: secondaryButtonLink, children: /* @__PURE__ */ jsx(Button, { variant: "outline", size: "lg", className: "bg-white/10 backdrop-blur-sm text-allin-dark dark:text-allin-white transition-all border-allin-orange/20 hover:border-allin-orange", children: secondaryButtonText }) })
      ] })
    ] }) })
  ] });
};
const Accordion = AccordionPrimitive.Root;
const AccordionItem = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(AccordionPrimitive.Item, { ref, className: cn("border-b", className), ...props }));
AccordionItem.displayName = "AccordionItem";
const AccordionTrigger = React.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsx(AccordionPrimitive.Header, { className: "flex", children: /* @__PURE__ */ jsxs(
  AccordionPrimitive.Trigger,
  {
    ref,
    className: cn(
      "flex flex-1 items-center justify-between py-4 text-sm font-medium cursor-pointer transition-all hover:underline text-left [&[data-state=open]>svg]:rotate-180",
      className
    ),
    ...props,
    children: [
      children,
      /* @__PURE__ */ jsx(ChevronDown, { className: "h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200" })
    ]
  }
) }));
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName;
const AccordionContent = React.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsx(
  AccordionPrimitive.Content,
  {
    ref,
    className: "overflow-hidden text-sm data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down",
    ...props,
    children: /* @__PURE__ */ jsx("div", { className: cn("pb-4 pt-0", className), children })
  }
));
AccordionContent.displayName = AccordionPrimitive.Content.displayName;
export {
  Accordion as A,
  HeroIntroSection as H,
  AccordionItem as a,
  AccordionTrigger as b,
  AccordionContent as c
};
