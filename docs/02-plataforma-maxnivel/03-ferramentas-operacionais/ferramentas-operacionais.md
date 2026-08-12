# Ferramentas Operacionais — Administração Maxnível

> **Tela principal:** Ferramentas administrativas de operação: estoque, saldos, ativação mensal, pedidos, qualificação manual, alteração de usuário/patrocinador, habilitar produtos por loja.
>
> **Acesso:** Menu **Ferramentas ▸ ...**
> **URLs reais (base `/administracao/`):**
> - Estoque: `/Estoque/MovimentacaoEstoque/principal`
> - Habilitar Produtos Lojas: `/Loja/HabilitarProdutosLoja/principal`
> - Alterar Usuário: `/Distribuidor/DistribuidoresAlterarUsuarioFerramenta/listar`
> - Alterar Patrocinador: `/Distribuidor/DistribuidoresAlterarPatrocinadorFerramenta/listar`
> - Criar Pedido: `/Compras/CriarCompra/principal`
> - Ativação Mensal: `/AtivacaoMensal/AtivacaoMensalTransacoes/listar`
> - Movimentar Saldo: `/Contas/ContasTransacoesFerramenta/listar`
> - Movimentar Saldo CD: `/ContasCd/ContasCdTransacoesFerramenta/listar`
> - Lançar Qualificação Manual: `/Qualificacao/QualificacaoManual/relatorio`
> - Administradores: `/Administrador/AdministradoresCadastros/listar`
> - Bancos: `/ContaBancaria/Bancos/listar`
> - Campos Genéricos: `/Sistema/CamposGenericos`
>
> **Fonte:** Treinamento Aula 2 + Aula 3 + Aula 4

---

## Ferramentas Disponíveis (Visão Geral)

| Ferramenta | Para que serve | Risco |
|-----------|----------------|-------|
| **Estoque** | Movimentação manual de estoque (entrada/saída) | Alto (afeta venda) |
| **Habilitar Produtos Lojas** | Liberar produtos por loja/CD | Médio |
| **Alterar Usuário** | Trocar login de um distribuidor | Alto |
| **Alterar Patrocinador** | Remanejar cadastro pendente p/ outro upline | Alto | 
| **Criar Pedido** | Pedido administrativo p/ distribuidor | Médio |
| **Ativação Mensal** | Registrar/gerenciar ativações | Médio |
| **Movimentar Saldo** | Crédito/débito em conta de distribuidor | 🔴 Crítico |
| **Movimentar Saldo CD** | Crédito/débito em conta de CD | 🔴 Crítico |
| **Lançar Qualificação Manual** | Ajustar qualificação fora do fluxo | Alto |
| **Administradores** | Gestão de usuários admin | 🔴 Crítico |
| **Bancos** | Cadastro de bancos p/ contas | Baixo |
| **Campos Genéricos** | Campos customizados do sistema | Baixo |

---

## 1. Estoque (Movimentação Manual)

**URL:** `/Estoque/MovimentacaoEstoque/principal`

> **Aula 3:** *"Movimentar estoque manual: escolhe o produto, coloca a quantidade da entrada ou saída no estoque, ou carrega o arquivo XML."*

| Ação | Detalhe |
|------|---------|
| Entrada | Recebimento, correção |
| Saída | Baixa manual, ajuste |
| XML | Importação em lote |
| Por opção | Grade tamanho/cor |

> **Relacionado:** Estoque CD é alimentado aqui (remessa) — ver [`04-plataforma-cd/03-gestao-estoque-cd/remessa-industria.md`](../../04-plataforma-cd/03-gestao-estoque-cd/remessa-industria.md)

---

## 2. Habilitar Produtos Lojas

**URL:** `/Loja/HabilitarProdutosLoja/principal`

> **Aula 3:** *"Você define por loja qual categoria/produto vai comercializar... se não tiver marcado, não aparece."*

- Libera/revoga produtos por loja/CD em lote
- Complementa o vínculo individual (Catálogo ▸ Produtos ▸ Ligações)

---

## 3. Alterar Usuário

**URL:** `/Distribuidor/DistribuidoresAlterarUsuarioFerramenta/listar`

- Troca o login (`di_usuario`) de um distribuidor
- **Uso:** Correção de usuário duplicado/errado, transferência de acesso
- ⚠️ Alto risco — mexe em credenciais de acesso

---

## 4. Alterar Patrocinador

**URL:** `/Distribuidor/DistribuidoresAlterarPatrocinadorFerramenta/listar`

> **Aula 2:** *"Permite alterar o patrocinador de um cadastro pendente... só pode ser alterado enquanto estiver pendente, depois que alocado, não tem como mais."*

| Status | Permite? |
|--------|----------|
| **Pendente** | ✅ Sim |
| **Alocado (ativo)** | ❌ Não |

> **Detalhe:** [`01-distribuidores/rede-distribuidores.md`](../01-distribuidores/rede-distribuidores.md)

---

## 5. Criar Pedido (Administrativo)

**URL:** `/Compras/CriarCompra/principal`

> **Aula 2:** *"Eu seleciono para quem é que eu quero criar o pedido... faz parte aqui dos distribuidores da rede."*

```
1. Buscar distribuidor (autocomplete na rede)
2. Adicionar produtos
3. Forma de pagamento / frete
4. Pagamento: bônus do distribuidor ou boleto/cartão
5. Salvar → pedido aparece no histórico do distribuidor
```

**Uso:** Adesão assistida, correção, cobrança manual, pós-reset (kit do cadastro #1).

---

## 6. Ativação Mensal

**URLs:**
- Transações: `/AtivacaoMensal/AtivacaoMensalTransacoes/listar`
- Relatório: `/AtivacaoMensal/AtivacaoMensalTransacoesRelatorio/listar`
- Ativos por Mês: `/AtivacaoMensal/AtivosPorMes`

> **Aula 2:** *"Quando ele compra adesão, ele está isento [de ativação]... o plano dele fica isento... mas você consegue controlar caso habilite algum dia."*

| Conceito | Detalhe |
|----------|---------|
| Ativação mensal | Compra recorrente para manter status ativo |
| Isenção por plano | Plano pode isentar (ex: 12 meses) |
| Registro | Cada transação de ativação é registrada |

---

## 7. Movimentar Saldo (Distribuidor)

**URL:** `/Contas/ContasTransacoesFerramenta/listar`

> **Aula 4 (CD, mesmo padrão p/ dist):** *"Movimentar saldo... crédito para compra de produtos... digitar senha administrativa... movimentação feita com sucesso."*

| Ação | Efeito | Origem |
|------|--------|--------|
| **Crédito** | ➕ saldo do distribuidor | Bônus manual, correção, reembolso |
| **Débito** | ➖ saldo | Estorno, ajuste |

> 🔴 **Crítico:** Exige **senha administrativa** + registra auditoria (quem/quando/valor).

---

## 8. Movimentar Saldo CD

**URL:** `/ContasCd/ContasCdTransacoesFerramenta/listar`

> **Aula 4:** *"Movimentar saldo no CD... Conta CD do CD de Cuiabá, crédito para compra de produtos... R$ 1.000."*

Mesmas regras do Movimentar Saldo, porém **em contas de CD**.

> **Fluxo completo:** [`04-plataforma-cd/04-financeiro-cd/saldo-bonus-compras.md`](../../04-plataforma-cd/04-financeiro-cd/saldo-bonus-compras.md)

---

## 9. Lançar Qualificação Manual

**URL:** `/Qualificacao/QualificacaoManual/relatorio`

> Uso: Ajustar qualificação de um distribuidor fora do fluxo automático (correção, compensação).

⚠️ Alterar qualificação afeta: bônus, visibilidade, privilégios — use com justificativa documentada.

---

## 10. Administradores / Bancos / Campos Genéricos

| Ferramenta | URL | Uso |
|-----------|-----|-----|
| **Administradores** | `/Administrador/AdministradoresCadastros/listar` | Criar/editar usuários admin da plataforma |
| **Meus Dados (admin)** | `/Administrador/AdministradoresEditarDados/formulario` | Perfil do admin logado |
| **Bancos** | `/ContaBancaria/Bancos/listar` | Cadastro de bancos p/ contas bancárias |
| **Campos Genéricos** | `/Sistema/CamposGenericos` | Campos custom anexados ao sistema |

---

## Regras de Negócio (Todas as Ferramentas)

| Regra | Detalhe |
|-------|---------|
| **Senha obrigatória p/ saldos** | Movimentar Saldo/CD exige autenticação |
| **Auditoria total** | Toda movimentação registrada (quem/IP/quando/valor) |
| **Alterar patrocinador: só pendente** | Alocado = bloqueado |
| **Estoque: entrada/saída + XML** | Manual ou lote |
| **Ativação: isenção por plano** | Controlada pelo plano de adesão |
| **Produtos por loja** | Liberação por loja/CD (batch ou individual) |

---

## Links Relacionados

- Saques: [`../04-financeiro-industria/solicitacao-saque.md`](../04-financeiro-industria/solicitacao-saque.md)
- Bônus: [`../04-financeiro-industria/bonus-instalados.md`](../04-financeiro-industria/bonus-instalados.md)
- Estoque CD (remessa): [`../../04-plataforma-cd/03-gestao-estoque-cd/remessa-industria.md`](../../04-plataforma-cd/03-gestao-estoque-cd/remessa-industria.md)

---

*Última atualização: 2025-08-11 | Baseado em Aulas 2-4 + validação plataforma live*