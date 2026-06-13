# Integração API AllInBrasil - Documentação de Uso

**Versão:** 1.0  
**Data:** 11 de Junho de 2026  
**Status:** Completo

---

## Índice

1. [Instalação](#instalação)
2. [Configuração](#configuração)
3. [Autenticação](#autenticação)
4. [Serviços Disponíveis](#serviços-disponíveis)
5. [Exemplos de Uso](#exemplos-de-uso)
6. [Tratamento de Erros](#tratamento-de-erros)
7. [Filtros e Paginação](#filtros-e-paginação)

---

## Instalação

A integração API está localizada em `src/api/`. Não há dependências externas além do Node.js padrão.

```bash
# A estrutura já está incluída no projeto
cd AllIn-OS2
```

---

## Configuração

### Variáveis de Ambiente

Configure as seguintes variáveis no arquivo `.env`:

```env
ALLIN_API_BASE_URL=https://allinbrasil.com.br/api/v1
ALLIN_CLIENT_ID=seu_client_id
ALLIN_CLIENT_SECRET=seu_client_secret
```

### Configuração Programática

```typescript
import { AllInAPI } from './api';
import { ApiClientConfig } from './api';

const config: ApiClientConfig = {
  baseUrl: 'https://allinbrasil.com.br/api/v1',
  clientId: 'seu_client_id',
  clientSecret: 'seu_client_secret',
  timeout: 30000,
};

const api = new AllInAPI(config);
```

---

## Autenticação

### Client Credentials (Padrão)

```typescript
// Inicializa com Client Credentials
await api.initialize();
```

### Password Grant

```typescript
// Inicializa com credenciais de usuário
await api.initializeWithCredentials('username', 'password');
```

### Refresh Automático

O cliente gerencia automaticamente o refresh do token quando expira.

---

## Serviços Disponíveis

### 1. Identity Service

Gerenciamento de autenticação OAuth2.

```typescript
// Obter token com Client Credentials
const token = await api.identity.getTokenWithClientCredentials();

// Obter token com Password Grant
const token = await api.identity.getTokenWithPassword('username', 'password');

// Iniciar fluxo de autorização
const authUrl = await api.identity.initiateAuthorization({
  response_type: 'code',
  client_id: 'client_id',
  redirect_uri: 'https://seu-site.com/callback',
  scope: 'clientes distribuidores',
  state: 'random_state',
});
```

### 2. Location Service

Gerenciamento de dados geográficos.

```typescript
// Buscar CEP
const cep = await api.location.getCEP(12345678);

// Listar cidades
const cidades = await api.location.listCidades({
  limit: 100,
  page: 1,
  uf_id: 26,
});

// Listar estados
const estados = await api.location.listEstados();

// Listar países
const paises = await api.location.listPaises();

// Listar estados civis
const estadosCivil = await api.location.listEstadosCivil();
```

### 3. CRM Service

Gestão de relacionamento com clientes.

```typescript
// Listar clientes
const clientes = await api.crm.listClientes({
  limit: 100,
  page: 1,
  nome__contem: 'João',
  ativo: true,
});

// Criar cliente
const novoCliente = await api.crm.createCliente({
  nome: 'João',
  sobrenome: 'Silva',
  email: 'joao@email.com',
  cpf: '123.456.789-00',
});

// Atualizar senha
await api.crm.updateSenha(clienteId, 'nova_senha');

// Listar contas do cliente
const contas = await api.crm.listContasCliente(clienteId);

// Listar endereços do cliente
const enderecos = await api.crm.listEnderecosCliente(clienteId);

// Gerar token de login
const tokenLogin = await api.crm.generateTokenLogin('email', 'senha');

// Listar tipos de pessoa
const tiposPessoa = await api.crm.listTiposPessoa();
```

### 4. MLM Service

Gestão de rede Multi-Level Marketing.

```typescript
// Listar distribuidores
const distribuidores = await api.mlm.listDistribuidores({
  limit: 100,
  page: 1,
  ativo: true,
});

// Listar ativações mensais
const ativacoes = await api.mlm.listAtivacoesMensais(distribuidorId);

// Obter plano atual
const plano = await api.mlm.getPlanoAtual(distribuidorId);

// Obter qualificação atual
const qualificacao = await api.mlm.getQualificacaoAtual(distribuidorId);

// Listar telefones
const telefones = await api.mlm.listTelefones(distribuidorId);

// Listar rede linear
const redeLinear = await api.mlm.listRedeLinearNos({
  linha: 1,
});

// Listar downlines
const downlines = await api.mlm.listRedeLinearDownlines(distribuidorId);

// Listar uplines
const uplines = await api.mlm.listRedeLinearUplines(distribuidorId);

// Criar simulação
const simulacao = await api.mlm.createSimulacao({
  distribuidor_id: distribuidorId,
  data_inicio: '2026-01-01',
  data_fim: '2026-12-31',
});

// Executar simulação
await api.mlm.executeSimulacao(simulacaoId);

// Cancelar simulação
await api.mlm.cancelSimulacao(simulacaoId);

// Obter bônus e faturamento
const bonusFaturamento = await api.mlm.getSimulacaoBonusFaturamento({
  mes: 6,
  ano: 2026,
});

// Listar planos de simulação
const planos = await api.mlm.listSimulacaoPlanos();
```

### 5. Commerce Service

Gestão de comércio eletrônico.

```typescript
// Listar produtos
const produtos = await api.commerce.listProdutos({
  limit: 100,
  page: 1,
  ativo: true,
  categoria_id: 1,
});

// Criar produto
const novoProduto = await api.commerce.createProduto({
  nome: 'Produto Teste',
  descricao: 'Descrição do produto',
  preco: 99.99,
  estoque: 100,
  ativo: true,
});

// Atualizar produto
await api.commerce.updateProduto(produtoId, {
  preco: 149.99,
});

// Gerenciar estoque
await api.commerce.manageEstoque(produtoId, {
  quantidade: 50,
  loja_id: 1,
});

// Listar categorias
const categorias = await api.commerce.listCategorias();

// Criar categoria
const novaCategoria = await api.commerce.createCategoria({
  nome: 'Eletrônicos',
  descricao: 'Produtos eletrônicos',
});

// Listar formas de pagamento
const formasPagamento = await api.commerce.listFormasPagamento();

// Listar pedidos
const pedidos = await api.commerce.listPedidos({
  limit: 100,
  page: 1,
  cliente_id: clienteId,
  status: 'pending',
});

// Criar pedido
const novoPedido = await api.commerce.createPedido({
  cliente_id: clienteId,
  valor_total: 199.99,
});

// Alterar status do pedido
await api.commerce.alterarStatusPedido(pedidoId, 'approved');

// Cancelar pedido
await api.commerce.cancelarPedido(pedidoId);

// Confirmar pagamento
await api.commerce.confirmarPagamento(pedidoId);

// Listar itens do pedido
const itens = await api.commerce.listItensPedido(pedidoId);

// Listar fabricantes
const fabricantes = await api.commerce.listFabricantes();

// Criar fabricante
const novoFabricante = await api.commerce.createFabricante({
  nome: 'Fabricante Teste',
  ativo: true,
});

// Listar lojas
const lojas = await api.commerce.listLojas();

// Listar status de pedidos
const pedidosStatus = await api.commerce.listPedidosStatus();
```

### 6. Logistics Service

Gestão de logística e transporte.

```typescript
// Calcular formas de frete
const formasFrete = await api.logistics.calcularFormasFrete({
  cep_origem: '01310-100',
  cep_destino: '20040-002',
  valor_pedido: 199.99,
  peso: 1.5,
});

// Listar transportadoras
const transportadoras = await api.logistics.listTransportadoras({
  limit: 100,
  page: 1,
  situacao: 1,
});
```

### 7. Finance Service

Gestão financeira.

```typescript
// Listar contas bancárias
const contas = await api.finance.listContasBancarias(distribuidorId);

// Listar solicitações de saque
const saques = await api.finance.listSolicitacoesSaque({
  limit: 100,
  page: 1,
  distribuidor_id: distribuidorId,
  status: 'pending',
});

// Criar solicitação de saque
const novoSaque = await api.finance.createSolicitacaoSaque({
  distribuidor_id: distribuidorId,
  valor_solicitado: 1000.00,
});

// Confirmar saque
await api.finance.confirmarSaque(saqueId);

// Estornar saque
await api.finance.estornarSaque(saqueId);

// Reverter saque
await api.finance.reverterSaque(saqueId);

// Listar solicitações de saque de CDs
const saquesCD = await api.finance.listSolicitacoesSaqueCD();

// Confirmar saque de CD
await api.finance.confirmarSaqueCD(saqueId);

// Estornar saque de CD
await api.finance.estornarSaqueCD(saqueId);

// Reverter saque de CD
await api.finance.reverterSaqueCD(saqueId);
```

### 8. System Service

Gestão do sistema.

```typescript
// Verificar status da API
const health = await api.system.ping();

// Listar extensões
const extensoes = await api.system.listExtensoes();

// Listar linguagens
const linguagens = await api.system.listLinguagens({
  status: 1,
  padrao: true,
});
```

---

## Exemplos de Uso

### Exemplo Completo: Criar Pedido

```typescript
import { AllInAPI } from './api';

const api = new AllInAPI({
  baseUrl: 'https://allinbrasil.com.br/api/v1',
  clientId: 'your_client_id',
  clientSecret: 'your_client_secret',
});

async function criarPedido() {
  try {
    // Inicializar autenticação
    await api.initialize();

    // Buscar cliente
    const clientes = await api.crm.listClientes({
      email__contem: 'cliente@email.com',
      limit: 1,
    });

    if (clientes.length === 0) {
      throw new Error('Cliente não encontrado');
    }

    const cliente = clientes[0];

    // Buscar produto
    const produtos = await api.commerce.listProdutos({
      ativo: true,
      limit: 1,
    });

    if (produtos.length === 0) {
      throw new Error('Produto não encontrado');
    }

    const produto = produtos[0];

    // Criar pedido
    const pedido = await api.commerce.createPedido({
      cliente_id: cliente.id,
      valor_total: produto.preco,
    });

    // Adicionar item ao pedido
    await api.commerce.managePagamentos({
      pedido_id: pedido.id,
      produto_id: produto.id,
      quantidade: 1,
      preco_unitario: produto.preco,
    });

    // Confirmar pagamento
    await api.commerce.confirmarPagamento(pedido.id);

    console.log('Pedido criado com sucesso:', pedido);
  } catch (error) {
    console.error('Erro ao criar pedido:', error);
  }
}

criarPedido();
```

### Exemplo: Simulação de Comissão MLM

```typescript
async function simularComissao() {
  try {
    await api.initializeWithCredentials('distribuidor', 'senha');

    // Criar simulação
    const simulacao = await api.mlm.createSimulacao({
      distribuidor_id: 123,
      data_inicio: '2026-01-01',
      data_fim: '2026-12-31',
    });

    // Executar simulação
    await api.mlm.executeSimulacao(simulacao.id);

    // Obter resultados
    const informacoes = await api.mlm.getInformacoesExecucao(simulacao.id);

    console.log('Resultado da simulação:', informacoes);
  } catch (error) {
    console.error('Erro na simulação:', error);
  }
}

simularComissao();
```

---

## Tratamento de Erros

### Estrutura de Erro

```typescript
interface ApiError {
  message: string;
  status: number;
  code?: string;
  details?: any;
}
```

### Exemplo de Tratamento

```typescript
try {
  const clientes = await api.crm.listClientes({ limit: 100 });
} catch (error) {
  if (error.status === 401) {
    console.error('Não autorizado - verifique suas credenciais');
  } else if (error.status === 403) {
    console.error('Permissão negada - verifique os escopos');
  } else if (error.status === 404) {
    console.error('Recurso não encontrado');
  } else if (error.status === 429) {
    console.error('Muitas requisições - aguarde um momento');
  } else {
    console.error('Erro desconhecido:', error.message);
  }
}
```

---

## Filtros e Paginação

### Filtros Padrão

Todos os endpoints GET suportam os seguintes filtros:

- `limit`: Máximo de resultados por página (padrão: 100, máximo: 100)
- `page`: Número da página (padrão: 1)
- `select`: Seleção de campos específicos
- `order_by`: Ordenação (ex: `nome.asc`, `data_pedido.desc`)

### Filtros de Campo

- `campo`: Filtro exato
- `campo__maior_igual`: Filtro maior ou igual
- `campo__menor_igual`: Filtro menor ou igual
- `campo__contem`: Filtro contém (LIKE)
- `campo__em`: Filtro em array (IN)

### Exemplo de Filtros Avançados

```typescript
const pedidos = await api.commerce.listPedidos({
  limit: 50,
  page: 1,
  cliente_id: 123,
  status__em: ['pending', 'approved'],
  data_pedido__maior_igual: '2026-01-01',
  data_pedido__menor_igual: '2026-12-31',
  order_by: 'data_pedido.desc',
});
```

---

## Escopos de Permissão

A API utiliza escopos OAuth2 para controle de acesso. Certifique-se de que seu cliente tenha os escopos necessários:

- `cep` - Consulta de CEP
- `cidades` - Listagem de cidades
- `estados_listar` - Listagem de estados
- `estados_civil` - Listagem de estados civis
- `paises_listar` - Listagem de países
- `clientes` - Gestão de clientes
- `distribuidores` - Gestão de distribuidores
- `produtos_estoque_totais` - Estoque total de produtos
- `extensoes` - Extensões do sistema
- `listar_fabricantes` - Listagem de fabricantes
- `formas_frete` - Formas de frete
- `forma_pagamento` - Formas de pagamento
- `linguagens` - Linguagens
- `lojas` - Lojas
- `pedidos` - Gestão de pedidos
- `pedidos_saldos_listar` - Saldos de pedidos
- `pedidos_status` - Status de pedidos
- `produtos` - Gestão de produtos
- `campos_opcoes_produtos` - Campos de opções de produtos
- `produtos_categorias_listar` - Categorias de produtos
- `produtos_opcoes` - Opções de produtos
- `rede_linear_nos` - Rede linear
- `simulacao_listar` - Simulação
- `simulacao_bonus_faturamento` - Bônus e faturamento
- `simulacao_planos_listar` - Planos de simulação
- `solicitacao_saque` - Solicitações de saque
- `solicitacao_saque_cd` - Solicitações de saque de CDs

---

## Suporte

Para dúvidas ou problemas, consulte a documentação completa em `docs/01-ENGANHARIA-REVERSA-API-COMPLETA.md`.
