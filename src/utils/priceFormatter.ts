export function formatPrice(value: string | number | undefined | null): string {
  if (value === undefined || value === null) return "R$ 0,00";
  const num = typeof value === "string" ? parseFloat(value.replace(/[R$\s,.]/g, "")) / 100 : Number(value);
  if (isNaN(num)) return "R$ 0,00";
  return num.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function formatCurrency(value: string | number | undefined | null): string {
  return formatPrice(value);
}
