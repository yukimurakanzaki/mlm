import { useTranslations } from 'next-intl';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Section } from '@/features/landing/Section';

const ITEMS = ['1', '2', '3', '4'] as const;

export const FAQ = () => {
  const t = useTranslations('FAQ');

  return (
    <Section title={t('title')}>
      <div id="faq" className="scroll-mt-8">
        <Accordion type="multiple" className="w-full">
          {ITEMS.map(item => (
            <AccordionItem key={item} value={`item-${item}`}>
              <AccordionTrigger>{t(`question${item}`)}</AccordionTrigger>
              <AccordionContent>{t(`answer${item}`)}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </Section>
  );
};
