# Simulacao

**Fonte:** https://allinbrasil.com.br/api/documentacao

## Descrição

Os filtros são parâmetros passados no final do endpoint e são utilizados para filtrar dados

## Escopo Necessário

`simulacao_listar`

## Endpoints

### GET Simulacao

**URL:** `https://allinbrasil.com.br/api/v1/simulacao`

### POST Simulacao

**URL:** `https://allinbrasil.com.br/api/v1/simulacao`

### POST Cancelar

**URL:** `https://allinbrasil.com.br/api/v1/simulacao/Cancelar`

### POST Executar

**URL:** `https://allinbrasil.com.br/api/v1/simulacao/Executar`

### GET Informacoes-Execucao

**URL:** `https://allinbrasil.com.br/api/v1/simulacao/InformacoesExecucao`

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
| data_inicio | Querystring de busca para data_inicio | Sim |
| data_inicio__maior_igual | Querystring de busca para data_inicio | Valor do campo é maior ou igual que o valor do parametro informado | Sim |
| data_inicio__menor_igual | Querystring de busca para data_inicio | Valor do campo é menor ou igual que o valor do parametro informado | Sim |
| data_inicio__contem | Querystring de busca para data_inicio | Valor do campo contem que o valor do parametro informado | Sim |
| data_inicio__em | Querystring de busca para data_inicio | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim |
| data_fim | Querystring de busca para data_fim | Sim |
| data_fim__maior_igual | Querystring de busca para data_fim | Valor do campo é maior ou igual que o valor do parametro informado | Sim |
| data_fim__menor_igual | Querystring de busca para data_fim | Valor do campo é menor ou igual que o valor do parametro informado | Sim |
| data_fim__contem | Querystring de busca para data_fim | Valor do campo contem que o valor do parametro informado | Sim |
| data_fim__em | Querystring de busca para data_fim | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim |
| data_cadastro | Querystring de busca para data_cadastro | Sim |
| data_cadastro__maior_igual | Querystring de busca para data_cadastro | Valor do campo é maior ou igual que o valor do parametro informado | Sim |
| data_cadastro__menor_igual | Querystring de busca para data_cadastro | Valor do campo é menor ou igual que o valor do parametro informado | Sim |
| data_cadastro__contem | Querystring de busca para data_cadastro | Valor do campo contem que o valor do parametro informado | Sim |
| data_cadastro__em | Querystring de busca para data_cadastro | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim |

