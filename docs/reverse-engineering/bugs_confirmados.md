# BUGS CONFIRMADOS - SCRAPER ALLINBRASIL

**Data:** 2026-06-07  
**Investigação:** Playwright MCP  
**Status:** CONFIRMADO COM EVIDÊNCIAS

---

## BUG #1: PERDA DE CUSTOMER_ID (CRÍTICO)

**Criticidade:** CRÍTICA  
**Impacto:** Deduplicação de customers falha completamente

### Evidência
**Sistema Real:**
- URL do link do cliente: `https://allinbrasil.com.br/loja/admin/sale/customer/edit?token=...&customer_id=919`
- customer_id=919 presente no HTML

**Scraper:**
- Resultado do teste: 0/50 (0.0%)
- Campo sempre NULL

### Código Responsável
**Arquivo:** `scripts/scrape/extractors/orders.py`  
**Linhas:** 158-166

```python
rows = table.select('tr')
data = {}

for row in rows:
    cells = row.select('td')
    if len(cells) >= 2:
        label = cells[0].text.strip()
        value = cells[1].text.strip()  # ❌ PROBLEMA: Remove link HTML
        data[label] = value
```

**Arquivo:** `scripts/scrape/extractors/orders.py`  
**Linhas:** 465-486

```python
def _extract_customer_id(self, cliente_text):
    """Extrair ID do cliente do texto do cliente (pode estar em um link)"""
    if not cliente_text:
        return None
    
    # Se for um elemento BeautifulSoup (link), extrair customer_id da URL
    if hasattr(cliente_text, 'find'):  # ❌ NUNCA ENTRA AQUI - cliente_text é string
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

### Causa Raiz
1. `cells[1].text.strip()` extrai apenas o texto, removendo o link HTML
2. `cliente_text` é sempre uma string, nunca um elemento BeautifulSoup
3. O bloco `if hasattr(cliente_text, 'find')` nunca é executado
4. O fallback regex `\d+` extrai números do nome do cliente, não do customer_id

### Consequência
- Deduplicação de customers usa `id_comprador` como chave
- Como `id_comprador` é sempre NULL, todos os customers são considerados iguais
- Apenas o último customer processado é gravado
- Resultado: 20 customers em vez de ~17.000

---

## BUG #2: PERDA DE TELEFONE (ALTO)

**Criticidade:** ALTA  
**Impacto:** Dados de contato incompletos

### Evidência
**Sistema Real:**
- Campo presente: `Telefone: (47) 99175-9247`
- Local: Tab "Detalhes do pedido" (#tab-order)

**Scraper:**
- Resultado do teste: 0/50 (0.0%)
- Campo sempre NULL

### Código Responsável
**Arquivo:** `scripts/scrape/extractors/orders.py`  
**Linha:** 179

```python
telefone=data.get('Telefone')
```

### Causa Raiz
Possível problema no seletor CSS ou no label "Telefone:" não sendo reconhecido corretamente.

### Consequência
- Dados de contato incompletos
- Impossibilidade de contato com customers

---

## BUG #3: PERDA DE CNPJ/CPF (ALTO)

**Criticidade:** ALTA  
**Impacto:** Dados fiscais incompletos

### Evidência
**Sistema Real:**
- Campo presente: `CNPJ: 09550894000168`
- Local: Tab "Detalhes do pedido" (#tab-order)

**Scraper:**
- Resultado do teste: 0/50 (0.0%)
- Campo sempre NULL

### Código Responsável
**Arquivo:** `scripts/scrape/extractors/orders.py`  
**Linha:** 180

```python
cnpj=data.get('CNPJ')
```

### Causa Raiz
Mesmo problema do telefone - seletor CSS ou label não sendo reconhecido.

### Consequência
- Dados fiscais incompletos
- Problemas com emissão de notas fiscais

---

## BUG #4: PERDA DE NOME DO CLIENTE (CRÍTICO)

**Criticidade:** CRÍTICA  
**Impacto:** Identificação de customers falha

### Evidência
**Sistema Real:**
- Campo presente: `Cliente: AngelaRegina dos Santos`

**Scraper:**
- Resultado do teste: 0/50 (0.0%)
- Campo sempre NULL

### Código Responsável
**Arquivo:** `scripts/scrape/extractors/orders.py`  
**Linha:** 173

```python
cliente=data.get('Cliente')
```

### Causa Raiz
Mesmo problema dos outros campos - label não sendo reconhecido.

### Consequência
- Customers sem nome
- Impossível identificar customers

---

## RESUMO DE IMPACTO

| Bug | Criticidade | Campos Afetados | Impacto no Sistema |
|-----|-------------|-----------------|-------------------|
| #1 | CRÍTICA | customer_id | Deduplicação falha - 20 customers em vez de ~17.000 |
| #2 | ALTA | telefone | Dados de contato incompletos |
| #3 | ALTA | cpf/cnpj | Dados fiscais incompletos |
| #4 | CRÍTICA | nome | Identificação de customers falha |

---

## CORREÇÃO NECESSÁRIA

**Prioridade 1 (Imediata):** Corrigir extração de customer_id
- Modificar para extrair link HTML da célula
- Preservar elemento BeautifulSoup para extração de customer_id

**Prioridade 2 (Curto prazo):** Corrigir extração de telefone, cpf, nome
- Investigar seletor CSS
- Validar labels
- Adicionar logs de debug

**Prioridade 3 (Médio prazo):** Adicionar validação
- Validar campos críticos antes de processar
- Alertar se customer_id estiver NULL
- Implementar retry com fallback
