# Paises

**Fonte:** https://allinbrasil.com.br/api/documentacao

## Descrição

Busca os países cadastrados no sistema

## Escopo Necessário

`paises_listar`

## Endpoints

### GET Paises

**URL:** `https://allinbrasil.com.br/api/v1/paises`

### POST Paises

**URL:** `https://allinbrasil.com.br/api/v1/paises`

## Resposta

### Atributos

| Atributo | Descrição | Tipo |
|----------|-----------|------|
| limit | Quantidade de linhas que será retornado na sua consulta, no máximo de 100 por página | Sim |
| page | Página que deseja visualizar da consulta realizada | Sim |
| select | Trás somente os dados das colunas selecionadas, separar colunas por virgulas (ex.: nome,idade,cpf) | Sim |
| order_by | Ordena sua busca por parâmetro, utilize o tipo de ordenação com .desc (decrescente) ou .asc (ascendente) após o nome do parâmetro que deseja ordernar Ex.:id.desc (irá ordenar por id do maior para o menor) | Sim |
| id | Id do país | Sim |
| id__maior_igual | Id do país | Valor do campo é maior ou igual que o valor do parametro informado | Sim |
| id__menor_igual | Id do país | Valor do campo é menor ou igual que o valor do parametro informado | Sim |
| id__em | Id do país | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim |
| nome | Nome do país | Sim |
| nome__contem | Nome do país | Valor do campo contem que o valor do parametro informado | Sim |
| nome__em | Nome do país | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim |
| nome_nativo | Nome nativo do país | Sim |
| nome_nativo__contem | Nome nativo do país | Valor do campo contem que o valor do parametro informado | Sim |
| nome_nativo__em | Nome nativo do país | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim |
| sigla | Sigla do país | Sim |
| sigla__contem | Sigla do país | Valor do campo contem que o valor do parametro informado | Sim |
| sigla__em | Sigla do país | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim |
| iso3 | Codigo ISO3 do país | Sim |
| iso3__contem | Codigo ISO3 do país | Valor do campo contem que o valor do parametro informado | Sim |
| iso3__em | Codigo ISO3 do país | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim |

