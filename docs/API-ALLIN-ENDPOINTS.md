# API Allin - Endpoints Necessários

## Base URL
```
https://allinbrasil.com.br/api/v1
```

## Autenticação

### OAuth2 Token
- **Endpoint:** `/auth/token`
- **Método:** POST
- **Content-Type:** application/x-www-form-urlencoded
- **Parâmetros:**
  - `client_id`: string (obrigatório)
  - `client_secret`: string (obrigatório)
  - `grant_type`: "client_credentials" ou "password" (obrigatório)
  - `username`: string (opcional, para grant_type=password)
  - `password`: string (opcional, para grant_type=password)
  - `scope`: string (opcional)
- **Resposta:**
  ```json
  {
    "access_token": "string",
    "expires_in": number,
    "token_type": "string",
    "scope": "string | null"
  }
  ```

## Endpoints de Sync

### Clientes
- **Endpoint:** `/clientes`
- **Método:** GET
- **Headers:** Authorization: Bearer {access_token}
- **Resposta:**
  ```json
  {
    "clientes": AllInCliente[]
  }
  ```

### Distribuidores
- **Endpoint:** `/distribuidores`
- **Método:** GET
- **Headers:** Authorization: Bearer {access_token}
- **Resposta:**
  ```json
  {
    "distribuidores": AllInDistribuidor[]
  }
  ```

### Produtos
- **Endpoint:** `/produtos`
- **Método:** GET
- **Headers:** Authorization: Bearer {access_token}
- **Resposta:**
  ```json
  {
    "produtos": AllInProduto[]
  }
  ```

### Pedidos
- **Endpoint:** `/pedidos`
- **Método:** GET
- **Headers:** Authorization: Bearer {access_token}
- **Resposta:**
  ```json
  {
    "pedidos": AllInPedido[]
  }
  ```

### Planos
- **Endpoint:** `/simulacao-planos`
- **Método:** GET
- **Headers:** Authorization: Bearer {access_token}
- **Resposta:**
  ```json
  {
    "planos": AllInPlano[]
  }
  ```

## Endpoints Adicionais

### Cliente por ID
- **Endpoint:** `/clientes/{id}`
- **Método:** GET
- **Headers:** Authorization: Bearer {access_token}
- **Resposta:**
  ```json
  {
    "cliente": AllInCliente
  }
  ```

### Distribuidor por ID
- **Endpoint:** `/distribuidores/{id}`
- **Método:** GET
- **Headers:** Authorization: Bearer {access_token}
- **Resposta:**
  ```json
  {
    "distribuidor": AllInDistribuidor
  }
  ```

### Produto por ID
- **Endpoint:** `/produtos/{id}`
- **Método:** GET
- **Headers:** Authorization: Bearer {access_token}
- **Resposta:**
  ```json
  {
    "produto": AllInProduto
  }
  ```

### Pedido por ID
- **Endpoint:** `/pedidos/{id}`
- **Método:** GET
- **Headers:** Authorization: Bearer {access_token}
- **Resposta:**
  ```json
  {
    "pedido": AllInPedido
  }
  ```

### Atividades Mensais do Distribuidor
- **Endpoint:** `/distribuidores/{id}/AtivacoesMensais`
- **Método:** GET
- **Headers:** Authorization: Bearer {access_token}
- **Resposta:**
  ```json
  {
    "atividades": AllInDistribuidorAtivacoesMensais[]
  }
  ```

### Plano Atual do Distribuidor
- **Endpoint:** `/distribuidores/{id}/PlanoAtual`
- **Método:** GET
- **Headers:** Authorization: Bearer {access_token}
- **Resposta:**
  ```json
  {
    "plano": AllInDistribuidorPlanoAtual
  }
  ```

### Qualificação Atual do Distribuidor
- **Endpoint:** `/distribuidores/{id}/QualificacaoAtual`
- **Método:** GET
- **Headers:** Authorization: Bearer {access_token}
- **Resposta:**
  ```json
  {
    "qualificacao": AllInDistribuidorQualificacaoAtual
  }
  ```

### Telefones do Distribuidor
- **Endpoint:** `/distribuidores/{id}/Telefones`
- **Método:** GET
- **Headers:** Authorization: Bearer {access_token}
- **Resposta:**
  ```json
  {
    "telefones": AllInDistribuidorTelefone[]
  }
  ```

### Criar Pedido
- **Endpoint:** `/pedidos`
- **Método:** POST
- **Headers:** Authorization: Bearer {access_token}, Content-Type: application/json
- **Body:** Partial<AllInPedido>
- **Resposta:**
  ```json
  {
    "pedido": AllInPedido
  }
  ```

### Alterar Status do Pedido
- **Endpoint:** `/pedidos/AlterarStatus`
- **Método:** POST
- **Headers:** Authorization: Bearer {access_token}, Content-Type: application/json
- **Body:** { pedido_id: number, ...AllInPedidoStatusUpdate }

### Cancelar Pedido
- **Endpoint:** `/pedidos/Cancelar`
- **Método:** POST
- **Headers:** Authorization: Bearer {access_token}, Content-Type: application/json
- **Body:** { pedido_id: number }

### Confirmar Pagamento do Pedido
- **Endpoint:** `/pedidos/ConfirmarPagamento`
- **Método:** POST
- **Headers:** Authorization: Bearer {access_token}, Content-Type: application/json
- **Body:** { pedido_id: number }

### Itens do Pedido
- **Endpoint:** `/pedidos/{id}/Itens`
- **Método:** GET
- **Headers:** Authorization: Bearer {access_token}
- **Resposta:**
  ```json
  {
    "itens": AllInPedidoItem[]
  }
  ```

### Pagamentos do Pedido
- **Endpoint:** `/pedidos/{id}/Pagamentos`
- **Método:** GET
- **Headers:** Authorization: Bearer {access_token}
- **Resposta:**
  ```json
  {
    "pagamentos": AllInPedidoPagamento[]
  }
  ```

### Estoque do Produto
- **Endpoint:** `/produtos/{id}/Estoque`
- **Método:** GET
- **Headers:** Authorization: Bearer {access_token}
- **Resposta:**
  ```json
  {
    "estoque": AllInProdutoEstoque
  }
  ```

### Atualizar Estoque do Produto
- **Endpoint:** `/produtos/Estoque`
- **Método:** POST
- **Headers:** Authorization: Bearer {access_token}, Content-Type: application/json
- **Body:** { produto_id: number, quantidade: number, quantidade_reservada?: number }

### Estoque Totais
- **Endpoint:** `/produtos/EstoqueTotais`
- **Método:** GET
- **Headers:** Authorization: Bearer {access_token}
- **Resposta:**
  ```json
  {
    "estoques": AllInProdutoEstoqueTotal[]
  }
  ```

### Rede Linear Nós
- **Endpoint:** `/rede-linear-nos`
- **Método:** GET
- **Headers:** Authorization: Bearer {access_token}
- **Resposta:**
  ```json
  {
    "nos": AllInRedeLinearNo[]
  }
  ```

### Downlines
- **Endpoint:** `/rede-linear-nos/{id}/Downlines`
- **Método:** GET
- **Headers:** Authorization: Bearer {access_token}
- **Resposta:**
  ```json
  {
    "downlines": AllInDownline[]
  }
  ```

### Uplines
- **Endpoint:** `/rede-linear-nos/{id}/Uplines`
- **Método:** GET
- **Headers:** Authorization: Bearer {access_token}
- **Resposta:**
  ```json
  {
    "uplines": AllInUpline[]
  }
  ```

### Bônus de Faturamento
- **Endpoint:** `/simulacao-bonus-faturamento`
- **Método:** GET
- **Headers:** Authorization: Bearer {access_token}
- **Resposta:**
  ```json
  {
    "meses": AllInBonusFaturamentoMes[]
  }
  ```

### Saldos de Pedidos
- **Endpoint:** `/pedidos-saldos`
- **Método:** GET
- **Headers:** Authorization: Bearer {access_token}
- **Resposta:**
  ```json
  {
    "saldos": AllinPedidoSaldo[]
  }
  ```

### Health Check
- **Endpoint:** `/ping`
- **Método:** GET
- **Headers:** Authorization: Bearer {access_token}
- **Resposta:**
  ```json
  {
    "status": "string"
  }
  ```

## Configuração de Retry

O AllInService implementa retry logic com exponential backoff:
- **Max Retries:** 3 (configurável via `maxRetries`)
- **Retry Delay:** 1000ms (configurável via `retryDelay`)
- **Backoff Strategy:** Exponential (delay * 2^attempt)

## Logging

Todos os requests são logados com:
- URL do endpoint
- Método HTTP
- Status code
- Erros (se houver)
- Número de tentativas (retry)
- Tempo de execução

## Status de Implementação

- ✅ Autenticação OAuth2
- ✅ Sync de Clientes
- ✅ Sync de Distribuidores
- ✅ Sync de Produtos
- ✅ Sync de Pedidos
- ✅ Sync de Planos
- ✅ Retry Logic com Exponential Backoff
- ✅ Logging Detalhado
- ✅ Health Check
