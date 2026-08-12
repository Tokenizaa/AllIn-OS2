# Guia Rápido: Cadastrar Produto e Liberar para CD

> **Para:** Operador de Catálogo / Admin Loja
> **Tempo:** ~10 min
> **Fonte:** Treinamento Aula 3 + Aula 4

---

## Parte 1 — Cadastrar Produto

**URL:** `/loja/admin/catalog/product` ▸ [+ Novo]

### Campos essenciais

| Aba | Campo | Exemplo |
|-----|-------|---------|
| **Dados** | Nome | Tênis Nike Shocks Masculino |
| | SKU/Modelo | N-SHOCKS-001 |
| | Fabricante | Nike (criar em `/catalog/manufacturer`) |
| | Categoria | Tênis > Masculino |
| | **Preço Cheio** | R$ 450,00 ⭐ |
| | Controlar Estoque | Sim |
| | Situação sem estoque | 2–3 dias |
| | Peso/Dimensões | 0,850 kg · 35×15×15 cm |
| | NCM/CST | 64041100 / 00 |
| | Imagem | 1200×1200 (zoom) |
| **SEO** | Meta Title/Desc | p/ Google |
| **Opções** | Tamanho/Cor | Grade de variantes + estoque por célula |
| **Ligações** | Formas Pagamento | conforme abaixo |

> ⭐ **Regra de ouro:** sempre **preço cheio**. Sistema aplica desconto por perfil (Cliente Final 0%, Distribuidor 50%, CD 60%).

---

## Parte 2 — Liberar para o CD (4 Elos)

```
┌─────────────────────────────────────────────────────────┐
│ 1. CATEGORIA ▸ /catalog/category ▸ Editar ▸ Lojas/CDs   │
│    ✅ Marcar CD Cuiabá                                  │
├─────────────────────────────────────────────────────────┤
│ 2. PRODUTO ▸ /catalog/product ▸ Ligações ▸ Lojas/CDs    │
│    ✅ CD Cuiabá + Tipo Comprador: ✅ CD                  │
├─────────────────────────────────────────────────────────┤
│ 3. PRODUTO ▸ Ligações ▸ Formas de Pagamento             │
│    ✅ Centro de Distribuição ⭐ (obrigatório)            │
│    ✅ Bônus (se CD paga com saldo)                       │
├─────────────────────────────────────────────────────────┤
│ 4. FRETE ▸ /extension/shipping ▸ Retirada na Loja ▸ CD  │
│    ✅ Marcar CD Cuiabá                                  │
└─────────────────────────────────────────────────────────┘
```

---

## Teste Rápido (pós-liberação)

```
1. Janela anônima → {dominio}/loja/admin → login CD
2. Catálogo ▸ Produtos → produto aparece?
3. Comprar Produto → checkout finaliza?
4. Loja pública → "Retirar no CD" aparece?
```

---

## Erros Comuns

| Sintoma | Elo quebrado |
|---------|--------------|
| Produto some do CD | Elo 1 (categoria) ou 2 (produto) |
| Checkout trava | Elo 3 (forma "Centro Distribuição") |
| Sem "Retirar no CD" | Elo 4 (frete retirada) |

---

## Detalhe

[`04-plataforma-cd/02-produtos-disponibilidade/vinculo-categoria-produto-cd.md`](../04-plataforma-cd/02-produtos-disponibilidade/vinculo-categoria-produto-cd.md)