# Solicitacoes-Saque

**Fonte:** https://allinbrasil.com.br/api/documentacao

## Descrição

Lista as solicitações de saque realizadas no sistema

## Escopo Necessário

`solicitacao_saque`

## Endpoints

### GET Solicitacoes-Saque

**URL:** `https://allinbrasil.com.br/api/v1/solicitacoes-saque`

### POST Solicitacoes-Saque

**URL:** `https://allinbrasil.com.br/api/v1/solicitacoes-saque`

### POST Confirmar

**URL:** `https://allinbrasil.com.br/api/v1/solicitacoes-saque/Confirmar`

### POST Estornar

**URL:** `https://allinbrasil.com.br/api/v1/solicitacoes-saque/Estornar`

### POST Reverter

**URL:** `https://allinbrasil.com.br/api/v1/solicitacoes-saque/Reverter`

## Resposta

### Atributos

| Atributo | Descrição | Tipo |
|----------|-----------|------|
| limit | Quantidade de linhas que será retornado na sua consulta, no máximo de 100 por página | Sim |
| page | Página que deseja visualizar da consulta realizada | Sim |
| select | Trás somente os dados das colunas selecionadas, separar colunas por virgulas (ex.: nome,idade,cpf) | Sim |
| order_by | Ordena sua busca por parâmetro, utilize o tipo de ordenação com .desc (decrescente) ou .asc (ascendente) após o nome do parâmetro que deseja ordernar Ex.:id.desc (irá ordenar por id do maior para o menor) | Sim |
| id | Filtro de busca pelo id da solicitação | Sim |
| id__maior_igual | Filtro de busca pelo id da solicitação | Valor do campo é maior ou igual que o valor do parametro informado | Sim |
| id__menor_igual | Filtro de busca pelo id da solicitação | Valor do campo é menor ou igual que o valor do parametro informado | Sim |
| id__em | Filtro de busca pelo id da solicitação | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim |
| distribuidor_id | Filtro de busca pelo id do distribuidor que solicitou o saque | Sim |
| distribuidor_id__maior_igual | Filtro de busca pelo id do distribuidor que solicitou o saque | Valor do campo é maior ou igual que o valor do parametro informado | Sim |
| distribuidor_id__menor_igual | Filtro de busca pelo id do distribuidor que solicitou o saque | Valor do campo é menor ou igual que o valor do parametro informado | Sim |
| distribuidor_id__em | Filtro de busca pelo id do distribuidor que solicitou o saque | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim |
| distribuidor_nome | Filtro de busca pelo nome do distribuidor | Sim |
| distribuidor_nome__contem | Filtro de busca pelo nome do distribuidor | Valor do campo contem que o valor do parametro informado | Sim |
| distribuidor_nome__em | Filtro de busca pelo nome do distribuidor | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim |
| distribuidor_usuario | Filtro de busca pelo usuário do distribuidor | Sim |
| distribuidor_usuario__contem | Filtro de busca pelo usuário do distribuidor | Valor do campo contem que o valor do parametro informado | Sim |
| distribuidor_usuario__em | Filtro de busca pelo usuário do distribuidor | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim |
| distribuidor_data_nascimento | Filtro de busca pela data de nascimento do distribuidor | Sim |
| distribuidor_data_nascimento__maior_igual | Filtro de busca pela data de nascimento do distribuidor | Valor do campo é maior ou igual que o valor do parametro informado | Sim |
| distribuidor_data_nascimento__menor_igual | Filtro de busca pela data de nascimento do distribuidor | Valor do campo é menor ou igual que o valor do parametro informado | Sim |
| distribuidor_data_nascimento__contem | Filtro de busca pela data de nascimento do distribuidor | Valor do campo contem que o valor do parametro informado | Sim |
| distribuidor_data_nascimento__em | Filtro de busca pela data de nascimento do distribuidor | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim |
| conta_id | Filtro de busca pelo id da conta de origem do saldo solicitado para saque | Sim |
| conta_id__maior_igual | Filtro de busca pelo id da conta de origem do saldo solicitado para saque | Valor do campo é maior ou igual que o valor do parametro informado | Sim |
| conta_id__menor_igual | Filtro de busca pelo id da conta de origem do saldo solicitado para saque | Valor do campo é menor ou igual que o valor do parametro informado | Sim |
| conta_id__em | Filtro de busca pelo id da conta de origem do saldo solicitado para saque | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim |
| conta_descricao | Filtro de busca pela descrição da conta da qual o distribuidor solicitou o saque | Sim |
| conta_descricao__contem | Filtro de busca pela descrição da conta da qual o distribuidor solicitou o saque | Valor do campo contem que o valor do parametro informado | Sim |
| conta_descricao__em | Filtro de busca pela descrição da conta da qual o distribuidor solicitou o saque | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim |
| status_id | Filtro de busca pelo id do status da solicitação (1 - Solicitado, 3 - Depositado, 4 - Estornado) | Sim |
| status_id__maior_igual | Filtro de busca pelo id do status da solicitação (1 - Solicitado, 3 - Depositado, 4 - Estornado) | Valor do campo é maior ou igual que o valor do parametro informado | Sim |
| status_id__menor_igual | Filtro de busca pelo id do status da solicitação (1 - Solicitado, 3 - Depositado, 4 - Estornado) | Valor do campo é menor ou igual que o valor do parametro informado | Sim |
| status_id__contem | Filtro de busca pelo id do status da solicitação (1 - Solicitado, 3 - Depositado, 4 - Estornado) | Valor do campo contem que o valor do parametro informado | Sim |
| status_id__em | Filtro de busca pelo id do status da solicitação (1 - Solicitado, 3 - Depositado, 4 - Estornado) | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim |
| status_descricao | Filtro de busca pela descrição do status da solicitação | Sim |
| status_descricao__contem | Filtro de busca pela descrição do status da solicitação | Valor do campo contem que o valor do parametro informado | Sim |
| status_descricao__em | Filtro de busca pela descrição do status da solicitação | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim |
| valor_solicitado | Filtro de busca pelo valor total da solicitação | Sim |
| valor_solicitado__maior_igual | Filtro de busca pelo valor total da solicitação | Valor do campo é maior ou igual que o valor do parametro informado | Sim |
| valor_solicitado__menor_igual | Filtro de busca pelo valor total da solicitação | Valor do campo é menor ou igual que o valor do parametro informado | Sim |
| valor_solicitado__contem | Filtro de busca pelo valor total da solicitação | Valor do campo contem que o valor do parametro informado | Sim |
| valor_solicitado__em | Filtro de busca pelo valor total da solicitação | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim |
| total_taxas | Filtro de busca pelo total das taxas da solicitação | Sim |
| total_taxas__maior_igual | Filtro de busca pelo total das taxas da solicitação | Valor do campo é maior ou igual que o valor do parametro informado | Sim |
| total_taxas__menor_igual | Filtro de busca pelo total das taxas da solicitação | Valor do campo é menor ou igual que o valor do parametro informado | Sim |
| total_taxas__contem | Filtro de busca pelo total das taxas da solicitação | Valor do campo contem que o valor do parametro informado | Sim |
| total_taxas__em | Filtro de busca pelo total das taxas da solicitação | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim |
| valor_a_depositar | Filtro de busca pelo valor a ser depositado para o distribuidor | Sim |
| valor_a_depositar__maior_igual | Filtro de busca pelo valor a ser depositado para o distribuidor | Valor do campo é maior ou igual que o valor do parametro informado | Sim |
| valor_a_depositar__menor_igual | Filtro de busca pelo valor a ser depositado para o distribuidor | Valor do campo é menor ou igual que o valor do parametro informado | Sim |
| valor_a_depositar__contem | Filtro de busca pelo valor a ser depositado para o distribuidor | Valor do campo contem que o valor do parametro informado | Sim |
| valor_a_depositar__em | Filtro de busca pelo valor a ser depositado para o distribuidor | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim |
| data_pedido | Filtro de busca pela data da solicitação | Sim |
| data_pedido__maior_igual | Filtro de busca pela data da solicitação | Valor do campo é maior ou igual que o valor do parametro informado | Sim |
| data_pedido__menor_igual | Filtro de busca pela data da solicitação | Valor do campo é menor ou igual que o valor do parametro informado | Sim |
| data_pedido__contem | Filtro de busca pela data da solicitação | Valor do campo contem que o valor do parametro informado | Sim |
| data_pedido__em | Filtro de busca pela data da solicitação | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim |
| data_apuracao | Filtro de busca pela data de apuração da solicitação (Data em que o administrador verificou a solicitação e alterou seu status) | Sim |
| data_apuracao__maior_igual | Filtro de busca pela data de apuração da solicitação (Data em que o administrador verificou a solicitação e alterou seu status) | Valor do campo é maior ou igual que o valor do parametro informado | Sim |
| data_apuracao__menor_igual | Filtro de busca pela data de apuração da solicitação (Data em que o administrador verificou a solicitação e alterou seu status) | Valor do campo é menor ou igual que o valor do parametro informado | Sim |
| data_apuracao__contem | Filtro de busca pela data de apuração da solicitação (Data em que o administrador verificou a solicitação e alterou seu status) | Valor do campo contem que o valor do parametro informado | Sim |
| data_apuracao__em | Filtro de busca pela data de apuração da solicitação (Data em que o administrador verificou a solicitação e alterou seu status) | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim |
| banco | Filtro de busca pelo nome do banco para o qual será depósitado o valor | Sim |
| banco__contem | Filtro de busca pelo nome do banco para o qual será depósitado o valor | Valor do campo contem que o valor do parametro informado | Sim |
| banco__em | Filtro de busca pelo nome do banco para o qual será depósitado o valor | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim |
| tipo_conta | Filtro de busca pelo tipo de conta a qual será depositado o valor | Sim |
| tipo_conta__contem | Filtro de busca pelo tipo de conta a qual será depositado o valor | Valor do campo contem que o valor do parametro informado | Sim |
| tipo_conta__em | Filtro de busca pelo tipo de conta a qual será depositado o valor | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim |
| variacao | Filtro de busca pela variação da conta a qual será depositado o valor | Sim |
| variacao__contem | Filtro de busca pela variação da conta a qual será depositado o valor | Valor do campo contem que o valor do parametro informado | Sim |
| variacao__em | Filtro de busca pela variação da conta a qual será depositado o valor | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim |
| agencia | Filtro de busca pelo número da agência a qual será depositado o valor. | Sim |
| agencia__contem | Filtro de busca pelo número da agência a qual será depositado o valor. | Valor do campo contem que o valor do parametro informado | Sim |
| agencia__em | Filtro de busca pelo número da agência a qual será depositado o valor. | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim |
| numero | Filtro de busca pelo número da conta a qual será depositado o valor | Sim |
| numero__contem | Filtro de busca pelo número da conta a qual será depositado o valor | Valor do campo contem que o valor do parametro informado | Sim |
| numero__em | Filtro de busca pelo número da conta a qual será depositado o valor | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim |
| operacao | Filtro de busca pela operação da conta a qual será depositado o valor. | Sim |
| operacao__contem | Filtro de busca pela operação da conta a qual será depositado o valor. | Valor do campo contem que o valor do parametro informado | Sim |
| operacao__em | Filtro de busca pela operação da conta a qual será depositado o valor. | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim |
| nome_titular | Filtro de busca pelo nome do titular da conta a qual será depositado o valor | Sim |
| nome_titular__contem | Filtro de busca pelo nome do titular da conta a qual será depositado o valor | Valor do campo contem que o valor do parametro informado | Sim |
| nome_titular__em | Filtro de busca pelo nome do titular da conta a qual será depositado o valor | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim |
| tipo_titular | Filtro de busca pelo tipo de pessoa a qual será depositado o valor | Sim |
| tipo_titular__contem | Filtro de busca pelo tipo de pessoa a qual será depositado o valor | Valor do campo contem que o valor do parametro informado | Sim |
| tipo_titular__em | Filtro de busca pelo tipo de pessoa a qual será depositado o valor | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim |
| documento_titular | Filtro de busca pelo documento do titular da conta a qual será depositado o valor | Sim |
| documento_titular__contem | Filtro de busca pelo documento do titular da conta a qual será depositado o valor | Valor do campo contem que o valor do parametro informado | Sim |
| documento_titular__em | Filtro de busca pelo documento do titular da conta a qual será depositado o valor | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim |

