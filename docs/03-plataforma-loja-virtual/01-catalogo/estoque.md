# Catálogo — Estoque (Loja Virtual)

> **Tela principal:** Gestão manual de estoque — movimentação por produto/opção, avisos de estoque baixo por e-mail, e importação via XML.
>
> **URL real:** `https://allinbrasil.com.br/loja/admin/catalog/stock`
> **Acesso:** Menu **Catálogo ▸ Estoque**
> **Fonte:** Treinamento Aula 3

---

## Visão Geral

O módulo **Estoque** permite:

- **Movimentar manualmente:** entrada/saída por produto e por opção (grade)
- **Importar via XML:** carregar arquivo para atualização em massa
- **Configurar avisos:** e-mail automático quando estoque atinge faixa

> **Aula 3:** *"Estoque, é uma ferramenta igual aquela da indústria que permite fazer gestão de estoque manual, onde você escolhe o produto, coloca a quantidade da entrada ou saída no estoque, ou então carrega o arquivo XML aqui."*

---

## Funcionalidades

### 1. Movimentação Manual

```
1. Catálogo ▸ Estoque
2. Produto: buscar/selecionar
3. Opções (se variantes): tamanho/cor específicos
4. Tipo: Entrada / Saída
5. Quantidade
6. [Movimentar]
```

| Tipo | Uso |
|------|-----|
| **Entrada** | Recebimento de mercadoria, devolução de cliente |
| **Saída** | Baixa manual, ajuste de inventário, perda |

### 2. Movimentação por Grade (Opções)

> **Aula 3:** *"Aqui, ó, eu consigo inserir estoque tanto por tamanho quanto por cor... Por exemplo, 34 tenho 50. Mando movimentar."*

- Tabela **Tamanho × Cor** (ou eixo das opções configuradas)
- Cada célula = estoque independente da variante
- Entrada/saída por célula

### 3. Importar XML

```
1. Catálogo ▸ Estoque ▸ [Importar XML]
2. Selecionar arquivo XML (formato do sistema)
3. Sistema atualiza estoque em massa
4. Confirmar resultado (sucesso/erros)
```

> **Uso típico:** Integração com ERP/Bling, atualização periódica de estoque em lote.

---

## Avisos de Estoque Baixo (E-mail)

> **Aula 2 (Maxnível, mesmo conceito):** *"Esse módulo aqui... determina determinadas listas de e-mail dizendo que tem produtos que estão com estoque baixo... você cadastra a lista de e-mail... pode criar avisos de estoque geral ou por produto... se o estoque tiver entre 20 e 30 unidades, o sistema vai disparar um e-mail para essa lista."*

### Configuração

```
1. Estoque ▸ Configuração de Avisos
2. Lista de e-mail: cadastrar destinatários (ex: compras@empresa.com.br)
3. Aviso GERAL: faixa de estoque (ex: 20 a 30 unidades) → dispara p/ lista
4. Aviso POR PRODUTO (opcional): faixa específica p/ produto individual
5. [Salvar]
```

| Tipo de Aviso | Regra | Exemplo |
|---------------|-------|---------|
| **Geral** | Todas as opções até a faixa | Estoque entre 20-30 → e-mail |
| **Por Produto** | Faixa específica do produto | Tênis Shocks: ≤ 10 → e-mail |

> **Benefício:** Reposição proativa antes do esgotamento — evita venda sem estoque.

---

## Regras de Negócio

| Regra | Detalhe |
|-------|---------|
| **Estoque zerado = indisponível** | Produto some do checkout (ou mostra "esgotado") |
| **Situação sem estoque** | Config por produto (esgotado / sob orçamento / 2-3 dias) |
| **CD não movimenta estoque** | Só Maxnível (remessa ou reconhecimento de compra) |
| **Aviso faixa** | Dispara e-mail na transição para a faixa |
| **Opções independentes** | Variante esgotada não bloqueia outras variantes |

---

## URLs Relacionadas

| Ação | URL |
|------|-----|
| Estoque (gestão) | `/catalog/stock` |
| Situações de Estoque | `/localisation/stock_status` |
| Valor de Estoque (relatório) | `/report/product_purchased/valorEstoque` |
| Estoque por Loja (relatório) | `/report/product_purchased/estoquePorLoja` |
| Estoques (Maxnível) | `/administracao/Estoque/MovimentacaoEstoque/principal` |

---

## Troubleshooting

| Sintoma | Causa | Solução |
|---------|-------|---------|
| Aviso de estoque não chega | Lista e-mail vazia OU faixa errada | Configurar lista + faixa |
| Produto "esgotado" com estoque | Situação sem estoque errada | Editar produto → situação correta |
| XML não importa | Formato/validação | Verificar arquivo de exemplo |
| Grade com estoque inconsistente | Movimentação por célula pulada | Auditar estoque por opção |

---

## Links Relacionados

- Produtos (aba estoque/opções): [`produtos.md`](produtos.md)
- Relatórios de estoque: [`../06-relatorios-loja/relatorios-loja.md`](../06-relatorios-loja/relatorios-loja.md)
- Estoque CD (remessa indústria): [`../../04-plataforma-cd/03-gestao-estoque-cd/remessa-industria.md`](../../04-plataforma-cd/03-gestao-estoque-cd/remessa-industria.md) ⏳

---

*Última atualização: 2025-08-11 | Baseado em Aula 3 + validação plataforma live*