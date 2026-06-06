# Auditoria de Login, Cadastro e Acessos por Role

**Data:** 06/06/2026
**Escopo:** Páginas de login, cadastro e sistema de controle de acesso por role

---

## 1. Visão Geral

### Arquivos Auditados

**Login:**
- `src/routes/login.tsx` - Rota de login
- `src/components/auth/login-view.tsx` - Componente de login

**Cadastro:**
- `src/routes/cadastro.tsx` - Página de cadastro

**Role & Permissions:**
- `src/shared/types/roles.ts` - Definições de roles
- `src/modules/auth/permissions/role-matrix.ts` - Matriz de categorização de roles
- `src/modules/auth/permissions/permissions.ts` - Matriz de permissões por role
- `src/modules/auth/navigation.ts` - Redirecionamento por role

**Guards & Auth:**
- `src/modules/auth/guards/PermissionGuard.tsx` - Guard de permissões
- `src/modules/auth/guards/RoleGuard.tsx` - Guard de roles
- `src/modules/auth/guards/RouteGuard.tsx` - Guard de rotas
- `src/modules/auth/context/AuthProvider.tsx` - Contexto de autenticação
- `src/modules/auth/hooks/usePermissions.ts` - Hook de permissões

**Rotas Protegidas:**
- `src/routes/_app.tsx` - Layout admin protegido
- `src/routes/office.tsx` - Layout office protegido

---

## 2. Análise do Login

### 2.1 Implementação Atual

**Arquivo:** `src/routes/login.tsx`
- Rota simples que renderiza `LoginView` component
- Sem lógica adicional

**Arquivo:** `src/components/auth/login-view.tsx`
- Formulário de login com email e senha
- **Test Login Accounts** - Contas de teste hardcoded para desenvolvimento:
  - Admin Master
  - Gestão Admin
  - Financeiro
  - Suporte
  - Distribuidor
- Redirecionamento automático baseado em role após login
- Exibe sponsor ativo se presente na URL

### 2.2 Problemas Identificados

#### 🔴 CRÍTICO - Contas de Teste em Produção
```typescript
// login-view.tsx linhas 186-210
{getTestLoginAccounts().map((account) => {
  // Botões de login rápido com credenciais hardcoded
})}
```
- **Risco:** Credenciais de teste expostas no código
- **Impacto:** Se não removido em produção, permite acesso não autorizado
- **Recomendação:** Remover ou condicionar a `process.env.NODE_ENV === 'development'`

#### 🟡 MÉDIO - Redirecionamento por Role
```typescript
// login-view.tsx linha 23
navigate({ to: getRoleRedirectPath(user), replace: true });
```
- Redirecionamento correto implementado
- Usa `navigation.ts` para definir paths por role
- **Status:** ✅ Funcionando corretamente

---

## 3. Análise do Cadastro

### 3.1 Implementação Atual

**Arquivo:** `src/routes/cadastro.tsx`
- Seleção de role: "Distribuidor MLM" ou "Cliente de Venda Direta"
- Validação de sponsor code em tempo real
- Campos obrigatórios: nome, email, telefone, CPF, senha
- Sponsor obrigatório para CLIENTE_FINAL
- Redirecionamento após cadastro baseado em role:
  - DISTRIBUIDOR → `/ativacao`
  - CLIENTE_FINAL → `/office/store`

### 3.2 Problemas Identificados

#### 🟡 MÉDIO - Type Safety com Roles
```typescript
// cadastro.tsx linhas 23, 123, 134
const [role, setRole] = useState<UserRole>(UserRole.DISTRIBUIDOR);
// ...
onClick={() => setRole("distributor" as any)}  // ❌ String literal
onClick={() => setRole("customer" as any)}     // ❌ String literal
```
- **Problema:** Usa strings literais em vez de `UserRole.DISTRIBUIDOR` e `UserRole.CLIENTE_FINAL`
- **Risco:** Type safety comprometido, possíveis erros em runtime
- **Recomendação:** Usar valores do enum `UserRole`

#### 🟡 MÉDIO - Validação de Sponsor
```typescript
// cadastro.tsx linhas 28-44
useEffect(() => {
  if (sponsorCode.trim()) {
    const match = usersList.find(
      (u) =>
        u.role === UserRole.DISTRIBUIDOR &&
        (u.referral_code?.toLowerCase() === sponsorCode.trim().toLowerCase() ||
          u.id.toLowerCase() === sponsorCode.trim().toLowerCase())
    );
    // ...
  }
}, [sponsorCode, usersList]);
```
- **Problema:** Valida apenas se sponsor existe, não se está ativo/validado
- **Risco:** Permite cadastro com sponsor inativo ou bloqueado
- **Recomendação:** Adicionar verificação de status do sponsor

#### 🟢 BAIXO - Fallback Sponsor
```typescript
// cadastro.tsx linha 76
sponsor_id: sponsorCode || "user-admin-master"
```
- **Problema:** Fallback hardcoded para admin master
- **Risco:** Todos os cadastros sem sponsor ficam vinculados ao admin
- **Recomendação:** Considerar se este comportamento é desejado

---

## 4. Análise de Roles e Permissões

### 4.1 Definição de Roles

**Arquivo:** `src/shared/types/roles.ts`

**Roles Definidas (11 total):**
- **Administrativas (2):** ADMIN_MASTER, GESTAO_ADMIN
- **Departamentais (7):** FINANCEIRO, SUPORTE, LOGISTICA, MARKETING, ANALYTICS, AUDITOR, OPERADOR
- **Business (3):** DISTRIBUIDOR, AFILIADO, CLIENTE_FINAL

**Status:** ✅ Bem estruturado e categorizado

### 4.2 Matriz de Permissões

**Arquivo:** `src/modules/auth/permissions/permissions.ts`

**Permissões por Role:**
- **admin_master:** Acesso total a todos os módulos
- **gestao_admin:** Acesso a dashboard, analytics, support, orders, products, marketing, system (read)
- **financeiro:** dashboard (read), analytics (read), finance (manage), orders (read)
- **suporte:** dashboard (read), support (manage), orders (read)
- **logistica:** dashboard (read), orders (manage), products (read)
- **marketing:** dashboard (read), marketing (manage), products (read)
- **analytics:** dashboard (read), analytics (all)
- **auditor:** dashboard (read), analytics (read), finance (read), system (read)
- **operador:** dashboard (read), orders (write), support (read)
- **distribuidor:** dashboard (read), network (read), orders (write), finance (write)
- **afiliado:** dashboard (read), network (read), orders (read)
- **cliente_final:** orders (write), dashboard (read)

**Status:** ✅ Matriz bem definida e granular

### 4.3 Redirecionamento por Role

**Arquivo:** `src/modules/auth/navigation.ts`

**Paths de Redirecionamento:**
```typescript
ROLE_REDIRECT_PATHS = {
  ADMIN_MASTER: "/analytics",
  GESTAO_ADMIN: "/analytics",
  FINANCEIRO: "/wallets",
  SUPORTE: "/customers",
  LOGISTICA: "/office",
  MARKETING: "/office",
  ANALYTICS: "/office",
  AUDITOR: "/office",
  OPERADOR: "/office",
  DISTRIBUIDOR: "/office",
  AFILIADO: "/office",
  CLIENTE_FINAL: "/loja"
}
```

**Status:** ✅ Redirecionamento apropriado por role

---

## 5. Análise de Guards e Proteção de Rotas

### 5.1 RouteGuard

**Arquivo:** `src/modules/auth/guards/RouteGuard.tsx`

**Funcionalidades:**
- Verifica autenticação (redireciona para /login se não autenticado)
- Verifica roles permitidas (redireciona para path primário da role)
- Verifica permissões por path usando `PATH_PERMISSION_MAP`
- Usa `usePermissions` hook para verificar permissões

**PATH_PERMISSION_MAP:**
```typescript
[
  { pattern: /^\/system/, permission: { module: "system", action: "read" } },
  { pattern: /^\/wallets/, permission: { module: "finance", action: "read" } },
  { pattern: /^\/analytics/, permission: { module: "analytics", action: "read" } },
  { pattern: /^\/customers/, permission: { module: "support", action: "read" } },
  { pattern: /^\/orders/, permission: { module: "orders", action: "read" } },
  { pattern: /^\/products/, permission: { module: "products", action: "read" } },
  { pattern: /^\/network/, permission: { module: "network", action: "read" } },
  { pattern: /^\/commissions/, permission: { module: "finance", action: "read" } },
  { pattern: /^\/marketing/, permission: { module: "marketing", action: "read" } },
  { pattern: /^\/settings/, permission: { module: "settings", action: "read" } },
  { pattern: /^\/office/, permission: { module: "dashboard", action: "read" } }
]
```

**Status:** ✅ Implementação robusta com verificação de permissões

### 5.2 Proteção de Rotas

**_app.tsx (Layout Admin):**
```typescript
<RouteGuard allowedRoles={[
  UserRole.ADMIN_MASTER,
  UserRole.GESTAO_ADMIN,
  UserRole.FINANCEIRO,
  UserRole.SUPORTE
]}>
```
- **Status:** ✅ Restrito a roles administrativas e departamentais específicas

**office.tsx (Layout Office):**
```typescript
<RouteGuard allowedRoles={[
  UserRole.DISTRIBUIDOR,
  UserRole.AFILIADO,
  UserRole.CLIENTE_FINAL,
  UserRole.ADMIN_MASTER,
  UserRole.GESTAO_ADMIN,
  UserRole.FINANCEIRO,
  UserRole.SUPORTE,
  UserRole.LOGISTICA,
  UserRole.MARKETING,
  UserRole.ANALYTICS,
  UserRole.AUDITOR,
  UserRole.OPERADOR
]}>
```
- **Status:** ⚠️ Permite TODAS as roles (11/11)
- **Problema:** Roles departamentais (LOGISTICA, MARKETING, ANALYTICS, AUDITOR, OPERADOR) têm acesso ao office
- **Recomendação:** Revisar se roles departamentais devem ter acesso ao office ou criar layout específico

---

## 6. Problemas de Segurança Identificados

### 🔴 CRÍTICO

1. **Contas de Teste Expostas**
   - **Local:** `src/components/auth/login-view.tsx`
   - **Descrição:** Botões de login rápido com credenciais hardcoded
   - **Risco:** Acesso não autorizado em produção
   - **Ação Imediata:** Remover ou condicionar a ambiente de desenvolvimento

### 🟡 MÉDIO

2. **Type Safety no Cadastro**
   - **Local:** `src/routes/cadastro.tsx`
   - **Descrição:** Usa strings literais para seleção de role
   - **Risco:** Erros de tipo em runtime
   - **Ação:** Usar valores do enum `UserRole`

3. **Validação de Sponsor Incompleta**
   - **Local:** `src/routes/cadastro.tsx`
   - **Descrição:** Valida apenas existência, não status do sponsor
   - **Risco:** Cadastro com sponsor inativo/bloqueado
   - **Ação:** Adicionar verificação de status do sponsor

4. **Office Acessível para Todas as Roles**
   - **Local:** `src/routes/office.tsx`
   - **Descrição:** RouteGuard permite todas as 11 roles
   - **Risco:** Acesso inadequado para roles departamentais
   - **Ação:** Revisar permissões de acesso ao office

### 🟢 BAIXO

5. **Fallback Sponsor Hardcoded**
   - **Local:** `src/routes/cadastro.tsx`
   - **Descrição:** Fallback para "user-admin-master"
   - **Risco:** Todos os cadastros sem sponsor ficam com admin
   - **Ação:** Revisar se comportamento é desejado

---

## 7. Recomendações

### Imediatas (Prioridade Alta)

1. **Remover contas de teste em produção**
   ```typescript
   // Condicionar a ambiente de desenvolvimento
   {process.env.NODE_ENV === 'development' && (
     getTestLoginAccounts().map((account) => { /* ... */ })
   )}
   ```

2. **Corrigir type safety no cadastro**
   ```typescript
   // Usar valores do enum
   onClick={() => setRole(UserRole.DISTRIBUIDOR)}
   onClick={() => setRole(UserRole.CLIENTE_FINAL)}
   ```

3. **Revisar proteção do office**
   - Considerar criar layout específico para roles departamentais
   - Ou restringir office apenas a roles business (DISTRIBUIDOR, AFILIADO, CLIENTE_FINAL)

### Curto Prazo

4. **Melhorar validação de sponsor**
   - Verificar status do sponsor (ativo/inativo)
   - Verificar se sponsor está em compliance
   - Adicionar validação no backend

5. **Implementar verificação de permissões em componentes**
   - Usar `PermissionGuard` para proteger ações específicas
   - Usar `RoleGuard` para proteger seções de UI

### Longo Prazo

6. **Auditoria de permissões**
   - Revisar se todas as permissões estão sendo usadas
   - Verificar se há permissões faltantes
   - Documentar cada permissão e seu propósito

7. **Implementar RBAC granular**
   - Considerar permissões por recurso específico
   - Exemplo: `orders:read:own` vs `orders:read:all`

---

## 8. Conclusão

O sistema de autenticação e controle de acesso está **bem estruturado** com:
- ✅ Definição clara de roles e categorias
- ✅ Matriz de permissões granular
- ✅ Guards implementados (PermissionGuard, RoleGuard, RouteGuard)
- ✅ Redirecionamento apropriado por role
- ✅ Hook de permissões funcional

**Pontos de Melhoria:**
- 🔴 Remover contas de teste de produção
- 🟡 Melhorar type safety no cadastro
- 🟡 Revisar proteção do office
- 🟡 Melhorar validação de sponsor

**Status Geral:** ✅ Sistema funcional com melhorias necessárias para produção
