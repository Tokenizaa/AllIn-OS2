# Produtos-Opcoes

**Fonte:** https://allinbrasil.com.br/api/documentacao

## Descrição

Busca as opções de produto disponíveis

## Escopo Necessário

`produtos_opcoes`

## Endpoints

### GET Produtos-Opcoes

**URL:** `https://allinbrasil.com.br/api/v1/produtos-opcoes`

### POST Produtos-Opcoes

**URL:** `https://allinbrasil.com.br/api/v1/produtos-opcoes`

### PUT Produtos-Opcoes

**URL:** `https://allinbrasil.com.br/api/v1/produtos-opcoes`

### DELETE Produtos-Opcoes

**URL:** `https://allinbrasil.com.br/api/v1/produtos-opcoes`

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
| tipo | Querystring de busca para tipo | Sim |
| tipo__contem | Querystring de busca para tipo | Valor do campo contem que o valor do parametro informado | Sim |
| tipo__em | Querystring de busca para tipo | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim |
| ordem | Querystring de busca para ordem | Sim |
| ordem__maior_igual | Querystring de busca para ordem | Valor do campo é maior ou igual que o valor do parametro informado | Sim |
| ordem__menor_igual | Querystring de busca para ordem | Valor do campo é menor ou igual que o valor do parametro informado | Sim |
| ordem__em | Querystring de busca para ordem | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim |
| combinacao | Querystring de busca para combinacao | Sim |
| combinacao__maior_igual | Querystring de busca para combinacao | Valor do campo é maior ou igual que o valor do parametro informado | Sim |
| combinacao__menor_igual | Querystring de busca para combinacao | Valor do campo é menor ou igual que o valor do parametro informado | Sim |
| combinacao__em | Querystring de busca para combinacao | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim |

