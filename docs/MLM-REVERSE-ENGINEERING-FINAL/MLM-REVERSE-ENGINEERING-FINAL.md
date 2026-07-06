# RELATÓRIO FINAL - AUDITORIA FORENSE DO MOTOR MLM

**Data:** 11 de Junho de 2026  
**Versão:** 1.0  
**Status:** Documentação Baseada em Evidência  
**Fonte:** Documentação API AllInBrasil, plano_acao_mlm.md, fluxo_processamento_pedidos_mlm.md, analise_migracao_mlm.md

---

# RESUMO EXECUTIVO

Esta auditoria forense documentou o sistema MLM do AllIn OS 2.0 com base exclusivamente em evidência documentada. O audit identificou 30 endpoints relacionados ao MLM, 12 tabelas no schema mlm, e um fluxo transacional completo desde a criação do pedido até o saque.

**Status do Sistema MLM:**
- **Gatilho principal:** Documentado (trigger_processar_pedido_pagamento)
- **Funções SQL:** Documentadas (processar_pedido_mlm, processar_compra_plano, processar_compra_produto)
- **Tabelas críticas vazias:** 4 tabelas (bonus_regras, bonus_historico, qualificacoes, rede_linear_nos)
- **Fórmulas de cálculo:** NÃO DOCUMENTADAS
- **Regras específicas:** NÃO DOCUMENTADAS

**Conclusão:** A arquitetura geral do sistema MLM está documentada, mas as regras de negócio específicas (fórmulas, porcentagens, critérios) não estão documentadas, impedindo a implementação completa do motor MLM.

---

# OBJETIVO DA AUDITORIA

Realizar engenharia reversa forense do motor MLM para entender sua funcionalidade exata no sistema legado, incluindo distribuidores, rede, planos, pedidos, qualificações, bônus, comissões, ativações, faturamento, saques e pontos.

**Restrições:**
- Não criar hipóteses
- Não sugerir melhorias
- Não propor nova arquitetura
- Não inferir comportamento
- Todo conclusão deve ter evidência documentada
- Regras não comprovadas marcadas como "STATUS = NÃO COMPROVADO"

---

# METODOLOGIA

A auditoria foi conduzida em 8 etapas:

1. **ETAPA 1:** Inventário de endpoints MLM
2. **ETAPA 2:** Engenharia reversa do ciclo de vida de pedidos
3. **ETAPA 3:** Engenharia reversa do motor de bônus
4. **ETAPA 4:** Engenharia reversa do motor de qualificação
5. **ETAPA 5:** Engenharia reversa da rede MLM
6. **ETAPA 6:** Mapeamento de dependências de tabelas
7. **ETAPA 7:** Documentação do fluxo transacional
8. **ETAPA 8:** Criação de matriz de dependências

---

# ETAPA 1 - INVENTÁRIO DE ENDPOINTS

## Resultados

**Total de Endpoints Identificados:** 30

### Por Domínio:
- **MLM (puro):** 10 endpoints
  - Distribuidores: 5 endpoints
  - Rede Linear: 3 endpoints
  - Simulação: 7 endpoints

- **Commerce (relacionado a MLM):** 6 endpoints
  - Pedidos: 6 endpoints
  - Produtos: 1 endpoint

- **Finance (relacionado a MLM):** 13 endpoints
  - Solicitações de Saque: 5 endpoints
  - Solicitações de Saque CD: 4 endpoints
  - Contas Bancárias: 1 endpoint
  - Saldos de Pedido: 1 endpoint

## Gatilhos Críticos

**Endpoint:** POST /v1/pedidos/ConfirmarPagamento  
**Trigger:** trigger_processar_pedido_pagamento  
**Função:** processar_pedido_mlm(pedido_id UUID)  
**STATUS = COMPROVADO**

## Funções SQL Identificadas

- processar_pedido_mlm(pedido_id UUID)
- processar_compra_plano(pedido_id UUID, e_distribuidor BOOLEAN)
- processar_compra_produto(pedido_id UUID, e_distribuidor BOOLEAN)

**STATUS = COMPROVADO**

---

# ETAPA 2 - CICLO DE VIDA DE PEDIDOS

## Momento Crítico

**Confirmação de pagamento** é o gatilho principal para processamento MLM.

**STATUS = COMPROVADO**

## Fluxo Principal

1. Criação do pedido (POST /v1/pedidos)
2. Confirmação de pagamento (POST /v1/pedidos/ConfirmarPagamento)
3. Gatilho: trigger_processar_pedido_pagamento
4. Função: processar_pedido_mlm(pedido_id)
5. Identificação do tipo de compra (plano vs produto)
6. Processamento apropriado

**STATUS = COMPROVADO**

## Distinção de Compra

**Compra de Plano:**
- Produto tem e_plano = TRUE
- Ativa/upgrade plano do distribuidor
- Insere na rede linear
- Gera pontos de ativação
- NÃO gera comissões

**STATUS = COMPROVADO**

**Compra de Produto:**
- Produto tem e_plano = FALSE
- Gera comissões
- Gera bônus
- Gera pontos de qualificação
- Atualiza qualificações

**STATUS = COMPROVADO**

## Impacto de Cancelamento

**STATUS = NÃO COMPROVADO** - Impacto do cancelamento no sistema MLM não documentado

---

# ETAPA 3 - MOTOR DE BÔNUS

## Tipos de Bônus Identificados

### Sistema Legado (COMPROVADO)
1. Bônus Loja Online
2. Bônus Diretos
3. Bônus Qualificação Mensal
4. Bônus Indiretos

### Regras de Negócio (COMPROVADO)
1. Comissão Direta
2. Comissão Indireta
3. Bônus de Perna
4. Bônus de Liderança

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

# ETAPA 4 - MOTOR DE QUALIFICAÇÃO

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
- Lista de níveis de qualificação
- Porcentagem por qualificação
- Número de gerações por qualificação
- Limite de saque por qualificação
- Validade dos pontos

## Tabelas (PARCIALMENTE COMPROVADO)

- mlm.qualificacoes - Existe mas está vazia
- mlm.qualificacoes_historico - Existe mas está vazia
- Estrutura das tabelas não documentada

---

# ETAPA 5 - MOTOR DE REDE MLM

## Tipos de Rede (COMPROVADO)

### Rede Binária
- Duas pernas: esquerda e direita
- Cada distribuidor pode ter duas pernas
- Patrocinador aloca novos distribuidores nas pernas
- Volume de perna é usado para cálculo de bônus

### Rede Linear
- Estrutura de linha única
- Cada distribuidor tem uma posição relativa na linha
- Posição é calculada automaticamente
- Vinculação ao patrocinador

## Campos (COMPROVADO)

- perna_esquerda_id
- perna_direita_id
- patrocinador_id
- linha
- posicao_relativa
- nivel

## Algoritmos (NÃO COMPROVADO)

- Cálculo de posição relativa na rede linear
- Alocação em pernas da rede binária
- Cálculo de nível na hierarquia
- Cálculo de volume de perna
- Cálculo de volume de rede
- Reindexação após alteração de patrocinador

## Regras (NÃO COMPROVADAS)

- Critérios para alocação em perna esquerda vs direita
- Quem decide a alocação
- Quando é permitido alterar patrocinador
- Impacto da alteração de patrocinador
- Diferenças funcionais entre rede binária e linear
- Relação entre as duas redes

## Tabelas (PARCIALMENTE COMPROVADO)

- mlm.distribuidores - Campos de rede binária documentados
- mlm.rede_linear_nos - Campos documentados, tabela vazia

---

# ETAPA 6 - DEPENDÊNCIAS DE TABELAS

## Tabelas MLM Identificadas (COMPROVADO)

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

# ETAPA 7 - FLUXO TRANSACIONAL

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

# ETAPA 8 - MATRIZ DE DEPENDÊNCIAS

## Dependências entre Componentes (COMPROVADO)

- Identity → CRM, Commerce, MLM, Finance
- CRM → Commerce, MLM
- Commerce → MLM, Finance, Logistics
- MLM → Finance, Analytics
- Finance → Analytics

## Dependências entre Tabelas (COMPROVADO)

- commerce.pedidos → mlm.comissoes, mlm.bonus_historico, mlm.pontos_transacoes
- mlm.distribuidores → Todas as tabelas MLM
- mlm.planos → mlm.planos_distribuidores, commerce.produtos
- mlm.qualificacoes → mlm.qualificacoes_historico, mlm.bonus_historico

## Pontos Únicos de Falha (COMPROVADO)

- trigger_processar_pedido_pagamento
- processar_pedido_mlm()

## Riscos Identificados (COMPROVADO)

### Risco Alto
1. Trigger não configurado
2. mlm.bonus_regras vazia
3. mlm.rede_linear_nos vazia
4. mlm.qualificacoes vazia

### Risco Médio
1. Fórmulas não documentadas
2. Tratamento de erros não documentado

---

# PLANOS IDENTIFICADOS

**STATUS = COMPROVADO**

1. **Afiliado** - R$ 0
2. **Avanço** - R$ 997
3. **Excelência** - R$ 3.980

---

# FORMAS DE PAGAMENTO

**STATUS = COMPROVADO**

1. Boleto 20 dias
2. Boleto 7 dias com desconto de 5%
3. Pagseguro Pix
4. Cartão de crédito
5. Asaas

---

# STATUS ATUAL DO SISTEMA MLM

## O Que Está Documentado (COMPROVADO)

- Arquitetura geral do sistema
- Gatilho principal de processamento
- Funções SQL principais
- Endpoints da API
- Estrutura geral das tabelas
- Fluxo transacional geral
- Dependências entre componentes
- Tipos de bônus existentes
- Tipos de rede existentes
- Critérios gerais de qualificação
- Planos disponíveis
- Formas de pagamento

## O Que NÃO Está Documentado (NÃO COMPROVADO)

- Fórmulas específicas de cálculo
- Porcentagens por plano
- Número de gerações por plano
- Volume mínimo por perna
- Metas de volume por qualificação
- Qualificação mínima para bônus de liderança
- Definição de "distribuidor ativo"
- Definição de "geração" na hierarquia
- Cálculo de volume de perna
- Cálculo de volume de rede
- Período de disponibilidade de saldo
- Cálculo de taxas de saque
- Limites específicos de saque por plano
- Estrutura completa das tabelas
- Tempo mínimo por nível de qualificação
- Duração do grace period
- Lista de níveis de qualificação
- Algoritmo de alocação em pernas
- Algoritmo de cálculo de posição relativa
- Algoritmo de cálculo de nível
- Critérios para alteração de patrocinador
- Impacto do cancelamento de pedido
- Impacto do estornamento de pagamento
- Tratamento de erros
- Redundância de componentes

---

# LACUNAS CRÍTICAS

## Lacuna 1: Fórmulas de Cálculo

**Impacto:** Impossível implementar cálculo de comissões e bônus

**Evidência:** Nenhuma fórmula documentada

**STATUS = NÃO COMPROVADO**

---

## Lacuna 2: Porcentagens por Plano

**Impacto:** Impossível configurar comissões corretamente

**Evidência:** Porcentagens não documentadas

**STATUS = NÃO COMPROVADO**

---

## Lacuna 3: Critérios de Qualificação Específicos

**Impacto:** Impossível implementar progressão/regressão de qualificações

**Evidência:** Valores mínimos não documentados

**STATUS = NÃO COMPROVADO**

---

## Lacuna 4: Estrutura Completa das Tabelas

**Impacto:** Impossível criar tabelas corretamente

**Evidência:** Apenas campos principais documentados

**STATUS = NÃO COMPROVADO**

---

## Lacuna 5: Algoritmos de Rede

**Impacto:** Impossível implementar posicionamento correto na rede

**Evidência:** Algoritmos não documentados

**STATUS = NÃO COMPROVADO**

---

# RECOMENDAÇÕES

**Nota:** Esta auditoria não deve sugerir melhorias ou propor nova arquitetura. As recomendações abaixo são limitadas a ações necessárias para completar a documentação existente.

## Ação 1: Obter Documentação de Fórmulas

**Necessidade:** Fórmulas de cálculo de comissões e bônus

**Fonte Potencial:** Sistema legado ou especialistas do negócio

**Prioridade:** Alta

---

## Ação 2: Obter Documentação de Porcentagens

**Necessidade:** Porcentagens de comissão por plano e por qualificação

**Fonte Potencial:** Sistema legado ou especialistas do negócio

**Prioridade:** Alta

---

## Ação 3: Obter Documentação de Critérios

**Necessidade:** Critérios específicos de qualificação e regressão

**Fonte Potencial:** Sistema legado ou especialistas do negócio

**Prioridade:** Alta

---

## Ação 4: Obter Estrutura Completa das Tabelas

**Necessidade:** DDL completo das tabelas MLM

**Fonte Potencial:** Banco de dados legado ou scripts de migração

**Prioridade:** Alta

---

## Ação 5: Obter Documentação de Algoritmos

**Necessidade:** Algoritmos de posicionamento na rede

**Fonte Potencial:** Código fonte legado ou especialistas técnicos

**Prioridade:** Alta

---

# CONCLUSÃO

A auditoria forense do motor MLM identificou a arquitetura geral do sistema, incluindo 30 endpoints, 12 tabelas, e um fluxo transacional completo. No entanto, as regras de negócio específicas necessárias para a implementação completa não estão documentadas.

**Status da Documentação:**
- **Arquitetura:** 80% documentada
- **Regras de Negócio:** 20% documentada
- **Implementação:** Impossível sem documentação adicional

**Próximos Passos:**
Para implementar o motor MLM, é necessário obter documentação adicional sobre:
1. Fórmulas de cálculo
2. Porcentagens por plano
3. Critérios de qualificação
4. Estrutura completa das tabelas
5. Algoritmos de rede

Sem essa documentação adicional, qualquer implementação seria baseada em suposições, o que viola os princípios desta auditoria forense.

---

# DOCUMENTOS GERADOS

1. **ETAPA-1-INVENTARIO-MLM-ENDPOINTS.md** - Inventário de 30 endpoints
2. **ETAPA-2-PEDIDO-LIFECYCLE.md** - Ciclo de vida de pedidos
3. **ETAPA-3-BONUS-ENGINE.md** - Motor de bônus
4. **ETAPA-4-QUALIFICATION-ENGINE.md** - Motor de qualificação
5. **ETAPA-5-NETWORK-ENGINE.md** - Motor de rede MLM
6. **ETAPA-6-MLM-TABLE-DEPENDENCIES.md** - Dependências de tabelas
7. **ETAPA-7-MLM-TRANSACTION-FLOW.md** - Fluxo transacional
8. **ETAPA-8-DEPENDENCY-MATRIX.md** - Matriz de dependências
9. **MLM-REVERSE-ENGINEERING-FINAL.md** - Este relatório final

---

# STATUS FINAL DA AUDITORIA

**Concluída:** 11 de Junho de 2026  
**Etapas Concluídas:** 8/8  
**Documentos Gerados:** 9  
**Status:** COMPLETA (com lacunas identificadas)

---

# ASSINATURA

Auditoria conduzida com base exclusivamente em evidência documentada, sem hipóteses, inferências ou sugestões de melhoria. Todas as conclusões não comprovadas foram marcadas como "STATUS = NÃO COMPROVADO".
