# DESIGN — Native-quality, calm, intentional

Foundry is an engineering system, **not** a consumer brand. Each app needs its own identity, but all share the same quality bar.

## Principles

- Utility before novelty: the primary task should be obvious within five seconds.
- A first-class empty state, completed state, offline state and error state for every meaningful screen.
- Familiar native conventions: use platform navigation, system affordances, responsive safe areas and OS typography where sensible.
- Accessibility is non-negotiable: semantic labels, meaningful focus order, 44pt iOS / 48dp Android touch targets, dynamic text, assistive technologies, sufficient contrast, and non-color-only status.
- Privacy is visible: demonstrate value before requesting permissions or payment; never use manipulative countdowns, fake urgency or dark patterns.
- Aim for a one-handed, low-friction recurring flow; avoid dashboards without a real user decision.

## Starter visual language (placeholder, not every product)

- Canvas: `#F7F8FA`; surface: `#FFFFFF`; primary text: `#17212B`; secondary: `#596775`; accent: `#235ECA`; border: `#DCE3E9`.
- Use system font and scalable type. Start with 8pt spacing rhythm: 4, 8, 12, 16, 24, 32.
- Radius: 12pt for interactive cards. Use light borders over gratuitous shadow.
- Constrain on tablets; avoid stretched phone layouts.
- Use simple restrained motion, obey reduced-motion preferences.

## Quality gate

Review at 320pt and tablet widths, with largest accessibility text, dark system theme, keyboard up, VoiceOver/TalkBack, screen rotation where supported, and airplane mode. Never declare visually complete without simulator/device inspection. Snapshot tests supplement—not replace—real accessibility and interaction testing.
