import { useTranslations } from 'next-intl';
import { AppConfig } from '@/utils/AppConfig';

export const CenteredFooter = (props: {
  logo: React.ReactNode;
  contact: React.ReactNode;
  children: React.ReactNode;
}) => {
  const t = useTranslations('Footer');

  return (
    <div className="mx-auto max-w-7xl">
      <div className="
        grid gap-10
        md:grid-cols-[1.6fr_1fr_1.2fr]
      "
      >
        <div>
          {props.logo}
          <p className="
            mt-4 max-w-xs font-serif text-xl/snug text-foreground italic
          "
          >
            {t('tagline')}
          </p>
        </div>

        <div>
          <h2 className="
            font-mono text-xs tracking-[0.08em] text-muted-foreground uppercase
          "
          >
            {t('nav_heading')}
          </h2>
          <ul className="
            mt-4 space-y-2.5 text-sm
            [&_a]:transition-colors
            [&_a:hover]:text-muted-foreground
          "
          >
            {props.children}
          </ul>
        </div>

        <div>
          <h2 className="
            font-mono text-xs tracking-[0.08em] text-muted-foreground uppercase
          "
          >
            {t('contact_heading')}
          </h2>
          <ul className="
            mt-4 space-y-2.5 text-sm
            [&_a]:transition-colors
            [&_a:hover]:text-muted-foreground
          "
          >
            {props.contact}
          </ul>
        </div>
      </div>

      <div className="mt-14 border-t pt-5 text-xs text-muted-foreground">
        {t('footer_text', { year: new Date().getFullYear(), name: AppConfig.name })}
      </div>
    </div>
  );
};
