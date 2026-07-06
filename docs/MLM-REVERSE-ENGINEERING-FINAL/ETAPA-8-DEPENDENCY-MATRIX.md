# ETAPA 8 - MATRIZ DE DEPENDÊNCIAS

**Data:** 11 de Junho de 2026  
**Versão:** 1.0  
**Status:** Documentação Baseada em Evidência  
**Fonte:** Documentação API AllInBrasil, fluxo_processamento_pedidos_mlm.md, plano_acao_mlm.md

---

# OBJETIVO

Criar uma matriz completa de dependências entre componentes, tabelas, funções e endpoints do sistema MLM, identificando o caminho crítico e pontos de falha.

---

# MATRIZ DE DEPENDÊNCIA DE COMPONENTES

## Nível 1: Fundação

### Identity
- Autenticação de usuários
- Gestão de perfis
- Gestão de permissões

**STATUS = COMPROVADO** - Documentado em docs/03-IMPLEMENTATION-BLUEPRINT.md

**Dependências:** Nenhuma

**Dependentes:**
- CRM
- Commerce
- MLM
- Finance

---

### Location
- Gestão de endereços
- Gestão de localizações

**STATUS = COMPROVADO** - Documentado em docs/03-IMPLEMENTATION-BLUEPRINT.md

**Dependências:** Nenhuma

**Dependentes:**
- CRM
- Commerce
- Logistics

---

## Nível 2: Core Platform

### System
- Configurações globais
- Logs
- Auditoria

**STATUS = COMPROVADO** - Documentado em docs/03-IMPLEMENTATION-BLUEPRINT.md

**Dependências:** Identity

**Dependentes:** Todos os módulos

---

## Nível 3: Business Modules

### CRM
- Gestão de clientes
- Gestão de contatos
- Gestão de contas bancárias

**STATUS = COMPROVADO** - Documentado em docs/03-IMPLEMENTATION-BLUEPRINT.md

**Dependências:** Identity, Location, System

**Dependentes:**
- Commerce (clientes)
- MLM (distribuidores)

---

### Commerce
- Gestão de produtos
- Gestão de pedidos
- Gestão de estoque
- Loja virtual

**STATUS = COMPROVADO** - Documentado em docs/03-IMPLEMENTATION-BLUEPRINT.md

**Dependências:** CRM, Identity, System

**Dependentes:**
- MLM (gatilho de pedidos)
- Finance (pagamentos)
- Logistics (envio)

---

### MLM
- Gestão de distribuidores
- Rede binária
- Rede linear
- Planos
- Qualificações
- Bônus
- Comissões
- Pontos

**STATUS = COMPROVADO** - Documentado em docs/03-IMPLEMENTATION-BLUEPRINT.md

**Dependências:** CRM, Commerce, Identity, System

**Dependentes:**
- Finance (saldos, saques)
- Analytics (relatórios)

---

### Finance
- Gestão de saldos
- Solicitações de saque
- Processamento bancário
- Taxas

**STATUS = COMPROVADO** - Documentado em docs/03-IMPLEMENTATION-BLUEPRINT.md

**Dependências:** Commerce, MLM, Identity, System

**Dependentes:**
- Analytics (relatórios financeiros)

---

### Logistics
- Gestão de envios
- Rastreamento

**STATUS = COMPROVADO** - Documentado em docs/03-IMPLEMENTATION-BLUEPRINT.md

**Dependências:** Commerce, Location, System

**Dependentes:** Nenhum

---

# MATRIZ DE DEPENDÊNCIA DE TABELAS

## Schema: mlm

### mlm.distribuidores

**Dependências:**
- identity.users (para autenticação)
- crm.clientes (para dados básicos)

**Dependentes:**
- mlm.rede_linear_nos (id_distribuidor)
- mlm.rede_linear_nos (id_patrocinador)
- mlm.planos_distribuidores (distribuidor_id)
- mlm.qualificacoes (distribuidor_id)
- mlm.qualificacoes_historico (distribuidor_id)
- mlm.comissoes (distribuidor_id)
- mlm.bonus_historico (distribuidor_id)
- mlm.pontos_saldo (distribuidor_id)
- mlm.pontos_transacoes (distribuidor_id)
- mlm.ativacoes_mensais (distribuidor_id)
- finance.distribuidor_conta_bancaria (distribuidor)
- finance.solicitacoes_saque (distribuidor_id)

**STATUS = COMPROVADO** - Dependências documentadas

---

### mlm.rede_linear_nos

**Dependências:**
- mlm.distribuidores (id_distribuidor)
- mlm.distribuidores (id_patrocinador)

**Dependentes:**
- Nenhuma (apenas para consulta)

**STATUS = COMPROVADO** - Dependências documentadas

---

### mlm.planos

**Dependências:** Nenhuma

**Dependentes:**
- mlm.planos_distribuidores (plano_id)
- commerce.produtos (upgrade_de_id, upgrade_para_id, renovacao_de_id)

**STATUS = COMPROVADO** - Dependências documentadas

---

### mlm.planos_distribuidores

**Dependências:**
- mlm.distribuidores (distribuidor_id)
- mlm.planos (plano_id)

**Dependentes:**
- mlm.comissoes (para cálculo de porcentagem)

**STATUS = COMPROVADO** - Dependências documentadas

---

### mlm.qualificacoes

**Dependências:** Nenhuma

**Dependentes:**
- mlm.qualificacoes_historico (qualificacao_anterior_id, qualificacao_nova_id)
- mlm.bonus_historico (para cálculo de bônus de liderança)

**STATUS = COMPROVADO** - Dependências documentadas

---

### mlm.qualificacoes_historico

**Dependências:**
- mlm.distribuidores (distribuidor_id)
- mlm.qualificacoes (qualificacao_anterior_id)
- mlm.qualificacoes (qualificacao_nova_id)

**Dependentes:** Nenhuma (apenas histórico)

**STATUS = COMPROVADO** - Dependências documentadas

---

### mlm.bonus_regras

**Dependências:** Nenhuma

**Dependentes:**
- mlm.bonus_historico (para cálculo)

**STATUS = COMPROVADO** - Dependências documentadas

---

### mlm.bonus_historico

**Dependências:**
- mlm.distribuidores (distribuidor_id)
- mlm.bonus_regras (para cálculo)
- commerce.pedidos (pedido_id)

**Dependentes:**
- finance.saldos (para creditamento)

**STATUS = COMPROVADO** - Dependências documentadas

---

### mlm.comissoes

**Dependências:**
- mlm.distribuidores (distribuidor_id)
- mlm.planos_distribuidores (para cálculo de porcentagem)
- commerce.pedidos (pedido_id)

**Dependentes:**
- finance.saldos (para creditamento)

**STATUS = COMPROVADO** - Dependências documentadas

---

### mlm.pontos_saldo

**Dependências:**
- mlm.distribuidores (distribuidor_id)

**Dependentes:**
- mlm.qualificacoes (para verificação de progressão)

**STATUS = COMPROVADO** - Dependências documentadas

---

### mlm.pontos_transacoes

**Dependências:**
- mlm.distribuidores (distribuidor_id)
- mlm.pontos_saldo (para atualização)

**Dependentes:** Nenhuma (apenas histórico)

**STATUS = COMPROVADO** - Dependências documentadas

---

### mlm.ativacoes_mensais

**Dependências:**
- mlm.distribuidores (distribuidor_id)

**Dependentes:** Nenhuma

**STATUS = COMPROVADO** - Dependências documentadas

---

## Schema: commerce

### commerce.pedidos

**Dependências:**
- mlm.distribuidores (distribuidor_indicador_id)
- mlm.distribuidores (distribuidor_comprador_id)
- crm.clientes (cliente_id)

**Dependentes:**
- mlm.comissoes (pedido_id)
- mlm.bonus_historico (pedido_id)
- mlm.pontos_transacoes (pedido_id)
- finance.pedidos_saldos (pedido_id)

**STATUS = COMPROVADO** - Dependências documentadas

---

### commerce.pedidos_itens

**Dependências:**
- commerce.pedidos (pedido_id)
- commerce.produtos (produto_id)

**Dependentes:**
- mlm.comissoes (para valor da venda)
- mlm.bonus_historico (para valor da venda)

**STATUS = COMPROVADO** - Dependências documentadas

---

### commerce.produtos

**Dependências:**
- mlm.planos (upgrade_de_id, upgrade_para_id, renovacao_de_id)

**Dependentes:**
- commerce.pedidos_itens (produto_id)

**STATUS = COMPROVADO** - Dependências documentadas

---

## Schema: finance

### finance.solicitacoes_saque

**Dependências:**
- mlm.distribuidores (distribuidor_id)
- finance.distribuidor_conta_bancaria (conta_id)
- finance.saldos (para verificação)

**Dependentes:** Nenhuma

**STATUS = COMPROVADO** - Dependências documentadas

---

### finance.saldos

**Dependências:**
- mlm.distribuidores (distribuidor_id)
- mlm.comissoes (para creditamento)
- mlm.bonus_historico (para creditamento)

**Dependentes:**
- finance.solicitacoes_saque (para verificação)

**STATUS = COMPROVADO** - Dependências documentadas

---

# MATRIZ DE DEPENDÊNCIA DE FUNÇÕES

## Funções SQL

### processar_pedido_mlm(pedido_id UUID)

**Dependências:**
- commerce.pedidos (leitura)
- commerce.pedidos_itens (leitura)
- commerce.produtos (leitura)

**Dependentes:**
- processar_compra_plano()
- processar_compra_produto()

**STATUS = COMPROVADO** - Função documentada

---

### processar_compra_plano(pedido_id UUID, e_distribuidor BOOLEAN)

**Dependências:**
- processar_pedido_mlm()
- mlm.distribuidores (leitura/escrita)
- mlm.planos_distribuidores (escrita)
- mlm.rede_linear_nos (escrita)
- mlm.pontos_saldo (escrita)
- mlm.pontos_transacoes (escrita)

**Dependentes:** Nenhuma

**STATUS = COMPROVADO** - Função documentada

---

### processar_compra_produto(pedido_id UUID, e_distribuidor BOOLEAN)

**Dependências:**
- processar_pedido_mlm()
- mlm.distribuidores (leitura)
- mlm.planos_distribuidores (leitura)
- mlm.comissoes (escrita)
- mlm.bonus_historico (escrita)
- mlm.pontos_saldo (escrita)
- mlm.pontos_transacoes (escrita)
- mlm.qualificacoes (escrita)
- mlm.qualificacoes_historico (escrita)

**Dependentes:** Nenhuma

**STATUS = COMPROVADO** - Função documentada

---

# MATRIZ DE DEPENDÊNCIA DE ENDPOINTS

## Endpoints MLM

### GET /v1/distribuidores

**Dependências:**
- mlm.distribuidores (leitura)

**Dependentes:** Nenhum

**STATUS = COMPROVADO** - Endpoint documentado

---

### GET /v1/distribuidores/PlanoAtual

**Dependências:**
- mlm.distribuidores (leitura)
- mlm.planos_distribuidores (leitura)
- mlm.planos (leitura)

**Dependentes:** Nenhum

**STATUS = COMPROVADO** - Endpoint documentado

---

### GET /v1/distribuidores/QualificacaoAtual

**Dependências:**
- mlm.distribuidores (leitura)
- mlm.qualificacoes (leitura)

**Dependentes:** Nenhum

**STATUS = COMPROVADO** - Endpoint documentado

---

### GET /v1/rede-linear-nos

**Dependências:**
- mlm.rede_linear_nos (leitura)

**Dependentes:** Nenhum

**STATUS = COMPROVADO** - Endpoint documentado

---

## Endpoints Commerce

### POST /v1/pedidos

**Dependências:**
- commerce.pedidos (escrita)
- commerce.pedidos_itens (escrita)
- mlm.distribuidores (leitura)
- crm.clientes (leitura)

**Dependentes:**
- POST /v1/pedidos/ConfirmarPagamento

**STATUS = COMPROVADO** - Endpoint documentado

---

### POST /v1/pedidos/ConfirmarPagamento

**Dependências:**
- commerce.pedidos (escrita)
- processar_pedido_mlm() (gatilho)

**Dependentes:**
- processar_compra_plano()
- processar_compra_produto()

**STATUS = COMPROVADO** - Endpoint documentado

---

## Endpoints Finance

### POST /v1/solicitacoes-saque

**Dependências:**
- finance.solicitacoes_saque (escrita)
- mlm.distribuidores (leitura)
- finance.distribuidor_conta_bancaria (leitura)
- finance.saldos (leitura)

**Dependentes:**
- POST /v1/solicitacoes-saque/Confirmar

**STATUS = COMPROVADO** - Endpoint documentado

---

### POST /v1/solicitacoes-saque/Confirmar

**Dependências:**
- finance.solicitacoes_saque (escrita)
- finance.saldos (escrita)

**Dependentes:** Nenhum

**STATUS = COMPROVADO** - Endpoint documentado

---

# CAMINHO CRÍTICO

## Fluxo de Compra de Plano

```
1. POST /v1/pedidos
   ↓
2. POST /v1/pedidos/ConfirmarPagamento
   ↓
3. trigger_processar_pedido_pagamento
   ↓
4. processar_pedido_mlm()
   ↓
5. processar_compra_plano()
   ↓
6. mlm.planos_distribuidores (INSERT/UPDATE)
   ↓
7. mlm.rede_linear_nos (INSERT)
   ↓
8. mlm.distribuidores (UPDATE - pernas)
   ↓
9. mlm.pontos_saldo (INSERT/UPDATE)
   ↓
10. mlm.pontos_transacoes (INSERT)
```

**STATUS = COMPROVADO** - Caminho documentado

**Pontos de Falha Potenciais:**
- Falha no trigger: Nenhum processamento MLM
- Falha em processar_compra_plano: Plano não ativado
- Falha em mlm.rede_linear_nos: Rede linear não atualizada
- Falha em mlm.distribuidores: Pernas não alocadas

**STATUS = NÃO COMPROVADO** - Tratamento de erros não documentado

---

## Fluxo de Compra de Produto

```
1. POST /v1/pedidos
   ↓
2. POST /v1/pedidos/ConfirmarPagamento
   ↓
3. trigger_processar_pedido_pagamento
   ↓
4. processar_pedido_mlm()
   ↓
5. processar_compra_produto()
   ↓
6. mlm.comissoes (INSERT)
   ↓
7. mlm.bonus_historico (INSERT)
   ↓
8. mlm.pontos_saldo (INSERT/UPDATE)
   ↓
9. mlm.pontos_transacoes (INSERT)
   ↓
10. mlm.qualificacoes (UPDATE)
   ↓
11. mlm.qualificacoes_historico (INSERT)
```

**STATUS = COMPROVADO** - Caminho documentado

**Pontos de Falha Potenciais:**
- Falha no trigger: Nenhum processamento MLM
- Falha em processar_compra_produto: Nenhum cálculo
- Falha em mlm.comissoes: Comissões não geradas
- Falha em mlm.bonus_historico: Bônus não gerados
- Falha em mlm.qualificacoes: Qualificações não atualizadas

**STATUS = NÃO COMPROVADO** - Tratamento de erros não documentado

---

# PONTOS ÚNICOS DE FALHA

## Trigger: trigger_processar_pedido_pagamento

**Descrição:** Gatilho que inicia todo o processamento MLM

**Impacto da Falha:** Nenhum processamento MLM ocorre

**STATUS = COMPROVADO** - Trigger documentado

**Redundância (NÃO DOCUMENTADA):**
- STATUS = NÃO COMPROVADO - Não há redundância documentada

---

## Função: processar_pedido_mlm()

**Descrição:** Função principal de roteamento

**Impacto da Falha:** Nenhum processamento MLM ocorre

**STATUS = COMPROVADO** - Função documentada

**Redundância (NÃO DOCUMENTADA):**
- STATUS = NÃO COMPROVADO - Não há redundância documentada

---

## Tabela: mlm.bonus_regras

**Descrição:** Armazena regras de cálculo de bônus

**Estado Atual:** Vazia (sem regras configuradas)

**Impacto:** Bônus não podem ser calculados

**STATUS = COMPROVADO** - Estado documentado

---

# DEPENDÊNCIAS CRÍTICAS

## MLM depende de Commerce

**Descrição:** MLM precisa de pedidos do Commerce para processar

**STATUS = COMPROVADO** - Dependência documentada

**Impacto da Falha:** Nenhum processamento MLM

---

## MLM depende de CRM

**Descrição:** MLM precisa de clientes do CRM

**STATUS = COMPROVADO** - Dependência documentada

**Impacto da Falha:** Distribuidores não podem ser criados

---

## Finance depende de MLM

**Descrição:** Finance precisa de saldos calculados pelo MLM

**STATUS = COMPROVADO** - Dependência documentada

**Impacto da Falha:** Saques não podem ser processados

---

# MATRIZ DE RISCO

## Risco Alto

1. **Trigger não configurado**
   - Impacto: Nenhum processamento MLM
   - Probabilidade: Alta (tabela vazia)
   - STATUS = COMPROVADO

2. **mlm.bonus_regras vazia**
   - Impacto: Bônus não calculados
   - Probabilidade: Alta (tabela vazia)
   - STATUS = COMPROVADO

3. **mlm.rede_linear_nos vazia**
   - Impacto: Rede linear não funcional
   - Probabilidade: Alta (tabela vazia)
   - STATUS = COMPROVADO

4. **mlm.qualificacoes vazia**
   - Impacto: Qualificações não funcionais
   - Probabilidade: Alta (tabela vazia)
   - STATUS = COMPROVADO

---

## Risco Médio

1. **Fórmulas não documentadas**
   - Impacto: Cálculos incorretos
   - Probabilidade: Média (fórmulas não documentadas)
   - STATUS = COMPROVADO

2. **Tratamento de erros não documentado**
   - Impacto: Falhas silenciosas
   - Probabilidade: Média (não documentado)
   - STATUS = COMPROVADO

---

## Risco Baixo

1. **Endpoints de consulta**
   - Impacto: Visualização de dados
   - Probabilidade: Baixa (endpoints funcionais)
   - STATUS = COMPROVADO

---

# RESUMO DA MATRIZ DE DEPENDÊNCIAS

## Componentes (COMPROVADO)
- Identity → CRM, Commerce, MLM, Finance
- CRM → Commerce, MLM
- Commerce → MLM, Finance, Logistics
- MLM → Finance, Analytics
- Finance → Analytics

## Tabelas (COMPROVADO)
- commerce.pedidos → mlm.comissoes, mlm.bonus_historico, mlm.pontos_transacoes
- mlm.distribuidores → Todas as tabelas MLM
- mlm.planos → mlm.planos_distribuidores, commerce.produtos
- mlm.qualificacoes → mlm.qualificacoes_historico, mlm.bonus_historico

## Funções (COMPROVADO)
- processar_pedido_mlm → processar_compra_plano, processar_compra_produto
- processar_compra_plano → mlm.planos_distribuidores, mlm.rede_linear_nos
- processar_compra_produto → mlm.comissoes, mlm.bonus_historico, mlm.qualificacoes

## Endpoints (COMPROVADO)
- POST /v1/pedidos → POST /v1/pedidos/ConfirmarPagamento
- POST /v1/pedidos/ConfirmarPagamento → processar_pedido_mlm
- POST /v1/solicitacoes-saque → POST /v1/solicitacoes-saque/Confirmar

## Pontos Únicos de Falha (COMPROVADO)
- trigger_processar_pedido_pagamento
- processar_pedido_mlm()

## Tabelas Vazias (COMPROVADO)
- mlm.bonus_regras
- mlm.bonus_historico
- mlm.qualificacoes
- mlm.rede_linear_nos

---

# STATUS DE EVIDÊNCIA

## COMPROVADO
- Dependências entre componentes
- Dependências entre tabelas
- Dependências entre funções
- Dependências entre endpoints
- Caminho crítico de compra de plano
- Caminho crítico de compra de produto
- Pontos únicos de falha
- Dependências críticas
- Tabelas vazias
- Riscos identificados

## NÃO COMPROVADO
- Tratamento de erros
- Redundância de componentes
- Mecanismos de recuperação
- Monitoramento de falhas

---

# PRÓXIMA ETAPA

Gerar relatório final (MLM-REVERSE-ENGINEERING-FINAL.md)
