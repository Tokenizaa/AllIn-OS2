# ETAPA 2 - CICLO DE VIDA DE PEDIDOS

**Data:** 11 de Junho de 2026  
**Versão:** 1.0  
**Status:** Documentação Baseada em Evidência  
**Fonte:** Documentação API AllInBrasil, fluxo_processamento_pedidos_mlm.md, plano_acao_mlm.md

---

# OBJETIVO

Documentar o ciclo de vida completo de pedidos no sistema MLM, incluindo todos os estados, transições, gatilhos e impactos nas tabelas MLM.

---

# ESTADOS DE PEDIDO

## Status Identificados

**Fonte:** docs/api-knowledge-base/52-pedidos-status.md

A tabela `pedidos_status` contém os possíveis estados de um pedido. A documentação não lista explicitamente todos os valores, mas menciona que o endpoint GET /v1/pedidos-status retorna os status configurados no sistema.

**STATUS = NÃO COMPROVADO** - Lista completa de status não documentada. Apenas se sabe que existe uma tabela de status.

---

# CICLO DE VIDA DE PEDIDO

## Momento Crítico: Confirmação de Pagamento

**Fonte:** docs/fluxo_processamento_pedidos_mlm.md (linhas 1-445)

**Regra Documentada:**
> "A Confirmação de Pagamento é o momento crítico que dispara todos os cálculos do sistema MLM."

**STATUS = COMPROVADO** - A confirmação de pagamento é o gatilho principal para processamento MLM.

---

# FLUXO DE PROCESSAMENTO MLM

## Gatilho Automático

**Fonte:** docs/plano_acao_mlm.md (linhas 1-237)

### Trigger: trigger_processar_pedido_pagamento

**Tabela:** commerce.pedidos  
**Evento:** AFTER UPDATE  
**Condição:** Quando `pagamento_confirmado` muda para TRUE  
**Ação:** Executa função `processar_pedido_mlm(pedido_id UUID)`

**STATUS = COMPROVADO** - Trigger documentado em plano_acao_mlm.md

---

## Função Principal: processar_pedido_mlm

**Fonte:** docs/plano_acao_mlm.md, docs/fluxo_processamento_pedidos_mlm.md

### Assinatura
```sql
CREATE OR REPLACE FUNCTION processar_pedido_mlm(pedido_id UUID) RETURNS VOID AS $$
```

### Lógica Documentada

**STATUS = COMPROVADO** - A função existe e está documentada, mas a implementação completa não está disponível. Apenas o stub da função foi documentado.

**Passos Identificados (baseado em fluxo_processamento_pedidos_mlm.md):**

1. **Identificar Tipo de Compra**
   - Verifica se o pedido contém produtos marcados como plano (`e_plano = TRUE`)
   - Verifica se o comprador é um distribuidor

2. **Chamar Função Apropriada**
   - Se for compra de plano: `processar_compra_plano(pedido_id, e_distribuidor)`
   - Se for compra de produto: `processar_compra_produto(pedido_id, e_distribuidor)`

**STATUS = PARCIALMENTE COMPROVADO** - Lógica geral documentada, mas implementação detalhada não disponível.

---

## Função: processar_compra_plano

**Fonte:** docs/plano_acao_mlm.md, docs/fluxo_processamento_pedidos_mlm.md

### Assinatura
```sql
CREATE OR REPLACE FUNCTION processar_compra_plano(pedido_id UUID, e_distribuidor BOOLEAN) RETURNS VOID AS $$
```

### Responsabilidades Documentadas

**STATUS = PARCIALMENTE COMPROVADO** - A função existe e está documentada, mas a implementação completa não está disponível.

**Ações Identificadas (baseado em fluxo_processamento_pedidos_mlm.md):**

1. **Ativação/Upgrade de Plano**
   - Cria ou atualiza registro em `mlm.planos_distribuidores`
   - Se for upgrade: atualiza plano anterior para novo plano
   - Se for ativação inicial: cria novo registro de plano

2. **Inserção na Rede Linear**
   - Insere distribuidor na rede linear (`mlm.rede_linear_nos`)
   - Calcula posição relativa na linha
   - Vincula ao patrocinador

3. **Geração de Pontos de Ativação**
   - Gera pontos de ativação para o distribuidor
   - Atualiza saldo de pontos em `mlm.pontos_saldo`

**STATUS = NÃO COMPROVADO** - Implementação detalhada não documentada. Apenas inferido a partir de descrição geral.

---

## Função: processar_compra_produto

**Fonte:** docs/plano_acao_mlm.md, docs/fluxo_processamento_pedidos_mlm.md

### Assinatura
```sql
CREATE OR REPLACE FUNCTION processar_compra_produto(pedido_id UUID, e_distribuidor BOOLEAN) RETURNS VOID AS $$
```

### Responsabilidades Documentadas

**STATUS = PARCIALMENTE COMPROVADO** - A função existe e está documentada, mas a implementação completa não está disponível.

**Ações Identificadas (baseado em fluxo_processamento_pedidos_mlm.md):**

1. **Cálculo de Comissões**
   - Calcula comissão direta para o patrocinador
   - Calcula comissões indiretas para uplines
   - Insere registros em `mlm.comissoes`

2. **Cálculo de Bônus**
   - Calcula bônus de perna (rede binária)
   - Calcula bônus de geração
   - Calcula bônus de liderança
   - Insere registros em `mlm.bonus_historico`

3. **Geração de Pontos**
   - Gera pontos de qualificação para o comprador
   - Gera pontos para a rede (volume de pernas)
   - Atualiza saldo de pontos em `mlm.pontos_saldo`

4. **Atualização de Qualificações**
   - Verifica se distribuidor atingiu nova qualificação
   - Atualiza qualificação atual em `mlm.qualificacoes`
   - Insere histórico em `mlm.qualificacoes_historico`

**STATUS = NÃO COMPROVADO** - Implementação detalhada não documentada. Apenas inferido a partir de descrição geral.

---

# IDENTIFICAÇÃO DO COMPRADOR

## Tipos de Comprador

**Fonte:** docs/fluxo_processamento_pedidos_mlm.md (linhas 50-100)

### Comprador Distribuidor
- **Condição:** `distribuidor_comprador_id` está preenchido
- **Impacto:** Pontos vão para rede do distribuidor comprador
- **Comissão:** Comissão vai para o indicador (`distribuidor_indicador_id`)

### Comprador Cliente Final
- **Condição:** `cliente_id` está preenchido e `distribuidor_comprador_id` está vazio
- **Impacto:** Pontos vão para rede do patrocinador do cliente
- **Comissão:** Comissão vai para o patrocinador do cliente

**STATUS = COMPROVADO** - Lógica documentada em fluxo_processamento_pedidos_mlm.md

---

# DISTINÇÃO ENTRE COMPRA DE PLANO E COMPRA DE PRODUTO

## Compra de Plano

**Fonte:** docs/fluxo_processamento_pedidos_mlm.md (linhas 100-150)

### Identificação
- Produto tem `e_plano = TRUE`
- Produto tem `e_ativacao = TRUE` (para ativação inicial)
- Produto tem `e_upgrade_plano = TRUE` (para upgrade)
- Produto tem `e_renovacao_plano = TRUE` (para renovação)

### Impactos
- Ativação ou upgrade de plano do distribuidor
- Inserção na rede linear
- Geração de pontos de ativação
- **NÃO gera comissões** (documentado em fluxo_processamento_pedidos_mlm.md)

**STATUS = COMPROVADO** - Distinção documentada em fluxo_processamento_pedidos_mlm.md

---

## Compra de Produto

**Fonte:** docs/fluxo_processamento_pedidos_mlm.md (linhas 150-200)

### Identificação
- Produto tem `e_plano = FALSE`
- Produto é um produto regular da loja virtual

### Impactos
- Gera comissões para patrocinador e uplines
- Gera bônus (perna, geração, liderança)
- Gera pontos de qualificação
- Atualiza volume de rede

**STATUS = COMPROVADO** - Distinção documentada em fluxo_processamento_pedidos_mlm.md

---

# IMPACTO NAS TABELAS MLM

## Tabela: mlm.planos_distribuidores

**Fonte:** docs/fluxo_processamento_pedidos_mlm.md, docs/plano_acao_mlm.md

### Operações em Compra de Plano
- **INSERT:** Quando é ativação inicial
- **UPDATE:** Quando é upgrade de plano
- **Campos:** `distribuidor_id`, `plano_id`, `data_adesao`, `data_upgrade`

**STATUS = COMPROVADO** - Operação documentada

---

## Tabela: mlm.rede_linear_nos

**Fonte:** docs/fluxo_processamento_pedidos_mlm.md, docs/api-knowledge-base/58-rede-linear-nos.md

### Operações em Compra de Plano
- **INSERT:** Quando distribuidor é ativado
- **Campos:** `linha`, `posicao_relativa`, `id_distribuidor`, `id_patrocinador`

**STATUS = COMPROVADO** - Operação documentada

---

## Tabela: mlm.comissoes

**Fonte:** docs/fluxo_processamento_pedidos_mlm.md

### Operações em Compra de Produto
- **INSERT:** Para cada comissão gerada
- **Campos:** `distribuidor_id`, `pedido_id`, `tipo_comissao`, `valor`, `data_geracao`

**STATUS = PARCIALMENTE COMPROVADO** - Operação mencionada mas estrutura de tabela não documentada

---

## Tabela: mlm.bonus_historico

**Fonte:** docs/fluxo_processamento_pedidos_mlm.md

### Operações em Compra de Produto
- **INSERT:** Para cada bônus gerado
- **Campos:** `distribuidor_id`, `pedido_id`, `tipo_bonus`, `valor`, `data_geracao`

**STATUS = PARCIALMENTE COMPROVADO** - Operação mencionada mas estrutura de tabela não documentada

---

## Tabela: mlm.pontos_saldo

**Fonte:** docs/fluxo_processamento_pedidos_mlm.md

### Operações em Compra de Plano
- **INSERT/UPDATE:** Gera pontos de ativação

### Operações em Compra de Produto
- **INSERT/UPDATE:** Gera pontos de qualificação

**STATUS = PARCIALMENTE COMPROVADO** - Operação mencionada mas estrutura de tabela não documentada

---

## Tabela: mlm.pontos_transacoes

**Fonte:** docs/fluxo_processamento_pedidos_mlm.md

### Operações em Compra de Plano e Produto
- **INSERT:** Para cada transação de pontos
- **Campos:** `distribuidor_id`, `pedido_id`, `tipo_ponto`, `valor`, `data_transacao`

**STATUS = PARCIALMENTE COMPROVADO** - Operação mencionada mas estrutura de tabela não documentada

---

## Tabela: mlm.qualificacoes

**Fonte:** docs/fluxo_processamento_pedidos_mlm.md

### Operações em Compra de Produto
- **UPDATE:** Quando distribuidor atinge nova qualificação
- **Campos:** `distribuidor_id`, `qualificacao_id`, `data_atingimento`

**STATUS = PARCIALMENTE COMPROVADO** - Operação mencionada mas estrutura de tabela não documentada

---

## Tabela: mlm.qualificacoes_historico

**Fonte:** docs/fluxo_processamento_pedidos_mlm.md

### Operações em Compra de Produto
- **INSERT:** Quando qualificação muda
- **Campos:** `distribuidor_id`, `qualificacao_anterior_id`, `qualificacao_nova_id`, `data_mudanca`

**STATUS = PARCIALMENTE COMPROVADO** - Operação mencionada mas estrutura de tabela não documentada

---

# CANCELAMENTO DE PEDIDO

## Endpoint: POST /v1/pedidos/Cancelar

**Fonte:** docs/01-ENGANHARIA-REVERSA-API-COMPLETA.md (linha 61), docs/api-knowledge-base/50-pedidos.md

### Operação
- Define `cancelado = TRUE` no pedido

**STATUS = COMPROVADO** - Endpoint documentado

### Impacto MLM (NÃO DOCUMENTADO)

**STATUS = NÃO COMPROVADO** - Não há documentação sobre o impacto do cancelamento de pedido no sistema MLM. Possíveis impactos inferidos:
- Estorno de comissões geradas
- Estorno de bônus gerados
- Estorno de pontos gerados
- Reversão de qualificações (se aplicável)

---

# ESTORNAMENTO DE PAGAMENTO

## Situação (NÃO DOCUMENTADA)

**STATUS = NÃO COMPROVADO** - Não há documentação sobre estornamento de pagamento e seu impacto no sistema MLM.

---

# RESUMO DO CICLO DE VIDA

## Fluxo Principal (COMPROVADO)

1. **Criação do Pedido**
   - POST /v1/pedidos
   - Status inicial: criado
   - `pagamento_confirmado = FALSE`

2. **Pagamento Confirmado**
   - POST /v1/pedidos/ConfirmarPagamento
   - `pagamento_confirmado = TRUE`
   - **GATILHO:** trigger_processar_pedido_pagamento

3. **Processamento MLM**
   - Função: processar_pedido_mlm(pedido_id)
   - Identifica tipo de compra (plano vs produto)
   - Chama função apropriada

4. **Compra de Plano**
   - Função: processar_compra_plano(pedido_id, e_distribuidor)
   - Ativa/upgrade plano
   - Insere na rede linear
   - Gera pontos de ativação

5. **Compra de Produto**
   - Função: processar_compra_produto(pedido_id, e_distribuidor)
   - Calcula comissões
   - Calcula bônus
   - Gera pontos de qualificação
   - Atualiza qualificações

6. **Cancelamento (Opcional)**
   - POST /v1/pedidos/Cancelar
   - Impacto MLM: NÃO DOCUMENTADO

---

# STATUS DE EVIDÊNCIA

## COMPROVADO
- Confirmação de pagamento é o gatilho principal
- Existência do trigger trigger_processar_pedido_pagamento
- Existência das funções processar_pedido_mlm, processar_compra_plano, processar_compra_produto
- Distinção entre compra de plano e compra de produto
- Identificação do tipo de comprador (distribuidor vs cliente final)
- Impacto em mlm.planos_distribuidores (compra de plano)
- Impacto em mlm.rede_linear_nos (compra de plano)

## PARCIALMENTE COMPROVADO
- Lógica geral das funções de processamento
- Operações em mlm.comissoes (compra de produto)
- Operações em mlm.bonus_historico (compra de produto)
- Operações em mlm.pontos_saldo (compra de plano e produto)
- Operações em mlm.pontos_transacoes (compra de plano e produto)
- Operações em mlm.qualificacoes (compra de produto)
- Operações em mlm.qualificacoes_historico (compra de produto)

## NÃO COMPROVADO
- Lista completa de status de pedido
- Implementação detalhada das funções de processamento
- Fórmulas de cálculo de comissões
- Fórmulas de cálculo de bônus
- Fórmulas de cálculo de pontos
- Critérios de qualificação
- Impacto do cancelamento de pedido no sistema MLM
- Impacto do estornamento de pagamento no sistema MLM
- Estrutura completa das tabelas MLM afetadas

---

# PRÓXIMA ETAPA

ETAPA 3: Reverse engineer de todos os bônus (BONUS_ENGINE.md)
