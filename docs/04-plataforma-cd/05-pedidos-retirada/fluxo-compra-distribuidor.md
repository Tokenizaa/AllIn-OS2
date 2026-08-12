# Fluxo: Compra do Distribuidor no CD + Retirada no Balcão

> **Cenário:** Distribuidor compra produto escolhendo "Retirar no CD" e depois retira pessoalmente no balcão do CD (pagamento via bônus ou no local).
>
> **Fonte:** Treinamento Aula 4 (segmentos 173–216)
> **Plataformas envolvidas:** Loja Pública (checkout) + Loja Virtual Admin (CD)

---

## Visão Geral do Fluxo

```
┌──────────┐     1. Login          ┌────────────────────┐
│DISTRIBUIDOR│ ───────────────────▶ │ Escritório Virtual │
└──────────┘                        └────────────────────┘
        │  2. Compra Padrão → produto no carrinho
        ▼
┌──────────────────────────┐
│ CHECKOUT                 │
│ • Escolher Loja: CD Cuiabá│
│ • Retirada: "Retirar no  │
│   CD" → CD Cuiabá        │
│ • Pagamento: Bônus OR    │
│   Pagar no Local         │
└──────────────────────────┘
        │  3. Pedido gerado (ID: 13/14)
        ▼
┌──────────────────────────┐     4. Pedido aparece
│ BALCÃO DO CD (atendente) │ ◀───────────────────────
│ • Ver Pedidos            │      na plataforma do CD
│ • Separar mercadoria     │
│ • Pagamento local (se    │
│   "aguardando pagamento")│
│ • Marcar "Produto        │
│   Entregue" no histórico │
└──────────────────────────┘
        │  5. Histórico registrado
        ▼
        FIM ✅
```

---

## Passo a Passo Detalhado

### ETAPA 1 — Distribuidor inicia a compra (Escritório Virtual)

> **Aula 4:** *"O distribuidor Z2 tá com R$ 550 de saldo na conta... saldo loja online... clicou compra padrão... escolher comprar esse produto."*

```
1. Distribuidor logado no Escritório Virtual (área pública)
2. Acessa "Compra Padrão" (loja online)
3. Seleciona o produto desejado → [Comprar]
4. Produto vai para o carrinho
```

**Pré-condições (lado CD/Maxnível):**
- Produto liberado para o CD (categoria + produto + forma "Centro Distribuição")
- CD tem estoque (remessa reconhecida OU compra CD paga)
- Frete "Retirada no CD" habilitado para o CD

### ETAPA 2 — No checkout: escolher loja e retirada

> **Aula 4:** *"Ele pode trocar a loja aqui, ó. Vem cá, escolhe, né? CD Cuiabá, CD Goiânia... Ele vem aqui, ó, retirar no CD, CD Cuiabá. Clica em continuar."*

```
1. No carrinho, selecionar loja:
   ▸ CD Cuiabá / CD Goiânia / Loja Padrão
2. Modo de entrega:
   ▸ "Retirar no CD" → seleciona CD Cuiabá
   ▸ (não há cálculo de frete — retirada local)
3. [Continuar] → etapa de pagamento
```

> **Dica:** Loja pode ser trocada também no próprio checkout (campo "trocar loja"). Útil quando o distribuidor mora em outra região.

### ETAPA 3 — Pagamento: duas formas

> **Aula 4 (bônus):** *"Eu vou pagar com bônus dele... ele vai ter que digitar a senha dele, aquela senha financeira... O valor do pedido é R$ 50, porque ele compra com desconto... Já tá concluído o pedido."*

**Forma A — Pagar com Bônus (saldo loja online):**
```
1. Pagamento: "Bônus" (saldo loja online)
2. Confirma pedido → pede SENHA FINANCEIRA
3. Digita senha → desconto aplicado (ex: 50% Dist → R$ 25 no produto de R$ 50)
4. Pedido ★CONCLUÍDO★ (pago automático)
```

**Forma B — Pagar no Local (retirada):**
> **Aula 4:** *"O pedido dele agora foi gerado e tá em etapa de pagamento, ou seja, ainda está aberto... aguarda pagamento."*
```
1. Pagamento: "Pagar ou retirar na loja" (pagamento no balcão)
2. Confirmar pedido → pedido gerado em "aguardando pagamento" (aberto)
3. Distribuidor leva R$ 50 ao balcão e paga lá
```

### ETAPA 4 — Retirada no balcão do CD (atendente)

> **Aula 4:** *"Ele chega lá no balcão do CD e fala: 'Olha, eu vim retirar a minha mercadoria'. O atendente... clica em pedidos... 'meu pedido é o 13'... separa a mercadoria, entrega para o dono."*

```
1. Distribuidor chega no balcão com o nº do pedido
2. Atendente: Loja Virtual CD ▸ Pedidos ▸ busca pelo nº
3. Se "aguardando pagamento":
   ▸ Atendente cobra (ex: R$ 50)
   ▸ Atendente clica [Pagar] → sistema registra pagamento + GERA COMISSÃO
4. Separa mercadoria → entrega ao distribuidor
```

### ETAPA 5 — Registrar histórico / entrega

> **Aula 4:** *"Ele pode vir aqui alimentar o histórico do pedido... coloca assim, ó, 'produto entregue'... Vem cá e salva... Consegue ver aqui todo o histórico... que a pessoa foi lá e já retirou o pedido."*

```
1. No pedido → [Histórico] (adicionar registro)
2. Comentário: "Retirado no balcão — produto entregue em mãos"
3. [Salvar]
4. Histórico do pedido fica visível p/ auditoria (quando/por quem entregou)
```

---

## Regras de Negócio Aplicadas

| Regra | Valor | Impacto |
|-------|-------|---------|
| **Desconto Distribuidor** | 50% (exemplo) | Pedido R$ 50 → Distribuidor paga R$ 25 |
| **Desconto CD (na indústria)** | 60% (exemplo) | CD compra R$ 40 de produto R$ 100, vende a R$ 50 → margem R$ 10 |
| **Pagamento com bônus** | Só saldo "loja online" | Distribuidor digita **senha financeira** |
| **Pagamento no balcão** | Gera **comissão** automaticamente | Grupo/representante recebe bônus sobre a venda |
| **Retirada no CD** | Sem cálculo de frete | Escolher retirada = frete zero |
| **Estoque CD** | Só a Matriz movimenta | CD não edita estoque (entrada/saída) |

> ⚠️ **Nota sobre percentuais:** Os valores 50%/60% vêm do treinamento (Aula 4). Percentuais reais são configurados na plataforma (Admin Maxnível ▸ Compras ▸ Regras de Desconto) — **mudanças exigem suporte Maxível**.

---

## Diagrama: Dois Caminhos de Pagamento

```
                     ┌────────────────────────────────────────┐
                     │   DISTRIBUIDOR COMPRA NO CD (CHECKOUT)  │
                     └────────────────────────────────────────┘
                          │                    │
            Pagamento: BÔNUS                   Pagamento: NO LOCAL (balcão)
                          │                    │
                          ▼                    ▼
              SENHA FINANCEIRA          Pedido "AGUARDANDO
                          │              PAGAMENTO" (aberto)
                          ▼                    │
               Pedido ★CONCLUÍDO★              │
                          │                    │
                          │              Distribuidor vai ao balcão
                          │                    │
                          │                    ▼
                          │           Atendente registra PAGAMENTO
                          │           (gera COMISSÃO)
                          │                    │
                          └──────────┬─────────┘
                                     ▼
                       Atendente separa mercadoria
                                     │
                                     ▼
                       Registra "Produto Entregue"
                       no histórico do pedido
                                     │
                                     ▼
                                   FIM ✅
```

---

## Telas Envolvidas (URLs)

| Etapa | Tela | URL |
|-------|------|-----|
| Checkout público | Loja (frontend) | `/loja/` (checkout) |
| Pedidos do CD (atendente) | Loja Virtual Admin ▸ Pedidos | `/sale/order?token={cd}` |
| Detalhe/Histórico do pedido | Loja Virtual Admin | `/sale/order/info?order_id={id}&token={cd}` |
| Registrar pagamento balcão | Loja Virtual Admin ▸ Pedido | botão Pagar no pedido |
| Registrar histórico | Loja Virtual Admin ▸ Pedido | campo Histórico |
| Saldo bônus distribuidor | Escritório Virtual | área pública (saldo loja online) |
| Registrar comissão | Automático no pagamento | — |

---

## Erros Comuns

| Sintoma | Causa | Solução |
|---------|-------|---------|
| Checkout não oferece "Retirar no CD" | Frete retirada não habilitado p/ CD OU produto sem forma de pagamento CD | Verificar Extensões ▸ Fretes + produto (checklist 4 pontos) |
| Pagamento com bônus recusado | Saldo insuficiente OU senha financeira errada | Verificar saldo loja online / senha |
| Pedido não aparece no CD | Produto não liberado p/ CD | Liberar produto (categoria + produto + pagamento) |
| Comissão não gerada | Pagamento no balcão não registrado | Atendente deve clicar [Pagar] no pedido (não só receber em dinheiro) |
| Histórico vazio | Entrega não registrada | Atendente adicionar registro "produto entregue" |

---

## Links Relacionados

- Criar CD (checklist 4 pontos): [`../../05-guias-rapidos/criar-cd-passo-a-passo.md`](../../05-guias-rapidos/criar-cd-passo-a-passo.md)
- CD acesso/configuração: [`../01-acesso-configuracao-inicial.md`](../01-acesso-configuracao-inicial.md)
- Saldo bônus e compras CD: [`../04-financeiro-cd/saldo-bonus-compras.md`](../04-financeiro-cd/saldo-bonus-compras.md) ⏳
- Descontos CD vs Distribuidor: [`../02-produtos-disponibilidade/descontos-cd-vs-distribuidor.md`](../02-produtos-disponibilidade/descontos-cd-vs-distribuidor.md) ⏳

---

*Última atualização: 2025-08-11 | Baseado em Aula 4 (segmentos 173–216) + validação plataforma live*