import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { g as useNavigate, L as Link } from "../_libs/tanstack__react-router.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { b as useAuth } from "./router-BZaVudxP.mjs";
import { m as motion } from "../_libs/framer-motion.mjs";
import { c as CircleCheck, a4 as CircleAlert, a5 as UserPlus, A as ArrowRight } from "../_libs/lucide-react.mjs";

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
import "../_libs/motion-dom.mjs";
import "../_libs/motion-utils.mjs";
function RegisterPage() {
  const navigate = useNavigate();
  const {
    register,
    activeSponsor,
    usersList
  } = useAuth();
  const [name, setName] = reactExports.useState("");
  const [email, setEmail] = reactExports.useState("");
  const [phone, setPhone] = reactExports.useState("");
  const [cpf, setCpf] = reactExports.useState("");
  const [sponsorCode, setSponsorCode] = reactExports.useState(activeSponsor || "");
  const [password, setPassword] = reactExports.useState("");
  const [role, setRole] = reactExports.useState("distributor");
  const [loading, setLoading] = reactExports.useState(false);
  const [sponsorName, setSponsorName] = reactExports.useState(null);
  reactExports.useEffect(() => {
    if (sponsorCode.trim()) {
      const match = usersList.find((u) => u.role === "distributor" && (u.referral_code?.toLowerCase() === sponsorCode.trim().toLowerCase() || u.id.toLowerCase() === sponsorCode.trim().toLowerCase()));
      if (match) {
        setSponsorName(match.name);
      } else {
        setSponsorName(null);
      }
    } else {
      setSponsorName(null);
    }
  }, [sponsorCode, usersList]);
  reactExports.useEffect(() => {
    if (activeSponsor) {
      setSponsorCode(activeSponsor);
    }
  }, [activeSponsor]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password || !phone || !cpf) {
      toast.error("Por favor, preencha todos os dados obrigatórios.");
      return;
    }
    if (role === "customer" && !sponsorCode) {
      toast.error("Clientes finais precisam ter um patrocinador associado.");
      return;
    }
    if (sponsorCode && !sponsorName) {
      toast.error("Código de patrocinador inválido. Indique um líder ativo cadastrado.");
      return;
    }
    setLoading(true);
    try {
      const userResult = await register(name, email, role, {
        phone,
        cpf,
        sponsor_id: sponsorCode || "user-admin-master",
        password
      });
      toast.success(`Cadastro efetuado com sucesso! Logado como ${userResult.name}.`);
      if (userResult.role === "distributor") {
        navigate({
          to: "/ativacao"
        });
      } else {
        navigate({
          to: "/office/store"
        });
      }
    } catch (err) {
      toast.error(err.message || "Erro ao criar conta.");
    } finally {
      setLoading(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen flex text-foreground bg-[#04060a] relative overflow-hidden", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-[-20%] right-[-20%] w-[60%] h-[60%] rounded-full bg-primary/10 blur-[130px] pointer-events-none" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-fuchsia-500/5 blur-[120px] pointer-events-none" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-[linear-gradient(to_right,#080c14_1px,transparent_1px),linear-gradient(to_bottom,#080c14_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none opacity-40" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 flex flex-col justify-center items-center p-6 md:p-12 relative z-10 my-8", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full max-w-[520px] space-y-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/login", className: "inline-flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-10 w-10 rounded-xl bg-gradient-to-br from-primary via-fuchsia-500 to-cyan-400 grid place-items-center text-primary-foreground font-black shadow-lg", children: "A" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-bold tracking-tight text-xl text-white", children: "Allin OS" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-bold tracking-tight text-white font-sans mt-4", children: "Crie sua Conta de Negócios" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Inicie hoje mesmo e conecte seu negócio à maior plataforma inteligente de matrizes binárias e venda direta." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.div, { initial: {
        opacity: 0,
        scale: 0.98
      }, animate: {
        opacity: 1,
        scale: 1
      }, transition: {
        duration: 0.3
      }, className: "rounded-2xl border border-border/60 bg-[#090d16]/85 p-6 md:p-8 shadow-2xl backdrop-blur-md space-y-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3 p-1 rounded-xl bg-background/50 border border-border/40", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setRole("distributor"), className: `py-2 px-3 text-xs font-semibold rounded-lg transition-all ${role === "distributor" ? "bg-primary text-primary-foreground shadow" : "text-muted-foreground hover:text-white"}`, children: "Distribuidor MLM" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setRole("customer"), className: `py-2 px-3 text-xs font-semibold rounded-lg transition-all ${role === "customer" ? "bg-primary text-primary-foreground shadow" : "text-muted-foreground hover:text-white"}`, children: "Cliente de Venda Direta" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block", children: "Nome completo" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", required: true, value: name, onChange: (e) => setName(e.target.value), className: "w-full h-10 px-3.5 rounded-lg border border-border/60 bg-background/50 text-sm focus:outline-none focus:border-primary/80 text-white", placeholder: "João Silva" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block", children: "E-mail corporativo" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "email", required: true, value: email, onChange: (e) => setEmail(e.target.value), className: "w-full h-10 px-3.5 rounded-lg border border-border/60 bg-background/50 text-sm focus:outline-none focus:border-primary/80 text-white font-mono", placeholder: "joao@dominio.com" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block", children: "Telefone móvel" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "tel", required: true, value: phone, onChange: (e) => setPhone(e.target.value), className: "w-full h-10 px-3.5 rounded-lg border border-border/60 bg-background/50 text-sm focus:outline-none focus:border-primary/80 text-white", placeholder: "+55 (11) 98888-8888" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block", children: "Documento (CPF / CNPJ)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", required: true, value: cpf, onChange: (e) => setCpf(e.target.value), className: "w-full h-10 px-3.5 rounded-lg border border-border/60 bg-background/50 text-sm focus:outline-none focus:border-primary/80 text-white font-mono", placeholder: "123.456.789-00" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1 bg-background/30 p-3 rounded-lg border border-border/40", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block", children: "ID do Patrocinador / Sponsor" }),
              role === "customer" && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] font-bold text-red-400 uppercase tracking-widest leading-none", children: "Obrigatório" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", disabled: !!activeSponsor, value: sponsorCode, onChange: (e) => setSponsorCode(e.target.value), className: "w-full h-10 px-3.5 rounded-lg border border-border/60 bg-background/60 text-sm focus:outline-none focus:border-primary/80 text-white uppercase font-mono disabled:opacity-70 disabled:cursor-not-allowed", placeholder: "DIGITE O LINK DO LÍDER PATROCINADOR" }),
            sponsorName ? /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-1.5 text-xs text-emerald-400 flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-3.5 w-3.5 text-emerald-400 shrink-0" }),
              "Líder vinculado: ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: sponsorName })
            ] }) : sponsorCode.trim() ? /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-1.5 text-xs text-rose-400 flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "h-3.5 w-3.5 shrink-0" }),
              "Sponsor indisponível. Cadastre sob ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "default_sponsor" }),
              " para simulação direta."
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-[11px] text-muted-foreground font-sans", children: role === "customer" ? "O cliente necessita estar associado a um distribuidor patrocinador para efetuar compras corporativas." : "Caso não possua sponsor, você ficará vinculado ao ID master admin." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block", children: "Senha de segurança" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "password", required: true, value: password, onChange: (e) => setPassword(e.target.value), className: "w-full h-10 px-3.5 rounded-lg border border-border/60 bg-background/50 text-sm focus:outline-none focus:border-primary/80 text-white", placeholder: "Crie uma senha forte" })
          ] }),
          role === "distributor" ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[11px] text-muted-foreground border-l-2 border-primary pl-2.5 py-0.5 leading-relaxed font-sans", children: [
            "Após o cadastro, você precisará ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { className: "text-white", children: "efetuar a ativação de seu escritório corporativo" }),
            " selecionando um pacote de distribuidor inicial."
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[11px] text-muted-foreground border-l-2 border-emerald-500 pl-2.5 py-0.5 leading-relaxed font-sans", children: [
            "Sua conta cliente estará vinculada permanentemente ao distribuidor ",
            /* @__PURE__ */ jsxRuntimeExports.jsxs("strong", { className: "text-emerald-400", children: [
              "@",
              sponsorCode || "sponsor"
            ] }),
            " permitindo cashback de redes e fidelidade."
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "submit", disabled: loading, className: "w-full h-10 rounded-lg bg-primary hover:bg-primary/95 text-primary-foreground text-sm font-semibold transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/25 disabled:opacity-75 disabled:cursor-not-allowed cursor-pointer pt-0.5", children: loading ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" }),
            "Registrando negócio..."
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(UserPlus, { className: "h-4 w-4" }),
            "Criar Minha Licença",
            /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-4 w-4" })
          ] }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-center text-xs text-muted-foreground", children: [
        "Já possui licença corporativa?",
        " ",
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/login", className: "text-primary hover:underline font-semibold", children: "Fazer Login" })
      ] })
    ] }) })
  ] });
}
export {
  RegisterPage as component
};
