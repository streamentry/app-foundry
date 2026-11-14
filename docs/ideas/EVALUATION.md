# Idea scoring and validation contract

**Purpose:** direct limited founder time toward apps with measurable demand, not manufacture certainty by assigning scores.

## Provisional score (max 100)

Five ordinal inputs, each 1–5:

| Factor | Weight | A 5 means | A 1 means |
|---|---:|---|---|
| Search-intent plausibility | ×5 | Clear specific App Store query and identifiable user | Generic category or unclear query |
| Willingness-to-pay plausibility | ×5 | Frequent money/time loss, specific buyer | Nice-to-have, no purchase mechanism |
| Repeat/use frequency | ×3 | Routine weekly/daily job | One-time novelty |
| MVP delivery ease | ×4 | Distinct offline-first MVP in days | Requires backend, permissions, complex SDK or integration |
| Risk simplicity | ×3 | Low privacy, safety and platform-review risk | Regulated/clinical, sensitive data, or copycat concerns |

**Score = intent×5 + payment×5 + repeat×3 + ease×4 + safety×3.** Ratings are subjective priors. Re-score after actual evidence. Score ties are common and not meaningful differences.

## Hard constraints

- Never copy assets, proprietary UX or competitor trademarks.
- No diagnostic/treatment claims, guaranteed safety alerts, automatic legal/tax advice, or unapproved payments.
- Prefer offline-first and no account unless clear user demand makes backend worth it.
- Separate products only if jobs, users and screens are genuinely different.
- A reliable backup/restore story is required before charging for users' long-lived records.
- Price posture is only a hypothesis: one-time for episodic/low-maintenance use; annual if a recurring workflow produces measurable benefits. Do not force subscriptions on clocks, calculators or limited-use tools.

## Cheapest evidence plan

1. **ASO reality check (60–90 min):** inspect autocomplete and top 10–20 results for query in US, GB, AU plus one SEA country. Write dated notes and query variants. Do not present estimates as measured volume.
2. **Competitive teardown:** compare pricing, ratings, recent updates, poor reviews, retention hooks and screenshots. Find a credible switching reason.
3. **Demand check (5–10 users):** show a 60-second clickable task flow and ask what they do today. Prefer observed workflow over polite hypothetical interest.
4. **Commitment test:** ask them to import records, use for one week, or pay for a working version.
5. **MVP:** only after a clear pain + wedge + distribution hypothesis; set stop/continue thresholds first.
6. **Review at 7/30/60 days:** organic impressions, store-page views, installs, activation, week-1 retention, paid conversion, refunds, net revenue and maintenance time.

## Evidence ledger template

| Field | Entry |
|---|---|
| Idea ID/slug | |
| Research date and market | |
| Search query and source | |
| Competitor baseline with citations | |
| Strongest incumbent alternative | |
| Switching advantage | |
| Explicit who uses / pays / vetoes | |
| 5-user findings | |
| Hard commitment evidence | |
| One-screen MVP promise | |
| Complexity / privacy / app review risks | |
| Seven-day falsification test | |
| Go / stop threshold | |
| Decision owner, date and outcome | |

## Sources (context only, not evidence for individual idea)

- [Apple App Review Guidelines, §4.3 Spam](https://developer.apple.com/app-store/review/guidelines/) — rejects indistinguishable and redundant apps.
- [RevenueCat State of Subscription Apps 2026](https://www.revenuecat.com/state-of-subscription-apps) — app subscription business has high outcome variance. The observed cohorts do **not** imply any listed idea will reach target revenue.
