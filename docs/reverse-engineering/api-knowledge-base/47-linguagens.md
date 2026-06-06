# Linguagens

**Fonte:** https://allinbrasil.com.br/api/documentacao

## Descrição

Listar as Linguagens/Idiomas

## Escopo Necessário

`linguagens`

## Endpoints

### GET Linguagens

**URL:** `https://allinbrasil.com.br/api/v1/linguagens`

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
| titulo | Querystring de busca para titulo | Sim |
| titulo__contem | Querystring de busca para titulo | Valor do campo contem que o valor do parametro informado | Sim |
| titulo__em | Querystring de busca para titulo | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim |
| sigla | Querystring de busca para sigla | Sim |
| sigla__contem | Querystring de busca para sigla | Valor do campo contem que o valor do parametro informado | Sim |
| sigla__em | Querystring de busca para sigla | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim |
| diretorio | Querystring de busca para diretorio | Sim |
| diretorio__contem | Querystring de busca para diretorio | Valor do campo contem que o valor do parametro informado | Sim |
| diretorio__em | Querystring de busca para diretorio | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim |
| data_formato | Querystring de busca para data_formato | Sim |
| data_formato__contem | Querystring de busca para data_formato | Valor do campo contem que o valor do parametro informado | Sim |
| data_formato__em | Querystring de busca para data_formato | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim |
| icon | Querystring de busca para icon | Sim |
| icon__contem | Querystring de busca para icon | Valor do campo contem que o valor do parametro informado | Sim |
| icon__em | Querystring de busca para icon | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim |
| status | Querystring de busca para status | Sim |
| status__maior_igual | Querystring de busca para status | Valor do campo é maior ou igual que o valor do parametro informado | Sim |
| status__menor_igual | Querystring de busca para status | Valor do campo é menor ou igual que o valor do parametro informado | Sim |
| status__em | Querystring de busca para status | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim |
| padrao | Querystring de busca para padrao | Sim |
| padrao__maior_igual | Querystring de busca para padrao | Valor do campo é maior ou igual que o valor do parametro informado | Sim |
| padrao__menor_igual | Querystring de busca para padrao | Valor do campo é menor ou igual que o valor do parametro informado | Sim |
| padrao__em | Querystring de busca para padrao | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim |
| ordem | Querystring de busca para ordem | Sim |
| ordem__maior_igual | Querystring de busca para ordem | Valor do campo é maior ou igual que o valor do parametro informado | Sim |
| ordem__menor_igual | Querystring de busca para ordem | Valor do campo é menor ou igual que o valor do parametro informado | Sim |
| ordem__em | Querystring de busca para ordem | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim |
| cms_usuarios_id | Querystring de busca para cms_usuarios_id | Sim |
| cms_usuarios_id__maior_igual | Querystring de busca para cms_usuarios_id | Valor do campo é maior ou igual que o valor do parametro informado | Sim |
| cms_usuarios_id__menor_igual | Querystring de busca para cms_usuarios_id | Valor do campo é menor ou igual que o valor do parametro informado | Sim |
| cms_usuarios_id__em | Querystring de busca para cms_usuarios_id | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim |
| insert_data | Querystring de busca para insert_data | Sim |
| insert_data__maior_igual | Querystring de busca para insert_data | Valor do campo é maior ou igual que o valor do parametro informado | Sim |
| insert_data__menor_igual | Querystring de busca para insert_data | Valor do campo é menor ou igual que o valor do parametro informado | Sim |
| insert_data__contem | Querystring de busca para insert_data | Valor do campo contem que o valor do parametro informado | Sim |
| insert_data__em | Querystring de busca para insert_data | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim |
| update_data | Querystring de busca para update_data | Sim |
| update_data__maior_igual | Querystring de busca para update_data | Valor do campo é maior ou igual que o valor do parametro informado | Sim |
| update_data__menor_igual | Querystring de busca para update_data | Valor do campo é menor ou igual que o valor do parametro informado | Sim |
| update_data__contem | Querystring de busca para update_data | Valor do campo contem que o valor do parametro informado | Sim |
| update_data__em | Querystring de busca para update_data | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim |

