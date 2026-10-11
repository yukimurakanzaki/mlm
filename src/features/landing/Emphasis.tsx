/** Rich-text renderer for `<important>` in headlines: Newsreader italic in Sogan, per the Kawung type rules. */
export const emphasis = (chunks: React.ReactNode) => (
  <span className="font-serif font-light text-emphasis italic">{chunks}</span>
);
