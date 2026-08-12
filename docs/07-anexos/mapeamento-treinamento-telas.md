# Mapeamento Cross-Referência: Treinamento → Documentação → URL Real

> **Finalidade:** Ligar cada trecho relevante das transcrições das aulas de treinamento ao arquivo de documentação correspondente e à URL real da plataforma.
>
> **Fonte das transcrições:** `docs/tutoriais/aula-{1-4}.html` (bruto) e `docs/tutoriais/transcricoes_limpas/aula-{1-4}-limpo.md` (processado)
>
> **Fonte da plataforma:** Scraping live em 2025-08-11 (login: Junior Padilha / Admin Master)

---

## Mapa das Aulas

| Aula | Tema | Plataforma Coberta |
|------|------|--------------------|
| **Aula 1** | Plano de Negócio / Configuração Inicial | Base do sistema |
| **Aula 2** | Administração Maxnível (gestão completa) | `/administracao/` |
| **Aula 3** | Gerenciamento da Loja Virtual (e-commerce) | `/loja/admin/` |
| **Aula 4** | Gerenciamento do CD (Centro de Distribuição) | `/loja/admin/` (token CD) |

---

## AULA 1 — Plano de Negócio

| Trecho Transcrição | Conteúdo Técnico | Doc Destino | URL Real |
|--------------------|------------------|-------------|----------|
| "Só, só abrir aqui. Treinamento plano de negócio. Configurar" | Introdução ao treinamento, configuração inicial | `01-visao-geral/arquitetura-sistema.md` | `/administracao/` |
| (Restante — áudio truncado/incompleto) | — | — | — |

> ⚠️ **Nota:** Aula 1 tem transcrição muito curta e fragmentada (`docs/tutoriais/aula-1.html`). Conteúdo operacional é mínimo. Recomenda-se complementar com Aula 2 para a base de configuração.

---

## AULA 2 — Administração Maxnível

### Distribuidores
| Trecho Transcrição | Conteúdo Técnico | Doc Destino | URL Real |
|--------------------|------------------|-------------|----------|
| "escritório virtual de um membro da rede... movimentação pessoal dessa pessoa... e a da rede dela... bonificação" | Login como admin no escritório virtual do distribuidor | `02-plataforma-maxnivel/01-distribuidores/rede-distribuidores.md` | `/Distribuidor/DistribuidoresARede/listar` |
| "rede linear, no formato de organograma... primeiro downline... acompanha toda produção da rede... infinito" | Árvore/Organograma da rede, downline | `02-plataforma-maxnivel/01-distribuidores/rede-distribuidores.md` | Aba Árvore (mesma URL) |
| "alterar patrocinador... só cadastro pendente... depois alocado não tem como mais" | Regra de alteração de patrocinador | `02-plataforma-maxnivel/01-distribuidores/rede-distribuidores.md` | `/Distribuidor/DistribuidoresAlterarPatrocinadorFerramenta/listar` |
| "distribuidores na rede... quantidade de pessoas na rede... quem teve o documento verificado" | Métricas da rede, verificação de docs | `02-plataforma-maxnivel/01-distribuidores/rede-distribuidores.md` | `/Distribuidor/DistribuidoresARede/listar` (cards) |
| "cadastro pendente, se ele comprar adesão... aloca ele na rede... compra o kit inicial" | Fluxo: pendente → compra kit → alocado | `02-plataforma-maxnivel/02-catalogos-planos/planos-adesao.md` ⏳ | `/Distribuidor/DistribuidoresCadastroPendente/listar` |
| "eu quero bloquear o acesso dela e excluir... excluir da rede" | Exclusão de distribuidor | `02-plataforma-maxnivel/01-distribuidores/excluidos.md` ⏳ | `/Distribuidor/DistribuidoresCadastroExcluido/listar` |

### Bônus / Qualificação
| Trecho Transcrição | Conteúdo Técnico | Doc Destino | URL Real |
|--------------------|------------------|-------------|----------|
| "é o que é pago de bônus de consumo pra rede... 5%... mudar o percentual de repasse" | Configuração de bônus de consumo (5%) | `02-plataforma-maxnivel/06-configuracoes-sistema/modulos-bonus.md` ⏳ | `/Bonus/BonusUtilizados/listar` |
| "quando o senhor tiver com dado em mão... indicado... usuário 3... geração... downline" | Estrutura de gerações na rede | `02-plataforma-maxnivel/01-distribuidores/rede-distribuidores.md` | `/RedeLinear/Relatorio/relatorioMovimentacoesRedeAdministracao/1` |
| "relatório de ganhos gerais... rendimento da rede" | Relatório de ganhos gerais | `02-plataforma-maxnivel/05-relatorios-industria/ganhos-gerais.md` ⏳ | `/RedeLinear/Relatorio/relatorioMovimentacao` |
| "relatório de pontuação por equipe" | Relatório de pontuação | `02-plataforma-maxnivel/05-relatorios-industria/pontuacao-periodo.md` ⏳ | `/Pontos/PontosRelatorioPorPeriodo/principal` |

### Financeiro
| Trecho Transcrição | Conteúdo Técnico | Doc Destino | URL Real |
|--------------------|------------------|-------------|----------|
| "verificação de conta... contrato, CPF... você vai validar esse documento dele" | Verificação de contas/documentos | `02-plataforma-maxnivel/04-financeiro-industria/verificacao-contas.md` ⏳ | `/VerificacaoConta/VerificacaoContaArquivosEmAnalise/listar` |
| "requisito necessário para liberar... solicitação de saque" | Requisitos para saque | `02-plataforma-maxnivel/04-financeiro-industria/solicitacao-saque.md` ⏳ | `/SolicitacaoSaque/SolicitacaoSaqueTransacoesAdmin/listar` |
| "no balão [módulo]... habilitar e-mail, telefone, CPF... regras de saque" | Módulos e regras de saque | `02-plataforma-maxnivel/06-configuracoes-sistema/modulos-regras.md` ⏳ | `/Modulos/Modulos/principal` |
| "desconto total... configurado os descontos... CD compre produtos com desconto" | Regras de desconto (Dist/CD) | `02-plataforma-maxnivel/04-financeiro-industria/regras-desconto.md` ⏳ | `/ComprasDescontoTotal/Configuracao/principal` |

### Relatórios
| Trecho Transcrição | Conteúdo Técnico | Doc Destino | URL Real |
|--------------------|------------------|-------------|----------|
| "relatório de crescimento da rede... quantos ativos tem na rede" | Crescimento da rede | `02-plataforma-maxnivel/05-relatorios-industria/rede-crescimento.md` ⏳ | `/RedeLinear/RelatorioCrescimentoRede/principal/1` |
| "relatório de ativos e inativos" | Ativos/inativos | `02-plataforma-maxnivel/05-relatorios-industria/ativos-inativos.md` ⏳ | `/AtivacaoMensal/RelatorioAtivosInativosPorPeriodo/principal` |
| "relatório geral de ganhos da rede linear... mensal e os ganhos de bônus de cada membro" | Ganhos rede linear | `02-plataforma-maxnivel/05-relatorios-industria/ganhos-gerais.md` ⏳ | `/RedeLinear/Relatorio/relatorioMovimentacao` |
| "também os termos que foram aceitos" | Termos aceitos pelos distribuidores | `02-plataforma-maxnivel/05-relatorios-industria/termos-condicoes.md` ⏳ | `/TermosCondicoes/Relatorio/principal` |
| "relatório de faturamento anual... idêntico aquele da indústria" | Faturamento anual | `02-plataforma-maxnivel/05-relatorios-industria/faturamento-medio.md` ⏳ | `/Compras/RelatorioFaturamentoMedioVendas/principal` |

### Configurações
| Trecho Transcrição | Conteúdo Técnico | Doc Destino | URL Real |
|--------------------|------------------|-------------|----------|
| "habilite mais idiomas pro sistema" | Multi-idioma | `02-plataforma-maxnivel/06-configuracoes-sistema/traducao-idiomas.md` ⏳ | `/Traducao/Configuracao` |
| "formulário a rede permite você mudar regras do cadastro... data... formulário de cadastro excluído, pendentes" | Regras de formulário de cadastro por status | `02-plataforma-maxnivel/06-configuracoes-sistema/formularios-cadastro.md` ⏳ | `/Modulos/Modulos/principal` |
| "estoque, esse módulo... disparar e-mail... estoque baixo... 20 e 30 unidades" | Avisos de estoque baixo (e-mail) | `02-plataforma-maxnivel/06-configuracoes-sistema/aviso-estoque.md` ⏳ | `/Estoque/MovimentacaoEstoque/principal` (módulo) |
| "editar temas... alterar conteúdo do site" | Temas e layout | `02-plataforma-maxnivel/06-configuracoes-sistema/temas-layout.md` ⏳ | `/Temas/Layout/principal` |
| "os nomes dos bônus e a descrição deles" | Nomes/descrição de bônus | `02-plataforma-maxnivel/06-configuracoes-sistema/modulos-bonus.md` ⏳ | `/Bonus/BonusUtilizados/listar` |
| "nota fiscal... exporta os dados pro Bling" | Integração fiscal (Bling) | `02-plataforma-maxnivel/06-configuracoes-sistema/integracao-fiscal.md` ⏳ | `/Modulos/Modulos` (módulo Bling) |

---

## AULA 3 — Gerenciamento da Loja Virtual

### Catálogo
| Trecho Transcrição | Conteúdo Técnico | Doc Destino | URL Real |
|--------------------|------------------|-------------|----------|
| "departamentos... são as categorias de produto... meta título... metadescrição... departamento principal... subcategoria... categoria pai" | Categorias, subcategorias, SEO | `03-plataforma-loja-virtual/01-catalogo/departamentos.md` ⏳ | `/catalog/category` |
| "URL amigável... tênis... imagem da categoria... habilitado... CD Goiânia... não aparece... não tá marcado" | Disponibilidade categoria por loja/CD + URL amigável | `03-plataforma-loja-virtual/01-catalogo/departamentos.md` ⏳ | `/catalog/category` |
| "catálogo de produto... botão de mais... descrição... etiqueta... 100 modelos de tênis... mesma etiqueta" | Criar produto, etiquetas (tags) | `03-plataforma-loja-virtual/01-catalogo/produtos.md` ✅ | `/catalog/product` |
| "preço cheio... nunca o preço com desconto... aplica o desconto em cima... cliente final compra a preço cheio" | Regra de preço cheio | `03-plataforma-loja-virtual/01-catalogo/produtos.md` ✅ | `/catalog/product` |
| "NCM, SKU... código de barras... localização no estoque... preço R$ 450... mínimo por venda... se esgotado... dois a três dias" | Campos fiscais, estoque, situação sem estoque | `03-plataforma-loja-virtual/01-catalogo/produtos.md` ✅ | `/catalog/product` |
| "dimensões... comprimento, largura, altura... embalagem... peso... unidade de medida centímetro" | Dimensões e peso p/ frete | `03-plataforma-loja-virtual/01-catalogo/produtos.md` ✅ | `/catalog/product` |
| "disponível a partir de... programar a disponibilidade... só no dia 9" | Agendamento de disponibilidade | `03-plataforma-loja-virtual/01-catalogo/produtos.md` ✅ | `/catalog/product` |
| "qual é o fabricante... Nike... disponibilizar também para o CD Goiânia... URL amigável... a logo" | Fabricantes + liberação CD | `03-plataforma-loja-virtual/01-catalogo/produtos.md` ✅ | `/catalog/manufacturer` |
| "grupo de atributos... tamanho da tela... smart... HDMI... atributos de cada grupo... material predominante... fibra de carbono... nível de conforto" | Atributos para comparação | `03-plataforma-loja-virtual/01-catalogo/produtos.md` ✅ | `/catalog/attribute_group` + `/catalog/attribute` |
| "opções... variantes do produto... múltipla seleção com quantidade... honeração de preço e peso... R$ 50 a mais... cor branco, preto" | Opções/variantes com preço/peso próprios | `03-plataforma-loja-virtual/01-catalogo/produtos.md` ✅ | `/catalog/option` |
| "descontos... 10 unidades... data inicial e final... acaba o desconto" | Descontos programados | `03-plataforma-loja-virtual/01-catalogo/produtos.md` ✅ | `/catalog/product` (aba Descontos) |
| "promoção... preço original riscado e embaixo o preço na promoção" | Promoções | `03-plataforma-loja-virtual/01-catalogo/produtos.md` ✅ | `/catalog/product` (aba Promoções) |
| "filtros nessa guia... tipo de comprador... CD comprar produtos... cliente final... distribuidor consumo inteligente ou recompra" | Filtro por tipo de comprador | `03-plataforma-loja-virtual/01-catalogo/produtos.md` ✅ | `/catalog/product` (aba Ligações/Filtros) |
| "gestão de estoque... inserir estoque na loja padrão... por tamanho quanto por cor... 34 tenho 50" | Estoque por grade (opções) | `03-plataforma-loja-virtual/01-catalogo/produtos.md` ✅ | `/catalog/stock` |
| "comentário... desabilitado... habilitado e salva" | Moderação de comentários | `03-plataforma-loja-virtual/01-catalogo/produtos.md` ✅ | `/catalog/review` |

### Fretes / Pagamentos
| Trecho Transcrição | Conteúdo Técnico | Doc Destino | URL Real |
|--------------------|------------------|-------------|----------|
| "extensões e fretes... Correios... serviços... PAC, Sedex, Mini Envios... contrato... ADICIONAR percentual... prazo" | Frete Correios, ajustes, prazos | `03-plataforma-loja-virtual/05-configuracoes-loja/fretes.md` ⏳ | `/extension/shipping` |
| "retirada na loja... habilitado... região geográfica... se quiser cobrar uma taxa de entrega... CD também" | Frete retirada na loja/CD + taxas | `03-plataforma-loja-virtual/05-configuracoes-loja/fretes.md` ⏳ | `/extension/shipping` (Retirada na Loja) |
| "transportadora... habilita... pedido do cliente informa qual transportadora... total mínimo R$ 100... peso máximo 10kg... planilha... cidades e preço, peso, valor, prazos" | Frete transportadora + tabela planilha | `03-plataforma-loja-virtual/05-configuracoes-loja/fretes.md` ⏳ | `/extension/shipping` (Transportadora) |
| "forma de frete vai tá condicionada a uma determinada forma de pagamento" | Regras de frete condicionado a pagamento | `03-plataforma-loja-virtual/05-configuracoes-loja/fretes.md` ⏳ | `/localisation/geo_zone` |
| "pago seguro... token e e-mail... baixa automática... bônus... pagar o frete com bônus... retirada na loja... CD também pode escolher pagar" | Formas de pagamento, PagSeguro, bônus | `03-plataforma-loja-virtual/05-configuracoes-loja/pagamentos.md` ⏳ | `/extension/payment` |

### Configurações Loja
| Trecho Transcrição | Conteúdo Técnico | Doc Destino | URL Real |
|--------------------|------------------|-------------|----------|
| "quando o cliente final vai comprar na loja, vai preencher minha conta cadastros... formulário... adicionar... nome da mãe... obrigatório... habilito e salvo" | Personalizar cadastro (campos custom) | `03-plataforma-loja-virtual/03-clientes/personalizar-cadastro.md` ⏳ | `/sale/custom_field` |
| "IPs banidos... blacklist de IPs... 192.168.1.1... agindo de máfé" | Blacklist de IPs | `03-plataforma-loja-virtual/03-clientes/ips-banidos.md` ⏳ | `/sale/customer_ban_ip` |
| "cadastrar conta para CD... conta bancária pro CD solicitar saque... R$ 1.000 de bônus" | Conta bancária CD | `03-plataforma-loja-virtual/04-financeiro-loja/conta-cd.md` ⏳ | `/finance/cadastrar_conta_bancaria` |
| "relatório das transações... registro de bônus... recebimento de compra... pagamento de compra... solicitação de saque... movimentação feita pelo administrador" | Relatório de transações | `03-plataforma-loja-virtual/04-financeiro-loja/transacoes.md` ⏳ | `/finance/transacoes_financeiras` |
| "relatório de fechamento de caixa... por forma de pagamento" | Fechamento de caixa | `03-plataforma-loja-virtual/04-financeiro-loja/fechamento-caixa.md` ⏳ | `/finance/fechamento_caixa` |
| "faturamento anual... idêntico ao da indústria... mensal" | Faturamento anual | `03-plataforma-loja-virtual/04-financeiro-loja/faturamento-anual.md` ⏳ | `/finance/relatorio_faturamento` |
| "configurações, lojas e CDs... criar um novo CD... CD Goiânia... nome, proprietário, tipo pessoa, documento, endereço, país, estado... meta título... logotipo" | Criar CD (formulário completo) | `03-plataforma-loja-virtual/05-configuracoes-loja/lojas-cds.md` ⏳ | `/setting/store` |
| "quando crio o CD Cuiabá, preciso criar um usuário... administrador... qual loja ele vai administrar... CD Cuiabá" | Usuário do CD | `03-plataforma-loja-virtual/05-configuracoes-loja/usuarios-grupos.md` ⏳ | `/user/user` |
| "grupo de usuários... administrador de catálogo... permissão master... catálogo, atributos, categorias, opções, planos, produtos... não vai ver financeiro" | Grupos de permissão (ex: Admin Catálogo) | `03-plataforma-loja-virtual/05-configuracoes-loja/usuarios-grupos.md` ⏳ | `/user/user_permission` |
| "dados auxiliares, localizações... lojas físicas... transportador... moeda padrão... real" | Dados auxiliares | `03-plataforma-loja-virtual/05-configuracoes-loja/dados-auxiliares.md` ⏳ | `/localisation/*` |
| "situação de estoque... esgotado... dois a três dias" | Situações de estoque | `03-plataforma-loja-virtual/05-configuracoes-loja/situacoes-estoque-pedido.md` ⏳ | `/localisation/stock_status` |
| "situações de pedidos... status de pedido" | Status de pedidos | `03-plataforma-loja-virtual/05-configuracoes-loja/situacoes-estoque-pedido.md` ⏳ | `/localisation/order_status` |
| "países, estados e região geográfica... banco de dados... facilitar na hora da pessoa se cadastrar" | Países/Estados/Regiões | `03-plataforma-loja-virtual/05-configuracoes-loja/dados-auxiliares.md` ⏳ | `/localisation/country` + `/zone` + `/geo_zone` |
| "unidade de medida... centímetro, milímetro, polegada... unidades de peso... cálculo do frete" | Unidades de medida/peso | `03-plataforma-loja-virtual/05-configuracoes-loja/dados-auxiliares.md` ⏳ | `/localisation/length_class` + `/weight_class` |
| "registro de logs... logs de erros da loja... pra equipe corrigir" | Logs de erros | `02-plataforma-maxnivel/05-relatorios-industria/logs-sistema.md` ⏳ | `/Sistema/LogsRelatorioAdmin/listar` |

### Relatórios Loja
| Trecho Transcrição | Conteúdo Técnico | Doc Destino | URL Real |
|--------------------|------------------|-------------|----------|
| "relatório de vendas versus pedidos... pedidos detalhados... só de frete... só de devolução... faturamento detalhado" | Relatórios de vendas | `03-plataforma-loja-virtual/06-relatorios-loja/pedidos-fretes-devolucoes.md` ⏳ | `/report/sale_order*` |
| "produtos mais visualizados, mais vendidos, valor de estoque por produto... R$ 194 no estoque... estoque por loja" | Relatórios de produtos/estoque | `03-plataforma-loja-virtual/06-relatorios-loja/produtos-visualizados-vendidos.md` ⏳ | `/report/product_viewed` + `/product_purchased*` |
| "relatório de clientes versus pedidos... quantos clientes, quantos pedidos cada cliente fez" | Clientes vs pedidos | `03-plataforma-loja-virtual/06-relatorios-loja/clientes-pedidos.md` ⏳ | `/report/customer_order` |

---

## AULA 4 — Gerenciamento do CD

### Acesso / Configuração
| Trecho Transcrição | Conteúdo Técnico | Doc Destino | URL Real |
|--------------------|------------------|-------------|----------|
| "se o senhor clicar aqui, ó, loja virtual... senhor consegue logar em qualquer loja de qualquer CD" | Login admin em qualquer loja/CD | `04-plataforma-cd/01-acesso-configuracao-inicial.md` ⏳ | `/administracao/LinkExterno/LojaVirtual/administrar` |
| "seu domínio/loja/admin... URL de acesso ao gerenciador do CD... usuário Ana... responsável pelo CD" | URL de acesso CD | `04-plataforma-cd/01-acesso-configuracao-inicial.md` ⏳ | `/loja/admin/` + `index.php?route=common/login` |
| "quatro coisas que toda vez que você criar um CD, você precisa se atentar" | Checklist inicial CD (4 pontos) | `04-plataforma-cd/01-acesso-configuracao-inicial.md` ⏳ + `05-guias-rapidos/criar-cd-passo-a-passo.md` ⏳ | `/setting/store` |
| "primeiro, atrelar o departamento ao CD... qual categoria cada CD pode comercializar... guia de dados, marcar CD Cuiabá" | Ponto 1: Categoria ↔ CD | `04-plataforma-cd/02-produtos-disponibilidade/vinculo-categoria-produto-cd.md` ⏳ | `/catalog/category` |
| "segunda questão, no cadastro do produto... liberar ele pro CD... marcar CD Cuiabá" | Ponto 2: Produto ↔ CD | `04-plataforma-cd/02-produtos-disponibilidade/vinculo-categoria-produto-cd.md` ⏳ | `/catalog/product` (aba Ligações) |
| "terceira questão, na guia de filtros... forma de pagamento... centro de distribuição... se não tiver marcado, ele não consegue comprar" | Ponto 3: Forma pagamento "CD" | `04-plataforma-cd/02-produtos-disponibilidade/vinculo-categoria-produto-cd.md` ⏳ | `/catalog/product` (aba Ligações > Pagamento) |

### CD como Filial
| Trecho Transcrição | Conteúdo Técnico | Doc Destino | URL Real |
|--------------------|------------------|-------------|----------|
| "CD seria uma filial... sede em São Paulo... filial em Goiânia... eu venho como distribuidor... escolho o que quero comprar na filial... retirar na sede... não precisa mandar de São Paulo" | Conceito: CD = filial regional p/ retirada | `04-plataforma-cd/01-acesso-configuracao-inicial.md` ⏳ | Fluxo checkout loja |
| "se eu tenho um distribuidor representante na região de Porto Alegre... pessoas compram pelo site... retirar direto com distribuidor" | Distribuidor como ponto de retirada | `04-plataforma-cd/01-acesso-configuracao-inicial.md` ⏳ | `/extension/shipping` (retirada CD) |
| "o distribuidor pode sim ser um CD... não têm vínculo nenhum os cadastros... plataformas distintas, cadastros distintos... CD PJ e distribuidor PF" | **Regra:** Cadastro CD ≠ Cadastro Distribuidor (sem vínculo) | `04-plataforma-cd/01-acesso-configuracao-inicial.md` ⏳ | — |
| "não tem vínculo... distribuidor pegar o bônus dele e ir lá na plataforma de CD comprar produtos... não existe" | **Regra:** Bônus de distribuidor NÃO é usado em plataforma CD | `04-plataforma-cd/04-financeiro-cd/saldo-bonus-compras.md` ⏳ | — |

### Estoque / Compra CD
| Trecho Transcrição | Conteúdo Técnico | Doc Destino | URL Real |
|--------------------|------------------|-------------|----------|
| "duas formas de um CD obter estoque... empresa cria remessa de produtos e envia pro CD... R$ 20.000 em tênis... CD Goiânia... reconheci o pagamento... lanço... 100 pares de tênis" | Forma 1: Remessa da indústria | `04-plataforma-cd/03-gestao-estoque-cd/remessa-industria.md` ⏳ | `/Estoque/MovimentacaoEstoque/principal` |
| "segunda forma... comprando da indústria... clicar comprar produto... escolhe o produto... disponível para ele... Tênis Nike Shocks... marcar centro de distribuição e ligações CD Cuiabá" | Forma 2: Compra direta do CD | `04-plataforma-cd/03-gestao-estoque-cd/compra-direta-cd.md` ⏳ | `/catalog/product` + `cd > comprar` |
| "compra preço cheio... pode criar descontos... distribuidor 50% desconto... produto 100 compra por 50... CD compra com 60% desconto... paga 40... vende pro distribuidor a 50... ganhou R$ 10... não tem como criar esses descontos, senhor tem que entrar em contato" | **Regra:** Desconto CD 60% / Dist 50% / Margem CD R$10 — configuração exclusiva via suporte | `04-plataforma-cd/02-produtos-disponibilidade/descontos-cd-vs-distribuidor.md` ⏳ | `/ComprasDescontoTotal/Configuracao/principal` |
| "o CD não consegue manipular o estoque dele... não consegue dar entrada nem saída... quem faz isso é só a indústria" | **Regra:** Estoque CD é exclusivo da indústria | `04-plataforma-cd/03-gestao-estoque-cd/controle-stock.md` ⏳ | — |

### Financeiro CD
| Trecho Transcrição | Conteúdo Técnico | Doc Destino | URL Real |
|--------------------|------------------|-------------|----------|
| "movimentar saldo no CD... conta CD do CD de Cuiabá... crédito para compra de produtos... creditar R$ 1.000... senha... movimentação feita com sucesso" | Creditar saldo CD (admin) | `04-plataforma-cd/04-financeiro-cd/saldo-bonus-compras.md` ⏳ | `/ContasCd/ContasCdTransacoesFerramenta/listar` |
| "pagou com o bônus... agora ele pode pagar com o bônus que ele tem... confirma o pagamento... pedido concluído... pedido de compra do CD... CD Cuiabá comprou R$ 100... pagamento do pedido 12, debitou R$ 100, agora 900" | Fluxo completo compra CD com bônus | `04-plataforma-cd/04-financeiro-cd/saldo-bonus-compras.md` ⏳ | `/finance/transacoes_financeiras` + `/sale/order` |
| "cadastrar conta para CD... seleciona o banco... formulário... salvar... criou a conta bancária... solicita saque" | Conta bancária CD + saque | `04-plataforma-cd/04-financeiro-cd/solicitacao-saque-cd.md` ⏳ | `/finance/cadastrar_conta_bancaria` + `/finance/solicitacao_saque` |
| "regra de saque... módulo solicitação de saque de CD... valor mínimo R$ 100... período dia 20 ao 25... pagamento dia 1 ao 5... taxa de saque 5%" | Regras e taxas de saque CD | `04-plataforma-cd/04-financeiro-cd/solicitacao-saque-cd.md` ⏳ | Admin: `/SolicitacaoSaqueCd/SolicitacaoSaqueCdTransacoesAdmin/listar` |
| "solicitar 100... 5% de taxa... 95 líquido... senha... requisitou o saque... debitou... 850... relatório solicitação de saque de CD... processo idêntico ao distribuidor... você externamente tem que fazer o depósito na conta bancária... marca que foi depositado" | Fluxo completo saque CD | `04-plataforma-cd/04-financeiro-cd/solicitacao-saque-cd.md` ⏳ | `/finance/solicitacao_saque` + Admin solicitação CD |
| "fechamento de caixa... filtrado pro dia atual... limpar... mostra todos os registros... paga com bônus R$ 50, paga ao retirar na loja R$ 50" | Fechamento de caixa CD | `04-plataforma-cd/04-financeiro-cd/fechamento-caixa.md` ⏳ | `/finance/fechamento_caixa` |
| "faturamento anual... idêntico a indústria... faturamento da plataforma dele... mensalmente" | Faturamento anual CD | `04-plataforma-cd/04-financeiro-cd/faturamento-anual-cd.md` ⏳ | `/finance/relatorio_faturamento` |

### Pedidos / Retirada
| Trecho Transcrição | Conteúdo Técnico | Doc Destino | URL Real |
|--------------------|------------------|-------------|----------|
| "distribuidor... R$ 550 de saldo... compra padrão... escolher comprar esse produto... trocar a loja... CD Cuiabá, CD Goiânia... retirar no CD, CD Cuiabá... continuar... etapa de pagamento... pagar com bônus... confirmar pedido... senha financeira... R$ 50... 50% de desconto... pedido 13, concluído" | Fluxo compra distribuidor no CD | `04-plataforma-cd/05-pedidos-retirada/fluxo-compra-distribuidor.md` ⏳ | Loja pública checkout + `/sale/order` |
| "ele chega lá no balcão do CD... pedido 13... separa a mercadoria, entrega... alimentar o histórico do pedido... 'produto entregue'... salva... todo histórico, né, do pedido" | Retirada no balcão + histórico | `04-plataforma-cd/05-pedidos-retirada/retirada-balcao.md` ⏳ | `/sale/order` (editar pedido > histórico) |
| "pedido 14... etapa de pagamento... aguarda pagamento... não tá pago... é R$ 50... ele vai lá, paga... atendente vem aqui, pagar... gera comissão... entrega" | Pagamento no balcão + comissão | `04-plataforma-cd/05-pedidos-retirada/pagamento-local.md` ⏳ | `/sale/order` |
| "relatório de venda versus pedidos... produtos mais vendidos... valor de estoque do produto... resumo de vendas... pago com cada forma de pagamento" | Relatórios CD | `04-plataforma-cd/06-usuarios-relatorios-cd/relatorios-cd.md` ⏳ | `/report/*` (escopo CD) |
| "usuário, ele consegue criar mais usuários para acesso a essa plataforma... funcionário... permissão de acesso... gestão do CD" | Usuários do CD | `04-plataforma-cd/06-usuarios-relatorios-cd/usuarios-permissoes-cd.md` ⏳ | `/user/user` (escopo CD) |

### Finalização / Go-Live
| Trecho Transcrição | Conteúdo Técnico | Doc Destino | URL Real |
|--------------------|------------------|-------------|----------|
| "valor de repasse... 35% da venda online vai ser passada pro distribuidor... definido em 35%... reunião 25/6/2020" | **Exemplo real:** Percentual de repasse 35% | `06-referencia-tecnica/parametros-negocio.md` ⏳ | /Bonus/* |
| "formas de pagamento do distribuidor... pago seguro... boleto Banco do Brasil... boleto registrado... instalar o módulo... autorização... URL API boletos... criar uma conta, e-mail e senha... permite que o maxível emite boletos... ticar... salvar" | Configuração Boleto BB (módulo + API + autorização) | `04-plataforma-cd/07-go-live-checklist/configuracoes-pendentes-pagseguro-boleto-frete.md` ⏳ | `/extension/payment` (boleto registrado) |
| "configurar boleto registrado... Banco do Brasil... carteira premium, carteira variação, modalidade, agência, dígito, conta... taxa... tipo de aceite... dias para vencer... número que vai começar a emissão... 1000, 1001, 1002" | Configuração dados bancários boleto | `04-plataforma-cd/07-go-live-checklist/configuracoes-pendentes-pagseguro-boleto-frete.md` ⏳ | `/extension/payment` (configurar boleto) |
| "sistema hoje tá em modo teste... prazo máximo de um mês... se não solicitar o reset... reseta automático... cadastro também é de teste... depois que resetar vai ser apagado" | **Regra:** Modo teste 1 mês, reset automático | `04-plataforma-cd/07-go-live-checklist/reset-teste-producao.md` ⏳ | Painel suporte |
| "reset... comprar um plano de adesão pro cadastro número um da rede... hoje ele tá alocado... quando resetar, vai tá pendente ou excluído... se excluído, reverter... volta a ser pendente... comprar kit inicial... aloca na rede... sem fazer isso não tem como" | **Regra pós-reset:** Reativar cadastro #1 (comprar kit) | `04-plataforma-cd/07-go-live-checklist/reset-teste-producao.md` ⏳ | `/Distribuidor/DistribuidoresCadastroPendente/listar` |
| "reset não apaga a configuração... ele vai apagar todos os dados de teste... se for lá alterar uma regra de configuração, depois que reseta, não volta ao padrão anterior" | **Regra:** Reset apaga DADOS, mantém CONFIGURAÇÕES | `04-plataforma-cd/07-go-live-checklist/reset-teste-producao.md` ⏳ | — |
| "reset solicitado exclusivamente via painel de suporte... segunda a sexta em horário comercial... 24 horas de antecedência" | **Regra:** Reset via suporte, 24h antes | `04-plataforma-cd/07-go-live-checklist/reset-teste-producao.md` ⏳ | Painel suporte |
| "termo de implantação... criar termo... enviar no e-mail... imprimir... assinar... mesma assinatura do contrato... devolver... cancelar o pedido do domínio... solicitar apontamento do domínio... subir o termo... aprovar... liberar o painel de suporte" | Fluxo termo de implantação + apontamento domínio | `04-plataforma-cd/07-go-live-checklist/go-live-checklist.md` ⏳ | Painel suporte cliente |
| "chamados... quanto mais rico em detalhes... printar a tela, colar o print, anexar arquivos... criar usuários para acessarem essa plataforma... mudar a senha" | Painel suporte / chamados | `04-plataforma-cd/07-go-live-checklist/painel-suporte-chamados.md` ⏳ | Painel suporte cliente |
| "o ideal é que o senhor conheça o sistema, faça testes... antes de colocar em produção, tem que definir, configurar as formas de frete... conferir os dados do frete e das formas de pagamento" | Checklist pré-produção | `04-plataforma-cd/07-go-live-checklist/go-live-checklist.md` ⏳ | `/extension/shipping` + `/extension/payment` |

---

## Matriz de Prioridade (O que escrever primeiro)

| # | Documento | Fonte Aula | Criticidade | Esforço | Status |
|---|-----------|-----------|-------------|---------|--------|
| 1 | `02-plataforma-maxnivel/01-distribuidores/rede-distribuidores.md` | 2 | 🔴 Alta (operação diária) | M | ✅ Feito |
| 2 | `03-plataforma-loja-virtual/01-catalogo/produtos.md` | 3 | 🔴 Alta (núcleo do catálogo) | M | ✅ Feito |
| 3 | `03-plataforma-loja-virtual/01-catalogo/departamentos.md` | 3 | 🔴 Alta (dependência de produtos) | M | ⏳ Próximo |
| 4 | `05-guias-rapidos/criar-cd-passo-a-passo.md` | 4 | 🔴 Alta (ação rara mas crítica) | S | ⏳ |
| 5 | `04-plataforma-cd/01-acesso-configuracao-inicial.md` | 4 | 🔴 Alta | M | ⏳ |
| 6 | `02-plataforma-maxnivel/02-catalogos-planos/planos-adesao.md` | 2 | 🟠 Média | M | ⏳ |
| 7 | `04-plataforma-cd/02-produtos-disponibilidade/vinculo-categoria-produto-cd.md` | 4 | 🟠 Média | M | ⏳ |
| 8 | `04-plataforma-cd/05-pedidos-retirada/fluxo-compra-distribuidor.md` | 4 | 🟠 Média | M | ⏳ |
| 9 | `04-plataforma-cd/07-go-live-checklist/reset-teste-producao.md` | 4 | 🟠 Média (regras críticas) | S | ⏳ |
| 10 | `03-plataforma-loja-virtual/05-configuracoes-loja/fretes.md` | 3 | 🟡 Baixa-Média | M | ⏳ |
| ... | Demais (50+ arquivos) | 2-4 | 🟡 Baixa | S-M | ⏳ |

**Legenda:** 🔴 = crítico p/ operação | 🟠 = importante | 🟡 = complementar | ✅ Feito | ⏳ Pendente

---

## Métricas de Cobertura (Atual)

| Aula | Segmentos Extraídos | Tópicos Mapeados | Cross-refs Criados |
|------|--------------------|------------------|--------------------|
| Aula 1 | 1.289 | ~640 (ruído) | 1 |
| Aula 2 | 1.256 | ~752 | 20 |
| Aula 3 | 1.034 | ~640 | 25 |
| Aula 4 | 547 | ~350 | 28 |
| **Total** | **4.126** | — | **~74 trechos → docs/URLs** |

---

*Última atualização: 2025-08-11 | Gerado a partir das 4 transcrições + scraping live da plataforma*