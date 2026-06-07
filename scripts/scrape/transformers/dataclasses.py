"""
Dataclasses Python para estrutura de dados da loja virtual
Baseado em docs/reverse-engineering/loja-virtual-pedidos-mapping.md
"""

from dataclasses import dataclass
from typing import List, Optional
from datetime import datetime


@dataclass
class PedidoInfo:
    """Informações básicas do pedido"""
    id: str
    fatura_id: Optional[str]
    loja: str
    url_loja: str
    cliente: str
    cliente_id: str
    patrocinador_usuario: str
    patrocinador_nome: str
    tipo_cliente: str
    email: str
    telefone: str
    cnpj: str
    tipo_pessoa: str
    total: float
    situacao: str
    ip: str
    navegador: str
    idioma: str
    data_cadastro: datetime
    data_modificacao: datetime
    usuario_finalizou: str


@dataclass
class DistribuidorInfo:
    """Informações do distribuidor"""
    nome: str
    patrocinador_usuario: str
    patrocinador_nome: str
    data_nascimento: str
    email: str
    endereco: str
    cidade: str
    cnpj: str
    ie: str
    razao_social: str
    nome_fantasia: str


@dataclass
class PagadorInfo:
    """Informações do pagador"""
    nome: str
    sobrenome: str
    empresa: str
    endereco: str
    numero: str
    bairro: str
    cidade: str
    cep: str
    estado: str
    uf: str
    pais: str
    complemento: str


@dataclass
class EnvioInfo:
    """Informações de envio"""
    nome: str
    sobrenome: str
    telefone: str
    empresa: str
    numero: str
    endereco: str
    bairro: str
    cidade: str
    cep: str
    estado: str
    uf: str
    pais: str
    frete: str
    complemento: str


@dataclass
class ProdutoItem:
    """Item do produto"""
    nome: str
    produto_id: str
    tamanho: str
    modelo: str
    sku: str
    quantidade: int
    valor: float
    total: float


@dataclass
class ProdutosInfo:
    """Informações dos produtos"""
    itens: List[ProdutoItem]
    subtotal_categoria: float
    subtotal: float
    desconto_distribuidor: float
    frete: float
    total: float


@dataclass
class PagamentoItem:
    """Item de pagamento"""
    id: str
    forma: str
    metodo: str
    valor: float
    confirmado: bool
    data_pagamento: datetime


@dataclass
class PagamentoInfo:
    """Informações de pagamento"""
    valor_total: float
    valor_confirmado: float
    pagamentos: List[PagamentoItem]


@dataclass
class HistoricoItem:
    """Item do histórico"""
    data: datetime
    comentario: str
    situacao: str
    cliente_notificado: bool


@dataclass
class PedidoCompleto:
    """Estrutura completa do pedido"""
    pedido: PedidoInfo
    distribuidor: DistribuidorInfo
    pagador: PagadorInfo
    envio: EnvioInfo
    produtos: ProdutosInfo
    pagamento: PagamentoInfo
    historico: List[HistoricoItem]
