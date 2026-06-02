# Plano de Refatoração do auth-context.tsx

**Data:** 2026-05-31  
**Status:** Planejamento  
**Objetivo:** Modularizar auth-context.tsx (1300+ linhas) em estrutura organizada

---

## 1. Mapeamento de Dependências

### 1.1 Exports do auth-context.tsx

**Types:**
- `User`
- `DistributorProfile`
- `CustomerReferral`
- `AuditLog`
- `Permission`
- `AdminInvite`

**Components:**
- `AuthProvider`
- `RouteGuard`
- `RoleGuard`
- `PermissionGuard`

**Hooks:**
- `useAuth`
- `usePermissions`

### 1.2 Consumo por Arquivo (21 arquivos)

| Arquivo | Imports | Uso Principal |
|---------|---------|---------------|
| `src/components/UserMenu.tsx` | `useAuth` | user, signOut |
| `src/components/app/public-header.tsx` | `useAuth` | user state |
| `src/components/app/sidebar-nav.tsx` | `useAuth, usePermissions` | user, permissions |
| `src/components/distributor/sidebar.tsx` | `useAuth` | user state |
| `src/components/system/invites-management.tsx` | `useAuth, AdminInvite, UserRole` | user, invites, roles |
| `src/components/system/user-management.tsx` | `useAuth, User, UserRole` | user, users, roles |
| `src/lib/distributor-context.tsx` | `useAuth` | user state |
| `src/routes/$slug.tsx` | `useAuth` | user state |
| `src/routes/__root.tsx` | `AuthProvider` | provider wrapper |
| `src/routes/_app.tsx` | `RouteGuard, useAuth` | route protection |
| `src/routes/ativacao.tsx` | `useAuth` | user state |
| `src/routes/auth.invite.$token.tsx` | `useAuth` | user state |
| `src/routes/cadastro.tsx` | `useAuth, UserRole` | user, role |
| `src/routes/login.tsx` | `useAuth` | login, user |
| `src/routes/loja.$slug.tsx` | `useAuth` | user state |
| `src/routes/office.tsx` | `RouteGuard` | route protection |
| `src/routes/office/store.tsx` | `useAuth` | user state |
| `src/routes/produto.$id.tsx` | `useAuth` | user state |
| `src/routes/recuperar-senha.tsx` | `useAuth` | user state |
| `src/routes/redefinir-senha.tsx` | `useAuth` | user state |
| `src/routes/seja-distribuidor.$slug.tsx` | `useAuth` | user state |

---

## 2. Estrutura Atual

```
src/lib/auth-context.tsx (1300+ linhas)
├── Types & Interfaces
├── Default State (mock data)
├── Role Permissions
├── AuthContext
├── AuthProvider (state management, localStorage, session)
├── Auth Methods (login, logout, register, etc.)
├── Permission System
├── Route Guards
└── Hooks (useAuth, usePermissions)
```

**Problemas:**
- Mistura de responsabilidades (auth, permissions, UI, localStorage)
- 1300+ linhas em um único arquivo
- Dificuldade para testar
- Dificuldade para implementar RBAC
- Risco de SSR issues (window, localStorage)

---

## 3. Estrutura Proposta

```
src/modules/auth/
├── context/
│   ├── AuthContext.tsx (~30 linhas)
│   ├── AuthProvider.tsx (~250-300 linhas)
│   └── auth.types.ts (~100 linhas)
│
├── hooks/
│   ├── useAuth.ts (~100 linhas)
│   ├── usePermissions.ts (~100 linhas)
│   ├── useRole.ts (~50 linhas)
│   ├── useSession.ts (~80 linhas)
│   └── useProfile.ts (~80 linhas)
│
├── services/
│   ├── auth.service.ts (~150 linhas)
│   ├── profile.service.ts (~150 linhas)
│   ├── permission.service.ts (~100 linhas)
│   └── session.service.ts (~100 linhas)
│
├── stores/
│   └── auth.store.ts (~100 linhas)
│
├── permissions/
│   ├── roles.ts (~50 linhas) - já existe em shared/types/roles.ts
│   ├── permissions.ts (~100 linhas)
│   └── role-matrix.ts (~100 linhas)
│
├── guards/
│   ├── RouteGuard.tsx (~80 linhas)
│   ├── RoleGuard.tsx (~60 linhas)
│   └── PermissionGuard.tsx (~60 linhas)
│
└── utils/
    ├── auth-utils.ts (~80 linhas)
    ├── redirect-utils.ts (~60 linhas)
    └── token-utils.ts (~80 linhas)
```

**Total estimado:** ~1900 linhas distribuídas em 20+ arquivos (nenhum >300 linhas)

---

## 4. Plano de Migração

### Fase 1: Preparação
1. ✅ Auditar dependências do auth-context.tsx
2. ✅ Mapear exports consumidos pelo sistema
3. Criar estrutura src/modules/auth/
4. Extrair types para auth.types.ts

### Fase 2: Extração de Serviços
5. Extrair auth.service.ts (login, logout, register, refreshToken)
6. Extrair profile.service.ts (getProfile, updateProfile, loadCustomer)
7. Extrair permission.service.ts (hasPermission, hasRole)
8. Extrair session.service.ts (localStorage, session management)

### Fase 3: Extração de Hooks
9. Extrair useAuth.ts (wrapper para AuthContext)
10. Extrair usePermissions.ts (permission logic)
11. Extrair useRole.ts (role helpers)
12. Extrair useSession.ts (session management)
13. Extrair useProfile.ts (profile management)

### Fase 4: Extração de Guards
14. Extrair RouteGuard.tsx
15. Extrair RoleGuard.tsx
16. Extrair PermissionGuard.tsx

### Fase 5: Refatoração do Provider
17. Extrair AuthContext.tsx (context definition only)
18. Refatorar AuthProvider.tsx (state management only, ~250-300 linhas)
19. Mover ROLE_PERMISSIONS para permissions/role-matrix.ts

### Fase 6: Validação SSR
20. Adicionar guards SSR (window, localStorage)
21. Validar login/logout
22. Validar menus (sidebar, UserMenu)

### Fase 7: Atualização de Imports
23. Atualizar todos os 21 arquivos dependentes
24. Testar fluxo completo
25. Remover auth-context.tsx antigo

---

## 5. Riscos e Mitigações

### Risco 1: Quebra de SSR
**Mitigação:** Adicionar guards `typeof window !== "undefined"` antes de acessar window/localStorage

### Risco 2: Quebra de login/logout
**Mitigação:** Testar manualmente após cada fase de extração

### Risco 3: Quebra de menus
**Mitigação:** Validar sidebar-nav.tsx e UserMenu.tsx após refatoração

### Risco 4: Quebra de RBAC
**Mitigação:** Manter compatibilidade com UserRole de shared/types/roles.ts

---

## 6. Ordem de Execução

1. Criar estrutura src/modules/auth/
2. Extrair types para auth.types.ts
3. Extrair services (auth.service, profile.service)
4. Extrair hooks (useAuth, usePermissions, useRole)
5. Extrair guards (RouteGuard, RoleGuard, PermissionGuard)
6. Refatorar AuthProvider
7. Validar SSR
8. Atualizar imports
9. Testar completo
10. Só então implementar RBAC completo

---

## 7. Critérios de Sucesso

- [ ] Nenhum arquivo >300 linhas
- [ ] Separação clara de responsabilidades
- [ ] SSR funcionando corretamente
- [ ] Login/logout funcionando
- [ ] Menus funcionando
- [ ] Todos os 21 arquivos dependentes atualizados
- [ ] auth-context.tsx antigo removido
- [ ] Testes manuais passando

---

## 8. Próximos Passos

**Imediato:** Criar estrutura src/modules/auth/ e começar extração de types
