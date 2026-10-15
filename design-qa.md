# Coming-soon design QA

Source visual truth: `/workspace/generated_images/exec-e04e4aaa-adc8-400e-a9ca-693b3a84033f.png` (selected option 1).

Source pixels: 1487 × 1058. Desktop CSS viewport: 1487 × 1058, deviceScaleFactor 1. Production desktop capture uses the same pixels, light theme, Indonesian, fully assembled artwork, reduced motion. Browser: Playwright-driven headless Chromium.

## Findings and comparison history

- [P1, fixed] First capture wrapped the first headline into two lines, changing the reference's three-line composition. Reduced desktop display type from 6.25vw to 5.9vw. Post-fix evidence: `/workspace/.outputs/mlm-coming-soon/desktop-v2.png` and production comparison.
- [P2, fixed] Catalog slugs containing a dot bypassed the general proxy matcher and returned a 404 rather than the coming-soon page. Added explicit catalog matchers and page-level redirects before database reads. Post-fix browser checks pass for `/catalog/sample.with-dot`.
- [P2, fixed] Production checks caught transient horizontal overflow at 320px while petals entered from outside the artwork. Added `overflow: clip` to the artwork frame, keeping its transforms inside the decorative surface. Rebuilt the production bundle and reran all Chromium end-to-end checks: 13 passed, including the 320px overflow/keyboard check; four legacy sales scenarios intentionally skipped. Final production captures and both combined comparisons were regenerated and reviewed after the fix.
- [P3] The generated transparent sculpture has stronger edge lighting than the mockup. The production background is a flat Mori field rather than baked floor-lighting; this keeps each petal independently animatable.

## Fidelity surfaces

- Typography: bundled Newsreader normal/italic and Plus Jakarta Sans; correct three-line desktop hierarchy and copper italic emphasis. Brand fonts load locally. Main/body and contact text remain real accessible text.
- Spacing/layout: matching asymmetric two-column composition, large margins, full-width divider/footer; tablet and mobile reflow reviewed. Mobile source adaptation stacks artwork below contact.
- Colors: Mori #F0EBE1, Nila #1E3D63; emphasis uses #A56B2E for stronger contrast on Mori. The page preserves its selected light appearance under a dark OS preference.
- Image fidelity: supplied logo reused; sculptural four-petal image generated from the selected reference, transparent 1254 × 1254 source, clipped into four quadrants for independent transforms. Icons are Radix icons; no CSS approximation of the sculpture.
- Copy/content: reference headline, licensing status, general company contact, footer, and location retained; English translation provided. No date, certification claim, product listing, price, or order CTA.

## Evidence

- Full-view combined comparison: `/workspace/.outputs/mlm-coming-soon/comparison-final.png`.
- Focused typography/contact comparison: `/workspace/.outputs/mlm-coming-soon/comparison-typography.png`.
- Production captures: `/workspace/.outputs/mlm-coming-soon/production-desktop.png`, `production-tablet.png`, `production-mobile.png`, `production-english.png`.
- Primary interactions: ID/EN switching, WhatsApp destination, email destination, motion pause/resume, reduced motion, skip link, and catalog/checkout restrictions.
- Production browser console and uncaught page error collection: zero errors. Earlier development HMR origin failures were diagnosed; the local dev origin is now explicitly allowed.

## Implementation checklist

- Complete: production build and TypeScript compilation passed with locally bundled fonts.
- Complete: 65 unit and browser-component tests passed, including four direct order/payment action guards.
- Complete: final production browser suite passed (13 passed; four legacy sales/chat scenarios intentionally skipped while licensing is pending).
- Complete: final desktop, tablet, mobile, and English captures reviewed; no horizontal overflow. Desktop source and implementation both 1487 × 1058 pixels at density 1, displayed at matching half scale in the full-view comparison. Focused typography comparison uses matching 1:1 crops for readable details.
- Complete: production console and uncaught error collection found zero errors; language, contact, reduced motion, pause/resume, and keyboard checks passed.
- Complete: lint passed with no errors (14 warnings for explicit test skips/conditional launch-mode assertions); dependency and translation checks passed. `git diff --check` passed.

No actionable P0/P1/P2 findings remain. P3 lighting differences are documented above. Deployment, real WhatsApp conversation delivery, and email delivery were not tested or requested; contact URL destinations were verified without sending messages.

final result: passed
