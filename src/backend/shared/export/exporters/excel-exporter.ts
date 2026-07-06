/**
 * Excel Exporter
 * 
 * Exporta dados para formato Excel.
 */

export class ExcelExporter {
  /**
   * Converte array de objetos para formato Excel (XLSX)
   * Nota: Esta é uma implementação básica. Para funcionalidade completa,
   * considere usar bibliotecas como xlsx ou exceljs.
   */
  static exportToExcel<T extends Record<string, any>>(data: T[], filename: string): string {
    if (!data || data.length === 0) {
      return '';
    }

    const headers = Object.keys(data[0]);
    const rows: string[][] = [];

    // Add header row
    rows.push(headers);

    // Add data rows
    for (const row of data) {
      const values = headers.map(header => {
        const value = row[header];
        if (value === null || value === undefined) {
          return '';
        }
        if (typeof value === 'object') {
          return JSON.stringify(value);
        }
        return String(value);
      });
      rows.push(values);
    }

    // Convert to tab-separated values (TSV) which Excel can open
    const tsv = rows.map(row => row.join('\t')).join('\n');
    return tsv;
  }

  /**
   * Exporta para Excel e retorna como Blob
   */
  static exportToExcelBlob<T extends Record<string, any>>(data: T[], filename: string): Blob {
    const tsv = this.exportToExcel(data, filename);
    return new Blob([tsv], { type: 'application/vnd.ms-excel;charset=utf-8;' });
  }

  /**
   * Download Excel
   */
  static downloadExcel<T extends Record<string, any>>(data: T[], filename: string): void {
    const blob = this.exportToExcelBlob(data, filename);
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.xls`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}
