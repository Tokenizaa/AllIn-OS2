# CD — Solicitação de Saque: Regras, Taxas e Fluxo Completo

> **Tela principal:** Saque do saldo da conta CD — regras (valor mínimo, período), taxas, criação de conta bancária e aprovação pela Maxnível.
>
> **URLs reais:**
> - Cadastrar Conta CD: `/loja/admin/finance/cadastrar_conta_bancaria`
> - Solicitar Saque (CD): `/loja/admin/finance/solicitacao_saque`
> - Aprovar saque (Maxnível): `/administracao/SolicitacaoSaqueCd/SolicitacaoSaqueCdTransacoesAdmin/listar`
> - Regra/Taxa (Maxnível): `Configurações ▸ Módulos ▸ "Solicitação de Saque de CD"`
>
> **Fonte:** Treinamento Aula 4

---

## Visão Geral

```
┌────────────────────────────────────────────────────────────────┐
│ 1. INDÚSTRIA: define REGRA + TAXA do saque CD                  │
│    • Valor mínimo (ex: R$ 100)                                 │
│    • Período de solicitação (ex: dia 20 a 25)                  │
│    • Período de pagamento (ex: dia 1 a 5)                      │
│    • Taxa (ex: 5%)                                             │
└──────────────────────────┬─────────────────────────────────────┘
                           ▼
┌────────────────────────────────────────────────────────────────┐
│ 2. CD: cadastra CONTA BANCÁRIA                                 │
│    Financeiro ▸ Cadastrar Conta Para CD ▸ banco + dados         │
└──────────────────────────┬─────────────────────────────────────┘
                           ▼
┌────────────────────────────────────────────────────────────────┐
│ 3. CD: SOLICITA saque (dentro do período)                      │
│    Financeiro ▸ Solicitação de Saque ▸ valor + conta + senha    │
│    → Sistema debita + taxa → pedido vai p/ Maxnível            │
└──────────────────────────┬─────────────────────────────────────┘
                           ▼
┌────────────────────────────────────────────────────────────────┐
│ 4. INDÚSTRIA: aprova (depósito bancário externo)               │
│    Relatórios ▸ Solicitação de Saque CD ▸ marca "depositado"    │
└────────────────────────────────────────────────────────────────┘
```

---

## Passo 1 — Criar Regra de Saque (Maxnível)

> **Aula 4:** *"Tem que criar uma regra de saque lá na indústria... configurações ▸ módulos ▸ solicitação de saque de CD... valor mínimo, vamos colocar R$ 100 como valor mínimo... período... do dia 20 ao dia 25... pagamento do dia 1 ao dia 5."*

```
1. Admin Maxnível ▸ Configurações ▸ Módulos
2. Buscar módulo: "Solicitação de Saque de CD"
3. [Editar] regra:
   ▸ Valor mínimo: R$ 100,00
   ▸ Período de solicitação: de [20] a [25] (dia do mês)
   ▸ Período de pagamento: de [1] a [5] (dia do mês)
4. [Salvar]
```

| Parâmetro | Exemplo | Efeito |
|-----------|---------|--------|
| Valor mínimo | R$ 100 | Saques abaixo são bloqueados |
| Período solicitação | 20–25 | Só pode solicitar nesses dias |
| Período pagamento | 1–5 | Janela em que a Matriz paga |

---

## Passo 2 — Criar Taxa de Saque (Opcional)

> **Aula 4:** *"Eu posso também criar taxas de saque para CD... adicionar... taxa de saque, valor... vou colocar percentual... 5% do valor do pedido e salvo."*

```
1. No mesmo módulo ▸ [Adicionar taxa]
2. Tipo: Percentual
3. Valor: 5%
4. [Salvar]
```

| Tipo de taxa | Exemplo | Cálculo |
|--------------|---------|---------|
| **Percentual** | 5% | Saque R$ 100 → taxa R$ 5 → líquido R$ 95 |
| **Fixa** | R$ 2 | Saque R$ 100 → líquido R$ 98 |

---

## Passo 3 — Cadastrar Conta Bancária do CD

> **Aula 3:** *"Cadastrar conta para CD seria para ele próprio cadastrar a conta bancária para solicitar saque... vem cá, seleciona o banco e preenche o formulário com os dados da conta dele. Clicou em salvar, criou a conta bancária."*

**URL:** `/finance/cadastrar_conta_bancaria`

```
1. Financeiro ▸ Cadastrar Conta Para CD
2. Selecionar Banco
3. Preencher: agência, dígito, conta, titular, CPF/CNPJ
4. [Salvar]
→ Conta disponível para seleção no saque
```

> **Pode ser feito:** pelo admin loja (Maxnível) OU pelo próprio CD logado.

---

## Passo 4 — Solicitar Saque (CD)

> **Aula 4:** *"Vou voltar lá na plataforma do CD e atualizar... tá aí a regra de saque... ele tem 950, valor mínimo é 100, vou solicitar 100... R$ 100, 5% de taxa, 95 líquido. Ele seleciona a conta bancária, digita a senha dele e requisita o saque... O sistema já debitou... ele tá com 850."*

**URL:** `/finance/solicitacao_saque`

```
1. Financeiro ▸ Solicitação de Saque
2. Sistema mostra regra vigente (mínimo, período)
3. Informar valor (ex: R$ 100)
4. Preview: Bruto R$ 100 − Taxa 5% − Líquido R$ 95
5. Selecionar conta bancária (cadastrada no Passo 3)
6. Digitar SENHA (autenticação)
7. [Requisitar Saque]
RAZER: Saldo debitado (R$ 950 → R$ 850)
```

---

## Passo 5 — Aprovar Pagamento (Maxnível)

> **Aula 4:** *"Esse pedido de saque chega aqui... Relatórios ▸ Informações ▸ Lojas/CDs ▸ Solicitação de Saque de CD. Tá aqui o pedido... o processo é idêntico ao do distribuidor. Você externamente tem que fazer o depósito na conta bancária dele. Tá aqui todos os dados da conta bancária, o valor que tem que ser depositado... depois marca que foi depositado."*

**URL:** `/administracao/SolicitacaoSaqueCd/SolicitacaoSaqueCdTransacoesAdmin/listar`

```
1. Relatórios ▸ Solicitação de Saque CD
2. Localizar solicitação (CD, valor bruto, taxa, líquido, conta)
3. Fazer o DEPÓSITO na conta bancária do CD (fora do sistema)
4. [Marcar como depositado]
5. Aprovar → encerra o ciclo
```

---

## Regras de Negócio (Resumo)

| Regra | Detalhe |
|-------|---------|
| **Saque só dentro do período** | Fora da janela, solicitação bloqueada |
| **Valor mínimo respeitado** | Abaixo do mínimo, bloqueado |
| **Taxa aplicada automaticamente** | Líquido = bruto − taxa |
| **Senha obrigatória** | Autenticação da operação |
| **Depósito é externo** | Matriz deposita fora do sistema, depois marca |
| **Aprovação manual** | Matriz confirma o depósito |
| **Débito imediato** | Saldo CD baixa no momento da requisição |

---

## Troubleshooting

| Sintoma | Causa | Solução |
|---------|-------|---------|
| Não consigo solicitar saque | Fora do período OU abaixo do mínimo | Aguardar janela / valor ≥ mínimo |
| Líquido menor que esperado | Taxa aplicada | Conferir configuração da taxa |
| Conta não aparece | Conta não cadastrada | Cadastrar conta primeiro |
| Saldo não debitou | Solicitação não finalizada (senha?) | Refazer requisição |
| Pedido parado "aguardando" | Matriz não depositou/marcou | Acompanhar aprovação na plataforma Maxnível |

---

## URLs Relacionadas

| Ação | URL |
|------|-----|
| Cadastrar Conta CD | `/finance/cadastrar_conta_bancaria` |
| Solicitação de Saque (CD) | `/finance/solicitacao_saque` |
| Aprovação (Maxnível) | `/SolicitacaoSaqueCd/SolicitacaoSaqueCdTransacoesAdmin/listar` |
| Relatório Transações CD | `/finance/transacoes_financeiras` |
| Módulo Saque CD (Maxnível) | Configurações ▸ Módulos |

---

## Links Relacionados

- Saldo bônus e compras: [`saldo-bonus-compras.md`](saldo-bonus-compras.md)
- Offboarding do distribuidor (saque idêntico): [`../../02-plataforma-maxnivel/04-financeiro-industria/solicitacao-saque.md`](../../02-plataforma-maxnivel/04-financeiro-industria/solicitacao-saque.md) ⏳

---

*Última atualização: 2025-08-11 | Baseado em Aula 4 + validação plataforma live*