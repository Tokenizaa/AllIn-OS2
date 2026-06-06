# Autorização

## Quando utilizar autorização?

R: Quando você precisar acessar os dados de um distribuidor/usuário dentro do seu aplicativo então você pode solicitar ao distribuidor/usuário autorização de acesso.

Permissão utilizada OAuth2, necessita que o cliente permita acesso aos escopos em que sua APP possa buscar dados do próprio cliente.

## Atenção

A autorização só funciona para aplicativos com configurações que exigem essa autorização. O administrador do sistema deve habilitar estas configurações no módulo pelo painel administrativo.

Na configuração do aplicativo no sistema, as opções que exigem autorização são as que permitem acessar os dados dos usuários conforme citadas abaixo:

- Permite acessar os dados de todos os usuários
- Permite acessar os dados de usuários que autorizarem que seus dados sejam acessados

## Como usar autorização?

### 1º passo) Requisitar acesso aos dados do cliente em determinados escopos

Para requisitar a chave de acesso utilizando suas próprias credenciais, você deve enviar uma solicitação GET na URL:

https://allinbrasil.com.br/api/v1/auth/authorization

Com os parâmetros:

| Parâmetro | Valor |
|-----------|-------|
| response_type | Tipo de resposta (DEVE ser enviada o valor 'code') |
| client_id | Seu client id |
| redirect_uri | Url na qual será retornado os dados |
| scope | Escopos solicitados (Separados por '+' ou espaço) |
| state | String que será retornada no redirecionamento da url |
| elsl | Informar "1" para exigir que o usuário informe login e senha mesmo se já estiver logado no sistema (opcional) |

**Exemplo da url montada:**

```
https://allinbrasil.com.br/api/v1/auth/authorization?response_type=code&client_id=ID_DO_CLIENTE&redirect_uri=http://meusite.com/minhaAplicacao&scope=pedidos+produtos&state=1525866663
```

### 2º passo) Distribuidor/usuário realiza o login e concede a autorização ao seu aplicativo

A url levará o cliente para a página de autorização e o distribuidor/usuário irá realizar o login e então conceder permissão ao seu aplicativo.

### 3º passo) Retorno

Após a autorização, será redirecionado para URL de redirecionamento do seu aplicativo. A resposta da página será um requisição GET na url informada no redirect_uri com os seguintes parâmetros:

| Parâmetro | Valor |
|-----------|-------|
| code | Código de autorização |
| state | String que foi enviada na requisição de autorização |

### 4º passo) Trocar o código por um access_token

Com o código de autorização em mãos, você deve fazer uma solicitação POST na URL:

https://allinbrasil.com.br/api/v1/auth/token

Com os parâmetros:

| Parâmetro | Valor | Opcional |
|-----------|-------|----------|
| client_id | Seu appId | Não |
| client_secret | Seu appSecret | Não |
| grant_type | authorization_code | Não |
| code | Código de autorização obtido no passo anterior | Não |
| redirect_uri | Url na qual será retornado os dados (deve ser a mesma informada no passo 1) | Não |

Após a solicitação você terá uma resposta json no modelo abaixo:

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
