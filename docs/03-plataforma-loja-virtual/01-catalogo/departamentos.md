# Gestão de Departamentos (Categorias) — Loja Virtual

> **Tela principal:** Organização hierárquica do catálogo em categorias e subcategorias, com SEO (meta tags), URL amigável, imagem e **disponibilidade por loja/CD**.
>
> **URL real:** `https://allinbrasil.com.br/loja/admin/catalog/category`
>
> **Acesso:** Menu lateral **Catálogo ▸ Departamentos**

---

## Visão Geral

Os **departamentos** (categorias) são a estrutura em árvore do catálogo:

```
Tênis (departamento principal)
├── Tênis Masculinos
│   ├── Corrida
│   ├── Casual
│   └── Social
└── Tênis Femininos
    ├── Corrida
    └── Casual
```

### Para que servem

| Finalidade | Descrição |
|------------|-----------|
| **Navegação na loja** | Menu lateral/principal → cliente navega por categoria |
| **Filtro de busca** | Faceted search por departamento |
| **Disponibilidade por loja/CD** | **Determina quais CD(s) podem vender a categoria** |
| **SEO** | Rastreamento {categoria} no Google (meta título/descrição/URL amigável) |
| **Agrupamento** | Fachada de vitrine, banners por categoria |

> **⚠️ Regra de Hierarquia (crítica p/ CDs):** A categoria é o **gate principal** de disponibilidade. Se a categoria não está marcada para o CD, **nenhum produto dela aparece**, mesmo que o produto individual esteja marcado.

---

## Estrutura do Formulário de Categoria

### Aba 1 — Dados

| Campo | Obrig. | Descrição |
|-------|--------|-----------|
| **Nome da Categoria** | ✅ | Ex: "Tênis Masculinos" |
| **Descrição** | ❌ | Texto exibido no topo da página de categoria (SEO) |
| **Imagem** | ❌ | Foto/banner da categoria (exibida no menu ou página) |
| **Categoria Pai (Departamento Principal)** | ❌ | **Vazio = categoria principal.** Preenchido = subcategoria |
| **URL Amigável** | ❌ | Ex: `tenis-masculinos` → loja.com/tenis-masculinos |
| **Exibir no Topo?** | ❌ | Lista no menu/destaque |
| **Coluna / Posição** | ❌ | Onde/quando exibir no layout |
| **Habilitado** | ✅ | "Não" = categoria oculta (comentários/ajustes internos) |

### Aba 2 — SEO (Meta Tags)

> **Aula 3:** *"Meta título, palavras contidas no título, meta descrição, palavras contidas na descrição, meta palavras-chave... Para que serve? Auxílio nos mecanismos de busca... vai alavancar as pesquisas no Google."*

| Campo | Limite | Dica |
|-------|--------|------|
| **Meta Título** | 60 chars | "Tênis Masculinos - Compre Online | AllIn" |
| **Meta Descrição** | 160 chars | "Tênis masculinos para corrida, casual e social. Frete grátis acima de R$ 200." |
| **Meta Palavras-chave** | — | "tênis masculino, tênis corrida, tênis casual" |

### Aba 3 — Disponibilidade por Loja/CD

> **Aula 3:** *"Observe que não aparece a categoria, ó. Por quê? Porque não tá marcado... você possa definir por loja qual categoria de produtos você vai comercializar."*

| Checkbox | Efeito |
|----------|--------|
| **Loja Padrão (Matriz)** | Categoria visível no e-commerce principal |
| **CD Goiânia / CD Cuiabá / etc.** | Categoria visível **e vendável** nesses CD(s) |

---

## Fluxos de Trabalho

### Criar Subcategoria (Ex: Tênis Masculinos dentro de Tênis)

> **Aula 3:** *"Vou clicar no botão de adicionar... Tênis Masculinos... você coloca a descrição, imagem, vai exibir no topo, em qual coluna, em qual posição. E vou salvar. Criei Tênis Masculinos dentro da categoria Tênis."*

```
1. Catálogo ▸ Departamentos ▸ [+] Adicionar
2. Nome: "Tênis Masculinos"
3. Categoria Pai (Departamento Principal): "Tênis"
4. URL Amigável: tenis-masculinos
5. Imagem: upload banner
6. Exibir no Topo: [Sim/Não] | Coluna: [1-4] | Posição: [n]
7. Aba Disponibilidade: ✅ Loja Padrão (e CDs desejados)
8. SALVAR
```

### Liberar Categoria para um CD (Fluxo com CD)

```
1. Catálogo ▸ Departamentos ▸ Editar "Tênis"
2. Aba Disponibilidade: ✅ Marcar CD Cuiabá
3. SALVAR
4. (Combinar com liberação individual de produtos → ver guia criar-cd-passo-a-passo)
```

### Desativar Categoria Temporariamente (Promoção de estoque / reestruturação)

```
1. Editar categoria
2. Habilitado: [Não]
3. SALVAR
→ Categoria some do menu + produtos dela não aparecem na navegação por categoria
   (mas produtos continuam buscáveis individualmente se ativos)
```

---

## Regras de Negócio

| Regra | Detalhe |
|-------|---------|
| **Categoria é gate do CD** | Produto liberado no CD + categoria não liberada = produto invisível |
| **URL amigável única** | Duas categorias com mesma URL → última salva vence (evite conflito) |
| **Produto pode ter várias categorias** | Multi-select — produto aparece em todas |
| **Subcategoria herda disponibilidade?** | **NÃO assume herança automática — confirme marcando cada subcategoria** |
| **Categoria excluída** | Produtos NÃO são apagados — ficam sem categoria (verificar em relatório) |

---

## URLs Relacionadas

| Ação | URL |
|------|-----|
| **Listagem Departamentos** | `/catalog/category` |
| **Novo / Editar** | `/catalog/category/add` ou `/catalog/category/edit&category_id={id}` |
| **Reparar hierarquia (/ reparent)** | Tela listagem → ícone editar em árvore |

---

*Última atualização: 2025-08-11 | Baseado em Aula 3 + validação plataforma live*