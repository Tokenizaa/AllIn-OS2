# Distribuidor-Conta-Bancaria

**Fonte:** https://allinbrasil.com.br/api/documentacao

## Descrição

Retorna lista de dados das contas bancárias dos distribuidores

## Endpoints

### GET Distribuidor-Conta-Bancaria

**URL:** `https://allinbrasil.com.br/api/v1/distribuidor-conta-bancaria`

## Resposta

### Atributos

| Atributo | Descrição | Tipo |
|----------|-----------|------|
| limit | Quantidade de linhas que será retornado na sua consulta, no máximo de 100 por página | Sim |
| page | Página que deseja visualizar da consulta realizada | Sim |
| select | Trás somente os dados das colunas selecionadas, separar colunas por virgulas (ex.: nome,idade,cpf) | Sim |
| order_by | Ordena sua busca por parâmetro, utilize o tipo de ordenação com .desc (decrescente) ou .asc (ascendente) após o nome do parâmetro que deseja ordernar Ex.:id.desc (irá ordenar por id do maior para o menor) | Sim |
| id | Id da conta | Sim |
| id__maior_igual | Id da conta | Valor do campo é maior ou igual que o valor do parametro informado | Sim |
| id__menor_igual | Id da conta | Valor do campo é menor ou igual que o valor do parametro informado | Sim |
| id__em | Id da conta | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim |
| distribuidor | Id do distribuidor | Sim |
| distribuidor__maior_igual | Id do distribuidor | Valor do campo é maior ou igual que o valor do parametro informado | Sim |
| distribuidor__menor_igual | Id do distribuidor | Valor do campo é menor ou igual que o valor do parametro informado | Sim |
| distribuidor__em | Id do distribuidor | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim |
| banco | Id do banco | Sim |
| banco__maior_igual | Id do banco | Valor do campo é maior ou igual que o valor do parametro informado | Sim |
| banco__menor_igual | Id do banco | Valor do campo é menor ou igual que o valor do parametro informado | Sim |
| banco__em | Id do banco | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim |
| tipo_titular | Tipo de pessoa do titular da conta 1 - física, 2 - jurídica | Sim |
| tipo_titular__maior_igual | Tipo de pessoa do titular da conta 1 - física, 2 - jurídica | Valor do campo é maior ou igual que o valor do parametro informado | Sim |
| tipo_titular__menor_igual | Tipo de pessoa do titular da conta 1 - física, 2 - jurídica | Valor do campo é menor ou igual que o valor do parametro informado | Sim |
| tipo_titular__em | Tipo de pessoa do titular da conta 1 - física, 2 - jurídica | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim |
| nome | Nome do titular da conta | Sim |
| nome__contem | Nome do titular da conta | Valor do campo contem que o valor do parametro informado | Sim |
| nome__em | Nome do titular da conta | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim |
| telefone | Telefone do titular da conta | Sim |
| telefone__contem | Telefone do titular da conta | Valor do campo contem que o valor do parametro informado | Sim |
| telefone__em | Telefone do titular da conta | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim |
| cpf | Cpf do titular da conta | Sim |
| cpf__contem | Cpf do titular da conta | Valor do campo contem que o valor do parametro informado | Sim |
| cpf__em | Cpf do titular da conta | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim |
| cnpj | Cnpj do titular da conta | Sim |
| cnpj__contem | Cnpj do titular da conta | Valor do campo contem que o valor do parametro informado | Sim |
| cnpj__em | Cnpj do titular da conta | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim |
| chave_pix | Chave pix da conta | Sim |
| chave_pix__contem | Chave pix da conta | Valor do campo contem que o valor do parametro informado | Sim |
| chave_pix__em | Chave pix da conta | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim |

