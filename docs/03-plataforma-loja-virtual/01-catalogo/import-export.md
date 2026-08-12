# Catálogo — Importação e Exportação de Produtos (Loja Virtual)

> **Tela principal:** Importação em massa de produtos (CSV/XML) e exportação do catálogo.
>
> **URLs reais:**
> - Importar Produtos: `/loja/admin/catalog/importacao/produtos`
> - Importar Promoções: `/loja/admin/catalog/importacao/promocoes`
> - Exportar: `/loja/admin/catalog/exportacao`
>
> **Acesso:** Menu **Catálogo ▸ Importar/Exportar**
> **Fonte:** URLs mapeadas + projeto (`scripts/import-products.ts`)

---

## Visão Geral

| Ferramenta | Uso |
|-----------|-----|
| **Importar Produtos** | Cadastro em massa via arquivo (CSV/planilha) |
| **Importar Promoções** | Aplicar promoções em lote |
| **Exportar** | Baixar catálogo completo (backup, edição offline, migração) |

---

## Importar Produtos

### Na Plataforma (`/catalog/importacao/produtos`)

```
1. Catálogo ▸ Importar ▸ Produtos
2. Baixar MODELO/planilha de exemplo
3. Preencher: nome, SKU, preço, categoria, fabricante, estoque...
4. Upload do arquivo
5. Sistema processa → relatório de sucesso/erros
6. Revisar produtos importados
```

### Via Script do Projeto (devs)

O repo possui `scripts/import-products.ts`:

```bash
npm run import:products    # Importa produtos de CSV (scripts/import-products.ts)
```

> **Nota dev:** Script valida/mapeia colunas antes de gravar — usar em homologação antes de produção.

---

## Importar Promoções (`/catalog/importacao/promocoes`)

- Aplicar descontos/promoções em lote
- Colunas típicas: produto, preço promocional, data início/fim, grupo de consumo

---

## Exportar (`/catalog/exportacao`)

- Exporta o catálogo completo (produtos + variações)
- **Uso:** Backup, análise offline, edição em planilha e reimportação

---

## Regras de Negócio

| Regra | Detalhe |
|-------|---------|
| **Modelo obrigatório** | Usar planilha de exemplo (evita erro de mapeamento) |
| **Validação antes de gravar** | Relatório de erros por linha |
| **Importação não sobrescreve sem aviso** | Verificar opção (atualizar vs ignorar duplicados) |
| **SKU único** | Duplicado = erro ou atualização conforme regra |
| **Estoque no import** | Coluna de estoque alimenta catálogo |

---

## URLs Relacionadas

| Ação | URL |
|------|-----|
| Importar Produtos | `/catalog/importacao/produtos` |
| Importar Promoções | `/catalog/importacao/promocoes` |
| Exportar | `/catalog/exportacao` |
| Produtos (manual) | `/catalog/product` |

---

## Links Relacionados

- Produtos (campos): [`produtos.md`](produtos.md)
- Script de importação: `scripts/import-products.ts` (raiz do repo)

---

*Última atualização: 2025-08-11 | Baseado em URLs mapeadas + script do projeto*