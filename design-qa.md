# Coming-soon design QA — direct contact ordering

Source visual truth: `/workspace/generated_images/exec-e04e4aaa-adc8-400e-a9ca-693b3a84033f.png` (selected option 1), amended by the owner's requests for cursor-driven spinning, removal of the pause button, and neutral ordering copy through email and telephone/WhatsApp.

## Evidence and normalization

- Source and desktop implementation: 1487 × 1058 pixels, same CSS viewport, deviceScaleFactor 1, light theme, Indonesian, settled/reduced-motion state.
- Full-view combined comparison: `/workspace/.outputs/mlm-contact/comparison-final.png` (matching half scale).
- Focused typography/contact comparison: `/workspace/.outputs/mlm-contact/comparison-typography.png` (matching 1:1 crops).
- Production screenshots: `/workspace/.outputs/mlm-contact/production-desktop.png`, `production-tablet.png`, `production-mobile.png`, `production-english.png`.
- Captured from the production bundle through Playwright Chromium. Console errors and uncaught page errors: zero.

## Findings and comparison history

- Earlier headline wrapping, dotted catalog routes, and narrow-screen entrance overflow were corrected and remain covered by passing regressions.
- Earlier cursor refinements fixed live reduced-motion preference updates and petal-tip clipping during diagonal rotation. The rotation envelope and media-query subscription are retained.
- Latest copy refinement removes third-party company references from the public page, metadata, and prefilled contact messages in both languages.
- Added a visible telephone link: 0812-6685-4415 → tel:+6281266854415. Email opens mailto:admin@mitralaboramedika.com; the primary CTA opens the existing WhatsApp number with a neutral ordering inquiry.
- No actionable P0/P1/P2 findings remain.

## Required fidelity surfaces

- Typography: locally bundled Newsreader normal/italic and Plus Jakarta Sans retained; desktop headline hierarchy and copper emphasis preserved.
- Layout: asymmetric split composition, square CTA, language controls, footer, and mobile stacking retained. The additional telephone row intentionally expands the contact group. Desktop, tablet, mobile, and English captures have no horizontal overflow.
- Colors: Mori #F0EBE1, Nila #1E3D63, emphasis #A56B2E. The selected light presentation remains consistent under dark OS preferences.
- Image quality: existing logo and transparent sculptural asset reused. Cursor rotation, safe image clearance, and real image quadrants are retained; no CSS imitation artwork was introduced.
- Copy: neutral company contact text in both languages, including metadata and WhatsApp messages. Footer: “Pemesanan dapat dilakukan melalui email atau telepon.” No licensing discussion or third-party company attribution is displayed.

## Validation and interactions

- Production build and TypeScript compilation passed.
- Final production Chromium suite: 15 passed; four legacy native-checkout/chat scenarios intentionally skipped while ordering is handled by direct contact.
- Browser checks verify Indonesian/English ordering copy, neutral metadata/messages, WhatsApp/email/telephone destinations, continuous full-turn cursor tracking, upright settling, touch behavior, live reduced-motion changes, language switching, keyboard navigation, and guarded native checkout routes.
- Translation and dependency checks passed; lint has no errors. git diff --check passed.
- Existing motion has a one-shot entrance and no perpetual idle animation or pause button. No calls, emails, or WhatsApp messages were sent during verification.

## Follow-up polish and limits

- [P3] The independently animated sculpture has stronger edge lighting and more rotation clearance than the initial still mockup; this is retained from the accepted motion refinement.
- External message delivery and the live hosting rollout are outside the local checks. Contact destinations were verified without contacting anyone.

final result: passed
