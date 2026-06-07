# Análise do Sistema MLM e Dependências do Scrape

**Data:** 06/06/2026  
**Objetivo:** Analisar o sistema de MLM, bônus e dependências dos dados do scrape

---

## 🎯 Visão Geral do Sistema MLM

### Estrutura de Planos

O sistema possui **3 planos MLM** definidos em `src/modules/plans/mlm-rules.ts`:

1. **Plano Afiliado**
   - Investimento: R$ 0
   - Comissão direta: 20%
   - Bônus patrocinador: 18%

2. **Plano Avanço**
   - Investimento: R$ 997
   - Comissão direta: 0%
   - Bônus por geração:
     - Geração 1: 5%
     - Geração 2: 3%
     - Geração 3: 2%

3. **Plano Excelência**
   - Investimento: R$ 3.980
   - Comissão direta: 0%
   - Bônus por geração:
     - Geração 1: 5%
     - Geração 2: 3%
     - Geração 3: 2%
   - Bônus extras por diretos:
     - 4+ diretos: 2%
     - 8+ diretos: 4%

---

## 📊 Tabelas do Supabase e Dependências do Scrape

### Tabelas Alimentadas pelo Scrape

#### 1. **customers** (10 registros no teste)
**Fonte:** Scrape da loja virtual  
**Campos críticos do scrape:**
- `id_comprador` → Identificador único do cliente
- `usuario` → Username para login
- `patrocinador_comprador` → ID do patrocinador (CRÍTICO para MLM)
- `nome_completo` → Nome do cliente
- `email`, `telefone` → Contato
- `plano_comprador` → Plano atual do cliente
- `endereco`, `cidade`, `estado` → Endereço

**Dependências do sistema MLM:**
- `patrocinador_comprador` → Usado para construir `network_relationships`
- `plano_comprador` → Define regras de comissão
- `usuario` → Link com `auth.users`

#### 2. **orders** (10 registros no teste)
**Fonte:** Scrape da loja virtual  
**Campos críticos do scrape:**
- `numero_pedido` → ID do pedido
- `id_comprador` → Link com customer
- `valor_total_pedido` → Valor base para cálculo de bônus
- `status_pedido` → Status do pedido
- `data_pagamento` → Data de confirmação (trigger de bônus)
- `cancelado` → Se cancelado, não gera bônus

**Dependências do sistema MLM:**
- `valor_total_pedido` → Base para cálculo de todas as comissões
- `data_pagamento` → Trigger para cálculo de bônus
- `id_comprador` → Identifica quem fez a venda

#### 3. **order_items** (60 registros no teste)
**Fonte:** Scrape da loja virtual  
**Campos críticos do scrape:**
- `order_id` → Link com order
- `product_name` → Nome do produto
- `quantity` → Quantidade
- `unit_price`, `total_price` → Valores

**Dependências do sistema MLM:**
- Dados de produtos podem influenciar cálculos de bônus futuros
- Usado para analytics e relatórios

---

## 🔄 Fluxo de Cálculo de Bônus

### Função Principal: `calculateCommission` (bonus.functions.ts)

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
   - Usa `seller_id` para buscar customer
   - Obtém plano ativo e configuração

2. **Resolver configuração do plano** (plans + plan_bonuses)
   - Busca plano ativo do customer
   - Obtém regras de comissão do metadata
   - Retorna: directPct, sponsorPct, generationBonuses, extraDirectsBonuses

3. **Calcular comissão direta**
   ```typescript
   direct_commission = order_amount * (directPct / 100)
   ```

4. **Buscar patrocinador** (network_relationships)
   - Usa `seller_id` para buscar sponsor
   - Critical: depende de `patrocinador_comprador` do scrape

5. **Calcular bônus de patrocinador** (se aplicável)
   ```typescript
   if (sponsor && sponsorPct > 0) {
     mlm_commissions.push({
       recipient_id: sponsor.sponsor_customer_id,
       generation: 0,
       percentage: sponsorPct,
       amount: order_amount * (sponsorPct / 100)
     })
   }
   ```

6. **Calcular bônus de geração** (se aplicável)
   - Busca upline completo (network_relationships)
   - Aplica percentuais por geração
   - Critical: depende de estrutura de rede correta

7. **Calcular bônus por diretos** (se aplicável)
   - Conta diretos ativos do vendedor
   - Aplica bônus extras baseado em quantidade

---

## 🌐 Estrutura de Rede (network_relationships)

### Tabela Crítica

**Fonte:** Calculado a partir de `customers.patrocinador_comprador`  
**Registros:** 995 (baseado em migração anterior)

**Campos:**
- `customer_id` → ID do cliente
- `sponsor_customer_id` → ID do patrocinador
- `level` → Nível na rede (1, 2, 3...)
- `root_customer_id` → ID do root da rede

**Dependência do Scrape:**
- `customers.patrocinador_comprador` → Campo direto do scrape
- Sem este campo, a estrutura de rede não pode ser construída
- Sem estrutura de rede, bônus de geração não podem ser calculados

---

## 💰 Tabelas de Bônus e Carteiras

### Tabelas que Dependem dos Dados do Scrape

#### 1. **wallets** (1.631 registros)
- Saldo financeiro do cliente
- Atualizado quando bônus são calculados
- Depende de `orders` e `payments`

#### 2. **bonus_wallets** (1.631 registros)
- Carteira específica para bônus
- Recebe comissões MLM
- Depende de cálculos de bônus

#### 3. **points_wallets** (1.631 registros)
- Carteira de pontos
- Pode ser usada para gamificação
- Depende de atividades do cliente

#### 4. **payments** (43.717 registros)
- Histórico de pagamentos
- Trigger para cálculo de bônus
- Depende de `orders` do scrape

---

## 🔗 Dependências Críticas

### Campo Mais Crítico: `patrocinador_comprador`

**Por que é crítico:**
1. Constrói a estrutura de rede (network_relationships)
2. Determina quem recebe bônus de cada venda
3. Calcula níveis de geração para bônus MLM
4. Sem este campo, o sistema MLM não funciona

**Fonte:** Scrape da aba "Detalhes do Pedido" e "Detalhes do Distribuidor"

### Campo Segundo Mais Crítico: `plano_comprador`

**Por que é crítico:**
1. Define regras de comissão do cliente
2. Determina percentuais de bônus
3. Define se cliente tem acesso a bônus de geração
4. Sem este campo, comissões não podem ser calculadas

**Fonte:** Scrape da aba "Detalhes do Pedido"

### Campo Terceiro Mais Crítico: `valor_total_pedido`

**Por que é crítico:**
1. Base para cálculo de todas as comissões
2. Multiplicador para percentuais de bônus
3. Define valor total da transação
4. Sem este campo, bônus são R$ 0

**Fonte:** Scrape da aba "Detalhes do Pedido" e "Pagamento"

---

## 📋 Fluxo Completo: Scrape → MLM

```
Scrape da Loja Virtual
  ↓
customers (patrocinador_comprador, plano_comprador)
  ↓
network_relationships (calculado)
  ↓
orders (valor_total_pedido, data_pagamento)
  ↓
payments (confirmado = true)
  ↓
Trigger: calculate_order_bonus
  ↓
calculateCommission (bonus.functions.ts)
  ↓
Distribuição de bônus:
  - Comissão direta
  - Bônus patrocinador
  - Bônus geração 1, 2, 3
  - Bônus extras por diretos
  ↓
wallets / bonus_wallets (atualização de saldos)
```

---

## ⚠️ Pontos de Atenção

### 1. Integridade de `patrocinador_comprador`

**Risco:** Se o scrape não extrair corretamente o patrocinador, toda a estrutura de rede estará incorreta.

**Validação:**
- Verificar se todos os customers têm `patrocinador_comprador`
- Validar se o patrocinador existe na base
- Verificar se não há loops na rede

### 2. Consistência de `plano_comprador`

**Risco:** Se o plano não for identificado corretamente, comissões serão calculadas com regras erradas.

**Validação:**
- Verificar se todos os customers têm plano válido
- Validar se o plano existe na tabela `plans`
- Testar cálculos com cada plano

### 3. Precisão de `valor_total_pedido`

**Risco:** Se o valor estiver incorreto, todos os bônus estarão errados.

**Validação:**
- Comparar com soma de `order_items`
- Validar contra dados originais da loja virtual
- Verificar se descontos foram aplicados corretamente

---

## 🎯 Conclusão

O sistema MLM depende **integralmente** dos dados do scrape:

1. **Estrutura de Rede:** 100% depende de `patrocinador_comprador`
2. **Regras de Comissão:** 100% depende de `plano_comprador`
3. **Cálculos de Bônus:** 100% depende de `valor_total_pedido`
4. **Distribuição de Pagamentos:** 100% depende de estrutura de rede correta

Sem dados corretos do scrape, o sistema MLM não funciona. A qualidade do scrape determina a precisão de todos os cálculos financeiros.

---

**Documento criado em:** 06/06/2026  
**Versão:** 1.0
