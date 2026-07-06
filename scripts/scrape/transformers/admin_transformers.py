"""
Transformer para conversão de dados do painel administrativo para formato Supabase
"""

from supabase import create_client


class AdminSupabaseTransformer:
    """Classe para transformar dados do painel administrativo para formato Supabase"""
    
    def __init__(self, supabase_url, supabase_key):
        self.supabase = create_client(supabase_url, supabase_key)
    
    def transform_plano(self, plano_raw):
        """Transformar dados de plano (Adesão) para Supabase"""
        # Gerar slug a partir do nome
        slug = plano_raw['nome'].lower().replace(' ', '-').replace('ã', 'a').replace('õ', 'o').replace('ç', 'c').replace('á', 'a').replace('é', 'e').replace('í', 'i').replace('ó', 'o').replace('ú', 'u')
        
        return {
            'nome': plano_raw['nome'],
            'tipo': 'adesao',  # Tipo padrão para planos de adesão
            'slug': slug,
            'preco': self._parse_currency(plano_raw['preco']),
            'is_active': plano_raw['status'] == 'Sim',
            'metadata': {
                'allin_id': plano_raw['id'],
                'estoque': int(plano_raw['estoque']) if plano_raw['estoque'].isdigit() else 0
            }
        }
    
    def transform_plano_vendido(self, plano_vendido_raw):
        """Transformar dados de plano vendido para tabela customer_plans existente"""
        return {
            'id_comprador': plano_vendido_raw['numero_compra'],  # Usar numero_compra como id_comprador
            'plano': plano_vendido_raw['plano'],
            'data_pagamento': self._parse_datetime(plano_vendido_raw['data_pagamento']),
            'valor': self._parse_currency(plano_vendido_raw['valor']),
            'metadata': {
                'distribuidor': plano_vendido_raw['distribuidor'],
                'data_ultima_modificacao': self._parse_datetime(plano_vendido_raw['data_ultima_modificacao'])
            }
        }
    
    def transform_distribuidor(self, distribuidor_raw):
        """Transformar dados de distribuidor para Supabase"""
        return {
            'usuario': distribuidor_raw['usuario'],
            'nome': distribuidor_raw['nome_completo'],
            'email': distribuidor_raw.get('email', ''),
            'patrocinador_id': distribuidor_raw['patrocinador'],
            'cidade': distribuidor_raw['cidade'],
            'estado': distribuidor_raw['estado'],
            'ativo': distribuidor_raw['ativo'] == 'Sim' or distribuidor_raw['ativo'] == 'Ativo',
            'data_cadastro': self._parse_datetime(distribuidor_raw['data_cadastro']),
            'metadata': {
                'allin_numero': distribuidor_raw['numero']
            }
        }
    
    def _parse_currency(self, value):
        """Converter valor monetário para float"""
        if not value:
            return 0.0
        try:
            # Remover R$, espaços e converter formato brasileiro
            cleaned = value.replace('R$', '').replace('.', '').replace(',', '.').strip()
            return float(cleaned)
        except:
            return 0.0
    
    def _parse_datetime(self, value):
        """Converter datetime string para formato ISO"""
        if not value:
            return None
        try:
            # Formato brasileiro: DD/MM/YYYY HH:MM:SS
            from datetime import datetime
            if ' ' in value:
                date_part, time_part = value.split(' ')
                day, month, year = date_part.split('/')
                time_str = time_part
                dt = datetime(int(year), int(month), int(day), *[int(x) for x in time_str.split(':')])
                return dt.isoformat()
            else:
                day, month, year = value.split('/')
                dt = datetime(int(year), int(month), int(day))
                return dt.isoformat()
        except:
            return value  # Retornar original se falhar
