# AUDITORIA DE FONTE ÚNICA DE VERDADE

**Data:** 31/05/2026  
**Objetivo:** Mapear todas as leituras e escritas de dados do sistema de autenticação

---

## 1. MATRIZ DE OPERAÇÕES POR ARQUIVO

### 1.1 AuthProvider.tsx

| Método | Lê De | Escreve Em | Tabela Supabase | Duplicação | Risco Inconsistência |
|--------|--------|------------|-----------------|------------|----------------------|
| `useEffect` inicialização | Supabase (fetchCurrentUser), LocalStorage (loadSession), Mock (DEFAULT_*) | Estado React, LocalStorage | auth.users, profiles, customers | ⚠️ Sim (Supabase + LocalStorage + Mock) | ⚠️ Alto |
| `login` | Supabase (signInWithPassword), Estado React | Estado React, LocalStorage | auth.users, profiles | ⚠️ Sim (Supabase + LocalStorage) | ⚠️ Médio |
| `register` | Supabase (signUp), Estado React, Mock (usersList, distributorsList, referralsList) | Estado React, LocalStorage, Supabase | auth.users, profiles | ❌ Sim (Supabase + LocalStorage + Mock) | ❌ Alto |
| `logout` | Estado React | Estado React, LocalStorage, Supabase | auth.users | ⚠️ Sim (Supabase + LocalStorage) | ⚠️ Médio |
| `updateProfile` | Estado React, Mock (usersList) | Estado React, LocalStorage | Nenhuma | ❌ Sim (LocalStorage + Mock) | ❌ Alto |
| `updateDistributorProfile` | Estado React, Mock (distributorsList) | Estado React, LocalStorage | Nenhuma | ❌ Sim (LocalStorage + Mock) | ❌ Alto |
| `changeUserRole` | Estado React, Mock (usersList) | Estado React, LocalStorage, Supabase | profiles | ❌ Sim (Supabase + LocalStorage + Mock) | ❌ Alto |
| `activateDistributorOffice` | Estado React, Mock (distributorsList, usersList) | Estado React, LocalStorage | Nenhuma | ❌ Sim (LocalStorage + Mock) | ❌ Alto |
| `createAdminInvite` | Estado React, Mock (adminInvites) | Estado React, LocalStorage | Nenhuma | ❌ Sim (LocalStorage + Mock) | ❌ Alto |
| `revokeAdminInvite` | Estado React, Mock (adminInvites) | Estado React, LocalStorage | Nenhuma | ❌ Sim (LocalStorage + Mock) | ❌ Alto |
| `resendAdminInvite` | Estado React, Mock (adminInvites) | Estado React, LocalStorage | Nenhuma | ❌ Sim (LocalStorage + Mock) | ❌ Alto |
| `acceptAdminInvite` | Estado React, Mock (adminInvites, usersList) | Estado React, LocalStorage | Nenhuma | ❌ Sim (LocalStorage + Mock) | ❌ Alto |
| `simulateAuditLog` | Estado React | Estado React, LocalStorage | Nenhuma | ❌ Sim (LocalStorage apenas) | ❌ Alto |
| `addAuditLog` | Estado React | Estado React, LocalStorage | Nenhuma | ❌ Sim (LocalStorage apenas) | ❌ Alto |
| `triggerBinomialBonusPay` | Estado React, Mock (distributorsList) | Estado React, LocalStorage | Nenhuma | ❌ Sim (LocalStorage + Mock) | ❌ Alto |

**Status:** ❌ LocalStorage + Mock (Supabase parcial)

---

### 1.2 AuthService.ts

| Método | Lê De | Escreve Em | Tabela Supabase | Duplicação | Risco Inconsistência |
|--------|--------|------------|-----------------|------------|----------------------|
| `login` | Supabase (signInWithPassword), Supabase (fetchUserProfile) | LocalStorage, Estado React | auth.users, profiles | ⚠️ Sim (Supabase + LocalStorage) | ⚠️ Médio |
| `register` | Supabase (signUp) | Supabase (profiles.insert), LocalStorage, Estado React | auth.users, profiles | ⚠️ Sim (Supabase + LocalStorage) | ⚠️ Médio |
| `logout` | Estado React | Supabase (signOut), LocalStorage, Estado React | auth.users | ⚠️ Sim (Supabase + LocalStorage) | ⚠️ Médio |
| `changeUserRole` | Estado React | Supabase (profiles.update), LocalStorage, Estado React | profiles | ⚠️ Sim (Supabase + LocalStorage) | ⚠️ Médio |
| `clearSponsor` | Nenhuma | LocalStorage | Nenhuma | ❌ Sim (LocalStorage apenas) | ❌ Alto |

**Status:** ⚠️ Supabase + LocalStorage

---

### 1.3 ProfileService.ts

| Método | Lê De | Escreve Em | Tabela Supabase | Duplicação | Risco Inconsistência |
|--------|--------|------------|-----------------|------------|----------------------|
| `updateProfile` | Estado React, Mock (usersList) | Estado React, LocalStorage | Nenhuma | ❌ Sim (LocalStorage + Mock) | ❌ Alto |
| `updateDistributorProfile` | Estado React, Mock (distributorsList) | Estado React, LocalStorage | Nenhuma | ❌ Sim (LocalStorage + Mock) | ❌ Alto |
| `activateDistributorOffice` | Estado React, Mock (distributorsList, usersList) | Estado React, LocalStorage | Nenhuma | ❌ Sim (LocalStorage + Mock) | ❌ Alto |

**Status:** ❌ LocalStorage + Mock (Sem Supabase)

---

### 1.4 StorageService.ts

| Método | Lê De | Escreve Em | Tabela Supabase | Duplicação | Risco Inconsistência |
|--------|--------|------------|-----------------|------------|----------------------|
| `saveUsersDB` | Nenhuma | LocalStorage | Nenhuma | ❌ Sim (LocalStorage apenas) | ❌ Alto |
| `loadUsersDB` | LocalStorage, Mock (defaultUsers) | LocalStorage (se vazio) | Nenhuma | ❌ Sim (LocalStorage + Mock) | ❌ Alto |
| `saveDistributorsDB` | Nenhuma | LocalStorage | Nenhuma | ❌ Sim (LocalStorage apenas) | ❌ Alto |
| `loadDistributorsDB` | LocalStorage, Mock (defaultDistributors) | LocalStorage (se vazio) | Nenhuma | ❌ Sim (LocalStorage + Mock) | ❌ Alto |
| `saveReferralsDB` | Nenhuma | LocalStorage | Nenhuma | ❌ Sim (LocalStorage apenas) | ❌ Alto |
| `loadReferralsDB` | LocalStorage, Mock (defaultReferrals) | LocalStorage (se vazio) | Nenhuma | ❌ Sim (LocalStorage + Mock) | ❌ Alto |
| `saveLogsDB` | Nenhuma | LocalStorage | Nenhuma | ❌ Sim (LocalStorage apenas) | ❌ Alto |
| `loadLogsDB` | LocalStorage, Mock (defaultLogs) | LocalStorage (se vazio) | Nenhuma | ❌ Sim (LocalStorage + Mock) | ❌ Alto |
| `saveInvitesDB` | Nenhuma | LocalStorage | Nenhuma | ❌ Sim (LocalStorage apenas) | ❌ Alto |
| `loadInvitesDB` | LocalStorage, Mock (defaultInvites) | LocalStorage (se vazio) | Nenhuma | ❌ Sim (LocalStorage + Mock) | ❌ Alto |
| `saveSession` | Nenhuma | LocalStorage | Nenhuma | ❌ Sim (LocalStorage apenas) | ❌ Alto |
| `loadSession` | LocalStorage | Nenhuma | Nenhuma | ❌ Sim (LocalStorage apenas) | ❌ Alto |
| `clearSession` | Nenhuma | LocalStorage (remove) | Nenhuma | ❌ Sim (LocalStorage apenas) | ❌ Alto |
| `saveActiveSponsor` | Nenhuma | LocalStorage | Nenhuma | ❌ Sim (LocalStorage apenas) | ❌ Alto |
| `loadActiveSponsor` | LocalStorage | Nenhuma | Nenhuma | ❌ Sim (LocalStorage apenas) | ❌ Alto |
| `clearActiveSponsor` | Nenhuma | LocalStorage (remove) | Nenhuma | ❌ Sim (LocalStorage apenas) | ❌ Alto |
| `saveActiveReferralMetadata` | Nenhuma | LocalStorage | Nenhuma | ❌ Sim (LocalStorage apenas) | ❌ Alto |
| `loadActiveReferralMetadata` | LocalStorage | Nenhuma | Nenhuma | ❌ Sim (LocalStorage apenas) | ❌ Alto |
| `clearActiveReferralMetadata` | Nenhuma | LocalStorage (remove) | Nenhuma | ❌ Sim (LocalStorage apenas) | ❌ Alto |

**Status:** ❌ LocalStorage apenas

---

### 1.5 AuditService.ts

| Método | Lê De | Escreve Em | Tabela Supabase | Duplicação | Risco Inconsistência |
|--------|--------|------------|-----------------|------------|----------------------|
| `simulateAuditLog` | Estado React, Mock (auditLogs) | Estado React, LocalStorage | Nenhuma | ❌ Sim (LocalStorage + Mock) | ❌ Alto |
| `addAuditLog` | Estado React, Mock (auditLogs) | Estado React, LocalStorage | Nenhuma | ❌ Sim (LocalStorage + Mock) | ❌ Alto |
| `triggerBinomialBonusPay` | Estado React, Mock (distributorsList) | Estado React, LocalStorage | Nenhuma | ❌ Sim (LocalStorage + Mock) | ❌ Alto |

**Status:** ❌ LocalStorage + Mock (Sem Supabase)

---

### 1.6 InviteService.ts

| Método | Lê De | Escreve Em | Tabela Supabase | Duplicação | Risco Inconsistência |
|--------|--------|------------|-----------------|------------|----------------------|
| `createAdminInvite` | Mock (adminInvites) | Estado React, LocalStorage | Nenhuma | ❌ Sim (LocalStorage + Mock) | ❌ Alto |
| `revokeAdminInvite` | Mock (adminInvites) | Estado React, LocalStorage | Nenhuma | ❌ Sim (LocalStorage + Mock) | ❌ Alto |
| `resendAdminInvite` | Mock (adminInvites) | Estado React, LocalStorage | Nenhuma | ❌ Sim (LocalStorage + Mock) | ❌ Alto |
| `getAdminInviteByToken` | Mock (adminInvites) | Nenhuma | Nenhuma | ❌ Sim (Mock apenas) | ❌ Alto |
| `acceptAdminInvite` | Mock (adminInvites, usersList) | Estado React, LocalStorage | Nenhuma | ❌ Sim (LocalStorage + Mock) | ❌ Alto |
| `deleteUserAndInviteSession` | Mock (usersList) | Estado React, LocalStorage | Nenhuma | ❌ Sim (LocalStorage + Mock) | ❌ Alto |

**Status:** ❌ LocalStorage + Mock (Sem Supabase)

---

### 1.7 SupabaseService.ts

| Método | Lê De | Escreve Em | Tabela Supabase | Duplicação | Risco Inconsistência |
|--------|--------|------------|-----------------|------------|----------------------|
| `fetchUserProfile` | Supabase (auth.users, profiles) | Nenhuma | auth.users, profiles | ✅ Não | ✅ Baixo |
| `fetchCurrentUser` | Supabase (auth.users) | Nenhuma | auth.users | ✅ Não | ✅ Baixo |
| `fetchDistributorProfile` | Supabase (customers) | Nenhuma | customers | ✅ Não | ✅ Baixo |
| `isAdminUser` | Supabase (admin_users) | Nenhuma | admin_users | ✅ Não | ✅ Baixo |
| `fetchAdminUser` | Supabase (admin_users) | Nenhuma | admin_users | ✅ Não | ✅ Baixo |

**Status:** ✅ Somente Supabase

---

### 1.8 DistributorProvider (distributor-context.tsx)

| Método | Lê De | Escreve Em | Tabela Supabase | Duplicação | Risco Inconsistência |
|--------|--------|------------|-----------------|------------|----------------------|
| `resolveDistributor` | Hardcoded (PARTNER_THEMES), Estado React (usersList) | Nenhuma | Nenhuma | ❌ Sim (Hardcoded + Mock) | ❌ Alto |
| `useEffect` (slug) | LocalStorage, Hardcoded (DEFAULT_DISTRIBUTOR) | Estado React, LocalStorage | Nenhuma | ❌ Sim (LocalStorage + Hardcoded) | ❌ Alto |
| `setDistributorBySlug` | Nenhuma | Estado React | Nenhuma | ❌ Sim (Estado React apenas) | ❌ Alto |

**Status:** ❌ LocalStorage + Hardcoded (Sem Supabase)

---

### 1.9 Hooks (useAuth, useProfile, useSession)

| Hook | Lê De | Escreve Em | Tabela Supabase | Duplicação | Risco Inconsistência |
|------|--------|------------|-----------------|------------|----------------------|
| `useAuth` | Context (AuthProvider) | Nenhuma | Nenhuma | ✅ Não (apenas leitura) | ✅ Baixo |
| `useProfile` | Context (AuthProvider) | Nenhuma | Nenhuma | ✅ Não (apenas leitura) | ✅ Baixo |
| `useSession` | Context (AuthProvider), LocalStorage (loadSession) | Nenhuma | Nenhuma | ⚠️ Sim (Context + LocalStorage) | ⚠️ Médio |

**Status:** ⚠️ Context + LocalStorage (apenas leitura)

---

## 2. MATRIZ FINAL DE FONTES DE DADOS

| FUNÇÃO/SERVIÇO | LÊ DE | ESCREVE EM | STATUS |
|----------------|--------|------------|--------|
| **AuthProvider** | Supabase, LocalStorage, Mock | Estado React, LocalStorage | ❌ LocalStorage + Mock (Supabase parcial) |
| **AuthService** | Supabase, LocalStorage | Supabase, LocalStorage, Estado React | ⚠️ Supabase + LocalStorage |
| **ProfileService** | LocalStorage, Mock | LocalStorage, Estado React | ❌ LocalStorage + Mock (Sem Supabase) |
| **StorageService** | LocalStorage, Mock | LocalStorage | ❌ LocalStorage + Mock |
| **AuditService** | LocalStorage, Mock | LocalStorage, Estado React | ❌ LocalStorage + Mock (Sem Supabase) |
| **InviteService** | LocalStorage, Mock | LocalStorage, Estado React | ❌ LocalStorage + Mock (Sem Supabase) |
| **SupabaseService** | Supabase | Nenhuma (apenas leitura) | ✅ Somente Supabase |
| **DistributorProvider** | LocalStorage, Hardcoded | LocalStorage, Estado React | ❌ LocalStorage + Hardcoded |
| **useAuth** | Context (AuthProvider) | Nenhuma | ✅ Somente Context (leitura) |
| **useProfile** | Context (AuthProvider) | Nenhuma | ✅ Somente Context (leitura) |
| **useSession** | Context (AuthProvider), LocalStorage | Nenhuma | ⚠️ Context + LocalStorage (leitura) |

---

## 3. CLASSIFICAÇÃO POR STATUS

### ✅ Somente Supabase (1 serviço)
- SupabaseService

### ⚠️ Supabase + LocalStorage (2 serviços)
- AuthService
- useSession

### ❌ LocalStorage + Mock (5 serviços)
- ProfileService
- StorageService
- AuditService
- InviteService
- DistributorProvider

### ❌ LocalStorage + Mock (Supabase parcial) (1 serviço)
- AuthProvider

---

## 4. REFERÊNCIAS RESTANTES A DEFAULT_* CONSTANTS

### 4.1 DEFAULT_USERS
| Arquivo | Linha | Contexto |
|---------|-------|----------|
| `src/modules/auth/context/default-data.ts` | 10 | Exportação (array vazio, deprecated) |
| `src/modules/auth/context/index.ts` | 4 | Re-exportação |
| `src/modules/auth/index.ts` | 30 | Re-exportação |
| `src/modules/auth/context/AuthProvider.tsx` | 159 | Parâmetro em register (não usado) |

### 4.2 DEFAULT_DISTRIBUTORS
| Arquivo | Linha | Contexto |
|---------|-------|----------|
| `src/modules/auth/context/default-data.ts` | 13 | Exportação (array vazio, deprecated) |
| `src/modules/auth/context/index.ts` | 4 | Re-exportação |
| `src/modules/auth/index.ts` | 30 | Re-exportação |
| `src/modules/auth/context/AuthProvider.tsx` | 69 | Usado em loadDistributorsDB |
| `src/modules/auth/context/AuthProvider.tsx` | 156 | Parâmetro em register (não usado) |

### 4.3 DEFAULT_REFERRALS
| Arquivo | Linha | Contexto |
|---------|-------|----------|
| `src/modules/auth/context/default-data.ts` | 16 | Exportação (array vazio, deprecated) |
| `src/modules/auth/context/index.ts` | 4 | Re-exportação |
| `src/modules/auth/index.ts` | 30 | Re-exportação |
| `src/modules/auth/context/AuthProvider.tsx` | 70 | Usado em loadReferralsDB |
| `src/modules/auth/context/AuthProvider.tsx` | 157 | Parâmetro em register (não usado) |

### 4.4 DEFAULT_AUDIT_LOGS
| Arquivo | Linha | Contexto |
|---------|-------|----------|
| `src/modules/auth/context/default-data.ts` | 19 | Exportação (array vazio, deprecated) |
| `src/modules/auth/context/index.ts` | 4 | Re-exportação |
| `src/modules/auth/index.ts` | 30 | Re-exportação |
| `src/modules/auth/context/AuthProvider.tsx` | 71 | Usado em loadLogsDB |

### 4.5 DEFAULT_ADMIN_INVITES
| Arquivo | Linha | Contexto |
|---------|-------|----------|
| `src/modules/auth/context/default-data.ts` | 22 | Exportação (array vazio, deprecated) |
| `src/modules/auth/context/index.ts` | 4 | Re-exportação |
| `src/modules/auth/index.ts` | 30 | Re-exportação |
| `src/modules/auth/context/AuthProvider.tsx` | 72 | Usado em loadInvitesDB |

### 4.6 DEFAULT_DISTRIBUTOR (Diferente - hardcoded string)
| Arquivo | Linha | Contexto |
|---------|-------|----------|
| `src/lib/distributor-context.tsx` | 4 | Definição constante "allinBrasil" |
| `src/lib/distributor-context.tsx` | 70 | Usado em DEFAULT_THEME |
| `src/lib/distributor-context.tsx` | 74 | Usado como fallback |
| `src/lib/distributor-context.tsx` | 83 | Usado como fallback |
| `src/lib/distributor-context.tsx` | 132 | Usado como fallback |
| `src/lib/distributor-context.tsx` | 157 | Usado como fallback |
| `src/lib/distributor-context.tsx` | 162 | Usado como fallback |
| `src/lib/distributor-context.tsx` | 209 | Usado como fallback |
| `src/components/Footer.tsx` | 7 | Importação |
| `src/components/Footer.tsx` | 14 | Comparação |
| `src/components/app/public-header.tsx` | 3 | Importação |
| `src/components/app/public-header.tsx` | 22 | Comparação |

---

## 5. ARQUIVOS QUE PODEM SER REMOVIDOS APÓS MIGRAÇÃO COMPLETA

### 5.1 Arquivos Inteiros
- `src/modules/auth/context/default-data.ts` - Todos os DEFAULT_* são arrays vazios
- `src/modules/auth/services/storage.service.ts` - Apenas LocalStorage operations
- `src/modules/auth/services/audit.service.ts` - Apenas LocalStorage operations
- `src/modules/auth/services/invite.service.ts` - Apenas LocalStorage operations
- `src/modules/auth/services/profile.service.ts` - Apenas LocalStorage operations

### 5.2 Métodos/Seções a Remover
- `AuthProvider.tsx`:
  - Linhas 69-72: Chamadas StorageService com DEFAULT_* constants
  - Linhas 83-86: setDistributorsList, setReferralsList, setAuditLogs, setAdminInvites
  - Linhas 27-30: Estado distributorsList, referralsList, auditLogs, adminInvites
  - Linhas 159-160: Parâmetro usersList em register (não usado)
  - Linhas 156-157: Parâmetros distributorsList, referralsList em register (não usados)
  - Linhas 200-203: Parâmetros usersList, saveUsersDB em updateProfile (não usados)
  - Linhas 217-221: Parâmetros distributorsList, saveDistributorsDB em updateDistributorProfile (não usados)
  - Linhas 236-240: Parâmetros usersList, saveUsersDB em changeUserRole (não usados)
  - Linhas 253-262: Parâmetros distributorsList, usersList em activateDistributorOffice (não usados)
  - Linhas 277-280: Parâmetros adminInvites, saveInvitesDB em createAdminInvite (não usados)
  - Linhas 292-295: Parâmetros adminInvites, saveInvitesDB em revokeAdminInvite (não usados)
  - Linhas 307-310: Parâmetros adminInvites, saveInvitesDB em resendAdminInvite (não usados)
  - Linhas 320: Parâmetro adminInvites em getAdminInviteByToken (não usado)
  - Linhas 328-336: Parâmetros adminInvites, usersList em acceptAdminInvite (não usados)
  - Linhas 350-354: Parâmetros usersList, saveUsersDB em deleteUserAndInviteSession (não usados)

- `AuthService.ts`:
  - Linhas 17-18: Parâmetros usersList, saveUsersDB em login (não usados)
  - Linhas 74-79: Parâmetros usersList, distributorsList, referralsList, saveUsersDB, saveDistributorsDB, saveReferralsDB em register (não usados)
  - Linhas 196-197: Parâmetros usersList, saveUsersDB em changeUserRole (não usados)

- `index.ts` (modules/auth):
  - Linha 30: Exportação de DEFAULT_* constants

- `index.ts` (modules/auth/context):
  - Linha 4: Exportação de DEFAULT_* constants

---

## 6. RISCOS IDENTIFICADOS

### 6.1 Risco Crítico
- **AuthProvider** usa 3 fontes simultâneas (Supabase, LocalStorage, Mock) na inicialização
- **ProfileService**, **AuditService**, **InviteService** não escrevem no Supabase
- **DistributorProvider** usa dados hardcoded (PARTNER_THEMES) em vez do banco

### 6.2 Risco Alto
- **StorageService** depende de Mock data como fallback
- **AuthProvider** mantém estado duplicado (usersList, distributorsList, etc.)
- **ProfileService** atualiza apenas LocalStorage, não Supabase

### 6.3 Risco Médio
- **AuthService** escreve em Supabase e LocalStorage simultaneamente
- **useSession** lê de Context e LocalStorage

---

## 7. RECOMENDAÇÕES

### 7.1 Imediato (Prioridade Alta)
1. Remover parâmetros não utilizados de todos os serviços
2. Migrar ProfileService para usar Supabase
3. Migrar AuditService para usar tabela audit_log do Supabase
4. Migrar InviteService para usar tabela admin_invites do Supabase
5. Remover estado duplicado do AuthProvider (distributorsList, referralsList, etc.)

### 7.2 Curto Prazo
1. Migrar DistributorProvider para buscar dados do Supabase
2. Remover StorageService completamente
3. Remover default-data.ts
4. Atualizar AuthService para não escrever em LocalStorage

### 7.3 Longo Prazo
1. Implementar cache client-side com Supabase Realtime
2. Implementar RBAC completo com dados do banco
3. Aplicar guards de rota baseados em roles reais

---

## 8. RESUMO

### Status Atual
- ✅ **1 serviço** usa somente Supabase (SupabaseService)
- ⚠️ **2 serviços** usam Supabase + LocalStorage (AuthService, useSession)
- ❌ **6 serviços** usam LocalStorage + Mock (ProfileService, StorageService, AuditService, InviteService, DistributorProvider, AuthProvider parcial)

### Fontes de Dados
- **Supabase:** auth.users, profiles, customers, admin_users, network_relationships, audit_log
- **LocalStorage:** allin_users, allin_distributors, allin_referrals, allin_audit_logs, allin_invites, allin_session, allin_active_ref, allin_active_ref_meta
- **Mock:** DEFAULT_USERS, DEFAULT_DISTRIBUTORS, DEFAULT_REFERRALS, DEFAULT_AUDIT_LOGS, DEFAULT_ADMIN_INVITES (todos vazios)
- **Hardcoded:** PARTNER_THEMES, DEFAULT_DISTRIBUTOR

### Duplicação de Fonte de Verdade
- **Sim:** 9 de 11 serviços têm duplicação
- **Não:** 2 de 11 serviços (SupabaseService, hooks de leitura)

### Risco de Inconsistência
- **Alto:** 8 serviços
- **Médio:** 3 serviços
- **Baixo:** 2 serviços
