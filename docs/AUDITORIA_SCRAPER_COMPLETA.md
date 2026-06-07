# AUDITORIA COMPLETA DO SISTEMA DE SCRAPE ALLIN OS

**Data:** 2026-06-07  
**Arquiteto:** Cascade AI  
**Escopo:** Auditoria profunda e correção integral do sistema de scraping

---

# RESUMO EXECUTIVO

O sistema atual de scraping possui falhas críticas que impedem o processamento confiável de 22.000+ pedidos:

1. **Deduplicação quebrada** - Customer ID extraído incorretamente (nome em vez de ID numérico)
2. **Gargalo de memória** - Todos os dados carregados em memória antes de persistir
3. **Sem checkpoints** - Falha total perde todo o progresso
4. **Persistência ineficiente** - SELECT → UPDATE → INSERT por registro
5. **Sem monitoramento** - Sem visibilidade de progresso ou erros
6. **Sem recuperação** - Sem retry ou tratamento de falhas

---

# ETAPA 1 — AUDITORIA DE FLUXO

## Fluxo Completo de Execução

```
main()
  └─> scrape_complete()
      └─> scrape_orders_with_customers()
          ├─> extractor.extract_orders_list() [PAGINAÇÃO]
          │   └─> Loop per_page: 15, 30, 45, 60, ...
          │       └─> HTTP GET /sale/order?token=&per_page=
          │       └─> BeautifulSoup parse table tbody tr
          │       └─> Extrair order_id da primeira coluna
          │       └─> Verificar duplicatas
          │       └─> time.sleep(0.5)
          │
          ├─> Loop para cada order_id:
          │   ├─> extractor.extract_order_details(order_id)
          │   │   ├─> HTTP GET /sale/order/info?token=&order_id=
          │   │   ├─> BeautifulSoup parse 7 abas:
          │   │   │   ├─> #tab-order (PedidoInfo)
          │   │   │   ├─> #tab-distribuidor (DistribuidorInfo)
          │   │   │   ├─> #tab-payment (PagadorInfo)
          │   │   │   ├─> #tab-shipping (EnvioInfo)
          │   │   │   ├─> #tab-product (ProdutosInfo)
          │   │   │   ├─> #tab-pagamento (PagamentoInfo)
          │   │   │   └─> #tab-history (Historico)
          │   │   └─> Retornar PedidoCompleto
          │   │
          │   ├─> transformer.transform_customer_from_order(pedido)
          │   │   └─> Extrair customer de PedidoInfo + DistribuidorInfo
          │   │   └─> customers_dict[id_comprador] = customer
          │   │
          │   ├─> complete_orders.append(complete_order)
          │   └─> time.sleep(1) + pausa a cada 50
          │
          ├─> loader.update_customers(customers_data)
          │   └─> Loop customers:
          │       ├─> SELECT WHERE id_comprador = ?
          │       ├─> IF exists: UPDATE
          │       └─> ELSE: INSERT
          │
          ├─> transformer.transform_order(pedido) [loop]
          ├─> transformer.transform_order_items(pedido) [loop]
          ├─> loader.update_orders(orders_data)
          │   └─> Loop orders:
          │       ├─> SELECT WHERE numero_pedido = ?
          │       ├─> IF exists: UPDATE
          │       └─> ELSE: INSERT
          │
          └─> loader.update_order_items(order_items) [loop por order_id]
              ├─> DELETE WHERE order_id = ?
              └─> INSERT itens
```

## Dependências Entre Módulos

```
run_scrape.py
  ├─> auth.py (LojaVirtualAuth)
  ├─> extractors/orders.py (OrdersExtractor)
  ├─> extractors/customers.py (CustomersExtractor)
  ├─> transformers/to_supabase.py (SupabaseTransformer)
  │   └─> transformers/dataclasses.py (PedidoCompleto, etc.)
  └─> loaders/supabase_loader.py (SupabaseLoader)
      └─> supabase-py (create_client)
```

## Ciclo de Vida dos Dados

1. **Extração:** HTML → BeautifulSoup → Dataclasses Python
2. **Acumulação:** Lista `complete_orders` em memória
3. **Transformação:** Dataclasses → Dicts JSON
4. **Deduplicação:** Dict `customers_dict` em memória
5. **Persistência:** Dicts → Supabase (HTTP requests)

## Pontos de Perda de Dados

| Ponto | Risco | Impacto |
|-------|-------|---------|
| Falha durante extração de order_details | Alto | Perda do pedido atual |
| Falha durante transformação | Alto | Perda do pedido atual |
| Falha durante persistência (antes de commit) | CRÍTICO | Perda de TODOS os pedidos acumulados |
| Falha de rede durante loop | Alto | Perda do pedido atual |
| Exceção não tratada | CRÍTICO | Perda de todo o progresso |

## Pontos de Sobrescrita de Registros

| Ponto | Risco | Impacto |
|-------|-------|---------|
| `customers_dict[id_comprador] = customer` | CRÍTICO | Se id_comprador incorreto, sobrescreve customers diferentes |
| SELECT → UPDATE sem verificação de campos | Médio | Pode sobrescrever dados mais recentes com dados antigos |

## Gargalos de Memória

| Local | Problema | Impacto |
|-------|----------|---------|
| `complete_orders = []` | Acumula 22.000+ pedidos em memória | **CRÍTICO** - OOM |
| `customers_dict = {}` | Acumula todos os customers em memória | Alto |
| `all_order_items = []` | Acumula todos os itens em memória | Alto |

**Estimativa de memória:**
- 22.000 pedidos × ~50KB cada = ~1.1 GB
- Customers × ~10KB cada = ~220 MB
- Order items × ~5KB cada = ~550 MB
- **Total: ~1.9 GB** (provável OOM em sistemas com 4GB ou menos)

## Gargalos de Rede

| Local | Problema | Impacto |
|-------|----------|---------|
| 22.000 HTTP requests para order_details | Alto | Latência acumulada |
- 22.000 × 1s sleep = 6.1 horas apenas em sleep
- Sem paralelização

## Gargalos de Supabase

| Local | Problema | Impacto |
|-------|----------|---------|
| SELECT → UPDATE → INSERT por registro | **CRÍTICO** | 44.000+ queries para 22.000 pedidos |
- Customers: 22.000 SELECT + 22.000 INSERT/UPDATE
- Orders: 22.000 SELECT + 22.000 INSERT/UPDATE
- Order Items: Deletar + Insert por order_id
- **Total: ~100.000+ queries**

---

# ETAPA 2 — AUDITORIA DE DEDUPLICAÇÃO

## Problema Crítico Identificado

**Arquivo:** `scripts/scrape/extractors/orders.py`  
**Linha:** 465-471  
**Função:** `_extract_customer_id()`

```python
def _extract_customer_id(self, cliente_text):
    """Extrair ID do cliente do texto do cliente (pode estar em um link)"""
    if not cliente_text:
        return None
    # O ID pode estar em um link ou ser extraído de outra forma
    # Por enquanto, retorna o texto como está
    return cliente_text  # ❌ INCORRETO!
```

### Análise do HTML Real

Do arquivo `order_page.html` linha 517-520:

```html
<td>Cliente:</td>
<td>
    <a href="https://allinbrasil.com.br/loja/admin/sale/customer/edit?token=...&amp;customer_id=2503"
       target="_blank">MárciaGomes Fagundes da Silva</a>
</td>
```

### Comportamento Atual

1. BeautifulSoup extrai: `"MárciaGomes Fagundes da Silva"`
2. `_extract_customer_id()` retorna: `"MárciaGomes Fagundes da Silva"`
3. `cliente_id` em `PedidoInfo` = `"MárciaGomes Fagundes da Silva"`
4. `transform_customer_from_order()` usa `cliente_id` como chave
5. `customers_dict["MárciaGomes Fagundes da Silva"] = customer`

### Impacto

- **Múltiplos customers com mesmo nome** → Sobrescrita
- **Nomes com acentos/espacos diferentes** → Duplicatas
- **ID numérico real (2503) ignorado** → Chave única perdida

### Diagnóstico

| Campo | Valor Extraído | Valor Correto | Status |
|-------|----------------|---------------|--------|
| cliente_id | "MárciaGomes Fagundes da Silva" | "2503" | ❌ CRÍTICO |
| id_comprador | "MárciaGomes Fagundes da Silva" | "2503" | ❌ CRÍTICO |

### Correção Necessária

```python
def _extract_customer_id(self, cliente_text):
    """Extrair ID do cliente do texto do cliente (pode estar em um link)"""
    if not cliente_text:
        return None
    
    # Se for um elemento BeautifulSoup (link), extrair customer_id da URL
    if hasattr(cliente_text, 'find'):
        link = cliente_text.find('a')
        if link and link.get('href'):
            href = link.get('href')
            if 'customer_id=' in href:
                return href.split('customer_id=')[1].split('&')[0]
    
    # Se for string, tentar extrair ID se estiver no formato
    if isinstance(cliente_text, str):
        # Tentar extrair número da string
        import re
        match = re.search(r'\d+', cliente_text)
        if match:
            return match.group(0)
    
    return cliente_text  # Fallback para comportamento anterior
```

---

# ETAPA 3 — AUDITORIA DE EXTRAÇÃO

## Mapeamento de Campos - Customers

| Campo | Origem HTML | Seletor | Status | Correção |
|-------|-------------|---------|--------|----------|
| id_comprador | #tab-order > table > tr[Cliente] > td > a[href*=customer_id] | Extrair de URL | ❌ CRÍTICO | Implementar extração de URL |
| usuario | #tab-order > table > tr[Cliente] | Texto do link | ⚠️ Incerto | Validar se é username ou nome |
| email | #tab-order > table > tr[E-mail] | td[1] | ✅ OK | - |
| telefone | #tab-order > table > tr[Telefone] | td[1] | ✅ OK | - |
| cpf | #tab-order > table > tr[CNPJ] | td[1] | ⚠️ Incerto | Campo é CNPJ, mapeado para CPF |
| patrocinador_comprador | #tab-order > table > tr[Patrocinador] | Extrair username | ⚠️ Incerto | Validar formato |
| nome_completo | #tab-distribuidor > table > tr[Nome] | td[1] | ✅ OK | - |
| endereco | #tab-distribuidor > table > tr[Endereço] | td[1] | ✅ OK | - |
| cidade | #tab-distribuidor > table > tr[Cidade / Estado] | td[1] | ⚠️ Incerto | Precisa split |
| estado | #tab-distribuidor > table > tr[Cidade / Estado] | td[1] | ⚠️ Incerto | Precisa split |
| bairro | #tab-payment > table > tr[Bairro] | td[1] | ✅ OK | - |
| numero | #tab-payment > table > tr[Número] | td[1] | ✅ OK | - |
| complemento | #tab-payment > table > tr[Complemento] | td[1] | ✅ OK | - |
| cep | #tab-payment > table > tr[CEP] | td[1] | ✅ OK | - |

## Mapeamento de Campos - Orders

| Campo | Origem HTML | Seletor | Status | Correção |
|-------|-------------|---------|--------|----------|
| numero_pedido | #tab-order > table > tr[Pedido nº] | td[1] | ✅ OK | Remover '#' |
| comprador | #tab-order > table > tr[Cliente] | Texto do link | ✅ OK | - |
| usuario | #tab-order > table > tr[Cliente] | Texto do link | ⚠️ Incerto | Validar |
| telefone | #tab-order > table > tr[Telefone] | td[1] | ✅ OK | - |
| pagamentos | #tab-pagamento > table | JSON | ✅ OK | - |
| endereco | #tab-shipping > table > tr[Endereço] | td[1] | ✅ OK | - |
| cidade | #tab-shipping > table > tr[Cidade] | td[1] | ✅ OK | - |
| estado | #tab-shipping > table > tr[Estado] | td[1] | ✅ OK | - |
| status | #tab-order > table > tr[Situação do pedido] | td[1] | ✅ OK | - |
| valores | #tab-product > table | Extração | ✅ OK | - |

## Campos NULL no Supabase - Causa Raiz

Analisando `transform_customer_from_order()` em `to_supabase.py`:

```python
def transform_customer_from_order(self, pedido: PedidoCompleto):
    return {
        'id_comprador': id_comprador,  # ❌ Nome em vez de ID
        'usuario': pedido_info.cliente,  # ⚠️ Pode ser nome completo
        'email': pedido_info.email,  # ✅ OK
        'telefone': pedido_info.telefone,  # ✅ OK
        'cpf': pedido_info.cnpj,  # ⚠️ Campo é CNPJ
        'estado': None,  # ❌ Hardcoded None
        'bairro': None,  # ❌ Hardcoded None
        'numero': None,  # ❌ Hardcoded None
        'complemento': None,  # ❌ Hardcoded None
        'cep': None,  # ❌ Hardcoded None
    }
```

**Causa:** Campos de endereço estão hardcoded como `None` em vez de extrair de `PagadorInfo` ou `EnvioInfo`.

---

# ETAPA 4 — AUDITORIA DE PAGINAÇÃO

## Análise de `extract_orders_list()`

**Arquivo:** `scripts/scrape/extractors/orders.py`  
**Linhas:** 19-88

### Lógica Atual

```python
per_page = 15
while True:
    url = f"{loja_base_url}/sale/order?token={token}&per_page={per_page}"
    response = session.get(url)
    # Extrair order_ids
    # Verificar duplicatas
    per_page += 15  # Incrementa offset
```

### Problemas Identificados

| Problema | Impacto | Probabilidade |
|----------|--------|--------------|
| `per_page` usado como offset | Funciona, mas confuso | Médio |
| Verificação de duplicatas: `page_orders == orders[-len(page_orders):]` | Pode falhar se pedidos repetidos | Baixo |
| Sem validação de total de pedidos | Não sabe quando termina | Médio |
| Sem detecção de loop infinito | Pode loop se API retornar sempre dados | Baixo |
| Rate limiting fixo (0.5s) | Pode ser lento ou rápido demais | Médio |

### Validação Necessária

1. Extrair total de pedidos da página (se disponível)
2. Implementar timeout máximo
3. Detectar repetição de páginas
4. Validar que `per_page` realmente funciona como offset

---

# ETAPA 5-12 — PLANO DE CORREÇÃO

## Priorização de Correções

### CRÍTICAS (Bloqueiam processamento de 22.000 pedidos)

1. **Corrigir `_extract_customer_id()`** - Extrair ID numérico da URL
2. **Implementar batch processing** - Persistir a cada 100 pedidos
3. **Implementar checkpoints** - Recuperação após falha
4. **Corrigir campos hardcoded None** - Extrair de abas corretas

### ALTAS (Melhoram performance e confiabilidade)

5. **Implementar UPSERT em lote** - Reduzir queries de 100.000 para ~1.000
6. **Implementar logging estruturado** - Visibilidade de problemas
7. **Implementar monitoramento em tempo real** - Progresso visível
8. **Implementar retry exponencial** - Resiliência a falhas

### MÉDIAS (Melhoram qualidade)

9. **Validação de integridade** - Verificar extração == persistência
10. **Otimizar paginação** - Melhor detecção de fim

---

# PRÓXIMOS PASSOS

1. Implementar correções críticas
2. Testar com 100 pedidos
3. Validar integridade
4. Escalar para 22.000 pedidos
5. Monitorar execução

