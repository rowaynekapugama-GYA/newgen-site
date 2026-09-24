# Changelog

## 2026-09-24: Static staging build for GitHub and Vercel
- Packaged the Round 3 light-theme build as a static Vercel site: every page at its live URL, clean URLs with trailing slashes, 404 page, sitemap.xml, robots.txt.
- Contact form now posts to `/api/enquiry` (SMTP2GO relay), with hard-coded fallback recipients, a honeypot and a minimum fill time.
- Added Open Graph and Twitter card tags with an absolute image URL (`/images/og-newgen-dental.jpg`, practice exterior).
- Added GA4 and Meta Pixel slots in `site-config.js` (off until IDs are added).
- Staging noindex on `*.vercel.app`, security headers, image caching.
- Blog set to noindex and left out of the sitemap (built but unlinked per the client's Round 2 decision).
- Removed em dashes from code comments.

## 2026-09-24: Round 3, light theme
- Client feedback "too dark": whole site moved from the dark theme to a light theme. Copy, structure, navigation, hours and fonts unchanged. Full token list and contrast decisions in the GYA build log.

## Earlier rounds
- Round 2: client edits (hours without the 1pm to 2pm closure, Centaur online booking link, blog unlinked), hero and photo updates, mega menu and mobile fixes.
- Phases 1 to 3: homepage, templates and all 33 pages built from the copy document and Build Instructions.
