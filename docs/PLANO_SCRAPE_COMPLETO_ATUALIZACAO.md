# 🕷️ Plano de Scrape Completo - Atualização Definitiva do Supabase

**Data:** 6 de Junho de 2026  
**Fonte:** `docs/reverse-engineering/loja-virtual-pedidos-mapping.md`  
**Objetivo:** Fazer scrape completo da loja virtual AllInBrasil para atualizar definitivamente as tabelas do Supabase com dados corretos

---

## 🎯 Objetivos do Scrape

### Dados Críticos a Extrair

**1. Customers (1,631 registros)**
- ✅ Email (atualmente 100% NULL)
- ✅ CPF/CNPJ (atualmente 100% NULL)
- ✅ Telefone (atualmente 2 NULLs)
- ✅ Patrocinador (atualmente 1,155 NULLs)
- ✅ Endereço completo
- ✅ Data de nascimento
- ✅ Plano do comprador

**2. Orders (22,195 registros + gap de ~50 dias)**
- ✅ Todos os pedidos do gap (2026-04-19 a 2026-06-06)
- ✅ Dados de pagamento completos
- ✅ Dados de envio completos
- ✅ Status atualizado

**3. Order_Items (41,742 registros)**
- ✅ Produtos estruturados (atualmente em texto não estruturado)
- ✅ Códigos de produtos
- ✅ Tamanhos e variantes
- ✅ Valores unitários corretos

---

## 🏗️ Arquitetura do Crawler

### Estrutura de Arquivos

```
scripts/
├── scrape/
│   ├── __init__.py
│   ├── crawler.py              # Crawler principal
│   ├── auth.py                 # Autenticação
│   ├── extractors/
│   │   ├── __init__.py
│   │   ├── orders.py           # Extração de pedidos
│   │   ├── customers.py        # Extração de customers
│   │   └── products.py         # Extração de produtos
│   ├── transformers/
│   │   ├── __init__.py
│   │   ├── to_supabase.py      # Transformação para Supabase
│   │   └── dataclasses.py      # Dataclasses Python
│   └── loaders/
│       ├── __init__.py
│       └── supabase_loader.py  # Carga no Supabase
└── run_scrape.py               # Script principal de execução
```

---

## 🔐 Autenticação

### Credenciais

```python
BASE_URL = "https://allinbrasil.com.br/loja/admin"
USERNAME = "juniorind"
PASSWORD = "allin2025"
```

### Fluxo de Login

Baseado no documento `loja-virtual-pedidos-mapping.md`:

```python
import requests
from bs4 import BeautifulSoup

class LojaVirtualAuth:
    def __init__(self):
        self.session = requests.Session()
        self.base_url = "https://allinbrasil.com.br/loja/admin"
        self.session_token = None
    
    def login(self):
        """Autenticar na loja virtual"""
        # 1. Acessar página de login
        login_page = self.session.get(f"{self.base_url}/login")
        
        # 2. Extrair CSRF token se necessário
        soup = BeautifulSoup(login_page.text, 'html.parser')
        csrf_token = soup.find('input', {'name': 'csrf_token'})['value']
        
        # 3. Enviar credenciais
        login_data = {
            'username': 'juniorind',
            'password': 'allin2025',
            'csrf_token': csrf_token
        }
        
        response = self.session.post(
            f"{self.base_url}/login",
            data=login_data
        )
        
        # 4. Verificar se login foi bem-sucedido
        if response.status_code == 200 and 'dashboard' in response.url:
            print("✅ Login bem-sucedido")
            return True
        else:
            print("❌ Login falhou")
            return False
```

---

## 📦 Dataclasses Python

Baseado no documento `loja-virtual-pedidos-mapping.md`:

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

---

## 🕷️ Crawler Principal

### Estrutura do Crawler

```python
import requests
from bs4 import BeautifulSoup
from typing import List
import time
import json

class LojaVirtualCrawler:
    def __init__(self):
        self.auth = LojaVirtualAuth()
        self.session = None
        self.base_url = "https://allinbrasil.com.br/loja/admin"
    
    def start(self):
        """Iniciar crawler"""
        # 1. Autenticar
        if not self.auth.login():
            raise Exception("Falha na autenticação")
        
        self.session = self.auth.session
        
        # 2. Extrair lista de pedidos
        orders = self.extract_orders_list()
        
        # 3. Extrair detalhes de cada pedido
        complete_orders = []
        for order_id in orders:
            print(f"Extraindo pedido {order_id}...")
            complete_order = self.extract_order_details(order_id)
            complete_orders.append(complete_order)
            time.sleep(1)  # Rate limiting
        
        return complete_orders
    
    def extract_orders_list(self, start_date=None, end_date=None):
        """Extrair lista de pedidos"""
        orders = []
        page = 1
        
        while True:
            # URL da lista de pedidos
            url = f"{self.base_url}/pedidos?page={page}"
            
            if start_date and end_date:
                url += f"&start_date={start_date}&end_date={end_date}"
            
            response = self.session.get(url)
            soup = BeautifulSoup(response.text, 'html.parser')
            
            # Extrair IDs dos pedidos da página
            order_rows = soup.select('.order-row')
            
            if not order_rows:
                break  # Fim da paginação
            
            for row in order_rows:
                order_id = row.select_one('.order-id').text.strip()
                orders.append(order_id)
            
            page += 1
            time.sleep(0.5)  # Rate limiting
        
        return orders
    
    def extract_order_details(self, order_id):
        """Extrair detalhes completos do pedido (7 abas)"""
        url = f"{self.base_url}/pedidos/{order_id}"
        response = self.session.get(url)
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # Aba 1: PedidoInfo
        pedido_info = self.extract_pedido_info(soup)
        
        # Aba 2: DistribuidorInfo
        distribuidor_info = self.extract_distribuidor_info(soup)
        
        # Aba 3: PagadorInfo
        pagador_info = self.extract_pagador_info(soup)
        
        # Aba 4: EnvioInfo
        envio_info = self.extract_envio_info(soup)
        
        # Aba 5: ProdutosInfo
        produtos_info = self.extract_produtos_info(soup)
        
        # Aba 6: PagamentoInfo
        pagamento_info = self.extract_pagamento_info(soup)
        
        # Aba 7: HistoricoItem
        historico = self.extract_historico(soup)
        
        return PedidoCompleto(
            pedido=pedido_info,
            distribuidor=distribuidor_info,
            pagador=pagador_info,
            envio=envio_info,
            produtos=produtos_info,
            pagamento=pagamento_info,
            historico=historico
        )
```

---

## 🔄 Transformação para Supabase

### Mapeamento de Campos

```python
from supabase import create_client
import uuid

class SupabaseTransformer:
    def __init__(self, supabase_url, supabase_key):
        self.supabase = create_client(supabase_url, supabase_key)
    
    def transform_customer(self, pedido: PedidoCompleto):
        """Transformar dados de customer para Supabase"""
        return {
            'id_comprador': pedido.pedido.cliente_id,
            'usuario': pedido.pedido.cliente,
            'email': pedido.pedido.email,  # ✅ DADO CRÍTICO
            'telefone': pedido.pedido.telefone,
            'cpf': pedido.pedido.cnpj,  # ✅ DADO CRÍTICO
            'patrocinador_comprador': pedido.pedido.patrocinador_usuario,
            'nome_completo': pedido.distribuidor.nome,
            'data_criacao': pedido.pedido.data_cadastro,
            'plano_comprador': pedido.distribuidor.nome_fantasia,
            'endereco': pedido.distribuidor.endereco,
            'cidade': pedido.distribuidor.cidade,
            'estado': pedido.pagador.estado,
            'bairro': pedido.pagador.bairro,
            'numero': pedido.pagador.numero,
            'complemento': pedido.pagador.complemento,
            'cep': pedido.pagador.cep
        }
    
    def transform_order(self, pedido: PedidoCompleto):
        """Transformar dados de order para Supabase"""
        return {
            'numero_pedido': pedido.pedido.id,
            'status_pedido': pedido.pedido.situacao,
            'id_comprador': pedido.pedido.cliente_id,
            'comprador': pedido.pedido.cliente,
            'usuario': pedido.pedido.cliente,
            'patrocinador_comprador': pedido.pedido.patrocinador_usuario,
            'telefone': pedido.pedido.telefone,
            'forma_pagamento': pedido.pagamento.pagamentos[0].forma if pedido.pagamento.pagamentos else None,
            'estado': pedido.envio.estado,
            'cidade': pedido.envio.cidade,
            'endereco': pedido.envio.endereco,
            'bairro': pedido.envio.bairro,
            'numero': pedido.envio.numero,
            'complemento': pedido.envio.complemento,
            'cep': pedido.envio.cep,
            'forma_entrega': pedido.envio.frete,
            'cancelado': pedido.pedido.situacao == 'cancelado',
            'pago': pedido.pagamento.pagamentos[0].confirmado if pedido.pagamento.pagamentos else False,
            'data_criacao': pedido.pedido.data_cadastro,
            'data_pagamento': pedido.pagamento.pagamentos[0].data_pagamento if pedido.pagamento.pagamentos else None,
            'valor_total_pedido': pedido.pedido.total,
            'pagamentos': json.dumps([p.__dict__ for p in pedido.pagamento.pagamentos]),
            'plano_comprador': pedido.distribuidor.nome_fantasia
        }
    
    def transform_order_items(self, pedido: PedidoCompleto):
        """Transformar dados de order_items para Supabase"""
        items = []
        for item in pedido.produtos.itens:
            items.append({
                'product_code': item.sku,
                'product_name': item.nome,
                'quantity': item.quantidade,
                'unit_price': item.valor,
                'total_price': item.total,
                'size': item.tamanho,
                'variant': item.modelo
            })
        return items
```

---

## 📥 Carga no Supabase

### Script de Atualização

```python
class SupabaseLoader:
    def __init__(self, supabase_url, supabase_key):
        self.supabase = create_client(supabase_url, supabase_key)
    
    def update_customers(self, customers: List[dict]):
        """Atualizar tabela customers"""
        updated_count = 0
        for customer_data in customers:
            # Buscar customer por id_comprador
            existing = self.supabase.table('customers').select('id').eq('id_comprador', customer_data['id_comprador']).execute()
            
            if existing.data:
                # Atualizar customer existente
                customer_id = existing.data[0]['id']
                self.supabase.table('customers').update(customer_data).eq('id', customer_id).execute()
                updated_count += 1
            else:
                # Criar novo customer
                self.supabase.table('customers').insert(customer_data).execute()
        
        print(f"✅ {updated_count} customers atualizados")
    
    def update_orders(self, orders: List[dict]):
        """Atualizar tabela orders"""
        updated_count = 0
        for order_data in orders:
            # Buscar order por numero_pedido
            existing = self.supabase.table('orders').select('id').eq('numero_pedido', order_data['numero_pedido']).execute()
            
            if existing.data:
                # Atualizar order existente
                order_id = existing.data[0]['id']
                self.supabase.table('orders').update(order_data).eq('id', order_id).execute()
                updated_count += 1
            else:
                # Criar nova order
                self.supabase.table('orders').insert(order_data).execute()
        
        print(f"✅ {updated_count} orders atualizados")
    
    def update_order_items(self, order_items: List[dict], order_id: str):
        """Atualizar tabela order_items"""
        # Deletar itens existentes
        self.supabase.table('order_items').delete().eq('order_id', order_id).execute()
        
        # Inserir novos itens
        for item_data in order_items:
            item_data['order_id'] = order_id
            self.supabase.table('order_items').insert(item_data).execute()
        
        print(f"✅ {len(order_items)} order_items atualizados")
```

---

## 🚀 Script Principal de Execução

```python
#!/usr/bin/env python3
"""
Script principal para execução do scrape completo
"""

import os
from scrape.crawler import LojaVirtualCrawler
from scrape.transformers.to_supabase import SupabaseTransformer
from scrape.loaders.supabase_loader import SupabaseLoader

# Configurações
SUPABASE_URL = os.getenv('SUPABASE_URL', 'https://isjsydhuqurneswstlyx.supabase.co')
SUPABASE_KEY = os.getenv('SUPABASE_KEY', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...')

def main():
    print("🚀 Iniciando scrape completo da loja virtual AllInBrasil")
    
    # 1. Iniciar crawler
    crawler = LojaVirtualCrawler()
    complete_orders = crawler.start()
    
    print(f"✅ {len(complete_orders)} pedidos extraídos")
    
    # 2. Transformar dados
    transformer = SupabaseTransformer(SUPABASE_URL, SUPABASE_KEY)
    
    customers = []
    orders = []
    all_order_items = []
    
    for pedido in complete_orders:
        # Transformar customer
        customer = transformer.transform_customer(pedido)
        customers.append(customer)
        
        # Transformar order
        order = transformer.transform_order(pedido)
        orders.append(order)
        
        # Transformar order_items
        order_items = transformer.transform_order_items(pedido)
        all_order_items.extend(order_items)
    
    print(f"✅ {len(customers)} customers transformados")
    print(f"✅ {len(orders)} orders transformados")
    print(f"✅ {len(all_order_items)} order_items transformados")
    
    # 3. Carregar no Supabase
    loader = SupabaseLoader(SUPABASE_URL, SUPABASE_KEY)
    
    # Atualizar customers
    loader.update_customers(customers)
    
    # Atualizar orders
    loader.update_orders(orders)
    
    # Atualizar order_items
    for order in orders:
        order_id = order['numero_pedido']  # Precisa obter UUID real
        order_items = [item for item in all_order_items if item['order_id'] == order_id]
        loader.update_order_items(order_items, order_id)
    
    print("🎉 Scrape completo finalizado!")

if __name__ == '__main__':
    main()
```

---

## 📋 Estratégia de Execução

### Fase 1: Scrape de Gap (2026-04-19 a 2026-06-06)

**Prioridade:** Alta - Dados mais recentes

```python
# Extrair apenas pedidos do gap
crawler = LojaVirtualCrawler()
gap_orders = crawler.extract_orders_list(
    start_date='2026-04-19',
    end_date='2026-06-06'
)
```

**Estimativa:** ~535 pedidos (50 dias × 10.7 pedidos/dia)

---

### Fase 2: Scrape de Customers (1,631 registros)

**Prioridade:** Crítica - Email e CPF

```python
# Extrair dados de customers
# Usar endpoint de customers da API ou scrape da página de perfil
customers = crawler.extract_customers()
```

**Campos Críticos:**
- Email (atualmente 100% NULL)
- CPF/CNPJ (atualmente 100% NULL)
- Patrocinador (atualmente 1,155 NULLs)

---

### Fase 3: Scrape Completo de Orders (22,195 registros)

**Prioridade:** Média - Atualização de dados existentes

```python
# Extrair todos os pedidos
all_orders = crawler.extract_orders_list()
```

**Campos a Atualizar:**
- Produtos estruturados
- Dados de pagamento
- Dados de envio
- Status atualizado

---

### Fase 4: Validação e Correção

**Prioridade:** Alta - Garantir qualidade dos dados

```python
# Validar dados após atualização
validator = DataValidator()
validator.validate_customers()
validator.validate_orders()
validator.validate_order_items()
```

---

## 🔧 Dependências

### requirements.txt

```
requests==2.31.0
beautifulsoup4==4.12.2
lxml==4.9.3
supabase==2.3.4
python-dotenv==1.0.0
pandas==2.0.3
openpyxl==3.1.2
```

### Instalação

```bash
pip install -r requirements.txt
```

---

## ⚙️ Configuração

### .env

```bash
SUPABASE_URL=https://isjsydhuqurneswstlyx.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
LOJA_VIRTUAL_USERNAME=juniorind
LOJA_VIRTUAL_PASSWORD=allin2025
```

---

## 📊 Monitoramento e Logging

### Estrutura de Logging

```python
import logging

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('scrape.log'),
        logging.StreamHandler()
    ]
)

logger = logging.getLogger(__name__)

# Uso
logger.info("Iniciando scrape...")
logger.error("Falha na autenticação")
logger.warning("Pedido sem itens: {order_id}")
```

---

## 🛡️ Tratamento de Erros

### Estratégia de Retry

```python
from tenacity import retry, stop_after_attempt, wait_exponential

@retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=1, min=4, max=10))
def extract_order_details_with_retry(order_id):
    """Extrair detalhes do pedido com retry"""
    try:
        return crawler.extract_order_details(order_id)
    except Exception as e:
        logger.error(f"Erro ao extrair pedido {order_id}: {e}")
        raise
```

---

## 📈 Progresso Esperado

### Métricas de Sucesso

| Métrica | Antes | Depois | Meta |
|---------|-------|--------|------|
| Customers sem email | 1,631 (100%) | 0 | 100% |
| Customers sem CPF | 1,631 (100%) | < 100 (6%) | 94% |
| Customers sem sponsor | 636 (39%) | 0 | 100% |
| Orders sem items | 3,209 (14.5%) | < 100 (0.5%) | 96% |
| Orders com totais inconsistentes | 17,810 (80.2%) | 0 | 100% |
| Order_items com total_price NULL | 41,742 (100%) | 0 | 100% |
| Gap de dados preenchido | 0% | 100% | 100% |

---

## ⏱️ Estimativa de Tempo

| Fase | Tempo Estimado |
|------|----------------|
| Implementação do crawler | 2-3 dias |
| Scrape de gap (535 pedidos) | 1-2 horas |
| Scrape de customers (1,631) | 2-3 horas |
| Scrape de orders (22,195) | 8-12 horas |
| Transformação e carga | 1-2 horas |
| Validação e correção | 2-3 horas |
| **Total** | **3-4 dias** |

---

## 🎯 Próximos Passos

### Imediato

1. **Criar estrutura de diretórios** para o crawler
2. **Implementar autenticação** na loja virtual
3. **Testar extração de 10 pedidos** de amostra
4. **Validar estrutura de dados** extraídos

### Curto Prazo

5. **Implementar extração completa** de orders
6. **Implementar transformação** para Supabase
7. **Implementar carga** no Supabase
8. **Executar scrape de gap** (2026-04-19 a 2026-06-06)

### Médio Prazo

9. **Executar scrape de customers** (email, CPF)
10. **Executar scrape completo** de orders
11. **Validar dados** após atualização
12. **Recalcular bônus** com dados atualizados

---

## 📝 Conclusão

Este plano fornece uma estrutura completa para implementar o scrape da loja virtual AllInBrasil usando o documento `loja-virtual-pedidos-mapping.md` como fonte de verdade. O scraper irá:

1. **Extrair dados críticos faltantes** (email, CPF, patrocinadores)
2. **Preencher o gap de dados** dos últimos 50 dias
3. **Estruturar dados de produtos** (atualmente em texto não estruturado)
4. **Atualizar todas as tabelas** do Supabase com dados corretos

A implementação deve seguir a ordem de prioridade: gap → customers → orders completos → validação.

---

**Documento criado em:** 6 de Junho de 2026  
**Versão:** 1.0  
**Autor:** Cascade AI Assistant
