export function getCustomerLabel(customer: any): string {
  const fullName =
    customer?.nome_completo ||
    customer?.full_name ||
    customer?.name ||
    customer?.display_name ||
    [customer?.first_name, customer?.last_name].filter(Boolean).join(" ").trim();

  return (
    fullName ||
    customer?.usuario ||
    customer?.id_comprador ||
    customer?.email ||
    customer?.user_id ||
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
