# Bônus — Catálogo e Gestão (Administração Maxnível)

> **Tela principal:** Bônus instalados no sistema, configuração, relatórios, logs e execução de pagamentos.
>
> **URL real:** `https://allinbrasil.com.br/administracao/Bonus/BonusUtilizados/listar`
> **Relatório de Bônus (mensal):** `https://allinbrasil.com.br/administracao/Bonus/BonusAdministrador/bonusMes`
> **Acesso:** Menu superior **Bônus ▸ Bônus** e **Bônus ▸ Relatório de Bônus** + seção de Relatórios
> **Fonte:** Engenharia reversa (2026-07-19, read-only) + Treinamento Aula 2

---

## Visão Geral

O módulo **Bônus** centraliza os esquemas de comissionamento da rede. Cada bônus é uma **instância de uma classe de cálculo** com regras, percentuais por geração, planos vinculados e gatilhos próprios.

> ⚠️ **Importante:** Bônus é **permeável ao reset** — configurações alteradas permanecem em produção. Não "brincar" com regras em produção; manter funnel claro (ver `reset-teste-producao.md`).

---

## Catálogo de Bônus Instalados (Estado Real — 2026-07-19)

| ID | Nome | Status | Versão | Classe PHP | Gatilho |
|----|------|--------|--------|------------|---------|
| **7** | Bônus de Loja Online Acumulado | ✅ **ATIVO** | v4.0 | `BonusLinearV4` | Compra via link da loja virtual compartilhado |
| **4** | Bônus total recebidos geral - **Diretos** | ✅ **ATIVO** | v4.0 | `BonusLinearV4` | Compra de qualquer **direto** (indicado) |
| **8** | **Total de Bônus Extra** | ✅ **ATIVO** | v3.0 | `BonusQualificacaoMensalV3` | Qualificação: nº de diretos ativos (virada do mês) |
| **6** | Total de Bônus Recebidos - **Indiretos** | ✅ **ATIVO** | v4.0 | `BonusLinearV4` | Compras de recompra/ativação de **indiretos** (nível 2) |
| 1 | Bônus de Consumo | ❌ Desabilitado | v4.0 | `BonusLinearV4` | — |
| 2 | Bônus de Consumo | ❌ Desabilitado | v3.0 | `BonusQualificacaoMensalV3` | — |
| 3 | Bônus de Consumo 2 | ❌ Desabilitado | v3.0 | `BonusQualificacaoMensalV3` | — |
| 5 | Bônus de Loja Online acumulado | ❌ Desabilitado | v1.0 | `BonusLojaVirtualDoDistribuidorV1` | Versão legada substituída pela v4 (ID 7) |

> **Padrão de URL por ação:** `/administracao/{ClassePHP}/{Acao}/principal/{id}` — ex: `BonusLinearV4/Relatorio/principal/4`

---

## Regras de Negócio dos Bônus ATIVOS

### ID 7 — Bônus de Loja Online Acumulado
- **Gatilho:** Compra realizada por link de loja virtual compartilhado
- **Beneficiários:** Dono do link + patrocinador do dono do link (se dono tem plano **Afiliado**)
- **Percentuais/gerações:** Dependem do plano do dono do link
- **Exceção:** Recebe bônus mesmo se distribuidor estiver **inativo**

### ID 4 — Bônus total recebidos geral - Diretos (5% exemplo real)
- **Gatilho:** Compra realizada por qualquer **direto** (indicado direto)
- **Beneficiário:** Patrocinador (upline direto)
- **Escopo:** Todas as compras — adesão, upgrade, recompra, ativação mensal
- **Config real observada:** Geração 1 = 5%, montante do pedido base (ex: compra R$ 2.445 → bônus R$ 122,25)

### ID 6 — Total de Bônus Recebidos - Indiretos
- **Gatilho:** Compras de **recompra** e **ativação mensal** de indiretos (nível 2)
- **Beneficiário:** Distribuidor na upline
- **Profundidade:** 2 níveis de indiretos

### ID 8 — Total de Bônus Extra
- **Gatilho:** Patrocinador atinge X **diretos ativos** (qualificação mensal)
- **Periodicidade:** Pago na **virada do mês**
- **Exceção:** Recebe mesmo inativo
- **Ações especiais:** `Fazer Upgrade` (v3→v4), `Executar Pagamento` (rodar cron manual), `Previsão`
- **Threshold:** Valor limite via `vencimento[PorBonus][valor_limite]` no plano

---

## Estrutura do Card de Bônus (Listagem)

```
┌───────────────────────────────────────────────────────────────┐
│ [IMAGEM]  Nome do Bônus                                       │
│           Descrição: [texto da regra de cálculo]               │
│           ID: X | Versão: vX.X | Classe: BonusLinearV4        │
│                                                               │
│ [Mudar Configuração] [Relatório] [Log]                        │
│ [Editar Título e Descrição]                                   │
│ (extras p/ v3): [Fazer Upgrade] [Executar Pagamento] [Previsão]│
└───────────────────────────────────────────────────────────────┘
```

### Ações por Bônus

| Ação | URL Pattern | Descrição |
|------|-------------|-----------|
| **Mudar Configuração** | `/administracao/{Classe}/Configuracao/principal/{id}` | Regras: percentuais, gerações, planos vinculados, limites |
| **Relatório** | `/administracao/{Classe}/Relatorio/principal/{id}` | Transações do bônus (grid + gráficos + exportar) |
| **Log** | `/administracao/{Classe}/Log/principal/{id}` | Alterações na configuração (who/when/ip/diff) |
| **Editar Título/Descrição** | `/administracao/Bonus/BonusTituloDescricao/editar/{id}` | Renomear bônus exibido ao distribuidor |
| **Fazer Upgrade** (bônus v3) | `/administracao/Bonus/BonusHomologados/upgradeConfirmar/{id}` | Migrar v3 → v4 |
| **Executar Pagamento** (cron) | `/administracao/{Classe}/Cron/rodar/{id}` | Rodar processamento manual |
| **Previsão** | `/administracao/{Classe}/Relatorio/previsao/{id}` | Prever valores antes do processamento |

---

## Relatório de Transações do Bônus (Exemplo Real — ID 4)

**URL:** `/administracao/BonusLinearV4/Relatorio/principal/4`
**Título:** "Transações do bônus" — **20.360 transações** registradas

### Filtros disponíveis
- **Id Recebedor | Pedido | Conta | Informações | Data | Valor**
- Botão **Exportar** (PDF / XLS / CSV)

### Colunas do grid

| Coluna | Exemplo |
|--------|---------|
| **Id** | 44558 |
| **Recebedor** | Fabiorodolfo |
| **Pedido** | 25310 |
| **Conta** | Saldo para Compra |
| **Informações** | Geração:1, Comprador:1112vcc, 5%, Montante:2.445,00 |
| **Data** | 17/07/2026 15:13:31 |
| **Valor** | R$ 122,25 |

### Totais (rodapé)

| Indicador | Valor |
|-----------|-------|
| Total Geral | R$ 1.449.880,58 |
| Saldo para Compra | R$ 1.439.144,29 |
| Saldo a receber | R$ 10.736,29 |
| Saldo Perdido / Retido / Loja Online | — |

### Gráficos
1. **Últimos 15 dias** — barras diárias
2. **Últimos 12 meses** — barras mensais

> 📸 Evidência: `docs/reverse-engineering/allinbrasil/evidencias/screenshots/bonus/01-tela-principal-bonus-utilizados.png` e `02-relatorio-bonus-id4.png`

---

## Log de Alterações de Configuração

**URL:** `/administracao/BonusLinearV4/Log/principal/4`

| Coluna | Descrição |
|--------|-----------|
| Id | Sequencial do log |
| Quem fez? | Username do admin (ex: junior, jeferson.holanda.ms) |
| IP | Endereço de origem |
| Modificações | **Diff detalhado** — campos alterados (ex: `apenasCompradorTiverPlano 1→0`, `customerGroups→1`, `planosLigacao`, `maximoGeracoes`, `redeAustraliana→*`) |
| Data | DD/MM/YYYY HH:MM:SS |

> **Regra de auditoria:** Qualquer alteração de regra fica registrada com quem/ip/quando + diff completo. Confira antes de alegar "o bônus mudou" — o log mostra exatamente o que mudou.

---

## Configuração Típica (Campos observados no log)

| Campo | Exemplo de valor | Significado |
|-------|------------------|-------------|
| `maximoGeracoes` | 1–2 | Profundidade de gerações pagas |
| `geracaoInicial` | 1 | Primeira geração considerada |
| `percentual` (via JSON) | 5% | Valor por geração |
| `planosLigacao` | [1, 313, 344, 345, 346] | Planos que qualificam o recebedor (Afiliado 343, Avanço 1, Excelência 313, Upgrades 344-346) |
| `apenasCompradorTiverPlano` | 1→0 | Restringe gatilho ao comprador ter plano |
| `apenasCompradorTiverPlanosIds` | [1,313,344,345,346] | Quais planos do comprador disparam o bônus |
| `customerGroups` | 1 | Grupo de consumo elegível |
| `quantidadeVouchersRecebedor` | — | Vouchers/limites p/ recebedor |
| `aplicarLimitegeracaoDistribuido` | 1→0 | Limite acumulado por geração |
| `redeAustraliana→*` | — | Regra de rede australiana (qualificação de rede) |

---

## Executar Pagamento Manual (Cron)

> **Uso:** Bônus v3 (ID 8) possui processamento não-automático em alguns ciclos — roda manualmente.

```
1. Menu Bônus ▸ Bônus Utilizados
2. Card do bônus (ex: ID 8) → [Executar Pagamento]
3. Sistema roda o cron → gera transações do ciclo
4. Confira: Relatório → novos registros + Log com timestamp
```

> ⚠️ **Recomendação:** Antes de executar, rode **Previsão** (`Relatorio/previsao/{id}`) para validar valores.

---

## Relatório de Bônus (Mensal — Executivo)

**URL:** `/administracao/Bonus/BonusAdministrador/bonusMes`

Gadget/dashboard com:
- Pagamentos do mês por bônus
- Valor consolidado pago à rede
- Distribuidores por bônus recebido

---

## Cross-Reference: Treinamento → Documentação

| Trecho Transcrição (Aula 2) | Seção Neste Doc |
|----------------------------|-----------------|
| "é o que é pago de bônus de consumo pra rede... 5%... mudar o percentual de repasse pra rede, vem aqui e muda" | Configuração (Mudar Configuração), ID 4 = Geração 1 5% |
| "os nomes dos bônus e a descrição deles" | Editar Título e Descrição |
| "relatório de ganhos gerais... rendimento da rede" | Relatório de Transações |
| "planosLigacao... apenas comprador tiver plano" | Configuração típica (campos) |

---

## URLs Relacionadas

| Ação | URL |
|------|-----|
| Bônus Instalados | `/Bonus/BonusUtilizados/listar` |
| Relatório de Bônus (mensal) | `/Bonus/BonusAdministrador/bonusMes` |
| Configuração (Linear) | `/BonusLinearV4/Configuracao/principal/{id}` |
| Configuração (Qualif. Mensal) | `/BonusQualificacaoMensalV3/Configuracao/principal/{id}` |
| Relatório (Linear) | `/BonusLinearV4/Relatorio/principal/{id}` |
| Relatório (Loja Virtual v1) | `/BonusLojaVirtualDoDistribuidorV1/Relatorio/principal/{id}` |
| Log (Linear) | `/BonusLinearV4/Log/principal/{id}` |
| Upgrade v3→v4 | `/Bonus/BonusHomologados/upgradeConfirmar/{id}` |
| Cron Manual (pagamento) | `/BonusQualificacaoMensalV3/Cron/rodar/{id}` |
| Previsão | `/BonusQualificacaoMensalV3/Relatorio/previsao/{id}` |
| Editar Título/Descrição | `/Bonus/BonusTituloDescricao/editar/{id}` |
| Bonificação Mensal por Mês | `/Bonus/RelatorioBonificacaoMensal/listarPorMesAdministracao` |
| Bonificação Mensal por Bônus | `/Bonus/RelatorioBonificacaoMensal/listarPorBonusAdministracao` |
| Relatório de Bônus (admin) | `/Bonus/RelatorioBonusAdmin/bonus` |

---

## Troubleshooting

| Sintoma | Causa | Solução |
|---------|-------|---------|
| Distribuidor diz que não recebeu bônus | Qualificação/pedido fora do escopo OU regra alterada | 1) Relatório transações por recebedor 2) Log de configuração 3) Checar plano do recebedor |
| Bônus v3 não processa no início do mês | Cron não rodou | Executar Pagamento manual (preview via Previsão) |
| Percentual "mudou sozinho" | Config alterada por admin (log mostra quem/IP) | Log de configuração → reverter se necessário |
| Bônus desabilitado aparece no relatório | Versões legadas (IDs 1-3, 5) | Ignorar — ou remover via lixeira se sem movimentação |
| Upgrade v3→v4 não disponível | Bônus já v4 OU bloqueado por homologação | Contatar suporte Maxível |

---

## Links Relacionados

- Inventário técnico detalhado (read-only): [`../../reverse-engineering/allinbrasil/INVENTARIO-BONUS.md`](../../reverse-engineering/allinbrasil/INVENTARIO-BONUS.md)
- Registros CSV exportados: [`../../bonus/`](../../bonus/) *(transações reais brutas)*
- Planos de adesão (ligados aos bônus): [`../02-catalogos-planos/planos-adesao.md`](../02-catalogos-planos/planos-adesao.md)
- Reset e produção (bônus persiste no reset): [`../../04-plataforma-cd/07-go-live-checklist/reset-teste-producao.md`](../../04-plataforma-cd/07-go-live-checklist/reset-teste-producao.md)

---

*Última atualização: 2025-08-11 | Baseado em engenharia reversa (2026-07-19, read-only) + Aula 2*