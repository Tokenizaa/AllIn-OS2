# Configurações — Pagamentos (Loja Virtual)

> **Tela principal:** Formas de pagamento do checkout: PagSeguro (cartão), Boleto Banco do Brasil, Bônus (saldo), Retirada na Loja (pagamento local).
>
> **URL real:** `https://allinbrasil.com.br/loja/admin/extension/payment`
> **Acesso:** Menu **Extensões ▸ Pagamentos**
> **Fonte:** Treinamento Aula 3 + Aula 4

---

## Visão Geral

O módulo **Pagamentos** define como os compradores pagam. Cada método possui:

- **Situação** (habilitado/desabilitado)
- **Regiões geográficas** atendidas
- **Condições** (valor mínimo/máximo, tipo de cliente)
- **Integração** (token/API externa)
- **Status inicial** que o pedido assume

> **⚠️ Crítico (Aula 4):** *"Sem o token [PagSeguro] não vai ter forma de pagamento pelo cartão — não tem nenhuma pré-definida."* — Antes do go-live, TODA forma de pagamento precisa estar configurada e testada.

---

## Métodos de Pagamento Disponíveis

| Método | URL | Integração | Status Inicial Típico |
|--------|-----|-----------|----------------------|
| **PagSeguro** | `/extension/payment` (pagseguro) | API externa (token + e-mail) | Pedido Realizado → Pago |
| **Boleto BB (Registrado)** | `/extension/payment` (boleto) | API boletos (autorização) | Pedido Realizado → Aguardando |
| **Bônus** | `/extension/payment` (bônus) | Interna (saldo conta) | Pago |
| **Retirada na Loja** | `/extension/payment` (retirada) | Interna (pagamento balcão) | Pedido Realizado → Pago na baixa |

---

## 1. PagSeguro (Cartão)

> **Aula 3:** *"Liberar a baixa automática [no PagSeguro]... O cálculo do frete é feito pela loja, não pelo PagSeguro... O status que o pedido vai assumir na loja virtual [quando] o PagSeguro retorna que foi pago... [mudança de status] pedido pago... já tá rodando a baixa automática."*

### Configuração

| Campo | Descrição |
|-------|-----------|
| **Token** | Token fornecido pelo PagSeguro (conta PJ) |
| **E-mail** | E-mail da conta PagSeguro |
| **Baixa Automática** | Mudança de status automática quando PagSeguro confirma pagamento |
| **Status Inicial** | Status do pedido ao ser criado (ex: "Pedido Realizado") |
| **Status Pago** | Status ao confirmar (ex: "Pedido Pago") |
| **Status Cancelado** | Status ao cancelar |
| **Valor Mínimo/Máximo** | Faixa de valores aceita |
| **Região Geográfica** | Região atendida |
| **Situação** | Habilitado/Desabilitado |

### Regras Observadas
- **Pré-fixo no pedido:** sistema monta referência para identificar a loja no PagSeguro (multi-loja)
- **Baixa automática:** PagSeguro notifica → sistema muda status p/ "Pedido Pago" → histórico alimentado
- **Frete calculado pela loja**, não pelo PagSeguro

### Pré-requisito (Aula 4)
```
1. Criar conta PagSeguro (PJ preferencial — PJ exige token específico)
2. Obter token + e-mail
3. Plataforma ▸ Pagamentos ▸ PagSeguro ▸ Editar
4. Inserir token + e-mail → habilitar → salvar
```

---

## 2. Boleto Banco do Brasil (Registrado)

> **Aula 4:** *"Para usar o boleto... você tem que criar um login na API... configurações ▸ módulos ▸ boleto registrado... instalar o módulo... dar autorização... abre a URL... API boletos... criar uma conta, e-mail e senha... permite que a Maxível emite boletos do banco... tica [sim]... salva... Depois tem que habilitar de novo... extensões ▸ pagamentos."*

### Configuração (2 etapas obrigatórias)

**Etapa 1 — Instalar e autorizar API:**
```
1. Configurações ▸ Módulos ▸ buscar "Boleto Registrado"
2. [Instalar]
3. [Autorizar API] → abre URL da API boletos
4. Criar conta: e-mail + senha + aceitar termos
5. Logar → marcar "Permite que a Maxível emita boletos registrados"
6. Salvar
```

**Etapa 2 — Configurar método:**
```
1. Extensões ▸ Pagamentos ▸ Boleto Registrado ▸ Editar
2. Campos:
   ▸ Enviar boleto por e-mail (sim/não)
   ▸ Valor mínimo / máximo
   ▸ Região geográfica
   ▸ Situação inicial do pedido
   ▸ Prazo (automático ou configurado)
3. [Configurar Boleto Registrado] → Banco do Brasil → [Alterar]
   ▸ Carteira, Variação, Modalidade
   ▸ Agência, Dígito, Conta
   ▸ Dados do endereço (cedente)
   ▸ Taxa
   ▸ Tipo de aceite
   ▸ Dias para vencer
   ▸ Número inicial de emissão (ex: 1000)
4. Habilitar + Salvar
```

> ⚠️ **Não salva sem API:** *"Para ativar este método de pagamento é necessário autorizar a API"* — erro exibido se tentar salvar sem a Etapa 1.
> ⚠️ **Exclusividade:** A autorização da API é feita pelo cliente (não pela equipe Maxível).

---

## 3. Bônus (Saldo Loja Online)

> **Aula 3:** *"Bônus... se você vai permitir ele pagar o frete com bônus, sim ou não... vamos supor que ele tem R$ 200, tem 100 de bônus, vai faltar 100. Ele pode pagar os 100 com bônus e o restante com outra forma de pagamento adicional."*

### Configuração

| Campo | Descrição |
|-------|-----------|
| **Pagamento com Bônus** | Habilitado/Desabilitado (todas ou lojas específicas) |
| **Pagar frete com bônus** | Sim/Não |
| **Forma adicional** | Pagamento complementar quando bônus insuficiente |
| **Lojas habilitadas** | Onde o bônus vale (loja padrão + CDs) |

### Regras Observadas
- **Pagamento misto:** bônus + forma adicional (ex: R$ 100 bônus + R$ 100 cartão)
- **Bônus do CD:** ao comprar no CD, bônus é transferido para a conta do CD
- **Senha financeira:** necessária para pagar com bônus
- **Frete:** permitir ou não pagamento de frete com bônus

---

## 4. Retirada na Loja (Pagamento Local)

> **Aula 3:** *"Retirada na loja... pagamento ao retirar... Vou colocar [status inicial] como pedido realizado... [o pagamento é feito na baixa pelo atendente]."*

### Configuração

| Campo | Descrição |
|-------|-----------|
| **Situação** | Habilitado/Desabilitado |
| **Região** | Regiões atendidas |
| **Tipo de Cliente** | Quem pode usar (Cliente Final, Distribuidor, CD) |
| **Status Inicial** | "Pedido Realizado" (aguardando pagamento) |
| **Lojas/CDs** | Onde o pagamento local vale |

### Regras Observadas
- Pedido fica "aguardando pagamento" até a baixa
- Atendente registra pagamento → comissão gerada
- Usado junto com frete "Retirada na Loja/CD"

---

## Regras de Negócio (Resumo)

| Regra | Detalhe |
|-------|---------|
| **Nenhuma forma pré-definida** | Toda forma precisa configurar antes do go-live |
| **PagSeguro PJ** | Token de conta PJ (conta PF não funciona p/ CNPJ) |
| **Boleto: API antes de configurar** | Salvar sem API = erro |
| **Baixa automática PagSeguro** | Status muda sozinho ao confirmar |
| **Bônus misto** | Bônus + forma adicional no mesmo pedido |
| **Frete pelo bônus** | Configurável (permitir/não) |
| **Bônus CD** | Compra no CD transfere bônus para conta do CD |

---

## URLs Relacionadas

| Ação | URL |
|------|-----|
| Pagamentos | `/extension/payment` |
| Módulos (instalar boleto) | `/Modulos/Modulos` |
| Total do Pedido | `/extension/total` |
| Pedidos (status) | `/sale/order` |

---

## Troubleshooting

| Sintoma | Causa | Solução |
|---------|-------|---------|
| Cartão não funciona no checkout | PagSeguro sem token/inválido | Configurar token + e-mail |
| Boleto não emite | API não autorizada | Autorizar API (etapa 1) |
| "Necessário autorizar a API" | Tentou salvar sem autorização | Autorizar antes |
| Bônus não aparece | Forma desabilitada OU saldo insuficiente | Habilitar / verificar saldo |
| Status não muda após pagamento | Baixa automática desabilitada | Habilitar baixa automática |

---

## Links Relacionados

- Fretes: [`fretes.md`](fretes.md)
- Pedidos (baixa/status): [`../02-vendas/pedidos.md`](../02-vendas/pedidos.md)
- Go-live (configs pendentes): [`../../04-plataforma-cd/07-go-live-checklist/reset-teste-producao.md`](../../04-plataforma-cd/07-go-live-checklist/reset-teste-producao.md)

---

*Última atualização: 2025-08-11 | Baseado em Aula 3 + Aula 4 + validação plataforma live*