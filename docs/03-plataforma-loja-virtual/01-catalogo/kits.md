# Catálogo — Kits de Produtos (Loja Virtual)

> **Tela principal:** Produtos compostos — vários itens vendidos juntos como um só SKU (kits de adesão, combos, kits promocionais).
>
> **URL real:** `https://allinbrasil.com.br/loja/admin/catalog/kit`
> **Acesso:** Menu **Catálogo ▸ Kits de Produtos**
> **Fonte:** Treinamento Aula 2 + Aula 3

---

## Visão Geral

O **Kit de Produtos** agrupa produtos individuais em um único item de venda:

```
Kit Início Distribuidor - Bronze
├── Tênis Nike Shocks (1 un)
├── Meia Esportiva (3 pares)
├── Bolsa Térmica (1 un)
└── Preço do Kit: R$ 599 (vs R$ 750 individuais = ~20% off)
```

---

## Diferença: Kit de Produtos vs Plano de Adesão

| Aspecto | Kit de Produtos | Plano de Adesão |
|---------|-----------------|-----------------|
| Onde | Loja Virtual `/catalog/kit` | Maxnível `/Planos/Planos/principal` |
| Finalidade | Venda combo genérica | Adesão na rede (entrada/upgrade) |
| Vincula qualificação | ❌ | ✅ |
| Libera bônus | Por compra | Por adesão |
| Estoque | Soma dos componentes | Estoque próprio do plano |

> **Plano de Adesão** usa descrição/benefícios + estoque próprio. **Kit de Produtos** é a embalagem comercial na loja.

---

## Estrutura do Kit

| Campo | Descrição |
|-------|-----------|
| **Nome do Kit** | Ex: "Kit Início Distribuidor" |
| **Produtos do Kit** | Itens + quantidades |
| **Preço do Kit** | Preço do combo (vs soma dos itens) |
| **Desconto implícito** | Diferença kit vs soma |
| **Imagem** | Foto do conjunto |
| **Disponibilidade** | Lojas/CDs + tipo de comprador |
| **Estoque** | Controlado pela soma dos itens |
| **Status** | Habilitado/Desabilitado |

---

## Fluxo: Criar Kit

```
1. Catálogo ▸ Kits ▸ [+ Adicionar]
2. Nome: "Kit Início Distribuidor - Bronze"
3. Adicionar produtos componentes (com quantidade)
4. Preço do kit: R$ 599,00
5. Imagem do kit
6. Disponibilidade (Ligasões):
   ▸ Lojas/CDs desejados
   ▸ Tipo comprador (ex: Adesão Própria)
7. [Salvar]
```

---

## Regras de Negócio

| Regra | Detalhe |
|-------|---------|
| **Estoque do kit = soma dos itens** | Item esgotado → kit indisponível |
| **Baixa por componente** | Venda do kit dá baixa em cada item |
| **Preço kit ≠ soma** | Pode ser menor (combo) ou igual |
| **Liberação por loja/CD** | Igual a produto simples |

---

## URLs Relacionadas

| Ação | URL |
|------|-----|
| Kits | `/catalog/kit` |
| Produtos (componentes) | `/catalog/product` |
| Planos de adesão (Maxnível) | `/administracao/Planos/Planos/principal` |

---

## Links Relacionados

- Planos de adesão (diferença): [`../../02-plataforma-maxnivel/02-catalogos-planos/planos-adesao.md`](../../02-plataforma-maxnivel/02-catalogos-planos/planos-adesao.md)
- Produtos: [`produtos.md`](produtos.md)

---

*Última atualização: 2025-08-11 | Baseado em Aulas 2-3 + validação plataforma live*