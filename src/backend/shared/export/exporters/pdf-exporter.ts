/**
 * PDF Exporter
 * 
 * Exporta dados para formato PDF.
 */

export class PDFExporter {
  /**
   * Converte array de objetos para formato PDF
   * Nota: Esta é uma implementação básica que gera um PDF simples.
   * Para funcionalidade completa, considere usar bibliotecas como jsPDF ou pdfkit.
   */
  static exportToPDF<T extends Record<string, any>>(data: T[], filename: string): string {
    if (!data || data.length === 0) {
      return '';
    }

    const headers = Object.keys(data[0]);
    let pdfContent = `PDF Export: ${filename}\n\n`;
    pdfContent += `Generated at: ${new Date().toISOString()}\n\n`;
    pdfContent += `Total Records: ${data.length}\n\n`;
    pdfContent += '─'.repeat(80) + '\n\n';

    // Add header row
    pdfContent += headers.map(h => h.padEnd(20)).join(' | ') + '\n';
    pdfContent += '─'.repeat(80) + '\n';

    // Add data rows
    for (const row of data) {
      const values = headers.map(header => {
        const value = row[header];
        if (value === null || value === undefined) {
          return 'N/A'.padEnd(20);
        }
        if (typeof value === 'object') {
          return JSON.stringify(value).substring(0, 17).padEnd(20);
        }
        return String(value).substring(0, 17).padEnd(20);
      });
      pdfContent += values.join(' | ') + '\n';
    }

    return pdfContent;
  }

  /**
   * Exporta para PDF e retorna como Blob
   */
  static exportToPDFBlob<T extends Record<string, any>>(data: T[], filename: string): Blob {
    const pdfContent = this.exportToPDF(data, filename);
    return new Blob([pdfContent], { type: 'text/plain;charset=utf-8;' });
  }

  /**
   * Download PDF
   */
  static downloadPDF<T extends Record<string, any>>(data: T[], filename: string): void {
    const blob = this.exportToPDFBlob(data, filename);
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.txt`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}
