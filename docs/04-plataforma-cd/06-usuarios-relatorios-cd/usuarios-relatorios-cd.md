# CD — Usuários, Relatórios e Resumo de Vendas

> **Tela principal:** Usuários com acesso à plataforma do CD, relatórios operacionais (vendas, produtos, estoque) e resumo de vendas por forma de pagamento.
>
> **URLs reais (token CD):**
> - Usuários: `/loja/admin/user/user?token={cd}`
> - Relatório Vendas vs Pedidos: `/report/sale_order?token={cd}`
> - Produtos mais vendidos: `/report/product_purchased?token={cd}`
> - Valor de estoque: `/report/product_purchased/valorEstoque?token={cd}`
> - Resumo de Vendas: `/report/... (resumo)` 
>
> **Fonte:** Treinamento Aula 4

---

## Usuários do CD

> **Aula 4:** *"Usuário, ó, ele consegue criar mais usuários para acesso a essa plataforma... vamos supor que ele tem lá o funcionário e ele quer dar permissão de acesso para a gestão do CD dele."*

```
1. Configurações ▸ Usuário (na plataforma CD)
2. [+ Adicionar]
3. Nome, e-mail, senha, habilitado
4. Grupo de permissão (Admin CD / Atendente)
5. Loja: (fixa = próprio CD)
6. [Salvar]
```

> **Papel típico:** Gerente CD (total) + Atendente de Balcão (pedidos, retirada, pagamento local).

---

## Relatórios do CD

> **Aula 4:** *"Tem um relatório de venda versus pedidos... ele consegue ver quantos pedidos foram feitos... Produtos mais vendidos, valor de estoque do produto... aqueles mesmos relatórios da indústria, só que para ele, uma versão para ele."*

| Relatório | Uso |
|-----------|-----|
| Vendas vs Pedidos | Volume do CD |
| Pedidos Detalhados | Auditoria por pedido |
| Produtos mais vendidos | Reposição, foco comercial |
| Valor de Estoque | Inventário financeiro do CD |
| Clientes × Pedidos | Recorrência local |
| Fretes / Devoluções | Logística do CD |

> **Importante:** Relatórios do CD são **escopo próprio** — mostram apenas dados do CD logado.

---

## Resumo de Vendas

> **Aula 4:** *"Resumo de vendas... ele consegue ver aqui, ó, pago com cada forma de pagamento, produtos, quantidade de produtos que já foram vendidos."*

| Indicador | Descrição |
|-----------|-----------|
| Valor por forma de pagamento | Bônus, balcão, cartão, boleto |
| Produtos vendidos | Qtd por item |
| Total do período | Consolidado |

---

## Regras de Negócio

| Regra | Detalhe |
|-------|---------|
| **Escopo próprio** | Usuário/relatórios do CD mostram só o próprio CD |
| **Atendente ≠ gerente** | Permissões separadas (balcão vs financeiro) |
| **Estoque não editável** | Relatório mostra, Matriz movimenta |
| **Fechamento por forma** | Consolidação de pagamentos do CD |

---

## URLs Relacionadas

| Ação | URL (token CD) |
|------|----------------|
| Usuários | `/user/user` |
| Grupos | `/user/user_permission` |
| Relatórios | `/report/sale_order` + `/report/product_purchased*` |

---

## Links Relacionados

- Permissões (matriz): [`../../06-referencia-tecnica/matriz-permissoes-por-papel.md`](../../06-referencia-tecnica/matriz-permissoes-por-papel.md)
- Financeiro CD: [`../04-financeiro-cd/saldo-bonus-compras.md`](../04-financeiro-cd/saldo-bonus-compras.md)

---

*Última atualização: 2025-08-11 | Baseado em Aula 4 + validação plataforma live*