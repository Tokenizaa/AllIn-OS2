import { jsxs, jsx } from "react/jsx-runtime";
import { useState } from "react";
import { useParams, Link } from "@tanstack/react-router";
import { d as useDistributor, P as PublicHeader, B as Button } from "./router-OVqp2Aj1.js";
import { F as Footer } from "./Footer-DIOgZioK.js";
import { D as DiseaseCard } from "./DiseaseCard-BQyLEjVz.js";
import { Bone, Zap, Activity, Heart } from "lucide-react";
import "@tanstack/react-query";
import "./supabase-client-BdpvIS_G.js";
import "@supabase/supabase-js";
import "./roles-DEW722fr.js";
import "framer-motion";
import "sonner";
import "class-variance-authority";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-slot";
import "./card-DLLoBO9R.js";
function DiseasesPage() {
  const params = useParams({
    strict: false
  });
  const {
    currentDistributor,
    setDistributorBySlug
  } = useDistributor();
  const routeSlug = params.slug?.toLowerCase().trim();
  useState(() => {
    if (routeSlug) {
      setDistributorBySlug(routeSlug);
    }
  });
  const sponsorSlug = currentDistributor.slug;
  const [expandedCard, setExpandedCard] = useState(null);
  const diseases = [{
    title: "Esporão de Calcâneo",
    description: "Dificuldade para dar os primeiros passos do dia? O suporte anatômico e amortecimento absorvem impactos e reduzem o desconforto.",
    details: "O esporão de calcâneo é um crescimento ósseo no calcanhar que causa dor intensa. Nossos calçados com palmilhas tecnológicas distribuem melhor o peso e reduzem a pressão sobre o esporão.",
    icon: Bone,
    image: "/assets/images/esporao-calcaneo.jpg"
  }, {
    title: "Fibromialgia",
    description: "Dor difusa e fadiga constante? O infravermelho longo relaxa os músculos e reduz o desconforto ao longo do dia.",
    details: "A fibromialgia causa dor muscular generalizada. O infravermelho longo em nossos produtos ajuda a relaxar os músculos e reduzir a fadiga.",
    icon: Zap,
    image: "/assets/images/fibromialgia.jpg"
  }, {
    title: "Neuropatia Diabética",
    description: "Formigamento ou perda de sensibilidade nos pés? Protegemos pontos de pressão e reduzimos atrito com tecido respirável, garantindo segurança.",
    details: "A neuropatia diabética afeta a sensibilidade dos pés, aumentando o risco de feridas. Nossos produtos protegem pontos de pressão e oferecem suporte adequado.",
    icon: Activity,
    image: "/assets/images/neuropatia-diabetica.jpg"
  }, {
    title: "Varizes / Má Circulação",
    description: "Pernas pesadas e inchadas? A magnetoterapia melhora a circulação e reduz sensação de cansaço e inchaço, proporcionando leveza.",
    details: "A má circulação pode causar inchaço, dor e sensação de peso nas pernas. Nossa tecnologia estimula o fluxo sanguíneo, ajudando a reduzir esses desconfortos.",
    icon: Heart,
    image: "/assets/images/varizes.jpg"
  }];
  const toggleCard = (index) => {
    setExpandedCard(expandedCard === index ? null : index);
  };
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-allin-bg-light-1 dark:bg-allin-bg-dark-1", children: [
    /* @__PURE__ */ jsx(PublicHeader, {}),
    /* @__PURE__ */ jsx("div", { className: "pt-20", children: /* @__PURE__ */ jsx("section", { className: "py-20", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "text-center mb-16 animate-fade-in", children: [
        /* @__PURE__ */ jsxs("h1", { className: "text-4xl md:text-5xl font-bold mb-6 text-allin-dark dark:text-allin-white", children: [
          "Você sofre com algum destes",
          " ",
          /* @__PURE__ */ jsx("span", { className: "text-allin-orange", children: "problemas?" })
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-xl text-allin-dark/80 dark:text-allin-white/80 max-w-2xl mx-auto", children: "Clique em cada card para ver como a tecnologia Allin atua em cada caso." })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-8", children: diseases.map((disease, index) => /* @__PURE__ */ jsx(DiseaseCard, { title: disease.title, description: disease.description, details: disease.details, icon: disease.icon, image: disease.image, className: "cursor-pointer hover:scale-105 transition-transform", onClick: () => toggleCard(index) }, index)) }),
      /* @__PURE__ */ jsx("div", { className: "mt-16 text-center", children: /* @__PURE__ */ jsx(Link, { to: `/loja/${sponsorSlug}`, children: /* @__PURE__ */ jsx(Button, { variant: "vibrant", size: "lg", className: "text-lg px-8 py-6", children: "Ver Produtos que Podem Ajudar" }) }) })
    ] }) }) }),
    /* @__PURE__ */ jsx(Footer, {})
  ] });
}
export {
  DiseasesPage as component
};
