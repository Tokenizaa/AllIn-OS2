# Pedidos-Saldos

**Fonte:** https://allinbrasil.com.br/api/documentacao

## Descrição

Saldos gerados na compra de pacotes

## Escopo Necessário

`pedidos_saldos_listar`

## Endpoints

### GET Pedidos-Saldos

**URL:** `https://allinbrasil.com.br/api/v1/pedidos-saldos`

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
| id__contem | Querystring de busca para id | Valor do campo contem que o valor do parametro informado | Sim |
| id__em | Querystring de busca para id | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim |
| cliente_id | Querystring de busca para cliente_id | Sim |
| cliente_id__maior_igual | Querystring de busca para cliente_id | Valor do campo é maior ou igual que o valor do parametro informado | Sim |
| cliente_id__menor_igual | Querystring de busca para cliente_id | Valor do campo é menor ou igual que o valor do parametro informado | Sim |
| cliente_id__contem | Querystring de busca para cliente_id | Valor do campo contem que o valor do parametro informado | Sim |
| cliente_id__em | Querystring de busca para cliente_id | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim |
| pedido_id | Querystring de busca para pedido_id | Sim |
| pedido_id__maior_igual | Querystring de busca para pedido_id | Valor do campo é maior ou igual que o valor do parametro informado | Sim |
| pedido_id__menor_igual | Querystring de busca para pedido_id | Valor do campo é menor ou igual que o valor do parametro informado | Sim |
| pedido_id__contem | Querystring de busca para pedido_id | Valor do campo contem que o valor do parametro informado | Sim |
| pedido_id__em | Querystring de busca para pedido_id | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim |
| pacote_id | Querystring de busca para pacote_id | Sim |
| pacote_id__maior_igual | Querystring de busca para pacote_id | Valor do campo é maior ou igual que o valor do parametro informado | Sim |
| pacote_id__menor_igual | Querystring de busca para pacote_id | Valor do campo é menor ou igual que o valor do parametro informado | Sim |
| pacote_id__contem | Querystring de busca para pacote_id | Valor do campo contem que o valor do parametro informado | Sim |
| pacote_id__em | Querystring de busca para pacote_id | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim |
| valor | Querystring de busca para valor | Sim |
| valor__maior_igual | Querystring de busca para valor | Valor do campo é maior ou igual que o valor do parametro informado | Sim |
| valor__menor_igual | Querystring de busca para valor | Valor do campo é menor ou igual que o valor do parametro informado | Sim |
| valor__contem | Querystring de busca para valor | Valor do campo contem que o valor do parametro informado | Sim |
| valor__em | Querystring de busca para valor | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim |
| data | Querystring de busca para data | Sim |
| data__maior_igual | Querystring de busca para data | Valor do campo é maior ou igual que o valor do parametro informado | Sim |
| data__menor_igual | Querystring de busca para data | Valor do campo é menor ou igual que o valor do parametro informado | Sim |
| data__contem | Querystring de busca para data | Valor do campo contem que o valor do parametro informado | Sim |
| data__em | Querystring de busca para data | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim |
| tipo_saldo_id | Querystring de busca para tipo_saldo_id | Sim |
| tipo_saldo_id__maior_igual | Querystring de busca para tipo_saldo_id | Valor do campo é maior ou igual que o valor do parametro informado | Sim |
| tipo_saldo_id__menor_igual | Querystring de busca para tipo_saldo_id | Valor do campo é menor ou igual que o valor do parametro informado | Sim |
| tipo_saldo_id__contem | Querystring de busca para tipo_saldo_id | Valor do campo contem que o valor do parametro informado | Sim |
| tipo_saldo_id__em | Querystring de busca para tipo_saldo_id | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim |
| descricao | Querystring de busca para descricao | Sim |
| descricao__maior_igual | Querystring de busca para descricao | Valor do campo é maior ou igual que o valor do parametro informado | Sim |
| descricao__menor_igual | Querystring de busca para descricao | Valor do campo é menor ou igual que o valor do parametro informado | Sim |
| descricao__contem | Querystring de busca para descricao | Valor do campo contem que o valor do parametro informado | Sim |
| descricao__em | Querystring de busca para descricao | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim |
| tipo_componente | Querystring de busca para tipo_componente | Sim |
| tipo_componente__maior_igual | Querystring de busca para tipo_componente | Valor do campo é maior ou igual que o valor do parametro informado | Sim |
| tipo_componente__menor_igual | Querystring de busca para tipo_componente | Valor do campo é menor ou igual que o valor do parametro informado | Sim |
| tipo_componente__contem | Querystring de busca para tipo_componente | Valor do campo contem que o valor do parametro informado | Sim |
| tipo_componente__em | Querystring de busca para tipo_componente | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim |
| mostrar_cliente | Querystring de busca para mostrar_cliente | Sim |
| mostrar_cliente__maior_igual | Querystring de busca para mostrar_cliente | Valor do campo é maior ou igual que o valor do parametro informado | Sim |
| mostrar_cliente__menor_igual | Querystring de busca para mostrar_cliente | Valor do campo é menor ou igual que o valor do parametro informado | Sim |
| mostrar_cliente__contem | Querystring de busca para mostrar_cliente | Valor do campo contem que o valor do parametro informado | Sim |
| mostrar_cliente__em | Querystring de busca para mostrar_cliente | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim |
| pacote_comprado_chave | Querystring de busca para pacote_comprado_chave | Sim |
| pacote_comprado_chave__maior_igual | Querystring de busca para pacote_comprado_chave | Valor do campo é maior ou igual que o valor do parametro informado | Sim |
| pacote_comprado_chave__menor_igual | Querystring de busca para pacote_comprado_chave | Valor do campo é menor ou igual que o valor do parametro informado | Sim |
| pacote_comprado_chave__contem | Querystring de busca para pacote_comprado_chave | Valor do campo contem que o valor do parametro informado | Sim |
| pacote_comprado_chave__em | Querystring de busca para pacote_comprado_chave | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim |
| pacote_descricao | Querystring de busca para pacote_descricao | Sim |
| pacote_descricao__maior_igual | Querystring de busca para pacote_descricao | Valor do campo é maior ou igual que o valor do parametro informado | Sim |
| pacote_descricao__menor_igual | Querystring de busca para pacote_descricao | Valor do campo é menor ou igual que o valor do parametro informado | Sim |
| pacote_descricao__contem | Querystring de busca para pacote_descricao | Valor do campo contem que o valor do parametro informado | Sim |
| pacote_descricao__em | Querystring de busca para pacote_descricao | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim |

