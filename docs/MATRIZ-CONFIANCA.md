# MATRIZ DE CONFIANÇA - ALLIN OS 2.0

**Data:** 2026-06-15
**Projeto:** imeadfnlgzphumuawdyt
**Objetivo:** Matriz de confiança das entidades do sistema

---

## 1. MATRIZ DE CONFIANÇA

### Entidades Principais

| Entidade | Banco Existe | Backend Usa | Frontend Usa | Status | Observações |
|----------|--------------|-------------|--------------|--------|-------------|
| auth.users | ✅ | ✅ | ✅ | ✅ ATIVO | Supabase Auth |
| identity.roles | ✅ | ✅ | ✅ | ✅ ATIVO | Roles do sistema |
| identity.user_roles | ✅ | ✅ | ✅ | ✅ ATIVO | User roles |
| identity.referral_tracking | ✅ | ✅ | ✅ | ✅ ATIVO | Referral tracking |
| crm.customers | ✅ | ✅ | ✅ | ✅ ATIVO | Customers |
| crm.customer_distributor | ✅ | ❌ | ❌ | ❌ MORTO | Tabela órfã |
| mlm.distribuidores | ✅ | ✅ | ✅ | ✅ ATIVO | Distribuidores |
| mlm.planos | ✅ | ✅ | ✅ | ✅ ATIVO | Planos |
| mlm.comissoes | ✅ | ✅ | ✅ | ✅ ATIVO | Comissões |
| mlm.rede_linear_nos | ✅ | ❌ | ❌ | ❌ MORTO | Tabela órfã |
| mlm.planos_distribuidores | ✅ | ❌ | ❌ | ❌ MORTO | Tabela órfã |
| mlm.bonus_regras | ✅ | ❌ | ❌ | ❌ MORTO | Tabela órfã |
| mlm.pontos_saldo | ✅ | ❌ | ❌ | ❌ MORTO | Tabela órfã |
| mlm.pontos_transacoes | ✅ | ❌ | ❌ | ❌ MORTO | Tabela órfã |
| mlm.qualificacoes | ✅ | ❌ | ❌ | ❌ MORTO | Tabela órfã |
| mlm.bonus_historico | ✅ | ❌ | ❌ | ❌ MORTO | Tabela órfã |
| mlm.qualificacoes_historico | ✅ | ❌ | ❌ | ❌ MORTO | Tabela órfã |
| mlm.distribuidor_conta_bancaria | ✅ | ❌ | ❌ | ❌ MORTO | Tabela órfã |
| mlm.distribuidor_temas | ✅ | ❌ | ❌ | ❌ MORTO | Tabela órfã |
| commerce.produtos | ✅ | ✅ | ✅ | ✅ ATIVO | Produtos |
| commerce.produtos_categorias | ✅ | ❌ | ❌ | ❌ MORTO | Tabela órfã |
| commerce.formas_pagamento | ✅ | ❌ | ❌ | ❌ MORTO | Tabela órfã |
| commerce.pedidos | ✅ | ✅ | ✅ | ✅ ATIVO | Pedidos |
| commerce.pedidos_itens | ✅ | ❌ | ❌ | ❌ MORTO | Tabela órfã |
| commerce.pedidos_pagamentos | ✅ | ❌ | ❌ | ❌ MORTO | Tabela órfã |
| commerce.pedidos_saldos | ✅ | ❌ | ❌ | ❌ MORTO | Tabela órfã |
| commerce.pedidos_status | ✅ | ❌ | ❌ | ❌ MORTO | Tabela órfã |
| commerce.produtos_opcoes | ✅ | ❌ | ❌ | ❌ MORTO | Tabela órfã |
| commerce.produtos_campos_opcoes | ✅ | ❌ | ❌ | ❌ MORTO | Tabela órfã |
| commerce.tipos_campo_pedido | ✅ | ❌ | ❌ | ❌ MORTO | Tabela órfã |
| commerce.cart_items | ✅ | ✅ | ✅ | ✅ ATIVO | Carrinho |
| finance.solicitacoes_saque | ✅ | ✅ | ✅ | ✅ ATIVO | Solicitações de saque |
| finance.solicitacoes_saque_cd | ✅ | ❌ | ❌ | ❌ MORTO | Tabela órfã |
| public.copilot_conversations | ✅ | ✅ | ✅ | ✅ ATIVO | Copilot |
| public.copilot_messages | ✅ | ❌ | ❌ | ❌ MORTO | Tabela órfã |
| public.copilot_context_snapshots | ✅ | ❌ | ❌ | ❌ MORTO | Tabela órfã |
| public.payment_attempts | ✅ | ❌ | ❌ | ❌ MORTO | Tabela órfã |
| public.order_items | ✅ | ✅ | ❌ | ⚠️ PARCIAL | Backend usa, frontend não |
| system.fabricantes | ✅ | ❌ | ❌ | ❌ MORTO | Tabela órfã |
| system.linguagens | ✅ | ❌ | ❌ | ❌ MORTO | Tabela órfã |
| system.lojas | ✅ | ❌ | ❌ | ❌ MORTO | Tabela órfã |
| system.embeddings | ✅ | ❌ | ❌ | ❌ MORTO | Tabela órfã |
| system.tipos_pessoa | ✅ | ❌ | ❌ | ❌ MORTO | Tabela órfã |
| logistics.transportadoras | ✅ | ❌ | ❌ | ❌ MORTO | Tabela órfã |
| industrial.locations | ✅ | ❌ | ❌ | ❌ MORTO | Tabela órfã |
| industrial.suppliers | ✅ | ❌ | ❌ | ❌ MORTO | Tabela órfã |
| industrial.products_industrial | ✅ | ❌ | ❌ | ❌ MORTO | Tabela órfã |
| industrial.components | ✅ | ❌ | ❌ | ❌ MORTO | Tabela órfã |
| industrial.machines | ✅ | ❌ | ❌ | ❌ MORTO | Tabela órfã |
| industrial.materials | ✅ | ❌ | ❌ | ❌ MORTO | Tabela órfã |
| industrial.processes | ✅ | ❌ | ❌ | ❌ MORTO | Tabela órfã |
| industrial.timing_records | ✅ | ❌ | ❌ | ❌ MORTO | Tabela órfã |
| industrial.capacity | ✅ | ❌ | ❌ | ❌ MORTO | Tabela órfã |
| industrial.tools | ✅ | ❌ | ❌ | ❌ MORTO | Tabela órfã |
| industrial.bom | ✅ | ❌ | ❌ | ❌ MORTO | Tabela órfã |

---

## 2. RESUMO POR STATUS

### ✅ ATIVO (12 entidades)

| Entidade | Schema | Backend Usa | Frontend Usa |
|----------|--------|-------------|--------------|
| auth.users | auth | ✅ | ✅ |
| identity.roles | identity | ✅ | ✅ |
| identity.user_roles | identity | ✅ | ✅ |
| identity.referral_tracking | identity | ✅ | ✅ |
| crm.customers | crm | ✅ | ✅ |
| mlm.distribuidores | mlm | ✅ | ✅ |
| mlm.planos | mlm | ✅ | ✅ |
| mlm.comissoes | mlm | ✅ | ✅ |
| commerce.produtos | commerce | ✅ | ✅ |
| commerce.pedidos | commerce | ✅ | ✅ |
| commerce.cart_items | commerce | ✅ | ✅ |
| finance.solicitacoes_saque | finance | ✅ | ✅ |
| public.copilot_conversations | public | ✅ | ✅ |

### ⚠️ PARCIAL (1 entidade)

| Entidade | Schema | Backend Usa | Frontend Usa | Motivo |
|----------|--------|-------------|--------------|--------|
| public.order_items | public | ✅ | ❌ | Backend usa, frontend não |

### ❌ MORTO (34 entidades)

| Entidade | Schema | Motivo |
|----------|--------|--------|
| crm.customer_distributor | crm | Tabela órfã |
| mlm.rede_linear_nos | mlm | Tabela órfã |
| mlm.planos_distribuidores | mlm | Tabela órfã |
| mlm.bonus_regras | mlm | Tabela órfã |
| mlm.pontos_saldo | mlm | Tabela órfã |
| mlm.pontos_transacoes | mlm | Tabela órfã |
| mlm.qualificacoes | mlm | Tabela órfã |
| mlm.bonus_historico | mlm | Tabela órfã |
| mlm.qualificacoes_historico | mlm | Tabela órfã |
| mlm.distribuidor_conta_bancaria | mlm | Tabela órfã |
| mlm.distribuidor_temas | mlm | Tabela órfã |
| commerce.produtos_categorias | commerce | Tabela órfã |
| commerce.formas_pagamento | commerce | Tabela órfã |
| commerce.pedidos_itens | commerce | Tabela órfã |
| commerce.pedidos_pagamentos | commerce | Tabela órfã |
| commerce.pedidos_saldos | commerce | Tabela órfã |
| commerce.pedidos_status | commerce | Tabela órfã |
| commerce.produtos_opcoes | commerce | Tabela órfã |
| commerce.produtos_campos_opcoes | commerce | Tabela órfã |
| commerce.tipos_campo_pedido | commerce | Tabela órfã |
| finance.solicitacoes_saque_cd | finance | Tabela órfã |
| public.copilot_messages | public | Tabela órfã |
| public.copilot_context_snapshots | public | Tabela órfã |
| public.payment_attempts | public | Tabela órfã |
| system.fabricantes | system | Tabela órfã |
| system.linguagens | system | Tabela órfã |
| system.lojas | system | Tabela órfã |
| system.embeddings | system | Tabela órfã |
| system.tipos_pessoa | system | Tabela órfã |
| logistics.transportadoras | logistics | Tabela órfã |
| industrial.locations | industrial | Tabela órfã |
| industrial.suppliers | industrial | Tabela órfã |
| industrial.products_industrial | industrial | Tabela órfã |
| industrial.components | industrial | Tabela órfã |
| industrial.machines | industrial | Tabela órfã |
| industrial.materials | industrial | Tabela órfã |
| industrial.processes | industrial | Tabela órfã |
| industrial.timing_records | industrial | Tabela órfã |
| industrial.capacity | industrial | Tabela órfã |
| industrial.tools | industrial | Tabela órfã |
| industrial.bom | industrial | Tabela órfã |

---

## 3. RESUMO POR SCHEMA

### auth (1 tabela)

| Tabela | Banco Existe | Backend Usa | Frontend Usa | Status |
|--------|--------------|-------------|--------------|--------|
| users | ✅ | ✅ | ✅ | ✅ ATIVO |

**Resumo:** 1 ativa, 0 mortas

### identity (3 tabelas)

| Tabela | Banco Existe | Backend Usa | Frontend Usa | Status |
|--------|--------------|-------------|--------------|--------|
| roles | ✅ | ✅ | ✅ | ✅ ATIVO |
| user_roles | ✅ | ✅ | ✅ | ✅ ATIVO |
| referral_tracking | ✅ | ✅ | ✅ | ✅ ATIVO |

**Resumo:** 3 ativas, 0 mortas

### crm (2 tabelas)

| Tabela | Banco Existe | Backend Usa | Frontend Usa | Status |
|--------|--------------|-------------|--------------|--------|
| customers | ✅ | ✅ | ✅ | ✅ ATIVO |
| customer_distributor | ✅ | ❌ | ❌ | ❌ MORTO |

**Resumo:** 1 ativa, 1 morta

### mlm (13 tabelas)

| Tabela | Banco Existe | Backend Usa | Frontend Usa | Status |
|--------|--------------|-------------|--------------|--------|
| distribuidores | ✅ | ✅ | ✅ | ✅ ATIVO |
| planos | ✅ | ✅ | ✅ | ✅ ATIVO |
| comissoes | ✅ | ✅ | ✅ | ✅ ATIVO |
| rede_linear_nos | ✅ | ❌ | ❌ | ❌ MORTO |
| planos_distribuidores | ✅ | ❌ | ❌ | ❌ MORTO |
| bonus_regras | ✅ | ❌ | ❌ | ❌ MORTO |
| pontos_saldo | ✅ | ❌ | ❌ | ❌ MORTO |
| pontos_transacoes | ✅ | ❌ | ❌ | ❌ MORTO |
| qualificacoes | ✅ | ❌ | ❌ | ❌ MORTO |
| bonus_historico | ✅ | ❌ | ❌ | ❌ MORTO |
| qualificacoes_historico | ✅ | ❌ | ❌ | ❌ MORTO |
| distribuidor_conta_bancaria | ✅ | ❌ | ❌ | ❌ MORTO |
| distribuidor_temas | ✅ | ❌ | ❌ | ❌ MORTO |

**Resumo:** 3 ativas, 10 mortas

### commerce (12 tabelas)

| Tabela | Banco Existe | Backend Usa | Frontend Usa | Status |
|--------|--------------|-------------|--------------|--------|
| produtos | ✅ | ✅ | ✅ | ✅ ATIVO |
| pedidos | ✅ | ✅ | ✅ | ✅ ATIVO |
| cart_items | ✅ | ✅ | ✅ | ✅ ATIVO |
| produtos_categorias | ✅ | ❌ | ❌ | ❌ MORTO |
| formas_pagamento | ✅ | ❌ | ❌ | ❌ MORTO |
| pedidos_itens | ✅ | ❌ | ❌ | ❌ MORTO |
| pedidos_pagamentos | ✅ | ❌ | ❌ | ❌ MORTO |
| pedidos_saldos | ✅ | ❌ | ❌ | ❌ MORTO |
| pedidos_status | ✅ | ❌ | ❌ | ❌ MORTO |
| produtos_opcoes | ✅ | ❌ | ❌ | ❌ MORTO |
| produtos_campos_opcoes | ✅ | ❌ | ❌ | ❌ MORTO |
| tipos_campo_pedido | ✅ | ❌ | ❌ | ❌ MORTO |

**Resumo:** 3 ativas, 9 mortas

### finance (2 tabelas)

| Tabela | Banco Existe | Backend Usa | Frontend Usa | Status |
|--------|--------------|-------------|--------------|--------|
| solicitacoes_saque | ✅ | ✅ | ✅ | ✅ ATIVO |
| solicitacoes_saque_cd | ✅ | ❌ | ❌ | ❌ MORTO |

**Resumo:** 1 ativa, 1 morta

### public (4 tabelas)

| Tabela | Banco Existe | Backend Usa | Frontend Usa | Status |
|--------|--------------|-------------|--------------|--------|
| copilot_conversations | ✅ | ✅ | ✅ | ✅ ATIVO |
| copilot_messages | ✅ | ❌ | ❌ | ❌ MORTO |
| copilot_context_snapshots | ✅ | ❌ | ❌ | ❌ MORTO |
| payment_attempts | ✅ | ❌ | ❌ | ❌ MORTO |
| order_items | ✅ | ✅ | ❌ | ⚠️ PARCIAL |

**Resumo:** 1 ativa, 1 parcial, 3 mortas

### system (5 tabelas)

| Tabela | Banco Existe | Backend Usa | Frontend Usa | Status |
|--------|--------------|-------------|--------------|--------|
| fabricantes | ✅ | ❌ | ❌ | ❌ MORTO |
| linguagens | ✅ | ❌ | ❌ | ❌ MORTO |
| lojas | ✅ | ❌ | ❌ | ❌ MORTO |
| embeddings | ✅ | ❌ | ❌ | ❌ MORTO |
| tipos_pessoa | ✅ | ❌ | ❌ | ❌ MORTO |

**Resumo:** 0 ativas, 5 mortas

### logistics (1 tabela)

| Tabela | Banco Existe | Backend Usa | Frontend Usa | Status |
|--------|--------------|-------------|--------------|--------|
| transportadoras | ✅ | ❌ | ❌ | ❌ MORTO |

**Resumo:** 0 ativas, 1 morta

### industrial (11 tabelas)

| Tabela | Banco Existe | Backend Usa | Frontend Usa | Status |
|--------|--------------|-------------|--------------|--------|
| locations | ✅ | ❌ | ❌ | ❌ MORTO |
| suppliers | ✅ | ❌ | ❌ | ❌ MORTO |
| products_industrial | ✅ | ❌ | ❌ | ❌ MORTO |
| components | ✅ | ❌ | ❌ | ❌ MORTO |
| machines | ✅ | ❌ | ❌ | ❌ MORTO |
| materials | ✅ | ❌ | ❌ | ❌ MORTO |
| processes | ✅ | ❌ | ❌ | ❌ MORTO |
| timing_records | ✅ | ❌ | ❌ | ❌ MORTO |
| capacity | ✅ | ❌ | ❌ | ❌ MORTO |
| tools | ✅ | ❌ | ❌ | ❌ MORTO |
| bom | ✅ | ❌ | ❌ | ❌ MORTO |

**Resumo:** 0 ativas, 11 mortas

---

## 4. ESTATÍSTICAS GERAIS

### Total de Entidades: 49

| Status | Quantidade | Percentual |
|--------|-----------|------------|
| ✅ ATIVO | 12 | 24.5% |
| ⚠️ PARCIAL | 1 | 2.0% |
| ❌ MORTO | 34 | 69.4% |
| 🟡 PLANEJADO | 0 | 0% |

### Por Schema

| Schema | Total | Ativas | Parciais | Mortas | Planejadas |
|--------|-------|--------|----------|--------|------------|
| auth | 1 | 1 (100%) | 0 (0%) | 0 (0%) | 0 (0%) |
| identity | 3 | 3 (100%) | 0 (0%) | 0 (0%) | 0 (0%) |
| crm | 2 | 1 (50%) | 0 (0%) | 1 (50%) | 0 (0%) |
| mlm | 13 | 3 (23%) | 0 (0%) | 10 (77%) | 0 (0%) |
| commerce | 12 | 3 (25%) | 0 (0%) | 9 (75%) | 0 (0%) |
| finance | 2 | 1 (50%) | 0 (0%) | 1 (50%) | 0 (0%) |
| public | 5 | 1 (20%) | 1 (20%) | 3 (60%) | 0 (0%) |
| system | 5 | 0 (0%) | 0 (0%) | 5 (100%) | 0 (0%) |
| logistics | 1 | 0 (0%) | 0 (0%) | 1 (100%) | 0 (0%) |
| industrial | 11 | 0 (0%) | 0 (0%) | 11 (100%) | 0 (0%) |

---

## 5. EVIDÊNCIAS COLETADAS

### Fontes de Evidência

1. **Tabelas do Banco:** MCP `list_tables` com verbose=true
2. **Uso no Backend:** Análise de repositories em `src/backend/modules/`
3. **Uso no Frontend:** Análise de services em `src/services/`

### Observações Importantes

1. **Identity Schema:** 100% das tabelas estão ativas
2. **Industrial Schema:** 100% das tabelas são mortas
3. **System Schema:** 100% das tabelas são mortas
4. **Logistics Schema:** 100% das tabelas são mortas
5. **Commerce Schema:** 75% das tabelas são mortas
6. **MLM Schema:** 77% das tabelas são mortas
7. **Public Schema:** 60% das tabelas são mortas

---

## 6. PRÓXIMOS PASSOS

Continuar com:
- ETAPA 8: Mapa de dependências
- ETAPA 9: Classificação final
- ETAPA 10: Entregáveis finais
