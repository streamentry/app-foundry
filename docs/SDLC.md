# Evidence-driven agentic SDLC

## 0 — Opportunity intake (human accountable)
Create an experiment brief: target user, job, search query, incumbent alternative, reason to switch, monetization, distribution, success metrics and a kill criterion. Prefer direct user behavior over AI-generated market narratives.

## 1 — Spec and adversarial review
Agent drafts a small spec with measurable acceptance tests; second review pass challenges the distribution premise, edge cases, policy risks and a cheaper falsification test. Human approves product scope.

## 2 — Implement
Agent uses task-scoped branch, follows AGENTS.md, writes pure testable logic, introduces dependencies only with explicit rationale and no premature sharing. Keep changes small and reversible. One agent implements; a separate independent review pass inspects the diff.

## 3 — Verify
CI checks types, tests, lint, format, Expo compatibility. Human verifies on physical devices/simulators, screen reader, network offline, permissions, store compliance, privacy disclosure, subscriptions/cancellation if present. No invented test results.

## 4 — Release (human approval)
Review bundle IDs, entitlements, signing, privacy manifest/SDK disclosures, screenshots, localized metadata and purchase flows. Build with EAS only with explicit consent and credentials. Use phased rollout where applicable and define rollback.

## 5 — Learn
After 7, 30, 60 days, measure organic impressions → product-page views → installs → activated users → paying customers → net revenue. Segment by country and platform, account for small samples. Improve, pivot or archive by predefined thresholds.

## Agent checkpoints
- **Planner**: define outcome, alternatives, risks, tests and stop condition.
- **Builder**: implement only the agreed scope.
- **Reviewer**: look for security, privacy, correctness, accessibility, unnecessary complexity and store-policy problems; recommend concrete fixes.
- **Verifier**: provide exact commands and observed evidence; identify untested hardware/platform cases.

These are roles, not a requirement for expensive multi-agent infrastructure. A single capable agent can perform them in separate passes; human owns consequential decisions.
