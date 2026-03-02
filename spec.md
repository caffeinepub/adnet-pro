# Specification

## Summary
**Goal:** Remove the "Welcome to Ad Tribe" onboarding modal so users land directly on the main app after authenticating.

**Planned changes:**
- Remove the `ProfileSetup` component (`frontend/src/components/ProfileSetup.tsx`) entirely
- Remove all code references that conditionally trigger or render the `ProfileSetup` modal (e.g., in `AppLayout` or any parent component)

**User-visible outcome:** After logging in via Internet Identity, users are taken directly to the main app without any name-entry modal interrupting their experience. Registration flows (Director, Production House, Advertising Professional) remain accessible from the main app as before.
