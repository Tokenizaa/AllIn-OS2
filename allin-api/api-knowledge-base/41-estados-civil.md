# Estados-Civil

**Fonte:** https://allinbrasil.com.br/api/documentacao

## Descrição

Listar os Estados Civil possíveis para Clientes e Distribuidores

## Escopo Necessário

`estados_civil`

## Endpoints

### GET Estados-Civil

**URL:** `https://allinbrasil.com.br/api/v1/estados-civil`

## Resposta

### Atributos

| Atributo | Descrição | Tipo |
|----------|-----------|------|
| limit | Quantidade de linhas que será retornado na sua consulta, no máximo de 100 por página | Sim |
| page | Página que deseja visualizar da consulta realizada | Sim |
| select | Trás somente os dados das colunas selecionadas, separar colunas por virgulas (ex.: nome,idade,cpf) | Sim |
| order_by | Ordena sua busca por parâmetro, utilize o tipo de ordenação com .desc (decrescente) ou .asc (ascendente) após o nome do parâmetro que deseja ordernar Ex.:id.desc (irá ordenar por id do maior para o menor) | Sim |
| id | Filtro de busca para id | Sim |
| codigo | Filtro de busca para código | Sim |
| descricao | Filtro de busca pela descrição | Sim |

