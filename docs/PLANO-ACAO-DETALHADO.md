# PLANO DE AÇÃO DETALHADO - ALLIN OS 2.0

**Data:** 11 de Junho de 2026  
**Versão:** 1.0  
**Status:** Plano Aprovado  
**Base:** Auditoria Técnica Completa  
**Duração:** 8 semanas (4 sprints)  
**Total Story Points:** 269

---

# ÍNDICE

1. [RESUMO EXECUTIVO](#resumo-executivo)
2. [SPRINT 1 - CRITICAL FIXES](#sprint-1---critical-fixes)
3. [SPRINT 2 - HIGH PRIORITY](#sprint-2---high-priority)
4. [SPRINT 3 - MEDIUM PRIORITY](#sprint-3---medium-priority)
5. [SPRINT 4 - LOW PRIORITY & OTIMIZAÇÕES](#sprint-4---low-priority--otimizações)
6. [RECURSOS NECESSÁRIOS](#recursos-necessários)
7. [RISCOS E MITIGAÇÃO](#riscos-e-mitigação)
8. [CRITÉRIOS DE SUCESSO](#critérios-de-sucesso)
9. [CHECKLIST DE PRODUÇÃO](#checklist-de-produção)

---

# RESUMO EXECUTIVO

## Objetivo

Preparar a plataforma AllIn OS 2.0 para produção através da correção de issues críticas, de alta e média prioridade identificados na auditoria técnica.

## Status Atual

- **Implementation Score:** 7.2/10
- **Critical Issues:** 0
- **High Priority Issues:** 4
- **Medium Priority Issues:** 4
- **Low Priority Issues:** 3

## Estratégia

Executar 4 sprints de 2 semanas cada, priorizando por impacto:
- **Sprint 1:** Issues críticas que bloqueiam produção
- **Sprint 2:** Issues de alta prioridade
- **Sprint 3:** Issues de média prioridade
- **Sprint 4:** Issues de baixa prioridade e otimizações

## Recomendação

Executar Sprint 1 e 2 antes de considerar produção. Sprint 3 e 4 podem ser executados em paralelo com desenvolvimento de novas features.

---

# SPRINT 1 - CRITICAL FIXES

**Duração:** 2 semanas  
**Story Points:** 73  
**Objetivo:** Resolver issues críticas que bloqueiam produção  
**Status:** ✅ CONCLUÍDO

## Task 1.1: Implementar RLS Policies Críticas

**Responsável:** Backend Developer  
**Story Points:** 13  
**Prioridade:** CRITICAL  
**Dependencies:** Nenhuma

### Descrição
Implementar Row Level Security (RLS) policies para tabelas críticas que atualmente não têm proteção adequada.

### Tabelas Alvo
- `crm.customers`: user access to own, admin full access
- `commerce.pedidos`: user access to own, admin full access
- `mlm.distribuidores`: user access to own, admin full access
- `finance.solicitacoes_saque`: user access to own, admin full access

### Subtasks
1. Criar migration para adicionar RLS policies
2. Implementar policy para customers:
   - SELECT: users podem ver próprios dados, admins podem ver tudo
   - INSERT: service_role apenas
   - UPDATE: users podem atualizar próprios dados, admins podem atualizar tudo
   - DELETE: service_role apenas
3. Implementar policy para pedidos:
   - SELECT: users podem ver próprios pedidos, admins podem ver tudo
   - INSERT: service_role apenas
   - UPDATE: service_role apenas
   - DELETE: service_role apenas
4. Implementar policy para distribuidores:
   - SELECT: distribuidores podem ver próprios dados, admins podem ver tudo
   - INSERT: service_role apenas
   - UPDATE: distribuidores podem atualizar próprios dados, admins podem atualizar tudo
   - DELETE: service_role apenas
5. Implementar policy para solicitacoes_saque:
   - SELECT: distribuidores podem ver próprias solicitações, admins podem ver tudo
   - INSERT: service_role apenas
   - UPDATE: service_role apenas
   - DELETE: service_role apenas
6. Testar policies em ambiente de desenvolvimento
7. Documentar policies

### Critérios de Aceite
- [x] Migration criada e aplicada com sucesso
- [x] Policies implementadas para todas as 4 tabelas
- [x] Testes manuais passam (user access, admin access, service_role access)
- [x] Documentação atualizada

### Riscos
- **Risco:** Policies podem bloquear acesso legítimo
- **Mitigação:** Testes extensivos em desenvolvimento antes de produção

---

## Task 1.2: Implementar Domain Services MLM

**Responsável:** Backend Developer (MLM)  
**Story Points:** 21  
**Prioridade:** CRITICAL  
**Dependencies:** Nenhuma

### Descrição
Implementar domain services para cálculo de comissões e qualificações MLM, que atualmente não estão implementados.

### Subtasks
1. Criar módulo `src/backend/modules/mlm/domain-services/`
2. Implementar `CommissionCalculationService`:
   - Cálculo de comissão direta
   - Cálculo de comissão indireta
   - Cálculo de bônus de perna
   - Cálculo de bônus de liderança
   - Validação de regras de negócio
3. Implementar `QualificationCalculationService`:
   - Cálculo de qualificação atual
   - Validação de requisitos de qualificação
   - Histórico de qualificações
   - Progressão de qualificação
4. Implementar `PointsCalculationService`:
   - Cálculo de pontos de ativação
   - Cálculo de pontos de renovação
   - Cálculo de pontos de qualificação
   - Histórico de pontos
5. Criar DTOs para serviços de domínio
6. Implementar testes unitários para serviços
7. Integrar services com módulos existentes (network, commissions)
8. Documentar regras de cálculo

### Critérios de Aceite
- [x] Domain services criados e implementados
- [x] Cálculo de comissões implementado e testado
- [x] Cálculo de qualificações implementado e testado
- [x] Cálculo de pontos implementado e testado
- [x] Testes unitários com cobertura > 80%
- [x] Documentação completa

### Riscos
- **Risco:** Cálculos podem estar incorretos
- **Mitigação:** Validação com especialistas de MLM, testes extensivos

---

## Task 1.3: Implementar Domain Services Finance

**Responsável:** Backend Developer (Finance)  
**Story Points:** 13  
**Prioridade:** CRITICAL  
**Dependencies:** Nenhuma

### Descrição
Implementar domain services para validação de saques e limites financeiros, que atualmente não estão implementados.

### Subtasks
1. Criar módulo `src/backend/modules/finance/domain-services/`
2. Implementar `WithdrawalValidationService`:
   - Validação de saldo disponível
   - Validação de limites de saque (mínimo, máximo, diário, mensal)
   - Validação de conta bancária
   - Validação de frequência de saques
3. Implementar `BalanceCalculationService`:
   - Cálculo de saldo disponível
   - Cálculo de saldo bloqueado
   - Histórico de saldo
4. Implementar `LimitCalculationService`:
   - Cálculo de limites por plano
   - Cálculo de limites por qualificação
   - Validação de limites
5. Criar DTOs para serviços de domínio
6. Implementar testes unitários para serviços
7. Documentar regras de validação

### Critérios de Aceite
- [x] Domain services criados e implementados
- [x] Validação de saques implementada e testada
- [x] Cálculo de saldos implementado e testado
- [x] Validação de limites implementada e testada
- [x] Testes unitários com cobertura > 80%
- [x] Documentação completa

### Riscos
- **Risco:** Regras de validação podem estar incorretas
- **Mitigação:** Validação com especialistas financeiros, testes extensivos

---

## Task 1.4: Criar Módulo Logistics Backend

**Responsável:** Backend Developer  
**Story Points:** 13  
**Prioridade:** CRITICAL  
**Dependencies:** Nenhuma

### Descrição
Criar módulo backend para logistics com freight calculation e carrier integration, que atualmente não existe.

### Subtasks
1. Criar módulo `src/backend/modules/logistics/`
2. Criar estrutura: api/, dto/, repositories/, services/, adapters/
3. Implementar `FreightCalculationService`:
   - Cálculo de frete por CEP origem/destino
   - Cálculo por peso/volume
   - Cálculo por valor do pedido
   - Integração com transportadoras
4. Implementar `CarrierAdapter`:
   - Adapter para Correios
   - Adapter para Jadlog
   - Adapter para outras transportadoras principais
5. Implementar `CarrierService`:
   - CRUD de transportadoras
   - Ativação/desativação de transportadoras
   - Configuração de taxas
6. Criar DTOs para logistics
7. Implementar repository para logistics
8. Implementar API endpoints
9. Integrar com módulo orders
10. Documentar integração

### Critérios de Aceite
- [x] Módulo logistics criado com estrutura completa
- [x] Freight calculation implementado e testado
- [x] Carrier adapters implementados para principais transportadoras
- [x] API endpoints funcionando
- [x] Integração com orders funcionando
- [x] Documentação completa

### Riscos
- **Risco:** Integração com transportadoras pode falhar
- **Mitigação:** Implementar fallback para cálculo local, testes com APIs de sandbox

---

## Task 1.5: Criar Módulo Finance Backend

**Responsável:** Backend Developer  
**Story Points:** 13  
**Prioridade:** CRITICAL  
**Dependencies:** Task 1.3

### Descrição
Criar módulo backend para finance com withdrawals e balances management, que atualmente não existe.

### Subtasks
1. Criar módulo `src/backend/modules/finance/`
2. Criar estrutura: api/, dto/, repositories/, services/, domain-services/
3. Implementar `WithdrawalService`:
   - Criação de solicitação de saque
   - Validação de saque (usando domain services)
   - Aprovação de saque
   - Rejeição de saque
   - Estorno de saque
   - Reversão de saque
4. Implementar `BalanceService`:
   - Consulta de saldo
   - Histórico de saldo
   - Ajuste de saldo
5. Implementar `BankAccountService`:
   - CRUD de contas bancárias
   - Validação de conta bancária
   - Definição de conta principal
6. Implementar `WithdrawalCDService`:
   - Solicitações de saque de CDs
   - Aprovação/rejeição
7. Criar DTOs para finance
8. Implementar repository para finance
9. Implementar API endpoints
10. Integrar com módulo mlm (distribuidores)
11. Documentar módulo

### Critérios de Aceite
- [x] Módulo finance criado com estrutura completa
- [x] Withdrawal service implementado e testado
- [x] Balance service implementado e testado
- [x] Bank account service implementado e testado
- [x] API endpoints funcionando
- [x] Integração com mlm funcionando
- [x] Documentação completa

### Riscos
- **Risco:** Integração bancária pode falhar
- **Mitigação:** Implementar validação robusta, testes com sandbox bancário

---

# SPRINT 2 - HIGH PRIORITY

**Duração:** 2 semanas  
**Story Points:** 55  
**Objetivo:** Resolver issues de alta prioridade  
**Status:** ✅ CONCLUÍDO

## Task 2.1: Adicionar Missing Indexes

**Responsável:** Database Engineer  
**Story Points:** 8  
**Prioridade:** HIGH  
**Dependencies:** Nenhuma

### Descrição
Adicionar índices ausentes em tabelas de alto volume para otimizar performance de queries.

### Tabelas Alvo
- `crm.customers`: email, cpf, cnpj
- `mlm.distribuidores`: usuario, cpf, cnpj
- `commerce.pedidos`: customer_id, status, data_pedido
- `mlm.comissoes`: distribuidor_id, pedido_id, data

### Subtasks
1. Analisar queries mais frequentes em cada tabela
2. Criar migration para adicionar indexes
3. Criar indexes compostos para queries com múltiplos filtros
4. Criar indexes GIN para full-text search se necessário
5. Testar performance antes e depois dos indexes
6. Documentar indexes criados

### Critérios de Aceite
- [x] Migration criada e aplicada com sucesso
- [x] Indexes criados para todas as 4 tabelas
- [x] Performance de queries melhorou (medir com EXPLAIN ANALYZE)
- [x] Documentação atualizada

### Riscos
- **Risco:** Indexes podem afetar performance de INSERT/UPDATE
- **Mitigação:** Testar em ambiente de desenvolvimento, monitorar em produção

---

## Task 2.2: Implementar Soft Delete

**Responsável:** Backend Developer  
**Story Points:** 13  
**Prioridade:** HIGH  
**Dependencies:** Nenhuma

### Descrição
Implementar soft delete em todas as tabelas principais para preservar histórico e permitir recuperação.

### Subtasks
1. Criar migration para adicionar `deleted_at` em tabelas principais
2. Atualizar repositories para filtrar `deleted_at IS NULL`
3. Atualizar services para usar soft delete
4. Implementar restore functionality
5. Atualizar RLS policies para considerar `deleted_at`
6. Testar soft delete e restore
7. Documentar soft delete

### Tabelas Alvo
- crm.customers
- mlm.distribuidores
- commerce.pedidos
- commerce.produtos
- finance.solicitacoes_saque

### Critérios de Aceite
- [x] Migration criada e aplicada com sucesso
- [x] `deleted_at` adicionado em todas as tabelas principais
- [x] Repositories filtram `deleted_at IS NULL`
- [x] Soft delete funcionando
- [x] Restore funcionando
- [x] RLS policies atualizadas
- [x] Documentação atualizada

### Riscos
- **Risco:** Queries podem quebrar se não considerarem `deleted_at`
- **Mitigação:** Testes extensivos, atualização de todas as queries

---

## Task 2.3: Implementar Validation Layer

**Responsível:** Backend Developer  
**Story Points:** 8  
**Prioridade:** HIGH  
**Dependencies:** Nenhuma

### Descrição
Padronizar validação de dados (CPF, CNPJ, email, telefone) em um único lugar para consistência.

### Subtasks
1. Criar módulo `src/backend/shared/validation/`
2. Implementar `CPFValidator`:
   - Validação algorítmica
   - Validação contra receita federal (se necessário)
3. Implementar `CNPJValidator`:
   - Validação algorítmica
   - Validação contra receita federal (se necessário)
4. Implementar `EmailValidator`:
   - Validação de formato
   - Validação de MX
5. Implementar `PhoneValidator`:
   - Validação de formato brasileiro
   - Validação de DDD
6. Criar DTOs de validação
7. Integrar validadores em todos os modules
8. Testar validadores
9. Documentar validadores

### Critérios de Aceite
- [x] Módulo de validação criado
- [x] Todos os validadores implementados e testados
- [x] CPFValidator funcionando
- [x] CNPJValidator funcionando
- [x] EmailValidator funcionando
- [x] PhoneValidator funcionando
- [x] Validadores integrados em todos os modules
- [x] Testes unitários com cobertura > 80%
- [x] Documentação completa

### Riscos
- **Risco:** Validação contra receita pode ter custos
- **Mitigação:** Implementar validação algorítmica primeiro, receita como opcional

---

## Task 2.4: Separar Customer de Distributor

**Responsível:** Backend Developer  
**Story Points:** 13  
**Prioridade:** HIGH  
**Dependencies:** Task 2.2

### Descrição
Separar claramente customer (CRM) de distributor (MLM) para seguir bounded contexts corretamente.

### Subtasks
1. Analisar campos MLM em tabela crm.customers
2. Criar migration para mover campos MLM de customers para distribuidores
3. Criar FK de customers para distribuidores (se customer for distribuidor)
4. Separar CustomerService em CustomerService (CRM) e DistributorService (MLM)
5. Atualizar DTOs para refletir separação
6. Atualizar API endpoints
7. Atualizar frontend para usar endpoints corretos
8. Testar separação
9. Documentar separação

### Critérios de Aceite
- [x] Migration criada e aplicada com sucesso
- [x] Campos MLM movidos de customers para distribuidores
- [x] CustomerService e DistributorService separados
- [x] API endpoints atualizados
- [x] Frontend atualizado
- [x] Testes passam
- [x] Documentação atualizada

### Riscos
- **Risco:** Migração pode quebrar dados existentes
- **Mitigação:** Backup antes de migration, testes extensivos, rollback plan

---

## Task 2.5: Implementar Repository Pattern Completo

**Responsável:** Backend Developer  
**Story Points:** 13  
**Prioridade:** HIGH  
**Dependencies:** Nenhuma

### Descrição
Implementar repository pattern em todos os módulos que atualmente não têm.

### Subtasks
1. Identificar módulos sem repository (commissions, qualifications, etc)
2. Criar repositories para módulos sem
3. Padronizar interface de repository
4. Refatorar services para usar repositories
5. Abstrair Supabase client em repository base
6. Testar repositories
7. Documentar repository pattern

### Critérios de Aceite
- [x] Todos os módulos têm repository
- [x] Interface de repository padronizada
- [x] Services usam repositories
- [x] Supabase client abstraído
- [x] Testes unitários com cobertura > 80%
- [x] Documentação atualizada

### Riscos
- **Risco:** Refatoração pode introduzir bugs
- **Mitigação:** Testes extensivos, refatoração incremental

---

# SPRINT 3 - MEDIUM PRIORITY

**Duração:** 2 semanas  
**Story Points:** 81  
**Objetivo:** Resolver issues de média prioridade  
**Status:** ✅ CONCLUÍDO

## Task 3.1: Implementar Custom Claims e Roles

**Responsável:** Backend Developer  
**Story Points:** 13  
**Prioridade:** MEDIUM  
**Dependencies:** Nenhuma

### Descrição
Implementar custom claims no JWT e tabela de roles para autorização granular.

### Subtasks
1. Criar tabela identity.roles
2. Criar tabela identity.user_roles
3. Criar migration para tabelas
4. Implementar service de gestão de roles
5. Implementar custom claims no JWT
6. Atualizar RLS policies para usar roles
7. Atualizar frontend para usar roles
8. Testar roles e claims
9. Documentar roles e claims

### Critérios de Aceite
- [x] Tabelas criadas e migration aplicada
- [x] Service de roles implementado
- [x] Custom claims implementados no JWT
- [x] RLS policies atualizadas
- [x] Frontend atualizado
- [x] Testes passam
- [x] Documentação atualizada

### Riscos
- **Risco:** Custom claims podem aumentar tamanho do JWT
- **Mitigação:** Manter claims mínimos, usar referências por ID

---

## Task 3.2: Criar Módulo Products Backend

**Responsível:** Backend Developer  
**Story Points:** 21  
**Prioridade:** MEDIUM  
**Dependencies:** Nenhuma

### Descrição
Criar módulo backend completo para products com CRUD e inventory management.

### Subtasks
1. Criar módulo `src/backend/modules/products/`
2. Criar estrutura: api/, dto/, repositories/, services/
3. Implementar ProductService:
   - CRUD de produtos
   - Gestão de categorias
   - Gestão de opções
   - Gestão de estoque
4. Implementar CategoryService:
   - CRUD de categorias
   - Hierarquia de categorias
5. Implementar InventoryService:
   - Gestão de estoque
   - Reserva de estoque
   - Alertas de estoque baixo
6. Criar DTOs para products
7. Implementar repositories
8. Implementar API endpoints
9. Integrar com módulo orders
10. Documentar módulo

### Critérios de Aceite
- [x] Módulo products criado com estrutura completa
- [x] ProductService implementado e testado
- [x] CategoryService implementado e testado
- [x] InventoryService implementado e testado
- [x] API endpoints funcionando
- [x] Integração com orders funcionando
- [x] Documentação completa

### Riscos
- **Risco:** Inventory management pode ter race conditions
- **Mitigação:** Implementar locking/transactions, testes de concorrência

---

## Task 3.3: Criar Módulo Qualifications Backend

**Responsível:** Backend Developer  
**Story Points:** 13  
**Prioridade:** MEDIUM  
**Dependencies:** Task 1.2

### Descrição
Criar módulo backend para qualifications com gestão de qualificações e histórico.

### Subtasks
1. Criar módulo `src/backend/modules/qualifications/`
2. Criar estrutura: api/, dto/, repositories/, services/
3. Implementar QualificationService:
   - CRUD de qualificações
   - Cálculo de qualificação atual (usando domain service)
   - Histórico de qualificações
   - Progressão de qualificação
4. Criar DTOs para qualifications
5. Implementar repositories
6. Implementar API endpoints
7. Integrar com módulo mlm
8. Documentar módulo

### Critérios de Aceite
- [x] Módulo qualifications criado com estrutura completa
- [x] QualificationService implementado e testado
- [x] API endpoints funcionando
- [x] Integração com mlm funcionando
- [x] Documentação completa

### Riscos
- **Risco:** Cálculo de qualificação pode estar incorreto
- **Mitigação:** Validação com especialistas de MLM, testes extensivos

---

## Task 3.4: Implementar Vector Database (pgvector)

**Responsável:** AI Engineer  
**Story Points:** 21  
**Prioridade:** MEDIUM  
**Dependencies:** Nenhuma

### Descrição
Implementar vector database usando pgvector para armazenar embeddings e habilitar RAG.

### Subtasks
1. Criar migration para instalar extensão pgvector
2. Criar tabela para embeddings
3. Criar indexes para similarity search
4. Implementar EmbeddingService:
   - Geração de embeddings
   - Armazenamento de embeddings
   - Busca de embeddings
5. Implementar VectorSearchService:
   - Busca semântica
   - Ranking de resultados
6. Integrar com módulo copilot
7. Testar vector database
8. Documentar implementação

### Critérios de Aceite
- [x] pgvector instalado e configurado
- [x] Tabela de embeddings criada
- [x] EmbeddingService implementado e testado
- [x] VectorSearchService implementado e testado
- [x] Integração com copilot funcionando
- [x] Documentação completa

### Riscos
- **Risco:** pgvector pode ter performance limitada em grandes volumes
- **Mitigação:** Testar com volume real, considerar índices apropriados

---

## Task 3.5: Integrar com Provedor de IA Production-Ready

**Responsível:** AI Engineer  
**Story Points:** 13  
**Prioridade:** MEDIUM  
**Dependencies:** Task 3.4

### Descrição
Migrar de Ollama local para provedor de IA production-ready (OpenAI, Anthropic) com rate limiting.

### Subtasks
1. Avaliar provedores (OpenAI, Anthropic)
2. Escolher provedor baseado em custo/performance
3. Implementar adapter para provedor escolhido
4. Implementar rate limiting
5. Atualizar CopilotService para usar novo provedor
6. Implementar fallback para Ollama (se necessário)
7. Testar integração
8. Documentar integração

### Critérios de Aceite
- [x] Provedor escolhido e configurado
- [x] Adapter implementado
- [x] Rate limiting implementado
- [x] CopilotService atualizado
- [x] Fallback implementado (se necessário)
- [x] Testes passam
- [x] Documentação atualizada

### Riscos
- **Risco:** Provedor pode ter custos elevados
- **Mitigação:** Implementar rate limiting, monitorar custos, considerar cache

---

# SPRINT 4 - LOW PRIORITY & OTIMIZAÇÕES

**Duração:** 2 semanas  
**Story Points:** 60  
**Objetivo:** Resolver issues de baixa prioridade e otimizações  
**Status:** ✅ CONCLUÍDO

## Task 4.1: Implementar Caching Layer

**Responsável:** Backend Developer  
**Story Points:** 13  
**Prioridade:** LOW  
**Dependencies:** Nenhuma

### Descrição
Implementar caching layer com Redis para otimizar performance de queries frequentes.

### Subtasks
1. Configurar Redis (local ou Supabase)
2. Criar módulo `src/backend/shared/cache/`
3. Implementar CacheService:
   - Set/get/delete
   - TTL
   - Cache invalidation
4. Identificar queries frequentes para cache
5. Implementar cache de queries frequentes
6. Implementar cache invalidation
7. Testar caching
8. Documentar caching strategy

### Critérios de Aceite
- [x] Redis configurado
- [x] CacheService implementado
- [x] Cache de queries frequentes implementado
- [x] Cache invalidation implementado
- [x] Testes passam
- [x] Documentação atualizada

### Riscos
- **Risco:** Cache pode ter stale data
- **Mitigação:** Implementar TTL apropriado, cache invalidation

---

## Task 4.2: Padronizar Estrutura de Módulos

**Responsável:** Backend Developer  
**Story Points:** 8  
**Prioridade:** LOW  
**Dependencies:** Nenhuma

### Descrição
Garantir que todos os módulos tenham estrutura padronizada (api/, dto/, repositories/, services/).

### Subtasks
1. Auditar estrutura de todos os módulos
2. Criar estrutura padrão para módulos
3. Reorganizar módulos que não seguem padrão
4. Criar template para novos módulos
5. Documentar estrutura padrão
6. Atualizar guidelines de desenvolvimento

### Critérios de Aceite
- [x] Todos os módulos seguem estrutura padrão
- [x] Template criado
- [x] Documentação atualizada
- [x] Guidelines atualizadas

### Riscos
- **Risco:** Reorganização pode quebrar imports
- **Mitigação:** Testes após reorganização, atualização de imports

---

## Task 4.3: Remover Código Morto

**Responsável:** Backend Developer  
**Story Points:** 5  
**Prioridade:** LOW  
**Dependencies:** Nenhuma

### Descrição
Remover scripts Python e arquivos HTML não utilizados da raiz do projeto.

### Subtasks
1. Identificar scripts Python não utilizados
2. Identificar arquivos HTML não utilizados
3. Remover arquivos não utilizados
4. Documentar remoção

### Critérios de Aceite
- [x] Scripts Python não utilizados removidos
- [x] Arquivos HTML não utilizados removidos
- [x] Documentação atualizada

### Riscos
- **Risco:** Pode remover arquivos que são utilizados
- **Mitigação:** Verificar uso antes de remover, backup antes de deletar

---

## Task 4.4: Implementar Testes Unitários

**Responsável:** QA Engineer  
**Story Points:** 21  
**Prioridade:** LOW  
**Dependencies:** Todas as tasks anteriores

### Descrição
Implementar testes unitários para services principais para garantir qualidade de código.

### Subtasks
1. Configurar Jest/Vitest
2. Criar testes para CustomerService
3. Criar testes para OrderService
4. Criar testes para NetworkService
5. Criar testes para CommissionService
6. Criar testes para WithdrawalService
7. Configurar coverage report
8. Integrar testes no CI/CD
9. Documentar testes

### Critérios de Aceite
- [x] Jest/Vitest configurado
- [x] Testes criados para services principais
- [x] Coverage > 80%
- [x] CI/CD integrado
- [x] Documentação atualizada

### Riscos
- **Risco:** Testes podem ser fracos ou falsos positivos
- **Mitigação:** Revisão de testes, testes de integração complementares

---

## Task 4.5: Implementar Monitoring Avançado

**Responsável:** DevOps Engineer  
**Story Points:** 13  
**Prioridade:** LOW  
**Dependencies:** Nenhuma

### Descrição
Configurar Sentry para error tracking e monitoring de performance.

### Subtasks
1. Configurar Sentry
2. Integrar Sentry no backend
3. Integrar Sentry no frontend
4. Configurar error tracking
5. Configurar performance monitoring
6. Configurar alerts
7. Testar monitoring
8. Documentar monitoring

### Critérios de Aceite
- [x] Sentry configurado
- [x] Backend integrado
- [x] Frontend integrado
- [x] Error tracking funcionando
- [x] Performance monitoring funcionando
- [x] Alerts configurados
- [x] Documentação atualizada

### Riscos
- **Risco:** Sentry pode ter custos elevados
- **Mitigação:** Configurar sampling, monitorar custos

---

# RECURSOS NECESSÁRIOS

## Equipe

```yaml
backend_developers: 2
  - Backend Developer (MLM): Sprint 1-3
  - Backend Developer (General): Sprint 1-4
database_engineer: 1
  - Database Engineer: Sprint 2
ai_engineer: 1
  - AI Engineer: Sprint 3
qa_engineer: 1
  - QA Engineer: Sprint 4
devops_engineer: 1
  - DevOps Engineer: Sprint 4
```

## Infraestrutura

```yaml
desenvolvimento:
  - Ambiente de desenvolvimento
  - Database de desenvolvimento
  - Redis local (para caching)

produção:
  - Supabase (já existe)
  - Redis (para caching)
  - Sentry (para monitoring)
  - Provedor de IA (OpenAI/Anthropic)
```

## Ferramentas

```yaml
desenvolvimento:
  - Git
  - VS Code
  - Node.js
  - TypeScript

testing:
  - Jest/Vitest
  - React Testing Library
  - Playwright

monitoring:
  - Sentry
  - Supabase Dashboard
```

---

# RISCOS E MITIGAÇÃO

## Riscos do Projeto

### Risco 1: Atraso no Sprint 1

**Probabilidade:** Média  
**Impacto:** Alto  
**Mitigação:** 
- Priorizar tasks críticas
- Remover tasks não essenciais se necessário
- Adicionar recursos se necessário

### Risco 2: Integração com IA Provedor falhar

**Probabilidade:** Baixa  
**Impacto:** Médio  
**Mitigação:**
- Ter fallback para Ollama
- Testar integração antes de commit
- Considerar múltiplos provedores

### Risco 3: Migration de soft delete quebrar dados

**Probabilidade:** Baixa  
**Impacto:** Alto  
**Mitigação:**
- Backup antes de migration
- Testes extensivos em desenvolvimento
- Rollback plan pronto

### Risco 4: Performance de pgvector insuficiente

**Probabilidade:** Média  
**Impacto:** Médio  
**Mitigação:**
- Testar com volume real
- Considerar índices apropriados
- Fallback para search tradicional se necessário

---

# CRITÉRIOS DE SUCESSO

## Sprint 1

- [x] RLS policies implementadas para todas as tabelas críticas
- [x] Domain services MLM implementados e testados
- [x] Domain services Finance implementados e testados
- [x] Módulo Logistics criado e funcionando
- [x] Módulo Finance criado e funcionando
- [x] Todos os testes passam
- [x] Documentação atualizada

## Sprint 2

- [x] Missing indexes adicionados
- [x] Soft delete implementado
- [x] Validation layer padronizado
- [x] Customer e Distributor separados
- [x] Repository pattern completo
- [x] Todos os testes passam
- [x] Documentação atualizada

## Sprint 3

- [x] Custom claims e roles implementados
- [x] Módulo Products criado e funcionando
- [x] Módulo Qualifications criado e funcionando
- [x] Vector database implementado
- [x] Provedor de IA integrado
- [x] Todos os testes passam
- [x] Documentação atualizada

## Sprint 4

- [x] Caching layer implementado
- [x] Estrutura de módulos padronizada
- [x] Código morto removido
- [x] Testes unitários implementados
- [x] Monitoring avançado configurado
- [x] Todos os testes passam
- [x] Documentação atualizada

---

# CHECKLIST DE PRODUÇÃO

## Pré-Produção

### Segurança
- [x] RLS policies implementadas e testadas
- [x] Custom claims e roles implementados
- [x] Validation layer padronizado
- [x] Secrets gerenciados corretamente
- [x] Service role keys rotacionados

### Performance
- [x] Missing indexes adicionados
- [x] Caching layer implementado
- [ ] Queries otimizadas
- [ ] N+1 queries eliminados
- [ ] Bundle size otimizado

### Qualidade
- [x] Testes unitários implementados (cobertura > 80%)
- [ ] Testes de integração implementados
- [ ] E2E tests implementados para caminhos críticos
- [ ] Code review realizado
- [x] Documentação atualizada

### Monitoramento
- [x] Sentry configurado
- [x] Error tracking funcionando
- [x] Performance monitoring funcionando
- [x] Alerts configurados
- [x] Logs centralizados

### Backup e Recovery
- [x] Backup automático configurado
- [ ] Restore testado
- [x] Disaster recovery plan documentado
- [x] RTO e RPO definidos

### Compliance
- [x] LGPD compliance verificado
- [x] PCI-DSS compliance verificado
- [x] Retenção de dados definida
- [x] Política de privacidade documentada

## Pós-Produção

### Monitoramento
- [ ] Monitorar erros (Sentry)
- [ ] Monitorar performance
- [ ] Monitorar custos
- [ ] Monitorar uptime

### Suporte
- [ ] Equipe de suporte treinada
- [ ] Documentação de suporte criada
- [ ] Processos de escalonamento definidos
- [ ] Canais de suporte configurados

### Melhoria Contínua
- [ ] Feedback de usuários coletado
- [ ] Métricas de sucesso definidas
- [ ] Processo de melhoria contínua estabelecido
- [ ] Roadmap futuro definido

---

# CONCLUSÃO

Este plano de ação detalhado fornece um roadmap claro para preparar a plataforma AllIn OS 2.0 para produção em 8 semanas (4 sprints). O plano prioriza issues críticos e de alta prioridade nos primeiros sprints, seguidos por melhorias de média e baixa prioridade.

Com a execução deste plano, a plataforma atingirá um nível de qualidade enterprise-ready com Implementation Score estimado de 9/10.

**Documentos Relacionados:**
- AUDITORIA-TECNICA-COMPLETA.md
- 03-IMPLEMENTATION-BLUEPRINT.md
- 04-DOMAIN-DECISIONS.md
