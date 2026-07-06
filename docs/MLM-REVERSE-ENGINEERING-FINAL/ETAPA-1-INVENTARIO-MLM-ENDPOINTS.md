# ETAPA 1 - INVENTÁRIO DE ENDPOINTS MLM

**Data:** 11 de Junho de 2026  
**Versão:** 1.0  
**Status:** Documentação Baseada em Evidência  
**Fonte:** Documentação API AllInBrasil

---

# OBJETIVO

Inventariar todos os endpoints relacionados ao sistema MLM, incluindo distribuidores, rede, planos, pedidos, qualificações, bônus e financeiro. Cada endpoint deve ser documentado com URL, método, escopo, parâmetros, campos de resposta e dependências.

---

# DOMÍNIO MLM - ENDPOINTS PRINCIPAIS

## 1. Distribuidores

### 1.1 GET /v1/distribuidores

**Descrição:** Lista distribuidores cadastrados no sistema

**Método:** GET  
**URL:** https://allinbrasil.com.br/api/v1/distribuidores  
**Escopo Necessário:** distribuidores  
**Fonte:** docs/api-knowledge-base/39-distribuidores.md

**Filtros Disponíveis:**
- `id` - Filtro por ID
- `patrocinador_id` - Filtro por patrocinador
- `perna_esquerda_id` - Filtro por perna esquerda (rede binária)
- `perna_direita_id` - Filtro por perna direita (rede binária)
- `ativo` - Filtro por status ativo
- `status` - Filtro por status
- `nome` - Filtro por nome (contém)
- `email` - Filtro por email
- `cpf` - Filtro por CPF
- `data_cadastro` - Filtro por data de cadastro
- `limit` - Limite de resultados (máximo 100)
- `page` - Número da página
- `select` - Seleção de campos específicos
- `order_by` - Ordenação

**Campos de Resposta Principais:**
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

**Dependências:**
- Tabela: mlm.distribuidores
- Relacionamento: mlm.rede_binaria (perna_esquerda_id, perna_direita_id)
- Relacionamento: mlm.distribuidores (patrocinador_id)

---

### 1.2 GET /v1/distribuidores/AtivacoesMensais

**Descrição:** Lista ativações mensais do distribuidor

**Método:** GET  
**URL:** https://allinbrasil.com.br/api/v1/distribuidores/AtivacoesMensais  
**Escopo Necessário:** distribuidores  
**Fonte:** docs/01-ENGANHARIA-REVERSA-API-COMPLETA.md (linha 47)

**Filtros Disponíveis:**
- `distribuidor_id` - Filtro por distribuidor
- `mes` - Filtro por mês
- `ano` - Filtro por ano
- `status` - Filtro por status

**Campos de Resposta Principais:**
- `id` - ID da ativação
- `distribuidor_id` - ID do distribuidor
- `mes` - Mês de referência
- `ano` - Ano de referência
- `status` - Status da ativação
- `data_ativacao` - Data da ativação

**Dependências:**
- Tabela: mlm.ativacoes_mensais
- Relacionamento: mlm.distribuidores

---

### 1.3 GET /v1/distribuidores/PlanoAtual

**Descrição:** Retorna plano atual do distribuidor

**Método:** GET  
**URL:** https://allinbrasil.com.br/api/v1/distribuidores/PlanoAtual  
**Escopo Necessário:** distribuidores  
**Fonte:** docs/01-ENGANHARIA-REVERSA-API-COMPLETA.md (linha 48)

**Filtros Disponíveis:**
- `distribuidor_id` - Filtro por distribuidor

**Campos de Resposta Principais:**
- `distribuidor_id` - ID do distribuidor
- `plano_id` - ID do plano
- `plano_nome` - Nome do plano
- `data_adesao` - Data de adesão ao plano
- `data_upgrade` - Data do último upgrade

**Dependências:**
- Tabela: mlm.planos_distribuidores
- Relacionamento: mlm.distribuidores
- Relacionamento: mlm.planos

---

### 1.4 GET /v1/distribuidores/QualificacaoAtual

**Descrição:** Retorna qualificação atual do distribuidor

**Método:** GET  
**URL:** https://allinbrasil.com.br/api/v1/distribuidores/QualificacaoAtual  
**Escopo Necessário:** distribuidores  
**Fonte:** docs/01-ENGANHARIA-REVERSA-API-COMPLETA.md (linha 49)

**Filtros Disponíveis:**
- `distribuidor_id` - Filtro por distribuidor

**Campos de Resposta Principais:**
- `distribuidor_id` - ID do distribuidor
- `qualificacao_id` - ID da qualificação
- `qualificacao_nome` - Nome da qualificação
- `data_atingimento` - Data de atingimento
- `data_manutencao` - Data de manutenção

**Dependências:**
- Tabela: mlm.qualificacoes
- Relacionamento: mlm.distribuidores
- Relacionamento: mlm.qualificacoes_historico

---

### 1.5 GET /v1/distribuidores/Telefones

**Descrição:** Lista telefones do distribuidor

**Método:** GET  
**URL:** https://allinbrasil.com.br/api/v1/distribuidores/Telefones  
**Escopo Necessário:** distribuidores  
**Fonte:** docs/01-ENGANHARIA-REVERSA-API-COMPLETA.md (linha 50)

**Filtros Disponíveis:**
- `distribuidor_id` - Filtro por distribuidor

**Campos de Resposta Principais:**
- `id` - ID do telefone
- `distribuidor_id` - ID do distribuidor
- `telefone` - Número de telefone
- `tipo` - Tipo de telefone

**Dependências:**
- Tabela: mlm.distribuidores_telefones
- Relacionamento: mlm.distribuidores

---

## 2. Rede Linear

### 2.1 GET /v1/rede-linear-nos

**Descrição:** Lista posições na rede linear

**Método:** GET  
**URL:** https://allinbrasil.com.br/api/v1/rede-linear-nos  
**Escopo Necessário:** rede_linear_nos  
**Fonte:** docs/api-knowledge-base/58-rede-linear-nos.md

**Filtros Disponíveis:**
- `id` - Filtro por ID
- `linha` - Filtro por linha
- `posicao_relativa` - Filtro por posição relativa
- `id_distribuidor` - Filtro por distribuidor
- `id_patrocinador` - Filtro por patrocinador
- `limit` - Limite de resultados
- `page` - Número da página
- `select` - Seleção de campos
- `order_by` - Ordenação

**Campos de Resposta Principais:**
- `id` - ID do nó
- `linha` - Linha na rede linear
- `posicao_relativa` - Posição relativa na linha
- `id_distribuidor` - ID do distribuidor
- `id_patrocinador` - ID do patrocinador
- `data_cadastro` - Data de cadastro

**Dependências:**
- Tabela: mlm.rede_linear_nos
- Relacionamento: mlm.distribuidores
- Relacionamento: mlm.distribuidores (patrocinador)

---

### 2.2 GET /v1/rede-linear-nos/Downlines

**Descrição:** Lista downlines na rede linear

**Método:** GET  
**URL:** https://allinbrasil.com.br/api/v1/rede-linear-nos/Downlines  
**Escopo Necessário:** rede_linear_nos  
**Fonte:** docs/01-ENGANHARIA-REVERSA-API-COMPLETA.md (linha 80)

**Filtros Disponíveis:**
- `id_distribuidor` - Filtro por distribuidor
- `nivel` - Filtro por nível
- `limit` - Limite de resultados

**Campos de Resposta Principais:**
- `id` - ID do nó
- `id_distribuidor` - ID do distribuidor
- `nivel` - Nível na hierarquia
- `linha` - Linha na rede linear

**Dependências:**
- Tabela: mlm.rede_linear_nos
- Relacionamento: mlm.distribuidores

---

### 2.3 GET /v1/rede-linear-nos/Uplines

**Descrição:** Lista uplines na rede linear

**Método:** GET  
**URL:** https://allinbrasil.com.br/api/v1/rede-linear-nos/Uplines  
**Escopo Necessário:** rede_linear_nos  
**Fonte:** docs/01-ENGANHARIA-REVERSA-API-COMPLETA.md (linha 81)

**Filtros Disponíveis:**
- `id_distribuidor` - Filtro por distribuidor
- `nivel` - Filtro por nível
- `limit` - Limite de resultados

**Campos de Resposta Principais:**
- `id` - ID do nó
- `id_distribuidor` - ID do distribuidor
- `nivel` - Nível na hierarquia
- `linha` - Linha na rede linear

**Dependências:**
- Tabela: mlm.rede_linear_nos
- Relacionamento: mlm.distribuidores

---

## 3. Simulação

### 3.1 GET /v1/simulacao

**Descrição:** Lista simulações de comissão

**Método:** GET  
**URL:** https://allinbrasil.com.br/api/v1/simulacao  
**Escopo Necessário:** simulacao_listar  
**Fonte:** docs/api-knowledge-base/59-simulacao.md

**Filtros Disponíveis:**
- `id` - Filtro por ID
- `data_inicio` - Filtro por data de início
- `data_fim` - Filtro por data de fim
- `data_cadastro` - Filtro por data de cadastro
- `limit` - Limite de resultados
- `page` - Número da página
- `select` - Seleção de campos
- `order_by` - Ordenação

**Campos de Resposta Principais:**
- `id` - ID da simulação
- `data_inicio` - Data de início
- `data_fim` - Data de fim
- `data_cadastro` - Data de cadastro
- `status` - Status da simulação

**Dependências:**
- Tabela: mlm.simulacoes

---

### 3.2 POST /v1/simulacao

**Descrição:** Cria nova simulação de comissão

**Método:** POST  
**URL:** https://allinbrasil.com.br/api/v1/simulacao  
**Escopo Necessário:** simulacao_listar  
**Fonte:** docs/api-knowledge-base/59-simulacao.md

**Payload:**
- `data_inicio` - Data de início (obrigatório)
- `data_fim` - Data de fim (obrigatório)

**Campos de Resposta Principais:**
- `id` - ID da simulação criada
- `data_inicio` - Data de início
- `data_fim` - Data de fim
- `data_cadastro` - Data de cadastro
- `status` - Status da simulação

**Dependências:**
- Tabela: mlm.simulacoes

---

### 3.3 POST /v1/simulacao/Cancelar

**Descrição:** Cancela simulação

**Método:** POST  
**URL:** https://allinbrasil.com.br/api/v1/simulacao/Cancelar  
**Escopo Necessário:** simulacao_listar  
**Fonte:** docs/01-ENGANHARIA-REVERSA-API-COMPLETA.md (linha 83)

**Payload:**
- `id` - ID da simulação (obrigatório)

**Campos de Resposta Principais:**
- `id` - ID da simulação
- `status` - Status atualizado

**Dependências:**
- Tabela: mlm.simulacoes

---

### 3.4 POST /v1/simulacao/Executar

**Descrição:** Executa simulação

**Método:** POST  
**URL:** https://allinbrasil.com.br/api/v1/simulacao/Executar  
**Escopo Necessário:** simulacao_listar  
**Fonte:** docs/01-ENGANHARIA-REVERSA-API-COMPLETA.md (linha 84)

**Payload:**
- `id` - ID da simulação (obrigatório)

**Campos de Resposta Principais:**
- `id` - ID da simulação
- `status` - Status atualizado
- `resultado` - Resultado da simulação

**Dependências:**
- Tabela: mlm.simulacoes
- Tabela: mlm.bonus_historico (para cálculo)
- Tabela: mlm.comissoes (para cálculo)

---

### 3.5 GET /v1/simulacao/InformacoesExecucao

**Descrição:** Lista informações de execução da simulação

**Método:** GET  
**URL:** https://allinbrasil.com.br/api/v1/simulacao/InformacoesExecucao  
**Escopo Necessário:** simulacao_listar  
**Fonte:** docs/01-ENGANHARIA-REVERSA-API-COMPLETA.md (linha 85)

**Filtros Disponíveis:**
- `simulacao_id` - Filtro por simulação

**Campos de Resposta Principais:**
- `id` - ID da informação
- `simulacao_id` - ID da simulação
- `tipo` - Tipo de informação
- `valor` - Valor
- `data_execucao` - Data de execução

**Dependências:**
- Tabela: mlm.simulacoes_informacoes

---

### 3.6 GET /v1/simulacao-bonus-faturamento

**Descrição:** Retorna bônus e faturamento por mês

**Método:** GET  
**URL:** https://allinbrasil.com.br/api/v1/simulacao-bonus-faturamento  
**Escopo Necessário:** simulacao_bonus_faturamento  
**Fonte:** docs/api-knowledge-base/60-simulacao-bonus-faturamento.md

**Filtros Disponíveis:**
- `mes` - Filtro por mês

**Campos de Resposta Principais:**
- `mes` - Mês de referência
- `valor_total_bonus` - Valor total de bônus
- `valor_total_faturamento` - Valor total de faturamento

**Dependências:**
- Tabela: mlm.bonus_historico
- Tabela: commerce.pedidos

---

### 3.7 GET /v1/simulacao-planos

**Descrição:** Lista planos ativos no sistema

**Método:** GET  
**URL:** https://allinbrasil.com.br/api/v1/simulacao-planos  
**Escopo Necessário:** simulacao_planos_listar  
**Fonte:** docs/api-knowledge-base/61-simulacao-planos.md

**Filtros Disponíveis:**
- `id` - Filtro por ID
- `nome` - Filtro por nome
- `tipo` - Filtro por tipo

**Campos de Resposta Principais:**
- `id` - ID do plano
- `nome` - Nome do plano
- `tipo` - Tipo do plano

**Dependências:**
- Tabela: mlm.planos

---

# DOMÍNIO COMMERCE - ENDPOINTS RELACIONADOS A MLM

## 4. Pedidos

### 4.1 GET /v1/pedidos

**Descrição:** Lista pedidos (inclui pedidos de ativação de plano)

**Método:** GET  
**URL:** https://allinbrasil.com.br/api/v1/pedidos  
**Escopo Necessário:** pedidos  
**Fonte:** docs/api-knowledge-base/50-pedidos.md

**Filtros Disponíveis:**
- `id` - Filtro por ID
- `distribuidor_indicador_id` - Filtro por distribuidor indicador
- `distribuidor_comprador_id` - Filtro por distribuidor comprador
- `cliente_id` - Filtro por cliente
- `pagamento_confirmado` - Filtro por pagamento confirmado
- `status_id` - Filtro por status
- `cancelado` - Filtro por cancelado
- `data_criacao` - Filtro por data de criação
- `limit` - Limite de resultados
- `page` - Número da página
- `select` - Seleção de campos
- `order_by` - Ordenação

**Campos de Resposta Principais:**
- `id` - ID do pedido
- `distribuidor_indicador_id` - ID do distribuidor indicador
- `distribuidor_comprador_id` - ID do distribuidor comprador
- `cliente_id` - ID do cliente
- `pagamento_confirmado` - Pagamento confirmado
- `status_id` - ID do status
- `cancelado` - Cancelado
- `data_criacao` - Data de criação

**Dependências:**
- Tabela: commerce.pedidos
- Relacionamento: mlm.distribuidores (distribuidor_indicador_id)
- Relacionamento: mlm.distribuidores (distribuidor_comprador_id)
- Relacionamento: crm.clientes

---

### 4.2 POST /v1/pedidos

**Descrição:** Cria novo pedido (inclui pedido de ativação de plano)

**Método:** POST  
**URL:** https://allinbrasil.com.br/api/v1/pedidos  
**Escopo Necessário:** pedidos  
**Fonte:** docs/api-knowledge-base/50-pedidos.md

**Payload:**
- `distribuidor_indicador_id` - ID do distribuidor indicador
- `distribuidor_comprador_id` - ID do distribuidor comprador
- `cliente_id` - ID do cliente
- `itens` - Lista de itens do pedido

**Campos de Resposta Principais:**
- `id` - ID do pedido criado
- `distribuidor_indicador_id` - ID do distribuidor indicador
- `distribuidor_comprador_id` - ID do distribuidor comprador
- `cliente_id` - ID do cliente
- `status_id` - ID do status
- `data_criacao` - Data de criação

**Dependências:**
- Tabela: commerce.pedidos
- Tabela: commerce.pedidos_itens
- Relacionamento: mlm.distribuidores
- Relacionamento: crm.clientes

---

### 4.3 POST /v1/pedidos/ConfirmarPagamento

**Descrição:** Confirma pagamento do pedido (gatilho para processamento MLM)

**Método:** POST  
**URL:** https://allinbrasil.com.br/api/v1/pedidos/ConfirmarPagamento  
**Escopo Necessário:** pedidos  
**Fonte:** docs/01-ENGANHARIA-REVERSA-API-COMPLETA.md (linha 62)

**Payload:**
- `id` - ID do pedido (obrigatório)

**Campos de Resposta Principais:**
- `id` - ID do pedido
- `pagamento_confirmado` - Pagamento confirmado
- `data_pagamento` - Data do pagamento

**Dependências:**
- Tabela: commerce.pedidos
- Trigger: trigger_processar_pedido_pagamento (documentado em docs/plano_acao_mlm.md)
- Função: processar_pedido_mlm(pedido_id UUID)

---

### 4.4 POST /v1/pedidos/AlterarStatus

**Descrição:** Altera status do pedido

**Método:** POST  
**URL:** https://allinbrasil.com.br/api/v1/pedidos/AlterarStatus  
**Escopo Necessário:** pedidos  
**Fonte:** docs/01-ENGANHARIA-REVERSA-API-COMPLETA.md (linha 60)

**Payload:**
- `id` - ID do pedido (obrigatório)
- `status_id` - Novo status (obrigatório)

**Campos de Resposta Principais:**
- `id` - ID do pedido
- `status_id` - ID do status atualizado

**Dependências:**
- Tabela: commerce.pedidos
- Tabela: commerce.pedidos_status

---

### 4.5 POST /v1/pedidos/Cancelar

**Descrição:** Cancela pedido

**Método:** POST  
**URL:** https://allinbrasil.com.br/api/v1/pedidos/Cancelar  
**Escopo Necessário:** pedidos  
**Fonte:** docs/01-ENGANHARIA-REVERSA-API-COMPLETA.md (linha 61)

**Payload:**
- `id` - ID do pedido (obrigatório)

**Campos de Resposta Principais:**
- `id` - ID do pedido
- `cancelado` - Status de cancelado

**Dependências:**
- Tabela: commerce.pedidos

---

### 4.6 GET /v1/pedidos/Itens

**Descrição:** Lista itens do pedido (identifica produtos de plano)

**Método:** GET  
**URL:** https://allinbrasil.com.br/api/v1/pedidos/Itens  
**Escopo Necessário:** pedidos  
**Fonte:** docs/01-ENGANHARIA-REVERSA-API-COMPLETA.md (linha 64)

**Filtros Disponíveis:**
- `pedido_id` - Filtro por pedido

**Campos de Resposta Principais:**
- `id` - ID do item
- `pedido_id` - ID do pedido
- `produto_id` - ID do produto
- `quantidade` - Quantidade
- `valor` - Valor

**Dependências:**
- Tabela: commerce.pedidos_itens
- Relacionamento: commerce.pedidos
- Relacionamento: commerce.produtos

---

## 5. Produtos

### 5.1 GET /v1/produtos

**Descrição:** Lista produtos (inclui produtos de plano)

**Método:** GET  
**URL:** https://allinbrasil.com.br/api/v1/produtos  
**Escopo Necessário:** produtos  
**Fonte:** docs/api-knowledge-base/54-produtos.md

**Filtros Disponíveis:**
- `id` - Filtro por ID
- `e_plano` - Filtro se é plano
- `e_upgrade_plano` - Filtro se é upgrade de plano
- `e_recompra_plano` - Filtro se é recompra de plano
- `e_renovacao_plano` - Filtro se é renovação de plano
- `e_ativacao` - Filtro se é ativação
- `upgrade_de_id` - Filtro por ID do plano de origem para upgrade
- `upgrade_para_id` - Filtro por ID de destino do plano para upgrade
- `renovacao_de_id` - Filtro para ID do plano para renovar
- `limit` - Limite de resultados
- `page` - Número da página
- `select` - Seleção de campos
- `order_by` - Ordenação

**Campos de Resposta Principais:**
- `id` - ID do produto
- `nome` - Nome do produto
- `e_plano` - É plano
- `e_upgrade_plano` - É upgrade de plano
- `e_renovacao_plano` - É renovação de plano
- `e_ativacao` - É ativação
- `upgrade_de_id` - ID do plano de origem para upgrade
- `upgrade_para_id` - ID de destino do plano para upgrade
- `renovacao_de_id` - ID do plano para renovar

**Dependências:**
- Tabela: commerce.produtos
- Relacionamento: mlm.planos (upgrade_de_id, upgrade_para_id, renovacao_de_id)

---

# DOMÍNIO FINANCE - ENDPOINTS RELACIONADOS A MLM

## 6. Solicitações de Saque

### 6.1 GET /v1/solicitacoes-saque

**Descrição:** Lista solicitações de saque de distribuidores

**Método:** GET  
**URL:** https://allinbrasil.com.br/api/v1/solicitacoes-saque  
**Escopo Necessário:** solicitacao_saque  
**Fonte:** docs/api-knowledge-base/62-solicitacoes-saque.md

**Filtros Disponíveis:**
- `id` - Filtro por ID
- `distribuidor_id` - Filtro por distribuidor
- `conta_id` - Filtro por conta bancária
- `status_id` - Filtro por status
- `valor_solicitado` - Filtro por valor solicitado
- `data_solicitacao` - Filtro por data de solicitação
- `limit` - Limite de resultados
- `page` - Número da página
- `select` - Seleção de campos
- `order_by` - Ordenação

**Campos de Resposta Principais:**
- `id` - ID da solicitação
- `distribuidor_id` - ID do distribuidor
- `conta_id` - ID da conta bancária
- `status_id` - ID do status
- `valor_solicitado` - Valor solicitado
- `total_taxas` - Total de taxas
- `valor_a_depositar` - Valor a depositar
- `data_solicitacao` - Data de solicitação

**Dependências:**
- Tabela: finance.solicitacoes_saque
- Relacionamento: mlm.distribuidores
- Relacionamento: finance.distribuidor_conta_bancaria
- Relacionamento: finance.solicitacoes_saque_status

---

### 6.2 POST /v1/solicitacoes-saque

**Descrição:** Cria nova solicitação de saque

**Método:** POST  
**URL:** https://allinbrasil.com.br/api/v1/solicitacoes-saque  
**Escopo Necessário:** solicitacao_saque  
**Fonte:** docs/api-knowledge-base/62-solicitacoes-saque.md

**Payload:**
- `distribuidor_id` - ID do distribuidor (obrigatório)
- `conta_id` - ID da conta bancária (obrigatório)
- `valor_solicitado` - Valor solicitado (obrigatório)

**Campos de Resposta Principais:**
- `id` - ID da solicitação criada
- `distribuidor_id` - ID do distribuidor
- `conta_id` - ID da conta bancária
- `status_id` - ID do status
- `valor_solicitado` - Valor solicitado
- `total_taxas` - Total de taxas
- `valor_a_depositar` - Valor a depositar
- `data_solicitacao` - Data de solicitação

**Dependências:**
- Tabela: finance.solicitacoes_saque
- Tabela: finance.saldos (para verificação de saldo disponível)
- Relacionamento: mlm.distribuidores

---

### 6.3 POST /v1/solicitacoes-saque/Confirmar

**Descrição:** Confirma solicitação de saque

**Método:** POST  
**URL:** https://allinbrasil.com.br/api/v1/solicitacoes-saque/Confirmar  
**Escopo Necessário:** solicitacao_saque  
**Fonte:** docs/01-ENGANHARIA-REVERSA-API-COMPLETA.md (linha 89)

**Payload:**
- `id` - ID da solicitação (obrigatório)

**Campos de Resposta Principais:**
- `id` - ID da solicitação
- `status_id` - ID do status atualizado
- `data_confirmacao` - Data de confirmação

**Dependências:**
- Tabela: finance.solicitacoes_saque
- Tabela: finance.saldos (para dedução do saldo)

---

### 6.4 POST /v1/solicitacoes-saque/Estornar

**Descrição:** Estorna solicitação de saque

**Método:** POST  
**URL:** https://allinbrasil.com.br/api/v1/solicitacoes-saque/Estornar  
**Escopo Necessário:** solicitacao_saque  
**Fonte:** docs/01-ENGANHARIA-REVERSA-API-COMPLETA.md (linha 90)

**Payload:**
- `id` - ID da solicitação (obrigatório)

**Campos de Resposta Principais:**
- `id` - ID da solicitação
- `status_id` - ID do status atualizado
- `data_estorno` - Data de estorno

**Dependências:**
- Tabela: finance.solicitacoes_saque
- Tabela: finance.saldos (para devolução do saldo)

---

### 6.5 POST /v1/solicitacoes-saque/Reverter

**Descrição:** Reverte solicitação de saque

**Método:** POST  
**URL:** https://allinbrasil.com.br/api/v1/solicitacoes-saque/Reverter  
**Escopo Necessário:** solicitacao_saque  
**Fonte:** docs/01-ENGANHARIA-REVERSA-API-COMPLETA.md (linha 91)

**Payload:**
- `id` - ID da solicitação (obrigatório)

**Campos de Resposta Principais:**
- `id` - ID da solicitação
- `status_id` - ID do status atualizado
- `data_reversao` - Data de reversão

**Dependências:**
- Tabela: finance.solicitacoes_saque
- Tabela: finance.saldos (para devolução do saldo)

---

### 6.6 GET /v1/distribuidor-conta-bancaria

**Descrição:** Lista contas bancárias do distribuidor

**Método:** GET  
**URL:** https://allinbrasil.com.br/api/v1/distribuidor-conta-bancaria  
**Escopo Necessário:** N/A (escopo não especificado na documentação)  
**Fonte:** docs/api-knowledge-base/38-distribuidor-conta-bancaria.md

**Filtros Disponíveis:**
- `distribuidor` - Filtro por distribuidor
- `banco` - Filtro por banco
- `tipo_titular` - Filtro por tipo de titular
- `nome` - Filtro por nome
- `cpf` - Filtro por CPF
- `cnpj` - Filtro por CNPJ
- `chave_pix` - Filtro por chave PIX

**Campos de Resposta Principais:**
- `id` - ID da conta
- `distribuidor` - ID do distribuidor
- `banco` - ID do banco
- `tipo_titular` - Tipo de titular
- `nome` - Nome do titular
- `cpf` - CPF
- `cnpj` - CNPJ
- `chave_pix` - Chave PIX

**Dependências:**
- Tabela: finance.distribuidor_conta_bancaria
- Relacionamento: mlm.distribuidores

---

## 7. Solicitações de Saque CD

### 7.1 GET /v1/solicitacoes-saque-cd

**Descrição:** Lista solicitações de saque de Centros de Distribuição

**Método:** GET  
**URL:** https://allinbrasil.com.br/api/v1/solicitacoes-saque-cd  
**Escopo Necessário:** solicitacao_saque_cd  
**Fonte:** docs/api-knowledge-base/63-solicitacoes-saque-cd.md

**Filtros Disponíveis:**
- `id` - Filtro por ID
- `cd_id` - Filtro por Centro de Distribuição
- `conta_cd_id` - Filtro por conta bancária do CD
- `status_id` - Filtro por status
- `valor_solicitado` - Filtro por valor solicitado
- `data_solicitacao` - Filtro por data de solicitação
- `limit` - Limite de resultados
- `page` - Número da página
- `select` - Seleção de campos
- `order_by` - Ordenação

**Campos de Resposta Principais:**
- `id` - ID da solicitação
- `cd_id` - ID do Centro de Distribuição
- `conta_cd_id` - ID da conta bancária do CD
- `status_id` - ID do status
- `valor_solicitado` - Valor solicitado
- `total_taxas` - Total de taxas
- `valor_a_depositar` - Valor a depositar
- `data_solicitacao` - Data de solicitação

**Dependências:**
- Tabela: finance.solicitacoes_saque_cd
- Relacionamento: commerce.centros_distribuicao
- Relacionamento: finance.cd_conta_bancaria
- Relacionamento: finance.solicitacoes_saque_status

---

### 7.2 POST /v1/solicitacoes-saque-cd/Confirmar

**Descrição:** Confirma solicitação de saque de CD

**Método:** POST  
**URL:** https://allinbrasil.com.br/api/v1/solicitacoes-saque-cd/Confirmar  
**Escopo Necessário:** solicitacao_saque_cd  
**Fonte:** docs/01-ENGANHARIA-REVERSA-API-COMPLETA.md (linha 93)

**Payload:**
- `id` - ID da solicitação (obrigatório)

**Campos de Resposta Principais:**
- `id` - ID da solicitação
- `status_id` - ID do status atualizado
- `data_confirmacao` - Data de confirmação

**Dependências:**
- Tabela: finance.solicitacoes_saque_cd
- Tabela: finance.saldos_cd (para dedução do saldo)

---

### 7.3 POST /v1/solicitacoes-saque-cd/Estornar

**Descrição:** Estorna solicitação de saque de CD

**Método:** POST  
**URL:** https://allinbrasil.com.br/api/v1/solicitacoes-saque-cd/Estornar  
**Escopo Necessário:** solicitacao_saque_cd  
**Fonte:** docs/01-ENGANHARIA-REVERSA-API-COMPLETA.md (linha 94)

**Payload:**
- `id` - ID da solicitação (obrigatório)

**Campos de Resposta Principais:**
- `id` - ID da solicitação
- `status_id` - ID do status atualizado
- `data_estorno` - Data de estorno

**Dependências:**
- Tabela: finance.solicitacoes_saque_cd
- Tabela: finance.saldos_cd (para devolução do saldo)

---

### 7.4 POST /v1/solicitacoes-saque-cd/Reverter

**Descrição:** Reverte solicitação de saque de CD

**Método:** POST  
**URL:** https://allinbrasil.com.br/api/v1/solicitacoes-saque-cd/Reverter  
**Escopo Necessário:** solicitacao_saque_cd  
**Fonte:** docs/01-ENGANHARIA-REVERSA-API-COMPLETA.md (linha 95)

**Payload:**
- `id` - ID da solicitação (obrigatório)

**Campos de Resposta Principais:**
- `id` - ID da solicitação
- `status_id` - ID do status atualizado
- `data_reversao` - Data de reversão

**Dependências:**
- Tabela: finance.solicitacoes_saque_cd
- Tabela: finance.saldos_cd (para devolução do saldo)

---

## 8. Saldos de Pedido

### 8.1 GET /v1/pedidos-saldos

**Descrição:** Lista saldos gerados na compra de pacotes

**Método:** GET  
**URL:** https://allinbrasil.com.br/api/v1/pedidos-saldos  
**Escopo Necessário:** pedidos_saldos_listar  
**Fonte:** docs/api-knowledge-base/51-pedidos-saldos.md

**Filtros Disponíveis:**
- `id` - Filtro por ID
- `cliente_id` - Filtro por cliente
- `pedido_id` - Filtro por pedido
- `pacote_id` - Filtro por pacote
- `valor` - Filtro por valor
- `data` - Filtro por data
- `tipo_saldo_id` - Filtro por tipo de saldo
- `descricao` - Filtro por descrição
- `limit` - Limite de resultados
- `page` - Número da página
- `select` - Seleção de campos
- `order_by` - Ordenação

**Campos de Resposta Principais:**
- `id` - ID do saldo
- `cliente_id` - ID do cliente
- `pedido_id` - ID do pedido
- `pacote_id` - ID do pacote
- `valor` - Valor do saldo
- `data` - Data de geração
- `tipo_saldo_id` - ID do tipo de saldo
- `descricao` - Descrição

**Dependências:**
- Tabela: finance.pedidos_saldos
- Relacionamento: crm.clientes
- Relacionamento: commerce.pedidos
- Relacionamento: commerce.produtos (pacote)

---

# RESUMO DE ENDPOINTS MLM

## Total de Endpoints Identificados: 30

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

## Gatilhos Críticos Identificados

### Gatilho de Processamento MLM
- **Endpoint:** POST /v1/pedidos/ConfirmarPagamento
- **Trigger:** trigger_processar_pedido_pagamento
- **Função:** processar_pedido_mlm(pedido_id UUID)
- **Fonte:** docs/plano_acao_mlm.md, docs/fluxo_processamento_pedidos_mlm.md

### Funções SQL Identificadas
- `processar_pedido_mlm(pedido_id UUID)` - Função principal de processamento
- `processar_compra_plano(pedido_id UUID, e_distribuidor BOOLEAN)` - Processa compra de plano
- `processar_compra_produto(pedido_id UUID, e_distribuidor BOOLEAN)` - Processa compra de produto
- **Fonte:** docs/plano_acao_mlm.md, docs/fluxo_processamento_pedidos_mlm.md

---

# STATUS DE EVIDÊNCIA

**STATUS = COMPROVADO** - Todos os endpoints listados acima estão documentados nas fontes citadas.

**STATUS = NÃO COMPROVADO** - Não há endpoints não documentados nesta etapa.

---

# PRÓXIMA ETAPA

ETAPA 2: Reverse engineer do ciclo de vida de pedidos (PEDIDO_LIFECYCLE.md)
