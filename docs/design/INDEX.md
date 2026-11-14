# Ten product directions: distinct by design

These are **internal design codenames**, not cleared brand names. The common technical foundation lives in `packages/design-system`. Each profile supplies distinct composition, editorial voice, shape, information priority and motion—not just a fresh accent color.

| Concept | Direction | Visual mechanism | Core user need |
| --- | --- | --- | --- |
| [Shift calendar](apps/shift-calendar.md) | **Signal** · precision editorial | Crisp time rails, hard grids, tabular numerals | Read next shift in seconds |
| [Countdown widget](apps/countdown-widget.md) | **Orbit** · atmospheric minimal | Big solitary number, circular structure | Keep an event emotionally close |
| [Medication checklist](apps/medication-checklist.md) | **Clarity** · clinical calm | One dose/action per surface; explicit statuses | Avoid ambiguous medication records |
| [Baby feeding log](apps/baby-feeding-log.md) | **Nest** · warm tactile | Two oversized logging actions | Log sleep-deprived, one-handed |
| [Plant watering](apps/plant-watering.md) | **Canopy** · botanical editorial | Organic shapes and seasonal hierarchy | Know which plant needs attention |
| [Pet medication](apps/pet-medication.md) | **Companion** · friendly service | Pet identity and treatment timeline | Avoid mixing pets or doses |
| [Mileage log](apps/mileage-log.md) | **Ledger** · technical premium | Dense type, ruled lines, precise digits | Trust and export the records |
| [Warranty tracker](apps/warranty-tracker.md) | **Archive** · paper modernism | Receipt hierarchy, reference numbers | Find proof before warranty expiry |
| [Cleaning schedule](apps/cleaning-schedule.md) | **Tempo** · kinetic clarity | Progress language and task rhythm | Finish a small daily task |
| [Elderly routine](apps/elderly-routine.md) | **Daylight** · dignified humanist | High legibility and chronological focus | Know what happens next calmly |

## What stays the same

Accessibility semantics, touch-target minimums, contrast checks, privacy standards, predictable navigation, motion reduction, safe-area behavior, localization readiness and automated testing.

## What must differ

Opening screen, primary task flow, information density, composition, type voice, brand imagery, motion, and words. Before copying a theme into a new app, perform a resemblance review with leading competing apps.

## Preview

```sh
npm install
npm run start
```

Open the starter gallery, choose a product, toggle day/night. This gallery is a prototype and does **not** replace a real device QA or professional design review.
