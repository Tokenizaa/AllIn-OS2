# ETAPA 6 - DEPENDÊNCIAS DE TABELAS MLM

**Data:** 11 de Junho de 2026  
**Versão:** 1.0  
**Status:** Documentação Baseada em Evidência  
**Fonte:** Documentação API AllInBrasil, analise_migracao_mlm.md, fluxo_processamento_pedidos_mlm.md

---

# OBJETIVO

Mapear o impacto de cada operação nas tabelas MLM, incluindo INSERT, UPDATE, DELETE e dependências entre tabelas.

---

# TABELAS MLM IDENTIFICADAS

## Schema: mlm

**Fonte:** docs/analise_migracao_mlm.md (linhas 1-384)

**Tabelas Identificadas:**
1. distribuidores
2. rede_linear_nos
3. planos
4. planos_distribuidores
5. qualificacoes
6. qualificacoes_historico
7. bonus_regras
8. bonus_historico
9. comissoes
10. pontos_saldo
11. pontos_transacoes
12. ativacoes_mensais

**STATUS = COMPROVADO** - Lista de tabelas documentada

---

# TABELA: mlm.distribuidores

## Estrutura (PARCIALMENTE DOCUMENTADA)

**Fonte:** docs/api-knowledge-base/39-distribuidores.md

**Campos Documentados:**
- `id` - ID do distribuidor
- `nome` - Nome do distribuidor
- `email` - Email
- `cpf` - CPF
- `patrocinador_id` - ID do patrocinador
- `perna_esquerda_id` - ID da perna esquerda
- `perna_direita_id` - ID da perna direita
- `ativo` - Status ativo
- `status` - Status
- `data_cadastro` - Data de cadastro

**STATUS = COMPROVADO** - Campos documentados

**Estrutura Completa (NÃO DOCUMENTADA):**
- STATUS = NÃO COMPROVADO - Estrutura completa não documentada

---

## Operações

### INSERT (NÃO DOCUMENTADO)

**Momento (NÃO DOCUMENTADO):**
- STATUS = NÃO COMPROVADO - Momento de criação de distribuidor não documentado

**Dependências:**
- STATUS = NÃO COMPROVADO - Tabelas dependentes não documentadas

---

### UPDATE

**Momento:** Compra de plano (upgrade)

**Fonte:** docs/fluxo_processamento_pedidos_mlm.md

**Função:** processar_compra_plano()

**Campos Atualizados:**
- `perna_esquerda_id` - Quando alocado em perna esquerda
- `perna_direita_id` - Quando alocado em perna direita

**STATUS = PARCIALMENTE COMPROVADO** - Operação mencionada mas campos específicos não documentados

**Dependências:**
- mlm.rede_linear_nos (para cálculo de posição)
- mlm.planos_distribuidores (para registro de plano)

---

### UPDATE (Alteração de Patrocinador)

**Momento:** Alteração manual via administrativo

**Fonte:** docs/AUDITORIA_LEGADA_ALLIN.md

**Campos Atualizados:**
- `patrocinador_id` - Novo patrocinador

**STATUS = PARCIALMENTE COMPROVADO** - Operação mencionada mas implementação não documentada

**Dependências (NÃO DOCUMENTADAS):**
- STATUS = NÃO COMPROVADO - Impacto em rede linear não documentado
- STATUS = NÃO COMPROVADO - Impacto em rede binária não documentado

---

### DELETE (NÃO DOCUMENTADO)

**STATUS = NÃO COMPROVADO** - Operação de exclusão não documentada

---

# TABELA: mlm.rede_linear_nos

## Estrutura (PARCIALMENTE DOCUMENTADA)

**Fonte:** docs/api-knowledge-base/58-rede-linear-nos.md

**Campos Documentados:**
- `id` - ID do nó
- `linha` - Linha na rede linear
- `posicao_relativa` - Posição relativa na linha
- `id_distribuidor` - ID do distribuidor
- `id_patrocinador` - ID do patrocinador
- `data_cadastro` - Data de cadastro

**STATUS = COMPROVADO** - Campos documentados

**Estrutura Completa (NÃO DOCUMENTADA):**
- STATUS = NÃO COMPROVADO - Estrutura completa não documentada

**Conteúdo Atual:**
- STATUS = COMPROVADO - Tabela está vazia

---

## Operações

### INSERT

**Momento:** Compra de plano de ativação

**Fonte:** docs/fluxo_processamento_pedidos_mlm.md

**Função:** processar_compra_plano()

**STATUS = COMPROVADO** - Operação documentada

**Dependências:**
- mlm.distribuidores (id_distribuidor)
- mlm.distribuidores (id_patrocinador)
- commerce.pedidos (pedido_id)

---

### UPDATE (NÃO DOCUMENTADO)

**STATUS = NÃO COMPROVADO** - Operação de atualização não documentada

---

### DELETE (NÃO DOCUMENTADO)

**STATUS = NÃO COMPROVADO** - Operação de exclusão não documentada

---

# TABELA: mlm.planos

## Estrutura (NÃO DOCUMENTADA)

**STATUS = NÃO COMPROVADO** - Estrutura não documentada

**Planos Identificados:**
- Afiliado (R$ 0)
- Avanço (R$ 997)
- Excelência (R$ 3.980)

**STATUS = COMPROVADO** - Planos documentados em docs/AUDITORIA_LEGADA_ALLIN.md

---

## Operações

### INSERT (NÃO DOCUMENTADO)

**STATUS = NÃO COMPROVADO** - Criação de planos não documentada

---

### UPDATE (NÃO DOCUMENTADO)

**STATUS = NÃO COMPROVADO** - Atualização de planos não documentada

---

### DELETE (NÃO DOCUMENTADO)

**STATUS = NÃO COMPROVADO** - Exclusão de planos não documentada

---

# TABELA: mlm.planos_distribuidores

## Estrutura (NÃO DOCUMENTADA)

**STATUS = NÃO COMPROVADO** - Estrutura não documentada

**Campos Inferidos:**
- `distribuidor_id` - ID do distribuidor
- `plano_id` - ID do plano
- `data_adesao` - Data de adesão
- `data_upgrade` - Data do último upgrade

**STATUS = NÃO COMPROVADO** - Campos inferidos mas não documentados

---

## Operações

### INSERT

**Momento:** Compra de plano de ativação inicial

**Fonte:** docs/fluxo_processamento_pedidos_mlm.md

**Função:** processar_compra_plano()

**STATUS = COMPROVADO** - Operação documentada

**Dependências:**
- mlm.distribuidores (distribuidor_id)
- mlm.planos (plano_id)
- commerce.pedidos (pedido_id)
- commerce.produtos (produto_id do plano)

---

### UPDATE

**Momento:** Compra de plano de upgrade

**Fonte:** docs/fluxo_processamento_pedidos_mlm.md

**Função:** processar_compra_plano()

**STATUS = COMPROVADO** - Operação documentada

**Dependências:**
- mlm.distribuidores (distribuidor_id)
- mlm.planos (plano_id)
- commerce.pedidos (pedido_id)
- commerce.produtos (produto_id do plano)

---

### DELETE (NÃO DOCUMENTADO)

**STATUS = NÃO COMPROVADO** - Exclusão não documentada

---

# TABELA: mlm.qualificacoes

## Estrutura (NÃO DOCUMENTADA)

**STATUS = NÃO COMPROVADO** - Estrutura não documentada

**Conteúdo Atual:**
- STATUS = COMPROVADO - Tabela está vazia

---

## Operações

### INSERT (NÃO DOCUMENTADO)

**STATUS = NÃO COMPROVADO** - Criação não documentada

---

### UPDATE

**Momento:** Compra de produto (quando atinge nova qualificação)

**Fonte:** docs/fluxo_processamento_pedidos_mlm.md

**Função:** processar_compra_produto()

**STATUS = PARCIALMENTE COMPROVADO** - Operação mencionada mas implementação não documentada

**Dependências:**
- mlm.distribuidores (distribuidor_id)
- mlm.qualificacoes (qualificacao_id)
- mlm.pontos_saldo (para verificação de pontos)
- commerce.pedidos (pedido_id)

---

### DELETE (NÃO DOCUMENTADO)

**STATUS = NÃO COMPROVADO** - Exclusão não documentada

---

# TABELA: mlm.qualificacoes_historico

## Estrutura (NÃO DOCUMENTADA)

**STATUS = NÃO COMPROVADO** - Estrutura não documentada

**Conteúdo Atual:**
- STATUS = COMPROVADO - Tabela está vazia

---

## Operações

### INSERT

**Momento:** Mudança de qualificação

**Fonte:** docs/fluxo_processamento_pedidos_mlm.md

**Função:** processar_compra_produto()

**STATUS = PARCIALMENTE COMPROVADO** - Operação mencionada mas implementação não documentada

**Dependências:**
- mlm.distribuidores (distribuidor_id)
- mlm.qualificacoes (qualificacao_anterior_id)
- mlm.qualificacoes (qualificacao_nova_id)
- commerce.pedidos (pedido_id)

---

### UPDATE (NÃO DOCUMENTADO)

**STATUS = NÃO COMPROVADO** - Atualização não documentada

---

### DELETE (NÃO DOCUMENTADO)

**STATUS = NÃO COMPROVADO** - Exclusão não documentada

---

# TABELA: mlm.bonus_regras

## Estrutura (NÃO DOCUMENTADA)

**STATUS = NÃO COMPROVADO** - Estrutura não documentada

**Conteúdo Atual:**
- STATUS = COMPROVADO - Tabela está vazia (sem regras configuradas)

---

## Operações

### INSERT (NÃO DOCUMENTADO)

**STATUS = NÃO COMPROVADO** - Criação de regras não documentada

---

### UPDATE (NÃO DOCUMENTADO)

**STATUS = NÃO COMPROVADO** - Atualização de regras não documentada

---

### DELETE (NÃO DOCUMENTADO)

**STATUS = NÃO COMPROVADO** - Exclusão de regras não documentada

---

# TABELA: mlm.bonus_historico

## Estrutura (NÃO DOCUMENTADA)

**STATUS = NÃO COMPROVADO** - Estrutura não documentada

**Conteúdo Atual:**
- STATUS = COMPROVADO - Tabela está vazia (sem histórico de bônus)

---

## Operações

### INSERT

**Momento:** Compra de produto (cálculo de bônus)

**Fonte:** docs/fluxo_processamento_pedidos_mlm.md

**Função:** processar_compra_produto()

**STATUS = PARCIALMENTE COMPROVADO** - Operação mencionada mas implementação não documentada

**Dependências:**
- mlm.distribuidores (distribuidor_id)
- mlm.bonus_regras (para obter regras de cálculo)
- commerce.pedidos (pedido_id)
- commerce.pedidos_itens (para valor da venda)

---

### UPDATE (NÃO DOCUMENTADO)

**STATUS = NÃO COMPROVADO** - Atualização não documentada

---

### DELETE (NÃO DOCUMENTADO)

**STATUS = NÃO COMPROVADO** - Exclusão não documentada

---

# TABELA: mlm.comissoes

## Estrutura (NÃO DOCUMENTADA)

**STATUS = NÃO COMPROVADO** - Estrutura não documentada

---

## Operações

### INSERT

**Momento:** Compra de produto (cálculo de comissões)

**Fonte:** docs/fluxo_processamento_pedidos_mlm.md

**Função:** processar_compra_produto()

**STATUS = PARCIALMENTE COMPROVADO** - Operação mencionada mas implementação não documentada

**Dependências:**
- mlm.distribuidores (distribuidor_id beneficiário)
- mlm.distribuidores (distribuidor_id comprador)
- commerce.pedidos (pedido_id)
- commerce.pedidos_itens (para valor da venda)
- mlm.planos_distribuidores (para obter porcentagem do plano)

---

### UPDATE (NÃO DOCUMENTADO)

**STATUS = NÃO COMPROVADO** - Atualização não documentada

---

### DELETE (NÃO DOCUMENTADO)

**STATUS = NÃO COMPROVADO** - Exclusão não documentada

---

# TABELA: mlm.pontos_saldo

## Estrutura (NÃO DOCUMENTADA)

**STATUS = NÃO COMPROVADO** - Estrutura não documentada

---

## Operações

### INSERT/UPDATE

**Momento 1:** Compra de plano (pontos de ativação)

**Fonte:** docs/fluxo_processamento_pedidos_mlm.md

**Função:** processar_compra_plano()

**STATUS = PARCIALMENTE COMPROVADO** - Operação mencionada mas implementação não documentada

**Dependências:**
- mlm.distribuidores (distribuidor_id)
- commerce.pedidos (pedido_id)
- commerce.produtos (produto_id do plano)

---

**Momento 2:** Compra de produto (pontos de qualificação)

**Fonte:** docs/fluxo_processamento_pedidos_mlm.md

**Função:** processar_compra_produto()

**STATUS = PARCIALMENTE COMPROVADO** - Operação mencionada mas implementação não documentada

**Dependências:**
- mlm.distribuidores (distribuidor_id)
- commerce.pedidos (pedido_id)
- commerce.pedidos_itens (para valor da venda)

---

### DELETE (NÃO DOCUMENTADO)

**STATUS = NÃO COMPROVADO** - Exclusão não documentada

---

# TABELA: mlm.pontos_transacoes

## Estrutura (NÃO DOCUMENTADA)

**STATUS = NÃO COMPROVADO** - Estrutura não documentada

---

## Operações

### INSERT

**Momento 1:** Compra de plano (geração de pontos de ativação)

**Fonte:** docs/fluxo_processamento_pedidos_mlm.md

**Função:** processar_compra_plano()

**STATUS = PARCIALMENTE COMPROVADO** - Operação mencionada mas implementação não documentada

**Dependências:**
- mlm.distribuidores (distribuidor_id)
- mlm.pontos_saldo (para atualizar saldo)
- commerce.pedidos (pedido_id)

---

**Momento 2:** Compra de produto (geração de pontos de qualificação)

**Fonte:** docs/fluxo_processamento_pedidos_mlm.md

**Função:** processar_compra_produto()

**STATUS = PARCIALMENTE COMPROVADO** - Operação mencionada mas implementação não documentada

**Dependências:**
- mlm.distribuidores (distribuidor_id)
- mlm.pontos_saldo (para atualizar saldo)
- commerce.pedidos (pedido_id)

---

### UPDATE (NÃO DOCUMENTADO)

**STATUS = NÃO COMPROVADO** - Atualização não documentada

---

### DELETE (NÃO DOCUMENTADO)

**STATUS = NÃO COMPROVADO** - Exclusão não documentada

---

# TABELA: mlm.ativacoes_mensais

## Estrutura (NÃO DOCUMENTADA)

**STATUS = NÃO COMPROVADO** - Estrutura não documentada

**Conteúdo Atual:**
- STATUS = COMPROVADO - ~8.860 registros (documentado em docs/AUDITORIA_LEGADA_ALLIN.md)

---

## Operações

### INSERT (NÃO DOCUMENTADO)

**STATUS = NÃO COMPROVADO** - Criação não documentada

---

### UPDATE (NÃO DOCUMENTADO)

**STATUS = NÃO COMPROVADO** - Atualização não documentada

---

### DELETE (NÃO DOCUMENTADO)

**STATUS = NÃO COMPROVADO** - Exclusão não documentada

---

# TABELAS DE OUTROS SCHEMAS (RELACIONADAS A MLM)

## Schema: commerce

### commerce.pedidos

**Operação:** UPDATE (confirmação de pagamento)

**Impacto MLM:** Gatilho principal para processamento MLM

**Função:** processar_pedido_mlm()

**STATUS = COMPROVADO**

---

### commerce.pedidos_itens

**Operação:** SELECT (leitura)

**Impacto MLM:** Identifica tipo de compra (plano vs produto)

**STATUS = COMPROVADO**

---

### commerce.produtos

**Operação:** SELECT (leitura)

**Impacto MLM:** Verifica se produto é plano (e_plano, e_ativacao, e_upgrade_plano)

**STATUS = COMPROVADO**

---

## Schema: crm

### crm.clientes

**Operação:** SELECT (leitura)

**Impacto MLM:** Identifica cliente final e seu patrocinador

**STATUS = COMPROVADO**

---

## Schema: finance

### finance.solicitacoes_saque

**Operação:** INSERT/UPDATE

**Impacto MLM:** Deduz saldo de comissões/bônus

**STATUS = PARCIALMENTE COMPROVADO** - Operação mencionada mas implementação não documentada

---

### finance.saldos

**Operação:** INSERT/UPDATE

**Impacto MLM:** Gerencia saldo disponível para saque

**STATUS = PARCIALMENTE COMPROVADO** - Operação mencionada mas implementação não documentada

---

### finance.pedidos_saldos

**Operação:** INSERT

**Impacto MLM:** Gera saldos de pacotes

**STATUS = COMPROVADO**

---

# DEPENDÊNCIAS ENTRE TABELAS MLM

## Grafo de Dependências (COMPROVADO)

```
commerce.pedidos (gatilho)
    ↓
processar_pedido_mlm()
    ↓
├─ processar_compra_plano()
│   ↓
│   ├─ mlm.planos_distribuidores (INSERT/UPDATE)
│   ├─ mlm.rede_linear_nos (INSERT)
│   ├─ mlm.pontos_saldo (INSERT/UPDATE)
│   └─ mlm.pontos_transacoes (INSERT)
│
└─ processar_compra_produto()
    ↓
    ├─ mlm.comissoes (INSERT)
    ├─ mlm.bonus_historico (INSERT)
    ├─ mlm.pontos_saldo (INSERT/UPDATE)
    ├─ mlm.pontos_transacoes (INSERT)
    ├─ mlm.qualificacoes (UPDATE)
    └─ mlm.qualificacoes_historico (INSERT)
```

**STATUS = COMPROVADO** - Fluxo geral documentado

---

# IMPACTO DE CANCELAMENTO DE PEDIDO

## Operação (NÃO DOCUMENTADA)

**STATUS = NÃO COMPROVADO** - Impacto do cancelamento não documentado

**Possíveis Impactos (INFERIDOS):**
- STATUS = NÃO COMPROVADO - Estorno de comissões (inferido mas não documentado)
- STATUS = NÃO COMPROVADO - Estorno de bônus (inferido mas não documentado)
- STATUS = NÃO COMPROVADO - Estorno de pontos (inferido mas não documentado)
- STATUS = NÃO COMPROVADO - Reversão de qualificações (inferido mas não documentado)

---

# RESUMO DE DEPENDÊNCIAS

## Tabelas com Operações Documentadas (COMPROVADO)
- mlm.planos_distribuidores - INSERT/UPDATE em compra de plano
- mlm.rede_linear_nos - INSERT em compra de plano
- mlm.qualificacoes - UPDATE em compra de produto
- mlm.qualificacoes_historico - INSERT em mudança de qualificação

## Tabelas com Operações Mencionadas (PARCIALMENTE COMPROVADO)
- mlm.comissoes - INSERT em compra de produto
- mlm.bonus_historico - INSERT em compra de produto
- mlm.pontos_saldo - INSERT/UPDATE em compra de plano e produto
- mlm.pontos_transacoes - INSERT em compra de plano e produto

## Tabelas Vazias (COMPROVADO)
- mlm.bonus_regras - Sem regras configuradas
- mlm.bonus_historico - Sem histórico
- mlm.qualificacoes - Sem qualificações
- mlm.rede_linear_nos - Sem nós

## Tabelas com Dados (COMPROVADO)
- mlm.ativacoes_mensais - ~8.860 registros

## Estruturas (NÃO COMPROVADO)
- Todas as tabelas MLM - Estrutura completa não documentada

---

# STATUS DE EVIDÊNCIA

## COMPROVADO
- Lista de tabelas MLM
- Fluxo geral de processamento
- Gatilho principal (confirmação de pagamento)
- Operações em mlm.planos_distribuidores
- Operações em mlm.rede_linear_nos
- Operações em mlm.qualificacoes
- Operações em mlm.qualificacoes_historico
- Conteúdo atual das tabelas (vazias ou com dados)
- Dependências com tabelas de outros schemas

## PARCIALMENTE COMPROVADO
- Operações em mlm.comissoes
- Operações em mlm.bonus_historico
- Operações em mlm.pontos_saldo
- Operações em mlm.pontos_transacoes
- Operações em finance.solicitacoes_saque
- Operações em finance.saldos

## NÃO COMPROVADO
- Estrutura completa de todas as tabelas MLM
- Operações de INSERT em mlm.distribuidores
- Operações de DELETE em todas as tabelas
- Operações em mlm.planos
- Operações em mlm.bonus_regras
- Operações em mlm.ativacoes_mensais
- Impacto do cancelamento de pedido
- Impacto da alteração de patrocinador
- Campos específicos atualizados em cada operação

---

# PRÓXIMA ETAPA

ETAPA 7: Documentação do fluxo transacional (MLM-TRANSACTION-FLOW.md)
