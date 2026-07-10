# Distribuidores

**Fonte:** https://allinbrasil.com.br/api/documentacao

## Descrição

Retorna lista de dados dos distribuidores

## Escopo Necessário

`distribuidores`

## Endpoints

### GET Distribuidores

**URL:** `https://allinbrasil.com.br/api/v1/distribuidores`

### GET Ativacoes-Mensais

**URL:** `https://allinbrasil.com.br/api/v1/distribuidores/AtivacoesMensais`

### GET Plano-Atual

**URL:** `https://allinbrasil.com.br/api/v1/distribuidores/PlanoAtual`

### GET Qualificacao-Atual

**URL:** `https://allinbrasil.com.br/api/v1/distribuidores/QualificacaoAtual`

### GET Telefones

**URL:** `https://allinbrasil.com.br/api/v1/distribuidores/Telefones`

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
| id__contem | Filtro de busca por id | Valor do campo contem que o valor do parametro informado | Sim |
| id__em | Filtro de busca por id | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ['valor1','valor2','valor3'] | Sim |
| usuario | Filtro de busca por usuário | Sim |
| usuario__maior_igual | Filtro de busca por usuário | Valor do campo é maior ou igual que o valor do parametro informado | Sim |
| usuario__menor_igual | Filtro de busca por usuário | Valor do campo é menor ou igual que o valor do parametro informado | Sim |
| usuario__contem | Filtro de busca por usuário | Valor do campo contem que o valor do parametro informado | Sim |
| usuario__em | Filtro de busca por usuário | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ['valor1','valor2','valor3'] | Sim |
| patrocinador_id | Filtro de busca por id do patrocinador | Sim |
| patrocinador_id__maior_igual | Filtro de busca por id do patrocinador | Valor do campo é maior ou igual que o valor do parametro informado | Sim |
| patrocinador_id__menor_igual | Filtro de busca por id do patrocinador | Valor do campo é menor ou igual que o valor do parametro informado | Sim |
| patrocinador_id__contem | Filtro de busca por id do patrocinador | Valor do campo contem que o valor do parametro informado | Sim |
| patrocinador_id__em | Filtro de busca por id do patrocinador | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ['valor1','valor2','valor3'] | Sim |
| perna_esquerda_id | Filtro de busca por id do indicado na perna esquerda | Sim |
| perna_esquerda_id__maior_igual | Filtro de busca por id do indicado na perna esquerda | Valor do campo é maior ou igual que o valor do parametro informado | Sim |
| perna_esquerda_id__menor_igual | Filtro de busca por id do indicado na perna esquerda | Valor do campo é menor ou igual que o valor do parametro informado | Sim |
| perna_esquerda_id__contem | Filtro de busca por id do indicado na perna esquerda | Valor do campo contem que o valor do parametro informado | Sim |
| perna_esquerda_id__em | Filtro de busca por id do indicado na perna esquerda | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ['valor1','valor2','valor3'] | Sim |
| perna_direita_id | Filtro de busca por id do indicado na perna direita | Sim |
| perna_direita_id__maior_igual | Filtro de busca por id do indicado na perna direita | Valor do campo é maior ou igual que o valor do parametro informado | Sim |
| perna_direita_id__menor_igual | Filtro de busca por id do indicado na perna direita | Valor do campo é menor ou igual que o valor do parametro informado | Sim |
| perna_direita_id__contem | Filtro de busca por id do indicado na perna direita | Valor do campo contem que o valor do parametro informado | Sim |
| perna_direita_id__em | Filtro de busca por id do indicado na perna direita | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ['valor1','valor2','valor3'] | Sim |
| nome | Filtro de busca por nome | Sim |
| nome__maior_igual | Filtro de busca por nome | Valor do campo é maior ou igual que o valor do parametro informado | Sim |
| nome__menor_igual | Filtro de busca por nome | Valor do campo é menor ou igual que o valor do parametro informado | Sim |
| nome__contem | Filtro de busca por nome | Valor do campo contem que o valor do parametro informado | Sim |
| nome__em | Filtro de busca por nome | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ['valor1','valor2','valor3'] | Sim |
| data_nascimento | Filtro de busca por data de nascimento | Sim |
| data_nascimento__maior_igual | Filtro de busca por data de nascimento | Valor do campo é maior ou igual que o valor do parametro informado | Sim |
| data_nascimento__menor_igual | Filtro de busca por data de nascimento | Valor do campo é menor ou igual que o valor do parametro informado | Sim |
| data_nascimento__contem | Filtro de busca por data de nascimento | Valor do campo contem que o valor do parametro informado | Sim |
| data_nascimento__em | Filtro de busca por data de nascimento | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ['valor1','valor2','valor3'] | Sim |
| estado_civil | Filtro de busca por estado civil | Sim |
| estado_civil__maior_igual | Filtro de busca por estado civil | Valor do campo é maior ou igual que o valor do parametro informado | Sim |
| estado_civil__menor_igual | Filtro de busca por estado civil | Valor do campo é menor ou igual que o valor do parametro informado | Sim |
| estado_civil__contem | Filtro de busca por estado civil | Valor do campo contem que o valor do parametro informado | Sim |
| estado_civil__em | Filtro de busca por estado civil | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ['valor1','valor2','valor3'] | Sim |
| sexo | Filtro de busca por sexo | Sim |
| sexo__maior_igual | Filtro de busca por sexo | Valor do campo é maior ou igual que o valor do parametro informado | Sim |
| sexo__menor_igual | Filtro de busca por sexo | Valor do campo é menor ou igual que o valor do parametro informado | Sim |
| sexo__contem | Filtro de busca por sexo | Valor do campo contem que o valor do parametro informado | Sim |
| sexo__em | Filtro de busca por sexo | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ['valor1','valor2','valor3'] | Sim |
| email | Filtro de busca por email | Sim |
| email__maior_igual | Filtro de busca por email | Valor do campo é maior ou igual que o valor do parametro informado | Sim |
| email__menor_igual | Filtro de busca por email | Valor do campo é menor ou igual que o valor do parametro informado | Sim |
| email__contem | Filtro de busca por email | Valor do campo contem que o valor do parametro informado | Sim |
| email__em | Filtro de busca por email | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ['valor1','valor2','valor3'] | Sim |
| dependentes | Filtro de busca por dependentes | Sim |
| dependentes__maior_igual | Filtro de busca por dependentes | Valor do campo é maior ou igual que o valor do parametro informado | Sim |
| dependentes__menor_igual | Filtro de busca por dependentes | Valor do campo é menor ou igual que o valor do parametro informado | Sim |
| dependentes__contem | Filtro de busca por dependentes | Valor do campo contem que o valor do parametro informado | Sim |
| dependentes__em | Filtro de busca por dependentes | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ['valor1','valor2','valor3'] | Sim |
| website | Filtro de busca por website | Sim |
| website__maior_igual | Filtro de busca por website | Valor do campo é maior ou igual que o valor do parametro informado | Sim |
| website__menor_igual | Filtro de busca por website | Valor do campo é menor ou igual que o valor do parametro informado | Sim |
| website__contem | Filtro de busca por website | Valor do campo contem que o valor do parametro informado | Sim |
| website__em | Filtro de busca por website | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ['valor1','valor2','valor3'] | Sim |
| resumo | Filtro de busca por resumo | Sim |
| resumo__maior_igual | Filtro de busca por resumo | Valor do campo é maior ou igual que o valor do parametro informado | Sim |
| resumo__menor_igual | Filtro de busca por resumo | Valor do campo é menor ou igual que o valor do parametro informado | Sim |
| resumo__contem | Filtro de busca por resumo | Valor do campo contem que o valor do parametro informado | Sim |
| resumo__em | Filtro de busca por resumo | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ['valor1','valor2','valor3'] | Sim |
| tipo_pessoa | Filtro de busca por tipo de pessoa | Sim |
| tipo_pessoa__maior_igual | Filtro de busca por tipo de pessoa | Valor do campo é maior ou igual que o valor do parametro informado | Sim |
| tipo_pessoa__menor_igual | Filtro de busca por tipo de pessoa | Valor do campo é menor ou igual que o valor do parametro informado | Sim |
| tipo_pessoa__contem | Filtro de busca por tipo de pessoa | Valor do campo contem que o valor do parametro informado | Sim |
| tipo_pessoa__em | Filtro de busca por tipo de pessoa | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ['valor1','valor2','valor3'] | Sim |
| rg | Filtro de busca por rg | Sim |
| rg__maior_igual | Filtro de busca por rg | Valor do campo é maior ou igual que o valor do parametro informado | Sim |
| rg__menor_igual | Filtro de busca por rg | Valor do campo é menor ou igual que o valor do parametro informado | Sim |
| rg__contem | Filtro de busca por rg | Valor do campo contem que o valor do parametro informado | Sim |
| rg__em | Filtro de busca por rg | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ['valor1','valor2','valor3'] | Sim |
| cpf | Filtro de busca para cpf | Sim |
| cpf__maior_igual | Filtro de busca para cpf | Valor do campo é maior ou igual que o valor do parametro informado | Sim |
| cpf__menor_igual | Filtro de busca para cpf | Valor do campo é menor ou igual que o valor do parametro informado | Sim |
| cpf__contem | Filtro de busca para cpf | Valor do campo contem que o valor do parametro informado | Sim |
| cpf__em | Filtro de busca para cpf | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ['valor1','valor2','valor3'] | Sim |
| cnpj | Filtro de busca por cnpj | Sim |
| cnpj__maior_igual | Filtro de busca por cnpj | Valor do campo é maior ou igual que o valor do parametro informado | Sim |
| cnpj__menor_igual | Filtro de busca por cnpj | Valor do campo é menor ou igual que o valor do parametro informado | Sim |
| cnpj__contem | Filtro de busca por cnpj | Valor do campo contem que o valor do parametro informado | Sim |
| cnpj__em | Filtro de busca por cnpj | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ['valor1','valor2','valor3'] | Sim |
| inss_pis | Filtro de busca por inss/pis | Sim |
| inss_pis__maior_igual | Filtro de busca por inss/pis | Valor do campo é maior ou igual que o valor do parametro informado | Sim |
| inss_pis__menor_igual | Filtro de busca por inss/pis | Valor do campo é menor ou igual que o valor do parametro informado | Sim |
| inss_pis__contem | Filtro de busca por inss/pis | Valor do campo contem que o valor do parametro informado | Sim |
| inss_pis__em | Filtro de busca por inss/pis | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ['valor1','valor2','valor3'] | Sim |
| cpf_empresario | Filtro de busca por cpf do empresário | Sim |
| cpf_empresario__maior_igual | Filtro de busca por cpf do empresário | Valor do campo é maior ou igual que o valor do parametro informado | Sim |
| cpf_empresario__menor_igual | Filtro de busca por cpf do empresário | Valor do campo é menor ou igual que o valor do parametro informado | Sim |
| cpf_empresario__contem | Filtro de busca por cpf do empresário | Valor do campo contem que o valor do parametro informado | Sim |
| cpf_empresario__em | Filtro de busca por cpf do empresário | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ['valor1','valor2','valor3'] | Sim |
| pis_pasep | Filtro de busca por pis/passep | Sim |
| pis_pasep__maior_igual | Filtro de busca por pis/passep | Valor do campo é maior ou igual que o valor do parametro informado | Sim |
| pis_pasep__menor_igual | Filtro de busca por pis/passep | Valor do campo é menor ou igual que o valor do parametro informado | Sim |
| pis_pasep__contem | Filtro de busca por pis/passep | Valor do campo contem que o valor do parametro informado | Sim |
| pis_pasep__em | Filtro de busca por pis/passep | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ['valor1','valor2','valor3'] | Sim |
| nit | Filtro de busca por nit | Sim |
| nit__maior_igual | Filtro de busca por nit | Valor do campo é maior ou igual que o valor do parametro informado | Sim |
| nit__menor_igual | Filtro de busca por nit | Valor do campo é menor ou igual que o valor do parametro informado | Sim |
| nit__contem | Filtro de busca por nit | Valor do campo contem que o valor do parametro informado | Sim |
| nit__em | Filtro de busca por nit | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ['valor1','valor2','valor3'] | Sim |
| ie | Filtro de busca por inscrição estadual | Sim |
| ie__maior_igual | Filtro de busca por inscrição estadual | Valor do campo é maior ou igual que o valor do parametro informado | Sim |
| ie__menor_igual | Filtro de busca por inscrição estadual | Valor do campo é menor ou igual que o valor do parametro informado | Sim |
| ie__contem | Filtro de busca por inscrição estadual | Valor do campo contem que o valor do parametro informado | Sim |
| ie__em | Filtro de busca por inscrição estadual | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ['valor1','valor2','valor3'] | Sim |
| razao_social | Filtro de busca por razão social | Sim |
| razao_social__maior_igual | Filtro de busca por razão social | Valor do campo é maior ou igual que o valor do parametro informado | Sim |
| razao_social__menor_igual | Filtro de busca por razão social | Valor do campo é menor ou igual que o valor do parametro informado | Sim |
| razao_social__contem | Filtro de busca por razão social | Valor do campo contem que o valor do parametro informado | Sim |
| razao_social__em | Filtro de busca por razão social | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ['valor1','valor2','valor3'] | Sim |
| nome_fantasia | Filtro de busca por nome fantasia | Sim |
| nome_fantasia__maior_igual | Filtro de busca por nome fantasia | Valor do campo é maior ou igual que o valor do parametro informado | Sim |
| nome_fantasia__menor_igual | Filtro de busca por nome fantasia | Valor do campo é menor ou igual que o valor do parametro informado | Sim |
| nome_fantasia__contem | Filtro de busca por nome fantasia | Valor do campo contem que o valor do parametro informado | Sim |
| nome_fantasia__em | Filtro de busca por nome fantasia | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ['valor1','valor2','valor3'] | Sim |
| cep | Filtro de busca por cep | Sim |
| cep__maior_igual | Filtro de busca por cep | Valor do campo é maior ou igual que o valor do parametro informado | Sim |
| cep__menor_igual | Filtro de busca por cep | Valor do campo é menor ou igual que o valor do parametro informado | Sim |
| cep__contem | Filtro de busca por cep | Valor do campo contem que o valor do parametro informado | Sim |
| cep__em | Filtro de busca por cep | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ['valor1','valor2','valor3'] | Sim |
| nome_mae | Filtro de busca por nome da mãe | Sim |
| nome_mae__maior_igual | Filtro de busca por nome da mãe | Valor do campo é maior ou igual que o valor do parametro informado | Sim |
| nome_mae__menor_igual | Filtro de busca por nome da mãe | Valor do campo é menor ou igual que o valor do parametro informado | Sim |
| nome_mae__contem | Filtro de busca por nome da mãe | Valor do campo contem que o valor do parametro informado | Sim |
| nome_mae__em | Filtro de busca por nome da mãe | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ['valor1','valor2','valor3'] | Sim |
| cidade | Filtro de busca por cidade | Sim |
| cidade__maior_igual | Filtro de busca por cidade | Valor do campo é maior ou igual que o valor do parametro informado | Sim |
| cidade__menor_igual | Filtro de busca por cidade | Valor do campo é menor ou igual que o valor do parametro informado | Sim |
| cidade__contem | Filtro de busca por cidade | Valor do campo contem que o valor do parametro informado | Sim |
| cidade__em | Filtro de busca por cidade | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ['valor1','valor2','valor3'] | Sim |
| bairro | Filtro de busca por bairro | Sim |
| bairro__maior_igual | Filtro de busca por bairro | Valor do campo é maior ou igual que o valor do parametro informado | Sim |
| bairro__menor_igual | Filtro de busca por bairro | Valor do campo é menor ou igual que o valor do parametro informado | Sim |
| bairro__contem | Filtro de busca por bairro | Valor do campo contem que o valor do parametro informado | Sim |
| bairro__em | Filtro de busca por bairro | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ['valor1','valor2','valor3'] | Sim |
| endereco | Filtro de busca por endereço | Sim |
| endereco__maior_igual | Filtro de busca por endereço | Valor do campo é maior ou igual que o valor do parametro informado | Sim |
| endereco__menor_igual | Filtro de busca por endereço | Valor do campo é menor ou igual que o valor do parametro informado | Sim |
| endereco__contem | Filtro de busca por endereço | Valor do campo contem que o valor do parametro informado | Sim |
| endereco__em | Filtro de busca por endereço | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ['valor1','valor2','valor3'] | Sim |
| complemento | Filtro de busca por complemento | Sim |
| complemento__maior_igual | Filtro de busca por complemento | Valor do campo é maior ou igual que o valor do parametro informado | Sim |
| complemento__menor_igual | Filtro de busca por complemento | Valor do campo é menor ou igual que o valor do parametro informado | Sim |
| complemento__contem | Filtro de busca por complemento | Valor do campo contem que o valor do parametro informado | Sim |
| complemento__em | Filtro de busca por complemento | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ['valor1','valor2','valor3'] | Sim |
| numero | Filtro de busca por número | Sim |
| numero__maior_igual | Filtro de busca por número | Valor do campo é maior ou igual que o valor do parametro informado | Sim |
| numero__menor_igual | Filtro de busca por número | Valor do campo é menor ou igual que o valor do parametro informado | Sim |
| numero__contem | Filtro de busca por número | Valor do campo contem que o valor do parametro informado | Sim |
| numero__em | Filtro de busca por número | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ['valor1','valor2','valor3'] | Sim |
| ativo | Filtro de busca se ativo | Sim |
| ativo__maior_igual | Filtro de busca se ativo | Valor do campo é maior ou igual que o valor do parametro informado | Sim |
| ativo__menor_igual | Filtro de busca se ativo | Valor do campo é menor ou igual que o valor do parametro informado | Sim |
| ativo__contem | Filtro de busca se ativo | Valor do campo contem que o valor do parametro informado | Sim |
| ativo__em | Filtro de busca se ativo | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ['valor1','valor2','valor3'] | Sim |
| status | Filtro de busca por status | Sim |
| status__maior_igual | Filtro de busca por status | Valor do campo é maior ou igual que o valor do parametro informado | Sim |
| status__menor_igual | Filtro de busca por status | Valor do campo é menor ou igual que o valor do parametro informado | Sim |
| status__contem | Filtro de busca por status | Valor do campo contem que o valor do parametro informado | Sim |
| status__em | Filtro de busca por status | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ['valor1','valor2','valor3'] | Sim |
| login | Filtro de busca se pode logar | Sim |
| login__maior_igual | Filtro de busca se pode logar | Valor do campo é maior ou igual que o valor do parametro informado | Sim |
| login__menor_igual | Filtro de busca se pode logar | Valor do campo é menor ou igual que o valor do parametro informado | Sim |
| login__contem | Filtro de busca se pode logar | Valor do campo contem que o valor do parametro informado | Sim |
| login__em | Filtro de busca se pode logar | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ['valor1','valor2','valor3'] | Sim |
| data_cadastro | Filtro de busca por data de cadastro | Sim |
| data_cadastro__maior_igual | Filtro de busca por data de cadastro | Valor do campo é maior ou igual que o valor do parametro informado | Sim |
| data_cadastro__menor_igual | Filtro de busca por data de cadastro | Valor do campo é menor ou igual que o valor do parametro informado | Sim |
| data_cadastro__contem | Filtro de busca por data de cadastro | Valor do campo contem que o valor do parametro informado | Sim |
| data_cadastro__em | Filtro de busca por data de cadastro | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ['valor1','valor2','valor3'] | Sim |
| data_verificacao | Filtro de busca por data de verificação | Sim |
| data_verificacao__maior_igual | Filtro de busca por data de verificação | Valor do campo é maior ou igual que o valor do parametro informado | Sim |
| data_verificacao__menor_igual | Filtro de busca por data de verificação | Valor do campo é menor ou igual que o valor do parametro informado | Sim |
| data_verificacao__contem | Filtro de busca por data de verificação | Valor do campo contem que o valor do parametro informado | Sim |
| data_verificacao__em | Filtro de busca por data de verificação | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ['valor1','valor2','valor3'] | Sim |
| data_modificacao | Filtro de busca pela data da última modificação do distribuidor | Sim |
| data_modificacao__maior_igual | Filtro de busca pela data da última modificação do distribuidor | Valor do campo é maior ou igual que o valor do parametro informado | Sim |
| data_modificacao__menor_igual | Filtro de busca pela data da última modificação do distribuidor | Valor do campo é menor ou igual que o valor do parametro informado | Sim |
| data_modificacao__contem | Filtro de busca pela data da última modificação do distribuidor | Valor do campo contem que o valor do parametro informado | Sim |
| data_modificacao__em | Filtro de busca pela data da última modificação do distribuidor | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ['valor1','valor2','valor3'] | Sim |
| auto_ativacao | Filtro de busca se autoativação habilitado | Sim |
| auto_ativacao__maior_igual | Filtro de busca se autoativação habilitado | Valor do campo é maior ou igual que o valor do parametro informado | Sim |
| auto_ativacao__menor_igual | Filtro de busca se autoativação habilitado | Valor do campo é menor ou igual que o valor do parametro informado | Sim |
| auto_ativacao__contem | Filtro de busca se autoativação habilitado | Valor do campo contem que o valor do parametro informado | Sim |
| auto_ativacao__em | Filtro de busca se autoativação habilitado | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ['valor1','valor2','valor3'] | Sim |
| email_verificado | Filtro de busca se email está verificado | Sim |
| email_verificado__maior_igual | Filtro de busca se email está verificado | Valor do campo é maior ou igual que o valor do parametro informado | Sim |
| email_verificado__menor_igual | Filtro de busca se email está verificado | Valor do campo é menor ou igual que o valor do parametro informado | Sim |
| email_verificado__contem | Filtro de busca se email está verificado | Valor do campo contem que o valor do parametro informado | Sim |
| email_verificado__em | Filtro de busca se email está verificado | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ['valor1','valor2','valor3'] | Sim |

