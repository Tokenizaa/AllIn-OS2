# Secrets Management

## Gerenciamento de Secrets no Supabase

Este documento descreve como gerenciar secrets e variáveis de ambiente no Supabase.

## Secrets do Supabase

### Secrets Necessários

**Obrigatórios:**
- `SUPABASE_URL` - URL do projeto Supabase
- `SUPABASE_ANON_KEY` - Chave pública (anon)
- `SUPABASE_SERVICE_ROLE_KEY` - Chave de serviço (service_role)

**Para Integrações:**
- `OLLAMA_BASE_URL` - URL do servidor Ollama (para embeddings e chat)
- `OLLAMA_DEFAULT_MODEL` - Modelo padrão do Ollama (ex: tinyllama:latest)
- `STRIPE_SECRET_KEY` - Chave da API Stripe (para pagamentos)
- `SMTP_HOST` - Host SMTP para emails
- `SMTP_PORT` - Porta SMTP
- `SMTP_USER` - Usuário SMTP
- `SMTP_PASSWORD` - Senha SMTP

## Como Configurar Secrets

### Via Dashboard do Supabase

1. Acessar o dashboard do Supabase
2. Ir em Settings → Edge Functions
3. Adicionar secrets na seção "Environment Variables"
4. Clicar em "Add new variable"
5. Adicionar nome e valor
6. Clicar em "Save"

### Via CLI

```bash
supabase secrets set OPENAI_API_KEY=your_key_here
supabase secrets set STRIPE_SECRET_KEY=your_key_here
```

### Via API

```bash
curl -X POST 'https://api.supabase.com/v1/projects/{project_id}/secrets' \
  -H 'Authorization: Bearer {service_role_key}' \
  -H 'Content-Type: application/json' \
  -d '{
    "secrets": [
      {"name": "OPENAI_API_KEY", "value": "your_key_here"}
    ]
  }'
```

## Boas Práticas

### 1. Nunca Commitar Secrets
- ❌ Nunca commitar secrets no código
- ❌ Nunca commitar secrets em arquivos .env
- ✅ Usar variáveis de ambiente
- ✅ Usar secrets do Supabase

### 2. Usar Service Role Key com Cuidado
- ❌ Nunca expor service_role_key no frontend
- ❌ Nunca commitar service_role_key
- ✅ Usar apenas no backend/servidor
- ✅ Usar anon_key no frontend

### 3. Rotacionar Keys Regularmente
- Rotacionar keys a cada 90 dias
- Rotacionar keys se houver suspeita de vazamento
- Documentar quando keys foram rotacionadas

### 4. Usar Keys Específicas por Ambiente
- Desenvolvimento: keys de teste
- Staging: keys de staging
- Produção: keys de produção
- Nunca misturar keys entre ambientes

### 5. Monitorar Uso de Keys
- Monitorar logs por uso suspeito
- Configurar alerts para uso anormal
- Revogar keys não utilizadas

## Configuração Atual

### Secrets Configurados
- ✅ SUPABASE_URL
- ✅ SUPABASE_ANON_KEY
- ✅ SUPABASE_SERVICE_ROLE_KEY

### Secrets Pendentes
- ⏳ OLLAMA_BASE_URL (necessário para Edge Functions de IA)
- ⏳ OLLAMA_DEFAULT_MODEL (necessário para Edge Functions de IA)
- ⏳ STRIPE_SECRET_KEY (necessário para pagamentos)
- ⏳ SMTP_* (necessário para emails)

## Próximos Passos

1. Configurar OLLAMA_BASE_URL e OLLAMA_DEFAULT_MODEL no Supabase Dashboard
2. Testar Edge Functions com Ollama
3. Configurar STRIPE_SECRET_KEY (se necessário)
4. Configurar SMTP (se necessário)
5. Documentar todas as keys configuradas
6. Rotacionar keys periodicamente

## Verificação

### Verificar Secrets Configurados
```bash
supabase secrets list
```

### Verificar Secrets em Runtime
```typescript
const apiKey = Deno.env.get('OPENAI_API_KEY');
if (!apiKey) {
  throw new Error('OPENAI_API_KEY not configured');
}
```

## Segurança

### Proteção de Secrets
- Usar secrets do Supabase (criptografados em repouso)
- Limitar acesso a secrets
- Usar principle of least privilege
- Auditar acesso a secrets

### Em Caso de Vazamento
1. Revogar keys vazadas imediatamente
2. Gerar novas keys
3. Atualizar configurações
4. Investigar causa do vazamento
5. Implementar medidas preventivas
