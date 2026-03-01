# Specification

## Summary
**Goal:** Replace the hero background with the tribal film camera artwork and retheme the entire app with a deep forest green and warm saffron/golden-amber palette inspired by that image.

**Planned changes:**
- Save `unnamed.jpg` as a static asset and use it as the full-screen hero background image in `LandingPage.tsx` with `object-fit: cover` and a dark semi-transparent overlay (rgba ~0.45–0.55) to keep hero text and CTA legible
- Update CSS custom properties in `index.css` and Tailwind config tokens to replace the current amber/charcoal theme with deep forest green (~#14421e) as primary and warm saffron/golden-amber (~#c8820a) as accent
- Apply the new green-and-saffron palette consistently across all pages and components (buttons, navigation, headers, cards, badges, interactive elements)
- Text on dark backgrounds uses off-white/light cream; text on light backgrounds uses deep charcoal

**User-visible outcome:** The hero section displays the tribal film camera artwork as a full-bleed background, and the entire app consistently uses a deep green and saffron color scheme inspired by the image.
