import { AppConfig } from '@/utils/AppConfig';

export const UNAVAILABLE_COPY = {
  id: {
    title: 'Layanan sedang bermasalah',
    body: 'Mohon maaf, halaman ini belum bisa dibuka. Silakan coba lagi sebentar lagi.',
    home: 'Kembali ke beranda',
    help: 'Butuh bantuan? Hubungi kami lewat WhatsApp',
  },
  en: {
    title: 'Something went wrong',
    body: 'Sorry, this page cannot be opened right now. Please try again in a moment.',
    home: 'Back to home',
    help: 'Need help? Contact us on WhatsApp',
  },
} as const;

/** Self-contained friendly page for when a dependency (e.g. the login provider) fails before the app can render. */
export const buildUnavailableHtml = (pathname: string) => {
  const locale = /^\/en(?:\/|$)/.test(pathname) ? 'en' : 'id';
  const text = UNAVAILABLE_COPY[locale];
  const home = locale === 'en' ? '/en' : '/';

  return `<!doctype html><html lang="${locale}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>${text.title} | ${AppConfig.name}</title><style>body{font-family:system-ui,sans-serif;margin:0;min-height:100vh;display:grid;place-items:center;padding:16px;text-align:center;color:#111}main{max-width:28rem}a.b{display:inline-block;margin:16px 0;padding:10px 18px;border-radius:8px;background:#111;color:#fff;text-decoration:none}p{line-height:1.5}</style></head><body><main><h1>${text.title}</h1><p>${text.body}</p><a class="b" href="${home}">${text.home}</a><p><a href="https://wa.me/${AppConfig.contact.whatsapp}">${text.help}</a></p></main></body></html>`;
};
