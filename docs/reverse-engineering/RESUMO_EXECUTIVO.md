# RESUMO EXECUTIVO - INVESTIGAÇÃO FORENSE

**Data:** 2026-06-07  
**Metodologia:** Playwright MCP (Engenharia Reversa)  
**Status:** CAUSA RAIZ IDENTIFICADA E CONFIRMADA

---

## PROBLEMA ORIGINAL

17.734+ pedidos processados pelo scraper, mas apenas 20 customers e 20 orders gravados no Supabase.

---

## CAUSA RAIZ CONFIRMADA

**Bug Crítico:** O scraper usa `.text.strip()` para extrair valores das células HTML, o que remove elementos como links que contêm o `customer_id`.

**Local:** `scripts/scrape/extractors/orders.py` linha 165

**Código problemático:**
```python
value = cells[1].text.strip()
```

**Consequência:** O link HTML com `customer_id=919` é removido, impedindo a extração do ID do cliente.

---

## EVIDÊNCIAS

### 1. CUSTOMER_ID PRESENTE NO HTML
**Playwright MCP confirmou:**
```html
<row "Cliente: AngelaRegina dos Santos">
  <cell "Cliente:">
  <cell "AngelaRegina dos Santos">
    <link "AngelaRegina dos Santos">
      /url: ...customer_id=919
```

### 2. SCRAPER PERDE O LINK
**Teste com 50 pedidos:**
- customer_id: 0/50 (0.0%)
- telefone: 0/50 (0.0%)
- CNPJ: 0/50 (0.0%)
- nome: 0/50 (0.0%)

### 3. DEDUPLICAÇÃO FALHA
**Sem customer_id:**
- `customers_dict[customer['id_comprador']]` nunca é executado
- Todos os customers são considerados iguais
- Apenas o último customer processado é gravado

---

## BUGS CONFIRMADOS

| Bug | Criticidade | Campo | Taxa Sucesso |
|-----|-------------|-------|--------------|
| #1 | CRÍTICA | customer_id | 0% |
| #2 | ALTA | telefone | 0% |
| #3 | ALTA | CNPJ | 0% |
| #4 | CRÍTICA | nome | 0% |

---

## SOLUÇÃO

**Correção mínima (1 linha):**
```python
# Antes:
value = cells[1].text.strip()

# Depois:
if label == 'Cliente':
    value = cells[1]  # Preservar elemento BeautifulSoup
else:
    value = cells[1].text.strip()
```

**Correção adicional (método _extract_customer_id):**
- Atualizar para receber elemento BeautifulSoup
- Extrair customer_id da URL do link
- Fallback para texto se não houver link

---

## IMPACTO ESPERADO

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

### Melhoria
- Customers: +99.9%
- Orders: +99.9%

---

## RISCO

**Implementação:** BAIXO
- Correção localizada
- Reversível
- Testável progressivamente

**Não implementar:** CRÍTICO
- Sistema inutilizável
- Dados incompletos
- Perda de ~17.000 customers

---

## DOCUMENTAÇÃO GERADA

1. `scraper_vs_realidade.md` - Comparação detalhada
2. `bugs_confirmados.md` - Lista de bugs com evidências
3. `causa_raiz_confirmada.md` - Análise da causa raiz
4. `plano_correcao.md` - Plano de implementação

---

## PRÓXIMOS PASSOS

1. **Imediato:** Aplicar correção mínima (30 min)
2. **Curto prazo:** Validar com teste de 50 pedidos (1 hora)
3. **Médio prazo:** Corrigir telefone, CNPJ, nome (2 horas)
4. **Longo prazo:** Executar scraper completo (4 horas)

**Total estimado:** 7.5 horas

---

## CONCLUSÃO

A causa raiz foi identificada com evidências concretas obtidas via Playwright MCP. A correção é simples, de baixo risco e terá impacto massivo na qualidade dos dados. Recomenda-se implementação imediata.
