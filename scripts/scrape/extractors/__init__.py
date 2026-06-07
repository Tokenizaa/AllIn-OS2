"""
Extractors para extração de dados da loja virtual
"""

from .orders import OrdersExtractor
from .customers import CustomersExtractor

__all__ = ['OrdersExtractor', 'CustomersExtractor']
