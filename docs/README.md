# Documentação do Sistema AllIn-OS2

> **Manual operacional completo do sistema de gestão MLM** — baseado nas transcrições oficiais de treinamento (4 aulas) e validação na plataforma live.

> 🌐 **Frontend da documentação:** dentro do app, rota **`/docs`** (dev: `http://localhost:5174/docs`). Sidebar automática, busca navegador, dark mode, mobile. Fontes: `src/routes/docs/` + `src/lib/docs-data.ts`. Adicione um `.md` em `docs/` e ele aparece sozinho na árvore.

---

## 📚 Guia de Navegação

```
docs/
├── 01-visao-geral/                  ← COMEÇE AQUI
│   ├── arquitetura-sistema.md       ✅ Arquitetura, papéis, URLs, glossário
│   └── glossario-termos.md          ✅ Vocabulário padronizado
│
├── 02-plataforma-maxnivel/         ← Administração Maxnível (/administracao/)
│   ├── 01-distribuidores/
│   │   ├── rede-distribuidores.md   ✅ A Rede, árvore, downline, patrocinador
│   │   ├── pendentes-aprovacao.md   ✅ Validação docs, alocação, exclusão auto
│   │   ├── excluidos.md             ✅ Reversão de exclusão
│   │   └── relatorio-indicados.md   ✅ Métricas de indicação por patrocinador
│   ├── 02-catalogos-planos/
│   │   └── planos-adesao.md         ✅ Dados REAIS (Afiliado/Avanço/Excelência)
│   ├── 03-ferramentas-operacionais/
│   │   └── ferramentas-operacionais.md ✅ Estoque, saldos, ativação, pedidos
│   ├── 04-financeiro-industria/
│   │   ├── bonus-instalados.md     ✅ Catálogo Bônus (dados reais) + regras + URLs
│   │   └── solicitacao-saque.md    ✅ Saque dist: contas, IR/INSS, massa
│   ├── 05-relatorios-industria/
│   │   └── relatorios-rede.md       ✅ Crescimento, ganhos, ativos (12 relatórios)
│   └── 06-configuracoes-sistema/
│       └── permissoes-grupos.md      ✅ Grupos de permissão Maxnível
│
├── 03-plataforma-loja-virtual/      ← Loja Virtual (/loja/admin/)
│   ├── 01-catalogo/
│   │   ├── produtos.md              ✅ Produtos (abas, preços, variantes)
│   │   ├── departamentos.md         ✅ Categorias, SEO, disponibilidade CD
│   │   ├── estoque.md               ✅ Movimentação, grades, avisos, XML
│   │   ├── kits.md                  ✅ Kits de produtos (combos)
│   │   └── import-export.md         ✅ CSV import/export, promoções em lote
│   ├── 02-vendas/
│   │   └── pedidos.md               ✅ Status, histórico, baixa, devoluções
│   ├── 03-clientes/
│   │   └── clientes.md              ✅ Cadastros, custom fields, IPs banidos
│   ├── 04-financeiro-loja/
│   │   └── financeiro-loja.md       ✅ Conta CD, saques, transações, caixa
│   ├── 05-configuracoes-loja/
│   │   ├── lojas-cds.md             ✅ Criar CD, usuário, acesso admin
│   │   ├── usuarios-grupos.md       ✅ Permissões por grupo
│   │   ├── fretes.md                ✅ Correios, transportadora, retirada CD
│   │   └── pagamentos.md            ✅ PagSeguro, boleto BB, bônus
│   └── 06-relatorios-loja/
│       └── relatorios-loja.md       ✅ 12 relatórios (URLs reais)
│
├── 04-plataforma-cd/                ← Centro de Distribuição
│   ├── 01-acesso-configuracao-inicial.md ✅ Login, dashboard, conceito
│   ├── 02-produtos-disponibilidade/
│   │   └── vinculo-categoria-produto-cd.md ✅ Checklist 4 elos
│   ├── 03-gestao-estoque-cd/
│   │   ├── remessa-industria.md    ✅ Remessa + reconhecimento pagamento
│   │   └── compra-direta-cd.md     ✅ Compra CD na indústria (estoque auto)
│   ├── 04-financeiro-cd/
│   │   ├── saldo-bonus-compras.md  ✅ Saldo bônus, créditos, transações
│   │   └── solicitacao-saque-cd.md ✅ Regras, taxas, fluxo completo
│   ├── 05-pedidos-retirada/
│   │   └── fluxo-compra-distribuidor.md ✅ Compra Dist no CD + balcão
│   ├── 06-usuarios-relatorios-cd/
│   │   └── usuarios-relatorios-cd.md ✅ Usuários + relatórios escopo CD
│   └── 07-go-live-checklist/
│       └── reset-teste-producao.md  ✅ Reset, modo teste, pré-produção
│
├── 05-guias-rapidos/                ← Quick Reference Cards
│   ├── criar-cd-passo-a-passo.md    ✅ Criar CD (8 passos, checklist 4 pontos)
│   ├── cadastrar-produto-liberar-cd.md ✅ Produto + 4 elos CD
│   └── fluxo-saque-cd.md            ✅ Saque CD (CD solicita → Matriz aprova)
│
├── 06-referencia-tecnica/
│   ├── urls-completas-por-modulo.md ✅ TODAS as URLs mapeadas (~120 telas)
│   └── matriz-permissoes-por-papel.md ✅ Quem pode o quê (3 plataformas)
│
├── 07-anexos/
│   ├── mapeamento-treinamento-telas.md ✅ Cross-ref: aula → doc → URL
│   ├── transcricoes-limpas/            ✅ Transcições processadas (JSON+MD)
│   └── capturas-tela/                  ⏳ Screenshots (fase 2)
│
└── reverse-engineering/allinbrasil/    ✅ Trabalho PRÉVIO (read-only, dados REAIS)
    ├── INVENTARIO-PLANOS.md            ✅ Campos reais, CSRF, estoque
    ├── INVENTARIO-BONUS.md             ✅ 8 bônus, transações reais, logs
    ├── RELATORIO-FINAL.md              ✅ Arquitetura legado (PHP+AngularJS)
    └── evidencias/screenshots/         ✅ PNGs reais: login, planos, bônus
```

**Status:** ✅ escrito · ⏳ pendente

---

## 🚀 Caminhos de Leitura Recomendados

### Para quem vai OPERAR (diário)
```
01-visao-geral/arquitetura-sistema.md
  → 02-plataforma-maxnivel/01-distribuidores/rede-distribuidores.md
  → 03-plataforma-loja-virtual/01-catalogo/produtos.md
  → 04-plataforma-cd/05-pedidos-retirada/fluxo-compra-distribuidor.md
```

### Para quem vai CRIAR um CD (raro, mas crítico)
```
05-guias-rapidos/criar-cd-passo-a-passo.md
  → 04-plataforma-cd/01-acesso-configuracao-inicial.md
```

### Para quem vai fazer GO-LIVE
```
04-plataforma-cd/07-go-live-checklist/reset-teste-producao.md
  → 05-guias-rapidos/criar-cd-passo-a-passo.md
```

---

## 📊 Cobertura Atual

| Plataforma | Docs Escritos | Docs Pendentes | Cobertura Área |
|------------|---------------|----------------|----------------|
| **Visão Geral** | 2 | 1 (urls-papel) | Alta |
| **Maxnível** | 9 | ~40 | Alta (núcleo) |
| **Loja Virtual** | 12 | ~5 | Alta |
| **CD** | 9 | ~4 | Alta |
| **Guias Rápidos** | 3 | 7 | Média |
| **Referência Técnica** | 2 | 4 | Média |
| **Anexos** | 2 | 1 | Alta |
| **TOTAL** | **~39** | ~60 | — |

---

## 🔗 Fontes

| Fonte | Local |
|-------|-------|
| Transcrições brutas (Google Meet) | `docs/tutoriais/aula-{1-4}.html` |
| Transcrições processadas | `docs/tutoriais/transcricoes_limpas/` |
| Scraping plataforma live | 2025-08-11 (login: Junior Padilha) |
| Mapa de cobertura completo | `docs/07-anexos/mapeamento-treinamento-telas.md` |

---

## 🛠️ Como Contribuir

1. Leia `07-anexos/mapeamento-treinamento-telas.md` → veja prioridades
2. Siga o **padrão de template** dos docs existentes (produtos.md = referência)
3. Cada doc: `Visão Geral → Estrutura da Tela → Campos → Regras → Fluxos → Permissões → URLs → Troubleshooting → Cross-Ref`
4. Cite fonte: `*Última atualização: {data} | Baseado em Aula {n} + plataforma live*`
5. Screenshots → `07-anexos/capturas-tela/` (referenciar no doc)

---

*Última atualização: 2025-08-11*