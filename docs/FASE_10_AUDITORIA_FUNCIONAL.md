# FASE 10 — AUDITORIA FUNCIONAL COMPLETA DA PLATAFORMA

**Data de Início:** 06/06/2026
**Status:** EM ANDAMENTO

---

## CONTEXTO

As fases anteriores corrigiram:
- Arquitetura
- Auth
- Lazy Loading
- Bundle
- Hooks
- Duplicações
- TypeScript

Agora o foco passa a ser: **VALIDAÇÃO FUNCIONAL TOTAL DA PLATAFORMA**

O objetivo é garantir que todos os módulos estejam exibindo dados corretos, utilizando consultas corretas, respeitando permissões corretas e executando fluxos corretos.

---

## OBJETIVO

Auditar 100% das funcionalidades acessíveis pela sidebar.

Validar:
- Páginas
- Componentes
- Widgets
- Tabelas
- Gráficos
- Modais
- Abas
- Filtros
- Ações
- Permissões

---

## MAPA DE AUDITORIA

### EXECUTIVO
- [ ] Dashboard Executivo
- [ ] Insights
- [ ] Alertas

### CRM
- [ ] Distribuidores
- [ ] Rede
- [ ] Genealogia
- [ ] Comissões

### COMERCIAL
- [ ] Pedidos
- [ ] Produtos
- [ ] Planos

### FINANCEIRO
- [ ] Carteiras

### MARKETING
- [ ] Campanhas

### SISTEMA
- [ ] Admin e Auditoria
- [ ] Configurações

### ADMIN MASTER
- [ ] Auditoria completa

### AUDITORIAS TRANSVERSAIS
- [ ] Permissões
- [ ] Modais
- [ ] Abas
- [ ] Queries
- [ ] Customer 360

---

## RELATÓRIO DE AUDITORIA

---

## EXECUTIVO

### Dashboard Executivo

**STATUS:** QUEBRADO

**Arquivos:**
- `src/routes/_app/analytics.tsx`
- `src/hooks/analytics/useAnalytics.ts`
- `src/services/analytics/index.ts`
- `src/services/orders/index.ts`

**Validações:**
- [x] KPIs
- [x] Métricas
- [x] Gráficos
- [x] Totais
- [x] Filtros

**Problemas Encontrados:**

#### 🔴 CRÍTICO - Dados Mockados no Gráfico de Cohort
**Local:** `src/routes/_app/analytics.tsx` linha 78
```typescript
const cohort = Array.from({ length: 12 }).map((_, i) => ({ mes: `M${i + 1}`, retencao: Math.max(20, 100 - i * 4) }));
```
**Descrição:** O gráfico de "Ciclo operacional" exibe dados HARDCODED, não vem do banco de dados. Isso é completamente falso e enganoso.

**Causa Raiz:** Desenvolvedor não implementou query real para dados de retenção/cohort.

**Impacto:** Alto - Usuários tomam decisões baseadas em dados falsos.

**Correção Recomendada:** Implementar query real para calcular retenção de clientes por período (cohort analysis) usando dados de pedidos e cadastros.

**Prioridade:** CRÍTICA

---

#### 🔴 CRÍTICO - Cálculo de "Ano Anterior" é Fake
**Local:** `src/routes/_app/analytics.tsx` linha 38
```typescript
ano_anterior: Number(order.valor_total || 0) * 0.82
```
**Descrição:** O gráfico de "Receita vs ano anterior" multiplica o valor atual por 0.82 arbitrariamente. Não é dado real do ano anterior.

**Causa Raiz:** Desenvolvedor não implementou query para dados históricos reais.

**Impacto:** Alto - Usuários veem comparação falsa de crescimento.

**Correção Recomendada:** Implementar query para buscar dados do ano anterior e calcular comparação real YoY (Year-over-Year).

**Prioridade:** CRÍTICA

---

#### 🟡 MÉDIO - Inconsistência de Nomes de Campos
**Local:** `src/routes/_app/analytics.tsx` e `src/services/orders/index.ts`
**Descrição:** O código usa múltiplos nomes de campos para o mesmo conceito:
- `valor_total`, `valor_total_pedido`, `total_amount` (valor do pedido)
- `data_criacao_pedido`, `created_at` (data do pedido)
- `status`, `status_pedido` (status do pedido)

**Causa Raiz:** Schema do banco inconsistente ou código não migrado corretamente.

**Impacto:** Médio - Pode causar problemas de integridade de dados e bugs em queries.

**Correção Recomendada:** Padronizar nomes de campos no banco e migrar todo o código para usar os nomes padronizados. Documentar schema oficial.

**Prioridade:** ALTA

---

#### 🟡 MÉDIO - Gráfico "Volume por Etapa" com Dados Sem Sentido
**Local:** `src/routes/_app/analytics.tsx` linhas 66-75
```typescript
const networkLegs = useMemo(() => {
  const total = Number(statsData?.data?.totalOrders || 0);
  const active = Number(statsData?.data?.deliveredOrders || 0);
  const pending = Number(statsData?.data?.pendingOrders || 0);
  return [
    { name: "Pedidos", esquerda: total, direita: active },
    { name: "Entregues", esquerda: active, direita: pending },
    { name: "Faturamento", esquerda: Number(statsData?.data?.totalRevenue || 0), direita: Number(statsData?.data?.processingOrders || 0) },
  ];
}, [statsData]);
```
**Descrição:** O gráfico mapeia dados de forma arbitrária e sem sentido lógico. "Faturamento" usa totalRevenue na esquerda e processingOrders na direita - mistura valores monetários com contagem de pedidos.

**Causa Raiz:** Desenvolvedor não definiu claramente o que o gráfico deveria mostrar.

**Impacto:** Médio - Usuários não conseguem interpretar os dados corretamente.

**Correção Recomendada:** Redefinir o propósito do gráfico ou remover se não tiver utilidade clara. Se manter, usar dados consistentes (ex: volume por status de pedido).

**Prioridade:** MÉDIA

---

#### 🟢 BAIXO - Mix por Forma de Pagamento Pode Estar Incompleto
**Local:** `src/routes/_app/analytics.tsx` linhas 57-64
**Descrição:** O cálculo de mix por forma de pagamento usa `forma_pagamento` mas não valida se o campo existe em todos os registros ou se há valores nulos.

**Causa Raiz:** Falta de validação de dados.

**Impacto:** Baixo - Pode ter dados faltando no gráfico.

**Correção Recomendada:** Adicionar validação para tratar valores nulos/undefined e agrupar "outro" para formas não mapeadas.

**Prioridade:** BAIXA

---

#### 🟢 BAIXO - getCustomerName Tem Lógica Complexa e Frágil
**Local:** `src/routes/_app/analytics.tsx` linhas 43-55
**Descrição:** A função tenta múltiplas correspondências (user_id, customer_id, comprador, usuario) e se não encontrar retorna "Cliente" genérico.

**Causa Raiz:** Schema inconsistente de relacionamento entre orders e customers.

**Impacto:** Baixo - Pode exibir nomes incorretos ou genéricos.

**Correção Recomendada:** Padronizar o relacionamento entre orders e customers (usar sempre customer_id) e simplificar a lógica.

**Prioridade:** BAIXA

---

### Insights

**STATUS:** QUEBRADO

**Arquivos:**
- `src/routes/_app/insights.tsx`
- `src/components/widgets/insight-card.tsx`

**Validações:**
- [x] Cálculos
- [x] Recomendações
- [x] Métricas utilizadas

**Problemas Encontrados:**

#### 🔴 CRÍTICO - Insights Não São Reais - Apenas Lista de Eventos
**Local:** `src/routes/_app/insights.tsx` linhas 14-42
```typescript
const insights = useMemo(() => {
  const payments = paymentsResult?.data?.data || [];
  const orders = ordersResult?.data?.data || [];
  const customers = (customersResult as any)?.data?.data || [];

  return [
    ...(payments as any).map((p: any) => ({
      id: `pay-${p.id}`,
      title: "Pagamento registrado",
      detail: `Método ${p.payment_method || p.payment_method_type || "-"}`,
      severity: "success",
      action: "Abrir",
    })),
    ...(orders as any).map((o: any) => ({
      id: `ord-${o.id}`,
      title: "Pedido atualizado",
      detail: `Status ${o.status_pedido || o.status || "-"}`,
      severity: "info",
      action: "Abrir",
    })),
    ...(customers as any).map((c: any) => ({
      id: `cus-${c.id}`,
      title: "Cliente ativo",
      detail: getCustomerLabel(c),
      severity: "warning",
      action: "Abrir",
    })),
  ].slice(0, 9);
}, [paymentsResult, ordersResult, customersResult]);
```
**Descrição:** A página de "Insights da IA" não contém insights, cálculos ou recomendações reais. É apenas uma lista simples de pagamentos, pedidos e clientes transformados em cards. Não há inteligência ou análise envolvida.

**Causa Raiz:** Desenvolvedor não implementou lógica de insights/IA, apenas transformou dados brutos em cards.

**Impacto:** Alto - Usuários esperam insights inteligentes mas recebem apenas lista de eventos. Título "Insights da IA" é enganoso.

**Correção Recomendada:** Implementar lógica real de insights:
- Análise de tendências de vendas
- Detecção de anomalias
- Recomendações baseadas em dados
- Alertas inteligentes
- Ou renomear a página para "Eventos Recentes" se não houver intenção de implementar IA

**Prioridade:** CRÍTICA

---

#### 🟡 MÉDIO - Severidade Fixa Sem Lógica Real
**Local:** `src/routes/_app/insights.tsx` linhas 24, 31, 38
**Descrição:** A severidade dos insights é fixa (success para pagamentos, info para pedidos, warning para clientes) sem análise real do contexto ou importância do evento.

**Causa Raiz:** Falta de lógica para determinar severidade baseada em contexto.

**Impacto:** Médio - Usuários não conseguem identificar eventos realmente importantes.

**Correção Recomendada:** Implementar lógica de severidade baseada em:
- Valor monetário (pagamentos altos = mais severos)
- Status crítico (pedidos cancelados = mais severos)
- Tempo desde o evento (eventos recentes = mais severos)
- Impacto no negócio

**Prioridade:** MÉDIA

---

#### 🟡 MÉDIO - Título Enganoso
**Local:** `src/routes/_app/insights.tsx` linha 48
```typescript
<PageHeader eyebrow="Executive · Intelligence" title="Insights da IA" subtitle="Sinais derivados de eventos reais no Supabase." />
```
**Descrição:** O título "Insights da IA" sugere que há inteligência artificial envolvida, mas não há nenhuma lógica de IA implementada.

**Causa Raiz:** Desenvolvedor usou título aspiracional sem implementar a funcionalidade.

**Impacto:** Médio - Usuários são enganados sobre as capacidades do sistema.

**Correção Recomendada:** Renomear para "Eventos Recentes" ou implementar lógica real de IA/insights.

**Prioridade:** MÉDIA

---

#### 🟢 BAIXO - Uso de `as any` Remove Type Safety
**Local:** `src/routes/_app/insights.tsx` linhas 15-17, 20, 27, 34
**Descrição:** Múltiplos usos de `as any` removem a segurança de tipos do TypeScript.

**Causa Raiz:** Desenvolvedor não definiu tipos corretos para os dados.

**Impacto:** Baixo - Pode causar erros em runtime se a estrutura dos dados mudar.

**Correção Recomendada:** Definir tipos TypeScript para os dados de insights.

**Prioridade:** BAIXA

---

### Alertas

**STATUS:** QUEBRADO

**Arquivos:**
- `src/routes/_app/alerts.tsx`
- `src/hooks/alerts/useAlerts.ts`

**Validações:**
- [x] Regras de geração
- [x] Severidade
- [x] Quantidade exibida

**Problemas Encontrados:**

#### 🔴 CRÍTICO - Alertas Não São Reais - Apenas Transformação de Eventos
**Local:** `src/hooks/alerts/useAlerts.ts` linhas 10-22
```typescript
const [payments, withdrawals, orders] = await Promise.all([
  PaymentService.fetchRecentPayments(5),
  WalletService.fetchRecentWithdrawals(5),
  OrderService.fetchOrdersList(5),
]);
const items = [
  ...(withdrawals || []).map((w: any) => ({ id: `w-${w.id}`, title: "Saque em processamento", domain: "financeiro", at: w.created_at, severity: w.risco ? "critical" : "warning" })),
  ...(payments || []).map((p: any) => ({ id: `p-${p.id}`, title: "Pagamento registrado", domain: "payments", at: p.created_at, severity: "info" })),
  ...(orders || []).map((o: any) => ({ id: `o-${o.id}`, title: "Pedido atualizado", domain: "orders", at: o.created_at, severity: "info" })),
];
```
**Descrição:** O sistema de alertas não possui regras de geração reais. É apenas uma transformação simples de pagamentos, saques e pedidos em cards de alerta. Não há lógica para detectar eventos críticos, anomalias ou situações que realmente requerem atenção.

**Causa Raiz:** Desenvolvedor não implementou sistema de regras para geração de alertas, apenas transformou eventos brutos.

**Impacto:** Alto - Usuários esperam sistema de alertas inteligente mas recebem apenas lista de eventos recentes. Não há detecção de problemas reais.

**Correção Recomendada:** Implementar sistema real de alertas com regras como:
- Saques acima de valor X
- Pedidos cancelados em alta quantidade
- Pagamentos falhados
- Clientes inativos por período Y
- Comissões não pagas
- Ou renomear para "Eventos Recentes" se não houver intenção de implementar alertas reais

**Prioridade:** CRÍTICA

---

#### 🟡 MÉDIO - Severidade Baseada em Campo "risco" Pode Não Existir
**Local:** `src/hooks/alerts/useAlerts.ts` linha 17
```typescript
severity: w.risco ? "critical" : "warning"
```
**Descrição:** A severidade de saques depende do campo `risco` que pode não existir no schema ou não estar preenchido corretamente.

**Causa Raiz:** Assunção de schema sem validação.

**Impacto:** Médio - Alertas críticos podem não ser identificados corretamente.

**Correção Recomendada:** Validar se o campo `risco` existe e tem valores válidos. Implementar lógica alternativa para determinar severidade (ex: valor do saque).

**Prioridade:** MÉDIA

---

#### 🟡 MÉDIO - Severidade Fixa para Pagamentos e Pedidos
**Local:** `src/hooks/alerts/useAlerts.ts` linhas 18-19
```typescript
...(payments || []).map((p: any) => ({ id: `p-${p.id}`, title: "Pagamento registrado", domain: "payments", at: p.created_at, severity: "info" })),
...(orders || []).map((o: any) => ({ id: `o-${o.id}`, title: "Pedido atualizado", domain: "orders", at: o.created_at, severity: "info" })),
```
**Descrição:** Todos os pagamentos e pedidos têm severidade "info" fixa, sem análise do contexto ou importância.

**Causa Raiz:** Falta de lógica para determinar severidade baseada em contexto.

**Impacto:** Médio - Eventos importantes podem ser ignorados por terem severidade baixa.

**Correção Recomendada:** Implementar lógica de severidade baseada em:
- Valor monetário (pagamentos/pedidos altos = mais severos)
- Status (pedidos cancelados = mais severos)
- Tempo desde o evento

**Prioridade:** MÉDIA

---

#### 🟡 MÉDIO - Título Enganoso
**Local:** `src/routes/_app/alerts.tsx` linha 12
```typescript
<PageHeader eyebrow="Executive" title="Alertas operacionais" subtitle="Eventos críticos detectados em dados reais." />
```
**Descrição:** O título "Alertas operacionais" e subtítulo "Eventos críticos detectados" sugerem sistema inteligente de detecção, mas não há lógica real.

**Causa Raiz:** Desenvolvedor usou título aspiracional sem implementar funcionalidade.

**Impacto:** Médio - Usuários são enganados sobre as capacidades do sistema.

**Correção Recomendada:** Renomear para "Eventos Recentes" ou implementar lógica real de detecção de alertas.

**Prioridade:** MÉDIA

---

#### 🟢 BAIXO - Uso de `as any` Remove Type Safety
**Local:** `src/hooks/alerts/useAlerts.ts` linhas 17-19
**Descrição:** Uso de `as any` remove segurança de tipos do TypeScript.

**Causa Raiz:** Desenvolvedor não definiu tipos corretos para os dados.

**Impacto:** Baixo - Pode causar erros em runtime se a estrutura dos dados mudar.

**Correção Recomendada:** Definir tipos TypeScript para os dados de alertas.

**Prioridade:** BAIXA

---

## CRM

### Distribuidores

**STATUS:** PARCIAL

**Arquivos:**
- `src/routes/_app/customers/index.tsx`
- `src/routes/_app/customers/$id.tsx`
- `src/hooks/customers/useCustomers.ts`
- `src/hooks/customers/useCustomer360Data.ts`
- `src/services/customers/index.ts`
- `src/components/customers/`

**Validações:**
- [x] Listagem
- [x] Paginação
- [x] Filtros
- [x] Perfil
- [x] Customer360

**Problemas Encontrados:**

#### 🟡 MÉDIO - Hook useCustomers Não Retorna orderStats
**Local:** `src/hooks/customers/useCustomers.ts` e `src/routes/_app/customers/index.tsx`
```typescript
// useCustomers.ts
return useQuery({
  queryKey: queryKeys.customers,
  queryFn: CustomerService.fetchCustomersList as any,
});

// index.tsx linha 35
const orderStats = (data as any)?.orderStats || {};
```
**Descrição:** O hook `useCustomers` chama `fetchCustomersList` que retorna apenas array de clientes, mas a página espera `orderStats` (estatísticas de pedidos por cliente). Isso resulta em orderStats sempre vazio/undefined.

**Causa Raiz:** Hook usa função errada - deveria usar `fetchCustomersWithOrderStats` que retorna `{ customers, orderStats }`.

**Impacto:** Médio - LTV e contagem de pedidos não aparecem na listagem de clientes.

**Correção Recomendada:** Alterar `useCustomers` para usar `CustomerService.fetchCustomersWithOrderStats`.

**Prioridade:** ALTA

---

#### 🟡 MÉDIO - Paginação Client-Side Ineficiente
**Local:** `src/routes/_app/customers/index.tsx` linhas 42-56
```typescript
const filtered = useMemo(
  () =>
    customers.filter(
      (c) =>
        (qual === "all" || (c.qualification || "") === qual) &&
        (q === "" || getCustomerLabel(c).toLowerCase().includes(q.toLowerCase())),
    ),
  [q, qual, customers],
);

const totalPages = Math.ceil(filtered.length / pageSize);
const paginatedCustomers = useMemo(() => {
  const startIndex = (currentPage - 1) * pageSize;
  return filtered.slice(startIndex, startIndex + pageSize);
}, [filtered, currentPage, pageSize]);
```
**Descrição:** A paginação é feita no frontend após buscar todos os clientes (limit=100). Para grandes volumes isso é ineficiente e não escala.

**Causa Raiz:** Falta de paginação no backend (Supabase).

**Impacto:** Médio - Performance degrada com mais clientes. Limite fixo de 100 clientes.

**Correção Recomendada:** Implementar paginação no backend usando range() do Supabase e passar page/limit como parâmetros.

**Prioridade:** MÉDIA

---

#### 🟡 MÉDIO - Filtro de Qualificação Hardcoded
**Local:** `src/routes/_app/customers/index.tsx` linha 93
```typescript
{["all", "Bronze", "Prata", "Ouro", "Diamante", "Black"].map((v) => (
```
**Descrição:** As qualificações são hardcoded no componente. Se novas qualificações forem adicionadas no banco, não aparecerão no filtro.

**Causa Raiz:** Filtro não é dinâmico baseado nos dados reais.

**Impacto:** Médio - Filtro pode ficar desatualizado em relação ao banco.

**Correção Recomendada:** Extrair qualificações únicas dos dados dos clientes ou ter configuração centralizada.

**Prioridade:** MÉDIA

---

#### 🟡 MÉDIO - LTV Calculado no Frontend
**Local:** `src/services/customers/index.ts`` linhas 58-75
```typescript
const statsMap: Record<string, { count: number; ltv: number }> = {};
if (allOrders) {
  allOrders.forEach((o: any) => {
    const cid = o.customer_id;
    if (!cid) return;
    if (!statsMap[cid]) {
      statsMap[cid] = { count: 0, ltv: 0 };
    }
    statsMap[cid].count += 1;

    const isPaid = ["pago", "entregue", "enviado"].includes(
      (o.status_pedido || o.status || "").toLowerCase()
    );
    if (isPaid) {
      statsMap[cid].ltv += Number(o.valor_total_pedido || o.valor_total || 0);
    }
  });
}
```
**Descrição:** O cálculo de LTV (Lifetime Value) é feito no frontend iterando sobre todos os pedidos. Isso é ineficiente e não escala.

**Causa Raiz:** Falta de agregação no banco ou view materializada.

**Impacto:** Médio - Performance degrada com mais pedidos. Cálculo pode ser inconsistente.

**Correção Recomendada:** Implementar view materializada no Supabase ou usar RPC para calcular LTV no banco.

**Prioridade:** MÉDIA

---

#### 🟢 BAIXO - Uso de `as any` Remove Type Safety
**Local:** `src/hooks/customers/useCustomers.ts` linha 8
```typescript
queryFn: CustomerService.fetchCustomersList as any,
```
**Descrição:** Uso de `as any` remove segurança de tipos do TypeScript.

**Causa Raiz:** Desenvolvedor não definiu tipos corretos para o retorno.

**Impacto:** Baixo - Pode causar erros em runtime se a estrutura dos dados mudar.

**Correção Recomendada:** Definir tipos TypeScript para o retorno de fetchCustomersList.

**Prioridade:** BAIXA

---

#### 🟢 BAIXO - Inconsistência de Nomes de Campos
**Local:** `src/services/customers/index.ts` e `src/routes/_app/customers/index.tsx`
**Descrição:** Código usa múltiplos nomes para o mesmo conceito:
- `phone` vs `telefone` (telefone)
- `valor_total_pedido` vs `valor_total` (valor do pedido)
- `status_pedido` vs `status` (status do pedido)

**Causa Raiz:** Schema inconsistente ou código não migrado.

**Impacto:** Baixo - Pode causar bugs em queries e exibição de dados.

**Correção Recomendada:** Padronizar nomes de campos no banco e migrar código.

**Prioridade:** BAIXA

---

#### 🟢 BAIXO - Botão "Mais Filtros" Não Funcional
**Local:** `src/routes/_app/customers/index.tsx` linhas 108-110
```typescript
<Button variant="outline" size="sm" className="ml-auto gap-1.5">
  <Filter className="h-3.5 w-3.5" /> Mais filtros
</Button>
```
**Descrição:** Botão de "Mais filtros" não tem funcionalidade implementada.

**Causa Raiz:** Funcionalidade não implementada.

**Impacto:** Baixo - Usuário clica mas nada acontece.

**Correção Recomendada:** Implementar funcionalidade ou remover botão.

**Prioridade:** BAIXA

---

### Customer 360

**STATUS:** FUNCIONANDO

**Arquivos:**
- `src/routes/_app/customers/$id.tsx`
- `src/hooks/customers/useCustomer360Data.ts`
- `src/hooks/customers/useCustomer360.ts`
- `src/components/customers/`

**Validações:**
- [x] Perfil
- [x] Pedidos
- [x] Pagamentos
- [x] Comissões
- [x] Wallet
- [x] Rede
- [x] Qualificação
- [x] Eventos
- [x] Timeline

**Problemas Encontrados:**

#### 🟢 BAIXO - Correção Anterior Aplicada
**Descrição:** O hook `useCustomer360Data` foi corrigido anteriormente para remover query duplicada de customer. Agora usa apenas `useCustomer360` que busca todos os dados de forma unificada.

**Status:** ✅ CORRIGIDO

**Prioridade:** N/A

---

### Rede

**STATUS:** QUEBRADO

**Arquivos:**
- `src/routes/_app/network.tsx`
- `src/hooks/network/useNetwork.ts`
- `src/hooks/network/useNetworkMembers.ts`
- `src/services/network/`

**Validações:**
- [x] Membros
- [x] Totais
- [x] Indicadores

**Problemas Encontrados:**

#### 🔴 CRÍTICO - Dados do Treemap São Fake
**Local:** `src/routes/_app/network.tsx` linha 15
```typescript
const data = customers.map((c: any) => ({ name: ((c as any).name || c.usuario || c.id_comprador || "D").split(" ")[0], size: Math.max(1, Number(c.id ? 1 : 0)) * 100 }));
```
**Descrição:** O "Mapa de calor da rede" usa dados completamente fake. O `size` é calculado como `Math.max(1, Number(c.id ? 1 : 0)) * 100`, o que significa que todos os clientes têm exatamente o mesmo tamanho (100). Não representa volume, comissões, ou qualquer métrica real.

**Causa Raiz:** Desenvolvedor não implementou cálculo real de métricas de rede.

**Impacto:** Alto - Usuários veem visualização enganosa da rede que não representa a realidade.

**Correção Recomendada:** Implementar cálculo real de métricas por cliente (volume pessoal, comissões, número de downlines, etc.) para o tamanho no treemap.

**Prioridade:** CRÍTICA

---

#### 🔴 CRÍTICO - KPIs "Equilíbrio Binário" e "Ciclos Pagos" São Hardcoded
**Local:** `src/routes/_app/network.tsx` linhas 35-36
```typescript
<KpiCard label="Equilíbrio binário" value="--" />
<KpiCard label="Ciclos pagos" value="--" accent="warning" />
```
**Descrição:** KPIs importantes para rede MLM são hardcoded como "--". Não há cálculo real de equilíbrio binário ou ciclos pagos.

**Causa Raiz:** Funcionalidade não implementada.

**Impacto:** Alto - Usuários não conseguem ver métricas críticas da rede binária.

**Correção Recomendada:** Implementar cálculo real de:
- Equilíbrio binário (razão entre perna esquerda e direita)
- Ciclos pagos (número de ciclos completados e pagos)
- Baseado em dados reais da estrutura de rede

**Prioridade:** CRÍTICA

---

#### 🟡 MÉDIO - Hook Não Usa Rede do Usuário Logado
**Local:** `src/hooks/network/useNetwork.ts` linhas 10-12
```typescript
const [customerData, relationshipData] = await Promise.all([
  CustomerService.fetchRecentCustomers(20),
  NetworkService.fetchRecentNetworkRelationships(limit),
]);
```
**Descrição:** O hook busca clientes recentes (20) e relacionamentos recentes, mas não filtra pela rede do usuário logado. Mostra dados globais em vez da rede específica do usuário.

**Causa Raiz:** Falta de filtro por usuário/patrocinador.

**Impacto:** Médio - Usuário vê dados de toda a plataforma em vez de sua própria rede.

**Correção Recomendada:** Adicionar filtro para buscar apenas rede do usuário logado (baseado em patrocinador_comprador ou similar).

**Prioridade:** ALTA

---

#### 🟢 BAIXO - Duplicação: useNetworkMembers Wrapper de useNetwork
**Local:** `src/hooks/network/useNetworkMembers.ts`
```typescript
export function useNetworkMembers(limit = 500) {
  return useNetwork(limit);
}
```
**Descrição:** `useNetworkMembers` é apenas um wrapper de `useNetwork` que não adiciona funcionalidade. Duplicação já identificada e corrigida anteriormente.

**Causa Raiz:** Hook criado desnecessariamente.

**Impacto:** Baixo - Apenas duplicação de código.

**Correção Recomendada:** Já corrigido anteriormente - usar useNetwork diretamente.

**Prioridade:** N/A (Já corrigido)

---

### Genealogia

**STATUS:** NÃO IMPLEMENTADO

**Arquivos:**
- Não encontrado

**Validações:**
- [ ] Árvore
- [ ] Patrocinadores
- [ ] Descendentes
- [ ] Volumes

**Problemas Encontrados:**

#### 🔴 CRÍTICO - Funcionalidade Não Implementada
**Descrição:** Não há página ou componente de genealogia/árvore de rede implementado.

**Causa Raiz:** Funcionalidade não desenvolvida.

**Impacto:** Alto - Usuários não conseguem visualizar estrutura hierárquica da rede.

**Correção Recomendada:** Implementar visualização de árvore de genealogia com:
- Estrutura hierárquica (patrocinador → descendentes)
- Níveis de profundidade
- Volumes por nível
- Navegação pela árvore

**Prioridade:** CRÍTICA

---

### Comissões

**STATUS:** QUEBRADO

**Arquivos:**
- `src/routes/_app/commissions.tsx`
- `src/hooks/commissions/useCommissions.ts`
- `src/modules/plans/mlm-rules.ts`

**Validações:**
- [x] Cálculo
- [x] Histórico
- [x] Regras
- [x] Totais

**Problemas Encontrados:**

#### 🔴 CRÍTICO - Dados de Comissões São Fake
**Local:** `src/hooks/commissions/useCommissions.ts` linhas 19-26
```typescript
const rows = (payments || []).map((p: any, i: number) => ({
  id: p.id || i,
  ciclo: `Lançamento #${i + 1}`,
  qualificados: Number(p.quantity || 1),
  pago: Number(p.amount || 0),
  status: i < 2 ? "processando" : "pago",
  planKey: p.plan_id || p.plan_name || p.plano_id || null,
}));
```
**Descrição:** O hook mapeia payments para "ciclos" de forma artificial. O nome do ciclo é fake (`Lançamento #${i + 1}`), o status é fake baseado no índice (`i < 2 ? "processando" : "pago"`), e não há cálculo real de comissões baseado em regras MLM.

**Causa Raiz:** Sistema de cálculo de comissões não implementado. Apenas transformação de payments em "ciclos".

**Impacto:** Alto - Usuários veem dados falsos de comissões que não refletem a realidade do plano de compensação.

**Correção Recomendada:** Implementar sistema real de cálculo de comissões:
- Criar tabela de comissões calculadas
- Implementar lógica de cálculo baseado em regras do plano (binário, unilevel, gerações)
- Calcular ciclos reais baseados em volume e estrutura de rede
- Registrar histórico de pagamentos de comissões

**Prioridade:** CRÍTICA

---

#### 🔴 CRÍTICO - Simulação de Bônus Usa Dados Fake
**Local:** `src/routes/_app/commissions.tsx` linhas 17-20
```typescript
const total = rows.reduce((sum, r) => sum + Number(r.pago || 0), 0);
const plan = plans[0];
const activeDirects = customers.filter((c) => String(c.patrocinador_comprador || "").length > 0 && (c.status || "").toLowerCase() === "active").length;
const simulation = computeGenerationBonus(plan?.name, total || 1000, activeDirects);
```
**Descrição:** A simulação de bônus usa dados calculados artificialmente (total dos rows fake, contagem de diretos ativos) e passa para função de simulação. Não representa cálculo real de comissões.

**Causa Raiz:** Sistema de comissões não implementado, usando simulação em produção.

**Impacto:** Alto - Usuários veem simulação como se fossem dados reais de comissões.

**Correção Recomendada:** Implementar cálculo real de comissões ou remover simulação e indicar que funcionalidade não está implementada.

**Prioridade:** CRÍTICA

---

#### 🟡 MÉDIO - Botão "Rodar Ciclo" Não Funcional
**Local:** `src/routes/_app/commissions.tsx` linha 36
```typescript
actions={<Button size="sm">Rodar ciclo</Button>}
```
**Descrição:** Botão "Rodar ciclo" não tem funcionalidade implementada (sem onClick).

**Causa Raiz:** Funcionalidade não implementada.

**Impacto:** Médio - Usuário clica mas nada acontece.

**Correção Recomendada:** Implementar funcionalidade de rodar ciclo de cálculo de comissões ou remover botão.

**Prioridade:** MÉDIA

---

#### 🟡 MÉDIO - Não Há Tabela Real de Comissões
**Descrição:** Os dados exibidos vêm da tabela de payments, não de uma tabela dedicada de comissões calculadas. Não há persistência de comissões calculadas.

**Causa Raiz:** Schema do banco não tem tabela de comissões.

**Impacto:** Médio - Não há histórico real de comissões pagas.

**Correção Recomendada:** Criar tabela de comissões no banco com campos:
- id, user_id, ciclo_id, tipo_comissao, valor, status, data_pagamento, regras_aplicadas

**Prioridade:** ALTA

---

### RESUMO EXECUTIVO - CRM

**Total de Módulos Auditados:** 4/4
- ✅ Distribuidores: PARCIAL (7 problemas)
- ✅ Rede: QUEBRADO (4 problemas)
- ✅ Genealogia: NÃO IMPLEMENTADO (1 problema)
- ✅ Comissões: QUEBRADO (4 problemas)

**Problemas Críticos:** 4
**Problemas Alta Prioridade:** 2
**Problemas Média Prioridade:** 5
**Problemas Baixa Prioridade:** 3

---

## COMERCIAL

### Pedidos

**STATUS:** PARCIAL

**Arquivos:**
- `src/routes/_app/orders/index.tsx`
- `src/hooks/orders/useOrderList.ts`
- `src/hooks/orders/useOrders.ts`
- `src/services/orders/index.ts`

**Validações:**
- [x] Pedidos
- [x] Status
- [x] Sincronização

**Problemas Encontrados:**

#### 🟡 MÉDIO - Paginação Não Implementada
**Local:** `src/hooks/orders/useOrderList.ts` e `src/services/orders/index.ts`
```typescript
// useOrderList.ts
export function useOrderList(limit = 60) {
  return useQuery({
    queryKey: [...queryKeys.orders, "list", limit],
    queryFn: () => OrderService.fetchOrdersAndCustomers(limit),
  });
}

// orders/index.ts fetchOrdersAndCustomers
const [{ data: ordersData, error: ordersError }, { data: customersData, error: customersError }] = await Promise.all([
  supabase.from("orders").select("*").order("created_at", { ascending: false }).limit(limit),
  ...
]);
```
**Descrição:** A página de pedidos usa um limite fixo de 60 registros sem paginação real. Para grandes volumes, isso é ineficiente e não escala.

**Causa Raiz:** Falta de paginação no backend (Supabase).

**Impacto:** Médio - Performance degrada com mais pedidos. Limite fixo de 60 pedidos.

**Correção Recomendada:** Implementar paginação no backend usando range() do Supabase e adicionar controles de paginação na UI.

**Prioridade:** MÉDIA

---

#### 🟡 MÉDIO - Não Há Filtros por Status, Data ou Cliente
**Local:** `src/routes/_app/orders/index.tsx`
**Descrição:** A página de pedidos não tem filtros por status, período de data ou cliente. Usuário não consegue filtrar pedidos específicos.

**Causa Raiz:** Funcionalidade não implementada.

**Impacto:** Médio - Usuário precisa navegar por todos os pedidos para encontrar o que deseja.

**Correção Recomendada:** Implementar filtros:
- Status (pago, pendente, enviado, entregue, cancelado)
- Período de data
- Cliente (busca)
- Valor mínimo/máximo

**Prioridade:** MÉDIA

---

#### 🟢 BAIXO - Inconsistência de Nomes de Campos
**Local:** `src/routes/_app/orders/index.tsx` e `src/services/orders/index.ts`
**Descrição:** Código usa múltiplos nomes para o mesmo conceito:
- `status_pedido` vs `status` (status do pedido)
- `valor_total_pedido` vs `valor_total` (valor do pedido)
- `numero_pedido` vs `id` (identificador do pedido)

**Causa Raiz:** Schema inconsistente ou código não migrado.

**Impacto:** Baixo - Pode causar bugs em queries e exibição de dados.

**Correção Recomendada:** Padronizar nomes de campos no banco e migrar código.

**Prioridade:** BAIXA

---

#### 🟢 BAIXO - Campo Items Pode Não Estar Sendo Carregado
**Local:** `src/routes/_app/orders/index.tsx` linha 90
```typescript
{Array.isArray(o.items) ? o.items.length : 0}
```
**Descrição:** A query de orders usa `select("*")` mas o campo `items` pode não estar sendo carregado se for uma tabela relacionada ou JSONB. O check `Array.isArray` sugere incerteza sobre a estrutura.

**Causa Raiz:** Schema não documentado ou query não otimizada.

**Impacto:** Baixo - Contagem de itens pode estar incorreta.

**Correção Recomendada:** Verificar schema da tabela orders e ajustar query para carregar items corretamente (join ou select específico).

**Prioridade:** BAIXA

---

#### 🟢 BAIXO - Não Há Sincronização com Sistema Externo
**Descrição:** Não há evidência de sincronização de pedidos com sistema externo (ERP, gateway de pagamento, etc.). Os dados parecem vir apenas do Supabase.

**Causa Raiz:** Integração não implementada ou não necessária.

**Impacto:** Baixo - Se houver sistema externo, pedidos podem não estar sincronizados.

**Correção Recomendada:** Verificar se há necessidade de sincronização com sistema externo e implementar se necessário.

**Prioridade:** BAIXA

---

### Produtos

**STATUS:** PENDENTE

**Arquivos:**
- `src/routes/products.tsx`
- `src/components/products/`
- `src/hooks/products/`

**Validações:**
- [ ] Catálogo
- [ ] Estoque
- [ ] Preços

**Problemas Encontrados:**

**Causa Raiz:**

**Impacto:**

**Correção Recomendada:**

**Prioridade:**

---

### Planos

**STATUS:** PENDENTE

**Arquivos:**
- `src/routes/office/plan.tsx`
- `src/components/plans/`
- `src/hooks/plans/`

**Validações:**
- [ ] Regras
- [ ] Benefícios
- [ ] Elegibilidade

**Problemas Encontrados:**

**Causa Raiz:**

**Impacto:**

**Correção Recomendada:**

**Prioridade:**

---

## FINANCEIRO

### Carteiras

**STATUS:** PENDENTE

**Arquivos:**
- `src/routes/wallets.tsx`
- `src/components/wallets/`
- `src/hooks/wallets/`

**Validações:**
- [ ] Saldo
- [ ] Extrato
- [ ] Movimentações
- [ ] Comparação com banco

**Problemas Encontrados:**

**Causa Raiz:**

**Impacto:**

**Correção Recomendada:**

**Prioridade:**

---

## MARKETING

### Campanhas

**STATUS:** PENDENTE

**Arquivos:**
- `src/routes/marketing.tsx`
- `src/components/marketing/`

**Validações:**
- [ ] Métricas
- [ ] Participantes
- [ ] Resultados

**Problemas Encontrados:**

**Causa Raiz:**

**Impacto:**

**Correção Recomendada:**

**Prioridade:**

---

## SISTEMA

### Admin e Auditoria

**STATUS:** PENDENTE

**Arquivos:**
- `src/routes/system.tsx`
- `src/components/system/`
- `src/hooks/system/`

**Validações:**
- [ ] Logs
- [ ] Rastreamento
- [ ] Filtros

**Problemas Encontrados:**

**Causa Raiz:**

**Impacto:**

**Correção Recomendada:**

**Prioridade:**

---

### Configurações

**STATUS:** PENDENTE

**Arquivos:**
- `src/routes/settings.tsx`
- `src/components/settings/`

**Validações:**
- [ ] Persistência
- [ ] Permissões
- [ ] Efeitos

**Problemas Encontrados:**

**Causa Raiz:**

**Impacto:**

**Correção Recomendada:**

**Prioridade:**

---

## ADMIN MASTER

**STATUS:** PENDENTE

**Validações:**
- [ ] Acesso
- [ ] Permissões
- [ ] Visibilidade
- [ ] Restrições

**Problemas Encontrados:**

**Causa Raiz:**

**Impacto:**

**Correção Recomendada:**

**Prioridade:**

---

## AUDITORIA DE PERMISSÕES

**STATUS:** PENDENTE

**Mapeamento:**
- [ ] Roles
- [ ] Permissions
- [ ] Guards
- [ ] Middlewares

**Verificação:**
- [ ] Quem deveria ver vs quem realmente vê
- [ ] Quem deveria editar vs quem realmente edita

**Matriz de Permissões:**

**Problemas Encontrados:**

**Causa Raiz:**

**Impacto:**

**Correção Recomendada:**

**Prioridade:**

---

## AUDITORIA DE MODAIS

**STATUS:** PENDENTE

**Modais Identificados:**

| Modal | Abertura | Fechamento | Carregamento | Salvamento | Atualização | Erro |
|-------|----------|------------|--------------|------------|-------------|------|
|       |          |            |              |            |             |      |

**Problemas Encontrados:**

**Causa Raiz:**

**Impacto:**

**Correção Recomendada:**

**Prioridade:**

---

## AUDITORIA DE ABAS

**STATUS:** PENDENTE

**Abas Identificadas:**

| Aba | Troca | Queries | Cache | Dados | Sincronização |
|-----|-------|---------|-------|-------|---------------|
|     |       |         |       |       |               |

**Problemas Encontrados:**

**Causa Raiz:**

**Impacto:**

**Correção Recomendada:**

**Prioridade:**

---

## AUDITORIA DE QUERIES

**STATUS:** PENDENTE

**Por Página:**

| Página | Query Utilizada | Fonte | Transformação | Cache | Hooks | Consistência |
|--------|-----------------|-------|---------------|-------|-------|--------------|
|        |                 |       |               |       |       |              |

**Problemas Encontrados:**

**Causa Raiz:**

**Impacto:**

**Correção Recomendada:**

**Prioridade:**

---

## AUDITORIA CUSTOMER 360

**STATUS:** PENDENTE (Fluxo Prioritário)

**Validações:**
- [ ] Perfil
- [ ] Pedidos
- [ ] Pagamentos
- [ ] Comissões
- [ ] Wallet
- [ ] Rede
- [ ] Qualificação
- [ ] Eventos
- [ ] Timeline

**Fonte de Verdade:**

**Problemas Encontrados:**

**Causa Raiz:**

**Impacto:**

**Correção Recomendada:**

**Prioridade:**

---

## SCORE FINAL

### Confiabilidade dos Dados
- **Status:** PENDENTE
- **Score:** ___/100

### Confiabilidade das Permissões
- **Status:** PENDENTE
- **Score:** ___/100

### Confiabilidade dos Fluxos
- **Status:** PENDENTE
- **Score:** ___/100

### Confiabilidade dos Dashboards
- **Status:** PENDENTE
- **Score:** ___/100

### Confiabilidade Financeira
- **Status:** PENDENTE
- **Score:** ___/100

### Confiabilidade Geral
- **Status:** PENDENTE
- **Score:** ___/100

---

## RESUMO EXECUTIVO

**Total de Módulos Auditados:** 0/22
**Funcionando:** 0
**Parcial:** 0
**Quebrado:** 0

**Problemas Críticos:** 0
**Problemas Alta Prioridade:** 0
**Problemas Média Prioridade:** 0
**Problemas Baixa Prioridade:** 0

---

## PRÓXIMOS PASSOS

1. Iniciar auditoria pelo Dashboard Executivo
2. Seguir ordem de prioridade: EXECUTIVO → CRM → COMERCIAL → FINANCEIRO → MARKETING → SISTEMA
3. Documentar cada finding antes de corrigir
4. Priorizar Customer 360 como fluxo crítico
