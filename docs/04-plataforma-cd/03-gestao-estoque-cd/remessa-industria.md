# Estoque do CD — Remessa da Indústria (matriz)

> **Forma 1 de o CD obter estoque:** a indústria envia uma remessa de produtos ao CD, o CD paga (boleto/duplicata), a indústria reconhece o pagamento e lança o estoque no CD.
>
> **URL (Maxnível):** `https://allinbrasil.com.br/administracao/Estoque/MovimentacaoEstoque/principal`
> **Fonte:** Treinamento Aula 4

---

## Visão Geral

Existem **duas formas** de um CD obter estoque:

| Forma | Quem inicia | Como |
|-------|-------------|------|
| **Remessa (este doc)** | Matriz | Envia produtos → CD paga → Matriz lança estoque |
| **Compra direta** | CD | CD compra da indústria via "Comprar Produto" |

> **Aula 4:** *"Existem duas formas de um CD obter estoque de produtos. Ou a empresa cria uma remessa de produtos e envia pro CD... Ou ele comprando da indústria."*

---

## Fluxo Completo da Remessa

> **Aula 4:** *"Eu peguei um lote de R$ 20.000 em tênis e mandei lá para o CD de Goiânia. O CD recebeu, foi lá e pagou o boleto/duplicata e eu reconheci o pagamento. Quando eu reconhecer o pagamento, eu venho aqui no menu de produtos, clico no produto que eu coloquei de estoque para ele, e lanço: 'CD Cuiabá, eu enviei 100 pares de tênis para ele'. Dou OK. Agora alimentou na tabela que o CD de Cuiabá tem 100 unidades no stock... Agora ele consegue comercializar."*

### Passos

```
ETAPA 1 — Matriz envia (venda de remessa):
1. Matriz vende/envia lote ao CD (R$ 20.000 em tênis)
2. Cria pedido de remessa / nota para o CD

ETAPA 2 — CD paga:
3. CD recebe a mercadoria
4. CD paga o boleto / duplicata
5. Pagamento compensa

ETAPA 3 — Maxnível RECONHECE o pagamento:
6. Admin Maxnível ▸ Vendas ▸ Pedidos ▸ pedido de remessa
7. [Reconhecer/Confirmar pagamento]

ETAPA 4 — Maxnível LANÇA o estoque no CD:
8. Menu Produtos (Maxnível) ▸ produto ▸ lançar estoque
9. Destino: CD Cuiabá
10. Quantidade: 100 pares
11. [OK]
12. → Tabela do CD atualizada: 100 unidades

ETAPA 5 — CD visualiza:
13. Plataforma CD atualizada → produto com 100 unidades
14. CD pode comercializar ✅
```

---

## Regras de Negócio

| Regra | Detalhe |
|-------|---------|
| **Estoque segue PAGAMENTO reconhecido** | Sem reconhecer pagamento, sem lançar estoque |
| **Lançamento é manual (Maxnível)** | Admin informa CD + quantidade |
| **CD não alimenta estoque** | CD só visualiza — entrada/saída exclusiva da Indústria (matriz) |
| **Por produto** | Lançamento é feito produto a produto (ou via grade) |
| **Estoque CD por loja** | Relatório "Estoque produto por loja" mostra o CD |

---

## URLs Relacionadas

| Ação | URL |
|------|-----|
| Movimentar Estoque (Maxnível) | `/administracao/Estoque/MovimentacaoEstoque/principal` |
| Relatório Estoque | `/administracao/Estoque/RelatorioEstoque/principal` |
| Estoque por Loja (relatório) | `/administracao/Estoque/RelatorioEstoqueProdutoPorLoja/principal` |
| Estoque CD (visualização) | `/loja/admin/catalog/product?token={cd}` (coluna estoque) |

---

## Troubleshooting

| Sintoma | Causa | Solução |
|---------|-------|---------|
| CD recebeu mercadoria mas estoque zerado | Pagamento não reconhecido / estoque não lançado | Reconhecer pagamento + lançar estoque |
| Estoque lançado errado (CD errado) | Seleção incorreta no lançamento | Ajustar via nova movimentação |
| CD compra mas estoque não entra | Pedido não pago | Confirmar pagamento do pedido do CD |

---

## Links Relacionados

- Compra direta do CD: [`compra-direta-cd.md`](compra-direta-cd.md)
- Fonte do fluxo (aula 4): [`../../../07-anexos/mapeamento-treinamento-telas.md`](../../../07-anexos/mapeamento-treinamento-telas.md)

---

*Última atualização: 2025-08-11 | Baseado em Aula 4 + validação plataforma live*