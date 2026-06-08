# Auditoria Frontend - Integração Completa

**Data:** 29/04/2026  
**Versão:** 1.0  
**Objetivo:** Validar que 100% das páginas, componentes, widgets, modais, abas, dashboards, gráficos, cards e tabelas estejam utilizando dados reais do backend e do banco de dados.

---

## Resumo Executivo

Esta auditoria identificou **9 problemas críticos** relacionados a dados fictícios, hardcoded ou desconectados do banco de dados. A maioria das áreas da aplicação está corretamente integrada com o Supabase, mas existem componentes específicos que requerem correção.

**Status Geral:** ⚠️ **ATENÇÃO REQUERIDA** - 9 problemas encontrados, 3 de alta severidade

---

## Estrutura da Aplicação

### Rotas Principais

**Área Administrativa (_app):**
- `/analytics` - Dashboard Executivo
- `/insights` - Insights da IA
- `/alerts` - Alertas operacionais
- `/network` - Genealogia inteligente
- `/commissions` - Comissões & Ciclos
- `/wallets` - Carteiras & Saques
- `/marketing` - Campanhas & Comunicação
- `/settings` - Configurações
- `/system` - Admin & Auditoria
- `/plans` - Planos MLM
- `/products/` - Catálogo de produtos
- `/orders/` - Pedidos
- `/customers/` - Distribuidores
- `/customers/$id` - Customer 360

**Área Office (Distribuidor):**
- `/office/` - Dashboard do Distribuidor
- `/office/copilot` - Copiloto IA
- `/office/orders` - Pedidos
- `/office/network` - Rede
- `/office/finance` - Financeiro
- `/office/profile` - Perfil
- `/office/plan` - Plano
- `/office/store` - Loja
- `/office/reports` - Relatórios
- `/office/downloads` - Downloads
- `/office/verification` - Verificação

**Rotas Públicas:**
- `/` - Landing page
- `/login` - Login
- `/cadastro` - Cadastro
- `/ativacao` - Ativação
- `/seja-distribuidor` - Seja Distribuidor
- `/loja` - Loja Virtual
- `/checkout` - Checkout
- `/busca-produtos` - Busca de Produtos
- `/doencas` - Doenças
- `/produto/$id` - Detalhe do Produto
- `/auth/invite/$token` - Convite de Admin

---

## Problemas Encontrados

### 1. 🔴 CRÍTICO - Fake QRCode e Código PIX Hardcoded

**Arquivo:** `src/routes/ativacao.tsx` (linhas 316-328)

**Problema:**
```typescript
{/* Fake QrCode */}
<div className="h-32 w-32 border border-slate-200 bg-slate-100 flex items-center justify-center text-slate-800 font-bold p-1">
  <div className="grid grid-cols-4 gap-1 w-full h-full p-2 opacity-85">
    {Array.from({ length: 16 }).map((_, i) => (
      <div key={i} className={`rounded-sm ${(i % 3 === 0 || i % 7 === 1) ? "bg-slate-900" : "bg-transparent"}`} />
    ))}
  </div>
</div>
```

**Código PIX Hardcoded:**
```typescript
<p className="text-[10px] text-muted-foreground font-mono truncate max-w-[280px] mx-auto bg-background/50 px-2.5 py-1 rounded border border-border/40">
  00020126580014br.gov.bcb.pix0136allinos-payment-gateway-pix-120000bc
</p>
```

**Impacto:** Usuários não conseguem realizar pagamentos PIX reais. O QR Code é visual apenas e o código é estático.

**Severidade:** 🔴 CRÍTICO

**Recomendação:** Integrar com gateway de pagamento real (Belluno/PagSeguro) para gerar QR Codes dinâmicos e códigos PIX reais.

---

### 2. 🔴 CRÍTICO - Métodos Mock em Serviço de Detecção de Fraude

**Arquivo:** `src/backend/modules/payments/services/fraud-detection.service.ts` (linhas 153-172)

**Problema:**
```typescript
private async getRecentTransactionCount(customerId: string): Promise<number> {
  void customerId;
  // TODO: Implement actual database query
  // For now, return a mock value
  return 0;
}

private async assessIpRisk(ip: string): Promise<{ score: number; factors: string[] }> {
  void ip;
  // TODO: Implement IP geolocation and risk assessment
  // For now, return a mock value
  return { score: 0, factors: [] };
}

private async assessDeviceRisk(deviceId: string): Promise<{ score: number; factors: string[] }> {
  void deviceId;
  // TODO: Implement device fingerprinting and risk assessment
  // For now, return a mock value
  return { score: 0, factors: [] };
}
```

**Impacto:** Sistema de detecção de fraude não funciona corretamente. Risco de transações fraudulentas não serem detectadas.

**Severidade:** 🔴 CRÍTICO

**Recomendação:** Implementar consultas reais ao banco de dados e integração com serviços de geolocalização de IP e device fingerprinting.

---

### 3. 🟡 MÉDIO - Dados Hardcoded em Dashboard do Distribuidor

**Arquivo:** `src/hooks/office/useOfficeDashboard.ts` (linhas 60-65)

**Problema:**
```typescript
const bonusOrigin = [
  { name: "Vendas", value: 45 },
  { name: "Pagamentos", value: 35 },
  { name: "Rede", value: 20 },
];
const topProducts = products.slice(0, 5).map((p: any) => ({ name: p.name || "Produto", qtd: 10, receita: Number(p.price || 0) * 10 }));
```

**Impacto:** Gráfico de origem de bônus mostra valores fixos (45, 35, 20) independentemente dos dados reais. Quantidade de produtos vendidos é hardcoded como 10.

**Severidade:** 🟡 MÉDIO

**Recomendação:** Calcular valores reais de origem de bônus baseados em pagamentos e vendas. Usar dados reais de vendas por produto.

---

### 4. 🟡 MÉDIO - Mensagem Hardcoded no Copiloto IA

**Arquivo:** `src/routes/office/CopilotPage.tsx` (linha 17)

**Problema:**
```typescript
const [messages, setMessages] = useState<ChatMessage[]>([{ id: "m1", sender: "copilot", text: "Olá! Eu agora opero sem dados mockados da camada antiga.", timestamp: "Agora" }]);
```

**Impacto:** Mensagem inicial do chat é estática e não reflete contexto real do usuário.

**Severidade:** 🟡 MÉDIO

**Recomendação:** Remover mensagem hardcoded ou torná-la dinâmica baseada em dados do usuário.

---

### 5. 🟡 MÉDIO - Comentário sobre "Mock Registry" em Convites

**Arquivo:** `src/routes/auth.invite.$token.tsx` (linha 37)

**Problema:**
```typescript
// Look up token in mock registry
const match = getAdminInviteByToken(token);
```

**Impacto:** Comentário sugere uso de mock registry, mas a função `getAdminInviteByToken` parece estar usando dados reais. Comentário é enganoso.

**Severidade:** 🟡 BAIXO

**Recomendação:** Remover ou atualizar comentário para refletir a implementação real.

---

### 6. 🟡 BAIXO - Sistema de Marketing em Desenvolvimento

**Arquivo:** `src/routes/_app/marketing.tsx` (linhas 72-95)

**Problema:**
```typescript
<div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
  <div className="rounded-lg border border-border bg-background/40 p-4">
    <Megaphone className="h-5 w-5 text-muted-foreground" />
    <p className="mt-3 text-xs text-muted-foreground">Campanhas ativas</p>
    <p className="text-2xl font-semibold mt-0.5">--</p>
    <p className="text-[11px] text-muted-foreground mt-1">Em desenvolvimento</p>
  </div>
  {/* ... mais cards com valores "--" */}
</div>
```

**Impacto:** Área de marketing mostra valores hardcoded "--" e indica "Em desenvolvimento". Funcionalidade não implementada.

**Severidade:** 🟡 BAIXO

**Recomendação:** Implementar sistema de marketing ou remover indicação de desenvolvimento se não for prioridade.

---

### 7. 🟡 BAIXO - Feature Flags em LocalStorage

**Arquivo:** `src/routes/_app/settings.tsx` (linhas 18-35)

**Problema:**
```typescript
function useFeatureFlags() {
  const [flags, setFlags] = useState<Record<string, boolean>>(() => {
    // Carregar flags do localStorage ou usar valores padrão
    const saved = localStorage.getItem("feature_flags");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return {};
      }
    }
    return {};
  });

  useEffect(() => {
    // Salvar flags no localStorage quando mudarem
    localStorage.setItem("feature_flags", JSON.stringify(flags));
  }, [flags]);
```

**Impacto:** Feature flags são armazenadas apenas no localStorage do navegador, não sincronizadas com o banco de dados. Diferentes usuários podem ter configurações diferentes.

**Severidade:** 🟡 BAIXO

**Recomendação:** Migrar feature flags para tabela no banco de dados com suporte multi-tenant.

---

### 8. 🟡 BAIXO - Cards com Valores Hardcoded em Sistema

**Arquivo:** `src/routes/_app/system.tsx` (linhas 59-68)

**Problema:**
```typescript
{[
  { title: "Usuarios admin", value: "14 ativos", hint: "RBAC + SSO" },
  { title: "Integracoes", value: "9 conectores", hint: "Pix, ERP, CRM, Email" },
  { title: "Feature flags", value: "28 flags", hint: "Multi-tenant" },
].map((card) => (
  <div key={card.title} className="rounded-xl border border-border bg-card/60 p-4">
    <p className="text-xs text-muted-foreground">{card.title}</p>
    <p className="mt-1 text-xl font-semibold">{card.value}</p>
    <p className="mt-1 text-[11px] text-muted-foreground">{card.hint}</p>
  </div>
))}
```

**Impacto:** Cards mostram valores hardcoded ("14 ativos", "9 conectores", "28 flags") que não refletem dados reais do sistema.

**Severidade:** 🟡 BAIXO

**Recomendação:** Calcular valores reais baseados em consultas ao banco de dados.

---

### 9. 🟢 INFO - Comentários sobre Dados Fake Removidos

**Arquivo:** `src/routes/_app/analytics.tsx` (linhas 38, 79)

**Problema:**
```typescript
// Removido: ano_anterior fake. Se não houver dados históricos reais, não mostrar comparação
// Removido: cohort fake. Implementar cálculo real de retenção se necessário
```

**Impacto:** Comentários indicam que dados fake foram removidos, o que é positivo. No entanto, funcionalidades (comparação ano anterior, cohort) não foram implementadas.

**Severidade:** 🟢 INFO

**Recomendação:** Implementar cálculos reais de comparação ano anterior e retenção (cohort) se necessário para o negócio.

---

## Áreas Auditadas - Status

### ✅ EXECUTIVO
- **Analytics:** ✅ Dados reais via useAnalytics hook
- **Insights:** ✅ Dados reais via useAnalytics hook
- **Alerts:** ✅ Dados reais via useAlerts hook
- **Problema:** Comentários sobre dados fake removidos (INFO)

### ✅ CRM
- **Distribuidores:** ✅ Dados reais via useCustomers hook
- **Rede:** ✅ Dados reais via useNetworkMembers hook
- **Comissões:** ✅ Dados reais via useCommissions hook
- **Customer360:** ✅ Dados reais via useCustomer360Data hook
- **Problema:** Nenhum

### ✅ COMERCIAL
- **Pedidos:** ✅ Dados reais via useOrderList hook
- **Produtos:** ✅ Dados reais via productsService
- **Planos:** ✅ Dados reais via PlansDashboard component
- **Problema:** Dados hardcoded em bonusOrigin e topProducts (MÉDIO)

### ✅ FINANCEIRO
- **Carteiras:** ✅ Dados reais via useWithdrawals hook
- **Saques:** ✅ Dados reais via WalletService
- **Problema:** Nenhum

### ⚠️ MARKETING
- **Campanhas:** ⚠️ Sistema em desenvolvimento, valores hardcoded "--"
- **Problema:** Funcionalidade não implementada (BAIXO)

### ✅ SISTEMA
- **Administração:** ✅ Dados reais via useAuditLogs hook
- **Auditoria:** ✅ Dados reais via useAuditLogs hook
- **Configurações:** ⚠️ Feature flags em localStorage
- **Problema:** Cards com valores hardcoded (BAIXO), Feature flags não sincronizadas (BAIXO)

### ✅ OFFICE (Distribuidor)
- **Dashboard:** ✅ Dados reais via useOfficeDashboard hook
- **Copilot:** ⚠️ Mensagem hardcoded no chat inicial
- **Pedidos:** ✅ Dados reais
- **Rede:** ✅ Dados reais
- **Financeiro:** ✅ Dados reais
- **Problema:** Mensagem hardcoded (MÉDIO)

### ⚠️ ROTAS PÚBLICAS
- **Ativação:** ⚠️ Fake QRCode e código PIX hardcoded
- **Convites:** ⚠️ Comentário sobre mock registry
- **Problema:** Fake QRCode (CRÍTICO), Comentário enganoso (BAIXO)

---

## Serviços e Hooks Auditados

### ✅ Hooks com Dados Reais
- `useAnalytics` - Usa AnalyticsService e CustomerService
- `useAlerts` - Usa AlertService
- `useCustomers` - Usa CustomerService
- `useOrderList` - Usa OrderService
- `useNetworkMembers` - Usa NetworkService
- `useCommissions` - Usa CommissionService
- `useWithdrawals` - Usa WalletService
- `useCustomer360` - Usa CustomerService, OrderService, WalletService
- `useOfficeDashboard` - Usa OrderService, PaymentService, CustomerService, WalletService, ProductService, ProfileService
- `usePlans` - Usa PlanService
- `usePlanAnalytics` - Usa PlanService

### ⚠️ Hooks com Problemas
- `useOfficeDashboard` - Dados hardcoded em bonusOrigin e topProducts

---

## Backend Services Auditados

### ✅ Services com Dados Reais
- AnalyticsService
- CustomerService
- OrderService
- PaymentService
- WalletService
- ProductService
- ProfileService
- PlanService
- CommissionService
- AlertService
- NetworkService

### ⚠️ Services com Problemas
- FraudDetectionService - Métodos retornando valores mock (CRÍTICO)

---

## Recomendações por Prioridade

### 🔴 PRIORIDADE ALTA (Correção Imediata)
1. **Implementar QR Code e código PIX real** em `src/routes/ativacao.tsx`
   - Integrar com gateway de pagamento (Belluno/PagSeguro)
   - Gerar QR Codes dinâmicos baseados em pedidos reais
   - Remover código PIX hardcoded

2. **Implementar detecção de fraude real** em `src/backend/modules/payments/services/fraud-detection.service.ts`
   - Implementar consulta ao banco para contagem de transações recentes
   - Integrar com serviço de geolocalização de IP
   - Implementar device fingerprinting

### 🟡 PRIORIDADE MÉDIA (Correção em Curto Prazo)
3. **Calcular valores reais de origem de bônus** em `src/hooks/office/useOfficeDashboard.ts`
   - Calcular baseado em pagamentos reais
   - Usar dados reais de vendas por produto

4. **Remover mensagem hardcoded** do Copiloto IA
   - Remover mensagem inicial ou torná-la dinâmica

### 🟢 PRIORIDADE BAIXA (Melhorias Futuras)
5. **Implementar sistema de marketing** ou remover indicação de desenvolvimento
6. **Migrar feature flags para banco de dados** com suporte multi-tenant
7. **Calcular valores reais** dos cards de sistema (usuários, integrações, flags)
8. **Implementar comparação ano anterior e cohort** em Analytics se necessário
9. **Atualizar comentário** sobre mock registry em convites

---

## Conclusão

A aplicação frontend está **majoritariamente integrada com dados reais** do Supabase. A maioria dos hooks, services e componentes estão corretamente conectados ao banco de dados.

No entanto, existem **3 problemas críticos** que requerem correção imediata:
1. Fake QRCode e código PIX hardcoded na tela de ativação
2. Métodos mock no serviço de detecção de fraude
3. Dados hardcoded no dashboard do distribuidor

**Recomendação Geral:** Priorizar a correção dos problemas críticos antes de colocar a aplicação em produção, especialmente os relacionados a pagamentos e segurança.

---

## Próximos Passos

1. Corrigir problemas críticos identificados
2. Implementar testes de integração para validar dados reais
3. Adicionar monitoramento para detectar dados fictícios no futuro
4. Documentar padrões para integração de dados reais
5. Revisar periodicamente para garantir que não sejam introduzidos novos dados hardcoded

---

**Relatório gerado automaticamente em 29/04/2026**
