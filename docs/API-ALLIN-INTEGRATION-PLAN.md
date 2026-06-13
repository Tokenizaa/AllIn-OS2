# Plano de Integração com API AllIn

## Visão Geral

Este documento descreve o plano de integração entre a plataforma AllIn OS 2.0 e a API AllIn Brasil.

## API AllIn Brasil

**Base URL:** https://allinbrasil.com.br/api/v1
**Autenticação:** OAuth2
**Total de Endpoints:** 68 endpoints

## Endpoints Críticos

### Autenticação
- **POST /v1/auth/token** - Gera token de acesso OAuth2
  - Prioridade: CRÍTICA
  - Uso: Autenticação para todos os outros endpoints

### CRM
- **GET /v1/clientes** - Lista clientes
  - Prioridade: ALTA
  - Uso: Sincronização de clientes
- **POST /v1/clientes** - Cria cliente
  - Prioridade: ALTA
  - Uso: Criação de clientes

### MLM
- **GET /v1/distribuidores** - Lista distribuidores
  - Prioridade: ALTA
  - Uso: Sincronização de distribuidores
- **GET /v1/distribuidores/PlanoAtual** - Retorna plano atual do distribuidor
  - Prioridade: MÉDIA
  - Uso: Sincronização de planos
- **GET /v1/distribuidores/QualificacaoAtual** - Retorna qualificação atual do distribuidor
  - Prioridade: MÉDIA
  - Uso: Sincronização de qualificações

### Commerce
- **GET /v1/produtos** - Lista produtos
  - Prioridade: ALTA
  - Uso: Sincronização de produtos
- **POST /v1/produtos** - Cria produto
  - Prioridade: MÉDIA
  - Uso: Criação de produtos
- **GET /v1/pedidos** - Lista pedidos
  - Prioridade: ALTA
  - Uso: Sincronização de pedidos
- **POST /v1/pedidos** - Cria pedido
  - Prioridade: MÉDIA
  - Uso: Criação de pedidos

### Finance
- **GET /v1/solicitacoes-saque** - Lista solicitações de saque
  - Prioridade: MÉDIA
  - Uso: Sincronização de saques
- **POST /v1/solicitacoes-saque** - Cria solicitação de saque
  - Prioridade: MÉDIA
  - Uso: Criação de saques

## Mapeamento de Entidades

### Cliente (API AllIn) → crm.customers (Supabase)

**Mapeamento de campos:**
- `id` → `allin_id` (novo campo)
- `nome` + `sobrenome` → `nome`
- `email` → `email`
- `cpf` → `cpf`
- `cnpj` → `cnpj`
- `data_nascimento` → `data_nascimento`
- `cep` → `cep`
- `logradouro` → `logradouro`
- `numero` → `numero`
- `bairro` → `bairro`
- `cidade` → `cidade`
- `uf` → `uf`
- `ativo` → `ativo`
- `data_cadastro` → `data_cadastro`

### Distribuidor (API AllIn) → mlm.distribuidores (Supabase)

**Mapeamento de campos:**
- `id` → `allin_id` (novo campo)
- `usuario` → `usuario`
- `nome` → `nome`
- `email` → `email`
- `cpf` → `cpf`
- `cnpj` → `cnpj`
- `data_nascimento` → `data_nascimento`
- `cep` → `cep`
- `endereco` → `logradouro`
- `numero` → `numero`
- `bairro` → `bairro`
- `cidade` → `cidade`
- `ativo` → `ativo`
- `data_cadastro` → `data_cadastro`
- `patrocinador_id` → `patrocinador_id`

### Produto (API AllIn) → commerce.produtos (Supabase)

**Mapeamento de campos:**
- `id` → `allin_id` (novo campo)
- `nome` → `nome`
- `descricao` → `descricao`
- `preco` → `preco`
- `ativo` → `ativo`
- `data_cadastro` → `data_cadastro`

### Pedido (API AllIn) → commerce.pedidos (Supabase)

**Mapeamento de campos:**
- `id` → `allin_id` (novo campo)
- `cliente_id` → `cliente_id`
- `distribuidor_indicador_id` → `distribuidor_id`
- `valor_total` → `valor_total`
- `status` → `status_pedido`
- `data_adicionado` → `data_criacao`
- `cancelado` → `cancelado`

## Arquitetura da Integração

### Componentes

1. **AllIn API Adapter**
   - Responsável por fazer requisições à API AllIn
   - Gerencia autenticação OAuth2
   - Trata erros e retries

2. **Data Mapper**
   - Responsável por mapear entidades da API AllIn para Supabase
   - Converte formatos de dados
   - Valida dados antes de inserir

3. **Sync Service**
   - Responsável por sincronizar dados entre API AllIn e Supabase
   - Executa sincronização incremental
   - Gerencia conflitos de dados

4. **Webhook Handler**
   - Responsável por receber webhooks da API AllIn
   - Processa eventos em tempo real
   - Atualiza dados no Supabase

## Fluxo de Sincronização

### Sincronização Inicial

1. **Autenticar na API AllIn**
   - Obter token OAuth2
   - Configurar adapter com token

2. **Sincronizar Clientes**
   - Buscar clientes da API AllIn
   - Mapear para Supabase
   - Inserir/atualizar em crm.customers

3. **Sincronizar Distribuidores**
   - Buscar distribuidores da API AllIn
   - Mapear para Supabase
   - Inserir/atualizar em mlm.distribuidores

4. **Sincronizar Produtos**
   - Buscar produtos da API AllIn
   - Mapear para Supabase
   - Inserir/atualizar em commerce.produtos

5. **Sincronizar Pedidos**
   - Buscar pedidos da API AllIn
   - Mapear para Supabase
   - Inserir/atualizar em commerce.pedidos

### Sincronização Incremental

1. **Verificar últimos registros sincronizados**
   - Buscar timestamp da última sincronização
   - Filtrar dados modificados após timestamp

2. **Sincronizar apenas dados modificados**
   - Buscar dados modificados da API AllIn
   - Mapear para Supabase
   - Inserir/atualizar registros

3. **Atualizar timestamp de sincronização**
   - Salvar timestamp da última sincronização
   - Preparar para próxima sincronização

## Estrutura de Código

### AllIn API Adapter

```typescript
// src/backend/shared/integrations/allin/allin-api.adapter.ts
export class AllInApiAdapter {
  private baseUrl: string;
  private clientId: string;
  private clientSecret: string;
  private accessToken: string | null = null;
  private tokenExpiry: number | null = null;

  async authenticate(): Promise<void> {
    // Implementar autenticação OAuth2
  }

  async getClientes(): Promise<Cliente[]> {
    // Buscar clientes da API AllIn
  }

  async getDistribuidores(): Promise<Distribuidor[]> {
    // Buscar distribuidores da API AllIn
  }

  async getProdutos(): Promise<Produto[]> {
    // Buscar produtos da API AllIn
  }

  async getPedidos(): Promise<Pedido[]> {
    // Buscar pedidos da API AllIn
  }
}
```

### Data Mapper

```typescript
// src/backend/shared/integrations/allin/data.mapper.ts
export class AllInDataMapper {
  mapClienteToSupabase(cliente: Cliente): CustomerDTO {
    // Mapear cliente da API AllIn para Supabase
  }

  mapDistribuidorToSupabase(distribuidor: Distribuidor): DistribuidorDTO {
    // Mapear distribuidor da API AllIn para Supabase
  }

  mapProdutoToSupabase(produto: Produto): ProdutoDTO {
    // Mapear produto da API AllIn para Supabase
  }

  mapPedidoToSupabase(pedido: Pedido): PedidoDTO {
    // Mapear pedido da API AllIn para Supabase
  }
}
```

### Sync Service

```typescript
// src/backend/shared/integrations/allin/sync.service.ts
export class AllInSyncService {
  private apiAdapter: AllInApiAdapter;
  private dataMapper: AllInDataMapper;

  async syncClientes(): Promise<void> {
    // Sincronizar clientes
  }

  async syncDistribuidores(): Promise<void> {
    // Sincronizar distribuidores
  }

  async syncProdutos(): Promise<void> {
    // Sincronizar produtos
  }

  async syncPedidos(): Promise<void> {
    // Sincronizar pedidos
  }

  async syncAll(): Promise<void> {
    // Sincronizar todos os dados
  }
}
```

## Configuração

### Variáveis de Ambiente

```env
ALLIN_API_BASE_URL=https://allinbrasil.com.br/api/v1
ALLIN_CLIENT_ID=your_client_id
ALLIN_CLIENT_SECRET=your_client_secret
ALLIN_SYNC_ENABLED=true
ALLIN_SYNC_INTERVAL=3600
```

## Cronograma de Implementação

### Fase 1: Autenticação e Adapter
- [ ] Implementar autenticação OAuth2
- [ ] Criar AllInApiAdapter
- [ ] Testar autenticação
- [ ] Testar conexão com API

### Fase 2: Data Mapper
- [ ] Criar DTOs para entidades AllIn
- [ ] Implementar Data Mapper
- [ ] Mapear Cliente
- [ ] Mapear Distribuidor
- [ ] Mapear Produto
- [ ] Mapear Pedido

### Fase 3: Sync Service
- [ ] Criar Sync Service
- [ ] Implementar sincronização inicial
- [ ] Implementar sincronização incremental
- [ ] Testar sincronização

### Fase 4: Webhook Handler
- [ ] Criar Webhook Handler
- [ ] Implementar endpoints de webhook
- [ ] Processar eventos de cliente
- [ ] Processar eventos de pedido
- [ ] Testar webhooks

### Fase 5: Monitoramento e Logs
- [ ] Adicionar logs de sincronização
- [ ] Monitorar erros de API
- [ ] Configurar alerts
- [ ] Documentar procedimentos

## Riscos e Mitigações

### Risco 1: API AllIn indisponível
- **Mitigação:** Implementar retry com exponential backoff
- **Mitigação:** Cache de dados recentes
- **Mitigação:** Alertas de indisponibilidade

### Risco 2: Token OAuth2 expirado
- **Mitigação:** Implementar refresh automático de token
- **Mitigação:** Verificar expiração antes de cada requisição

### Risco 3: Dados inconsistentes
- **Mitigação:** Implementar validação de dados
- **Mitigação:** Log de conflitos
- **Mitigação:** Revisão manual de conflitos

### Risco 4: Performance de sincronização
- **Mitigação:** Sincronização incremental
- **Mitigação:** Paginação de requisições
- **Mitigação:** Processamento assíncrono

## Próximos Passos

1. Configurar credenciais OAuth2 da API AllIn
2. Implementar autenticação OAuth2
3. Criar AllInApiAdapter
4. Implementar Data Mapper
5. Implementar Sync Service
6. Testar sincronização inicial
7. Implementar Webhook Handler
8. Configurar monitoramento
