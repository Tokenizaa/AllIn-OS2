# Estoque-Total-Produtos

**Fonte:** https://allinbrasil.com.br/api/documentacao

## Descrição

Retorna o estoque total dos produtos por opção e loja

## Escopo Necessário

`produtos_estoque_totais`

## Endpoints

### GET Estoque-Total-Produtos

**URL:** `https://allinbrasil.com.br/api/v1/estoque-total-produtos`

## Resposta

### Atributos

| Atributo | Descrição | Tipo |
|----------|-----------|------|
| limit | Quantidade de linhas que será retornado na sua consulta, no máximo de 100 por página | Sim |
| page | Página que deseja visualizar da consulta realizada | Sim |
| select | Trás somente os dados das colunas selecionadas, separar colunas por virgulas (ex.: nome,idade,cpf) | Sim |
| order_by | Ordena sua busca por parâmetro, utilize o tipo de ordenação com .desc (decrescente) ou .asc (ascendente) após o nome do parâmetro que deseja ordernar Ex.:id.desc (irá ordenar por id do maior para o menor) | Sim |
| id_loja | Querystring de busca para id_loja | Sim |
| id_loja__maior_igual | Querystring de busca para id_loja | Valor do campo é maior ou igual que o valor do parametro informado | Sim |
| id_loja__menor_igual | Querystring de busca para id_loja | Valor do campo é menor ou igual que o valor do parametro informado | Sim |
| id_loja__em | Querystring de busca para id_loja | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim |
| produto_id | Querystring de busca para produto_id | Sim |
| produto_id__maior_igual | Querystring de busca para produto_id | Valor do campo é maior ou igual que o valor do parametro informado | Sim |
| produto_id__menor_igual | Querystring de busca para produto_id | Valor do campo é menor ou igual que o valor do parametro informado | Sim |
| produto_id__em | Querystring de busca para produto_id | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim |
| produto_opcao_valor_id | Querystring de busca para produto_opcao_valor_id | Sim |
| produto_opcao_valor_id__maior_igual | Querystring de busca para produto_opcao_valor_id | Valor do campo é maior ou igual que o valor do parametro informado | Sim |
| produto_opcao_valor_id__menor_igual | Querystring de busca para produto_opcao_valor_id | Valor do campo é menor ou igual que o valor do parametro informado | Sim |
| produto_opcao_valor_id__em | Querystring de busca para produto_opcao_valor_id | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim |
| total | Estoque total do produto | Sim |
| total__maior_igual | Estoque total do produto | Valor do campo é maior ou igual que o valor do parametro informado | Sim |
| total__menor_igual | Estoque total do produto | Valor do campo é menor ou igual que o valor do parametro informado | Sim |
| total__contem | Estoque total do produto | Valor do campo contem que o valor do parametro informado | Sim |
| total__em | Estoque total do produto | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim |

