# Tipos-Pessoa

**Fonte:** https://allinbrasil.com.br/api/documentacao

## Descrição

Listar os Tipos de Pessoa possíveis para Clientes e Distribuidores

## Escopo Necessário

`tipos_pessoa`

## Endpoints

### GET Tipos-Pessoa

**URL:** `https://allinbrasil.com.br/api/v1/tipos-pessoa`

## Resposta

### Atributos

| Atributo | Descrição | Tipo |
|----------|-----------|------|
| limit | Quantidade de linhas que será retornado na sua consulta, no máximo de 100 por página | Sim |
| page | Página que deseja visualizar da consulta realizada | Sim |
| select | Trás somente os dados das colunas selecionadas, separar colunas por virgulas (ex.: nome,idade,cpf) | Sim |
| order_by | Ordena sua busca por parâmetro, utilize o tipo de ordenação com .desc (decrescente) ou .asc (ascendente) após o nome do parâmetro que deseja ordernar Ex.:id.desc (irá ordenar por id do maior para o menor) | Sim |
| id | Filtro de busca para id | Sim |
| nome | Filtro de busca para nome | Sim |
| ativo | Filtro de busca para ativo | Sim |

