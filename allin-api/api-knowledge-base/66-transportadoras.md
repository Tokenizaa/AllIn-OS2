# Transportadoras

**Fonte:** https://allinbrasil.com.br/api/documentacao

## Descrição

Lista as transportadoras cadastradas pelo administrador no sistema

## Escopo Necessário

`transportadoras`

## Endpoints

### GET Transportadoras

**URL:** `https://allinbrasil.com.br/api/v1/transportadoras`

## Resposta

### Atributos

| Atributo | Descrição | Tipo |
|----------|-----------|------|
| limit | Quantidade de linhas que será retornado na sua consulta, no máximo de 100 por página | Sim |
| page | Página que deseja visualizar da consulta realizada | Sim |
| select | Trás somente os dados das colunas selecionadas, separar colunas por virgulas (ex.: nome,idade,cpf) | Sim |
| order_by | Ordena sua busca por parâmetro, utilize o tipo de ordenação com .desc (decrescente) ou .asc (ascendente) após o nome do parâmetro que deseja ordernar Ex.:id.desc (irá ordenar por id do maior para o menor) | Sim |
| id | Filtro de busca por id | Sim |
| id__maior_igual | Filtro de busca por id | Valor do campo é maior ou igual que o valor do parametro informado | Sim |
| id__menor_igual | Filtro de busca por id | Valor do campo é menor ou igual que o valor do parametro informado | Sim |
| id__em | Filtro de busca por id | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim |
| titulo | Filtro de busca por título | Sim |
| titulo__contem | Filtro de busca por título | Valor do campo contem que o valor do parametro informado | Sim |
| titulo__em | Filtro de busca por título | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim |
| codigo | Filtro de busca por código | Sim |
| codigo__contem | Filtro de busca por código | Valor do campo contem que o valor do parametro informado | Sim |
| codigo__em | Filtro de busca por código | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim |
| telefone | Filtro de busca por telefone | Sim |
| telefone__contem | Filtro de busca por telefone | Valor do campo contem que o valor do parametro informado | Sim |
| telefone__em | Filtro de busca por telefone | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim |
| email | Filtro de busca por email | Sim |
| email__contem | Filtro de busca por email | Valor do campo contem que o valor do parametro informado | Sim |
| email__em | Filtro de busca por email | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim |
| localidades_nao_cadastrada | Filtro de busca se permite localidade não cadastrada | Sim |
| localidades_nao_cadastrada__maior_igual | Filtro de busca se permite localidade não cadastrada | Valor do campo é maior ou igual que o valor do parametro informado | Sim |
| localidades_nao_cadastrada__menor_igual | Filtro de busca se permite localidade não cadastrada | Valor do campo é menor ou igual que o valor do parametro informado | Sim |
| localidades_nao_cadastrada__contem | Filtro de busca se permite localidade não cadastrada | Valor do campo contem que o valor do parametro informado | Sim |
| localidades_nao_cadastrada__em | Filtro de busca se permite localidade não cadastrada | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim |
| preco | Filtro de busca por preço | Sim |
| preco__maior_igual | Filtro de busca por preço | Valor do campo é maior ou igual que o valor do parametro informado | Sim |
| preco__menor_igual | Filtro de busca por preço | Valor do campo é menor ou igual que o valor do parametro informado | Sim |
| preco__contem | Filtro de busca por preço | Valor do campo contem que o valor do parametro informado | Sim |
| preco__em | Filtro de busca por preço | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim |
| situacao | Filtro de busca se está ativo | Sim |
| situacao__maior_igual | Filtro de busca se está ativo | Valor do campo é maior ou igual que o valor do parametro informado | Sim |
| situacao__menor_igual | Filtro de busca se está ativo | Valor do campo é menor ou igual que o valor do parametro informado | Sim |
| situacao__em | Filtro de busca se está ativo | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim |
| data_modificado | Filtro de busca pela data de modificação | Sim |
| data_modificado__maior_igual | Filtro de busca pela data de modificação | Valor do campo é maior ou igual que o valor do parametro informado | Sim |
| data_modificado__menor_igual | Filtro de busca pela data de modificação | Valor do campo é menor ou igual que o valor do parametro informado | Sim |
| data_modificado__contem | Filtro de busca pela data de modificação | Valor do campo contem que o valor do parametro informado | Sim |
| data_modificado__em | Filtro de busca pela data de modificação | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim |
| total_minimo | Filtro de busca pelo total mínimo | Sim |
| total_minimo__maior_igual | Filtro de busca pelo total mínimo | Valor do campo é maior ou igual que o valor do parametro informado | Sim |
| total_minimo__menor_igual | Filtro de busca pelo total mínimo | Valor do campo é menor ou igual que o valor do parametro informado | Sim |
| total_minimo__contem | Filtro de busca pelo total mínimo | Valor do campo contem que o valor do parametro informado | Sim |
| total_minimo__em | Filtro de busca pelo total mínimo | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim |
| loja_id | Filtro de busca pelo id da loja | Sim |
| loja_id__maior_igual | Filtro de busca pelo id da loja | Valor do campo é maior ou igual que o valor do parametro informado | Sim |
| loja_id__menor_igual | Filtro de busca pelo id da loja | Valor do campo é menor ou igual que o valor do parametro informado | Sim |
| loja_id__em | Filtro de busca pelo id da loja | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim |
| unidade_peso | Filtro de busca por unidade de peso | Sim |
| unidade_peso__contem | Filtro de busca por unidade de peso | Valor do campo contem que o valor do parametro informado | Sim |
| unidade_peso__em | Filtro de busca por unidade de peso | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim |
| total_maximo | Filtro de busca pelo total máximo | Sim |
| total_maximo__maior_igual | Filtro de busca pelo total máximo | Valor do campo é maior ou igual que o valor do parametro informado | Sim |
| total_maximo__menor_igual | Filtro de busca pelo total máximo | Valor do campo é menor ou igual que o valor do parametro informado | Sim |
| total_maximo__contem | Filtro de busca pelo total máximo | Valor do campo contem que o valor do parametro informado | Sim |
| total_maximo__em | Filtro de busca pelo total máximo | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim |

