# Solicitação de Saque — Distribuidor (Maxnível)

> **Tela principal:** Fluxo de saque do saldo do distribuidor — contas internas, regras, verificação de documentos, IR/INSS e aprovação pela Maxnível.
>
> **URLs reais:**
> - Solicitação de saque (admin): `/administracao/SolicitacaoSaque/SolicitacaoSaqueTransacoesAdmin/listar`
> - Saques em massa: `/administracao/SolicitacaoSaque/SolicitacaoSaqueEmMassa/listar`
> - Contas bancárias: `/administracao/ContaBancaria/DistribuidorContaBancariaListagem/listar`
> - Verificação de contas: `/administracao/VerificacaoConta/VerificacaoContaArquivosEmAnalise/listar`
> - Relatório saques: `/administracao/SolicitacaoSaque/SolicitacaoSaqueTransacoesRelatorioSaque/listar`
> - Taxas: `/SolicitacaoSaque/SolicitacaoSaqueTransacoesRelatorioTaxas/listar`
> - IR / INSS: `/SolicitacaoSaque/SolicitacaoSaqueTransacoesRelatorioIr/listar` , `...RelatorioInss/listar`
> - Saldo liberado: `/SolicitacaoSaque/SolicitacaoSaqueEmMassa/saldoLiberado`
>
> **Fonte:** Treinamento Aula 2 + Aula 3

---

## Visão Geral

O **saque** permite ao distribuidor retirar o saldo de bônus. O fluxo é **externo + manual**:

```
┌────────────────────────────────────────────────────────────────┐
│ REGRAS PRÉVIAS (Maxnível)                                     │
│ • Verificação de conta/documentos obrigatória                 │
│ • Regra de saque: valor mínimo + períodos do mês              │
│ • IR / INSS (tabelas atualizadas)                             │
└──────────────────────────┬─────────────────────────────────────┘
                           ▼
┌────────────────────────────────────────────────────────────────┐
│ DISTRIBUIDOR: solicita saque (escritório virtual)             │
│   1. Cadastrou conta bancária + documento validado             │
│   2. Meus Saques ▸ solicita valor (dentro da regra)            │
└──────────────────────────┬─────────────────────────────────────┘
                           ▼
┌────────────────────────────────────────────────────────────────┐
│ INDÚSTRIA: aprova                                            │
│   1. Recebe pedido (Solicitação de Saque Admin)               │
│   2. Faz depósito na conta do distribuidor (externo)          │
│   3. Marca como depositado                                    │
└────────────────────────────────────────────────────────────────┘
```

---

## Contas Internas: Qual Saldo Pode Ser Sacado?

> ⚠️ **Regra crítica (Aula 2):** *"Os saldos gerados pelos bônus de consumo não podem ser sacados. O saque será permitido apenas para os bônus vindos da loja online."*

| Conta Interna | Origem | Pode Sacar? |
|---------------|--------|-------------|
| **Saldo Loja Online** | Bônus da loja virtual (vendas online) | ✅ **Sim** |
| **Saldo a Receber** | Bônus de consumo (rede) | ❌ **Não** — apenas para compras |
| **Saldo para Compras** | Transferido de "a receber" | ❌ Não (compra de produtos) |

### Transferência Entre Contas

> **Aula 2:** *"Configurações ▸ Módulos ▸ transferência entre contas... vai dar conta saldo a receber para conta saldo para compra."*

| De | Para | Quando |
|----|------|--------|
| Saldo a Receber | Saldo para Compras | Distribuidor quer usar bônus de consumo p/ comprar |
| Saldo a Receber | Saldo Loja Online | ⚠️ Apenas se configurado (regra particular) |

> **Regra:** Bônus de consumo (rede) → vira **saldo para compras** (não sacável). Bônus de loja online → **saldo loja online** (sacável).

---

## Pré-requisitos do Distribuidor para Sacar

### 1. Verificação de Conta / Documentos
> **Aula 2:** *"Verificação de conta... você, como administrador da empresa, pode exigir que ele te envie documentos comprovando o cadastro... você vai validar esse documento... essa documentação é requisito necessário para liberar a solicitação de saque."*

| Documento | Exemplo |
|-----------|---------|
| CPF | Comprovante |
| Contrato | Assinado |
| Comprovante de Endereço | Conta de luz/água |
| RG | Frente e verso |

**Fluxo:** Distribuidor envia → Matriz valida (`/VerificacaoConta/VerificacaoContaArquivosEmAnalise/listar`) → aprovado/reprovado.

### 2. Conta Bancária Cadastrada
> **Aula 2:** *"Aqui ó, ele registrou a conta bancária dele... informou o documento, salva. Ele cadastrou a conta bancária para solicitar saque."*

**URL (admin):** `/ContaBancaria/DistribuidorContaBancariaListagem/listar`

- Banco, agência, conta, dígito, titular
- Validada junto com a documentação

---

## Regras de Saque (Configuração na Maxnível)

> **Aula 2:** *"Você pode criar várias regras de saque, vários períodos do mês... vou colocar que ele vai solicitar saque da conta bônus... permitido apenas após o envio e aprovação da documentação exigida."*

### Configuração (Módulo de Saque)

| Parâmetro | Descrição | Exemplo |
|-----------|-----------|---------|
| **Conta de origem** | Qual saldo pode sacar | Saldo Loja Online |
| **Valor mínimo** | Liberar saque acima de | R$ 100 |
| **Período do mês** | Janela de solicitação | Dia 1 a 5 / 20 a 25 |
| **Aprovação de documentos** | Exigir antes do saque | ✅ Obrigatório |
| **Múltiplas regras** | Vários períodos simultâneos | 1-5 + 20-25 |

### IR e INSS

> **Aula 2:** *"Importantíssimo o senhor atualizar a tabela do INSS, a tabela do imposto de renda, caso vá deduzir esses impostos dos pedidos de saque."*

| Imposto | Tabela | Aplicação |
|---------|--------|-----------|
| **IR** | Tabela progressiva mensal (Receita Federal) | Deduzido no saque acima da faixa isenta |
| **INSS** | Tabela de contribuição | Deduzido conforme teto |
| **Taxas** | Configuráveis | Percentual/fixo |

**Relatórios:** Saques (`RelatorioSaque`), Taxas (`RelatorioTaxas`), IR (`RelatorioIr`), INSS (`RelatorioInss`), Cancelados (`RelatorioCancelados`).

---

## Fluxo de Solicitação (Distribuidor — Escritório Virtual)

```
1. Distribuidor: Meus Saques ▸ [Solicitar Saque]
2. Sistema valida: conta origem (saldo loja online)
3. Valor dentro da regra (mínimo + período)
4. Confirma com senha
5. Pedido de saque gerado → chega na Maxnível
```

---

## Fluxo de Aprovação (Maxnível)

> **Aula 2:** *"Esse pedido de saque vai chegar para você lá na indústria... você vai fazer o depósito para ele na conta do Banco Itaú dele... para você depositar o saldo para ele."*

```
1. Menu Solicitação de Saque (admin)
   URL: /SolicitacaoSaque/SolicitacaoSaqueTransacoesAdmin/listar
2. Localizar pedido (distribuidor, valor, conta bancária)
3. Conferir: documento validado? conta correta?
4. Fazer DEPÓSITO na conta do distribuidor (fora do sistema)
5. [Marcar como depositado]
6. Pedido encerrado — distribuidor vê atualização em "Meus Saques"
```

---

## Saques em Massa

**URL:** `/SolicitacaoSaque/SolicitacaoSaqueEmMassa/listar`

- Processar vários pedidos de saque de uma vez (exportar lista de depósitos)
- **Saldo liberado:** `/SolicitacaoSaque/SolicitacaoSaqueEmMassa/saldoLiberado` — total disponível p/ depósito

> **Uso:** Fechamento do período de pagamento (ex: dia 1-5) — gera planilha de todos os depósitos a fazer.

---

## Regras de Negócio (Resumo)

| Regra | Detalhe |
|-------|---------|
| **Bônus de consumo não é sacável** | Vira "saldo para compras" |
| **Só bônus da loja online é sacável** | "saldo loja online" |
| **Documento + conta validados** | Pré-requisito absoluto |
| **Valor mínimo + período** | Definidos por regra de saque |
| **IR/INSS deduzidos** | Tabelas atualizadas manualmente |
| **Depósito externo** | Matriz deposita na conta do dist, depois marca |
| **Saques em massa** | Processamento em lote no fechamento |

---

## Troubleshooting

| Sintoma | Causa | Solução |
|---------|-------|---------|
| Distribuidor não consegue sacar | Bônus é de consumo (saldo a receber) | Explicar regra; transferir p/ compras |
| "Aguardando documento" | Documento não enviado/validado | Exigir envio + validar |
| Saque fora do período | Regra limita dias do mês | Aguardar próxima janela |
| Valor abaixo do mínimo | Regra bloqueia | Fazer saque acima do mínimo |
| IR/INSS errado | Tabela desatualizada | Atualizar tabelas no módulo |
| Pedido sem depósito | Matriz não marcou | Fazer depósito + marcar |

---

## URLs Relacionadas

| Ação | URL |
|------|-----|
| Solicitação de Saque (admin) | `/SolicitacaoSaque/SolicitacaoSaqueTransacoesAdmin/listar` |
| Saques em Massa | `/SolicitacaoSaque/SolicitacaoSaqueEmMassa/listar` |
| Saldo Liberado | `/SolicitacaoSaque/SolicitacaoSaqueEmMassa/saldoLiberado` |
| Contas Bancárias | `/ContaBancaria/DistribuidorContaBancariaListagem/listar` |
| Verificação de Contas | `/VerificacaoConta/VerificacaoContaArquivosEmAnalise/listar` |
| Relatório de Saques | `/SolicitacaoSaque/SolicitacaoSaqueTransacoesRelatorioSaque/listar` |
| Relatório de Taxas | `/SolicitacaoSaque/SolicitacaoSaqueTransacoesRelatorioTaxas/listar` |
| Relatório de IR | `/SolicitacaoSaque/SolicitacaoSaqueTransacoesRelatorioIr/listar` |
| Relatório de INSS | `/SolicitacaoSaque/SolicitacaoSaqueTransacoesRelatorioInss/listar` |
| Relatório Cancelados | `/SolicitacaoSaque/SolicitacaoSaqueTransacoesRelatorioCancelados/listar` |

---

## Links Relacionados

- Saque do CD (mesmo fluxo p/ CD): [`../../04-plataforma-cd/04-financeiro-cd/solicitacao-saque-cd.md`](../../04-plataforma-cd/04-financeiro-cd/solicitacao-saque-cd.md)
- Bônus (origem dos saldos): [`bonus-instalados.md`](bonus-instalados.md)
- Pendentes (validação docs): [`../01-distribuidores/pendentes-aprovacao.md`](../01-distribuidores/pendentes-aprovacao.md)

---

*Última atualização: 2025-08-11 | Baseado em Aula 2 + Aula 3 + validação plataforma live*