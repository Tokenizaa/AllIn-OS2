# AllInBrasil API Documentation

**Source:** https://allinbrasil.com.br/api/documentacao  
**Date:** April 19, 2026  
**API Base URL:** https://allinbrasil.com.br/api

---

## Table of Contents

- [Geral](#geral)
- [Autenticação](#autenticação)
- [Autorização](#autorização)
- [Cep](#cep)
- [Cidades](#cidades)
- [Clientes](#clientes)
- [Distribuidor-Conta-Bancaria](#distribuidor-conta-bancaria)
- [Distribuidores](#distribuidores)
- [Estados](#estados)
- [Estados-Civil](#estados-civil)
- [Estoque-Total-Produtos](#estoque-total-produtos)
- [Extensoes](#extensoes)
- [Fabricantes](#fabricantes)
- [Formas-Frete](#formas-frete)
- [Formas-Pagamento](#formas-pagamento)
- [Linguagens](#linguagens)
- [Lojas](#lojas)
- [Paises](#paises)
- [Pedidos](#pedidos)
- [Pedidos-Saldos](#pedidos-saldos)
- [Pedidos-Status](#pedidos-status)
- [Ping](#ping)
- [Produtos](#produtos)
- [Produtos-Campos-Opcoes](#produtos-campos-opcoes)
- [Produtos-Categorias](#produtos-categorias)
- [Produtos-Opcoes](#produtos-opcoes)
- [Rede-Linear-Nos](#rede-linear-nos)
- [Simulacao](#simulacao)
- [Simulacao-Bonus-Faturamento](#simulacao-bonus-faturamento)
- [Simulacao-Planos](#simulacao-planos)
- [Solicitacoes-Saque](#solicitacoes-saque)
- [Solicitacoes-Saque-Cd](#solicitacoes-saque-cd)
- [Tipos-Campo-Pedido](#tipos-campo-pedido)
- [Tipos-Pessoa](#tipos-pessoa)
- [Transportadoras](#transportadoras)
- [Erros](#erros)

---

## Geral

### API

Com API Maxnivel você pode consultar dados do sistema através dos serviços disponíveis. A comunicação segue os padrões REST e o modelo de autenticação é OAuth2, visite a página de autenticação para mais detalhes.

### Padrões da API

A API encontra-se no endereço: https://allinbrasil.com.br/api

Para acessar qualquer serviço, você deve passar o endereço, depois a versão de utilização do serviço e por último o nome do serviço de acordo com a documentação do mesmo.

Esse endereço é chamado por padrão de 'endpoint' e se trata da URL para onde as requisições com os dados serão enviadas.

**Exemplo:** https://allinbrasil.com.br/api/v1/pedidos

- v1 é a versão do serviço
- pedidos é o serviço

Todos os serviços disponíveis para uso estão nessa documentação, visite os serviços para detalhes.

---

## Autenticação

Autenticação utilizada OAuth2, necessita que você tenha um appId e um appSecret com os escopos de permissão que o endpoint necessita.

### Acessando appId e appSecret

Seu appId e appSecret são fornecidos pelo o administrador do sistema com os escopos específicos que você precisar.

### Requisitando chave de acesso por Credenciais Próprias

Para requisitar a chave de acesso utilizando suas próprias credenciais, você deve enviar uma solicitação **POST** na URL: https://allinbrasil.com.br/api/v1/auth/token

Com os parâmetros:

| Parâmetro | Valor | Opcional |
|-----------|-------|----------|
| client_id | Seu appId | Não |
| client_secret | Seu appSecret | Não |
| grant_type | client_credentials | Não |
| code | Código de autorização do cliente [MAIS INFORMAÇÕES](https://allinbrasil.com.br/api/documentacao/#!/permissao) | Sim |

Caso você deseje obter um token de distribuidor sem utilizar o endpoint de autorização é possível utilizar o grant_type do tipo **password**. Para isso deve ser adicionado os parâmetros **username** com o usuário do distribuidor, **password** com a senha e **scope** (escopos solicitados separados por '+' ou espaço) na requisição. Obs: após 10 tentativas de autenticação com dados incorretos as tentativas para o usuário serão bloqueadas por uma hora.

Após a solicitação você terá uma resposta json no modelo abaixo caso o grant_type seja do tipo client_credentials ou password:

```json
{
  "access_token": "f53b762520c6faa9aabdae132eaa8ce9f5703a18",
  "expires_in": 3600,
  "token_type": "Bearer",
  "scope": null
}
```

Então, todas as requisições que for enviadas na api você deverá enviar junto no cabeçalho da requisição o **access_token**, da seguinte forma:

```
Authorization: Bearer f53b762520c6faa9aabdae132eaa8ce9f5703a18
```

### Exemplo PHP

**Requisição de autenticação:**

```php
$request = new HttpRequest();
$request->setUrl('https://allinbrasil.com.br/api/v1/auth/token');
$request->setMethod(HTTP_METH_POST);

$request->setHeaders(array(
  'cache-control' => 'no-cache',
  'Connection' => 'keep-alive',
  'Content-Length' => '114',
  'Accept-Encoding' => 'gzip, deflate',
  'Host' => 'maxnivel.local',
  'Cache-Control' => 'no-cache',
  'Accept' => '*/*',
  'Authorization' => 'Bearer ee8d11881898f98b42def278e2fa84cdab14f835',
  'Content-Type' => 'application/x-www-form-urlencoded'
));

$request->setContentType('application/x-www-form-urlencoded');
$request->setPostFields(array(
  'client_id' => 'APPTESTE_7baebf2372',
  'client_secret' => '06ee142b1a038cbcf59ee49987c27394339e7da5',
  'grant_type' => 'client_credentials'
));

try {
  $response = $request->send();
  echo $response->getBody();
} catch (HttpException $ex) {
  echo $ex;
}
```

**Resposta da requisição de autenticação:**

```json
{
  "access_token": "f151ec623701ec8ed5d200a83c2c89be5bf6d8a5",
  "expires_in": 3600,
  "token_type": "Bearer",
  "scope": null
}
```

**Exemplo de requisição na API para obter pedidos:**

```php
$request = new HttpRequest();
$request->setUrl('https://allinbrasil.com.br/api/v1/pedidos');
$request->setMethod(HTTP_METH_GET);

$request->setHeaders(array(
  'cache-control' => 'no-cache',
  'Connection' => 'keep-alive',
  'Accept-Encoding' => 'gzip, deflate',
  'Cache-Control' => 'no-cache',
  'Accept' => '*/*',
  'Authorization' => 'Bearer f151ec623701ec8ed5d200a83c2c89be5bf6d8a5',
  'Content-Type' => 'application/json'
));

try {
  $response = $request->send();
  echo $response->getBody();
} catch (HttpException $ex) {
  echo $ex;
}
```

### Exemplo JavaScript

**Requisição de autenticação:**

```javascript
var data = "client_id=APPTESTE_7baebf2372&client_secret=06ee142b1a038cbcf59ee49987c27394339e7da5&grant_type=client_credentials";

var xhr = new XMLHttpRequest();
xhr.withCredentials = true;

xhr.addEventListener("readystatechange", function () {
  if (this.readyState === 4) {
    console.log(this.responseText);
  }
});

xhr.open("POST", "https://allinbrasil.com.br/api/v1/auth/token");
xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
xhr.setRequestHeader("cache-control", "no-cache");

xhr.send(data);
```

**Resposta da requisição de autenticação:**

```json
{
  "access_token": "f151ec623701ec8ed5d200a83c2c89be5bf6d8a5",
  "expires_in": 3600,
  "token_type": "Bearer",
  "scope": null
}
```

**Exemplo de requisição na API para obter pedidos:**

```javascript
var data = null;

var xhr = new XMLHttpRequest();
xhr.withCredentials = true;

xhr.addEventListener("readystatechange", function () {
  if (this.readyState === 4) {
    console.log(this.responseText);
  }
});

xhr.open("GET", "https://allinbrasil.com.br/api/v1/pedidos");
xhr.setRequestHeader("Content-Type", "application/json");
xhr.setRequestHeader("Authorization", "Bearer f151ec623701ec8ed5d200a83c2c89be5bf6d8a5");
xhr.setRequestHeader("Accept", "*/*");
xhr.setRequestHeader("Cache-Control", "no-cache");
xhr.setRequestHeader("Host", "maxnivel.local");
xhr.setRequestHeader("Accept-Encoding", "gzip, deflate");
xhr.setRequestHeader("Cookie", "PHPSESSID=e2caa728beba7531f40fe683a56893c6");
xhr.setRequestHeader("Connection", "keep-alive");
xhr.setRequestHeader("cache-control", "no-cache");

xhr.send(data);
```

---

## Erros

Todos os erros são baseados no código HTTP, veja abaixo os possíveis códigos como resposta e o seu significado de acordo com a API.

### Status 4xx

#### 400 - Requisição Inválida

A API está recebendo dados em formatos inválidos, exemplo, um corpo de requisição que não está no formato JSON corretamente, ou arquivos não permitidos.

#### 401 - Não Autorizado

O endpoint exige um escopo de acesso que você não possui, ou não se autenticou corretamente.

#### 404 - Não Encontrado

Não foi encontrado o serviço solicitado.

#### 405 - Método não permitido

O método utilizado na requisição não é permitido, exemplo, o serviço só suporta método GET, porém você está tentando enviar um POST.

#### 412 - Pre condição falhou

Quando você faz uma solicitação específica com uma condição não suportada ou de ordem incorreta.

#### 422 - Entidade improcessável

Quando a entidade ou corpo enviado para a API não está em condições corretas para a API processá-la.

### Status 5xx

#### 500 - Erro interno no servidor

A API está com problemas internos, tente acessá-la novamente mais tarde.

#### 501 - Não implementado

O Serviço ainda não foi liberado para uso.

---

## Available Endpoints Summary

### Core Services
- **Cep** - GET Cep
- **Cidades** - GET Cidades, POST Cidades
- **Clientes** - GET Clientes, POST Clientes, PUT Clientes, POST Atualizar-Senha, GET Contas, POST Contas, GET Enderecos, POST Token-Login
- **Distribuidor-Conta-Bancaria** - GET Distribuidor-Conta-Bancaria
- **Distribuidores** - GET Distribuidores, GET Ativacoes-Mensais, GET Plano-Atual, GET Qualificacao-Atual, GET Telefones
- **Estados** - GET Estados, POST Estados
- **Estados-Civil** - GET Estados-Civil
- **Estoque-Total-Produtos** - GET Estoque-Total-Produtos
- **Extensoes** - GET Extensoes
- **Fabricantes** - GET Fabricantes, POST Fabricantes, PUT Fabricantes
- **Formas-Frete** - POST Formas-Frete
- **Formas-Pagamento** - GET Formas-Pagamento, POST Formas-Pagamento
- **Linguagens** - GET Linguagens
- **Lojas** - GET Lojas
- **Paises** - GET Paises, POST Paises
- **Pedidos** - GET Pedidos, POST Pedidos, POST Alterar-Status, POST Cancelar, POST Confirmar-Pagamento, GET Historico, POST Historico, GET Itens, GET Kit-Itens, GET Itens-Faturamento, GET Pagamentos, POST Pagamentos, PUT Pagamentos, GET Totais, GET Transportes
- **Pedidos-Saldos** - GET Pedidos-Saldos
- **Pedidos-Status** - GET Pedidos-Status, POST Pedidos-Status
- **Ping** - GET Ping
- **Produtos** - GET Produtos, POST Produtos, PUT Produtos, GET Estoque, POST Estoque, GET Estoque-Totais, GET Opcoes-Valores, POST Opcoes-Valores, PUT Opcoes-Valores, DELETE Opcoes-Valores
- **Produtos-Campos-Opcoes** - GET Produtos-Campos-Opcoes
- **Produtos-Categorias** - GET Produtos-Categorias, POST Produtos-Categorias, PUT Produtos-Categorias
- **Produtos-Opcoes** - GET Produtos-Opcoes, POST Produtos-Opcoes, PUT Produtos-Opcoes, DELETE Produtos-Opcoes
- **Rede-Linear-Nos** - GET Rede-Linear-Nos, GET Downlines, GET Uplines
- **Simulacao** - GET Simulacao, POST Simulacao, POST Cancelar, POST Executar, GET Informacoes-Execucao
- **Simulacao-Bonus-Faturamento** - GET Simulacao-Bonus-Faturamento
- **Simulacao-Planos** - GET Simulacao-Planos
- **Solicitacoes-Saque** - GET Solicitacoes-Saque, POST Solicitacoes-Saque, POST Confirmar, POST Estornar, POST Reverter
- **Solicitacoes-Saque-Cd** - GET Solicitacoes-Saque-Cd, POST Confirmar, POST Estornar, POST Reverter
- **Tipos-Campo-Pedido** - GET Tipos-Campo-Pedido
- **Tipos-Pessoa** - GET Tipos-Pessoa
- **Transportadoras** - GET Transportadoras

---

**Note:** This documentation was scraped from https://allinbrasil.com.br/api/documentacao on April 19, 2026. For the most up-to-date information, please visit the official documentation site.
