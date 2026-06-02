# Estados

**Fonte:** https://allinbrasil.com.br/api/documentacao

## Descrição

Buscar estados do sistema

## Escopo Necessário

`estados_listar`

## Endpoints

### GET Estados

**URL:** `https://allinbrasil.com.br/api/v1/estados`

### POST Estados

**URL:** `https://allinbrasil.com.br/api/v1/estados`

## Resposta

### Atributos

| Atributo | Descrição | Tipo |
|----------|-----------|------|
| limit | Quantidade de linhas que será retornado na sua consulta, no máximo de 100 por página | Sim |
| page | Página que deseja visualizar da consulta realizada | Sim |
| select | Trás somente os dados das colunas selecionadas, separar colunas por virgulas (ex.: nome,idade,cpf) | Sim |
| order_by | Ordena sua busca por parâmetro, utilize o tipo de ordenação com .desc (decrescente) ou .asc (ascendente) após o nome do parâmetro que deseja ordernar Ex.:id.desc (irá ordenar por id do maior para o menor) | Sim |
| id | Filtrar pelo id do estado | Sim |
| id__maior_igual | Filtrar pelo id do estado | Valor do campo é maior ou igual que o valor do parametro informado | Sim |
| id__menor_igual | Filtrar pelo id do estado | Valor do campo é menor ou igual que o valor do parametro informado | Sim |
| id__em | Filtrar pelo id do estado | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim |
| uf | Filtrar pelo UF do estado | Sim |
| uf__contem | Filtrar pelo UF do estado | Valor do campo contem que o valor do parametro informado | Sim |
| uf__em | Filtrar pelo UF do estado | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim |
| nome | Filtrar pelo nome do estado | Sim |
| nome__contem | Filtrar pelo nome do estado | Valor do campo contem que o valor do parametro informado | Sim |
| nome__em | Filtrar pelo nome do estado | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim |
| pais_id | Filtrar pelo id do pais onde situa o estado | Sim |
| pais_id__maior_igual | Filtrar pelo id do pais onde situa o estado | Valor do campo é maior ou igual que o valor do parametro informado | Sim |
| pais_id__menor_igual | Filtrar pelo id do pais onde situa o estado | Valor do campo é menor ou igual que o valor do parametro informado | Sim |
| pais_id__em | Filtrar pelo id do pais onde situa o estado | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim |
| pais_nome | Filtrar pelo nome do pais onde situa o estado | Sim |
| pais_nome__contem | Filtrar pelo nome do pais onde situa o estado | Valor do campo contem que o valor do parametro informado | Sim |
| pais_nome__em | Filtrar pelo nome do pais onde situa o estado | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim |

