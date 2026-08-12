# CD — Saldo Bônus, Compras e Relatório de Transações

> **Plataforma:** Loja Virtual Admin (token CD) — área Financeiro
> **URLs:** `/finance/transacoes_financeiras`, `/sale/order`, `/finance/cadastrar_conta_bancaria`, `/finance/solicitacao_saque`
> **Fonte:** Treinamento Aula 4 (segmentos 121–216)

---

## Visão Geral

O Financeiro do CD gira em torno do **saldo em conta CD** (crédito para compra de produtos) e dos **relatórios** que registram cada movimentação:

| Ação | Efeito no Saldo | Origem |
|------|-----------------|--------|
| **Crédito (Maxnível movimenta saldo)** | ➕ Saldo | Admin Maxnível ▸ Ferramentas ▸ Movimentar Saldo CD |
| **Compra de produto da indústria** | ➖ Saldo | CD ▸ Comprar Produtos (pagamento com bônus) |
| **Venda ao distribuidor (balcão)** | ➕ Saldo | CD ▸ Pedido ▸ Pagamento (bônus do dist / dinheiro) |
| **Solicitação de saque** | ➖ Saldo | CD ▸ Financeiro ▸ Solicitação de Saque |
| **Taxa de saque (ex: 5%)** | ➖ Saldo (junto do saque) | Regra de saque (configurada na Maxnível) |

---

## Fluxo 1 — Creditar Saldo no CD (Maxnível)

> **Aula 4:** *"Tem uma ferramenta aqui na administração que ela chama Movimentar Saldo no CD... Vou movimentar um saldo de bônus no escritório do CD... Conta CD do CD de Cuiabá, crédito para compra de produtos. Vou creditar R$ 1.000."*

**URL:** `https://allinbrasil.com.br/administracao/ContasCd/ContasCdTransacoesFerramenta/listar`

```
1. Selecionar CD (ex: CD Cuiabá)
2. Tipo de transação: Crédito para compra de produtos
3. Valor: R$ 1.000,00
4. Digitar SENHA ADMINISTRATIVA (autenticação da operação)
5. Confirmar → "Movimentação feita com sucesso"
```

> **Regra:** Toda movimentação exige senha do admin — auditoria rastreável (quem, quando, valor).

---

## Fluxo 2 — Compra do CD na Maxnível (com Bônus)

> **Aula 4:** *"Ele vai clicar aqui, ó, comprar produto... ele tá comprando da loja da indústria... Disponível para ele [só produtos liberados]... Coloquei o produto no carrinho... Finalizar pedido... pode pagar ou retirar na loja da indústria ou pagar com bônus... Confirma o pagamento, o pedido tá concluído... CD Cuiabá comprou R$ 100... pagou com bônus... No relatório das transações: pagamento do pedido 12, debitou R$ 100, agora ele tá com 900."*

### Pré-condições
- Produto marcado com forma de pagamento **"Centro Distribuição"** (e Bônus, se for pagar com bônus)
- CD tem **saldo** suficiente (senão checkout não oferece bônus — ver erro no treinamento)

### Passos (na plataforma do CD)

```
1. Catálogo ▸ Produtos ▸ [Comprar Produto]
   → Lista SOMENTE produtos liberados para este CD
2. Adicionar ao carrinho
3. [Finalizar Pedido]
4. Endereço de Fatura / Entrega
5. Método de Entrega:
   ▸ Retirada na Loja (indústria) — se habilitado
   ▸ Frete — se habilitado
6. Método de Pagamento:
   ▸ Bônus (saldo conta CD) ← ex: R$ 100 via bônus
   ▸ Cartão (PagSeguro) / Boleto (BB)
7. [Confirmar Pagamento]
```

### Resultado

| Onde ver | O que aparece |
|----------|---------------|
| **CD ▸ Relatório Transações** | ➖ -R$ 100 (pagamento pedido 12), saldo R$ 1000 → R$ 900 |
| **Maxnível ▸ Vendas e Pedidos** | Pedido de compra do CD (pago) — CD Cuiabá |
| **CD ▸ Catálogo ▸ Produtos (Estoque)** | Estoque aumentado (estoque entra automático pós-pagamento) |

> ⚠️ **Detalhe do treinamento:** Bônus só é detectado se o pedido for criado **com saldo já disponível**. Se criar pedido "aberto" e creditar depois, o checkout não recalcula — **refaça o pedido**.

---

## Fluxo 3 — Venda do CD para Distribuidor

O distribuidor compra na loja pública:
- Escolhe loja **CD Cuiabá** + **Retirar no CD**
- Paga **via bônus** (saldo loja online do dist) OU **no balcão**

| Pagamento | Efeito no CD |
|-----------|--------------|
| Distribuidor paga com bônus | Bônus é creditado na conta do CD automaticamente |
| Distribuidor paga no balcão | Atendente registra pagamento → crédito no CD + comissão gerada |

> **Detalhe completo do fluxo:** [`../05-pedidos-retirada/fluxo-compra-distribuidor.md`](../05-pedidos-retirada/fluxo-compra-distribuidor.md)

---

## Fluxo 4 — Solicitação de Saque do CD

> **Aula 3 (treinamento da loja):** *"Cadastrar conta para CD... ele próprio cadastrar a conta bancária para solicitar saque... seleciona o banco e preenche o formulário."*

### Criar conta bancária (CD)
**URL:** `/finance/cadastrar_conta_bancaria`

```
1. Financeiro ▸ Cadastrar Conta Para CD
2. Selecionar Banco
3. Preencher: agência, conta, dígito, titular, CPF/CNPJ
4. [Salvar] → conta criada (usada no saque)
```

### Definir regra de saque (Maxnível)
> **Aula 4:** *"Tem que criar uma regra de saque lá na indústria... configurações ▸ módulos ▸ solicitação de saque de CD... valor mínimo R$ 100... período do dia 20 ao 25... pagamento do dia 1 ao 5... Vou colocar 5% de taxa, percentual do valor."*

```
1. Admin Maxnível ▸ Configurações ▸ Módulos ▸ "Solicitação de Saque de CD"
2. Editar regra:
   ▸ Valor mínimo: R$ 100
   ▸ Período de solicitação: dia 20 a 25
   ▸ Período de pagamento: dia 1 a 5
   ▸ Taxa de saque: 5% (percentual) — opcional
3. Salvar (aplicado por módulo)
```

### Solicitar saque (CD)
**URL:** `/finance/solicitacao_saque`

```
1. Financeiro ▸ Solicitação de Saque
2. Verifica regra vigente (valor mínimo, período)
3. Informar valor (ex: R$ 100)
4. Tela mostra: bruto R$ 100 − taxa 5% = líquido R$ 95
5. Selecionar conta bancária
6. Digitar SENHA
7. [Requisitar] → sistema debita saldo (R$ 100) → saldo atualizado (ex: R$ 950 → R$ 850)
```

### Aprovar pagamento (Maxnível)
> **Aula 4:** *"Esse pedido de saque chega aqui... Relatórios ▸ Informações ▸ Lojas/CDs ▸ Solicitação de Saque de CD... Você externamente tem que fazer o depósito na conta bancária dele... aqui tá todos os dados da conta bancária... e depois marca que foi depositado."*

```
1. Admin Maxnível ▸ Relatórios ▸ Solicitação de Saque CD
   URL: /SolicitacaoSaqueCd/SolicitacaoSaqueCdTransacoesAdmin/listar
2. Localizar pedido (CD, valor, conta, taxa)
3. Fazer depósito bancário (fora do sistema)
4. Marcar pedido como "depositado"
```

---

## Relatório das Transações (CD)

> **Aula 4:** *"Relatório de transações, que seria o relatório que ele já movimentou... recebeu o pedido 3 lá na compra do Z2, R$ 50."*

**URL:** `/finance/transacoes_financeiras`

| Coluna | Exemplo |
|--------|---------|
| Data/Hora | 11/08/2025 14:32 |
| Tipo | Crédito / Débito |
| Descrição | "Crédito para compra de produtos", "Pagamento pedido 12", "Compra do Z2", "Saque" |
| Valor | +R$ 1.000 / −R$ 100 / +R$ 50 / −R$ 95 |
| Saldo após | R$ 1.000 → R$ 900 → R$ 950 → R$ 855 |
| Referência | Nº pedido / ID transação |

> **Auditoria:** Cada linha tem origem rastreável (pedido, admin, saque). Use para conferência mensal e fechamento.

---

## Fechamento de Caixa (CD)

> **Aula 4:** *"Fechamento de caixa... ele é filtrado pro dia atual, mas se você quiser limpar aqui, ele mostra todos os registros... paga com bônus R$ 50, paga ao retirar na loja R$ 50 também."*

**URL:** `/finance/fechamento_caixa`

```
1. Financeiro ▸ Fechamento de Caixa
2. Filtro padrão: DIA ATUAL
3. Limpar filtro → todos os registros
4. Exibe: valores por forma de pagamento (bônus, dinheiro, cartão, boleto)
```

| Forma Pagamento | Valor |
|-----------------|-------|
| Bônus | R$ 50,00 |
| Retirada na Loja (balcão) | R$ 50,00 |
| **Total** | **R$ 100,00** |

---

## Regras de Negócio (Consolidadas)

| Regra | Detalhe |
|-------|---------|
| **Saldo CD é independente do saldo do distribuidor** | Plataformas separadas — bônus de dist não circula no CD |
| **Movimentação de saldo exige senha do admin** | Auditoria obrigatória |
| **Crédito só pela Maxnível** (ou compra/venda) | CD não se auto-credita |
| **Estoque CD:** remessa reconhecida OU compra paga | Entrada automática pós-pagamento |
| **Saques respeitam período + valor mínimo + taxa** | Configurado no módulo (Maxnível) |
| **Taxa de saque percentual** | Ex: 5% → líquido = bruto − 5% |
| **Depósito do saque é externo** | Matriz paga fora do sistema e marca "depositado" |
| **Pedido com bônus: saldo deve existir ANTES do pedido** | Refaça pedido se creditou depois |

---

## Troubleshooting

| Sintoma | Causa | Solução |
|---------|-------|---------|
| Checkout CD não oferece "bônus" | CD sem saldo OU produto sem forma "CD/Bônus" | Creditar saldo / marcar forma no produto |
| Saldo creditado mas checkout não usa | Pedido criado antes do crédito | Refazer pedido |
| Saque não aparece na regra | Fora do período / abaixo do mínimo | Aguardar período / informar valor ≥ mínimo |
| Taxa de saque errada | Regra de módulo desatualizada | Verificar módulo "Solicitação de Saque CD" na Maxnível |
| Fechamento de caixa vazio | Filtro "dia atual" sem vendas no dia | Limpar filtro p/ ver histórico |

---

## Links Relacionados

- Saque CD (regras/taxas): `solicitacao-saque-cd.md` ⏳
- Faturamento anual CD: `faturamento-anual-cd.md` ⏳
- Compra distribuidor no CD (fluxo): [`../05-pedidos-retirada/fluxo-compra-distribuidor.md`](../05-pedidos-retirada/fluxo-compra-distribuidor.md)
- Movimentar Saldo CD (Maxnível): [`../../02-plataforma-maxnivel/03-ferramentas-operacionais/movimentar-saldo-cd.md`](../../02-plataforma-maxnivel/03-ferramentas-operacionais/movimentar-saldo-cd.md) ⏳
- Provedores de pagamento: [`../../03-plataforma-loja-virtual/05-configuracoes-loja/pagamentos.md`](../../03-plataforma-loja-virtual/05-configuracoes-loja/pagamentos.md) ⏳

---

*Última atualização: 2025-08-11 | Baseado em Aula 3 + Aula 4 (financeiro CD) + validação plataforma live*