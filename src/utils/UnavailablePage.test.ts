import { describe, expect, it } from 'vitest';
import { buildUnavailableHtml } from './UnavailablePage';

describe('buildUnavailableHtml', () => {
  it('uses Indonesian by default and English under /en', () => {
    expect(buildUnavailableHtml('/dashboard')).toContain('Layanan sedang bermasalah');
    expect(buildUnavailableHtml('/en/dashboard')).toContain('Something went wrong');
    expect(buildUnavailableHtml('/english-page')).toContain('Layanan sedang bermasalah');
  });

  it('links to WhatsApp support', () => {
    expect(buildUnavailableHtml('/')).toContain('https://wa.me/');
  });
});
