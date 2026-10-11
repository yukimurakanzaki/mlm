import { useTranslations } from 'next-intl';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { AppConfig } from '@/utils/AppConfig';

const ITEMS = ['1', '2', '3', '4'] as const;

export const FAQ = () => {
  const t = useTranslations('FAQ');

  return (
    <section id="faq" className="scroll-mt-16 px-4 py-24">
      <div className="
        mx-auto grid max-w-7xl gap-10
        lg:grid-cols-[1fr_1.6fr] lg:gap-16
      "
      >
        <h2 className="
          text-3xl font-bold tracking-tight
          md:text-5xl
          lg:sticky lg:top-24 lg:self-start
        "
        >
          {t('title')}
        </h2>

        <Accordion type="multiple" className="w-full border-t">
          {ITEMS.map(item => (
            <AccordionItem key={item} value={`item-${item}`}>
              <AccordionTrigger className="py-5 text-base font-semibold">{t(`question${item}`)}</AccordionTrigger>
              <AccordionContent className="
                max-w-[60ch] text-sm/relaxed text-muted-foreground
              "
              >
                {t(`answer${item}`, { whatsapp: AppConfig.contact.whatsappDisplay, email: AppConfig.contact.email })}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};
