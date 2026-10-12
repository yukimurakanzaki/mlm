import { describe, expect, it } from 'vitest';
import { buildWhatsAppLink, groupByCategory, localizeProduct, summarizeCategories } from './Catalog';

describe('groupByCategory', () => {
  it('keeps first-seen category order and puts uncategorized last', () => {
    const groups = groupByCategory([
      { id: 1, category: null },
      { id: 2, category: 'B' },
      { id: 3, category: 'A' },
      { id: 4, category: 'B' },
    ]);

    expect(groups.map(g => [g.category, g.items.map(i => i.id)])).toEqual([['B', [2, 4]], ['A', [3]], [null, [1]]]);
  });
});

describe('buildWhatsAppLink', () => {
  it('encodes the message', () => {
    expect(buildWhatsAppLink('62812', 'Halo & hai')).toBe('https://wa.me/62812?text=Halo%20%26%20hai');
  });
});

describe('localizeProduct', () => {
  const product = {
    name: 'Kursi',
    description: 'Kursi kayu',
    category: 'Furnitur',
    packaging: 'Dus',
    unit: 'Buah',
    nameEn: 'Chair',
    descriptionEn: 'Wooden chair',
    categoryEn: 'Furniture',
    packagingEn: 'Box',
    unitEn: 'Piece',
  };

  it('returns English values on the en site', () => {
    expect(localizeProduct(product, 'en')).toEqual({
      ...product,
      name: 'Chair',
      description: 'Wooden chair',
      category: 'Furniture',
      packaging: 'Box',
      unit: 'Piece',
    });
  });

  it('falls back to Indonesian for null or blank English values', () => {
    const localized = localizeProduct({ ...product, nameEn: null, descriptionEn: '   ', categoryEn: '', packagingEn: null, unitEn: ' ' }, 'en');

    expect(localized).toMatchObject({ name: 'Kursi', description: 'Kursi kayu', category: 'Furnitur', packaging: 'Dus', unit: 'Buah' });
  });

  it('returns the same object on the Indonesian site', () => {
    expect(localizeProduct(product, 'id')).toBe(product);
  });
});

describe('summarizeCategories', () => {
  const base = { description: '', packaging: null, unit: null, descriptionEn: null, packagingEn: null, unitEn: null };
  const products = [
    { ...base, name: 'Kantong darah', nameEn: 'Blood bag', category: 'Donor Darah', categoryEn: 'Blood Donation' },
    { ...base, name: 'Timbangan', nameEn: null, category: 'Donor Darah', categoryEn: 'Blood Donation' },
    { ...base, name: 'Lain', nameEn: null, category: null, categoryEn: null },
  ];

  it('skips uncategorized products and keys categories by their Indonesian name', () => {
    expect(summarizeCategories(products, 'id')).toEqual([
      { key: 'Donor Darah', label: 'Donor Darah', anchor: 'donor-darah', count: 2, names: ['Kantong darah', 'Timbangan'] },
    ]);
  });

  it('uses English labels and names on /en, keeping the Indonesian key and anchor', () => {
    expect(summarizeCategories(products, 'en')).toEqual([
      { key: 'Donor Darah', label: 'Blood Donation', anchor: 'donor-darah', count: 2, names: ['Blood bag', 'Timbangan'] },
    ]);
  });
});
