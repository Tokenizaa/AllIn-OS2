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
        # Mapeamento de status do AllInBrasil para valores permitidos pela constraint
        status_mapping = {
            'Pedido enviado para cliente': 'shipped',
            'Pedido Pago': 'processing',
            'Impresso': 'processing',
            'Ajuste de Sistema': 'processing',
            'Pedido Realizado': 'pending',
            'Aguardando pagamento': 'pending',
            'Pedido Cancelado': 'cancelled',
            'Processando Pedido': 'processing',
            'TESTE JUNIOR': 'pending',
            'Pedido em Feira': 'processing',
            'Pendente': 'pending',
            'cancelado': 'cancelled',
            'pending': 'pending',
            'processing': 'processing',
            'shipped': 'shipped',
            'delivered': 'delivered',
            'cancelled': 'cancelled',
            'refunded': 'refunded'
        }
        
        # Mapear o status
        status_original = pedido.pedido.situacao
        status_mapeado = status_mapping.get(status_original, 'pending')  # Default para pending se não encontrado
        
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
        
        # Extrair hora do pagamento se disponível
        hora_pagamento = None
        if data_pagamento_str:
            try:
                from datetime import datetime
                dt = datetime.fromisoformat(data_pagamento_str.replace('Z', '+00:00'))
                hora_pagamento = dt.time().isoformat()  # Converter para string
            except:
                pass
        
        # Extrair custo do frete (se "Frete Grátis" ou similar, usar 0)
        custo_frete = 0.0
        if pedido.envio and pedido.envio.frete and pedido.envio.frete != "Frete Grátis regra distribuidor":
            try:
                custo_frete = float(pedido.envio.frete.replace('R$', '').replace('.', '').replace(',', '.').strip())
            except:
                custo_frete = 0.0
        
        # Extrair payment_status (confirmado)
        payment_status = None
        if pedido.pagamento.pagamentos and pedido.pagamento.pagamentos[0]:
            payment_status = "confirmado" if pedido.pagamento.pagamentos[0].confirmado else "pendente"
        
        # Extrair payment_method (forma de pagamento)
        payment_method = None
        if pedido.pagamento.pagamentos and pedido.pagamento.pagamentos[0]:
            payment_method = pedido.pagamento.pagamentos[0].forma
        
        # Extrair payment_id (número do pagamento) - não usar pois é UUID no banco
        # Usar gateway_transaction_id para o ID do pagamento
        gateway_transaction_id = None
        if pedido.pagamento.pagamentos and pedido.pagamento.pagamentos[0]:
            gateway_transaction_id = str(pedido.pagamento.pagamentos[0].id) if pedido.pagamento.pagamentos[0].id else None
        
        # Extrair dados de envio com verificação de None
        # Nota: Campos de endereço foram movidos para tabela customers para evitar duplicação
        envio_frete = pedido.envio.frete if pedido.envio and hasattr(pedido.envio, 'frete') else None
        
        return {
            'numero_pedido': pedido.pedido.id,
            'status_pedido': status_mapeado,
            'id_comprador': pedido.pedido.cliente_id,
            'comprador': pedido.pedido.cliente,
            'usuario': pedido.pedido.cliente,
            'patrocinador_comprador': pedido.pedido.patrocinador_usuario,
            'forma_pagamento': pedido.pagamento.pagamentos[0].forma if pedido.pagamento.pagamentos else None,
            'forma_entrega': envio_frete,
            'cancelado': pedido.pedido.situacao == 'cancelado',
            'pago': pedido.pagamento.pagamentos[0].confirmado if pedido.pagamento.pagamentos else False,
            'data_criacao': data_criacao_str,
            'data_pagamento': data_pagamento_str,
            'valor_total_pedido': pedido.pedido.total,
            'pagamentos': json.dumps(pagamentos_serializaveis),
            'plano_comprador': pedido.distribuidor.nome_fantasia if pedido.distribuidor and hasattr(pedido.distribuidor, 'nome_fantasia') else None,
            'customer_id': None,  # Será preenchido posteriormente via integração com customers
            'distributor_id': None,  # Será preenchido posteriormente via integração com profiles
            # Campos adicionais mapeados
            'loja': pedido.pedido.loja if hasattr(pedido.pedido, 'loja') and pedido.pedido.loja else "All-in life style",
            'customer_name': pedido.pedido.cliente,
            'tipo_compra': pedido.pedido.tipo_cliente if hasattr(pedido.pedido, 'tipo_cliente') else None,
            'payment_method': payment_method,
            'payment_status': payment_status,
            'custo_frete': custo_frete,
            'valor_total': pedido.pedido.total,
            'status': status_mapeado,
            'order_number': pedido.pedido.id,
            'order_type': pedido.pedido.tipo_cliente if hasattr(pedido.pedido, 'tipo_cliente') else None,
            'data_criacao_pedido': data_criacao_str,
            'hora_pagamento': hora_pagamento,
            'gateway_transaction_id': gateway_transaction_id
        }
    
    def transform_order_items(self, pedido: PedidoCompleto):
        """Transformar dados de order_items para Supabase"""
        items = []
        for item in pedido.produtos.itens:
            # Garantir que product_code não esteja vazio
            product_code = item.sku if item.sku else f"{item.nome}-{item.modelo}".replace(' ', '-').upper()
            
            items.append({
                'order_id': pedido.pedido.id,  # ✅ CRÍTICO: Incluir order_id
                'product_code': product_code,
                'product_name': item.nome,
                'quantity': item.quantidade,
                'unit_price': item.valor,
                'total_price': item.total,
                'size': item.tamanho,
                'variant': item.modelo
            })
        return items
