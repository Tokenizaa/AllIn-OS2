# Erros

Todos os erros são baseados no código HTTP, veja abaixo os possíveis códigos como resposta e o seu significado de acordo com a API.

## Status 4xx

### 400 - Requisição Inválida

A API está recebendo dados em formatos inválidos, exemplo, um corpo de requisição que não está no formato JSON corretamente, ou arquivos não permitidos.

### 401 - Não Autorizado

O endpoint exige um escopo de acesso que você não possui, ou não se autenticou corretamente.

### 404 - Não Encontrado

Não foi encontrado o serviço solicitado.

### 405 - Método não permitido

O método utilizado na requisição não é permitido, exemplo, o serviço só suporta método GET, porém você está tentando enviar um POST.

### 412 - Pre condição falhou

Quando você faz uma solicitação específica com uma condição não suportada ou de ordem incorreta.

### 422 - Entidade improcessável

Quando a entidade ou corpo enviado para a API não está em condições corretas para a API processá-la.

## Status 5xx

### 500 - Erro interno no servidor

A API está com problemas internos, tente acessá-la novamente mais tarde.

### 501 - Não implementado

O Serviço ainda não foi liberado para uso.
