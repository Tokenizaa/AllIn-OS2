# 🏗️ Arquitetura de Scraping Enterprise - AllIn Legacy

## 📋 Contexto

A auditoria forense exaustiva (ETAPA 8) confirmou que:

- **Clientes e Distribuidores** possuem API OAuth funcional ✅
- **Produtos, Pedidos e Planos** NÃO possuem API acessível ❌
- **Loja Virtual** é baseado em OpenCart com Server-Side Rendering
- **24.700 pedidos** estão disponíveis apenas via HTML autenticado
- **Nenhuma API JSON** foi encontrada para dados estruturados

## 🎯 Objetivo

Implementar sistema de scraping enterprise para extrair dados do legado AllIn usando:

- **Python 3.12+**
- **Playwright** (autenticação e navegação)
- **BeautifulSoup4** (parsing HTML)
- **Pydantic** (validação de dados)
- **Supabase SDK** (integração com banco de dados)

## 📊 Estrutura Atual do Projeto

### Sync Engine Existente (TypeScript)

```
src/backend/shared/sync/
├── base-sync.service.ts          # Classe base com retry logic
├── product-sync.service.ts        # Sync de produtos (API não existe)
├── order-sync.service.ts          # Sync de pedidos (API não existe)
├── plan-sync.service.ts           # Sync de planos (API não existe)
├── mappers/
│   ├── product.mapper.ts
│   ├── order.mapper.ts
│   └── plan.mapper.ts
└── dto/
    └── sync-result.dto.ts
```

### Scraping Existente (Python)

```
scripts/scrape/
├── auth.py                        # Autenticação loja virtual
├── admin_auth.py                  # Autenticação painel admin
├── extractors/
│   ├── orders.py                  # Extração de pedidos
│   ├── customers.py               # Extração de customers
│   └── admin_extractors.py        # Extractors painel admin
├── transformers/
│   ├── admin_transformers.py      # Transformers painel admin
│   ├── dataclasses.py             # Dataclasses Python
│   └── to_supabase.py             # Transformação para Supabase
├── loaders/
│   └── supabase_loader.py         # Carga no Supabase
├── utils/
│   ├── retry.py                   # Retry logic
│   ├── monitoring.py              # Monitoring
│   ├── logger.py                  # Logging
│   └── checkpoint.py              # Checkpoint system
└── requirements.txt               # requests, beautifulsoup4, lxml
```

## 🏛️ Nova Arquitetura de Scraping

### Estrutura de Diretórios

```
scripts/scrapers/
│
├── base/
│   ├── __init__.py
│   ├── session_manager.py         # Gerenciamento de sessão Playwright
│   ├── browser_manager.py         # Gerenciamento de navegador
│   ├── parser_base.py             # Parser base com BeautifulSoup
│   └── retry_handler.py           # Retry logic enterprise
│
├── products/
│   ├── __init__.py
│   ├── products_scraper.py        # Scraper de produtos
│   ├── products_parser.py         # Parser de produtos
│   └── products_models.py         # Modelos Pydantic
│
├── orders/
│   ├── __init__.py
│   ├── orders_scraper.py          # Scraper de pedidos
│   ├── orders_parser.py           # Parser de pedidos
│   └── orders_models.py           # Modelos Pydantic
│
├── plans/
│   ├── __init__.py
│   ├── plans_scraper.py           # Scraper de planos
│   ├── plans_parser.py            # Parser de planos
│   └── plans_models.py            # Modelos Pydantic
│
├── sync/
│   ├── __init__.py
│   ├── sync_products.py           # Sync com Supabase (produtos)
│   ├── sync_orders.py             # Sync com Supabase (pedidos)
│   ├── sync_plans.py              # Sync com Supabase (planos)
│   └── sync_manager.py            # Gerenciador de sync
│
├── exports/
│   ├── __init__.py
│   ├── json_exporter.py           # Exportação JSON
│   └── csv_exporter.py            # Exportação CSV
│
├── storage/
│   ├── storage_state.json         # Estado da sessão Playwright
│   └── checkpoints/               # Checkpoints de progresso
│
├── logs/
│   ├── scraping.log               # Logs de scraping
│   └── errors.log                 # Logs de erros
│
└── requirements.txt               # Dependências Python
```

## 🔧 Componentes Principais

### 1. Session Manager

**Responsabilidade:** Gerenciar autenticação e persistência de sessão

```python
class SessionManager:
    def __init__(self, storage_path: str = "storage/storage_state.json"):
        self.storage_path = storage_path
        self.browser = None
        self.context = None
        self.page = None
    
    async def login(self, username: str, password: str) -> bool:
        """Login no Loja Virtual e persistir sessão"""
        
    async def load_session(self) -> bool:
        """Carregar sessão persistida"""
        
    async def save_session(self) -> None:
        """Salvar estado da sessão (cookies, localStorage)"""
        
    async def refresh_session(self) -> bool:
        """Renovar sessão se expirada"""
```

**Arquivo de Estado:**

```json
{
  "cookies": [...],
  "origins": [
    {
      "origin": "https://allinbrasil.com.br",
      "localStorage": [...]
    }
  ]
}
```

### 2. Browser Manager

**Responsabilidade:** Gerenciar ciclo de vida do navegador

```python
class BrowserManager:
    def __init__(self, headless: bool = True):
        self.headless = headless
        self.playwright = None
        self.browser = None
    
    async def start(self) -> None:
        """Iniciar navegador Playwright"""
        
    async def stop(self) -> None:
        """Fechar navegador e limpar recursos"""
        
    async def new_context(self, storage_state: str) -> BrowserContext:
        """Criar contexto com estado persistido"""
```

### 3. Parser Base

**Responsabilidade:** Parsing HTML com BeautifulSoup

```python
class ParserBase:
    def __init__(self, html: str):
        self.soup = BeautifulSoup(html, 'lxml')
    
    def extract_text(self, selector: str) -> str:
        """Extrair texto de elemento"""
        
    def extract_table(self, selector: str) -> List[Dict]:
        """Extrair tabela como lista de dicionários"""
        
    def extract_links(self, selector: str) -> List[str]:
        """Extrair links de elementos"""
```

### 4. Product Scraper

**Responsabilidade:** Extrair dados de produtos do Loja Virtual

```python
class ProductScraper(SessionManager):
    async def scrape_product_list(self, page: int = 1) -> List[ProductModel]:
        """Extrair lista de produtos com paginação"""
        
    async def scrape_product_details(self, product_id: str) -> ProductDetailModel:
        """Extrair detalhes de um produto"""
        
    async def scrape_all_products(self) -> List[ProductModel]:
        """Extrair todos os produtos (todas as páginas)"""
```

**Dados a Extrair:**

```python
class ProductModel(BaseModel):
    product_id: str
    sku: str
    nome: str
    modelo: Optional[str]
    categoria: str
    preco: Decimal
    pontos: Optional[int]
    estoque: int
    status: str
    featured: bool
    moderacao: Optional[str]

class ProductDetailModel(BaseModel):
    product_id: str
    descricao: str
    imagens: List[str]
    peso: Optional[Decimal]
    dimensoes: Optional[Dict[str, Decimal]]
    seo: Optional[Dict[str, str]]
    atributos: List[Dict[str, str]]
    categorias: List[str]
```

### 5. Order Scraper

**Responsabilidade:** Extrair dados de pedidos do Loja Virtual

```python
class OrderScraper(SessionManager):
    async def scrape_order_list(self, page: int = 1) -> List[OrderModel]:
        """Extrair lista de pedidos com paginação"""
        
    async def scrape_order_details(self, order_id: str) -> OrderDetailModel:
        """Extrair detalhes de um pedido"""
        
    async def scrape_all_orders(self, incremental: bool = False, since: Optional[Date] = None) -> List[OrderModel]:
        """Extrair todos os pedidos (ou incremental)"""
```

**Dados a Extrair:**

```python
class OrderModel(BaseModel):
    order_id: str
    cliente: str
    distribuidor: Optional[str]
    data: datetime
    status: str
    total: Decimal

class OrderDetailModel(BaseModel):
    order_id: str
    itens: List[OrderItem]
    quantidades: Dict[str, int]
    sku: Dict[str, str]
    produto: Dict[str, str]
    valor: Decimal
    forma_pagamento: str
    historico: List[Dict[str, Any]]
    comentarios: Optional[str]
    ip: Optional[str]
    endereco: Optional[AddressModel]

class OrderItem(BaseModel):
    product_id: str
    nome: str
    quantidade: int
    preco_unitario: Decimal
    total: Decimal
```

### 6. Plan Scraper

**Responsabilidade:** Extrair dados de planos do painel administrativo

```python
class PlanScraper(SessionManager):
    async def scrape_plan_list(self) -> List[PlanModel]:
        """Extrair lista de planos"""
        
    async def scrape_plan_details(self, plan_id: str) -> PlanDetailModel:
        """Extrair detalhes de um plano"""
```

**Dados a Extrair:**

```python
class PlanModel(BaseModel):
    plan_id: str
    nome: str
    tipo: str
    adesao: Decimal
    upgrade: Optional[Decimal]
    renovacao: Optional[Decimal]
    valor: Decimal
    estoque: int
    status: str
```

### 7. Sync Manager

**Responsabilidade:** Integrar scrapers com Supabase

```python
class SyncManager:
    def __init__(self, supabase_client: Client):
        self.supabase = supabase_client
    
    async def sync_products(self, products: List[ProductModel]) -> SyncResult:
        """Sincronizar produtos com Supabase"""
        
    async def sync_orders(self, orders: List[OrderModel]) -> SyncResult:
        """Sincronizar pedidos com Supabase"""
        
    async def sync_plans(self, plans: List[PlanModel]) -> SyncResult:
        """Sincronizar planos com Supabase"""
```

## 🔄 Fluxo de Sincronização

### 1. Primeira Carga (Full Sync)

```
┌─────────────────────────────────────────────────────────────┐
│                    INICIALIZAÇÃO                            │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│              SESSION MANAGER - LOGIN                         │
│  - Autenticar no Loja Virtual                               │
│  - Salvar storage_state.json                                │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│              PRODUCT SCRAPER - FULL SYNC                     │
│  - Extrair lista de produtos (paginação)                    │
│  - Extrair detalhes de cada produto                         │
│  - Validar com Pydantic                                     │
│  - Salvar checkpoint                                        │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│              ORDER SCRAPER - FULL SYNC                       │
│  - Extrair lista de pedidos (paginação)                     │
│  - Extrair detalhes de cada pedido                           │
│  - Validar com Pydantic                                     │
│  - Salvar checkpoint                                        │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│              PLAN SCRAPER - FULL SYNC                        │
│  - Extrair lista de planos                                   │
│  - Extrair detalhes de cada plano                            │
│  - Validar com Pydantic                                     │
│  - Salvar checkpoint                                        │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│              SYNC MANAGER - SUPABASE                         │
│  - Sincronizar produtos                                     │
│  - Sincronizar pedidos                                      │
│  - Sincronizar planos                                       │
│  - Gerar relatório de sync                                  │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    EXPORTAÇÃO                                │
│  - Exportar JSON                                             │
│  - Exportar CSV                                              │
└─────────────────────────────────────────────────────────────┘
```

### 2. Sincronização Incremental

```
┌─────────────────────────────────────────────────────────────┐
│              CARREGAR SESSÃO PERSISTIDA                      │
│  - Ler storage_state.json                                   │
│  - Verificar validade                                       │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│              ORDER SCRAPER - INCREMENTAL                     │
│  - Extrair últimos 7 dias                                   │
│  - Ou extrair últimos 500 pedidos                           │
│  - Comparar com checkpoint                                  │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│              SYNC MANAGER - UPSERT                           │
│  - Inserir novos registros                                  │
│  - Atualizar registros existentes                           │
└─────────────────────────────────────────────────────────────┘
```

## 🎯 Estratégia de Sincronização com Supabase

### Integração com Sync Engine Existente

**Opção 1: Substituir Sync Services (Recomendado)**

Substituir os sync services TypeScript que usam APIs inexistentes por chamadas aos scrapers Python:

```typescript
// src/backend/shared/sync/product-sync.service.ts
export class ProductSyncService extends BaseSyncService<LocalProduct> {
  public async sync(params?: { incremental?: boolean; since?: Date }): Promise<SyncResult> {
    // Chamar scraper Python via subprocess
    const result = await this.executePythonScraper('products', params);
    
    // Processar resultado JSON
    const products = JSON.parse(result.stdout);
    
    // Sincronizar com Supabase
    await this.processAllBatches(products, async (product) => {
      await this.processProduct(product, params);
    }, this.createSyncResult());
    
    return this.finalizeSyncResult(result);
  }
  
  private async executePythonScraper(entity: string, params: any): Promise<any> {
    const { exec } = require('child_process');
    return new Promise((resolve, reject) => {
      exec(`python scripts/scrapers/sync/sync_${entity}.py`, (error, stdout, stderr) => {
        if (error) reject(error);
        else resolve({ stdout, stderr });
      });
    });
  }
}
```

**Opção 2: Scrapers Independentes (Alternativa)**

Manter scrapers Python independentes e executar via cron job:

```bash
# Crontab para sync incremental diário
0 2 * * * cd /path/to/AllIn-OS2 && python scripts/scrapers/sync/sync_orders.py --incremental --days 7
0 3 * * * cd /path/to/AllIn-OS2 && python scripts/scrapers/sync/sync_products.py
0 4 * * * cd /path/to/AllIn-OS2 && python scripts/scrapers/sync/sync_plans.py
```

### Mapeamento de Tabelas Supabase

**Produtos:**

```sql
-- Tabela existente: products
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  codigo TEXT UNIQUE,
  descricao TEXT,
  categoria TEXT,
  preco DECIMAL(10,2),
  estoque INTEGER DEFAULT 0,
  ativo BOOLEAN DEFAULT true,
  metadados JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índice para allin_id
CREATE INDEX idx_products_allin_id ON products USING GIN ((metadados->>'allin_id'));
```

**Pedidos:**

```sql
-- Tabela existente: orders
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  comprador TEXT,
  usuario TEXT,
  status TEXT,
  valor_total DECIMAL(10,2),
  pedido_pago TEXT,
  loja TEXT,
  user_id UUID REFERENCES users(id),
  informacoes_produtos JSONB,
  pagamentos JSONB,
  metadados JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índice para allin_id
CREATE INDEX idx_orders_allin_id ON orders USING GIN ((metadados->>'allin_id'));
```

**Planos:**

```sql
-- Tabela existente: plans
CREATE TABLE plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE,
  description TEXT,
  price DECIMAL(10,2),
  activation_fee DECIMAL(10,2),
  plan_type TEXT,
  is_active BOOLEAN DEFAULT true,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índice para allin_id
CREATE INDEX idx_plans_allin_id ON plans USING GIN ((metadata->>'allin_id'));
```

## ⚙️ Configuração

### Variáveis de Ambiente

```bash
# .env
ALLIN_USERNAME=juniorind
ALLIN_PASSWORD=allin2025
ALLIN_LOJA_URL=https://allinbrasil.com.br/loja/admin
ALLIN_ADMIN_URL=https://allinbrasil.com.br/administracao

SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-key

SCRAPER_HEADLESS=true
SCRAPER_TIMEOUT=30000
SCRAPER_BATCH_SIZE=100
SCRAPER_MAX_RETRIES=3
SCRAPER_RETRY_DELAY=1000
```

### Dependências Python

```txt
# scripts/scrapers/requirements.txt
playwright>=1.40.0
beautifulsoup4>=4.12.0
lxml>=4.9.0
pydantic>=2.5.0
supabase>=2.3.0
python-dotenv>=1.0.0
httpx>=0.25.0
tenacity>=8.2.0
structlog>=23.2.0
```

## 🚨 Tratamento de Erros

### Retry Logic

```python
from tenacity import retry, stop_after_attempt, wait_exponential

@retry(
    stop=stop_after_attempt(3),
    wait=wait_exponential(multiplier=1, min=4, max=10),
    retry_error_callback=lambda retry_state: None
)
async def scrape_with_retry(page: Page, url: str) -> str:
    """Scrape com retry automático"""
    await page.goto(url)
    return await page.content()
```

### Checkpoint System

```python
class CheckpointManager:
    def __init__(self, checkpoint_path: str):
        self.checkpoint_path = checkpoint_path
    
    def save(self, data: Dict) -> None:
        """Salvar checkpoint"""
        with open(self.checkpoint_path, 'w') as f:
            json.dump(data, f, indent=2)
    
    def load(self) -> Dict:
        """Carregar checkpoint"""
        if os.path.exists(self.checkpoint_path):
            with open(self.checkpoint_path, 'r') as f:
                return json.load(f)
        return {}
    
    def clear(self) -> None:
        """Limpar checkpoint"""
        if os.path.exists(self.checkpoint_path):
            os.remove(self.checkpoint_path)
```

### Rate Limiting

```python
import asyncio
from datetime import datetime, timedelta

class RateLimiter:
    def __init__(self, max_requests: int, time_window: int):
        self.max_requests = max_requests
        self.time_window = time_window
        self.requests = []
    
    async def acquire(self) -> None:
        """Adquirir permissão para fazer request"""
        now = datetime.now()
        
        # Remover requests antigos
        self.requests = [r for r in self.requests if r > now - timedelta(seconds=self.time_window)]
        
        # Se atingiu limite, esperar
        if len(self.requests) >= self.max_requests:
            sleep_time = (self.requests[0] + timedelta(seconds=self.time_window)) - now
            await asyncio.sleep(sleep_time.total_seconds())
        
        self.requests.append(now)
```

## 📊 Monitoramento e Logs

### Logging Estruturado

```python
import structlog

logger = structlog.get_logger()

logger.info(
    "scraping_started",
    entity="products",
    page=1,
    total_pages=100
)

logger.error(
    "scraping_failed",
    entity="products",
    error="timeout",
    page=1,
    retry_count=3
)
```

### Métricas

```python
class ScrapingMetrics:
    def __init__(self):
        self.start_time = datetime.now()
        self.records_processed = 0
        self.records_failed = 0
        self.pages_processed = 0
    
    def get_summary(self) -> Dict:
        """Resumo das métricas"""
        duration = datetime.now() - self.start_time
        return {
            "duration_seconds": duration.total_seconds(),
            "records_processed": self.records_processed,
            "records_failed": self.records_failed,
            "success_rate": (self.records_processed / (self.records_processed + self.records_failed)) * 100,
            "pages_processed": self.pages_processed,
            "records_per_second": self.records_processed / duration.total_seconds()
        }
```

## 🎯 Plano de Implementação

### Fase 1: Infraestrutura Base (Semana 1)
- [ ] Implementar Session Manager
- [ ] Implementar Browser Manager
- [ ] Implementar Parser Base
- [ ] Implementar Retry Handler
- [ ] Implementar Checkpoint Manager
- [ ] Implementar Rate Limiter
- [ ] Configurar logging estruturado

### Fase 2: Scrapers (Semana 2)
- [ ] Implementar Product Scraper
- [ ] Implementar Product Parser
- [ ] Implementar Order Scraper
- [ ] Implementar Order Parser
- [ ] Implementar Plan Scraper
- [ ] Implementar Plan Parser
- [ ] Criar modelos Pydantic

### Fase 3: Sync com Supabase (Semana 3)
- [ ] Implementar Sync Manager
- [ ] Implementar sync_products.py
- [ ] Implementar sync_orders.py
- [ ] Implementar sync_plans.py
- [ ] Integrar com Sync Engine existente
- [ ] Testar primeira carga

### Fase 4: Produção (Semana 4)
- [ ] Implementar exportação JSON/CSV
- [ ] Configurar cron jobs
- [ ] Implementar monitoramento
- [ ] Testar sync incremental
- [ ] Documentar operação
- [ ] Treinar equipe

## 🔐 Segurança

### Credenciais
- Nunca commitar credenciais no repositório
- Usar variáveis de ambiente
- Rotacionar credenciais periodicamente

### Sessão
- Criptografar storage_state.json
- Implementar renovação automática de sessão
- Limitar tempo de vida da sessão

### Rate Limiting
- Respeitar limites do servidor
- Implementar backoff exponencial
- Monitorar bloqueios

## 📈 Performance

### Otimizações
- Usar asyncio para requests concorrentes
- Implementar cache de páginas
- Usar connection pooling
- Otimizar seletores CSS

### Benchmarks Esperados
- **Produtos:** ~1000 produtos/hora
- **Pedidos:** ~500 pedidos/hora
- **Planos:** ~100 planos/hora

### Primeira Carga Estimada
- **Produtos:** ~1 hora
- **Pedidos:** ~50 horas (24.700 pedidos)
- **Planos:** ~1 hora
- **Total:** ~52 horas

### Sync Incremental Estimado
- **Pedidos (7 dias):** ~1 hora
- **Produtos:** ~30 minutos
- **Planos:** ~10 minutos

## 🧪 Testes

### Testes Unitários
```python
def test_product_parser():
    html = load_fixture('product_page.html')
    parser = ProductParser(html)
    product = parser.parse()
    assert product.sku == "SKU-001"
    assert product.nome == "Produto Teste"
```

### Testes de Integração
```python
async def test_full_sync():
    scraper = ProductScraper()
    products = await scraper.scrape_all_products()
    sync_manager = SyncManager(supabase_client)
    result = await sync_manager.sync_products(products)
    assert result.success
    assert result.processed_records > 0
```

### Testes E2E
```python
async def test_end_to_end():
    # Login
    session = SessionManager()
    await session.login(username, password)
    
    # Scrape
    products = await session.scrape_all_products()
    
    # Sync
    result = await sync_products(products)
    
    # Verify
    db_products = supabase.table('products').select('*').execute()
    assert len(db_products.data) == len(products)
```

## 📚 Documentação

### Manuais
- [ ] Guia de Instalação
- [ ] Guia de Operação
- [ ] Guia de Troubleshooting
- [ ] Guia de Monitoramento

### API Documentation
- [ ] Session Manager API
- [ ] Scraper APIs
- [ ] Sync Manager API
- [ ] Parser APIs

### Diagramas
- [ ] Arquitetura de Componentes
- [ ] Fluxo de Dados
- [ ] Fluxo de Erros
- [ ] Fluxo de Sync

## 🎓 Conclusão

Esta arquitetura fornece uma solução enterprise para scraping do legado AllIn, com:

- **Autenticação robusta** via Playwright
- **Persistência de sessão** para reduzir overhead
- **Retry logic** para resiliência
- **Checkpoint system** para retomada após falhas
- **Validação de dados** via Pydantic
- **Integração com Supabase** para sincronização
- **Monitoramento** para observabilidade
- **Exportação** para backup e análise

A implementação seguirá as melhores práticas de scraping enterprise e se integrará com o Sync Engine existente do AllIn OS 2.0.
