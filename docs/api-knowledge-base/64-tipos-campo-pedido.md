# Tipos-Campo-Pedido

**Fonte:** https://allinbrasil.com.br/api/documentacao

## Descrição

Tipos de campo disponíveis para os pedidos

## Escopo Necessário

`tipos_campo_pedidos`

## Endpoints

### GET Tipos-Campo-Pedido

**URL:** `https://allinbrasil.com.br/api/v1/tipos-campo-pedido`

## Resposta

### Atributos

| Atributo | Descrição | Tipo |
|----------|-----------|------|
| limit | Quantidade de linhas que será retornado na sua consulta, no máximo de 100 por página | Sim |
| page | Página que deseja visualizar da consulta realizada | Sim |
| select | Trás somente os dados das colunas selecionadas, separar colunas por virgulas (ex.: nome,idade,cpf) | Sim |
| order_by | Ordena sua busca por parâmetro, utilize o tipo de ordenação com .desc (decrescente) ou .asc (ascendente) após o nome do parâmetro que deseja ordernar Ex.:id.desc (irá ordenar por id do maior para o menor) | Sim |
| nome | Querystring de busca para nome | Sim |
| nome__contem | Querystring de busca para nome | Valor do campo contem que o valor do parametro informado | Sim |
| nome__em | Querystring de busca para nome | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim |
| chave | Querystring de busca para chave | Sim |
| chave__contem | Querystring de busca para chave | Valor do campo contem que o valor do parametro informado | Sim |
| chave__em | Querystring de busca para chave | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim |
| tipo | Querystring de busca para tipo | Sim |
| tipo__contem | Querystring de busca para tipo | Valor do campo contem que o valor do parametro informado | Sim |
| tipo__em | Querystring de busca para tipo | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim |
| ativo | Querystring de busca para ativo | Sim |
| ativo__maior_igual | Querystring de busca para ativo | Valor do campo é maior ou igual que o valor do parametro informado | Sim |
| ativo__menor_igual | Querystring de busca para ativo | Valor do campo é menor ou igual que o valor do parametro informado | Sim |
| ativo__em | Querystring de busca para ativo | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim |

