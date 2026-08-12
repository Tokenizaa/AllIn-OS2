# Relatórios da Loja — Vendas, Fretes, Devoluções, Produtos, Clientes

> **Tela principal:** Conjunto de relatórios operacionais da loja virtual, com filtros por período e exportação.
>
> **URLs reais (base `/loja/admin/`):**
> - Pedidos: `/report/sale_order`
> - Pedidos Detalhados: `/report/sale_order_detalhado`
> - Fretes: `/report/sale_shipping`
> - Devoluções: `/report/sale_return`
> - Faturamento Detalhado: `/report/faturamento_detalhado`
> - Produtos Visualizados: `/report/product_viewed`
> - Produtos Vendidos: `/report/product_purchased` (+ por Opção: `produtosPorOpcao`)
> - Valor de Estoque: `/report/product_purchased/valorEstoque`
> - Estoque por Loja: `/report/product_purchased/estoquePorLoja`
> - Clientes × Pedidos: `/report/customer_order`
>
> **Acesso:** Menu **Relatórios ▸ ...**
> **Fonte:** Treinamento Aula 3

---

## Visão Geral

> **Aula 3:** *"Relatório de vendas versus pedidos, pedidos detalhados, relatório só de frete, relatório só de devolução, faturamento detalhado... Relatório de produtos, mais visualizados, mais vendidos, valor de estoque por produto... Relatório de clientes versus pedidos. Mostra quantos clientes, quantos pedidos cada cliente fez."*

Cada relatório:
- **Filtros** por período, loja, status (colapsáveis)
- **Detalhe** tabular + **totais**
- **Gráficos** (barras diárias/mensais em alguns)
- **Exportar** (PDF / XLS / CSV)

---

## Relatórios de Vendas

### Pedidos (`/report/sale_order`)
| Indicador | Descrição |
|-----------|-----------|
| Nº de Pedidos | Por período |
| Total de Vendas | Soma bruta |
| Pedidos por Status | Realizado / Pago / Despachado / Entregue / Cancelado |
| Ticket Médio | Vendas ÷ Pedidos |

**Uso:** Faturamento do dia/mês, performance por loja/CD.

### Pedidos Detalhados (`/report/sale_order_detalhado`)
- **Cada pedido** com itens individualizados
- Cliente, produto, quantidade, valor unitário, total
- **Uso:** Conferência de itens, auditoria, cálculo de comissão de produto

### Faturamento Detalhado (`/report/faturamento_detalhado`)
- Faturamento por forma de pagamento / por loja / por período
- **Uso:** Fechamento contábil, repasse por forma de pagamento

---

## Relatórios de Frete / Devolução

### Fretes (`/report/sale_shipping`)
| Indicador | Descrição |
|-----------|-----------|
| Total de Fretes | Valor cobrado |
| Fretes por Método | Correios / Transportadora / Retirada |
| Fretes por Região | Custo por região geográfica |

**Uso:** Negociação com transportadoras, custo logístico.

### Devoluções (`/report/sale_return`)
| Indicador | Descrição |
|-----------|-----------|
| Qtd Devoluções | Volume |
| Motivos | Retorno, defeito, arrependimento |
| Soluções | Crédito / Troca / Reenvio |
| Valor Devolvido | Impacto financeiro |

**Uso:** Qualidade do produto, política de troca, prejuízo.

---

## Relatórios de Produtos

### Produtos Visualizados (`/report/product_viewed`)
- **Views** por produto (ranking)
- **Uso:** Interesse de mercado, catálogo em destaque, SEO

### Produtos Vendidos (`/report/product_purchased`)
- Qtd vendida + valor por produto
- **Uso:** Best-sellers, reposição de estoque, margem por produto

### Vendidos por Opção (`/report/product_purchased/produtosPorOpcao`)
- Vendas por **variante** (tamanho/cor)
- **Uso:** Qual variação vende mais → ajustar grade

### Valor de Estoque do Produto (`/report/product_purchased/valorEstoque`)
> **Aula 3:** *"Valor de estoque por produto... teste um, R$ 100, eu tenho R$ 194 no estoque."*
- Valor monetário do estoque por produto (qtd × custo/preço)
- **Uso:** Inventário financeiro

### Estoque do Produto por Loja (`/report/product_purchased/estoquePorLoja`)
> **Aula 3:** *"Ele mostra aqui também por loja... se você tiver várias lojas, ele vai mostrar o que que tem de estoque em cada uma delas."*
- Estoque físico por loja/CD
- **Uso:** Alocação de remessas, transferência entre unidades

---

## Relatórios de Clientes

### Clientes × Pedidos (`/report/customer_order`)
> **Aula 3:** *"Mostra quantos clientes, quantos pedidos cada cliente fez."*
| Indicador | Descrição |
|-----------|-----------|
| Nº de Pedidos por Cliente | Recorrência |
| Total Comprado por Cliente | Valor acumulado |
| Última Compra | Churn/recorrência |

**Uso:** CRM, premiação de clientes, segmentação.

---

## Notas de Uso

| Relatório | Frequência sugerida | Tomada de decisão |
|-----------|--------------------|--------------------|
| Pedidos | Diária | Faturamento do dia |
| Faturamento Detalhado | Semanal | Repasse, fechamento |
| Fretes | Mensal | Custo logístico |
| Devoluções | Mensal | Satisfação/qualidade |
| Vendidos | Semanal | Reposição estoque |
| Valor Estoque | Mensal | Inventário financeiro |
| Clientes × Pedidos | Mensal | Recorrência, CRM |

---

## URLs Relacionadas

| Relatório | URL |
|-----------|-----|
| Pedidos | `/report/sale_order` |
| Pedidos Detalhados | `/report/sale_order_detalhado` |
| Fretes | `/report/sale_shipping` |
| Devoluções | `/report/sale_return` |
| Faturamento Detalhado | `/report/faturamento_detalhado` |
| Repescagem Asaas | `/report/repescagem_asaas` |
| Produtos Visualizados | `/report/product_viewed` |
| Produtos Vendidos | `/report/product_purchased` |
| Vendidos por Opção | `/report/product_purchased/produtosPorOpcao` |
| Valor Estoque | `/report/product_purchased/valorEstoque` |
| Estoque por Loja | `/report/product_purchased/estoquePorLoja` |
| Clientes × Pedidos | `/report/customer_order` |

---

## Links Relacionados

- Pedidos (admin): [`../02-vendas/pedidos.md`](../02-vendas/pedidos.md)
- Estoque (gestão): [`../01-catalogo/estoque.md`](../01-catalogo/estoque.md) ⏳
- Relatórios Maxnível: [`../../02-plataforma-maxnivel/05-relatorios-industria/README.md`](../../02-plataforma-maxnivel/05-relatorios-industria/README.md) ⏳

---

*Última atualização: 2025-08-11 | Baseado em Aula 3 + validação plataforma live*