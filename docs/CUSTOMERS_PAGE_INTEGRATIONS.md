# INTEGRAÇÕES DA PÁGINA /CUSTOMERS COM BANCO DE DADOS

**Data:** 2026-06-09  
**Escopo:** Página de clientes e componentes  
**Objetivo:** Documentar integrações necessárias para bom funcionamento

---

# ESTRUTURA DA PÁGINA

## 1. Página Principal: `/customers` (index.tsx)

**Localização:** `src/routes/_app/customers/index.tsx`

**Função:** Listagem paginada de distribuidores com filtros e estatísticas

### Componentes da Página
- `PageHeader` - Cabeçalho da página
- `Input` - Campo de busca
- `Badge` - Badges de status
- `Button` - Botões de ação
- Tabela de listagem com paginação

### Dados Exibidos
- Lista de clientes (paginada)
- Estatísticas de pedidos por cliente
- Contagem total de clientes
- Filtros por plano e cidade

---

## 2. Página de Detalhes: `/customers/$id` ($id.tsx)

**Localização:** `src/routes/_app/customers/$id.tsx`

**Função:** Visualização 360° do cliente com múltiplas abas

### Componentes da Página
- `PageHeader` - Cabeçalho da página
- `Tabs` - Sistema de abas
- `CustomerProfileCard` - Card de perfil do cliente
- `CustomerKPIs` - Indicadores chave de performance
- `CustomerTimelineTab` - Timeline de eventos
- `CustomerOrdersTab` - Lista de pedidos
- `CustomerWalletTab` - Carteira financeira
- `CustomerNetworkTab` - Rede de indicações
- `CustomerDocumentsTab` - Documentos de compliance
- `CustomerAutomationsTab` - Automações ativas

---

# COMPONENTES E INTEGRAÇÕES COM BANCO DE DADOS

## 1. CustomerProfileCard

**Localização:** `src/components/customers/CustomerProfileCard.tsx`

**Função:** Exibir perfil básico do cliente e informações do patrocinador

### Dados Exibidos
- Nome do cliente
- ID do comprador
- Email/ID do usuário
- Telefone
- Cidade/Estado
- CPF
- Qualificação
- Plano
- Status
- Patrocinador (link para 360°)

### Integração com Banco de Dados
**Tabela Principal:** `customers`

**Campos Necessários:**
```sql
customers.id
customers.nome_completo
customers.id_comprador
customers.usuario
customers.user_id
customers.telefone
customers.cidade
customers.estado
customers.metadata->>'cpf' ou customers.cpf
customers.qualification
customers.plano_id ou customers.plan_id
customers.plano_comprador
customers.status
customers.patrocinador_comprador
```

**Relacionamentos:**
- `customers.patrocinador_comprador` → `customers.id_comprador` (self-join para patrocinador)

### Requisitos para Bom Funcionamento
1. **Índices Necessários:**
   - `CREATE INDEX idx_customers_id_comprador ON customers(id_comprador)`
   - `CREATE INDEX idx_customers_patrocinador ON customers(patrocinador_comprador)`

2. **Dados Obrigatórios:**
   - `id_comprador` deve ser único e não nulo
   - `nome_completo` deve estar preenchido
   - `status` deve ter valor padrão ('pending')

3. **Performance:**
   - Query de patrocinador deve usar índice
   - Cache de perfil do patrocinador recomendado

---

## 2. CustomerKPIs

**Localização:** `src/components/customers/CustomerKPIs.tsx`

**Função:** Exibir indicadores chave de performance do cliente

### Dados Exibidos
- LTV (Lifetime Value)
- Total Comprado
- Pedidos na Conta
- Risco de Churn
- Mensagem de sincronização ativa

### Integração com Banco de Dados
**Tabelas Principais:**
- `customers` - Dados do cliente
- `orders` - Pedidos para cálculos

**Campos Necessários:**
```sql
-- Tabela customers
customers.id
customers.id_comprador
customers.status
customers.created_at
customers.metadata

-- Tabela orders
orders.id
orders.id_comprador
orders.valor_total_pedido
orders.status_pedido
orders.created_at
```

**Cálculos Realizados:**
- LTV = Soma de pedidos pagos
- Total Comprado = Soma de todos os pedidos
- Risco de Churn = Baseado em recência de pedidos e status

### Requisitos para Bom Funcionamento
1. **Índices Necessários:**
   - `CREATE INDEX idx_orders_id_comprador ON orders(id_comprador)`
   - `CREATE INDEX idx_orders_status_pedido ON orders(status_pedido)`
   - `CREATE INDEX idx_orders_created_at ON orders(created_at)`

2. **Performance:**
   - Query de pedidos deve usar índice composto `(id_comprador, created_at DESC)`
   - Considerar materialized view para LTV agregado

3. **Cálculos:**
   - Função `calculateLTV` deve considerar apenas pedidos com status 'pago', 'entregue', 'enviado'
   - Risco de churn deve considerar inatividade > 90 dias

---

## 3. CustomerTimelineTab

**Localização:** `src/components/customers/CustomerTimelineTab.tsx`

**Função:** Exibir linha do tempo de eventos do cliente

### Dados Exibidos
- Notas personalizadas (estado local)
- Ficha operacional
- Pedidos recentes (timeline)

### Integração com Banco de Dados
**Tabelas Principais:**
- `customers` - Data de criação
- `orders` - Pedidos para timeline

**Campos Necessários:**
```sql
-- Tabela customers
customers.created_at

-- Tabela orders
orders.id
orders.numero_pedido
orders.status_pedido
orders.status
orders.created_at
```

**Funcionalidades:**
- Adicionar notas (estado local, não persistido)
- Exibir timeline de pedidos

### Requisitos para Bom Funcionamento
1. **Persistência de Notas:**
   - Atualmente notas são apenas estado local
   - **RECOMENDAÇÃO:** Criar tabela `customer_notes` para persistência

2. **Tabela Sugerida:**
```sql
CREATE TABLE customer_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES customers(id),
  id_comprador TEXT REFERENCES customers(id_comprador),
  note TEXT NOT NULL,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_customer_notes_customer ON customer_notes(customer_id);
CREATE INDEX idx_customer_notes_comprador ON customer_notes(id_comprador);
```

3. **Performance:**
   - Timeline deve limitar a últimos 50 eventos
   - Paginação recomendada para histórico extenso

---

## 4. CustomerOrdersTab

**Localização:** `src/components/customers/CustomerOrdersTab.tsx`

**Função:** Exibir lista de pedidos do cliente

### Dados Exibidos
- Número do pedido
- Status do pedido
- Método de pagamento
- Valor do pedido
- Data de emissão

### Integração com Banco de Dados
**Tabela Principal:** `orders`

**Campos Necessários:**
```sql
orders.id
orders.numero_pedido
orders.id_comprador
orders.status_pedido
orders.status
orders.payment_method
orders.payment_status
orders.valor_total_pedido
orders.valor_total
orders.created_at
```

### Requisitos para Bom Funcionamento
1. **Índices Necessários:**
   - `CREATE INDEX idx_orders_id_comprador_created ON orders(id_comprador, created_at DESC)`

2. **Filtros:**
   - Deve suportar filtro por status
   - Deve suportar filtro por período

3. **Performance:**
   - Query deve usar índice composto
   - Paginação recomendada para > 100 pedidos

---

## 5. CustomerWalletTab

**Localização:** `src/components/customers/CustomerWalletTab.tsx`

**Função:** Exibir carteiras financeiras e transações

### Dados Exibidos
- Carteira monetária (All In Pay)
- Conta fidelidade (Cashback/Network)
- Ações de ajuste de saldo
- Extrato histórico

### Integração com Banco de Dados
**Tabelas Principais:**
- `wallets` - Carteira monetária
- `points_wallets` - Carteira de pontos
- `wallet_transactions` - Transações

**Campos Necessários:**
```sql
-- Tabela wallets
wallets.id
wallets.id_comprador
wallets.balance
wallets.available_balance
wallets.created_at

-- Tabela points_wallets
points_wallets.id
points_wallets.id_comprador
points_wallets.balance
points_wallets.total_earned
points_wallets.total_redeemed
points_wallets.created_at

-- Tabela wallet_transactions
wallet_transactions.id
wallet_transactions.wallet_id
wallet_transactions.reference_id
wallet_transactions.transaction_type
wallet_transactions.amount
wallet_transactions.balance_after
wallet_transactions.description
wallet_transactions.reference_type
wallet_transactions.created_at
```

**Funcionalidades:**
- Criar carteira monetária
- Criar carteira de pontos
- Adicionar transação manual
- Exibir extrato

### Requisitos para Bom Funcionamento
1. **Índices Necessários:**
   - `CREATE INDEX idx_wallets_id_comprador ON wallets(id_comprador)`
   - `CREATE INDEX idx_points_wallets_id_comprador ON points_wallets(id_comprador)`
   - `CREATE INDEX idx_wallet_transactions_wallet ON wallet_transactions(wallet_id, created_at DESC)`

2. **Constraints:**
   - `wallets.id_comprador` deve ser UNIQUE (apenas uma carteira por cliente)
   - `points_wallets.id_comprador` deve ser UNIQUE
   - `wallet_transactions.amount` deve ser > 0
   - `balance_after` deve ser calculado corretamente

3. **Transações:**
   - Deve usar transações do banco para consistência
   - Validação de saldo antes de débito
   - Trigger para atualizar `balance_after` automaticamente

4. **Trigger Sugerido:**
```sql
CREATE OR REPLACE FUNCTION update_wallet_balance()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.transaction_type = 'credit' THEN
    UPDATE wallets 
    SET balance = balance + NEW.amount,
        available_balance = available_balance + NEW.amount
    WHERE id = NEW.wallet_id;
  ELSE
    UPDATE wallets 
    SET balance = balance - NEW.amount,
        available_balance = available_balance - NEW.amount
    WHERE id = NEW.wallet_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_wallet_balance
AFTER INSERT ON wallet_transactions
FOR EACH ROW
EXECUTE FUNCTION update_wallet_balance();
```

---

## 6. CustomerNetworkTab

**Localização:** `src/components/customers/CustomerNetworkTab.tsx`

**Função:** Exibir rede de indicações diretas (downlines)

### Dados Exibidos
- Lista de downlines diretos
- Código/ID do comprador
- Graduação
- Status da conta
- Cidade/UF
- Data de cadastro
- Link para 360°

### Integração com Banco de Dados
**Tabela Principal:** `customers`

**Campos Necessários:**
```sql
customers.id
customers.usuario
customers.id_comprador
customers.qualification
customers.status
customers.cidade
customers.estado
customers.created_at
customers.patrocinador_comprador
```

**Query Principal:**
```sql
SELECT id, usuario, id_comprador, status, telefone, created_at, 
       cidade, estado, nome_completo, qualification
FROM customers
WHERE patrocinador_comprador = $1
ORDER BY created_at DESC
```

### Requisitos para Bom Funcionamento
1. **Índices Necessários:**
   - `CREATE INDEX idx_customers_patrocinador_comprador ON customers(patrocinador_comprador)`
   - `CREATE INDEX idx_customers_patrocinador_created ON customers(patrocinador_comprador, created_at DESC)`

2. **Performance:**
   - Query deve usar índice composto
   - Cache de downlines recomendado para clientes com rede grande

3. **Dados:**
   - `patrocinador_comprador` deve estar preenchido para downlines
   - `qualification` deve ter valor padrão ('Afiliado')

4. **Genealogia:**
   - Para rede multinível, considerar tabela `network_relationships`
   - Suporte para níveis de profundidade (1º, 2º, 3º nível)

---

## 7. CustomerDocumentsTab

**Localização:** `src/components/customers/CustomerDocumentsTab.tsx`

**Função:** Gerenciar documentos de compliance

### Dados Exibidos
- Lista de documentos
- Status (approved, pending, missing, rejected)
- Tipo de documento
- Data de atualização
- Ações (aprovar, rejeitar, enviar)

### Integração com Banco de Dados
**Tabela Principal:** `customer_documents`

**Campos Necessários:**
```sql
customer_documents.id
customer_documents.customer_id
customer_documents.name
customer_documents.type
customer_documents.status
customer_documents.required
customer_documents.updated_at
customer_documents.file_url
customer_documents.file_size
```

**Funcionalidades:**
- Carregar documentos do cliente
- Aprovar documento
- Rejeitar documento
- Simular upload
- Aprovar todos

### Requisitos para Bom Funcionamento
1. **Índices Necessários:**
   - `CREATE INDEX idx_customer_documents_customer ON customer_documents(customer_id)`
   - `CREATE INDEX idx_customer_documents_status ON customer_documents(status)`

2. **Tabela Sugerida:**
```sql
CREATE TABLE customer_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES customers(id),
  name TEXT NOT NULL,
  type TEXT,
  status TEXT DEFAULT 'missing' CHECK (status IN ('missing', 'pending', 'approved', 'rejected')),
  required BOOLEAN DEFAULT false,
  file_url TEXT,
  file_size BIGINT,
  updated_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_customer_documents_customer ON customer_documents(customer_id);
CREATE INDEX idx_customer_documents_status ON customer_documents(status);
```

3. **Storage:**
   - Usar Supabase Storage para arquivos
   - Bucket: `customer-documents`
   - RLS para acesso restrito

4. **Compliance:**
   - Documentos obrigatórios devem bloquear pagamentos se não aprovados
   - Trigger para validar status antes de saques

---

## 8. CustomerAutomationsTab

**Localização:** `src/components/customers/CustomerAutomationsTab.tsx`

**Função:** Gerenciar automações e gatilhos de comunicação

### Dados Exibidos
- Lista de automações ativas
- Tipo de automação
- Status (ativo/pausado)
- Número de execuções
- Descrição
- Ações (alternar, forçar gatilho)

### Integração com Banco de Dados
**Tabela Principal:** `customer_automations`

**Campos Necessários:**
```sql
customer_automations.id
customer_automations.customer_id
customer_automations.name
customer_automations.type
customer_automations.description
customer_automations.active
customer_automations.runs
customer_automations.last_run_at
customer_automations.created_at
```

**Funcionalidades:**
- Carregar automações do cliente
- Ativar/desativar automação
- Forçar execução de gatilho
- Limpar logs

### Requisitos para Bom Funcionamento
1. **Índices Necessários:**
   - `CREATE INDEX idx_customer_automations_customer ON customer_automations(customer_id)`
   - `CREATE INDEX idx_customer_automations_active ON customer_automations(active)`

2. **Tabela Sugerida:**
```sql
CREATE TABLE customer_automations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES customers(id),
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  description TEXT,
  active BOOLEAN DEFAULT true,
  runs INTEGER DEFAULT 0,
  last_run_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_customer_automations_customer ON customer_automations(customer_id);
CREATE INDEX idx_customer_automations_active ON customer_automations(active);
```

3. **Tipos de Automação:**
   - `welcome_email` - Email de boas-vindas
   - `payment_reminder` - Lembrete de pagamento
   - `churn_prevention` - Prevenção de churn
   - `milestone_celebration` - Celebração de metas
   - `support_followup` - Follow-up de suporte

4. **Execução:**
   - Trigger para incrementar `runs` ao executar
   - Job scheduler para automações baseadas em tempo
   - Webhooks para integração externa

---

# HOOKS E SERVIÇOS

## 1. useCustomers

**Localização:** `src/hooks/customers/useCustomers.ts`

**Função:** Buscar clientes com estatísticas de pedidos

### Integração com Banco de Dados
**Serviço:** `CustomerService.fetchCustomersWithOrderStats()`

**Tabelas:**
- `customers` - Dados dos clientes
- `orders` - Estatísticas de pedidos

**Query:**
```sql
-- Clientes paginados
SELECT id, user_id, usuario, id_comprador, status, telefone, 
       created_at, nome_completo, plano_comprador, cidade, estado
FROM customers
ORDER BY created_at DESC
LIMIT $1 OFFSET $2;

-- Todos os pedidos para estatísticas
SELECT id, id_comprador, valor_total_pedido, status_pedido
FROM orders;
```

### Requisitos para Bom Funcionamento
1. **Performance:**
   - Query de pedidos pode ser pesada com muitos registros
   - **RECOMENDAÇÃO:** Usar materialized view para estatísticas agregadas

2. **Materialized View Sugerida:**
```sql
CREATE MATERIALIZED VIEW customer_order_stats AS
SELECT 
  id_comprador,
  COUNT(*) as order_count,
  SUM(CASE WHEN status_pedido IN ('pago', 'entregue', 'enviado') 
           THEN valor_total_pedido ELSE 0 END) as ltv
FROM orders
GROUP BY id_comprador;

CREATE UNIQUE INDEX idx_customer_order_stats_comprador 
  ON customer_order_stats(id_comprador);

-- Refresh automático
CREATE OR REPLACE FUNCTION refresh_customer_stats()
RETURNS TRIGGER AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY customer_order_stats;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_refresh_customer_stats
AFTER INSERT OR UPDATE ON orders
FOR EACH STATEMENT
EXECUTE FUNCTION refresh_customer_stats();
```

---

## 2. useCustomer360

**Localização:** `src/hooks/customers/useCustomer360.ts`

**Função:** Buscar dados completos do cliente 360°

### Integração com Banco de Dados
**Serviço:** `CustomerService`, `OrderService`, `WalletService`

**Tabelas:**
- `customers` - Dados do cliente
- `orders` - Pedidos do cliente
- `wallets` - Carteira monetária
- `points_wallets` - Carteira de pontos
- `wallet_transactions` - Transações
- `customers` (downlines) - Rede de indicações

**Queries:**
```sql
-- Pedidos do cliente
SELECT * FROM orders WHERE id_comprador = $1;

-- Patrocinador
SELECT * FROM customers WHERE id_comprador = $1;

-- Carteira monetária
SELECT * FROM wallets WHERE id_comprador = $1;

-- Carteira de pontos
SELECT * FROM points_wallets WHERE id_comprador = $1;

-- Cliente
SELECT * FROM customers WHERE id_comprador = $1;

-- Transações
SELECT * FROM wallet_transactions WHERE wallet_id = $1;

-- Downlines
SELECT id, usuario, id_comprador, status, telefone, created_at, 
       cidade, estado, nome_completo
FROM customers
WHERE patrocinador_comprador = $1
ORDER BY created_at DESC;
```

### Requisitos para Bom Funcionamento
1. **Índices Necessários:**
   - Todos os índices mencionados nos componentes anteriores
   - Índices compostos para queries frequentes

2. **Performance:**
   - Queries são executadas em paralelo (Promise.all)
   - Cache de dados recomendado (5-10 minutos)
   - Considerar Redis para cache de 360°

3. **Consistência:**
   - Todas as queries devem usar o mesmo `id_comprador`
   - Validação de dados antes de retornar
   - Tratamento de null/undefined

---

## 3. CustomerService

**Localização:** `src/services/customers/index.ts`

**Função:** Serviço central para operações com clientes

### Métodos e Integrações

#### fetchCustomerById
**Tabela:** `customers`
**Query:** `SELECT * FROM customers WHERE id = $1`
**Índice:** `PRIMARY KEY (id)`

#### fetchCustomerByCompradorId
**Tabela:** `customers`
**Query:** `SELECT * FROM customers WHERE id_comprador = $1`
**Índice:** `idx_customers_id_comprador`

#### fetchDownlines
**Tabela:** `customers`
**Query:** `SELECT ... WHERE patrocinador_comprador = $1`
**Índice:** `idx_customers_patrocinador_comprador`

#### fetchCustomersList
**Tabela:** `customers`
**Query:** `SELECT ... ORDER BY created_at DESC LIMIT $1`
**Índice:** `idx_customers_created_at`

#### fetchCustomersWithOrderStats
**Tabelas:** `customers`, `orders`
**Query:** Paginação + agregação de pedidos
**Índice:** Materialized view recomendada

#### fetchRecentCustomers
**Tabela:** `customers`
**Query:** `SELECT ... ORDER BY created_at DESC LIMIT $1`
**Índice:** `idx_customers_created_at`

#### fetchNetworkMembers
**Tabela:** `customers`
**Query:** `SELECT ... LIMIT $1`
**Índice:** Nenhum específico (full scan aceitável)

#### fetchAnalyticsCustomers
**Tabela:** `customers`
**Query:** `SELECT id, usuario, id_comprador, user_id, nome_completo`
**Índice:** Nenhum específico

#### fetchCustomerBonus
**Tabela:** `customer_bonus_view`
**Query:** `SELECT * FROM customer_bonus_view WHERE id_comprador = $1`
**Índice:** `idx_customer_bonus_view_comprador`

#### fetchCustomerPlan
**Tabela:** `customer_plans`, `plans`
**Query:** `SELECT *, plans(*) FROM customer_plans WHERE id_comprador = $1`
**Índice:** `idx_customer_plans_comprador`

### Requisitos para Bom Funcionamento
1. **Índices Obrigatórios:**
```sql
CREATE INDEX idx_customers_id_comprador ON customers(id_comprador);
CREATE INDEX idx_customers_patrocinador_comprador ON customers(patrocinador_comprador);
CREATE INDEX idx_customers_created_at ON customers(created_at DESC);
CREATE INDEX idx_customer_bonus_view_comprador ON customer_bonus_view(id_comprador);
CREATE INDEX idx_customer_plans_comprador ON customer_plans(id_comprador);
```

2. **Views:**
   - `customer_bonus_view` deve estar atualizada
   - `customer_plans` deve ter relacionamento com `plans`

3. **Performance:**
   - Queries devem usar índices apropriados
   - Considerar cache para queries frequentes
   - Monitorar tempo de execução

---

# TABELAS DO BANCO DE DADOS NECESSÁRIAS

## Tabela Principal: customers

```sql
CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  id_comprador TEXT UNIQUE NOT NULL,
  usuario TEXT UNIQUE,
  nome_completo TEXT NOT NULL,
  email TEXT,
  telefone TEXT,
  cpf TEXT,
  cidade TEXT,
  estado TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('active', 'pending', 'blocked', 'churned')),
  plano_id UUID REFERENCES plans(id),
  plan_id UUID, -- legado
  plano_comprador TEXT,
  qualification TEXT DEFAULT 'Bronze',
  patrocinador_comprador TEXT REFERENCES customers(id_comprador),
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_customers_id_comprador ON customers(id_comprador);
CREATE INDEX idx_customers_patrocinador_comprador ON customers(patrocinador_comprador);
CREATE INDEX idx_customers_created_at ON customers(created_at DESC);
CREATE INDEX idx_customers_status ON customers(status);
CREATE INDEX idx_customers_user_id ON customers(user_id);
```

## Tabela: orders

```sql
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  id_comprador TEXT REFERENCES customers(id_comprador),
  numero_pedido TEXT UNIQUE,
  valor_total_pedido DECIMAL(10,2),
  valor_total DECIMAL(10,2),
  status_pedido TEXT DEFAULT 'pending',
  status TEXT,
  payment_method TEXT,
  payment_status TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_orders_id_comprador ON orders(id_comprador);
CREATE INDEX idx_orders_id_comprador_created ON orders(id_comprador, created_at DESC);
CREATE INDEX idx_orders_status_pedido ON orders(status_pedido);
CREATE INDEX idx_orders_created_at ON orders(created_at);
```

## Tabela: wallets

```sql
CREATE TABLE wallets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  id_comprador TEXT UNIQUE REFERENCES customers(id_comprador),
  balance DECIMAL(10,2) DEFAULT 0,
  available_balance DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_wallets_id_comprador ON wallets(id_comprador);
```

## Tabela: points_wallets

```sql
CREATE TABLE points_wallets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  id_comprador TEXT UNIQUE REFERENCES customers(id_comprador),
  balance INTEGER DEFAULT 0,
  total_earned INTEGER DEFAULT 0,
  total_redeemed INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_points_wallets_id_comprador ON points_wallets(id_comprador);
```

## Tabela: wallet_transactions

```sql
CREATE TABLE wallet_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_id UUID REFERENCES wallets(id),
  reference_id TEXT,
  transaction_type TEXT CHECK (transaction_type IN ('credit', 'debit')),
  amount DECIMAL(10,2) NOT NULL CHECK (amount > 0),
  balance_after DECIMAL(10,2),
  description TEXT,
  reference_type TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_wallet_transactions_wallet ON wallet_transactions(wallet_id, created_at DESC);
```

## Tabela: customer_documents

```sql
CREATE TABLE customer_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES customers(id),
  name TEXT NOT NULL,
  type TEXT,
  status TEXT DEFAULT 'missing' CHECK (status IN ('missing', 'pending', 'approved', 'rejected')),
  required BOOLEAN DEFAULT false,
  file_url TEXT,
  file_size BIGINT,
  updated_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_customer_documents_customer ON customer_documents(customer_id);
CREATE INDEX idx_customer_documents_status ON customer_documents(status);
```

## Tabela: customer_automations

```sql
CREATE TABLE customer_automations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES customers(id),
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  description TEXT,
  active BOOLEAN DEFAULT true,
  runs INTEGER DEFAULT 0,
  last_run_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_customer_automations_customer ON customer_automations(customer_id);
CREATE INDEX idx_customer_automations_active ON customer_automations(active);
```

## Tabela: customer_notes (Sugerida)

```sql
CREATE TABLE customer_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES customers(id),
  id_comprador TEXT REFERENCES customers(id_comprador),
  note TEXT NOT NULL,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_customer_notes_customer ON customer_notes(customer_id);
CREATE INDEX idx_customer_notes_comprador ON customer_notes(id_comprador);
```

---

# RECOMENDAÇÕES PARA BOM FUNCIONAMENTO

## 1. Performance

### Índices Obrigatórios
- Todos os índices listados acima devem ser criados
- Índices compostos para queries frequentes
- Índices de foreign keys

### Materialized Views
- `customer_order_stats` para estatísticas de pedidos
- Refresh automático via triggers
- Refresh concorrente para não bloquear

### Cache
- Redis para cache de dados 360° (5-10 minutos)
- Cache de perfil de patrocinador
- Cache de downlines para redes grandes

## 2. Consistência de Dados

### Constraints
- `id_comprador` deve ser UNIQUE em `customers`
- `id_comprador` deve ser UNIQUE em `wallets` e `points_wallets`
- Validação de status (CHECK constraints)
- Validação de valores (CHECK amount > 0)

### Triggers
- Trigger para atualizar `balance_after` em transações
- Trigger para atualizar materialized views
- Trigger para validar status antes de saques

### Transações
- Usar transações do banco para operações críticas
- Rollback automático em caso de erro
- Isolamento apropriado (READ COMMITTED)

## 3. Segurança

### RLS (Row Level Security)
- Políticas de RLS em todas as tabelas
- Acesso baseado em role (admin, operator, distributor)
- Filtros por `user_id` para distribuidores

### Validação
- Validar `id_comprador` antes de operações
- Validar permissões do usuário
- Sanitizar inputs para evitar SQL injection

## 4. Monitoramento

### Logs
- Log de queries lentas (> 1s)
- Log de erros de banco
- Log de operações críticas (saques, aprovações)

### Métricas
- Tempo de resposta das queries
- Taxa de cache hit
- Contagem de operações por tipo

### Alertas
- Alerta para queries lentas
- Alerta para erros frequentes
- Alerta para inconsistências de dados

---

# CHECKLIST DE IMPLEMENTAÇÃO

## ✅ Tabelas do Banco de Dados
- [ ] `customers` com todos os campos e índices
- [ ] `orders` com todos os campos e índices
- [ ] `wallets` com todos os campos e índices
- [ ] `points_wallets` com todos os campos e índices
- [ ] `wallet_transactions` com todos os campos e índices
- [ ] `customer_documents` com todos os campos e índices
- [ ] `customer_automations` com todos os campos e índices
- [ ] `customer_notes` (sugerida) com todos os campos e índices

## ✅ Views e Materialized Views
- [ ] `customer_bonus_view` criada e indexada
- [ ] `customer_order_stats` materialized view criada
- [ ] Triggers para refresh automático

## ✅ Índices
- [ ] Todos os índices listados criados
- [ ] Índices compostos para queries frequentes
- [ ] Índices de foreign keys

## ✅ Triggers
- [ ] Trigger para atualizar `balance_after`
- [ ] Trigger para refresh materialized views
- [ ] Trigger para validação de saques

## ✅ RLS
- [ ] Políticas de RLS em todas as tabelas
- [ ] Políticas baseadas em role
- [ ] Testes de permissão

## ✅ Serviços
- [ ] `CustomerService` com todos os métodos
- [ ] `OrderService` com métodos necessários
- [ ] `WalletService` com métodos necessários
- [ ] `DocumentService` com métodos necessários
- [ ] `AutomationService` com métodos necessários

## ✅ Componentes
- [ ] `CustomerProfileCard` integrado
- [ ] `CustomerKPIs` integrado
- [ ] `CustomerTimelineTab` integrado
- [ ] `CustomerOrdersTab` integrado
- [ ] `CustomerWalletTab` integrado
- [ ] `CustomerNetworkTab` integrado
- [ ] `CustomerDocumentsTab` integrado
- [ ] `CustomerAutomationsTab` integrado

## ✅ Hooks
- [ ] `useCustomers` integrado
- [ ] `useCustomer360` integrado
- [ ] `useCustomer360Data` integrado

## ✅ Performance
- [ ] Cache implementado
- [ ] Materialized views criadas
- [ ] Queries otimizadas
- [ ] Paginação implementada

## ✅ Monitoramento
- [ ] Logs de queries lentas
- [ ] Métricas de performance
- [ ] Alertas configurados

---

# CONCLUSÃO

Para um bom funcionamento da página `/customers`, é essencial:

1. **Estrutura do Banco de Dados:** Todas as tabelas mencionadas devem existir com os campos e índices apropriados
2. **Integração dos Serviços:** Todos os serviços devem estar implementados e conectados ao Supabase
3. **Performance:** Índices, materialized views e cache são essenciais para performance
4. **Consistência:** Triggers e constraints garantem consistência dos dados
5. **Segurança:** RLS e validação protegem os dados

A página está bem estruturada e os componentes são modulares, facilitando manutenção e escalabilidade.
