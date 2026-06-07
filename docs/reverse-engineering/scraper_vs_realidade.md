# SCRAPER VS REALIDADE - COMPARAÇÃO FORENSE

**Data:** 2026-06-07  
**Investigação:** Playwright MCP  
**Objetivo:** Identificar discrepâncias entre o sistema real e o scraper

---

## EVIDÊNCIA CRÍTICA #1: CUSTOMER_ID

### SISTEMA REAL (Playwright MCP)
**Local:** Tab "Detalhes do pedido" (#tab-order)  
**HTML:**
```html
<row "Cliente: AngelaRegina dos Santos">
  <cell "Cliente:">
  <cell "AngelaRegina dos Santos">
    <link "AngelaRegina dos Santos">
      /url: https://allinbrasil.com.br/loja/admin/sale/customer/edit?token=...&customer_id=919
```

**Valor encontrado:** `customer_id=919` (presente na URL do link)

### SCRAPER (extractors/orders.py)
**Código (linha 174):**
```python
cliente_id=self._extract_customer_id(data.get('Cliente'))
```

**Método _extract_customer_id (linhas 465-486):**
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

**Resultado do teste:** 0/50 (0.0%)

### PROBLEMA IDENTIFICADO
O método `extract_pedido_info()` está usando `data.get('Cliente')` que retorna o **texto extraído da célula**, não o elemento BeautifulSoup.

**Código (linha 173):**
```python
cliente=data.get('Cliente')
```

Isso significa que `cliente_text` é uma string `"AngelaRegina dos Santos"`, não um elemento BeautifulSoup com o link.

**Consequência:** O código nunca entra no bloco `if hasattr(cliente_text, 'find')` porque `cliente_text` é uma string, não um elemento BeautifulSoup.

---

## EVIDÊNCIA CRÍTICA #2: TELEFONE

### SISTEMA REAL (Playwright MCP)
**Local:** Tab "Detalhes do pedido" (#tab-order)  
**HTML:**
```html
<row "Telefone: (47) 99175-9247">
  <cell "Telefone:">
  <cell "(47) 99175-9247">
```

**Valor encontrado:** `(47) 99175-9247`

### SCRAPER (extractors/orders.py)
**Código (linha 179):**
```python
telefone=data.get('Telefone')
```

**Resultado do teste:** 0/50 (0.0%)

### PROBLEMA IDENTIFICADO
O campo `Telefone` está presente no HTML, mas o scraper está retornando NULL.

**Possível causa:** O seletor CSS `table tbody tr td` pode não estar capturando corretamente a linha do telefone, ou o label "Telefone:" não está sendo reconhecido.

---

## EVIDÊNCIA CRÍTICA #3: CNPJ

### SISTEMA REAL (Playwright MCP)
**Local:** Tab "Detalhes do pedido" (#tab-order)  
**HTML:**
```html
<row "CNPJ: 09550894000168">
  <cell "CNPJ:">
  <cell "09550894000168">
```

**Valor encontrado:** `09550894000168`

### SCRAPER (extractors/orders.py)
**Código (linha 180):**
```python
cnpj=data.get('CNPJ')
```

**Resultado do teste:** 0/50 (0.0%)

### PROBLEMA IDENTIFICADO
O campo `CNPJ` está presente no HTML, mas o scraper está retornando NULL.

**Possível causa:** Mesmo problema do telefone - o seletor CSS ou o label não está sendo reconhecido.

---

## EVIDÊNCIA CRÍTICA #4: ESTRUTURA HTML

### SISTEMA REAL (Playwright MCP)
**Estrutura da tabela em #tab-order:**
```html
<table>
  <rowgroup>
    <row "Pedido nº: #25110">
    <row "Fatura nº: ...">
    <row "Loja: ...">
    <row "URL da loja: ...">
    <row "Cliente: AngelaRegina dos Santos">
      <cell "Cliente:">
      <cell "AngelaRegina dos Santos">
        <link "AngelaRegina dos Santos">
          /url: ...customer_id=919
    <row "Patrocinador ...">
    <row "Tipo de cliente ...">
    <row "E-mail ...">
    <row "Telefone: (47) 99175-9247">
    <row "CNPJ: 09550894000168">
    ...
  </rowgroup>
</table>
```

### SCRAPER (extractors/orders.py)
**Código (linhas 158-166):**
```python
rows = table.select('tr')
data = {}

for row in rows:
    cells = row.select('td')
    if len(cells) >= 2:
        label = cells[0].text.strip()
        value = cells[1].text.strip()
        data[label] = value
```

### PROBLEMA IDENTIFICADO
O scraper está usando `cells[1].text.strip()` para extrair o valor, o que **remove o link HTML**.

**Para o campo Cliente:**
- `cells[1].text.strip()` retorna: `"AngelaRegina dos Santos"` (apenas o texto)
- O link com `customer_id=919` é perdido

**Solução necessária:** Extrair o link da célula, não apenas o texto.

---

## TABELA RESUMO DE DISCREPÂNCIAS

| Campo | Sistema Real | Scraper | Taxa Sucesso | Impacto |
|-------|-------------|---------|--------------|---------|
| customer_id | Presente (919) | NULL | 0% | CRÍTICO |
| telefone | Presente ((47) 99175-9247) | NULL | 0% | ALTO |
| cpf/cnpj | Presente (09550894000168) | NULL | 0% | ALTO |
| email | Presente (emporium.af.itj@gmail.com) | Presente | 100% | OK |
| nome | Presente (AngelaRegina dos Santos) | NULL | 0% | CRÍTICO |

---

## CAUSA RAIZ IDENTIFICADA

**Problema principal:** O scraper está usando `.text.strip()` para extrair valores das células, o que remove elementos HTML como links que contêm informações críticas (customer_id).

**Código problemático (linha 165):**
```python
value = cells[1].text.strip()
```

**Consequências:**
1. Perda do customer_id (presente no link)
2. Possível perda de outros dados em links
3. Deduplicação de customers falha (usa customer_id como chave)
4. Apenas 20 customers gravados em vez de ~17.000

---

## RECOMENDAÇÃO IMEDIATA

Modificar o método `extract_pedido_info()` para:
1. Extrair o link da célula quando presente
2. Preservar elementos HTML para extração de IDs
3. Usar seletores mais específicos para campos críticos
