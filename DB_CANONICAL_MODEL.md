# DB_CANONICAL_MODEL.md

**AllIn-OS2 — Canonização do Banco de Dados**
Data: 2026-07-07 (atualizado DB-04)
Projeto: AllIn-OS2 (id: imeadfnlgzphumuawdyt)

---

## 1. INVENTÁRIO COMPLETO

### 1.1 Schemas do Sistema (SISTEMA)

| Schema | Descrição | Status |
|--------|-----------|--------|
| `auth` | Autenticação Supabase | SISTEMA |
| `storage` | Armazenamento de arquivos | SISTEMA |
| `realtime` | Mensagens em tempo real | SISTEMA |
| `vault` | Segredos criptografados | SISTEMA |
| `supabase_migrations` | Histórico de migrations | SISTEMA |
| `extensions` | Extensões PostgreSQL | SISTEMA |
| `pg_catalog` | Catálogo do PostgreSQL | SISTEMA |

### 1.2 Schemas de Negócio (NEGÓCIO)

| Schema | Domínio | Status | Exposto PostgREST | RLS | Tabelas |
|--------|---------|--------|-------------------|-----|---------|
| `commerce` | E-commerce, pedidos, produtos | **CANÔNICO** | ✅ | ✅ | 12 |
| `crm` | Clientes e relacionamento | **CANÔNICO** | ✅ | ✅ | 2 |
| `finance` | Financeiro, saques | **CANÔNICO** | ✅ | ✅ | 2 |
| `identity` | Papéis e permissões | **CANÔNICO** | ✅ | ✅ | 5 |
| `industrial` | Operações industriais | **CANÔNICO** | ✅ DB-04 | ✅ | 47 |
| `location` | Dados geográficos | **CANÔNICO** | ✅ | ✅ | 5 |
| `logistics` | Logística, transportadoras | **CANÔNICO** | ✅ | ✅ | 1 |
| `mlm` | Marketing multinível | **CANÔNICO** | ✅ | ✅ | 11 |
| `system` | Dados de referência do sistema | **CANÔNICO** | ✅ | ✅ | 5 |
| `public` | **REMANESCENTE** — 1 tabela de configuração | **LIMPO** | ❌ | ✅ | 1 |

### 1.3 Tabelas no Schema `public`

| Tabela | Registros | Motivo |
|--------|-----------|--------|
| `module_configurations` | 23 | **Mantida** — Configurações ativas de módulos |

## 2. MIGRATIONS APLICADAS

### DB-01 — Auditoria (2026-07-07)
- Identificou 9 schemas de negócio
- Identificou 11 tabelas legacy no schema public
- Identificou 7 tabelas copilot duplicadas no schema public
- Criou inventário de 15+ tabelas duplicadas

### DB-02 — Limpeza Legacy (2026-07-07)

**Migração de dados (4 tabelas):**

| Tabela Legacy (public) | → Schema Canônico | Registros | Status |
|------------------------|-------------------|-----------|--------|
| `materias_primas` | `industrial.materiais` | 3 | ✅ Migrado |
| `empresas` | `industrial.empresa` | 15 | ✅ Migrado |
| `pedidos` | `commerce.pedidos` | 1 | ✅ Migrado |
| `order_items` | `commerce.pedidos_itens` | 1 | ✅ Migrado |

**Remoção de tabelas (22 tabelas):**

| Grupo | Tabelas Removidas |
|-------|-------------------|
| Copilot (7) | `copilot_conversations`, `copilot_messages`, `copilot_context_snapshots`, `copilot_events`, `copilot_insights`, `copilot_kpis`, `copilot_memory` |
| Legacy (15) | `pedidos`, `planos`, `empresas`, `materias_primas`, `order_items`, `payment_attempts`, `capacidades`, `custos_producao_real`, `rastreabilidade_lotes`, `fornecedor_materias_primas`, `pedidos_compra`, `itens_pedido_compra`, `contas_pagar`, `contas_receber` |

### DB-03 — Consolidação Industrial (2026-07-07)

1. ✅ `public.pedidos_compra` ↔ `industrial.pedidos_compra` — público removido (DB-02)
2. ✅ `public.itens_pedido_compra` ↔ `industrial.itens_pedido_compra` — público removido (DB-02)
3. ✅ Nomenclatura: `bom`, `wip`, `mrp`, `pcp` são abreviaturas industriais padrão — **MANTER**
4. ⚠️ `industrial.pedidos` — 0 registros, estrutura diferente de `commerce.pedidos`. **Recomendação:** investigar antes de remover
5. ⚠️ `module_configurations` — mantida em public (23 configs ativas), sem schema destino claro

**Status DB-03:** Documentado, aguardando decisão sobre `industrial.pedidos`.

### DB-04 — Exposição PostgREST (2026-07-07)

1. ✅ **industrial exposto ao PostgREST** — GRANT USAGE adicionado (migration 069)
2. ✅ **RLS verificado** — todos os 9 schemas de negócio têm RLS habilitado
3. ✅ **Políticas RLS aplicadas** — 8 tabelas copilot em industrial sem políticas foram corrigidas (migration 070)
4. ✅ **Todos schemas com políticas** — service_role + authenticated para todos

**Nota:** O arquivo `067_expose_schemas_to_postgrest.sql` foi atualizado para incluir `industrial`.

---

## 3. MAPA DOS DOMÍNIOS

### DOMÍNIO: COMMERCE (E-commerce)

**Schema:** `commerce`  
**Fonte da Verdade para:** Pedidos, Produtos, Carrinho, Pagamentos

| Tabela | Tipo | Status | Descrição |
|--------|------|--------|-----------|
| `produtos` | table | **CANÔNICO** | Catálogo de produtos e-commerce |
| `produtos_categorias` | table | **CANÔNICO** | Categorias de produtos |
| `produtos_opcoes` | table | **CANÔNICO** | Opções configuráveis de produtos |
| `produtos_campos_opcoes` | table | **CANÔNICO** | Campos das opções |
| `pedidos` | table | **CANÔNICO** | Pedidos e-commerce |
| `pedidos_itens` | table | **CANÔNICO** | Itens dos pedidos |
| `pedidos_pagamentos` | table | **CANÔNICO** | Pagamentos dos pedidos |
| `pedidos_saldos` | table | **CANÔNICO** | Saldos financeiros dos pedidos |
| `pedidos_status` | table | **CANÔNICO** | Status dos pedidos |
| `formas_pagamento` | table | **CANÔNICO** | Formas de pagamento |
| `tipos_campo_pedido` | table | **CANÔNICO** | Tipos de campo personalizado |
| `cart_items` | table | **CANÔNICO** | Itens do carrinho |

**Triggers:**
- `trigger_processar_pedido_aprovado` → `processar_pedido_aprovado`

---

### DOMÍNIO: CRM (Cliente e Relacionamento)

**Schema:** `crm`  
**Fonte da Verdade para:** Clientes e distribuidores

| Tabela | Tipo | Status | Descrição |
|--------|------|--------|-----------|
| `customers` | table | **CANÔNICO** | Base de clientes |
| `customer_distributor` | table | **CANÔNICO** | Relação cliente-distribuidor |
| `roles_view` | view | **CANÔNICO** | Visão de papéis (para RLS) |
| `user_roles_view` | view | **CANÔNICO** | Visão de papéis do usuário |

---

### DOMÍNIO: FINANCE (Financeiro)

**Schema:** `finance`  
**Fonte da Verdade para:** Solicitações de saque

| Tabela | Tipo | Status | Descrição |
|--------|------|--------|-----------|
| `solicitacoes_saque` | table | **CANÔNICO** | Solicitações de saque de distribuidores |
| `solicitacoes_saque_cd` | table | **CANÔNICO** | Solicitações de saque de centro de distribuição |

---

### DOMÍNIO: IDENTITY (Autenticação e Autorização)

**Schema:** `identity`  
**Fonte da Verdade para:** Papéis e permissões

| Tabela | Tipo | Status | Descrição |
|--------|------|--------|-----------|
| `roles` | table | **CANÔNICO** | Papéis do sistema |
| `permissions` | table | **CANÔNICO** | Permissões individuais |
| `role_permissions` | table | **CANÔNICO** | Relação papel-permissão |
| `user_roles` | table | **CANÔNICO** | Relação usuário-papel |
| `referral_tracking` | table | **CANÔNICO** | Rastreamento de indicações |

---

### DOMÍNIO: INDUSTRIAL (Operações Industriais)

**Schema:** `industrial`  
**Fonte da Verdade para:** Manuafatura, PCP, Estoque Industrial

| Tabela | Tipo | Status | Descrição |
|--------|------|--------|-----------|
| `empresa` | table | **CANÔNICO** | Cadastro de empresas |
| `fornecedores` | table | **CANÔNICO** | Fornecedores industriais |
| `materiais` | table | **CANÔNICO** | Matérias-primas e componentes |
| `componentes` | table | **CANÔNICO** | Componentes de manufacturing |
| `produtos` | table | **CANÔNICO** | Produtos industriais (BOM) |
| `maquinas` | table | **CANÔNICO** | Máquinas e equipamentos |
| `funcionarios` | table | **CANÔNICO** | Funcionários |
| `processo` | table | **CANÔNICO** | Processos de manufatura |
| `setores` | table | **CANÔNICO** | Setores/departamentos |
| `localizacoes` | table | **CANÔNICO** | Localizações/almoxarifados |
| `equipamentos` | table | **CANÔNICO** | Equipamentos |
| `ferramentas` | table | **CANÔNICO** | Ferramentas |
| `ordem_producao` | table | **CANÔNICO** | Ordens de produção |
| `planos_producao` | table | **CANÔNICO** | Planos de produção |
| `planos_producao_itens` | table | **CANÔNICO** | Itens do plano de produção |
| `bom` | table | **CANÔNICO** | Bill of Materials |
| `capacidade` | table | **CANÔNICO** | Capacidade de máquinas |
| `apontamentos` | table | **CANÔNICO** | Apontamentos de produção |
| `movimentacoes` | table | **CANÔNICO** | Movimentações de estoque |
| `estoque_industrial` | table | **CANÔNICO** | Estoque de materiais/componentes |
| `pedidos_compra` | table | **CANÔNICO** | Pedidos de compra industriais |
| `itens_pedido_compra` | table | **CANÔNICO** | Itens dos pedidos de compra |
| `cronometragem` | table | **CANÔNICO** | Tempos de produção |
| `qualidade` | table | **CANÔNICO** | Registros de qualidade |
| `checklists_inspecao` | table | **CANÔNICO** | Checklists de inspeção |
| `nao_conformidades` | table | **CANÔNICO** | Não-conformidades |
| `retrabalhos` | table | **CANÔNICO** | Registros de retrabalho |
| `paradas` | table | **CANÔNICO** | Paradas de equipamentos |
| `custos_mao_obra` | table | **CANÔNICO** | Custos de mão de obra |
| `custos_equipamentos` | table | **CANÔNICO** | Custos de equipamentos |
| `mrp` | table | **CANÔNICO** | MRP (Material Requirements Planning) |
| `pcp` | table | **CANÔNICO** | PCP (Planejamento e Controle da Produção) |
| `wip` | table | **CANÔNICO** | Work in Progress |
| `lote` | table | **CANÔNICO** | Lotes de produção |
| `rastreabilidade_lotes` | table | **CANÔNICO** | Rastreabilidade por lote |
| `midia` | table | **CANÔNICO** | Mídia/arquivos |
| `slides` | table | **CANÔNICO** | Apresentações/slides |
| `apresentacoes` | table | **CANÔNICO** | Apresentações |
| `categorias_apresentacoes` | table | **CANÔNICO** | Categorias de apresentações |
| `producao_tempo_real` | table | **CANÔNICO** | Dados de produção em tempo real |
| `copilot_conversations` | table | **CANÔNICO** | Conversas do copilot |
| `copilot_messages` | table | **CANÔNICO** | Mensagens do copilot |
| `copilot_context_snapshots` | table | **CANÔNICO** | Snapshots de contexto |
| `copilot_events` | table | **CANÔNICO** | Eventos do copilot |
| `copilot_insights` | table | **CANÔNICO** | Insights gerados |
| `copilot_kpis` | table | **CANÔNICO** | KPIs do copilot |
| `copilot_memory` | table | **CANÔNICO** | Memória do copilot |

**Triggers:**
- `trigger_atualizar_saldo_estoque` → `atualizar_saldo_estoque`

---

### DOMÍNIO: LOCATION (Geografia)

**Schema:** `location`  
**Fonte da Verdade para:** Dados geográficos

| Tabela | Tipo | Status | Descrição |
|--------|------|--------|-----------|
| `paises` | table | **CANÔNICO** | Países |
| `estados` | table | **CANÔNICO** | Estados |
| `cidades` | table | **CANÔNICO** | Cidades |
| `cep` | table | **CANÔNICO** | CEPs |
| `estados_civil` | table | **CANÔNICO** | Estados civis |

---

### DOMÍNIO: LOGISTICS (Logística)

**Schema:** `logistics`  
**Fonte da Verdade para:** Transportadoras

| Tabela | Tipo | Status | Descrição |
|--------|------|--------|-----------|
| `transportadoras` | table | **CANÔNICO** | Transportadoras |

---

### DOMÍNIO: MLM (Marketing Multinível)

**Schema:** `mlm`  
**Fonte da Verdade para:** Rede de distribuidores, comissões, planos

| Tabela | Tipo | Status | Descrição |
|--------|------|--------|-----------|
| `distribuidores` | table | **CANÔNICO** | Rede de distribuidores |
| `rede_linear_nos` | table | **CANÔNICO** | Nós da rede linear |
| `planos` | table | **CANÔNICO** | Planos de associação |
| `planos_distribuidores` | table | **CANÔNICO** | Planos por distribuidor |
| `bonus_regras` | table | **CANÔNICO** | Regras de bônus |
| `bonus_historico` | table | **CANÔNICO** | Histórico de bônus |
| `comissoes` | table | **CANÔNICO** | Comissões geradas |
| `pontos_saldo` | table | **CANÔNICO** | Saldo de pontos |
| `pontos_transacoes` | table | **CANÔNICO** | Transações de pontos |
| `qualificacoes` | table | **CANÔNICO** | Qualificações |
| `qualificacoes_historico` | table | **CANÔNICO** | Histórico de qualificações |
| `distribuidor_conta_bancaria` | table | **CANÔNICO** | Contas bancárias |

**Triggers:**
- `trigger_atualizar_rede_linear` → `atualizar_rede_linear`
- `trigger_registrar_bonus_historico` → `registrar_bonus_historico`

---

### DOMÍNIO: SYSTEM (Sistema)

**Schema:** `system`  
**Fonte da Verdade para:** Dados de referência

| Tabela | Tipo | Status | Descrição |
|--------|------|--------|-----------|
| `lojas` | table | **CANÔNICO** | Lojas |
| `fabricantes` | table | **CANÔNICO** | Fabricantes |
| `linguagens` | table | **CANÔNICO** | Línguas/idiomas |
| `tipos_pessoa` | table | **CANÔNICO** | Tipos de pessoa (Física/Jurídica) |
| `embeddings` | table | **CANÔNICO** | Embeddings vetoriais |

---

## 5. MATRIZ DE DUPLICIDADES

### ⚠️ DUPLICADOS IDENTIFICADOS

| Entidade | Tabelas Encontradas | Status | Ação Necessária |
|----------|---------------------|--------|-----------------|
| **Pedido** | `commerce.pedidos` + `public.pedidos` | `public.pedidos` = **LEGADO** | Migrar dados e remover `public.pedidos` |
| **Plano** | `mlm.planos` + `public.planos` | `public.planos` = **LEGADO** | Migrar dados e remover `public.planos` |
| **Pedido Compra** | `industrial.pedidos_compra` + `public.pedidos_compra` | Ambos existem com estruturas diferentes | Analisar e consolidar |
| **Matéria Prima** | `industrial.materiais` + `public.materias_primas` | São schemas diferentes da mesma entidade | Analisar e consolidar |
| **Itens Pedido Compra** | `industrial.itens_pedido_compra` + `public.itens_pedido_compra` | Ambos existem com estruturas diferentes | Analisar e consolidar |
| **Rastreabilidade Lotes** | `industrial.rastreabilidade_lotes` + `public.rastreabilidade_lotes` | Ambos existem | Analisar e consolidar |
| **Copilot Tables** | `industrial.copilot_*` + `public.copilot_*` | **TOTALMENTE DUPLICADO** | Remover `public.copilot_*` |
| **Empresa** | `industrial.empresa` + `public.empresas` | `public.empresas` = **LEGADO** | Remover `public.empresas` |
| **Fornecedor** | `industrial.fornecedores` + `public.fornecedor_materias_primas` | São tabelas diferentes | `public.fornecedor_materias_primas` é relação N:N |

---

## 6. ENTIDADES DUPLICADAS — ANÁLISE DETALHADA

### 4.1 PEDIDO

| Schema | Tabela | PK Type | Status | Linhas |
|--------|--------|---------|--------|--------|
| **commerce** | **pedidos** | UUID | **CANÔNICO** | 0 |
| public | pedidos | UUID | **LEGADO** | 0 |

**Relacionamentos:**
- `commerce.pedidos` → `crm.customers` (cliente_id)
- `commerce.pedidos` → `auth.users` (auth_user_id)
- `commerce.pedidos` → `system.lojas` (loja_id)
- `commerce.pedidos` → `mlm.distribuidores` (distribuidor_comprador_id, distribuidor_indicador_id)

**Migração necessária:** Migrations 038 moveu para `commerce.pedidos` mas não removeu `public.pedidos`.

---

### 4.2 PLANO

| Schema | Tabela | PK Type | Status | Linhas |
|--------|--------|---------|--------|--------|
| **mlm** | **planos** | UUID | **CANÔNICO** | 0 |
| public | planos | UUID | **LEGADO** | 0 |

**Migração necessária:** Migration 037 moveu para `mlm.planos` mas não removeu `public.planos`.

---

### 4.3 COPPERCIAL TABLES (CRÍTICO)

| Entidade | `industrial` | `public` | Status |
|----------|-------------|----------|--------|
| conversations | ✅ | ❌ DUPLICADO | Remover `public.copilot_conversations` |
| messages | ✅ | ❌ DUPLICADO | Remover `public.copilot_messages` |
| context_snapshots | ✅ | ❌ DUPLICADO | Remover `public.copilot_context_snapshots` |
| events | ✅ | ❌ DUPLICADO | Remover `public.copilot_events` |
| insights | ✅ | ❌ DUPLICADO | Remover `public.copilot_insights` |
| kpis | ✅ | ❌ DUPLICADO | Remover `public.copilot_kpis` |
| memory | ✅ | ❌ DUPLICADO | Remover `public.copilot_memory` |

**Ação:** Remover TODAS as tabelas `public.copilot_*` após migração de dados.

---

### 4.4 MATÉRIA PRIMA / MATERIAL

| Schema | Tabela | PK Type | Estrutura |
|--------|--------|---------|-----------|
| **industrial** | **materiais** | UUID | Completa, com FK para fornecedores |
| public | materias_primas | UUID | Simples |

**Análise:** São estruturas diferentes. `industrial.materiais` é mais completa.
**Recomendação:** Manter apenas `industrial.materiais`.

---

### 4.5 PEDIDO DE COMPRA

| Schema | Tabela | PK Type |
|--------|--------|---------|
| **industrial** | **pedidos_compra** | UUID |
| public | pedidos_compra | UUID |

**Análise:** Ambas existem com finalidades similares (compra de materiais).
**Recomendação:** Consolidar em `industrial.pedidos_compra`.

---

### 4.6 OUTROS LEGACY

| Schema | Tabela | Status | Motivo |
|--------|--------|--------|--------|
| public | empresas | **LEGADO** | Substituída por `industrial.empresa` |
| public | order_items | **LEGADO** | Duplicado de `commerce.pedidos_itens` |
| public | payment_attempts | **LEGADO** | Duplicado de `commerce.pedidos_pagamentos` |
| public | module_configurations | **SEM CONSUMIDOR** | Tabela de configuração sem uso aparente |
| public | capacidades | **LEGADO** | Duplicado de `industrial.capacidade` |
| public | contas_pagar | **ÓRFÃO** | Sem schema destino claro |
| public | contas_receber | **ÓRFÃO** | Sem schema destino claro |
| public | custos_producao_real | **LEGADO** | Duplicado de `industrial.custos_*` |
| public | rastreabilidade_lotes | **LEGADO** | Duplicado de `industrial.rastreabilidade_lotes` |
| public | fornecedor_materias_primas | **ANÁLISE** | Tabela de relação N:N - pode ser necessária |

---

## 7. ESTRUTURA DE PRIMARY KEYS

### ✅ CONSISTENTE: Todas as tabelas usam UUID

| Schema | Exemplo de Tabela | PK Type |
|--------|-------------------|---------|
| commerce | pedidos | UUID |
| crm | customers | UUID |
| finance | solicitacoes_saque | UUID |
| identity | roles | UUID |
| industrial | todos | UUID |
| location | paises | UUID |
| logistics | transportadoras | UUID |
| mlm | distribuidores | UUID |
| system | lojas | UUID |

**Sem inconsistências de tipos UUID vs BIGINT.**

---

## 8. RELACIONAMENTOS INTER-SCHEMAS

### PrincipaisFKs Entre Schemas

```
auth.users
    │
    ├──→ commerce.pedidos (auth_user_id)
    ├──→ commerce.cart_items (user_id)
    ├──→ crm.customers (auth_user_id)
    ├──→ mlm.distribuidores (auth_user_id)
    └──→ identity.user_roles (user_id)

crm.customers (CANÔNICO)
    ├──→ commerce.pedidos (cliente_id)
    └──→ commerce.pedidos_saldos (cliente_id)

mlm.distribuidores (CANÔNICO)
    ├──→ commerce.pedidos (distribuidor_comprador_id, distribuidor_indicador_id)
    ├──→ finance.solicitacoes_saque (distribuidor_id)
    └──→ finance.solicitacoes_saque_cd (cd_id)

commerce.pedidos (CANÔNICO)
    └──→ mlm.comissoes (pedido_id)

system.lojas (CANÔNICO)
    ├──→ commerce.pedidos (loja_id)
    └──→ logistics.transportadoras (loja_id)

location.estados/cidades/paises (CANÔNICO)
    ├──→ system.lojas (uf_id, cidade_id)
    └──→ location.cep (uf_id, pais_id, cidade_id)
```

---

## 9. TABELAS ÓRFÃS

### Identificadas como ÓRFÃS ou SEM CONSUMIDOR

| Tabela | Schema | Status | Observação |
|--------|--------|--------|------------|
| `module_configurations` | public | **SEM CONSUMIDOR** | Tabela de configuração sem uso |
| `capacidades` | public | **LEGADO** | Duplicado de `industrial.capacidade` |
| `contas_pagar` | public | **ÓRFÃO** | Sem FK definida corretamente |
| `contas_receber` | public | **ÓRFÃO** | Sem FK definida corretamente |
| `payment_attempts` | public | **LEGADO** | Duplicado de `commerce.pedidos_pagamentos` |

---

## 10. INCONSISTÊNCIAS ESTRUTURAIS

### 8.1 Nomenclatura Mista

| Domínio | Uso em Table Names |
|---------|-------------------|
| **Português** | commerce.pedidos, mlm.distribuidores, industrial.materiais |
| **Inglês** | industrial.products, industrial.machines, industrial.processes |

**Inconsistência:** O schema `industrial` tem tabelas em português E inglês.

### 8.2 Schemas Duplicados

| Conceito | Schema Original | Schema Industrial |
|----------|----------------|-------------------|
| Pedidos | commerce.pedidos | industrial.pedidos (mesmo nome!) |
| Pedidos Compra | - | industrial.pedidos_compra |
| Materiais | - | industrial.materiais |
| Fornecedores | - | industrial.fornecedores |

---

## 11. CLASSIFICAÇÃO FINAL DE CADA OBJETO

### Status Possible:

- **CANÔNICO** — Objeto válido, fonte da verdade
- **LEGADO** — Objeto antigo, deve ser removido após migração
- **DUPLICADO** — Existe em mais de um schema
- **ÓRFÃO** — Sem consumidores conhecidos
- **SEM CONSUMIDOR** — Existe mas não é utilizado
- **SISTEMA** — Objeto interno do Supabase
- **MIGRAÇÃO PARCIAL** — Schema em processo de reorganização

---

### Tabelas por Status

#### ✅ CANÔNICO (96 objetos)

**commerce (12):** produtos, produtos_categorias, produtos_opcoes, produtos_campos_opcoes, pedidos, pedidos_itens, pedidos_pagamentos, pedidos_saldos, pedidos_status, formas_pagamento, tipos_campo_pedido, cart_items

**crm (2):** customers, customer_distributor

**finance (2):** solicitacoes_saque, solicitacoes_saque_cd

**identity (5):** roles, permissions, role_permissions, user_roles, referral_tracking

**industrial (47):** empresa, fornecedores, materiais, componentes, produtos, maquinas, funcionarios, processo, setores, localizacoes, equipamentos, ferramentas, ordem_producao, planos_producao, planos_producao_itens, bom, capacidade, apontamentos, movimentacoes, estoque_industrial, pedidos_compra, itens_pedido_compra, cronometragem, qualidade, checklists_inspecao, nao_conformidades, retrabalhos, paradas, custos_mao_obra, custos_equipamentos, mrp, pcp, wip, lote, rastreabilidade_lotes, midia, slides, apresentacoes, categorias_apresentacoes, producao_tempo_real, copilot_conversations, copilot_messages, copilot_context_snapshots, copilot_events, copilot_insights, copilot_kpis, copilot_memory

**location (5):** paises, estados, cidades, cep, estados_civil

**logistics (1):** transportadoras

**mlm (12):** distribuidores, rede_linear_nos, planos, planos_distribuidores, bonus_regras, bonus_historico, comissoes, pontos_saldo, pontos_transacoes, qualificacoes, qualificacoes_historico, distribuidor_conta_bancaria

**system (5):** lojas, fabricantes, linguagens, tipos_pessoa, embeddings

**extensions (3):** pg_stat_statements, pg_stat_statements_info, extensions

#### ⚠️ LEGADO (11 objetos)

**public:** pedidos, planos, empresas, order_items, payment_attempts, capacidades, rastreabilidade_lotes, materias_primas, custos_producao_real, fornecedor_materias_primas

#### 🔄 MIGRAÇÃO PARCIAL (1 schema)

**public:** Schema com objetos legacy e copilot duplicados

#### ❌ SEM CONSUMIDOR (1 objeto)

**public:** module_configurations

#### 🗑️ SISTEMA (não alterar)

**auth:** Todas as tabelas internas do Supabase  
**storage:** buckets, objects, etc.  
**realtime:** messages_*, subscription  
**vault:** secrets  
**supabase_migrations:** schema_migrations

---

## 12. FONTE DA VERDADE POR ENTIDADE DE NEGÓCIO

| Entidade | Fonte da Verdade | Legacy/Duplicado |
|----------|------------------|------------------|
| Cliente | `crm.customers` | - |
| Pedido E-commerce | `commerce.pedidos` | `public.pedidos` ❌ |
| Pedido Industrial | `industrial.pedidos` | - |
| Produto E-commerce | `commerce.produtos` | - |
| Produto Industrial | `industrial.produtos` | - |
| Material | `industrial.materiais` | `public.materias_primas` ❌ |
| Fornecedor | `industrial.fornecedores` | - |
| Plano MLM | `mlm.planos` | `public.planos` ❌ |
| Distribuidor | `mlm.distribuidores` | - |
| Rede | `mlm.rede_linear_nos` | - |
| Comissão | `mlm.comissoes` | - |
| Ponto | `mlm.pontos_saldo` | - |
| Qualificação | `mlm.qualificacoes` | - |
| Saque | `finance.solicitacoes_saque` | - |
| Loja | `system.lojas` | - |
| Estado/Cidade/CEP | `location.estados/cidades/cep` | - |
| Pedido Compra | `industrial.pedidos_compra` | `public.pedidos_compra` ❌ |
| Ordem Produção | `industrial.ordem_producao` | - |
| Estoque | `industrial.estoque_industrial` | - |
| Máquina | `industrial.maquinas` | - |
| Funcionário | `industrial.funcionarios` | - |
| Copilot | `industrial.copilot_*` | `public.copilot_*` ❌ |

---

## 13. ERD SIMPLIFICADO

```
┌─────────────────────────────────────────────────────────────────┐
│                         AUTH (Supabase)                          │
│  users ───────┬────────────────────────────────────────────────│
│               │                                                 │
│    ┌──────────┴──────────┐                                      │
│    ▼                     ▼                                      │
│ crm.customers      mlm.distribuidores                           │
│    │                     │                                       │
│    ▼                     ▼                                       │
│ commerce.pedidos ←──┬──→ commerce.pedidos                       │
│    │                 │      (comprador/indicador)                │
│    ▼                 ▼                                       │
│ commerce.pedidos_itens                                         │
│    │                                                         │
│    ▼                                                         │
│ commerce.produtos                                              │
│                                                                   │
│                         MLM                                      │
│  distribuidores ──→ planos_distribuidores ──→ mlm.planos        │
│       │                                                        │
│       ├──→ rede_linear_nos                                      │
│       ├──→ pontos_saldo                                        │
│       ├──→ comissoes                                           │
│       ├──→ qualificacoes                                        │
│       └──→ bonus_historico                                      │
│                                                                   │
│                      COMMERCE                                    │
│  pedidos ──→ pedidos_itens ──→ produtos                          │
│     │                                                          │
│     ├──→ pedidos_pagamentos ──→ formas_pagamento                │
│     ├──→ pedidos_saldos                                         │
│     └──→ pedidos_status                                         │
│                                                                   │
│                     INDUSTRIAL                                   │
│  empresa                                                          │
│     │                                                            │
│  fornecedores ──→ materiais ──→ estoque_industrial              │
│     │                   │                   │                  │
│     │                   └──→ consumo_materiais                   │
│     │                                                        │
│  maquinas ──→ capacidade ──→ apontamentos                       │
│     │                   │                   │                  │
│     │                   └──→ cronometragem ──→ producao_tempo_real
│     │                                                        │
│  processo ──→ ordem_producao                                   │
│     │                   │                                      │
│     │                   └──→ planos_producao                   │
│     │                                                        │
│  produtos ──→ bom ──→ componentes                              │
│     │                                                        │
│  equipamentos ──→ custos_equipamentos ──→ paradas             │
│     │                                                        │
│  setores ──→ pcp ──→ mrp ──→ wip                              │
│     │                                                        │
│  funcionarios ──→ custos_mao_obra                              │
│     │                                                        │
│  qualidade ←─── checklists_inspecao                            │
│     │                                                        │
│  nao_conformidades ──→ rastreabilidade_lotes                   │
│                                                                   │
│                    LOCATION                                     │
│  paises ──→ estados ──→ cidades ──→ cep                        │
│                      │                                           │
│                   estados_civil                                 │
│                                                                   │
│                    SYSTEM                                       │
│  lojas ──→ transportadoras (logistics)                          │
│                                                                   │
│                    FINANCE                                      │
│  solicitacoes_saque                                              │
│  solicitacoes_saque_cd                                          │
│                                                                   │
│                   IDENTITY                                      │
│  roles ──→ role_permissions ──→ permissions                      │
│     │                                                        │
│  user_roles                                                     │
└─────────────────────────────────────────────────────────────────┘
```

---

## 14. PRÓXIMAS AÇÕES (Sprints Seguintes)

### ✅ Sprint DB-01 — Auditoria
**Status: COMPLETA** — Identificou 9 schemas, 22+ tabelas legacy, 15+ duplicações.

### ✅ Sprint DB-02 — Limpeza Legacy
**Status: COMPLETA**
- Removidas 22 tabelas do schema public ✅
- Migrados 4 conjuntos de dados (materias_primas, empresas, pedidos, order_items) ✅
- 1 tabela mantida: `module_configurations` (23 configs ativas)

### ✅ Sprint DB-03 — Consolidação Industrial
**Status: DOCUMENTADA**
- Pedidos_compra/itens: público removido (DB-02), industrial permanece
- Nomenclatura industrial: `bom`, `wip`, `mrp`, `pcp` mantidos (abreviaturas padrão)
- ⚠️ Pendente: `industrial.pedidos` (0 registros, investigar antes de remover)
- ⚠️ Pendente: `module_configurations` (sem schema destino claro)

### ✅ Sprint DB-04 — Exposição PostgREST
**Status: COMPLETA**
- Schema `industrial` exposto ao PostgREST ✅
- RLS habilitado em todos os 9 schemas ✅
- 7 políticas RLS adicionadas para tabelas copilot em `industrial` ✅
- Arquivo `067_expose_schemas_to_postgrest.sql` atualizado ✅

### Sprint DB-05 — Próximas Investigações

1. Decidir sobre `industrial.pedidos` (0 registros, estrutura diferente de `commerce.pedidos`)
2. Decidir destino de `module_configurations` (public → system?)
3. Verificar se `public.module_configurations` tem consumidores no código

---

## 15. RESUMO EXECUTIVO (DB-02 + DB-04)

### Métricas Finais

| Métrica | Valor |
|---------|-------|
| Total de Schemas | 15 |
| Schemas de Negócio | 9 |
| Schemas Expostos ao PostgREST | 9/9 ✅ |
| Total de Tabelas | ~94 |
| Tabelas Removidas do public | **22** |
| Tabelas Migradas | **4** (15+1+1+3 registros) |
| Tabelas Legacy em public | **0** ✅ |
| Tabelas em public (remanescente) | **1** (`module_configurations`) |
| Duplicações Identificadas | 15+ |
| Inconsistências de PK | 0 (todos UUID) |

### Status das Tabelas

| Categoria | Antes | Depois |
|-----------|-------|--------|
| Legacy em public | 11 | 0 ✅ |
| Copilot em public | 7 | 0 ✅ |
| Remanescentes em public | - | 1 (`module_configurations`) |

### Status das Sprints DB

| Sprint | Descrição | Status |
|--------|-----------|--------|
| DB-01 | Auditoria do banco | ✅ Completo |
| DB-02 | Limpeza legacy (22 tabelas removidas, 4 migradas) | ✅ Completo |
| DB-03 | Consolidação Industrial (documentado) | ✅ Documentado |
| DB-04 | Exposição PostgREST + RLS | ✅ Completo |

### Pendências Identificadas (DB-03)

1. ⚠️ `industrial.pedidos` — 0 registros, estrutura diferente de `commerce.pedidos`. Investigar antes de remover.
2. ⚠️ `module_configurations` — mantida em public sem schema destino claro.

**Conclusão:** O banco está **limpo e estruturado** com arquitetura de schemas por domínio. Todas as 22 tabelas legacy foram removidas do schema public. Os 9 schemas de negócio estão expostos ao PostgREST com RLS habilitado. A dívida técnica remanescente são 2 itens identificados no DB-03 para decisão.

---

*Documento atualizado via Sprint DB-04 — Canonização do Banco de Dados (2026-07-07)*
*Projeto: AllIn-OS2 (id: imeadfnlgzphumuawdyt)*