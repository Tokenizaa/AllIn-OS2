# Distribuidores Excluídos — Gestão e Reversão

> **Tela principal:** Cadastros de distribuidores que foram excluídos (manual ou automaticamente), com possibilidade de **reversão** para Pendentes.
>
> **URL real:** `https://allinbrasil.com.br/administracao/Distribuidor/DistribuidoresCadastroExcluido/listar`
> **Acesso:** Menu **Distribuidores ▸ Excluídos**
> **Fonte:** Treinamento Aula 2

---

## Visão Geral

A tela **Excluídos** lista distribuidores removidos da base. Exclusão pode ser:

| Origem | Descrição |
|--------|-----------|
| **Manual** (admin) | Admin exclui cadastro pendente (bloqueio de acesso) |
| **Automática** | Regra de exclusão (ex: 30 dias sem comprar adesão) |
| **Pós-reset** | Reset do sistema move cadastros não-alocados para pendentes/excluídos |

> **Aula 2:** *"Quando eu excluo, ele não [acessa]... mas tem como reverter ainda esse cadastro... quando você reverte, ele volta para o menu de cadastro pendente."*

---

## Ações Disponíveis

| Ação | Descrição | URL |
|------|-----------|-----|
| **Reverter** | Devolve cadastro para Pendentes (mantém dados) | ação na listagem |
| **Ver dados** | Consulta informações do excluído | — |
| **Excluir definitivamente** | Remoção irreversível (⚠️ raro, cuidado) | ação de remoção |
| **Relatório info excluídos** | Dados completos dos excluídos | `/Distribuidor/DistribuidoresInformacoes/excluidos` |

---

## Fluxo de Reversão (Comum)

> **Aula 2:** *"Se ele tiver excluído, você reverte o cadastro dele, ele vai voltar a ser pendente."*

```
1. Distribuidores ▸ Excluídos
2. Localizar cadastro (busca por nome/usuário/e-mail)
3. [Reverter]
4. Cadastro volta para: Distribuidores ▸ Pendentes
5. A partir daí: pagar adesão → validar docs → alocar na rede
```

---

## Regras de Negócio

| Regra | Detalhe |
|-------|---------|
| **Exclusão de pendente é reversível** | Voltam a Pendentes sem perder dados |
| **Excluído perde acesso** | Login no escritório virtual bloqueado |
| **Pós-reset** | Cadastros de teste excluídos podem ser revertidos para realocar |
| **Exclusão automática** | Prazo configurável + aviso por e-mail (ver `pendentes-aprovacao.md`) |
| **Relatório de exclusão** | `/ExcluirDistribuidorAutomatico/RelatorioDistribuidorDataExclusao/principal` mostra data da exclusão |

---

## URLs Relacionadas

| Ação | URL |
|------|-----|
| Listagem Excluídos | `/Distribuidor/DistribuidoresCadastroExcluido/listar` |
| Info Básicas Excluídos (relatório) | `/Distribuidor/DistribuidoresInformacoes/excluidos` |
| Relatório Data Exclusão | `/ExcluirDistribuidorAutomatico/RelatorioDistribuidorDataExclusao/principal` |
| Pendentes (destino da reversão) | `/Distribuidor/DistribuidoresCadastroPendente/listar` |

---

## Links Relacionados

- Gestão de pendentes: [`pendentes-aprovacao.md`](pendentes-aprovacao.md)
- Rede ativa: [`rede-distribuidores.md`](rede-distribuidores.md)
- Reset pós-teste: [`../../04-plataforma-cd/07-go-live-checklist/reset-teste-producao.md`](../../04-plataforma-cd/07-go-live-checklist/reset-teste-producao.md)

---

*Última atualização: 2025-08-11 | Baseado em Aula 2 + validação plataforma live*