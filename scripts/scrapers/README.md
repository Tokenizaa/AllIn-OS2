# 🕷️ AllIn Enterprise Scrapers

Sistema de scraping enterprise para extração de dados do legado AllIn (Produtos, Pedidos e Planos) usando Playwright, BeautifulSoup e Supabase.

## 📋 Visão Geral

Este sistema foi desenvolvido após auditoria forense que confirmou que os dados de Produtos, Pedidos e Planos do sistema legado AllIn não estão acessíveis via API, exigindo scraping autenticado do painel administrativo e loja virtual.

## 🏗️ Arquitetura

```
scripts/scrapers/
├── base/                    # Componentes base
│   ├── session_manager.py   # Gerenciamento de sessão Playwright
│   ├── browser_manager.py   # Gerenciamento de navegador
│   └── parser_base.py       # Parser HTML com BeautifulSoup
├── products/                # Scrapers de produtos
│   ├── products_models.py   # Modelos Pydantic
│   ├── products_parser.py   # Parser HTML
│   └── products_scraper.py  # Scraper com paginação
├── orders/                  # Scrapers de pedidos
│   ├── orders_models.py     # Modelos Pydantic
│   ├── orders_parser.py     # Parser HTML
│   └── orders_scraper.py    # Scraper com paginação
├── plans/                   # Scrapers de planos
│   ├── plans_models.py      # Modelos Pydantic
│   ├── plans_parser.py      # Parser HTML
│   └── plans_scraper.py     # Scraper
├── sync/                    # Sincronização com Supabase
│   ├── sync_manager.py      # Gerenciador de sync
│   ├── sync_products.py     # Script de sync produtos
│   ├── sync_orders.py       # Script de sync pedidos
│   └── sync_plans.py        # Script de sync planos
├── exports/                 # Exportação de dados
│   ├── json_exporter.py     # Exportador JSON
│   └── csv_exporter.py      # Exportador CSV
├── storage/                 # Armazenamento
│   ├── storage_state.json   # Estado da sessão
│   └── checkpoints/         # Checkpoints de progresso
├── logs/                    # Logs
│   ├── scraping.log         # Logs de scraping
│   └── errors.log           # Logs de erros
├── run_all_syncs.py         # Script principal
├── requirements.txt          # Dependências Python
└── .env.example             # Exemplo de configuração
```

## 🚀 Instalação

### 1. Instalar Dependências

```bash
cd scripts/scrapers
pip install -r requirements.txt
```

### 2. Instalar Browsers Playwright

```bash
playwright install chromium
```

### 3. Configurar Variáveis de Ambiente

```bash
cp .env.example .env
# Editar .env com suas credenciais
```

## ⚙️ Configuração

Edite o arquivo `.env` com suas credenciais:

```bash
# AllIn Credentials
ALLIN_USERNAME=juniorind
ALLIN_PASSWORD=allin2025
ALLIN_LOJA_URL=https://allinbrasil.com.br/loja/admin
ALLIN_ADMIN_URL=https://allinbrasil.com.br/administracao

# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-role-key

# Scraper Configuration
SCRAPER_HEADLESS=true
SCRAPER_TIMEOUT=30000
SCRAPER_BATCH_SIZE=100
SCRAPER_MAX_RETRIES=3
SCRAPER_RETRY_DELAY=1000
```

## 📖 Uso

### Sync Individual

#### Sync de Produtos

```bash
# Full sync
python sync/sync_products.py

# Incremental sync (últimos 7 dias)
python sync/sync_products.py --incremental --days 7
```

#### Sync de Pedidos

```bash
# Full sync
python sync/sync_orders.py

# Incremental sync (últimos 7 dias)
python sync/sync_orders.py --incremental --days 7
```

#### Sync de Planos

```bash
# Full sync
python sync/sync_plans.py

# Com detalhes
python sync/sync_plans.py --include-details
```

### Sync Completo

```bash
# Sync de todas as entidades
python run_all_syncs.py

# Sync incremental (últimos 7 dias)
python run_all_syncs.py --incremental --days 7

# Sync de entidade específica
python run_all_syncs.py --entity products
python run_all_syncs.py --entity orders
python run_all_syncs.py --entity plans

# Com exportação JSON
python run_all_syncs.py --export-json

# Com exportação CSV
python run_all_syncs.py --export-csv

# Limitar páginas
python run_all_syncs.py --max-pages 10
```

## 📊 Estrutura de Dados

### Produtos

```python
{
    "product_id": "123",
    "sku": "SKU-001",
    "nome": "Produto Exemplo",
    "modelo": "Modelo X",
    "categoria": "Categoria A",
    "preco": 99.99,
    "pontos": 100,
    "estoque": 50,
    "status": "active",
    "featured": false,
    "moderacao": null,
    "allin_synced_at": "2026-06-15T02:00:00"
}
```

### Pedidos

```python
{
    "order_id": "456",
    "cliente": "João Silva",
    "distribuidor": "Maria Santos",
    "data": "2026-06-15T00:00:00",
    "status": "completed",
    "total": 199.99,
    "allin_synced_at": "2026-06-15T02:00:00"
}
```

### Planos

```python
{
    "plan_id": "789",
    "nome": "Plano Premium",
    "tipo": "standard",
    "adesao": 99.99,
    "upgrade": 49.99,
    "renovacao": 29.99,
    "valor": 199.99,
    "estoque": 100,
    "status": "active",
    "allin_synced_at": "2026-06-15T02:00:00"
}
```

## 🔄 Estratégia de Sincronização

### Primeira Carga (Full Sync)

```bash
python run_all_syncs.py
```

- Extrai todos os produtos, pedidos e planos
- Processa em lotes de 100 registros
- Salva checkpoints para retomada
- Exporta para JSON/CSV se configurado

**Tempo estimado:**
- Produtos: ~1 hora
- Pedidos: ~50 horas (24.700 pedidos)
- Planos: ~1 hora

### Sincronização Incremental

```bash
python run_all_syncs.py --incremental --days 7
```

- Extrai apenas dados dos últimos N dias
- Atualiza registros existentes
- Insere novos registros
- Mais rápido que full sync

**Tempo estimado:**
- Pedidos (7 dias): ~1 hora
- Produtos: ~30 minutos
- Planos: ~10 minutos

## 📁 Diretórios de Saída

### Checkpoints

```
storage/checkpoints/
├── products_checkpoint.json
├── orders_checkpoint.json
└── plans_checkpoint.json
```

### Logs

```
logs/
├── scraping.log
└── errors.log
```

### Exportações

```
data/json_backup/
├── products_batch_1_20260615_020000.json
├── orders_batch_1_20260615_020000.json
└── plans_batch_1_20260615_020000.json

data/csv_backup/
├── products_batch_1_20260615_020000.csv
├── orders_batch_1_20260615_020000.csv
└── plans_batch_1_20260615_020000.csv
```

## 🔐 Segurança

- **Credenciais:** Nunca commitar `.env` no repositório
- **Sessão:** Estado da sessão criptografado em `storage_state.json`
- **Rate Limiting:** Respeita limites do servidor com backoff exponencial
- **Validação:** Dados validados com Pydantic antes do sync

## 🚨 Tratamento de Erros

### Retry Logic

- 3 tentativas automáticas com backoff exponencial
- Delay inicial de 1 segundo, máximo de 30 segundos
- Logs detalhados de erros

### Checkpoint System

- Salva progresso a cada 100 registros
- Permite retomar após falhas
- Armazena timestamp e contadores

### Rate Limiting

- Delay de 1 segundo entre páginas
- Delay de 0.5 segundos entre detalhes
- Previne bloqueios do servidor

## 📈 Monitoramento

### Logs Estruturados

Logs em formato JSON com:
- Timestamp
- Nível de severidade
- Contexto (entidade, página, registro)
- Mensagem de erro

### Métricas

Cada sync retorna:
- `total_records`: Total de registros
- `processed_records`: Registros processados
- `failed_records`: Registros com falha
- `duration_ms`: Duração em milissegundos
- `success_rate`: Taxa de sucesso

## 🧪 Testes

### Teste de Conexão

```bash
python -c "from dotenv import load_dotenv; load_dotenv(); print('Config OK')"
```

### Teste de Login

```bash
python -c "
import asyncio
from base.browser_manager import BrowserManager
from base.session_manager import SessionManager

async def test():
    bm = BrowserManager(headless=True)
    await bm.start()
    sm = SessionManager()
    success = await sm.login(bm.browser)
    print(f'Login: {\"OK\" if success else \"FAILED\"}')
    await bm.stop()

asyncio.run(test())
"
```

### Teste de Scraping

```bash
# Testar apenas 1 página
python sync/sync_products.py --max-pages 1
```

## 📚 Documentação Adicional

- [Arquitetura Completa](../../docs/scraping-architecture.md)
- [Auditoria Forense](../../docs/AUDITORIA_LEGADA_ALLIN.md)
- [Sync Engine Existente](../../src/backend/shared/sync/)

## 🤝 Integração com Sync Engine

Os scrapers Python podem ser integrados com o Sync Engine TypeScript existente de duas formas:

### Opção 1: Substituir Sync Services (Recomendado)

Modificar `src/backend/shared/sync/product-sync.service.ts` para chamar o scraper Python via subprocess.

### Opção 2: Scrapers Independentes

Executar scrapers via cron job e deixar o Sync Engine consumir os dados do Supabase.

## 🎯 Cron Jobs

```bash
# Sync incremental diário às 2h
0 2 * * * cd /path/to/AllIn-OS2/scripts/scrapers && python run_all_syncs.py --incremental --days 1

# Sync completo semanal às 3h de domingo
0 3 * * 0 cd /path/to/AllIn-OS2/scripts/scrapers && python run_all_syncs.py
```

## 🔧 Troubleshooting

### Login Falha

- Verificar credenciais no `.env`
- Verificar se URL está correta
- Tentar modo não-headless para debug

### Sessão Expirada

- O sistema renova automaticamente
- Se persistir, apagar `storage/storage_state.json`

### Rate Limiting

- Aumentar `SCRAPER_RETRY_DELAY`
- Reduzir `SCRAPER_BATCH_SIZE`
- Executar em horários de menor tráfego

### Erros de Parsing

- Verificar se estrutura HTML mudou
- Ajustar seletores CSS no parser
- Reportar no issue tracker

## 📞 Suporte

Para problemas ou dúvidas:
1. Verificar logs em `logs/`
2. Consultar documentação em `docs/`
3. Abrir issue no repositório

## 📄 Licença

Este sistema é parte do projeto AllIn OS 2.0.
