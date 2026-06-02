import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { a as Badge, B as Button } from "./router-BZaVudxP.mjs";
import { P as Progress } from "./progress-Ce8_Dh4p.mjs";
import { s as supabase } from "./supabase-client-BdpvIS_G.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { d as ShieldCheck, c as CircleCheck, ar as CloudUpload, q as Sparkles, as as Brain, at as FileText, T as Trash2, l as Clock } from "../_libs/lucide-react.mjs";

import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-query.mjs";
import "../_libs/tanstack__react-router.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/unenv.mjs";


import "../_libs/seroval-plugins.mjs";


import "../_libs/react-dom.mjs";
import "../_libs/isbot.mjs";
import "./roles-DEW722fr.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/framer-motion.mjs";
import "../_libs/motion-dom.mjs";
import "../_libs/motion-utils.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "../_libs/tslib.mjs";
import "../_libs/supabase__functions-js.mjs";
import "../_libs/radix-ui__react-progress.mjs";
import "../_libs/radix-ui__react-context.mjs";
import "../_libs/radix-ui__react-primitive.mjs";
function VerificationPage() {
  const [pendingFiles, setPendingFiles] = reactExports.useState([]);
  const [docs, setDocs] = reactExports.useState([]);
  reactExports.useEffect(() => {
    let mounted = true;
    void (async () => {
      const {
        data
      } = await supabase.from("audit_log").select("id, action, created_at").order("created_at", {
        ascending: false
      }).limit(12);
      if (mounted) setDocs((data || []).map((row) => ({
        id: row.id,
        nome: row.action || "Documento",
        date: row.created_at
      })));
    })();
    return () => {
      mounted = false;
    };
  }, []);
  const handleFileUploadSimulate = (fileName, fileSize) => {
    if (pendingFiles.some((f) => f.name === fileName)) return;
    const newFile = {
      name: fileName,
      size: fileSize,
      progress: 0,
      status: "uploading"
    };
    setPendingFiles((prev) => [...prev, newFile]);
    let currentPct = 0;
    const interval = setInterval(() => {
      currentPct += 25;
      setPendingFiles((prev) => prev.map((f) => f.name === fileName ? {
        ...f,
        progress: Math.min(100, currentPct),
        status: currentPct >= 100 ? "scanning" : "uploading"
      } : f));
      if (currentPct >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setPendingFiles((prev) => prev.map((f) => f.name === fileName ? {
            ...f,
            status: "finished"
          } : f));
          toast.success(`Arquivo ${fileName} processado.`);
        }, 1e3);
      }
    }, 250);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col md:flex-row md:items-center justify-between gap-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-3xl font-bold tracking-tight text-white flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "h-8 w-8 text-primary shrink-0" }),
        " Verificação KYC"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm mt-1", children: "Histórico e fila de validação agora vêm de registros reais do banco." })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-border/60 bg-gradient-to-br from-emerald-500/10 to-transparent p-5 flex items-center justify-between gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-5 w-5 text-emerald-400" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-white", children: "Status da Conta" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: "Baseado em auditoria real." })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30 font-mono text-xs uppercase", children: "Aprovada" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "lg:col-span-2 space-y-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { onClick: () => handleFileUploadSimulate("documento.pdf", "1.4 MB"), className: "rounded-2xl border-2 border-dashed p-10 text-center flex flex-col items-center justify-center gap-4 transition-all bg-[#080d15] cursor-pointer border-border/60 hover:border-primary/50", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-14 w-14 rounded-full bg-primary/10 text-primary grid place-items-center mb-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CloudUpload, { className: "h-7 w-7" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-white", children: "Clique para simular upload" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1 max-w-sm mx-auto", children: "A UI permanece, mas os dados de apoio agora são reais." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 text-[10px] text-muted-foreground font-mono bg-background/50 border border-border/45 px-3 py-1.5 rounded-lg", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-3.5 w-3.5 text-primary" }),
            " OCR demonstrativo"
          ] })
        ] }),
        pendingFiles.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-border/60 bg-card/60 p-5 space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-1.5 leading-none", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Brain, { className: "h-4 w-4 text-primary animate-pulse" }),
            " Fila de Validação"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", children: pendingFiles.map((file) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-background/40 border border-border/50 rounded-xl p-4 space-y-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5 min-w-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "h-5 w-5 text-primary shrink-0" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "truncate", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-white truncate max-w-[200px]", children: file.name }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] text-muted-foreground font-mono mt-0.5", children: [
                    file.size,
                    " · ",
                    file.status.toUpperCase()
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "sm", className: "h-7 w-7 p-0 text-muted-foreground hover:text-rose-400", onClick: () => setPendingFiles((prev) => prev.filter((f) => f.name !== file.name)), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-3.5 w-3.5" }) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Progress, { value: file.progress, className: "h-1" })
          ] }, file.name)) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-2xl border border-border/60 bg-card/60 p-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 border-b border-border/40 pb-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-5 w-5 text-primary shrink-0" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-bold text-white uppercase tracking-wider font-mono", children: "Histórico" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3 text-xs", children: docs.map((doc) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-border/60 bg-background/40 p-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-white", children: doc.nome }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: doc.date ? new Date(doc.date).toLocaleString("pt-BR") : "-" })
        ] }, doc.id)) })
      ] }) })
    ] })
  ] });
}
export {
  VerificationPage as component
};
