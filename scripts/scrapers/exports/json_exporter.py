"""
JSON Exporter for AllIn scrapers.
"""

import json
from typing import List, Dict, Any
from pathlib import Path
from datetime import datetime

import structlog

logger = structlog.get_logger()


class JSONExporter:
    """
    Export scraped data to JSON format.
    
    Features:
    - Batch export
    - Pretty printing
    - Timestamped filenames
    - Backup directory management
    """
    
    def __init__(self, output_dir: str = "data/json_backup"):
        self.output_dir = Path(output_dir)
        self.output_dir.mkdir(parents=True, exist_ok=True)
    
    def export(
        self,
        entity: str,
        data: List[Dict[str, Any]],
        batch_size: int = 1000
    ) -> List[str]:
        """
        Export data to JSON files.
        
        Args:
            entity: Entity name (e.g., 'products', 'orders', 'plans')
            data: List of data dictionaries
            batch_size: Number of records per file
            
        Returns:
            List[str]: List of exported file paths
        """
        exported_files = []
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        
        try:
            logger.info("json_export_started", entity=entity, count=len(data))
            
            # Export in batches
            for i in range(0, len(data), batch_size):
                batch = data[i:i + batch_size]
                batch_num = (i // batch_size) + 1
                
                # Create filename
                filename = f"{entity}_batch_{batch_num}_{timestamp}.json"
                filepath = self.output_dir / filename
                
                # Export batch
                with open(filepath, 'w', encoding='utf-8') as f:
                    json.dump(batch, f, indent=2, ensure_ascii=False, default=str)
                
                exported_files.append(str(filepath))
                logger.info(
                    "json_batch_exported",
                    entity=entity,
                    batch=batch_num,
                    records=len(batch),
                    filepath=str(filepath)
                )
            
            logger.info("json_export_completed", entity=entity, files=len(exported_files))
            return exported_files
            
        except Exception as e:
            logger.error("json_export_error", entity=entity, error=str(e))
            return exported_files
    
    def export_single(
        self,
        entity: str,
        data: List[Dict[str, Any]],
        filename: Optional[str] = None
    ) -> str:
        """
        Export all data to a single JSON file.
        
        Args:
            entity: Entity name
            data: List of data dictionaries
            filename: Custom filename (optional)
            
        Returns:
            str: Exported file path
        """
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        
        if not filename:
            filename = f"{entity}_full_{timestamp}.json"
        
        filepath = self.output_dir / filename
        
        try:
            logger.info("json_single_export_started", entity=entity, count=len(data))
            
            with open(filepath, 'w', encoding='utf-8') as f:
                json.dump(data, f, indent=2, ensure_ascii=False, default=str)
            
            logger.info("json_single_export_completed", entity=entity, filepath=str(filepath))
            return str(filepath)
            
        except Exception as e:
            logger.error("json_single_export_error", entity=entity, error=str(e))
            raise
    
    def export_metadata(
        self,
        entity: str,
        metadata: Dict[str, Any]
    ) -> str:
        """
        Export metadata to JSON file.
        
        Args:
            entity: Entity name
            metadata: Metadata dictionary
            
        Returns:
            str: Exported file path
        """
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"{entity}_metadata_{timestamp}.json"
        filepath = self.output_dir / filename
        
        try:
            with open(filepath, 'w', encoding='utf-8') as f:
                json.dump(metadata, f, indent=2, ensure_ascii=False, default=str)
            
            logger.info("json_metadata_exported", entity=entity, filepath=str(filepath))
            return str(filepath)
            
        except Exception as e:
            logger.error("json_metadata_export_error", entity=entity, error=str(e))
            raise
