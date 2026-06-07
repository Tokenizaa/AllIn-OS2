"""
Extractor para extração de pedidos da loja virtual
"""

from bs4 import BeautifulSoup
from typing import List
import time
from ..transformers.dataclasses import PedidoCompleto, PedidoInfo, DistribuidorInfo, PagadorInfo, EnvioInfo, ProdutosInfo, ProdutoItem, PagamentoInfo, PagamentoItem, HistoricoItem


class OrdersExtractor:
    """Classe para extração de pedidos da loja virtual"""
    
    def __init__(self, session, loja_base_url, token):
        self.session = session
        self.loja_base_url = loja_base_url
        self.token = token
    
    def extract_orders_list(self, start_date=None, end_date=None, limit=None):
        """Extrair lista de pedidos"""
        orders = []
        per_page = 15  # Começa com 15 itens por página (padrão)
        
        while True:
            print(f"📄 Extraindo pedidos (offset: {per_page})...")
            
            # URL da lista de pedidos (baseado no Playwright)
            # A paginação usa per_page como offset: 15, 30, 45, 60, ...
            url = f"{self.loja_base_url}/sale/order?token={self.token}&per_page={per_page}"
            
            if start_date and end_date:
                url += f"&start_date={start_date}&end_date={end_date}"
            
            try:
                response = self.session.get(url)
                
                if response.status_code != 200:
                    print(f"❌ Erro ao acessar página (offset: {per_page}): {response.status_code}")
                    break
                
                soup = BeautifulSoup(response.text, 'html.parser')
                
                # Extrair IDs dos pedidos da página (baseado no Playwright)
                # Tabela: table tbody tr, ID na primeira coluna
                order_rows = soup.select('table tbody tr')
                
                if not order_rows or len(order_rows) == 0:
                    print(f"✅ Fim da paginação (offset: {per_page})")
                    break  # Fim da paginação
                
                # Extrair IDs desta página
                page_orders = []
                for row in order_rows:
                    cells = row.select('td')
                    if cells:
                        order_id = cells[0].text.strip()
                        if order_id and order_id != 'Nº':  # Ignorar cabeçalho
                            page_orders.append(order_id)
                
                # Se não encontrou novos pedidos, fim da paginação
                if not page_orders:
                    print(f"✅ Fim da paginação (offset: {per_page})")
                    break
                
                # Se encontrou os mesmos pedidos da página anterior, fim da paginação
                if page_orders == orders[-len(page_orders):]:
                    print(f"✅ Fim da paginação (offset: {per_page})")
                    break
                
                # Adicionar novos pedidos
                for order_id in page_orders:
                    if order_id not in orders:  # Evitar duplicatas
                        orders.append(order_id)
                        # Parar se atingir o limite
                        if limit and len(orders) >= limit:
                            print(f"✅ Limite de {limit} pedidos atingido")
                            return orders
                
                print(f"✅ {len(orders)} pedidos encontrados até agora (offset: {per_page})")
                per_page += 15  # Incrementa offset para próxima página
                time.sleep(0.5)  # Rate limiting
                
            except Exception as e:
                print(f"❌ Erro ao extrair página (offset: {per_page}): {e}")
                break
        
        print(f"📊 Total de pedidos extraídos: {len(orders)}")
        return orders
    
    def extract_order_details(self, order_id):
        """Extrair detalhes completos do pedido (7 abas)"""
        print(f"🔍 Extraindo detalhes do pedido {order_id}...")
        
        # URL baseado no Playwright
        # https://allinbrasil.com.br/loja/admin/sale/order/info?token=...&order_id=...
        url = f"{self.loja_base_url}/sale/order/info?token={self.token}&order_id={order_id}"
        
        try:
            response = self.session.get(url)
            
            if response.status_code != 200:
                print(f"❌ Erro ao acessar pedido {order_id}: {response.status_code}")
                return None
            
            soup = BeautifulSoup(response.text, 'html.parser')
            
            # Aba 1: PedidoInfo (#tab-order)
            pedido_info = self.extract_pedido_info(soup, order_id)
            
            # Aba 2: DistribuidorInfo (#tab-distribuidor)
            distribuidor_info = self.extract_distribuidor_info(soup)
            
            # Aba 3: PagadorInfo (#tab-payment)
            pagador_info = self.extract_pagador_info(soup)
            
            # Aba 4: EnvioInfo (#tab-shipping)
            envio_info = self.extract_envio_info(soup)
            
            # Aba 5: ProdutosInfo (#tab-product)
            produtos_info = self.extract_produtos_info(soup)
            
            # Aba 6: PagamentoInfo (#tab-pagamento)
            pagamento_info = self.extract_pagamento_info(soup)
            
            # Aba 7: HistoricoItem (#tab-history)
            historico = self.extract_historico(soup)
            
            return PedidoCompleto(
                pedido=pedido_info,
                distribuidor=distribuidor_info,
                pagador=pagador_info,
                envio=envio_info,
                produtos=produtos_info,
                pagamento=pagamento_info,
                historico=historico
            )
            
        except Exception as e:
            print(f"❌ Erro ao extrair detalhes do pedido {order_id}: {e}")
            return None
    
    def extract_pedido_info(self, soup, order_id):
        """Extrair informações básicas do pedido (Aba 1 - #tab-order)"""
        # Baseado em docs/reverse-engineering/loja-virtual-pedidos-mapping.md
        # Campos: Pedido nº, Fatura nº, Loja, URL da loja, Cliente, Patrocinador, Tipo de cliente, E-mail, Telefone, CNPJ, Tipo de pessoa, Total, Situação do pedido, Endereço IP, Navegador, Idioma, Cadastro, Modificação, Usuário que finalizou
        
        # Extrair dados da tabela dentro de #tab-order
        tab_order = soup.select_one('#tab-order')
        if not tab_order:
            print("⚠️ Aba #tab-order não encontrada")
            return None
        
        table = tab_order.select_one('table')
        if not table:
            print("⚠️ Tabela não encontrada na aba de pedido")
            return None
        
        rows = table.select('tr')
        data = {}
        
        for row in rows:
            cells = row.select('td')
            if len(cells) >= 2:
                label = cells[0].text.strip()
                
                # Preservar elemento BeautifulSoup para campos que podem ter links (ex: Cliente)
                if label == 'Cliente:':
                    value = cells[1]  # Preservar elemento BeautifulSoup para extrair customer_id
                else:
                    value = cells[1].text.strip()
                
                data[label] = value
        
        # Extrair texto do campo Cliente (pode ser elemento BeautifulSoup)
        cliente_element = data.get('Cliente:')
        if hasattr(cliente_element, 'text'):
            cliente_text = cliente_element.text.strip()
        else:
            cliente_text = cliente_element
        
        return PedidoInfo(
            id=order_id,
            fatura_id=data.get('Fatura nº'),
            loja=data.get('Loja'),
            url_loja=data.get('URL da loja'),
            cliente=cliente_text,
            cliente_id=self._extract_customer_id(data.get('Cliente:')),
            patrocinador_usuario=self._extract_sponsor_username(data.get('Patrocinador')),
            patrocinador_nome=self._extract_sponsor_name(data.get('Patrocinador')),
            tipo_cliente=data.get('Tipo de cliente:'),
            email=data.get('E-mail'),
            telefone=data.get('Telefone:'),
            cnpj=data.get('CNPJ:'),
            tipo_pessoa=data.get('Tipo de pessoa:'),
            total=self._extract_float_from_text(data.get('Total:')),
            situacao=data.get('Situação do pedido:'),
            ip=data.get('Endereço IP:'),
            navegador=data.get('Navegador:'),
            idioma=data.get('Idioma:'),
            data_cadastro=self._extract_datetime_from_text(data.get('Cadastro:')),
            data_modificacao=self._extract_datetime_from_text(data.get('Modificação:')),
            usuario_finalizou=data.get('Usuário que finalizou')
        )
    
    def extract_distribuidor_info(self, soup):
        """Extrair informações do distribuidor (Aba 2 - #tab-distribuidor)"""
        # Campos: Nome, Patrocinador, Data Nascimento, E-mail, Endereço, Cidade / Estado, CNPJ, IE, Razão Social, Nome Fantasia
        tab_distribuidor = soup.select_one('#tab-distribuidor')
        if not tab_distribuidor:
            return None
        
        table = tab_distribuidor.select_one('table')
        if not table:
            return None
        
        rows = table.select('tr')
        data = {}
        
        for row in rows:
            cells = row.select('td')
            if len(cells) >= 2:
                label = cells[0].text.strip()
                value = cells[1].text.strip()
                data[label] = value
        
        return DistribuidorInfo(
            nome=data.get('Nome'),
            patrocinador_usuario=self._extract_sponsor_username(data.get('Patrocinador')),
            patrocinador_nome=self._extract_sponsor_name(data.get('Patrocinador')),
            data_nascimento=data.get('Data Nascimento'),
            email=data.get('E-mail'),
            endereco=data.get('Endereço'),
            cidade=data.get('Cidade / Estado'),
            cnpj=data.get('CNPJ'),
            ie=data.get('IE'),
            razao_social=data.get('Razão Social'),
            nome_fantasia=data.get('Nome Fantasia')
        )
    
    def extract_pagador_info(self, soup):
        """Extrair informações do pagador (Aba 3 - #tab-payment)"""
        # Campos: Nome, Sobrenome, Empresa, Endereço, Número, Bairro, Cidade, CEP, Estado, UF, País, Complemento
        tab_payment = soup.select_one('#tab-payment')
        if not tab_payment:
            return None
        
        table = tab_payment.select_one('table')
        if not table:
            return None
        
        rows = table.select('tr')
        data = {}
        
        for row in rows:
            cells = row.select('td')
            if len(cells) >= 2:
                label = cells[0].text.strip()
                value = cells[1].text.strip()
                data[label] = value
        
        return PagadorInfo(
            nome=data.get('Nome:'),
            sobrenome=data.get('Sobrenome:'),
            empresa=data.get('Empresa:'),
            endereco=data.get('Endereço:'),
            numero=data.get('Número:'),
            bairro=data.get('Bairro:'),
            cidade=data.get('Cidade:'),
            cep=data.get('CEP:'),
            estado=data.get('Estado:'),
            uf=data.get('UF:'),
            pais=data.get('País:'),
            complemento=data.get('Complemento:')
        )
    
    def extract_envio_info(self, soup):
        """Extrair informações de envio (Aba 4 - #tab-shipping)"""
        # Campos: Nome, Sobrenome, Telefone, Empresa, Número, Endereço, Bairro, Cidade, CEP, Estado, UF, País, Frete, Complemento
        tab_shipping = soup.select_one('#tab-shipping')
        if not tab_shipping:
            return None
        
        table = tab_shipping.select_one('table')
        if not table:
            return None
        
        rows = table.select('tr')
        data = {}
        
        for row in rows:
            cells = row.select('td')
            if len(cells) >= 2:
                label = cells[0].text.strip()
                value = cells[1].text.strip()
                data[label] = value
        
        return EnvioInfo(
            nome=data.get('Nome:'),
            sobrenome=data.get('Sobrenome:'),
            telefone=data.get('Telefone'),
            empresa=data.get('Empresa:'),
            numero=data.get('Número:'),
            endereco=data.get('Endereço:'),
            bairro=data.get('Bairro:'),
            cidade=data.get('Cidade:'),
            cep=data.get('CEP:'),
            estado=data.get('Estado:'),
            uf=data.get('UF:'),
            pais=data.get('País:'),
            frete=data.get('Frete:'),
            complemento=data.get('Complemento:')
        )
    
    def extract_produtos_info(self, soup):
        """Extrair informações dos produtos (Aba 5 - #tab-product)"""
        # Colunas: Produto, Modelo, SKU, Quantidade, Valor, Total
        # Linhas de resumo: Sub-total por categoria, Sub-total, Desconto Distribuidor 50%, Frete Grátis regra distribuidor, Total
        # A tabela de produtos está dentro da aba #tab-product
        tab_product = soup.select_one('#tab-product')
        if not tab_product:
            print("⚠️ Aba #tab-product não encontrada")
            return None
        
        table = tab_product.select_one('table')
        if not table:
            print("⚠️ Tabela de produtos não encontrada na aba #tab-product")
            return None
        
        rows = table.select('tr')
        itens = []
        
        for row in rows:
            cells = row.select('td')
            if len(cells) >= 6:
                # Verificar se é uma linha de produto (não de resumo)
                produto = cells[0].text.strip()
                modelo = cells[1].text.strip()
                quantidade = cells[3].text.strip()
                
                # Verificar se é um produto válido
                # Produto tem nome, modelo e quantidade numérica
                if produto and modelo and quantidade.isdigit():
                    # Extrair tamanho do nome do produto (formato: "Nome - Tamanho : XX")
                    tamanho = ''
                    if '- Tamanho :' in produto:
                        nome_partes = produto.split('- Tamanho :')
                        nome = nome_partes[0].strip()
                        tamanho = nome_partes[1].strip() if len(nome_partes) > 1 else ''
                    else:
                        nome = produto
                    
                    item = ProdutoItem(
                        nome=nome,
                        produto_id='',  # Pode ser extraído do link se disponível
                        tamanho=tamanho,
                        modelo=modelo,
                        sku=cells[2].text.strip(),
                        quantidade=int(quantidade or '0'),
                        valor=self._extract_float_from_text(cells[4].text.strip()),
                        total=self._extract_float_from_text(cells[5].text.strip())
                    )
                    itens.append(item)
        
        # Extrair valores de resumo
        subtotal_categoria = 0.0
        subtotal = 0.0
        desconto_distribuidor = 0.0
        frete = 0.0
        total = 0.0
        
        for row in rows:
            cells = row.select('td')
            if len(cells) >= 2:
                label = cells[0].text.strip()
                # O valor pode estar na última coluna (colspan)
                if len(cells) >= 2:
                    value = cells[-1].text.strip()  # Pegar última célula (valor)
                
                if label == 'Sub-total por categoria:':
                    subtotal_categoria = self._extract_float_from_text(value)
                elif label == 'Sub-total:':
                    subtotal = self._extract_float_from_text(value)
                elif 'Desconto Distribuidor' in label:
                    desconto_distribuidor = self._extract_float_from_text(value)
                elif 'Frete' in label:
                    frete = self._extract_float_from_text(value)
                elif label == 'Total:':
                    total = self._extract_float_from_text(value)
        
        return ProdutosInfo(
            itens=itens,
            subtotal_categoria=subtotal_categoria,
            subtotal=subtotal,
            desconto_distribuidor=desconto_distribuidor,
            frete=frete,
            total=total
        )
    
    def extract_pagamento_info(self, soup):
        """Extrair informações de pagamento (Aba 6 - #tab-pagamento)"""
        # Resumo: Valor total, Valor confirmado
        # Tabela: Nº Pagamento, Forma, Método, Valor, Confirmado, Data pagamento, Ações
        tab_pagamento = soup.select_one('#tab-pagamento')
        if not tab_pagamento:
            return None
        
        tables = tab_pagamento.select('table')
        if not tables:
            return None
        
        # Primeira tabela: resumo
        summary_table = tables[0]
        rows = summary_table.select('tr')
        valor_total = 0.0
        valor_confirmado = 0.0
        
        for row in rows:
            cells = row.select('td')
            if len(cells) >= 2:
                label = cells[0].text.strip()
                value = cells[1].text.strip()
                
                if label == 'Valor total':
                    valor_total = self._extract_float_from_text(value)
                elif label == 'Valor confirmado':
                    valor_confirmado = self._extract_float_from_text(value)
        
        # Segunda tabela (se existir): pagamentos
        pagamentos = []
        if len(tables) > 1:
            payment_table = tables[1]
            payment_rows = payment_table.select('tr')[1:]  # Pular cabeçalho
            
            for row in payment_rows:
                cells = row.select('td')
                if len(cells) >= 6:
                    pagamento = PagamentoItem(
                        id=cells[0].text.strip(),
                        forma=cells[1].text.strip(),
                        metodo=cells[2].text.strip(),
                        valor=self._extract_float_from_text(cells[3].text.strip()),
                        confirmado=cells[4].text.strip().lower() in ['sim', 'true', '1'],
                        data_pagamento=self._extract_datetime_from_text(cells[5].text.strip())
                    )
                    pagamentos.append(pagamento)
        
        return PagamentoInfo(
            valor_total=valor_total,
            valor_confirmado=valor_confirmado,
            pagamentos=pagamentos
        )
    
    def extract_historico(self, soup):
        """Extrair histórico do pedido (Aba 7 - #tab-history)"""
        # Colunas: Cadastro, Comentário, Situação, Cliente notificado
        tab_history = soup.select_one('#tab-history')
        if not tab_history:
            return []
        
        table = tab_history.select_one('table')
        if not table:
            return []
        
        rows = table.select('tr')[1:]  # Pular cabeçalho
        historico = []
        
        for row in rows:
            cells = row.select('td')
            if len(cells) >= 4:
                item = HistoricoItem(
                    data=self._extract_datetime_from_text(cells[0].text.strip()),
                    comentario=cells[1].text.strip(),
                    situacao=cells[2].text.strip(),
                    cliente_notificado=cells[3].text.strip().lower() in ['sim', 'true', '1']
                )
                historico.append(item)
        
        return historico
    
    def _extract_customer_id(self, cliente_element):
        """Extrair ID do cliente do elemento HTML (pode estar em um link)"""
        if not cliente_element:
            return None
        
        # Se for elemento BeautifulSoup, extrair customer_id do link
        if hasattr(cliente_element, 'find'):
            link = cliente_element.find('a')
            if link and link.get('href'):
                href = link.get('href')
                if 'customer_id=' in href:
                    return href.split('customer_id=')[1].split('&')[0]
        
        # Fallback: extrair do texto se elemento não tiver link
        if hasattr(cliente_element, 'text'):
            cliente_text = cliente_element.text.strip()
            import re
            match = re.search(r'\d+', cliente_text)
            if match:
                return match.group(0)
        
        return None
    
    def _extract_sponsor_username(self, patrocinador_text):
        """Extrair username do patrocinador (formato: usuario Nome)"""
        if not patrocinador_text:
            return None
        # Formato esperado: "usuario Nome"
        parts = patrocinador_text.split(' ', 1)
        return parts[0] if parts else None
    
    def _extract_sponsor_name(self, patrocinador_text):
        """Extrair nome do patrocinador (formato: usuario Nome)"""
        if not patrocinador_text:
            return None
        # Formato esperado: "usuario Nome"
        parts = patrocinador_text.split(' ', 1)
        return parts[1] if len(parts) > 1 else None
    
    def _extract_float_from_text(self, text):
        """Extrair valor float de texto"""
        if not text:
            return 0.0
        try:
            # Remover formatação de moeda brasileira
            text = text.replace('R$', '').replace('.', '').replace(',', '.').strip()
            return float(text)
        except:
            return 0.0
    
    def _extract_datetime_from_text(self, text):
        """Extrair datetime de texto"""
        if not text:
            return None
        try:
            from datetime import datetime
            # Tentar diferentes formatos de data brasileira
            for fmt in ['%d/%m/%Y %H:%M:%S', '%d/%m/%Y', '%Y-%m-%d %H:%M:%S', '%Y-%m-%d']:
                try:
                    return datetime.strptime(text, fmt)
                except:
                    continue
        except:
            pass
        return None
