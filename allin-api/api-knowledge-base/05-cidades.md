# Cidades

## GET Cidades

### Endpoint do serviço
GET /v1/cidades

https://allinbrasil.com.br/api/v1/cidades

### Escopo necessário
cidades

### Sobre o serviço
Lista as Cidades cadastradas no sistema

### Filtros aceitos
Os filtros são parâmetros passados no final do endpoint e são utilizados para filtrar dados

**Exemplo de alguns filtros preenchidos:**
```
GET /cidades?limit=100&page=1&select=pessoa_id,pessoa_nome&order_by=pessoa_nome.asc,pessoa_id.desc&id=987567 HTTP/1.1
```

### Descrição das querystring

| Querystring | Descrição | Opcional | Validação |
|-------------|-----------|----------|-----------|
| limit | Quantidade de linhas que será retornado na sua consulta, no máximo de 100 por página | Sim | Inteiro(4) Unsigned |
| page | Página que deseja visualizar da consulta realizada | Sim | Inteiro(11) Unsigned |
| select | Trás somente os dados das colunas selecionadas, separar colunas por virgulas (ex.: nome,idade,cpf) | Sim | String 65535 caracteres |
| order_by | Ordena sua busca por parâmetro, utilize o tipo de ordenação com .desc (decrescente) ou .asc (ascendente) após o nome do parâmetro que deseja ordenar Ex.:id.desc (irá ordenar por id do maior para o menor) | Sim | String 65535 caracteres |
| id | Filtro de busca pelo id da cidade | Sim | Inteiro(11) |
| id__maior_igual | Filtro de busca pelo id da cidade | Valor do campo é maior ou igual que o valor do parâmetro informado | Sim | Inteiro(11) |
| id__menor_igual | Filtro de busca pelo id da cidade | Valor do campo é menor ou igual que o valor do parâmetro informado | Sim | Inteiro(11) |
| id__em | Filtro de busca pelo id da cidade | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para números. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim | - |
| nome | Filtro de busca pelo nome da cidade | Sim | String 200 caracteres |
| nome__contem | Filtro de busca pelo nome da cidade | Valor do campo contem que o valor do parâmetro informado | Sim | String 200 caracteres |
| nome__em | Filtro de busca pelo nome da cidade | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para números. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim | - |
| uf_id | Filtro de busca pelo id da Unidade Federativa | Sim | Inteiro(11) |
| uf_id__maior_igual | Filtro de busca pelo id da Unidade Federativa | Valor do campo é maior ou igual que o valor do parâmetro informado | Sim | Inteiro(11) |
| uf_id__menor_igual | Filtro de busca pelo id da Unidade Federativa | Valor do campo é menor ou igual que o valor do parâmetro informado | Sim | Inteiro(11) |
| uf_id__em | Filtro de busca pelo id da Unidade Federativa | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para números. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim | - |
| uf | Filtro de busca pelo nome da Unidade Federativa | Sim | String 20 caracteres |
| uf__contem | Filtro de busca pelo nome da Unidade Federativa | Valor do campo contem que o valor do parâmetro informado | Sim | String 20 caracteres |
| uf__em | Filtro de busca pelo nome da Unidade Federativa | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para números. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim | - |
| uf_codigo | Filtro de busca Pelo código da Unidade Federativa | Sim | String 45 caracteres |
| uf_codigo__contem | Filtro de busca Pelo código da Unidade Federativa | Valor do campo contem que o valor do parâmetro informado | Sim | String 45 caracteres |
| uf_codigo__em | Filtro de busca Pelo código da Unidade Federativa | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para números. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim | - |
| pais_id | Filtro de busca pelo código do País | Sim | Inteiro(11) |
| pais_id__maior_igual | Filtro de busca pelo código do País | Valor do campo é maior ou igual que o valor do parâmetro informado | Sim | Inteiro(11) |
| pais_id__menor_igual | Filtro de busca pelo código do País | Valor do campo é menor ou igual que o valor do parâmetro informado | Sim | Inteiro(11) |
| pais_id__em | Filtro de busca pelo código do País | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para números. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim | - |
| pais | Filtro de busca pelo nome do País | Sim | String 255 caracteres |
| pais__contem | Filtro de busca pelo nome do País | Valor do campo contem que o valor do parâmetro informado | Sim | String 255 caracteres |
| pais__em | Filtro de busca pelo nome do País | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para números. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim | - |
| pais_codigo | Filtro de busca pelo código do País | Sim | String 3 caracteres |
| pais_codigo__contem | Filtro de busca pelo código do País | Valor do campo contem que o valor do parâmetro informado | Sim | String 3 caracteres |
| pais_codigo__em | Filtro de busca pelo código do País | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para números. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim | - |

### Resposta 200 OK

Exemplo de resposta gerada em caso de sucesso no consumo do serviço

```
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8

{
  "cidades": [
    {
      "id": "4152",
      "nome": "Goiânia",
      "uf_id": "3142",
      "uf": "Goiás",
      "uf_codigo": "GO",
      "pais_id": "1425",
      "pais": "Brasil",
      "pais_codigo": "BRL"
    }
  ]
}
```

### Descrição dos atributos que são retornados ao acessar o serviço

| Atributo | Descrição | Tipo |
|---------|-----------|------|
| cidades[].id | Id da Cidade | Inteiro(11) |
| cidades[].nome | Nome da Cidade | String 200 caracteres |
| cidades[].uf_id | Id da Unidade Federativa | Inteiro(11) |
| cidades[].uf | Nome da Unidade Federativa | String 20 caracteres |
| cidades[].uf_codigo | Código da Unidade Federativa | String 45 caracteres |
| cidades[].pais_id | Id do País | Inteiro(11) |
| cidades[].pais | Nome do País | String 255 caracteres |
| cidades[].pais_codigo | Código do País | String 3 caracteres |

### Resposta 4xx ou 5xx
Essa resposta é gerada em caso de erro no consumo do serviço. Consulte a sessão de erros para saber detalhadamente os erros que podem ser gerados na resposta e possíveis soluções.
