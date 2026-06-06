# Fabricantes

**Fonte:** https://allinbrasil.com.br/api/documentacao

## Descrição

Lista todos os fabricantes

## Escopo Necessário

`listar_fabricantes`

## Endpoints

### GET Fabricantes

**URL:** `https://allinbrasil.com.br/api/v1/fabricantes`

### POST Fabricantes

**URL:** `https://allinbrasil.com.br/api/v1/fabricantes`

### PUT Fabricantes

**URL:** `https://allinbrasil.com.br/api/v1/fabricantes`

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
| nome | Querystring de busca para nome | Sim |
| nome__contem | Querystring de busca para nome | Valor do campo contem que o valor do parametro informado | Sim |
| nome__em | Querystring de busca para nome | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim |
| imagem | Querystring de busca para imagem | Sim |
| imagem__contem | Querystring de busca para imagem | Valor do campo contem que o valor do parametro informado | Sim |
| imagem__em | Querystring de busca para imagem | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim |
| ordem | Querystring de busca para ordem | Sim |
| ordem__maior_igual | Querystring de busca para ordem | Valor do campo é maior ou igual que o valor do parametro informado | Sim |
| ordem__menor_igual | Querystring de busca para ordem | Valor do campo é menor ou igual que o valor do parametro informado | Sim |
| ordem__em | Querystring de busca para ordem | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim |

