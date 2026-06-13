# LGPD Compliance

## Compliance com LGPD - AllIn OS 2.0

Este documento descreve como a plataforma AllIn OS 2.0 está em conformidade com a Lei Geral de Proteção de Dados (LGPD).

## Dados Pessoais Coletados

### Dados de Clientes
- **Nome completo**
- **CPF**
- **Email**
- **Telefone**
- **Endereço**
- **Data de nascimento**
- **Estado civil**

### Dados de Distribuidores
- **Nome completo**
- **CPF/CNPJ**
- **Email**
- **Telefone**
- **Endereço**
- **Banco e conta bancária**

### Dados de Transações
- **Histórico de pedidos**
- **Histórico de pagamentos**
- **Histórico de comissões**
- **Histórico de saques**

## Base Legal para Coleta

### Consentimento (Art. 7, I)
- Usuários consentem ao se cadastrar na plataforma
- Consentimento explícito para marketing (opcional)
- Consentimento pode ser revogado a qualquer momento

### Execução de Contrato (Art. 7, V)
- Dados necessários para execução de contrato de compra/venda
- Dados necessários para processamento de pagamentos
- Dados necessários para envio de produtos

### Obrigação Legal (Art. 7, II)
- Dados fiscais obrigatórios por lei
- Dados bancários para pagamentos

## Direitos dos Titulares

### Direito de Acesso (Art. 18, I)
- Usuários podem acessar seus dados a qualquer momento
- Disponível via painel do usuário
- Exportação de dados em formato estruturado

### Direito de Correção (Art. 18, II)
- Usuários podem corrigir dados incorretos
- Disponível via painel do usuário
- Atualização em tempo real

### Direito de Eliminação (Art. 18, III)
- Usuários podem solicitar exclusão de dados
- Soft delete implementado (deleted_at)
- Retenção de dados por período legal (5 anos)

### Direito de Portabilidade (Art. 18, V)
- Usuários podem exportar seus dados
- Disponível via painel do usuário
- Formato JSON estruturado

### Direito de Oposição (Art. 18, VI)
- Usuários podem opor-se ao processamento
- Disponível via painel do usuário
- Processamento pode ser limitado

## Medidas de Segurança

### Criptografia
- Dados em trânsito: TLS 1.3
- Dados em repouso: Criptografia AES-256
- Senhas: Bcrypt com salt

### Controle de Acesso
- Autenticação via Supabase Auth
- RLS (Row Level Security) implementado
- Custom claims e roles implementados
- Service role key protegida

### Auditoria
- Logs de acesso registrados
- Logs de modificação de dados
- Logs de autenticação
- Retenção de logs: 90 dias

### Backup
- Backup diário automático
- Retenção de backups: 30 dias
- Backup externo: 90 dias
- Teste de restore mensal

## Retenção de Dados

### Período de Retenção
- **Dados de clientes:** 5 anos após último contato
- **Dados de pedidos:** 5 anos após último pedido
- **Dados financeiros:** 10 anos (obrigação fiscal)
- **Logs de acesso:** 90 dias
- **Logs de erro:** 1 ano

### Exclusão Automática
- Soft delete após período de retenção
- Hard delete após período adicional de segurança
- Notificação ao usuário antes da exclusão

## Política de Privacidade

### Disponibilidade
- Política de privacidade disponível no site
- Acessível via footer
- Atualizada periodicamente

### Conteúdo
- Dados coletados
- Finalidade da coleta
- Base legal
- Direitos dos titulares
- Contato do DPO

## DPO (Data Protection Officer)

### Nome: [Nome do DPO]
### Email: [Email do DPO]
### Telefone: [Telefone do DPO]

## Incidentes de Segurança

### Notificação
- Notificação à ANPD em até 2 dias úteis
- Notificação aos titulares em tempo razoável
- Documentação de incidentes

### Procedimento
1. Identificar incidente
2. Avaliar impacto
3. Conter incidente
4. Notificar autoridades
5. Notificar titulares
6. Documentar incidente
7. Implementar melhorias

## Transferência Internacional de Dados

### Supabase
- Servidores localizados em EUA
- Adequação via cláusulas padrão da UE
- Compliance com GDPR

### Ollama
- Servidor local (localhost)
- Sem transferência internacional
- Dados processados localmente

## Cookies e Tracking

### Cookies Necessários
- Autenticação
- Sessão
- Segurança

### Cookies de Marketing
- Google Analytics (opcional)
- Facebook Pixel (opcional)
- Consentimento explícito necessário

## Verificação de Compliance

### Checklist
- [x] Mapeamento de dados pessoais
- [x] Base legal identificada
- [x] Direitos dos titulares implementados
- [x] Medidas de segurança implementadas
- [x] Política de retenção definida
- [x] Política de privacidade criada
- [ ] DPO nomeado
- [ ] Incident response procedure testado
- [ ] Transferência internacional documentada
- [ ] Consentimento implementado

### Próximos Passos
1. Nomear DPO
2. Implementar consentimento explícito
3. Testar incident response procedure
4. Documentar transferência internacional
5. Treinar equipe em LGPD
6. Realizar auditoria de compliance
