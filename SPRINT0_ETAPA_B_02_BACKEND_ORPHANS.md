# Sprint 0 — Etapa B: Engenharia Reversa — Ficha #02: Backend Orphans (Wallets + MLM)

> **Pipeline:** httpClient → encontrou endpoints sem rota → investigou se existe service/repository/tabela

---

## 1. Wallet Ecosystem (Três Carteiras)

### 1.1 Descoberta Inicial

httpClient declara 9 métodos para `/api/wallets/*` mas nenhuma rota existe no servidor Express.

### 1.2 Evidências de cada camada

| Camada | Existe? | Onde? | Status |
|--------|---------|-------|--------|
| **Frontend** (httpClient) | ✅ | `http-client.ts:428-486` — getWalletBalance, getWalletTransactions, ensureWallet, creditWallet, debitWallet, freezeWallet, unfreezeWallet + bonus + points | Chamado por services |
| **Frontend** (WalletService) | ✅ | `services/wallets/index.ts` — 11 métodos, 6 lançam `"not yet implemented"` | Parcialmente quebrado |
| **Frontend** (lib/api functions) | ✅ | `wallet.functions.ts`, `bonus-wallet.functions.ts`, `points-wallet.functions.ts` — wrappers do httpClient | Duplicados entre si |
| **Backend Route** | ❌ | Nenhum arquivo em `backend/server/routes/` para wallets | **Gap** |
| **Backend API** | ❌ | Nenhum arquivo em `backend/modules/*/api/` para wallets | **Gap** |
| **Backend Service** | ✅ | `backend/modules/payments/services/wallet.service.ts` — WalletService completo (422 linhas) | Implementado mas não exposto |
| **Backend Service** | ✅ | `backend/modules/payments/services/points-wallet.service.ts` — PointsWalletService (406 linhas) | Implementado mas não exposto |
| **Backend Service** | ✅ | `backend/modules/payments/services/bonus-wallet.service.ts` — BonusWalletService (397 linhas) | Implementado mas não exposto |
| **Backend Repository** | ❌ | Nenhum — WalletService acessa Supabase diretamente via `.from('wallets')` | Sem abstração |
| **Tabela wallets** | ❓ | `supabase.from('wallets')` é chamado mas **nenhuma migration** cria esta tabela | **Gap** |
| **Tabela wallet_transactions** | ❓ | `supabase.from('wallet_transactions')` é chamado mas **nenhuma migration** cria esta tabela | **Gap** |
| **Tabela points_wallets** | ❓ | `supabase.from('points_wallets')` é chamado mas **nenhuma migration** cria esta tabela | **Gap** |
| **Tabela bonus_wallets** | ❓ | `supabase.from('bonus_wallets')` é chamado mas **nenhuma migration** cria esta tabela | **Gap** |

### 1.3 Cadeia de Consumo Wallet

```
httpClient.getWalletBalance(idComprador)
  → GET /api/wallets/${idComprador}/balance
    → ❌ 404 (nenhuma rota)
    → Backend WalletService.getWalletByidComprador(idComprador)
      → supabase.from('wallets').select('*').eq('id_comprador', idComprador)
        → ❓ tabela 'wallets' não tem migration
```

### 1.4 Quem REALMENTE usa WalletService (não-morta)

O WalletService NÃO é código morto. Ele é consumido **internamente** pelos payment flows:

```
payment flows (PIX, Card, Boleto, CashOnDelivery)
  → chamam walletService.creditWallet/debitWallet
    → EventBus emite eventos de transação
```

A implementação backend existe, mas a **camada HTTP** (routes + api) nunca foi criada para expor wallets.

### 1.5 Frontend WalletService: 6 métodos "not yet implemented"

| Método | Chamado por | Status |
|--------|-----------|--------|
| `fetchWalletByidComprador` | useWalletData | ✅ Calls httpClient (mas 404) |
| `fetchWalletTransactionsByWalletId` | useWalletData | ❌ throw Error |
| `fetchPointsWalletByidComprador` | useWalletData, useCreatePointsWallet | ✅ Calls httpClient (mas 404) |
| `createWallet` | useCreateWallet | ✅ Calls httpClient (mas 404) |
| `createPointsWallet` | useCreatePointsWallet | ✅ Calls httpClient (mas 404) |
| `createWalletTransaction` | — | ❌ throw Error |
| `updateWalletBalance` | — | ❌ throw Error |
| `fetchWithdrawals` | useWithdrawals | ❌ throw Error |
| `fetchRecentWithdrawals` | useWithdrawals | ❌ throw Error |
| `fetchWorkspaceSettings` | — | ❌ throw Error |
| `approveWithdrawals` | — | ❌ throw Error |
| `rejectWithdrawals` | — | ❌ throw Error |

---

## 2. MLM Commission Simulation

### 2.1 Descoberta Inicial

httpClient declara `simulateCommission` para `/api/mlm/simulate` mas nenhuma rota no servidor Express.

### 2.2 Evidências de cada camada

| Camada | Existe? | Onde? | Status |
|--------|---------|-------|--------|
| **Frontend** (httpClient) | ✅ | `http-client.ts:492-494` | Chamado por componente |
| **Frontend** (bonus.functions) | ✅ | `lib/api/bonus.functions.ts` — simulateCommission + calculateCommission + calculateMLMCommission | **Lógica MLM duplicada no frontend** |
| **Frontend** (MLMCommissionSimulator) | ✅ | `components/plans/MLMCommissionSimulator.tsx` | Componente React que chama simulateCommission |
| **Backend Route** | ❌ | Nenhuma rota `/api/mlm/*` | **Gap** |
| **Backend API** | ❌ | Nenhum arquivo em `backend/modules/mlm/api/` | **Gap** |
| **Backend Domain Services** | ✅ | `backend/modules/mlm/domain-services/` — CommissionCalculation, QualificationCalculation, PointsCalculation | Existem mas não expostos via API |
| **Backend Route** | ✅ | `routes/network.ts` — tem rotas para tree, downlines, upline, stats | Parcial (usa NetworkService, não MLM service) |

### 2.3 Quem REALMENTE usa os MLM domain services

```
backend/triggers no banco (processar_pedido_mlm)
  → chamam funções PL/pgSQL
    → que chamam CommissionCalculation/QualificationCalculation/PointsCalculation
      → diretamente via Supabase

backend/network routes
  → chamam NetworkService (não os MLM domain services)
```

Os MLM domain services estão implementados mas **não são chamados por nenhuma rota HTTP**. Eles são usados apenas:
- Pelas triggers SQL no banco
- Potencialmente por alguma edge function
- Diretamente via Supabase

---

## 3. Distribuidores: Rota sem Consumidor

### 3.1 Descoberta Inicial

O backend tem rota `/api/distributors/*` mas httpClient NÃO chama esta rota.

### 3.2 Evidências

| Camada | Existe? | Quem usa? |
|--------|---------|-----------|
| Route | ✅ `routes/distributors.ts` — GET /, GET /stats, GET /usuario/:usuario, GET /:id | Ninguém no frontend |
| Module API | ✅ `modules/distributors/api/` | Ninguém |
| Module Service | ✅ `modules/distributors/services/` | Ninguém |
| Module Repository | ✅ `modules/distributors/repositories/` | Ninguém |
| Frontend httpClient | ❌ 0 chamadas | N/A |
| Frontend supabase services | ❌ 0 chamadas | N/A |

**Hipótese:** Este módulo foi criado para ser consumido por scripts (sync AllIn) ou é legado de uma rota anterior.

---

## 4. Resumo da Ficha #02

| Artefato | Backend Routes | Backend Services | Backend Tables | Frontend Calls | Status |
|----------|---------------|-----------------|---------------|---------------|--------|
| Wallets | ❌ | ✅ (3 services) | ❓ (sem migration) | ✅ (9 métodos httpClient) | **HTTP layer gap** |
| MLM/simulate | ❌ | ✅ (3 domain services) | ✅ (12 tabelas mlm.*) | ✅ (1 método httpClient + lógica duplicada em bonus.functions) | **HTTP layer gap + duplicação** |
| Distributors | ✅ (completo) | ✅ (completo) | ✅ (tabelas crm.*) | ❌ | **Sem consumidor** |

### Conclusões

1. **Wallets**: Backend services estão completos mas **nunca receberam rota HTTP**. Frontend tenta chamar e recebe 404. As tabelas `wallets`, `wallet_transactions`, `points_wallets`, `bonus_wallets` não têm migration — provavelmente criadas manualmente no Supabase.

2. **MLM Simulation**: Backend domain services existem, mas rota HTTP nunca foi criada. Além disso, o frontend tem **lógica MLM duplicada** em `bonus.functions.ts` que faz o cálculo inline em vez de chamar o backend.

3. **Distributors**: Módulo backend completo mas **ninguém consome**. Provavelmente criado para substituição futura do CustomerService.
