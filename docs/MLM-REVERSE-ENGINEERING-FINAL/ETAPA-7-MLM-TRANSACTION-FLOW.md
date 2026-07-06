# ETAPA 7 - FLUXO TRANSACIONAL MLM

**Data:** 11 de Junho de 2026  
**Versão:** 1.0  
**Status:** Documentação Baseada em Evidência  
**Fonte:** Documentação API AllInBrasil, fluxo_processamento_pedidos_mlm.md, plano_acao_mlm.md

---

# OBJETIVO

Documentar o fluxo transacional completo do sistema MLM, desde a criação do pedido até o saque, incluindo todos os sistemas envolvidos, transformações de dados e pontos de decisão.

---

# FLUXO PRINCIPAL: COMPRA DE PLANO

## Passo 1: Criação do Pedido

**Fonte:** docs/api-knowledge-base/50-pedidos.md

**Endpoint:** POST /v1/pedidos

**Payload:**
- `distribuidor_indicador_id` - ID do distribuidor indicador
- `distribuidor_comprador_id` - ID do distribuidor comprador (se aplicável)
- `cliente_id` - ID do cliente (se aplicável)
- `itens` - Lista de itens do pedido

**Validações (NÃO DOCUMENTADAS):**
- STATUS = NÃO COMPROVADO - Validações específicas não documentadas

**Sistema:** Commerce

**Tabelas Afetadas:**
- commerce.pedidos (INSERT)
- commerce.pedidos_itens (INSERT)

**STATUS = COMPROVADO** - Endpoint documentado

---

## Passo 2: Processamento de Pagamento

**Sistema Externo (NÃO DOCUMENTADO):**
- STATUS = NÃO COMPROVADO - Gateway de pagamento não documentado

**Formas de Pagamento Documentadas:**
- Boleto 20 dias
- Boleto 7 dias com desconto de 5%
- Pagseguro Pix
- Cartão de crédito
- Asaas

**Fonte:** docs/AUDITORIA_LEGADA_ALLIN.md

**STATUS = COMPROVADO** - Formas de pagamento documentadas

---

## Passo 3: Confirmação de Pagamento

**Fonte:** docs/api-knowledge-base/50-pedidos.md

**Endpoint:** POST /v1/pedidos/ConfirmarPagamento

**Payload:**
- `id` - ID do pedido

**Sistema:** Commerce

**Tabelas Afetadas:**
- commerce.pedidos (UPDATE - pagamento_confirmado = TRUE)

**STATUS = COMPROVADO** - Endpoint documentado

---

## Passo 4: Gatilho MLM

**Fonte:** docs/plano_acao_mlm.md

**Trigger:** trigger_processar_pedido_pagamento

**Tabela:** commerce.pedidos

**Evento:** AFTER UPDATE

**Condição:** pagamento_confirmado muda para TRUE

**Ação:** Executa processar_pedido_mlm(pedido_id)

**STATUS = COMPROVADO** - Trigger documentado

---

## Passo 5: Identificação do Tipo de Compra

**Fonte:** docs/fluxo_processamento_pedidos_mlm.md

**Função:** processar_pedido_mlm(pedido_id UUID)

**Lógica Documentada:**
1. Verifica itens do pedido
2. Verifica se produto tem e_plano = TRUE
3. Verifica se comprador é distribuidor

**STATUS = COMPROVADO** - Lógica geral documentada

**Sistema:** MLM

**Tabelas Lidas:**
- commerce.pedidos_itens
- commerce.produtos

---

## Passo 6: Processamento de Compra de Plano

**Fonte:** docs/fluxo_processamento_pedidos_mlm.md

**Função:** processar_compra_plano(pedido_id UUID, e_distribuidor BOOLEAN)

**STATUS = COMPROVADO** - Função documentada

### Passo 6.1: Atualização de Plano do Distribuidor

**Tabela:** mlm.planos_distribuidores

**Operação:** INSERT (ativação inicial) ou UPDATE (upgrade)

**Campos:**
- distribuidor_id
- plano_id
- data_adesao
- data_upgrade

**STATUS = PARCIALMENTE COMPROVADO** - Operação mencionada mas implementação não documentada

---

### Passo 6.2: Inserção na Rede Linear

**Tabela:** mlm.rede_linear_nos

**Operação:** INSERT

**Campos:**
- linha
- posicao_relativa
- id_distribuidor
- id_patrocinador
- data_cadastro

**STATUS = PARCIALMENTE COMPROVADO** - Operação mencionada mas implementação não documentada

---

### Passo 6.3: Alocação em Rede Binária

**Tabela:** mlm.distribuidores

**Operação:** UPDATE

**Campos:**
- perna_esquerda_id (se alocado na esquerda)
- perna_direita_id (se alocado na direita)

**STATUS = PARCIALMENTE COMPROVADO** - Operação mencionada mas implementação não documentada

---

### Passo 6.4: Geração de Pontos de Ativação

**Tabela:** mlm.pontos_saldo

**Operação:** INSERT/UPDATE

**Tabela:** mlm.pontos_transacoes

**Operação:** INSERT

**STATUS = PARCIALMENTE COMPROVADO** - Operação mencionada mas implementação não documentada

---

## Passo 7: Geração de Saldo de Pacote (Opcional)

**Fonte:** docs/api-knowledge-base/51-pedidos-saldos.md

**Tabela:** finance.pedidos_saldos

**Operação:** INSERT

**Condição:** Quando pedido é de pacote

**STATUS = COMPROVADO** - Tabela e operação documentadas

---

# FLUXO PRINCIPAL: COMPRA DE PRODUTO

## Passo 1-4: Mesmo que Compra de Plano

**STATUS = COMPROVADO** - Passos iniciais idênticos

---

## Passo 5: Identificação do Tipo de Compra

**Função:** processar_pedido_mlm(pedido_id UUID)

**Lógica:** Detecta que produto NÃO é plano (e_plano = FALSE)

**STATUS = COMPROVADO** - Lógica documentada

---

## Passo 6: Processamento de Compra de Produto

**Fonte:** docs/fluxo_processamento_pedidos_mlm.md

**Função:** processar_compra_produto(pedido_id UUID, e_distribuidor BOOLEAN)

**STATUS = COMPROVADO** - Função documentada

### Passo 6.1: Identificação do Comprador

**Lógica Documentada:**
- Se distribuidor_comprador_id preenchido: Comprador é distribuidor
- Se cliente_id preenchido: Comprador é cliente final

**STATUS = COMPROVADO** - Lógica documentada

---

### Passo 6.2: Cálculo de Comissões

**Fonte:** docs/fluxo_processamento_pedidos_mlm.md, docs/02-BUSINESS-RULES-REVERSE-ENGINEERING.md

**Tabela:** mlm.comissoes

**Operação:** INSERT (uma por comissão gerada)

**Tipos de Comissão:**
- Comissão Direta (para patrocinador)
- Comissão Indireta (para uplines)

**STATUS = PARCIALMENTE COMPROVADO** - Operação mencionada mas implementação não documentada

**Fórmulas (NÃO DOCUMENTADAS):**
- STATUS = NÃO COMPROVADO - Fórmulas de cálculo não documentadas

---

### Passo 6.3: Cálculo de Bônus

**Fonte:** docs/fluxo_processamento_pedidos_mlm.md, docs/02-BUSINESS-RULES-REVERSE-ENGINEERING.md

**Tabela:** mlm.bonus_historico

**Operação:** INSERT (uma por bônus gerado)

**Tipos de Bônus:**
- Bônus de Perna (rede binária)
- Bônus de Geração
- Bônus de Liderança

**STATUS = PARCIALMENTE COMPROVADO** - Operação mencionada mas implementação não documentada

**Fórmulas (NÃO DOCUMENTADAS):**
- STATUS = NÃO COMPROVADO - Fórmulas de cálculo não documentadas

---

### Passo 6.4: Geração de Pontos de Qualificação

**Tabela:** mlm.pontos_saldo

**Operação:** INSERT/UPDATE

**Tabela:** mlm.pontos_transacoes

**Operação:** INSERT

**STATUS = PARCIALMENTE COMPROVADO** - Operação mencionada mas implementação não documentada

---

### Passo 6.5: Atualização de Qualificações

**Fonte:** docs/fluxo_processamento_pedidos_mlm.md

**Tabela:** mlm.qualificacoes

**Operação:** UPDATE (se atingir nova qualificação)

**Tabela:** mlm.qualificacoes_historico

**Operação:** INSERT (se qualificação mudar)

**STATUS = PARCIALMENTE COMPROVADO** - Operação mencionada mas implementação não documentada

**Critérios (NÃO DOCUMENTADOS):**
- STATUS = NÃO COMPROVADO - Critérios específicos não documentados

---

# FLUXO: SOLICITAÇÃO DE SAQUE

## Passo 1: Criação de Solicitação

**Fonte:** docs/api-knowledge-base/62-solicitacoes-saque.md

**Endpoint:** POST /v1/solicitacoes-saque

**Payload:**
- `distribuidor_id` - ID do distribuidor
- `conta_id` - ID da conta bancária
- `valor_solicitado` - Valor solicitado

**Sistema:** Finance

**Tabela:** finance.solicitacoes_saque

**Operação:** INSERT

**STATUS = COMPROVADO** - Endpoint documentado

**Validações (NÃO DOCUMENTADAS):**
- STATUS = NÃO COMPROVADO - Validação de saldo disponível não documentada
- STATUS = NÃO COMPROVADO - Validação de limite de saque por plano não documentada

---

## Passo 2: Cálculo de Taxas

**Fonte:** docs/api-knowledge-base/62-solicitacoes-saque.md

**Campos Calculados:**
- `total_taxas` - Total de taxas
- `valor_a_depositar` - Valor líquido após taxas

**STATUS = COMPROVADO** - Campos documentados

**Fórmula (NÃO DOCUMENTADA):**
- STATUS = NÃO COMPROVADO - Fórmula de cálculo de taxas não documentada

---

## Passo 3: Confirmação de Saque

**Fonte:** docs/api-knowledge-base/62-solicitacoes-saque.md

**Endpoint:** POST /v1/solicitacoes-saque/Confirmar

**Payload:**
- `id` - ID da solicitação

**Sistema:** Finance

**Tabela:** finance.solicitacoes_saque

**Operação:** UPDATE (status_id)

**STATUS = COMPROVADO** - Endpoint documentado

**Impacto em Saldo (NÃO DOCUMENTADO):**
- STATUS = NÃO COMPROVADO - Dedução do saldo não documentada

---

## Passo 4: Processamento Bancário (NÃO DOCUMENTADO)

**STATUS = NÃO COMPROVADO** - Integração com banco não documentada

---

## Passo 5: Estorno (Opcional)

**Fonte:** docs/api-knowledge-base/62-solicitacoes-saque.md

**Endpoint:** POST /v1/solicitacoes-saque/Estornar

**Payload:**
- `id` - ID da solicitação

**Sistema:** Finance

**Tabela:** finance.solicitacoes_saque

**Operação:** UPDATE (status_id)

**STATUS = COMPROVADO** - Endpoint documentado

**Impacto em Saldo (NÃO DOCUMENTADO):**
- STATUS = NÃO COMPROVADO - Devolução do saldo não documentada

---

# FLUXO: ATIVAÇÃO MENSAL

## Passo 1: Geração de Ativação Mensal

**Fonte:** docs/AUDITORIA_LEGADA_ALLIN.md

**Tela:** "Gerenciar Ativação Mensal"

**STATUS = COMPROVADO** - Funcionalidade documentada

**Endpoint (NÃO DOCUMENTADO):**
- STATUS = NÃO COMPROVADO - Endpoint não documentado

**Tabela:** mlm.ativacoes_mensais

**Operação:** INSERT

**STATUS = PARCIALMENTE COMPROVADO** - Operação inferida mas não documentada

---

## Passo 2: Renovação de Plano (NÃO DOCUMENTADO)

**STATUS = NÃO COMPROVADO** - Processo de renovação não documentado

---

# FLUXO: ALTERAÇÃO DE PATROCINADOR

## Passo 1: Solicitação de Alteração

**Fonte:** docs/AUDITORIA_LEGADA_ALLIN.md

**Tela:** "Alterar usuário/patrocinador"

**STATUS = COMPROVADO** - Funcionalidade documentada

**Endpoint (NÃO DOCUMENTADO):**
- STATUS = NÃO COMPROVADO - Endpoint não documentado

---

## Passo 2: Atualização de Rede

**Tabela:** mlm.distribuidores

**Operação:** UPDATE (patrocinador_id)

**STATUS = PARCIALMENTE COMPROVADO** - Operação inferida mas não documentada

**Impacto em Rede Linear (NÃO DOCUMENTADO):**
- STATUS = NÃO COMPROVADO - Reindexação não documentada

**Impacto em Rede Binária (NÃO DOCUMENTADO):**
- STATUS = NÃO COMPROVADO - Reindexação não documentada

---

# FLUXO: CANCELAMENTO DE PEDIDO

## Passo 1: Cancelamento

**Fonte:** docs/api-knowledge-base/50-pedidos.md

**Endpoint:** POST /v1/pedidos/Cancelar

**Payload:**
- `id` - ID do pedido

**Sistema:** Commerce

**Tabela:** commerce.pedidos

**Operação:** UPDATE (cancelado = TRUE)

**STATUS = COMPROVADO** - Endpoint documentado

---

## Passo 2: Estorno MLM (NÃO DOCUMENTADO)

**STATUS = NÃO COMPROVADO** - Impacto do cancelamento no sistema MLM não documentado

**Possíveis Estornos (INFERIDOS):**
- STATUS = NÃO COMPROVADO - Estorno de comissões (inferido)
- STATUS = NÃO COMPROVADO - Estorno de bônus (inferido)
- STATUS = NÃO COMPROVADO - Estorno de pontos (inferido)
- STATUS = NÃO COMPROVADO - Reversão de qualificações (inferido)
- STATUS = NÃO COMPROVADO - Remoção da rede linear (se plano) (inferido)

---

# SISTEMAS ENVOLVIDOS

## Commerce
- Criação de pedidos
- Processamento de pagamentos
- Gestão de produtos
- Gestão de clientes

**STATUS = COMPROVADO**

---

## MLM
- Processamento de pedidos MLM
- Cálculo de comissões
- Cálculo de bônus
- Gestão de rede
- Gestão de qualificações
- Gestão de pontos

**STATUS = COMPROVADO**

---

## Finance
- Gestão de saldos
- Solicitações de saque
- Processamento bancário
- Cálculo de taxas

**STATUS = PARCIALMENTE COMPROVADO**

---

## CRM
- Gestão de clientes
- Gestão de contas bancárias

**STATUS = COMPROVADO**

---

# PONTOS DE DECISÃO

## Tipo de Compra
**Decisão:** É plano ou produto?
**Base:** Campo e_plano em commerce.produtos
**STATUS = COMPROVADO**

---

## Tipo de Comprador
**Decisão:** É distribuidor ou cliente final?
**Base:** Campo distribuidor_comprador_id em commerce.pedidos
**STATUS = COMPROVADO**

---

## Alocação de Perna
**Decisão:** Perna esquerda ou direita?
**Base:** NÃO DOCUMENTADO
**STATUS = NÃO COMPROVADO**

---

## Qualificação Atingida
**Decisão:** Distribuidor atingiu nova qualificação?
**Base:** Critérios NÃO DOCUMENTADOS
**STATUS = NÃO COMPROVADO**

---

## Saldo Disponível
**Decisão:** Distribuidor tem saldo suficiente?
**Base:** NÃO DOCUMENTADO
**STATUS = NÃO COMPROVADO**

---

# TRANSFORMAÇÕES DE DADOS

## Pedido → Comissão
**Transformação:** Valor do pedido → Valor da comissão
**Fórmula:** NÃO DOCUMENTADA
**STATUS = NÃO COMPROVADO**

---

## Pedido → Bônus
**Transformação:** Valor do pedido → Valor do bônus
**Fórmula:** NÃO DOCUMENTADA
**STATUS = NÃO COMPROVADO**

---

## Pedido → Pontos
**Transformação:** Valor do pedido → Pontos
**Fórmula:** NÃO DOCUMENTADA
**STATUS = NÃO COMPROVADO**

---

## Solicitação de Saque → Valor Líquido
**Transformação:** Valor solicitado → Valor após taxas
**Fórmula:** NÃO DOCUMENTADA
**STATUS = NÃO COMPROVADO**

---

# ESTADOS TRANSACIONAIS

## Pedido
**Estados:** criado, aguardando pagamento, pago, faturado, enviado, entregue, cancelado, estornado
**STATUS = PARCIALMENTE COMPROVADO** - Estados mencionados mas transições não documentadas

---

## Solicitação de Saque
**Estados:** Solicitado, Depositado, Estornado
**STATUS = COMPROVADO** - Estados documentados

---

# RESUMO DO FLUXO TRANSACIONAL

## Fluxos Documentados (COMPROVADO)
1. Criação de pedido
2. Confirmação de pagamento
3. Gatilho MLM
4. Identificação de tipo de compra
5. Processamento de compra de plano (geral)
6. Processamento de compra de produto (geral)
7. Criação de solicitação de saque
8. Confirmação de saque
9. Estorno de saque

## Fluxos Parcialmente Documentados (PARCIALMENTE COMPROVADO)
1. Atualização de plano do distribuidor
2. Inserção na rede linear
3. Alocação em rede binária
4. Geração de pontos
5. Cálculo de comissões
6. Cálculo de bônus
7. Atualização de qualificações
8. Geração de saldo de pacote

## Fluxos Não Documentados (NÃO COMPROVADO)
1. Processamento de pagamento (gateway)
2. Renovação de plano
3. Alteração de patrocinador (endpoint)
4. Cancelamento de pedido (impacto MLM)
5. Processamento bancário
6. Validação de saldo antes do saque
7. Validação de limite de saque por plano

## Transformações (NÃO COMPROVADAS)
- Todas as fórmulas de cálculo
- Todas as regras de decisão específicas

---

# STATUS DE EVIDÊNCIA

## COMPROVADO
- Fluxo geral de compra de plano
- Fluxo geral de compra de produto
- Fluxo de solicitação de saque
- Gatilho de processamento MLM
- Identificação de tipo de compra
- Identificação de tipo de comprador
- Sistemas envolvidos
- Estados de solicitação de saque

## PARCIALMENTE COMPROVADO
- Operações específicas em cada tabela
- Transformações de dados gerais

## NÃO COMPROVADO
- Fórmulas de cálculo específicas
- Critérios de decisão específicos
- Processamento de pagamento externo
- Renovação de plano
- Alteração de patrocinador (endpoint)
- Cancelamento de pedido (impacto MLM)
- Processamento bancário
- Validações de saldo
- Transições de estado de pedido

---

# PRÓXIMA ETAPA

ETAPA 8: Criação de matriz de dependências
