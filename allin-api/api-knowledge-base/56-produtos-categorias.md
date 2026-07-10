# Produtos-Categorias

**Fonte:** https://allinbrasil.com.br/api/documentacao

## Descrição

Os filtros são parâmetros passados no final do endpoint e são utilizados para filtrar dados

## Escopo Necessário

`produtos_categorias_listar`

## Endpoints

### GET Produtos-Categorias

**URL:** `https://allinbrasil.com.br/api/v1/produtos-categorias`

### POST Produtos-Categorias

**URL:** `https://allinbrasil.com.br/api/v1/produtos-categorias`

### PUT Produtos-Categorias

**URL:** `https://allinbrasil.com.br/api/v1/produtos-categorias`

## Resposta

### Atributos

| Atributo | Descrição | Tipo |
|----------|-----------|------|
| limit | Quantidade de linhas que será retornado na sua consulta, no máximo de 100 por página | Sim |
| page | Página que deseja visualizar da consulta realizada | Sim |
| select | Trás somente os dados das colunas selecionadas, separar colunas por virgulas (ex.: nome,idade,cpf) | Sim |
| order_by | Ordena sua busca por parâmetro, utilize o tipo de ordenação com .desc (decrescente) ou .asc (ascendente) após o nome do parâmetro que deseja ordernar Ex.:id.desc (irá ordenar por id do maior para o menor) | Sim |
| id | Querystring de busca para id | Sim |
| id__maior_igual | Querystring de busca para id | Valor do campo é maior ou igual que o valor do parametro informado | Sim |
| id__menor_igual | Querystring de busca para id | Valor do campo é menor ou igual que o valor do parametro informado | Sim |
| id__em | Querystring de busca para id | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim |
| image | Querystring de busca para image | Sim |
| image__contem | Querystring de busca para image | Valor do campo contem que o valor do parametro informado | Sim |
| image__em | Querystring de busca para image | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim |
| categoria_pai_id | Querystring de busca para categoria_pai_id | Sim |
| categoria_pai_id__maior_igual | Querystring de busca para categoria_pai_id | Valor do campo é maior ou igual que o valor do parametro informado | Sim |
| categoria_pai_id__menor_igual | Querystring de busca para categoria_pai_id | Valor do campo é menor ou igual que o valor do parametro informado | Sim |
| categoria_pai_id__em | Querystring de busca para categoria_pai_id | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim |
| ordem | Querystring de busca para ordem | Sim |
| ordem__maior_igual | Querystring de busca para ordem | Valor do campo é maior ou igual que o valor do parametro informado | Sim |
| ordem__menor_igual | Querystring de busca para ordem | Valor do campo é menor ou igual que o valor do parametro informado | Sim |
| ordem__em | Querystring de busca para ordem | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim |
| status | Querystring de busca para status | Sim |
| status__maior_igual | Querystring de busca para status | Valor do campo é maior ou igual que o valor do parametro informado | Sim |
| status__menor_igual | Querystring de busca para status | Valor do campo é menor ou igual que o valor do parametro informado | Sim |
| status__em | Querystring de busca para status | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim |

