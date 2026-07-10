# Pedidos-Status

**Fonte:** https://allinbrasil.com.br/api/documentacao

## Descrição

Lista as situações de pedidos cadastradas na loja virtual

## Escopo Necessário

`pedidos_status`

## Endpoints

### GET Pedidos-Status

**URL:** `https://allinbrasil.com.br/api/v1/pedidos-status`

### POST Pedidos-Status

**URL:** `https://allinbrasil.com.br/api/v1/pedidos-status`

## Resposta

### Atributos

| Atributo | Descrição | Tipo |
|----------|-----------|------|
| limit | Quantidade de linhas que será retornado na sua consulta, no máximo de 100 por página | Sim |
| page | Página que deseja visualizar da consulta realizada | Sim |
| select | Trás somente os dados das colunas selecionadas, separar colunas por virgulas (ex.: nome,idade,cpf) | Sim |
| order_by | Ordena sua busca por parâmetro, utilize o tipo de ordenação com .desc (decrescente) ou .asc (ascendente) após o nome do parâmetro que deseja ordernar Ex.:id.desc (irá ordenar por id do maior para o menor) | Sim |
| id | Filtro de busca por id | Sim |
| cor | Filtro de busca pela cor | Sim |
| cor_texto | Filtro de busca pela cor do texto | Sim |
| nome | Filtro de busca por nome | Sim |
| label | Filtro de busca por label | Sim |

