import { slugify } from './Orders';

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

type Localizable = {
  name: string;
  description: string;
  category: string | null;
  packaging: string | null;
  unit: string | null;
  nameEn: string | null;
  descriptionEn: string | null;
  categoryEn: string | null;
  packagingEn: string | null;
  unitEn: string | null;
};

/** On the English site, swaps in each English field that is filled in; blank ones fall back to Indonesian. */
export const localizeProduct = <T extends Localizable>(product: T, locale: string): T =>
  locale !== 'en'
    ? product
    : {
        ...product,
        name: product.nameEn?.trim() || product.name,
        description: product.descriptionEn?.trim() || product.description,
        category: product.categoryEn?.trim() || product.category,
        packaging: product.packagingEn?.trim() || product.packaging,
        unit: product.unitEn?.trim() || product.unit,
      };

/**
 * Per-category overview. `key` is the Indonesian category and `anchor` its slug, both the same in every locale,
 * so `/catalog?category=<anchor>` survives a language switch. `label` and `names` follow the page's language.
 */
export const summarizeCategories = <T extends Localizable>(products: T[], locale: string) =>
  groupByCategory(products).flatMap(({ category, items }) => {
    if (category === null) {
      return [];
    }

    const localized = items.map(p => localizeProduct(p, locale));
    const label = localized[0]?.category?.trim() || category;

    return [{ key: category, label, anchor: slugify(category), count: items.length, names: localized.map(p => p.name) }];
  });
