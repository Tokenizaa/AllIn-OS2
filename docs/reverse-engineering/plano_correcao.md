# PLANO DE CORREÇÃO

**Data:** 2026-06-07  
**Baseado em:** Investigação forense com Playwright MCP  
**Status:** PRONTO PARA IMPLEMENTAÇÃO

---

## CORREÇÃO MÍNIMA (PRIORIDADE CRÍTICA)

### Objetivo
Corrigir extração de customer_id para restaurar deduplicação de customers.

### Arquivo
`scripts/scrape/extractors/orders.py`

### Mudança 1: Modificar extract_pedido_info() (linhas 158-166)

**Código atual:**
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

**Código corrigido:**
```python
rows = table.select('tr')
data = {}

for row in rows:
    cells = row.select('td')
    if len(cells) >= 2:
        label = cells[0].text.strip()
        
        # Preservar elemento BeautifulSoup para campos que podem ter links
        if label == 'Cliente':
            value = cells[1]  # Preservar elemento BeautifulSoup para extrair customer_id
        else:
            value = cells[1].text.strip()
        
        data[label] = value
```

### Mudança 2: Modificar _extract_customer_id() (linhas 465-486)

**Código atual:**
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
        import re
        match = re.search(r'\d+', cliente_text)
        if match:
            return match.group(0)
    
    return cliente_text
```

**Código corrigido:**
```python
def _extract_customer_id(self, cliente_element):
    """Extrair ID do cliente do elemento HTML (pode estar em um link)"""
    if not cliente_element:
        return None
    
    # Se for elemento BeautifulSoup, extrair customer_id do link
    if hasattr(cliente_element, 'find'):
        link = cliente_element.find('a')
        if link and link.get('href'):
            href = link.get('href')
            if 'customer_id=' in href:
                return href.split('customer_id=')[1].split('&')[0]
    
    # Fallback: extrair do texto se elemento não tiver link
    if hasattr(cliente_element, 'text'):
        cliente_text = cliente_element.text.strip()
        import re
        match = re.search(r'\d+', cliente_text)
        if match:
            return match.group(0)
    
    return None
```

### Mudança 3: Atualizar chamada do método (linha 174)

**Código atual:**
```python
cliente_id=self._extract_customer_id(data.get('Cliente'))
```

**Código corrigido:**
```python
cliente_id=self._extract_customer_id(data.get('Cliente'))
```

*Nota: A chamada permanece a mesma, mas agora `data.get('Cliente')` é um elemento BeautifulSoup, não uma string.*

---

## CORREÇÃO ADICIONAL (PRIORIDADE ALTA)

### Objetivo
Corrigir extração de telefone, CNPJ e nome.

### Investigação necessária
Verificar por que `data.get('Telefone')`, `data.get('CNPJ')`, e `data.get('Cliente')` estão retornando NULL.

### Possíveis causas
1. Label exato não corresponde (ex: "Telefone:" vs "Telefone")
2. Seletor CSS não está capturando todas as linhas
3. Estrutura HTML diferente entre pedidos

### Ação recomendada
Adicionar logs de debug em `extract_pedido_info()`:

```python
for row in rows:
    cells = row.select('td')
    if len(cells) >= 2:
        label = cells[0].text.strip()
        value = cells[1].text.strip()
        data[label] = value
        print(f"DEBUG: label='{label}', value='{value}'")  # Adicionar log
```

Executar teste com 10 pedidos e analisar logs.

---

## PLANO DE TESTE

### Teste 1: Validação da correção mínima
**Objetivo:** Confirmar que customer_id é extraído corretamente.

**Passos:**
1. Aplicar correção mínima
2. Executar `test_extraction.py` com 50 pedidos
3. Verificar resultado esperado:
   - customer_id: 50/50 (100%)
   - nome: 50/50 (100%)

**Critério de sucesso:** customer_id >= 90%

### Teste 2: Validação de deduplicação
**Objetivo:** Confirmar que deduplicação funciona.

**Passos:**
1. Executar scraper com 100 pedidos
2. Verificar número de customers únicos gravados
3. Comparar com número de pedidos

**Critério de sucesso:** customers únicos >= 90% de pedidos

### Teste 3: Validação completa
**Objetivo:** Confirmar que todos os campos são extraídos.

**Passos:**
1. Aplicar correções adicionais (telefone, CNPJ, nome)
2. Executar scraper com 500 pedidos
3. Verificar todos os campos críticos

**Critério de sucesso:** Todos os campos críticos >= 90%

---

## RISCO ESTIMADO

### Risco de implementação: BAIXO
- Correção localizada em um método
- Não afeta outras partes do sistema
- Pode ser revertida facilmente
- Teste progressivo possível

### Risco de não implementar: CRÍTICO
- Sistema continua com dados incompletos
- Deduplicação falha completamente
- Impossível usar dados para análise
- Perda de ~17.000 customers

---

## ESTIMATIVA DE IMPACTO

### Antes da correção
- Pedidos processados: 17.734+
- Customers gravados: 20
- Orders gravados: 20
- Taxa de sucesso: ~0.1%

### Após correção (estimado)
- Pedidos processados: 17.734+
- Customers gravados: ~17.000
- Orders gravados: ~17.000
- Taxa de sucesso: ~95%

### Melhoria esperada
- Customers: +99.9%
- Orders: +99.9%
- Dados utilizáveis: Sim

---

## CRONOGRAMA

### Fase 1: Implementação (30 minutos)
- Aplicar correção mínima
- Adicionar logs de debug
- Testar localmente

### Fase 2: Validação (1 hora)
- Executar teste com 50 pedidos
- Analisar logs
- Validar customer_id

### Fase 3: Correções adicionais (2 horas)
- Investigar telefone, CNPJ, nome
- Aplicar correções
- Testar com 500 pedidos

### Fase 4: Execução completa (4 horas)
- Executar scraper completo
- Monitorar logs
- Validar resultados

**Total estimado:** 7.5 horas

---

## ROLLBACK PLAN

Se correção causar problemas:
1. Reverter para versão anterior do arquivo
2. Reexecutar teste para confirmar comportamento anterior
3. Investigar causa do problema
4. Implementar correção alternativa

---

## PRÓXIMOS PASSOS

1. **Imediato:** Aplicar correção mínima
2. **Curto prazo:** Validar com teste de 50 pedidos
3. **Médio prazo:** Corrigir telefone, CNPJ, nome
4. **Longo prazo:** Executar scraper completo
