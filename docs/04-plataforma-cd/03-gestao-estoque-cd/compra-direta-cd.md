# Estoque do CD — Compra Direta da Indústria (matriz)

> **Forma 2 de o CD obter estoque:** o CD compra produtos diretamente da indústria pelo fluxo "Comprar Produto", pagando (bônus, cartão ou boleto) — o estoque entra automaticamente ao pagar.
>
> **Fonte:** Treinamento Aula 4

---

## Visão Geral

```
┌──────────────┐  1. Comprar Produto    ┌────────────────┐
│   CD (Admin) │ ─────────────────────▶ │ Catálogo CD    │
└──────────────┘                        └────────────────┘
        │  2. Seleciona produto (só os LIBERADOS p/ este CD)
        ▼
┌──────────────────────┐
│ CARRINHO             │
│ • Produto originado   │
│   da Loja Maxnível   │
└──────────────────────┘
        │  3. Finalizar pedido + pagamento (bônus/cartão/boleto)
        ▼
┌──────────────────────┐
│ PEDIDO PAGO          │
│ → Estoque automaticamente no CD │
└──────────────────────┘
```

---

## Pré-condições (Checklist Antes de Comprar)

| # | Condição | Onde marcar |
|---|----------|-------------|
| 1 | Categoria liberada p/ o CD | `/catalog/category` → Editar → Lojas/CDs |
| 2 | Produto marcado p/ este CD | `/catalog/product` → Ligações → CD |
| 3 | Forma de pagamento "Centro Distribuição" | Produto → Ligações → Formas Pagamento |
| 4 | (Bônus) Saldo suficiente na conta CD | Financeiro → Transações |
| 5 | (Bônus) Forma "Bônus" marcada no produto | Produto → Ligações |

> **Aula 4:** *"Tá vendo que por enquanto tá só esse aqui disponível para ele? Por quê? Porque se aquele outro produto que a gente criou ontem... se eu quiser liberar para ele, eu tenho que vir aqui editar e marcar centro de distribuição... e também marcar aqui em ligações, CD Cuiabá, correto? Porque senão eu não libero para ele comprar."*

---

## Fluxo de Compra

> **Aula 4:** *"Ele vai clicar aqui, ó, comprar produto. Ele tá comprando da loja da indústria. Ele escolhe o produto... Coloquei o produto no carrinho... finalizar pedido... Ele pode pagar ou retirar na loja da indústria ou pagar com bônus... Confirma o pagamento, o pedido tá concluído... CD Cuiabá comprou R$ 100, pagou com bônus."*

### Passos (plataforma do CD)

```
1. Catálogo ▸ Produtos ▸ [Comprar Produto]
2. Selecionar produto (lista = somente liberados p/ este CD)
3. [Comprar] → carrinho
4. [Finalizar Pedido]
5. Endereço de Fatura / Entrega
6. Modo de entrega:
   ▸ Retirada na Loja (indústria) — se habilitado
   ▸ Frete — se habilitado
7. Método de pagamento:
   ▸ Bônus (saldo conta CD) — ex: R$ 100
   ▸ Cartão (PagSeguro) / Boleto BB
8. [Confirmar] → pedido concluído
9. ESTOQUE ENTRA AUTOMATICAMENTE no CD após pagamento
```

### Verificações pós-compra

| Onde | O que ver |
|------|-----------|
| CD ▸ Relatório Transações | ➖ débito do valor (se bônus) |
| Maxnível ▸ Vendas ▸ Pedidos | Pedido de compra do CD (pago) |
| CD ▸ Produtos ▸ Estoque | Qtd aumentada |

---

## Descontos na Compra do CD

> **Aula 4:** *"Ele compra preço cheio... você pode criar descontos pra compra do CD... o distribuidor compra com 50% de desconto (produto 100, paga 50). E o CD compra com 60% de desconto (produto 100, paga 40). E quando ele vende pro distribuidor a 50, ganhou R$ 10. Não tem como criar esses descontos, o senhor tem que entrar em contato com a gente pra configurar."*

| Perfil | Desconto (exemplo) | Produto R$ 100 |
|--------|--------------------|----------------|
| Cliente Final | 0% | paga R$ 100 |
| Distribuidor | 50% | paga R$ 50 |
| **CD** | **60%** | **paga R$ 40** |

> ⚠️ **Configuração exclusiva via suporte Maxível** — não alterar descontos CD/Dist sem orientação.

---

## Regras de Negócio

| Regra | Detalhe |
|-------|---------|
| **Estoque entra só após pagamento** | Pedido aberto não movimenta estoque |
| **Bônus exige saldo prévio** | Pedido criado sem saldo não recalcula — refazer (ver financeiro CD) |
| **Compra cheia ou com desconto** | Conforme regras de desconto configuradas |
| **Só produtos liberados** | Lista de compra = produtos com os 4 elos feitos |
| **CD nunca ajusta estoque manual** | Entrada automática ou remessa da indústria |

---

## Troubleshooting

| Sintoma | Causa | Solução |
|---------|-------|---------|
| Produto não aparece p/ comprar | Elos 1-3 não feitos (categoria/produto/pagamento) | Verificar checklist 4 pontos |
| Checkout trava "pagamento indisponível" | Forma "Centro Distribuição" desmarcada | Marcar no produto |
| Estoque não entra após compra | Pedido não pago | Confirmar/aguardar pagamento |
| Bônus não detectado | Saldo creditado após criar pedido | Refazer pedido |
| Valor cheio no checkout CD | Regra de desconto CD não configurada | Contatar suporte |

---

## URLs Relacionadas

| Ação | URL |
|------|-----|
| Produtos do CD (comprar) | `/loja/admin/catalog/product?token={cd}` |
| Pedidos do CD | `/loja/admin/sale/order?token={cd}` |
| Transações financeiras CD | `/loja/admin/finance/transacoes_financeiras?token={cd}` |
| Liberar produto p/ CD | `/loja/admin/catalog/product` (Ligações) |

---

## Links Relacionados

- Remessa da indústria (forma 1): [`remessa-industria.md`](remessa-industria.md)
- Vínculo categoria-produto-CD: [`../02-produtos-disponibilidade/vinculo-categoria-produto-cd.md`](../02-produtos-disponibilidade/vinculo-categoria-produto-cd.md)
- Saldo bônus e compras: [`../04-financeiro-cd/saldo-bonus-compras.md`](../04-financeiro-cd/saldo-bonus-compras.md)
- Descontos CD vs Distribuidor: [`../02-produtos-disponibilidade/descontos-cd-vs-distribuidor.md`](../02-produtos-disponibilidade/descontos-cd-vs-distribuidor.md) ⏳

---

*Última atualização: 2025-08-11 | Baseado em Aula 4 + validação plataforma live*