"""
Plan scrapers for AllIn.
"""

from .plans_models import PlanModel, PlanDetailModel
from .plans_parser import PlanParser
from .plans_scraper import PlanScraper

__all__ = [
    'PlanModel',
    'PlanDetailModel',
    'PlanParser',
    'PlanScraper',
]
