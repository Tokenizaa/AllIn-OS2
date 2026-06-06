# CEP

## GET Cep

### Endpoint do serviço
GET /v1/cep/:id

https://allinbrasil.com.br/api/v1/cep/:id

### Escopo necessário
cep

### Sobre o serviço
Retorna o endereço relacionado ao CEP informado

### Resposta 200 OK

Exemplo de resposta gerada em caso de sucesso no consumo do serviço

```
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8

{
  "cep": "74610250",
  "cidade_id": "2527",
  "cidade": "Goiânia",
  "uf_id": "9",
  "uf_codigo": "GO",
  "uf": "9",
  "pais_id": "1",
  "pais_codigo": "BRL",
  "pais": "Brazil",
  "bairro": "Centro",
  "logradouro": "Rua Fictícia"
}
```

### Descrição dos atributos que são retornados ao acessar o serviço

| Atributo | Descrição | Tipo |
|---------|-----------|------|
| cep | CEP ou Código Postal | Inteiro(8) |
| cidade_id | Id da cidade relacionada ao CEP | Inteiro(11) |
| cidade | Nome da cidade | String 200 caracteres |
| uf_id | Id da unidade federativa relacionada ao CEP | Inteiro(11) |
| uf_codigo | Código da unidade federativa | String 45 caracteres |
| uf | Nome da unidade federativa | String 20 caracteres |
| pais_id | Id do país relacionado ao CEP | Inteiro(11) |
| pais_codigo | Código do país | String 3 caracteres |
| pais | Nome do país | String 255 caracteres |
| bairro | Nome do bairro relacionado ao CEP | String 100 caracteres |
| logradouro | Nome do logradouro relacionado ao CEP | String 200 caracteres |

### Resposta 4xx ou 5xx
Essa resposta é gerada em caso de erro no consumo do serviço. Consulte a sessão de erros para saber detalhadamente os erros que podem ser gerados na resposta e possíveis soluções.
