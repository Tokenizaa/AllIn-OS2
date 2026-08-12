# Relatório de Indicados — Métricas de Indicação por Patrocinador

> **Tela principal:** Quantidade de cadastros e indicados por patrocinador, evolução da indicação, conversão de cadastro → adesão.
>
> **URL real:** `https://allinbrasil.com.br/administracao/Distribuidor/Patrocinador/relatorioIndicacoes`
> **Acesso:** Menu **Distribuidores ▸ Relatório de Indicados**
> **Fonte:** Treinamento Aula 2

---

## Visão Geral

O **Relatório de Indicados** mostra, por patrocinador (upline), quantos distribuidores foram indicados diretamente. Permite acompanhar:

- **Volume de indicação** por membro da rede
- **Conversão** cadastrados → adesão paga
- **Performance da equipe** (quem indica mais, quem não indica)
- Base para **qualificação** (requisitos de nº de diretos ativos)

> **Aula 2:** *"Você consegue acompanhar quantos indicados cada pessoa tem."*

---

## Estrutura do Relatório

```
┌─────────────────────────────────────────────────────────────────┐
│ Relatório de Indicados                         [Filtros] [Exportar]│
├─────────────────────────────────────────────────────────────────┤
│ Patrocinador | Qtd Indicados | Qtd Adesões | Conversão % | Ações │
│ João Maria  | 12            | 9           | 75%         | 👁      │
│ User 3      | 5             | 3           | 60%         | 👁      │
└─────────────────────────────────────────────────────────────────┘
```

### Colunas típicas

| Coluna | Descrição |
|--------|-----------|
| **Patrocinador** | Usuário/nome do upline |
| **Qtd. Indicados** | Total de cadastros patrocinados (diretos) |
| **Qtd. Adesões** | Quantos compraram plano de adesão |
| **Conversão (%)** | Adesões ÷ Indicados |
| **Ações** | Detalhar lista de indicados do patrocinador |

---

## Relatórios Relacionados (Complementares)

| Relatório | URL | Uso |
|-----------|-----|-----|
| **Qtd. Cadastros por Patrocinador** | `/RedeLinear/Relatorio/relatorioQuantidadeCadastrosPorPatrocinador` | Nº puro de cadastros |
| **Crescimento da Rede** | `/RedeLinear/RelatorioCrescimentoRede/principal/1` | Evolução temporal |
| **Qualificações Atingidas** | `/Qualificacao/RelatorioQualificacoes/principal` | Requisitos batidos |
| **Movimentação Pessoal** | `/RedeLinear/Relatorio/relatorioMovimentacaoPessoal` | Volume pessoal por período |

---

## Regras de Negócio

| Regra | Detalhe |
|-------|---------|
| **Indicado direto** | Cadastro vinculado ao patrocinador no momento do cadastro |
| **Alteração de patrocinador** | Só enquanto pendente (ver `rede-distribuidores.md`) |
| **Conversão** | Indicados com adesão paga ÷ total indicados |
| **Base p/ bônus de diretos** | Bônus ID 4 (Diretos) usa esta estrutura |

---

## URLs Relacionadas

| Ação | URL |
|------|-----|
| Relatório de Indicados | `/Distribuidor/Patrocinador/relatorioIndicacoes` |
| Qtd. Cadastros por Patrocinador | `/RedeLinear/Relatorio/relatorioQuantidadeCadastrosPorPatrocinador` |
| A Rede | `/Distribuidor/DistribuidoresARede/listar` |

---

## Links Relacionados

- Bônus de diretos: [`../04-financeiro-industria/bonus-instalados.md`](../04-financeiro-industria/bonus-instalados.md)
- Rede: [`rede-distribuidores.md`](rede-distribuidores.md)
- Pendentes/conversão: [`pendentes-aprovacao.md`](pendentes-aprovacao.md)

---

*Última atualização: 2025-08-11 | Baseado em Aula 2 + validação plataforma live*