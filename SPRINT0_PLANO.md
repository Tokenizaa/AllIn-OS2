# Sprint 0 — Reverse Engineering + Simplification

**Objetivo único:** Transformar um projeto legado em um projeto totalmente compreendido.

**Proibido:** Decisões baseadas em métricas superficiais (ex: "arquivo não tem import").
**Obrigatório:** Rastrear runtime real, dependências dinâmicas, indireções, convenções e registros.

**Escopo:** AllIn-OS2 (TanStack Start + Vite + React + Express + Supabase)

---

## Metodologia: Quatro Etapas

### Etapa A — Descoberta

Inventariar TUDO. Nada é alterado. Nada é julgado.

**Regra:** Todo artefato merece existir até prova em contrário.

**Output:** Catálogo completo de artefatos com localização, tipo e metadados.

---

### Etapa B — Engenharia Reversa

Para cada artefato, descobrir:

| Pergunta | Método |
|----------|--------|
| Quem usa? | grep por imports, referências, strings |
| Quem depende? | Cadeia reversa de dependências |
| Quem chama? | Call graph (funções, hooks, componentes) |
| Quem é chamado? | Parâmetros, callbacks, eventos |
| Fluxo completo? | Entrada → saída, request → response |
| Runtime real? | Código efetivamente executado em produção |
| Rotas de execução? | Caminhos possíveis vs caminhos reais |

**Evidências válidas:**
- Imports estáticos (TypeScript/ESM)
- Barrel exports (`index.ts` que re-exporta)
- Registro/plugin systems (`register()`, `app.use()`, `router.add()`)
- Reflexão (decorators, `Reflect.metadata`)
- Convenção de diretório (Next.js/Remix file-based routing)
- Geração automática de código
- Config files (JSON, YAML, TOML)
- Scripts de build (package.json scripts, Makefile)
- Docker / docker-compose
- Workers / cron
- Edge Functions
- Test files
- Referências dinâmicas (`import()`, `require()`, `new Function()`)
- Variáveis de ambiente que controlam comportamento

**Contra-evidências (não provam morte):**
- ❌ "arquivo não tem import" (pode ser barrel, gen, script, CLI)
- ❌ "componente não aparece no JSX" (pode ser dinâmico, lazy, conditional)
- ❌ "função não é chamada" (pode ser callback, handler, decorator)

---

### Etapa C — Simplificação

Eliminar apenas com evidência suficiente de que o artefato:

1. Não é usado em runtime
2. Não é necessário para build/test/deploy
3. Não faz parte de plano de migração em andamento
4. Não tem substituição planejada

**Categorias:**
- 🗑️ **Remover** — evidência forte de não-uso
- 📦 **Unificar** — duplicação comprovada
- 🛑 **Congelar** — experimental, sem uso, mas pode ser retomado
- ❓ **Investigar** — sem evidência suficiente

---

### Etapa D — Consolidação

Padronizar:
- Arquitetura (rota de dados única)
- Nomenclatura (convenções consistentes)
- Módulos (coesos, com responsabilidade única)
- Exports (barrels conscientes)
- Dependências (circular-free)

---

## Skills a Utilizar

A análise deve carregar automaticamente as skills relevantes conforme necessário:

- `architecture-patterns` — para identificar padrões arquiteturais
- `monorepo-management` — para estrutura do workspace
- `database-architect` — para esquemas e relações
- `supabase` — para RLS, RPCs, triggers, edge functions
- `tanstack-start` — se disponível, para entender o router
- `react-patterns` — para hooks, providers, contexts
- `nodejs-backend-patterns` — para API Express
- `python-patterns` — para scripts de scraping
- `code-refactoring-tech-debt` — se necessário durante simplificação

---

## Artefatos a Investigar (Checklist por Categoria)

- [ ] App Routes / Pages (TanStack Router)
- [ ] Components (React)
- [ ] Hooks (React Query + custom)
- [ ] Providers / Contexts
- [ ] Services (frontend + backend)
- [ ] Repositories
- [ ] DTOs / Types
- [ ] Zod Schemas
- [ ] RPCs (Supabase)
- [ ] Triggers (SQL)
- [ ] Views (SQL)
- [ ] Migrations
- [ ] Policies (RLS)
- [ ] Edge Functions
- [ ] Scripts
- [ ] Workers / Cron
- [ ] CLI tools
- [ ] Tests
- [ ] Docker / docker-compose
- [ ] Configs (Vite, ESLint, TSConfig, PostCSS, Tailwind)
