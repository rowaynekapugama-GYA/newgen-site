# Changelog

## 2026-10-06: Implant Education page replaces the Blog (client request, 5 Oct 2026)
- New page at `/implantology/`: hero, A Special Interest in Implantology, Investing in Modern Technology, Teaching Implantology, Seminar Gallery (7 photos with a lightbox, 2 videos) and Book an Implant Consultation. Draft copy with highlighted `[CONFIRM]` markers for anything not yet supplied.
- "Implant Education" added to the main navigation (where Blog sat) and the footer, on every page. Desktop nav spacing tightened so six items fit on one line from 1200px.
- Blog page removed; `/blog/` redirects to `/implantology/`. Leftover blog styles removed.
- Centaur (D4W eAppointments) booking embed added to the new page's booking panel, lazy-loaded, with a link fallback.
- Seminar media: photos converted to WebP (max 2048px, grid thumbnails at 600 to 900px), videos re-encoded to H.264 MP4 with poster frames, no autoplay. Page-specific Open Graph image and VideoObject schema.
- Sitemap now lists `/implantology/`.

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
