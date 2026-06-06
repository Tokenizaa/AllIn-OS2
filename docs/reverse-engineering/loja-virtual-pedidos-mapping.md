# 📦 Mapeamento do Sistema de Pedidos - Loja Virtual AllinBrasil

**Data:** 29 de abril de 2026  
**URL Base:** https://allinbrasil.com.br/loja/admin  
**Credenciais:** juniorind / allin2025

---

## 🎯 Objetivo

Documentar a estrutura completa do sistema de pedidos da loja virtual para criação de crawler automatizado.

---

## 🔐 Fluxo de Acesso

### 1. Login
- **URL:** https://allinbrasil.com.br/publico
- **Campos:**
  - Usuário: `input[name="login"]`
  - Senha: `input[name="senha"]`
- **Botão:** `button:has-text("Entrar")`

### 2. Acesso à Loja Virtual
- **URL após login:** https://allinbrasil.com.br/administracao/PaginaInicialAdministrador/Inicio
- **Link Loja Virtual:** `/administracao/LinkExterno/LojaVirtual/administrar`
- **Redireciona para:** https://allinbrasil.com.br/loja/admin/common/dashboard?token={token}

### 3. Lista de Pedidos
- **URL:** https://allinbrasil.com.br/loja/admin/sale/order?token={token}
- **Link:** "Ver mais..." na seção de estatísticas

---

## 📋 Estrutura da Lista de Pedidos

### Colunas da Tabela
1. **Nº** - ID do pedido
2. **Primeiro Nome** - Nome do cliente (com detalhes expandidos)
3. **Valor** - Valor total do pedido
4. **Forma de pagamento** - Método de pagamento
5. **Status** - Situação atual
6. **Pago** - Status de pagamento
7. **Ações** - Botões de ação

### Informações Expandidas no Nome do Cliente
- **Distribuidor:** Nome de usuário do distribuidor
- **Tipo de Cliente:** Categoria (ex: Distribuidor/Consumo inteligente)
- **Patrocinador:** Nome do patrocinador
- **Data Criação:** Data/hora de criação
- **Data pag:** Data/hora de pagamento

### Botões de Ação
- ** (Ver):** Link para `/loja/admin/sale/order/info?token={token}&order_id={id}`
- ** (Fatura):** Link para `/loja/admin/sale/order/invoice?token={token}&order_id={id}`
- **Ações (Dropdown):** Menu com opções adicionais

### Paginação
- Páginas numeradas (1, 2, 3, etc.)
- Opções de itens por página (15, 30, 45, 60, 75)
- Links: `?route=sale/order&token={token}&per_page={n}`

---

## 📄 Página de Detalhes do Pedido

### URL
```
https://allinbrasil.com.br/loja/admin/sale/order/info?token={token}&order_id={order_id}
```

### Botões Superiores
- ** Comanda:** `/loja/admin/sale/order/comanda?token={token}&order_id={id}`
- ** Fatura:** `/loja/admin/sale/order/invoice?token={token}&order_id={id}`
- ** Envio:** `/loja/admin/sale/order/shipping?token={token}&order_id={id}`
- ** Voltar:** `/loja/admin/sale/order?token={token}`

---

## 🗂️ Abas do Modal (7 abas)

### 1. Detalhes do Pedido (#tab-order)

**Campos da Tabela:**
- **Pedido nº:** ID do pedido
- **Fatura nº:** Botão "Gerar" para gerar fatura
- **Loja:** Nome da loja (All-in life style)
- **URL da loja:** Link para https://allinbrasil.com.br/loja/
- **Cliente:** Nome do cliente (link para edição)
- **Patrocinador:** Usuário e Nome do patrocinador
- **Tipo de cliente:** Categoria do cliente
- **E-mail:** Email do cliente
- **Telefone:** Telefone do cliente
- **CNPJ:** CNPJ do cliente
- **Tipo de pessoa:** Jurídica/Física
- **Total:** Valor total do pedido
- **Situação do pedido:** Status atual
- **Endereço IP:** IP do cliente
- **Navegador:** User agent do navegador
- **Idioma:** Idioma aceito
- **Cadastro:** Data/hora de criação
- **Modificação:** Data/hora de modificação
- **Usuário que finalizou:** Nome do usuário

**Campos Personalizados:**
- Tabela com campos customizados
- Botão "Editar" para modificar

---

### 2. Detalhes do Distribuidor (#tab-distribuidor)

**Nota:** "Essa é um compra própria para o distribuidor {nome}"

**Campos da Tabela:**
- **Nome:** Nome completo
- **Patrocinador:** Usuário e Nome
- **Data Nascimento:** Data de nascimento
- **E-mail:** Email
- **Endereço:** Rua
- **Cidade / Estado:** Cidade
- **CNPJ:** CNPJ
- **IE:** Inscrição Estadual
- **Razão Social:** Razão social
- **Nome Fantasia:** Nome fantasia

---

### 3. Detalhes do Pagamento (#tab-payment)

**Nota:** "As informações apresentadas dizem respeito ao pagador da transação."

**Campos da Tabela:**
- **Nome:** Primeiro nome
- **Sobrenome:** Sobrenome
- **Empresa:** Nome da empresa
- **Endereço:** Rua
- **Número:** Número
- **Bairro:** Bairro
- **Cidade:** Cidade
- **CEP:** CEP
- **Estado:** Estado completo
- **UF:** Sigla do estado
- **País:** País
- **Complemento:** Complemento

---

### 4. Detalhes de Envio (#tab-shipping)

**Nota:** "As informações apresentadas dizem respeito ao destinatário e ao endereço de entrega do pedido"

**Campos da Tabela:**
- **Nome:** Primeiro nome
- **Sobrenome:** Sobrenome
- **Telefone:** Telefone
- **Empresa:** Nome da empresa
- **Número:** Número
- **Endereço:** Rua
- **Bairro:** Bairro
- **Cidade:** Cidade
- **CEP:** CEP
- **Estado:** Estado completo
- **UF:** Sigla do estado
- **País:** País
- **Frete:** Tipo de frete (ex: Frete Grátis regra distribuidor)
- **Complemento:** Complemento

---

### 5. Produtos (#tab-product)

**Colunas da Tabela:**
- **Produto:** Nome do produto (link para edição) + Tamanho
- **Modelo:** Código do modelo
- **SKU:** SKU do produto
- **Quantidade:** Quantidade
- **Valor:** Valor unitário
- **Total:** Valor total (quantidade × valor)

**Linhas de Resumo:**
- **Sub-total por categoria:** Agrupamento por categoria
- **Sub-total:** Valor total antes de descontos
- **Desconto Distribuidor 50%:** Valor do desconto
- **Frete Grátis regra distribuidor:** Valor do frete
- **Total:** Valor final do pedido

---

### 6. Pagamento (#tab-pagamento)

**Resumo de Pagamento:**
- **Valor total:** Valor total do pedido
- **Valor confirmado:** Valor confirmado do pagamento

**Tabela de Pagamentos:**
- **Nº Pagamento:** ID do pagamento
- **Forma:** Método de pagamento (ex: Boleto 20 dias...)
- **Método:** Método adicional
- **Valor:** Valor pago
- **Confirmado:** Sim/Não
- **Data pagamento:** Data/hora do pagamento
- **Ações:** Botões de ação

---

### 7. Histórico (#tab-history)

**Colunas da Tabela:**
- **Cadastro:** Data/hora do evento
- **Comentário:** Descrição do evento
- **Situação:** Status após o evento
- **Cliente notificado:** Sim/Não

**Tipos de Eventos Comuns:**
- "Aguardando Liberação na All-in" - Pedido Realizado
- "Status alterado pelo administrador {nome}" - Impresso
- "COMPRA PAGA! Administrador: {nome} IP: {ip} Navegador: {ua} URL: {url} Data: {data} OBS: Executado utilizando o gatilho PagarCompra" - Pedido Pago
- "Status alterado pelo administrador {nome}" - Pedido enviado para cliente

**Formulário de Adicionar Histórico:**
- **Situação do pedido:** Combobox com opções:
  - Aguardando Envio do Boleto
  - Aguardando pagamento
  - Ajuste de Sistema
  - baixa automatica
  - Cancelado pela Operadora
  - Cancelamento Revertido
  - Despachado
  - Em analise Financeira
  - Entregue
  - Estornado
  - Impresso
  - liberado impressao
  - Não Aprovado
  - Negado
  - Pedido Cancelado
  - Pedido concluido
  - Pedido em Feira
  - Pedido enviado para cliente
  - Pedido Pago
  - Pedido Realizado
  - Pendente
  - Pré Venda
  - Processando Pedido
  - TESTE JUNIOR

- **Cliente notificado:** Radio Sim/Não
- **Comentário:** Textbox para comentário
- **Botão:** "Adicionar histórico"

---

## 🤖 Estrutura para Crawler

### DataClass Python

```python
from dataclasses import dataclass
from typing import List, Optional
from datetime import datetime

@dataclass
class PedidoInfo:
    """Informações básicas do pedido"""
    id: str
    fatura_id: Optional[str]
    loja: str
    url_loja: str
    cliente: str
    cliente_id: str
    patrocinador_usuario: str
    patrocinador_nome: str
    tipo_cliente: str
    email: str
    telefone: str
    cnpj: str
    tipo_pessoa: str
    total: float
    situacao: str
    ip: str
    navegador: str
    idioma: str
    data_cadastro: datetime
    data_modificacao: datetime
    usuario_finalizou: str

@dataclass
class DistribuidorInfo:
    """Informações do distribuidor"""
    nome: str
    patrocinador_usuario: str
    patrocinador_nome: str
    data_nascimento: str
    email: str
    endereco: str
    cidade: str
    cnpj: str
    ie: str
    razao_social: str
    nome_fantasia: str

@dataclass
class PagadorInfo:
    """Informações do pagador"""
    nome: str
    sobrenome: str
    empresa: str
    endereco: str
    numero: str
    bairro: str
    cidade: str
    cep: str
    estado: str
    uf: str
    pais: str
    complemento: str

@dataclass
class EnvioInfo:
    """Informações de envio"""
    nome: str
    sobrenome: str
    telefone: str
    empresa: str
    numero: str
    endereco: str
    bairro: str
    cidade: str
    cep: str
    estado: str
    uf: str
    pais: str
    frete: str
    complemento: str

@dataclass
class ProdutoItem:
    """Item do produto"""
    nome: str
    produto_id: str
    tamanho: str
    modelo: str
    sku: str
    quantidade: int
    valor: float
    total: float

@dataclass
class ProdutosInfo:
    """Informações dos produtos"""
    itens: List[ProdutoItem]
    subtotal_categoria: float
    subtotal: float
    desconto_distribuidor: float
    frete: float
    total: float

@dataclass
class PagamentoItem:
    """Item de pagamento"""
    id: str
    forma: str
    metodo: str
    valor: float
    confirmado: bool
    data_pagamento: datetime

@dataclass
class PagamentoInfo:
    """Informações de pagamento"""
    valor_total: float
    valor_confirmado: float
    pagamentos: List[PagamentoItem]

@dataclass
class HistoricoItem:
    """Item do histórico"""
    data: datetime
    comentario: str
    situacao: str
    cliente_notificado: bool

@dataclass
class PedidoCompleto:
    """Estrutura completa do pedido"""
    pedido: PedidoInfo
    distribuidor: DistribuidorInfo
    pagador: PagadorInfo
    envio: EnvioInfo
    produtos: ProdutosInfo
    pagamento: PagamentoInfo
    historico: List[HistoricoItem]
```

### Estrutura do Crawler

```python
class LojaVirtualPedidosCrawler:
    """Crawler para extrair dados completos de pedidos da loja virtual"""
    
    def __init__(self):
        self.base_url = "https://allinbrasil.com.br"
        self.login_url = f"{self.base_url}/publico"
        self.credentials = {
            "usuario": "juniorind",
            "senha": "allin2025"
        }
        self.token = None
    
    async def login(self):
        """Realiza login e obtém token"""
        # Navegar para página de login
        # Preencher credenciais
        # Clicar em entrar
        # Extrair token da URL
        pass
    
    async def listar_pedidos(self, pagina=1, por_pagina=15):
        """Lista pedidos da página especificada"""
        # Navegar para lista de pedidos
        # Extrair tabela de pedidos
        # Retornar lista de IDs
        pass
    
    async def extrair_pedido_completo(self, order_id):
        """Extrai todos os dados de um pedido"""
        # Navegar para página do pedido
        # Extrair aba 1: Detalhes do pedido
        # Extrair aba 2: Detalhes do distribuidor
        # Extrair aba 3: Detalhes do pagamento
        # Extrair aba 4: Detalhes de envio
        # Extrair aba 5: Produtos
        # Extrair aba 6: Pagamento
        # Extrair aba 7: Histórico
        # Retornar PedidoCompleto
        pass
    
    async def extrair_todos_pedidos(self):
        """Extrai todos os pedidos (todas as páginas)"""
        # Iterar por todas as páginas
        # Para cada pedido, extrair dados completos
        # Salvar em JSON/CSV
        pass
```

---

## 📊 Seletores CSS Principais

### Login
- Usuário: `input[name="login"]`
- Senha: `input[name="senha"]`
- Botão: `button:has-text("Entrar")`

### Lista de Pedidos
- Tabela: `table`
- Linha do pedido: `tr:has(td)`
- Link ver: `a[title="Ver"]` ou `a:has-text("")`
- Paginação: `a[href*="per_page"]`

### Detalhes do Pedido
- Abas: `a[href^="#tab-"]`
- Tabela principal: `table`
- Células: `td`

### Produtos
- Tabela de produtos: `table`
- Linha do produto: `tr:has(td)`
- Link do produto: `a[href*="product/edit"]`

### Histórico
- Tabela de histórico: `table`
- Combobox situação: `select[name*="situação"]`
- Botão adicionar: `button:has-text("Adicionar histórico")`

---

## 🔍 Notas Importantes

1. **Token de Sessão:** O token é passado em todas as URLs como parâmetro `?token={token}`
2. **Navegação por Abas:** As abas usam âncoras (`#tab-order`, `#tab-distribuidor`, etc.)
3. **Paginação:** A lista de pedidos suporta paginação com diferentes quantidades por página
4. **Campos Personalizados:** Cada pedido pode ter campos personalizados configuráveis
5. **Histórico:** O histórico mostra todos os eventos do pedido com detalhes completos
6. **Descontos:** O desconto de distribuidor (50%) é aplicado automaticamente
7. **Frete:** Frete grátis para distribuidores é uma regra configurável

---

## 📝 Próximos Passos para Implementação

1. **Implementar crawler base com Playwright**
2. **Adicionar lógica de paginação**
3. **Implementar extração de cada aba**
4. **Adicionar tratamento de erros**
5. **Implementar salvamento em JSON/CSV**
6. **Adicionar logging estruturado**
7. **Implementar retentativas automáticas**
8. **Adicionar validação de dados**
