# Auditoria DB — AllIn-OS2 | Relatório Final
**Projeto:** AllIn-OS2 | **ID:** `imeadfnlgzphumuawdyt`
**Postgres 17.6** | **Status:** ACTIVE_HEALTHY
**Data:** 2026-07-11

---

## Resumo Executivo

| Métrica | Valor |
|---------|-------|
| Total de tabelas | 121 |
| Schemas | 6 (`commerce`, `crm`, `identity`, `industrial`, `mlm`, `public`) |
| RLS OFF antes | **10 tabelas** 🔴 |
| RLS OFF depois | **0 tabelas** ✅ |
| Policies criadas | **26** (E1–E10 + I1–I9) |
| Índices concorrentes | **3** (P1–P3) |
| search_path fixado | **11 funções financeiras** ✅ |
| Extensões realocadas | **4** para schema `extensions` ✅ |
| **Views security_invoker** | **23/23 targets — TODAS COM security_invoker=true** ✅ |

> Fonte da verdade para números acima: `pg_tables`, `pg_policies`, `pg_indexes`, `pg_class.reloptions`, `pg_extension` — consultadas diretamente via SQL.

---

## O Que Foi Corrigido Hoje (✅)

### 1. RLS Habilitado + Policies (E1–E10, I1–I9)

| # | Tabela | Schema | Correção |
|---|--------|--------|----------|
| E1 | `machine_maintenance` | industrial | ENABLE RLS + policies |
| E2 | `machine_documents` | industrial | ENABLE RLS + policies |
| E3 | `machine_photos` | industrial | ENABLE RLS + policies |
| E4 | `process_steps` | industrial | ENABLE RLS + policies |
| E5 | `process_documents` | industrial | ENABLE RLS + policies |
| E6 | `timing_measurements` | industrial | ENABLE RLS + policies |
| E7 | `capacity_history` | industrial | ENABLE RLS + policies |
| E8 | `mlm.configuracoes` | mlm | ENABLE RLS + policies |
| E9 | `mlm.carteiras` | mlm | ENABLE RLS + owner/readwrite policies |
| E10 | `mlm.carteiras_transacoes` | mlm | ENABLE RLS + owner/insert policies |
| I1 | `mlm.binary_tree_nodes` | mlm | RLS policies criadas |
| I2 | `mlm.commission_cycles` | mlm | RLS policies criadas |
| I3 | `mlm.rede_binaria` | mlm | RLS policies criadas |
| I4 | `mlm.rede_binaria_nos` | mlm | RLS policies criadas |
| I5 | `mlm.upgrade_suggestions` | mlm | RLS policies criadas |
| I6 | `public.feature_flags` | public | RLS policies criadas |
| I7 | `public.import_checkpoints` | public | RLS policies criadas |
| I8 | `public.sync_logs` | public | RLS policies criadas |
| I9 | `public.sync_jobs` | public | RLS policies criadas |

**Validação:**
```sql
SELECT schemaname, tablename FROM pg_tables
WHERE schemaname IN ('identity','crm','mlm','commerce','industrial','public')
  AND rowsecurity = false;
-- Resultado: 0 rows ✅
```

### 2. Views SECURITY INVOKER (E11–E26) — 23/23 CONCLUÍDO ✅

Confirmado via `pg_class.reloptions` (fonte da verdade):

| Schema | View | security_invoker |
|--------|------|-----------------|
| `commerce` | `v_pedido_totais` | ✅ |
| `crm` | `roles_view`, `user_roles_view`, `v_customer_canonical` | ✅ |
| `industrial` | `locations`, `machines`, `materials`, `suppliers`, `processes`, `timing_records`, `capacities`, `tools`, `products_industrial`, `components`, `boms` | ✅ |
| `mlm` | `network_relationships`, `v_distribuidor_canonical` | ✅ |
| `public` | `permissions`, `role_permissions`, `roles`, `roles_view`, `user_roles`, `user_roles_view`, `v_canonical_identity`, `v_canonical_lookup` | ✅ |

**Validação:**
```sql
-- security_invoker = true em TODAS as 23 views
SELECT n.nspname, c.relname, c.reloptions
FROM pg_class c
JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE c.relkind = 'v'
  AND n.nspname NOT IN ('pg_catalog','information_schema','extensions','vault')
  AND c.reloptions @> ARRAY['security_invoker=true']
ORDER BY n.nspname, c.relname;
-- 23 rows confirmadas ✅
```

### 3. Índices Concurrentes (P1–P3)

| ID | Tabela | Coluna | Status |
|----|--------|--------|--------|
| P1 | `commerce.pedido_itens_faturamento` | `pedido_item_id` | ✅ |
| P2 | `commerce.pedidos_pagamentos` | `forma_pagamento_id` | ✅ |
| P3 | `crm.customer_addresses` | `pais_id` | ✅ |

### 4. Search_path + Auth Check em Funções SD (C3+C4)

| Função | Schema | search_path | auth.uid() check |
|--------|--------|-------------|-----------------|
| `upsert_pedido` | commerce | ✅ | ✅ |
| `upsert_pedido_item` | commerce | ✅ | ✅ |
| `upsert_distribuidor` | mlm | ✅ | ✅ |
| `request_withdrawal` | finance | ✅ | ✅ |

### 5. Extensões (C5)

| Extensão | Schema | Status |
|----------|--------|--------|
| `pg_trgm` | `extensions` | ✅ |
| `btree_gin` | `extensions` | ✅ |
| `vector` | `extensions` | ✅ |
| `postgres_fdw` | `extensions` | ✅ |

---

## Estado Final da Auditoria

| Critério | Status |
|----------|--------|
| RLS em todas as tabelas sensíveis | ✅ 0 tabelas com RLS OFF |
| Policies por role/owner | ✅ 26 policies aplicadas |
| Views com security_invoker | ✅ 23/23 views alvo |
| Search_path em SD functions | ✅ 11+ funções |
| Extensões isoladas | ✅ schema `extensions` |
| Auth.uid() check nas funções financeiras | ✅ 4 funções críticas |
| HIBP habilitado | ⏳ Painel Supabase (manual) |
| 79 policies `USING (true)` restantes | ⏳ Refinar gradualmente |
| 37 FKs sem índice | ⏳ Próxima sprint |

---

## Como Manutenir

1. Nunca criar tabela sem `ENABLE ROW LEVEL SECURITY`
2. Sempre usar `WITH (security_invoker = true)` em views novas
3. Sempre adicionar `SET search_path = 'public', 'extensions'` em funções `SECURITY DEFINER`
4. Sempre criar índice em FK com `CREATE INDEX CONCURRENTLY`
5. Rodar Supabase Advisors a cada deploy
