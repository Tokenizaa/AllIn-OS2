# ETAPA 4 - MOTOR DE QUALIFICAÇÃO

**Data:** 11 de Junho de 2026  
**Versão:** 1.0  
**Status:** Documentação Baseada em Evidência  
**Fonte:** Documentação API AllInBrasil, 02-BUSINESS-RULES-REVERSE-ENGINEERING.md, fluxo_processamento_pedidos_mlm.md

---

# OBJETIVO

Documentar o sistema de qualificações do MLM, incluindo níveis, critérios de progressão, regras de manutenção, regressão e impacto nas tabelas.

---

# TABELAS DE QUALIFICAÇÃO

## Tabela: mlm.qualificacoes

**Fonte:** docs/analise_migracao_mlm.md (linhas 1-384)

**STATUS = COMPROVADO** - Tabela existe mas está vazia

**Estrutura (NÃO DOCUMENTADA):**
- STATUS = NÃO COMPROVADO - Estrutura da tabela não documentada

**Conteúdo Atual:**
- STATUS = COMPROVADO - Tabela está vazia (sem qualificações configuradas)

**Operações Documentadas:**
- UPDATE: Quando distribuidor atinge nova qualificação em processar_compra_produto
- STATUS = PARCIALMENTE COMPROVADO - Operação mencionada mas implementação não documentada

---

## Tabela: mlm.qualificacoes_historico

**Fonte:** docs/analise_migracao_mlm.md (linhas 1-384), docs/fluxo_processamento_pedidos_mlm.md

**STATUS = COMPROVADO** - Tabela existe mas está vazia

**Estrutura (NÃO DOCUMENTADA):**
- STATUS = NÃO COMPROVADO - Estrutura da tabela não documentada

**Conteúdo Atual:**
- STATUS = COMPROVADO - Tabela está vazia (sem histórico de qualificações)

**Operações Documentadas:**
- INSERT: Quando qualificação muda em processar_compra_produto
- STATUS = PARCIALMENTE COMPROVADO - Operação mencionada mas implementação não documentada

---

# ENDPOINTS DE QUALIFICAÇÃO

## Endpoint: GET /v1/distribuidores/QualificacaoAtual

**Fonte:** docs/01-ENGANHARIA-REVERSA-API-COMPLETA.md (linha 49)

**Descrição:** Retorna qualificação atual do distribuidor

**Filtros:**
- `distribuidor_id` - Filtro por distribuidor

**Campos de Resposta:**
- `distribuidor_id` - ID do distribuidor
- `qualificacao_id` - ID da qualificação
- `qualificacao_nome` - Nome da qualificação
- `data_atingimento` - Data de atingimento
- `data_manutencao` - Data de manutenção

**STATUS = COMPROVADO** - Endpoint documentado

---

# CRITÉRIOS DE PROGRESSÃO

## Critérios Gerais

**Fonte:** docs/02-BUSINESS-RULES-REVERSE-ENGINEERING.md (linhas 1053-1073)

**Regra Documentada:**
> "Progressão depende de múltiplos critérios."

**Critérios Identificados:**
- Total de pontos acumulados
- Volume de vendas da rede
- Número de diretos qualificados
- Tamanho da equipe qualificada
- Tempo mínimo em qualificação atual

**STATUS = COMPROVADO** - Critérios gerais documentados

**Valores Específicos por Critério (NÃO DOCUMENTADO):**
- STATUS = NÃO COMPROVADO - Valores específicos para cada critério não documentados

---

## Tempo de Progressão

**Fonte:** docs/02-BUSINESS-RULES-REVERSE-ENGINEERING.md (linhas 1066-1073)

**Regras Documentadas:**
- Progressão requer tempo mínimo em cada nível
- Requisitos devem ser mantidos
- Grace period antes de regressão
- Histórico de qualificações é mantido

**STATUS = COMPROVADO** - Regras gerais documentadas

**Tempo Mínimo por Nível (NÃO DOCUMENTADO):**
- STATUS = NÃO COMPROVADO - Tempo mínimo específico por nível não documentado

**Duração do Grace Period (NÃO DOCUMENTADO):**
- STATUS = NÃO COMPROVADO - Duração do período de carência não documentada

---

# REGRAS DE REGRESSÃO

## Condições de Regressão

**Fonte:** docs/02-BUSINESS-RULES-REVERSE-ENGINEERING.md (linhas 1074-1092)

**Regra Documentada:**
> "Qualificação pode regredir se requisitos não mantidos."

**Condições Identificadas:**
- Perda de pontos abaixo do mínimo
- Volume abaixo do mínimo
- Perda de diretos qualificados
- Equipe abaixo do mínimo
- Após grace period

**STATUS = COMPROVADO** - Condições gerais documentadas

**Valores Mínimos Específicos (NÃO DOCUMENTADO):**
- STATUS = NÃO COMPROVADO - Valores mínimos específicos não documentados

---

## Impacto da Regressão

**Fonte:** docs/02-BUSINESS-RULES-REVERSE-ENGINEERING.md (linhas 1085-1092)

**Impactos Identificados:**
- Porcentagem de comissão reduzida
- Menos gerações pagas
- Perda de bônus especiais
- Limite de saque reduzido

**STATUS = COMPROVADO** - Impactos gerais documentados

**Valores Específicos de Redução (NÃO DOCUMENTADO):**
- STATUS = NÃO COMPROVADO - Valores específicos de redução não documentados

---

# MOMENTO DE AVALIAÇÃO

## Gatilho de Avaliação

**Fonte:** docs/fluxo_processamento_pedidos_mlm.md (linhas 1-445)

**STATUS = COMPROVADO** - Qualificações são avaliadas na confirmação de pagamento

**Função Responsável:**
- `processar_compra_produto(pedido_id UUID, e_distribuidor BOOLEAN)`
- STATUS = COMPROVADO - Função documentada

**Momento:**
- Após confirmação de pagamento do pedido
- Apenas para compras de produto (não para compras de plano)
- STATUS = COMPROVADO

---

## Frequência de Avaliação

**Fonte:** docs/02-BUSINESS-RULES-REVERSE-ENGINEERING.md (linhas 1017-1024)

**STATUS = COMPROVADO** - Bônus de liderança (que depende de qualificação) é creditado mensalmente

**Avaliação de Regressão (NÃO DOCUMENTADA):**
- STATUS = NÃO COMPROVADO - Frequência de avaliação de regressão não documentada

---

# PONTOS DE QUALIFICAÇÃO

## Pontos de Qualificação

**Fonte:** docs/02-BUSINESS-RULES-REVERSE-ENGINEERING.md (linhas 1043-1050)

**Regras Documentadas:**
- Pontos se acumulam no tempo
- Pontos da rede contam para qualificação
- Pontos podem ter validade
- Perda de pontos pode causar regressão

**STATUS = COMPROVADO** - Regras gerais documentadas

**Validade dos Pontos (NÃO DOCUMENTADA):**
- STATUS = NÃO COMPROVADO - Período de validade dos pontos não documentado

**Cálculo de Pontos da Rede (NÃO DOCUMENTADO):**
- STATUS = NÃO COMPROVADO - Fórmula de cálculo não documentada

---

# NÍVEIS DE QUALIFICAÇÃO

## Níveis Identificados (NÃO DOCUMENTADOS)

**STATUS = NÃO COMPROVADO** - Lista de níveis de qualificação não documentada

**Possíveis Níveis (INFERIDO):**
- STATUS = NÃO COMPROVADO - Níveis inferidos mas não documentados

---

# RELAÇÃO COM BÔNUS

## Bônus de Liderança

**Fonte:** docs/02-BUSINESS-RULES-REVERSE-ENGINEERING.md (linhas 1017-1024)

**Regra Documentada:**
- Bônus de liderança é pago para distribuidores qualificados
- Condição: Distribuidor deve ter qualificação mínima
- Porcentagem: Definida pela qualificação

**STATUS = COMPROVADO** - Relação documentada

**Qualificação Mínima (NÃO DOCUMENTADA):**
- STATUS = NÃO COMPROVADO - Qualificação mínima não documentada

**Porcentagem por Qualificação (NÃO DOCUMENTADA):**
- STATUS = NÃO COMPROVADO - Porcentagem por qualificação não documentada

---

# RELAÇÃO COM COMISSÕES

## Impacto em Comissões

**Fonte:** docs/02-BUSINESS-RULES-REVERSE-ENGINEERING.md (linhas 1087-1088)

**Regra Documentada:**
- Regressão de qualificação reduz porcentagem de comissão

**STATUS = COMPROVADO** - Impacto documentado

**Porcentagem por Qualificação (NÃO DOCUMENTADA):**
- STATUS = NÃO COMPROVADO - Porcentagem específica por qualificação não documentada

---

# RELAÇÃO COM GERAÇÕES

## Número de Gerações Pagas

**Fonte:** docs/02-BUSINESS-RULES-REVERSE-ENGINEERING.md (linhas 1088-1089)

**Regra Documentada:**
- Regressão de qualificação reduz número de gerações pagas

**STATUS = COMPROVADO** - Impacto documentado

**Número de Gerações por Qualificação (NÃO DOCUMENTADO):**
- STATUS = NÃO COMPROVADO - Número específico por qualificação não documentado

---

# RELAÇÃO COM LIMITE DE SAQUE

## Limite de Saque

**Fonte:** docs/02-BUSINESS-RULES-REVERSE-ENGINEERING.md (linhas 1090-1091)

**Regra Documentada:**
- Regressão de qualificação reduz limite de saque

**STATUS = COMPROVADO** - Impacto documentado

**Limite por Qualificação (NÃO DOCUMENTADO):**
- STATUS = NÃO COMPROVADO - Limite específico por qualificação não documentado

---

# LANÇAMENTO MANUAL DE QUALIFICAÇÃO

## Funcionalidade Identificada

**Fonte:** docs/AUDITORIA_LEGADA_ALLIN.md (linhas 1-925)

**Tela:** "Lançar Qualificação Manual"

**Descrição:** Permite lançar qualificação manualmente para um distribuidor

**STATUS = COMPROVADO** - Funcionalidade documentada na tela legada

**Endpoint (NÃO DOCUMENTADO):**
- STATUS = NÃO COMPROVADO - Endpoint para lançamento manual não documentado

---

# RESUMO DO MOTOR DE QUALIFICAÇÃO

## Tabelas (PARCIALMENTE COMPROVADO)
- mlm.qualificacoes - Existe mas está vazia
- mlm.qualificacoes_historico - Existe mas está vazia
- Estrutura das tabelas não documentada

## Critérios de Progressão (COMPROVADO)
- Pontos acumulados
- Volume de vendas da rede
- Número de diretos qualificados
- Tamanho da equipe qualificada
- Tempo mínimo em qualificação atual

## Critérios de Regressão (COMPROVADO)
- Perda de pontos abaixo do mínimo
- Volume abaixo do mínimo
- Perda de diretos qualificados
- Equipe abaixo do mínimo
- Após grace period

## Impactos da Regressão (COMPROVADO)
- Redução de porcentagem de comissão
- Menos gerações pagas
- Perda de bônus especiais
- Redução de limite de saque

## Valores Específicos (NÃO COMPROVADO)
- Valores mínimos para cada critério
- Tempo mínimo por nível
- Duração do grace period
- Valores de redução específicos
- Lista de níveis de qualificação
- Porcentagem por qualificação
- Número de gerações por qualificação
- Limite de saque por qualificação
- Validade dos pontos

---

# STATUS DE EVIDÊNCIA

## COMPROVADO
- Existência das tabelas mlm.qualificacoes e mlm.qualificacoes_historico
- Critérios gerais de progressão
- Critérios gerais de regressão
- Impactos gerais da regressão
- Gatilho de avaliação (confirmação de pagamento)
- Relação com bônus de liderança
- Relação com comissões
- Relação com gerações
- Relação com limite de saque
- Existência de funcionalidade de lançamento manual

## PARCIALMENTE COMPROVADO
- Operações em mlm.qualificacoes
- Operações em mlm.qualificacoes_historico

## NÃO COMPROVADO
- Estrutura completa das tabelas de qualificação
- Valores específicos para cada critério de progressão
- Valores mínimos para cada critério de regressão
- Tempo mínimo por nível de qualificação
- Duração do grace period
- Lista de níveis de qualificação
- Porcentagem de comissão por qualificação
- Número de gerações por qualificação
- Limite de saque por qualificação
- Validade dos pontos de qualificação
- Cálculo de pontos da rede
- Frequência de avaliação de regressão
- Endpoint para lançamento manual de qualificação

---

# PRÓXIMA ETAPA

ETAPA 5: Reverse engineer da rede MLM (NETWORK_ENGINE.md)
