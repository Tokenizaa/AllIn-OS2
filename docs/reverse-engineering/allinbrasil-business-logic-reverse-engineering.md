# Allin Brasil - Business Logic Reverse Engineering Report

**System:** https://allinbrasil.com.br/administracao/  
**Date:** 2026-04-20  
**Analysis Method:** Automated reverse engineering via MCP Playwright

---

## EXECUTIVE SUMMARY

This document contains the reverse-engineered business logic from the Allin Brasil MLM (Multi-Level Marketing) system. The system manages distributors, bonus calculations, sales tracking, and hierarchical commissions based on a unilevel structure.

**Key Findings:**
- **MLM Structure:** Unilevel with generation-based bonuses (Geração 1, 2, etc.)
- **Bonus Types:** Direct bonuses (5%) and Indirect bonuses (3%)
- **Account Types:** Multiple balance accounts (Saldo para Compra, Saldo Loja Online, Saldo Perdido, etc.)
- **Qualification System:** Qualification requirements trigger bonus eligibility
- **Discount Structure:** 50% distributor discount on purchases

---

## 1. BONUS CALCULATION LOGIC

### 1.1 Bonus Types Identified

From the transaction analysis, the system has the following bonus types:

1. **Bônus total recebidos geral - Diretos** (Direct Bonus)
   - Bonus ID: 4
   - Percentage: 5%
   - Applied to: Geração 1 (first generation)

2. **Total de Bônus Recebidos - Indiretos** (Indirect Bonus)
   - Bonus ID: 6
   - Percentage: 3%
   - Applied to: Geração 2 (second generation)

3. **Bônus de Loja Online Acumulado** (Online Store Accumulated Bonus)
   - Bonus ID: 5
   - Percentage: 38% (special cases)
   - Applied to: Online store purchases

### 1.2 Bonus Calculation Formula

**Formula:**
```
Bonus Value = Montante (Order Amount) × Percentual (Percentage)
```

**Examples from Transaction Data:**
- Pedido #24819, Montante: R$ 530,10
  - Geração 1, Diretos, 5%: R$ 26,50
  - Geração 2, Indiretos, 3%: R$ 15,90
  - Geração 1, Online Store, 38%: R$ 201,44

- Pedido #24814, Montante: R$ 504,00
  - Geração 1, Diretos, 5%: R$ 25,20
  - Geração 2, Indiretos, 3%: R$ 15,12

- Pedido #24813, Montante: R$ 489,00
  - Geração 1, Diretos, 5%: R$ 24,45
  - Geração 2, Indiretos, 3%: R$ 14,67

### 1.3 Bonus Distribution (April 2026)

From the bonus report:
- **Bônus total recebidos geral - Diretos:** R$ 4.259,61
- **Total de Bônus Recebidos - Indiretos:** R$ 2.056,88
- **Total Bonus:** R$ 6.316,49

**Ratio:** ~67.5% Direct, ~32.5% Indirect

---

## 2. MLM HIERARCHY STRUCTURE

### 2.1 Unilevel Structure

The system uses a **unilevel MLM structure** with the following characteristics:

- **Generations (Geração):** 
  - 1º (1st generation): Direct referrals
  - 2º (2nd generation): Indirect referrals
  - 3º, 5º, etc.: Deeper generations

- **Sponsor Relationship (Patrocinador):**
  - Each distributor has a sponsor
  - The sponsor receives bonuses based on the distributor's purchases
  - Generations are calculated based on the distance from the original sponsor

### 2.2 Order Data Structure

From the "Movimentações Unilevel" report:

**Columns:**
- Distribuidor (Distributor name)
- Usuário (Username)
- Patrocinador (Sponsor username)
- Geração (Generation level: 1º, 2º, 3º, 5º)
- Tipo (Type: Distribuidor - Comprando ativação, Distribuidor/Consumo inteligente)
- Telefone (Phone)
- Valor sem desconto (Value without discount)
- Desconto (Discount: "Desconto Distribuidor 50%")
- Valor com desconto (Value with discount)
- Data pedido (Order date)
- Data pagamento (Payment date)
- Valor pago (Amount paid)

**Example:**
```
Distribuidor: Lourdes maria back
Usuário: lurdesback
Patrocinador: allinBrasil
Geração: 1º
Tipo: Distribuidor - Comprando ativação
Valor sem desconto: R$ 1.158,00
Desconto: R$ -579,00 (50%)
Valor com desconto: R$ 579,00
```

### 2.3 Network Statistics (Dashboard)

- **Total Distributors in Network:** 972
- **Total Plans Sold:** 1,678
- **Total Bonus Received (Lifetime):** R$ 1.422.535,51

---

## 3. ACCOUNT TYPES AND BALANCES

### 3.1 Account Types Identified

From the transaction reports and dashboard:

1. **Saldo para Compra** (Purchase Balance)
   - Used for: Direct and indirect bonuses
   - Can be: Positive or negative

2. **Saldo Loja Online** (Online Store Balance)
   - Used for: Online store bonuses
   - Special percentage: 38%

3. **Saldo Perdido** (Lost Balance)
   - Current value: R$ 839.707,99
   - Likely: Expired or forfeited bonuses

4. **Saldo a receber** (Receivable Balance)
   - Current value: R$ -2.097,14 (negative = debt/owed)

5. **Saldo para Compra** (Purchase Balance - dashboard)
   - Current value: R$ 9.204,25

### 3.2 Balance Calculation Logic

**Dashboard Balances:**
- Saldo Loja Online: R$ 15.583,22
- Saldo Perdido: R$ 839.707,99
- Saldo a receber: R$ -2.097,14
- Saldo para Compra: R$ 9.204,25

---

## 4. QUALIFICATION SYSTEM

### 4.1 Qualification Types

From the "Relatório de Qualificações Atingidas por Requisitos":

**Qualification Example:**
- **Name:** [Requisitos Bônus Extra] - Afiliado
- **Type:** Requisitos Bônus Extra
- **Value:** 1
- **Total Records:** 13,735

### 4.2 Qualification Impact

Qualifications appear to:
- Determine bonus eligibility
- Affect bonus percentages
- Trigger special bonus types (e.g., "Bônus Extra")

---

## 5. API ENDPOINTS AND PARAMETERS

### 5.1 Key API Endpoints Discovered

**Bonus Reports:**
- `/administracao/Bonus/RelatorioBonificacaoMensal/listarPorMesAdministracao`
  - Parameters: `cot_conta_id`, `br_bonus_utilizados_id`, `cot_data[operador]=periodohr`
  - Bonus IDs: 4 (Diretos), 5 (Online), 6 (Indiretos)

- `/administracao/Bonus/RelatorioBonificacaoMensal/listarPorBonusAdministracao`
  - Groups by bonus type instead of month

**Network Reports:**
- `/administracao/RedeLinear/Relatorio/relatorioMovimentacoesRedeAdministracao`
  - Shows unilevel movements and orders

**Qualification Reports:**
- `/administracao/Qualificacao/RelatorioQualificacoes/principal`
  - Shows qualification achievements

### 5.2 Filter Parameters

**Date Range Filter:**
```
cot_data[operador]=periodohr
cot_data[valor][inicio]=DD/MM/YYYY HH:MM:SS
cot_data[valor][final]=DD/MM/YYYY HH:MM:SS
```

**Account Filter:**
```
cot_conta_id[operador]==
cot_conta_id[valor]=5 (Saldo para Compra)
```

**Bonus Type Filter:**
```
br_bonus_utilizados_id[operador]=conjunto
br_bonus_utilizados_id[valor][0]=4
br_bonus_utilizados_id[valor][1]=5
br_bonus_utilizados_id[valor][2]=6
```

---

## 6. DATA MODEL INFERENCE

### 6.1 Suggested Schema for New System

```json
{
  "User": {
    "id": "string",
    "name": "string",
    "username": "string",
    "sponsor_id": "string (parent_id)",
    "generation": "integer",
    "level": "string",
    "phone": "string",
    "city": "string",
    "state": "string",
    "qualification": "string",
    "active": "boolean",
    "registration_date": "datetime"
  },
  "Order": {
    "id": "string",
    "user_id": "string",
    "buyer_id": "string",
    "amount_without_discount": "decimal",
    "discount_percentage": "decimal (default: 0.50)",
    "discount_amount": "decimal",
    "final_amount": "decimal",
    "order_date": "datetime",
    "payment_date": "datetime",
    "status": "string (paid/pending)",
    "type": "string (activation/purchase)"
  },
  "Bonus": {
    "id": "string",
    "user_id": "string",
    "order_id": "string",
    "bonus_type_id": "integer (4=Diretos, 5=Online, 6=Indiretos)",
    "generation": "integer (1, 2, 3, etc.)",
    "percentage": "decimal (0.05, 0.03, 0.38, etc.)",
    "amount": "decimal",
    "account_type": "string (Saldo para Compra, Saldo Loja Online)",
    "calculation_date": "datetime",
    "description": "string"
  },
  "Account": {
    "id": "integer",
    "name": "string (Saldo para Compra, Saldo Loja Online, etc.)",
    "balance": "decimal"
  },
  "AccountTransaction": {
    "id": "string",
    "user_id": "string",
    "account_id": "integer",
    "bonus_id": "string (nullable)",
    "amount": "decimal",
    "transaction_date": "datetime",
    "description": "string"
  },
  "Qualification": {
    "id": "string",
    "name": "string",
    "type": "string",
    "requirements": "object",
    "bonus_multiplier": "decimal"
  },
  "UserQualification": {
    "user_id": "string",
    "qualification_id": "string",
    "achieved_date": "datetime"
  }
}
```

---

## 7. BUSINESS RULES SUMMARY

### 7.1 Bonus Calculation Rules

1. **Direct Bonus (Geração 1):**
   - Percentage: 5%
   - Applied when: User is direct sponsor of buyer
   - Formula: `Order Amount × 0.05`

2. **Indirect Bonus (Geração 2):**
   - Percentage: 3%
   - Applied when: User is 2nd generation sponsor
   - Formula: `Order Amount × 0.03`

3. **Online Store Bonus:**
   - Percentage: 38%
   - Applied when: Purchase through online store
   - Formula: `Order Amount × 0.38`

4. **Zero Bonus:**
   - Percentage: 0%
   - Applied when: User not qualified or inactive

### 7.2 Discount Rules

- **Distributor Discount:** 50% on all purchases
- **Formula:** `Final Amount = Order Amount × 0.50`

### 7.3 Generation Rules

- **Geração 1:** Direct referrals (1 level deep)
- **Geração 2:** Indirect referrals (2 levels deep)
- **Geração 3+:** Deeper levels (lower or zero bonuses)

### 7.4 Qualification Rules

- Qualifications determine bonus eligibility
- "Requisitos Bônus Extra" triggers special bonus calculations
- Qualification requirements are tracked per user

---

## 8. CALCULATION WORKFLOW

### 8.1 Order Processing Flow

```
1. User places order
   ↓
2. Apply 50% distributor discount
   ↓
3. Calculate bonus for each generation:
   - Geração 1 (Direct): 5% of order amount
   - Geração 2 (Indirect): 3% of order amount
   - Online Store: 38% of order amount
   ↓
4. Check user qualifications
   ↓
5. Apply bonus to appropriate account:
   - Saldo para Compra (for direct/indirect)
   - Saldo Loja Online (for online store)
   ↓
6. Update account balances
   ↓
7. Record transaction
```

### 8.2 Bonus Distribution Example

**Order:** R$ 1.000,00

**Distribution:**
- Buyer pays: R$ 500,00 (50% discount)
- Geração 1 sponsor receives: R$ 50,00 (5% of R$ 1.000)
- Geração 2 sponsor receives: R$ 30,00 (3% of R$ 1.000)
- Online store bonus (if applicable): R$ 380,00 (38% of R$ 1.000)

---

## 9. WHAT NEEDS TO BE UPLOADED FOR AUTO-CALCULATION

### 9.1 Required Data

To build a system that automatically calculates everything upon data upload, you need:

1. **Users Table:**
   - User ID, name, username
   - Sponsor ID (parent_id)
   - Generation level
   - Qualification status
   - Account balances

2. **Orders Table:**
   - Order ID, user ID, buyer ID
   - Order amount (before discount)
   - Order date, payment date
   - Order type (activation/purchase)

3. **Bonus Rules Table:**
   - Bonus type ID, percentage
   - Generation mapping
   - Account type mapping

4. **Qualification Rules Table:**
   - Qualification ID, name
   - Requirements (sales volume, team size, etc.)
   - Bonus multipliers

### 9.2 Calculation Logic (Backend)

The backend should:
1. Receive order data
2. Traverse the hierarchy tree to find sponsors
3. Calculate bonuses based on generation and qualification
4. Update account balances
5. Generate transactions

### 9.3 Frontend Display

The frontend should display:
- Real-time bonus calculations
- Account balances by type
- Network hierarchy visualization
- Qualification progress
- Transaction history

---

## 10. RECOMMENDATIONS FOR NEW SYSTEM

### 10.1 Architecture

1. **Database:**
   - Use PostgreSQL or MySQL for relational data
   - Store hierarchy using recursive CTEs or closure table pattern
   - Index on sponsor_id for fast hierarchy traversal

2. **Backend:**
   - Implement bonus calculation as a background job
   - Use queue system for order processing
   - Cache hierarchy calculations

3. **Frontend:**
   - Real-time updates via WebSockets
   - Interactive network tree visualization
   - Export functionality for reports

### 10.2 Key Features to Implement

1. **Automatic Bonus Calculation**
   - Trigger on order creation/payment
   - Calculate for all generations simultaneously
   - Handle qualification changes retroactively

2. **Hierarchy Management**
   - Visual tree view
   - Sponsor change handling
   - Generation recalculation

3. **Qualification System**
   - Configurable requirements
   - Automatic qualification detection
   - Notification system

4. **Reporting**
   - Bonus reports by type and period
   - Network growth reports
   - Qualification achievement reports

---

## 11. UNCERTAINTIES AND FURTHER INVESTIGATION NEEDED

### 11.1 Unknown Rules

1. **Generation Depth:** What is the maximum generation that receives bonuses?
2. **Qualification Requirements:** What are the specific requirements for each qualification?
3. **Bonus Caps:** Are there maximum bonus amounts per user/period?
4. **Inactive Status:** What determines if a user is inactive (0% bonus)?
5. **Online Store Logic:** What qualifies as an "online store" purchase?

### 11.2 Recommended Next Steps

1. **Interview Stakeholders:** Confirm business rules with system owners
2. **Analyze Historical Data:** Look for patterns in bonus calculations
3. **Test Edge Cases:** What happens with sponsor changes? Qualification loss?
4. **Document All Qualifications:** Get complete list of qualification types and requirements

---

## 12. API ENDPOINTS FOR INTEGRATION

### 12.1 Discovered Endpoints

**Authentication:**
- `POST /publico/Autenticar/Formulario/`
  - Parameters: usuario, senha, formularioda39a3ee5e6b4b0d3255bfef95601890afd80709, f60616549a24634435a5f7fbdac24091

**Dashboard Gadgets (AJAX):**
- `GET /publico/Gadgets/CarregamentoGadgets/carregaAjax/3/BonusAdministrador`
- `GET /publico/Gadgets/CarregamentoGadgets/carregaAjax/3/DistribuidoresNaRede`
- `GET /publico/Gadgets/CarregamentoGadgets/carregaAjax/3/PlanosVendidos`
- `GET /publico/Gadgets/CarregamentoGadgets/carregaAjax/3/SaldoGeralEmConta`
- `GET /publico/Gadgets/CarregamentoGadgets/carregaAjax/3/UltimasTransacoes`
- `GET /publico/Gadgets/CarregamentoGadgets/carregaAjax/3/UltimasAtivacoes`
- `GET /publico/Gadgets/CarregamentoGadgets/carregaAjax/3/GraficoPlanosDistribuidor`

**Reports:**
- `/administracao/Bonus/RelatorioBonificacaoMensal/listarPorMesAdministracao`
- `/administracao/Bonus/RelatorioBonificacaoMensal/listarPorBonusAdministracao`
- `/administracao/Contas/ContasTransacoesRelatorio/listar`
- `/administracao/RedeLinear/Relatorio/relatorioMovimentacoesRedeAdministracao`
- `/administracao/Qualificacao/RelatorioQualificacoes/principal`

---

## CONCLUSION

The Allin Brasil system is a sophisticated MLM platform with:
- **Unilevel hierarchy** with generation-based bonuses
- **Multiple account types** for different bonus categories
- **Qualification system** that affects bonus eligibility
- **50% distributor discount** on all purchases
- **Automated bonus calculations** based on order amounts and generations

To build a new system that automatically calculates everything, you need:
1. Complete user hierarchy data
2. Order history with buyer/sponsor relationships
3. Bonus rule configuration
4. Qualification requirements

The key calculation formula is:
```
Bonus = Order Amount × Generation Percentage × Qualification Multiplier
```

Where generation percentages are:
- Geração 1 (Direct): 5%
- Geração 2 (Indirect): 3%
- Online Store: 38%
- Other/Inactive: 0%

---

**Report Generated:** 2026-04-20  
**Analysis Tool:** MCP Playwright  
**Analyst:** Cascade AI Assistant
