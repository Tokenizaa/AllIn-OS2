import { jsx, jsxs } from "react/jsx-runtime";
import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { F as Footer } from "./Footer-DIOgZioK.js";
import { P as ProductGallery, C as CartSidebar } from "./CartSidebar-CbtHSVep.js";
import { Zap, Waves, Wind, Star } from "lucide-react";
import { C as Card, b as CardHeader, c as CardTitle, a as CardContent } from "./card-DLLoBO9R.js";
import { A as Accordion, a as AccordionItem, b as AccordionTrigger, c as AccordionContent, H as HeroIntroSection } from "./accordion-DAY7BKn6.js";
import { d as useDistributor, b as useAuth, j as getPrimaryPathForRole, P as PublicHeader } from "./router-OVqp2Aj1.js";
import "./skeleton-C7fYO8Tf.js";
import "./priceFormatter-BwKD4_Ti.js";
import "./dialog-BgRseQ54.js";
import "@radix-ui/react-dialog";
import "./tabs-vlCUvq5M.js";
import "@radix-ui/react-tabs";
import "./sheet-DDOjMsKo.js";
import "class-variance-authority";
import "./use-toast-DdRhLTSk.js";
import "@radix-ui/react-accordion";
import "@tanstack/react-query";
import "./supabase-client-BdpvIS_G.js";
import "@supabase/supabase-js";
import "./roles-DEW722fr.js";
import "framer-motion";
import "sonner";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-slot";
const ModelsSection = () => {
  return /* @__PURE__ */ jsx("section", { className: "py-20 bg-allin-bg-light-2 dark:bg-allin-bg-dark-2", children: /* @__PURE__ */ jsx("div", { className: "container mx-auto px-4", children: /* @__PURE__ */ jsx(ProductGallery, { limit: 4 }) }) });
};
const ProductsSection = () => {
  const technologies = [
    {
      icon: Zap,
      name: "Magnetoterapia",
      color: "gradient-primary",
      benefits: [
        "Melhora notável da circulação sanguínea.",
        "Alívio eficaz de dores e inflamações.",
        "Redução significativa do estresse e ansiedade.",
        "Aumento perceptível da energia e vitalidade."
      ]
    },
    {
      icon: Waves,
      name: "Infravermelho Longo",
      color: "gradient-primary",
      benefits: [
        "Aceleração comprovada da recuperação muscular.",
        "Relaxamento profundo e eficaz dos músculos.",
        "Melhora perceptível da circulação periférica.",
        "Redução substancial da fadiga e cansaço."
      ]
    },
    {
      icon: Wind,
      name: "Tecido Knit Respirável",
      color: "gradient-primary",
      benefits: [
        "Conforto excepcional e duradouro durante o uso.",
        "Adaptação precisa e perfeita ao formato do pé.",
        "Redução eficaz da fadiga dos pés.",
        "Durabilidade e resistência comprovadas."
      ]
    }
  ];
  return /* @__PURE__ */ jsx("section", { id: "produtos", className: "py-20 bg-allin-bg-light-2 dark:bg-allin-bg-dark-2", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4", children: [
    /* @__PURE__ */ jsxs("div", { className: "text-center mb-16 animate-fade-in", children: [
      /* @__PURE__ */ jsxs("h2", { className: "text-4xl md:text-5xl font-bold mb-6 text-allin-dark dark:text-allin-white", children: [
        "Produtos e ",
        /* @__PURE__ */ jsx("span", { className: "text-allin-orange", children: "Tecnologias" })
      ] }),
      /* @__PURE__ */ jsx("p", { className: "text-xl text-allin-dark/80 dark:text-allin-white/80 max-w-3xl mx-auto", children: "Tecnologias exclusivas que transformam cada passo em bem-estar." })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mb-20", children: [
      /* @__PURE__ */ jsxs("h3", { className: "text-3xl font-bold text-center mb-12 text-allin-dark dark:text-allin-white animate-slide-up", children: [
        "Tecnologias ",
        /* @__PURE__ */ jsx("span", { className: "text-allin-orange", children: "Exclusivas" })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "grid md:grid-cols-3 gap-8", children: technologies.map((tech, index) => /* @__PURE__ */ jsxs(Card, { className: "relative overflow-hidden border border-allin-orange/40 shadow-xl hover:shadow-2xl transition-all duration-300 group bg-allin-bg-light-1 dark:bg-allin-bg-dark-3 animate-slide-up glass-card", style: { animationDelay: `${0.1 * index}s` }, children: [
        /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-allin-orange opacity-5 group-hover:opacity-10 transition-opacity" }),
        /* @__PURE__ */ jsxs(CardHeader, { className: "text-center pb-4", children: [
          /* @__PURE__ */ jsx("div", { className: "w-20 h-20 bg-allin-orange rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse-glow transition-transform duration-300 group-hover:scale-110", children: /* @__PURE__ */ jsx(tech.icon, { className: "w-10 h-10 text-allin-dark" }) }),
          /* @__PURE__ */ jsx(CardTitle, { className: "text-2xl font-bold text-allin-dark dark:text-allin-white", children: tech.name })
        ] }),
        /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsx("div", { className: "space-y-3", children: tech.benefits.map((benefit, idx) => /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3 transition-all duration-300 hover:translate-x-1", children: [
          /* @__PURE__ */ jsx(Star, { className: "w-5 h-5 text-allin-orange mt-0.5 flex-shrink-0" }),
          /* @__PURE__ */ jsx("span", { className: "text-allin-dark/80 dark:text-allin-white/80", children: benefit })
        ] }, idx)) }) })
      ] }, index)) })
    ] })
  ] }) });
};
const fascitePlantarImg = "https://placehold.co/300x200/4F46E5/FFFFFF?text=Fascite+Plantar";
const joanetesImg = "https://placehold.co/300x200/4F46E5/FFFFFF?text=Joanetes";
const circulacaoImg = "https://placehold.co/300x200/4F46E5/FFFFFF?text=Circulação";
const neuromaImg = "https://placehold.co/300x200/4F46E5/FFFFFF?text=Neuroma";
const calosImg = "https://placehold.co/300x200/4F46E5/FFFFFF?text=Calos";
const artriteImg = "https://placehold.co/300x200/4F46E5/FFFFFF?text=Artrite";
const DiseaseIdentificationSection = () => {
  const conditions = [
    {
      image: fascitePlantarImg,
      title: "Fascite Plantar",
      description: "Dor intensa no calcanhar, especialmente pela manhã.",
      benefit: "Alivia tensões no calcanhar e promove regeneração tecidual."
    },
    {
      image: joanetesImg,
      title: "Joanetes",
      description: "Desvio do dedão do pé com dor e inflamação.",
      benefit: "Reduz pressão e desconforto com tecnologia exclusiva."
    },
    {
      image: circulacaoImg,
      title: "Circulação",
      description: "Pés frios, formigamento ou inchaço.",
      benefit: "Melhora a circulação sanguínea e reduz inchaço."
    },
    {
      image: neuromaImg,
      title: "Neuroma de Morton",
      description: "Dor ardente entre os dedos do pé.",
      benefit: "Redistribui o peso e oferece amortecimento."
    },
    {
      image: calosImg,
      title: "Calos e Calosidades",
      description: "Pele espessida por pressão repetitiva.",
      benefit: "Reduz pontos de impacto e protege os pés."
    },
    {
      image: artriteImg,
      title: "Artrite e Artrose",
      description: "Dor e rigidez nas articulações.",
      benefit: "Oferece suporte e alívio para maior mobilidade."
    }
  ];
  return /* @__PURE__ */ jsx("section", { id: "problemas", className: "py-20 bg-allin-bg-light-1 dark:bg-allin-bg-dark-1", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4", children: [
    /* @__PURE__ */ jsxs("div", { className: "text-center mb-16 animate-fade-in", children: [
      /* @__PURE__ */ jsxs("h2", { className: "text-4xl md:text-5xl font-bold mb-6 text-allin-dark dark:text-allin-white", children: [
        "Identifique seu ",
        /* @__PURE__ */ jsx("span", { className: "text-allin-orange", children: "problema" })
      ] }),
      /* @__PURE__ */ jsx("p", { className: "text-xl text-allin-dark/80 dark:text-allin-white/80 max-w-3xl mx-auto", children: "Conheça os sintomas mais comuns e como nossos produtos podem aliviar seu desconforto diário" })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "grid md:grid-cols-2 lg:grid-cols-3 gap-8", children: conditions.map((condition, index) => /* @__PURE__ */ jsxs(Card, { className: "border border-allin-orange/40 shadow-lg hover:shadow-xl transition-all duration-300 bg-allin-bg-light-2 dark:bg-allin-bg-dark-2 group animate-slide-up glass-card", style: { animationDelay: `${0.1 * index}s` }, children: [
      /* @__PURE__ */ jsx("div", { className: "overflow-hidden rounded-t-lg h-40", children: /* @__PURE__ */ jsx(
        "img",
        {
          src: condition.image,
          alt: condition.title,
          className: "w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        }
      ) }),
      /* @__PURE__ */ jsx(CardHeader, { className: "text-center pb-4", children: /* @__PURE__ */ jsx(CardTitle, { className: "text-xl font-bold text-allin-dark dark:text-allin-white", children: condition.title }) }),
      /* @__PURE__ */ jsxs(CardContent, { children: [
        /* @__PURE__ */ jsx("p", { className: "text-allin-dark/80 dark:text-allin-white/80 text-center leading-relaxed mb-3", children: condition.description }),
        /* @__PURE__ */ jsx("div", { className: "border-t border-allin-orange/20 pt-3 mt-3", children: /* @__PURE__ */ jsxs("p", { className: "text-allin-orange font-medium text-center", children: [
          "Benefício: ",
          condition.benefit
        ] }) })
      ] })
    ] }, index)) })
  ] }) });
};
const faqData = [
  {
    category: "📦 Produtos",
    items: [
      {
        question: "Quais são os benefícios dos calçados All-In?",
        answer: "Nossos calçados são projetados com tecnologia inovadora que proporciona conforto, suporte e bem-estar. Eles ajudam a aliviar dores nos pés, melhoram a postura e oferecem amortecimento superior."
      },
      {
        question: "Como escolher o tamanho correto?",
        answer: "Recomendamos consultar nossa tabela de medidas para garantir o melhor ajuste. Se estiver entre dois tamanhos, sugerimos escolher o maior. Todos os nossos produtos possuem troca facilitada."
      },
      {
        question: "Os produtos têm garantia?",
        answer: "Sim, todos os nossos produtos possuem garantia contra defeitos de fabricação. Em caso de qualquer problema, entre em contato com nosso suporte para orientações sobre a garantia."
      },
      {
        question: "Como faço para limpar meus calçados?",
        answer: "Recomendamos limpeza com pano úmido e sabão neutro. Evite máquina de lavar e secar, pois podem danificar os materiais e comprometer a tecnologia do calçado."
      },
      {
        question: "Quanto tempo dura o frete?",
        answer: "O prazo de entrega varia conforme a região, mas geralmente é de 3 a 10 dias úteis após a confirmação do pagamento. Enviamos atualizações por e-mail com o código de rastreamento."
      }
    ]
  },
  {
    category: "💳 Pagamento e Entrega",
    items: [
      {
        question: "Quais são as formas de pagamento?",
        answer: "Aceitamos todas as bandeiras de cartão de crédito, PIX, boleto bancário e parcelamento em até 12x no cartão (com juros conforme política da operadora)."
      },
      {
        question: "Como faço para rastrear meu pedido?",
        answer: "Assim que seu pedido for enviado, você receberá um e-mail com o código de rastreamento dos Correios. Você pode acompanhar a entrega diretamente no site dos Correios com este código."
      },
      {
        question: "Qual é a política de troca e devolução?",
        answer: "Você tem até 7 dias corridos após o recebimento para solicitar a troca ou devolução, desde que o produto esteja em perfeito estado, com etiqueta e embalagem originais. Consulte nossa política completa na página de Trocas e Devoluções."
      },
      {
        question: "Posso alterar meu pedido após a compra?",
        answer: "Se o pedido ainda não foi aprovado para envio, é possível fazer alterações. Entre em contato imediatamente com nosso atendimento pelo WhatsApp ou e-mail para verificar a possibilidade."
      },
      {
        question: "Vocês enviam para todo o Brasil?",
        answer: "Sim, enviamos para todo o território nacional. O frete é calculado automaticamente no fechamento do pedido de acordo com o CEP de entrega."
      }
    ]
  },
  {
    category: "❓ Dúvidas Gerais",
    items: [
      {
        question: "Os calçados são adequados para quem tem problemas nos pés?",
        answer: "Sim, nossos calçados são projetados para oferecer suporte e conforto, sendo ideais para quem sofre com dores nos pés, fascite plantar, esporão de calcâneo e outros problemas comuns. No entanto, recomendamos consultar um especialista para casos específicos."
      },
      {
        question: "Posso usar os calçados para praticar esportes?",
        answer: "Nossos calçados são projetados para uso cotidiano e caminhadas leves. Para atividades físicas de alto impacto, recomendamos calçados específicos para esportes."
      },
      {
        question: "Como sei se o calçado é original All-In?",
        answer: "Todos os nossos produtos possuem etiqueta de autenticidade e código de rastreamento. Compre apenas em nossa loja oficial ou revendedores autorizados para evitar produtos falsificados."
      },
      {
        question: "Vocês oferecem desconto para compras em grande quantidade?",
        answer: "Sim, temos condições especiais para compras em grande volume. Entre em contato com nosso time comercial através do WhatsApp ou e-mail para saber mais sobre nossas condições especiais."
      },
      {
        question: "Como posso me tornar um revendedor All-In?",
        answer: "Se você tem interesse em revender nossos produtos, entre em contato com nosso setor de relacionamento com revendedores pelo WhatsApp (11) 98888-7777 ou pelo e-mail revendedores@allin.com.br. Nossa equipe terá prazer em fornecer todas as informações necessárias."
      },
      {
        question: "Como posso entrar em contato com o suporte?",
        answer: "Você pode entrar em contato através do nosso WhatsApp (11) 99999-9999, e-mail suporte@allin.com.br ou pelo chat online em nosso site. Nosso horário de atendimento é de segunda a sexta, das 9h às 18h."
      }
    ]
  }
];
const FAQAccordionSection = () => {
  return /* @__PURE__ */ jsx("section", { id: "faq", className: "py-20 bg-allin-bg-light-3 dark:bg-allin-bg-dark-3", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4", children: [
    /* @__PURE__ */ jsxs("div", { className: "text-center mb-16 animate-fade-in", children: [
      /* @__PURE__ */ jsxs("h2", { className: "text-4xl md:text-5xl font-bold mb-6 text-allin-dark dark:text-allin-white", children: [
        "Dúvidas ",
        /* @__PURE__ */ jsx("span", { className: "text-allin-orange", children: "Frequentes" })
      ] }),
      /* @__PURE__ */ jsxs("p", { className: "text-xl text-allin-dark/80 dark:text-allin-white/80 max-w-3xl mx-auto", children: [
        "Tudo o que você precisa saber para tomar a ",
        /* @__PURE__ */ jsx("strong", { children: "melhor decisão" }),
        " e começar sua jornada de sucesso com a Allin hoje mesmo."
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "max-w-4xl mx-auto", children: /* @__PURE__ */ jsx("div", { className: "space-y-8", children: faqData.map((category, catIndex) => /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("h3", { className: "text-2xl font-bold text-allin-orange mb-6 text-center", children: category.category }),
      /* @__PURE__ */ jsx(Accordion, { type: "single", collapsible: true, className: "space-y-4", children: category.items.map((faq, faqIndex) => /* @__PURE__ */ jsxs(
        AccordionItem,
        {
          value: `item-${catIndex}-${faqIndex}`,
          className: "bg-allin-bg-light-1 dark:bg-allin-bg-dark-1 rounded-lg border border-allin-orange/40 shadow-md glass-card animate-slide-up",
          style: { animationDelay: `${0.05 * (catIndex * 5 + faqIndex)}s` },
          children: [
            /* @__PURE__ */ jsx(AccordionTrigger, { className: "text-left font-semibold text-lg px-6 hover:no-underline text-allin-dark dark:text-allin-white hover:text-allin-orange transition-colors", children: faq.question }),
            /* @__PURE__ */ jsx(AccordionContent, { className: "px-6 pb-6 text-allin-dark/80 dark:text-allin-white/80 leading-relaxed", children: faq.answer })
          ]
        },
        faqIndex
      )) })
    ] }, catIndex)) }) })
  ] }) });
};
const HomeTestimonialsSection = () => {
  const testimonials = [
    {
      text: "Eu havia desistido de dançar com minha esposa... até colocar os tênis Allin. Hoje danço salsa como se tivesse 30 anos novamente. Minha mobilidade voltou, minha alegria também!",
      author: "Roberto, 62 anos",
      condition: "Artrose nos joelhos"
    },
    {
      text: "Trabalhava 12 horas por dia em pé, minha fascite plantar era insuportável. Com Allin, não só voltei ao trabalho como comecei a correr 5km por dia. É como se eu tivesse ganhado uma nova vida!",
      author: "Carla, 34 anos",
      condition: "Fascite plantar severa"
    },
    {
      text: "Diabética há 15 anos, tinha medo constante de feridas nos pés. Desde que uso Allin, além de eliminar o inchaço, recuperei a confianza para passear com meus netos sem preocupação.",
      author: "Elena, 58 anos",
      condition: "Neuropatia diabética"
    },
    {
      text: "Minha fibromialgia era tão debilitante que mal conseguia sair da cama. Os tênis Allin transformaram minha rotina - hoje trabalho normalmente e até voltei a praticar jardinagem, minha paixão!",
      author: "Marcos, 45 anos",
      condition: "Fibromialgia crônica"
    },
    {
      text: "Tinha esporão no calcanhar há 3 anos. Fisioterapia, remédios, nada ajudava. Com Allin, senti alívio em 3 dias! Agora subo escadas, caminho na praia e trabalho sem dor. É simplesmente milagroso!",
      author: "Sofia, 29 anos",
      condition: "Esporão do calcâneo"
    },
    {
      text: "Minhas varizes e má circulação deixavam minhas pernas pesadas e doloridas. Com Allin, além de reduzir o inchaço, me sinto energética o dia todo. É como se tivesse recuperado minhas pernas!",
      author: "Patrícia, 41 anos",
      condition: "Má circulação e varizes"
    }
  ];
  return /* @__PURE__ */ jsx("section", { className: "py-20 bg-allin-bg-light-2 dark:bg-allin-bg-dark-2", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4", children: [
    /* @__PURE__ */ jsxs("div", { className: "text-center mb-16", children: [
      /* @__PURE__ */ jsxs("h2", { className: "text-3xl md:text-4xl font-bold mb-4 text-allin-dark dark:text-allin-white", children: [
        "Histórias reais de quem recuperou a liberdade de",
        " ",
        /* @__PURE__ */ jsx("span", { className: "text-allin-orange", children: "caminhar" })
      ] }),
      /* @__PURE__ */ jsx("p", { className: "text-lg text-allin-dark/70 dark:text-allin-white/70 max-w-2xl mx-auto", children: "Transformamos vidas todos os dias. Veja como os tênis Allin mudaram a realidade de pessoas reais." })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8", children: testimonials.map((testimonial, index) => /* @__PURE__ */ jsx(
      "div",
      {
        className: "group relative bg-white/15 backdrop-blur-lg rounded-2xl overflow-hidden border border-allin-orange/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 glass-card",
        children: /* @__PURE__ */ jsxs("div", { className: "p-8", children: [
          /* @__PURE__ */ jsx(CardHeader, { className: "p-0 mb-6", children: /* @__PURE__ */ jsx(CardTitle, { className: "text-4xl text-allin-orange", children: '"' }) }),
          /* @__PURE__ */ jsxs(CardContent, { className: "p-0", children: [
            /* @__PURE__ */ jsxs("p", { className: "text-allin-dark dark:text-allin-white mb-6 italic", children: [
              '"',
              testimonial.text,
              '"'
            ] }),
            /* @__PURE__ */ jsxs("p", { className: "font-semibold text-allin-orange", children: [
              "— ",
              testimonial.author
            ] }),
            /* @__PURE__ */ jsx("p", { className: "text-sm text-allin-dark/70 dark:text-allin-white/70 mt-2", children: testimonial.condition })
          ] })
        ] })
      },
      index
    )) }),
    /* @__PURE__ */ jsx("div", { className: "text-center mt-16", children: /* @__PURE__ */ jsxs("div", { className: "bg-allin-orange/10 rounded-2xl p-8 max-w-3xl mx-auto border border-allin-orange/20", children: [
      /* @__PURE__ */ jsx("h3", { className: "text-2xl font-bold mb-4 text-allin-dark dark:text-allin-white", children: "Sua história pode ser a próxima!" }),
      /* @__PURE__ */ jsx("p", { className: "text-allin-dark/70 dark:text-allin-white/70 mb-6", children: "Milhares de pessoas já recuperaram sua mobilidade e qualidade de vida com a tecnologia Allin." }),
      /* @__PURE__ */ jsx("button", { className: "bg-allin-orange text-allin-dark px-6 py-3 rounded-full font-semibold hover:bg-allin-orange/90 transition-colors", children: "Descubra seu Allin" })
    ] }) })
  ] }) });
};
function HomePage() {
  const {
    setDistributorBySlug
  } = useDistributor();
  const {
    user,
    loading
  } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    setDistributorBySlug("allinBrasil");
  }, [setDistributorBySlug]);
  useEffect(() => {
    if (loading || !user) return;
    navigate({
      to: getPrimaryPathForRole(user.role),
      replace: true
    });
  }, [loading, user, navigate]);
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen", children: [
    /* @__PURE__ */ jsx(PublicHeader, {}),
    /* @__PURE__ */ jsxs("div", { className: "pt-20", children: [
      /* @__PURE__ */ jsx(HeroIntroSection, { id: "sobre", title: "Saúde nos seus pés começa aqui. Alívio imediato e duradouro.", subtitle: "Para quem convive com dores, cansaço ou problemas de circulação, a Allin oferece tecnologia para melhorar seu dia a dia.", primaryButtonText: "Descubra como aliviar seus sintomas", primaryButtonLink: "/doencas", secondaryButtonText: "Ver depoimentos", secondaryButtonLink: "/#testimonials" }),
      /* @__PURE__ */ jsx(ProductsSection, {}),
      /* @__PURE__ */ jsx(DiseaseIdentificationSection, {}),
      /* @__PURE__ */ jsx(ModelsSection, {}),
      /* @__PURE__ */ jsx(HomeTestimonialsSection, {}),
      /* @__PURE__ */ jsx(FAQAccordionSection, {}),
      /* @__PURE__ */ jsx(Footer, {}),
      /* @__PURE__ */ jsx(CartSidebar, {})
    ] })
  ] });
}
export {
  HomePage as component
};
