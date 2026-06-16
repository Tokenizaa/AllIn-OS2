/**
 * Export Service
 * 
 * Serviço para exportar dados em diferentes formatos.
 */

import { CSVExporter } from './exporters/csv-exporter';
import { ExcelExporter } from './exporters/excel-exporter';
import { PDFExporter } from './exporters/pdf-exporter';

export type ExportFormat = 'csv' | 'excel' | 'pdf';

export class ExportService {
  /**
   * Exporta dados para o formato especificado
   */
  static export<T extends Record<string, any>>(
    data: T[],
    format: ExportFormat,
    filename: string
  ): string {
    switch (format) {
      case 'csv':
        return CSVExporter.exportToCSV(data, filename);
      case 'excel':
        return ExcelExporter.exportToExcel(data, filename);
      case 'pdf':
        return PDFExporter.exportToPDF(data, filename);
      default:
        throw new Error(`Unsupported export format: ${format}`);
    }
  }

  /**
   * Exporta dados para o formato especificado e retorna como Blob
   */
  static exportToBlob<T extends Record<string, any>>(
    data: T[],
    format: ExportFormat,
    filename: string
  ): Blob {
    switch (format) {
      case 'csv':
        return CSVExporter.exportToCSVBlob(data, filename);
      case 'excel':
        return ExcelExporter.exportToExcelBlob(data, filename);
      case 'pdf':
        return PDFExporter.exportToPDFBlob(data, filename);
      default:
        throw new Error(`Unsupported export format: ${format}`);
    }
  }

  /**
   * Exporta dados para o formato especificado e faz download
   */
  static download<T extends Record<string, any>>(
    data: T[],
    format: ExportFormat,
    filename: string
  ): void {
    switch (format) {
      case 'csv':
        CSVExporter.downloadCSV(data, filename);
        break;
      case 'excel':
        ExcelExporter.downloadExcel(data, filename);
        break;
      case 'pdf':
        PDFExporter.downloadPDF(data, filename);
        break;
      default:
        throw new Error(`Unsupported export format: ${format}`);
    }
  }

  /**
   * Filtra dados antes de exportar
   */
  static filterAndExport<T extends Record<string, any>>(
    data: T[],
    fields: (keyof T)[],
    format: ExportFormat,
    filename: string
  ): string {
    const filteredData = data.map(item => {
      const filtered: Partial<T> = {};
      fields.forEach(field => {
        filtered[field] = item[field];
      });
      return filtered as T;
    });
    return this.export(filteredData, format, filename);
  }
}
