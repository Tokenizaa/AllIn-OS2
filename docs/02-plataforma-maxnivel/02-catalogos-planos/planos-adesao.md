# Planos de Adesão — Administração Maxnível

> **Tela principal:** Cadastro e gestão dos planos de adesão (kits iniciais) que os distribuidores compram para entrar e se manter na rede.
>
> **URL real:** `https://allinbrasil.com.br/administracao/Planos/Planos/principal`
> **Acesso:** Menu **Cadastros ▸ Planos**
> **Fonte:** Treinamento Aula 2 + Engenharia reversa read-only (2026-07-19)

---

## Estado Real — Planos Configurados (Captura 2026-07-19)

### Adesões (3)
| ID | Nome | Preço | Estoque | Tipo |
|----|------|-------|---------|------|
| 343 | **Plano Afiliado** | R$ 0,00 | 9.000 | Adesão |
| 1 | **Plano Avanço** | R$ 997,00 | 1.001 | Adesão |
| 313 | **Plano Excelência** | R$ 3.980,00 | 2.000 | Adesão |

### Upgrades (3)
| ID | Nome | Preço | Estoque | Origem → Destino |
|----|------|-------|---------|------------------|
| 344 | Upgrade - Afiliado para Avanço | R$ 997,00 | 9.994 | 343 → 1 |
| 345 | Upgrade - Afiliado para Excelência | R$ 3.980,00 | 9.993 | 343 → 313 |
| 346 | Upgrade - Avanço para Excelência | R$ 2.983,00 | 9.999 | 1 → 313 |

### Abas do grid
**Adesões** | **Upgrades** | **Renovações** — cada tipo tem formulário próprio (`/editar/{id}/{tipo}`).

### Ações por linha
| Ação | URL | Observação |
|------|-----|-----------|
| Adicionar Estoque | `/Planos/Planos/estoque/{id}` | Modal/form |
| Ver Logs | `/Planos/Planos/logs/{id}` | Auditoria |
| Remover | `/Planos/Planos/remover/{id}/?{hash}` | **Protegido por CSRF hash** — irreversível se sem uso |
| Editar | `/Planos/Planos/editar/{id}/{tipo}` | Form completo |

> ⚠️ **Aviso do sistema ao remover:** *"Muito cuidado ao remover um Plano, pois se este não estiver em uso... será removido permanentemente e não poderá ser recuperado."*

### Campos reais do formulário (amostra)
`price` (centavos, oculto) · `sku` · `ncm` · `name[1]` (PT-BR) · `description[1]` (CKEditor) · `image` (max 2MB, resize 1000×1000) · `shipping` (Frete sim/não) · `subtract` (reduzir estoque) · `parcelamento_maximo` · `status` · `destacado` · `vencimento[Ilimitado|PorBonus|PorData]` · `qualificacao_id` · `campos[23..28]` (custom)

> 📸 Evidências: `docs/reverse-engineering/allinbrasil/evidencias/screenshots/planos/01-tela-principal-planos.png`, `02-formulario-edicao-plano-adesao.png`, `03-formulario-estoque-id343.png`
> 🔧 Inventário completo por campo: `docs/reverse-engineering/allinbrasil/INVENTARIO-PLANOS.md`

---

## Visão Geral

Os **planos de adesão** definem:

- O **kit inicial** que o novo distribuidor compra para **entrar na rede**
- O **valor** da adesão (taxa + produtos)
- **Benefícios** (descrição do que o kit contempla)
- **Estoque** de planos disponíveis
- Regras de **frete** e **ativação mensal** vinculadas

> **Aula 2:** *"Meu plano exibe o plano de adesão que ele tem... se o senhor tivesse mais opções de plano aqui, ele teria como fazer upgrade."* — O plano determina o nível inicial e permite upgrades futuros.

---

## Estrutura da Tela

### Listagem / Dashboard de Planos

```
┌───────────────────────────────────────────────────────────────┐
│ Planos (Principal)                          [+ Adicionar]     │
├───────────────┬───────────────────────────────────────────────┤
│ 📋 Nome       │ Plano Bronze, Plano Prata, Plano Ouro...      │
│ 💰 Valor      │ R$ 199,90 | R$ 399,90 | R$ 799,90            │
│ 📦 Estoque    │ 100 | 50 | 20                                 │
│ 🖼️ Imagem     │ Thumbnail do kit                              │
│ 📝 Benefícios │ "Kit inicial com 10 pares..."                 │
│ ⚙️ Ações      │ ✏️ Editar | 🗑 Desativar/Ativar               │
├───────────────┴───────────────────────────────────────────────┤
│ Gráficos: Distribuidores por Plano (pizza)                    │
│ Indicadores: Qtd. adesões vendidas, faturamento líquido       │
└───────────────────────────────────────────────────────────────┘
```

### Formulário de Edição de Plano

| Seção | Campo | Obrig. | Descrição |
|-------|-------|--------|-----------|
| **Identificação** | Nome do Plano | ✅ | Ex: "Plano Bronze" |
| | Imagem do Plano | ❌ | Foto do kit (exibida no checkout de adesão) |
| | Valor do Plano | ✅ | Preço de adesão (ex: R$ 199,90) |
| **Benefícios** | Descrição de Benefícios | ✅ | O que o kit contempla: "Adquire o kit mostruário com 10 pares com todas as numerações e cores... Uma loja virtual... " |
| | Lista de Itens do Kit | ✅ | Produtos incluídos (quantidade por item) |
| **Logística** | Tem Frete? | ❌ | Plano com frete calculado ou isento |
| | Dimensões / Peso | ❌ | Para cálculo do frete do kit |
| **Estoque** | Estoque de Planos | ❌ | Qtd disponível — **se esgotar, adesão fica indisponível** |
| **Status** | Ativo/Inativo | ✅ | Desativar = não vende mais este plano |
| **Isenção** | Isento de Ativação Mensal | ❌ | Plano pode isentar o distribuidor de ativação mensal enquanto ativo |

> **Aula 2:** *"Se o estoque esgotar, a pessoa não vai conseguir comprar o plano."* — Controle de estoque de planos é obrigatório para venda contínua.

---

## Funcionalidades Relacionadas

### Upgrade de Plano
> **Aula 2:** *"Se o senhor tivesse mais opções de plano aqui, ele teria como fazer upgrade."*

```
1. Distribuidor logado no Escritório Virtual
2. Menu: Meu Plano
3. Ver opções de upgrade disponíveis (planos de maior valor)
4. Paga a diferença → plano atualizado
5. Relatórios: "Adesões vs Upgrades" mostram a migração
```

### Regras de Exclusão Automática (Falta de Adesão)
> **Aula 2:** *"Se a pessoa não comprar a adesão dela em [30 dias]... ela não vai conseguir comprar mais... envio de e-mail para você avisando... regra de 100% plano de adesão."*

| Parâmetro | Exemplo |
|-----------|---------|
| **Prazo pós-cadastro** | 30 dias |
| **Ação** | Bloquear compra de adesão |
| **Aviso** | E-mail automático ao administrador |
| **Configuração** | Módulo "Exclusão Automática" / regra de plano de adesão |

### Ativação Mensal × Plano
> **Aula 2:** *"Isento de ativação enquanto possuir o plano tal... quando ele compra adesão, ele está isento... os planos são isentos... mas quando resetar, esse número vai bater com o [real]."*

- Plano de adesão pode incluir **isenção de ativação mensal** (ex: Plano Ouro isenta 12 meses)
- Após o período, distribuidor precisa comprar **ativação mensal** para permanecer ativo
- Configuração: `Cadastros ▸ Ativação Mensal` → `/AtivacaoMensal/AtivacaoMensalTransacoes/listar`

---

## Relatórios Vinculados

| Relatório | URL | Uso |
|-----------|-----|-----|
| **Adesões** | `/Planos/Relatorio/listarPlanos` | Quantidade vendida, faturamento |
| **Planos do Distribuidor** | `/Planos/Relatorio/planosDoDistribuidor` | Consultar plano de um dist específico |
| **Taxa Cadastro → Adesão** | `/Planos/Relatorio/taxaCadastroAdesao` | Conversão: quantos cadastrados compraram adesão |
| **Distribuidores por Plano (pizza)** | Dashboard Planos | Distribuição da base por plano |
| **Adesões vs Upgrades** | Dashboard Planos | Evolução (upgrade futuro) |

---

## Regras de Negócio

| Regra | Detalhe |
|-------|---------|
| **Estoque de plano zerado** | Adesão indisponível — recarregar antes de campanhas |
| **Plano desativado** | Não vende, mas distribuidores ativos no plano continuam |
| **Pós-reset** | Cadastro #1 precisa comprar plano de adesão para ser alocado (ver `reset-teste-producao.md`) |
| **Isenção de ativação** | Configurada no plano — afeta relatório de ativos |
| **Upgrade** | Só para cima (plano de maior valor), paga-se a diferença |

---

## Troubleshooting

| Sintoma | Causa | Solução |
|---------|-------|---------|
| Distribuidor não consegue comprar adesão | Estoque de plano zerado OU plano desativado | Recarregar estoque / ativar plano |
| Relatório "Adesões" zerado | Ninguém comprou adesão ainda (ou pós-reset) | Revisar cadastro #1 e campanhas |
| Ativação mensal cobrada indevidamente | Plano sem isenção configurada | Editar plano → marcar isenção |
| E-mail de aviso "regra de adesão" disparado | Distribuidor passou do prazo sem comprar | Follow-up manual com o distribuidor |

---

## Links Relacionados

- Reset pós-teste (alocar cadastro #1): [`04-plataforma-cd/07-go-live-checklist/reset-teste-producao.md`](../../04-plataforma-cd/07-go-live-checklist/reset-teste-producao.md)
- Rede de distribuidores: [`01-distribuidores/rede-distribuidores.md`](../01-distribuidores/rede-distribuidores.md)
- Kits de produtos (Loja): [`03-plataforma-loja-virtual/01-catalogo/kits.md`](../../03-plataforma-loja-virtual/01-catalogo/kits.md) ⏳

---

*Última atualização: 2025-08-11 | Baseado em Aula 2 (Planos/Adesão) + validação plataforma live*