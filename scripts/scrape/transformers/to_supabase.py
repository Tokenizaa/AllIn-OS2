"""
Transformer para conversão de dados da loja virtual para formato Supabase
"""

from supabase import create_client
from .dataclasses import PedidoCompleto
import json


class SupabaseTransformer:
    """Classe para transformar dados da loja virtual para formato Supabase"""
    
    def __init__(self, supabase_url, supabase_key):
        self.supabase = create_client(supabase_url, supabase_key)
    
    def transform_customer(self, pedido: PedidoCompleto):
        """Transformar dados de customer para Supabase"""
        return {
            'id_comprador': pedido.pedido.cliente_id,
            'usuario': pedido.pedido.cliente,
            'email': pedido.pedido.email,  # ✅ DADO CRÍTICO
            'telefone': pedido.pedido.telefone,
            'cpf': pedido.pedido.cnpj,  # ✅ DADO CRÍTICO (campo cnpj da loja virtual mapeia para cpf)
            'patrocinador_comprador': pedido.pedido.patrocinador_usuario,
            'nome_completo': pedido.distribuidor.nome,
            'data_criacao': pedido.pedido.data_cadastro,
            'plano_comprador': pedido.distribuidor.nome_fantasia,
            'endereco': pedido.distribuidor.endereco,
            'cidade': pedido.distribuidor.cidade,
            'estado': pedido.pagador.estado,
            'bairro': pedido.pagador.bairro,
            'numero': pedido.pagador.numero,
            'complemento': pedido.pagador.complemento,
            'cep': pedido.pagador.cep,
            'user_id': None  # Será preenchido posteriormente via integração com profiles
        }
    
    def transform_customer_from_order(self, pedido: PedidoCompleto):
        """Transformar dados de customer extraídos do pedido (abas #tab-order e #tab-distribuidor)"""
        # Extrair dados da aba #tab-order (PedidoInfo)
        pedido_info = pedido.pedido
        # Extrair dados da aba #tab-distribuidor (DistribuidorInfo)
        distribuidor_info = pedido.distribuidor
        # Extrair dados da aba #tab-payment (PagadorInfo)
        pagador_info = pedido.pagador
        # Extrair dados da aba #tab-shipping (EnvioInfo)
        envio_info = pedido.envio
        
        # Se cliente_id não estiver disponível, usar o ID do pedido como fallback
        id_comprador = pedido_info.cliente_id if pedido_info.cliente_id else pedido_info.id
        
        # Extrair estado da cidade se disponível (formato: "Cidade / Estado" ou "Cidade - Estado")
        estado = None
        if distribuidor_info and distribuidor_info.cidade:
            cidade_parts = distribuidor_info.cidade.split('/')
            if len(cidade_parts) > 1:
                estado = cidade_parts[1].strip()
            else:
                cidade_parts = distribuidor_info.cidade.split('-')
                if len(cidade_parts) > 1:
                    estado = cidade_parts[1].strip()
        
        # Priorizar dados de EnvioInfo (endereço de entrega) sobre PagadorInfo (endereço de cobrança)
        endereco = envio_info.endereco if envio_info and envio_info.endereco else (pagador_info.endereco if pagador_info else None)
        bairro = envio_info.bairro if envio_info and envio_info.bairro else (pagador_info.bairro if pagador_info else None)
        numero = envio_info.numero if envio_info and envio_info.numero else (pagador_info.numero if pagador_info else None)
        complemento = envio_info.complemento if envio_info and envio_info.complemento else (pagador_info.complemento if pagador_info else None)
        cep = envio_info.cep if envio_info and envio_info.cep else (pagador_info.cep if pagador_info else None)
        cidade = envio_info.cidade if envio_info and envio_info.cidade else (distribuidor_info.cidade if distribuidor_info else None)
        estado_final = envio_info.estado if envio_info and envio_info.estado else (estado if estado else None)
        
        # Converter datetime para string
        data_criacao_str = pedido_info.data_cadastro.isoformat() if pedido_info.data_cadastro and hasattr(pedido_info.data_cadastro, 'isoformat') else str(pedido_info.data_cadastro) if pedido_info.data_cadastro else None
        
        # Combinar dados para criar customer
        return {
            'id_comprador': id_comprador,
            'usuario': pedido_info.cliente,
            'email': pedido_info.email,
            'telefone': pedido_info.telefone,
            'cpf': pedido_info.cnpj,
            'patrocinador_comprador': pedido_info.patrocinador_usuario,
            'nome_completo': distribuidor_info.nome if distribuidor_info else pedido_info.cliente,
            'data_criacao': data_criacao_str,
            'plano_comprador': distribuidor_info.nome_fantasia if distribuidor_info else None,
            'endereco': endereco,
            'cidade': cidade,
            'estado': estado_final,
            'bairro': bairro,
            'numero': numero,
            'complemento': complemento,
            'cep': cep,
            'user_id': None  # Será preenchido posteriormente via integração com profiles
        }
    
    def transform_order(self, pedido: PedidoCompleto):
        """Transformar dados de order para Supabase"""
        # Converter pagamentos para formato serializável
        pagamentos_serializaveis = []
        for p in pedido.pagamento.pagamentos:
            pag_dict = p.__dict__.copy()
            # Converter datetime para string
            if pag_dict.get('data_pagamento'):
                pag_dict['data_pagamento'] = pag_dict['data_pagamento'].isoformat() if hasattr(pag_dict['data_pagamento'], 'isoformat') else str(pag_dict['data_pagamento'])
            pagamentos_serializaveis.append(pag_dict)
        
        # Converter datetime para string
        data_criacao_str = pedido.pedido.data_cadastro.isoformat() if pedido.pedido.data_cadastro and hasattr(pedido.pedido.data_cadastro, 'isoformat') else pedido.pedido.data_cadastro
        data_pagamento_str = None
        if pedido.pagamento.pagamentos and pedido.pagamento.pagamentos[0].data_pagamento:
            data_pagamento_str = pedido.pagamento.pagamentos[0].data_pagamento.isoformat() if hasattr(pedido.pagamento.pagamentos[0].data_pagamento, 'isoformat') else str(pedido.pagamento.pagamentos[0].data_pagamento)
        
        return {
            'numero_pedido': pedido.pedido.id,
            'status_pedido': pedido.pedido.situacao,
            'id_comprador': pedido.pedido.cliente_id,
            'comprador': pedido.pedido.cliente,
            'usuario': pedido.pedido.cliente,
            'patrocinador_comprador': pedido.pedido.patrocinador_usuario,
            'telefone': pedido.pedido.telefone,
            'forma_pagamento': pedido.pagamento.pagamentos[0].forma if pedido.pagamento.pagamentos else None,
            'estado': pedido.envio.estado,
            'cidade': pedido.envio.cidade,
            'endereco': pedido.envio.endereco,
            'bairro': pedido.envio.bairro,
            'numero': pedido.envio.numero,
            'complemento': pedido.envio.complemento,
            'cep': pedido.envio.cep,
            'forma_entrega': pedido.envio.frete,
            'cancelado': pedido.pedido.situacao == 'cancelado',
            'pago': pedido.pagamento.pagamentos[0].confirmado if pedido.pagamento.pagamentos else False,
            'data_criacao': data_criacao_str,
            'data_pagamento': data_pagamento_str,
            'valor_total_pedido': pedido.pedido.total,
            'pagamentos': json.dumps(pagamentos_serializaveis),
            'plano_comprador': pedido.distribuidor.nome_fantasia,
            'customer_id': None,  # Será preenchido posteriormente via integração com customers
            'distributor_id': None  # Será preenchido posteriormente via integração com profiles
        }
    
    def transform_order_items(self, pedido: PedidoCompleto):
        """Transformar dados de order_items para Supabase"""
        items = []
        for item in pedido.produtos.itens:
            items.append({
                'order_id': pedido.pedido.id,  # ✅ CRÍTICO: Incluir order_id
                'product_code': item.sku,
                'product_name': item.nome,
                'quantity': item.quantidade,
                'unit_price': item.valor,
                'total_price': item.total,
                'size': item.tamanho,
                'variant': item.modelo
            })
        return items
