# Sprint 0 — Etapa B #05: Engenharia Reversa — Hooks & Providers

## Objetivo
Mapear os 60 hooks e 7 providers do frontend, identificar dependências quebradas e conexão com services/httpClient.

---

## 1. Visão Geral

| Item | Quantidade |
|------|-----------|
| Hooks em `src/hooks/` | 60 |
| Providers | 7 (espalhados em 4 diretórios) |
| Padrão dominante | Service classes (`@/services/*`) — ~30 hooks |
| Acesso Supabase direto | 5 hooks |
| API functions (`@/lib/api/*`) | 6 hooks |

## 2. Providers

| Provider | Localização | Fornece | Dependências |
|----------|------------|---------|-------------|
| QueryClientProvider | TanStack | React Query | N/A |
| AuthProvider | `src/modules/auth/context/AuthProvider.tsx` | user, login, register, logout | AuthService, ProfileService, supabase |
| ThemeProvider | `src/components/ThemeProvider.tsx` | theme (light/dark) | Nenhuma |
| DistributorProvider | `src/lib/distributor-context.tsx` | currentDistributor | SupabaseService |
| StoreSettingsProvider | `src/contexts/StoreSettingsContext.tsx` | store settings | Nenhuma (estado local) |
| CartProvider | `src/contexts/CartContext.tsx` | cart items | cartService, useAuth |
| ProductsProvider | `src/contexts/ProductsContext.tsx` | products, categories | productsService |
| StyleProvider | `src/contexts/StyleContext.tsx` | style tokens | Nenhuma (constantes) |

### 2.1 Providers obsoletos no AuthProvider
AuthProvider expõe 3 métodos stub que lançam erro em runtime:
- `updateDistributorProfile` → "Use useDistributorProfileQuery instead"
- `clearSponsor` → "Use useReferralTrackingQuery instead"
- `activateDistributorOffice` → "Use useDistributorProfileQuery instead"

## 3. Bugs Encontrados

### 🚨 useNetwork.ts — variável não definida
**Arquivo:** `src/hooks/network/useNetwork.ts:20`
```typescript
return { customers: distributorData || [], legs, relationships: relationshipData || [] };
```
`distributorData` nunca é definido. A variável correta é `customerData` (vinda de `CustomerService.fetchRecentCustomers`). Causa: **ReferenceError em runtime**.

## 4. Observações

- Nenhum hook importa do caminho quebrado `shared/infrastructure/` (bom — só backend tem esse problema)
- Hooks de wallet usam 3 fontes diferentes: Service class, API functions e supabase direto — inconsistência arquitetural
