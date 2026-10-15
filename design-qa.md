# Coming-soon design QA — soft daylight background

Source visual truth: `/workspace/generated_images/exec-01ecf792-99e5-4931-9f10-fdb74f280442.png`, the first displayed background concept selected by the owner. Scope: apply its warm architectural daylight background while preserving the accepted foreground layout, contact copy/links, and cursor-driven Kawung motion.

## Evidence and normalization

- Source and desktop implementation: 1487 × 1058 pixels, same CSS viewport, deviceScaleFactor 1, light theme, Indonesian, settled/reduced-motion state.
- Full-view combined comparison: `/workspace/.outputs/mlm-daylight/comparison-final.png` (both images at matching half scale).
- Focused typography/contact comparison: `/workspace/.outputs/mlm-daylight/comparison-typography.png` (matching 1:1 crops).
- Final production captures: `/workspace/.outputs/mlm-daylight/production-desktop.png`, `production-tablet.png`, `production-mobile.png`, `production-english.png`. Full-size desktop and mobile captures were also inspected for small-label readability.
- Earlier contrast evidence: `/workspace/.outputs/mlm-daylight/desktop-before-contrast.png`.
- Playwright Chromium captured the production bundle. Console errors and uncaught page errors: zero.

## Findings and comparison history

- [P2, fixed] The original secondary label colors lost contrast over darker areas of the new window/floor shadows. Changed navigation/footer secondary text to #3D4F68, preserving the brand's navy family. Original sampled footer background contrast was approximately 3.3:1; the revised color exceeds 4.5:1 over the sampled footer background region. Rebuilt, recaptured, and inspected the final combined and full-size evidence after the correction.
- Existing headline wrapping, dotted catalog routes, narrow-screen overflow, reduced-motion preference updates, and rotation clipping fixes remain intact and covered by passing browser regressions.
- No actionable P0/P1/P2 findings remain.

## Required fidelity surfaces

- Typography: existing locally bundled Newsreader and Plus Jakarta Sans retained, including the three-line display hierarchy, copper italic emphasis, and readable contact text.
- Layout: foreground dimensions, contact rows, header, footer, and mobile stacking unchanged. Background uses cover cropping across the full page; desktop, tablet, mobile, and English views show no horizontal overflow.
- Colors: warm cream photographic background, navy text, copper accent, and a slightly darker secondary label tone. Cream #F0EBE1 remains the loading fallback. Dark OS preference preserves the selected light appearance.
- Image fidelity: a separate photographic background was generated from the selected mockup and inspected with no text, logos, sculpture, or identifiable sculpture shadow baked into it. Optimized asset: `public/images/coming-soon-daylight.webp`, 1487 × 1058, 23,054 bytes. The four-petal image remains independent and cursor-responsive. No CSS-generated imitation of the imagery was introduced.
- Copy/content: existing neutral Indonesian/English ordering copy, metadata, WhatsApp inquiry, email, and telephone links preserved. No third-party company or licensing text reintroduced.

## Validation and interactions

- Production build and TypeScript compilation passed.
- Final production Chromium suite: 15 passed; four legacy native-checkout/chat scenarios intentionally skipped while ordering is through direct contact.
- Browser checks cover WhatsApp/email/telephone destinations, both languages and neutral contact messages, continuous full-turn rotation and settling, touch behavior, live reduced-motion changes, keyboard access, responsive width, and guarded checkout routes.
- Background returned HTTP 200, 23,054 bytes; downloaded bytes matched the committed source asset exactly.
- CSS lint and git diff --check passed. No new dependencies or application behavior changes.
- No calls, emails, or WhatsApp messages were sent during verification.

## Follow-up polish and limits

- [P3] Baked sculpture/floor shadows in the static mockup were intentionally not copied into the background, because the real sculpture rotates independently. Ambient floor light and soft architectural shadows provide the requested depth.
- Mobile uses a portrait crop of the scene; preserving readability and the contact controls takes priority over showing every window-shadow detail.
- External hosting rollout is separate from the validated local production bundle.

final result: passed
