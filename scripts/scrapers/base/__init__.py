"""
Base components for AllIn scrapers.
"""

from .session_manager import SessionManager
from .browser_manager import BrowserManager
from .parser_base import ParserBase

__all__ = [
    'SessionManager',
    'BrowserManager',
    'ParserBase',
]
