/**
 * Dados da documentação — importa todos os .md de docs/ como string crua
 * e constrói a árvore de navegação (sidebar).
 */

// Import eager: todos os markdown embutidos no bundle (docs são pequenos)
const modules = import.meta.glob("../../docs/**/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

const EXCLUDE_PREFIXES = ["tutoriais/", "bonus/", "Nova pasta/", "db-ref/"];
const EXCLUDE_FILES = ["index", "README"];

/**
 * Sequência didática de aprendizado (path relativo a docs/, sem .md).
 * Ordem natural: entender o conceito → fluxo de entrada → operação → relatórios → saída.
 * Docs fora desta lista seguem depois, em ordem alfabética.
 */
const LEARN_ORDER: string[] = [
  // ---- Visão Geral ----
  "01-visao-geral/arquitetura-sistema",
  "01-visao-geral/glossario-termos",

  // ---- Maxnível: Distribuidores (ciclo de vida) ----
  "02-plataforma-maxnivel/01-distribuidores/rede-distribuidores",
  "02-plataforma-maxnivel/01-distribuidores/pendentes-aprovacao",
  "02-plataforma-maxnivel/01-distribuidores/relatorio-indicados",
  "02-plataforma-maxnivel/01-distribuidores/excluidos",

  // ---- Maxnível: Catálogos e Planos ----
  "02-plataforma-maxnivel/02-catalogos-planos/planos-adesao",

  // ---- Maxnível: Ferramentas Operacionais ----
  "02-plataforma-maxnivel/03-ferramentas-operacionais/ferramentas-operacionais",

  // ---- Maxnível: Financeiro ----
  "02-plataforma-maxnivel/04-financeiro-industria/bonus-instalados",
  "02-plataforma-maxnivel/04-financeiro-industria/solicitacao-saque",

  // ---- Maxnível: Relatórios e Configurações ----
  "02-plataforma-maxnivel/05-relatorios-industria/relatorios-rede",
  "02-plataforma-maxnivel/06-configuracoes-sistema/permissoes-grupos",

  // ---- Loja: Catálogo (base → derivados) ----
  "03-plataforma-loja-virtual/01-catalogo/departamentos",
  "03-plataforma-loja-virtual/01-catalogo/produtos",
  "03-plataforma-loja-virtual/01-catalogo/estoque",
  "03-plataforma-loja-virtual/01-catalogo/kits",
  "03-plataforma-loja-virtual/01-catalogo/import-export",

  // ---- Loja: Vendas, Clientes, Financeiro ----
  "03-plataforma-loja-virtual/02-vendas/pedidos",
  "03-plataforma-loja-virtual/03-clientes/clientes",
  "03-plataforma-loja-virtual/04-financeiro-loja/financeiro-loja",

  // ---- Loja: Configurações (estrutura → permissões → operação) ----
  "03-plataforma-loja-virtual/05-configuracoes-loja/lojas-cds",
  "03-plataforma-loja-virtual/05-configuracoes-loja/usuarios-grupos",
  "03-plataforma-loja-virtual/05-configuracoes-loja/fretes",
  "03-plataforma-loja-virtual/05-configuracoes-loja/pagamentos",

  // ---- Loja: Relatórios ----
  "03-plataforma-loja-virtual/06-relatorios-loja/relatorios-loja",

  // ---- CD: acessar → liberar → estocar → faturar → vender → go-live ----
  "04-plataforma-cd/01-acesso-configuracao-inicial",
  "04-plataforma-cd/02-produtos-disponibilidade/vinculo-categoria-produto-cd",
  "04-plataforma-cd/03-gestao-estoque-cd/remessa-industria",
  "04-plataforma-cd/03-gestao-estoque-cd/compra-direta-cd",
  "04-plataforma-cd/04-financeiro-cd/saldo-bonus-compras",
  "04-plataforma-cd/04-financeiro-cd/solicitacao-saque-cd",
  "04-plataforma-cd/05-pedidos-retirada/fluxo-compra-distribuidor",
  "04-plataforma-cd/06-usuarios-relatorios-cd/usuarios-relatorios-cd",
  "04-plataforma-cd/07-go-live-checklist/reset-teste-producao",

  // ---- Guias Rápidos ----
  "05-guias-rapidos/criar-cd-passo-a-passo",
  "05-guias-rapidos/cadastrar-produto-liberar-cd",
  "05-guias-rapidos/fluxo-saque-cd",

  // ---- Referência Técnica ----
  "06-referencia-tecnica/urls-completas-por-modulo",
  "06-referencia-tecnica/matriz-permissoes-por-papel",

  // ---- Anexos ----
  "07-anexos/mapeamento-treinamento-telas",
];

const LEARN_INDEX: Record<string, number> = Object.fromEntries(
  LEARN_ORDER.map((p, i) => [p, i]),
);

/** Humaniza título de pasta: "01-visao-geral" → "Visão Geral", "maxnivel" → "Maxnível" */
export function humanizeFolder(title: string): string {
  const specials: Record<string, string> = {
    maxnivel: "Maxnível",
    loja: "Loja",
    cd: "CD",
  };
  const cleaned = title.replace(/^\d+-/, "");
  return cleaned
    .split(/[-_]/)
    .map((w) => specials[w] ?? w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

/** Ordena: docs da sequência didática primeiro (na ordem), o resto alfabético. */
function compareLearn(a: string, b: string): number {
  const ia = LEARN_INDEX[a];
  const ib = LEARN_INDEX[b];
  if (ia !== undefined && ib !== undefined) return ia - ib;
  if (ia !== undefined) return -1;
  if (ib !== undefined) return 1;
  return a.localeCompare(b);
}

export interface DocNode {
  /** Caminho sem extensão, relativo a docs/ (ex: "01-visao-geral/arquitetura-sistema") */
  path: string;
  title: string;
  children?: DocNode[];
}

/** Extrai o título do frontmatter (`title: X`) ou do primeiro `# X` */
function extractTitle(raw: string, fallback: string): string {
  const fm = raw.match(/^---\s*\n(?:.|\n)*?title:\s*(.+)\s*\n(?:.|\n)*?---/);
  if (fm?.[1]) return fm[1].replace(/["']/g, "").trim();
  const h1 = raw.match(/^#\s+(.+)$/m);
  if (h1?.[1]) return h1[1].replace(/[*_`]/g, "").trim();
  return fallback
    .replace(/-/g, " ")
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

/** Lista plana: { path, title } para todos os docs incluídos */
export const docPages: { path: string; title: string; raw: string }[] =
  Object.entries(modules)
    .map(([key, raw]) => {
      const path = key
        .replace("../../docs/", "")
        .replace(/\.md$/, "");
      return { path, raw };
    })
    .filter((d) => {
      if (EXCLUDE_FILES.includes(d.path)) return false;
      return !EXCLUDE_PREFIXES.some((p) => d.path.startsWith(p));
    })
    .map((d) => ({
      path: d.path,
      title: extractTitle(d.raw, d.path.split("/").pop() ?? d.path),
      raw: d.raw,
    }))
    .sort((a, b) => compareLearn(a.path, b.path));

/** Conteúdo bruto por path (para o viewer) */
export const docByPath: Record<string, string> = Object.fromEntries(
  docPages.map((d) => [d.path, d.raw]),
);

/** Árvore de navegação agrupada por pasta (prefixos numéricos ordenam) */
export function buildSidebarTree(): DocNode[] {
  const root: DocNode[] = [];

  for (const { path, title } of docPages) {
    const segments = path.split("/");
    let level = root;
    for (let i = 0; i < segments.length; i++) {
      const isLeaf = i === segments.length - 1;
      const label = isLeaf ? title : segments[i];
      const found = level.find((n) => n.title === label);
      if (isLeaf) {
        if (!found) level.push({ path, title: label });
      } else {
        if (found) {
          level = found.children ??= [];
        } else {
          const node: DocNode = { path: segments.slice(0, i + 1).join("/"), title: label, children: [] };
          level.push(node);
          level = node.children!;
        }
      }
    }
  }
  return root;
}

/** Título do doc + seção pai (para breadcrumb) */
export function getDocMeta(path?: string): { title: string; section: string; raw?: string } | null {
  if (!path) return null;
  const raw = docByPath[path];
  if (raw === undefined) return null;
  const title = extractTitle(raw, path.split("/").pop() ?? path);
  const section = path.includes("/") ? path.split("/")[0] : "Documentação";
  return { title, section, raw };
}