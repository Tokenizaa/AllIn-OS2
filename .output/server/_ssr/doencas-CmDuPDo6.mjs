import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { d as useDistributor, P as PublicHeader, B as Button } from "./router-BZaVudxP.mjs";
import { F as Footer } from "./Footer-Brjh0GqW.mjs";
import { D as DiseaseCard } from "./DiseaseCard-D8xuZMQL.mjs";
import "../_libs/sonner.mjs";
import { a2 as Bone, Z as Zap, a3 as Activity, H as Heart } from "../_libs/lucide-react.mjs";

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
function DiseasesPage() {
  const {
    currentDistributor
  } = useDistributor();
  const sponsorSlug = currentDistributor.slug;
  const isDefaultTenant = !sponsorSlug || currentDistributor.isFallback;
  const [expandedCard, setExpandedCard] = reactExports.useState(null);
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
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-allin-bg-light-1 dark:bg-allin-bg-dark-1", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PublicHeader, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pt-20", children: /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "py-20", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto px-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center mb-16 animate-fade-in", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-4xl md:text-5xl font-bold mb-6 text-allin-dark dark:text-allin-white", children: [
          "Você sofre com algum destes",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-allin-orange", children: "problemas?" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xl text-allin-dark/80 dark:text-allin-white/80 max-w-2xl mx-auto", children: "Clique em cada card para ver como a tecnologia Allin atua em cada caso." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-8", children: diseases.map((disease, index) => /* @__PURE__ */ jsxRuntimeExports.jsx(DiseaseCard, { title: disease.title, description: disease.description, details: disease.details, icon: disease.icon, image: disease.image, className: "cursor-pointer hover:scale-105 transition-transform", onClick: () => toggleCard(index) }, index)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-16 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: isDefaultTenant ? "/loja" : `/loja/${sponsorSlug}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "vibrant", size: "lg", className: "text-lg px-8 py-6", children: "Ver Produtos que Podem Ajudar" }) }) })
    ] }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Footer, {})
  ] });
}
export {
  DiseasesPage as component
};
