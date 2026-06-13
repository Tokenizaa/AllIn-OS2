// ============================================================================
// API TYPES - ALLIN OS 2.0
// Modelos TypeScript para entidades da API AllInBrasil
// ============================================================================

// ============================================================================
// IDENTITY
// ============================================================================

export interface OAuthToken {
  access_token: string;
  expires_in: number;
  token_type: string;
  scope: string | null;
}

export interface OAuthAuthorization {
  response_type: string;
  client_id: string;
  redirect_uri: string;
  scope: string;
  state: string;
  elsl?: string;
}

// ============================================================================
// LOCATION
// ============================================================================

export interface CEP {
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

export interface Cidade {
  id: number;
  nome: string;
  uf_id: number;
  uf: string;
  uf_codigo: string;
  pais_id: number;
  pais: string;
  pais_codigo: string;
}

export interface Estado {
  id: number;
  uf: string;
  nome: string;
  pais_id: number;
  pais_nome: string;
}

export interface EstadoCivil {
  id: number;
  codigo: string;
  descricao: string;
}

export interface Pais {
  id: number;
  nome: string;
  nome_nativo: string;
  sigla: string;
  iso3: string;
}

// ============================================================================
// CRM
// ============================================================================

export interface Cliente {
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

export interface TipoPessoa {
  id: number;
  nome: string;
  ativo: boolean;
}

// ============================================================================
// MLM
// ============================================================================

export interface Distribuidor {
  id: number;
  usuario: string;
  nome: string;
  email: string;
  telefone: string;
  cpf: string;
  data_cadastro: string;
  ativo: boolean;
  patrocinador_id: number;
  perna_esquerda_id: number;
  perna_direita_id: number;
  plano_id: number;
  qualificacao_id: number;
}

export interface RedeLinearNo {
  id: number;
  linha: number;
  posicao_relativa: number;
  id_distribuidor: number;
  id_patrocinador: number;
  usuario_distribuidor: string;
  usuario_patrocinador: string;
}

export interface Simulacao {
  id: number;
  distribuidor_id: number;
  data_inicio: string;
  data_fim: string;
  status: string;
  valor_total: number;
}

// ============================================================================
// COMMERCE
// ============================================================================

export interface Produto {
  id: number;
  nome: string;
  descricao: string;
  preco: number;
  estoque: number;
  ativo: boolean;
  categoria_id: number;
  fabricante_id: number;
  imagem: string;
  sku: string;
}

export interface ProdutoCategoria {
  id: number;
  nome: string;
  descricao: string;
  categoria_pai_id: number;
  status: string;
}

export interface FormaPagamento {
  id: number;
  nome: string;
  codigo: string;
  is_active: boolean;
}

export interface Pedido {
  id: number;
  cliente_id: number;
  data_pedido: string;
  status: string;
  valor_total: number;
  loja_id: number;
}

export interface PedidoItem {
  id: number;
  pedido_id: number;
  produto_id: number;
  quantidade: number;
  preco_unitario: number;
}

export interface Fabricante {
  id: number;
  nome: string;
  imagem: string;
  ordem: number;
  is_active: boolean;
}

// ============================================================================
// LOGISTICS
// ============================================================================

export interface Transportadora {
  id: number;
  titulo: string;
  codigo: string;
  telefone: string;
  email: string;
  preco: number;
  situacao: number;
  loja_id: number;
}

// ============================================================================
// FINANCE
// ============================================================================

export interface DistribuidorContaBancaria {
  id: number;
  distribuidor_id: number;
  banco: number;
  tipo_titular: number;
  nome: string;
  telefone: string;
  cpf: string;
  cnpj: string;
  chave_pix: string;
}

export interface SolicitacaoSaque {
  id: number;
  distribuidor_id: number;
  valor_solicitado: number;
  status: string;
  data_pedido: string;
  data_aprovacao: string;
  data_pagamento: string;
}

// ============================================================================
// SYSTEM
// ============================================================================

export interface Linguagem {
  id: number;
  titulo: string;
  sigla: string;
  diretorio: string;
  status: number;
  padrao: boolean;
  ordem: number;
}

export interface Loja {
  id: number;
  documento: string;
  nome: string;
  status: number;
  cidade_id: number;
  uf_id: number;
}

export interface HealthCheck {
  status: string;
  timestamp: string;
  version: string;
}
