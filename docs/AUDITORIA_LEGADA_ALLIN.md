# AUDITORIA FUNCIONAL - PLATAFORMA LEGADA ALLIN

## ETAPA 1: MAPEAMENTO DE TELAS

### Dashboard (Página Inicial)
- URL: https://allinbrasil.com.br/administracao/PaginaInicialAdministrador/Inicio
- Nome: Página Inicial do Administrador
- Finalidade: Visão geral do sistema
- KPIs exibidos:
  - 977 Distribuidores Na Rede
  - 1.686 Planos Vendidos
  - R$ 1.439.402,33 Bônus total recebidos geral - Diretos
  - R$ 15.578,32 Saldo Loja Online
  - R$ 859.194,75 Saldo Perdido
  - R$ -2.097,14 Saldo a receber
  - R$ 7.248,24 Saldo para Compra
- Tabelas:
  - Últimas Transações (Conta, Descrição, Data Transação, Valor)
  - Últimas Ativações (N°, Distribuidor, Informações, Data)
- Links rápidos:
  - Ver Distribuidores
  - Relatório dos Planos

### Distribuidores (Submenu)
1. **Contas Bancárias**
   - URL: https://allinbrasil.com.br/administracao/ContaBancaria/DistribuidorContaBancariaListagem/listar
   - Finalidade: Gerenciar contas bancárias de distribuidores

2. **Verificação de Contas**
   - URL: https://allinbrasil.com.br/administracao/VerificacaoConta/VerificacaoContaArquivosEmAnalise/listar
   - Finalidade: Verificar contas bancárias em análise

3. **Solicitação de saque**
   - URL: https://allinbrasil.com.br/administracao/SolicitacaoSaque/SolicitacaoSaqueTransacoesAdmin/listar
   - Finalidade: Gerenciar solicitações de saque

4. **A Rede**
   - URL: https://allinbrasil.com.br/administracao/Distribuidor/DistribuidoresARede/listar
   - Finalidade: Visualizar rede de distribuidores

5. **Pendentes**
   - URL: https://allinbrasil.com.br/administracao/Distribuidor/DistribuidoresCadastroPendente/listar
   - Finalidade: Gerenciar cadastros pendentes

6. **Relatório de indicados**
   - URL: https://allinbrasil.com.br/administracao/Distribuidor/Patrocinador/relatorioIndicacoes
   - Finalidade: Relatório de indicações

7. **Excluidos**
   - URL: https://allinbrasil.com.br/administracao/Distribuidor/DistribuidoresCadastroExcluido/listar
   - Finalidade: Gerenciar distribuidores excluídos

### Loja Virtual
- URL: https://allinbrasil.com.br/administracao/LinkExterno/LojaVirtual/administrar
- Finalidade: Administrar loja virtual

### Cadastros (Submenu)
- Pendente exploração

### Ferramentas (Submenu)
- Pendente exploração

### Relatórios (Submenu)
- Pendente exploração

### Configurações (Submenu)
- Pendente exploração

### Website (Submenu)
- Pendente exploração

### Bônus
- URL: https://allinbrasil.com.br/administracao/Bonus/BonusUtilizados/listar
- Finalidade: Gerenciar bônus utilizados

### Relatório de Bônus
- URL: https://allinbrasil.com.br/administracao/Bonus/BonusAdministrador/bonusMes
- Finalidade: Relatório mensal de bônus

### Marketing (Submenu)
1. **Notícias** (com submenu)
   - Pendente exploração

2. **Downloads** (com submenu)
   - Pendente exploração

### Treinamento Maxnível
- URL: https://allinbrasil.com.br/administracao/Administrador/AdministradorLogarOutroSistema/logarEad
- Finalidade: Acessar treinamento

---

## RESUMO DO MAPEAMENTO

### Total de Módulos Principais: 12
1. Dashboard (Página Inicial)
2. Distribuidores (7 submenus)
3. Loja Virtual
4. Cadastros (12 submenus)
5. Ferramentas (9 submenus)
6. Relatórios (8 submenus)
7. Configurações (12 submenus)
8. Website (4 submenus)
9. Bônus
10. Relatório de Bônus
11. Marketing (2 submenus)
12. Treinamento Maxnível

### Total de Telas Identificadas: ~60+

---

## ETAPA 2: ENGENHARIA REVERSA DO FRONTEND

### Tela: A Rede (Distribuidores)
- URL: https://allinbrasil.com.br/administracao/Distribuidor/DistribuidoresARede/listar
- Finalidade: Listar e gerenciar distribuidores da rede

**Campos da Tabela:**
- Nº (ID do distribuidor) - ordenável
- Imagem (foto do distribuidor)
- Usuário (username) - ordenável
- Nome completo - ordenável
- E-mail - ordenável
- Patrocinador (username do patrocinador)
- Cidade - ordenável
- Estado (UF) - ordenável
- Doc. Aprovado? (link para verificação de conta)
- Data de Nascimento - ordenável
- Ativo? (Isento/Inativo)
- Data Cad. (data de cadastro)
- Ações (login como usuário, editar)

**Funcionalidades:**
- Exportar dados
- Adicionar filtros
- Ordenação por colunas
- Paginação (20 registros por página)
- Login como usuário (acesso como distribuidor)
- Editar distribuidor
- Verificação de documentos

**Total de Registros:** 977 distribuidores

### Tela: Planos (Adesões)
- URL: https://allinbrasil.com.br/administracao/Planos/Planos/principal
- Finalidade: Gerenciar planos de adesão do sistema MLM

**Abas:**
- Adesões (ativa)
- Upgrades
- Renovações

**Campos da Tabela:**
- ID
- Imagem Principal
- Nome
- Preço
- Estoque
- Status (Sim/Não)
- Ações

**Funcionalidades:**
- Ver Lixeira (planos removidos)
- Ver Logs (histórico de alterações)
- Adicionar novo plano
- Adicionar filtros
- Gerenciar estoque (+)
- Ver logs do plano ()
- Remover plano ()
- Editar plano (✏)

**Planos Ativos:**
- Plano Afiliado - R$ 0,00 (estoque: 9000)
- Plano Avanço - R$ 997,00 (estoque: 1001)
- Plano Excelência - R$ 3.980,00 (estoque: 2000)

### Tela: Bônus Instalados
- URL: https://allinbrasil.com.br/administracao/Bonus/BonusUtilizados/listar
- Finalidade: Gerenciar sistema de comissões e bônus MLM

**Campos da Tabela:**
- Imagem
- Sobre o bônus

**Bônus Ativos:**
1. **Bônus de Loja Online Acumulado** (ID: 7, v4.0, BonusLinearV4)
   - Paga bônus ao dono do link e patrocinador (se dono do link tiver plano Afiliado)
   - Percentuais dependem do plano do dono do link
   - Recebe mesmo se estiver inativo

2. **Bônus total recebidos geral - Diretos** (ID: 4, v4.0, BonusLinearV4)
   - Paga bônus ao patrocinador quando direto realiza compras

3. **Bônus de Qualificação Mensal** (ID: 8, v3.0, BonusQualificacaoMensalV3)
   - Bônus de qualificação mensal

4. **Total de Bônus Recebidos - Indiretos** (ID: 6, v4.0, BonusLinearV4)
   - Paga bônus em 2 níveis de indiretos (recompra e ativação mensal)

**Bônus Desabilitados:**
- Bônus de Consumo (IDs: 1, 2, 3)
- Bônus de Loja Online acumulado (ID: 5)

**Funcionalidades por Bônus:**
- Mudar configuração
- Relatório
- Log
- Editar título e descrição
- Executar Pagamento (bônus qualificação mensal)
- Habilitar/Desabilitar

**Funcionalidades Gerais:**
- Exportar dados
- Adicionar filtros

### Tela: Campos para Pedidos
- URL: https://allinbrasil.com.br/administracao/Pedidos/TiposCampo
- Finalidade: Gerenciar campos personalizados para pedidos

**Campos da Tabela:**
- ID
- Nome
- Chave
- Tipo (Texto, etc.)
- Ativo (Sim/Não)
- Ações

**Funcionalidades:**
- Exportar dados
- Adicionar novo campo
- Adicionar filtros
- Editar campo (✏)
- Remover campo ()

**Exemplo de Campo:**
- teste (Texto, Ativo)

### Tela: Criar Pedido (Compra Manual)
- URL: https://allinbrasil.com.br/administracao/Compras/CriarCompra/principal
- Finalidade: Criar pedidos manualmente pelo administrador

**Campos do Formulário:**
- Distribuidores (combobox)
- Grupo de consumo (combobox)
- Status da compra (combobox)
- Quais os produtos que serão lançados na compra? (botão Adicionar)
- Lançar Ativação (radio Sim/Não)
- Baixar Automaticamente (radio Sim/Não)
- Indicar loja de um distribuidor? (radio Sim/Não)

**Grupos de Consumo Disponíveis:**
- Clientes Finais
- Distribuidor - Comprando Plano de Revenda
- Distribuidor comprando renovação
- Distribuidor - Comprando adesão
- Distribuidor visualizando pedido
- Distribuidor/Consumo inteligente
- Distribuidor - Comprando ativação
- Distribuidor - Comprando upgrade
- Distribuidor - Crédito da adesão própria
- Usuário Pagando Parcela
- Centro de Distribuição
- Centro de Distribuição - Comprando Adesão

**Status da Compra Disponíveis:**
- Pedido Realizado, Aguardando pagamento, Pedido Pago, Pedido enviado para cliente, Pedido concluido, Pedido Cancelado, Cancelado pela Operadora, Negado, Não Aprovado, Cancelamento Revertido, Processando Pedido, Entregue, Despachado, Em analise Financeira, Estornado, Ajuste de Sistema, Aguardando Envio do Boleto, Impresso, Pendente, baixa automatica, Pré Venda, Pedido em Feira, liberado impressao

**Funcionalidades:**
- Salvar pedido
- Adicionar produtos

### Tela: Relatório de Planos Vendidos
- URL: https://allinbrasil.com.br/administracao/Planos/LojaOrderRelatorioAdesoes/listar
- Finalidade: Relatório de adesões/planos vendidos no sistema

**Campos da Tabela:**
- # Compra
- Distribuidor
- Plano
- Data do Pagamento
- Data Últ. Modificação
- Valor

**Funcionalidades:**
- Exportar dados
- Adicionar filtros
- Paginação (20 registros por página)
- Total geral de vendas

**Total de Vendas:** R$ 1.369.886,25
**Total de Registros:** ~1.686 planos vendidos

**Exemplos de Planos Vendidos:**
- Plano Afiliado (R$ 0,00)
- Plano Avanço (R$ 997,00)
- Plano Excelência (R$ 3.980,00)

### Tela: Dashboard (Página Inicial)
- URL: https://allinbrasil.com.br/administracao/PaginaInicialAdministrador/Inicio
- Finalidade: Visão geral com KPIs e indicadores do sistema

**KPIs Principais:**
- Distribuidores Na Rede: 977
- Planos Vendidos: 1.686
- Bônus total recebidos geral - Diretos: R$ 1.439.402,33
- Saldo Loja Online: R$ 15.578,32
- Saldo Perdido: R$ 859.194,75
- Saldo a receber: R$ -2.097,14
- Saldo para Compra: R$ 7.248,24

**Widgets/Gadgets:**
- Últimas Transações (tabela com Conta, Descrição, Data Transação, Valor)
- Últimas Ativações (tabela com N°, Distribuidor, Informações, Data)
- Distribuidores por Planos (gráfico de pizza)
- Faturamento X Bônus (gráfico de linha mensal)
- Últimos Saques (tabela com Distribuidor, Conta, Valor, Status, Data)
- Adesões X Upgrades (gráfico de linha mensal)

**Funcionalidades:**
- Atualização automática de dados
- Links rápidos para telas detalhadas

### Tela: Solicitação de Saque
- URL: https://allinbrasil.com.br/administracao/SolicitacaoSaque/SolicitacaoSaqueTransacoesAdmin/listar
- Finalidade: Gerenciar solicitações de saque de distribuidores

**Campos da Tabela:**
- Nº Saque
- Nº Transação
- Nome
- CPF
- CNPJ
- Status
- Banco
- Tipo Chave PIX
- Chave PIX
- Data Pedido
- Data Apuração
- Valor Solicitado
- Total Taxas
- Valor Depósito
- Dados Aplicativo
- Ações

**Status de Saque:**
- Solicitado
- Depositado
- Estornado
- A depositar
- Transferindo
- Erro Transfêrencia

**Tipos de Chave PIX:**
- CPF ou CNPJ
- número de telefone celular
- chave aleatória
- e-mail

**Funcionalidades:**
- Exportar dados
- Adicionar filtros
- Visualizar detalhes do saque ()
- Depositar (para solicitações pendentes)
- Estornar (para saques depositados)
- Reverter (para saques estornados)
- Paginação (20 registros por página)

**Totais:**
- A depositar: R$ 791,55
- Depositado: R$ 4.561,95
- Estornado: R$ 5.484,04

### Tela: Lançar Qualificação Manual
- URL: https://allinbrasil.com.br/administracao/Qualificacao/QualificacaoManual/relatorio
- Finalidade: Gerenciar qualificações manuais de distribuidores

**Campos da Tabela:**
- N°
- Distribuidor
- Qualificação inserida
- Árvore de Qualificação
- Informações
- Data de lançamento
- Fim da Qualificação
- Qualificação infinita

**Funcionalidades:**
- Exportar dados
- Qualificação Manual em Massa
- Adicionar nova qualificação manual
- Adicionar filtros

**Status:** Nenhum dado encontrado (tela vazia no momento)

### Tela: Gerenciar Ativação Mensal
- URL: https://allinbrasil.com.br/administracao/AtivacaoMensal/AtivacaoMensalTransacoes/listar
- Finalidade: Gerenciar ativações mensais de distribuidores

**Campos da Tabela:**
- Nº
- Distribuidor
- Compra #
- Valor
- Forma de Ativação
- Início do Ciclo
- Fim do Ciclo
- Informações
- Data
- Ações

**Formas de Ativação:**
- Normal
- Plano
- Isento (para plano Afiliado)

**Funcionalidades:**
- Exportar dados
- Adicionar nova ativação
- Adicionar filtros
- Ver log de ativação
- Editar ativação (✏)
- Paginação (20 registros por página)

**Total de Registros:** ~8.860 ativações

**Exemplos de Ativações:**
- Isento de ativação enquanto possuir o plano Plano Afiliado (R$ 0,00)
- Ativo com o pedido #25015 (R$ 997,00)
- Ativo com o pedido #25088 (R$ 2.616,78)

---

## ETAPA 3: DESCUBERTA DE REQUISIÇÕES

### Base URL da API
- **URL Base:** https://allinbrasil.com.br/api/v1
- **Autenticação:** OAuth2 (Bearer Token)
- **Endpoint de Autenticação:** https://allinbrasil.com.br/api/v1/auth/token

### Principais Endpoints de API

#### Autenticação
- **POST** `/api/v1/auth/token` - Obter token de acesso
  - Parâmetros: client_id, client_secret, grant_type (client_credentials ou password)
  - Resposta: access_token, expires_in, token_type

#### Clientes (Distribuidores)
- **GET** `/api/v1/clientes` - Listar clientes
- **POST** `/api/v1/clientes` - Criar cliente
- **PUT** `/api/v1/clientes` - Atualizar cliente
- **POST** `/api/v1/clientes/AtualizarSenha` - Atualizar senha
- **GET** `/api/v1/clientes/Contas` - Listar contas bancárias
- **POST** `/api/v1/clientes/Contas` - Criar conta bancária
- **GET** `/api/v1/clientes/Enderecos` - Listar endereços
- **POST** `/api/v1/clientes/TokenLogin` - Token de login
- **Escopo necessário:** `clientes`

#### Distribuidores
- **GET** `/api/v1/distribuidores` - Listar distribuidores
- **GET** `/api/v1/distribuidores/AtivacoesMensais` - Listar ativações mensais
- **GET** `/api/v1/distribuidores/PlanoAtual` - Obter plano atual
- **GET** `/api/v1/distribuidores/QualificacaoAtual` - Obter qualificação atual
- **GET** `/api/v1/distribuidores/Telefones` - Listar telefones
- **Escopo necessário:** `distribuidores`

#### Pedidos
- **GET** `/api/v1/pedidos` - Listar pedidos
- **POST** `/api/v1/pedidos` - Criar pedido
- **POST** `/api/v1/pedidos/AlterarStatus` - Alterar status do pedido
- **POST** `/api/v1/pedidos/Cancelar` - Cancelar pedido
- **POST** `/api/v1/pedidos/ConfirmarPagamento` - Confirmar pagamento
- **GET** `/api/v1/pedidos/Historico` - Listar histórico
- **POST** `/api/v1/pedidos/Historico` - Adicionar ao histórico
- **GET** `/api/v1/pedidos/Itens` - Listar itens do pedido
- **GET** `/api/v1/pedidos/Itens/KitItens` - Listar itens do kit
- **GET** `/api/v1/pedidos/ItensFaturamento` - Listar itens de faturamento
- **GET** `/api/v1/pedidos/Pagamentos` - Listar pagamentos
- **POST** `/api/v1/pedidos/Pagamentos` - Criar pagamento
- **PUT** `/api/v1/pedidos/Pagamentos` - Atualizar pagamento
- **GET** `/api/v1/pedidos/Totais` - Obter totais
- **GET** `/api/v1/pedidos/Transportes` - Listar transportes
- **Escopo necessário:** `pedidos`

#### Produtos
- **GET** `/api/v1/produtos` - Listar produtos
- **POST** `/api/v1/produtos` - Criar produto
- **PUT** `/api/v1/produtos` - Atualizar produto
- **GET** `/api/v1/produtos/Estoque` - Listar estoque
- **POST** `/api/v1/produtos/Estoque` - Atualizar estoque
- **GET** `/api/v1/produtos/EstoqueTotais` - Listar estoque total
- **GET** `/api/v1/produtos/OpcoesValores` - Listar opções de valores
- **POST** `/api/v1/produtos/OpcoesValores` - Criar opção de valor
- **PUT** `/api/v1/produtos/OpcoesValores` - Atualizar opção de valor
- **DELETE** `/api/v1/produtos/OpcoesValores` - Deletar opção de valor
- **Escopo necessário:** `produtos`

#### Saldos de Pedidos
- **GET** `/api/v1/pedidos-saldos` - Listar saldos de pedidos
- **Escopo necessário:** `pedidos-saldos`

#### Rede Linear
- **GET** `/api/v1/rede-linear-nos` - Listar nós da rede linear
- **Escopo necessário:** `rede-linear-nos`

#### Simulação de Bônus
- **GET** `/api/v1/simulacao-bonus-faturamento` - Simular bônus de faturamento
- **Escopo necessário:** `simulacao-bonus-faturamento`

#### Simulação de Planos
- **GET** `/api/v1/simulacao-planos` - Simular planos
- **Escopo necessário:** `simulacao-planos`

#### Solicitações de Saque
- **GET** `/api/v1/solicitacoes-saque` - Listar solicitações de saque
- **Escopo necessário:** `solicitacoes-saque`

#### Solicitações de Saque CD
- **GET** `/api/v1/solicitacoes-saque-cd` - Listar solicitações de saque CD
- **Escopo necessário:** `solicitacoes-saque-cd`

### Parâmetros Comuns de Query
- `limit` - Máximo de 100 resultados por página
- `page` - Número da página
- `select` - Selecionar campos específicos (separados por vírgula)
- `order_by` - Ordenação (campo.asc ou campo.desc)
- Filtros específicos por campo (ex: `id`, `nome__contem`, `nome__em`)

### Padrões de Filtros
- `campo` - Filtro exato
- `campo__maior_igual` - Valor maior ou igual
- `campo__menor_igual` - Valor menor ou igual
- `campo__contem` - Valor contém
- `campo__em` - Valor em array

---

## ETAPA 4: COMPARAÇÃO COM NOVA PLATAFORMA

### Arquitetura

#### Plataforma Legada (Allin)
- **Tecnologia:** PHP monolítico
- **Banco de Dados:** Não especificado (provavelmente MySQL)
- **Autenticação:** Session-based
- **API:** REST com OAuth2
- **URL Base:** https://allinbrasil.com.br/api/v1
- **Total de Endpoints:** 40+ documentados

#### Nova Plataforma (AllIn-OS2)
- **Tecnologia:** TypeScript/Node.js modular
- **Banco de Dados:** Supabase (PostgreSQL)
- **Autenticação:** Supabase Auth
- **Arquitetura:** Bounded Contexts / Domain-Driven Design
- **Módulos:** 18 módulos implementados
- **Integração:** Sync com API Allin

### Funcionalidades Comparadas

#### Distribuidores

**Legada:**
- Tela: A Rede (Distribuidores)
- 977 distribuidores ativos
- Campos: ID, Usuário, Nome, Email, CPF, CNPJ, Patrocinador, Status, Data Cadastro
- Funcionalidades: Listar, Filtrar, Exportar, Editar, Ativar/Desativar
- API: GET/POST/PUT `/api/v1/clientes`, GET `/api/v1/distribuidores`

**Nova:**
- Módulo: `distributors`
- Repository: `DistributorRepository`
- Campos: id, usuario, nome, email, cpf, cnpj, data_nascimento, cep, cidade, bairro, endereco, complemento, numero, ativo, status, data_cadastro, patrocinador_id, allin_id, allin_synced_at
- Funcionalidades: findByAllinId, findByUsuario, findByEmail
- Sync: Sincronização com API Allin (allin_id, allin_synced_at)
- **Status:** ✅ Implementado com sync

#### Pedidos

**Legada:**
- Tela: Criar Pedido (Compra Manual)
- 1.686 planos vendidos (R$ 1.369.886,25 total)
- Campos: Distribuidor, Grupo de consumo, Status, Produtos, Ativação, Baixa automática
- 13 tipos de grupos de consumo
- 25 status de compra
- API: GET/POST `/api/v1/pedidos`, POST `/api/v1/pedidos/AlterarStatus`, POST `/api/v1/pedidos/Cancelar`, POST `/api/v1/pedidos/ConfirmarPagamento`

**Nova:**
- Módulo: `orders`
- Service: `OrderService`
- Campos: comprador, usuario, valor_total, forma_pagamento, pedido_pago, status, data_criacao_pedido, data_pagamento_pedido, informacoes_produtos, pagamentos, loja, user_id
- Funcionalidades: findAll, findById, create, update, delete, getOrderItems, getStats, getRevenueByPeriod
- Stats: totalOrders, pendingOrders, processingOrders, shippedOrders, deliveredOrders, cancelledOrders, totalRevenue
- **Status:** ✅ Implementado com CRUD completo e stats

#### Produtos

**Legada:**
- Tela: Produtos (erro ao acessar)
- API: GET/POST/PUT `/api/v1/produtos`, GET/POST `/api/v1/produtos/Estoque`, GET `/api/v1/produtos/EstoqueTotais`
- Campos: id, modelo, ncm, preco, e_plano, e_upgrade_plano, e_recompra_plano, e_renovacao_plano, e_ativacao, e_visivel, quantidade, status, estoque_status_id, necessita_frete, peso, dimensões, sku, upc, ean, nome, descricao, categoria_id

**Nova:**
- Módulo: `products`
- Repository: `ProductRepository`
- Service: `ProductService`
- Funcionalidades: CRUD completo
- **Status:** ✅ Implementado

#### Planos

**Legada:**
- Tela: Planos (Adesões)
- 3 planos principais: Afiliado (R$ 0), Avanço (R$ 997), Excelência (R$ 3.980)
- Campos: ID, Nome, Valor, Status, Tipo
- API: Não documentada especificamente para planos

**Nova:**
- Módulo: `plans`
- Service: `PlanService`
- Funcionalidades: findAll, findById, findBySlug, create, update, delete, getPlanBonuses, createPlanBonus, deletePlanBonus, activateCustomerPlan, deactivateCustomerPlan, getCustomerPlans, getActiveCustomerPlan, getPlanStats, getAllPlanStats
- Bônus de planos: PlanBonusRepository
- Ativação de planos de clientes: CustomerPlanRepository
- **Status:** ✅ Implementado com ativação de planos e bônus

#### Bônus/Comissões

**Legada:**
- Tela: Bônus Instalados
- 4 bônus ativos:
  1. Bônus de Loja Online Acumulado (ID: 7, BonusLinearV4)
  2. Bônus total recebidos geral - Diretos (ID: 4, BonusLinearV4)
  3. Bônus de Qualificação Mensal (ID: 8, BonusQualificacaoMensalV3)
  4. Total de Bônus Recebidos - Indiretos (ID: 6, BonusLinearV4)
- API: GET `/api/v1/simulacao-bonus-faturamento`

**Nova:**
- Módulo: `commissions`
- Service: `CommissionService`
- Funcionalidades:
  - calculateDirectCommission (10% padrão)
  - calculateIndirectCommission (5 níveis: 5%, 3%, 2%, 1%, 0.5%)
  - processOrderCommissions
  - approvePendingCommissions
  - markCommissionsAsPaid
  - getCustomerCommissions
  - getPendingCommissionTotal
- Tipos: direct, indirect
- Status: pending, approved, paid
- **Status:** ✅ Implementado com cálculo de comissões diretas e indiretas

#### Ativação Mensal

**Legada:**
- Tela: Gerenciar Ativação Mensal
- ~8.860 ativações mensais
- Campos: Nº, Distribuidor, Compra #, Valor, Forma de Ativação, Início do Ciclo, Fim do Ciclo, Informações, Data
- Formas de Ativação: Normal, Plano, Isento (para plano Afiliado)
- API: GET `/api/v1/distribuidores/AtivacoesMensais`

**Nova:**
- Módulo: `plans`
- Funcionalidade: activateCustomerPlan, deactivateCustomerPlan, getActiveCustomerPlan
- **Status:** ✅ Implementado como parte do módulo de planos

#### Solicitação de Saque

**Legada:**
- Tela: Solicitação de Saque
- Totais: A depositar (R$ 791,55), Depositado (R$ 4.561,95), Estornado (R$ 5.484,04)
- Campos: Nº Saque, Nº Transação, Nome, CPF, CNPJ, Status, Banco, Tipo Chave PIX, Chave PIX, Data Pedido, Data Apuração, Valor Solicitado, Total Taxas, Valor Depósito
- Status: Solicitado, Depositado, Estornado, A depositar, Transferindo, Erro Transfêrencia
- Tipos de Chave PIX: CPF ou CNPJ, número de telefone celular, chave aleatória, e-mail
- API: GET `/api/v1/solicitacoes-saque`, GET `/api/v1/solicitacoes-saque-cd`

**Nova:**
- Módulo: `finance`
- Services: WithdrawalService, BalanceService, BankAccountService
- Domain Services: WithdrawalValidationDomainService, BalanceCalculationDomainService, LimitCalculationDomainService
- Funcionalidades: Validação de saques, cálculo de saldos, cálculo de limites
- **Status:** ✅ Implementado com domain services

#### Qualificação

**Legada:**
- Tela: Lançar Qualificação Manual
- Campos: N°, Distribuidor, Qualificação inserida, Árvore de Qualificação, Informações, Data de lançamento, Fim da Qualificação, Qualificação infinita
- Funcionalidades: Exportar, Qualificação Manual em Massa, Adicionar nova qualificação manual
- API: GET `/api/v1/distribuidores/QualificacaoAtual`

**Nova:**
- Módulo: `qualifications`
- Repository: `QualificationRepository`
- DTOs: CreateQualificationDTO, UpdateQualificationDTO, QualificationResponseDTO, QualificationHistoryResponseDTO
- **Status:** ✅ Implementado

#### Rede Linear

**Legada:**
- Tela: A Rede (Distribuidores)
- API: GET `/api/v1/rede-linear-nos`
- Funcionalidades: Listar downlines, listar uplines

**Nova:**
- Módulo: `network`
- Service: `NetworkService`
- Funcionalidades: getNetworkTree, getDownlines, getUpline, getNetworkStats, countDownlines
- Repository: `NetworkRepository`
- DTOs: NetworkTree, DownlineNode, UplineNode, NetworkStats
- **Status:** ✅ Implementado

#### Dashboard

**Legada:**
- Tela: Dashboard (Página Inicial)
- KPIs: Distribuidores Na Rede (977), Planos Vendidos (1.686), Bônus total recebidos geral - Diretos (R$ 1.439.402,33), Saldo Loja Online (R$ 15.578,32), Saldo Perdido (R$ 859.194,75), Saldo a receber (R$ -2.097,14), Saldo para Compra (R$ 7.248,24)
- Widgets: Últimas Transações, Últimas Ativações, Distribuidores por Planos (gráfico), Faturamento X Bônus (gráfico), Últimos Saques, Adesões X Upgrades (gráfico)

**Nova:**
- Módulo: `analytics`
- **Status:** ✅ Implementado

### Módulos Implementados na Nova Plataforma

1. **analytics** - Análises e métricas
2. **auth** - Autenticação
3. **commissions** - Cálculo de comissões
4. **copilot** - Assistente de IA
5. **customers** - Gestão de clientes
6. **distributors** - Gestão de distribuidores (com sync Allin)
7. **embeddings** - Embeddings para busca
8. **finance** - Financeiro (saques, saldos, contas bancárias)
9. **logistics** - Logística
10. **mlm** - Lógica de MLM (domain services)
11. **network** - Rede linear (downlines, uplines)
12. **orders** - Pedidos (CRUD, stats, revenue)
13. **payments** - Pagamentos (30 arquivos)
14. **plans** - Planos (ativação, bônus)
15. **products** - Produtos
16. **profiles** - Perfis
17. **qualifications** - Qualificações

### Funcionalidades Ausentes na Nova Plataforma

1. **Campos para Pedidos Personalizados** - Tela legada permite criar campos personalizados para pedidos
2. **Estoque** - Módulo de estoque não identificado na nova plataforma
3. **Transportadoras** - Módulo de transportadoras não identificado
4. **Formas de Frete** - Módulo de formas de frete não identificado
5. **Formas de Pagamento** - Módulo de formas de pagamento não identificado (embora payments tenha 30 arquivos)
6. **Lojas** - Módulo de lojas não identificado
7. **Website** - Módulo de website não identificado
8. **Marketing** - Módulo de marketing não identificado
9. **Treinamento Maxnível** - Integração com EAD não identificada
10. **Alterar Usuário/Patrocinador** - Ferramentas administrativas não identificadas
11. **Habilitar Produtos Lojas** - Ferramenta não identificada
12. **Estoque** - Ferramenta de estoque não identificada
13. **Movimentar Saldo CD** - Ferramenta de Centro de Distribuição não identificada

### Diferenças de Arquitetura

**Legada:**
- Monolítico PHP
- Session-based authentication
- API REST separada
- Dashboard com widgets complexos
- Sistema de bônus configurável via UI
- Relatórios extensos

**Nova:**
- Modular TypeScript/Node.js
- Supabase Auth
- Domain-Driven Design
- Bounded Contexts
- Domain Services para lógica complexa
- Sync com API Allin
- Arquitetura mais escalável

### Conclusão da Comparação

A nova plataforma tem uma arquitetura mais moderna e escalável, com a maioria das funcionalidades core implementadas. Os principais módulos (distribuidores, pedidos, produtos, planos, comissões, finance, network, qualifications) estão implementados. 

**Principais Gaps:**
- Funcionalidades administrativas específicas (alterar usuário/patrocinador)
- Ferramentas de estoque e logística
- Integração com EAD (Treinamento Maxnível)
- Sistema de lojas virtuais
- Marketing
- Website

**Pontos Fortes da Nova Plataforma:**
- Arquitetura modular e escalável
- Domain Services para lógica complexa
- Sync com API Allin
- Cálculo de comissões automatizado
- Domain-driven design

---

## ETAPA 5: PLANO DE AÇÃO

### Prioridades de Implementação

#### Prioridade 1: Finalizar Módulos Core (Crítico)

**1.1 Completar Sync com API Allin**
- Implementar sync completo de distribuidores
- Implementar sync de pedidos
- Implementar sync de produtos
- Implementar sync de planos
- Implementar sync de qualificações
- Implementar sync de ativações mensais
- Implementar sync de saques
- **Responsável:** Backend Team
- **Estimativa:** 2-3 semanas
- **Dependências:** Credenciais API Allin, documentação completa

**1.2 Implementar Dashboard Completo**
- KPIs principais (Distribuidores, Planos Vendidos, Bônus, Saldos)
- Widgets de transações recentes
- Gráficos de distribuidores por planos
- Gráficos de faturamento X bônus
- Gráficos de adesões X upgrades
- Últimos saques
- **Responsável:** Frontend + Backend Teams
- **Estimativa:** 1-2 semanas
- **Dependências:** Analytics module, dados sync

**1.3 Implementar Ferramentas Administrativas**
- Alterar usuário/patrocinador
- Habilitar produtos lojas
- Gerenciar estoque
- Movimentar saldo CD
- **Responsável:** Backend Team
- **Estimativa:** 1-2 semanas
- **Dependências:** Admin UI, permissões

#### Prioridade 2: Módulos de Logística (Alto)

**2.1 Implementar Módulo de Estoque**
- CRUD de estoque
- Gestão de movimentações
- Alertas de estoque baixo
- Integração com pedidos
- **Responsável:** Backend Team
- **Estimativa:** 1-2 semanas
- **Dependências:** Products module

**2.2 Implementar Módulo de Transportadoras**
- CRUD de transportadoras
- Integração com pedidos
- Cálculo de frete
- Rastreamento de entregas
- **Responsável:** Backend Team
- **Estimativa:** 1-2 semanas
- **Dependências:** Orders module

**2.3 Implementar Módulo de Formas de Frete**
- CRUD de formas de frete
- Integração com transportadoras
- Cálculo de frete por região
- **Responsável:** Backend Team
- **Estimativa:** 1 semana
- **Dependências:** Transportadoras module

**2.4 Implementar Módulo de Formas de Pagamento**
- CRUD de formas de pagamento
- Integração com gateways
- Status de pagamento
- **Responsável:** Backend Team
- **Estimativa:** 1-2 semanas
- **Dependências:** Payments module (já existe parcialmente)

#### Prioridade 3: Módulos de E-commerce (Médio)

**3.1 Implementar Módulo de Lojas Virtuais**
- CRUD de lojas
- Integração com produtos
- Gestão de catálogo
- **Responsável:** Backend Team
- **Estimativa:** 2-3 semanas
- **Dependências:** Products, Orders modules

**3.2 Implementar Módulo de Campos Personalizados para Pedidos**
- CRUD de campos personalizados
- Integração com pedidos
- Validação de campos
- **Responsável:** Backend Team
- **Estimativa:** 1-2 semanas
- **Dependências:** Orders module

**3.3 Implementar Módulo de Website**
- Gestão de conteúdo
- Páginas personalizáveis
- SEO básico
- **Responsável:** Frontend + Backend Teams
- **Estimativa:** 3-4 semanas
- **Dependências:** CMS

#### Prioridade 4: Integrações e Marketing (Baixo)

**4.1 Implementar Integração com EAD (Treinamento Maxnível)**
- Sync de usuários
- Sync de cursos
- Sync de progresso
- **Responsável:** Backend Team
- **Estimativa:** 2-3 semanas
- **Dependências:** API EAD

**4.2 Implementar Módulo de Marketing**
- Campanhas de email
- Notificações
- Automations
- **Responsável:** Backend Team
- **Estimativa:** 2-3 semanas
- **Dependências:** Email service, notification service

### Recomendações Técnicas

**1. Continuar com Arquitetura Modular**
- Manter bounded contexts
- Usar domain services para lógica complexa
- Manter sync com API Allin

**2. Implementar Testes**
- Unit tests para domain services
- Integration tests para sync com API Allin
- E2E tests para fluxos principais

**3. Implementar Monitoramento**
- Logs de sync com API Allin
- Métricas de performance
- Alertas de erros

**4. Implementar Documentação**
- API documentation (OpenAPI/Swagger)
- Architecture decision records (ADRs)
- Developer guides

### Plano de Migração

**Fase 1: Preparação (1-2 semanas)**
- Configurar credenciais API Allin
- Implementar estrutura de sync
- Criar tabelas necessárias no Supabase
- Implementar autenticação

**Fase 2: Sync Inicial (2-3 semanas)**
- Sync de distribuidores
- Sync de produtos
- Sync de planos
- Sync de pedidos
- Sync de qualificações
- Sync de ativações mensais
- Sync de saques

**Fase 3: Implementação Core (3-4 semanas)**
- Dashboard completo
- Ferramentas administrativas
- Validação de dados
- Testes

**Fase 4: Implementação Secundária (4-6 semanas)**
- Módulos de logística
- Módulos de e-commerce
- Integrações

**Fase 5: Testes e Homologação (2-3 semanas)**
- Testes de carga
- Testes de integração
- Homologação com usuários
- Correções

**Fase 6: Go-Live (1 semana)**
- Migração de dados final
- Treinamento de usuários
- Monitoramento intensivo

**Total Estimado:** 13-19 semanas (3-5 meses)

### Riscos e Mitigações

**Risco 1: API Allin pode ter limitações ou mudanças**
- **Mitigação:** Documentar todos os endpoints usados, implementar cache, monitorar mudanças na API

**Risco 2: Sync de dados pode ter inconsistências**
- **Mitigação:** Implementar validações, logs detalhados, mecanismo de retry

**Risco 3: Performance pode ser afetada com volume de dados**
- **Mitigação:** Implementar paginação, cache, otimizações de queries

**Risco 4: Usuários podem resistir à mudança**
- **Mitigação:** Treinamento, suporte intensivo, paralelo de sistemas por período

**Risco 5: Funcionalidades legadas podem não ter equivalente na API**
- **Mitigação:** Implementar workarounds, considerar manter legado para funcionalidades específicas

### Próximos Passos Imediatos

1. **Configurar Credenciais API Allin**
   - Obter appId e appSecret
   - Definir escopos necessários
   - Testar autenticação

2. **Implementar Estrutura de Sync**
   - Criar base service para sync
   - Implementar retry logic
   - Implementar error handling
   - Implementar logging

3. **Criar Tabelas Necessárias no Supabase**
   - Revisar migrations existentes
   - Criar migrations adicionais
   - Implementar RLS policies

4. **Implementar Sync de Distribuidores**
   - GET /api/v1/distribuidores
   - Mapeamento de campos
   - Implementar sync incremental
   - Testar com dados reais

5. **Implementar Dashboard Básico**
   - KPIs principais
   - Widgets simples
   - Testar com dados sync

### Métricas de Sucesso

**Métricas Técnicas:**
- 100% de distribuidores sync
- 100% de pedidos sync
- 100% de produtos sync
- 0% de dados inconsistentes
- Tempo de sync < 5 minutos

**Métricas de Negócio:**
- 100% de funcionalidades core implementadas
- 90% de funcionalidades secundárias implementadas
- 95% de satisfação dos usuários
- 0% de perda de dados
- 100% de uptime

### Conclusão

A nova plataforma AllIn-OS2 tem uma arquitetura sólida e moderna, com a maioria das funcionalidades core implementadas. O plano de ação foca em:

1. **Finalizar sync com API Allin** - Prioridade crítica para garantir consistência de dados
2. **Implementar dashboard completo** - Prioridade para visibilidade do negócio
3. **Implementar ferramentas administrativas** - Prioridade para gestão do sistema
4. **Implementar módulos de logística** - Prioridade alta para operações
5. **Implementar módulos de e-commerce** - Prioridade média para crescimento
6. **Implementar integrações e marketing** - Prioridade baixa para expansão

O tempo estimado para implementação completa é de 3-5 meses, com fases bem definidas e riscos mitigados.

---

## SUBSISTEMA DE GESTÃO DA LOJA VIRTUAL

### URL de Acesso
- **URL:** https://allinbrasil.com.br/loja/admin/common/dashboard
- **Autenticação:** Token-based (URL parameter: token)

### Dashboard

**KPIs Principais:**
- Total de pedidos: 24.7K
- Valor total de vendas: R$ 30.20M
- Total de clientes: 2.6K

**Gráficos:**
- Mapa do Mundo
- Gráfico de Vendas (Pedidos e Clientes por dia)

**Últimos Pedidos:**
- Tabela com os 5 pedidos mais recentes
- Campos: Pedido Nº, Cliente, Situação, Data, Total, Ação

### Menu Principal

**1. Dashboard ()**
- URL: /loja/admin/common/dashboard
- KPIs e gráficos de vendas

**2. Catálogo ()**
- Departamentos
- Produtos
- Kit de Produtos
- Atributos (com submenu)
- Opções
- Fabricantes
- Páginas de informações
- Comentários
- Estoque

**3. Vendas ()**
- Pedidos
- Carrinhos Abandonados
- Devoluções
- Clientes (com submenu)

**4. Financeiro ()**
- Formas de Pagamentos

**5. Configurações ()**
- Lojas/CDs
- Usuários

**6. Exportação ()**
- Exportação de dados

**7. Relatórios ()**
- Relatórios diversos

### Funcionalidades Detalhadas

#### Produtos

**URL:** /loja/admin/catalog/product

**Funcionalidades:**
- Exportar dados
- Importar por planilha
- Lixeira
- Novo produto
- Duplicar produto
- Excluir produto
- Adicionar filtros

**Campos da Tabela:**
- ID
- SKU
- Imagem
- Produto
- Modelo
- Categorias
- Pontos
- Preço
- Quantidade (com link para estoque)
- Produto Destacado
- Situação
- CD/Loja que cadastrou
- Status moderação
- Ações (editar)

**Exemplo de Produtos:**
- ALL CLASSIC ALL BLACK - R$ 489,00 - Estoque: 92
- FOLDERS KIT - R$ 120,00 - Estoque: 83
- CASUALL BLACK - R$ 469,00 - Estoque: 49

#### Pedidos

**URL:** /loja/admin/sale/order

**Funcionalidades:**
- Logs
- Imprimir comandas em massa
- Imprimir faturas em massa
- Novo pedido
- Lixeira (pedidos cancelados)
- Adicionar filtros

**Campos da Tabela:**
- Nº
- Primeiro Nome
- Valor
- Forma de pagamento
- Status
- Pago
- Ações

**Informações Adicionais:**
- Distribuidor
- Tipo de Cliente (Distribuidor - Comprando ativação ou Clientes Finais)
- Patrocinador
- Data Criação
- Data Pagamento

**Status de Pedido:**
- Pedido Realizado
- Processando Pedido
- Pedido enviado para cliente

**Formas de Pagamento:**
- Boleto 20 dias
- Boleto 7 dias com desconto de 5%
- Pagseguro Pix (Pix)

**Ações por Pedido:**
- Ver detalhes ()
- Fazer pedido ()
- Cancelar pedido ()
- Imprimir fatura ()
- Outras ações (, , )

#### Clientes

**URL:** /loja/admin/sale/customer

**Funcionalidades:**
- Novo cliente
- Exportar dados
- Adicionar filtros

**Campos da Tabela:**
- Id
- Cliente
- E-mail
- Telefones
- Tipo de cliente (distribuidor ou cliente_final)
- Distribuidor
- Situação
- Aprovado
- Cadastro
- Ações (editar)

**Tipos de Cliente:**
- distribuidor
- cliente_final

#### Formas de Pagamento

**URL:** /loja/admin/extension/payment

**Formas Configuradas:**
1. Pagamento Pix múltiplo () - Habilitado - Posição 4
2. Usar Bônus para pagamento do pedido. () - Habilitado - Posição 3
3. Pagamento com bônus do CD () - Habilitado
4. Boleto 20 dias () - Habilitado - Posição 1
5. Boleto 7 dias com desconto de 5% () - Habilitado
6. Pagseguro Pix - Configuração Autenticada - Posição 2
7. Cartão de crédito - Configuração Autenticada - Posição 1
8. Asaas - Configuração Não Autenticada

**Formas Desabilitadas:**
- Cielo Checkout

**Formas Não Configuradas:**
- Braspag
- Mercado Pago
- Cielo Recorrente
- Cielo Transparente
- Gerencianet
- ZSPay
- Getnet Transparente
- HopyPay
- Wiza(África)
- PagBank

**Ações por Forma de Pagamento:**
- Autodone ()
- Permissão ()
- Editar ()
- Campos ()
- Excluir ()
- Instalar ()
- Configurar ()

#### Lojas/CDs

**URL:** /loja/admin/setting/store

**Loja Padrão:**
- All-in life style (Padrão)
- URL: https://allinbrasil.com.br/loja/
- Configurar: /loja/admin/setting/setting

**Funcionalidades:**
- Exportar dados
- Adicionar loja/CD
- Usuários
- Adicionar filtros
- Vincular todos os produtos a uma loja virtual

**Campos da Tabela:**
- ID
- Loja/CD
- Proprietário
- Distribuidor
- E-mail
- Telefone
- Patrocinador
- Situação
- Tipo
- Habilitada
- Ações (editar, remover)

**Centros de Distribuição Cadastrados:**
1. Cd Cuiabá - Anna Maria - cdcuiaba@teste.com - (67) 8899-5555 - Aprovado - Não habilitada
2. CD Goiânia - Anna Maria - cdgyn@teste.com - (62) 5588-9999 - Aprovado - Não habilitada
3. Demais estados - junior - junior@allinbrasil.com - (51) 99312-0715 - Em avaliação - Não habilitada
4. São Paulo - Aprovado - Não habilitada
5. São Paulo - Aprovado - Não habilitada
6. São Paulo - Aprovado - Não habilitada

**Situação:**
- Aprovado
- Em avaliação

**Tipo:**
- Centro de distribuição

### Submenus Identificados

#### Menu Vendas
- Pedidos
- Carrinhos Abandonados
- Devoluções
- Clientes

#### Menu Catálogo
- Departamentos
- Produtos
- Kit de Produtos
- Atributos
- Opções
- Fabricantes
- Páginas de informações
- Comentários
- Estoque

### Diferenças entre Sistema Administrativo e Loja Virtual

**Sistema Administrativo (https://allinbrasil.com.br/administracao/):**
- Focado em gestão MLM
- Distribuidores, Planos, Bônus, Qualificações, Rede Linear
- Sistema de ativação mensal
- Solicitações de saque
- Dashboard com KPIs MLM

**Loja Virtual (https://allinbrasil.com.br/loja/admin/):**
- Focado em e-commerce
- Produtos, Pedidos, Clientes, Formas de Pagamento
- Centros de Distribuição (CDs)
- Carrinhos abandonados
- Devoluções
- Dashboard com KPIs de vendas

### Integração entre Sistemas

**Pontos de Integração:**
- Clientes da loja virtual podem ser distribuidores do sistema MLM
- Pedidos da loja virtual podem gerar ativações de planos
- Formas de pagamento incluem uso de bônus do sistema MLM
- Vinculação de produtos a lojas virtuais

**Link Identificado:**
- "Clique aqui" para vincular todos os produtos a uma loja virtual de uma só vez
- URL: https://allinbrasil.com.br/administracao/Loja/HabilitarProdutosLoja

---

## ETAPA 5 ATUALIZADA: PLANO DE AÇÃO COM LOJA VIRTUAL

### Prioridades de Implementação Atualizadas

#### Prioridade 1: Finalizar Módulos Core (Crítico)

**1.1 Completar Sync com API Allin**
- Implementar sync completo de distribuidores
- Implementar sync de pedidos (incluindo pedidos da loja virtual)
- Implementar sync de produtos
- Implementar sync de planos
- Implementar sync de qualificações
- Implementar sync de ativações mensais
- Implementar sync de saques
- **Responsável:** Backend Team
- **Estimativa:** 2-3 semanas
- **Dependências:** Credenciais API Allin, documentação completa

**1.2 Implementar Dashboard Completo**
- KPIs principais (Distribuidores, Planos Vendidos, Bônus, Saldos)
- KPIs de E-commerce (Pedidos, Vendas, Clientes)
- Widgets de transações recentes
- Gráficos de distribuidores por planos
- Gráficos de faturamento X bônus
- Gráficos de adesões X upgrades
- Gráficos de vendas por dia (Pedidos e Clientes)
- Últimos saques
- Últimos pedidos da loja virtual
- **Responsável:** Frontend + Backend Teams
- **Estimativa:** 2-3 semanas
- **Dependências:** Analytics module, dados sync

**1.3 Implementar Ferramentas Administrativas**
- Alterar usuário/patrocinador
- Habilitar produtos lojas
- Gerenciar estoque
- Movimentar saldo CD
- **Responsável:** Backend Team
- **Estimativa:** 1-2 semanas
- **Dependências:** Admin UI, permissões

#### Prioridade 2: Módulos de E-commerce (Alto)

**2.1 Implementar Módulo de Produtos**
- CRUD de produtos
- Campos: ID, SKU, Imagem, Produto, Modelo, Categorias, Pontos, Preço, Quantidade, Produto Destacado, Situação, CD/Loja que cadastrou, Status moderação
- Funcionalidades: Exportar, Importar por planilha, Lixeira, Novo, Duplicar, Excluir
- Gestão de estoque por produto
- Moderação de produtos
- **Responsável:** Backend Team
- **Estimativa:** 2-3 semanas
- **Dependências:** Products module (já existe parcialmente)

**2.2 Implementar Módulo de Pedidos**
- CRUD de pedidos
- Campos: Nº, Cliente, Valor, Forma de pagamento, Status, Pago, Distribuidor, Tipo de Cliente, Patrocinador, Data Criação, Data Pagamento
- Status: Pedido Realizado, Processando Pedido, Pedido enviado para cliente
- Funcionalidades: Logs, Imprimir comandas em massa, Imprimir faturas em massa, Novo, Lixeira
- Integração com distribuidores e planos
- **Responsável:** Backend Team
- **Estimativa:** 2-3 semanas
- **Dependências:** Orders module (já existe parcialmente)

**2.3 Implementar Módulo de Clientes**
- CRUD de clientes
- Campos: Id, Cliente, E-mail, Telefones, Tipo de cliente (distribuidor ou cliente_final), Distribuidor, Situação, Aprovado, Cadastro
- Tipos de cliente: distribuidor, cliente_final
- Integração com distribuidores do sistema MLM
- **Responsável:** Backend Team
- **Estimativa:** 1-2 semanas
- **Dependências:** Customers module

**2.4 Implementar Módulo de Formas de Pagamento**
- CRUD de formas de pagamento
- Formas configuradas: Pix, Bônus, Bônus CD, Boleto 20 dias, Boleto 7 dias, Pagseguro Pix, Cartão de crédito, Asaas
- Integração com gateways: Pagseguro, Cielo, Asaas, etc.
- Permissões por forma de pagamento
- Campos personalizados por forma de pagamento
- **Responsável:** Backend Team
- **Estimativa:** 2-3 semanas
- **Dependências:** Payments module (já existe parcialmente)

**2.5 Implementar Módulo de Lojas/CDs**
- CRUD de lojas/CDs
- Campos: ID, Loja/CD, Proprietário, Distribuidor, E-mail, Telefone, Patrocinador, Situação, Tipo, Habilitada
- Tipos: Loja Virtual, Centro de Distribuição
- Situação: Aprovado, Em avaliação
- Funcionalidades: Exportar, Adicionar, Usuários, Vincular produtos
- **Responsável:** Backend Team
- **Estimativa:** 2-3 semanas
- **Dependências:** Stores module

**2.6 Implementar Módulo de Carrinhos Abandonados**
- Relatório de carrinhos abandonados
- Recuperação de carrinhos
- Notificações para clientes
- **Responsável:** Backend Team
- **Estimativa:** 1-2 semanas
- **Dependências:** Orders module

**2.7 Implementar Módulo de Devoluções**
- CRUD de devoluções
- Workflow de aprovação
- Reembolso automático
- **Responsável:** Backend Team
- **Estimativa:** 1-2 semanas
- **Dependências:** Orders module

#### Prioridade 3: Módulos de Logística (Médio)

**3.1 Implementar Módulo de Estoque**
- CRUD de estoque
- Gestão de movimentações
- Alertas de estoque baixo
- Integração com pedidos
- Estoque por loja/CD
- **Responsável:** Backend Team
- **Estimativa:** 1-2 semanas
- **Dependências:** Products module

**3.2 Implementar Módulo de Transportadoras**
- CRUD de transportadoras
- Integração com pedidos
- Cálculo de frete
- Rastreamento de entregas
- **Responsável:** Backend Team
- **Estimativa:** 1-2 semanas
- **Dependências:** Orders module

**3.3 Implementar Módulo de Formas de Frete**
- CRUD de formas de frete
- Integração com transportadoras
- Cálculo de frete por região
- **Responsável:** Backend Team
- **Estimativa:** 1 semana
- **Dependências:** Transportadoras module

#### Prioridade 4: Módulos de Catálogo (Médio)

**4.1 Implementar Módulo de Departamentos**
- CRUD de departamentos
- Hierarquia de categorias
- **Responsável:** Backend Team
- **Estimativa:** 1 semana
- **Dependências:** Products module

**4.2 Implementar Módulo de Kit de Produtos**
- CRUD de kits
- Agrupamento de produtos
- Preço especial para kits
- **Responsável:** Backend Team
- **Estimativa:** 1-2 semanas
- **Dependências:** Products module

**4.3 Implementar Módulo de Atributos**
- CRUD de atributos
- Valores de atributos
- Variações de produtos
- **Responsável:** Backend Team
- **Estimativa:** 1-2 semanas
- **Dependências:** Products module

**4.4 Implementar Módulo de Opções**
- CRUD de opções
- Opções de produtos (tamanho, cor, etc.)
- **Responsável:** Backend Team
- **Estimativa:** 1 semana
- **Dependências:** Products module

**4.5 Implementar Módulo de Fabricantes**
- CRUD de fabricantes
- **Responsável:** Backend Team
- **Estimativa:** 1 semana
- **Dependências:** Products module

**4.6 Implementar Módulo de Páginas de Informações**
- CRUD de páginas
- Conteúdo estático (sobre, termos, etc.)
- **Responsável:** Backend Team
- **Estimativa:** 1 semana
- **Dependências:** CMS

**4.7 Implementar Módulo de Comentários**
- CRUD de comentários/reviews
- Moderação de comentários
- **Responsável:** Backend Team
- **Estimativa:** 1 semana
- **Dependências:** Products module

#### Prioridade 5: Integrações e Marketing (Baixo)

**5.1 Implementar Integração com EAD (Treinamento Maxnível)**
- Sync de usuários
- Sync de cursos
- Sync de progresso
- **Responsável:** Backend Team
- **Estimativa:** 2-3 semanas
- **Dependências:** API EAD

**5.2 Implementar Módulo de Marketing**
- Campanhas de email
- Notificações
- Automations
- **Responsável:** Backend Team
- **Estimativa:** 2-3 semanas
- **Dependências:** Email service, notification service

**5.3 Implementar Módulo de Exportação**
- Exportação de dados
- Formatos: CSV, Excel, PDF
- **Responsável:** Backend Team
- **Estimativa:** 1 semana
- **Dependências:** Todos os módulos

**5.4 Implementar Módulo de Relatórios**
- Relatórios de vendas
- Relatórios de produtos
- Relatórios de clientes
- Relatórios de estoque
- **Responsável:** Backend Team
- **Estimativa:** 2-3 semanas
- **Dependências:** Todos os módulos

### Integração entre Sistema MLM e Loja Virtual

**Pontos de Integração:**
1. **Clientes da Loja Virtual podem ser Distribuidores**
   - Campo "Tipo de cliente": distribuidor ou cliente_final
   - Campo "Distribuidor": vinculação com sistema MLM
   - Campo "Patrocinador": vinculação com rede MLM

2. **Pedidos da Loja Virtual podem gerar Ativações de Planos**
   - Tipo de cliente: "Distribuidor - Comprando ativação"
   - Detecção automática de pedidos de ativação
   - Criação de ativação de plano no sistema MLM

3. **Formas de Pagamento incluem Uso de Bônus**
   - "Usar Bônus para pagamento do pedido"
   - "Pagamento com bônus do CD"
   - Integração com saldo de bônus do sistema MLM

4. **Vinculação de Produtos a Lojas Virtuais**
   - Campo "CD/Loja que cadastrou"
   - Funcionalidade de vincular produtos a lojas
   - Estoque por loja/CD

### Plano de Migração Atualizado

**Estado Atual do Projeto:**
- ✅ 56 migrations criadas no Supabase (tabelas, RLS policies, indexes, soft delete, allin_id)
- ✅ 16 módulos backend criados (analytics, auth, commissions, customers, distributors, finance, logistics, mlm, network, orders, payments, plans, products, profiles, qualifications)
- ✅ Estrutura de schemas separados (crm, mlm, commerce, logistics, finance, system)
- ✅ Soft delete implementado
- ✅ Campos allin_id adicionados para sync

**Fase 1: Configuração API Allin (1 semana)**
- Configurar credenciais API Allin (appId, appSecret)
- Definir escopos necessários
- Testar autenticação OAuth2
- Documentar endpoints necessários
- **Status:** Pendente

**Fase 2: Implementação Sync com API Allin (2-3 semanas)**
- Implementar base service para sync
- Implementar retry logic e error handling
- Implementar logging detalhado
- Sync de distribuidores (GET /api/v1/distribuidores)
- Sync de produtos (GET /api/v1/produtos)
- Sync de planos (GET /api/v1/planos)
- Sync de pedidos (GET /api/v1/pedidos)
- Sync de clientes (GET /api/v1/clientes)
- Sync de qualificações
- Sync de ativações mensais
- Sync de saques
- Sync de lojas/CDs
- **Status:** Pendente

**Fase 3: Implementação Módulos Core E-commerce (3-4 semanas)**
- Completar Módulo de Produtos (CRUD completo, import/export, moderação)
- Completar Módulo de Pedidos (CRUD completo, logs, impressão, integração MLM)
- Completar Módulo de Clientes (CRUD completo, tipos de cliente, integração MLM)
- Completar Módulo de Formas de Pagamento (gateways, permissões, campos personalizados)
- Completar Módulo de Lojas/CDs (CRUD completo, vinculação de produtos)
- **Status:** Parcialmente implementado (estrutura criada)

**Fase 4: Implementação Dashboard Completo (2-3 semanas)**
- KPIs MLM (Distribuidores, Planos Vendidos, Bônus, Saldos)
- KPIs E-commerce (Pedidos, Vendas, Clientes)
- Widgets de transações recentes
- Gráficos de distribuidores por planos
- Gráficos de faturamento X bônus
- Gráficos de adesões X upgrades
- Gráficos de vendas por dia (Pedidos e Clientes)
- Últimos saques
- Últimos pedidos da loja virtual
- **Status:** Pendente

**Fase 5: Implementação Módulos Secundários E-commerce (2-3 semanas)**
- Módulo de Carrinhos Abandonados (relatório, recuperação, notificações)
- Módulo de Devoluções (CRUD, workflow, reembolso)
- Módulo de Estoque (CRUD, movimentações, alertas, estoque por loja)
- Módulo de Catálogo (Departamentos, Kits, Atributos, Opções, Fabricantes, Páginas, Comentários)
- **Status:** Parcialmente implementado (estrutura criada)

**Fase 6: Implementação Módulos Logística (1-2 semanas)**
- Completar Módulo de Transportadoras (CRUD, cálculo de frete, rastreamento)
- Completar Módulo de Formas de Frete (CRUD, integração com transportadoras)
- **Status:** Parcialmente implementado (estrutura criada)

**Fase 7: Implementação Ferramentas Administrativas (1-2 semanas)**
- Ferramentas administrativas MLM (alterar usuário/patrocinador, habilitar produtos lojas)
- Ferramentas administrativas E-commerce (gerenciar estoque, movimentar saldo CD)
- Módulo de Exportação (CSV, Excel, PDF)
- Módulo de Relatórios (vendas, produtos, clientes, estoque)
- **Status:** Pendente

**Fase 8: Testes e Homologação (2-3 semanas)**
- Unit tests para domain services
- Integration tests para sync com API Allin
- E2E tests para fluxos principais
- Testes de carga
- Testes de integração MLM + E-commerce
- Homologação com usuários
- Correções
- **Status:** Pendente

**Fase 9: Go-Live (1 semana)**
- Migração de dados final
- Treinamento de usuários
- Monitoramento intensivo
- **Status:** Pendente

**Total Estimado:** 13-19 semanas (3-5 meses)

**Redução de Tempo:** Devido à estrutura já criada (migrations, módulos, schemas), o tempo estimado foi reduzido de 16-23 semanas para 13-19 semanas.

### Riscos e Mitigações Atualizados

**Risco 1: API Allin pode ter limitações ou mudanças**
- **Mitigação:** Documentar todos os endpoints usados, implementar cache, monitorar mudanças na API

**Risco 2: Sync de dados pode ter inconsistências**
- **Mitigação:** Implementar validações, logs detalhados, mecanismo de retry

**Risco 3: Performance pode ser afetada com volume de dados**
- **Mitigação:** Implementar paginação, cache, otimizações de queries

**Risco 4: Usuários podem resistir à mudança**
- **Mitigação:** Treinamento, suporte intensivo, paralelo de sistemas por período

**Risco 5: Funcionalidades legadas podem não ter equivalente na API**
- **Mitigação:** Implementar workarounds, considerar manter legado para funcionalidades específicas

**Risco 6: Integração entre sistema MLM e loja virtual pode ser complexa**
- **Mitigação:** Documentar pontos de integração, implementar testes de integração, rollback plan

**Risco 7: Múltiplas formas de pagamento podem causar conflitos**
- **Mitigação:** Implementar lógica de prioridade, testar cada forma de pagamento, documentar fluxos

### Próximos Passos Imediatos Atualizados

1. **Configurar Credenciais API Allin**
   - Obter appId e appSecret
   - Definir escopos necessários
   - Testar autenticação

2. **Implementar Estrutura de Sync**
   - Criar base service para sync
   - Implementar retry logic
   - Implementar error handling
   - Implementar logging

3. **Criar Tabelas Necessárias no Supabase**
   - Revisar migrations existentes
   - Criar migrations adicionais (lojas/CDs, carrinhos abandonados, devoluções)
   - Implementar RLS policies

4. **Implementar Sync de Distribuidores**
   - GET /api/v1/distribuidores
   - Mapeamento de campos
   - Implementar sync incremental
   - Testar com dados reais

5. **Implementar Módulo de Produtos**
   - CRUD de produtos
   - Campos: ID, SKU, Imagem, Produto, Modelo, Categorias, Pontos, Preço, Quantidade, Produto Destacado, Situação, CD/Loja que cadastrou, Status moderação
   - Funcionalidades: Exportar, Importar, Lixeira, Novo, Duplicar, Excluir
   - Gestão de estoque

6. **Implementar Dashboard Básico**
   - KPIs MLM (Distribuidores, Planos Vendidos, Bônus, Saldos)
   - KPIs E-commerce (Pedidos, Vendas, Clientes)
   - Widgets simples
   - Testar com dados sync

### Métricas de Sucesso Atualizadas

**Métricas Técnicas:**
- 100% de distribuidores sync
- 100% de pedidos sync (MLM + Loja Virtual)
- 100% de produtos sync
- 100% de clientes sync (MLM + Loja Virtual)
- 0% de dados inconsistentes
- Tempo de sync < 5 minutos

**Métricas de Negócio:**
- 100% de funcionalidades core MLM implementadas
- 100% de funcionalidades core E-commerce implementadas
- 90% de funcionalidades secundárias implementadas
- 95% de satisfação dos usuários
- 0% de perda de dados
- 100% de uptime

### Conclusão Atualizada

A nova plataforma AllIn-OS2 tem uma arquitetura sólida e moderna, com uma estrutura base já implementada. O plano de ação atualizado foca em:

1. **Configurar API Allin** - Prioridade crítica para iniciar sync de dados
2. **Implementar sync com API Allin** - Prioridade crítica para garantir consistência de dados
3. **Completar módulos de E-commerce** - Prioridade alta para funcionalidade de loja virtual (estrutura já criada)
4. **Implementar dashboard completo** - Prioridade para visibilidade do negócio (MLM + E-commerce)
5. **Implementar ferramentas administrativas** - Prioridade para gestão do sistema
6. **Completar módulos de logística** - Prioridade alta para operações (estrutura já criada)
7. **Completar módulos de catálogo** - Prioridade média para gestão de produtos (estrutura já criada)
8. **Implementar integrações e marketing** - Prioridade baixa para expansão

**Estado Atual do Projeto:**
- ✅ 56 migrations criadas no Supabase (tabelas, RLS policies, indexes, soft delete, allin_id)
- ✅ 16 módulos backend criados (analytics, auth, commissions, customers, distributors, finance, logistics, mlm, network, orders, payments, plans, products, profiles, qualifications)
- ✅ Estrutura de schemas separados (crm, mlm, commerce, logistics, finance, system)
- ✅ Soft delete implementado
- ✅ Campos allin_id adicionados para sync

O tempo estimado para implementação completa é de 3-5 meses (reduzido de 4-6 meses devido à estrutura já criada), com fases bem definidas e riscos mitigados. A inclusão do subsistema de gestão da loja virtual adiciona funcionalidades essenciais para a plataforma completa, mas grande parte da estrutura base já está implementada, reduzindo significativamente o tempo de desenvolvimento.

---

## RESUMO DA ETAPA 2

### Total de Telas Exploradas: 10
1. A Rede (Distribuidores)
2. Planos (Adesões)
3. Bônus Instalados
4. Campos para Pedidos
5. Criar Pedido (Compra Manual)
6. Relatório de Planos Vendidos
7. Dashboard (Página Inicial)
8. Solicitação de Saque
9. Lançar Qualificação Manual
10. Gerenciar Ativação Mensal

### Principais Descobertas:
- Sistema MLM com 977 distribuidores ativos
- 3 planos principais: Afiliado (R$ 0), Avanço (R$ 997), Excelência (R$ 3.980)
- Sistema de bônus complexo com 4 bônus ativos (Loja Online, Diretos, Qualificação Mensal, Indiretos)
- Sistema de ativação mensal com ~8.860 registros
- Sistema de saques com PIX integrado
- Dashboard com KPIs financeiros e gráficos

---
