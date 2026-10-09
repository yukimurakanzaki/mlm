import { describe, expect, it } from 'vitest';
import { parseCsv, parseProductCsv } from './ProductImport';

const HEADER = 'sku,nama_produk,kategori,merek,kemasan,satuan,deskripsi_singkat,harga_jual,tampilkan_harga,status';

describe('parseCsv', () => {
  it('handles quoted commas, escaped quotes and CRLF', () => {
    expect(parseCsv('a,b\r\n"x, y","say ""hi"""\r\n')).toEqual([['a', 'b'], ['x, y', 'say "hi"']]);
  });

  it('detects semicolon-separated files and strips the BOM', () => {
    expect(parseCsv('﻿a;b\n1;2')).toEqual([['a', 'b'], ['1', '2']]);
  });
});

describe('parseProductCsv', () => {
  it('parses a full row', () => {
    const { rows, errors } = parseProductCsv(`${HEADER}\nRCFP,RedCell Forward,Reagen Gel Card,RedCell,Gel card (1 box),Box,"Gel card, ABO",2886000,Ya,aktif`);

    expect(errors).toEqual([]);
    expect(rows).toEqual([{
      sku: 'RCFP',
      name: 'RedCell Forward',
      category: 'Reagen Gel Card',
      brand: 'RedCell',
      packaging: 'Gel card (1 box)',
      unit: 'Box',
      description: 'Gel card, ABO',
      priceIdr: 2886000,
      showPrice: true,
      isActive: true,
    }]);
  });

  it('hides the price when the sheet says Tidak, or when it is blank', () => {
    const { rows } = parseProductCsv(`${HEADER}\nA1,Alat,Instrumen,-,1 unit,Unit,x,49950000,Tidak,aktif\nA2,Reagen,Larutan,-,Botol,Botol,x,,Ya,aktif`);

    expect(rows.map(r => [r.priceIdr, r.showPrice])).toEqual([[49950000, false], [null, false]]);
  });

  it('treats draft as inactive and accepts formatted prices', () => {
    const { rows } = parseProductCsv(`${HEADER}\nA1,Larutan,Larutan,-,Botol,Botol,x,"Rp 430.000",Ya,draft`);

    expect(rows[0]).toMatchObject({ priceIdr: 430000, isActive: false });
  });

  it('skips bad rows and reports them by row number', () => {
    const { rows, errors } = parseProductCsv(`${HEADER}\n,No sku,,,,,,1000,Ya,aktif\nA1,Ok,,,,,,1000,Mungkin,aktif\nA2,Fine,,,,,,1000,Ya,aktif\nA2,Dup,,,,,,1000,Ya,aktif`);

    expect(rows.map(r => r.sku)).toEqual(['A2']);
    expect(errors).toEqual([
      { row: 2, field: 'sku' },
      { row: 3, field: 'tampilkan_harga' },
      { row: 5, field: 'sku_duplicate' },
    ]);
  });

  it('requires the sku and nama_produk columns', () => {
    expect(parseProductCsv('foo,bar\n1,2').errors).toEqual([{ row: 1, field: 'sku' }, { row: 1, field: 'nama_produk' }]);
  });
});
