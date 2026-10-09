/** Groups products by category, keeping the order in which categories first appear. Uncategorized products come last. */
export const groupByCategory = <T extends { category: string | null }>(products: T[]) => {
  const groups = new Map<string | null, T[]>();

  for (const product of products) {
    const key = product.category?.trim() || null;
    groups.set(key, [...(groups.get(key) ?? []), product]);
  }

  return [...groups.entries()]
    .map(([category, items]) => ({ category, items }))
    .sort((a, b) => Number(a.category === null) - Number(b.category === null));
};

/** WhatsApp link with a ready-to-send message, used for "ask for a quote". */
export const buildWhatsAppLink = (whatsapp: string, message: string) =>
  `https://wa.me/${whatsapp}?text=${encodeURIComponent(message)}`;
