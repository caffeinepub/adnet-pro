# Specification

## Summary
**Goal:** Add user profile storage to the backend and surface a profile avatar, profile view/edit panel, and availability calendar integration in the frontend for authenticated Ad Tribe users.

**Planned changes:**
- Extend the Motoko backend actor with a full user profile data model (name, email, phone, city, department, designation, experience, tribe/company name, role, executive producers, work reel URL, industry reference email, availability dates) stored by Internet Identity principal, with stable storage and CRUD endpoints (`createOrUpdateProfile`, `getMyProfile`, `updateAvailability`)
- Display an initials-based circular avatar and the user's full name in the app header next to the Ad Tribe logo when the user is authenticated and has a saved profile; clicking either opens the profile panel
- Build a slide-over/modal profile panel showing all stored profile fields in read-only view, with an Edit mode that pre-populates an editable form and saves changes to the backend on submit
- Embed the existing `AvailabilityCalendar` component inside the profile panel as a "My Availability" section, loading saved availability dates from the backend and persisting changes via `updateAvailability`
- Wire the `DirectorRegistrationForm` and `ProductionHouseRegistrationForm` submission handlers to `createOrUpdateProfile` so profile data is saved on registration, then navigate to the existing success page; header avatar/name appears immediately after

**User-visible outcome:** After registering, users see their avatar and name in the header. Clicking it opens a panel where they can view and edit all their profile details and manage their availability calendar, with all changes saved to the canister.
