# Cadastros Pendentes — Aprovação, Validação e Alocação na Rede

> **Tela principal:** Gestão de distribuidores que se cadastraram mas ainda não foram alocados na rede (pagamento de adesão pendente, documentos em validação, exclusão/reversão).
>
> **URL real:** `https://allinbrasil.com.br/administracao/Distribuidor/DistribuidoresCadastroPendente/listar`
> **Acesso:** Menu **Distribuidores ▸ Pendentes**
> **Fonte:** Treinamento Aula 2

---

## Visão Geral

A tela **Pendentes** concentra todos os cadastros que **não estão alocados na rede**:

| Situação | O que aconteceu | O que fazer |
|----------|-----------------|-------------|
| **Cadastro criado, adesão não paga** | Pessoa se cadastrou mas não comprou o kit | Acompanhar, cobrar, excluir (regra automática) |
| **Adesão comprada, pagamento não reconhecido** | Comprou kit mas pagamento pendente | Reconhecer pagamento → **alocar na rede** |
| **Documento em análise** | Enviou docs (CPF, comprovante, RG) | **Validar documento** → aprovar/reprovar |
| **Excluído (reversível)** | Foi excluído do cadastro | **Reverter** → volta para pendente |

> **Aula 2:** *"Pendentes são pessoas que compraram adesão... e estão pendentes de alocamento na rede."*

---

## Estrutura da Tela

```
┌─────────────────────────────────────────────────────────────────┐
│ Distribuidores ▸ Pendentes                    [Exportar] [Filtros]│
├─────────────────────────────────────────────────────────────────┤
│ Filtros: Status | Documento aprovado | Período | Busca          │
├─────────────────────────────────────────────────────────────────┤
│ 👤 Usuário | Nome | E-mail | Data Cad. | Status Doc | Ações     │
│ Z4       | ...  | ...   | 11/08/2025 | ⚠️ Pendente | ✏️ 👁 🗑 🔄 │
└─────────────────────────────────────────────────────────────────┘
```

### Colunas típicas

| Coluna | Descrição |
|--------|-----------|
| Usuário / Nome | Identificação do cadastro |
| E-mail | Contato |
| Data Cadastro | Quando se cadastrou |
| Status Documento | Em análise / Aprovado / Reprovado |
| Adesão | Paga / Não paga / Pendente |
| **Ações** | Editar | Ver documento | Excluir | Reverter | Alocar |

---

## Funcionalidades Principais

### 1. Validar Documentos

> **Aula 2:** *"Por padrão, para cadastros de pessoa física, tá habilitado [enviar] contrato, CPF... você vai validar esse documento dele... dá o parecer, clica em ver documento... tá aqui a imagem que ele enviou."*

**Documentos típicos exigidos:**
- CPF
- Comprovante de endereço
- RG
- Contrato assinado

**Fluxo de validação:**
```
1. Pendentes ▸ localizar cadastro
2. [Ver Documento] → visualiza imagem/PDF enviado
3. Dar parecer: Aprovado / Reprovado (com motivo)
4. Documento aprovado → cadastro avança para alocação
```

> **Regra:** Documentação validada é **requisito** para liberar saque e alocação. Configuração dos docs exigidos: menu **Cadastros ▸ Campos/Verificação Conta** → `/VerificacaoConta/VerificacaoContaCategoriaCrud/listar`

### 2. Editar Dados do Cadastro Pendente

> **Aula 2:** *"Você tem acesso a editar os dados cadastrais do cadastro pendente."*

- Corrige erros de digitação (nome, CPF, endereço)
- Reenvia link de cadastro se necessário
- Ações: `✏️ Editar`

### 3. Excluir Cadastro Pendente

> **Aula 2:** *"Eu quero bloquear o acesso dela e excluir ela da rede... clica em excluir... Excluir do cadastro... Ele vem para cá, ó, excluídos... Quando eu excluo, ele não [consegue mais acessar]."*

```
1. Pendentes ▸ cadastro alvo
2. [Excluir] → confirmação → OK
3. Cadastro move para: Distribuidores ▸ Excluídos
4. Pessoa perde acesso ao escritório virtual
```

> ⚠️ **Reversível:** A exclusão de pendente pode ser **revertida** (volta para pendente).

### 4. Reverter Exclusão

> **Aula 2:** *"Tá aqui o Z4 excluído... quando eu excluo, ele não [acessa]... mas tem como reverter ainda esse cadastro... quando você reverte, ele volta aqui pro menu de cadastro pendente... ele pode dar continuidade."*

```
1. Distribuidores ▸ Excluídos
2. Localizar cadastro → [Reverter]
3. Cadastro volta para Pendentes (mesma condição de antes)
4. Distribuidor pode retomar: pagar adesão, validar docs, alocar
```

### 5. Alocar na Rede (Após Pagamento da Adesão)

> **Aula 2 & 4:** *"Ele comprou adesão... clica aqui e aloca ele na rede... compra o kit inicial para ele... Alocou ele na rede, aí depois que alocou que você vai conseguir começar os seus cadastros. Sem fazer isso não tem como."*

```
1. Pendentes ▸ cadastro com adesão PAGA
2. Alocar: comprar kit inicial p/ ele (admin paga)
3. Forma de pagamento: Retirar na Loja (cadastro da empresa)
4. Sistema aloca na árvore → sai de Pendentes
5. Aparece em: Distribuidores ▸ A Rede
```

> **Crítico pós-reset:** O cadastro **#1** (dono da empresa) precisa ser realocado assim — sem isso, nenhum novo cadastro é alocado. Detalhe: [`04-plataforma-cd/07-go-live-checklist/reset-teste-producao.md`](../../04-plataforma-cd/07-go-live-checklist/reset-teste-producao.md)

---

## Regra de Exclusão Automática (Cadastro sem Adesão)

> **Aula 2:** *"Se a pessoa não comprar a adesão dela em 30 dias... ela vai ter o cadastro excluído de forma automática... o sistema detectar que alguém vai ser excluído... ele vai enviar um e-mail... 'tal distribuidor vai ser excluído'... com 10 dias antes de excluir... Criei a regra automática."*

| Parâmetro | Valor típico |
|-----------|--------------|
| Prazo sem comprar adesão | 30 dias |
| Aviso antecipado | E-mail ao admin (10 dias antes) |
| Ação | Exclusão automática → move para Excluídos |

**Configuração:** Admin Maxnível ▸ (módulo de exclusão automática / regra de adesão) — referenciado em `Planos de Adesão`.

---

## Regras de Negócio

| Regra | Detalhe |
|-------|---------|
| **Pendente ≠ Ativo** | Não aparece em "A Rede" até alocar |
| **Alterar patrocinador: só pendente** | Após alocado, patrocinador é fixo |
| **Documento obrigatório p/ saque** | Sem validação de documento → sem saque |
| **Exclusão reversível** | Pendente excluído pode ser revertido |
| **Pós-reset: cadastro #1 pendente** | Reverter se excluído → comprar kit → alocar |
| **Exclusão automática configurável** | Prazo + aviso por e-mail |

---

## Troubleshooting

| Sintoma | Causa | Solução |
|---------|-------|---------|
| Pessoa cadastrada não aparece na rede | Ainda pendente (adesão não paga) | Verificar em Pendentes / cobrar adesão |
| Cadastro somou de Pendentes | Exclusão automática (prazo) OU manual | Reverter em Excluídos |
| Não consigo alterar patrocinador | Distribuidor já alocado | Regra: só pendente |
| Pós-reset: nada aloca | Cadastro #1 não realocado | Comprar kit p/ cadastro #1 (crítico) |
| Documento não aparece p/ validar | Categoria doc desabilitada OU upload não feito | Verificar `/VerificacaoConta/VerificacaoContaCategoriaCrud/listar` |

---

## URLs Relacionadas

| Ação | URL |
|------|-----|
| Listagem Pendentes | `/Distribuidor/DistribuidoresCadastroPendente/listar` |
| Listagem Excluídos | `/Distribuidor/DistribuidoresCadastroExcluido/listar` |
| Verificação Docs (em análise) | `/VerificacaoConta/VerificacaoContaArquivosEmAnalise/listar` |
| Verificação Docs (por distribuidor) | `/VerificacaoConta/VerificacaoContaArquivosDistribuidor/principal/{id}` |
| Categorias de Verificação | `/VerificacaoConta/VerificacaoContaCategoriaCrud/listar` |
| A Rede (pós-alocação) | `/Distribuidor/DistribuidoresARede/listar` |
| Relatório Excluídos (info) | `/Distribuidor/DistribuidoresInformacoes/excluidos` |
| Exclusão Automática (relatório) | `/ExcluirDistribuidorAutomatico/RelatorioDistribuidorDataExclusao/principal` |

---

## Links Relacionados

- Rede de distribuidores: [`rede-distribuidores.md`](rede-distribuidores.md)
- Excluídos (gestão): `excluidos.md` ⏳
- Relatório de indicados: `relatorio-indicados.md` ⏳
- Planos de adesão: [`../02-catalogos-planos/planos-adesao.md`](../02-catalogos-planos/planos-adesao.md)
- Reset pós-teste (realocar #1): [`../../04-plataforma-cd/07-go-live-checklist/reset-teste-producao.md`](../../04-plataforma-cd/07-go-live-checklist/reset-teste-producao.md)

---

*Última atualização: 2025-08-11 | Baseado em Aula 2 + validação plataforma live*