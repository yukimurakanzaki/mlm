type ProductImportRow = {
  sku: string;
  name: string;
  category: string | null;
  brand: string | null;
  packaging: string | null;
  unit: string | null;
  description: string;
  priceIdr: number | null;
  showPrice: boolean;
  isActive: boolean;
};

type ProductImportError = { row: number; field: string };

/** Minimal CSV reader: quoted fields, escaped quotes, CRLF, and either `,` or `;` (Excel in Indonesia exports `;`). */
export const parseCsv = (text: string): string[][] => {
  const source = text.replace(/^\uFEFF/, '');
  const firstLine = source.split(/\r?\n/, 1)[0] ?? '';
  const delimiter = (firstLine.match(/;/g)?.length ?? 0) > (firstLine.match(/,/g)?.length ?? 0) ? ';' : ',';
  const rows: string[][] = [];
  let row: string[] = [];
  let field = '';
  let quoted = false;

  for (let i = 0; i < source.length; i++) {
    const char = source[i]!;

    if (quoted) {
      if (char === '"' && source[i + 1] === '"') {
        field += '"';
        i++;
      } else if (char === '"') {
        quoted = false;
      } else {
        field += char;
      }
    } else if (char === '"') {
      quoted = true;
    } else if (char === delimiter) {
      row.push(field);
      field = '';
    } else if (char === '\n' || char === '\r') {
      if (char === '\r' && source[i + 1] === '\n') {
        i++;
      }

      row.push(field);
      rows.push(row);
      row = [];
      field = '';
    } else {
      field += char;
    }
  }

  if (field !== '' || row.length > 0) {
    row.push(field);
    rows.push(row);
  }

  return rows.filter(r => r.some(cell => cell.trim() !== ''));
};

const parseBoolean = (value: string, truthy: string[], falsy: string[]) => {
  const v = value.trim().toLowerCase();

  if (v === '') {
    return undefined;
  }

  if (truthy.includes(v)) {
    return true;
  }

  return falsy.includes(v) ? false : null;
};

const parsePrice = (value: string) => {
  const raw = value.trim();

  if (raw === '' || raw === '-') {
    return { price: null };
  }

  const digits = raw.replace(/\D/g, '');

  return digits === '' ? { price: null, invalid: true } : { price: Number(digits) };
};

const optional = (value: string | undefined) => {
  const v = (value ?? '').trim();

  return v === '' || v === '-' ? null : v;
};

/**
 * Turns a catalog sheet into product rows. Columns (by header name):
 * sku, nama_produk, kategori, merek, kemasan, satuan, deskripsi_singkat, harga_jual, tampilkan_harga (Ya/Tidak), status (aktif/draft).
 * Invalid rows are skipped and reported by row number (the header is row 1).
 */
export const parseProductCsv = (text: string) => {
  const [header, ...body] = parseCsv(text);
  const rows: ProductImportRow[] = [];
  const errors: ProductImportError[] = [];

  if (!header) {
    return { rows, errors: [{ row: 1, field: 'file' }] };
  }

  const columns = header.map(h => h.trim().toLowerCase());
  const missing = ['sku', 'nama_produk'].filter(name => !columns.includes(name));

  if (missing.length > 0) {
    return { rows, errors: missing.map(field => ({ row: 1, field })) };
  }

  const seen = new Set<string>();

  body.forEach((cells, index) => {
    const rowNo = index + 2;
    const get = (name: string) => cells[columns.indexOf(name)] ?? '';
    const sku = get('sku').trim();
    const name = get('nama_produk').trim();
    const price = parsePrice(get('harga_jual'));
    const showPrice = parseBoolean(get('tampilkan_harga'), ['ya', 'yes', 'y', 'true', '1'], ['tidak', 'no', 'n', 'false', '0']);
    const active = parseBoolean(get('status'), ['aktif', 'active'], ['draft', 'nonaktif', 'inactive', 'arsip']);
    const rowErrors: string[] = [];

    if (!sku) {
      rowErrors.push('sku');
    } else if (seen.has(sku.toLowerCase())) {
      rowErrors.push('sku_duplicate');
    }

    if (name.length < 2) {
      rowErrors.push('nama_produk');
    }

    if (price.invalid) {
      rowErrors.push('harga_jual');
    }

    if (showPrice === null) {
      rowErrors.push('tampilkan_harga');
    }

    if (active === null) {
      rowErrors.push('status');
    }

    if (rowErrors.length > 0) {
      errors.push(...rowErrors.map(field => ({ row: rowNo, field })));

      return;
    }

    seen.add(sku.toLowerCase());
    rows.push({
      sku,
      name,
      category: optional(get('kategori')),
      brand: optional(get('merek')),
      packaging: optional(get('kemasan')),
      unit: optional(get('satuan')),
      description: get('deskripsi_singkat').trim(),
      priceIdr: price.price,
      // A price that is blank can never be shown, whatever the sheet says
      showPrice: (showPrice ?? true) && price.price !== null,
      isActive: active ?? true,
    });
  });

  return { rows, errors };
};
