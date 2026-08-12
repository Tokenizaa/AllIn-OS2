import { useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { BookOpen, Factory, Package, ShoppingCart, Zap, Map } from "lucide-react";
import { PublicHeader } from "@/components/app/public-header";
import { buildSidebarTree, humanizeFolder, type DocNode } from "@/lib/docs-data";

export const Route = createFileRoute("/docs/")({
  component: DocsHome,
});

const ICONS: Record<string, typeof BookOpen> = {
  "01-visao-geral": BookOpen,
  "02-plataforma-maxnivel": Factory,
  "03-plataforma-loja-virtual": ShoppingCart,
  "04-plataforma-cd": Package,
  "05-guias-rapidos": Zap,
  "06-referencia-tecnica": Map,
};

function DocsHome() {
  const tree = useMemo(() => buildSidebarTree(), []);

  const sections = tree
    .filter((n) => n.children?.length)
    .map((n) => {
      const Icon = ICONS[n.path] ?? BookOpen;
      const first = firstLeaf(n);
      const count = countLeaves(n);
      return {
        path: n.path,
        title: humanizeFolder(n.title),
        firstLink: first.path,
        count,
        desc: sectionDescription(n.path),
        Icon,
      };
    });

  return (
    <>
      <PublicHeader />
      <div className="min-h-screen bg-white pt-[var(--docs-header-h)] dark:bg-zinc-950">
      <div className="mx-auto max-w-5xl px-4 py-14 sm:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-5xl">
            Documentação{" "}
            <span className="text-[#a35d00] dark:text-allin-orange">AllIn-OS2</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-zinc-600 dark:text-zinc-300">
            Manual operacional do sistema de gestão MLM — Administração Maxnível (sistema legado),
            Loja Virtual e Centros de Distribuição. Baseado nas transcrições oficiais
            de treinamento e na validação da plataforma em produção.
          </p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2">
          {sections.map(({ path, title, firstLink, count, desc, Icon }) => (
            <Link
              key={path}
              to="/docs/$"
              params={{ _splat: firstLink }}
              className="group rounded-2xl border border-zinc-200 p-6 transition-all hover:border-allin-orange/50 hover:shadow-lg dark:border-zinc-800"
            >
              <div className="flex items-start gap-4">
                <div className="rounded-xl bg-allin-orange/10 p-3 text-allin-orange">
                  <Icon size={24} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-zinc-900 group-hover:text-[#a35d00] dark:text-zinc-100 dark:group-hover:text-allin-orange">
                    {title}
                  </h2>
                  <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{desc}</p>
                  <p className="mt-3 text-xs font-semibold text-[#a35d00] dark:text-allin-orange">
                    {count} documento{count === 1 ? "" : "s"} →
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-12 rounded-2xl border border-dashed border-zinc-300 p-6 dark:border-zinc-700">
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            <strong className="font-semibold text-zinc-800 dark:text-zinc-200">Dica:</strong> use
            o menu lateral para navegar pela árvore completa. Todos os documentos
            citam a tela real (URL) e o trecho do treinamento de origem.
          </p>
        </div>
      </div>
    </div>
    </>
  );
}

function countLeaves(node: DocNode): number {
  return node.children?.reduce(
    (acc, c) => acc + (c.children ? countLeaves(c) : 1),
    0,
  ) ?? 0;
}

/** Primeira folha (doc) de um nó, descendo recursivamente */
function firstLeaf(node: DocNode): { path: string } {
  if (!node.children?.length) return node;
  return firstLeaf(node.children[0]);
}

/** "01-visao-geral" → "Visão Geral" */
function sectionDescription(path: string): string {
  const map: Record<string, string> = {
    "01-visao-geral": "Arquitetura, glossário e URLs de acesso por papel.",
    "02-plataforma-maxnivel": "Distribuidores, planos, bônus, saques e relatórios.",
    "03-plataforma-loja-virtual": "Catálogo, pedidos, clientes, fretes e pagamentos.",
    "04-plataforma-cd": "Acesso, estoque, financeiro, pedidos e go-live.",
    "05-guias-rapidos": "Passo a passo de tarefas críticas em 1 página.",
    "06-referencia-tecnica": "Todas as URLs mapeadas e matriz de permissões.",
    "07-anexos": "Mapeamento treinamento → tela e transcrições limpas.",
    "reverse-engineering": "Engenharia reversa com dados reais da plataforma.",
  };
  return map[path] ?? "Documentação da plataforma.";
}