# Referência Técnica — URLs Completas por Módulo

> **Finalidade:** Tabela mestra com TODAS as URLs reais mapeadas da plataforma live (2025-08-11), organizadas por plataforma e módulo. Base para todas as demais documentações.
>
> **Bases:**
> - Administração Maxnível: `https://allinbrasil.com.br/administracao/`
> - Loja Virtual (Admin): `https://allinbrasil.com.br/loja/admin/`
> - CD (Admin CD): `https://allinbrasil.com.br/loja/admin/` (login CD)

---

## 1. Administração Maxnível — `/administracao/`

### 1.1 Distribuidores

| Tela | URL | Doc |
|------|-----|-----|
| A Rede (listagem) | `/Distribuidor/DistribuidoresARede/listar` | ✅ rede-distribuidores.md |
| A Rede (editar distribuidor) | `/Distribuidor/DistribuidoresARede/editar/{id}` | ⏳ |
| Login como distribuidor | `/Distribuidor/LoginPelaAdministracao/login/{id}` | ✅ rede-distribuidores.md |
| Cadastros Pendentes | `/Distribuidor/DistribuidoresCadastroPendente/listar` | ⏳ |
| Cadastros Excluídos | `/Distribuidor/DistribuidoresCadastroExcluido/listar` | ⏳ |
| Relatório de Indicados | `/Distribuidor/Patrocinador/relatorioIndicacoes` | ⏳ |
| Informações Básicas | `/Distribuidor/DistribuidoresInformacoes/principal` | ⏳ |
| Informações Excluídos | `/Distribuidor/DistribuidoresInformacoes/excluidos` | ⏳ |
| Alterar Usuário (ferramenta) | `/Distribuidor/DistribuidoresAlterarUsuarioFerramenta/listar` | ⏳ |
| Alterar Patrocinador (ferramenta) | `/Distribuidor/DistribuidoresAlterarPatrocinadorFerramenta/listar` | ⏳ |
| Tipo de Pessoa (Cliente) | `/Distribuidor/DistribuidorTipoPessoa/listar` | ⏳ |
| Estado Civil | `/Distribuidor/DistribuidorEstadoCivil/listar` | ⏳ |
| Links de Distribuidor | `/Distribuidor/DistribuidorLinks/listar` | ⏳ |
| Verificação Docs (em análise) | `/VerificacaoConta/VerificacaoContaArquivosEmAnalise/listar` | ⏳ |
| Verificação Docs (por dist) | `/VerificacaoConta/VerificacaoContaArquivosDistribuidor/principal/{id}` | ⏳ |
| Verificação Categorias | `/VerificacaoConta/VerificacaoContaCategoriaCrud/listar` | ⏳ |

### 1.2 Catálogos / Planos / Qualificações

| Tela | URL | Doc |
|------|-----|-----|
| Planos (principal) | `/Planos/Planos/principal` | ⏳ planos-adesao.md |
| Campos Planos/Produtos | `/Planos/PlanoTipoCampos/listar` | ⏳ |
| Campos de Opções Produtos | `/Produtos/OpcoesProdutosCampos` | ⏳ |
| Adesões (relatório) | `/Planos/Relatorio/listarPlanos` | ⏳ |
| Planos do Distribuidor (relatório) | `/Planos/Relatorio/planosDoDistribuidor` | ⏳ |
| Taxa Cadastro → Adesão | `/Planos/Relatorio/taxaCadastroAdesao` | ⏳ |
| Qualificações (config) | `/Qualificacao/QualificacaoConfiguracoes/listar` | ⏳ |
| Qualificações Ciclos Gerais | `/Qualificacao/QualificacaoPeriodosCiclosGeral/listar` | ⏳ |
| Qualificações Campos | `/Qualificacao/QualificacaoCampos/listar` | ⏳ |
| Lançar Qualificação Manual | `/Qualificacao/QualificacaoManual/relatorio` | ⏳ |
| Relatório Qualificações Atingidas | `/Qualificacao/RelatorioQualificacoes/principal` | ⏳ |

### 1.3 Ferramentas Operacionais

| Tela | URL | Doc |
|------|-----|-----|
| Criar Pedido (admin) | `/Compras/CriarCompra/principal` | ⏳ |
| Ativação Mensal (transações) | `/AtivacaoMensal/AtivacaoMensalTransacoes/listar` | ⏳ |
| Ativação Mensal (relatório) | `/AtivacaoMensal/AtivacaoMensalTransacoesRelatorio/listar` | ⏳ |
| Ativos por Mês | `/AtivacaoMensal/AtivosPorMes` | ⏳ |
| Ativos por Região | `/AtivacaoMensal/DistribuidorRelatorioAtivosPorRegiao/listar` | ⏳ |
| Ativos/Inativos Período | `/AtivacaoMensal/RelatorioAtivosInativosPorPeriodo/principal` | ⏳ |
| Ativos/Inativos no Dia | `/AtivacaoMensal/RelatorioAtivacaoNoDia/principal/1` | ⏳ |
| Movimentar Saldo | `/Contas/ContasTransacoesFerramenta/listar` | ⏳ |
| Movimentar Saldo CD | `/ContasCd/ContasCdTransacoesFerramenta/listar` | ✅ criar-cd (P7) |
| Estoque (movimentação) | `/Estoque/MovimentacaoEstoque/principal` | ⏳ |
| Habilitar Produtos Lojas | `/Loja/HabilitarProdutosLoja/principal` | ⏳ |
| Administradores | `/Administrador/AdministradoresCadastros/listar` | ⏳ |
| Meus Dados (admin) | `/Administrador/AdministradoresEditarDados/formulario` | ⏳ |
| Bancos | `/ContaBancaria/Bancos/listar` | ⏳ |
| Campos Genéricos | `/Sistema/CamposGenericos` | ⏳ |
| Excluir Distribuidor Auto (relatório) | `/ExcluirDistribuidorAutomatico/RelatorioDistribuidorDataExclusao/principal` | ⏳ |

### 1.4 Financeiro Maxnível

| Tela | URL | Doc |
|------|-----|-----|
| Contas Bancárias (distribuidores) | `/ContaBancaria/DistribuidorContaBancariaListagem/listar` | ⏳ |
| Solicitação de Saque (admin) | `/SolicitacaoSaque/SolicitacaoSaqueTransacoesAdmin/listar` | ⏳ |
| Saques em Massa | `/SolicitacaoSaque/SolicitacaoSaqueEmMassa/listar` | ⏳ |
| Saldo p/ Saque Liberado | `/SolicitacaoSaque/SolicitacaoSaqueEmMassa/saldoLiberado` | ⏳ |
| Relatório de Saques | `/SolicitacaoSaque/SolicitacaoSaqueTransacoesRelatorioSaque/listar` | ⏳ |
| Relatório de Taxas | `/SolicitacaoSaque/SolicitacaoSaqueTransacoesRelatorioTaxas/listar` | ⏳ |
| Relatório de IR | `/SolicitacaoSaque/SolicitacaoSaqueTransacoesRelatorioIr/listar` | ⏳ |
| Relatório de INSS | `/SolicitacaoSaque/SolicitacaoSaqueTransacoesRelatorioInss/listar` | ⏳ |
| Relatório Cancelados | `/SolicitacaoSaque/SolicitacaoSaqueTransacoesRelatorioCancelados/listar` | ⏳ |
| Cupons Desconto Total | `/ComprasDescontoTotal/ComprasDescontoTotal/listar` | ⏳ |
| Regras de Desconto | `/ComprasDescontoTotal/Configuracao/principal` | ⏳ |
| Cupom Automático por Compra | `/ComprasDescontoTotal/CupomAutomatico/principal` | ⏳ |
| Relatório Cupons | `/ComprasDescontoTotal/RelatorioCuponsDesconto/relatorio` | ⏳ |
| Relatório Utilização Cupons | `/ComprasDescontoTotal/RelatorioUtilizacaoCuponsDesconto/relatorio` | ⏳ |
| Saldo nos Escritórios | `/Contas/RelatorioSaldoNosEscritoriosAdmin/escolherConta` | ⏳ |
| Saldo Utilizado por Período | `/Contas/RelatorioSaldoUtilizadoPorPeriodo/principal` | ⏳ |
| Transações em Conta | `/Contas/ContasTransacoesRelatorio/listar` | ⏳ |
| Saldo Atual dos CDs | `/ContasCd/ContasCdsSaldo/principal` | ⏳ |
| Saldo CD (relatório) | `/ContasCd/ContasCdTransacoesRelatorio/listar` | ⏳ |
| Solicitação de Saque CD | `/SolicitacaoSaqueCd/SolicitacaoSaqueCdTransacoesAdmin/listar` | ⏳ |

### 1.5 Relatórios Maxnível

| Tela | URL | Doc |
|------|-----|-----|
| Crescimento da Rede | `/RedeLinear/RelatorioCrescimentoRede/principal/1` | ⏳ |
| Movimentação Pessoal | `/RedeLinear/Relatorio/relatorioMovimentacaoPessoal` | ⏳ |
| Qtd Cadastros por Patrocinador | `/RedeLinear/Relatorio/relatorioQuantidadeCadastrosPorPatrocinador` | ⏳ |
| Ganhos Gerais | `/RedeLinear/Relatorio/relatorioMovimentacao` | ⏳ |
| Movimentações Unilevel | `/RedeLinear/Relatorio/relatorioMovimentacoesRedeAdministracao/1` | ⏳ |
| Assinaturas | `/Assinaturas/RelatorioAssinaturasFaturas/relatorio` | ⏳ |
| Pontuação por Período | `/Pontos/PontosRelatorioPorPeriodo/principal` | ⏳ |
| Pedidos (compras) | `/Compras/LojaOrderRelatorioComprasAdmin/listar` | ⏳ |
| Faturamento Médio Vendas | `/Compras/RelatorioFaturamentoMedioVendas/principal` | ⏳ |
| Média Produtos/Pedidos | `/Compras/RelatorioMediaProdutosPedidos/principal` | ⏳ |
| Média Produtos por Dist Ativo | `/Compras/RelatorioMediaProdutosDistribuidorAtivoPeriodo/principal` | ⏳ |
| Resumo de Vendas | `/Compras/RelatorioDeCaixa/principal/1` | ⏳ |
| Faturamento Anual por Loja | `/Compras/LojaOrderRelatorioFaturamentoAnualPorLoja/listar` | ⏳ |
| Custo de Frete | `/Frete/RelatorioFrete/principal` | ⏳ |
| Estoque Produtos por Loja | `/Estoque/RelatorioEstoqueProdutoPorLoja/principal` | ⏳ |
| Relatório de Estoque | `/Estoque/RelatorioEstoque/principal` | ⏳ |
| Logs do Sistema | `/Sistema/LogsRelatorioAdmin/listar` | ⏳ |
| Termos e Condições (relatório) | `/TermosCondicoes/Relatorio/principal` | ⏳ |
| Bonificação Mensal por Mês | `/Bonus/RelatorioBonificacaoMensal/listarPorMesAdministracao` | ⏳ |
| Bonificação Mensal por Bônus | `/Bonus/RelatorioBonificacaoMensal/listarPorBonusAdministracao` | ⏳ |
| Relatório de Bônus | `/Bonus/RelatorioBonusAdmin/bonus` | ⏳ |

### 1.6 Configurações / Sistema

| Tela | URL | Doc |
|------|-----|-----|
| Preferências (Módulos) | `/Modulos/Modulos/principal` | ⏳ |
| Módulos | `/Modulos/Modulos` | ⏳ |
| Empresa (dados) | `/Fabricas/FabricasEditarDados/editar` | ⏳ |
| Financeiro (Faturas Maxível) | `/Sistema/FaturasMaxnivel/detalhe` | ⏳ |
| E-mails | `/Email/Configuracao` | ⏳ |
| Layout | `/Configuracao/Layout/principal` | ⏳ |
| Termos e Condições | `/TermosCondicoes/Configuracao/principal` | ⏳ |
| Menus (árvore) | `/Menu/Arvore` | ⏳ |
| Permissões (grupos) | `/Autorizacao/Grupos` | ⏳ |
| Grupos de Consumo | `/Autorizacao/GruposConsumo` | ⏳ |
| Configurar Tela Inicial | `/Gadgets/GadgetsGerenciarTelas/esolherEscritorio` | ⏳ |
| Traduções | `/Traducao/Configuracao` | ⏳ |
| Temas (editar página) | `/Temas/Layout/editarPagina` | ⏳ |
| Elementos Site | `/Temas/GerenciarConteudo/gerenciar/site` | ⏳ |
| Postagens | `/Postagens/Configuracao` | ⏳ |
| Banners Site | `/Temas/Layout/configurarNo/280` | ⏳ |
| Banner Loja | `/Temas/Layout/configurarNo/23` | ⏳ |
| Notícias | `/NoticiasDistribuidor/NoticiasDistribuidor/listar` | ⏳ |
| Categorias Notícias | `/NoticiasDistribuidor/NoticiasDistribuidorCategoria/listar` | ⏳ |
| Downloads | `/Download/DownloadsAdmin/listar` | ⏳ |
| Download Categorias | `/Download/DownloadsCategorias/listar` | ⏳ |
| Campos Pedidos | `/Pedidos/TiposCampo` | ⏳ |
| Campos Forma Pagamento | `/FormaPagamento/Campos` | ⏳ |
| Login EAD (Treinamento) | `/Administrador/AdministradorLogarOutroSistema/logarEad` | ⏳ |
| Mudar Idioma | `/MudarLinguagem/Mudar?escritorio=administracao&lingua=pt_BR` | ⏳ |

---

## 2. Loja Virtual — `/loja/admin/`

> **Nota:** Requer token de sessão: `?token={token}` (gerado após login). Usuário admin da indústria acessa via menu "Loja Virtual".

### 2.1 Dashboard

| Tela | URL |
|------|-----|
| Painel de Controle | `/common/dashboard` |
| Logout | `/common/logout` |

### 2.2 Catálogo

| Tela | URL | Doc |
|------|-----|-----|
| Departamentos | `/catalog/category` | ✅ departamentos.md |
| Produtos | `/catalog/product` | ✅ produtos.md |
| Kits | `/catalog/kit` | ⏳ |
| Atributos | `/catalog/attribute` | ⏳ |
| Grupos de Atributos | `/catalog/attribute_group` | ⏳ |
| Opções | `/catalog/option` | ⏳ |
| Fabricantes | `/catalog/manufacturer` | ⏳ |
| Páginas de Informações | `/catalog/information` | ⏳ |
| Comentários | `/catalog/review` | ⏳ |
| Estoque | `/catalog/stock` | ⏳ |
| Importar Produtos | `/catalog/importacao/produtos` | ⏳ |
| Importar Promoções | `/catalog/importacao/promocoes` | ⏳ |
| Exportar | `/catalog/exportacao` | ⏳ |

### 2.3 Extensões (Fretes / Pagamentos)

| Tela | URL | Doc |
|------|-----|-----|
| Fretes | `/extension/shipping` | ⏳ |
| Pagamentos | `/extension/payment` | ⏳ |
| Total do Pedido | `/extension/total` | ⏳ |

### 2.4 Vendas

| Tela | URL | Doc |
|------|-----|-----|
| Pedidos | `/sale/order` | ⏳ |
| Detalhe Pedido | `/sale/order/info?order_id={id}` | ⏳ |
| Carrinhos Abandonados | `/sale/carrinhos_abandonados/relatorio` | ⏳ |
| Devoluções | `/sale/return` | ⏳ |

### 2.5 Clientes

| Tela | URL | Doc |
|------|-----|-----|
| Clientes | `/sale/customer` | ⏳ |
| Personalizar Cadastro | `/sale/custom_field` | ⏳ |
| IPs Banidos | `/sale/customer_ban_ip` | ⏳ |

### 2.6 Financeiro Loja

| Tela | URL | Doc |
|------|-----|-----|
| Cadastrar Conta p/ CD | `/finance/cadastrar_conta_bancaria` | ⏳ |
| Solicitação de Saque | `/finance/solicitacao_saque` | ⏳ |
| Relatório das Transações | `/finance/transacoes_financeiras` | ⏳ |
| Faturamento Anual | `/finance/relatorio_faturamento` | ⏳ |
| Fechamento de Caixa | `/finance/fechamento_caixa` | ⏳ |

### 2.7 Design / Usuários / Localização

| Tela | URL | Doc |
|------|-----|-----|
| Lojas/CDs | `/setting/store` | ✅ criar-cd |
| Banners | `/design/banner` | ⏳ |
| Usuários | `/user/user` | ✅ criar-cd (P2) |
| Grupos de Usuários | `/user/user_permission` | ⏳ |
| Transportadoras | `/localisation/courier` | ⏳ |
| Situações de Estoque | `/localisation/stock_status` | ⏳ |
| Situações de Pedidos | `/localisation/order_status` | ⏳ |
| Situações de Devolução | `/localisation/return_status` | ⏳ |
| Soluções Devolução | `/localisation/return_action` | ⏳ |
| Motivos Devolução | `/localisation/return_reason` | ⏳ |
| Moedas | `/localisation/currency` | ⏳ |
| Países | `/localisation/country` | ⏳ |
| Estados | `/localisation/zone` | ⏳ |
| Etiquetas | `/localisation/etiquetas` | ⏳ |
| Regiões Geográficas | `/localisation/geo_zone` | ⏳ |
| Unidades de Medida | `/localisation/length_class` | ⏳ |
| Unidades de Peso | `/localisation/weight_class` | ⏳ |

### 2.8 Relatórios Loja

| Tela | URL | Doc |
|------|-----|-----|
| Pedidos | `/report/sale_order` | ⏳ |
| Pedidos Detalhados | `/report/sale_order_detalhado` | ⏳ |
| Fretes | `/report/sale_shipping` | ⏳ |
| Devoluções | `/report/sale_return` | ⏳ |
| Faturamento Detalhado | `/report/faturamento_detalhado` | ⏳ |
| Repescagem Asaas | `/report/repescagem_asaas` | ⏳ |
| Produtos Visualizados | `/report/product_viewed` | ⏳ |
| Produtos Vendidos | `/report/product_purchased` | ⏳ |
| Vendidos por Opção | `/report/product_purchased/produtosPorOpcao` | ⏳ |
| Valor Estoque Produto | `/report/product_purchased/valorEstoque` | ⏳ |
| Estoque Produto por Loja | `/report/product_purchased/estoquePorLoja` | ⏳ |
| Clientes × Pedidos | `/report/customer_order` | ⏳ |

---

## 3. Plataforma CD — `/loja/admin/` (token CD)

> **Acesso:** Login em `/index.php?route=common/login` com usuário CD (criado na Admin ▸ Usuário, vinculado ao CD). Admin master acessa qualquer CD via `/administracao/LinkExterno/LojaVirtual/administrar`.

| Tela | URL (mesma base da Loja, escopo CD) | Doc |
|------|--------------------------------------|-----|
| Login CD | `/index.php?route=common/login` | ✅ 01-acesso |
| Dashboard CD | `/common/dashboard?token={token_cd}` | ✅ 01-acesso |
| Produtos do CD | `/catalog/product?token={token_cd}` | ⏳ |
| Comprar Produtos | `/sale/order?token={token_cd}` | ⏳ |
| Pedidos CD | `/sale/order?token={token_cd}` | ⏳ |
| Cadastrar Conta CD | `/finance/cadastrar_conta_bancaria?token={token_cd}` | ⏳ |
| Solicitar Saque CD | `/finance/solicitacao_saque?token={token_cd}` | ⏳ |
| Transações CD | `/finance/transacoes_financeiras?token={token_cd}` | ⏳ |
| Fechamento Caixa CD | `/finance/fechamento_caixa?token={token_cd}` | ⏳ |
| Faturamento CD | `/finance/relatorio_faturamento?token={token_cd}` | ⏳ |
| Usuários CD | `/user/user?token={token_cd}` | ⏳ |
| Relatórios CD | `/report/*?token={token_cd}` | ⏳ |

---

## 4. URLs Públicas (Frontend)

| Tela | URL |
|------|-----|
| Home Loja | `https://allinbrasil.com.br/` |
| Login Público | `/publico/Autenticar/Formulario` |
| Criar Conta (Distribuidor) | `/publico/Distribuidor/DistribuidoresCadastro/formulario` |
| Recuperar Senha | `/publico/RecuperarSenha/InformarUsuario` |
| Loja/Checkout | `/loja/` (frontend do e-commerce) |
| Escritório Virtual Distribuidor | `/publico/` (área logada do distribuidor) |

---

## Legenda de Status

| Status | Significado |
|--------|-------------|
| ✅ | Documentação escrita |
| ⏳ | Documentação pendente (URL mapeada, doc futuro) |
| — | Sem doc específico (URL de suporte/helper) |

---

*Última atualização: 2025-08-11 | Mapeamento completo das URLs da plataforma live*