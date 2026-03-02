# Specification

## Summary
**Goal:** Add a Tribe Availability enquiry flow to the Landing Page, allowing Directors and Production Houses to search for available crew technicians using a mock backend database.

**Planned changes:**
- Seed the Motoko backend with at least 15 mock technician profiles (name, designation, city, contact number, availability date range) stored in a stable variable, spread across at least 4 cities and covering all predefined roles
- Add a `searchTechnicians` backend query function that accepts shoot city, shoot date range, available-from date, and a list of required roles, returning results split into same-city and other-city matches
- Add a "Find Available Crew" CTA button inside the Tribe Availability card on the Landing Page, visible and enabled only for authenticated users with account type Director or Production House; other users see a disabled state with a tooltip
- Build an enquiry form (inline in the Tribe Availability section) with fields: Project Name, Director Name (Director only) or Production House Name (Production House only), Shoot City, Shoot Dates (date range), Available From (single date), Technicians Needed (multi-select dropdown with predefined roles as removable chips), and Special Requirements (textarea)
- After form submission, display results inline below the form split into "Same City" and "Other Cities" sections; each technician card shows name, designation, city, and contact number; empty states shown when no matches found; loading spinner shown during query

**User-visible outcome:** Directors and Production Houses can open an enquiry form directly within the Tribe Availability section on the Landing Page, search for available crew by city, date range, and required roles, and instantly see matching technicians split by same-city and other-city results — all without leaving the page.
