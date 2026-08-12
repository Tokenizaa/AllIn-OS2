import { useMemo, useState } from "react";
import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Menu, X } from "lucide-react";
import {
  buildSidebarTree,
  getDocMeta,
  humanizeFolder,
  type DocNode,
} from "@/lib/docs-data";

export const Route = createFileRoute("/docs/$")({
  component: DocsViewer,
});

function SidebarTree({ nodes, currentPath, onNavigate }: { nodes: DocNode[]; currentPath: string; onNavigate: () => void }) {
  return (
    <ul className="space-y-1">
      {nodes.map((node) =>
        node.children ? (
          <li key={node.path}>
            <div className="px-2 py-1.5 text-xs font-semibold uppercase tracking-[0.06em] text-zinc-600 dark:text-zinc-400">
              {humanizeFolder(node.title)}
            </div>
            <SidebarTree nodes={node.children} currentPath={currentPath} onNavigate={onNavigate} />
          </li>
        ) : (
          <li key={node.path}>
            <Link
              to="/docs/$"
              params={{ _splat: node.path }}
              onClick={onNavigate}
              className={`block rounded-md px-3 py-1.5 text-sm text-zinc-800 transition-colors hover:bg-zinc-200/60 dark:text-zinc-200 dark:hover:bg-zinc-800 ${
                currentPath === node.path
                  ? "bg-allin-orange/15 font-medium text-[#a35d00] dark:bg-allin-orange/20 dark:text-allin-orange"
                  : ""
              }`}
            >
              {node.title}
            </Link>
          </li>
        ),
      )}
    </ul>
  );
}

function DocsViewer() {
  const params = useParams({ strict: false }) as { _splat?: string };
  const path = params._splat ?? "";
  const meta = useMemo(() => getDocMeta(path), [path]);
  const tree = useMemo(() => buildSidebarTree(), []);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white pt-16 dark:bg-zinc-950">
      <div className="flex">
        {/* Sidebar — chega até a borda esquerda; cola abaixo do header no desktop */}
        <aside
          className={`fixed inset-y-0 left-0 z-30 w-72 shrink-0 overflow-y-auto border-r border-zinc-200 bg-zinc-50 p-4 pt-16 transition-transform dark:border-zinc-800 dark:bg-zinc-900 lg:sticky lg:top-16 lg:bottom-auto lg:h-[calc(100vh-4rem)] lg:translate-x-0 lg:pt-4 lg:z-auto ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="mb-3 px-2 text-sm font-bold text-zinc-900 dark:text-zinc-100">
            Documentação
          </div>
          <SidebarTree nodes={tree} currentPath={path} onNavigate={() => setSidebarOpen(false)} />
        </aside>

        {/* Overlay mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-20 bg-black/40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Conteúdo — centrado no espaço restante */}
        <main className="min-w-0 flex-1">
          <div className="mx-auto max-w-3xl px-4 py-8 sm:px-8">
            <div className="mb-4 flex items-center gap-3 lg:hidden">
              <button
                onClick={() => setSidebarOpen(true)}
                className="rounded-md border border-zinc-300 p-2 text-zinc-600 dark:border-zinc-700 dark:text-zinc-300"
                aria-label="Abrir menu"
              >
                <Menu size={18} />
              </button>
              {meta?.title && <span className="truncate text-sm font-semibold">{meta.title}</span>}
            </div>

            {meta?.raw ? (
              <article className="docs-prose">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    a: ({ href, children }) => {
                      if (href?.startsWith("http")) {
                        return (
                          <a href={href} target="_blank" rel="noreferrer">
                            {children}
                          </a>
                        );
                      }
                      const resolved = resolveDocLink(href, path);
                      if (resolved) {
                        return <Link to="/docs/$" params={{ _splat: resolved }}>{children}</Link>;
                      }
                      return <a href={href}>{children}</a>;
                    },
                    code: ({ children }) => (
                      <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-[0.85em] text-rose-600 dark:bg-zinc-800 dark:text-rose-400">
                        {children}
                      </code>
                    ),
                    pre: ({ children }) => (
                      <pre className="overflow-x-auto rounded-lg bg-zinc-900 p-4 text-sm text-zinc-100 dark:bg-zinc-800">
                        {children}
                      </pre>
                    ),
                    table: ({ children }) => (
                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse text-sm">{children}</table>
                      </div>
                    ),
                  }}
                >
                  {meta.raw}
                </ReactMarkdown>
              </article>
            ) : (
              <div className="py-20 text-center">
                <X className="mx-auto mb-4 text-zinc-400" size={40} />
                <h1 className="text-2xl font-bold">Documento não encontrado</h1>
                <p className="mt-2 text-zinc-600 dark:text-zinc-400">
                  O caminho <code className="rounded bg-zinc-100 px-1 py-0.5 dark:bg-zinc-800">docs/{path}</code> não existe.
                </p>
                <Link
                  to="/docs"
                  className="mt-6 inline-block rounded-md bg-allin-orange px-4 py-2 text-sm font-medium text-white"
                >
                  Voltar à documentação
                </Link>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

/** Resolve link relativo (.md) dentro da árvore de docs.
 *  Tenta relativo ao arquivo atual; se não acha, tenta relativo à raiz docs/
 *  (muitos links da documentação foram escritos como se estivessem na raiz). */
function resolveDocLink(href: string | undefined, currentPath: string): string | null {
  if (!href || href.startsWith("#")) return null;

  const tryResolve = (parts: string[]): string | null => {
    const stack: string[] = [];
    for (const p of parts) {
      if (p === "..") stack.pop();
      else if (p !== "." && p !== "") stack.push(p);
    }
    const normalized = stack.join("/").replace(/\.md$/, "");
    return getDocMeta(normalized) ? normalized : null;
  };

  // 1) relativo ao diretório do documento atual
  const base = currentPath.includes("/")
    ? currentPath.slice(0, currentPath.lastIndexOf("/"))
    : "";
  const relParts = [...base.split("/").filter(Boolean), ...href.split("/")];
  const rel = tryResolve(relParts);
  if (rel) return rel;

  // 2) fallback: relativo à raiz docs/ (ignorando ../ e ./)
  const rootParts = href.split("/").filter((p) => p !== ".." && p !== ".");
  return tryResolve(rootParts);
}