/**
 * Parser para dados não estruturados de produtos
 * Formato de entrada: "Código: XXXDescrição: XXXQuant: XValor: XXX.XX"
 */

export interface ParsedProduct {
  code: string;
  name: string;
  quantity: number;
  unitPrice: number;
}

/**
 * Extrai dados de produto de texto não estruturado
 */
export function parseProductInfo(infoText: string): ParsedProduct | null {
  if (!infoText || typeof infoText !== "string") {
    return null;
  }

  // Padrão regex para extrair os campos
  // Código: 336Descrição: SPORT BALANCE NUDEQuant: 1Valor: 299.00
  const pattern = /Código:\s*(\d+)Descrição:\s*(.+?)Quant:\s*(\d+)Valor:\s*([\d.]+)/;
  const match = infoText.match(pattern);

  if (!match) {
    console.warn("Failed to parse product info:", infoText);
    return null;
  }

  return {
    code: match[1],
    name: match[2].trim(),
    quantity: parseInt(match[3], 10),
    unitPrice: parseFloat(match[4]),
  };
}

/**
 * Parse múltiplos produtos de uma string (separados por quebra de linha ou outro delimitador)
 */
export function parseMultipleProducts(infoText: string): ParsedProduct[] {
  if (!infoText) {
    return [];
  }

  // Tentar separar por quebra de linha ou outro delimitador comum
  const items = infoText.split(/[\n;|]/).filter(item => item.trim());

  const products: ParsedProduct[] = [];
  for (const item of items) {
    const parsed = parseProductInfo(item.trim());
    if (parsed) {
      products.push(parsed);
    }
  }

  return products;
}

/**
 * Calcula o preço total de um produto (quantidade * preço unitário)
 */
export function calculateProductTotal(product: ParsedProduct): number {
  return product.quantity * product.unitPrice;
}

/**
 * Formata dados de produto para exibição
 */
export function formatProductForDisplay(product: ParsedProduct): string {
  return `${product.code} - ${product.name} (x${product.quantity})`;
}
