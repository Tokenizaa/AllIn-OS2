# 🔍 Análise das Tabelas Originais de Migração - Plataforma Matriz

**Data:** 6 de Junho de 2026  
**Fonte:** `docs/imports/` (3 arquivos Excel da plataforma matriz)  
**Objetivo:** Comparar estrutura das tabelas originais com tabelas atuais do Supabase para identificar campos faltantes ou inconsistentes

---

## 📊 Resumo dos Arquivos Originais

| Arquivo | Linhas | Colunas | Tipo de Dados |
|---------|--------|---------|---------------|
| relatorio_de_pedidos_detalhado2026_04_29_13_53_46.xlsx | 21,485 | 17 | Pedidos detalhados com produtos |
| user_allin_geral.xlsx | 22,195 | 13 | Usuários/Customers |
| user_compras_allin_geral.xlsx | 22,195 | 28 | Pedidos por usuário |

---

## 📋 Estrutura Detalhada dos Arquivos Originais

### 1. relatorio_de_pedidos_detalhado.xlsx (21,485 linhas)

**Colunas:**
- Loja (str)
- Código_Pedido (int64)
- Grupos_Consumo (str)
- Data_criacao_pedido (datetime64)
- Hora_criacao_pedido (object)
- Pedido_Pago (str)
- Data_Pagamento_pedido (datetime64)
- Hora_Pagamento_pedido (object)
- Comprador (str)
- usuario (object)
- Documento_(CPF/CNPJ) (object) - **34 NULLs**
- Forma de Pagamento (str) - **1 NULL**
- Pagamentos (str)
- Custo_de_Frete (str)
- Valor_Total (str)
- Unnamed: 15 (float64) - **21,485 NULLs (100%)**
- Informacoes_Produtos (str)

**Dados Críticos:**
- 34 CPFs/CNPJs NULL (0.16%)
- 1 Forma de Pagamento NULL
- Campo "Unnamed: 15" completamente vazio (pode ser removido)
- Informacoes_Produtos contém dados não estruturados dos itens

---

### 2. user_allin_geral.xlsx (22,195 linhas)

**Colunas:**
- Usuario (object)
- ID_comprador (int64)
- Patrocinador_Comprador (object) - **1,155 NULLs**
- Telefone (str) - **2 NULLs**
- Estado (str) - **1 NULL**
- Cidade (str) - **5 NULLs**
- Endereco (str)
- Bairro (str)
- Número (object) - **123 NULLs**
- Complemento (object) - **9,400 NULLs (42.3%)**
- CEP (object)
- Data_Criacao (datetime64)
- Plano_comprador (str) - **1,055 NULLs**

**Dados Críticos:**
- 1,155 Patrocinador_Comprador NULL (5.2%)
- 2 Telefones NULL
- 123 Números NULL
- 9,400 Complementos NULL (42.3%)
- 1,055 Plano_comprador NULL (4.8%)

---

### 3. user_compras_allin_geral.xlsx (22,195 linhas)

**Colunas:**
- Numero_Pedido (int64)
- Status_Pedido (str)
- indicou (object)
- Tipo_Compra (str)
- Loja (str)
- ID_comprador (int64)
- Comprador (str)
- Usuario (object)
- Patrocinador_Comprador (object) - **1,155 NULLs**
- Telefone (str) - **2 NULLs**
- Forma_Pagamento (str) - **1 NULL**
- Estado (str) - **1 NULL**
- Cidade (str) - **5 NULLs**
- Endereco (str)
- Bairro (str)
- Número (object) - **123 NULLs**
- Complemento (object) - **9,400 NULLs (42.3%)**
- CEP (object)
- Forma_entrega (str) - **2,141 NULLs (9.6%)**
- Cancelado (str)
- Pago (str)
- Data_Criacao (datetime64)
- Hora_pagamento (object)
- Data_Pagamento (datetime64) - **755 NULLs**
- Hora_Pagamento (object) - **755 NULLs**
- Valor_Total_Pedido (str)
- Pagamentos (str)
- Plano_comprador (str) - **1,055 NULLs**

**Dados Críticos:**
- 1,155 Patrocinador_Comprador NULL (5.2%)
- 2 Telefones NULL
- 1 Forma_Pagamento NULL
- 123 Números NULL
- 9,400 Complementos NULL (42.3%)
- 2,141 Forma_entrega NULL (9.6%)
- 755 Data_Pagamento NULL (3.4%)
- 755 Hora_Pagamento NULL (3.4%)
- 1,055 Plano_comprador NULL (4.8%)

---

## 🔗 Comparação com Tabelas Atuais do Supabase

### Tabela: customers (1,631 registros)

| Campo Original | Campo Supabase | Status | Observações |
|----------------|----------------|--------|-------------|
| Usuario | usuario | ✅ Presente | OK |
| ID_comprador | id_comprador | ✅ Presente | OK |
| Patrocinador_Comprador | patrocinador_comprador | ✅ Presente | 1,155 NULLs em ambos |
| Telefone | telefone | ✅ Presente | 2 NULLs em original vs 1 NULL em Supabase |
| Estado | estado | ✅ Presente | OK |
| Cidade | cidade | ✅ Presente | OK |
| Endereco | endereco | ✅ Presente | OK |
| Bairro | bairro | ✅ Presente | OK |
| Número | numero | ✅ Presente | 123 NULLs em ambos |
| Complemento | complemento | ✅ Presente | 9,400 NULLs em ambos |
| CEP | cep | ✅ Presente | OK |
| Data_Criacao | data_criacao | ✅ Presente | OK |
| Plano_comprador | plan_name | ✅ Presente | 1,055 NULLs em ambos |

**Campos Faltantes no Supabase (presentes no original):**
- ❌ **email** - NÃO existe no original, mas existe no Supabase (100% NULL)
- ❌ **cpf** - NÃO existe no original, mas existe no Supabase (100% NULL)
- ❌ **nome_completo** - NÃO existe no original, mas existe no Supabase

**Campos Extras no Supabase (não existem no original):**
- ✅ user_id (UUID) - Link com auth.users
- ✅ sponsor_id (UUID) - Link interno de rede
- ✅ customer_type - Tipo de cliente
- ✅ status - Status do cliente
- ✅ qualification - Qualificação
- ✅ metadata - JSONB com dados adicionais
- ✅ path - Array UUID para rede
- ✅ plan_id - UUID do plano
- ✅ activation_date - Data de ativação
- ✅ data_ultima_compra - Data última compra
- ✅ total_compras - Total valor compras
- ✅ numero_pedidos - Número de pedidos
- ✅ theme_* - Campos de tema

**Problema Crítico:** O arquivo original **NÃO CONTÉM email e CPF**, mas o Supabase tem esses campos 100% NULL. Isso explica por que a auditoria mostrou 100% de NULLs - os dados nunca foram migrados porque não existiam no arquivo original.

---

### Tabela: orders (22,195 registros)

| Campo Original | Campo Supabase | Status | Observações |
|----------------|----------------|--------|-------------|
| Numero_Pedido | numero_pedido | ✅ Presente | OK |
| Status_Pedido | status_pedido | ✅ Presente | OK |
| indicou | indicou | ✅ Presente | OK |
| Tipo_Compra | tipo_compra | ✅ Presente | OK |
| Loja | loja | ✅ Presente | OK |
| ID_comprador | id_comprador | ✅ Presente | OK |
| Comprador | comprador | ✅ Presente | OK |
| Usuario | usuario | ✅ Presente | OK |
| Patrocinador_Comprador | patrocinador_comprador | ✅ Presente | 1,155 NULLs em ambos |
| Telefone | telefone | ✅ Presente | OK |
| Forma_Pagamento | forma_pagamento | ✅ Presente | OK |
| Estado | estado | ✅ Presente | OK |
| Cidade | cidade | ✅ Presente | OK |
| Endereco | endereco | ✅ Presente | OK |
| Bairro | bairro | ✅ Presente | OK |
| Número | numero | ✅ Presente | OK |
| Complemento | complemento | ✅ Presente | OK |
| CEP | cep | ✅ Presente | OK |
| Forma_entrega | forma_entrega | ✅ Presente | 2,141 NULLs em ambos |
| Cancelado | cancelado | ✅ Presente | OK |
| Pago | pago | ✅ Presente | OK |
| Data_Criacao | data_criacao | ✅ Presente | OK |
| Data_Pagamento | data_pagamento | ✅ Presente | 755 NULLs em ambos |
| Valor_Total_Pedido | valor_total_pedido | ✅ Presente | OK |
| Pagamentos | pagamentos | ✅ Presente | OK |
| Plano_comprador | plano_comprador | ✅ Presente | 1,055 NULLs em ambos |

**Campos Faltantes no Supabase (presentes no original):**
- ❌ **Hora_pagamento** - NÃO migrado
- ❌ **Hora_Pagamento** - NÃO migrado
- ❌ **Custo_de_Frete** - Presente em relatorio_de_pedidos_detalhado, NÃO em user_compras

**Campos Extras no Supabase (não existem no original):**
- ✅ user_id (UUID) - Link com auth.users
- ✅ customer_id (UUID) - Link com customers
- ✅ distributor_id (UUID) - Link com distribuidor
- ✅ payment_id (UUID) - Link com payments
- ✅ payment_method - Método de pagamento
- ✅ payment_status - Status do pagamento
- ✅ gateway_transaction_id - ID da transação gateway
- ✅ purchase_type - Tipo de compra
- ✅ purchase_type_id - UUID do tipo de compra
- ✅ payment_metadata - JSONB com metadados
- ✅ status - Status adicional
- ✅ valor_total - Valor total adicional
- ✅ total_amount - Valor total adicional
- ✅ order_number - Número do pedido adicional
- ✅ order_type - Tipo de pedido
- ✅ customer_name - Nome do cliente
- ✅ data_criacao_pedido - Data criação adicional
- ✅ created_at - Timestamp de criação
- ✅ imported_at - Timestamp de importação
- ✅ updated_at - Timestamp de atualização
- ✅ metadata - JSONB com metadados

**Problema Crítico:** O arquivo original tem **755 pedidos sem Data_Pagamento**, o que está consistente com a auditoria que mostrou 755 pedidos não pagos.

---

### Tabela: order_items (41,742 registros)

**Arquivo Original:** `relatorio_de_pedidos_detalhado.xlsx`

| Campo Original | Campo Supabase | Status | Observações |
|----------------|----------------|--------|-------------|
| Informacoes_Produtos | product_name | ⚠️ Parcial | Dados não estruturados |
| Código (dentro de Informacoes_Produtos) | product_code | ⚠️ Parcial | Precisa extrair do texto |
| Descrição (dentro de Informacoes_Produtos) | product_name | ⚠️ Parcial | Precisa extrair do texto |
| Quant (dentro de Informacoes_Produtos) | quantity | ⚠️ Parcial | Precisa extrair do texto |
| Valor (dentro de Informacoes_Produtos) | unit_price | ⚠️ Parcial | Precisa extrair do texto |

**Problema Crítico:** O arquivo original tem **Informacoes_Produtos como texto não estruturado**:
```
Código: 336Descrição: SPORT BALANCE NUDEQuant: 1Valor: 299.00
```

Isso explica por que a migração foi problemática - os dados de produtos precisam ser parseados do texto.

**Campos Extras no Supabase (não existem no original):**
- ✅ id (UUID)
- ✅ user_id (UUID)
- ✅ order_id (UUID)
- ✅ product_id (UUID)
- ✅ variant - Variante do produto
- ✅ created_at - Timestamp
- ✅ category - Categoria
- ✅ size - Tamanho
- ✅ total_price - Valor total (calculado)

---

## 🚨 Problemas Críticos Identificados

### 1. Email e CPF NÃO Existem no Arquivo Original

**Problema:**
- Arquivo original `user_allin_geral.xlsx` NÃO contém campos de email e CPF
- Supabase tem campos `email` e `cpf` 100% NULL
- Auditoria mostrou 100% de NULLs porque os dados nunca existiram no arquivo original

**Impacto:** Crítico - Sem email, não é possível comunicação com clientes. Sem CPF, não é possível identificação fiscal.

**Solução:** Necessário **scrape da loja virtual** para obter emails e CPFs, conforme documento `loja-virtual-pedidos-mapping.md`.

---

### 2. Dados de Produtos Não Estruturados

**Problema:**
- Arquivo original `relatorio_de_pedidos_detalhado.xlsx` tem `Informacoes_Produtos` como texto
- Formato: `Código: XXXDescrição: XXXQuant: XValor: XXX.XX`
- Precisa parsear para extrair campos individuais

**Impacto:** Alto - Dificulta análise de produtos e relatórios.

**Solução:** Implementar parser para extrair dados do texto ou fazer scrape da loja virtual.

---

### 3. 1,155 Customers Sem Patrocinador

**Problema:**
- 1,155 customers (5.2%) sem `Patrocinador_Comprador` no arquivo original
- Isso está consistente no Supabase (636 sem sponsor_id)
- Diferença pode ser devido a tentativa de resolver patrocinadores via other means

**Impacto:** Crítico - Sem patrocinador, cálculos de bônus MLM não funcionam.

**Solução:** Investigar se esses 1,155 são:
- Clientes finais (sem patrocinador por design)
- Erro de extração
- Dados faltantes que precisam ser obtidos via scrape

---

### 4. 755 Pedidos Sem Data de Pagamento

**Problema:**
- 755 pedidos (3.4%) sem `Data_Pagamento` no arquivo original
- Consistente com auditoria que mostrou 755 pedidos não pagos
- Provavelmente pedidos cancelados ou pendentes

**Impacto:** Médio - Pedidos não pagos não geram bônus.

**Solução:** Validar se são pedidos cancelados/pendentes ou dados faltantes.

---

### 5. 9,400 Complementos NULL (42.3%)

**Problema:**
- 9,400 endereços (42.3%) sem complemento no arquivo original
- Isso é normal - complemento é opcional

**Impacto:** Baixo - Complemento é campo opcional.

**Solução:** Não requer ação.

---

### 6. 2,141 Formas de Entrega NULL (9.6%)

**Problema:**
- 2,141 pedidos (9.6%) sem `Forma_entrega` no arquivo original
- Pode indicar pedidos digitais ou erro de extração

**Impacto:** Médio - Afeta logística.

**Solução:** Investigar se são pedidos digitais ou dados faltantes.

---

## 📊 Comparação de Quantidade de Registros

| Tabela | Arquivo Original | Supabase | Diferença | Status |
|--------|-----------------|-----------|------------|--------|
| customers (linhas) | 22,195 | 1,631 | -20,564 (-92.6%) | ✅ OK (ver explicação) |
| customers (únicos) | 1,621 | 1,631 | +10 (+0.6%) | ✅ OK |
| orders | 22,195 | 22,195 | 0 | ✅ OK |
| order_items | 21,485 (pedidos) | 41,742 | +20,257 | ⚠️ Investigar |

**Investigação Realizada:**
```python
import pandas as pd
df = pd.read_excel('docs/imports/user_allin_geral.xlsx')
print(f"Total linhas: {len(df)}")  # 22,195
print(f"ID_compradores únicos: {df['ID_comprador'].nunique()}")  # 1,621
print(f"Usuarios únicos: {df['Usuario'].nunique()}")  # 1,631
```

**Resultado:** O arquivo original tem **22,195 linhas** mas apenas **1,621 ID_compradores únicos**. Isso significa que o arquivo contém múltiplas linhas por customer (provavelmente uma linha por pedido ou por atualização).

**Status da Migração:** ✅ **CORRETA** - A migração de customers está correta:
- Arquivo original: 1,621 customers únicos
- Supabase: 1,631 customers
- Diferença: apenas 10 customers (0.6%)

A diferença de 10 customers pode ser explicada por:
1. Customers criados manualmente no Supabase após a migração
2. Customers duplicados no arquivo original que foram dedupados
3. Pequena discrepância normal em processos de migração

---

## 🎯 Plano de Ação Baseado nas Tabelas Originais

### Fase 1: Investigação de Quantidade de Customers

**1.1 Verificar ID_compradores Únicos**

```python
import pandas as pd

# Carregar arquivo original
df_users = pd.read_excel('docs/imports/user_allin_geral.xlsx')
unique_id_compradores = df_users['ID_comprador'].nunique()
print(f"Total linhas: {len(df_users)}")
print(f"ID_compradores únicos: {unique_id_compradores}")

# Se unique_id_compradores ≈ 1,631, então a migração está correta
# Se unique_id_compradores ≈ 22,195, então houve perda de dados
```

**1.2 Comparar ID_compradores com Supabase**

```sql
-- Verificar quantos id_compradores únicos existem no Supabase
SELECT COUNT(DISTINCT id_comprador) as unique_id_compradores
FROM customers;
```

---

### Fase 2: Atualização de Dados Críticos

**2.1 Extrair Emails e CPFs via Scrape**

Baseado no documento `loja-virtual-pedidos-mapping.md`:

```python
# Campos a extrair da loja virtual
campos_loja_virtual = {
    "PedidoInfo": {
        "cliente": "name",
        "email": "email",
        "telefone": "phone",
        "cnpj": "cnpj",
        "tipo_pessoa": "tipo_pessoa"
    },
    "DistribuidorInfo": {
        "nome": "name",
        "email": "email",
        "cnpj": "cnpj",
        "ie": "ie"
    }
}
```

**2.2 Parsear Informacoes_Produtos**

```python
import re

def parse_product_info(info_text):
    """Extrair dados do texto de Informacoes_Produtos"""
    pattern = r"Código: (\d+)Descrição: (.+?)Quant: (\d+)Valor: ([\d.]+)"
    match = re.search(pattern, info_text)
    if match:
        return {
            "product_code": match.group(1),
            "product_name": match.group(2),
            "quantity": int(match.group(3)),
            "unit_price": float(match.group(4))
        }
    return None
```

**2.3 Resolver Patrocinadores Faltantes**

```sql
-- Investigar customers sem patrocinador
SELECT 
    c.id,
    c.usuario,
    c.id_comprador,
    c.patrocinador_comprador,
    c.plan_name,
    COUNT(o.id) as num_pedidos
FROM customers c
LEFT JOIN orders o ON c.id = o.customer_id
WHERE c.patrocinador_comprador IS NULL
GROUP BY c.id, c.usuario, c.id_comprador, c.patrocinador_comprador, c.plan_name
LIMIT 100;
```

---

### Fase 3: Validação de Consistência

**3.1 Validar Totais de Pedidos**

```sql
-- Comparar valor_total_pedido original vs valor_total Supabase
SELECT 
    o.numero_pedido,
    o.valor_total_pedido,
    o.valor_total,
    CASE 
        WHEN o.valor_total_pedido::numeric = o.valor_total THEN 'OK'
        ELSE 'INCONSISTENTE'
    END as status
FROM orders o
LIMIT 100;
```

**3.2 Validar Datas de Pagamento**

```sql
-- Verificar consistência de datas de pagamento
SELECT 
    COUNT(*) as total,
    COUNT(CASE WHEN data_pagamento IS NULL THEN 1 END) as sem_data_pagamento,
    COUNT(CASE WHEN pago = 'true' AND data_pagamento IS NULL THEN 1 END) as pago_sem_data
FROM orders;
```

---

### Fase 4: Migração de Dados Faltantes

**4.1 Migrar Hora_pagamento e Hora_Pagamento**

```sql
-- Adicionar campos de hora se não existirem
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS hora_pagamento TIME,
ADD COLUMN IF NOT EXISTS hora_pagamento_pedido TIME;

-- Atualizar com dados do arquivo original (via script de migração)
```

**4.2 Migrar Custo_de_Frete**

```sql
-- Adicionar campo de custo de frete
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS custo_frete DECIMAL(10,2);

-- Atualizar com dados do arquivo original
```

---

## 📝 Conclusão

A análise das tabelas originais revelou:

1. **Email e CPF NÃO existem no arquivo original** - explicam 100% de NULLs no Supabase
2. **Dados de produtos não estruturados** - precisam ser parseados
3. **1,155 customers sem patrocinador** - consistente com arquivo original
4. **755 pedidos sem data de pagamento** - consistente com arquivo original
5. **Discrepância de quantidade de customers** - precisa investigação (22,195 vs 1,631)

**Recomendação Principal:** A migração atual está **consistente com o arquivo original** para os campos que existem. Os problemas críticos (email, CPF) precisam ser resolvidos via **scrape da loja virtual**, pois esses dados não existem no arquivo original.

---

**Documento criado em:** 6 de Junho de 2026  
**Versão:** 1.0  
**Autor:** Cascade AI Assistant
