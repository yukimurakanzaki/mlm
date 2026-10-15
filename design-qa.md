# Coming-soon design QA — cursor motion and partner sales

Source visual truth: `/workspace/generated_images/exec-e04e4aaa-adc8-400e-a9ca-693b3a84033f.png` (selected option 1), amended by the owner's request for cursor-driven spinning, removal of the pause control, and ordering through PT Panji Prima Dinamika (PPD).

The owner confirmed that 0812-6685-4415 is also the PPD sales contact. The primary CTA now reads “Hubungi sales” / “Contact sales” and opens that WhatsApp number with an Indonesian/English message addressed to PPD sales. No messages were sent during verification.

## Evidence and normalization

- Source: 1487 × 1058 pixels. Desktop implementation: 1487 × 1058 pixels, same CSS viewport, deviceScaleFactor 1, light theme, Indonesian, settled/reduced-motion state.
- Full-view combined comparison: `/workspace/.outputs/mlm-cursor-final/comparison-final.png` (both images at matching half scale).
- Focused typography/contact comparison: `/workspace/.outputs/mlm-cursor-final/comparison-typography.png` (matching 1:1 crops).
- Production screenshots: `/workspace/.outputs/mlm-cursor-final/production-desktop.png`, `production-tablet.png`, `production-mobile.png`, `production-english.png`.
- Active cursor state: `/workspace/.outputs/mlm-cursor-final/production-cursor-active.png`.
- Browser-rendered production bundle, captured through Playwright Chromium. Console errors and uncaught page errors: zero.

## Findings and comparison history

- [P1, fixed in the initial build] Headline wrapped into four lines. Adjusted desktop type to preserve the selected three-line hierarchy.
- [P2, fixed in the initial build] Dotted catalog slugs escaped the general route matcher. Added explicit matchers and page-level guards; browser regression coverage remains passing.
- [P2, fixed in the initial build] Entrance motion briefly created narrow-screen horizontal overflow. Constrained the decorative frame; the 320px regression still passes.
- [P2, fixed in this revision] The motion library's reduced-motion hook read the initial setting but did not react to a live preference change. Replaced it with a native media-query subscription using useSyncExternalStore. Production tests now verify disabling and re-enabling the preference while the page is open.
- [P2, fixed in this revision] At diagonal rotation, petal tips were clipped by the frame. Added rotation clearance around the rotor, captured the active diagonal state again, and confirmed the tips remain intact. The smaller settled motif is an intentional accommodation for its rotation envelope.
- No actionable P0/P1/P2 findings remain.

## Required fidelity surfaces

- Typography: existing locally bundled Newsreader normal/italic and Plus Jakarta Sans retained; three-line desktop title and copper emphasis preserved. Body/CTA text is accessible HTML.
- Layout: selected asymmetric split composition, square CTA, header/language controls, full-width footer, and mobile stacking preserved. English/Indonesian screenshots show no horizontal overflow; narrow 320px keyboard test passes.
- Colors: original Mori #F0EBE1 and Nila #1E3D63 retained; emphasis #A56B2E remains legible. Dark OS preference does not override the selected light page.
- Image quality: original supplied logo and generated transparent sculpture retained. The real image quadrants sit inside a spring-driven rotor; no CSS/vector imitation of the artwork was introduced. The motif settles upright when the pointer leaves and follows continuous angles across the -180/180 seam.
- Copy: all customer-facing licensing messages removed, including page metadata in both languages. New description/footer explicitly say orders are available through PPD; the confirmed sales number and correct prefilled message are used. Native MLM checkout remains closed because orders are handled by partner sales.

## Interactions and validation

- Cursor proximity activates rotation; a complete clockwise pointer orbit produces a continuous full turn; leaving the area settles the motif upright.
- No pause control or perpetual idle animation. Entrance completes once. Mouse/pen motion responds to the cursor; touch input does not activate the rotor or intercept scrolling.
- Reduced motion disables entrance/rotation, including when changed live. ID/EN switching, dark preference, skip link, keyboard navigation, contact destinations, and sales-page guards verified.
- Production build and TypeScript compilation passed.
- All 65 unit/browser-component tests passed.
- Final production Chromium suite: 14 passed, four legacy native-checkout/chat scenarios intentionally skipped because ordering is handled through partner sales.
- Translation and dependency checks passed. Lint has zero errors; existing warnings concern launch-mode test skips/conditionals and the touch event regression setup. git diff --check passed.

## Follow-up polish and limits

- [P3] The generated sculpture has stronger edge lighting than the initial mockup; the background remains a flat Mori field so the motif can rotate independently.
- Real message delivery, partner fulfillment, and the external production rollout were not exercised by these local checks. Tests verify the correct WhatsApp destination and prefilled text without contacting anyone.

final result: passed
