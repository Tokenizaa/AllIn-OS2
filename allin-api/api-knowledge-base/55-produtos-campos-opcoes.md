# Produtos-Campos-Opcoes

**Fonte:** https://allinbrasil.com.br/api/documentacao

## Descrição

Campos das opções dos produtos

## Escopo Necessário

`campos_opcoes_produtos`

## Endpoints

### GET Produtos-Campos-Opcoes

**URL:** `https://allinbrasil.com.br/api/v1/produtos-campos-opcoes`

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
| descricao | Querystring de busca para descricao | Sim |
| descricao__contem | Querystring de busca para descricao | Valor do campo contem que o valor do parametro informado | Sim |
| descricao__em | Querystring de busca para descricao | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim |
| componente | Querystring de busca para componente | Sim |
| componente__contem | Querystring de busca para componente | Valor do campo contem que o valor do parametro informado | Sim |
| componente__em | Querystring de busca para componente | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim |
| ativo | Querystring de busca para ativo | Sim |
| ativo__maior_igual | Querystring de busca para ativo | Valor do campo é maior ou igual que o valor do parametro informado | Sim |
| ativo__menor_igual | Querystring de busca para ativo | Valor do campo é menor ou igual que o valor do parametro informado | Sim |
| ativo__em | Querystring de busca para ativo | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim |

