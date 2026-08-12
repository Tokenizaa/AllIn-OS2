# Relatórios da Rede — Crescimento, Ganhos, Ativos (Maxnível)

> **Tela principal:** Conjunto de relatórios de rede da Administração — crescimento, ganhos (rede linear), ativos/inativos, contas bancárias, saldos.
>
> **URLs reais (base `/administracao/`):**
> - Crescimento da Rede: `/RedeLinear/RelatorioCrescimentoRede/principal/1`
> - Ganhos Gerais (rede linear): `/RedeLinear/Relatorio/relatorioMovimentacao`
> - Movimentações Unilevel: `/RedeLinear/Relatorio/relatorioMovimentacoesRedeAdministracao/1`
> - Movimentação Pessoal: `/RedeLinear/Relatorio/relatorioMovimentacaoPessoal`
> - Qtd Cadastros por Patrocinador: `/RedeLinear/Relatorio/relatorioQuantidadeCadastrosPorPatrocinador`
> - Ativos por Mês: `/AtivacaoMensal/AtivosPorMes`
> - Ativos por Região: `/AtivacaoMensal/DistribuidorRelatorioAtivosPorRegiao/listar`
> - Ativos/Inativos Período: `/AtivacaoMensal/RelatorioAtivosInativosPorPeriodo/principal`
> - Ativos/Inativos no Dia: `/AtivacaoMensal/RelatorioAtivacaoNoDia/principal/1`
> - Saldo nos Escritórios: `/Contas/RelatorioSaldoNosEscritoriosAdmin/escolherConta`
> - Transações em Conta: `/Contas/ContasTransacoesRelatorio/listar`
> - Contas Bancárias (relatório): `/ContaBancaria/DistribuidorContaBancariaListagem/listar`
>
> **Fonte:** Treinamento Aula 2

---

## Relatórios de Estrutura

### Crescimento da Rede
> **Aula 2:** *"Relatório de crescimento da rede... você consegue acompanhar quantos diretos e indiretos cada um tem. Tá aqui por período também, você consegue filtrar por período."*

**URL:** `/RedeLinear/RelatorioCrescimentoRede/principal/1`

| Indicador | Descrição |
|-----------|-----------|
| Diretos por distribuidor | Indicados diretos |
| Indiretos por distribuidor | Rede profunda (níveis 2+) |
| Evolução por período | Filtro por janela de tempo |

**Uso:** Acompanhar expansão, identificar patrocinadores fortes/frágeis.

### Qtd. Cadastros por Patrocinador
**URL:** `/RedeLinear/Relatorio/relatorioQuantidadeCadastrosPorPatrocinador`
- Nº puro de cadastros por upline
- Base para premiação e análise de conversão

---

## Relatórios de Ganhos

### Ganhos Gerais (Rede Linear)
> **Aula 2:** *"Relatório geral de ganhos da rede linear... relatório idêntico ao do distribuidor, porém exibe para você administrador os ganhos, a movimentação mensal e os ganhos de bônus de cada membro da rede."*

**URL:** `/RedeLinear/Relatorio/relatorioMovimentacao`

| Coluna | Descrição |
|--------|-----------|
| Membro | Distribuidor |
| Movimentação mensal | Volumes do período |
| Ganhos de bônus | Bônus por tipo recebido |
| Total | Soma do período |

**Uso:** Visão consolidada do que a rede rendeu (financeiro, taxação).

### Movimentações Unilevel (Administração)
**URL:** `/RedeLinear/Relatorio/relatorioMovimentacoesRedeAdministracao/1`
- Movimentação por nível (unilevel) da rede
- **Uso:** Auditoria de recompra, ativação, bônus linear

### Movimentação Pessoal
**URL:** `/RedeLinear/Relatorio/relatorioMovimentacaoPessoal`
- Volume pessoal por distribuidor (compras próprias)
- **Uso:** Qualificação (requisito de volume pessoal)

---

## Relatórios de Atividade

### Ativos por Mês
> **Aula 2:** *"Quantos ativos tem na rede... como o seu nunca vai ficar inativo, aqui é o número que vai ter na rede."*

**URL:** `/AtivacaoMensal/AtivosPorMes`

### Ativos por Região
> **Aula 2:** *"É a mesma coisa, só que aqui vai exibir por região, quantos ativos e inativos, região geográfica."*

**URL:** `/AtivacaoMensal/DistribuidorRelatorioAtivosPorRegiao/listar`

### Ativos/Inativos no Período
**URL:** `/AtivacaoMensal/RelatorioAtivosInativosPorPeriodo/principal`

### Ativos/Inativos no Dia
> **Aula 2:** *"Relatórios dos inativos, ativos inativos do dia... no dia hoje tem essas pessoas aqui ativas e inativas."*

**URL:** `/AtivacaoMensal/RelatorioAtivacaoNoDia/principal/1`

| Relatório | Foco |
|-----------|------|
| Ativos por Mês | Total mensal |
| Ativos por Região | Distribuição geográfica |
| Ativos/Inativos Período | Comparação em janela |
| Ativos/Inativos Dia | Snapshot diário |

---

## Relatórios Financeiros / Cadastrais

### Transações em Conta
> **Aula 2:** *"Transações em conta... exibe todas as movimentações mensais de todos os distribuidores, de todos os bônus."*

**URL:** `/Contas/ContasTransacoesRelatorio/listar`

### Saldo nos Escritórios
> **Aula 2:** *"Saldo nos escritórios... ver o que existe de saldo em cada uma das contas internas do sistema."*

**URL:** `/Contas/RelatorioSaldoNosEscritoriosAdmin/escolherConta`

### Contas Bancárias (Relatório)
> **Aula 2:** *"Cadastro de todas as contas bancárias de todos os membros... quantas pessoas cadastradas no Bradesco, na tal agência, tal banco, como conta corrente... qual a conta bancária de tal distribuidor."*

**URL:** `/ContaBancaria/DistribuidorContaBancariaListagem/listar`

### Adesões Vendidas / Faturamento (Dashboard)
> **Aula 2:** *"Quantidade de planos de adesão vendidos, faturamento líquido da empresa... faturamento versus bônus."*

| Gadget/Relatório | Métrica |
|------------------|---------|
| Planos Vendidos | Qtd adesões |
| Faturamento Líquido | Receita da empresa |
| Faturamento vs Bônus | Proporção paga à rede |

---

## Regras de Negócio

| Regra | Detalhe |
|-------|---------|
| **Filtro por período** | Todos os relatórios aceitam janela temporal |
| **Diretos/Indiretos** | Crescimento mostra ambos separadamente |
| **Ativo = comprou ativação/adesão** | Plano isento conta como ativo |
| **Região geográfica** | Cadastro do distribuidor define região |
| **Saldo por conta interna** | Separado: loja online / compras / a receber |

---

## URLs Relacionadas (Mestra)

| Relatório | URL |
|-----------|-----|
| Crescimento da Rede | `/RedeLinear/RelatorioCrescimentoRede/principal/1` |
| Ganhos Gerais | `/RedeLinear/Relatorio/relatorioMovimentacao` |
| Movimentações Unilevel | `/RedeLinear/Relatorio/relatorioMovimentacoesRedeAdministracao/1` |
| Movimentação Pessoal | `/RedeLinear/Relatorio/relatorioMovimentacaoPessoal` |
| Qtd Cadastros por Patrocinador | `/RedeLinear/Relatorio/relatorioQuantidadeCadastrosPorPatrocinador` |
| Ativos por Mês | `/AtivacaoMensal/AtivosPorMes` |
| Ativos por Região | `/AtivacaoMensal/DistribuidorRelatorioAtivosPorRegiao/listar` |
| Ativos/Inativos Período | `/AtivacaoMensal/RelatorioAtivosInativosPorPeriodo/principal` |
| Ativos/Inativos Dia | `/AtivacaoMensal/RelatorioAtivacaoNoDia/principal/1` |
| Transações em Conta | `/Contas/ContasTransacoesRelatorio/listar` |
| Saldo nos Escritórios | `/Contas/RelatorioSaldoNosEscritoriosAdmin/escolherConta` |
| Contas Bancárias (relatório) | `/ContaBancaria/DistribuidorContaBancariaListagem/listar` |

---

## Links Relacionados

- Bônus (ganhos): [`../04-financeiro-industria/bonus-instalados.md`](../04-financeiro-industria/bonus-instalados.md)
- Rede (login/admin): [`../01-distribuidores/rede-distribuidores.md`](../01-distribuidores/rede-distribuidores.md)
- Saques (financeiro): [`../04-financeiro-industria/solicitacao-saque.md`](../04-financeiro-industria/solicitacao-saque.md)

---

*Última atualização: 2025-08-11 | Baseado em Aula 2 + validação plataforma live*