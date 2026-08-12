# CD — Acesso e Configuração Inicial

> **Plataforma:** Centro de Distribuição (CD) — plataforma independente dentro da Loja Virtual, com login próprio e escopo limitado ao CD do usuário.
>
> **URL de acesso:** `https://allinbrasil.com.br/loja/admin/` (tela de login)
> **URL pós-login (dashboard):** `https://allinbrasil.com.br/loja/admin/common/dashboard?token={token_do_cd}`
> **Fonte:** Treinamento Aula 4

---

## Conceito: O que é um CD?

> **Aula 4:** *"O CD seria uma filial... a sede da empresa... abriram uma filial em Goiânia... os distribuidores podem optar em retirar direto com o distribuidor de Porto Alegre... o distribuidor pode sim ser um CD, mas não têm vínculo nenhum os cadastros. São plataformas distintas e cadastros distintos."*

| Característica | Detalhe |
|----------------|---------|
| **O que é** | Filial / estoque regional que comercializa produtos da indústria para distribuidores |
| **Papel** | Ponto de retirada + revenda + gestão de estoque regional |
| **Pode ser** | Uma loja física, um distribuidor PJ, um galpão logístico |
| **Cadastro** | **Totalmente independente** do cadastro de distribuidor (CD PJ ≠ Distribuidor PF) |
| **Vínculo automático** | ❌ NÃO existe — plataformas e cadastros 100% separados |
| **Bônus** | Bônus de distribuidor **NÃO circula** na plataforma CD (não dá para comprar no CD com bônus de distribuidor) |

---

## Acesso à Plataforma CD

### Opção A — Via Administração (Maxnível)

> **Aula 4:** *"Na administração, se o senhor clicar aqui, ó, Loja Virtual... o senhor consegue logar em qualquer loja de qualquer CD."*

**URL:** `https://allinbrasil.com.br/administracao/LinkExterno/LojaVirtual/administrar`

```
1. Login na Administração Maxnível (admin master)
2. Menu: Loja Virtual
3. Selecionar CD desejado
4. Sistema gera token → abre dashboard daquele CD
```

> **Uso:** Para o admin master inspecionar/operar qualquer CD sem credenciais do CD.

### Opção B — Direto (Gerente do CD)

> **Aula 4:** *"A URL de acesso ao gerenciador do CD: seu domínio/loja/admin... Colocar o login dele e a senha que a gente criou para ele."*

**URL:** `https://allinbrasil.com.br/loja/admin/teste` → `index.php?route=common/login`

```
1. Abra: https://allinbrasil.com.br/loja/admin/
2. Insira usuário e senha criados na Admin (Configurações ▸ Usuário, vinculado ao CD)
3. Acessa dashboard do PRÓPRIO CD
```

> **Observação:** Cada usuário CD acessa SOMENTE o CD ao qual foi vinculado. (Admin master consegue todos pela Opção A.)

---

## Dashboard do CD — Menu Disponível

> **Aula 4:** *"Observe que não tem nenhum produto disponível aqui no CD de Cuiabá... por quê? Porque... você tem que atrelar as quatro coisas."*

```
Loja Virtual (CD)
├── Painel de Controle (dashboard)
├── Catálogo
│   ├── Produtos           ← SOMENTE os liberados p/ este CD
│   └── Comprar Produtos   ← Compra da indústria (reabastecimento)
├── Pedidos
│   ├── Pedidos            ← Pedidos feitos NESTE CD
│   ├── Comprar/Adicionar  ← Novo pedido de distribuidor
│   └── Retiradas / Histórico
├── Clientes               ← Clientes que compraram neste CD
├── Financeiro
│   ├── Cadastrar Conta CD ← Conta bancária p/ saque
│   ├── Solicitação de Saque
│   ├── Relatório Transações
│   ├── Fechamento de Caixa
│   └── Faturamento Anual
├── Relatórios             ← Vendas, estoque, faturamento (escopo CD)
└── Configurações
    ├── Usuários / Grupos  ← Cria usuários do PRÓPRIO CD
    └── (outras configurações restritas)
```

> ⚠️ **Drive de Estoque:** CD **NÃO** consegue editar/entrar/sair estoque. Estoque é gerido **somente pela Maxnível** (remessa ou reconhecimento de compra).

---

## Fluxo do Checkout do CD (Compra da Indústria (matriz))

```
1. Catálogo ▸ Produtos ▸ [Comprar Produto] (ou adicionar ao carrinho)
2. Sistema mostra produtos liberados p/ este CD
3. Carrinho → [Finalizar Pedido]
4. Endereço de Fatura / Entrega
5. Modo de Entrega:
   ▸ Retirada na Loja (indústria) — se habilitado
   ▸ Frete transportadora/correios — se habilitado
6. Método de Pagamento:
   ▸ Cartão (PagSeguro)
   ▸ Boleto BB
   ▸ Bônus (saldo CD) — se CD tem saldo + produto tem forma "Centro Distribuição"
7. Confirmar → pedido registrado na indústria (vendasm/pedidos)
8. Matriz reconhece pagamento → estoque entra automaticamente no CD
```

---

## Regras Críticas de Configuração (Checklist dos 4 Pontos)

| # | Item | Onde Configurar | Efeito se Esquecer |
|---|------|-----------------|--------------------|
| 1 | **Categoria liberada p/ CD** | Catálogo ▸ Departamentos ▸ Editar ▸ Disponibilidade | Produto some de TODO o CD |
| 2 | **Produto liberado p/ CD** | Catálogo ▸ Produtos ▸ Editar ▸ Ligações ▸ Lojas/CDs | CD não vê/comercializa |
| 3 | **Forma pagamento "Centro Distribuição"** | Produto ▸ Ligações ▸ Formas Pagamento | Checkout CD trava |
| 4 | **Frete "Retirada no CD"** | Extensões ▸ Fretes ▸ Retirada na Loja ▸ Editar ▸ Marcar CD | Distribuidor não retira no CD |

> **Detalhamento completo:** [`../05-guias-rapidos/criar-cd-passo-a-passo.md`](../05-guias-rapidos/criar-cd-passo-a-passo.md)

---

## Fluxos do CD (Operação Diária)

### 1. Receber Remessa da Indústria (matriz) (Estoque)
```
1. Matriz cria remessa → Envia produtos → CD paga boleto/duplicata
2. Matriz reconhece pagamento (Admin ➜ Ferramentas ➜ Estoque)
3. Matriz lança qtd por produto → estoque aparece no CD
4. CD vê em: Catálogo ▸ Produtos ▸ coluna Estoque
```

### 2. Vender para Distribuidor (Retirada no Balcão)
```
1. Distribuidor compra na loja → escolhe "Retirar no CD"
2. CD vê pedido em: Pedidos ▸ listagem
3. Atendente separa mercadoria, entrega ao distribuidor
4. CD registra histórico: "Produto entregue" ✅
```

### 3. Pagamento no Balcão (Pedido Aberto)
```
1. Distribuidor chega, pedido "aguardando pagamento"
2. Atendente → Pedidos ▸ Editar pedido → [Pagar]
3. Forma: Dinheiro / Cartão / Outros
4. Sistema gera comissão automaticamente
5. CD marca entregue
```

### 4. Solicitar Saque do Saldo do CD
```
1. Configurações prévias (Maxnível):
   ▸ Módulo "Solicitação de Saque CD" com regra (valor mínimo, período, pagamento)
   ▸ Taxa de saque (ex: 5%)
2. CD → Financeiro ▸ Cadastrar Conta CD ▸ criar conta bancária
3. CD → Financeiro ▸ Solicitação de Saque ▸ informar valor + conta + senha
4. Sistema debita saldo + taxa → gera pedido de saque na Maxnível
5. Maxnível: deposita externamente → marca "depositado"
```

---

## Perguntas Frequentes

| Pergunta | Resposta |
|----------|----------|
| Posso ter mais de um CD? | Sim, ilimitado. Cada um com loja, estoque e usuários próprios |
| Distribuidor pode ser CD? | Pode, mas **sem vínculo automático** — cadastro CD separado |
| CD compra com bônus de distribuidor? | ❌ Não — são plataformas separadas |
| CD pode mexer no próprio estoque? | ❌ Não — somente a indústria movimenta estoque |
| Onde configuro descontos do CD (60%)? | Exclusivo via suporte Maxível (`ComprasDescontoTotal/Configuracao`) |
| É possível pagar com saldo CD + outra forma? | Sim — dividir pagamento (ex: R$ 100 bônus + R$ 50 cartão) |

---

## Troubleshooting

| Sintoma | Causa | Solução |
|---------|-------|---------|
| Login inválido | Usuário sem loja vinculada OU credenciais erradas | Verificar Admin ▸ Usuário ▸ loja = CD |
| CD sem produtos | Categoria e/ou produto não liberado p/ CD | Checklist 4 pontos (guia criar-cd) |
| Checkout trava ao comprar da indústria | Forma "Centro Distribuição" desmarcada no produto | Marcar forma no produto |
| Distribuidor não vê "Retirar no CD" | Frete retirada não habilitado p/ CD | Editar frete Retirada na Loja ▸ marcar CD |
| Estoque CD zerado | Remessa não reconhecida OU compra não paga | Matriz reconhecer pagamento / lançar estoque |

---

## Links Relacionados

- Guia rápido criar CD: [`../05-guias-rapidos/criar-cd-passo-a-passo.md`](../05-guias-rapidos/criar-cd-passo-a-passo.md)
- Vínculo categoria-produto-CD: [`02-produtos-disponibilidade/vinculo-categoria-produto-cd.md`](../04-plataforma-cd/02-produtos-disponibilidade/vinculo-categoria-produto-cd.md) ⏳
- Compra direta do CD: [`03-gestao-estoque-cd/compra-direta-cd.md`](../04-plataforma-cd/03-gestao-estoque-cd/compra-direta-cd.md) ⏳
- Saldo bônus e compras: [`04-financeiro-cd/saldo-bonus-compras.md`](../04-plataforma-cd/04-financeiro-cd/saldo-bonus-compras.md) ⏳
- Saque CD (regras/taxas): [`04-financeiro-cd/solicitacao-saque-cd.md`](../04-plataforma-cd/04-financeiro-cd/solicitacao-saque-cd.md) ⏳
- Fluxo compra distribuidor no CD: [`05-pedidos-retirada/fluxo-compra-distribuidor.md`](../04-plataforma-cd/05-pedidos-retirada/fluxo-compra-distribuidor.md) ⏳
- Reset teste/produção: [`07-go-live-checklist/reset-teste-producao.md`](../04-plataforma-cd/07-go-live-checklist/reset-teste-producao.md) ⏳

---

*Última atualização: 2025-08-11 | Baseado em Aula 4 + validação plataforma live*