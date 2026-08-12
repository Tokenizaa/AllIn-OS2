# Catálogo > Produtos — Loja Virtual (E-commerce Admin)

> **Tela principal:** Cadastro e gestão completa de produtos (simples, com variações, kits), com abas para Dados, Ligações/Filtros, Atributos, Opções, Descontos, Promoções, Imagens, SEO, Comentários.
>
> **URL real:** `https://allinbrasil.com.br/loja/admin/catalog/product`
>
> **Acesso:** Menu lateral **Catálogo ▸ Produtos** (ícone 📦)

---

## Visão Geral

A tela **Produtos** é o coração do catálogo da loja virtual. Permite:

- Criar/editar produtos **simples** ou **com variações** (tamanho, cor, voltagem, etc.)
- Definir **regras de disponibilidade** por loja/CD (quem pode comprar o quê)
- Configurar **preço cheio** (base para descontos automáticos: Distribuidor 50%, CD 60%)
- Gerenciar **estoque por opção** (grade tamanho × cor)
- Programar **descontos** e **promoções** com datas/quantidades
- Vincular **atributos** (filtros de comparação) e **opções** (variantes com preço/peso próprios)
- Controlar **imagens, SEO, comentários, arquivos** anexos

> **Regra de Ouro do Preço:** *Sempre cadastre o **preço cheio** (R$ 450). Nunca o preço com desconto. O sistema aplica desconto automático conforme o perfil do comprador (Cliente Final = cheio, Distribuidor = 50%, CD = 60%).*

---

## Estrutura da Tela

### Listagem (Index)
```
┌─────────────────────────────────────────────────────────────────────────────┐
│ Prod                                    [+ Novo]  [Importar]  [Exportar]     │
├─────┬──────────┬─────────────┬──────────┬─────────┬────────┬───────┬────────┤
│ ✓   │ Imagem   │ Nome        │ Modelo   │ Preço   │ Estoque│ Status│ Ações  │
├─────┼──────────┼─────────────┼──────────┼─────────┼────────┼───────┼────────┤
│     │ 👟       │ Tênis Nike  │ N Shocks │ R$450   │ 100    │ ✓ Ativo│ ✏️ 🗑  │
│     │          │ Shocks 001  │ 001      │         │ (34/35)│       │        │
└─────┴──────────┴─────────────┴──────────┴─────────┴────────┴───────┴────────┘
Filtros: [Busca nome/modelo/SKU] [Categoria] [Fabricante] [Status] [Estoque: Baixo/Zerado/OK]
```

### Formulário de Edição — Abas (Topo)

| Aba | Ícone | Finalidade | Obrigatória? |
|-----|-------|------------|--------------|
| **Dados** | 📋 | Informações principais, preço, estoque, dimensões, fabricante | ✅ Sim |
| **Ligações / Filtros** | 🔗 | Disponibilidade por loja/CD, tipo de comprador, frete, pagamento | ✅ Sim (para CD/Distribuidor) |
| **Atributos** | 🏷️ | Grupos de atributos para comparação (ex: Material, Conforto) | ❌ Opcional |
| **Opções** | ⚙️ | Variantes do produto (Tamanho, Cor, Voltagem) com preço/peso/imagem | ❌ (mas necessária p/ variações) |
| **Descontos** | 💰 | Descontos programados por quantidade/data/grupo de consumo | ❌ Opcional |
| **Promoções** | 🏷️ | Promoções com preço riscado (visual "de/por") | ❌ Opcional |
| **Imagens** | 🖼️ | Galeria de imagens (principal + adicionais) | ❌ (mas recomendada) |
| **SEO** | 🔍 | Meta title, description, keywords, URL amigável | ❌ Opcional |
| **Comentários** | 💬 | Avaliações de clientes (moderar/habilitar) | ❌ Opcional |
| **Arquivos** | 📎 | Anexos: manual, certificado, vídeo, NF-e, etc. | ❌ Opcional |

---

## Aba DADOS — Campos Principais

> **Treinamento (Aula 3):** *"Aqui eu cadastro o preço cheio, tá, Júnior? Jamais o preço com desconto, sempre o preço cheio, porque ele vai aplicar o desconto em cima desse valor."*

| Seção | Campo | Tipo | Obrig. | Descrição / Regra de Negócio |
|-------|-------|------|--------|------------------------------|
| **Geral** | Nome do Produto | Texto | ✅ | Nome exibido na loja (ex: "Tênis Nike Shocks Masculino") |
| | Modelo / SKU | Texto | ✅ | Código interno (ex: "N-SHOCKS-001") — usado em NF-e, logística |
| | Fabricante | Select | ❌ | Vincula a `/catalog/manufacturer` (ex: Nike, Adidas) |
| | Categorias | Multi-select | ✅ | Vincula a `/catalog/category` — **rege disponibilidade por loja/CD** |
| | Etiquetas (Tags) | Texto | ❌ | Agrupamento livre (ex: "Lançamento 2025", "Black Friday") |
| **Descrição** | Descrição Completa | Editor HTML | ❌ | CKEditor — descrição longa na página do produto |
| | Descrição Resumida | Texto | ❌ | Exibida em listagens, cards, carrinho |
| **Mídia** | Imagem Principal | Upload | ❌ | Imagem de capa (proporção 1:1 recomendada) |
| | Galeria | Multi-upload | ❌ | Imagens adicionais (lado, detalhe, uso, embalagem) |
| **Preço** | **Preço Cheio** | Decimal | ✅ | **Base para todos os descontos** (Cliente Final vê este valor) |
| | Preço Promocional | Decimal | ❌ | Se preenchido, mostra "De R$ X por R$ Y" (aba Promoções faz isso melhor) |
| | Custo | Decimal | ❌ | Para relatórios de margem/lucratividade |
| | Quantidade Mínima | Inteiro | ❌ | Força compra mínima (ex: 2 pares) |
| **Estoque** | Controlar Estoque? | Sim/Não | ✅ | Se "Não": produto infinito (serviços, digitais) |
| | Quantidade | Inteiro | Se controla | Estoque total (se sem opções) OU soma das opções |
| | Situação Sem Estoque | Select | ✅ | "Em estoque" / "Esgotado" / "Sob orçamento" / "2-3 dias" / "Personalizado" |
| | Alerta Estoque Baixo | Inteiro | ❌ | Dispara e-mail quando estoque ≤ valor (config em `/catalog/stock`) |
| | Localização no Depósito | Texto | ❌ | Ex: "Prateleira A3, Box 12" — para separação |
| **Dimensões** | Comprimento (cm) | Decimal | ❌ | **Na embalagem** — para cálculo de frete (Correios/Transportadora) |
| | Largura (cm) | Decimal | ❌ |  |
| | Altura (cm) | Decimal | ❌ |  |
| | Peso (kg/g) | Decimal | ❌ | **Peso bruto na embalagem** — para frete |
| | Unidade Medida | Select | ❌ | cm/mm/pol — configurado em `/localisation/length_class` |
| | Unidade Peso | Select | ❌ | kg/g — configurado em `/localisation/weight_class` |
| **Códigos Fiscais/Logística** | NCM | Texto (8 dígitos) | ❌ | Nomenclatura Comum Mercosul — para NF-e |
| | GTIN/EAN | Texto (13 dígitos) | ❌ | Código de barras global (GS1) |
| | Código Barras Próprio | Texto | ❌ | Código interno de barras |
| | MPN | Texto | ❌ | Manufacturer Part Number |
| | Origem | Select | ❌ | 0=Nacional / 1=Estrangeira Importação Direta / 2=Estrangeira Adquirida no Mercado Interno |
| | CFOP Padrão | Texto | ❌ | Código Fiscal de Operações e Prestações |
| | CST/ICMS | Select | ❌ | Situação Tributária (ex: 00, 10, 20, 40, 41, 60, 90) |
| **Status** | Habilitado | Sim/Não | ✅ | Se "Não": produto oculto na loja, mas mantido no admin |
| | Destaque (Home) | Sim/Não | ❌ | Exibe no carrossel/banner da página inicial |
| | Disponível a Partir De | Data/Hora | ❌ | Agenda lançamento futuro (produto só aparece após data) |

---

## Aba LIGAÇÕES / FILTROS — Disponibilidade por Loja/CD

> **Treinamento (Aula 3):** *"Observe que não aparece a categoria... Por quê? Porque não tá marcado. O que você possa definir eh por loja qual categoria de produtos você vai comercializar... Eu quero vender o tênis Nike só na loja padrão. O CD de Goiânia não vai vender, então deixo desmarcado."*

Esta aba controla **quem pode comprar** e **onde o produto aparece**.

### 1. Lojas / CDs (Onde o produto fica disponível)

| Checkbox | Efeito |
|----------|--------|
| **Loja Padrão (Matriz)** | Produto visível no e-commerce principal (cliente final) |
| **CD Goiânia / CD Cuiabá / etc.** | Produto disponível para **compra pelo CD** (reabastecimento) |
| **Filial / Loja Física X** | Produto disponível para **retirada no balcão** nessa loja |

> **Regra:** Se categoria NÃO estiver marcada para o CD, produto **não aparece** mesmo se marcado aqui. Categoria > Produto (hierarquia).

### 2. Tipo de Comprador (Filtro de Perfil)

| Perfil | Quem é | Marcar se... |
|--------|--------|--------------|
| **Cliente Final** | Consumidor comum (não distribuidor) | Venda direta B2C |
| **Distribuidor - Consumo Inteligente** | Distribuidor comprando para uso próprio | Kit pessoal, reposição |
| **Distribuidor - Recompra** | Distribuidor comprando para revender | Estoque para venda |
| **CD (Centro Distribuição)** | CD comprando da indústria para estoque próprio | Reabastecimento CD |
| **Adesão Própria** | Novo distribuidor comprando kit inicial | Ativação de cadastro |

> **Exemplo:** Produto "Kit Treinamento" → Marcar apenas **Adesão Própria**. Produto "Tênis Revenda" → Marcar **Distribuidor Recompra** + **Cliente Final**.

### 3. Formas de Pagamento Disponíveis

Checkboxes por forma de pagamento configurada em `/extension/payment`:
- PagSeguro (cartão/boleto)
- Boleto Banco do Brasil
- Bônus (saldo loja online)
- Retirada na Loja (pagamento no balcão)
- Outros módulos instalados

> **Regra CD:** Para CD comprar com **Bônus**, a forma "Bônus" deve estar marcada AQUI no produto + CD ter saldo.

### 4. Formas de Frete Disponíveis

Checkboxes por frete configurado em `/extension/shipping`:
- Correios (PAC, Sedex, Mini Envios)
- Transportadora (tabela própria)
- **Retirada na Loja / CD** (frete zero, pagamento no balcão)
- Frete Grátis (regra por valor mínimo)

> **Retirada no CD:** Requer módulo "Retirada na Loja" habilitado + CD marcado na configuração do frete (`/extension/shipping` → editar "Retirada na Loja" → marcar CDs permitidos).

---

## Aba ATRIBUTOS — Filtros de Comparação

> **Treinamento (Aula 3):** *"Uma TV. Quais são os grupos de atributo da TV? É o tamanho da tela... É se é smart, sim ou não... Quantidade de entrada HDMI... Então, é mais ou menos assim. Vou criar aqui um grupo de atributos chamado Material Predominante... Nível de Conforto... Para que que serve isso aí? A pessoa fica indecisa... Aí eu posso comparar um com o outro lá na loja."*

### Conceito: Grupo de Atributo vs Atributo

| Nível | Exemplo | Cadastro Em |
|-------|---------|-------------|
| **Grupo de Atributo** | "Material Predominante" | `/catalog/attribute_group` |
| **Atributo (Valor)** | "Fibra de Carbono", "Nylon", "Couro" | `/catalog/attribute` (vinculado ao grupo) |
| **Grupo de Atributo** | "Nível de Conforto" | `/catalog/attribute_group` |
| **Atributo (Valor)** | "Baixo", "Médio", "Alto" | `/catalog/attribute` |

### Na Aba Atributos do Produto

1. **Adicionar Grupo** → Seleciona grupo cadastrado (ex: "Material Predominante")
2. **Selecionar Atributo** → Escolhe valor (ex: "Fibra de Carbono")
3. **Imagem do Atributo** (opcional) → Foto representativa (ex: close-up da fibra)
4. **Posição** → Ordem de exibição na ficha técnica
5. **Repetir** para outros grupos

### Resultado na Loja
- **Ficha Técnica** mostra tabela: Material: Fibra de Carbono | Conforto: Alto
- **Comparador de Produtos** (até 4 lado a lado) usa estes atributos como colunas
- **Filtros Laterais** (layered navigation) permitem filtrar por "Material: Fibra de Carbono"

---

## Aba OPÇÕES — Variantes (Grade Tamanho × Cor × Voltagem)

> **Treinamento (Aula 3):** *"Opções seria as variantes do produto... Ela pode escolher através da imagem... Múltipla seleção com quantidade, ela coloca a quantidade que ela quer de qual de cada tamanho... Posso colocar a imagem... Definir a posição... Honeração de preço e peso... Por exemplo, ah, o 34, né? Ele custa... vai pagar R$ 50 a mais."*

### Tipos de Opção

| Tipo | Uso | Exemplo |
|------|-----|---------|
| **Seleção Única (Radio)** | Escolhe 1 | Voltagem: 110V / 220V |
| **Seleção Múltipla (Checkbox)** | Escolhe vários | Acessórios inclusos: Cadarço extra, Palmilha |
| **Imagem + Radio** | Visual | Cores: 🔴 Vermelho, 🔵 Azul (com foto) |
| **Grade (Matriz)** | Tamanho × Cor | Camiseta: P/M/G × Branco/Preto |

### Configuração por Opção (Cada Variante)

| Campo | Descrição |
|-------|-----------|
| **Nome da Opção** | Ex: "Tamanho 34", "Cor Preto" |
| **Valor (SKU Sufixo)** | Ex: "-34-PRE" → SKU final: `N-SHOCKS-001-34-PRE` |
| **Imagem** | Foto específica da variante |
| **Preço Adicional** | **Acrescenta ao preço base** (ex: +R$ 50 para tamanho 44+) |
| **Peso Adicional** | **Acrescenta ao peso base** (para frete) |
| **Quantidade em Estoque** | **Estoque independente por variante** (grade) |
| **Imagem de Zoom** | Foto ampliada ao passar mouse |
| **Posição** | Ordem na lista/dropdown |
| **Habilitado** | Sim/Não — desabilita variante sem apagar |

### Estoque por Opção (Grade)
> **Treinamento (Aula 3):** *"Aqui, ó, eu consigo inserir estoque tanto por tamanho quanto por cor... Por exemplo, ó, 34 tenho 50. Mando movimentar."*

- Tabela: **Linhas = Tamanhos** × **Colunas = Cores** (ou outro eixo)
- Cada célula = quantidade independente
- Movimentação: entrada/saída por célula
- Alerta de estoque baixo por variante

---

## Aba DESCONTOS — Descontos Programados

> **Treinamento (Aula 3):** *"Você pode criar descontos esporádicos... Vou liberar 10 unidades desse tênis... Descontos para diferentes datas, preços, quantidades e grupos de consumo... Esse preço, o tênis vai sair por R$ 400... Vai valer do dia 26 de junho até o dia 30... Vendeu a quantidade ou venceu a data, acaba o desconto."*

### Regras de Desconto

| Parâmetro | Descrição |
|-----------|-----------|
| **Grupo de Consumo** | Qual perfil recebe: Cliente Final / Distribuidor / CD / Adesão / Todos |
| **Prioridade** | Se múltiplos descontos se aplicam, maior prioridade vence |
| **Preço com Desconto** | Valor fixo final (ex: R$ 400) — **não %** |
| **Quantidade Limitada** | Ex: 10 unidades — acaba quando zera |
| **Data Início / Fim** | Vigência automática |
| **Quantidade Mínima** | "Compre 3, pague preço X" |
| **Aplicar a Opções** | Todas ou variantes específicas |

> **Diferença Desconto vs Promoção:** Desconto = preço direto alterado. Promoção = visual "De R$ 450 por R$ 400" (preço original riscado).

---

## Aba PROMOÇÕES — Visual "De / Por"

> **Treinamento (Aula 3):** *"Aqui na promoção... você define também o grupo de consumo, prioridade, o preço, data inicial e final. A diferença é que na promoção lá vai aparecer o preço original riscado e embaixo o preço na promoção."*

Mesmos parâmetros de Descontos, mas **exibição visual distinta** na loja:
- Preço original **riscado** (vermelho)
- Preço promocional **destacado** (verde/maior)
- Badge "PROMOÇÃO" / "% OFF" automático
- Contador regressivo (opcional) se data fim definida

---

## Aba IMAGENS — Galeria

- **Imagem Principal** (aba Dados) = capa
- **Galeria** = imagens adicionais (lifestyle, detalhe, embalagem, vídeo thumbnail)
- **Ordem** = arrastar/soltar (posição 0 = principal no lightbox)
- **Zoom** = habilitado automaticamente se imagem > 1000px
- **Alt Text** = campo para acessibilidade/SEO por imagem

---

## Aba SEO

| Campo | Limite | Dica |
|-------|--------|------|
| Meta Title | 60 chars | "Tênis Nike Shocks Masculino - Compre na AllIn" |
| Meta Description | 160 chars | Descrição persuasiva com palavra-chave |
| Meta Keywords | — | Palavras-chave separadas por vírgula |
| URL Amigável | — | `tenis-nike-shocks-masculino` (auto-gerado do nome) |

---

## Fluxos de Trabalho Críticos

### 1. Criar Produto Novo para Revenda (Distribuidor + Cliente Final)
```
1. Catálogo ▸ Produtos ▸ + Novo
2. Aba DADOS:
   - Nome: "Tênis Nike Shocks Masculino"
   - SKU: N-SHOCKS-001
   - Categoria: Tênis > Masculino (já marcada p/ Loja Padrão)
   - Preço Cheio: R$ 450,00
   - Controlar Estoque: Sim
   - Situação Sem Estoque: "2 a 3 dias"
   - Peso: 0.850 kg | Dimensões: 35x15x15 cm
   - NCM: 64041100 | CST: 00
   - Habilitado: Sim
3. Aba LIGAÇÕES/FILTROS:
   - Lojas: ✅ Loja Padrão
   - Tipo Comprador: ✅ Cliente Final | ✅ Distribuidor Recompra
   - Pagamento: ✅ PagSeguro | ✅ Boleto | ✅ Bônus
   - Frete: ✅ Correios | ✅ Retirada na Loja
4. Aba OPÇÕES (se tem variações):
   - Criar opção "Tamanho" (34,35,36,37,38,39,40,41,42,43,44)
   - Criar opção "Cor" (Preto, Branco, Azul)
   - Preencher grade estoque: 34-Preto=10, 34-Branco=5...
   - Preço adicional: +R$ 20 para 43/44
5. Aba IMAGENS: Upload foto principal + 3-4 galeria
6. Aba SEO: Preencher meta title/description
7. SALVAR
```

### 2. Liberar Produto Existente para CD (Reabastecimento)
> **Treinamento (Aula 3 & 4):** *"Se eu quiser liberar para ele [CD], eu tenho que vir aqui, ó, editar e marcar aqui, ó, centro de distribuição... Eh, e também eu tenho que marcar aqui em ligações, ó, CD Cuiabá... Porque senão eu não libero para ele comprar lá."*

```
1. Editar produto existente
2. Aba LIGAÇÕES/FILTROS:
   - Lojas/CDs: ✅ Marcar CD desejado (ex: CD Cuiabá)
   - Tipo Comprador: ✅ CD (Centro Distribuição)
   - Pagamento: ✅ Bônus | ✅ Boleto | ✅ Cartão (conforme acordo)
   - Frete: ✅ Retirada no CD (se CD permite retirada)
3. Verificar: Categoria do produto também deve estar marcada para esse CD
   (Catálogo ▸ Departamentos ▸ Editar Categoria ▸ Lojas/CDs ▸ ✅ CD Cuiabá)
4. SALVAR
5. Testar: Login no CD (/loja/admin com token CD) ▸ Produtos ▸ Verificar se aparece
```

### 3. Programar Promoção de Black Friday
```
1. Editar produto ▸ Aba PROMOÇÕES ▸ + Adicionar
2. Grupo Consumo: Cliente Final
3. Preço Promocional: R$ 299,90 (era R$ 450)
4. Data Início: 28/11/2025 00:00
5. Data Fim: 01/12/2025 23:59
6. Prioridade: 10 (alta)
7. SALVAR
→ Na loja: Preço riscado R$ 450 → R$ 299,90 verde + badge "BLACK FRIDAY 33% OFF"
```

### 4. Configurar Kit de Produtos (Produto Composto)
```
1. Catálogo ▸ Kits ▸ + Novo
2. Nome: "Kit Início Distribuidor - Bronze"
3. Produtos do Kit:
   - Tênis Nike Shocks (1 un)
   - Meia Esportiva (3 pares)
   - Bolsa Térmica (1 un)
4. Preço do Kit: R$ 599 (vs R$ 750 individuais = 20% off)
3. Disponibilidade: Apenas "Adesão Própria" (aba Ligações)
4. SALVAR
→ Novo distribuidor vê este kit na compra de adesão
```

---

## Regras de Negócio Críticas

| Regra | Onde Configura | Impacto se Errado |
|-------|----------------|-------------------|
| **Preço base = Preço Cheio** | Aba Dados > Preço | Descontos automáticos (Dist 50%, CD 60%) calculam errado |
| **Categoria deve estar liberada p/ CD** | Catálogo ▸ Departamentos ▸ Editar | Produto marcado p/ CD mas categoria não → CD não vê |
| **Forma "Centro Distribuição" no produto** | Aba Ligações > Formas Pagamento | CD não consegue finalizar compra (erro "forma indisponível") |
| **Frete "Retirada no CD" habilitado p/ CD** | Extensões ▸ Frete ▸ Retirada na Loja ▸ Editar ▸ Marcar CDs | Distribuidor não vê opção "Retirar no CD" no checkout |
| **Estoque CD alimentado só por: Remessa Maxnível OU Compra CD** | Admin Maxnível ▸ Ferramentas ▸ Movimentar Estoque / CD ▸ Comprar | Estoque CD zerado → CD não vende → Distribuidor não compra |
| **Desconto CD = 60% | Distribuidor = 50%** | Admin Maxnível ▸ Compras ▸ Desconto Total | Margem CD invertida (CD ganha R$ 10/unidade na revenda p/ Dist) |

---

## Permissões Necessárias

| Perfil | Ver | Criar | Editar | Excluir | Importar/Exportar | Gerenciar Opções/Atributos |
|--------|-----|-------|--------|---------|-------------------|----------------------------|
| **Admin Loja** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Operador Catálogo** | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ |
| **Financeiro Loja** | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **Gerente CD** | ✅ (próprios) | ❌ | ❌ | ❌ | ❌ | ❌ |

> **Config:** Menu **Configurações ▸ Grupos de Usuários** → `/user/user_permission` → Editar "Administrador de Catálogo" → Marcar: Catálogo > Produtos, Atributos, Opções, Fabricantes, Kits

---

## URLs Relacionadas (Referência Rápida)

| Ação | URL |
|------|-----|
| **Listagem Produtos** | `/catalog/product` |
| **Novo Produto** | `/catalog/product/add` |
| **Editar Produto** | `/catalog/product/edit&product_id={id}` |
| **Copiar Produto** | `/catalog/product/copy&product_id={id}` |
| **Importar Produtos (CSV)** | `/catalog/importacao/produtos` |
| **Exportar Produtos** | `/catalog/exportacao` |
| **Promoções por Produto** | `/catalog/importacao/promocoes` |
| **Departamentos/Categorias** | `/catalog/category` |
| **Atributos** | `/catalog/attribute` |
| **Grupos de Atributos** | `/catalog/attribute_group` |
| **Opções** | `/catalog/option` |
| **Fabricantes** | `/catalog/manufacturer` |
| **Kits de Produtos** | `/catalog/kit` |
| **Estoque (Gestão Manual)** | `/catalog/stock` |
| **Comentários/Avaliações** | `/catalog/review` |

---

## Troubleshooting Comum

| Sintoma | Causa | Solução |
|---------|-------|---------|
| **Produto não aparece no CD** | Categoria não marcada p/ CD OU produto não marcado p/ CD OU forma "Centro Distribuição" não marcada | Verificar hierarquia: Categoria → Produto → Forma Pagamento |
| **Preço errado para Distribuidor** | Preço base cadastrado com desconto | Corrigir para Preço Cheio; sistema aplica 50% automaticamente |
| **Opção não aparece na loja** | Opção desabilitada OU estoque zerado OU produto pai desabilitado | Habilitar opção + estoque > 0 + produto pai ativo |
| **Frete "Retirada no CD" não aparece** | Módulo desabilitado OU CD não marcado no frete OU região geográfica não atende | `/extension/shipping` → Retirada na Loja → Editar → Marcar CDs + Regiões |
| **Erro "NCM inválido" na NF-e** | NCM com menos de 8 dígitos ou código inexistente | Consultar tabela NCM oficial (Receita Federal) |
| **Imagem não faz zoom** | Imagem < 1000px na maior dimensão | Upload imagem mínima 1200x1200px |
| **Promoção não exibe "De/Por"** | Aba Promoções não preenchida (usou Descontos) | Mover para Aba Promoções para visual "riscado" |

---

## Cross-Reference: Treinamento → Documentação

| Trecho Transcrição (Aula 3) | Seção Neste Doc | URL Real |
|----------------------------|-----------------|----------|
| "preço cheio... jamais o preço com desconto... aplica desconto em cima desse valor" | Aba Dados > Preço Cheio | `/catalog/product` |
| "categoria não aparece... não tá marcado... por loja qual categoria vai comercializar" | Aba Ligações > Lojas/CDs | `/catalog/category` + `/catalog/product` |
| "quero vender só na loja padrão... CD Goiânia não vai vender... deixo desmarcado" | Tipo Comprador + Lojas/CDs | Aba Ligações/Filtros |
| "grupo de atributo... tamanho da tela... smart... HDMI... atributos de cada grupo" | Aba Atributos | `/catalog/attribute_group` + `/catalog/attribute` |
| "opções seria as variantes... múltipla seleção com quantidade... honeração de preço e peso" | Aba Opções (Grade) | `/catalog/option` + grade estoque |
| "descontos esporádicos... 10 unidades... data inicial e final... acaba o desconto" | Aba Descontos | `/catalog/product` aba Descontos |
| "promoção... preço original riscado e embaixo o preço na promoção" | Aba Promoções | `/catalog/product` aba Promoções |
| "centro de distribuição... forma de pagamento... boleto, cartão... retirada no CD" | Aba Ligações > CD + Frete | `/extension/payment` + `/extension/shipping` |
| "estoque tanto por tamanho quanto por cor... grade" | Aba Opções > Estoque por Variante | Grade na aba Opções |

---

## Próximos Documentos da Série

| Documento | Foco |
|-----------|------|
| `departamentos.md` | Categorias, subcategorias, meta tags SEO, vinculação loja/CD |
| `kits.md` | Kits de produtos (adesão, combos, kits promocionais) |
| `atributos-opcoes.md` | Deep-dive: Grupos de Atributos vs Atributos vs Opções (variantes) |
| `estoque.md` | Controle de estoque, alertas, movimentação manual, XML, relatórios |
| `import-export.md` | CSV import/export, mapeamento campos, validações, agendamento |

---

*Última atualização: 2025-08-11 | Baseado em transcrição Aula 3 + scraping plataforma live (ago/2025)*