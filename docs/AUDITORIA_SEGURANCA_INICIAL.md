# FASE 7 — AUDITORIA DE SEGURANÇA INICIAL

## DATA
2026-06-05

## ESCOPO
Auditoria completa de segurança do sistema AllIn-OS2

## CRITICALIDADES ENCONTRADAS

### 🔴 CRÍTICO - Exposição de SERVICE_ROLE_KEY

**Localização:** `.env` linha 16
```env
EXTERNAL_SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Problema:** Service Role Key exposta em arquivo de ambiente que pode ser acessado pelo frontend.

**Risco:** 
- Acesso total ao banco de dados
- Bypass completo de RLS
- Criação/alteração de usuários administrativos
- Acesso a dados sensíveis de todos os clientes

**Impacto:** CRÍTICO - Comprometimento total do sistema

---

### 🔴 CRÍTICO - API Key Exposta no Frontend

**Localização:** `.env` linha 39
```env
VITE_EVOLUTION_API_KEY="429683C4C977415CAAFCCE10F7D57E11"
```

**Problema:** API key exposta com prefixo `VITE_` que a torna acessível no navegador.

**Risco:**
- Acesso não autorizado à Evolution API
- Potencial uso de quota/limites
- Exposição de integrações do sistema

**Impacto:** CRÍTICO - Comprometimento de integrações externas

---

### 🔴 CRÍTICO - Credenciais de Banco de Dados Expostas

**Localização:** `.env` linha 21
```env
DATABASE_URL="postgresql://postgres:Netto@964212$@localhost:5434/maxx_db"
```

**Problema:** Senha de banco de dados exposta em texto claro.

**Risco:**
- Acesso direto ao banco de dados
- Exposição de todos os dados do sistema
- Potencial exfiltração de dados

**Impacto:** CRÍTICO - Comprometimento total do banco de dados

---

### 🔴 CRÍTICO - JWT Secret Exposto

**Localização:** `.env` linha 22
```env
JWT_SECRET="your-super-secret-jwt-key-change-in-production-123456789"
```

**Problema:** Segredo JWT exposto e usando valor padrão/fraco.

**Risco:**
- Forjamento de tokens JWT
- Impersonação de qualquer usuário
- Bypass de autenticação

**Impacto:** CRÍTICO - Comprometimento do sistema de autenticação

---

### 🔴 CRÍTICO - Backend Quebrado

**Localização:** `src/backend/infra/database/base.repository.ts`

**Problema:** O repositório base chama `getSupabaseAdminClient()` que lança erro:
```typescript
protected getClient() {
  return getSupabaseAdminClient(); // Isso lança erro!
}
```

**Risco:**
- Backend não funciona
- Operações administrativas impossíveis
- Sistema em estado quebrado

**Impacto:** CRÍTICO - Sistema não funcional

---

### 🟠 ALTO - Múltiplas Instâncias de Cliente Supabase

**Localizações:**
- `src/lib/supabase-client.ts` (Frontend)
- `src/backend/infra/supabase/client.ts` (Backend)

**Problema:** Duplicação de código e configuração inconsistente.

**Risco:**
- Manutenção difícil
- Configurações divergentes
- Potencial uso incorreto

**Impacto:** ALTO - Problemas de manutenção e segurança

---

### 🟠 ALTO - Console.log em Produção

**Localizações:** Múltiplos arquivos
- `src/routes/busca-produtos.tsx` (linhas 99-100)
- `src/routes/busca-produtos.$slug.tsx` (linhas 108-109)
- `src/modules/auth/guards/RouteGuard.tsx` (múltiplas linhas)
- `src/components/LeadCaptureModal.tsx` (linhas 26, 51, 73)
- `src/backend/shared/scripts/audit_rls.ts` (múltiplas linhas)

**Problema:** Console.log expõe informações sensíveis em produção.

**Risco:**
- Exposição de dados internos
- Informações de debug acessíveis
- Potencial vazamento de informações

**Impacto:** ALTO - Vazamento de informações

---

### 🟠 ALTO - Console.error com Detalhes

**Localizações:** Múltiplos arquivos
- `src/services/referralTrackingService.ts`
- `src/services/productsService.ts`
- `src/services/cartService.ts`
- `src/modules/auth/services/supabase.service.ts`
- `src/modules/auth/services/invite.service.ts`

**Problema:** Console.error pode expor stack traces e dados sensíveis.

**Risco:**
- Exposição de erros internos
- Stack traces acessíveis
- Potencial vazamento de dados

**Impacto:** ALTO - Vazamento de informações

---

### 🟡 MÉDIO - Variáveis Sensíveis em .env

**Localização:** `.env`

**Variáveis expostas:**
- `CHATWOOT_API_TOKEN`
- `CHATWOOT_WEBHOOK_SECRET`
- `MCP_ACCESS_TOKEN`
- `REDIS_PASSWORD`
- `CLOUDFLARE_TUNNEL_TOKEN_SISTEMAALLIN`

**Problema:** Credenciais de terceiros expostas em arquivo de ambiente.

**Risco:**
- Acesso não autorizado a serviços terceiros
- Potencial uso indevido de integrações
- Comprometimento de contas externas

**Impacto:** MÉDIO - Comprometimento de integrações

---

### 🟡 MÉDIO - Rotas Administrativas

**Localizações:**
- `src/routes/office/` (11 rotas)
- `src/routes/_app/` (15 rotas)

**Problema:** Rotas administrativas existem mas precisam verificação de proteção adequada.

**Risco:**
- Acesso não autorizado se RLS falhar
- Potencial bypass de controles
- Necessário verificar proteção

**Impacto:** MÉDIO - Necessário verificar proteção

---

## MAPEAMENTO DE ARQUIVOS

### Arquivos Supabase
- `src/lib/supabase-client.ts` - Cliente frontend (OK)
- `src/backend/infra/supabase/client.ts` - Cliente backend (PROBLEMA)
- `src/modules/auth/services/supabase.service.ts` - Serviço de autenticação

### Arquivos de Configuração
- `src/config/env.ts` - Validação de ambiente
- `.env` - Variáveis de ambiente (MÚLTIPLOS PROBLEMAS)
- `.env.example` - Exemplo de configuração
- `.env.local` - Configuração local

### Arquivos de Backend
- `src/backend/infra/database/base.repository.ts` - Repositório base (QUEBRADO)
- `src/backend/api/index.ts` - Exportações de API

### Rotas Administrativas
- `src/routes/office/` - Painel administrativo
- `src/routes/_app/` - Aplicação administrativa

## SCORE DE SEGURANÇA INICIAL

### Cálculo
- **Críticos:** 5
- **Altos:** 3
- **Médios:** 2
- **Baixos:** 0

### Score: 2/10

**Justificativa:**
- Múltiplas exposições de credenciais críticas
- Service Role Key exposta
- Backend quebrado
- API keys no frontend
- Console logs em produção
- Falta de separação clara entre frontend/backend

## RECOMENDAÇÕES IMEDIATAS

1. **Remover SERVICE_ROLE_KEY do .env** e mover para variável de ambiente server-side
2. **Remover VITE_EVOLUTION_API_KEY** e mover para backend
3. **Remover credenciais de banco** do .env e usar variáveis de ambiente server-side
4. **Trocar JWT_SECRET** imediatamente
5. **Corrigir backend** para usar SERVICE_ROLE_KEY adequadamente
6. **Centralizar configuração Supabase** em `src/lib/supabase/`
7. **Remover console.log/console.error** de produção
8. **Implementar tratamento de erros seguro**
9. **Auditar políticas RLS** no banco de dados
10. **Separar variáveis de ambiente** entre frontend e backend

## PRÓXIMOS PASSOS

1. ✅ Auditoria completa
2. ⏳ Correção de problemas críticos
3. ⏳ Centralização Supabase
4. ⏳ Auditoria RLS
5. ⏳ Remoção de console logs
6. ⏳ Relatório final com score após correções
