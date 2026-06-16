"""
CSV Exporter for AllIn scrapers.
"""

import csv
from typing import List, Dict, Any
from pathlib import Path
from datetime import datetime

import structlog

logger = structlog.get_logger()


class CSVExporter:
    """
    Export scraped data to CSV format.
    
    Features:
    - Batch export
    - Automatic header detection
    - Nested field flattening
    - Timestamped filenames
    """
    
    def __init__(self, output_dir: str = "data/csv_backup"):
        self.output_dir = Path(output_dir)
        self.output_dir.mkdir(parents=True, exist_ok=True)
    
    def export(
        self,
        entity: str,
        data: List[Dict[str, Any]],
        batch_size: int = 1000
    ) -> List[str]:
        """
        Export data to CSV files.
        
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
            logger.info("csv_export_started", entity=entity, count=len(data))
            
            # Export in batches
            for i in range(0, len(data), batch_size):
                batch = data[i:i + batch_size]
                batch_num = (i // batch_size) + 1
                
                # Create filename
                filename = f"{entity}_batch_{batch_num}_{timestamp}.csv"
                filepath = self.output_dir / filename
                
                # Export batch
                self._write_csv(filepath, batch)
                
                exported_files.append(str(filepath))
                logger.info(
                    "csv_batch_exported",
                    entity=entity,
                    batch=batch_num,
                    records=len(batch),
                    filepath=str(filepath)
                )
            
            logger.info("csv_export_completed", entity=entity, files=len(exported_files))
            return exported_files
            
        except Exception as e:
            logger.error("csv_export_error", entity=entity, error=str(e))
            return exported_files
    
    def export_single(
        self,
        entity: str,
        data: List[Dict[str, Any]],
        filename: Optional[str] = None
    ) -> str:
        """
        Export all data to a single CSV file.
        
        Args:
            entity: Entity name
            data: List of data dictionaries
            filename: Custom filename (optional)
            
        Returns:
            str: Exported file path
        """
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        
        if not filename:
            filename = f"{entity}_full_{timestamp}.csv"
        
        filepath = self.output_dir / filename
        
        try:
            logger.info("csv_single_export_started", entity=entity, count=len(data))
            
            self._write_csv(filepath, data)
            
            logger.info("csv_single_export_completed", entity=entity, filepath=str(filepath))
            return str(filepath)
            
        except Exception as e:
            logger.error("csv_single_export_error", entity=entity, error=str(e))
            raise
    
    def _write_csv(self, filepath: Path, data: List[Dict[str, Any]]) -> None:
        """
        Write data to CSV file.
        
        Args:
            filepath: Path to output file
            data: List of data dictionaries
        """
        if not data:
            logger.warning("no_data_to_export", filepath=str(filepath))
            return
        
        # Flatten nested dictionaries and get all headers
        flattened_data = [self._flatten_dict(record) for record in data]
        headers = self._get_headers(flattened_data)
        
        with open(filepath, 'w', newline='', encoding='utf-8') as f:
            writer = csv.DictWriter(f, fieldnames=headers)
            writer.writeheader()
            writer.writerows(flattened_data)
    
    def _flatten_dict(
        self,
        d: Dict[str, Any],
        parent_key: str = '',
        sep: str = '_'
    ) -> Dict[str, Any]:
        """
        Flatten nested dictionary.
        
        Args:
            d: Dictionary to flatten
            parent_key: Parent key for nested fields
            sep: Separator for nested keys
            
        Returns:
            Dict: Flattened dictionary
        """
        items = []
        for k, v in d.items():
            new_key = f"{parent_key}{sep}{k}" if parent_key else k
            
            if isinstance(v, dict):
                items.extend(self._flatten_dict(v, new_key, sep=sep).items())
            elif isinstance(v, list):
                # Convert lists to string representation
                items.append((new_key, str(v)))
            else:
                items.append((new_key, v))
        
        return dict(items)
    
    def _get_headers(self, data: List[Dict[str, Any]]) -> List[str]:
        """
        Get all unique headers from data.
        
        Args:
            data: List of dictionaries
            
        Returns:
            List[str]: List of headers
        """
        headers = set()
        for record in data:
            headers.update(record.keys())
        return sorted(list(headers))
