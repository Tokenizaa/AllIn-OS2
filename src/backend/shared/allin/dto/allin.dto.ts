/**
 * DTOs para entidades da API AllIn Brasil
 * Baseado na documentação de engenharia reversa da API
 */

// OAuth Token
export interface AllInOAuthToken {
  access_token: string;
  expires_in: number;
  token_type: string;
  scope: string | null;
}

// Cliente
export interface AllInCliente {
  id: number;
  tipo_cliente: string;
  nome: string;
  sobrenome: string;
  email: string;
  receber_newsletter: boolean;
  endereco_id: number;
  data_adicionado: string;
  data_modificacao: string;
  patrocinador_id: number;
  rg: string;
  cpf: string;
  cnpj: string;
  data_nascimento: string;
  inss_pis: string;
  ie: string;
  nit: string;
  pis_pasep: string;
  razao_social: string;
  nome_fantasia: string;
  cpf_empresario: string;
  nome_mae: string;
  sexo: string;
  dependentes: number;
  estado_civil_id: number;
  estado_civil_codigo: string;
  tipo_pessoa_id: number;
  tipo_pessoa_descricao: string;
  pais_codigo: string;
  pais_nome: string;
  uf_codigo: string;
  uf_nome: string;
  cidade_nome: string;
  cidade_id: number;
  cep: string;
  logradouro: string;
  numero: string;
  bairro: string;
  complemento: string;
  distribuidor_id: number;
  usuario: string;
  website: string;
  login: boolean;
  data_verificacao: string;
  auto_ativacao: boolean;
  email_verificado: boolean;
  ativo: boolean;
  patrocinador_id_loja: number;
  distribuidor_patrocinador_id: number;
  pena_esquerda_id: number;
  perna_direita_id: number;
  resumo: string;
  distribuidor_data_cadastro: string;
  ativacao_id: number;
}

// Distribuidor
export interface AllInDistribuidor {
  id: number;
  usuario: string;
  patrocinador_id: number;
  perna_esquerda_id: number;
  perna_direita_id: number;
  nome: string;
  data_nascimento: string;
  estado_civil: string;
  sexo: string;
  email: string;
  dependentes: number;
  website: string;
  resumo: string;
  tipo_pessoa: string;
  rg: string;
  cpf: string;
  cnpj: string;
  inss_pis: string;
  cpf_empresario: string;
  pis_pasep: string;
  nit: string;
  ie: string;
  razao_social: string;
  nome_fantasia: string;
  cep: string;
  nome_mae: string;
  cidade: string;
  bairro: string;
  endereco: string;
  complemento: string;
  numero: string;
  ativo: boolean;
  status: string;
  login: boolean;
  data_cadastro: string;
  data_verificacao: string;
  data_modificacao: string;
  auto_ativacao: boolean;
  email_verificado: boolean;
}

// Produto
export interface AllInProduto {
  id: number;
  nome: string;
  descricao: string;
  preco: number;
  ativo: boolean;
  data_cadastro: string;
  // Outros campos podem ser adicionados conforme necessário
}

// Pedido
export interface AllInPedido {
  id: number;
  distribuidor_indicador_id: number;
  distribuidor_comprador_id: number;
  loja_id: number;
  loja_nome: string;
  loja_documento: string;
  cliente_id: number;
  tipo_id: number;
  tipo_chave: string;
  tipo_nome: string;
  tipo_descricao: string;
  cliente_nome: string;
  cliente_sobrenome: string;
  cliente_email: string;
  cliente_telefone: string;
  cliente_rg: string;
  cliente_cpf: string;
  cliente_cnpj: string;
  cliente_ie: string;
  pagamento_confirmado: boolean;
  comanda_impressao: boolean;
  fatura_impressao: boolean;
  necessita_frete: boolean;
  data_pagamento: string;
  cliente_logradouro: string;
  cliente_bairro: string;
  cliente_cep: string;
  cliente_cidade: string;
  cliente_uf: string;
  entrega_nome: string;
  entrega_sobrenome: string;
  entrega_logradouro: string;
  entrega_bairro: string;
  entrega_cep: string;
  entrega_cidade: string;
  entrega_uf: string;
  comentario: string;
  valor_total: number;
  status_id: number;
  status: string;
  status_descricao: string;
  moeda_codigo: string;
  data_adicionado: string;
  data_modificado: string;
  cancelado: boolean;
  data_cancelamento: string;
  campos_personalizados: any[];
  market_place: boolean;
}

// CEP
export interface AllInCEP {
  cep: number;
  cidade_id: number;
  cidade: string;
  uf_id: number;
  uf_codigo: string;
  uf: string;
  pais_id: number;
  pais_codigo: string;
  pais: string;
  bairro: string;
  logradouro: string;
}

// Cidade
export interface AllInCidade {
  id: number;
  nome: string;
  uf_id: number;
  uf: string;
  uf_codigo: string;
  pais_id: number;
  pais: string;
  pais_codigo: string;
}

// Estado
export interface AllInEstado {
  id: number;
  uf: string;
  nome: string;
  pais_id: number;
  pais_nome: string;
}

// Estado Civil
export interface AllInEstadoCivil {
  id: number;
  codigo: string;
  descricao: string;
}

// País
export interface AllInPais {
  id: number;
  nome: string;
  nome_nativo: string;
  sigla: string;
  iso3: string;
}

// Sub-recursos de Distribuidores
export interface AllInDistribuidorAtivacoesMensais {
  id: number;
  distribuidor_id: number;
  mes: string;
  ano: number;
  quantidade_ativacoes: number;
  valor_total: number;
}

export interface AllInDistribuidorPlanoAtual {
  id: number;
  distribuidor_id: number;
  plano_id: number;
  plano_nome: string;
  plano_descricao: string;
  data_inicio: string;
  data_fim: string;
  ativo: boolean;
}

export interface AllInDistribuidorQualificacaoAtual {
  id: number;
  distribuidor_id: number;
  qualificacao_id: number;
  qualificacao_nome: string;
  qualificacao_descricao: string;
  nivel: number;
  data_obtencao: string;
}

export interface AllInDistribuidorTelefone {
  id: number;
  distribuidor_id: number;
  tipo: string;
  numero: string;
  ddd: string;
  principal: boolean;
}

// Sub-recursos de Pedidos
export interface AllInPedidoItem {
  id: number;
  pedido_id: number;
  produto_id: number;
  produto_nome: string;
  quantidade: number;
  preco_unitario: number;
  preco_total: number;
}

export interface AllInPedidoPagamento {
  id: number;
  pedido_id: number;
  forma_pagamento: string;
  valor: number;
  data_pagamento: string;
  status: string;
}

export interface AllInPedidoStatusUpdate {
  pedido_id: number;
  status_id: number;
  status: string;
}

// Sub-recursos de Produtos - Estoque
export interface AllInProdutoEstoque {
  id: number;
  produto_id: number;
  quantidade: number;
  quantidade_reservada: number;
  quantidade_disponivel: number;
  localizacao: string;
  data_atualizacao: string;
}

export interface AllInProdutoEstoqueTotal {
  produto_id: number;
  produto_nome: string;
  quantidade_total: number;
  quantidade_reservada: number;
  quantidade_disponivel: number;
}

// Sub-recursos MLM - Planos
export interface AllInPlano {
  id: number;
  nome: string;
  tipo: string;
  descricao?: string;
  valor?: number;
  ativo: boolean;
}

// Sub-recursos MLM - Rede Linear
export interface AllInRedeLinearNo {
  id: number;
  distribuidor_id: number;
  usuario: string;
  nome: string;
  linha: number;
  posicao_relativa: number;
  patrocinador_id: number;
  usuario_patrocinador?: string;
}

export interface AllInDownline {
  id: number;
  distribuidor_id: number;
  usuario: string;
  nome: string;
  linha: number;
  posicao_relativa: number;
  nivel: number;
}

export interface AllInUpline {
  id: number;
  distribuidor_id: number;
  usuario: string;
  nome: string;
  linha: number;
  posicao_relativa: number;
  nivel: number;
}

// Sub-recursos Financeiro - Bônus
export interface AllInBonusFaturamentoMes {
  mes: string;
  valor_total_bonus: number;
  valor_total_faturamento: number;
  valor_total_bonus_formatado: string;
  valor_total_faturamento_formatado: string;
}

// Sub-recursos Financeiro - Saldos
export interface AllinPedidoSaldo {
  id: number;
  cliente_id: number;
  pedido_id: number;
  pacote_id: number;
  valor: number;
  data: string;
  tipo_saldo_id: number;
  descricao: string;
  tipo_componente: string;
  mostrar_cliente: boolean;
  pacote_comprado_chave: string;
  pacote_descricao: string;
}
