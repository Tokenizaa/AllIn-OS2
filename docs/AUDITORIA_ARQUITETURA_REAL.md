# Auditoria de Arquitetura Real - AllIn OS 2.0

**Data:** 2026-06-16  
**Objetivo:** Inventário completo da arquitetura atual de identidade e dados

---

## Resumo Executivo

A auditoria anterior fez **assunções incorretas** sobre a arquitetura. A arquitetura real é diferente da proposta anterior.

**Arquitetura Real:**
```
auth.users (12 usuários)
    ↓
crm.customers (113 total, 12 vinculados)
    ↓
mlm.distribuidores (tem patrocinador_id, perna_esquerda_id, perna_direita_id)
```

**Tabelas que JÁ EXISTEM:**
- `identity.roles`
- `identity.user_roles`
- `identity.referral_tracking`

**Tabelas que NÃO EXISTEM:**
- `profiles` (nunca existiu)
- `public.referral_tracking` (existe em identity.referral_tracking)

---

## Problema 1: Migração Incompleta de Arquitetura

### Estado Atual

**crm.customers:**
- Total: 113 registros
- Com auth_user_id: 12 registros
- Sem auth_user_id: 101 registros

**auth.users:**
- Total: 12 usuários
- Todos têm correspondente em crm.customers
- NENHUM usuário órfão

### Diagnóstico

O sistema foi parcialmente migrado de uma arquitetura antiga para a nova:

**Arquitetura Antiga (provável):**
```
crm.customers (sem auth_user_id)
```

**Arquitetura Nova (em andamento):**
```
auth.users
    ↓
crm.customers (com auth_user_id)
```

**Problema:**
- 101 clientes foram criados SEM vinculação com auth.users
- Apenas 12 clientes têm vinculação com auth.users
- O fluxo de cadastro NÃO está criando o registro em crm.customers

---

## Problema 2: Erro no Código - user_id vs auth_user_id

### Localização

**Arquivos afetados:**
- `src/modules/auth/services/supabase.service.ts`
- `src/modules/auth/services/auth.service.ts`

### Erro

O código estava usando `user_id` mas a coluna no banco é `auth_user_id`:

```typescript
// INCORRETO (antes)
.eq("user_id", userId)

// CORRETO (depois)
.eq("auth_user_id", userId)
```

### Impacto

- Login funcionava (auth.signInWithPassword)
- Busca de perfil falhava (fetchUserProfile)
- Mensagem: "Perfil de usuário não encontrado"

### Status

✅ **FIXADO** - Todos os references foram corrigidos para `auth_user_id`

---

## Problema 3: Uso de .schema() está CORRETO

### Diagnóstico

A auditoria anterior sugeriu que `.schema()` estava sendo usado incorretamente.

**Verificação:**
```typescript
// distributor.repository.ts - USO CORRETO
.getClient()
  .schema("mlm")
  .from("distribuidores")
```

Este é o uso correto do Supabase JS v2.

**NÃO há uso incorreto de .schema() no código.**

---

## Inventário Completo de Tabelas

### Schema: auth

| Tabela | Colunas Principais | Registros |
|--------|-------------------|-----------|
| users | id, email, encrypted_password, etc | 12 |

### Schema: crm

| Tabela | Colunas Principais | Registros |
|--------|-------------------|-----------|
| customers | id, auth_user_id, nome, email, cpf, telefone, tipo_cliente, status, patrocinador_id, etc | 113 |
| customer_distributor | (relacionamento) | ? |

**Colunas críticas de crm.customers:**
- `auth_user_id` (uuid, nullable) - FK para auth.users
- `tipo_cliente` (varchar) - Tipo de cliente
- `status` (varchar) - Status do cliente
- `patrocinador_id` (text) - ID do patrocinador
- `usuario` (varchar) - Username/Slug
- `metadata` (jsonb) - Dados adicionais

### Schema: mlm

| Tabela | Colunas Principais | Registros |
|--------|-------------------|-----------|
| distribuidores | id, auth_user_id, usuario, patrocinador_id, perna_esquerda_id, perna_direita_id, etc | ? |
| planos | Planos de distribuição | ? |
| bonus_historico | Histórico de bônus | ? |
| bonus_regras | Regras de bônus | ? |
| comissoes | Comissões | ? |
| distribuidor_conta_bancaria | Contas bancárias | ? |
| planos_distribuidores | Relacionamento plano-distribuidor | ? |
| pontos_saldo | Saldo de pontos | ? |
| pontos_transacoes | Transações de pontos | ? |
| qualificacoes | Qualificações | ? |
| qualificacoes_historico | Histórico de qualificações | ? |
| rede_linear_nos | Nós da rede linear | ? |

**Colunas críticas de mlm.distribuidores:**
- `auth_user_id` (uuid, nullable) - FK para auth.users
- `patrocinador_id` (text) - ID do patrocinador
- `perna_esquerda_id` (text) - ID da perna esquerda
- `perna_direita_id` (text) - ID da perna direita

### Schema: identity

| Tabela | Colunas Principais | Registros |
|--------|-------------------|-----------|
| roles | id, name, description | ? |
| user_roles | user_id, role_id | ? |
| referral_tracking | (tracking de referrals) | ? |

### Schema: public

| Tabela | Colunas Principais | Registros |
|--------|-------------------|-----------|
| produtos | id, name, category, price, status, etc | ? |
| pedidos | Pedidos | ? |
| order_items | Itens de pedidos | ? |
| payment_attempts | Tentativas de pagamento | ? |
| planos | Planos (duplicado?) | ? |
| copilot_* | Tabelas do Copilot | ? |

---

## Fluxo de Identidade Real

### Fluxo Atual (Quebrado)

```
1. Usuário se cadastra
   ↓
2. auth.signUp() cria auth.users
   ↓
3. [FALHA] Não cria crm.customers
   ↓
4. Login funciona
   ↓
5. fetchUserProfile() falha (não encontra crm.customers)
```

### Fluxo Correto (Necessário)

```
1. Usuário se cadastra
   ↓
2. auth.signUp() cria auth.users
   ↓
3. Trigger ou código cria crm.customers com auth_user_id
   ↓
4. Login funciona
   ↓
5. fetchUserProfile() encontra crm.customers
```

---

## Recomendações

### 1. NÃO criar tabela `profiles`

A auditoria anterior sugeriu criar `profiles`. Isso seria um erro porque:

- A arquitetura atual usa `crm.customers` como fonte de verdade
- Criar `profiles` seria uma QUARTA fonte de identidade
- Isso aumentaria a complexidade sem necessidade

### 2. Corrigir o fluxo de cadastro

**Opção A: Trigger SQL**
```sql
CREATE TRIGGER create_customer_after_auth
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION create_customer_record();
```

**Opção B: Corrigir código de registro**
O código em `auth.service.ts` já tenta criar crm.customers, mas pode estar falhando silenciosamente.

### 3. Migrar os 101 clientes órfãos

Os 101 clientes sem auth_user_id precisam ser:
- Mantidos como legado (sem login)
- Ou migrados para ter auth_user_id (criar auth.users para eles)

### 4. Usar identity.referral_tracking (já existe)

A tabela `identity.referral_tracking` já existe. Não criar `public.referral_tracking`.

### 5. Implementar role-based access com identity.user_roles

A tabela `identity.user_roles` já existe. Usar ela para gerenciar permissões.

---

## Próximos Passos

### Imediato

1. ✅ Fixar user_id → auth_user_id (FEITO)
2. Testar login com usuário existente
3. Verificar se cadastro cria crm.customers

### Curto Prazo

1. Criar trigger ou corrigir código de cadastro
2. Migrar ou documentar os 101 clientes órfãos
3. Implementar RLS policies adequadas

### Médio Prazo

1. Auditoria de RLS policies
2. Implementar role-based access com identity.user_roles
3. Documentar fluxo de cadastro completo

---

## Conclusão

A arquitetura real é diferente da assumida na auditoria anterior. O problema principal é uma **migração incompleta** de arquitetura, não falta de tabelas.

**Não criar novas tabelas sem necessidade.** A arquitetura atual (auth.users → crm.customers → mlm.distribuidores) é sólida, apenas precisa ser completada e corrigida.
