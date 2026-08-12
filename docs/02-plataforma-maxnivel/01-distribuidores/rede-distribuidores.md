# Rede de Distribuidores — Administração Maxnível

> **Tela principal:** Visualização hierárquica da rede (árvore/genealogia), listagem paginada, ações em massa e acesso ao escritório virtual de cada distribuidor.
>
> **URL real:** `https://allinbrasil.com.br/administracao/Distribuidor/DistribuidoresARede/listar`
>
> **Acesso:** Menu **Distribuidores ▸ A Rede** (ícone 👥)

---

## Visão Geral

A tela **A Rede** é o painel central para gestão da estrutura de distribuição (downline/upiline). Permite:

- Visualizar a **árvore genealógica** completa (organograma) ou **listagem tabular** paginada
- Acessar o **escritório virtual** de qualquer distribuidor (login como admin)
- Filtrar, ordenar e exportar dados da rede
- Ver indicadores rápidos: total de distribuidores, ativos, pendentes, qualificações
- Executar ações administrativas: alterar patrocinador (apenas pendentes), excluir, criar pedido

---

## Estrutura da Tela

### 1. Cabeçalho e Navegação
```
┌─────────────────────────────────────────────────────────────────┐
│ Distribuidores ▸ A Rede                    [Exportar] [Filtros] │
├─────────────────────────────────────────────────────────────────┤
│ 📊 Resumo: 984 Distribuidores na Rede  |  [Ver Distribuidores]  │
└─────────────────────────────────────────────────────────────────┘
```

### 2. Abas de Visualização

| Aba | Descrição | Quando Usar |
|-----|-----------|-------------|
| **Listagem** (padrão) | Tabela paginada com colunas ordenáveis | Gestão diária, buscas, exportação |
| **Árvore/Organograma** | Visualização hierárquica (downline) | Entender estrutura, treinar novos admins |
| **Rede Linear** | Vista achatada por nível/geração | Relatórios de qualificação, bônus |

### 3. Colunas da Listagem (Ordenáveis)

| Coluna | Campo BD | Descrição |
|--------|----------|-----------|
| **Nº** | `di_id` | ID interno do distribuidor |
| **Usuário** | `di_usuario` | Login de acesso ao escritório virtual |
| **Nome** | `di_nome` | Nome completo |
| **E-mail** | `di_email` | Contato principal |
| **Cidade / Estado** | `di_cidade`, `es_uf` | Localização |
| **Data Nasc.** | `di_data_nascimento` | Para validação maioridade |
| **Data Cad.** | `di_data_cad` | Quando entrou na rede |
| **Ações** | — | Ícones: 👁 Ver | ✏️ Editar | 🔑 Login | 🗑 Excluir |

> **Dica:** Clique no cabeçalho da coluna para ordenar ASC/DESC. Paginação: 20/40/60/80/100 por página.

---

## Funcionalidades Principais

### Acessar Escritório Virtual (Login como Admin)
> **Treinamento (Aula 2):** *"Se a gente for lá no escritório virtual de um membro da rede... a gente consegue ver a movimentação pessoal dessa pessoa... e a da rede dela... aqui ele consegue ver a bonificação dessa pessoa também."*

**Como fazer:**
1. Na listagem, localize o distribuidor
2. Clique no ícone **🔑 Login** (ou botão "Logar pela Administração")
3. Sistema abre nova aba logado como o distribuidor
4. Você vê **exatamente o que ele vê**: rede, bônus, pedidos, qualificação

**Casos de uso:**
- Diagnosticar dúvidas do distribuidor ("não vejo meu bônus")
- Verificar se qualificação está calculando corretamente
- Treinar distribuidor compartilhando tela

### Visualizar Árvore/Downline
> **Treinamento (Aula 2):** *"Aqui na rede linear, no formato de organograma... o primeiro downline dele... ele consegue acompanhar toda a produção da rede dele... tudo que a rede faz para baixo... infinito."*

**Organograma mostra:**
- **Geração 1** (indicados diretos / patrocinados)
- **Geração 2+** (indicados dos indicados — profundidade ilimitada)
- Cards com: Nome, Usuário, Qualificação atual, Status (Ativo/Pendente/Excluído)
- Clique no card → abre detalhes / login no escritório virtual

### Alterar Patrocinador (Apenas Pendentes)
> **Treinamento (Aula 2):** *"Essa ferramenta permite que você altere o patrocinador de um cadastro pendente... só pode ser alterado enquanto ele estiver pendente, depois que ele tiver alocado na rede, aí não tem como mais alterar."*

**Regra de negócio:**
- ✅ Permitido: Cadastro **Pendente** (ainda não comprou kit / não alocado)
- ❌ Bloqueado: Cadastro **Alocado na Rede** (já comprou kit / ativo)
- Ação: Menu **Ferramentas ▸ Alterar Patrocinador** → `/Distribuidor/DistribuidoresAlterarPatrocinadorFerramenta/listar`

### Excluir da Rede
- Remove o distribuidor da estrutura (marca como excluído)
- **Não apaga dados** — mantém histórico para compliance
- Tela de excluídos: Menu **Distribuidores ▸ Excluídos** → `/Distribuidor/DistribuidoresCadastroExcluido/listar`
- Relatório de excluídos: `/Distribuidor/DistribuidoresInformacoes/excluidos`

### Criar Pedido para Distribuidor
> **Treinamento (Aula 2):** *"Eu seleciono aqui para quem é que eu quero criar o pedido... faz parte aqui dos distribuidores da rede."*

**Fluxo:**
1. Menu **Ferramentas ▸ Criar Pedido** → `/Compras/CriarCompra/principal`
2. Busca distribuidor pelo nome/usuário (autocomplete busca na rede)
3. Adiciona produtos, define forma pagamento/frete
4. Admin pode pagar com bônus do distribuidor ou gerar boleto

---

## Filtros e Busca Avançada

### Filtros Disponíveis (UI)
| Filtro | Tipo | Descrição |
|--------|------|-----------|
| **Busca textual** | Input | Busca por Nome, Usuário, E-mail, CPF |
| **Status** | Select | Ativo / Pendente / Excluído / Inativo |
| **Qualificação** | Select | Bronze, Prata, Ouro, Diamante, etc. |
| **Cidade/Estado** | Select | Localização geográfica |
| **Data Cadastro** | Date range | Período de entrada na rede |
| **Patrocinador** | Input | Filtrar downline de um patrocinador específico |

### Ordenação (Cabeçalhos Clicáveis)
- `di_id` (Nº)
- `di_usuario` (Usuário)
- `di_nome` (Nome)
- `di_email` (E-mail)
- `di_cidade` / `es_uf` (Cidade/Estado)
- `di_data_nascimento` (Data Nasc.)
- `di_data_cad` (Data Cad.)

---

## Indicadores de Resumo (Dashboard da Rede)

No topo da tela, cards com métricas em tempo real:

| Métrica | Fonte | Atualização |
|---------|-------|-------------|
| **Distribuidores na Rede** | `COUNT(*) WHERE status='ativo'` | Tempo real |
| **Pendentes de Alocação** | `COUNT(*) WHERE status='pendente'` | Tempo real |
| **Ativos no Mês** | `AtivacaoMensal` (compra kit/ativação) | Diária |
| **Crescimento (30d)** | `COUNT(*) WHERE data_cad >= NOW() - 30d` | Diária |

> **Relatórios relacionados:**
> - Crescimento da Rede → `/RedeLinear/RelatorioCrescimentoRede/principal/1`
> - Ativos por Região → `/AtivacaoMensal/DistribuidorRelatorioAtivosPorRegiao/listar`
> - Ativos/Inativos no Período → `/AtivacaoMensal/RelatorioAtivosInativosPorPeriodo/principal`

---

## Fluxos de Trabalho Comuns

### 1. Diagnosticar "Não Recebi Meu Bônus"
```
1. Acesse A Rede → Busque o distribuidor
2. Clique 🔑 Login → Entre no escritório virtual dele
3. Verifique: Qualificação atual | Volume Pessoal | Volume Equipe
4. Verifique: Regras de bônus vigentes (Menu Bônus ▸ Relatório de Bônus)
5. Compare: Se qualificado mas bônus não gerou → Verifique processamento (Logs)
```

### 2. Mover Distribuidor Para Outro Patrocinador (Correção)
```
PRÉ-REQUISITO: Distribuidor deve estar PENDENTE (não alocado)
1. Menu Ferramentas ▸ Alterar Patrocinador
2. Busque o distribuidor pendente
3. Selecione novo patrocinador (autocomplete valida se ativo)
4. Confirme → Sistema realoca na árvore
5. Verifique em A Rede ▸ Árvore se posição atualizou
```

### 3. Auditoria de Rede (Mensal)
```
1. Exportar listagem completa (CSV) → Botão Exportar
2. Cruzar com: Relatório Ganhos Gerais (/RedeLinear/Relatorio/relatorioMovimentacao)
3. Verificar: Distribuidores ativos sem qualificação → Ação: contato/reativação
4. Verificar: Pendentes > 30 dias sem comprar kit → Ação: exclusão ou follow-up
```

---

## Permissões Necessárias

| Perfil | Acesso A Rede | Login Escritório Virtual | Alterar Patrocinador | Excluir | Criar Pedido |
|--------|---------------|--------------------------|----------------------|---------|--------------|
| **Admin Master** | ✅ Total | ✅ Total | ✅ | ✅ | ✅ |
| **Gestão Admin** | ✅ Total | ✅ Total | ✅ | ✅ | ✅ |
| **Financeiro** | ✅ Leitura | ❌ | ❌ | ❌ | ✅ (p/ pagamento) |
| **Suporte** | ✅ Leitura | ✅ (diagnóstico) | ❌ | ❌ | ❌ |
| **Operador Catálogo** | ❌ | ❌ | ❌ | ❌ | ❌ |

> **Configuração:** Menu **Configurações ▸ Permissão** → `/Autorizacao/Grupos` → Editar grupo → Marcar "Distribuidores > A Rede"

---

## URLs Relacionadas (Referência Rápida)

| Ação | URL |
|------|-----|
| **Listagem Principal (A Rede)** | `/Distribuidor/DistribuidoresARede/listar` |
| **Árvore/Organograma** | Mesmo endpoint, parâmetro `view=tree` (UI) |
| **Pendentes** | `/Distribuidor/DistribuidoresCadastroPendente/listar` |
| **Excluídos** | `/Distribuidor/DistribuidoresCadastroExcluido/listar` |
| **Relatório Indicados** | `/Distribuidor/Patrocinador/relatorioIndicacoes` |
| **Alterar Patrocinador** | `/Distribuidor/DistribuidoresAlterarPatrocinadorFerramenta/listar` |
| **Alterar Usuário** | `/Distribuidor/DistribuidoresAlterarUsuarioFerramenta/listar` |
| **Info Básicas (Relatório)** | `/Distribuidor/DistribuidoresInformacoes/principal` |
| **Info Excluídos (Relatório)** | `/Distribuidor/DistribuidoresInformacoes/excluidos` |
| **Crescimento da Rede** | `/RedeLinear/RelatorioCrescimentoRede/principal/1` |
| **Ganhos Gerais (Linear)** | `/RedeLinear/Relatorio/relatorioMovimentacao` |
| **Movimentações Unilevel** | `/RedeLinear/Relatorio/relatorioMovimentacoesRedeAdministracao/1` |
| **Qualificações Atingidas** | `/Qualificacao/RelatorioQualificacoes/principal` |

---

## Troubleshooting Comum

| Sintoma | Causa Provável | Solução |
|---------|----------------|---------|
| **Árvore não carrega / fica em branco** | Muitos níveis (performance) | Use Listagem + Filtro por Patrocinador; ou relatório Crescimento da Rede |
| **Login no escritório virtual falha** | Token expirado / Sessão admin conflita | Abra em aba anônima / limpe cookies / use "Login pela Administração" direto |
| **Alterar patrocinador não aparece** | Distribuidor já alocado (ativo) | Regra de negócio: só pendentes. Verifique status em Listagem |
| **Distribuidor não aparece na busca** | Status "Excluído" ou "Inativo" | Ajuste filtro Status para "Todos" ou acesse menu Excluídos |
| **Qualificação não atualizou** | Processamento noturno não rodou | Verifique `/AtivacaoMensal/AtivacaoMensalTransacoes/listar` / Logs |

---

## Boas Práticas Administrativas

1. **Nunca altere patrocinador de ativo** — Mesmo que peça, a regra impede. Oriente a criar novo cadastro correto.
2. **Exporte mensalmente** — Backup da estrutura da rede (CSV) para auditoria/compliance.
3. **Monitore pendentes > 15 dias** — Follow-up automático ou exclusão para limpar base.
4. **Use "Login como Admin" para treinar** — Compartilhe tela mostrando o escritório virtual do próprio distribuidor.
5. **Valide bônus antes de pagar** — Cruze Relatório Ganhos Gerais com Relatório de Bônus (`/Bonus/BonusAdministrador/bonusMes`).

---

## Cross-Reference: Treinamento → Documentação

| Trecho Transcrição (Aula 2) | Seção Neste Doc | URL Real |
|----------------------------|-----------------|----------|
| "escritório virtual de um membro da rede... vê movimentação pessoal... bonificação" | Acessar Escritório Virtual | `/Distribuidor/DistribuidoresARede/listar` → 🔑 Login |
| "rede linear, formato organograma... primeiro downline... acompanha toda produção" | Visualizar Árvore/Downline | Aba Árvore na mesma URL |
| "alterar patrocinador... só pendente... depois alocado não tem como" | Alterar Patrocinador | `/Distribuidor/DistribuidoresAlterarPatrocinadorFerramenta/listar` |
| "distribuidores na rede... quantidade de pessoas... mostra quem teve documento verificado" | Indicadores Resumo / Listagem | Cards topo + colunas listagem |
| "relatório de crescimento da rede... quantos ativos... relatório geral ganhos rede linear" | Relatórios Relacionados | `/RedeLinear/RelatorioCrescimentoRede/principal/1` etc. |

---

## Próximos Documentos da Série

| Documento | Foco |
|-----------|------|
| `pendentes-aprovacao.md` | Gestão de cadastros pendentes, validação documentos, alocação na rede |
| `relatorio-indicados.md` | Relatório de indicados por patrocinador, métricas de indicação |
| `excluidos.md` | Gestão de excluídos, recuperação, relatórios de exclusão |
| `../02-catalogos-planos/planos-adesao.md` | Planos de adesão (kits), valores, regras de compra inicial |
| `../02-catalogos-planos/qualificacoes.md` | Configuração de qualificações, ciclos, requisitos por nível |

---

*Última atualização: 2025-08-11 | Baseado em transcrição Aula 2 + scraping plataforma live (ago/2025)*