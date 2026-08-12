# Vínculo Categoria–Produto–CD — Disponibilidade e Comercialização

> **Tela principal:** Como tornar um produto disponível para um CD comercializar — a hierarquia de vínculos (Categoria → Produto → Forma de Pagamento → Frete).
>
> **URLs envolvidas:**
> - Categoria: `https://allinbrasil.com.br/loja/admin/catalog/category`
> - Produto: `https://allinbrasil.com.br/loja/admin/catalog/product`
> - Fretes: `https://allinbrasil.com.br/loja/admin/extension/shipping`
> - Pagamentos: `https://allinbrasil.com.br/loja/admin/extension/payment`
>
> **Fonte:** Treinamento Aula 4 (checklist dos 4 pontos)

---

## Visão Geral

Para um **CD** conseguir comprar e comercializar um produto, é preciso uma **cadeia de vínculos**. Se qualquer elo faltar, o produto não aparece ou o checkout falha.

```
┌────────────────────────────────────────────────────────────────┐
│ 1. CATEGORIA disponível p/ CD                                  │
│    /catalog/category → Editar → Lojas/CDs → ✅ CD Cuiabá      │
│                        (gate principal — sem isso, nada passa) │
└──────────────────────────┬─────────────────────────────────────┘
                           ▼
┌────────────────────────────────────────────────────────────────┐
│ 2. PRODUTO disponível p/ CD                                    │
│    /catalog/product → Editar → Ligações → ✅ CD Cuiabá        │
│        + Tipo Comprador: ✅ CD (Centro de Distribuição)        │
└──────────────────────────┬─────────────────────────────────────┘
                           ▼
┌────────────────────────────────────────────────────────────────┐
│ 3. FORMA DE PAGAMENTO "Centro de Distribuição" no produto      │
│    Produto → Ligações → Formas Pagamento → ✅ Centro Distrib.  │
│        (+ ✅ Bônus, se pagar com bônus)                        │
└──────────────────────────┬─────────────────────────────────────┘
                           ▼
┌────────────────────────────────────────────────────────────────┐
│ 4. FRETE "Retirada no CD" habilitado p/ o CD                   │
│    /extension/shipping → Retirada na Loja → ✅ CD Cuiabá      │
│        (para distribuidores retirarem no balcão)               │
└────────────────────────────────────────────────────────────────┘
```

> **Aula 4:** *"Quatro coisas que toda vez que você criar um CD, você precisa se atentar."* — Este documento detalha cada uma.

---

## Elo 1 — Categoria Disponível para o CD

> **Aula 4:** *"Primeiro, atrelar o departamento ao CD... Qual categoria cada CD pode comercializar? Se eu quiser que o CD de Cuiabá comercialize essa categoria, eu tenho que vir aqui na guia de dados e marcar CD Cuiabá."*

**Tela:** Catálogo ▸ Departamentos ▸ Editar categoria ▸ Aba Disponibilidade

| Checkbox | Efeito |
|----------|--------|
| **Loja Padrão** | Categoria no e-commerce matriz |
| **CD Cuiabá / CD Goiânia / ...** | Categoria liberada p/ comercialização nesse CD |

> ⚠️ **Gate principal:** Categoria é o filtro mestre. Produto sem categoria liberada NÃO aparece no CD, mesmo se o produto estiver marcado.

---

## Elo 2 — Produto Disponível para o CD

> **Aula 4:** *"Segunda questão importante, no produto, no cadastro do produto, eu tenho que liberar ele pro CD... para ele conseguir comprar da indústria e comercializar."*

**Tela:** Catálogo ▸ Produtos ▸ Editar produto ▸ Aba Ligações/Filtros

| Campo | Valor necessário |
|-------|------------------|
| **Lojas/CDs** | ✅ CD Cuiabá (onde o produto será vendido) |
| **Tipo de Comprador** | ✅ CD (Centro de Distribuição) |
| **Categorias** | Categoria que já está liberada (Elo 1) |

---

## Elo 3 — Forma de Pagamento "Centro de Distribuição"

> **Aula 4:** *"Na guia de filtros, se o CD puder comprar esse produto da indústria utilizando o cartão de crédito, boleto, a forma de pagamento que você disponibilizar, aqui tem que tá marcado, ó, centro de distribuição, porque se não tiver marcado, ele não consegue comprar da indústria."*

**Tela:** Produto ▸ Aba Ligações ▸ Formas de Pagamento

| Checkbox | Uso |
|----------|-----|
| **Centro de Distribuição** | ⭐ OBRIGATÓRIO — permite CD comprar da indústria |
| **Bônus** | Se CD pode pagar com saldo bônus |
| **Cartão (PagSeguro)** | Se CD pode pagar no cartão |
| **Boleto** | Se CD pode pagar via boleto |

> ⚠️ **Sintoma clássico:** Checkout do CD trava com "forma de pagamento indisponível" = este checkbox desmarcado.

---

## Elo 4 — Frete "Retirada no CD"

> **Aula 4:** *"Quando você cria um novo CD, você tem que atrelar ele à forma de frete retirada no CD, caso você permita que os seus distribuidores vão até o CD para retirar o produto."*

**Tela:** Extensões ▸ Fretes ▸ "Retirada na Loja" ▸ Editar

| Campo | Valor |
|-------|-------|
| **Situação** | Habilitado |
| **Região Geográfica** | Região do CD |
| **Lojas/CDs habilitados** | ✅ CD Cuiabá |
| **Tipo de Cliente** | Cliente Final, Distribuidor, CD |

> **Efeito:** Distribuidor vê "Retirar no CD ▸ CD Cuiabá" no checkout → frete zero → busca no balcão.

---

## Fluxo de Verificação (Diagnóstico Rápido)

Quando um produto "não funciona no CD", confira os 4 elos em ordem:

```
1. Categoria liberada p/ CD?   → /catalog/category
   ❌ → Produto some de TODO o CD
2. Produto liberado p/ CD?     → /catalog/product (Ligações)
   ❌ → CD não vê o produto
3. Forma "Centro Distribuição"? → Produto (Formas Pagamento)
   ❌ → Checkout CD trava
4. Frete retirada habilitado?  → /extension/shipping
   ❌ → Distribuidor não retira no CD
```

---

## Regras de Negócio

| Regra | Detalhe |
|-------|---------|
| **Hierarquia estrita** | Categoria → Produto → Pagamento → Frete (ordem importa) |
| **Categoria = gate mestre** | Nada passa sem categoria liberada |
| **Forma "Centro Distribuição" = obrigatória** | Sem ela, CD não compra da indústria |
| **Frete retirada por CD** | Cada CD precisa ser marcado individualmente |
| **Desconto CD vs Dist** | 60% CD / 50% Dist (exemplo) — config via suporte |

---

## URLs Relacionadas

| Ação | URL |
|------|-----|
| Categorias | `/catalog/category` |
| Produtos | `/catalog/product` |
| Fretes | `/extension/shipping` |
| Pagamentos | `/extension/payment` |
| Habilitar Produtos (Maxnível) | `/administracao/Loja/HabilitarProdutosLoja/principal` |

---

## Links Relacionados

- Guia rápido criar CD (checklist 4 pontos): [`../../05-guias-rapidos/criar-cd-passo-a-passo.md`](../../05-guias-rapidos/criar-cd-passo-a-passo.md)
- Acesso/configuração CD: [`../01-acesso-configuracao-inicial.md`](../01-acesso-configuracao-inicial.md)
- Produtos (Ligações/Filtros): [`../../03-plataforma-loja-virtual/01-catalogo/produtos.md`](../../03-plataforma-loja-virtual/01-catalogo/produtos.md)

---

*Última atualização: 2025-08-11 | Baseado em Aula 4 + validação plataforma live*