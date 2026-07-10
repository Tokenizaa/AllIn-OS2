# Sprint 0 — Etapa B #06: Engenharia Reversa — Frontend Routes x Backend Routes

## Objetivo
Mapear as 47 rotas TanStack Router do frontend e cruzar com as 8 rotas registradas no backend Express, identificando gaps.

---

## 1. Rotas Registradas no Backend (8)

| Prefixo | Endpoints | Status |
|---------|-----------|--------|
| `/api/auth` | login, register, refresh, change-password, logout | ✅ Vivo |
| `/api/customers` | GET /, GET /with-order-stats, GET /:id, GET /:id/360, POST, PUT, DELETE, GET /stats/overview, GET /:sponsorId/downlines | ✅ Vivo |
| `/api/distributors` | GET /, GET /stats, GET /usuario/:usuario, GET /:id | 🔶 Sem consumidor frontend |
| `/api/plans` | CRUD + bonuses + customer activation + stats | ✅ Vivo |
| `/api/orders` | CRUD + summary + items + stats | ✅ Vivo |
| `/api/payments` | CRUD + webhook + stats | ⚠️ Vai crashar (imports quebrados) |
| `/api/network` | tree, downlines, upline, stats | ✅ Vivo |
| `/api/analytics` | executive, sales, network, plans, bonus-distribution | ⚠️ Vai crashar (imports quebrados) |

---

## 2. 🚨 25 Endpoints Chamados pelo Frontend que NÃO Existem (404)

### Produtos (3 endpoints — afeta `/produto/$id`, `/office/store`, `/products/`)
| Método httpClient | Endpoint |
|-------------------|----------|
| `getProducts` | `GET /api/products` |
| `getProductById` | `GET /api/products/:id` |
| `getStoresProducts` | `GET /api/products/stores` |

### Wallets (8 endpoints — afeta `/office/finance`, `/customers/$id`, `/wallets`)
| Método httpClient | Endpoint |
|-------------------|----------|
| `getWalletBalance` | `GET /api/wallets/:id/balance` |
| `getWalletTransactions` | `GET /api/wallets/:id/transactions` |
| `ensureWallet` | `POST /api/wallets/:id/ensure` |
| `creditWallet` | `POST /api/wallets/:id/credit` |
| `debitWallet` | `POST /api/wallets/:id/debit` |
| `freezeWallet` | `POST /api/wallets/:id/freeze` |
| `unfreezeWallet` | `POST /api/wallets/:id/unfreeze` |
| `getBonusWalletBalance` | `GET /api/wallets/:id/bonus/balance` |
| `getPointsWalletBalance` | `GET /api/wallets/:id/points/balance` |
| `ensurePointsWallet` | `POST /api/wallets/:id/points/ensure` |

### MLM (1 endpoint)
| Método httpClient | Endpoint |
|-------------------|----------|
| `simulateCommission` | `POST /api/mlm/simulate` |

### Customers sub-routes (7 endpoints)
| Método httpClient | Endpoint |
|-------------------|----------|
| `getCustomerByCompradorId` | `GET /api/customers/comprador/:id` |
| `getCustomersList` | `GET /api/customers/list` |
| `getRecentCustomers` | `GET /api/customers/recent` |
| `getNetworkMembers` | `GET /api/customers/network` |
| `getAnalyticsCustomers` | `GET /api/customers/analytics` |
| `getCustomerBonus` | `GET /api/customers/:id/bonus` |
| `getCustomerPlan` | `GET /api/customers/:id/plan` |

### Orders sub-routes (4 endpoints)
| Método httpClient | Endpoint |
|-------------------|----------|
| `getOrdersByComprador` | `GET /api/orders/comprador/:id` |
| `getOfficeOrders` | `GET /api/orders/office` |
| `getOrdersAndCustomers` | `GET /api/orders/with-customers` |
| `getRecentOrders` | `GET /api/orders/recent` |

---

## 3. Rota Backend sem Consumidor Frontend

### `/api/distributors` (4 endpoints) — CÓDIGO MORTO
Backend tem rota completa de distribuidores mas o frontend nunca chama `httpClient.getDistributors(...)`. Quem consumiria? Scripts de sync? Admin?

---

## 4. Rotas Frontend que Chamam Supabase Direto (sem httpClient)

| Rota | Serviço usado |
|------|---------------|
| `/` (Home) | supabase direct (distributor default) |
| `/$slug` (Distributor store) | productsService (supabase) |
| `/ativacao` | auth supabase |
| `/checkout` | auth supabase |
| `/cadastro` | auth supabase |
| `/seja-distribuidor` | auth supabase |
| `/doencas` | supabase direct |
| `/busca-produtos` | products context (supabase) |
| `/marketing` | useCampaigns (supabase) |
| `/settings` | featureFlags (supabase) |
| `/cliente` | auth supabase |
