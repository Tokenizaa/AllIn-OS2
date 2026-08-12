# Visão Geral da Arquitetura — AllIn-OS2

> **Sistema de Gestão MLM (Multi-Level Marketing) — 3 Plataformas Integradas**

---

## As Três Plataformas

| Plataforma | Público | URL Base | Finalidade Principal |
|------------|---------|----------|---------------------|
| **Administração Maxnível** | Gestores, Admins, Financeiro, Suporte | `https://allinbrasil.com.br/administracao/` | Gestão completa do negócio: distribuidores, planos, comissões, relatórios, configurações globais |
| **Loja Virtual (E-commerce Admin)** | Operadores de loja, CDs, Financeiro loja | `https://allinbrasil.com.br/loja/admin/` | Catálogo, pedidos, clientes, financeiro da loja, configurações de e-commerce |
| **Centro de Distribuição (CD)** | Gerentes de CD, Atendentes de balcão | `https://allinbrasil.com.br/loja/admin/` (token CD) | Produtos disponíveis, estoque CD, vendas para distribuidores, saques, fechamento de caixa |

---

## Fluxo de Acesso e Papéis

```
┌─────────────────────────────────────────────────────────────────┐
│                    ADMINISTRAÇÃO DA INDÚSTRIA                   │
│  https://allinbrasil.com.br/administracao/                      │
│  Papéis: Admin Master, Gestão, Financeiro, Suporte, Logística  │
│  Cria: CDs, Usuários CD, Planos, Qualificações, Regras Globais │
└──────────────────────────┬──────────────────────────────────────┘
                           │ Cria/Configura
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                      LOJA VIRTUAL (E-COMMERCE)                  │
│  https://allinbrasil.com.br/loja/admin/                         │
│  Papéis: Admin Loja, Operador Catálogo, Financeiro Loja, CD    │
│  Gerencia: Produtos, Pedidos, Clientes, Estoque, Faturamento   │
└──────────────────────────┬──────────────────────────────────────┘
                           │ Vincula/Disponibiliza
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                    CENTRO DE DISTRIBUIÇÃO (CD)                  │
│  https://allinbrasil.com.br/loja/admin/ (login CD)             │
│  Papéis: Gerente CD, Atendente Balcão                          │
│  Operação: Venda p/ Distribuidor, Retirada Balcão, Saque, Estoque│
└─────────────────────────────────────────────────────────────────┘
                           ▲
                           │ Compra/Retira
                           │
┌─────────────────────────────────────────────────────────────────┐
│                       DISTRIBUIDOR (Frontend)                   │
│  Loja pública / Escritório Virtual                              │
│  Ações: Cadastro, Compra, Qualificação, Saque, Rede, Bônus     │
└─────────────────────────────────────────────────────────────────┘
```

---

## Identificadores Canônicos (Regra de Ouro)

| Identificador | Tabela | Tipo | Uso |
|---------------|--------|------|-----|
| **`customer_id`** | `crm.customers.id` | UUID | **Chave canônica interna** — joins, FKs, APIs, relatórios |
| `id_comprador` | Legado (text) | Ponte legada | Compatibilidade API AllIn — **não remover** |
| `allin_id` | Legado (integer) | Ponte legada | Compatibilidade API AllIn — **não remover** |

> **Regra**: Toda nova query, API, relatório ou integração **deve usar `customer_id`**. As colunas legadas existem apenas para compatibilidade retroativa.

---

## Matriz de Permissões por Plataforma

| Ação | Admin Maxnível | Loja Virtual (Admin) | CD | Distribuidor |
|------|-----------------|----------------------|-----|--------------|
| Criar CD | ✅ | ❌ | ❌ | ❌ |
| Criar usuário CD | ✅ | ✅ (se permissão) | ✅ (próprio CD) | ❌ |
| Cadastrar produto | ✅ | ✅ | ❌ | ❌ |
| Liberar produto p/ CD | ✅ | ✅ | ❌ | ❌ |
| Gerenciar estoque CD | ✅ | ✅ | ⚠️ (somente visualização) | ❌ |
| Processar pedido distribuidor | ✅ | ✅ | ✅ (próprio CD) | ❌ |
| Aprovar saque distribuidor | ✅ | ❌ | ❌ | ❌ |
| Aprovar saque CD | ✅ | ❌ | ✅ (solicita) | ❌ |
| Configurar frete/pagamento | ✅ | ✅ | ❌ | ❌ |
| Ver relatórios globais | ✅ | ❌ | ❌ | ❌ |
| Ver relatórios próprio CD | ✅ | ✅ | ✅ | ❌ |
| Ver própria rede/bônus | ❌ | ❌ | ❌ | ✅ |

---

## URLs de Referência Rápida

### Administração Maxnível
```
Base: https://allinbrasil.com.br/administracao/

Distribuidores
├── A Rede                    → /Distribuidor/DistribuidoresARede/listar
├── Pendentes                 → /Distribuidor/DistribuidoresCadastroPendente/listar
├── Relatório de indicados    → /Distribuidor/Patrocinador/relatorioIndicacoes
└── Excluídos                 → /Distribuidor/DistribuidoresCadastroExcluido/listar

Catálogos e Planos
├── Planos de Adesão          → /Planos/Planos/principal
├── Qualificações             → /Qualificacao/QualificacaoConfiguracoes/listar
├── Ciclos de Qualificação    → /Qualificacao/QualificacaoPeriodosCiclosGeral/listar
├── Tipo de Cliente           → /Distribuidor/DistribuidorTipoPessoa/listar
└── Estado Civil              → /Distribuidor/DistribuidorEstadoCivil/listar

Ferramentas
├── Habilitar Produtos Lojas  → /Loja/HabilitarProdutosLoja/principal
├── Movimentar Saldo          → /Contas/ContasTransacoesFerramenta/listar
├── Movimentar Saldo CD       → /ContasCd/ContasCdTransacoesFerramenta/listar
├── Estoque                   → /Estoque/MovimentacaoEstoque/principal
├── Criar Pedido              → /Compras/CriarCompra/principal
└── Ativação Mensal           → /AtivacaoMensal/AtivacaoMensalTransacoes/listar

Financeiro
├── Contas Bancárias          → /ContaBancaria/DistribuidorContaBancariaListagem/listar
├── Solicitação de Saque      → /SolicitacaoSaque/SolicitacaoSaqueTransacoesAdmin/listar
├── Saques em Massa           → /SolicitacaoSaque/SolicitacaoSaqueEmMassa/listar
└── Regras de Desconto        → /ComprasDescontoTotal/Configuracao/principal

Configurações
├── Módulos                   → /Modulos/Modulos/principal
├── E-mails                   → /Email/Configuracao
├── Layout/Temas              → /Temas/Layout/principal
├── Menus                     → /Menu/Arvore
├── Permissões/Grupos         → /Autorizacao/Grupos
└── Termos e Condições        → /TermosCondicoes/Configuracao/principal
```

### Loja Virtual (E-commerce Admin)
```
Base: https://allinbrasil.com.br/loja/admin/  (requer token de sessão)

Catálogo
├── Departamentos             → /catalog/category
├── Produtos                  → /catalog/product
├── Kits                      → /catalog/kit
├── Atributos                 → /catalog/attribute
├── Grupos de Atributos       → /catalog/attribute_group
├── Opções                    → /catalog/option
├── Fabricantes               → /catalog/manufacturer
├── Estoque                   → /catalog/stock
└── Importar/Exportar         → /catalog/importacao/* , /catalog/exportacao

Vendas
├── Pedidos                   → /sale/order
├── Carrinhos Abandonados     → /sale/carrinhos_abandonados/relatorio
└── Devoluções                → /sale/return

Clientes
├── Clientes                  → /sale/customer
├── Personalizar Cadastro     → /sale/custom_field
└── IPs Banidos               → /sale/customer_ban_ip

Financeiro Loja
├── Cadastrar Conta CD        → /finance/cadastrar_conta_bancaria
├── Solicitação de Saque      → /finance/solicitacao_saque
├── Transações                → /finance/transacoes_financeiras
├── Faturamento Anual         → /finance/relatorio_faturamento
└── Fechamento de Caixa       → /finance/fechamento_caixa

Configurações Loja
├── Lojas/CDs                 → /setting/store
├── Usuários/Grupos           → /user/user , /user/user_permission
├── Transportadoras           → /localisation/courier
├── Moedas/Países/Estados     → /localisation/currency, /country, /zone
├── Regiões Geográficas       → /localisation/geo_zone
├── Unidades Medida/Peso      → /localisation/length_class, /weight_class
└── Situações Estoque/Pedido  → /localisation/stock_status, /order_status

Relatórios Loja
├── Pedidos/Detalhados        → /report/sale_order, /report/sale_order_detalhado
├── Fretes/Devoluções         → /report/sale_shipping, /report/sale_return
├── Faturamento Detalhado     → /report/faturamento_detalhado
├── Produtos                  → /report/product_viewed, /report/product_purchased*
└── Clientes                  → /report/customer_order
```

### Centro de Distribuição (CD)
```
Base: https://allinbrasil.com.br/loja/admin/  (login com credenciais CD)

Acesso
├── Login CD                  → /index.php?route=common/login
└── URL direta CD             → /common/dashboard?token={token_cd}

Operação CD (escopo limitado ao próprio CD)
├── Produtos Disponíveis      → /catalog/product (filtrado por CD)
├── Comprar Produtos          → /sale/order (compra da indústria)
├── Estoque CD                → /catalog/stock (visualização)
├── Pedidos Distribuidor      → /sale/order (filtrado CD)
├── Retirada Balcão           → /sale/order (marcar entregue)
├── Financeiro CD             → /finance/* (saldo, saques, transações)
└── Relatórios CD             → /report/* (vendas, estoque, faturamento CD)
```

---

## Glossário Essencial

| Termo | Definição |
|-------|-----------|
| **Maxnível** | Empresa matriz que fabrica/produz e gerencia a rede toda |
| **CD (Centro de Distribuição)** | Filial/estoque regional que vende para distribuidores; pode ser loja física |
| **Distribuidor** | Revendedor da rede; compra da indústria ou CD, monta equipe, recebe bônus |
| **Plano de Adesão / Kit Inicial** | Pacote de produtos + taxa que o distribuidor compra para entrar na rede |
| **Qualificação** | Nível do distribuidor baseado em volume pessoal + volume da equipe (ex: Bronze, Prata, Ouro) |
| **Bônus** | Comissão paga sobre vendas da rede (unilevel, binário, liderança, etc.) |
| **Ativação Mensal** | Compra mínima mensal para manter o distribuidor "ativo" e qualificado |
| **Saldo Bônus** | Crédito acumulado que pode ser usado para compras ou sacado (conforme regras) |
| **Saque** | Retirada de saldo bônus para conta bancária; sujeito a regras/taxas/períodos |
| **Retirada no CD** | Modalidade de frete: distribuidor retira pessoalmente no balcão do CD |
| **Habilitar Produto p/ CD** | Ação na Admin Maxnível que torna produto visível/comprável no CD específico |

---

## Próximos Documentos

| Documento | Plataforma | Status |
|-----------|------------|--------|
| `02-plataforma-maxnivel/01-distribuidores/rede-distribuidores.md` | Maxnível | 🟡 Próximo |
| `02-plataforma-maxnivel/02-catalogos-planos/planos-adesao.md` | Maxnível | ⏳ |
| `03-plataforma-loja-virtual/01-catalogo/produtos.md` | Loja Virtual | ⏳ |
| `04-plataforma-cd/01-acesso-configuracao-inicial.md` | CD | ⏳ |
| `01-visao-geral/urls-acesso-por-papel.md` | Todas | ⏳ |
| `01-visao-geral/glossario-termos.md` | Todas | ⏳ |
| `06-referencia-tecnica/urls-completas-por-modulo.md` | Todas | ⏳ |