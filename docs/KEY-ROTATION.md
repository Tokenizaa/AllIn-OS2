# Key Rotation

## Rotação de Keys no Supabase

Este documento descreve como rotacionar as chaves do Supabase para segurança.

## Keys do Supabase

### Tipos de Keys
- **anon key** - Chave pública para acesso anônimo
- **service_role key** - Chave de serviço com acesso total
- **db_url** - URL de conexão do database
- **jwt secret** - Segredo para assinar tokens JWT

## Quando Rotacionar Keys

### Situações que Requerem Rotação
- ⚠️ Suspeita de vazamento de key
- ⚠️ Key exposta acidentalmente (commit, log, etc)
- ⚠️ Funcionário com acesso saiu da empresa
- ⚠️ Rotina de segurança (recomendado: 90 dias)
- ⚠️ Key não utilizada por longo período

## Como Rotacionar Keys

### Via Dashboard do Supabase

**Para rotacionar anon key:**
1. Acessar Settings → API
2. Clicar em "Regenerate" em anon public key
3. Confirmar a rotação
4. Atualizar frontend com nova key
5. Testar aplicação

**Para rotacionar service_role key:**
1. Acessar Settings → API
2. Clicar em "Regenerate" em service_role key
3. Confirmar a rotação
4. Atualizar backend com nova key
5. Atualizar Edge Functions com nova key
6. Testar aplicação

**Para rotacionar JWT secret:**
1. Acessar Settings → API
2. Clicar em "Regenerate" em JWT secret
3. Confirmar a rotação
4. Todos os tokens existentes serão invalidados
5. Usuários precisarão fazer login novamente
6. Testar autenticação

### Via CLI

```bash
# Listar keys
supabase keys list

# Rotacionar service_role key
supabase db reset --db-url "postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres"
```

## Processo de Rotação

### 1. Planejamento
- Identificar onde a key é usada
- Planejar janela de manutenção
- Preparar rollback plan
- Comunicar equipe sobre downtime

### 2. Backup
- Fazer backup da key atual
- Documentar onde a key é usada
- Criar branch para mudanças

### 3. Rotação
- Gerar nova key
- Atualizar configurações
- Deploy de mudanças
- Testar funcionalidade

### 4. Verificação
- Testar autenticação
- Testar database access
- Testar Edge Functions
- Monitorar logs por erros

### 5. Limpeza
- Remover key antiga após período de grace
- Documentar rotação
- Atualizar documentação

## Checklist de Rotação

### Pré-Rotação
- [ ] Identificar todos os locais onde a key é usada
- [ ] Documentar configurações atuais
- [ ] Comunicar equipe sobre rotação
- [ ] Planejar janela de manutenção
- [ ] Preparar rollback plan

### Durante Rotação
- [ ] Gerar nova key
- [ ] Atualizar backend
- [ ] Atualizar frontend
- [ ] Atualizar Edge Functions
- [ ] Atualizar variáveis de ambiente
- [ ] Deploy de mudanças
- [ ] Testar autenticação
- [ ] Testar database access
- [ ] Testar Edge Functions

### Pós-Rotação
- [ ] Monitorar logs por erros
- [ ] Verificar funcionalidade
- [ ] Documentar rotação
- [ ] Remover key antiga após período de grace
- [ ] Comunicar equipe sobre conclusão

## Rotação por Tipo de Key

### Anon Key
- **Impacto:** Baixo
- **Downtime:** Não necessário
- **Processo:** Simples
- **Testes:** Frontend authentication

### Service Role Key
- **Impacto:** Alto
- **Downtime:** Possível
- **Processo:** Complexo
- **Testes:** Backend, Edge Functions, Database

### JWT Secret
- **Impacto:** Crítico
- **Downtime:** Sim (usuários precisam re-login)
- **Processo:** Complexo
- **Testes:** Autenticação completa

## Recuperação em Caso de Problemas

### Se Rotação Falhar
1. Reverter para key anterior
2. Investigar causa do problema
3. Tentar novamente com processo diferente
4. Documentar problema e solução

### Se Aplicação Quebrar
1. Reverter para key anterior
2. Verificar configurações
3. Testar novamente
4. Comunicar equipe sobre delay

## Boas Práticas

### 1. Documentar Rotações
- Data da rotação
- Motivo da rotação
- Key antiga (hash)
- Key nova (hash)
- Responsável

### 2. Usar Environment Variables
- Nunca hardcode keys
- Usar variáveis de ambiente
- Usar secrets do Supabase
- Separar keys por ambiente

### 3. Limitar Acesso
- Apenas pessoal autorizado pode rotacionar keys
- Usar MFA para acesso
- Auditar rotações
- Revisar permissões regularmente

### 4. Automatizar Quando Possível
- Automatizar rotação de keys temporárias
- Usar key management services
- Integrar com CI/CD
- Monitorar expiração de keys

## Status Atual

### Keys do Projeto
- ✅ anon key - Ativa
- ✅ service_role key - Ativa
- ✅ JWT secret - Ativa

### Última Rotação
- Data: Não documentado
- Motivo: Não documentado
- Recomendação: Rotacionar keys por segurança

## Próximos Passos

1. Documentar data de criação das keys atuais
2. Estabelecer cronograma de rotação (90 dias)
3. Configurar alertas para expiração de keys
4. Automatizar processo de rotação quando possível
5. Documentar todas as rotações futuras
