# Configurações — Fretes (Loja Virtual)

> **Tela principal:** Gestão dos métodos de entrega: Correios, Transportadora (tabela própria) e Retirada na Loja/CD.
>
> **URL real:** `https://allinbrasil.com.br/loja/admin/extension/shipping`
> **Acesso:** Menu **Extensões ▸ Fretes**
> **Fonte:** Treinamento Aula 3

---

## Visão Geral

O módulo **Fretes** define as formas de entrega disponíveis no checkout. Cada método tem:

- **Situação** (habilitado/desabilitado)
- **Regiões geográficas** atendidas (regras por região)
- **Ordem** (prioridade de exibição)
- **Condições** (peso máximo, valor mínimo, tipo de cliente)
- **Ajustes** (percentual adicional, prazo extra)

> **Aula 3:** *"Extensões e fretes... Correios, transportador e retirada na loja."*

---

## Métodos de Frete Disponíveis

| Método | Descrição | Quando Usar |
|--------|-----------|-------------|
| **Correios** | PAC, Sedex, Mini Envios, contratos | Envio nacional padrão |
| **Transportadora** | Tabela própria (planilha cidades/preços/prazos) | Fretes grandes, regionais, paletização |
| **Retirada na Loja / CD** | Frete zero, retirada presencial | Clientes locais, distribuidores, CDs |

---

## 1. Correios

> **Aula 3:** *"Correios, ó, tá habilitado... os serviços que eu quero disponibilizar dos Correios... Todos esses aqui que são só com contrato... você pode adicionar um valor, um percentual no valor do frete... Calculou que a minha entrega vai ser em 7 dias. Se eu colocar três aqui, lá [vai dar] 10 dias."*

### Configuração

| Campo | Descrição |
|-------|-----------|
| **Serviços** | PAC / Sedex / Mini Envios / outros (marcar disponíveis) |
| **Situação** | Habilitado / Desabilitado |
| **Região Geográfica** | Regiões que o Correios atende |
| **Adicionar Valor** | Valor fixo extra sobre o frete |
| **Adicionar Percentual** | % extra sobre o frete |
| **Prazo Extra** | Dias adicionais ao prazo calculado (ex: +3 dias) |
| **Ordem** | Prioridade de exibição |
| **Tipo de Cliente** | Quem pode usar (Cliente Final, Distribuidor, CD...) |

### Regras Observadas (Aula 3)
- **Percentual adicional:** 3 → prazo final +3 dias sobre o calculado pelos Correios
- **Valor/percentual:** adiciona custo sobre o frete base
- **Serviços com contrato:** exigem cadastro específico (habilitar apenas os contratados)

---

## 2. Transportadora

> **Aula 3:** *"Frete via transportadora... você pode habilitar... o pedido do cliente... qual transportadora que ele quer receber... Total mínimo, o valor que a compra precisa atingir para liberar... Por exemplo, se eu colocar R$ 100, pedidos acima de 100 que vai liberar essa transportadora... Permitir entrega... Se eu marcar aqui sim e na sua tabela de estados e cidades não tiver aquela cidade... a entrega fica... Não, então eu não entrego para [fora]."*

### Configuração

| Campo | Descrição |
|-------|-----------|
| **Situação** | Habilitado / Desabilitado |
| **Tipo de Cliente** | Quem pode usar |
| **Perguntar transportadora?** | Exibir seleção de transportadora no checkout |
| **Total Mínimo** | Valor mínimo da compra para liberar (ex: R$ 100) |
| **Permitir Entrega?** | Se "Sim", entrega em qualquer cidade da tabela; se "Não", só cidades cadastradas |
| **Peso Máximo** | Limite de peso por envio (ex: 10kg) |
| **Unidade de Peso** | kg / g |
| **Ativo p/ compras na Maxnível** | Habilitar CD comprando da indústria |

### Tabela de Fretes (Planilha)

> **Aula 3:** *"Para Goiás, o peso máximo de 10 [kg]... Rio de Janeiro... Peso a cada 10 kg, o valor é R$ 100 e o prazo de entrega é 8 dias... Você faz download da planilha de exemplo e preenche a planilha com todas as cidades e preço, peso, valor, prazos que a transportadora fornece."*

| Coluna da planilha | Exemplo |
|--------------------|---------|
| Estado | GO / RJ / SP |
| Cidade | Goiânia / Rio de Janeiro / São Paulo |
| Peso (faixa) | até 10 kg |
| Valor | R$ 100,00 |
| Prazo | 8 dias |

**Fluxo:**
```
1. Transportadora ▸ [Baixar planilha de exemplo]
2. Preencher: estados, cidades, pesos, valores, prazos (dados da transportadora)
3. [Upload/Carregar] planilha
4. Frete calculado conforme tabela
```

---

## 3. Retirada na Loja / CD

> **Aula 3:** *"Tem a opção de retirada no CD... o módulo de CD... deixa habilitado... Retirada na loja... você pode cobrar uma taxa de entrega na retirada da loja... E CD também, se você quiser permitir que ele retire na loja, basta deixar habilitado."*

### Configuração

| Campo | Descrição |
|-------|-----------|
| **Situação** | Habilitado / Desabilitado |
| **Região Geográfica** | Região atendida pela retirada |
| **Taxa de Retirada** | Valor cobrado na retirada (opcional — normalmente zero) |
| **Lojas/CDs habilitados** | ✅ Marcar quais CDs permitem retirada (crítico!) |
| **Tipo de Cliente** | Quem pode retirar (Cliente Final, Distribuidor, CD) |
| **Ordem** | Prioridade |

### Regras Observadas
- **Retirada no CD:** frete zero — distribuidor busca no balcão (ver fluxo compra)
- **Sem cálculo de frete:** ao escolher retirada, checkout pula cálculo
- **Liberação por CD:** módulo precisa ter o CD marcado para aparecer a opção

---

## Regras de Negócio (Resumo)

| Regra | Detalhe |
|-------|---------|
| **Frete condicionado a pagamento** | É possível atrelar forma de frete a forma de pagamento (região geográfica específica) |
| **Correios + prazo extra** | Prazo final = prazo calculado + dias extras |
| **Transportadora: total mínimo** | Abaixo do mínimo, transportadora não aparece |
| **Retirada CD: CD deve estar marcado** | Sem marcação, opção não aparece no checkout |
| **Região geográfica** | Se região não atende, método some |

---

## URLs Relacionadas

| Ação | URL |
|------|-----|
| Fretes (extensões) | `/extension/shipping` |
| Regiões Geográficas | `/localisation/geo_zone` |
| Situações de Estoque | `/localisation/stock_status` |
| Relatório de Fretes | `/report/sale_shipping` |

---

## Troubleshooting

| Sintoma | Causa | Solução |
|---------|-------|---------|
| "Retirar no CD" não aparece | CD não marcado no módulo | Editar retirada → marcar CD |
| Transportadora não aparece no checkout | Compra abaixo do total mínimo | Ajustar mínimo / tabela |
| Correios não calcula | CEP fora da região OU serviço não habilitado | Verificar região + serviços |
| Entrega recusada em cidade | "Permitir entrega" = Não e cidade fora da tabela | Adicionar cidade na planilha |

---

## Links Relacionados

- Pagamentos: [`pagamentos.md`](pagamentos.md) ⏳
- Pedidos: [`../02-vendas/pedidos.md`](../02-vendas/pedidos.md)
- Criar CD (frete retirada): [`../../05-guias-rapidos/criar-cd-passo-a-passo.md`](../../05-guias-rapidos/criar-cd-passo-a-passo.md)

---

*Última atualização: 2025-08-11 | Baseado em Aula 3 + validação plataforma live*