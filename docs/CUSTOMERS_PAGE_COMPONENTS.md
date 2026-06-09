# Análise Completa da Página /customers

## Visão Geral
A página de customers (Distribuidores) consiste em duas páginas principais:
1. **Listagem de Distribuidores** (`/customers`) - Tabela com todos os distribuidores
2. **Customer 360** (`/customers/$id`) - Detalhes completos de um distribuidor específico

---

## 1. Página de Listagem de Distribuidores (`/customers`)

### 1.1 Header da Página
**Componente:** `PageHeader`
- **Eyebrow:** "CRM"
- **Título:** "Distribuidores"
- **Subtítulo:** Mostra total de registros e quantidade de ativos na página
- **Botão de Ação:** "Atualizar base" (Button size="sm")
  - **Ação:** `refetch()` - Recarrega os dados

### 1.2 Banner de Alerta
**Componente:** Div com borda primária
- **Ícone:** `Sparkles` (h-4 w-4 text-primary)
- **Texto:** Mostra quantidade de distribuidores em atenção
- **Botão:** "Recarregar" (Button size="sm", variant="outline")
  - **Ação:** `refetch()` - Recarrega os dados

### 1.3 Barra de Filtros e Busca
**Componentes:**
- **Campo de Busca:** Input com ícone `Search`
  - **Placeholder:** "Buscar por nome ou identificação…"
  - **Estado:** `q` (useState)
  - **Ação:** Filtra por nome ou identificação

- **Select de Planos:** Dropdown
  - **Opções:** "Todos os planos" + planos únicos dos clientes
  - **Estado:** `planoFilter` (useState)
  - **Ação:** Filtra por plano

- **Select de Cidades:** Dropdown
  - **Opções:** "Todas as cidades" + cidades únicas dos clientes
  - **Estado:** `cidadeFilter` (useState)
  - **Ação:** Filtra por cidade

### 1.4 Tabela de Distribuidores
**Componente:** Table com colunas:
- **Distribuidor:** Avatar + Nome + ID
  - **Avatar:** Círculo gradiente (primary to fuchsia-500)
  - **Nome:** Link para `/customers/$id`
  - **ID:** `id_comprador` ou `user_id`
- **Plano:** Texto truncado (max-w-[150px])
- **Cidade:** Texto
- **Status:** Badge com estilos:
  - `active`: bg-success/15 text-success border-success/30
  - `pending`: bg-warning/15 text-warning border-warning/30
  - `blocked`: bg-destructive/15 text-destructive border-destructive/30
  - `churned`: bg-muted text-muted-foreground border-border
- **Pedidos:** Número alinhado à direita
- **LTV:** Valor em BRL alinhado à direita (text-emerald-500)
- **Ação:** Link "Abrir 360" com ícone `ArrowUpRight`

### 1.5 Paginação
**Componente:** Div com controles de paginação
- **Info:** "Exibindo X a Y de Z distribuidores"
- **Select de Itens por Página:** [10, 15, 25, 50, 100]
- **Botão Anterior:** `ChevronLeft` (disabled se página 1)
- **Botões de Página:** Array de até 5 páginas
- **Botão Próximo:** `ChevronRight` (disabled se última página)

---

## 2. Página Customer 360 (`/customers/$id`)

### 2.1 Breadcrumb
**Componente:** Div com links
- **Link:** "Distribuidores" → `/customers`
- **Separador:** "/"
- **Texto:** Nome do cliente

### 2.2 Header da Página
**Componente:** `PageHeader`
- **Eyebrow:** "Customer 360"
- **Título:** Nome do cliente
- **Subtítulo:** Plano · Qualificação · Data de ativação
- **Botões de Ação:**
  1. "Re-sincronizar" (Button size="sm", variant="outline")
     - **Ação:** `refetch()` - Recarrega dados
  2. "Acionar Suporte" (Button size="sm")
     - **Ação:** Não implementado

### 2.3 Grid Superior (Cards)

#### 2.3.1 CustomerProfileCard
**Componente:** Card de perfil do cliente
- **Avatar:** Círculo gradiente (primary to fuchsia-500, h-14 w-14)
- **Nome:** Texto truncado
- **ID:** `id_comprador` ou `usuario`
- **Informações de Contato:**
  - **Email:** Ícone `Mail` + user_id/id_comprador
  - **Telefone:** Ícone `Phone` + telefone
  - **Localização:** Ícone `MapPin` + cidade/estado
  - **CPF:** Ícone `Shield` + CPF
- **Badges:**
  - Qualificação (ex: Bronze)
  - Plano (ex: Integral)
  - Status (com estilos coloridos)
- **Patrocinador:** Card interno com link para perfil do sponsor
  - **Link:** `/customers/$id` + ícone `ArrowUpRight`

#### 2.3.2 CustomerKPIs
**Componente:** Grid de KPIs
- **KPI Cards:**
  1. **LTV:** Valor em BRL
  2. **Total Comprado:** Valor em BRL + hint de pedidos
  3. **Pedidos na Conta:** Número
  4. **Risco de Churn:** Texto
- **Banner de Sincronização:**
  - **Ícone:** `Sparkles` (h-4 w-4 text-primary)
  - **Texto:** "Sincronização Ativa de Ledger: Os dados financeiros, pontos de rede, downlines de genealogia e o histórico detalhado estão sendo carregados e operacionalizados em tempo real a partir das tabelas relacionais do Supabase."

### 2.4 Tabs de Navegação
**Componente:** `Tabs` com 6 abas
- **TabsList:** bg-card/60 border border-border gap-1 p-1
- **TabsTriggers:**
  1. "Timeline"
  2. "Pedidos ({orders.length})"
  3. "Carteira"
  4. "Rede ({downlines.length})"
  5. "Documentos"
  6. "Automações"

---

## 3. Conteúdo das Tabs

### 3.1 Tab Timeline
**Componente:** `CustomerTimelineTab`

#### 3.1.1 Área Principal (2/3)
- **Título:** "Linha do Tempo e Histórico do Distribuidor"
- **Componente:** `Timeline` com eventos:
  - Notas customizadas (CRM)
  - Ficha Operacional (criação do cliente)
  - Últimos 4 pedidos

#### 3.1.2 Área Lateral (1/3)
- **Título:** "Registrar Anotação de CRM"
- **Formulário:**
  - **Textarea:** Placeholder "Insira notas de contato, pendências de suporte, acordos de rede..."
  - **Botão:** "Salvar Histórico" (Button size="sm", w-full)
    - **Ação:** Adiciona nota à timeline
    - **Feedback:** toast.success("Nota salva com sucesso na linha do tempo!")

### 3.2 Tab Pedidos
**Componente:** `CustomerOrdersTab`

#### 3.2.1 Tabela de Pedidos
- **Colunas:**
  - Nº Pedido (font-mono)
  - Status (Badge)
  - Método de pagamento + status
  - Valor do pedido (BRL, alinhado à direita)
  - Data de emissão
- **Estado Vazio:** "Sem pedidos cadastrados para esse cliente."

### 3.3 Tab Carteira
**Componente:** `CustomerWalletTab`

#### 3.3.1 Cards de Saldo (3 cards)
1. **Carteira Monetária (All In Pay)**
   - **Ícone:** `Wallet` (h-6 w-6 text-primary)
   - **Saldo:** Valor em BRL (text-3xl)
   - **Disponível:** Valor para saque imediato
   - **Estado Vazio:** "Carteira não inicializada" + Botão "Criar Carteira"

2. **Conta Fidelidade (Cashback/Network)**
   - **Ícone:** `Coins` (h-6 w-6 text-emerald-500)
   - **Saldo:** Pontos (text-3xl text-emerald-400)
   - **Estatísticas:** Ganhos / Resgatados
   - **Estado Vazio:** "Carteira de Pontos não inicializada" + Botão "Criar Conta de Pontos"

3. **Ações de Ajuste de Saldo**
   - **Descrição:** "Adicione créditos de bônus comercial, comissões de rede, ou debite por reajuste administrativo em lote."
   - **Botão:** "Lançar Movimentação" / "Esconder Lançador"
     - **Estado:** `showAddTx` (useState)
     - **Ação:** Toggle do formulário de lançamento

#### 3.3.2 Formulário de Lançamento (condicional)
- **Título:** "Lançamento Financeiro Manual"
- **Campos:**
  - **Tipo:** Select [Crédito, Débito]
  - **Valor (R$):** Input number (step="0.01")
  - **Descrição / Motivo:** Input text
- **Botões:**
  - "Cancelar" (variant="outline")
  - "Confirmar Transação"
- **Ação:** `handleAddTransaction()`

#### 3.3.3 Extrato Histórico
- **Título:** "Extrato Histórico da Carteira Financeira"
- **Tabela:**
  - **Colunas:** ID Ref, Data, Evento/Detalhes, Natureza, Valor, Saldo Resultante
  - **Natureza:** Badge [Crédito/Débito] com cores
  - **Valor:** + ou - com cores (emerald/red)
  - **Estado Vazio:** "Nenhum lançamento ou movimentação financeira disponível no extrato desta conta."

### 3.4 Tab Rede
**Componente:** `CustomerNetworkTab`

#### 3.4.1 Header
- **Título:** "Parceiros da Rede (Indicações Diretas)"
- **Descrição:** "Listagem em tempo real de distribuidores cujo sponsor direta é @{id}"
- **Badge:** "{downlines.length} Diretos Cadastrados"

#### 3.4.2 Tabela de Downlines
- **Colunas:**
  - Distribuidor (nome)
  - Código / ID com.
  - Graduação (Badge)
  - Status de Conta (Badge com estilos)
  - Cidade/UF
  - Data Cadastro
  - Ação: Link "Ver 360" com ícone `ArrowUpRight`
- **Estado Vazio:** Card com ícone `Users` + "Sem indicações diretas"

### 3.5 Tab Documentos
**Componente:** `CustomerDocumentsTab`

#### 3.5.1 Header
- **Título:** "Compliance Regulatório e Documentação"
- **Descrição:** "Controle, auditoria e validação de envios obrigatórios para garantir repasse legal e fiscal de comissões"

#### 3.5.2 Grid (2 colunas)

**Coluna 1: Lista de Documentos**
- **Título:** "Lista de Envio de Documentos"
- **Itens:** Cards de documentos com:
  - **Nome:** Texto truncado
  - **Badge Obrigatório:** (se required=true)
  - **Metadados:** Tipo · Atualizado
  - **Status:** Badge [Aprovado/Pendente/Não Enviado] com ícones
  - **Ações:**
    - **Aprovar:** Button icon com `CheckCircle2` (se status≠approved)
    - **Recusar/Excluir:** Button icon com `Trash2` (se status≠missing)
    - **Simular Upload:** Button icon com `Upload` (se status=missing)

**Coluna 2: Compliance Geral**
- **Título:** "Compliance Geral de Cadastro"
- **Card de Status:**
  - **Ícone:** `Shield` (h-10 w-10 text-emerald-500)
  - **Título:** "Identidade Parcialmente Aprovada"
  - **Descrição:** "Status atual autoriza o recebimento de comissões passivas de rede em pontos, mas bloqueia resgates monetários até aprovação da conta bancária e envio do comprovante de endereço."
- **Notas de Compliance:**
  - Nota 1: Documento bancário deve estar no CPF/CNPJ titular
  - Nota 2: Limites anuais recalculados com PIS/NIT
- **Botões:**
  - "Aprovar Todos" (variant="outline", border-white/20)
  - "Exportar Compliance" (animate-pulse)

### 3.6 Tab Automações
**Componente:** `CustomerAutomationsTab`

#### 3.6.1 Header
- **Título:** "Réguas e Gatilhos de Comunicação Ativas"
- **Descrição:** "Monitore o relacionamento do distribuidor através dos disparos sistêmicos de notificação"
- **Botão:** "Limpar Logs" (variant="outline", border-white/20)
  - **Ação:** toast.success("Estatísticas de disparo limpas e reiniciadas!")

#### 3.6.2 Grid de Automações
- **Layout:** Grid responsivo [1-2-3 colunas]
- **Cards de Automação:**
  - **Header:**
    - **Badge Tipo:** (ex: email, sms, webhook)
    - **Runs:** "Runs: X"
    - **Badge Status:** [Ativo/Pausado] (clicável para toggle)
  - **Conteúdo:**
    - **Nome:** Texto truncado
    - **Descrição:** Texto line-clamp-2
  - **Footer:**
    - **Botão Alternar:** Texto "Alternar" (toggle status)
    - **Botão Forçar Gatilho:** "Forçar Gatilho" (variant="ghost", text-primary)

---

## 4. Estados de Loading e Erro

### 4.1 Loading (Customer 360)
**Componente:** Div com spinner
- **Spinner:** h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent
- **Texto:** "Carregando dados estruturados do Supabase..." (animate-pulse)

### 4.2 Erro (Customer 360)
**Componente:** Div com mensagem de erro
- **Header:** "Cliente não encontrado" + "Falha ao carregar dados do cliente."
- **Mensagem:** Texto do erro em text-destructive

### 4.3 Cliente Não Encontrado
**Componente:** Div com mensagem
- **Header:** "Cliente não encontrado" + "O cliente solicitado não existe."

### 4.4 Loading Skeleton (Listagem)
**Componente:** Linhas da tabela com skeletons
- **Avatar:** h-8 w-8 rounded-full bg-muted animate-pulse
- **Linhas de texto:** h-4 bg-muted rounded animate-pulse

---

## 5. Ícones Utilizados

### Lucide Icons
- **Navegação:** `ArrowUpRight`, `ChevronLeft`, `ChevronRight`
- **Busca:** `Search`, `Filter`
- **Perfil:** `Mail`, `Phone`, `MapPin`, `Shield`
- **Carteira:** `Wallet`, `Coins`
- **Rede:** `Users`
- **Documentos:** `CheckCircle2`, `Clock`, `Trash2`, `Upload`
- **Outros:** `Sparkles`

---

## 6. Componentes UI Reutilizáveis

### shadcn/ui Components
- `PageHeader` - Header de página com eyebrow, título, subtítulo e ações
- `Input` - Campo de input
- `Button` - Botão com variantes (default, outline, ghost)
- `Badge` - Badge com variantes
- `Tabs` - Sistema de abas
- `TabsList` - Lista de abas
- `TabsTrigger` - Gatilho de aba
- `TabsContent` - Conteúdo de aba

### Custom Components
- `KpiCard` - Card de KPI
- `Timeline` - Timeline de eventos
- `CustomerProfileCard` - Card de perfil de cliente
- `CustomerKPIs` - Grid de KPIs de cliente
- `CustomerTimelineTab` - Tab de timeline
- `CustomerOrdersTab` - Tab de pedidos
- `CustomerWalletTab` - Tab de carteira
- `CustomerNetworkTab` - Tab de rede
- `CustomerDocumentsTab` - Tab de documentos
- `CustomerAutomationsTab` - Tab de automações

---

## 7. Hooks Utilizados

### Custom Hooks
- `useCustomers` - Hook para listar clientes
- `useCustomer360Data` - Hook para dados 360 do cliente
- `useWalletTransactions` - Hook para transações de carteira

---

## 8. Serviços Utilizados

### Services
- `DocumentService` - Serviço de documentos
- `AutomationService` - Serviço de automações

### Métodos de Serviço
- `DocumentService.fetchCustomerDocuments(id)` - Buscar documentos
- `DocumentService.updateDocumentStatus(id, status)` - Atualizar status
- `AutomationService.fetchCustomerAutomations(id)` - Buscar automações
- `AutomationService.updateAutomationStatus(id, active)` - Atualizar status
- `AutomationService.incrementAutomationRuns(id)` - Incrementar runs

---

## 9. Utilitários

### Funções Utilitárias
- `getCustomerLabel(customer)` - Obter label do cliente
- `getCustomerInitials(customer)` - Obter iniciais do cliente
- `formatBRL(value)` - Formatar valor para BRL
- `calculateLTV(orders)` - Calcular LTV
- `calculateTotalComprado(orders)` - Calcular total comprado
- `calculateChurnRisk(customer, orders)` - Calcular risco de churn
- `cn(...classes)` - Utilitário de classes CSS

---

## 10. Estados e Gerenciamento

### Estados Locais (useState)
- `q` - Query de busca
- `planoFilter` - Filtro de plano
- `cidadeFilter` - Filtro de cidade
- `currentPage` - Página atual
- `pageSize` - Itens por página
- `customNotes` - Notas customizadas
- `noteText` - Texto da nota
- `showAddTx` - Mostrar formulário de transação
- `txType` - Tipo de transação
- `txAmount` - Valor da transação
- `txDesc` - Descrição da transação
- `documents` - Lista de documentos
- `automations` - Lista de automações
- `isLoading` - Estado de loading

---

## 11. Feedback ao Usuário

### Toast Notifications
- **Sucesso:**
  - "Nota salva com sucesso na linha do tempo!"
  - "Documento aprovado com sucesso."
  - "Todos os documentos regulatórios foram aprovados automaticamente!"
  - "Exportado relatório legal desta conta!"
  - "Automação ativada/pausada."
  - "Disparando webhook/mensagem com sucesso."
  - "Estatísticas de disparo limpas e reiniciadas!"
- **Erro:**
  - "Falha ao aprovar documento."
  - "Falha ao rejeitar documento."
  - "Falha ao enviar documento."
  - "Falha ao aprovar alguns documentos."
  - "Falha ao ativar/pausar automação."
  - "Falha ao disparar gatilho."
- **Warning:**
  - "Documento removido ou reprovado."
- **Info:**
  - "Documento enviado para análise de compliance."

---

## 12. Responsividade

### Breakpoints
- **Mobile:** 1 coluna
- **Tablet:** 2 colunas (md:)
- **Desktop:** 3-4 colunas (lg:)
- **Large Desktop:** 4 colunas (xl:)

### Ajustes Responsivos
- **Grid:** `grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4`
- **Tabela:** Scroll horizontal em mobile
- **Paginação:** Flex column em mobile, row em desktop
- **Filtros:** Flex wrap para adaptação

---

## 13. Acessibilidade

### Atributos ARIA
- Títulos descritivos
- Labels em formulários
- Focus states visíveis
- Contraste de cores adequado
- Text sizes legíveis (text-xs, text-sm)

### Navegação por Teclado
- Tab order correto
- Enter/Space para botões
- Escape para fechar modais (quando implementado)

---

## 14. Performance

### Otimizações
- `useMemo` para filtros e cálculos
- `useEffect` para carregamento de dados
- Lazy loading de componentes
- Skeleton loading states
- Debounce em busca (quando implementado)

---

## 15. Notas de Implementação

### Pendências
- Botão "Acionar Suporte" não implementado
- Modais não implementados (todas as ações são inline)
- Debounce na busca não implementado
- Upload de documentos simulado
- Export de compliance simulado

### Recomendações
- Implementar modais para ações complexas
- Adicionar debounce na busca
- Implementar upload real de documentos
- Adicionar validação de formulários
- Implementar paginação em tabs com muitos dados
- Adicionar filtros avançados
- Implementar export real de compliance
- Adicionar permissões RBAC
