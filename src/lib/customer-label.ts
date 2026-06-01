export function getCustomerLabel(customer: any): string {
  return (
    customer?.usuario ||
    customer?.id_comprador ||
    customer?.user_id ||
    customer?.email ||
    customer?.name ||
    customer?.id ||
    "Cliente"
  );
}

export function getCustomerInitials(customer: any): string {
  return getCustomerLabel(customer)
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}
