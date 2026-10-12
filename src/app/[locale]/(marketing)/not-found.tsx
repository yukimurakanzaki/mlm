import { getTranslations } from 'next-intl/server';
import { KawungMark } from '@/components/KawungMark';
import { buttonVariants } from '@/components/ui/buttonVariants';
import { Link } from '@/libs/I18nNavigation';

// Shown for notFound() inside the marketing pages (e.g. an unknown product slug), with the navbar and footer
export default async function NotFound() {
  const t = await getTranslations('NotFound');
  const th = await getTranslations('Hero');

  return (
    <div className="px-4 pt-20 pb-24">
      <div className="mx-auto flex max-w-3xl flex-col items-start gap-6">
        <KawungMark className="size-12" />
        <h1 className="
          text-4xl font-bold tracking-tight
          md:text-5xl
        "
        >
          {t('title')}
        </h1>
        <p className="text-lg text-muted-foreground">{t('description')}</p>
        <Link className={buttonVariants({ size: 'lg' })} href="/catalog">{th('primary_button')}</Link>
      </div>
    </div>
  );
}
