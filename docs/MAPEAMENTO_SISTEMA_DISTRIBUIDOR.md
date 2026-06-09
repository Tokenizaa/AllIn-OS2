# Mapeamento Estrutural do Sistema do Escritório do Distribuidor - AllInBrasil

## Visão Geral da Arquitetura

O sistema do escritório do distribuidor da AllInBrasil é uma aplicação web monopágina (SPA) com layout responsivo baseado em sidebar de navegação. O sistema utiliza uma estrutura de componentes modulares com padrões consistentes de UI/UX.

**URL Base:** `https://allinbrasil.com.br/distribuidor`

## Estrutura de Navegação

### Menu Principal (Sidebar Esquerda)

O sistema utiliza uma barra lateral fixa com os seguintes itens de navegação:

1. **Página Inicial** - Dashboard principal
2. **Meu Plano** - Detalhes do plano contratado
3. **Meus Pedidos** - Histórico de pedidos
4. **Loja Virtual** ▾ - Submenu expansível
5. **Meus Dados** ▾ - Submenu expansível
6. **Verificação de conta** - Upload de documentos
7. **Financeiro** ▾ - Submenu expansível
8. **Relatórios** ▾ - Submenu expansível
9. **Minha Rede** ▾ - Submenu expansível
10. **Downloads** - Área de downloads

**Padrão de Submenus:**
- Ícone de seta (▾/▴) indica estado expandido/colapsado
- Clique no item principal expande/colapsa o submenu
- Submenus são listas aninhadas dentro do item pai
- Itens ativos são destacados visualmente

## Componentes de UI Comuns

### Header Superior

**Elementos:**
- Logo da empresa (link para página inicial)
- Botão de menu mobile (hambúrguer)
- Seletor de idioma (dropdown)
- Avatar do usuário com dropdown de perfil
- Ícone de logout

**Comportamento:**
- Logo sempre visível e clicável
- Dropdown de perfil mostra opções de conta
- Seletor de idioma permite troca de locale

### Breadcrumb de Navegação

**Estrutura:**
- Localizado abaixo do header
- Formato: Página inicial > Seção atual > Subseção
- Links clicáveis para navegação reversa
- Separador visual entre itens

### Componentes de Tabela

**Estrutura Padrão:**
- Cabeçalho com colunas
- Linhas de dados
- Paginação no rodapé
- Botões de ação por linha
- Filtros e busca no topo

**Elementos de Ação:**
- Botão "Exportar" (ícone + texto)
- Botão "Adicionar Filtros" (ícone + texto)
- Botão "Limpar" (ícone + texto)
- Ícones de ordenação nas colunas
- Ações por linha (editar, excluir, visualizar)

### Componentes de Formulário

**Campos Comuns:**
- Inputs de texto
- Combobox/dropdowns
- Datepickers
- Upload de arquivos
- Textareas
- Checkboxes e radio buttons
- Campos de busca com autocomplete

**Validação:**
- Mensagens de erro inline
- Indicadores de campo obrigatório (*)
- Validação em tempo real
- Feedback visual de sucesso/erro

### Componentes de Card/Widget

**Dashboard Cards:**
- Título
- Valor principal
- Ícone ilustrativo
- Cor de fundo por categoria
- Link para detalhes

**Cards de Informação:**
- Título
- Conteúdo
- Botão de ação
- Ícone decorativo

## Detalhamento das Seções

### 1. Página Inicial (Dashboard)

**URL:** `https://allinbrasil.com.br/distribuidor/PaginaInicialDistribuidor/Inicio/principal`

**Layout:**
- Grid de cards de estatísticas (2x2 ou responsivo)
- Seção de links de indicação
- Lista de últimas movimentações
- Widgets de informações rápidas

**Componentes:**
- Cards de KPI (Key Performance Indicators)
- Cards de saldo financeiro
- Cards de contagem de rede
- Lista de transações recentes
- Seção de links de compartilhamento
- Cards de alertas/notificações

**Tipos de Cards:**
- Cadastros Diretos (contador)
- Saldos Financeiros (valor monetário)
- Bônus Recebidos (valor monetário)
- Links de Indicação (links copiáveis)
- Cadastros Pendentes (contador)
- Downloads (contador)

### 2. Meu Plano

**URL:** `https://allinbrasil.com.br/distribuidor/Planos/MeuPlano`

**Layout:**
- Card principal com informações do plano
- Lista de benefícios do kit
- Informações de aquisição
- Status do distribuidor

**Componentes:**
- Card de informações do plano
- Lista de benefícios (bullet points)
- Badge de status
- Data de aquisição
- Informações do kit

### 3. Meus Pedidos

**URL:** `https://allinbrasil.com.br/distribuidor/LinkExterno/LojaVirtual/acessar?rota=account/order&customer_group_id=2020`

**Layout:**
- Tabela de pedidos
- Filtros de busca
- Paginação
- Ações por pedido

**Componentes:**
- Tabela com colunas: Pedido, Data, Status, Valor, Produtos
- Botão "Comprar Novamente"
- Botão "Visualizar Detalhes"
- Filtros por período
- Filtro por status
- Paginação

**Estrutura da Tabela:**
- Header com colunas ordenáveis
- Linhas com dados do pedido
- Expansível para mostrar produtos
- Ações no final da linha

### 4. Loja Virtual

**Submenu:**
- Compra padrão

**Layout:**
- Link externo para loja virtual
- Abre em nova aba/janela

**Componentes:**
- Link de navegação
- Ícone indicador de link externo

### 5. Meus Dados

**Submenu:**
- Contas Bancárias
- Editar Dados Distribuidor

#### 5.1 Contas Bancárias

**URL:** `https://allinbrasil.com.br/distribuidor/ContaBancaria/DistribuidorContaBancaria/listar`

**Layout:**
- Tabela de contas cadastradas
- Botão "Adicionar"
- Botão "Exportar"
- Filtros

**Componentes:**
- Tabela com colunas: ID, Nome, Banco, Tipo Chave PIX, Tipo, Chave Pix, Ações
- Botão "Adicionar" (ícone +)
- Botão "Exportar"
- Ações por linha (editar, excluir)
- Mensagem de "Nenhum dado encontrado" quando vazio

#### 5.2 Editar Dados Distribuidor

**Layout:**
- Formulário de edição
- Seções organizadas
- Botão de salvar

**Componentes:**
- Formulário com campos de dados pessoais
- Seções: Dados Pessoais, Endereço, Contato
- Validação de campos
- Botão "Salvar"
- Botão "Cancelar"

### 6. Verificação de conta

**URL:** `https://allinbrasil.com.br/distribuidor/VerificacaoConta/DistribuidorEnviarArquivo/formulario`

**Layout:**
- Formulário de upload
- Lista de documentos necessários
- Área de drag-and-drop

**Componentes:**
- Lista de documentos solicitados
- Campos de upload por documento
- Filtro por nome do documento
- Área de upload com drag-and-drop
- Preview de arquivos
- Validação de formato (jpg, png, pdf, doc, docx)
- Botão "Enviar"
- Progress bar de upload

### 7. Financeiro

**Submenu:**
- Solicitar saque
- Transações

#### 7.1 Transações

**URL:** `https://allinbrasil.com.br/distribuidor/Contas/ContasTransacoesDistribuidor/listar/1`

**Layout:**
- Abas de tipo de conta
- Tabela de transações
- Resumo financeiro
- Filtros por período

**Componentes:**
- Tab navigation (Saldo Loja Online, Saldo Perdido, Saldo a receber, Saldo para Compra, Saldo Retido)
- Tabela de transações
- Cards de resumo (Total Crédito, Total Débito, Saldo)
- Filtro de período (date range picker)
- Botão "Exportar"
- Botão "Limpar"

**Estrutura das Abas:**
- Tab navigation horizontal
- Conteúdo muda dinamicamente
- Tab ativa destacada
- Resumo financeiro por aba

### 8. Relatórios

**Submenu:**
- Relatório Pedidos Clientes Finais
- Relatório Bonificação Mensal

#### 8.1 Relatório Pedidos Clientes Finais

**URL:** `https://allinbrasil.com.br/distribuidor/Compras/LojaOrderRelatorioComprasClientesFinais/listar`

**Layout:**
- Tabela de pedidos
- Filtros avançados
- Exportação

**Componentes:**
- Tabela com colunas: Pedido, Situação, Loja, Cliente, Endereço, Estado, Bairro, Cidade, CEP, Telefone, Forma de Entrega, Pedido Pago, Data de criação, Data de pagamento, Valor Total
- Filtros por período
- Filtro por status
- Botão "Exportar"
- Paginação

#### 8.2 Relatório Bonificação Mensal

**URL:** `https://allinbrasil.com.br/distribuidor/Bonus/RelatorioBonificacaoMensal/listarPorBonusDistribuidor`

**Layout:**
- Tabela de bônus
- Filtro por período
- Detalhamento por mês

**Componentes:**
- Tabela com colunas: Bônus, Valor Pago, Ações
- Filtro de período
- Botão "Limpar"
- Link "Ver Por Mês"
- Card de resumo total
- Botão "Exportar"

### 9. Minha Rede

**Submenu:**
- Minha Equipe
- Rede Linear - Organograma
- Cadastros Pendentes

#### 9.1 Minha Equipe

**URL:** `https://allinbrasil.com.br/distribuidor/RedeLinear/RedeLinear`

**Layout:**
- Lista de distribuidores
- Filtros de busca
- Expansão de níveis
- Resumo por geração

**Componentes:**
- Lista hierárquica com expand/collapse
- Campo de busca
- Filtro por status
- Ícones de expandir/colapsar
- Tabela de resumo por geração
- Avatar de cada distribuidor
- Badge de status (Ativo/Inativo)

**Estrutura da Lista:**
- Itens aninhados por nível
- Botão de expandir por item
- Indentação visual por nível
- Ícone de status

#### 9.2 Rede Linear - Organograma

**URL:** `https://allinbrasil.com.br/distribuidor/RedeLinear/Organograma`

**Layout:**
- Visualização gráfica hierárquica
- Modo tela cheia
- Navegação interativa

**Componentes:**
- Árvore visual interativa
- Nós com avatar e nome
- Linhas de conexão
- Botão "Tela Cheia"
- Zoom e pan
- Tooltips com informações

#### 9.3 Cadastros Pendentes

**URL:** `https://allinbrasil.com.br/distribuidor/Planos/CadastrosPendentes`

**Layout:**
- Tabela de cadastros
- Filtros
- Ações

**Componentes:**
- Tabela com colunas: ID, Imagem, Usuário, Nome, E-mail, Cidade/Estado, Data Cadastro, Ações
- Botão "Exportar"
- Filtros
- Ações por linha (aprovar, rejeitar)
- Mensagem de "Nenhum dado encontrado" quando vazio

### 10. Downloads

**URL:** `https://allinbrasil.com.br/distribuidor/Download/DownloadsDistribuidor/listar`

**Layout:**
- Tabela de arquivos
- Filtros por categoria
- Paginação

**Componentes:**
- Tabela com colunas: Descrição, Categoria, Ação
- Filtro por categoria
- Campo de busca
- Botão "Exportar"
- Ícone de download por arquivo
- Paginação
- Categorias: Contratos, Treinamentos, Premiações, Campanhas, Videos all-in

## Padrões de Design e UX

### Sistema de Cores

**Identificação Visual:**
- Cor primária: Tons de azul/azul escuro
- Cores de status:
  - Verde para status ativo/positivo
  - Vermelho para status inativo/negativo
  - Amarelo para alertas/pending
- Cores de cards: Variações por categoria de dado
- Background: Branco/cinza claro

### Tipografia

**Hierarquia Visual:**
- Títulos: Font-size grande, peso bold
- Subtítulos: Font-size médio, peso semibold
- Texto de corpo: Font-size padrão, peso regular
- Labels de formulário: Font-size pequeno, peso semibold
- Texto secundário: Cor cinza, tamanho reduzido

### Ícones

**Sistema de Ícones:**
- Font Awesome ou similar
- Ícones consistentes por funcionalidade:
  - Dashboard: 📊
  - Financeiro: 💰
  - Rede: 👥
  - Downloads: 📥
  - Editar: ✏️
  - Excluir: 🗑️
  - Exportar: 📤
  - Filtros: 🔍

### Responsividade

**Breakpoints:**
- Desktop: Layout completo com sidebar
- Tablet: Sidebar colapsável
- Mobile: Menu hambúrguer, layout empilhado

**Adaptações:**
- Tabelas com scroll horizontal em mobile
- Cards empilhados em telas pequenas
- Botões de ação adaptados para touch
- Font sizes ajustados por viewport

### Estados de Loading

**Indicadores Visuais:**
- Spinners em botões durante ações
- Skeleton screens para carregamento de tabelas
- Progress bars para uploads
- Overlay de loading para ações assíncronas

### Feedback de Usuário

**Mensagens:**
- Toast notifications para sucesso/erro
- Modais para confirmações
- Alerts inline para validações
- Tooltips para informações adicionais

### Acessibilidade

**Recursos:**
- Labels associados aos inputs
- Texto alternativo em imagens
- Navegação por teclado
- Contraste adequado
- Focus states visíveis

## Padrões de Navegação

### URL Structure

**Padrão de Rotas:**
```
/distribuidor/{Modulo}/{Controlador}/{Ação}
```

**Exemplos:**
- `/distribuidor/PaginaInicialDistribuidor/Inicio/principal`
- `/distribuidor/Contas/ContasTransacoesDistribuidor/listar/1`
- `/distribuidor/RedeLinear/RedeLinear`

### Parâmetros de URL

**Tipos Comuns:**
- `per_page`: Para paginação
- `page`: Número da página atual
- Filtros como query parameters
- IDs de recursos no path

### Navegação SPA

**Comportamento:**
- Navegação sem recarregar página
- Histórico de navegação mantido
- Lazy loading de componentes
- Transições suaves entre seções

## Padrões de Dados

### Estrutura de Tabelas

**Campos Comuns:**
- ID (identificador único)
- Nome/Descrição
- Data de criação
- Status
- Ações (botões)

### Estrutura de Formulários

**Organização:**
- Agrupamento por seções
- Validação por campo
- Submissão assíncrona
- Feedback de sucesso/erro

### Estrutura de Cards

**Elementos:**
- Título
- Conteúdo principal
- Subtítulo/opcional
- Ação/opcional
- Ícone/opcional

## Integrações

### Links Externos

**Tipos:**
- Loja virtual (nova aba)
- YouTube (nova aba)
- Canva (nova aba)
- Google Docs (nova aba)
- S3 para downloads

### APIs

**Padrões Observados:**
- Requisições assíncronas
- JSON como formato de dados
- Paginação server-side
- Filtros via query parameters

## Conclusão

O sistema do escritório do distribuidor da AllInBrasil apresenta uma arquitetura bem estruturada com:

**Pontos Fortes:**
- Navegação intuitiva com sidebar consistente
- Componentes de UI reutilizáveis e padronizados
- Layout responsivo e adaptável
- Feedback visual claro para ações do usuário
- Estrutura modular com separação clara de responsabilidades

**Padrões Identificados:**
- Uso consistente de tabelas com paginação
- Formulários com validação inline
- Cards para apresentação de informações
- Abas para organização de conteúdo
- Modais para ações secundárias

**Arquitetura Sugerida para Implementação:**
- Component-based architecture
- State management centralizado
- Routing configurável
- API layer abstraída
- Sistema de design tokens
- Component library reutilizável
