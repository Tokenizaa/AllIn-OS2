# Análise do Estado Atual do RBAC

## Visão Geral

O sistema possui uma implementação de RBAC (Role-Based Access Control) parcialmente funcional, mas com algumas inconsistências e áreas para melhoria.

## Estrutura Atual

### 1. Definição de Papéis (Roles)

**Arquivo:** `src/shared/types/roles.ts`

**Papéis Definidos:**
- **Administrativos:** `admin_master`, `gestao_admin`
- **Departamentais:** `financeiro`, `suporte`, `logistica`, `marketing`, `analytics`, `auditor`, `operador`
- **Negócio:** `distribuidor`, `afiliado`, `cliente_final`

**Categorias:**
- `RoleCategory.ADMINISTRATIVE`
- `RoleCategory.DEPARTMENTAL`
- `RoleCategory.BUSINESS`

**Status:** ✅ Bem estruturado e centralizado

### 2. Matriz de Permissões

**Arquivo:** `src/modules/auth/permissions/permissions.ts`

**Permissões por Papel:**
- `admin_master`: 11 permissões (acesso total a todos os módulos)
- `gestao_admin`: 8 permissões (acesso gerencial)
- `financeiro`: 4 permissões (foco em finance)
- `suporte`: 3 permissões (foco em support)
- `logistica`: 4 permissões (foco em logistics)
- `marketing`: 3 permissões (foco em marketing)
- `analytics`: 2 permissões (foco em analytics)
- `auditor`: 4 permissões (foco em auditoria)
- `operador`: 3 permissões (foco em operações)
- `distribuidor`: 4 permissões (foco em rede e pedidos)
- `afiliado`: 3 permissões (foco em rede)
- `cliente_final`: 2 permissões (foco em compras)

**Módulos Cobertos:**
- dashboard
- analytics
- finance
- support
- network
- orders
- products
- marketing
- settings
- system
- industrial

**Status:** ✅ Bem definido, mas pode ser expandido

### 3. Hooks Frontend

**Arquivos:**
- `src/modules/auth/hooks/usePermissions.ts` - Verifica permissões do usuário
- `src/modules/auth/hooks/useRole.ts` - Verifica categorias de papéis

**Funcionalidades:**
- `hasPermission(module, action)` - Verifica permissão específica
- `canRead(module)` - Verifica permissão de leitura
- `canWrite(module)` - Verifica permissão de escrita
- `canDelete(module)` - Verifica permissão de exclusão
- `canManage(module)` - Verifica permissão de gerenciamento
- `isAdmin()`, `isDepartment()`, `isBusiness()` - Verifica categorias

**Status:** ✅ Bem implementado

### 4. Middleware Backend

**Arquivo:** `src/backend/shared/middleware/role.middleware.ts`

**Funcionalidades:**
- `hasRole(...roles)` - Verifica se usuário tem role específica
- `hasPermission(resource, action)` - Verifica permissão específica
- `isAdmin()`, `isDistributor()`, `isCustomer()`, `isManager()`, `isSupport()` - Verificações de role específicas
- `getUserRoles(req)` - Extrai roles do usuário
- `getUserPermissions(req)` - Extrai permissões do usuário

**Status:** ⚠️ Implementado, mas não usa os tipos centralizados de `shared/types/roles.ts`

### 5. Guards Backend

**Arquivo:** `src/backend/modules/auth/guards/permission.guard.ts`

**Funcionalidades:**
- `hasPermission(userPermissions, requiredPermission)` - Verifica permissão
- `hasAnyPermission(userPermissions, requiredPermissions)` - Verifica qualquer permissão
- `hasAllPermissions(userPermissions, requiredPermissions)` - Verifica todas as permissões
- `ROLE_PERMISSIONS` - Mapeamento de roles para permissões (duplicado)

**Status:** ⚠️ Duplica a lógica de permissões que já existe no frontend

## Problemas Identificados

### 1. Inconsistência de Tipos

**Problema:** O backend usa tipos diferentes do frontend para roles e permissões.

**Backend:**
```typescript
// src/backend/shared/middleware/role.middleware.ts
export interface UserRole {
  roles: string[];
  permissions: any[];
}

// Usa strings simples: 'admin', 'distributor', 'customer'
```

**Frontend:**
```typescript
// src/shared/types/roles.ts
export enum UserRole {
  ADMIN_MASTER = 'admin_master',
  DISTRIBUIDOR = 'distribuidor',
  // ...
}
```

**Impacto:** Dificulta manutenção e pode causar erros de sincronização.

### 2. Duplicação de Lógica

**Problema:** A matriz de permissões está duplicada entre frontend e backend.

**Frontend:** `src/modules/auth/permissions/permissions.ts`
**Backend:** `src/backend/modules/auth/guards/permission.guard.ts`

**Impacto:** Manutenção difícil, risco de inconsistência.

### 3. Falta de Integração com HTTP API

**Problema:** O middleware de RBAC no backend não está integrado com o novo HTTP API server criado na Fase 1.

**Impacto:** As rotas do HTTP API não estão protegidas por RBAC.

### 4. Permissões Granulares Insuficientes

**Problema:** Algumas operações podem precisar de permissões mais granulares.

**Exemplos:**
- `finance` pode precisar de permissões separadas para: `saques_aprovar`, `saques_rejeitar`, `bônus_visualizar`
- `orders` pode precisar de: `orders_criar`, `orders_editar`, `orders_cancelar`, `orders_excluir`

### 5. Falta de Auditoria

**Problema:** Não há registro de auditoria para verificações de permissão e acessos negados.

**Impacto:** Dificulta rastreamento de problemas de segurança.

### 6. Falta de Testes

**Problema:** Não há testes automatizados para o sistema de RBAC.

**Impacto:** Risco de regressões em mudanças.

## Plano de Melhorias

### Fase 4.1: Unificar Tipos (1 dia)

**Objetivo:** Unificar os tipos de roles e permissões entre frontend e backend.

**Ações:**
1. Mover `src/shared/types/roles.ts` para `shared/types/roles.ts` (já está lá)
2. Criar `shared/types/permissions.ts` com tipos centralizados de permissões
3. Atualizar backend para usar tipos de `shared/types/`
4. Remover tipos duplicados do backend

**Arquivos a criar/modificar:**
- `shared/types/permissions.ts` (novo)
- `src/backend/shared/middleware/role.middleware.ts` (atualizar)
- `src/backend/modules/auth/guards/permission.guard.ts` (atualizar)

### Fase 4.2: Centralizar Matriz de Permissões (1 dia)

**Objetivo:** Centralizar a matriz de permissões em um único arquivo compartilhado.

**Ações:**
1. Criar `shared/config/role-permissions.ts` com matriz centralizada
2. Atualizar frontend para usar matriz centralizada
3. Atualizar backend para usar matriz centralizada
4. Remover matrizes duplicadas

**Arquivos a criar/modificar:**
- `shared/config/role-permissions.ts` (novo)
- `src/modules/auth/permissions/permissions.ts` (atualizar)
- `src/backend/modules/auth/guards/permission.guard.ts` (atualizar)

### Fase 4.3: Integrar RBAC com HTTP API (1 dia)

**Objetivo:** Proteger as rotas do HTTP API com middleware de RBAC.

**Ações:**
1. Atualizar middleware de autenticação para incluir roles e permissões
2. Adicionar middleware de RBAC às rotas do HTTP API
3. Criar decorator/helper para aplicar RBAC em rotas
4. Testar proteção de rotas

**Arquivos a criar/modificar:**
- `src/backend/server/middleware/auth.middleware.ts` (atualizar)
- `src/backend/server/middleware/rbac.middleware.ts` (novo)
- `src/backend/server/routes/*.ts` (adicionar middleware)

### Fase 4.4: Refinar Permissões Granulares (1 dia)

**Objetivo:** Adicionar permissões mais granulares para operações específicas.

**Ações:**
1. Analisar cada módulo e identificar operações que precisam de permissões granulares
2. Adicionar novas permissões à matriz
3. Atualizar hooks e middleware
4. Documentar novas permissões

**Arquivos a modificar:**
- `shared/config/role-permissions.ts`
- `src/modules/auth/permissions/permissions.ts`

### Fase 4.5: Adicionar Auditoria (1 dia)

**Objetivo:** Implementar sistema de auditoria para acessos e verificações de permissão.

**Ações:**
1. Criar tabela de auditoria no banco
2. Implementar middleware de auditoria
3. Registrar acessos negados
4. Criar dashboard de auditoria

**Arquivos a criar/modificar:**
- `supabase/migrations/*_audit_log.sql` (novo)
- `src/backend/shared/middleware/audit.middleware.ts` (novo)
- `src/backend/modules/audit/services/audit.service.ts` (novo)

### Fase 4.6: Adicionar Testes (opcional)

**Objetivo:** Criar testes automatizados para o sistema de RBAC.

**Ações:**
1. Criar testes unitários para hooks
2. Criar testes de integração para middleware
3. Criar testes E2E para fluxos de autorização

**Arquivos a criar:**
- `src/modules/auth/hooks/__tests__/usePermissions.test.ts`
- `src/backend/shared/middleware/__tests__/role.middleware.test.ts`

## Prioridade das Melhorias

1. **Alta:** Unificar tipos (Fase 4.1)
2. **Alta:** Centralizar matriz de permissões (Fase 4.2)
3. **Alta:** Integrar RBAC com HTTP API (Fase 4.3)
4. **Média:** Refinar permissões granulares (Fase 4.4)
5. **Média:** Adicionar auditoria (Fase 4.5)
6. **Baixa:** Adicionar testes (Fase 4.6)

## Estimativa de Tempo

- Fase 4.1: 1 dia
- Fase 4.2: 1 dia
- Fase 4.3: 1 dia
- Fase 4.4: 1 dia
- Fase 4.5: 1 dia
- Fase 4.6: 1 dia (opcional)

**Total:** 5-6 dias (conforme estimativa original)
