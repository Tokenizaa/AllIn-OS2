# Guia Rápido: Criar um CD (Centro de Distribuição) — Passo a Passo

> **Tempo estimado:** 15–20 minutos
> **Quem executa:** Admin Master / Gestão Admin (Administração Maxnível)
> **Fonte:** Treinamento Aula 3, Aula 4 + validação na plataforma live

---

## ⚠️ Pré-requisitos

| Pré-requisito | Onde | Status |
|---------------|------|--------|
| Produtos cadastrados no catálogo | `/loja/admin/catalog/product` | — |
| Categorias (departamentos) cadastradas | `/loja/admin/catalog/category` | — |
| Formas de pagamento definidas (PagSeguro/Bônus/Boleto) | `/loja/admin/extension/payment` | — |
| Módulo de frete "Retirada na Loja" criado | `/loja/admin/extension/shipping` | — |

---

## PASSO 1 — Criar o CD na Loja Virtual

> **Aula 3:** *"Configurações, lojas e CDs. Aqui, então, ó, onde eu crio CDs... CD Goiânia."*

**URL:** `https://allinbrasil.com.br/loja/admin/setting/store` (Menu: Configurações ▸ Lojas/CDs)

```
1. Clique em [+] Adicionar
2. Preencha:
   ▸ Nome do CD:        CD Cuiabá
   ▸ Proprietário:      Nome do dono
   ▸ Tipo de Pessoa:    Física ou Jurídica
   ▸ Documento:         CPF/CNPJ do proprietário
   ▸ Endereço:          País, Estado, Cidade, CEP, Rua...
   ▸ Telefone:          +55 XX XXXXX-XXXX
   ▸ E-mail:            cd.cuiaba@empresa.com.br
   ▸ Habilitado:        Sim ✅
3. Campos de Loja (exibição):
   ▸ Meta Título:       "CD Cuiabá — Compre e Retire Aqui"  ← nome que aparece pro distribuidor
   ▸ Meta Descrição:    Descrição p/ SEO do CD
   ▸ Meta Palavras-chave: termos de busca
   ▸ Logotipo:          Upload logo do CD
4. SALVAR ✅
```

> **Resultado:** CD listado em Lojas/CDs. Distribuidores começam a ver "CD Cuiabá" como opção de loja no checkout.

---

## PASSO 2 — Criar Usuário Admin do CD

> **Aula 3:** *"Quando eu crio o CD Cuiabá, eu preciso criar um usuário, né, pro dono do CD conseguir logar na plataforma."*

**URL:** `https://allinbrasil.com.br/loja/admin/user/user` (Menu: Configurações ▸ Usuário)

```
1. Clique em [+] Adicionar
2. Preencha:
   ▸ Nome de Usuário:  cdcuiaba
   ▸ Nome Completo:    Nome do gerente do CD
   ▸ E-mail:           gerente@cdcuiaba.com.br
   ▸ Foto:             Upload (opcional)
   ▸ Senha:            Definir senha forte
   ▸ Habilitado:       Sim ✅
   ▸ ⚠️ IMPORTANTE — Loja que administra:  CD Cuiabá  ← selecionar o CD criado no Passo 1
3. SALVAR ✅
```

> **Regra:** Sem "loja" vinculada o usuário não acessa o CD. Se criar usuário sem vínculo, ele cai no painel errado.

---

## PASSO 3 — Liberar Categorias para o CD

> **Aula 4:** *"Primeiro, atrelar o departamento ao CD... Qual categoria cada CD pode comercializar? Se eu quiser que o CD de Cuiabá comercialize essa categoria, eu tenho que vir aqui na guia de dados e marcar CD Cuiabá."*

**URL:** `https://allinbrasil.com.br/loja/admin/catalog/category` (Catálogo ▸ Departamentos)

```
PARA CADA CATEGORIA que o CD pode vender:
1. Editar a categoria
2. Aba [Dados]
3. Campo "Lojas / CDs" ou equivalente:
   ▸ ✅ Marcar: CD Cuiabá
4. SALVAR
```

> ⚠️ **Erro comum:** Produto marcado p/ CD mas categoria NÃO marcada → produto invisível no CD. A categoria é o gate principal.

---

## PASSO 4 — Liberar Produtos para o CD

> **Aula 4:** *"Segunda questão importante, no produto, no cadastro do produto, eu tenho que liberar ele pro CD... para ele conseguir comprar da indústria e comercializar."*

**URL:** `https://allinbrasil.com.br/loja/admin/catalog/product` (Catálogo ▸ Produtos)

```
PARA CADA produto liberado ao CD:
1. Editar o produto
2. Aba [Ligações / Filtros]
3. Lojas/CDs:          ✅ Marcar: CD Cuiabá
4. Tipo de Comprador:  ✅ Marcar: CD (Centro de Distribuição)
5. SALVAR
```

---

## PASSO 5 — Liberar Forma de Pagamento "Centro de Distribuição"

> **Aula 4:** *"Na guia de filtros, se o CD puder comprar esse produto da indústria utilizando cartão de crédito, dep, boleto... aqui tem que tá marcado, ó, centro de distribuição, porque se não tiver marcado, ele não consegue comprar da indústria."*

**URL:** `https://allinbrasil.com.br/loja/admin/catalog/product` (Catálogo ▸ Produtos ▸ Editar)

```
No MESMO produto do Passo 4, ainda na aba [Ligações / Filtros]:
Campo "Formas de Pagamento Disponíveis":
   ▸ ✅ Marcar: Centro de Distribuição  ← MAIS IMPORTANTE
   ▸ (opcional) ✅ Bônus   → se CD pode pagar com saldo bônus
   ▸ (opcional) ✅ Boleto / PagSeguro
SALVAR
```

> ⚠️ **Se esquecer este passo:** CD clica em "Comprar Produto" e o checkout trava — "forma de pagamento indisponível".

---

## PASSO 6 — Liberar Frete "Retirada no CD"

> **Aula 4:** *"Quando você cria um novo CD, você tem que atrelar ele a forma de frete retirada no CD, caso você permita que seus distribuidores vão até o CD para retirar o produto."*

**URL:** `https://allinbrasil.com.br/loja/admin/extension/shipping` (Extensões ▸ Fretes)

```
1. Encontre o módulo de frete "Retirada na Loja / Retirada no CD"
2. Clique em [Editar]
3. Região Geográfica:  [Definir região atendida]
4. Campo Lojas/CDs habilitados:
   ▸ ✅ Marcar: CD Cuiabá
5. Situação: Habilitado ✅
6. SALVAR
```

> **Efeito:** No checkout, distribuidor vê opção "Retirar no CD ▸ CD Cuiabá" e pula cálculo de frete.

---

## PASSO 7 — Criar Saldo Bônus Inicial (Opcional)

**URL:** `https://allinbrasil.com.br/administracao/ContasCd/ContasCdTransacoesFerramenta/listar` (Ferramentas ▸ Movimentar Saldo CD)

```
1. Selecionar:  CD Cuiabá
2. Tipo:         Crédito para compra de produtos
3. Valor:        R$ 1.000,00
4. Confirmar com sua senha administrativa
5. SALVAR
```

> **Efeito:** CD consegue comprar da indústria pagando com bônus. (Opcional — só se o CD for operar com bônus.)

---

## PASSO 8 — Testar Acesso do CD

```
1. Abra janela anônima
2. URL: https://allinbrasil.com.br/loja/admin/
3. Login:  cdcuiaba / senha definida no Passo 2
4. Verificar:
   ▸ Dashboard carrega como CD Cuiabá
   ▸ Catálogo ▸ Produtos ≡ mostra produtos liberados (Passo 4-5)
   ▸ Comprar Produto funciona (checkout OK)
   ▸ Pedidos lista pedidos do próprio CD
   ▸ Financeiro mostra saldo (Passo 7)
```

---

## Tabela Resumo — Checklist dos 4 Pontos (Aula 4)

| # | Ponto | Tela | URL | Esquecer = |
|---|-------|------|-----|------------|
| 1 | Categoria liberada p/ CD | Catálogo ▸ Departamentos ▸ Editar ▸ Dados | `/catalog/category` | Produto some de todo o CD |
| 2 | Produto liberado p/ CD | Catálogo ▸ Produtos ▸ Editar ▸ Ligações | `/catalog/product` | CD não vê/comercializa produto |
| 3 | Forma pagamento "Centro Distribuição" | Produto ▸ Ligações ▸ Formas Pagamento | `/catalog/product` | Checkout CD trava |
| 4 | Frete "Retirada no CD" | Extensões ▸ Fretes ▸ Retirada na Loja ▸ Editar | `/extension/shipping` | Distribuidor não retira no CD |

---

## Dicas Finais

1. **Número de CDs:** Sem limite. Cada CD = loja própria, estoque próprio, usuários próprios.
2. **CD ≠ Distribuidor:** Cadastros 100% independentes (CD PJ, Distribuidor PF). Sem vínculo automático.
3. **Estoque CD:** Só a **Maxnível** movimenta (remessa ou reconhecimento de compra). CD não edita estoque.
4. **Descontos CD (60%) / Distribuidor (50%):** Configuração **exclusiva via suporte** — não mexa no `ComprasDescontoTotal/Configuracao` sem orientação.
5. **Bônus do distribuidor NÃO é usado na plataforma CD.** Plataformas totalmente separadas.

---

## Links Relacionados

- Documentação completa CD: [`04-plataforma-cd/01-acesso-configuracao-inicial.md`](../04-plataforma-cd/01-acesso-configuracao-inicial.md)
- Vínculo categoria-produto-CD: [`04-plataforma-cd/02-produtos-disponibilidade/vinculo-categoria-produto-cd.md`](../04-plataforma-cd/02-produtos-disponibilidade/vinculo-categoria-produto-cd.md)
- Fluxo compra distribuidor no CD: [`04-plataforma-cd/05-pedidos-retirada/fluxo-compra-distribuidor.md`](../04-plataforma-cd/05-pedidos-retirada/fluxo-compra-distribuidor.md)
- Descontos CD vs Distribuidor: [`04-plataforma-cd/02-produtos-disponibilidade/descontos-cd-vs-distribuidor.md`](../04-plataforma-cd/02-produtos-disponibilidade/descontos-cd-vs-distribuidor.md)

---

*Última atualização: 2025-08-11 | Baseado em Aula 3 (criar CD + usuário) + Aula 4 (4 pontos críticos)*