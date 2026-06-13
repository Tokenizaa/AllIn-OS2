# Lojas

**Fonte:** https://allinbrasil.com.br/api/documentacao

## Descrição

Os filtros são parâmetros passados no final do endpoint e são utilizados para filtrar dados

## Escopo Necessário

`lojas`

## Endpoints

### GET Lojas

**URL:** `https://allinbrasil.com.br/api/v1/lojas`

## Resposta

### Atributos

| Atributo | Descrição | Tipo |
|----------|-----------|------|
| limit | Quantidade de linhas que será retornado na sua consulta, no máximo de 100 por página | Sim |
| page | Página que deseja visualizar da consulta realizada | Sim |
| select | Trás somente os dados das colunas selecionadas, separar colunas por virgulas (ex.: nome,idade,cpf) | Sim |
| order_by | Ordena sua busca por parâmetro, utilize o tipo de ordenação com .desc (decrescente) ou .asc (ascendente) após o nome do parâmetro que deseja ordernar Ex.:id.desc (irá ordenar por id do maior para o menor) | Sim |
| id | Filtro de busca para id | Sim |
| id__maior_igual | Filtro de busca para id | Valor do campo é maior ou igual que o valor do parametro informado | Sim |
| id__menor_igual | Filtro de busca para id | Valor do campo é menor ou igual que o valor do parametro informado | Sim |
| id__em | Filtro de busca para id | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim |
| documento | Filtro de busca para documento | Sim |
| documento__maior_igual | Filtro de busca para documento | Valor do campo é maior ou igual que o valor do parametro informado | Sim |
| documento__menor_igual | Filtro de busca para documento | Valor do campo é menor ou igual que o valor do parametro informado | Sim |
| documento__em | Filtro de busca para documento | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim |
| status | Status da loja (1 - Habilitado, 0 - Desabilitado) | Sim |
| status__maior_igual | Status da loja (1 - Habilitado, 0 - Desabilitado) | Valor do campo é maior ou igual que o valor do parametro informado | Sim |
| status__menor_igual | Status da loja (1 - Habilitado, 0 - Desabilitado) | Valor do campo é menor ou igual que o valor do parametro informado | Sim |
| status__em | Status da loja (1 - Habilitado, 0 - Desabilitado) | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim |
| endereco_id | Retornar apenas as lojas que atendem ao endereço especificado | Sim |
| cidade_id | Id da cidade: Filtrar lojas que atendem a cidade | Sim |
| bairro | Bairro: Filtrar lojas que atendem ao bairro | Sim |
| cep | CEP: filtrar apenas lojas que atendem ao CEP | Sim |
| latitude | Raio de atendimento em KM Latitude: filtrar lojas que atendem na localização | Sim |
| longitude | Raio de atendimento em KM Longitude: filtrar lojas que atendem na localização | Sim |
| uf_id | ID do estado: filtrar lojas que atendem a um determinado UF/estado | Sim |
| nome | Filtrar pelo nome da loja | Sim |
| nome__maior_igual | Filtrar pelo nome da loja | Valor do campo é maior ou igual que o valor do parametro informado | Sim |
| nome__menor_igual | Filtrar pelo nome da loja | Valor do campo é menor ou igual que o valor do parametro informado | Sim |
| nome__contem | Filtrar pelo nome da loja | Valor do campo contem que o valor do parametro informado | Sim |
| nome__em | Filtrar pelo nome da loja | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim |

