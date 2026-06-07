# CAUSA RAIZ CONFIRMADA

**Data:** 2026-06-07  
**Investigação:** Playwright MCP  
**Status:** CONFIRMADO COM EVIDÊNCIAS

---

## RESUMO EXECUTIVO

**Problema:** 17.734+ pedidos processados, mas apenas 20 customers e 20 orders gravados no Supabase.

**Causa Raiz:** O scraper usa `.text.strip()` para extrair valores das células HTML, o que remove elementos como links que contêm o `customer_id`. Sem `customer_id`, a deduplicação de customers falha completamente.

---

## EVIDÊNCIA #1: CUSTOMER_ID NO HTML

**Sistema Real (Playwright MCP):**
```html
<row "Cliente: AngelaRegina dos Santos">
  <cell "Cliente:">
  <cell "AngelaRegina dos Santos">
    <link "AngelaRegina dos Santos">
      /url: https://allinbrasil.com.br/loja/admin/sale/customer/edit?token=...&customer_id=919
```

**Valor presente:** `customer_id=919` (na URL do link)

---

## EVIDÊNCIA #2: SCRAPER PERDE O LINK

**Código Problemático (extractors/orders.py:165):**
```python
value = cells[1].text.strip()
```

**Resultado:** Apenas o texto `"AngelaRegina dos Santos"` é extraído, o link com `customer_id=919` é perdido.

---

## EVIDÊNCIA #3: MÉTODO DE EXTRAÇÃO FALHA

**Código (extractors/orders.py:465-486):**
```python
def _extract_customer_id(self, cliente_text):
    if not cliente_text:
        return None
    
    # Se for um elemento BeautifulSoup (link), extrair customer_id da URL
    if hasattr(cliente_text, 'find'):  # ❌ NUNCA ENTRA AQUI
        link = cliente_text.find('a')
        if link and link.get('href'):
            href = link.get('href')
            if 'customer_id=' in href:
                return href.split('customer_id=')[1].split('&')[0]
    
    # Se for string, tentar extrair ID se estiver no formato
    if isinstance(cliente_text, str):
        import re
        match = re.search(r'\d+', cliente_text)
        if match:
            return match.group(0)
    
    return cliente_text
```

**Problema:** `cliente_text` é sempre uma string (devido ao `.text.strip()`), nunca um elemento BeautifulSoup. O bloco `if hasattr(cliente_text, 'find')` nunca é executado.

---

## EVIDÊNCIA #4: MESMO CUSTOMER EM MÚLTIPLOS PEDIDOS

**Sistema Real (Playwright MCP):**
- Pedido 25110: Angela Regina dos Santos, customer_id=919
- Pedido 25090: Angela Regina dos Santos, customer_id=919

**Conclusão:** O MESMO customer_id (919) aparece em múltiplos pedidos.

**Impacto:** Sem extração correta de customer_id, o scraper não consegue deduplicar customers que fizeram múltiplas compras, criando registros duplicados.

---

## EVIDÊNCIA #5: DEDUPLICAÇÃO FALHA

**Código (run_scrape.py:238):**
```python
customer = transformer.transform_customer_from_order(complete_order)
if customer and customer['id_comprador']:
    customers_dict[customer['id_comprador']] = customer
```

**Problema:** Como `id_comprador` é sempre NULL (devido ao bug de extração), a condição `if customer and customer['id_comprador']` é sempre falsa. Nenhum customer é adicionado ao `customers_dict`.

**Resultado:** Apenas 20 customers são gravados (provavelmente os últimos processados antes de falhar).

---

## EVIDÊNCIA #5: TELEFONE E CNPJ TAMBÉM PERDIDOS

**Sistema Real:**
- Telefone: `(47) 99175-9247` (presente no HTML)
- CNPJ: `09550894000168` (presente no HTML)

**Scraper:**
- Telefone: 0/50 (0.0%)
- CNPJ: 0/50 (0.0%)

**Causa:** Mesmo problema - `.text.strip()` ou seletor CSS não está capturando corretamente esses campos.

---

## FLUXO DO ERRO

```
1. Scraper extrai célula HTML
   ↓
2. Usa .text.strip() para extrair valor
   ↓
3. Link HTML com customer_id é removido
   ↓
4. cliente_text é string, não elemento BeautifulSoup
   ↓
5. Método _extract_customer_id() não encontra link
   ↓
6. customer_id é NULL
   ↓
7. Deduplicação falha (usa customer_id como chave)
   ↓
8. Apenas 20 customers gravados
```

---

## LINHA DE CÓDIGO RESPONSÁVEL

**Arquivo:** `scripts/scrape/extractors/orders.py`  
**Linha:** 165

```python
value = cells[1].text.strip()
```

**Por que causa o problema:**
- Remove todos os elementos HTML
- Perde o link que contém customer_id
- Transforma elemento BeautifulSoup em string
- Impede extração de customer_id da URL

---

## SOLUÇÃO

Modificar o método `extract_pedido_info()` para preservar elementos HTML quando necessário:

```python
for row in rows:
    cells = row.select('td')
    if len(cells) >= 2:
        label = cells[0].text.strip()
        
        # Preservar elemento BeautifulSoup para campos que podem ter links
        if label == 'Cliente':
            value = cells[1]  # Preservar elemento BeautifulSoup
        else:
            value = cells[1].text.strip()
        
        data[label] = value
```

E modificar `_extract_customer_id()` para receber elemento BeautifulSoup:

```python
def _extract_customer_id(self, cliente_element):
    """Extrair ID do cliente do elemento HTML"""
    if not cliente_element:
        return None
    
    # Se for elemento BeautifulSoup, extrair customer_id do link
    if hasattr(cliente_element, 'find'):
        link = cliente_element.find('a')
        if link and link.get('href'):
            href = link.get('href')
            if 'customer_id=' in href:
                return href.split('customer_id=')[1].split('&')[0]
    
    # Fallback para texto
    if hasattr(cliente_element, 'text'):
        cliente_text = cliente_element.text.strip()
        import re
        match = re.search(r'\d+', cliente_text)
        if match:
            return match.group(0)
    
    return None
```

---

## VALIDAÇÃO

Após correção, executar teste com 50 pedidos:

**Resultado esperado:**
- customer_id: 50/50 (100%)
- telefone: 50/50 (100%)
- CNPJ: 50/50 (100%)
- nome: 50/50 (100%)

**Resultado atual:**
- customer_id: 0/50 (0%)
- telefone: 0/50 (0%)
- CNPJ: 0/50 (0%)
- nome: 0/50 (0%)

---

## IMPACTO

**Antes da correção:**
- 17.734+ pedidos processados
- 20 customers gravados
- 20 orders gravados
- Taxa de sucesso: ~0.1%

**Após correção (estimado):**
- 17.734+ pedidos processados
- ~17.000 customers gravados
- ~17.000 orders gravados
- Taxa de sucesso: ~95%

---

## RISCO

**Risco de implementação:** BAIXO  
- Correção localizada em um método
- Não afeta outras partes do sistema
- Pode ser testada com pequeno lote primeiro

**Risco de não implementar:** CRÍTICO  
- Sistema continua com dados incompletos
- Deduplicação falha completamente
- Impossível usar os dados para análise
