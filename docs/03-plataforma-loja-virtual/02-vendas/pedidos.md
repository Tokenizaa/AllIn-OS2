# Vendas — Pedidos e Devoluções (Loja Virtual)

> **Tela principal:** Gestão completa de pedidos da loja — consulta, status, histórico, baixa de pagamento, despacho, notificação, devoluções.
>
> **URL real:** `https://allinbrasil.com.br/loja/admin/sale/order`
> **Devoluções:** `https://allinbrasil.com.br/loja/admin/sale/return`
> **Carrinhos Abandonados:** `https://allinbrasil.com.br/loja/admin/sale/carrinhos_abandonados/relatorio`
> **Acesso:** Menu lateral **Vendas ▸ Pedidos** | **Devoluções**
> **Fonte:** Treinamento Aula 3

---

## Visão Geral

O módulo **Pedidos** centraliza toda a operação de vendas:

- Visualizar pedidos com dados completos (cliente, pagamento, envio, itens)
- Alterar **status** e registrar **histórico** (auditoria visível ao cliente)
- **Dar baixa** em pagamento (pedido pago → bônus/comissão gerados)
- **Despachar** com código de rastreio e **notificar** cliente
- **Solicitações de devolução** com solução (crédito, troca, reenvio)

> **Aula 3:** *"Vendas e pedidos aqui, ó, é onde você visualiza os pedidos lá da loja... os dados do pedido, o status, os detalhes do pedido, detalhes do distribuidor, do pagamento, do envio... E aqui tem um histórico do pedido. Toda vez que o pedido muda de status, ele alimenta automaticamente."*

---

## Listagem de Pedidos

```
┌────────────────────────────────────────────────────────────────────────────┐
│ Pedidos                                        [+ Novo] [Filtros] [Exportar]│
├──────┬───────────┬──────────────┬───────────┬───────────┬────────┬─────────┤
│ ID   │ Cliente   │ Total        │ Status    │ Data      │ Pag.   │ Ações   │
│ 25469│ João Silva│ R$ 450,00    │ Entregue  │ 11/08     │ Pago   │ 👁 ✏️ 🗑 │
│ 25468│ CD Cuiabá │ R$ 100,00    │ Pago      │ 10/08     │ Bônus  │ 👁 ✏️ 🗑 │
└──────┴───────────┴──────────────┴───────────┴───────────┴────────┴─────────┘
```

### Colunas típicas
| Coluna | Descrição |
|--------|-----------|
| **ID** | Número do pedido (ex: 25469) |
| **Cliente** | Comprador (distribuidor, CD, cliente final) |
| **Total** | Valor do pedido |
| **Status** | Pedido Realizado → Pago → Despachado → Entregue / Cancelado |
| **Data** | Data de criação |
| **Pagamento** | Forma (PagSeguro, Bônus, Boleto, Balcão) |
| **Ações** | Ver detalhes | Editar | Excluir |

---

## Detalhe do Pedido — Abas

### Aba: Informações do Pedido

| Bloco | Conteúdo |
|-------|----------|
| **Detalhes do Pedido** | Nº, status, data, forma de pagamento |
| **Detalhes do Cliente** | Nome, e-mail, telefone, grupo |
| **Detalhes do Pagamento** | Endereço de fatura, forma, transação |
| **Detalhes do Envio** | Endereço de entrega, método de frete |
| **Produtos** | Itens, quantidades, preços, total |
| **Histórico** | Timeline de status/comentários |

### Aba: Histórico do Pedido

> **Aula 3:** *"Esse histórico do pedido... toda vez que o pedido muda de status, ele alimenta automaticamente... mostra aqui para ela [cliente]... desde que foi despachado... No dia 24/06 o pedido dela foi despachado. Tá aqui o comentário que a empresa fez."*

| Evento | Registro automático |
|--------|---------------------|
| Pedido criado | ✅ |
| Pagamento confirmado (baixa) | ✅ "Compra paga, status pedido pago" |
| Status alterado via histórico | ✅ (com comentário opcional) |
| Despacho | ✅ "Pedido despachado" |
| Entrega | ✅ "Entregue — conforme notificado pelos Correios" |
| Cancelamento | ✅ |

> ⚠️ **Atenção:** Alterar status **diretamente no campo** (sem passar pelo histórico) **NÃO alimenta o histórico** — use o botão de adicionar histórico para registro completo.

---

## Fluxos Principais

### 1. Dar Baixa em Pagamento

> **Aula 3:** *"Confirmar baixa... o status do pedido dela agora tá pago. Se a gente voltar lá no histórico, foi alimentado: compra paga, status pedido pago, cliente não foi notificado."*

```
1. Pedidos ▸ abrir pedido
2. [Confirmar Baixa] (pagamento manual: boleto compensado, balcão, etc.)
3. Status → "Pago"
4. Histórico registra automaticamente
5. Bônus/comissão da rede são gerados
```

### 2. Despachar Pedido (com Rastreio)

```
1. Pedido ▸ status → "Despachado"
2. Informar CÓDIGO DE RASTREIO
3. [Notificar] cliente (e-mail automático)
4. Histórico: "Pedido despachado — [código]"
```

> **Aula 3:** *"Ele vai lá, viu que o pedido tava pago, separou o produto, embalou e despachou via Correios... código de rastreio... conforme notificado pelos Correios."*

### 3. Registrar Entrega

```
1. Pedido ▸ [Entregue]
2. Comentário: "Conforme notificado pelos Correios, a mercadoria foi entregue"
3. [Notificar] cliente
```

### 4. Devolução (Cliente Solicita)

> **Aula 3:** *"Devolução aqui, ó, quando a pessoa acessa a loja... ela clica aqui, ó, solicitar devolução... número do pedido que ela quer [devolver]... Esse pedido de devolução chega aqui [no admin]... você vai clicar e tomar a providência."*

**Fluxo completo:**

```
CLIENTE (loja pública):
1. Acessa pedido → [Solicitar Devolução]
2. Informa: nº do pedido, motivo, detalhes
3. Envia → pedido de devolução gerado

ADMIN (Loja Virtual):
4. Vendas ▸ Devoluções → vê solicitação
5. Toma providência: analisa pedido
6. Dá SOLUÇÃO: 
   ▸ Crédito (reembolso)
   ▸ Troca de mercadoria
   ▸ Reenvio (substituição enviada)
7. Informa cliente sobre a solução
```

> **Configurações de devolução:** Menu Configurações ▸ Situações/Motivos/Soluções → `/localisation/return_status`, `/return_reason`, `/return_action`

---

## Carrinhos Abandonados

**URL:** `/sale/carrinhos_abandonados/relatorio`

- Lista carrinhos iniciados e não finalizados
- Filtro por período
- Recuperação: contato com cliente / link do carrinho

---

## Regras de Negócio

| Regra | Detalhe |
|-------|---------|
| **Status alterado via campo ≠ histórico** | Use "adicionar histórico" para auditoria completa |
| **Baixa de pagamento gera bônus** | Comissão do patrocinador gerada no momento da baixa |
| **NF-e via Bling** | Pedido → exporta dados p/ Bling → emissão da NF-e lá (Maxível não emite NF-e) |
| **Notificação opcional** | Notificar cliente a cada mudança de status |
| **Pagamento com bônus exige saldo prévio** | Pedido criado sem saldo não recalcula (ver CD financeiro) |

---

## Permissões Necessárias

| Perfil | Ver Pedidos | Baixa Pagamento | Alterar Status | Devolução | Excluir |
|--------|-------------|-----------------|----------------|-----------|---------|
| **Admin Loja** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Financeiro** | ✅ | ✅ | ✅ | ✅ | ❌ |
| **Operador Catálogo** | ✅ | ❌ | ❌ | ❌ | ❌ |
| **Gerente CD** | ✅ (próprios) | ✅ (balcão) | ✅ | ❌ | ❌ |

---

## Troubleshooting

| Sintoma | Causa | Solução |
|---------|-------|---------|
| Cliente diz "pagou mas pedido não mudou" | Baixa manual não feita (boleto compensado fora do sistema) | [Confirmar Baixa] no pedido |
| Histórico incompleto | Status alterado direto no campo | Refazer via "adicionar histórico" |
| Bônus não gerado | Pedido sem baixa | Dar baixa → bônus gera |
| Rastreio não chega ao cliente | Notificação não enviada | [Notificar] após preencher código |
| Devolução sem solução | Admin não tomou providência | Analisar em Devoluções e dar solução |

---

## URLs Relacionadas

| Ação | URL |
|------|-----|
| Pedidos (listagem) | `/sale/order` |
| Detalhe/Editar pedido | `/sale/order/edit&order_id={id}` |
| Exibir pedido (info) | `/sale/order/info?order_id={id}` |
| Devoluções | `/sale/return` |
| Carrinhos Abandonados | `/sale/carrinhos_abandonados/relatorio` |
| Situações de Pedidos | `/localisation/order_status` |
| Situações de Devolução | `/localisation/return_status` |
| Motivos de Devolução | `/localisation/return_reason` |
| Soluções de Devolução | `/localisation/return_action` |

---

## Links Relacionados

- Produtos (liberação CD/formas pagamento): [`../01-catalogo/produtos.md`](../01-catalogo/produtos.md)
- Fluxo compra distribuidor no CD: [`../../04-plataforma-cd/05-pedidos-retirada/fluxo-compra-distribuidor.md`](../../04-plataforma-cd/05-pedidos-retirada/fluxo-compra-distribuidor.md)
- Pagamentos (PagSeguro/Boleto/Bônus): [`../05-configuracoes-loja/pagamentos.md`](../05-configuracoes-loja/pagamentos.md) ⏳
- Fretes: [`../05-configuracoes-loja/fretes.md`](../05-configuracoes-loja/fretes.md) ⏳

---

*Última atualização: 2025-08-11 | Baseado em Aula 3 + validação plataforma live*