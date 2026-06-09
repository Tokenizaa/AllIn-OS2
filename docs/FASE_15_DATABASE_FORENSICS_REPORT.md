# FASE 15 — DATABASE FORENSICS & DATA RELATIONSHIP AUDIT

**Data**: 8 de Junho de 2026  
**Projeto**: sistema-allin  
**Project ID**: isjsydhuqurneswstlyx  
**Status**: COMPLETO

---

## Resumo Executivo

Esta auditoria forense revelou **problemas críticos na arquitetura de dados** que impactam diretamente o funcionamento da plataforma. O principal gargalo não está no Frontend ou Backend, mas sim na estrutura desintegrada do banco de dados.

### Problemas Críticos Identificados

1. **RLS Desativado em Tabelas Críticas** (VULNERABILIDADE DE SEGURANÇA)
   - customers, orders, order_items sem Row Level Security
   - Dados expostos a qualquer usuário com anon key

2. **Customer360 Fragmentado e Quebrado**
   - customers.user_id é NULL em 100% dos registros (1,242 registros)
   - Não existe vínculo entre customers e auth.users
   - 3 tabelas representando a mesma entidade (customers, profiles, distribuidores)

3. **Pedidos Órfãos**
   - 11,291 pedidos com customer_id NULL e user_id NULL
   - Pedidos completamente desconectados de clientes
   - 57,029 itens de pedido sem relacionamento válido

4. **Duplicação Massiva de Dados**
   - Email duplicado em 17 tabelas diferentes
   - Telefone duplicado em 12 tabelas diferentes
   - Ausência de fonte única de verdade

5. **Relacionamentos Inexistentes**
   - Apenas 22 foreign keys definidas em todo o banco
   - 16 tabelas usam customer_id sem foreign key
   - 24 tabelas usam user_id sem foreign key

### Impacto no Negócio

- **CRM**: Impossível rastrear clientes completos
- **Customer360**: Não existe, dados fragmentados
- **Rede**: Relacionamentos quebrados
- **Pedidos**: Sem vínculo com clientes
- **Carteiras**: 3 tipos de carteiras duplicadas
- **Comissões**: Cálculos impossíveis sem relacionamentos
- **Analytics**: Dados inconsistentes
- **Copilot**: Sem contexto de cliente unificado

---

## Inventário Completo do Banco

### Total de Estruturas

- **Tabelas**: 120+ tabelas (incluindo backup e schemas)
- **Views**: 1 view (audit_log_summary)
- **Functions**: 44 functions (public) + 2 (analytics)
- **Triggers**: 25 triggers
- **Schemas**: public, auth, storage, analytics, backup_2026_05_28, scrape_backup, cron, realtime, vault
- **Extensions**: 5 ativas (vector, pgcrypto, uuid-ossp, pg_cron, pg_stat_statements, supabase_vault)

### Tabelas por Schema

#### Public Schema (Tabelas Principais)

| Tabela | Registros | Status | Observações |
|--------|-----------|--------|-------------|
| customers | 1,242 | ATIVO | user_id NULL em 100% |
| profiles | 7 | ATIVO | Vínculo com auth.users |
| distribuidores | 976 | ATIVO | Sem vínculo com auth.users |
| orders | 11,291 | ATIVO | customer_id NULL em 100% |
| order_items | 57,029 | ATIVO | Sem relacionamento válido |
| payments | 43,717 | ATIVO | customer_id NULL em 100% |
| shipments | 20,054 | ATIVO | Sem vínculo com orders |
| wallets | 1,631 | ATIVO | Balance R$ 0.00 |
| points_wallets | 1,631 | ATIVO | Balance R$ 0.00 |
| bonus_wallets | 1,631 | ATIVO | Balance R$ 1,711,281.98 |
| network_relationships | 995 | ATIVO | Rede fragmentada |
| products | 112 | ATIVO | |
| plans | 7 | ATIVO | |
| qualifications | 11 | ATIVO | |

#### Tabelas com Zero Registros (80+ tabelas)

**Analytics**: ai_conversations, ai_insights, ai_messages  
**Auth**: audit_log_entries, custom_oauth_providers, flow_state, instances, mfa_challenges, mfa_factors, oauth_authorizations, oauth_clients, oauth_consents, saml_providers, saml_relay_states, sso_domains, sso_providers, webauthn_challenges, webauthn_credentials  
**Public**: admin_invites, audit_log, bonus_transactions, campaign_intelligence, cart_items, chatwoot_conversations, chatwoot_messages, commissions, customer_embeddings, customer_events, customer_predictions, customer_qualifications, document_embeddings, integrations, leads, marketing_links, payment_attempts, product_embeddings, referral_tracking, upgrade_suggestions, wallet_audit_log, wallet_transactions, withdrawals  
**Backup**: 50+ tabelas de backup  
**Storage**: buckets_analytics, buckets_vectors, s3_multipart_uploads, s3_multipart_uploads_parts, vector_indexes  
**Realtime**: messages, subscription  
**Vault**: secrets  

---

## Mapa de Entidades

### Domínio: Clientes

| Tabela | Registros | user_id | email | nome | Status |
|--------|-----------|---------|-------|------|--------|
| customers | 1,242 | 0 (100% NULL) | 1,212 únicos | 1,051 únicos | FONTE OFICIAL? |
| profiles | 7 | 7 (100% preenchido) | 5 únicos | 5 únicos | CÓPIA? |
| distribuidores | 976 | 0 (100% NULL) | 959 únicos | 968 únicos | LEGADO? |
| auth.users | 7 | 7 | 7 únicos | - | AUTENTICAÇÃO |

**Problema**: customers não tem vínculo com auth.users. profiles tem apenas 7 registros vs 1,242 customers.

### Domínio: Pedidos

| Tabela | Registros | customer_id | user_id | Status |
|--------|-----------|-------------|---------|--------|
| orders | 11,291 | 0 (100% NULL) | 0 (100% NULL) | FONTE OFICIAL |
| order_items | 57,029 | - | - | DETALHES |
| order_items_normalized | 1,621 | - | 1,621 | DUPLICADO? |
| payments | 43,717 | 0 (100% NULL) | 0 (100% NULL) | PAGAMENTOS |
| shipments | 20,054 | - | - | ENTREGA |

**Problema Crítico**: orders.customer_id é NULL em 100% dos registros. Pedidos completamente desconectados de clientes.

### Domínio: Carteiras

| Tabela | Registros | customer_id | Balance | Status |
|--------|-----------|-------------|---------|--------|
| wallets | 1,631 | 1,631 (100%) | R$ 0.00 | DUPLICADO |
| points_wallets | 1,631 | 1,631 (100%) | R$ 0.00 | DUPLICADO |
| bonus_wallets | 1,631 | 1,631 (100%) | R$ 1,711,281.98 | ATIVA |

**Problema**: 3 carteiras por cliente, mas apenas bonus_wallets tem saldo. wallets e points_wallets são redundantes.

### Domínio: Rede

| Tabela | Registros | customer_id | Status |
|--------|-----------|-------------|--------|
| network_relationships | 995 | 995 | FONTE OFICIAL |
| customer_network_metrics | 1,000 | 1,000 | ANALYTICS |
| referral_tracking | 0 | - | VAZIA |

**Problema**: referral_tracking está vazia, não sendo utilizada.

---

## Dados Duplicados

### Email (17 tabelas)

| Tabela | Coluna | Tipo | Classificação |
|--------|--------|------|---------------|
| customers | email | text | FONTE OFICIAL |
| profiles | email | text | CÓPIA |
| distribuidores | email | text | LEGADO |
| auth.users | email | varchar | AUTENTICAÇÃO |
| admin_users | email | text | ADMIN |
| admin_invites | email | text | ADMIN |
| leads | email | text | LEADS |
| chatwoot_conversations | contact_phone | text | CHATWOOT |
| orders | customer_email | text | CÓPIA |
| payments | customer_email | text | CÓPIA |
| withdrawals | customer_email | text | CÓPIA |
| + 6 outras | - | - | VARIADO |

**Recomendação**: customers.email deve ser a fonte oficial. Demais tabelas devem referenciar customers.id.

### Telefone (12 tabelas)

| Tabela | Coluna | Tipo | Classificação |
|--------|--------|------|---------------|
| customers | telefone | text | FONTE OFICIAL |
| profiles | phone | text | CÓPIA |
| distribuidores | telefone | text | LEGADO |
| auth.users | phone | text | AUTENTICAÇÃO |
| leads | phone | text | LEADS |
| orders | telefone | text | CÓPIA |
| chatwoot_conversations | contact_phone | text | CHATWOOT |
| + 5 outras | - | - | VARIADO |

**Recomendação**: customers.telefone deve ser a fonte oficial.

### Nome (20+ tabelas)

| Tabela | Coluna | Tipo | Classificação |
|--------|--------|------|---------------|
| customers | nome_completo | text | FONTE OFICIAL |
| profiles | name | text | CÓPIA |
| distribuidores | nome | text | LEGADO |
| orders | customer_name | text | CÓPIA |
| withdrawals | user_name | text | CÓPIA |
| + 15 outras | - | - | VARIADO |

**Recomendação**: customers.nome_completo deve ser a fonte oficial.

---

## Linhagem dos Dados

### Dado Crítico: user_id

**Onde nasce?**: auth.users.id  
**Onde deveria estar?**: customers.user_id  
**Onde está atualmente?**: NULL em 100% dos customers  
**Quem atualiza?**: Ninguém (não existe vínculo)  
**Quem consome?**: Frontend services tentam usar mas falham  
**Status**: **QUEBRADO**

### Dado Crítico: customer_id

**Onde nasce?**: customers.id  
**Onde deveria estar?**: orders.customer_id, payments.customer_id  
**Onde está atualmente?**: NULL em 100% dos orders e payments  
**Quem atualiza?**: Ninguém (não existe vínculo)  
**Quem consome?**: Frontend services tentam usar mas falham  
**Status**: **QUEBRADO**

### Dado Crítico: Saldo

**Onde nasce?**: Não identificado  
**Onde está armazenado**: wallets.balance (R$ 0.00), points_wallets.balance (R$ 0.00), bonus_wallets.balance (R$ 1,711,281.98)  
**Quem atualiza?**: Funções de cálculo de bônus  
**Quem consome?**: Frontend wallet service  
**Status**: **FRAGMENTADO**

### Dado Crítico: Comissão

**Onde nasce?**: Não identificado (tabela commissions vazia)  
**Onde está armazenado**: commissions (0 registros)  
**Quem atualiza?**: Funções de cálculo existem mas não executam  
**Quem consome?**: Ninguém (tabela vazia)  
**Status**: **INEXISTENTE**

---

## Relacionamentos

### Foreign Keys Existentes (22 total)

| Tabela Origem | Coluna | Tabela Destino | Coluna Destino |
|---------------|--------|----------------|----------------|
| orders | customer_id | customers | id |
| order_items | order_id | orders | id |
| cart_items | product_id | products | id |
| payments | customer_id | customers | id |
| wallets | customer_id | customers | id |
| bonus_wallets | customer_id | customers | id |
| points_wallets | customer_id | customers | id |
| + 15 outras | - | - | - |

**Problema**: Apenas 22 foreign keys para 120+ tabelas. Muitos relacionamentos implícitos.

### Relacionamentos Ausentes (Críticos)

| Tabela | Coluna | Deveria Referenciar | Status |
|--------|--------|---------------------|--------|
| customers | user_id | auth.users.id | AUSENTE |
| orders | customer_id | customers.id | NULL em 100% |
| payments | customer_id | customers.id | NULL em 100% |
| network_relationships | customer_id | customers.id | SEM FK |
| customer_metrics | customer_id | customers.id | SEM FK |
| customer_scores | customer_id | customers.id | SEM FK |
| + 10 outras | - | - | AUSENTES |

### Registros Órfãos

- **11,291 orders** sem customer_id válido
- **43,717 payments** sem customer_id válido
- **57,029 order_items** sem order_id válido (implícito)
- **1,242 customers** sem user_id válido

---

## Fonte Oficial de Cada Entidade

| Domínio | Fonte Oficial | Status | Tabelas a Remover |
|---------|---------------|--------|-------------------|
| Clientes | customers | PARCIAL | profiles, distribuidores (após migração) |
| Distribuidores | customers (com tipo) | PARCIAL | distribuidores (legado) |
| Rede | network_relationships | ATIVO | - |
| Pedidos | orders | QUEBRADO | order_items_normalized (duplicado) |
| Carteiras | bonus_wallets | FRAGMENTADO | wallets, points_wallets (redundantes) |
| Comissões | commissions | INEXISTENTE | - |
| Qualificações | qualifications | ATIVO | customer_qualifications (vazia) |
| Produtos | products | ATIVO | - |
| Planos | plans | ATIVO | - |

---

## Tabelas Mortas

### Classificação: Remover (80+ tabelas)

**Backup Schema** (50+ tabelas):
- backup_2026_05_28.* (todas as tabelas)
- scrape_backup.* (todas as tabelas)

**Auth Schema Vazias** (19 tabelas):
- audit_log_entries, custom_oauth_providers, flow_state, instances
- mfa_challenges, mfa_factors, oauth_authorizations, oauth_clients, oauth_consents
- saml_providers, saml_relay_states, sso_domains, sso_providers
- webauthn_challenges, webauthn_credentials

**Public Vazias** (20+ tabelas):
- admin_invites, audit_log, bonus_transactions, campaign_intelligence
- cart_items, chatwoot_conversations, chatwoot_messages, commissions
- customer_embeddings, customer_events, customer_predictions, customer_qualifications
- document_embeddings, integrations, leads, marketing_links
- payment_attempts, product_embeddings, referral_tracking
- upgrade_suggestions, wallet_audit_log, wallet_transactions, withdrawals

**Storage Vazias** (6 tabelas):
- buckets_analytics, buckets_vectors, s3_multipart_uploads, s3_multipart_uploads_parts, vector_indexes

**Realtime Vazias** (2 tabelas):
- messages, subscription

**Vault Vazias** (1 tabela):
- secrets

### Classificação: Consolidar

- **wallets + points_wallets** → bonus_wallets (única carteira ativa)
- **order_items_normalized** → order_items (duplicado)
- **profiles** → customers (após migração de user_id)
- **distribuidores** → customers (após migração de dados)

### Classificação: Manter

- customers, orders, order_items, payments, shipments
- network_relationships, customer_network_metrics
- products, plans, qualifications
- bonus_wallets
- analytics tables (quando populadas)

---

## Customer360

### Análise de Consistência

| Campo | customers | profiles | distribuidores | auth.users | Status |
|-------|-----------|----------|----------------|------------|--------|
| id | 1,242 | 7 | 976 | 7 | FRAGMENTADO |
| user_id | 0 (100% NULL) | 7 (100%) | 0 (100% NULL) | 7 | **QUEBRADO** |
| email | 1,212 únicos | 5 únicos | 959 únicos | 7 únicos | DUPLICADO |
| nome | 1,051 únicos | 5 únicos | 968 únicos | - | DUPLICADO |
| telefone | - | 7 | 976 | 7 | DUPLICADO |

### Conclusão

**NÃO EXISTE Customer360 real.** Existem múltiplos Customer360 conflitantes:

1. **customers** (1,242 registros) - Dados comerciais, mas sem vínculo auth
2. **profiles** (7 registros) - Dados de perfil, vinculado ao auth
3. **distribuidores** (976 registros) - Dados legados AllInBrasil, sem vínculo auth
4. **auth.users** (7 registros) - Autenticação, sem dados comerciais

**Problema Central**: customers.user_id é NULL em 100% dos registros, impossibilitando qualquer Customer360 unificado.

---

## Impacto no Frontend

### Services Identificados

**CustomerService** (services/customers/index.ts):
- fetchCustomerById()
- fetchCustomerByCompradorId()
- fetchDownlines()
- fetchCustomersList()
- **Impacto**: Funciona parcialmente, mas sem vínculo auth

**OrderService** (services/orders/index.ts):
- fetchOrdersForDashboard()
- fetchOrdersByCustomerId() - **FALHA** (customer_id NULL)
- fetchOrdersList()
- fetchOfficeOrders()
- fetchOrdersAndCustomers()
- fetchRecentOrders()
- fetchOrderStats()
- **Impacto**: Funciona, mas orders desconectados de customers

**WalletService** (services/wallets/index.ts):
- fetchWalletByCustomerId()
- fetchPointsWalletByCustomerId()
- createWallet()
- createPointsWallet()
- updateWalletBalance()
- **Impacto**: Funciona, mas 3 carteiras redundantes

**ProfileService** (services/profiles/index.ts):
- fetchUserProfile()
- fetchLastProfile()
- fetchMyProfile()
- **Impacto**: Funciona apenas para 7 usuários (profiles)

**LeadService** (services/leads/index.ts):
- fetchLeads()
- createLead()
- **Impacto**: Tabela leads vazia, não funcional

### Views

- **audit_log_summary**: Única view, depende de profiles e audit_log

### Functions (44 functions)

- Cálculo de bônus
- Atualização de métricas
- Refresh de analytics
- Busca semântica
- **Impacto**: Muitas funções, mas dados base quebrados

---

## Impacto no Backend

### Triggers (25 triggers)

- updated_at triggers (20+ tabelas)
- wallet_audit_trigger
- withdrawals_audit_trigger
- trigger_bonus_calculation
- **Impacto**: Triggers funcionam, mas dados base quebrados

### Migrations (173 migrations)

- Histórico extenso de migrações
- Muitas migrações de recuperação (financial_recovery, customer360_recovery)
- **Impacto**: Indica instabilidade e problemas recorrentes

---

## Plano de Consolidação

### Fase 1: Correções Críticas Imediatas (Prioridade ALTA)

1. **Habilitar RLS em tabelas críticas**
   ```sql
   ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
   ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
   ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
   ```

2. **Criar políticas RLS básicas**
   - Políticas para leitura baseadas em user_id
   - Políticas para escrita restritas a admins

3. **Adicionar Foreign Keys ausentes**
   ```sql
   ALTER TABLE customers ADD CONSTRAINT customers_user_id_fkey 
     FOREIGN KEY (user_id) REFERENCES auth.users(id);
   ALTER TABLE orders ADD CONSTRAINT orders_customer_id_fkey 
     FOREIGN KEY (customer_id) REFERENCES customers(id);
   ALTER TABLE payments ADD CONSTRAINT payments_customer_id_fkey 
     FOREIGN KEY (customer_id) REFERENCES customers(id);
   ```

### Fase 2: Migração de Dados (Prioridade ALTA)

1. **Migrar customers.user_id**
   - Mapear customers.email com auth.users.email
   - Atualizar customers.user_id onde houver match
   - Criar auth.users para customers sem match

2. **Migrar orders.customer_id**
   - Mapear orders.customer_email com customers.email
   - Atualizar orders.customer_id onde houver match
   - Identificar orders órfãos para análise manual

3. **Consolidar distribuidores em customers**
   - Migrar dados de distribuidores para customers
   - Adicionar campo tipo (distribuidor/cliente)
   - Remover tabela distribuidores após validação

### Fase 3: Remoção de Redundâncias (Prioridade MÉDIA)

1. **Consolidar carteiras**
   - Manter apenas bonus_wallets
   - Migrar saldos de wallets e points_wallets
   - Remover tabelas redundantes

2. **Remover tabelas duplicadas**
   - Remover order_items_normalized
   - Remover profiles (após migração)
   - Remover leads (se não utilizado)

3. **Remover tabelas mortas**
   - Remover backup_2026_05_28 schema
   - Remover scrape_backup schema
   - Remover tabelas vazias de auth, storage, realtime, vault

### Fase 4: Normalização de Dados (Prioridade MÉDIA)

1. **Centralizar email**
   - customers.email como fonte oficial
   - Remover email de outras tabelas (exceto auth.users)
   - Adicionar foreign keys para customers.id

2. **Centralizar telefone**
   - customers.telefone como fonte oficial
   - Remover telefone de outras tabelas
   - Adicionar foreign keys para customers.id

3. **Centralizar nome**
   - customers.nome_completo como fonte oficial
   - Remover nome de outras tabelas
   - Adicionar foreign keys para customers.id

### Fase 5: Implementação de Customer360 (Prioridade ALTA)

1. **Criar view customer360_unified**
   - Unificar customers, profiles, distribuidores
   - Incluir dados de auth.users
   - Incluir dados de carteiras
   - Incluir dados de rede

2. **Criar funções de sincronização**
   - Sincronizar auth.users com customers
   - Sincronizar profiles com customers
   - Manter consistência de dados

### Fase 6: Implementação de Comissões (Prioridade ALTA)

1. **Popular tabela commissions**
   - Criar função de cálculo de comissões
   - Calcular comissões históricas
   - Implementar triggers automáticos

2. **Implementar cálculo de bônus**
   - Ativar funções existentes
   - Criar jobs agendados
   - Validar cálculos

---

## Correções Aplicadas

### Nenhuma correção aplicada ainda

**Motivo**: Esta é uma auditoria forense. Correções requerem aprovação e planejamento cuidadoso devido à criticidade dos dados.

---

## Score Final

| Área | Nota | Justificativa |
|------|------|---------------|
| Modelagem de Dados | 2/10 | Entidades fragmentadas, múltiplas tabelas para mesma entidade |
| Relacionamentos | 1/10 | Apenas 22 FKs para 120+ tabelas, muitos relacionamentos quebrados |
| Integridade | 0/10 | customer_id NULL em 100% dos orders, user_id NULL em 100% dos customers |
| Customer360 | 0/10 | Não existe, dados completamente fragmentados |
| Financeiro | 3/10 | Carteiras fragmentadas, comissões inexistentes |
| Analytics | 4/10 | Tabelas existem mas muitas vazias, dados inconsistentes |
| Consistência | 1/10 | Dados duplicados em 17+ tabelas, sem fonte única de verdade |
| Fonte de Verdade | 1/10 | Não existe, múltiplas tabelas concorrentes |
| Data Readiness | 2/10 | Dados existem mas não estão prontos para uso (quebrados) |

**Score Geral: 1.7/10** - **CRÍTICO**

---

## Próximos Passos Recomendados

### Imediato (Esta semana)

1. **Reunião de emergência** com stakeholders para discutir correções críticas
2. **Backup completo** do banco antes de qualquer correção
3. **Habilitar RLS** nas tabelas críticas
4. **Adicionar Foreign Keys** básicas

### Curto Prazo (2-4 semanas)

1. **Migrar customers.user_id** (mapeamento com auth.users)
2. **Migrar orders.customer_id** (mapeamento com customers)
3. **Consolidar carteiras** (remover redundâncias)
4. **Implementar Customer360 view**

### Médio Prazo (1-2 meses)

1. **Remover tabelas mortas** (backup, scrape, vazias)
2. **Normalizar dados** (centralizar email, telefone, nome)
3. **Implementar comissões** (popular tabela, criar cálculos)
4. **Validar integridade** (testes completos)

### Longo Prazo (3-6 meses)

1. **Refatorar schema** (modelo de dados unificado)
2. **Implementar analytics** (popular tabelas vazias)
3. **Otimizar performance** (índices, queries)
4. **Documentar arquitetura** (diagramas, guias)

---

## Conclusão

A arquitetura de dados atual está **criticamente comprometida**. Os principais problemas são:

1. **Ausência de vínculo entre customers e auth.users** (user_id NULL em 100%)
2. **Pedidos completamente desconectados de clientes** (customer_id NULL em 100%)
3. **Duplicação massiva de dados** (email em 17 tabelas, telefone em 12)
4. **Ausência de relacionamentos** (apenas 22 FKs)
5. **Customer360 inexistente** (dados fragmentados em 3+ tabelas)
6. **Comissões não implementadas** (tabela vazia)
7. **RLS desativado** (vulnerabilidade de segurança)

**Recomendação**: Priorizar correções críticas imediatas (RLS, Foreign Keys, Migração de IDs) antes de qualquer nova funcionalidade. Sem corrigir a fundação de dados, qualquer evolução será construída sobre base instável.

---

**Auditoria Realizada Por**: Cascade AI  
**Data**: 8 de Junho de 2026  
**Versão**: 1.0
