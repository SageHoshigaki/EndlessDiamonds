export const categories = {
  watches: "Watches",
  diamonds: "Diamonds",
  "fine-jewelry": "Fine jewelry",
};
export function filterCatalog(
  items,
  {
    category = "all",
    query = "",
    brand = "all",
    status = "all",
    sort = "featured",
  } = {},
) {
  const term = query.trim().toLowerCase();
  const result = items.filter(
    (p) =>
      (category === "all" || p.category === category) &&
      (brand === "all" || p.brand === brand) &&
      (status === "all" || p.status === status) &&
      `${p.brand} ${p.model} ${p.reference || ""} ${p.category}`
        .toLowerCase()
        .includes(term),
  );
  return sort === "az"
    ? result.sort((a, b) =>
        `${a.brand} ${a.model}`.localeCompare(`${b.brand} ${b.model}`),
      )
    : result;
}
export function whatsappLink(number, message) {
  const raw = (number || "").trim();
  if (!/^\+?[1-9][\d ()-]*$/.test(raw)) return null;
  const digits = raw.replace(/\D/g, "");
  return /^[1-9]\d{7,14}$/.test(digits)
    ? `https://wa.me/${digits}?text=${encodeURIComponent(message)}`
    : null;
}
export function productMessage(p, url) {
  return `Hello Express Diamonds, I’m interested in ${p.model}${p.reference ? ` (Ref. ${p.reference})` : ""}. Please confirm availability, exact details, condition and price. ${url}`;
}
