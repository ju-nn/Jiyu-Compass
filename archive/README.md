# Archive Inventory

This folder contains code that is not currently reachable from `src/main.tsx`.

## legacy-dashboard

Old FIRE dashboard application code:

- Full dashboard shell and tab components
- Onboarding, detailed settings, life events, expense breakdown
- Monte Carlo / simulation table UI
- Gamification, achievements, sounds, particles
- Scenario management and export/import utilities
- Legacy shared UI components

Keep this only if the product will regain a separate advanced FIRE simulator mode.

## reuse-candidates

Potentially useful content/data that is not wired into the current app:

- FIRE cases
- Job/work-style data
- Learning content
- Update/changelog data
- Monetization/book configuration

These are good candidates to selectively reintroduce into the current Compass experience.

## legacy-tests

Tests that only covered archived utilities.

## Current App Boundary

The active app is intentionally centered on:

- `src/App.tsx`
- `src/components/compass/*`
- `src/utils/compass.ts`
- `src/utils/benchmarks.ts`
- `src/utils/calculations.ts`
- `src/utils/math.ts`
- `src/utils/storage.ts`
- `src/components/ErrorBoundary.tsx`

Note: the active `src/utils/calculations.ts` is now a small compatibility module
with only `calculateFireNumber` and `formatCurrency`. The old full simulator
calculation engine is archived under `legacy-dashboard`.
