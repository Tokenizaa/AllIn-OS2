# 🔄 Mapeamento de Migração: Pedidos → Rede → Bônus

**Data:** 6 de Junho de 2026  
**Fonte Principal:** `docs/reverse-engineering/loja-virtual-pedidos-mapping.md`  
**Objetivo:** Documentar como os dados de pedidos da loja virtual alimentam as tabelas do banco de dados e os cálculos de bônus/rede

---

## 🎯 Visão Geral

Este documento mapeia o fluxo completo de dados desde a loja virtual AllinBrasil até o banco Supabase, mostrando como os pedidos alimentam:
1. **Estrutura de Rede** (network_relationships, customers)
2. **Cálculos de Bônus** (comissões diretas, indiretas, gerações)
3. **Saldos Financeiros** (wallet, bonus_wallet)

---

## 📊 Estrutura de Fonte de Dados (Loja Virtual)

### Documento: `loja-virtual-pedidos-mapping.md`

**7 Abas Principais:**

1. **Detalhes do Pedido** (#tab-order)
   - ID do pedido, cliente, patrocinador, valores, status
   - Dados técnicos: IP, navegador, idioma
   - Campos personalizados

2. **Detalhes do Distribuidor** (#tab-distribuidor)
   - Nome, patrocinador, data nascimento
   - Endereço, CNPJ, IE, razão social, nome fantasia

3. **Detalhes do Pagamento** (#tab-payment)
   - Nome, sobrenome, empresa
   - Endereço completo do pagador

4. **Detalhes de Envio** (#tab-shipping)
   - Nome, sobrenome, telefone
   - Endereço de entrega, tipo de frete

5. **Produtos** (#tab-product)
   - Itens, quantidades, valores
   - Desconto distribuidor 50%, frete grátis

6. **Pagamento** (#tab-pagamento)
   - Valor total, valor confirmado
   - Histórico de pagamentos

7. **Histórico** (#tab-history)
   - Timeline completa de eventos
   - Status changes, notificações

---

## 🗄️ Estrutura do Banco de Dados Supabase

### Tabelas Principais Identificadas

#### 1. **customers** (1631 registros)
**Fonte:** API `/api/v1/clientes` e `/api/v1/distribuidores`

**Campos Críticos:**
- `id` (UUID) - ID do cliente/distribuidor
- `user_id` (UUID) - Link com auth.users
- `usuario` (VARCHAR) - Username para login
- `id_comprador` (VARCHAR) - ID do comprador na loja virtual
- `patrocinador_comprador` (VARCHAR) - ID do patrocinador
- `sponsor_id` (UUID) - Link para patrocinador no banco
- `qualification` (VARCHAR) - Qualificação atual
- `status` (VARCHAR) - Status (active/inactive)
- `plan_id` (UUID) - Plano atual
- `customer_type` (VARCHAR) - Tipo (distributor/customer)
- `path` (UUID[]) - Array de IDs do upline (para cálculos de rede)
- `metadata` (JSONB) - Dados adicionais

**Mapeamento da Loja Virtual:**
```
loja-virtual-pedidos-mapping.md → customers
├── Cliente (nome, email, telefone) → name, email, phone
├── Patrocinador (usuário, nome) → sponsor_id, patrocinador_comprador
├── Tipo de Cliente → customer_type
├── Qualificação → qualification
├── Status → status
└── CNPJ/CPF → metadata.cnpj/metadata.cpf
```

#### 2. **network_relationships** (995 registros)
**Fonte:** Calculado a partir de `customers.patrocinador_comprador`

**Campos Críticos:**
- `id` (UUID) - ID do relacionamento
- `user_id` (UUID) - ID do usuário
- `sponsor_customer_id` (UUID) - ID do patrocinador (customers)
- `customer_id` (UUID) - ID do cliente (customers)
- `level` (INTEGER) - Nível na rede (1, 2, 3...)
- `root_customer_id` (UUID) - ID do root da rede
- `created_at` (TIMESTAMP) - Data de criação

**Mapeamento da Loja Virtual:**
```
loja-virtual-pedidos-mapping.md → network_relationships
├── Patrocinador (usuário) → sponsor_customer_id
├── Cliente (usuário) → customer_id
├── Geração (calculada) → level
└── Data Criação → created_at
```

**Importante:** Esta tabela é a "alma" do sistema de bônus. Ela determina:
- Quem recebe bônus de cada venda
- Qual geração cada upline está
- A estrutura hierárquica para cálculos MLM

#### 3. **orders**
**Fonte:** API `/api/v1/pedidos`

**Campos Críticos (baseados na API):**
- `id` (UUID) - ID do pedido
- `customer_id` (UUID) - ID do cliente
- `distributor_id` (UUID) - ID do distribuidor (se aplicável)
- `order_amount` (DECIMAL) - Valor total
- `status` (VARCHAR) - Status do pedido
- `payment_confirmed` (BOOLEAN) - Pagamento confirmado
- `data_pagamento` (TIMESTAMP) - Data de pagamento
- `data_adicionado` (TIMESTAMP) - Data de criação
- `cancelado` (BOOLEAN) - Pedido cancelado

**Mapeamento da Loja Virtual:**
```
loja-virtual-pedidos-mapping.md (Aba 1) → orders
├── Pedido nº → id
├── Cliente → customer_id
├── Total → order_amount
├── Situação do pedido → status
├── Data pag → payment_confirmed, data_pagamento
├── Cadastro → data_adicionado
└── Pagamento confirmado → payment_confirmed
```

#### 4. **order_items**
**Fonte:** API `/api/v1/pedidos/Itens`

**Campos Críticos:**
- `id` (UUID) - ID do item
- `order_id` (UUID) - ID do pedido
- `product_id` (UUID) - ID do produto
- `quantity` (INTEGER) - Quantidade
- `unit_price` (DECIMAL) - Valor unitário
- `total_price` (DECIMAL) - Valor total

**Mapeamento da Loja Virtual:**
```
loja-virtual-pedidos-mapping.md (Aba 5) → order_items
├── Produto → product_id
├── SKU → metadata.sku
├── Quantidade → quantity
├── Valor → unit_price
└── Total → total_price
```

#### 5. **payments**
**Fonte:** API `/api/v1/pedidos/Pagamentos`

**Campos Críticos:**
- `id` (UUID) - ID do pagamento
- `order_id` (UUID) - ID do pedido
- `user_id` (UUID) - ID do usuário
- `amount` (DECIMAL) - Valor pago
- `payment_method` (VARCHAR) - Método de pagamento
- `confirmed` (BOOLEAN) - Confirmado
- `payment_date` (TIMESTAMP) - Data do pagamento

**Mapeamento da Loja Virtual:**
```
loja-virtual-pedidos-mapping.md (Aba 6) → payments
├── Nº Pagamento → id
├── Forma → payment_method
├── Valor → amount
├── Confirmado → confirmed
└── Data pagamento → payment_date
```

#### 6. **plans**
**Fonte:** Tabela de planos (não documentada no mapping, mas crítica)

**Campos Críticos:**
- `id` (UUID) - ID do plano
- `name` (VARCHAR) - Nome do plano
- `slug` (VARCHAR) - Slug do plano
- `investment` (DECIMAL) - Valor de investimento
- `metadata` (JSONB) - Configurações de comissão

**Estrutura de metadata.commission:**
```json
{
  "direct": 5,           // Comissão direta (%)
  "sponsor": 3,          // Bônus de patrocinador (%)
  "generations": [        // Bônus por geração
    { "generation": 1, "percentage": 5 },
    { "generation": 2, "percentage": 3 },
    { "generation": 3, "percentage": 2 }
  ],
  "extraDirects": [       // Bônus por diretos
    { "minDirects": 5, "percentage": 2 },
    { "minDirects": 10, "percentage": 3 }
  ],
  "mode": "mlm"          // Modo: direct_only, direct_plus_sponsor, mlm
}
```

#### 7. **bonus_transactions**
**Fonte:** Calculado via `bonus.functions.ts`

**Campos Críticos:**
- `id` (UUID) - ID da transação
- `user_id` (UUID) - ID do beneficiário
- `order_id` (UUID) - ID do pedido
- `bonus_type` (VARCHAR) - Tipo (direct, generation, sponsor, direct_bonus)
- `generation` (INTEGER) - Geração (para bônus de geração)
- `percentage` (DECIMAL) - Percentual aplicado
- `amount` (DECIMAL) - Valor do bônus
- `account_type` (VARCHAR) - Tipo de conta (saldo_compra, saldo_loja, etc.)
- `created_at` (TIMESTAMP) - Data de criação

---

## 🔗 Fluxo de Cálculo de Bônus

### Função: `calculateCommission` (bonus.functions.ts)

**Entrada:**
```typescript
{
  order_id: string,
  seller_id: string,
  order_amount: number
}
```

**Processo:**

1. **Buscar dados do vendedor** (customers)
   ```typescript
   const seller = await fetchCustomer(seller_id);
   ```

2. **Resolver configuração do plano** (plans + plan_bonuses)
   ```typescript
   const planConfig = await resolvePlanConfig(seller_id);
   // Retorna: directPct, sponsorPct, generationBonuses, extraDirectsBonuses
   ```

3. **Calcular comissão direta**
   ```typescript
   const direct_commission = order_amount * (directPct / 100);
   ```

4. **Buscar patrocinador** (network_relationships)
   ```typescript
   const sponsor = await fetchSponsor(seller_id);
   ```

5. **Calcular bônus de patrocinador** (se aplicável)
   ```typescript
   if (sponsor?.sponsor_customer_id && planConfig.sponsorPct > 0) {
     mlm_commissions.push({
       recipient_id: sponsor.sponsor_customer_id,
       generation: 0,
       percentage: planConfig.sponsorPct,
       amount: order_amount * (planConfig.sponsorPct / 100),
       bonus_type: "sponsor"
     });
   }
   ```

6. **Calcular bônus de geração** (se aplicável)
   ```typescript
   if (generationBonuses.length) {
     const upline = await fetchUpline(seller_id);
     for (const levelRow of upline) {
       const gen = Number(levelRow.level);
       const bonus = generationBonuses.find(b => b.generation === gen);
       if (bonus) {
         mlm_commissions.push({
           recipient_id: levelRow.sponsor_customer_id,
           generation: gen,
           percentage: bonus.percentage,
           amount: order_amount * (bonus.percentage / 100),
           bonus_type: "generation"
         });
       }
     }
   }
   ```

7. **Calcular bônus por diretos** (se aplicável)
   ```typescript
   const directCount = await countDirects(seller_id);
   const extraDirects = extraDirectsBonuses.filter(b => b.minDirects <= directCount);
   const extraDirectBonus = extraDirects.reduce((sum, b) => 
     sum + order_amount * (b.percentage / 100), 0
   );
   ```

**Saída:**
```typescript
{
  direct_commission: number,
  mlm_commissions: Array<{
    recipient_id: string,
    recipient_name: string,
    generation: number,
    percentage: number,
    amount: number,
    bonus_type: string
  }>,
  total_commission: number,
  breakdown: Array<{...}>
}
```

---

## 🌐 Estrutura de Rede (Network Tree)

### Função: `get_complete_downline_tree` (supabase_rls_migration.sql)

**Entrada:** `p_customer_id` (UUID)

**Processo:**

1. **Validar acesso RBAC**
   - Admins: acesso total
   - Distribuidores: apenas sua downline
   - Customers: apenas próprio registro

2. **Calcular árvore recursiva** (CTE)
   ```sql
   WITH RECURSIVE downline_cte AS (
     -- Anchor: cliente inicial
     SELECT id, name, email, status, plan_id, sponsor_id, 
            0 AS calculated_level, ARRAY[id] AS calculated_path
     FROM customers WHERE id = p_customer_id
     
     UNION ALL
     
     -- Recursive: downlines
     SELECT c.id, c.name, c.email, c.status, c.plan_id, c.sponsor_id,
            d.calculated_level + 1, d.calculated_path || c.id
     FROM customers c
     INNER JOIN downline_cte d ON c.sponsor_id = d.id
     WHERE NOT (c.id = ANY(d.calculated_path)) -- Prevenir loops
   )
   SELECT * FROM downline_cte ORDER BY calculated_level, name
   ```

3. **Retornar estrutura hierárquica**
   ```typescript
   {
     customer_id: UUID,
     name: string,
     email: string,
     status: string,
     plan_id: UUID,
     sponsor_id: UUID,
     level: number,
     path: UUID[]
   }
   ```

**Importante:** O campo `path` em `customers` é mantido via triggers:
- `trigger_customers_path_calc`: Calcula path antes de insert/update
- `trigger_customers_path_cascade`: Propaga mudanças para downlines

---

## 📋 Mapeamento Detalhado: Loja Virtual → Supabase

### Tabela 1: Detalhes do Pedido (Aba 1) → orders + customers

| Campo Loja Virtual | Tabela Supabase | Campo Supabase | Observações |
|-------------------|-----------------|----------------|------------|
| Pedido nº | orders | id | Primary key |
| Cliente | customers | name | Nome do cliente |
| Cliente (link) | orders | customer_id | Foreign key |
| Patrocinador (usuário) | customers | patrocinador_comprador | ID externo |
| Patrocinador (nome) | customers | sponsor_id | Foreign key |
| Tipo de cliente | customers | customer_type | distributor/customer |
| E-mail | customers | email | Email do cliente |
| Telefone | customers | phone | Telefone |
| CNPJ | customers | metadata.cnpj | JSONB |
| Tipo de pessoa | customers | metadata.tipo_pessoa | JSONB |
| Total | orders | order_amount | Valor total |
| Situação do pedido | orders | status | Status atual |
| Endereço IP | orders | metadata.ip_address | JSONB |
| Navegador | orders | metadata.user_agent | JSONB |
| Idioma | orders | metadata.language | JSONB |
| Cadastro | orders | data_adicionado | Timestamp |
| Modificação | orders | data_modificado | Timestamp |
| Usuário que finalizou | orders | metadata.finalized_by | JSONB |

### Tabela 2: Detalhes do Distribuidor (Aba 2) → customers

| Campo Loja Virtual | Tabela Supabase | Campo Supabase | Observações |
|-------------------|-----------------|----------------|------------|
| Nome | customers | name | Nome completo |
| Patrocinador (usuário) | customers | patrocinador_comprador | ID externo |
| Patrocinador (nome) | customers | sponsor_id | Foreign key |
| Data Nascimento | customers | metadata.data_nascimento | JSONB |
| E-mail | customers | email | Email |
| Endereço | customers | metadata.endereco | JSONB |
| Cidade / Estado | customers | metadata.cidade | JSONB |
| CNPJ | customers | metadata.cnpj | JSONB |
| IE | customers | metadata.ie | JSONB |
| Razão Social | customers | metadata.razao_social | JSONB |
| Nome Fantasia | customers | metadata.nome_fantasia | JSONB |

### Tabela 3: Detalhes do Pagamento (Aba 3) → payments + customers

| Campo Loja Virtual | Tabela Supabase | Campo Supabase | Observações |
|-------------------|-----------------|----------------|------------|
| Nome | customers | metadata.pagador_nome | JSONB |
| Sobrenome | customers | metadata.pagador_sobrenome | JSONB |
| Empresa | customers | metadata.pagador_empresa | JSONB |
| Endereço | customers | metadata.pagador_endereco | JSONB |
| Número | customers | metadata.pagador_numero | JSONB |
| Bairro | customers | metadata.pagador_bairro | JSONB |
| Cidade | customers | metadata.pagador_cidade | JSONB |
| CEP | customers | metadata.pagador_cep | JSONB |
| Estado | customers | metadata.pagador_estado | JSONB |
| UF | customers | metadata.pagador_uf | JSONB |
| País | customers | metadata.pagador_pais | JSONB |
| Complemento | customers | metadata.pagador_complemento | JSONB |

### Tabela 4: Detalhes de Envio (Aba 4) → orders + customers

| Campo Loja Virtual | Tabela Supabase | Campo Supabase | Observações |
|-------------------|-----------------|----------------|------------|
| Nome | orders | metadata.entrega_nome | JSONB |
| Sobrenome | orders | metadata.entrega_sobrenome | JSONB |
| Telefone | orders | metadata.entrega_telefone | JSONB |
| Empresa | orders | metadata.entrega_empresa | JSONB |
| Número | orders | metadata.entrega_numero | JSONB |
| Endereço | orders | metadata.entrega_endereco | JSONB |
| Bairro | orders | metadata.entrega_bairro | JSONB |
| Cidade | orders | metadata.entrega_cidade | JSONB |
| CEP | orders | metadata.entrega_cep | JSONB |
| Estado | orders | metadata.entrega_estado | JSONB |
| UF | orders | metadata.entrega_uf | JSONB |
| País | orders | metadata.entrega_pais | JSONB |
| Frete | orders | metadata.tipo_frete | JSONB |
| Complemento | orders | metadata.entrega_complemento | JSONB |

### Tabela 5: Produtos (Aba 5) → order_items + orders

| Campo Loja Virtual | Tabela Supabase | Campo Supabase | Observações |
|-------------------|-----------------|----------------|------------|
| Produto (nome) | order_items | metadata.product_name | JSONB |
| Produto (link) | order_items | product_id | Foreign key |
| Tamanho | order_items | metadata.tamanho | JSONB |
| Modelo | order_items | metadata.modelo | JSONB |
| SKU | order_items | metadata.sku | JSONB |
| Quantidade | order_items | quantity | Quantidade |
| Valor | order_items | unit_price | Valor unitário |
| Total | order_items | total_price | Valor total |
| Sub-total | orders | metadata.subtotal | JSONB |
| Desconto Distribuidor 50% | orders | metadata.desconto_distribuidor | JSONB |
| Frete Grátis | orders | metadata.frete | JSONB |
| Total | orders | order_amount | Valor final |

### Tabela 6: Pagamento (Aba 6) → payments

| Campo Loja Virtual | Tabela Supabase | Campo Supabase | Observações |
|-------------------|-----------------|----------------|------------|
| Valor total | payments | amount | Valor total |
| Valor confirmado | payments | metadata.valor_confirmado | JSONB |
| Nº Pagamento | payments | id | Primary key |
| Forma | payments | payment_method | Método |
| Método | payments | metadata.payment_method_extra | JSONB |
| Valor | payments | amount | Valor |
| Confirmado | payments | confirmed | Boolean |
| Data pagamento | payments | payment_date | Timestamp |

### Tabela 7: Histórico (Aba 7) → order_history

| Campo Loja Virtual | Tabela Supabase | Campo Supabase | Observações |
|-------------------|-----------------|----------------|------------|
| Cadastro | order_history | created_at | Timestamp |
| Comentário | order_history | comment | Texto |
| Situação | order_history | status | Status |
| Cliente notificado | order_history | customer_notified | Boolean |

---

## 🎬 Fluxo Completo de Migração

### Etapa 1: Extração de Dados (Crawler)

**Arquivo:** `loja-virtual-pedidos-mapping.md` (DataClasses Python)

```python
@dataclass
class PedidoCompleto:
    pedido: PedidoInfo
    distribuidor: DistribuidorInfo
    pagador: PagadorInfo
    envio: EnvioInfo
    produtos: ProdutosInfo
    pagamento: PagamentoInfo
    historico: List[HistoricoItem]
```

**Processo:**
1. Login na loja virtual (juniorind / allin2025)
2. Navegar para lista de pedidos
3. Extrair todos os pedidos (todas as páginas)
4. Para cada pedido, extrair 7 abas
5. Salvar em JSON/CSV

### Etapa 2: Transformação de Dados

**Mapeamento de Campos:**
- Converter IDs string → UUID
- Normalizar datas → ISO 8601
- Transformar valores monetários → DECIMAL
- Extrair metadados → JSONB
- Calcular path de rede → UUID[]

**Exemplo:**
```typescript
function transformPedido(pedido: PedidoCompleto): {
  order: Order,
  customer: Customer,
  items: OrderItem[],
  payments: Payment[]
} {
  // Transformar pedido
  const order: Order = {
    id: uuidv4(),
    customer_id: mapCustomer(pedido.pedido.cliente),
    order_amount: pedido.pedido.total,
    status: pedido.pedido.situacao,
    payment_confirmed: pedido.pagamento.valor_confirmado > 0,
    data_pagamento: pedido.pagamento.pagamentos[0]?.data_pagamento,
    data_adicionado: pedido.pedido.data_cadastro,
    metadata: {
      ip_address: pedido.pedido.ip,
      user_agent: pedido.pedido.navegador,
      language: pedido.pedido.idioma,
      desconto_distribuidor: pedido.produtos.desconto_distribuidor,
      frete: pedido.produtos.frete
    }
  };

  // Transformar cliente
  const customer: Customer = {
    id: mapCustomer(pedido.pedido.cliente),
    name: pedido.pedido.cliente,
    email: pedido.pedido.email,
    phone: pedido.pedido.telefone,
    patrocinador_comprador: pedido.pedido.patrocinador_usuario,
    sponsor_id: mapCustomer(pedido.pedido.patrocinador_usuario),
    tipo_cliente: pedido.pedido.tipo_cliente,
    qualification: pedido.distribuidor?.qualification || 'Associado',
    status: 'active',
    metadata: {
      cnpj: pedido.pedido.cnpj,
      tipo_pessoa: pedido.pedido.tipo_pessoa,
      pagador_nome: pedido.pagador.nome,
      entrega_endereco: pedido.envio.endereco
    }
  };

  // Transformar itens
  const items: OrderItem[] = pedido.produtos.itens.map(item => ({
    id: uuidv4(),
    order_id: order.id,
    product_id: mapProduct(item.nome),
    quantity: item.quantidade,
    unit_price: item.valor,
    total_price: item.total,
    metadata: {
      tamanho: item.tamanho,
      modelo: item.modelo,
      sku: item.sku
    }
  }));

  // Transformar pagamentos
  const payments: Payment[] = pedido.pagamento.pagamentos.map(pag => ({
    id: uuidv4(),
    order_id: order.id,
    user_id: customer.id,
    amount: pag.valor,
    payment_method: pag.forma,
    confirmed: pag.confirmado,
    payment_date: pag.data_pagamento,
    metadata: {
      payment_method_extra: pag.metodo
    }
  }));

  return { order, customer, items, payments };
}
```

### Etapa 3: Carga de Dados (Supabase)

**Ordem de Carga:**
1. **customers** (primeiro, pois outras tabelas dependem)
2. **network_relationships** (calculado a partir de customers)
3. **plans** (se não existirem)
4. **orders**
5. **order_items**
6. **payments**
7. **order_history**

**SQL de Carga:**
```sql
-- 1. Customers
INSERT INTO customers (id, user_id, usuario, name, email, phone, 
                       patrocinador_comprador, sponsor_id, qualification, 
                       status, customer_type, metadata, path)
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);

-- 2. Network Relationships (calculado)
INSERT INTO network_relationships (user_id, sponsor_customer_id, customer_id, 
                                   level, root_customer_id)
SELECT c1.user_id, c2.id, c1.id, 
       calculate_level(c1.sponsor_id, c2.id),
       find_root(c1.id)
FROM customers c1
JOIN customers c2 ON c1.sponsor_id = c2.id;

-- 3. Orders
INSERT INTO orders (id, customer_id, order_amount, status, 
                    payment_confirmed, data_pagamento, data_adicionado, metadata)
VALUES (?, ?, ?, ?, ?, ?, ?, ?);

-- 4. Order Items
INSERT INTO order_items (id, order_id, product_id, quantity, 
                         unit_price, total_price, metadata)
VALUES (?, ?, ?, ?, ?, ?, ?);

-- 5. Payments
INSERT INTO payments (id, order_id, user_id, amount, payment_method, 
                      confirmed, payment_date, metadata)
VALUES (?, ?, ?, ?, ?, ?, ?, ?);

-- 6. Order History
INSERT INTO order_history (id, order_id, created_at, comment, 
                           status, customer_notified)
VALUES (?, ?, ?, ?, ?, ?);
```

### Etapa 4: Cálculo de Bônus (Pós-Carga)

**Trigger Automático:**
```sql
CREATE TRIGGER trigger_calculate_bonus
AFTER INSERT OR UPDATE ON payments
FOR EACH ROW
WHEN (NEW.confirmed = true AND OLD.confirmed = false)
EXECUTE FUNCTION calculate_order_bonus(NEW.order_id);
```

**Função de Cálculo:**
```sql
CREATE OR REPLACE FUNCTION calculate_order_bonus(p_order_id UUID)
RETURNS VOID AS $$
DECLARE
  v_order orders%ROWTYPE;
  v_seller customers%ROWTYPE;
  v_plan_config JSONB;
  v_direct_commission DECIMAL;
BEGIN
  -- Buscar pedido
  SELECT * INTO v_order FROM orders WHERE id = p_order_id;
  
  -- Buscar vendedor
  SELECT * INTO v_seller FROM customers WHERE id = v_order.customer_id;
  
  -- Buscar configuração do plano
  SELECT metadata INTO v_plan_config 
  FROM plans 
  WHERE id = v_seller.plan_id;
  
  -- Calcular comissão direta
  v_direct_commission := v_order.order_amount * 
    (v_plan_config->'commission'->>'direct')::DECIMAL / 100;
  
  -- Inserir bônus direto
  INSERT INTO bonus_transactions (user_id, order_id, bonus_type, 
                                  generation, percentage, amount, account_type)
  VALUES (v_seller.id, p_order_id, 'direct', 0, 
          (v_plan_config->'commission'->>'direct')::DECIMAL, 
          v_direct_commission, 'saldo_compra');
  
  -- Calcular bônus de geração (para upline)
  -- ... (lógica recursiva usando network_relationships)
  
END;
$$ LANGUAGE plpgsql;
```

---

## 🔍 Pontos Críticos de Atenção

### 1. **Integridade da Rede (network_relationships)**

**Problema:** A tabela `network_relationships` é a base de todos os cálculos de bônus. Se estiver incorreta, todos os bônus estarão errados.

**Solução:**
- Validar cada relacionamento durante a migração
- Verificar se não há loops (ciclos)
- Recalcular `path` para todos os customers
- Usar triggers para manter consistência

### 2. **Configuração de Planos (plans.metadata)**

**Problema:** As regras de comissão estão no metadata JSON. Se estiverem mal formatadas, os cálculos falham.

**Solução:**
- Validar schema do metadata antes da carga
- Criar schema Zod para validação
- Testar cálculos com dados de exemplo
- Documentar todas as regras

### 3. **Conversão de IDs**

**Problema:** IDs da loja virtual (string/int) precisam ser convertidos para UUID no Supabase.

**Solução:**
- Criar tabela de mapeamento: `external_id_mapping`
- Manter referência cruzada
- Usar UUID v5 (determinístico) baseado no ID externo

### 4. **Histórico de Bônus**

**Problema:** Bônus já pagos na loja virtual precisam ser migrados para manter consistência financeira.

**Solução:**
- Extrair dados de `ContasTransacoesRelatorio` (API)
- Migrar para `bonus_transactions`
- Recalcular para validar consistência
- Marcar como "migrated" para diferenciar

### 5. **Saldos Financeiros**

**Problema:** Saldos atuais (saldo para compra, saldo loja, etc.) precisam ser migrados.

**Solução:**
- Criar tabela `wallet_balances`
- Migrar saldos iniciais
- Criar transação de ajuste inicial
- Validar soma de transações = saldo atual

---

## 📊 Estrutura de Validação

### Validação 1: Contagem de Registros

```sql
-- Validar contagem após migração
SELECT 
  (SELECT COUNT(*) FROM customers) as customers_count,
  (SELECT COUNT(*) FROM network_relationships) as network_count,
  (SELECT COUNT(*) FROM orders) as orders_count,
  (SELECT COUNT(*) FROM order_items) as items_count,
  (SELECT COUNT(*) FROM payments) as payments_count;
```

**Esperado:**
- customers: ~1631 (baseado em migração anterior)
- network_relationships: ~995 (baseado em migração anterior)
- orders: [número de pedidos extraídos]
- order_items: [número de itens extraídos]
- payments: [número de pagamentos extraídos]

### Validação 2: Integridade de Rede

```sql
-- Verificar se todos os customers têm path válido
SELECT id, name, path 
FROM customers 
WHERE path IS NULL OR array_length(path, 1) = 0;

-- Verificar se não há loops
SELECT c1.id, c1.name, c1.path
FROM customers c1
WHERE c1.id = ANY(c1.path);

-- Verificar se todos os network_relationships são válidos
SELECT nr.id, nr.customer_id, nr.sponsor_customer_id
FROM network_relationships nr
LEFT JOIN customers c ON nr.customer_id = c.id
LEFT JOIN customers s ON nr.sponsor_customer_id = s.id
WHERE c.id IS NULL OR s.id IS NULL;
```

### Validação 3: Consistência de Bônus

```sql
-- Validar soma de bônus por pedido
SELECT 
  o.id as order_id,
  o.order_amount,
  SUM(bt.amount) as total_bonus,
  (SUM(bt.amount) / o.order_amount * 100) as bonus_percentage
FROM orders o
LEFT JOIN bonus_transactions bt ON o.id = bt.order_id
GROUP BY o.id, o.order_amount
HAVING SUM(bt.amount) > o.order_amount; -- Bônus não pode exceder valor do pedido
```

### Validação 4: Saldos Financeiros

```sql
-- Validar soma de transações = saldo atual
SELECT 
  w.user_id,
  w.balance as current_balance,
  COALESCE(SUM(bt.amount), 0) as calculated_balance,
  w.balance - COALESCE(SUM(bt.amount), 0) as difference
FROM wallet_balances w
LEFT JOIN bonus_transactions bt ON w.user_id = bt.user_id
GROUP BY w.user_id, w.balance
HAVING w.balance != COALESCE(SUM(bt.amount), 0);
```

---

## 🎯 Próximos Passos

### Imediatos

1. **Implementar Crawler**
   - Criar script Python baseado no dataclass do documento
   - Testar extração de pedidos de amostra
   - Validar estrutura de dados extraídos

2. **Criar Tabelas de Mapeamento**
   - `external_id_mapping` (ID externo → UUID)
   - `migration_log` (registro de migrações)
   - `wallet_balances` (saldos financeiros)

3. **Implementar Transformação**
   - Criar funções TypeScript de transformação
   - Validar conversão de tipos
   - Testar com dados de amostra

4. **Executar Migração Piloto**
   - Migrar 10 pedidos de teste
   - Validar integridade de rede
   - Calcular bônus manualmente para validar

### Curto Prazo

5. **Migração Completa**
   - Extrair todos os pedidos da loja virtual
   - Transformar e carregar dados
   - Validar contagens e integridade

6. **Recalcular Bônus**
   - Executar cálculo de bônus para todos os pedidos
   - Validar contra bônus originais
   - Ajustar configurações de planos se necessário

7. **Migrar Saldos**
   - Extrair saldos atuais da loja virtual
   - Criar transações de ajuste inicial
   - Validar consistência financeira

### Médio Prazo

8. **Implementar Triggers**
   - Trigger de cálculo automático de bônus
   - Trigger de manutenção de path
   - Trigger de auditoria de mudanças

9. **Criar Dashboard de Validação**
   - Monitorar integridade de rede
   - Alertar sobre inconsistências
   - Relatórios de bônus calculados

10. **Documentar Processo**
    - Criar guia de operação
    - Documentar troubleshooting
    - Criar playbooks de recuperação

---

## 📝 Conclusão

O documento `loja-virtual-pedidos-mapping.md` é efetivamente a "alma do projeto" porque contém:

1. **Estrutura Completa de Pedidos**: Todos os dados necessários para reconstruir o histórico de vendas
2. **Dados de Rede**: Informações de patrocinadores e distribuidores para montar a hierarquia
3. **Base para Cálculos**: Valores, descontos e produtos que alimentam os cálculos de bônus

O fluxo de migração é:
```
Loja Virtual (Crawler) 
  → Transformação (Python/TypeScript) 
  → Carga (Supabase) 
  → Cálculo de Bônus (Functions/Triggers)
  → Validação (SQL Queries)
```

A tabela `network_relationships` é o componente mais crítico, pois é a base para todos os cálculos de bônus MLM. Qualquer erro nesta tabela afeta toda a cadeia de pagamentos.

---

**Documento criado em:** 6 de Junho de 2026  
**Versão:** 1.0  
**Autor:** Cascade AI Assistant
