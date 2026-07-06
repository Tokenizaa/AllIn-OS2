# ETAPA 3 - MOTOR DE BÔNUS

**Data:** 11 de Junho de 2026  
**Versão:** 1.0  
**Status:** Documentação Baseada em Evidência  
**Fonte:** Documentação API AllInBrasil, AUDITORIA_LEGADA_ALLIN.md, 02-BUSINESS-RULES-REVERSE-ENGINEERING.md

---

# OBJETIVO

Documentar todos os bônus do sistema MLM, incluindo tipos, fórmulas de cálculo, requisitos, momento de processamento e impacto nas tabelas.

---

# TIPOS DE BÔNUS IDENTIFICADOS

## Bônus Ativos (Sistema Legado)

**Fonte:** docs/AUDITORIA_LEGADA_ALLIN.md (linhas 1-925)

### 1. Bônus Loja Online
- **Descrição:** Bônus relacionado a vendas na loja virtual
- **STATUS = COMPROVADO** - Listado como bônus ativo na tela "Bônus Instalados"

### 2. Bônus Diretos
- **Descrição:** Bônus sobre vendas de distribuidores diretos
- **STATUS = COMPROVADO** - Listado como bônus ativo na tela "Bônus Instalados"

### 3. Bônus Qualificação Mensal
- **Descrição:** Bônus baseado em qualificação mensal
- **STATUS = COMPROVADO** - Listado como bônus ativo na tela "Bônus Instalados"

### 4. Bônus Indiretos
- **Descrição:** Bônus sobre vendas de rede profunda
- **STATUS = COMPROVADO** - Listado como bônus ativo na tela "Bônus Instalados"

---

## Tipos de Bônus (Regras de Negócio)

**Fonte:** docs/02-BUSINESS-RULES-REVERSE-ENGINEERING.md (linhas 989-1024)

### 1. Comissão Direta
- **Descrição:** Comissão paga sobre vendas de distribuidores diretos
- **STATUS = COMPROVADO** - Documentado em regras de negócio

**Regras Documentadas:**
- Porcentagem definida pelo plano do distribuidor
- Base de cálculo: Valor líquido da venda
- Condição: Distribuidor direto deve estar ativo
- Pagamento: Creditado em saldo após período

**STATUS = COMPROVADO** - Regras gerais documentadas

**Fórmula (NÃO DOCUMENTADA):**
- STATUS = NÃO COMPROVADO - Fórmula específica não documentada

---

### 2. Comissão Indireta
- **Descrição:** Comissão paga sobre vendas de rede profunda
- **STATUS = COMPROVADO** - Documentado em regras de negócio

**Regras Documentadas:**
- Porcentagem definida pelo plano e geração
- Base de cálculo: Valor líquido da venda
- Gerações: Número de gerações pagas varia por plano
- Condição: Distribuidor indireto deve estar ativo
- Pagamento: Creditado em saldo após período

**STATUS = COMPROVADO** - Regras gerais documentadas

**Fórmula (NÃO DOCUMENTADA):**
- STATUS = NÃO COMPROVADO - Fórmula específica não documentada

**Número de Gerações por Plano (NÃO DOCUMENTADO):**
- STATUS = NÃO COMPROVADO - Quantidade de gerações por plano não documentada

---

### 3. Bônus de Perna
- **Descrição:** Bônus pago baseado no volume da perna menor
- **STATUS = COMPROVADO** - Documentado em regras de negócio

**Regras Documentadas:**
- Cálculo: Volume da perna menor × porcentagem
- Condição: Ambas as pernas devem ter volume mínimo
- Frequência: Calculado mensalmente
- Plano: Porcentagem varia por plano

**STATUS = COMPROVADO** - Regras gerais documentadas

**Fórmula (NÃO DOCUMENTADA):**
- STATUS = NÃO COMPROVADO - Fórmula específica não documentada

**Volume Mínimo por Perna (NÃO DOCUMENTADO):**
- STATUS = NÃO COMPROVADO - Volume mínimo não documentado

**Porcentagem por Plano (NÃO DOCUMENTADO):**
- STATUS = NÃO COMPROVADO - Porcentagem por plano não documentada

---

### 4. Bônus de Liderança
- **Descrição:** Bônus pago para distribuidores qualificados
- **STATUS = COMPROVADO** - Documentado em regras de negócio

**Regras Documentadas:**
- Condição: Distribuidor deve ter qualificação mínima
- Equipe: Equipe deve atingir metas de volume
- Porcentagem: Definida pela qualificação
- Pagamento: Creditado mensalmente

**STATUS = COMPROVADO** - Regras gerais documentadas

**Fórmula (NÃO DOCUMENTADA):**
- STATUS = NÃO COMPROVADO - Fórmula específica não documentada

**Qualificação Mínima (NÃO DOCUMENTADO):**
- STATUS = NÃO COMPROVADO - Qualificação mínima não documentada

**Metas de Volume da Equipe (NÃO DOCUMENTADO):**
- STATUS = NÃO COMPROVADO - Metas de volume não documentadas

**Porcentagem por Qualificação (NÃO DOCUMENTADO):**
- STATUS = NÃO COMPROVADO - Porcentagem por qualificação não documentada

---

# TABELAS DE BÔNUS

## Tabela: mlm.bonus_regras

**Fonte:** docs/analise_migracao_mlm.md (linhas 1-384)

**STATUS = COMPROVADO** - Tabela existe mas está vazia

**Estrutura (NÃO DOCUMENTADA):**
- STATUS = NÃO COMPROVADO - Estrutura da tabela não documentada

**Conteúdo Atual:**
- STATUS = COMPROVADO - Tabela está vazia (sem regras configuradas)

---

## Tabela: mlm.bonus_historico

**Fonte:** docs/analise_migracao_mlm.md (linhas 1-384), docs/fluxo_processamento_pedidos_mlm.md

**STATUS = COMPROVADO** - Tabela existe mas está vazia

**Estrutura (NÃO DOCUMENTADA):**
- STATUS = NÃO COMPROVADO - Estrutura da tabela não documentada

**Conteúdo Atual:**
- STATUS = COMPROVADO - Tabela está vazia (sem histórico de bônus)

**Operações Documentadas:**
- INSERT: Quando bônus é gerado em processar_compra_produto
- STATUS = PARCIALMENTE COMPROVADO - Operação mencionada mas implementação não documentada

---

# MOMENTO DE PROCESSAMENTO

## Gatilho de Cálculo de Bônus

**Fonte:** docs/fluxo_processamento_pedidos_mlm.md (linhas 1-445)

**STATUS = COMPROVADO** - Bônus são calculados na confirmação de pagamento

**Função Responsável:**
- `processar_compra_produto(pedido_id UUID, e_distribuidor BOOLEAN)`
- STATUS = COMPROVADO - Função documentada

**Momento:**
- Após confirmação de pagamento do pedido
- Apenas para compras de produto (não para compras de plano)
- STATUS = COMPROVADO

---

## Frequência de Cálculo

**Fonte:** docs/02-BUSINESS-RULES-REVERSE-ENGINEERING.md (linhas 1010-1023)

### Bônus de Perna
- Frequência: Calculado mensalmente
- STATUS = COMPROVADO

### Bônus de Liderança
- Frequência: Creditado mensalmente
- STATUS = COMPROVADO

### Comissão Direta e Indireta
- Frequência: Creditado em saldo após período
- STATUS = COMPROVADO (período específico não documentado)

---

# SIMULAÇÃO DE BÔNUS

## Endpoint: GET /v1/simulacao-bonus-faturamento

**Fonte:** docs/api-knowledge-base/60-simulacao-bonus-faturamento.md

**Descrição:** Retorna bônus e faturamento por mês

**Filtros:**
- `mes` - Filtro por mês

**Campos de Resposta:**
- `mes` - Mês de referência
- `valor_total_bonus` - Valor total de bônus
- `valor_total_faturamento` - Valor total de faturamento

**STATUS = COMPROVADO** - Endpoint documentado

---

## Endpoint: GET /v1/simulacao

**Fonte:** docs/api-knowledge-base/59-simulacao.md

**Descrição:** Lista simulações de comissão

**STATUS = COMPROVADO** - Endpoint documentado

**Operações:**
- POST /v1/simulacao - Cria nova simulação
- POST /v1/simulacao/Cancelar - Cancela simulação
- POST /v1/simulacao/Executar - Executa simulação
- GET /v1/simulacao/InformacoesExecucao - Lista informações de execução

**STATUS = COMPROVADO** - Operações documentadas

---

# PLANOS E BÔNUS

## Planos Identificados

**Fonte:** docs/AUDITORIA_LEGADA_ALLIN.md (linhas 1-925)

### 1. Afiliado
- **Valor:** R$ 0
- **STATUS = COMPROVADO** - Plano documentado

### 2. Avanço
- **Valor:** R$ 997
- **STATUS = COMPROVADO** - Plano documentado

### 3. Excelência
- **Valor:** R$ 3.980
- **STATUS = COMPROVADO** - Plano documentado

---

## Porcentagem de Comissão por Plano (NÃO DOCUMENTADO)

**STATUS = NÃO COMPROVADO** - Porcentagem de comissão por plano não documentada

---

## Número de Gerações por Plano (NÃO DOCUMENTADO)

**STATUS = NÃO COMPROVADO** - Número de gerações pagas por plano não documentado

---

## Porcentagem de Bônus de Perna por Plano (NÃO DOCUMENTADO)

**STATUS = NÃO COMPROVADO** - Porcentagem de bônus de perna por plano não documentada

---

# LIMITES DE SAQUE POR PLANO

**Fonte:** docs/02-BUSINESS-RULES-REVERSE-ENGINEERING.md (linhas 911-917)

**Regra Documentada:**
- Limite de saque varia por plano MLM
- Plano básico: Limite menor
- Plano superior: Limite maior
- Progressão: Limite aumenta com upgrade
- Validação: Saque respeita limite do plano

**STATUS = COMPROVADO** - Regra geral documentada

**Limites Específicos por Plano (NÃO DOCUMENTADO):**
- STATUS = NÃO COMPROVADO - Valores específicos de limite por plano não documentados

---

# CRITÉRIOS DE ELEGIBILIDADE

## Para Comissão Direta

**Fonte:** docs/02-BUSINESS-RULES-REVERSE-ENGINEERING.md (linhas 993-1000)

**Critérios Documentados:**
- Distribuidor direto deve estar ativo
- Porcentagem definida pelo plano do distribuidor
- Base de cálculo: Valor líquido da venda

**STATUS = COMPROVADO** - Critérios gerais documentados

**Definição de "Ativo" (NÃO DOCUMENTADO):**
- STATUS = NÃO COMPROVADO - Critérios para considerar distribuidor ativo não documentados

---

## Para Comissão Indireta

**Fonte:** docs/02-BUSINESS-RULES-REVERSE-ENGINEERING.md (linhas 1001-1008)

**Critérios Documentados:**
- Distribuidor indireto deve estar ativo
- Porcentagem definida pelo plano e geração
- Base de cálculo: Valor líquido da venda
- Número de gerações pagas varia por plano

**STATUS = COMPROVADO** - Critérios gerais documentados

**Definição de Geração (NÃO DOCUMENTADO):**
- STATUS = NÃO COMPROVADO - Definição de geração na hierarquia não documentada

---

## Para Bônus de Perna

**Fonte:** docs/02-BUSINESS-RULES-REVERSE-ENGINEERING.md (linhas 1009-1016)

**Critérios Documentados:**
- Ambas as pernas devem ter volume mínimo
- Porcentagem varia por plano
- Calculado mensalmente

**STATUS = COMPROVADO** - Critérios gerais documentados

**Volume Mínimo por Perna (NÃO DOCUMENTADO):**
- STATUS = NÃO COMPROVADO - Valor de volume mínimo não documentado

**Cálculo de Volume de Perna (NÃO DOCUMENTADO):**
- STATUS = NÃO COMPROVADO - Fórmula de cálculo de volume não documentada

---

## Para Bônus de Liderança

**Fonte:** docs/02-BUSINESS-RULES-REVERSE-ENGINEERING.md (linhas 1017-1024)

**Critérios Documentados:**
- Distribuidor deve ter qualificação mínima
- Equipe deve atingir metas de volume
- Porcentagem definida pela qualificação
- Creditado mensalmente

**STATUS = COMPROVADO** - Critérios gerais documentados

**Qualificação Mínima (NÃO DOCUMENTADO):**
- STATUS = NÃO COMPROVADO - Qualificação mínima não documentada

**Metas de Volume da Equipe (NÃO DOCUMENTADO):**
- STATUS = NÃO COMPROVADO - Metas específicas não documentadas

---

# IMPACTO FINANCEIRO

## Creditamento em Saldo

**Fonte:** docs/02-BUSINESS-RULES-REVERSE-ENGINEERING.md (linhas 903-909)

**Regra Documentada:**
- Comissões calculadas são creditadas em saldo
- Saldo fica disponível após período
- Saldo pode ser sacado

**STATUS = COMPROVADO** - Regra geral documentada

**Período de Disponibilidade (NÃO DOCUMENTADO):**
- STATUS = NÃO COMPROVADO - Período de carência para disponibilidade não documentado

---

## Solicitação de Saque

**Fonte:** docs/api-knowledge-base/62-solicitacoes-saque.md

**Endpoints:**
- GET /v1/solicitacoes-saque - Lista solicitações
- POST /v1/solicitacoes-saque - Cria solicitação
- POST /v1/solicitacoes-saque/Confirmar - Confirma solicitação
- POST /v1/solicitacoes-saque/Estornar - Estorna solicitação
- POST /v1/solicitacoes-saque/Reverter - Reverte solicitação

**STATUS = COMPROVADO** - Endpoints documentados

**Validação de Saldo (NÃO DOCUMENTADA):**
- STATUS = NÃO COMPROVADO - Validação de saldo disponível antes de saque não documentada

---

# TAXAS

**Fonte:** docs/api-knowledge-base/62-solicitacoes-saque.md

**Campos Documentados:**
- `total_taxas` - Total de taxas na solicitação de saque
- `valor_a_depositar` - Valor líquido após taxas

**STATUS = COMPROVADO** - Campos documentados

**Cálculo de Taxas (NÃO DOCUMENTADO):**
- STATUS = NÃO COMPROVADO - Fórmula de cálculo de taxas não documentada

**Porcentagem de Taxas (NÃO DOCUMENTADA):**
- STATUS = NÃO COMPROVADO - Porcentagem de taxas não documentada

---

# RESUMO DO MOTOR DE BÔNUS

## Bônus Identificados (COMPROVADO)
1. Comissão Direta
2. Comissão Indireta
3. Bônus de Perna
4. Bônus de Liderança
5. Bônus Loja Online (legado)
6. Bônus Qualificação Mensal (legado)

## Regras Gerais (COMPROVADO)
- Bônus são calculados na confirmação de pagamento
- Bônus de perna e liderança são calculados mensalmente
- Comissões são creditadas em saldo após período
- Limite de saque varia por plano

## Fórmulas Específicas (NÃO COMPROVADO)
- Fórmula de cálculo de comissão direta
- Fórmula de cálculo de comissão indireta
- Fórmula de cálculo de bônus de perna
- Fórmula de cálculo de bônus de liderança
- Porcentagens por plano
- Número de gerações por plano
- Volume mínimo por perna
- Metas de volume por qualificação
- Cálculo de taxas de saque

## Tabelas (PARCIALMENTE COMPROVADO)
- mlm.bonus_regras - Existe mas está vazia
- mlm.bonus_historico - Existe mas está vazia
- Estrutura das tabelas não documentada

---

# STATUS DE EVIDÊNCIA

## COMPROVADO
- Existência de 4 tipos principais de bônus (direta, indireta, perna, liderança)
- Existência de 4 bônus ativos no sistema legado
- Regras gerais de elegibilidade para cada tipo de bônus
- Gatilho de cálculo (confirmação de pagamento)
- Frequência de cálculo (mensal para perna e liderança)
- Creditamento em saldo
- Variação de limite de saque por plano
- Existência de taxas em saques
- Endpoints de simulação de bônus

## PARCIALMENTE COMPROVADO
- Operações em mlm.bonus_historico
- Estrutura de tabelas de bônus

## NÃO COMPROVADO
- Fórmulas específicas de cálculo
- Porcentagens por plano
- Número de gerações por plano
- Volume mínimo por perna
- Metas de volume por qualificação
- Qualificação mínima para bônus de liderança
- Definição de "distribuidor ativo"
- Definição de "geração" na hierarquia
- Cálculo de volume de perna
- Período de disponibilidade de saldo
- Cálculo de taxas de saque
- Limites específicos de saque por plano
- Estrutura completa das tabelas de bônus

---

# PRÓXIMA ETAPA

ETAPA 4: Reverse engineer de qualificações (QUALIFICATION_ENGINE.md)
