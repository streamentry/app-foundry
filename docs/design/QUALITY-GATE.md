# Release-level design QA

For **every** real app (gallery previews are only a starting point):

1. **Different by function:** primary screen and user flow could not be mistaken for another Foundry app.
2. **Native behavior:** navigation/back gestures, modal sheets, system dialogs, haptics and permission triggers feel familiar on each OS.
3. **Legibility:** body font scalable, labels remain visible at large accessibility sizes, informative colors meet contrast requirements and color is never the sole status cue.
4. **Screen reader:** clear element names, roles, reading order and focus return after modal actions; tap targets >= 44pt iOS / 48dp Android.
5. **Screen sizes:** 320pt device through tablet, dynamic text, screen rotation where supported, split view on tablets, RTL text and localization expansion.
6. **States:** offline, loading, empty, completed, error, destructive confirmation, failed permission, and payment restore if sold.
7. **Motion:** system reduced-motion respected; no essential information lives only in an animation; no surprise audio.
8. **Trust:** health, child and pet care claims reviewed; financial calculations and export accurate; no deceptive checkout or artificial urgency.
9. **Visual originality:** comparative screenshots against competitors; no borrowed icons, art, distinctive screen layout or brand resemblance.
10. **Evidence:** simulator/device screenshots, usability feedback, known limitations, tested OS versions and dated signoff recorded in PR.

### Automated vs manual

`packages/design-system/tests/themes.test.mjs` checks current authored palette pairs for WCAG-style contrast and validates identity diversity. This **does not** prove actual rendered accessibility, icon color contrast, dark-mode legibility, font behavior or proper platform material effects. Human device testing is mandatory.
