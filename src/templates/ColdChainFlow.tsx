import { useTranslations } from 'next-intl';
import { Reveal } from '@/features/landing/Reveal';
import { ScrollLine } from '@/features/landing/ScrollLine';
import { Link } from '@/libs/I18nNavigation';

type CategorySummary = { key: string; anchor: string; count: number; names: string[] };

// Stages a blood unit passes through, mapped to catalog categories by their Indonesian name.
const STAGES = [
  { id: 'donor', categories: ['Donor Darah'] },
  { id: 'processing', categories: ['Pengolahan Komponen Darah'] },
  { id: 'storage', categories: ['Penyimpanan Komponen Darah'] },
  { id: 'crossmatch', categories: ['Instrumen Golongan Darah & Crossmatch', 'Reagen Gel Card', 'Reagen Larutan & Skrining Antibodi'] },
] as const;

const NAMES_PER_STAGE = 3;

export const ColdChainFlow = (props: { categories: CategorySummary[] }) => {
  const t = useTranslations('ColdChain');
  const tc = useTranslations('Categories');

  const stages = STAGES.map((stage) => {
    const matches = props.categories.filter(c => (stage.categories as readonly string[]).includes(c.key));

    return {
      id: stage.id,
      anchor: matches[0]?.anchor,
      count: matches.reduce((sum, c) => sum + c.count, 0),
      names: matches.flatMap(c => c.names).slice(0, NAMES_PER_STAGE),
    };
  });

  return (
    <section className="px-4 py-24">
      <div className="mx-auto max-w-7xl">
        <Reveal className="max-w-2xl">
          <div className="
            font-mono text-xs tracking-[0.08em] text-muted-foreground uppercase
          "
          >
            {t('eyebrow')}
          </div>
          <h2 className="
            mt-3 pb-1 font-serif text-3xl/[1.1] tracking-tight
            md:text-5xl/[1.1]
          "
          >
            {t.rich('title', {
              important: chunks => <span className="text-emphasis italic">{chunks}</span>,
            })}
          </h2>
          <p className="mt-4 max-w-[52ch] text-lg/relaxed text-muted-foreground">{t('description')}</p>
        </Reveal>

        <div className="
          mt-14 rounded-lg border bg-secondary/60 p-5
          md:p-8
        "
        >
          <ol className="
            relative grid gap-8
            lg:grid-cols-4 lg:gap-6
          "
          >
            <ScrollLine
              axis="x"
              className="
                inset-x-3 top-3 h-px
                max-lg:hidden
              "
            />
            <ScrollLine
              axis="y"
              className="
                inset-y-3 left-3 w-px
                lg:hidden
              "
            />

            {stages.map(stage => (
              <li
                key={stage.id}
                className="
                  relative pl-11
                  lg:pt-11 lg:pl-0
                "
              >
                <span
                  className="
                    absolute top-0 left-0 size-6 rounded-full border-2
                    border-primary bg-card
                  "
                  aria-hidden="true"
                />

                <div className="h-full rounded-lg border bg-card p-5">
                  {stage.count > 0 && (
                    <div className="font-mono text-xs text-muted-foreground">
                      {tc('product_count', { count: stage.count })}
                    </div>
                  )}
                  <h3 className="mt-1 font-serif text-2xl">
                    {stage.anchor
                      ? (
                          <Link
                            href={`/catalog#${stage.anchor}`}
                            className="
                              underline-offset-4
                              hover:underline hover:decoration-primary
                            "
                          >
                            {t(`${stage.id}_title`)}
                          </Link>
                        )
                      : t(`${stage.id}_title`)}
                  </h3>
                  <p className="mt-2 text-sm/relaxed text-muted-foreground">{t(`${stage.id}_description`)}</p>

                  {stage.names.length > 0 && (
                    <ul className="mt-4 flex flex-wrap gap-1.5">
                      {stage.names.map(name => (
                        <li
                          key={name}
                          className="
                            rounded-full border bg-background px-2.5 py-1
                            text-xs
                          "
                        >
                          {name}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
};
