# 🕷️ Loja Virtual AllInBrasil Scraper

Crawler Python para extração de dados da loja virtual AllInBrasil e atualização do Supabase.

## 📋 Estrutura

```
scrape/
├── __init__.py
├── auth.py                          # Autenticação na loja virtual
├── extractors/
│   ├── __init__.py
│   ├── orders.py                    # Extração de pedidos (7 abas)
│   └── customers.py                 # Extração de customers
├── transformers/
│   ├── __init__.py
│   ├── dataclasses.py               # Dataclasses Python
│   └── to_supabase.py               # Transformação para Supabase
└── loaders/
    ├── __init__.py
    └── supabase_loader.py           # Carga no Supabase
```

## 🚀 Instalação

```bash
cd scripts
pip install -r requirements.txt
```

## ⚙️ Configuração

```bash
cp .env.example .env
# Editar .env com suas credenciais
```

## 🎯 Uso

```bash
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
