// Rule-based FAQ matcher for the website chatbot. It is deliberately simple and deterministic:
// it needs no API key and cannot invent answers. The answers live in the locale files (`Chat.answer_*`).
// To upgrade to an LLM later, replace `matchIntent` in `src/app/api/chat/route.ts`.

export type ChatIntent = 'order' | 'track' | 'payment' | 'installment' | 'shipping' | 'catalog' | 'contact';

const KEYWORDS: Record<ChatIntent, string[]> = {
  installment: ['cicil', 'angsur', 'installment', 'tenor', 'kredit'],
  payment: ['bayar', 'pembayaran', 'payment', 'transfer', 'rekening', 'pay'],
  track: ['lacak', 'cek pesanan', 'pesanan saya', 'status', 'track', 'resi', 'kode pesanan', 'order code', 'my order', 'where is'],
  shipping: ['kirim', 'pengiriman', 'ongkir', 'shipping', 'delivery', 'sampai'],
  order: ['pesan', 'beli', 'order', 'buy', 'checkout'],
  catalog: ['katalog', 'produk', 'harga', 'catalog', 'product', 'price', 'stok', 'stock'],
  contact: ['kontak', 'hubungi', 'admin', 'whatsapp', 'wa', 'contact', 'telepon', 'cs'],
};

// More specific intents first, so "bayar cicilan" resolves to installment rather than payment.
const PRIORITY: ChatIntent[] = ['installment', 'payment', 'track', 'shipping', 'order', 'catalog', 'contact'];

const tokenize = (text: string) => text.toLowerCase().normalize('NFKD').replace(/[^a-z0-9\s]/g, ' ');

/** Returns the best matching intent for a user message, or `null` when nothing matches. */
export const matchIntent = (message: string): ChatIntent | null => {
  const text = ` ${tokenize(message).replace(/\s+/g, ' ')} `;

  for (const intent of PRIORITY) {
    if (KEYWORDS[intent].some(keyword => text.includes(` ${keyword}`) || (keyword.length > 3 && text.includes(keyword)))) {
      return intent;
    }
  }

  return null;
};
