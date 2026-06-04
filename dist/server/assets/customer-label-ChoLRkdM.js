function getCustomerLabel(customer) {
  return customer?.usuario || customer?.id_comprador || customer?.user_id || customer?.email || customer?.name || customer?.id || "Cliente";
}
function getCustomerInitials(customer) {
  return getCustomerLabel(customer).split(" ").map((part) => part[0]).filter(Boolean).slice(0, 2).join("").toUpperCase();
}
export {
  getCustomerInitials as a,
  getCustomerLabel as g
};
