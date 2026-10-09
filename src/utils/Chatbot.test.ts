import { describe, expect, it } from 'vitest';
import { matchIntent } from './Chatbot';

describe('matchIntent', () => {
  it.each([
    ['Bagaimana cara pesan?', 'order'],
    ['saya mau cek status pesanan', 'track'],
    ['Bisa bayar cicilan?', 'installment'],
    ['Rekening untuk transfer apa?', 'payment'],
    ['berapa ongkir ke Bandung', 'shipping'],
    ['ada katalog produk?', 'catalog'],
    ['nomor whatsapp admin', 'contact'],
    ['Can I pay in installments?', 'installment'],
    ['where is my order', 'track'],
  ])('maps "%s" to %s', (message, expected) => {
    expect(matchIntent(message)).toBe(expected);
  });

  it('returns null for unrelated messages', () => {
    expect(matchIntent('cuaca hari ini')).toBeNull();
    expect(matchIntent('')).toBeNull();
  });

  it('does not match short keywords inside other words', () => {
    expect(matchIntent('awal')).toBeNull(); // contains "wa"
  });
});
