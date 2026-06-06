# Pedidos

**Fonte:** https://allinbrasil.com.br/api/documentacao

## Descrição

Retorna os pedidos feitos na loja virtual por distribuidores da rede e clientes finais

## Escopo Necessário

`pedidos`

## Endpoints

### GET Pedidos

**URL:** `https://allinbrasil.com.br/api/v1/pedidos`

### POST Pedidos

**URL:** `https://allinbrasil.com.br/api/v1/pedidos`

### POST Alterar-Status

**URL:** `https://allinbrasil.com.br/api/v1/pedidos/AlterarStatus`

### POST Cancelar

**URL:** `https://allinbrasil.com.br/api/v1/pedidos/Cancelar`

### POST Confirmar-Pagamento

**URL:** `https://allinbrasil.com.br/api/v1/pedidos/ConfirmarPagamento`

### GET Historico

**URL:** `https://allinbrasil.com.br/api/v1/pedidos/Historico`

### POST Historico

**URL:** `https://allinbrasil.com.br/api/v1/pedidos/Historico`

### GET Itens

**URL:** `https://allinbrasil.com.br/api/v1/pedidos/Itens`

### GET Kit-Itens

**URL:** `https://allinbrasil.com.br/api/v1/pedidos/Itens/KitItens`

### GET Itens-Faturamento

**URL:** `https://allinbrasil.com.br/api/v1/pedidos/ItensFaturamento`

### GET Pagamentos

**URL:** `https://allinbrasil.com.br/api/v1/pedidos/Pagamentos`

### POST Pagamentos

**URL:** `https://allinbrasil.com.br/api/v1/pedidos/Pagamentos`

### PUT Pagamentos

**URL:** `https://allinbrasil.com.br/api/v1/pedidos/Pagamentos`

### GET Totais

**URL:** `https://allinbrasil.com.br/api/v1/pedidos/Totais`

### GET Transportes

**URL:** `https://allinbrasil.com.br/api/v1/pedidos/Transportes`

## Resposta

### Atributos

| Atributo | Descrição | Tipo |
|----------|-----------|------|
| limit | Quantidade de linhas que será retornado na sua consulta, no máximo de 100 por página | Sim |
| page | Página que deseja visualizar da consulta realizada | Sim |
| select | Trás somente os dados das colunas selecionadas, separar colunas por virgulas (ex.: nome,idade,cpf) | Sim |
| order_by | Ordena sua busca por parâmetro, utilize o tipo de ordenação com .desc (decrescente) ou .asc (ascendente) após o nome do parâmetro que deseja ordernar Ex.:id.desc (irá ordenar por id do maior para o menor) | Sim |
| id | Filtro de busca por Id | Sim |
| id__maior_igual | Filtro de busca por Id | Valor do campo é maior ou igual que o valor do parametro informado | Sim |
| id__menor_igual | Filtro de busca por Id | Valor do campo é menor ou igual que o valor do parametro informado | Sim |
| id__em | Filtro de busca por Id | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim |
| distribuidor_indicador_id | Filtro de busca por id do distribuidor indicador | Sim |
| distribuidor_indicador_id__maior_igual | Filtro de busca por id do distribuidor indicador | Valor do campo é maior ou igual que o valor do parametro informado | Sim |
| distribuidor_indicador_id__menor_igual | Filtro de busca por id do distribuidor indicador | Valor do campo é menor ou igual que o valor do parametro informado | Sim |
| distribuidor_indicador_id__em | Filtro de busca por id do distribuidor indicador | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim |
| distribuidor_comprador_id | Filtro de busca por id do distribuidor comprador | Sim |
| distribuidor_comprador_id__maior_igual | Filtro de busca por id do distribuidor comprador | Valor do campo é maior ou igual que o valor do parametro informado | Sim |
| distribuidor_comprador_id__menor_igual | Filtro de busca por id do distribuidor comprador | Valor do campo é menor ou igual que o valor do parametro informado | Sim |
| distribuidor_comprador_id__em | Filtro de busca por id do distribuidor comprador | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim |
| loja_id | Filtro de busca por id da loja | Sim |
| loja_id__maior_igual | Filtro de busca por id da loja | Valor do campo é maior ou igual que o valor do parametro informado | Sim |
| loja_id__menor_igual | Filtro de busca por id da loja | Valor do campo é menor ou igual que o valor do parametro informado | Sim |
| loja_id__em | Filtro de busca por id da loja | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim |
| loja_nome | Filtro de busca por nome da loja | Sim |
| loja_nome__contem | Filtro de busca por nome da loja | Valor do campo contem que o valor do parametro informado | Sim |
| loja_nome__em | Filtro de busca por nome da loja | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim |
| cliente_id | Filtro de busca por id do cliente | Sim |
| cliente_id__maior_igual | Filtro de busca por id do cliente | Valor do campo é maior ou igual que o valor do parametro informado | Sim |
| cliente_id__menor_igual | Filtro de busca por id do cliente | Valor do campo é menor ou igual que o valor do parametro informado | Sim |
| cliente_id__em | Filtro de busca por id do cliente | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim |
| tipo_id | Filtro de busca por id do tipo de compra | Sim |
| tipo_id__maior_igual | Filtro de busca por id do tipo de compra | Valor do campo é maior ou igual que o valor do parametro informado | Sim |
| tipo_id__menor_igual | Filtro de busca por id do tipo de compra | Valor do campo é menor ou igual que o valor do parametro informado | Sim |
| tipo_id__em | Filtro de busca por id do tipo de compra | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim |
| tipo_chave | Filtro de busca por chave do tipo de compra | Sim |
| tipo_chave__contem | Filtro de busca por chave do tipo de compra | Valor do campo contem que o valor do parametro informado | Sim |
| tipo_chave__em | Filtro de busca por chave do tipo de compra | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim |
| tipo_nome | Filtro de busca por nome do tipo de compra | Sim |
| tipo_nome__contem | Filtro de busca por nome do tipo de compra | Valor do campo contem que o valor do parametro informado | Sim |
| tipo_nome__em | Filtro de busca por nome do tipo de compra | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim |
| tipo_descricao | Filtro de busca por descrição do tipo de compra | Sim |
| tipo_descricao__contem | Filtro de busca por descrição do tipo de compra | Valor do campo contem que o valor do parametro informado | Sim |
| tipo_descricao__em | Filtro de busca por descrição do tipo de compra | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim |
| cliente_nome | Filtro de busca por nome do cliente | Sim |
| cliente_nome__contem | Filtro de busca por nome do cliente | Valor do campo contem que o valor do parametro informado | Sim |
| cliente_nome__em | Filtro de busca por nome do cliente | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim |
| cliente_sobrenome | Filtro de busca por sobrenome do cliente | Sim |
| cliente_sobrenome__contem | Filtro de busca por sobrenome do cliente | Valor do campo contem que o valor do parametro informado | Sim |
| cliente_sobrenome__em | Filtro de busca por sobrenome do cliente | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim |
| cliente_email | Filtro de busca por email do cliente | Sim |
| cliente_email__contem | Filtro de busca por email do cliente | Valor do campo contem que o valor do parametro informado | Sim |
| cliente_email__em | Filtro de busca por email do cliente | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim |
| cliente_telefone | Filtro de busca por telefone do cliente | Sim |
| cliente_telefone__contem | Filtro de busca por telefone do cliente | Valor do campo contem que o valor do parametro informado | Sim |
| cliente_telefone__em | Filtro de busca por telefone do cliente | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim |
| cliente_rg | Filtro de busca por RG do cliente | Sim |
| cliente_rg__contem | Filtro de busca por RG do cliente | Valor do campo contem que o valor do parametro informado | Sim |
| cliente_rg__em | Filtro de busca por RG do cliente | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim |
| cliente_cpf | Filtro de busca por cpf do cliente | Sim |
| cliente_cpf__contem | Filtro de busca por cpf do cliente | Valor do campo contem que o valor do parametro informado | Sim |
| cliente_cpf__em | Filtro de busca por cpf do cliente | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim |
| cliente_cnpj | Filtro de busca por cnpj do cliente | Sim |
| cliente_cnpj__contem | Filtro de busca por cnpj do cliente | Valor do campo contem que o valor do parametro informado | Sim |
| cliente_cnpj__em | Filtro de busca por cnpj do cliente | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim |
| cliente_ie | Filtro de busca por inscrição estadual do cliente | Sim |
| cliente_ie__contem | Filtro de busca por inscrição estadual do cliente | Valor do campo contem que o valor do parametro informado | Sim |
| cliente_ie__em | Filtro de busca por inscrição estadual do cliente | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim |
| pagamento_confirmado | Filtro de busca por confirmação do pagamento (\'1\' para pago e \'0\' para não pago) | Sim |
| pagamento_confirmado__maior_igual | Filtro de busca por confirmação do pagamento (\'1\' para pago e \'0\' para não pago) | Valor do campo é maior ou igual que o valor do parametro informado | Sim |
| pagamento_confirmado__menor_igual | Filtro de busca por confirmação do pagamento (\'1\' para pago e \'0\' para não pago) | Valor do campo é menor ou igual que o valor do parametro informado | Sim |
| pagamento_confirmado__em | Filtro de busca por confirmação do pagamento (\'1\' para pago e \'0\' para não pago) | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim |
| comanda_impressao | Filtro de busca por impressão da comanda (\'1\' para impresso e \'0\' para não impresso) | Sim |
| comanda_impressao__maior_igual | Filtro de busca por impressão da comanda (\'1\' para impresso e \'0\' para não impresso) | Valor do campo é maior ou igual que o valor do parametro informado | Sim |
| comanda_impressao__menor_igual | Filtro de busca por impressão da comanda (\'1\' para impresso e \'0\' para não impresso) | Valor do campo é menor ou igual que o valor do parametro informado | Sim |
| comanda_impressao__em | Filtro de busca por impressão da comanda (\'1\' para impresso e \'0\' para não impresso) | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim |
| fatura_impressao | Filtro de busca por impressão da fatura (\'1\' para impresso e \'0\' para não impresso) | Sim |
| fatura_impressao__maior_igual | Filtro de busca por impressão da fatura (\'1\' para impresso e \'0\' para não impresso) | Valor do campo é maior ou igual que o valor do parametro informado | Sim |
| fatura_impressao__menor_igual | Filtro de busca por impressão da fatura (\'1\' para impresso e \'0\' para não impresso) | Valor do campo é menor ou igual que o valor do parametro informado | Sim |
| fatura_impressao__em | Filtro de busca por impressão da fatura (\'1\' para impresso e \'0\' para não impresso) | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim |
| necessita_frete | Filtro de busca se necessita frete | Sim |
| necessita_frete__maior_igual | Filtro de busca se necessita frete | Valor do campo é maior ou igual que o valor do parametro informado | Sim |
| necessita_frete__menor_igual | Filtro de busca se necessita frete | Valor do campo é menor ou igual que o valor do parametro informado | Sim |
| necessita_frete__em | Filtro de busca se necessita frete | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim |
| data_pagamento | Filtro de busca por data de pagamento | Sim |
| data_pagamento__maior_igual | Filtro de busca por data de pagamento | Valor do campo é maior ou igual que o valor do parametro informado | Sim |
| data_pagamento__menor_igual | Filtro de busca por data de pagamento | Valor do campo é menor ou igual que o valor do parametro informado | Sim |
| data_pagamento__contem | Filtro de busca por data de pagamento | Valor do campo contem que o valor do parametro informado | Sim |
| data_pagamento__em | Filtro de busca por data de pagamento | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim |
| cliente_logradouro | Filtro de busca por logradouro do cliente | Sim |
| cliente_logradouro__contem | Filtro de busca por logradouro do cliente | Valor do campo contem que o valor do parametro informado | Sim |
| cliente_logradouro__em | Filtro de busca por logradouro do cliente | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim |
| cliente_bairro | Filtro de busca por bairro do cliente | Sim |
| cliente_bairro__contem | Filtro de busca por bairro do cliente | Valor do campo contem que o valor do parametro informado | Sim |
| cliente_bairro__em | Filtro de busca por bairro do cliente | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim |
| cliente_cep | Filtro de busca por cep do cliente | Sim |
| cliente_cep__contem | Filtro de busca por cep do cliente | Valor do campo contem que o valor do parametro informado | Sim |
| cliente_cep__em | Filtro de busca por cep do cliente | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim |
| cliente_cidade | Filtro de busca por cidade do cliente | Sim |
| cliente_cidade__contem | Filtro de busca por cidade do cliente | Valor do campo contem que o valor do parametro informado | Sim |
| cliente_cidade__em | Filtro de busca por cidade do cliente | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim |
| cliente_uf | Filtro de busca unidade federativa do cliente | Sim |
| cliente_uf__contem | Filtro de busca unidade federativa do cliente | Valor do campo contem que o valor do parametro informado | Sim |
| cliente_uf__em | Filtro de busca unidade federativa do cliente | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim |
| entrega_nome | Filtro de busca nome da pessoa que irá receber a entrega | Sim |
| entrega_nome__contem | Filtro de busca nome da pessoa que irá receber a entrega | Valor do campo contem que o valor do parametro informado | Sim |
| entrega_nome__em | Filtro de busca nome da pessoa que irá receber a entrega | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim |
| entrega_sobrenome | Filtro de busca sobrenome da pessoa que irá receber a entrega | Sim |
| entrega_sobrenome__contem | Filtro de busca sobrenome da pessoa que irá receber a entrega | Valor do campo contem que o valor do parametro informado | Sim |
| entrega_sobrenome__em | Filtro de busca sobrenome da pessoa que irá receber a entrega | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim |
| entrega_logradouro | Filtro de busca logradouro da pessoa que irá receber a entrega | Sim |
| entrega_logradouro__contem | Filtro de busca logradouro da pessoa que irá receber a entrega | Valor do campo contem que o valor do parametro informado | Sim |
| entrega_logradouro__em | Filtro de busca logradouro da pessoa que irá receber a entrega | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim |
| entrega_bairro | Filtro de busca bairro da pessoa que irá receber a entrega | Sim |
| entrega_bairro__contem | Filtro de busca bairro da pessoa que irá receber a entrega | Valor do campo contem que o valor do parametro informado | Sim |
| entrega_bairro__em | Filtro de busca bairro da pessoa que irá receber a entrega | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim |
| entrega_cep | Filtro de busca cep da pessoa que irá receber a entrega | Sim |
| entrega_cep__contem | Filtro de busca cep da pessoa que irá receber a entrega | Valor do campo contem que o valor do parametro informado | Sim |
| entrega_cep__em | Filtro de busca cep da pessoa que irá receber a entrega | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim |
| entrega_cidade | Filtro de busca por cidade de entrega | Sim |
| entrega_cidade__contem | Filtro de busca por cidade de entrega | Valor do campo contem que o valor do parametro informado | Sim |
| entrega_cidade__em | Filtro de busca por cidade de entrega | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim |
| entrega_uf | Filtro de busca unidade federativa da pessoa que irá receber a entrega | Sim |
| entrega_uf__contem | Filtro de busca unidade federativa da pessoa que irá receber a entrega | Valor do campo contem que o valor do parametro informado | Sim |
| entrega_uf__em | Filtro de busca unidade federativa da pessoa que irá receber a entrega | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim |
| comentario | Filtro de busca por comentario | Sim |
| comentario__contem | Filtro de busca por comentario | Valor do campo contem que o valor do parametro informado | Sim |
| comentario__em | Filtro de busca por comentario | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim |
| valor_total | Filtro de busca por valor total | Sim |
| valor_total__maior_igual | Filtro de busca por valor total | Valor do campo é maior ou igual que o valor do parametro informado | Sim |
| valor_total__menor_igual | Filtro de busca por valor total | Valor do campo é menor ou igual que o valor do parametro informado | Sim |
| valor_total__contem | Filtro de busca por valor total | Valor do campo contem que o valor do parametro informado | Sim |
| valor_total__em | Filtro de busca por valor total | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim |
| status_id | Filtro de busca por id do status | Sim |
| status_id__maior_igual | Filtro de busca por id do status | Valor do campo é maior ou igual que o valor do parametro informado | Sim |
| status_id__menor_igual | Filtro de busca por id do status | Valor do campo é menor ou igual que o valor do parametro informado | Sim |
| status_id__em | Filtro de busca por id do status | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim |
| status | Filtro de busca por status | Sim |
| status__maior_igual | Filtro de busca por status | Valor do campo é maior ou igual que o valor do parametro informado | Sim |
| status__menor_igual | Filtro de busca por status | Valor do campo é menor ou igual que o valor do parametro informado | Sim |
| status__em | Filtro de busca por status | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim |
| status_descricao | Filtro de busca por descrição do status | Sim |
| status_descricao__contem | Filtro de busca por descrição do status | Valor do campo contem que o valor do parametro informado | Sim |
| status_descricao__em | Filtro de busca por descrição do status | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim |
| moeda_codigo | Filtro de busca por código ISO da moeda | Sim |
| moeda_codigo__contem | Filtro de busca por código ISO da moeda | Valor do campo contem que o valor do parametro informado | Sim |
| moeda_codigo__em | Filtro de busca por código ISO da moeda | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim |
| data_adicionado | Filtro de busca por data que o pedido foi adicionado | Sim |
| data_adicionado__maior_igual | Filtro de busca por data que o pedido foi adicionado | Valor do campo é maior ou igual que o valor do parametro informado | Sim |
| data_adicionado__menor_igual | Filtro de busca por data que o pedido foi adicionado | Valor do campo é menor ou igual que o valor do parametro informado | Sim |
| data_adicionado__contem | Filtro de busca por data que o pedido foi adicionado | Valor do campo contem que o valor do parametro informado | Sim |
| data_adicionado__em | Filtro de busca por data que o pedido foi adicionado | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim |
| data_modificado | Filtro de busca por data que o pedido foi modificado | Sim |
| data_modificado__maior_igual | Filtro de busca por data que o pedido foi modificado | Valor do campo é maior ou igual que o valor do parametro informado | Sim |
| data_modificado__menor_igual | Filtro de busca por data que o pedido foi modificado | Valor do campo é menor ou igual que o valor do parametro informado | Sim |
| data_modificado__contem | Filtro de busca por data que o pedido foi modificado | Valor do campo contem que o valor do parametro informado | Sim |
| data_modificado__em | Filtro de busca por data que o pedido foi modificado | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim |
| loja_documento | Filtro de busca para loja_documento | Sim |
| loja_documento__contem | Filtro de busca para loja_documento | Valor do campo contem que o valor do parametro informado | Sim |
| loja_documento__em | Filtro de busca para loja_documento | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim |
| cancelado | Filtro de busca por pedidos que foram ou não cancelados (1 para sim, 0 para não) | Sim |
| cancelado__maior_igual | Filtro de busca por pedidos que foram ou não cancelados (1 para sim, 0 para não) | Valor do campo é maior ou igual que o valor do parametro informado | Sim |
| cancelado__menor_igual | Filtro de busca por pedidos que foram ou não cancelados (1 para sim, 0 para não) | Valor do campo é menor ou igual que o valor do parametro informado | Sim |
| cancelado__em | Filtro de busca por pedidos que foram ou não cancelados (1 para sim, 0 para não) | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim |
| data_cancelamento | Filtro de busca por data de cancelamento do pedido | Sim |
| data_cancelamento__maior_igual | Filtro de busca por data de cancelamento do pedido | Valor do campo é maior ou igual que o valor do parametro informado | Sim |
| data_cancelamento__menor_igual | Filtro de busca por data de cancelamento do pedido | Valor do campo é menor ou igual que o valor do parametro informado | Sim |
| data_cancelamento__contem | Filtro de busca por data de cancelamento do pedido | Valor do campo contem que o valor do parametro informado | Sim |
| data_cancelamento__em | Filtro de busca por data de cancelamento do pedido | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim |
| campos_personalizados | Filtro de busca por campos personalizados dos pedidos, deve ser informado com array onde a posição é a chave do campo desejado e o valor é o valor do campo, exemplo: campos_personalizados[campo_1]=10 | Sim |
| market_place | Filtro de busca por pedidos de market place | Sim |
| market_place__maior_igual | Filtro de busca por pedidos de market place | Valor do campo é maior ou igual que o valor do parametro informado | Sim |
| market_place__menor_igual | Filtro de busca por pedidos de market place | Valor do campo é menor ou igual que o valor do parametro informado | Sim |
| market_place__em | Filtro de busca por pedidos de market place | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim |

