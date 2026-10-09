import { describe, expect, it } from 'vitest';
import { buildWhatsAppLink, groupByCategory } from './Catalog';

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
