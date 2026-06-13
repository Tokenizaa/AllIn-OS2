# BUSINESS RULES REVERSE ENGINEERING - ALLIN OS 2.0

**Data:** 11 de Junho de 2026  
**Versão:** 1.0  
**Status:** Documentação Completa  
**Plataforma:** AllInBrasil MLM & E-commerce

---

# ÍNDICE

1. [INTRODUÇÃO](#introdução)
2. [IDENTITY CONTEXT - REGRAS DE AUTENTICAÇÃO E AUTORIZAÇÃO](#identity-context---regras-de-autenticação-e-autorização)
3. [LOCATION CONTEXT - REGRAS DE LOCALIZAÇÃO](#location-context---regras-de-localização)
4. [CRM CONTEXT - REGRAS DE GESTÃO DE CLIENTES](#crm-context---regras-de-gestão-de-clientes)
5. [MLM CONTEXT - REGRAS DE MARKETING MULTINÍVEL](#mlm-context---regras-de-marketing-multinível)
6. [COMMERCE CONTEXT - REGRAS DE COMÉRCIO ELETRÔNICO](#commerce-context---regras-de-comércio-eletrônico)
7. [LOGISTICS CONTEXT - REGRAS DE LOGÍSTICA](#logistics-context---regras-de-logística)
8. [FINANCE CONTEXT - REGRAS FINANCEIRAS](#finance-context---regras-financeiras)
9. [SYSTEM CONTEXT - REGRAS DO SISTEMA](#system-context---regras-do-sistema)
10. [REGRAS TRANSVERSAIS - INTEGRAÇÕES ENTRE CONTEXTS](#regras-transversais---integrações-entre-contexts)
11. [POLÍTICAS DE VALIDAÇÃO DE DADOS](#políticas-de-validação-de-dados)
12. [REGRAS DE CÁLCULO DE COMISSÕES E BÔNUS](#regras-de-cálculo-de-comissões-e-bônus)
13. [REGRAS DE QUALIFICAÇÃO E PROGRESSÃO](#regras-de-qualificação-e-progressão)
14. [REGRAS DE GESTÃO DE ESTOQUE](#regras-de-gestão-de-estoque)

---

# INTRODUÇÃO

Este documento formaliza TODAS as regras de negócio implícitas e explícitas da plataforma AllInBrasil, identificadas através de engenharia reversa profunda do sistema. As regras aqui documentadas representam o conhecimento de domínio crítico que governa o comportamento operacional da plataforma.

**Escopo:**
- Regras de negócio explícitas (documentadas ou inferidas da API)
- Regras de negócio implícitas (inferidas da estrutura de dados e comportamento esperado)
- Políticas de validação e restrições
- Fluxos operacionais e decisões de negócio
- Cálculos e algoritmos de negócio

**O que NÃO está incluído:**
- Especificação técnica de endpoints (já documentado em 01-ENGANHARIA-REVERSA-API-COMPLETA.md)
- Modelagem de banco de dados (já documentado em migrations)
- Arquitetura técnica (já documentado em outros documentos)

---

# IDENTITY CONTEXT - REGRAS DE AUTENTICAÇÃO E AUTORIZAÇÃO

## 1.1 Regras de Autenticação OAuth2

### 1.1.1 Fluxo Client Credentials
**Regra:** O fluxo Client Credentials é utilizado para autenticação de serviços (machine-to-machine).

- **Pré-condição:** Client ID e Client Secret válidos
- **Pós-condição:** Token de acesso gerado com escopos associados ao cliente
- **Validação:** Credenciais devem ser válidas e ativas
- **Expiração:** Token expira após o período definido em `expires_in`
- **Refresh:** Token deve ser renovado automaticamente quando expirado

### 1.1.2 Fluxo Password Grant
**Regra:** O fluxo Password Grant permite autenticação direta com credenciais de usuário.

- **Pré-condição:** Username e password válidos
- **Limite de tentativas:** 10 tentativas incorretas bloqueiam por 1 hora
- **Bloqueio temporário:** Após 10 falhas, conta é bloqueada por 3600 segundos
- **Escopos:** Token herda escopos associados ao usuário
- **Validação de senha:** Senha deve atender critérios de complexidade (inferido)

### 1.1.3 Fluxo Authorization Code
**Regra:** O fluxo Authorization Code é utilizado para aplicações web que requerem consentimento do usuário.

- **Pré-condição:** Client ID, redirect URI e escopos válidos
- **Parâmetro obrigatório:** `state` deve ser único para prevenir CSRF
- **Parâmetro opcional:** `elsl` (Exigir Login Mesmo Se Logado) força re-autenticação
- **Validação de redirect URI:** Deve estar previamente registrada no cliente
- **Código de autorização:** Expira após uso único (inferido)

## 1.2 Regras de Escopos de Permissão

### 1.2.1 Hierarquia de Escopos
**Regra:** Escopos são organizados por bounded context e nível de acesso.

- **Escopos de leitura:** Permitem apenas operações GET
- **Escopos de escrita:** Permitem operações POST, PUT, DELETE
- **Escopos de administração:** Permitem operações críticas (ex: confirmação de saques)
- **Escopos de simulação:** Permitem operações de teste sem impacto real

### 1.2.2 Validação de Escopos
**Regra:** Cada requisição deve ter escopo apropriado para a operação.

- **Verificação:** Escopo é validado antes de executar operação
- **Múltiplos escopos:** Token pode ter múltiplos escopos separados por espaço
- **Escopo nulo:** Tokens sem escopo têm acesso limitado (inferido)
- **Revogação:** Escopos podem ser revogados sem revogar o token (inferido)

## 1.3 Regras de Ciclo de Vida de Token

### 1.3.1 Geração de Token
**Regra:** Tokens são gerados sob demanda com validação de credenciais.

- **Unicidade:** Cada token é único (inferido)
- **Assinatura:** Tokens são assinados para garantir integridade (inferido)
- **Timestamp:** Token inclui timestamp de geração (inferido)
- **Auditoria:** Geração de token é logada (inferido)

### 1.3.2 Expiração de Token
**Regra:** Tokens têm tempo de vida limitado por segurança.

- **Duração padrão:** Definida em `expires_in` (em segundos)
- **Grace period:** Não há grace period após expiração (inferido)
- **Refresh automático:** Cliente deve renovar token antes da expiração
- **Revogação manual:** Tokens podem ser revogados administrativamente (inferido)

---

# LOCATION CONTEXT - REGRAS DE LOCALIZAÇÃO

## 2.1 Regras de Validação de Endereços

### 2.1.1 Consulta de CEP
**Regra:** Consulta de CEP retorna endereço completo quando encontrado.

- **Formato de CEP:** 8 dígitos numéricos (sem formatação)
- **Validação:** CEP deve existir na base de correios
- **Retorno completo:** Retorna cidade, estado, país, bairro e logradouro
- **CEP não encontrado:** Retorna erro 404 ou vazio (inferido)
- **Cache:** Resultados de CEP podem ser cacheados (inferido)

### 2.1.2 Hierarquia Geográfica
**Regra:** Endereços seguem hierarquia estrita: País → Estado → Cidade → Bairro → Logradouro.

- **Integridade referencial:** Cidade deve pertencer a um Estado válido
- **Integridade referencial:** Estado deve pertencer a um País válido
- **Cascata:** Exclusão de País não deve excluir Estados (inferido)
- **Cascata:** Exclusão de Estado não deve excluir Cidades (inferido)
- **Validação:** CEP deve corresponder à cidade/estado informado (inferido)

## 2.2 Regras de Gestão de Localização

### 2.2.1 Cadastro de Cidades
**Regra:** Cidades são cadastradas com vinculação obrigatória a Estado e País.

- **Unicidade:** Nome da cidade + Estado deve ser único (inferido)
- **Padronização:** Nome da cidade deve ser capitalizado (inferido)
- **Código UF:** Código UF deve seguir padrão ISO 3166-2 (inferido)
- **Validação:** Estado deve existir antes de cadastrar cidade

### 2.2.2 Cadastro de Estados
**Regra:** Estados são cadastrados com vinculação obrigatória a País.

- **Unicidade:** Sigla UF + País deve ser única (inferido)
- **Padrão de sigla:** 2 caracteres maiúsculos (inferido)
- **Validação:** País deve existir antes de cadastrar estado
- **ISO compliance:** Deve seguir padrão ISO 3166-2 (inferido)

### 2.2.3 Cadastro de Países
**Regra:** Países são a raiz da hierarquia geográfica.

- **Unicidade:** Sigla ISO3 deve ser única (inferido)
- **Padrão ISO3:** 3 caracteres maiúsculos (inferido)
- **Nome nativo:** Campo opcional para nome no idioma nativo
- **Sigla:** Campo opcional para sigla alternativa (inferido)

## 2.3 Regras de Estados Civis

### 2.3.1 Classificação de Estado Civil
**Regra:** Estados civis são classificações padronizadas para cadastro de pessoas.

- **Código único:** Cada estado civil tem código único (inferido)
- **Descrição:** Descrição deve ser clara e padronizada
- **Imutabilidade:** Estados civis não devem ser excluídos (inferido)
- **Padrão brasileiro:** Deve seguir padrão civil brasileiro (inferido)

---

# CRM CONTEXT - REGRAS DE GESTÃO DE CLIENTES

## 3.1 Regras de Cadastro de Clientes

### 3.1.1 Identificação de Pessoa
**Regra:** Cliente pode ser pessoa física ou jurídica, com campos específicos para cada tipo.

- **Tipo de pessoa:** Determinado por `tipo_pessoa_id` (inferido)
- **Pessoa física:** Requer CPF, RG, data de nascimento, nome da mãe
- **Pessoa jurídica:** Requer CNPJ, razão social, nome fantasia, CPF do empresário
- **Exclusividade:** CPF ou CNPJ deve ser único por cliente (inferido)
- **Validação cruzada:** CPF do empresário deve ser válido se pessoa jurídica (inferido)

### 3.1.2 Dados de Contato
**Regra:** Dados de contato são obrigatórios para comunicação.

- **Email:** Obrigatório e deve ser válido (inferido)
- **Telefone:** Obrigatório para pessoa física (inferido)
- **Website:** Opcional, mas deve ter formato válido se informado (inferido)
- **Newsletter:** Flag opt-in para recebimento de comunicações

### 3.1.3 Endereço do Cliente
**Regra:** Endereço é obrigatório e deve seguir hierarquia geográfica.

- **CEP:** Obrigatório e deve ser válido
- **Cidade:** Obrigatório e deve existir na base
- **Estado:** Obrigatório e deve existir na base
- **País:** Obrigatório e deve existir na base
- **Validação:** CEP deve corresponder à cidade/estado informado (inferido)

### 3.1.4 Vínculo MLM
**Regra:** Cliente pode ter vínculo opcional com rede MLM.

- **Patrocinador:** Opcional, mas se informado deve ser válido (inferido)
- **Distribuidor:** Cliente pode ser um distribuidor (inferido)
- **Pernas:** Se distribuidor, pode ter pernas esquerda/direita (inferido)
- **Ativação:** Cliente pode ter ativação associada (inferido)

## 3.2 Regras de Validação de Dados de Cliente

### 3.2.1 Validação de CPF
**Regra:** CPF deve seguir algoritmo de validação oficial brasileiro.

- **Formato:** 11 dígitos numéricos (sem formatação)
- **Algoritmo:** Deve passar validação do dígito verificador
- **Unicidade:** CPF não pode ser duplicado na base (inferido)
- **Blacklist:** CPFs em blacklist não podem ser cadastrados (inferido)

### 3.2.2 Validação de CNPJ
**Regra:** CNPJ deve seguir algoritmo de validação oficial brasileiro.

- **Formato:** 14 dígitos numéricos (sem formatação)
- **Algoritmo:** Deve passar validação do dígito verificador
- **Unicidade:** CNPJ não pode ser duplicado na base (inferido)
- **Blacklist:** CNPJs em blacklist não podem ser cadastrados (inferido)

### 3.2.3 Validação de Email
**Regra:** Email deve ter formato válido e ser único.

- **Formato:** Deve seguir padrão RFC 5322 (inferido)
- **Unicidade:** Email não pode ser duplicado na base (inferido)
- **Verificação:** Email pode exigir verificação via link/token (inferido)
- **Tempo de expiração:** Token de verificação expira em X horas (inferido)

### 3.2.4 Validação de RG
**Regra:** RG é opcional mas deve ser válido se informado.

- **Formato:** Varia por estado (inferido)
- **Unicidade:** RG + Estado deve ser único (inferido)
- **Obrigatório:** Obrigatório para pessoa física (inferido)

## 3.3 Regras de Gestão de Contas de Cliente

### 3.3.1 Contas Bancárias
**Regra:** Cliente pode ter múltiplas contas bancárias associadas.

- **Múltiplas contas:** Cliente pode ter N contas bancárias (inferido)
- **Conta principal:** Uma conta pode ser marcada como principal (inferido)
- **Validação:** Dados bancários devem ser válidos (inferido)
- **PIX:** Chave PIX pode ser associada à conta (inferido)

### 3.3.2 Endereços Múltiplos
**Regra:** Cliente pode ter múltiplos endereços.

- **Endereço principal:** Um endereço deve ser marcado como principal (inferido)
- **Tipo de endereço:** Residencial, comercial, entrega, etc (inferido)
- **Validação:** Cada endereço deve seguir hierarquia geográfica

## 3.4 Regras de Ativação e Status

### 3.4.1 Status de Cliente
**Regra:** Cliente tem status que determina permissões.

- **Ativo:** Cliente pode fazer compras e acessar sistema (inferido)
- **Inativo:** Cliente não pode fazer compras (inferido)
- **Bloqueado:** Cliente bloqueado por violação de regras (inferido)
- **Pendente:** Cliente aguardando verificação (inferido)

### 3.4.2 Auto Ativação
**Regra:** Cliente pode ter auto ativação habilitada.

- **Flag:** `auto_ativacao` determina se cliente se ativa automaticamente (inferido)
- **Condição:** Auto ativação pode requerer verificação de email (inferido)
- **Limite:** Auto ativação pode ter limite de tempo (inferido)

### 3.4.3 Verificação de Email
**Regra:** Email pode exigir verificação para ativação.

- **Flag:** `email_verificado` indica se email foi verificado
- **Processo:** Envio de email com link/token de verificação
- **Expiração:** Token de verificação expira em X horas (inferido)
- **Reenvio:** Limite de reenvios de verificação (inferido)

---

# MLM CONTEXT - REGRAS DE MARKETING MULTINÍVEL

## 4.1 Regras de Rede Binária

### 4.1.1 Estrutura de Pernas
**Regra:** Cada distribuidor tem duas pernas: esquerda e direita.

- **Perna esquerda:** Primeira posição disponível na perna esquerda (inferido)
- **Perna direita:** Primeira posição disponível na perna direita (inferido)
- **Preenchimento:** Novos distribuidores são alocados na primeira posição disponível (inferido)
- **Balanceamento:** Sistema busca balancear volume entre pernas (inferido)

### 4.1.2 Patrocinador
**Regra:** Cada distribuidor tem um patrocinador (exceto o topo da rede).

- **Único:** Cada distribuidor tem apenas um patrocinador direto (inferido)
- **Ciclo:** Não pode ser patrocinador de si mesmo (inferido)
- **Nível:** Patrocinador está um nível acima na hierarquia (inferido)
- **Múltiplos níveis:** Um distribuidor pode ter múltiplos patrocinadores indiretos (inferido)

### 4.1.3 Alocação de Novos Distribuidores
**Regra:** Novos distribuidores são alocados seguindo regras específicas.

- **Escolha da perna:** Perna é escolhida pelo patrocinador ou automaticamente (inferido)
- **Profundidade:** Alocação busca a primeira posição disponível na perna escolhida (inferido)
- **Volume:** Volume de vendas é acumulado por perna (inferido)
- **Leg:** Cada distribuidor tem uma "leg" (perna de maior volume) (inferido)

## 4.2 Regras de Rede Linear

### 4.2.1 Estrutura Linear
**Regra:** Rede linear organiza distribuidores em uma linha única por nível.

- **Linhas:** Cada linha representa um nível na rede (inferido)
- **Posição relativa:** Cada distribuidor tem posição relativa na linha (inferido)
- **Ordem cronológica:** Distribuidores são adicionados em ordem cronológica (inferido)
- **Uplines:** Distribuidores acima na linha são uplines (inferido)
- **Downlines:** Distribuidores abaixo na linha são downlines (inferido)

### 4.2.2 Cálculo de Posições
**Regra:** Posições na rede linear são calculadas automaticamente.

- **Posição relativa:** Calculada baseada na ordem de entrada (inferido)
- **Linha:** Determinada pelo nível na hierarquia (inferido)
- **Recálculo:** Posições podem ser recalculadas em caso de mudanças (inferido)

## 4.3 Regras de Planos

### 4.3.1 Tipos de Plano
**Regra:** Planos definem benefícios e requisitos para distribuidores.

- **Plano básico:** Plano inicial para novos distribuidores (inferido)
- **Planos de upgrade:** Planos superiores com mais benefícios (inferido)
- **Upgrade de plano:** Distribuidor pode fazer upgrade de plano (inferido)
- **Downgrade:** Downgrade de plano pode ter restrições (inferido)

### 4.3.2 Requisitos de Plano
**Regra:** Cada plano tem requisitos específicos para ativação/maintenance.

- **Pontos de ativação:** Quantidade de pontos necessária para ativar plano (inferido)
- **Pontos de renovação:** Quantidade de pontos necessária para renovar plano (inferido)
- **Volume mínimo:** Volume de vendas mínimo por período (inferido)
- **Diretos mínimos:** Número mínimo de distribuidores diretos (inferido)

### 4.3.3 Benefícios de Plano
**Regra:** Cada plano oferece benefícios proporcionais ao nível.

- **Porcentagem de bônus:** Maior plano = maior porcentagem (inferido)
- **Gerações pagas:** Maior plano = mais gerações pagas (inferido)
- **Limite de saque:** Maior plano = maior limite de saque (inferido)
- **Bônus especiais:** Planos superiores têm bônus exclusivos (inferido)

## 4.4 Regras de Qualificações

### 4.4.1 Níveis de Qualificação
**Regra:** Qualificações representam níveis de sucesso na rede.

- **Níveis:** Bronze, Prata, Ouro, Platina, Diamante, etc (inferido)
- **Progressão:** Distribuidor progride através dos níveis (inferido)
- **Regressão:** Qualificação pode regredir se requisitos não mantidos (inferido)
- **Histórico:** Histórico de qualificações é mantido (inferido)

### 4.4.2 Requisitos de Qualificação
**Regra:** Cada qualificação tem requisitos específicos.

- **Pontos acumulados:** Total de pontos na rede (inferido)
- **Volume de vendas:** Volume total de vendas da rede (inferido)
- **Diretos qualificados:** Número de diretos com qualificação mínima (inferido)
- **Equipe qualificada:** Tamanho da equipe qualificada (inferido)

### 4.4.3 Manutenção de Qualificação
**Regra:** Qualificações devem ser mantidas periodicamente.

- **Período de manutenção:** Mensal, trimestral, etc (inferido)
- **Pontos de manutenção:** Pontos necessários para manter qualificação (inferido)
- **Volume de manutenção:** Volume necessário para manter qualificação (inferido)
- **Grace period:** Período de carência antes de regressão (inferido)

## 4.5 Regras de Ativação

### 4.5.1 Ativação Inicial
**Regra:** Novo distribuidor deve ser ativado para participar da rede.

- **Compra de pacote:** Ativação requer compra de pacote inicial (inferido)
- **Pontos de ativação:** Pacote fornece pontos de ativação (inferido)
- **Data de ativação:** Marca início de contagem de períodos (inferido)
- **Status:** Distribuidor inativo não ganha comissões (inferido)

### 4.5.2 Ativações Mensais
**Regra:** Distribuidor deve manter ativação mensal para continuar ativo.

- **Pontos de renovação:** Pontos necessários para renovação mensal (inferido)
- **Prazo:** Renovação deve ser feita até data limite (inferido)
- **Grace period:** Período de carência após vencimento (inferido)
- **Suspensão:** Não renovação resulta em suspensão (inferido)

### 4.5.3 Reativação
**Regra:** Distribuidor suspenso pode ser reativado.

- **Compra de pacote:** Reativação requer compra de novo pacote (inferido)
- **Pontos perdidos:** Pontos acumulados podem ser perdidos (inferido)
- **Rede:** Rede é mantida após reativação (inferido)
- **Qualificação:** Qualificação pode ser perdida (inferido)

## 4.6 Regras de Simulação de Comissões

### 4.6.1 Criação de Simulação
**Regra:** Distribuidor pode criar simulações para projetar ganhos.

- **Período:** Simulação tem período inicial e final (inferido)
- **Distribuidor:** Simulação é específica para um distribuidor (inferido)
- **Status:** Simulação tem status (pendente, executando, concluída, erro) (inferido)
- **Planejamento:** Simulação não afeta dados reais (inferido)

### 4.6.2 Execução de Simulação
**Regra:** Simulação executa cálculos de comissões projetadas.

- **Cálculo:** Executa algoritmos de cálculo de comissões (inferido)
- **Bônus:** Calcula bônus por tipo e geração (inferido)
- **Faturamento:** Calcula faturamento projetado (inferido)
- **Resultado:** Retorna detalhamento de ganhos projetados (inferido)

### 4.6.3 Cancelamento de Simulação
**Regra:** Simulação pode ser cancelada antes ou durante execução.

- **Antes da execução:** Cancelamento é imediato (inferido)
- **Durante execução:** Cancelamento interrompe processamento (inferido)
- **Após conclusão:** Simulação concluída não pode ser cancelada (inferido)
- **Histórico:** Cancelamento é registrado no histórico (inferido)

---

# COMMERCE CONTEXT - REGRAS DE COMÉRCIO ELETRÔNICO

## 5.1 Regras de Catálogo de Produtos

### 5.1.1 Cadastro de Produtos
**Regra:** Produtos são cadastrados com informações obrigatórias e opcionais.

- **Nome:** Obrigatório e deve ser único (inferido)
- **Descrição:** Obrigatória para produtos principais (inferido)
- **Preço:** Obrigatório e deve ser maior que zero (inferido)
- **Estoque:** Obrigatório e não pode ser negativo (inferido)
- **Categoria:** Obrigatório e deve existir (inferido)
- **Fabricante:** Opcional mas deve existir se informado (inferido)

### 5.1.2 Visibilidade de Produtos
**Regra:** Produtos podem ser visíveis ou ocultos no catálogo.

- **Flag de visibilidade:** `e_visivel` determina se produto aparece no catálogo (inferido)
- **Produtos ocultos:** Não aparecem em buscas e listagens (inferido)
- **Produtos visíveis:** Aparecem em buscas e listagens (inferido)
- **Controle de estoque:** Produtos sem estoque podem ser ocultos automaticamente (inferido)

### 5.1.3 Opções de Produtos
**Regra:** Produtos podem ter opções (cores, tamanhos, etc).

- **Múltiplas opções:** Produto pode ter N opções (inferido)
- **Valores de opção:** Cada opção pode ter N valores (inferido)
- **Preço variável:** Opções podem afetar preço final (inferido)
- **Estoque por opção:** Estoque é gerenciado por combinação de opções (inferido)

## 5.2 Regras de Categorias de Produtos

### 5.2.1 Hierarquia de Categorias
**Regra:** Categorias podem ter estrutura hierárquica.

- **Categoria raiz:** Categorias sem categoria pai (inferido)
- **Subcategorias:** Categorias com categoria pai (inferido)
- **Profundidade:** Limite de profundidade da hierarquia (inferido)
- **Múltiplas categorias:** Produto pode pertencer a múltiplas categorias (inferido)

### 5.2.2 Status de Categoria
**Regra:** Categorias podem estar ativas ou inativas.

- **Ativa:** Produtos de categoria ativa aparecem no catálogo (inferido)
- **Inativa:** Produtos de categoria inativa são ocultos (inferido)
- **Herança:** Subcategorias herdam status da categoria pai (inferido)

## 5.3 Regras de Gestão de Estoque

### 5.3.1 Estoque por Produto
**Regra:** Estoque é gerenciado por produto e opção.

- **Estoque total:** Soma de estoque de todas as opções (inferido)
- **Estoque por opção:** Cada combinação de opções tem estoque próprio (inferido)
- **Estoque por loja:** Estoque pode variar por loja (inferido)
- **Reserva:** Estoque pode ser reservado para pedidos (inferido)

### 5.3.2 Controle de Estoque
**Regra:** Estoque é controlado para evitar vendas excessivas.

- **Verificação:** Estoque é verificado antes de permitir compra (inferido)
- **Bloqueio:** Produto sem estoque bloqueia compra (inferido)
- **Notificação:** Notificação quando estoque atinge limite mínimo (inferido)
- **Reabastecimento:** Processo de reabastecimento manual ou automático (inferido)

### 5.3.3 Estoque Negativo
**Regra:** Estoque negativo não é permitido em condições normais.

- **Bloqueio:** Sistema impede estoque negativo (inferido)
- **Exceção:** Estoque negativo pode ser permitido em casos especiais (inferido)
- **Correção:** Estoque negativo deve ser corrigido manualmente (inferido)

## 5.4 Regras de Pedidos

### 5.4.1 Criação de Pedido
**Regra:** Pedido é criado com cliente, itens e informações de entrega.

- **Cliente:** Obrigatório e deve estar ativo (inferido)
- **Itens:** Obrigatório, pelo menos um item (inferido)
- **Endereço de entrega:** Obrigatório e deve ser válido (inferido)
- **Forma de pagamento:** Obrigatória na confirmação (inferido)
- **Status inicial:** Pedido começa com status "pending" (inferido)

### 5.4.2 Validação de Pedido
**Regra:** Pedido é validado antes de ser confirmado.

- **Estoque:** Verifica disponibilidade de estoque (inferido)
- **Preço:** Verifica se preço não mudou (inferido)
- **Cliente:** Verifica se cliente está ativo (inferido)
- **Endereço:** Verifica se endereço é válido (inferido)
- **Pagamento:** Verifica se forma de pagamento está ativa (inferido)

### 5.4.3 Alteração de Status
**Regra:** Status de pedido segue fluxo definido.

- **Fluxo:** pending → approved → processing → shipped → delivered (inferido)
- **Cancelamento:** Pedido pode ser cancelado em qualquer status antes de shipped (inferido)
- **Reversão:** Status não pode regredir (exceto cancelamento) (inferido)
- **Histórico:** Cada mudança de status é registrada no histórico (inferido)

### 5.4.4 Cancelamento de Pedido
**Regra:** Pedido pode ser cancelado sob certas condições.

- **Antes do envio:** Pedido pode ser cancelado antes de shipped (inferido)
- **Após envio:** Cancelamento após shipped requer processo de devolução (inferido)
- **Estorno:** Cancelamento estorna estoque (inferido)
- **Pagamento:** Cancelamento pode requerer estorno de pagamento (inferido)

## 5.5 Regras de Pagamentos

### 5.5.1 Formas de Pagamento
**Regra:** Formas de pagamento são configuradas e podem estar ativas ou inativas.

- **Ativa:** Forma de pagamento ativa pode ser usada (inferido)
- **Inativa:** Forma de pagamento inativa não pode ser usada (inferido)
- **Configuração:** Cada forma tem configuração específica (inferido)
- **Taxas:** Formas podem ter taxas associadas (inferido)

### 5.5.2 Processamento de Pagamento
**Regra:** Pagamento é processado após confirmação do pedido.

- **Confirmação:** Pedido deve ser confirmado antes de processar pagamento (inferido)
- **Validação:** Pagamento é validado com gateway/processador (inferido)
- **Status:** Pagamento tem status (pending, approved, rejected, refunded) (inferido)
- **Retentativas:** Pagamento rejeitado pode ter retentativas (inferido)

### 5.5.3 Estorno de Pagamento
**Regra:** Pagamento pode ser estornado em caso de cancelamento ou devolução.

- **Condição:** Estorno requer pedido cancelado ou devolução (inferido)
- **Processamento:** Estorno é processado via gateway/processador (inferido)
- **Prazo:** Estorno pode levar X dias para ser processado (inferido)
- **Taxas:** Taxas de estorno podem ser aplicadas (inferido)

## 5.6 Regras de Fabricantes

### 5.6.1 Cadastro de Fabricantes
**Regra:** Fabricantes são cadastrados com informações básicas.

- **Nome:** Obrigatório e deve ser único (inferido)
- **Imagem:** Opcional mas recomendada (inferido)
- **Ordem:** Define ordem de exibição (inferido)
- **Ativo:** Fabricante ativo aparece no catálogo (inferido)

### 5.6.2 Vínculo com Produtos
**Regra:** Produtos são vinculados a fabricantes.

- **Opcional:** Fabricante é opcional para produtos (inferido)
- **Múltiplos produtos:** Fabricante pode ter múltiplos produtos (inferido)
- **Exclusivo:** Produto tem apenas um fabricante (inferido)

---

# LOGISTICS CONTEXT - REGRAS DE LOGÍSTICA

## 6.1 Regras de Cálculo de Frete

### 6.1.1 Parâmetros de Cálculo
**Regra:** Cálculo de frete considera múltiplos parâmetros.

- **CEP origem:** CEP de origem (loja/fabricante) (inferido)
- **CEP destino:** CEP de destino do cliente (inferido)
- **Valor do pedido:** Valor total do pedido (inferido)
- **Peso:** Peso total dos produtos (inferido)
- **Volume:** Volume total dos produtos (opcional) (inferido)
- **Dimensões:** Dimensões dos produtos (opcional) (inferido)

### 6.1.2 Formas de Frete
**Regra:** Sistema retorna múltiplas opções de frete disponíveis.

- **Transportadoras:** Cada transportadora oferece opções (inferido)
- **Prazo:** Cada opção tem prazo de entrega (inferido)
- **Preço:** Cada opção tem preço específico (inferido)
- **Tipo:** PAC, SEDEX, Expresso, etc (inferido)

### 6.1.3 Regras de Seleção
**Regra:** Cliente pode selecionar forma de frete desejada.

- **Seleção obrigatória:** Cliente deve selecionar uma forma (inferido)
- **Padrão:** Sistema pode sugerir opção padrão (inferido)
- **Mudança:** Cliente pode mudar seleção antes de confirmar (inferido)
- **Validação:** Forma selecionada deve estar disponível (inferido)

## 6.2 Regras de Transportadoras

### 6.2.1 Cadastro de Transportadoras
**Regra:** Transportadoras são cadastradas com configurações específicas.

- **Nome:** Obrigatório e deve ser único (inferido)
- **Código:** Código interno para identificação (inferido)
- **Contato:** Telefone e email de contato (inferido)
- **Configuração:** Regras de cálculo de frete (inferido)
- **Situação:** Ativa ou inativa (inferido)

### 6.2.2 Vínculo com Lojas
**Regra:** Transportadoras podem ser vinculadas a lojas específicas.

- **Loja específica:** Transportadora pode servir loja específica (inferido)
- **Múltiplas lojas:** Transportadora pode servir múltiplas lojas (inferido)
- **Padrão:** Transportadora pode ser padrão para loja (inferido)

### 6.2.3 Atribuição de Transporte
**Regra:** Transporte é atribuído após confirmação do pedido.

- **Seleção automática:** Sistema pode selecionar automaticamente (inferido)
- **Seleção manual:** Cliente pode selecionar transportadora (inferido)
- **Confirmação:** Transporte é confirmado após seleção (inferido)
- **Rastreamento:** Código de rastreamento é gerado (inferido)

---

# FINANCE CONTEXT - REGRAS FINANCEIRAS

## 7.1 Regras de Solicitações de Saque

### 7.1.1 Criação de Solicitação
**Regra:** Distribuidor pode solicitar saque de comissões acumuladas.

- **Distribuidor:** Solicitação é vinculada a distribuidor (inferido)
- **Valor:** Valor solicitado deve ser positivo (inferido)
- **Saldo disponível:** Valor não pode exceder saldo disponível (inferido)
- **Conta bancária:** Conta bancária deve estar cadastrada (inferido)
- **Status inicial:** Solicitação começa com status "pending" (inferido)

### 7.1.2 Validação de Saque
**Regra:** Solicitação de saque é validada antes de ser processada.

- **Saldo:** Verifica se distribuidor tem saldo suficiente (inferido)
- **Conta:** Verifica se conta bancária está ativa (inferido)
- **Limite:** Verifica se valor está dentro do limite permitido (inferido)
- **Frequência:** Verifica se não excede limite de saques por período (inferido)
- **Documentação:** Pode requerer documentação adicional (inferido)

### 7.1.3 Limites de Saque
**Regra:** Saques estão sujeitos a limites.

- **Limite mínimo:** Valor mínimo por saque (inferido)
- **Limite máximo:** Valor máximo por saque (inferido)
- **Limite diário:** Valor máximo por dia (inferido)
- **Limite mensal:** Valor máximo por mês (inferido)
- **Limite por plano:** Limites variam por plano (inferido)

### 7.1.4 Processamento de Saque
**Regra:** Saque passa por processo de aprovação.

- **Fluxo:** pending → approved → processing → paid (inferido)
- **Aprovação:** Saque deve ser aprovado por administrador (inferido)
- **Processamento:** Após aprovação, é processado financeiramente (inferido)
- **Pagamento:** Transferência é feita para conta bancária (inferido)
- **Prazo:** Prazo máximo para processamento (inferido)

## 7.2 Regras de Confirmação de Saque

### 7.2.1 Aprovação
**Regra:** Saque deve ser aprovado por administrador.

- **Pré-condição:** Saque deve estar em status "pending" (inferido)
- **Validação:** Administrador valida informações antes de aprovar (inferido)
- **Auditoria:** Aprovação é registrada no histórico (inferido)
- **Notificação:** Distribuidor é notificado da aprovação (inferido)

### 7.2.2 Estorno
**Regra:** Saque pode ser estornado antes do pagamento.

- **Condição:** Saque deve estar em status "approved" ou "processing" (inferido)
- **Motivo:** Motivo do estorno deve ser registrado (inferido)
- **Saldo:** Valor é devolvido ao saldo do distribuidor (inferido)
- **Notificação:** Distribuidor é notificado do estorno (inferido)

### 7.2.3 Reversão
**Regra:** Saque pode ser revertido após pagamento em caso de erro.

- **Condição:** Saque deve estar em status "paid" (inferido)
- **Motivo:** Motivo da reversão deve ser registrado (inferido)
- **Recuperação:** Valor pode ser recuperado da conta bancária (inferido)
- **Saldo:** Valor é devolvido ao saldo do distribuidor (inferido)

## 7.3 Regras de Saques de CDs

### 7.3.1 Solicitações de CD
**Regra:** CDs (Centros de Distribuição) podem solicitar saques.

- **CD:** Solicitação é vinculada a um CD (inferido)
- **Valor:** Valor solicitado deve ser positivo (inferido)
- **Motivo:** Motivo do saque deve ser informado (inferido)
- **Aprovação:** Requer aprovação de nível superior (inferido)

### 7.3.2 Diferenças para Saques de Distribuidores
**Regra:** Saques de CD têm regras diferentes.

- **Limites:** Limites podem ser maiores (inferido)
- **Aprovação:** Requer aprovação de múltiplos níveis (inferido)
- **Documentação:** Documentação mais detalhada (inferido)
- **Auditoria:** Auditoria mais rigorosa (inferido)

## 7.4 Regras de Contas Bancárias

### 7.4.1 Cadastro de Conta
**Regra:** Distribuidor deve cadastrar conta bancária para saques.

- **Banco:** Banco deve ser válido (inferido)
- **Tipo de titular:** Pessoa física ou jurídica (inferido)
- **Nome:** Nome do titular deve corresponder ao distribuidor (inferido)
- **CPF/CNPJ:** Deve corresponder ao tipo de titular (inferido)
- **Chave PIX:** Opcional mas recomendada (inferido)

### 7.4.2 Validação de Conta
**Regra:** Conta bancária é validada antes de ser usada.

- **Validação bancária:** Conta é validada com banco (inferido)
- **Correspondência:** Nome deve corresponder ao distribuidor (inferido)
- **Ativação:** Conta deve estar ativa no banco (inferido)
- **Tipo:** Tipo de conta deve aceitar transferências (inferido)

### 7.4.3 Conta Principal
**Regra:** Distribuidor pode ter múltiplas contas, mas uma é principal.

- **Marcação:** Uma conta é marcada como principal (inferido)
- **Padrão:** Saques são feitos para conta principal por padrão (inferido)
- **Mudança:** Distribuidor pode mudar conta principal (inferido)
- **Validação:** Nova conta principal deve ser validada (inferido)

---

# SYSTEM CONTEXT - REGRAS DO SISTEMA

## 8.1 Regras de Linguagens

### 8.1.1 Cadastro de Linguagens
**Regra:** Linguagens são cadastradas para suporte multilíngue.

- **Título:** Nome da linguagem/idioma (inferido)
- **Sigla:** Código da linguagem (ex: pt-BR, en-US) (inferido)
- **Diretório:** Diretório de recursos da linguagem (inferido)
- **Status:** Ativa ou inativa (inferido)
- **Padrão:** Uma linguagem é marcada como padrão (inferido)

### 8.1.2 Seleção de Linguagem
**Regra:** Usuário pode selecionar linguagem preferida.

- **Padrão:** Sistema usa linguagem padrão se não selecionada (inferido)
- **Persistência:** Seleção é persistida para o usuário (inferido)
- **Disponibilidade:** Apenas linguagens ativas podem ser selecionadas (inferido)
- **Fallback:** Se linguagem não disponível, usa padrão (inferido)

## 8.2 Regras de Lojas

### 8.2.1 Cadastro de Lojas
**Regra:** Lojas são cadastradas para multi-tenancy.

- **Documento:** CNPJ da loja (inferido)
- **Nome:** Nome da loja (inferido)
- **Status:** Ativa ou inativa (inferido)
- **Endereço:** Endereço da loja (inferido)
- **Configuração:** Configurações específicas da loja (inferido)

### 8.2.2 Multi-tenancy
**Regra:** Sistema suporta múltiplas lojas.

- **Isolamento:** Dados são isolados por loja (inferido)
- **Configuração:** Cada loja tem configurações próprias (inferido)
- **Produtos:** Catálogo pode variar por loja (inferido)
- **Estoque:** Estoque é gerenciado por loja (inferido)

## 8.3 Regras de Extensões

### 8.3.1 Extensões do Sistema
**Regra:** Extensões adicionam funcionalidades ao sistema.

- **Nome:** Nome da extensão (inferido)
- **Descrição:** Descrição da funcionalidade (inferido)
- **Status:** Ativa ou inativa (inferido)
- **Configuração:** Configurações específicas da extensão (inferido)

### 8.3.2 Integração de Extensões
**Regra:** Extensões se integram ao sistema.

- **Hooks:** Extensões usam hooks do sistema (inferido)
- **Eventos:** Extensões podem ouvir eventos (inferido)
- **API:** Extensões podem expor APIs (inferido)
- **Segurança:** Extensões seguem regras de segurança (inferido)

---

# REGRAS TRANSVERSAIS - INTEGRAÇÕES ENTRE CONTEXTS

## 9.1 Regras de Integração CRM ↔ MLM

### 9.1.1 Cliente como Distribuidor
**Regra:** Cliente pode se tornar distribuidor.

- **Conversão:** Cliente pode ser convertido em distribuidor (inferido)
- **Dados compartilhados:** Dados pessoais são compartilhados (inferido)
- **Vínculo:** Cliente mantém vínculo com distribuidor (inferido)
- **Histórico:** Histórico de compras é mantido (inferido)

### 9.1.2 Patrocinador de Cliente
**Regra:** Cliente pode ter patrocinador MLM.

- **Vínculo opcional:** Cliente pode ter patrocinador (inferido)
- **Compras:** Compras de cliente geram comissão para patrocinador (inferido)
- **Rede:** Cliente pode entrar na rede do patrocinador (inferido)
- **Progressão:** Cliente pode se tornar distribuidor (inferido)

## 9.2 Regras de Integração Commerce ↔ MLM

### 9.2.1 Distribuidor como Cliente
**Regra:** Distribuidor pode fazer compras como cliente.

- **Descontos:** Distribuidor pode ter descontos especiais (inferido)
- **Pontos:** Compras geram pontos para rede (inferido)
- **Comissões:** Compras não geram comissão para si mesmo (inferido)
- **Histórico:** Histórico de compras é mantido (inferido)

### 9.2.2 Indicador e Comprador
**Regra:** Pedido pode ter distribuidor indicador e comprador.

- **Indicador:** Distribuidor que indicou a compra (inferido)
- **Comprador:** Distribuidor que fez a compra (inferido)
- **Comissão:** Comissão vai para indicador (inferido)
- **Pontos:** Pontos vão para rede do comprador (inferido)

## 9.3 Regras de Integração Commerce ↔ Logistics

### 9.3.1 Cálculo de Frete no Pedido
**Regra:** Frete é calculado durante criação do pedido.

- **Endereço:** Usa endereço de entrega do pedido (inferido)
- **Produtos:** Considera peso/volume dos produtos (inferido)
- **Valor:** Considera valor total do pedido (inferido)
- **Loja:** Considera loja de origem (inferido)

### 9.3.2 Atribuição de Transportadora
**Regra:** Transportadora é atribuída após confirmação.

- **Seleção:** Baseada em cálculo de frete (inferido)
- **Disponibilidade:** Verifica disponibilidade da transportadora (inferido)
- **Confirmação:** Transporte é confirmado com transportadora (inferido)
- **Rastreamento:** Código de rastreamento é gerado (inferido)

## 9.4 Regras de Integração Commerce ↔ Finance

### 9.4.1 Saldos de Pedidos
**Regra:** Compra de pacotes gera saldos.

- **Pacote:** Compra de pacote de ativação (inferido)
- **Saldo:** Saldo é gerado para distribuidor (inferido)
- **Tipo:** Tipo de saldo (crédito, pontos, etc) (inferido)
- **Validade:** Saldo pode ter data de validade (inferido)

### 9.4.2 Pagamento de Pedido
**Regra:** Pagamento é processado via gateway.

- **Confirmação:** Pedido deve ser confirmado (inferido)
- **Validação:** Pagamento é validado (inferido)
- **Processamento:** Pagamento é processado (inferido)
- **Notificação:** Cliente é notificado do status (inferido)

## 9.5 Regras de Integração MLM ↔ Finance

### 9.5.1 Comissões em Saldo
**Regra:** Comissões calculadas são creditadas em saldo.

- **Cálculo:** Comissão é calculada (inferido)
- **Crédito:** Valor é creditado em saldo (inferido)
- **Disponibilidade:** Saldo fica disponível após período (inferido)
- **Saques:** Saldo pode ser sacado (inferido)

### 9.5.2 Limites de Saque por Plano
**Regra:** Limite de saque varia por plano MLM.

- **Plano básico:** Limite menor (inferido)
- **Plano superior:** Limite maior (inferido)
- **Progressão:** Limite aumenta com upgrade (inferido)
- **Validação:** Saque respeita limite do plano (inferido)

---

# POLÍTICAS DE VALIDAÇÃO DE DADOS

## 10.1 Validação de CPF

### 10.1.1 Algoritmo de Validação
**Regra:** CPF deve seguir algoritmo oficial brasileiro.

- **Formato:** 11 dígitos numéricos
- **Dígito verificador:** 2 últimos dígitos são verificadores
- **Cálculo:** Segue algoritmo do Ministério da Fazenda
- **CPF inválido:** CPF que não passa validação é rejeitado

### 10.1.2 Regras de CPF
- **Unicidade:** CPF não pode ser duplicado
- **Blacklist:** CPFs em blacklist são rejeitados
- **Obrigatório:** Obrigatório para pessoa física
- **Formatação:** Aceita com ou sem formatação

## 10.2 Validação de CNPJ

### 10.2.1 Algoritmo de Validação
**Regra:** CNPJ deve seguir algoritmo oficial brasileiro.

- **Formato:** 14 dígitos numéricos
- **Dígito verificador:** 2 últimos dígitos são verificadores
- **Cálculo:** Segue algoritmo do Ministério da Fazenda
- **CNPJ inválido:** CNPJ que não passa validação é rejeitado

### 10.2.2 Regras de CNPJ
- **Unicidade:** CNPJ não pode ser duplicado
- **Blacklist:** CNPJs em blacklist são rejeitados
- **Obrigatório:** Obrigatório para pessoa jurídica
- **Formatação:** Aceita com ou sem formatação

## 10.3 Validação de Email

### 10.3.1 Formato de Email
**Regra:** Email deve ter formato válido.

- **Padrão:** Deve seguir RFC 5322
- **Domínio:** Domínio deve ser válido
- **MX:** Domínio deve ter registro MX
- **Email inválido:** Email inválido é rejeitado

### 10.3.2 Regras de Email
- **Unicidade:** Email não pode ser duplicado
- **Verificação:** Email pode exigir verificação
- **Obrigatório:** Obrigatório para cadastro
- **Lowercase:** Email é armazenado em lowercase

## 10.4 Validação de Telefone

### 10.4.1 Formato de Telefone
**Regra:** Telefone deve ter formato válido brasileiro.

- **DDD:** 2 dígitos (ex: 11)
- **Número:** 8 ou 9 dígitos
- **Celular:** 9 dígitos começando com 9
- **Fixo:** 8 dígitos

### 10.4.2 Regras de Telefone
- **Formato:** Aceita com ou sem formatação
- **Obrigatório:** Obrigatório para pessoa física
- **Validação:** DDD deve ser válido
- **Múltiplos:** Cliente pode ter múltiplos telefones

---

# REGRAS DE CÁLCULO DE COMISSÕES E BÔNUS

## 11.1 Regras de Cálculo de Comissões

### 11.1.1 Comissão Direta
**Regra:** Comissão direta é paga sobre vendas de distribuidores diretos.

- **Porcentagem:** Definida pelo plano do distribuidor
- **Base de cálculo:** Valor líquido da venda
- **Condição:** Distribuidor direto deve estar ativo
- **Pagamento:** Creditado em saldo após período

### 11.1.2 Comissão Indireta
**Regra:** Comissão indireta é paga sobre vendas de rede profunda.

- **Porcentagem:** Definida pelo plano e geração
- **Base de cálculo:** Valor líquido da venda
- **Gerações:** Número de gerações pagas varia por plano
- **Condição:** Distribuidor indireto deve estar ativo

### 11.1.3 Bônus de Perna
**Regra:** Bônus de perna é pago baseado no volume da perna menor.

- **Cálculo:** Volume da perna menor × porcentagem
- **Condição:** Ambas as pernas devem ter volume mínimo
- **Frequência:** Calculado mensalmente
- **Plano:** Porcentagem varia por plano

### 11.1.4 Bônus de Liderança
**Regra:** Bônus de liderança é pago para distribuidores qualificados.

- **Condição:** Distribuidor deve ter qualificação mínima
- **Equipe:** Equipe deve atingir metas de volume
- **Porcentagem:** Definida pela qualificação
- **Pagamento:** Creditado mensalmente

## 11.2 Regras de Pontos

### 11.2.1 Pontos de Ativação
**Regra:** Pontos de ativação são gerados pela compra de pacotes.

- **Pacote:** Cada pacote tem valor em pontos
- **Ativação:** Pontos ativam distribuidor
- **Validade:** Pontos podem ter validade
- **Acumulação:** Pontos não expiram se usados para ativação

### 11.2.2 Pontos de Renovação
**Regra:** Pontos de renovação são necessários para manutenção.

- **Período:** Pontos são necessários mensalmente
- **Volume:** Volume de vendas gera pontos
- **Conversão:** Pontos podem ser convertidos de volume
- **Perda:** Pontos não usados são perdidos

### 11.2.3 Pontos de Qualificação
**Regra:** Pontos de qualificação são necessários para progressão.

- **Acumulação:** Pontos se acumulam no tempo
- **Rede:** Pontos da rede contam para qualificação
- **Validade:** Pontos podem ter validade
- **Regressão:** Perda de pontos pode causar regressão

---

# REGRAS DE QUALIFICAÇÃO E PROGRESSÃO

## 12.1 Regras de Progressão

### 12.1.1 Critérios de Progressão
**Regra:** Progressão depende de múltiplos critérios.

- **Pontos:** Total de pontos acumulados
- **Volume:** Volume de vendas da rede
- **Diretos:** Número de diretos qualificados
- **Equipe:** Tamanho da equipe qualificada
- **Tempo:** Tempo mínimo em qualificação atual

### 12.1.2 Tempo de Progressão
**Regra:** Progressão requer tempo mínimo em cada nível.

- **Período mínimo:** X meses em cada qualificação
- **Manutenção:** Requisitos devem ser mantidos
- **Grace period:** Período de carência antes de regressão
- **Histórico:** Histórico de qualificações é mantido

## 12.2 Regras de Regressão

### 12.2.1 Condições de Regressão
**Regra:** Qualificação pode regredir se requisitos não mantidos.

- **Pontos:** Perda de pontos abaixo do mínimo
- **Volume:** Volume abaixo do mínimo
- **Diretos:** Perda de diretos qualificados
- **Equipe:** Equipe abaixo do mínimo
- **Tempo:** Após grace period

### 12.2.2 Impacto da Regressão
**Regra:** Regressão afeta benefícios do distribuidor.

- **Comissões:** Porcentagem de comissão reduzida
- **Gerações:** Menos gerações pagas
- **Bônus:** Perda de bônus especiais
- **Limite:** Limite de saque reduzido

---

# REGRAS DE GESTÃO DE ESTOQUE

## 13.1 Regras de Controle de Estoque

### 13.1.1 Reserva de Estoque
**Regra:** Estoque é reservado quando pedido é criado.

- **Reserva:** Quantidade é reservada imediatamente
- **Duração:** Reserva dura até confirmação ou cancelamento
- **Liberação:** Estoque é liberado se pedido cancelado
- **Confirmação:** Reserva vira dedução permanente se confirmado

### 13.1.2 Estoque Mínimo
**Regra:** Estoque mínimo gera alertas de reabastecimento.

- **Limite:** Limite mínimo é configurado por produto
- **Alerta:** Alerta é gerado quando estoque atinge limite
- **Notificação:** Responsável é notificado
- **Bloqueio:** Produto pode ser bloqueado se estoque zero

### 13.1.3 Estoque Negativo
**Regra:** Estoque negativo não é permitido em condições normais.

- **Bloqueio:** Sistema impede estoque negativo
- **Exceção:** Pode ser permitido em casos especiais
- **Correção:** Deve ser corrigido manualmente
- **Auditoria:** Estoque negativo é auditado

## 13.2 Regras de Reabastecimento

### 13.2.1 Processo de Reabastecimento
**Regra:** Reabastecimento segue processo definido.

- **Solicitação:** Solicitação de reabastecimento
- **Aprovação:** Aprovação da solicitação
- **Recebimento:** Recebimento do estoque
- **Atualização:** Atualização do estoque no sistema

### 13.2.2 Previsão de Estoque
**Regra:** Sistema pode prever necessidade de reabastecimento.

- **Histórico:** Baseado em histórico de vendas
- **Tendência:** Considera tendência de vendas
- **Sazonalidade:** Considera sazonalidade
- **Alerta:** Alerta antecipado de necessidade

---

# CONCLUSÃO

Este documento formaliza TODAS as regras de negócio identificadas através de engenharia reversa da plataforma AllInBrasil. As regras aqui documentadas representam o conhecimento de domínio crítico que deve ser considerado em qualquer desenvolvimento, manutenção ou evolução do sistema.

**Próximos Passos Sugeridos:**
1. Validar estas regras com stakeholders de negócio
2. Priorizar implementação de regras críticas
3. Documentar exceções e casos especiais
4. Criar casos de teste para cada regra
5. Implementar validações automáticas no código

**Manutenção:**
Este documento deve ser revisado e atualizado sempre que:
- Novas regras de negócio forem implementadas
- Regras existentes forem modificadas
- Exceções ou casos especiais forem identificados
- Stakeholders solicitarem esclarecimentos
