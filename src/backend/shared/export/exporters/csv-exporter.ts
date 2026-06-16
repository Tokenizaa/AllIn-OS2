/**
 * CSV Exporter
 * 
 * Exporta dados para formato CSV.
 */

export class CSVExporter {
  /**
   * Converte array de objetos para CSV
   */
  static exportToCSV<T extends Record<string, any>>(data: T[], filename?: string): string {
    if (!data || data.length === 0) {
      return '';
    }

    const headers = Object.keys(data[0]);
    const csvRows: string[] = [];

    // Add header row
    csvRows.push(headers.join(','));

    // Add data rows
    for (const row of data) {
      const values = headers.map(header => {
        const value = row[header];
        // Handle null/undefined
        if (value === null || value === undefined) {
          return '';
        }
        // Handle objects/arrays by stringifying
        if (typeof value === 'object') {
          return `"${JSON.stringify(value).replace(/"/g, '""')}"`;
        }
        // Handle strings with commas or quotes
        if (typeof value === 'string' && (value.includes(',') || value.includes('"') || value.includes('\n'))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return String(value);
      });
      csvRows.push(values.join(','));
    }

    return csvRows.join('\n');
  }

  /**
   * Exporta para CSV e retorna como Blob
   */
  static exportToCSVBlob<T extends Record<string, any>>(data: T[], filename: string): Blob {
    const csv = this.exportToCSV(data);
    return new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  }

  /**
   * Download CSV
   */
  static downloadCSV<T extends Record<string, any>>(data: T[], filename: string): void {
    const blob = this.exportToCSVBlob(data, filename);
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}
