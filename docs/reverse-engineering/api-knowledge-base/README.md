# AllInBrasil API Knowledge Base

This directory contains detailed documentation for each endpoint from the AllInBrasil API, scraped from https://allinbrasil.com.br/api/documentacao.

## Available Documentation Files

### Core Documentation
- [01-geral.md](./01-geral.md) - General API information and patterns
- [02-autenticacao.md](./02-autenticacao.md) - OAuth2 authentication with examples
- [03-autorizacao.md](./03-autorizacao.md) - Authorization flow for user data access
- [36-erros.md](./36-erros.md) - HTTP error codes and their meanings

### Location & Address Endpoints
- [04-cep.md](./04-cep.md) - CEP lookup service
- [05-cidades.md](./05-cidades.md) - Cities listing with filters
- [09-estados.md](./09-estados.md) - States (UF) listing
- [10-estados-civil.md](./10-estados-civil.md) - Civil status types
- [18-paises.md](./18-paises.md) - Countries listing

### Customer & Distributor Endpoints
- [06-clientes.md](./06-clientes.md) - Customer management
- [07-distribuidor-conta-bancaria.md](./07-distribuidor-conta-bancaria.md) - Distributor bank accounts
- [08-distribuidores.md](./08-distribuidores.md) - Distributor management

### Product & Inventory Endpoints
- [11-estoque-total-produtos.md](./11-estoque-total-produtos.md) - Total product stock
- [13-fabricantes.md](./13-fabricantes.md) - Manufacturers
- [23-produtos.md](./23-produtos.md) - Products catalog
- [24-produtos-campos-opcoes.md](./24-produtos-campos-opcoes.md) - Product field options
- [25-produtos-categorias.md](./25-produtos-categorias.md) - Product categories
- [26-produtos-opcoes.md](./26-produtos-opcoes.md) - Product options

### Order & Payment Endpoints
- [14-formas-frete.md](./14-formas-frete.md) - Shipping methods
- [15-formas-pagamento.md](./15-formas-pagamento.md) - Payment methods
- [19-pedidos.md](./19-pedidos.md) - Orders management
- [20-pedidos-saldos.md](./20-pedidos-saldos.md) - Order balances
- [21-pedidos-status.md](./21-pedidos-status.md) - Order status
- [35-transportadoras.md](./35-transportadoras.md) - Shipping carriers

### Network & MLM Endpoints
- [27-rede-linear-nos.md](./27-rede-linear-nos.md) - Linear network nodes
- [28-simulacao.md](./28-simulacao.md) - Commission simulation
- [29-simulacao-bonus-faturamento.md](./29-simulacao-bonus-faturamento.md) - Bonus simulation
- [30-simulacao-planos.md](./30-simulacao-planos.md) - Plan simulation

### Financial Endpoints
- [31-solicitacoes-saque.md](./31-solicitacoes-saque.md) - Withdrawal requests
- [32-solicitacoes-saque-cd.md](./32-solicitacoes-saque-cd.md) - CD withdrawal requests

### Utility Endpoints
- [12-extensoes.md](./12-extensoes.md) - Extensions
- [16-linguagens.md](./16-linguagens.md) - Languages
- [17-lojas.md](./17-lojas.md) - Stores
- [22-ping.md](./22-ping.md) - Health check
- [33-tipos-campo-pedido.md](./33-tipos-campo-pedido.md) - Order field types
- [34-tipos-pessoa.md](./34-tipos-pessoa.md) - Person types

## API Base URL
https://allinbrasil.com.br/api/v1

## Authentication
All endpoints require OAuth2 authentication. See [02-autenticacao.md](./02-autenticacao.md) for details.

## Common Filter Parameters
Most GET endpoints support these common query parameters:
- `limit` - Max 100 results per page
- `page` - Page number
- `select` - Comma-separated field names
- `order_by` - Sort order (field.asc or field.desc)
- Field-specific filters (e.g., `id`, `nome`, `nome__contem`, `nome__em`)

## Note
This documentation was scraped on April 19, 2026. For the most up-to-date information, visit the official documentation at https://allinbrasil.com.br/api/documentacao
