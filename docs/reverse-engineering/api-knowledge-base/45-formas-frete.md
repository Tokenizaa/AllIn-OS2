# Formas-Frete

**Fonte:** https://allinbrasil.com.br/api/documentacao

## Descrição

Busca as formas de frete de acordo com os parâmetros informados

## Escopo Necessário

`formas_frete`

## Endpoints

### POST Formas-Frete

**URL:** `https://allinbrasil.com.br/api/v1/formas-frete`

## Resposta

### Atributos

| Atributo | Descrição | Tipo |
|----------|-----------|------|
| cep_origem |  | Cep de remetente |
| cep_destino |  | Cep do destinatário |
| loja_id |  | Id da loja |
| grupo_consumo_id |  | Id do grupo de consumo |
| produtos[].produto_id |  | Id do produto |
| produtos[].produto_quantidade |  | Quantidade do produto para comprar |
| produtos[].produto_opcoes[].produto_opcao_id |  | Id da opção |
| produtos[].produto_opcoes[].produto_opcao_valor_id |  | Id do valor da opção |
| endereco_entrega_id |  | ID do endereço de entrega (pode ser obtido em GET v1/clientes ou GETv1/clientes/:clientes_id/enderecos) |

