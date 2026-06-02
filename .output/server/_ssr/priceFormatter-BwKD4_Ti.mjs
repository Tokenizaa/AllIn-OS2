const formatPrice = (price) => {
  if (!price) {
    return null;
  }
  const priceString = String(price).replace(/[^\d,.]/g, "");
  const lastCommaIndex = priceString.lastIndexOf(",");
  const lastDotIndex = priceString.lastIndexOf(".");
  let sanitizedPriceString;
  if (lastCommaIndex > lastDotIndex) {
    sanitizedPriceString = priceString.replace(/\./g, "").replace(",", ".");
  } else {
    sanitizedPriceString = priceString.replace(/,/g, "");
  }
  const numericPrice = parseFloat(sanitizedPriceString);
  if (isNaN(numericPrice) || numericPrice <= 0) {
    return null;
  }
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(numericPrice);
};
export {
  formatPrice as f
};
