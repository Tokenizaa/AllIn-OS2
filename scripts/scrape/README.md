# 🕷️ AllIn Scrapers

Este diretório contém scrapers Python para extração de dados da plataforma AllIn.

## 📋 Estrutura

```
scrape/
├── __init__.py
├── admin_auth.py                    # Autenticação no painel administrativo
├── auth.py                          # Autenticação na loja virtual
├── extractors/
│   ├── __init__.py
│   ├── admin_extractors.py          # Extractors do painel administrativo
│   ├── orders.py                    # Extração de pedidos (7 abas)
│   └── customers.py                 # Extração de customers
├── transformers/
│   ├── __init__.py
│   ├── admin_transformers.py        # Transformers do painel administrativo
│   ├── dataclasses.py               # Dataclasses Python
│   └── to_supabase.py               # Transformação para Supabase
└── loaders/
    ├── __init__.py
    └── supabase_loader.py           # Carga no Supabase
```

## 🚀 Instalação

```bash
cd scripts/scrape
pip install -r requirements.txt
```

## ⚙️ Configuração

```bash
cp .env.example .env
# Editar .env com suas credenciais
```

---

# 🎯 Scraper do Painel Administrativo

Scraper para extração de dados do painel administrativo da AllIn quando os endpoints da API REST não estão acessíveis. Baseado em `docs/AUDITORIA_LEGADA_ALLIN.md`.

## Dados Extraídos

- **Planos (Adesões)**: ID, nome, preço, estoque, status
- **Relatório de Planos Vendidos**: # Compra, distribuidor, plano, datas, valor
- **Distribuidores**: Nº, usuário, nome, email, patrocinador, cidade, estado, ativo, data cadastro

## Tabelas do Supabase

- `plans` - Planos de adesão
- `customer_plans` - Planos vendidos/ativados
- `distributors` - Distribuidores da rede

## Uso

```bash
cd scripts
python run_admin_scrape.py
```

## Funcionalidades

- **Checkpoint System**: Permite retomar scrape de onde parou
- **Batch Processing**: Salva dados a cada 100 registros
- **JSON Backup**: Backup automático em `data/json_backup/`
- **Paginação**: Processa grandes volumes de dados
- **Estado do Banco**: Consulta estado atual antes de iniciar

## Saída

O scraper gera os seguintes arquivos:
- `data/admin_checkpoint.json` - Checkpoint para retomada
- `data/json_backup/admin_planos.json` - Planos em JSON
- `data/json_backup/admin_customer_plans_batch_*.json` - Planos vendidos em batches
- `data/json_backup/admin_distributors_batch_*.json` - Distribuidores em batches

---

# 🎯 Scraper da Loja Virtual

Crawler Python para extração de dados da loja virtual AllInBrasil e atualização do Supabase.

## Uso

```bash
cd scripts
python run_scrape.py
```

### Modos de Execução

1. **Scrape de Gap** (2026-04-19 a 2026-06-06) - ~535 pedidos
2. **Scrape de Customers** - Email e CPF (1,631 registros)
3. **Scrape Completo de Orders** - 22,195 pedidos
4. **Scrape Completo** - Customers + Orders

## 📊 Fonte de Verdade

Baseado em `docs/reverse-engineering/loja-virtual-pedidos-mapping.md`

## 🔐 Credenciais

- URL: https://allinbrasil.com.br/publico
- Usuário: juniorind
- Senha: allin2025
