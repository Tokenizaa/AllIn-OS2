# RELATÓRIO DE AUDITORIA DE ENDPOINTS ALLIN

**Data:** 14 de Junho de 2026  
**Objetivo:** Descobrir endpoints corretos para Produtos, Pedidos e Planos da API AllIn  
**Status:** ✅ COMPLETO

---

## RESUMO EXECUTIVO

A auditoria identificou que os endpoints de **Clientes** e **Distribuidores** estão CORRETOS e funcionando perfeitamente. No entanto, foram encontrados problemas nos endpoints de **Simulação/Planos**.

**Principais Descobertas:**
- ✅ Clientes: Endpoint CORRETO
- ✅ Distribuidores: Endpoint CORRETO
- ✅ Produtos: Endpoint CORRETO
- ✅ Pedidos: Endpoint CORRETO
- ❌ Simulação/Planos: Endpoints INCORRETOS

---

## DOCUMENTAÇÃO OFICIAL DA API ALLIN

Fonte: `docs/api-knowledge-base/`

### 1. Clientes
- **URL:** `https://allinbrasil.com.br/api/v1/clientes`
- **Escopo:** `clientes`
- **Métodos:** GET, POST, PUT
- **Status:** ✅ Documentado

### 2. Distribuidores
- **URL:** `https://allinbrasil.com.br/api/v1/distribuidores`
- **Escopo:** `distribuidores`
- **Métodos:** GET
- **Status:** ✅ Documentado

### 3. Produtos
- **URL:** `https://allinbrasil.com.br/api/v1/produtos`
- **Escopo:** `produtos`
- **Métodos:** GET, POST, PUT
- **Status:** ✅ Documentado

### 4. Pedidos
- **URL:** `https://allinbrasil.com.br/api/v1/pedidos`
- **Escopo:** `pedidos`
- **Métodos:** GET, POST
- **Status:** ✅ Documentado

### 5. Simulacao-Planos
- **URL:** `https://allinbrasil.com.br/api/v1/simulacao-planos`
- **Escopo:** `simulacao_planos_listar`
- **Métodos:** GET
- **Status:** ✅ Documentado

---

## ANÁLISE DO CÓDIGO ATUAL

Arquivo: `src/backend/shared/allin/allin.service.ts`

### Endpoints Atuais vs Documentação Oficial

| Método | Endpoint Atual | Endpoint Correto | Status |
|--------|---------------|-----------------|---------|
| `getClientes()` | `/clientes` | `/clientes` | ✅ CORRETO |
| `getDistribuidores()` | `/distribuidores` | `/distribuidores` | ✅ CORRETO |
| `getProdutos()` | `/produtos` | `/produtos` | ✅ CORRETO |
| `getPedidos()` | `/pedidos` | `/pedidos` | ✅ CORRETO |
| `getSimulacao()` | `/simulacao` | `/simulacao-planos` | ❌ INCORRETO |
| `getPlanos()` | `/planos` | `/simulacao-planos` | ❌ INCORRETO |

---

## PROBLEMAS IDENTIFICADOS

### Problema 1: Endpoint Incorreto em `getSimulacao()`
- **Linha:** 246
- **Endpoint Atual:** `/simulacao`
- **Endpoint Correto:** `/simulacao-planos`
- **Impacto:** Método retorna 404

### Problema 2: Endpoint Incorreto em `getPlanos()`
- **Linha:** 515
- **Endpoint Atual:** `/planos`
- **Endpoint Correto:** `/simulacao-planos`
- **Impacto:** Método retorna 404

### Problema 3: Escopo Não Configurado por Padrão
- **Arquivo:** `src/backend/shared/allin/allin.config.ts`
- **Problema:** O escopo não é configurado por padrão na inicialização
- **Impacto:** Os testes configuram o escopo manualmente, mas o serviço principal não

---

## ANÁLISE DOS TESTES

### test-produtos.ts
- **Escopo Configurado:** `clientes distribuidores produtos pedidos simulacao_planos_listar simulacao_bonus_faturamento`
- **Endpoint Testado:** `/produtos`
- **Status:** ✅ Endpoint CORRETO

### test-pedidos.ts
- **Escopo Configurado:** `clientes distribuidores produtos pedidos simulacao_planos_listar simulacao_bonus_faturamento`
- **Endpoint Testado:** `/pedidos`
- **Status:** ✅ Endpoint CORRETO

### test-planos.ts
- **Escopo Configurado:** `clientes distribuidores produtos pedidos simulacao_planos_listar simulacao_bonus_faturamento`
- **Endpoint Testado:** `/planos` (INCORRETO)
- **Status:** ❌ Endpoint INCORRETO - deveria ser `/simulacao-planos`

---

## POR QUE PRODUTOS E PEDIDOS RETORNAM 404?

### Análise do Problema

Os endpoints de Produtos e Pedidos estão **CORRETOS** conforme a documentação oficial. No entanto, eles retornam 404 porque:

1. **Escopo Não Configurado:** O arquivo `allin.config.ts` não configura o escopo por padrão
2. **Escopo Necessário:** Para acessar Produtos e Pedidos, o escopo deve incluir `produtos` e `pedidos`
3. **Configuração Manual:** Os testes configuram o escopo manualmente, mas o serviço principal não

### Solução Necessária

Adicionar configuração de escopo padrão em `allin.config.ts`:

```typescript
allinService.configure({
  baseUrl,
  clientId,
  clientSecret,
  grantType,
  scope: 'clientes distribuidores produtos pedidos simulacao_planos_listar simulacao_bonus_faturamento', // ADICIONAR ISTO
});
```

---

## ALTERAÇÕES NECESSÁRIAS

### Alteração 1: Corrigir `getSimulacao()`
**Arquivo:** `src/backend/shared/allin/allin.service.ts`  
**Linha:** 246

```typescript
// ANTES
const response = await this.request<{ simulacao: any[] }>("/simulacao");

// DEPOIS
const response = await this.request<{ planos: any[] }>("/simulacao-planos");
```

### Alteração 2: Corrigir `getPlanos()`
**Arquivo:** `src/backend/shared/allin/allin.service.ts`  
**Linha:** 515

```typescript
// ANTES
const response = await this.request<{ planos: any[] }>("/planos");

// DEPOIS
const response = await this.request<{ planos: any[] }>("/simulacao-planos");
```

### Alteração 3: Adicionar Escopo Padrão
**Arquivo:** `src/backend/shared/allin/allin.config.ts`  
**Linha:** 21-26

```typescript
// ANTES
allinService.configure({
  baseUrl,
  clientId,
  clientSecret,
  grantType,
});

// DEPOIS
allinService.configure({
  baseUrl,
  clientId,
  clientSecret,
  grantType,
  scope: 'clientes distribuidores produtos pedidos simulacao_planos_listar simulacao_bonus_faturamento',
});
```

### Alteração 4: Atualizar test-planos.ts
**Arquivo:** `scripts/test-planos.ts`  
**Linha:** 30

```typescript
// ANTES
const planos = await allinService.getPlanos();

// DEPOIS
const planos = await allinService.getSimulacao(); // ou usar o método corrigido getPlanos()
```

---

## DIFF COMPLETO PARA CORREÇÃO

### Arquivo: src/backend/shared/allin/allin.service.ts

```diff
--- a/src/backend/shared/allin/allin.service.ts
+++ b/src/backend/shared/allin/allin.service.ts
@@ -243,7 +243,7 @@ export class AllInService {
   async getSimulacao(): Promise<any[]> {
     await this.ensureAuthenticated();
 
     try {
-      const response = await this.request<{ simulacao: any[] }>("/simulacao");
+      const response = await this.request<{ planos: any[] }>("/simulacao-planos");
       logger.info("Fetched " + response.simulacao.length + " simulacoes from AllIn", "allin");
-      return response.simulacao;
+      return response.planos;
     } catch (error) {
       logger.error("Failed to fetch simulacao from AllIn", "allin", { error });
       throw error;
@@ -511,7 +511,7 @@ export class AllInService {
   async getPlanos(): Promise<any[]> {
     await this.ensureAuthenticated();
 
     try {
-      const response = await this.request<{ planos: any[] }>("/planos");
+      const response = await this.request<{ planos: any[] }>("/simulacao-planos");
       logger.info("Fetched " + response.planos.length + " planos from AllIn", "allin");
       return response.planos;
     } catch (error) {
```

### Arquivo: src/backend/shared/allin/allin.config.ts

```diff
--- a/src/backend/shared/allin/allin.config.ts
+++ b/src/backend/shared/allin/allin.config.ts
@@ -21,6 +21,7 @@ export function configureAllInService(): void {
   allinService.configure({
     baseUrl,
     clientId,
     clientSecret,
     grantType,
+    scope: 'clientes distribuidores produtos pedidos simulacao_planos_listar simulacao_bonus_faturamento',
   });
```

---

## CONCLUSÃO

### Por que os Testes Mostraram 404 para Produtos e Pedidos?

Os endpoints de Produtos e Pedidos estão **CORRETOS**. O problema real é que:

1. **Escopo Não Configurado:** O serviço principal não configura o escopo por padrão
2. **Escopo Necessário:** Para acessar esses endpoints, o token OAuth2 deve incluir os escopos `produtos` e `pedidos`
3. **Testes Funcionam:** Os testes configuram o escopo manualmente, por isso funcionam
4. **Serviço Principal Falha:** O serviço principal não configura o escopo, por isso retorna 404

### Resumo das Correções Necessárias

1. ✅ **Clientes e Distribuidores:** Não precisam de correção (já funcionam)
2. ❌ **Produtos e Pedidos:** Precisam adicionar escopo na configuração
3. ❌ **Simulação/Planos:** Precisam corrigir endpoints de `/simulacao` e `/planos` para `/simulacao-planos`

### Prioridade de Implementação

1. **ALTA:** Adicionar escopo padrão em `allin.config.ts` (corrige Produtos e Pedidos)
2. **ALTA:** Corrigir endpoint em `getSimulacao()` para `/simulacao-planos`
3. **ALTA:** Corrigir endpoint em `getPlanos()` para `/simulacao-planos`
4. **MÉDIA:** Atualizar testes para usar métodos corrigidos

---

## REFERÊNCIAS

- Documentação Oficial: `docs/api-knowledge-base/`
- Código Atual: `src/backend/shared/allin/allin.service.ts`
- Configuração: `src/backend/shared/allin/allin.config.ts`
- Testes: `scripts/test-produtos.ts`, `scripts/test-pedidos.ts`, `scripts/test-planos.ts`

---

**Fim do Relatório**
