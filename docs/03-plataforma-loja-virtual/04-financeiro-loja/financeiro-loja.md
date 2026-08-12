# Financeiro da Loja — Conta CD, Transações, Faturamento, Caixa

> **Tela principal:** Gestão financeira da loja virtual — contas de CD, solicitações de saque, relatório de transações, faturamento anual, fechamento de caixa.
>
> **URLs reais (base `/loja/admin/`):**
> - Cadastrar Conta CD: `/finance/cadastrar_conta_bancaria`
> - Solicitação de Saque: `/finance/solicitacao_saque`
> - Relatório das Transações: `/finance/transacoes_financeiras`
> - Faturamento Anual: `/finance/relatorio_faturamento`
> - Fechamento de Caixa: `/finance/fechamento_caixa`
>
> **Acesso:** Menu lateral **Financeiro ▸ ...**
> **Fonte:** Treinamento Aula 3

---

## Visão Geral

> **Aula 3:** *"Financeiro, cadastrar conta para CD... permite cadastrar a conta bancária pro CD solicitar saque... Relatório das transações exibe o registro de bônus que tem na conta CD... Relatório de fechamento de caixa... exibe por forma de pagamento... Relatório de faturamento anual é aquele idêntico ao da indústria."*

| Tela | Finalidade |
|------|-----------|
| **Cadastrar Conta CD** | Conta bancária p/ saque do CD |
| **Solicitação de Saque** | Saque do saldo CD |
| **Relatório das Transações** | Histórico de movimentações das contas CD |
| **Faturamento Anual** | Receita por mês da loja |
| **Fechamento de Caixa** | Valores por forma de pagamento |

---

## 1. Cadastrar Conta para CD

**URL:** `/finance/cadastrar_conta_bancaria`

> **Aula 3:** *"Permite você cadastrar a conta bancária para o CD solicitar saque... o CD tem R$ 1.000 de bônus, ele quer solicitar saque, então você pode cadastrar uma conta ou ele próprio pode cadastrar."*

```
1. Financeiro ▸ Cadastrar Conta Para CD
2. Selecionar banco
3. Dados: agência, digito, conta, titular
4. [Salvar]
```

> Pode ser feito pelo **admin loja** OU **pelo próprio CD logado**.

---

## 2. Solicitação de Saque (CD)

**URL:** `/finance/solicitacao_saque`

> **Fluxo completo:** [`04-plataforma-cd/04-financeiro-cd/solicitacao-saque-cd.md`](../../04-plataforma-cd/04-financeiro-cd/solicitacao-saque-cd.md)

- Requisita saque do saldo CD
- Respeita regra (valor mínimo, período) + taxa
- Exige senha + conta bancária

---

## 3. Relatório das Transações

**URL:** `/finance/transacoes_financeiras`

> **Aula 3:** *"Exibe o registro de bônus que tem na conta CD de todos os CDs... todos os registros de transação: recebimento de compra, pagamento de compra, solicitação de saque, movimentação feita pelo administrador do sistema. Aqui consegue filtrar."*

| Tipo de Transação | Exemplo |
|-------------------|---------|
| Recebimento de compra | ➕ Venda p/ distribuidor |
| Pagamento de compra | ➖ Compra da indústria |
| Solicitação de saque | ➖ Saque |
| Movimentação do admin | ➕/➖ Crédito/débito manual |

**Filtros:** Período, CD, tipo, valor.

---

## 4. Relatório de Faturamento Anual

**URL:** `/finance/relatorio_faturamento`

> **Aula 3:** *"É aquele idêntico ao da indústria... ele consegue ver o faturamento mensal."*

| Indicador | Descrição |
|-----------|-----------|
| Faturamento por mês | Jan–Dez |
| Por loja/CD | Filtro por unidade |
| Comparação anual | Evolução |

---

## 5. Fechamento de Caixa

**URL:** `/finance/fechamento_caixa`

> **Aula 3:** *"Exibe por forma de pagamento o que já foi pago... fazendo o fechamento."*

| Forma de Pagamento | Valor |
|--------------------|-------|
| Pago com Bônus | R$ X |
| Pago ao Retirar (balcão) | R$ Y |
| Cartão (PagSeguro) | R$ Z |
| **Total** | **R$ T** |

> **Dica (Aula 3):** Filtro padrão = **dia atual**. Limpar filtro para ver todos os registros.

---

## Regras de Negócio

| Regra | Detalhe |
|-------|---------|
| **Conta CD independente** | Conta bancária própria do CD p/ saque |
| **Transações auditáveis** | Todo tipo de movimentação registrado |
| **Faturamento mensal** | Comparável por ano |
| **Fechamento por forma** | Consolidação por método de pagamento |
| **Resgate com regra** | Saque CD limitado por regra/taxa |

---

## Troubleshooting

| Sintoma | Causa | Solução |
|---------|-------|---------|
| Fechamento de caixa vazio | Filtro "dia atual" sem vendas | Limpar filtro |
| Transação não aparece | Filtro de período/CD | Ajustar filtro |
| Saque CD bloqueado | Fora do período/mínimo | Aguardar/perguntar regra |

---

## Links Relacionados

- Financeiro CD (detalhe): [`../../04-plataforma-cd/04-financeiro-cd/saldo-bonus-compras.md`](../../04-plataforma-cd/04-financeiro-cd/saldo-bonus-compras.md)
- Saque CD: [`../../04-plataforma-cd/04-financeiro-cd/solicitacao-saque-cd.md`](../../04-plataforma-cd/04-financeiro-cd/solicitacao-saque-cd.md)

---

*Última atualização: 2025-08-11 | Baseado em Aula 3 + validação plataforma live*