import { getTranslations } from 'next-intl/server';
import { NextResponse } from 'next/server';
import * as z from 'zod';
import { routing } from '@/libs/I18nRouting';
import { AppConfig } from '@/utils/AppConfig';
import { matchIntent } from '@/utils/Chatbot';

const body = z.object({
  message: z.string().trim().min(1).max(500),
  locale: z.string().max(5).default(routing.defaultLocale),
});

export async function POST(request: Request) {
  const parsed = body.safeParse(await request.json().catch(() => null));

  if (!parsed.success) {
    return NextResponse.json({ error: 'invalid_request' }, { status: 400 });
  }

  const locale = (routing.locales as readonly string[]).includes(parsed.data.locale)
    ? parsed.data.locale
    : routing.defaultLocale;
  const t = await getTranslations({ locale, namespace: 'Chat' });
  const intent = matchIntent(parsed.data.message);

  const answer = intent
    ? t(`answer_${intent}`, { whatsapp: `https://wa.me/${AppConfig.contact.whatsapp}`, email: AppConfig.contact.email })
    : t('answer_fallback', { whatsapp: `https://wa.me/${AppConfig.contact.whatsapp}` });

  return NextResponse.json({ answer });
}
