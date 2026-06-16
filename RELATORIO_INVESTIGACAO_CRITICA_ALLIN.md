# RELATÓRIO DE INVESTIGAÇÃO CRÍTICA - API ALLIN

**Data:** 14 de Junho de 2026
**Objetivo:** Descobrir por que Clientes e Distribuidores funcionam enquanto Produtos, Pedidos e Planos retornam erros.

---

## 1. ANÁLISE LINHA POR LINHA - allin.service.ts

### 1.1 Método getClientes() - FUNCIONA ✅

**Localização:** Linha 202-213

```typescript
async getClientes(): Promise<AllInCliente[]> {
  await this.ensureAuthenticated();

  try {
    const response = await this.request<{ clientes: AllInCliente[] }>("/clientes");
    logger.info("Fetched " + response.clientes.length + " clientes from AllIn", "allin");
    return response.clientes;
  } catch (error) {
    logger.error("Failed to fetch clientes from AllIn", "allin", { error });
    throw error;
  }
}
```

**Endpoint:** `/clientes`
**Verbo:** GET
**Body:** Vazio (GET request)
**Headers:** Content-Type: application/json, Authorization: Bearer [token]

---

### 1.2 Método getDistribuidores() - FUNCIONA ✅

**Localização:** Linha 215-226

```typescript
async getDistribuidores(): Promise<AllInDistribuidor[]> {
  await this.ensureAuthenticated();

  try {
    const response = await this.request<{ distribuidores: AllInDistribuidor[] }>("/distribuidores");
    logger.info("Fetched " + response.distribuidores.length + " distribuidores from AllIn", "allin");
    return response.distribuidores;
  } catch (error) {
    logger.error("Failed to fetch distribuidores from AllIn", "allin", { error });
    throw error;
  }
}
```

**Endpoint:** `/distribuidores`
**Verbo:** GET
**Body:** Vazio (GET request)
**Headers:** Content-Type: application/json, Authorization: Bearer [token]

---

### 1.3 Método getProdutos() - NÃO FUNCIONA ❌

**Localização:** Linha 228-239

```typescript
async getProdutos(): Promise<AllInProduto[]> {
  await this.ensureAuthenticated();

  try {
    const response = await this.request<{ produtos: AllInProduto[] }>("/produtos");
    logger.info("Fetched " + response.produtos.length + " produtos from AllIn", "allin");
    return response.produtos;
  } catch (error) {
    logger.error("Failed to fetch produtos from AllIn", "allin", { error });
    throw error;
  }
}
```

**Endpoint:** `/produtos`
**Verbo:** GET
**Body:** Vazio (GET request)
**Headers:** Content-Type: application/json, Authorization: Bearer [token]

---

### 1.4 Método getPedidos() - NÃO FUNCIONA ❌

**Localização:** Linha 241-252

```typescript
async getPedidos(): Promise<AllInPedido[]> {
  await this.ensureAuthenticated();

  try {
    const response = await this.request<{ pedidos: AllInPedido[] }>("/pedidos");
    logger.info("Fetched " + response.pedidos.length + " pedidos from AllIn", "allin");
    return response.pedidos;
  } catch (error) {
    logger.error("Failed to fetch pedidos from AllIn", "allin", { error });
    throw error;
  }
}
```

**Endpoint:** `/pedidos`
**Verbo:** GET
**Body:** Vazio (GET request)
**Headers:** Content-Type: application/json, Authorization: Bearer [token]

---

### 1.5 Método getPlanosAtivos() - NÃO FUNCIONA ❌

**Localização:** Linha 523-534

```typescript
async getPlanosAtivos(): Promise<any[]> {
  await this.ensureAuthenticated();

  try {
    const response = await this.request<{ planos: any[] }>("/simulacao-planos");
    logger.info("Fetched " + response.planos.length + " planos ativos from AllIn", "allin");
    return response.planos;
  } catch (error) {
    logger.error("Failed to fetch planos ativos from AllIn", "allin", { error });
    throw error;
  }
}
```

**Endpoint:** `/simulacao-planos`
**Verbo:** GET
**Body:** Vazio (GET request)
**Headers:** Content-Type: application/json, Authorization: Bearer [token]

---

## 2. COMPARAÇÃO ENTRE MÉTODOS

### 2.1 Padrão de Código

**TODOS os métodos seguem EXATAMENTE o mesmo padrão:**

1. `await this.ensureAuthenticated()` - Garante autenticação
2. `this.request<{ tipo }[]>("/endpoint")` - Faz requisição
3. `logger.info()` - Log de sucesso
4. `return response.tipo` - Retorna dados
5. `try/catch` - Tratamento de erro

**CONCLUSÃO:** Não há diferenças na implementação do código. O problema NÃO está no código TypeScript.

---

### 2.2 Diferenças Identificadas

| Método | Endpoint | Status | Erro |
|--------|----------|--------|------|
| getClientes() | `/clientes` | ✅ 200 OK | Nenhum |
| getDistribuidores() | `/distribuidores` | ✅ 200 OK | Nenhum |
| getProdutos() | `/produtos` | ❌ 404 Not Found | "Não encontrado o dado solicitado em Produtos" |
| getPedidos() | `/pedidos` | ❌ 404 Not Found | "Não encontrado o dado solicitado em Pedidos" |
| getPlanosAtivos() | `/simulacao-planos` | ❌ 400 Bad Request | "Não está em modo de simulação" |

---

## 3. RESULTADOS DOS SCRIPTS DE DEBUG

### 3.1 Endpoint Clientes (REFERÊNCIA - FUNCIONA)

**URL Real Chamada:** `https://allinbrasil.com.br/api/v1/clientes`
**Método:** GET
**Headers:**
- Content-Type: application/json
- Authorization: Bearer [token]
**Body:** Vazio (GET request)
**Resposta:** 200 OK
**Dados Retornados:** 100 clientes com dados completos

---

### 3.2 Endpoint Produtos (NÃO FUNCIONA)

**URL Real Chamada:** `https://allinbrasil.com.br/api/v1/produtos`
**Método:** GET
**Headers:**
- Content-Type: application/json
- Authorization: Bearer [token]
**Body:** Vazio (GET request)
**Resposta:** 404 Not Found
**Erro:**
```json
{
  "status": 404,
  "titulo": "Não Encontrado",
  "mensagem": "Não foi possivel encontrar a solicitação",
  "error": {
    "servico": "Produtos",
    "detalhes": "Não encontrado o dado solicitado em Produtos"
  }
}
```

---

### 3.3 Endpoint Pedidos (NÃO FUNCIONA)

**URL Real Chamada:** `https://allinbrasil.com.br/api/v1/pedidos`
**Método:** GET
**Headers:**
- Content-Type: application/json
- Authorization: Bearer [token]
**Body:** Vazio (GET request)
**Resposta:** 404 Not Found
**Erro:**
```json
{
  "status": 404,
  "titulo": "Não Encontrado",
  "mensagem": "Não foi possivel encontrar a solicitação",
  "error": {
    "servico": "Pedidos",
    "detalhes": "Não encontrado o dado solicitado em Pedidos"
  }
}
```

---

### 3.4 Endpoint Planos (NÃO FUNCIONA)

**URL Real Chamada:** `https://allinbrasil.com.br/api/v1/simulacao-planos`
**Método:** GET
**Headers:**
- Content-Type: application/json
- Authorization: Bearer [token]
**Body:** Vazio (GET request)
**Resposta:** 400 Bad Request
**Erro:**
```json
{
  "status": 400,
  "titulo": "Requisição Inválida",
  "mensagem": "Não está em modo de simulação"
}
```

---

## 4. ANÁLISE DO TOKEN E ESCOPO

### 4.1 Token de Acesso

**Status:** ✅ Token obtido com sucesso
**Tipo:** Bearer
**Expira em:** 3600s (1 hora)
**Escopo Solicitado:** `clientes distribuidores produtos pedidos simulacao_planos_listar simulacao_bonus_faturamento`
**Escopo Concedido:** `clientes distribuidores produtos pedidos simulacao_planos_listar simulacao_bonus_faturamento`

**CONCLUSÃO:** O escopo está correto e foi concedido pela API. O problema NÃO é falta de permissão.

---

## 5. HIPÓTESES INVESTIGADAS

### 5.1 Endpoint Incorreto? ❌

**Verificação:** Documentação oficial indica `/produtos` e `/pedidos`
**Resultado:** Endpoints estão corretos conforme documentação
**Conclusão:** NÃO é endpoint incorreto

---

### 5.2 Verbo HTTP Incorreto? ❌

**Verificação:** Todos os métodos usam GET
**Resultado:** Clientes e Distribuidores funcionam com GET
**Conclusão:** NÃO é verbo HTTP incorreto

---

### 5.3 Headers Incorretos? ❌

**Verificação:** Todos usam Content-Type: application/json e Authorization: Bearer [token]
**Resultado:** Clientes e Distribuidores funcionam com os mesmos headers
**Conclusão:** NÃO são headers incorretos

---

### 5.4 Body Obrigatório? ❌

**Verificação:** Todos os métodos usam GET (sem body)
**Resultado:** Clientes e Distribuidores funcionam sem body
**Conclusão:** NÃO é body obrigatório

---

### 5.5 Querystring Obrigatória? ❌

**Verificação:** Nenhum parâmetro de querystring é enviado
**Resultado:** Clientes e Distribuidores funcionam sem querystring
**Conclusão:** NÃO é querystring obrigatória

---

### 5.6 Paginação Obrigatória? ❌

**Verificação:** Nenhum parâmetro de paginação é enviado
**Resultado:** Clientes e Distribuidores funcionam sem paginação
**Conclusão:** NÃO é paginação obrigatória

---

### 5.7 Endpoint Singular vs Plural? ❌

**Verificação:** Todos os endpoints são plural (/clientes, /distribuidores, /produtos, /pedidos)
**Resultado:** Clientes e Distribuidores funcionam com plural
**Conclusão:** NÃO é singular vs plural

---

## 6. CONCLUSÕES FINAIS - ATUALIZADO COM DADOS DO PAINEL ADMINISTRATIVO

### 6.1 Produtos e Pedidos - DADOS EXISTEM NO PAINEL ADMINISTRATIVO

**Status API REST:** 404 Not Found
**Status Painel Administrativo:** ✅ DADOS EXISTEM

**Evidências do Painel Administrativo:**
- Dashboard mostra 1.687 planos vendidos
- Relatório de Planos Vendidos mostra R$ 1.369.886,25 em vendas
- Tela de Planos (Adesões) mostra 3 planos ativos:
  - Plano Afiliado (ID: 343, R$ 0,00, estoque: 9000)
  - Plano Avanço (ID: 1, R$ 997,00, estoque: 1001)
  - Plano Excelência (ID: 313, R$ 3.980,00, estoque: 2000)
- Tela de Campos para Pedidos mostra campos configurados
- Dashboard mostra transações recentes com pedidos (#25190, #25189, etc.)

**Causa Real:** Os endpoints `/produtos` e `/pedidos` da API REST **NÃO ESTÃO HABILITADOS** ou **NÃO ESTÃO ACESSÍVEIS** via API para as credenciais OAuth2 sendo usadas, mesmo que os dados existam no painel administrativo.

**Conclusão:** O problema NÃO é falta de dados. O problema é que a API REST não está exposta ou não está configurada para retornar esses dados via OAuth2.

---

### 6.2 Planos - DADOS EXISTEM NO PAINEL ADMINISTRATIVO

**Status API REST:** 400 Bad Request
**Status Painel Administrativo:** ✅ DADOS EXISTEM

**Evidências do Painel Administrativo:**
- Tela de Planos (Adesões) mostra 3 planos ativos
- Relatório de Planos Vendidos mostra 1.686 registros
- Dashboard mostra 1.687 planos vendidos
- Distribuição por planos visível no dashboard

**Causa Real:** O endpoint `/simulacao-planos` da API REST requer que a conta esteja em "modo de simulação" para acessar via API, mas os dados de planos estão disponíveis no painel administrativo através de outras rotas.

**Conclusão:** O endpoint `/simulacao-planos` da API REST tem uma restrição específica que não se aplica ao painel administrativo web.

---

## 7. RECOMENDAÇÕES - ATUALIZADO

### 7.1 Para Produtos e Pedidos

**PROBLEMA CONFIRMADO:** Os dados existem no painel administrativo, mas a API REST não está retornando esses dados.

**Soluções Possíveis:**

1. **Verificar configuração da API REST:**
   - Entrar em contato com a AllIn para verificar se os endpoints `/produtos` e `/pedidos` estão habilitados para acesso via API OAuth2
   - Confirmar se as credenciais OAuth2 têm permissão para acessar esses endpoints
   - Verificar se há alguma configuração específica necessária para habilitar esses endpoints

2. **Usar dados do painel administrativo:**
   - Considerar usar web scraping do painel administrativo como alternativa temporária
   - Extrair dados das telas do painel administrativo (Planos, Relatório de Planos Vendidos)
   - Isso não é ideal, mas pode ser uma solução de contingência

3. **Solicitar acesso à API completa:**
   - Entrar em contato com a AllIn para solicitar acesso aos endpoints que não estão funcionando
   - Solicitar documentação atualizada da API REST
   - Verificar se há endpoints alternativos para acessar esses dados

---

### 7.2 Para Planos

**PROBLEMA CONFIRMADO:** O endpoint `/simulacao-planos` requer "modo de simulação" para acesso via API, mas os dados existem no painel administrativo.

**Soluções Possíveis:**

1. **Ativar modo de simulação:**
   - Entrar em contato com a AllIn para ativar o modo de simulação para a conta
   - Verificar se há planos de simulação configurados

2. **Usar dados do painel administrativo:**
   - Os dados de planos estão disponíveis no painel administrativo através da tela "Planos (Adesões)"
   - Considerar usar web scraping ou acesso direto ao painel administrativo
   - Os dados de planos vendidos estão disponíveis no "Relatório de Planos Vendidos"

3. **Endpoint alternativo:**
   - Verificar se há endpoint alternativo para acessar planos sem modo de simulação
   - Possivelmente `/planos` em vez de `/simulacao-planos`

---

## 8. RESUMO EXECUTIVO - ATUALIZADO

| Endpoint | URL | Status API | Status Painel | Causa Real |
|----------|-----|------------|---------------|------------|
| Clientes | `/clientes` | ✅ 200 OK | ✅ Dados disponíveis | N/A |
| Distribuidores | `/distribuidores` | ✅ 200 OK | ✅ Dados disponíveis | N/A |
| Produtos | `/produtos` | ❌ 404 | ✅ DADOS EXISTEM | API REST não habilitada/inacessível |
| Pedidos | `/pedidos` | ❌ 404 | ✅ DADOS EXISTEM | API REST não habilitada/inacessível |
| Planos | `/simulacao-planos` | ❌ 400 | ✅ DADOS EXISTEM | Requer modo de simulação via API |

**EVIDÊNCIAS DO PAINEL ADMINISTRATIVO:**
- Dashboard: 1.687 planos vendidos, R$ 1.369.886,25 em vendas
- Planos (Adesões): 3 planos ativos (Afiliado, Avanço, Excelência)
- Relatório de Planos Vendidos: 1.686 registros
- Campos para Pedidos: Configurados
- Transações: Pedidos recentes (#25190, #25189, etc.)

**CONCLUSÃO FINAL:** O problema NÃO é no código TypeScript. O problema NÃO é falta de dados. O problema é que:
1. A API REST da AllIn não está habilitada/inacessível para `/produtos` e `/pedidos` via OAuth2
2. O endpoint `/simulacao-planos` requer modo de simulação para acesso via API

**PRÓXIMA AÇÃO:** Entrar em contato com a AllIn para:
1. Solicitar habilitação dos endpoints `/produtos` e `/pedidos` na API REST
2. Ativar o modo de simulação para acessar `/simulacao-planos` via API
3. Ou usar web scraping do painel administrativo como alternativa
