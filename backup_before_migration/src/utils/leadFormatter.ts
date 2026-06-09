export function formatWhatsApp(value: string): string {
  return value.replace(/\D/g, "");
}

export function validateWhatsApp(value: string): boolean {
  const digits = formatWhatsApp(value);
  return digits.length >= 10 && digits.length <= 13;
}

export function formatName(value: string): string {
  return value.trim().replace(/\s+/g, " ");
}

export function validateName(value: string): boolean {
  return formatName(value).length >= 3;
}
