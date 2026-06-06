# Formas-Pagamento

**Fonte:** https://allinbrasil.com.br/api/documentacao

## Descrição

Endpoint que retorna todas as formas de pagamento disponíveis no sistema

## Escopo Necessário

`forma_pagamento`

## Endpoints

### GET Formas-Pagamento

**URL:** `https://allinbrasil.com.br/api/v1/formas-pagamento`

### POST Formas-Pagamento

**URL:** `https://allinbrasil.com.br/api/v1/formas-pagamento`

## Resposta

### Atributos

| Atributo | Descrição | Tipo |
|----------|-----------|------|
| formas_pagamento[].nome | Nome da forma de pagamento | - String 200 caracteres |
| formas_pagamento[].codigo | Código da forma de pagamento | - String 45 caracteres |

