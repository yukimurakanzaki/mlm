import { setRequestLocale } from 'next-intl/server';
import { ChatWidget } from '@/features/chat/ChatWidget';
import { Footer } from '@/templates/Footer';
import { Navbar } from '@/templates/Navbar';
import { AppConfig } from '@/utils/AppConfig';

export default async function MarketingLayout(props: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;
  setRequestLocale(locale);

  if (AppConfig.comingSoon) {
    return props.children;
  }

  return (
    <>
      <Navbar locale={locale} />
      {props.children}
      <Footer />
      <ChatWidget />
    </>
  );
}
