# Auditoria Completa do Sistema AUTH

## Data: 2026-06-05

## Objetivo
Identificar duplicações, camadas intermediárias e oportunidades de unificação no sistema de autenticação.

## Estrutura Atual

### Arquivos Identificados

#### Camada de Serviços (Duplicados)
1. **`src/services/auth/auth.service.ts`** (24 linhas)
   - Wrapper simples do Supabase
   - Funções: getSession, onAuthStateChange, signInWithPassword, signUp, signOut
   - **STATUS**: Camada intermediária desnecessária

2. **`src/modules/auth/services/auth.service.ts`** (199 linhas)
   - AuthService class frontend
   - Funções: login, register, logout, changeUserRole, clearSponsor
   - Usa Supabase diretamente
   - Mistura lógica de UI (setUser, setLoading) com lógica de negócio
   - **STATUS**: Mistura de responsabilidades

3. **`src/backend/modules/auth/services/auth.service.ts`** (212 linhas)
   - Backend AuthService
   - Funções: login, register, refreshToken, changePassword, logout, verifyAccessToken
   - Usa CustomerRepository e ProfileRepository
   - **STATUS**: Backend separado, mas duplica lógica com frontend

#### Camada de Utilitários
4. **`src/lib/supabase/auth.ts`** (208 linhas)
   - Utilitários de autenticação do Supabase
   - Funções: getSession, getCurrentUser, refreshSession, signIn, signUp, signOut, resetPassword, updatePassword, onAuthStateChange
   - **STATUS**: Duplica funcionalidades que já existem no Supabase client

#### Camada de Context/Hooks
5. **`src/modules/auth/context/AuthContext.tsx`** (9 linhas)
   - Contexto simples
   - **STATUS**: OK

6. **`src/modules/auth/hooks/useAuth.ts`** (16 linhas)
   - Hook simples que usa AuthContext
   - **STATUS**: OK

7. **`src/modules/auth/context/AuthProvider.tsx`** (291 linhas)
   - Provider principal
   - Usa múltiplos serviços: AuthService, authService (duplicado!), ProfileService, InviteService, AuditService, SupabaseService, referralTrackingService
   - **STATUS**: Usa serviços duplicados

## Duplicações Identificadas

### 1. Wrapper Desnecessário do Supabase
- **`src/services/auth/auth.service.ts`** (24 linhas)
- **Problema**: É apenas um wrapper do Supabase client sem adicionar valor
- **Solução**: Remover e usar Supabase client diretamente

### 2. Duplicação de Funcionalidades de Autenticação
- **`src/lib/supabase/auth.ts`** (208 linhas) vs Supabase client nativo
- **Problema**: Duplica funcionalidades que já existem no Supabase client
- **Solução**: Remover e usar Supabase client diretamente

### 3. AuthService Frontend Misturando Responsabilidades
- **`src/modules/auth/services/auth.service.ts`** (199 linhas)
- **Problema**: Mistura lógica de UI (setUser, setLoading) com lógica de negócio
- **Solução**: Separar em service puro (sem UI) e hook para gerenciar estado

### 4. Múltiplos AuthService
- **`src/services/auth/auth.service.ts`** (24 linhas)
- **`src/modules/auth/services/auth.service.ts`** (199 linhas)
- **`src/backend/modules/auth/services/auth.service.ts`** (212 linhas)
- **Problema**: Três serviços de autenticação diferentes
- **Solução**: Unificar em um único serviço

### 5. AuthProvider Usa Serviços Duplicados
- **AuthProvider usa `AuthService`** (frontend)
- **AuthProvider usa `authService`** (wrapper do Supabase)
- **Problema**: Usa dois serviços de autenticação diferentes
- **Solução**: Usar apenas um serviço unificado

## Proposta de Unificação

### Estrutura Proposta

```
src/modules/auth/
├── services/
│   └── auth.service.ts          # Serviço unificado (sem UI)
├── hooks/
│   ├── useAuth.ts              # Hook para gerenciar estado
│   └── useAuthActions.ts       # Hook para ações de autenticação
├── context/
│   ├── AuthContext.tsx         # Contexto
│   └── AuthProvider.tsx        # Provider (refatorado)
└── types/
    └── auth.types.ts           # Tipos
```

### Ações Propostas

#### ETAPA 1: Eliminar Camadas Intermediárias
1. **Remover** `src/services/auth/auth.service.ts` (24 linhas)
2. **Remover** `src/lib/supabase/auth.ts` (208 linhas)
3. **Usar** Supabase client diretamente

#### ETAPA 2: Unificar AuthService
1. **Manter** `src/modules/auth/services/auth.service.ts` como serviço principal
2. **Remover** lógica de UI (setUser, setLoading) do serviço
3. **Criar** hooks para gerenciar estado UI
4. **Remover** ou refatorar `src/backend/modules/auth/services/auth.service.ts` para usar o serviço unificado

#### ETAPA 3: Refatorar AuthProvider
1. **Remover** uso de `authService` (wrapper do Supabase)
2. **Usar** apenas `AuthService` unificado
3. **Separar** lógica de estado em hooks

## Benefícios Esperados

1. **Redução de código**: ~440 linhas removidas (24 + 208 + 199 refatorado)
2. **Melhor manutenção**: Único ponto de verdade para autenticação
3. **Separação de responsabilidades**: Serviço sem UI, hooks para UI
4. **Menos duplicação**: Elimina wrappers desnecessários
5. **Melhor performance**: Menos camadas de abstração

## Riscos

1. **Breaking changes**: Componentes que usam os serviços removidos precisarão ser atualizados
2. **Testes necessários**: Validar que todas as funcionalidades continuam funcionando após refatoração
3. **Backend separado**: Backend AuthService pode ter requisitos diferentes que precisam ser mantidos

## Próximos Passos

1. Validar uso dos serviços a serem removidos
2. Criar hooks para gerenciar estado UI
3. Refatorar AuthService para remover lógica de UI
4. Atualizar AuthProvider para usar serviço unificado
5. Atualizar todos os componentes que usam os serviços removidos
6. Validar build e funcionalidades
