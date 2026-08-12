# Guia Rápido: Fluxo de Saque do CD

> **Para:** Gerente de CD (solicita) + Admin Maxnível (aprova)
> **Tempo:** ~5 min por saque
> **Fonte:** Treinamento Aula 4

---

## Pré-requisitos (uma vez)

| # | Requisito | Onde |
|---|-----------|------|
| 1 | Regra de saque configurada (mínimo, período) | Maxnível ▸ Configurações ▸ Módulos ▸ Solicitação de Saque de CD |
| 2 | Taxa de saque (opcional) | Mesmo módulo ▸ Taxas |
| 3 | Conta bancária do CD cadastrada | Loja ▸ Financeiro ▸ Cadastrar Conta Para CD |
| 4 | Saldo CD disponível | Relatório de Transações |

---

## Fluxo Rápido

```
CD (Loja Admin):
1. Financeiro ▸ Solicitação de Saque
2. Valor (≥ mínimo, dentro do período)
3. Tela: Bruto − Taxa = Líquido
4. Selecionar conta bancária
5. Digitar senha → [Requisitar]
   → Saldo debitado na hora

Maxnível (Admin):
6. Relatórios ▸ Solicitação de Saque CD
   URL: /SolicitacaoSaqueCd/SolicitacaoSaqueCdTransacoesAdmin/listar
7. Ver pedido (CD, valor, taxa, líquido, conta)
8. DEPOSITAR na conta do CD (fora do sistema)
9. [Marcar como depositado]
10. ✅ Ciclo encerrado
```

---

## Regras de Bolso

| Regra | Detalhe |
|-------|---------|
| Valor mínimo | Exemplo: R$ 100 |
| Período de solicitação | Ex: dia 20–25 |
| Período de pagamento | Ex: dia 1–5 |
| Taxa | Ex: 5% → R$ 100 = R$ 95 líquido |
| Senha obrigatória | Autenticação da requisição |
| Depósito externo | Matriz deposita e marca |

---

## Erros Comuns

| Sintoma | Solução |
|---------|---------|
| "Fora do período" | Aguardar janela de solicitação |
| "Abaixo do mínimo" | Solicitar valor ≥ mínimo |
| Conta não aparece | Cadastrar conta bancária primeiro |
| Saldo não debita | Finalizar requisição com senha |
| Pedido parado | Matriz não depositou/marcou |

---

## URLs

| Ação | URL |
|------|-----|
| Solicitar saque (CD) | `/loja/admin/finance/solicitacao_saque` |
| Cadastrar conta (CD) | `/loja/admin/finance/cadastrar_conta_bancaria` |
| Aprovar (Maxnível) | `/administracao/SolicitacaoSaqueCd/SolicitacaoSaqueCdTransacoesAdmin/listar` |

---

## Detalhe

[`04-plataforma-cd/04-financeiro-cd/solicitacao-saque-cd.md`](../04-plataforma-cd/04-financeiro-cd/solicitacao-saque-cd.md)