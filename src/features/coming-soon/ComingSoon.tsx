'use client';

/* eslint better-tailwindcss/no-unknown-classes: ["error", { "ignore": ["^coming-soon(?:-|$)"] }] -- These component classes are defined in src/styles/coming-soon.css. */

import { ArrowRightIcon, EnvelopeClosedIcon, PauseIcon, PlayIcon } from '@radix-ui/react-icons';
import { useLocale, useTranslations } from 'next-intl';
import Image from 'next/image';
import { useState } from 'react';
import { Link } from '@/libs/I18nNavigation';
import { AppConfig } from '@/utils/AppConfig';

const petals = ['coming-soon-petal--north-west', 'coming-soon-petal--north-east', 'coming-soon-petal--south-west', 'coming-soon-petal--south-east'] as const;

export const ComingSoon = () => {
  const t = useTranslations('ComingSoon');
  const locale = useLocale();
  const [paused, setPaused] = useState(false);
  const contactUrl = `https://wa.me/${AppConfig.contact.whatsapp}?text=${encodeURIComponent(t('contact_message'))}`;

  return (
    <div className="coming-soon" data-motion={paused ? 'paused' : 'playing'}>
      <a className="coming-soon-skip" href="#main">{t('skip')}</a>

      <header className="coming-soon-header">
        <Link href="/" className="coming-soon-brand" aria-label={AppConfig.name}>
          <Image src="/icon.svg" width={60} height={60} alt="" />
          <span>PT Mitra Labora Medika</span>
        </Link>

        <nav className="coming-soon-nav" aria-label={t('navigation')}>
          <div className="coming-soon-languages" aria-label={t('language')}>
            <Link href="/" locale="id" lang="id" hrefLang="id" aria-label="Bahasa Indonesia" aria-current={locale === 'id' ? 'page' : undefined}>ID</Link>
            <Link href="/" locale="en" lang="en" hrefLang="en" aria-label="English" aria-current={locale === 'en' ? 'page' : undefined}>EN</Link>
          </div>
          <a className="coming-soon-header-contact" href={contactUrl} target="_blank" rel="noopener noreferrer">{t('header_contact')}</a>
        </nav>
      </header>

      <main id="main" className="coming-soon-main" tabIndex={-1}>
        <div className="coming-soon-copy">
          <p className="coming-soon-eyebrow">{t('eyebrow')}</p>
          <h1>
            <span>{t('title_first')}</span>
            <span>{t('title_second')}</span>
            <em>{t('title_emphasis')}</em>
          </h1>
          <p className="coming-soon-description">{t('description')}</p>
          <div className="coming-soon-contact">
            <a className="coming-soon-button" href={contactUrl} target="_blank" rel="noopener noreferrer">
              {t('contact')}
              <ArrowRightIcon width={28} height={28} aria-hidden="true" />
            </a>
            <a className="coming-soon-email" href={`mailto:${AppConfig.contact.email}`}>
              <EnvelopeClosedIcon width={21} height={21} aria-hidden="true" />
              <span>{AppConfig.contact.email}</span>
            </a>
          </div>
        </div>

        <div className="coming-soon-artwork">
          <div className="coming-soon-kawung" aria-hidden="true">
            {petals.map((petal, index) => (
              <div
                key={petal}
                className={`
                  coming-soon-petal
                  ${petal}
                `}
              >
                <Image
                  src="/images/coming-soon-kawung.png"
                  width={1254}
                  height={1254}
                  alt=""
                  priority={index === 0}
                  sizes="(max-width: 700px) 90vw, 50vw"
                />
              </div>
            ))}
          </div>
          <button
            className="coming-soon-motion"
            type="button"
            aria-pressed={paused}
            onClick={() => setPaused(value => !value)}
          >
            {paused ? <PlayIcon aria-hidden="true" /> : <PauseIcon aria-hidden="true" />}
            {paused ? t('resume_motion') : t('pause_motion')}
          </button>
        </div>
      </main>

      <footer className="coming-soon-footer">
        <div>
          <p className="coming-soon-tagline">{t('tagline')}</p>
          <p className="coming-soon-location">{t('location')}</p>
        </div>
        <p className="coming-soon-status">{t('status')}</p>
      </footer>
    </div>
  );
};
