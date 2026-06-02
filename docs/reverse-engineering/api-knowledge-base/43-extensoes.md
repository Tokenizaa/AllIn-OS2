# Extensoes

**Fonte:** https://allinbrasil.com.br/api/documentacao

## Descrição

Retorna as extensões ativas na loja virtual

## Escopo Necessário

`extensoes`

## Endpoints

### GET Extensoes

**URL:** `https://allinbrasil.com.br/api/v1/extensoes`

## Resposta

### Atributos

| Atributo | Descrição | Tipo |
|----------|-----------|------|
| limit | Quantidade de linhas que será retornado na sua consulta, no máximo de 100 por página | Sim |
| page | Página que deseja visualizar da consulta realizada | Sim |
| select | Trás somente os dados das colunas selecionadas, separar colunas por virgulas (ex.: nome,idade,cpf) | Sim |
| order_by | Ordena sua busca por parâmetro, utilize o tipo de ordenação com .desc (decrescente) ou .asc (ascendente) após o nome do parâmetro que deseja ordernar Ex.:id.desc (irá ordenar por id do maior para o menor) | Sim |
| id | Filtro de busca por id | Sim |
| loja_id | Filtro de busca por id da loja | Sim |
| tipo | Filtro de busca por tipo | Sim |
| codigo | Filtro de busca por código | Sim |
| descricao | Filtro de busca por descrição | Sim |

