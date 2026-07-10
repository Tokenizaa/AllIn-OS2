# Clientes

**Fonte:** https://allinbrasil.com.br/api/documentacao

## Descrição

Lista os clientes do sistema

## Escopo Necessário

`clientes`

## Endpoints

### GET Clientes

**URL:** `https://allinbrasil.com.br/api/v1/clientes`

### POST Clientes

**URL:** `https://allinbrasil.com.br/api/v1/clientes`

### PUT Clientes

**URL:** `https://allinbrasil.com.br/api/v1/clientes`

### POST Atualizar-Senha

**URL:** `https://allinbrasil.com.br/api/v1/clientes/AtualizarSenha`

### GET Contas

**URL:** `https://allinbrasil.com.br/api/v1/clientes/Contas`

### POST Contas

**URL:** `https://allinbrasil.com.br/api/v1/clientes/Contas`

### GET Enderecos

**URL:** `https://allinbrasil.com.br/api/v1/clientes/Enderecos`

### POST Token-Login

**URL:** `https://allinbrasil.com.br/api/v1/clientes/TokenLogin`

## Resposta

### Atributos

| Atributo | Descrição | Tipo |
|----------|-----------|------|
| limit | Quantidade de linhas que será retornado na sua consulta, no máximo de 100 por página | Sim |
| page | Página que deseja visualizar da consulta realizada | Sim |
| select | Trás somente os dados das colunas selecionadas, separar colunas por virgulas (ex.: nome,idade,cpf) | Sim |
| order_by | Ordena sua busca por parâmetro, utilize o tipo de ordenação com .desc (decrescente) ou .asc (ascendente) após o nome do parâmetro que deseja ordernar Ex.:id.desc (irá ordenar por id do maior para o menor) | Sim |
| id | Filtro de busca pelo id do cliente | Sim |
| id__maior_igual | Filtro de busca pelo id do cliente | Valor do campo é maior ou igual que o valor do parametro informado | Sim |
| id__menor_igual | Filtro de busca pelo id do cliente | Valor do campo é menor ou igual que o valor do parametro informado | Sim |
| id__em | Filtro de busca pelo id do cliente | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim |
| tipo_cliente | Filtro de busca pelo do tipo de cliente | Sim |
| tipo_cliente__maior_igual | Filtro de busca pelo do tipo de cliente | Valor do campo é maior ou igual que o valor do parametro informado | Sim |
| tipo_cliente__menor_igual | Filtro de busca pelo do tipo de cliente | Valor do campo é menor ou igual que o valor do parametro informado | Sim |
| tipo_cliente__contem | Filtro de busca pelo do tipo de cliente | Valor do campo contem que o valor do parametro informado | Sim |
| tipo_cliente__em | Filtro de busca pelo do tipo de cliente | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim |
| nome | Filtro de busca pelo nome | Sim |
| nome__contem | Filtro de busca pelo nome | Valor do campo contem que o valor do parametro informado | Sim |
| nome__em | Filtro de busca pelo nome | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim |
| sobrenome | Filtro de busca pelo sobrenome | Sim |
| sobrenome__contem | Filtro de busca pelo sobrenome | Valor do campo contem que o valor do parametro informado | Sim |
| sobrenome__em | Filtro de busca pelo sobrenome | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim |
| email | Filtro de busca pelo email | Sim |
| email__contem | Filtro de busca pelo email | Valor do campo contem que o valor do parametro informado | Sim |
| email__em | Filtro de busca pelo email | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim |
| receber_newsletter | Filtro de busca pelos clientes que recebem ou não recebem newsletter | Sim |
| receber_newsletter__maior_igual | Filtro de busca pelos clientes que recebem ou não recebem newsletter | Valor do campo é maior ou igual que o valor do parametro informado | Sim |
| receber_newsletter__menor_igual | Filtro de busca pelos clientes que recebem ou não recebem newsletter | Valor do campo é menor ou igual que o valor do parametro informado | Sim |
| receber_newsletter__em | Filtro de busca pelos clientes que recebem ou não recebem newsletter | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim |
| endereco_id | Filtro de busca pelo id do endereço do cliente | Sim |
| endereco_id__maior_igual | Filtro de busca pelo id do endereço do cliente | Valor do campo é maior ou igual que o valor do parametro informado | Sim |
| endereco_id__menor_igual | Filtro de busca pelo id do endereço do cliente | Valor do campo é menor ou igual que o valor do parametro informado | Sim |
| endereco_id__em | Filtro de busca pelo id do endereço do cliente | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim |
| data_adicionado | Filtro de busca pela data de adição do cliente na loja virtual | Sim |
| data_adicionado__maior_igual | Filtro de busca pela data de adição do cliente na loja virtual | Valor do campo é maior ou igual que o valor do parametro informado | Sim |
| data_adicionado__menor_igual | Filtro de busca pela data de adição do cliente na loja virtual | Valor do campo é menor ou igual que o valor do parametro informado | Sim |
| data_adicionado__contem | Filtro de busca pela data de adição do cliente na loja virtual | Valor do campo contem que o valor do parametro informado | Sim |
| data_adicionado__em | Filtro de busca pela data de adição do cliente na loja virtual | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim |
| data_modificacao | Filtro de busca pela data da última modificação do cliente na loja virtual | Sim |
| data_modificacao__maior_igual | Filtro de busca pela data da última modificação do cliente na loja virtual | Valor do campo é maior ou igual que o valor do parametro informado | Sim |
| data_modificacao__menor_igual | Filtro de busca pela data da última modificação do cliente na loja virtual | Valor do campo é menor ou igual que o valor do parametro informado | Sim |
| data_modificacao__contem | Filtro de busca pela data da última modificação do cliente na loja virtual | Valor do campo contem que o valor do parametro informado | Sim |
| data_modificacao__em | Filtro de busca pela data da última modificação do cliente na loja virtual | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim |
| patrocinador_id | Filtro de busca pelo o id do patrocinador do cliente | Sim |
| patrocinador_id__maior_igual | Filtro de busca pelo o id do patrocinador do cliente | Valor do campo é maior ou igual que o valor do parametro informado | Sim |
| patrocinador_id__menor_igual | Filtro de busca pelo o id do patrocinador do cliente | Valor do campo é menor ou igual que o valor do parametro informado | Sim |
| patrocinador_id__em | Filtro de busca pelo o id do patrocinador do cliente | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim |
| rg | Filtro de busca pelo rg | Sim |
| rg__maior_igual | Filtro de busca pelo rg | Valor do campo é maior ou igual que o valor do parametro informado | Sim |
| rg__menor_igual | Filtro de busca pelo rg | Valor do campo é menor ou igual que o valor do parametro informado | Sim |
| rg__contem | Filtro de busca pelo rg | Valor do campo contem que o valor do parametro informado | Sim |
| rg__em | Filtro de busca pelo rg | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim |
| cpf | Filtro de busca pelo cpf | Sim |
| cpf__maior_igual | Filtro de busca pelo cpf | Valor do campo é maior ou igual que o valor do parametro informado | Sim |
| cpf__menor_igual | Filtro de busca pelo cpf | Valor do campo é menor ou igual que o valor do parametro informado | Sim |
| cpf__contem | Filtro de busca pelo cpf | Valor do campo contem que o valor do parametro informado | Sim |
| cpf__em | Filtro de busca pelo cpf | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim |
| cnpj | Filtro de busca pelo cnpj | Sim |
| cnpj__maior_igual | Filtro de busca pelo cnpj | Valor do campo é maior ou igual que o valor do parametro informado | Sim |
| cnpj__menor_igual | Filtro de busca pelo cnpj | Valor do campo é menor ou igual que o valor do parametro informado | Sim |
| cnpj__contem | Filtro de busca pelo cnpj | Valor do campo contem que o valor do parametro informado | Sim |
| cnpj__em | Filtro de busca pelo cnpj | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim |
| data_nascimento | Filtro de busca pela data de nascimento | Sim |
| data_nascimento__maior_igual | Filtro de busca pela data de nascimento | Valor do campo é maior ou igual que o valor do parametro informado | Sim |
| data_nascimento__menor_igual | Filtro de busca pela data de nascimento | Valor do campo é menor ou igual que o valor do parametro informado | Sim |
| data_nascimento__contem | Filtro de busca pela data de nascimento | Valor do campo contem que o valor do parametro informado | Sim |
| data_nascimento__em | Filtro de busca pela data de nascimento | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim |
| inss_pis | Filtro de busca pelo inss_pis | Sim |
| inss_pis__maior_igual | Filtro de busca pelo inss_pis | Valor do campo é maior ou igual que o valor do parametro informado | Sim |
| inss_pis__menor_igual | Filtro de busca pelo inss_pis | Valor do campo é menor ou igual que o valor do parametro informado | Sim |
| inss_pis__contem | Filtro de busca pelo inss_pis | Valor do campo contem que o valor do parametro informado | Sim |
| inss_pis__em | Filtro de busca pelo inss_pis | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim |
| ie | Filtro de busca pelo ie | Sim |
| ie__maior_igual | Filtro de busca pelo ie | Valor do campo é maior ou igual que o valor do parametro informado | Sim |
| ie__menor_igual | Filtro de busca pelo ie | Valor do campo é menor ou igual que o valor do parametro informado | Sim |
| ie__contem | Filtro de busca pelo ie | Valor do campo contem que o valor do parametro informado | Sim |
| ie__em | Filtro de busca pelo ie | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim |
| nit | Filtro de busca pelo nit | Sim |
| nit__maior_igual | Filtro de busca pelo nit | Valor do campo é maior ou igual que o valor do parametro informado | Sim |
| nit__menor_igual | Filtro de busca pelo nit | Valor do campo é menor ou igual que o valor do parametro informado | Sim |
| nit__contem | Filtro de busca pelo nit | Valor do campo contem que o valor do parametro informado | Sim |
| nit__em | Filtro de busca pelo nit | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim |
| pis_pasep | Filtro de busca pelo pis_pasep | Sim |
| pis_pasep__maior_igual | Filtro de busca pelo pis_pasep | Valor do campo é maior ou igual que o valor do parametro informado | Sim |
| pis_pasep__menor_igual | Filtro de busca pelo pis_pasep | Valor do campo é menor ou igual que o valor do parametro informado | Sim |
| pis_pasep__contem | Filtro de busca pelo pis_pasep | Valor do campo contem que o valor do parametro informado | Sim |
| pis_pasep__em | Filtro de busca pelo pis_pasep | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim |
| razao_social | Filtro de busca pela razão social | Sim |
| razao_social__contem | Filtro de busca pela razão social | Valor do campo contem que o valor do parametro informado | Sim |
| razao_social__em | Filtro de busca pela razão social | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim |
| nome_fantasia | Filtro de busca pelo nome fantasia | Sim |
| nome_fantasia__contem | Filtro de busca pelo nome fantasia | Valor do campo contem que o valor do parametro informado | Sim |
| nome_fantasia__em | Filtro de busca pelo nome fantasia | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim |
| cpf_empresario | Filtro de busca pelo cpf do empresário | Sim |
| cpf_empresario__maior_igual | Filtro de busca pelo cpf do empresário | Valor do campo é maior ou igual que o valor do parametro informado | Sim |
| cpf_empresario__menor_igual | Filtro de busca pelo cpf do empresário | Valor do campo é menor ou igual que o valor do parametro informado | Sim |
| cpf_empresario__contem | Filtro de busca pelo cpf do empresário | Valor do campo contem que o valor do parametro informado | Sim |
| cpf_empresario__em | Filtro de busca pelo cpf do empresário | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim |
| nome_mae | Filtro de busca pelo nome da mãe do cliente | Sim |
| nome_mae__contem | Filtro de busca pelo nome da mãe do cliente | Valor do campo contem que o valor do parametro informado | Sim |
| nome_mae__em | Filtro de busca pelo nome da mãe do cliente | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim |
| sexo | Filtro de busca pelo sexo do cliente | Sim |
| sexo__maior_igual | Filtro de busca pelo sexo do cliente | Valor do campo é maior ou igual que o valor do parametro informado | Sim |
| sexo__menor_igual | Filtro de busca pelo sexo do cliente | Valor do campo é menor ou igual que o valor do parametro informado | Sim |
| sexo__contem | Filtro de busca pelo sexo do cliente | Valor do campo contem que o valor do parametro informado | Sim |
| sexo__em | Filtro de busca pelo sexo do cliente | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim |
| dependentes | Filtro de busca pela quantidade de dependentes | Sim |
| dependentes__maior_igual | Filtro de busca pela quantidade de dependentes | Valor do campo é maior ou igual que o valor do parametro informado | Sim |
| dependentes__menor_igual | Filtro de busca pela quantidade de dependentes | Valor do campo é menor ou igual que o valor do parametro informado | Sim |
| dependentes__em | Filtro de busca pela quantidade de dependentes | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim |
| estado_civil_id | Filtro de busca pelo id do estado civil | Sim |
| estado_civil_id__maior_igual | Filtro de busca pelo id do estado civil | Valor do campo é maior ou igual que o valor do parametro informado | Sim |
| estado_civil_id__menor_igual | Filtro de busca pelo id do estado civil | Valor do campo é menor ou igual que o valor do parametro informado | Sim |
| estado_civil_id__em | Filtro de busca pelo id do estado civil | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim |
| estado_civil_codigo | Filtro de busca pelo código do estado civil | Sim |
| estado_civil_codigo__contem | Filtro de busca pelo código do estado civil | Valor do campo contem que o valor do parametro informado | Sim |
| estado_civil_codigo__em | Filtro de busca pelo código do estado civil | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim |
| tipo_pessoa_id | Filtro de busca pelo id do tipo de pessoa | Sim |
| tipo_pessoa_id__maior_igual | Filtro de busca pelo id do tipo de pessoa | Valor do campo é maior ou igual que o valor do parametro informado | Sim |
| tipo_pessoa_id__menor_igual | Filtro de busca pelo id do tipo de pessoa | Valor do campo é menor ou igual que o valor do parametro informado | Sim |
| tipo_pessoa_id__em | Filtro de busca pelo id do tipo de pessoa | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim |
| tipo_pessoa_descricao | Filtro de busca pela descricao do tipo de pessoa | Sim |
| tipo_pessoa_descricao__contem | Filtro de busca pela descricao do tipo de pessoa | Valor do campo contem que o valor do parametro informado | Sim |
| tipo_pessoa_descricao__em | Filtro de busca pela descricao do tipo de pessoa | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim |
| pais_codigo | Filtro de busca pelo código do país do endereço do cliente | Sim |
| pais_codigo__contem | Filtro de busca pelo código do país do endereço do cliente | Valor do campo contem que o valor do parametro informado | Sim |
| pais_codigo__em | Filtro de busca pelo código do país do endereço do cliente | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim |
| pais_nome | Filtro de busca pelo nome do país do endereço do cliente | Sim |
| pais_nome__contem | Filtro de busca pelo nome do país do endereço do cliente | Valor do campo contem que o valor do parametro informado | Sim |
| pais_nome__em | Filtro de busca pelo nome do país do endereço do cliente | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim |
| uf_codigo | Filtro de busca pelo código da unidade federativa do endereço do cliente | Sim |
| uf_codigo__contem | Filtro de busca pelo código da unidade federativa do endereço do cliente | Valor do campo contem que o valor do parametro informado | Sim |
| uf_codigo__em | Filtro de busca pelo código da unidade federativa do endereço do cliente | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim |
| uf_nome | Filtro de busca pelo nome da unidade federativa do endereço do cliente | Sim |
| uf_nome__contem | Filtro de busca pelo nome da unidade federativa do endereço do cliente | Valor do campo contem que o valor do parametro informado | Sim |
| uf_nome__em | Filtro de busca pelo nome da unidade federativa do endereço do cliente | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim |
| cidade_nome | Filtro de busca pelo nome da cidade do endereço do cliente | Sim |
| cidade_nome__contem | Filtro de busca pelo nome da cidade do endereço do cliente | Valor do campo contem que o valor do parametro informado | Sim |
| cidade_nome__em | Filtro de busca pelo nome da cidade do endereço do cliente | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim |
| cidade_id | Filtro de busca pelo id da cidade | Sim |
| cidade_id__maior_igual | Filtro de busca pelo id da cidade | Valor do campo é maior ou igual que o valor do parametro informado | Sim |
| cidade_id__menor_igual | Filtro de busca pelo id da cidade | Valor do campo é menor ou igual que o valor do parametro informado | Sim |
| cidade_id__em | Filtro de busca pelo id da cidade | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim |
| cep | Filtro de busca pelo CEP ou Código Postal do endereço do cliente | Sim |
| cep__contem | Filtro de busca pelo CEP ou Código Postal do endereço do cliente | Valor do campo contem que o valor do parametro informado | Sim |
| cep__em | Filtro de busca pelo CEP ou Código Postal do endereço do cliente | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim |
| logradouro | Filtro de busca pelo logradouro do endereço do cliente | Sim |
| logradouro__contem | Filtro de busca pelo logradouro do endereço do cliente | Valor do campo contem que o valor do parametro informado | Sim |
| logradouro__em | Filtro de busca pelo logradouro do endereço do cliente | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim |
| numero | Filtro de busca pelo numero do endereço do cliente | Sim |
| numero__contem | Filtro de busca pelo numero do endereço do cliente | Valor do campo contem que o valor do parametro informado | Sim |
| numero__em | Filtro de busca pelo numero do endereço do cliente | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim |
| bairro | Filtro de busca pelo bairro do endereço do cliente | Sim |
| bairro__contem | Filtro de busca pelo bairro do endereço do cliente | Valor do campo contem que o valor do parametro informado | Sim |
| bairro__em | Filtro de busca pelo bairro do endereço do cliente | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim |
| complemento | Filtro de busca pelo complemento do endereço do cliente | Sim |
| complemento__contem | Filtro de busca pelo complemento do endereço do cliente | Valor do campo contem que o valor do parametro informado | Sim |
| complemento__em | Filtro de busca pelo complemento do endereço do cliente | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim |
| distribuidor_id | Filtro de busca pelo id do distribuidor | Sim |
| distribuidor_id__maior_igual | Filtro de busca pelo id do distribuidor | Valor do campo é maior ou igual que o valor do parametro informado | Sim |
| distribuidor_id__menor_igual | Filtro de busca pelo id do distribuidor | Valor do campo é menor ou igual que o valor do parametro informado | Sim |
| distribuidor_id__em | Filtro de busca pelo id do distribuidor | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim |
| usuario | Filtro de busca pelo usuário do distribuidor | Sim |
| usuario__contem | Filtro de busca pelo usuário do distribuidor | Valor do campo contem que o valor do parametro informado | Sim |
| usuario__em | Filtro de busca pelo usuário do distribuidor | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim |
| website | Filtro de busca pelo website do distribuidor | Sim |
| website__contem | Filtro de busca pelo website do distribuidor | Valor do campo contem que o valor do parametro informado | Sim |
| website__em | Filtro de busca pelo website do distribuidor | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim |
| login | Filtro de busca por distribuidor que pode ou não realizar login no sistema (1 para sim, 0 para não) | Sim |
| login__maior_igual | Filtro de busca por distribuidor que pode ou não realizar login no sistema (1 para sim, 0 para não) | Valor do campo é maior ou igual que o valor do parametro informado | Sim |
| login__menor_igual | Filtro de busca por distribuidor que pode ou não realizar login no sistema (1 para sim, 0 para não) | Valor do campo é menor ou igual que o valor do parametro informado | Sim |
| login__em | Filtro de busca por distribuidor que pode ou não realizar login no sistema (1 para sim, 0 para não) | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim |
| data_verificacao | Filtro de busca pela data de verificação dos dados do distribuidor | Sim |
| data_verificacao__maior_igual | Filtro de busca pela data de verificação dos dados do distribuidor | Valor do campo é maior ou igual que o valor do parametro informado | Sim |
| data_verificacao__menor_igual | Filtro de busca pela data de verificação dos dados do distribuidor | Valor do campo é menor ou igual que o valor do parametro informado | Sim |
| data_verificacao__contem | Filtro de busca pela data de verificação dos dados do distribuidor | Valor do campo contem que o valor do parametro informado | Sim |
| data_verificacao__em | Filtro de busca pela data de verificação dos dados do distribuidor | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim |
| auto_ativacao | Filtro de busca por distribuidor que possui ou não auto ativação habilitada | Sim |
| auto_ativacao__maior_igual | Filtro de busca por distribuidor que possui ou não auto ativação habilitada | Valor do campo é maior ou igual que o valor do parametro informado | Sim |
| auto_ativacao__menor_igual | Filtro de busca por distribuidor que possui ou não auto ativação habilitada | Valor do campo é menor ou igual que o valor do parametro informado | Sim |
| auto_ativacao__em | Filtro de busca por distribuidor que possui ou não auto ativação habilitada | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim |
| email_verificado | Filtro de busca por distribuidor que possui ou não email verificado | Sim |
| email_verificado__maior_igual | Filtro de busca por distribuidor que possui ou não email verificado | Valor do campo é maior ou igual que o valor do parametro informado | Sim |
| email_verificado__menor_igual | Filtro de busca por distribuidor que possui ou não email verificado | Valor do campo é menor ou igual que o valor do parametro informado | Sim |
| email_verificado__em | Filtro de busca por distribuidor que possui ou não email verificado | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim |
| ativo | Fitro de busca por distribuidor que está ou não ativo (1 para sim, 0 para não) | Sim |
| ativo__maior_igual | Fitro de busca por distribuidor que está ou não ativo (1 para sim, 0 para não) | Valor do campo é maior ou igual que o valor do parametro informado | Sim |
| ativo__menor_igual | Fitro de busca por distribuidor que está ou não ativo (1 para sim, 0 para não) | Valor do campo é menor ou igual que o valor do parametro informado | Sim |
| ativo__em | Fitro de busca por distribuidor que está ou não ativo (1 para sim, 0 para não) | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim |
| patrocinador_id_loja | Querystring de busca para patrocinador_id_loja | Sim |
| patrocinador_id_loja__maior_igual | Querystring de busca para patrocinador_id_loja | Valor do campo é maior ou igual que o valor do parametro informado | Sim |
| patrocinador_id_loja__menor_igual | Querystring de busca para patrocinador_id_loja | Valor do campo é menor ou igual que o valor do parametro informado | Sim |
| patrocinador_id_loja__em | Querystring de busca para patrocinador_id_loja | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim |
| distribuidor_patrocinador_id | Querystring de busca para distribuidor_patrocinador_id | Sim |
| distribuidor_patrocinador_id__maior_igual | Querystring de busca para distribuidor_patrocinador_id | Valor do campo é maior ou igual que o valor do parametro informado | Sim |
| distribuidor_patrocinador_id__menor_igual | Querystring de busca para distribuidor_patrocinador_id | Valor do campo é menor ou igual que o valor do parametro informado | Sim |
| distribuidor_patrocinador_id__em | Querystring de busca para distribuidor_patrocinador_id | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim |
| pena_esquerda_id | Querystring de busca para pena_esquerda_id | Sim |
| pena_esquerda_id__maior_igual | Querystring de busca para pena_esquerda_id | Valor do campo é maior ou igual que o valor do parametro informado | Sim |
| pena_esquerda_id__menor_igual | Querystring de busca para pena_esquerda_id | Valor do campo é menor ou igual que o valor do parametro informado | Sim |
| pena_esquerda_id__em | Querystring de busca para pena_esquerda_id | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim |
| perna_direita_id | Querystring de busca para perna_direita_id | Sim |
| perna_direita_id__maior_igual | Querystring de busca para perna_direita_id | Valor do campo é maior ou igual que o valor do parametro informado | Sim |
| perna_direita_id__menor_igual | Querystring de busca para perna_direita_id | Valor do campo é menor ou igual que o valor do parametro informado | Sim |
| perna_direita_id__em | Querystring de busca para perna_direita_id | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim |
| resumo | Querystring de busca para resumo | Sim |
| resumo__contem | Querystring de busca para resumo | Valor do campo contem que o valor do parametro informado | Sim |
| resumo__em | Querystring de busca para resumo | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim |
| distribuidor_data_cadastro | Querystring de busca para distribuidor_data_cadastro | Sim |
| distribuidor_data_cadastro__maior_igual | Querystring de busca para distribuidor_data_cadastro | Valor do campo é maior ou igual que o valor do parametro informado | Sim |
| distribuidor_data_cadastro__menor_igual | Querystring de busca para distribuidor_data_cadastro | Valor do campo é menor ou igual que o valor do parametro informado | Sim |
| distribuidor_data_cadastro__contem | Querystring de busca para distribuidor_data_cadastro | Valor do campo contem que o valor do parametro informado | Sim |
| distribuidor_data_cadastro__em | Querystring de busca para distribuidor_data_cadastro | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim |
| ativacao_id | Querystring de busca para ativacao_id | Sim |
| ativacao_id__maior_igual | Querystring de busca para ativacao_id | Valor do campo é maior ou igual que o valor do parametro informado | Sim |
| ativacao_id__menor_igual | Querystring de busca para ativacao_id | Valor do campo é menor ou igual que o valor do parametro informado | Sim |
| ativacao_id__em | Querystring de busca para ativacao_id | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim |

