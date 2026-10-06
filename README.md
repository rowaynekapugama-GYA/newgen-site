# New'Gen Dental Surgery website (static staging build)

New'Gen Dental Surgery, 72 Anzac Avenue, Seymour VIC 3660. Built by GYA.

This is the approved Round 3 design (light theme) as a static site for Vercel. It is the **staging build for client sign-off**. It does not include the client dashboard (Payload CMS at `/admin`). That comes when the site moves onto the GYA Site Kit after sign-off. Until then, text and image changes are made in the HTML files by GYA.

## What's in the repo

```
public/                     everything Vercel serves
  index.html                homepage
  about/index.html          every page sits at its live URL (/about/, /services/general-dentistry/dental-fillings/ ...)
  404.html                  not-found page
  images/                   all local images (WebP), plus og-newgen-dental.jpg for link previews
  sitemap.xml, robots.txt
  site-config.js            GA4 and Meta Pixel slots (empty = off)
api/enquiry.js              contact form relay to SMTP2GO (Vercel serverless function)
vercel.json                 clean URLs, trailing slashes, headers, staging noindex
.env.example                environment variables to set in Vercel
```

There is no build step and no `package.json`. Vercel serves `public/` as-is and runs `api/enquiry.js` as a Node function.

## Deploy

1. **GitHub.** Create a new **private** repository (for example `gya-clients/newgen-dental-web`). Choose *uploading an existing file*, then drag in the **contents** of this folder: `public`, `api`, `vercel.json`, `README.md`, `CHANGELOG.md`. The repo is about 90 files. GitHub's web uploader takes 100 at a time, so it still goes up in one batch. `.gitignore` and `.env.example` are hidden on a Mac. They are optional; press Cmd+Shift+. in Finder to show and add them.
2. **Vercel.** Go to Add New, then Project, and import the repo.
   - Framework Preset: **Other**
   - Build Command: leave empty
   - Output Directory: leave as is (`vercel.json` sets `public`)
3. **Environment variables.** Go to Project, Settings, Environment Variables and add them for Production and Preview:

   | Variable | Required | Value |
   |---|---|---|
   | `SMTP2GO_API_KEY` | Yes | API key from SMTP2GO (Sending, API Keys). Needs the "Emails" permission. |
   | `SMTP2GO_SENDER` | Recommended | A from-address on an SMTP2GO-verified domain, e.g. `New'Gen Dental Website <website@gyaclients.com>`. This is also the default when unset, so `gyaclients.com` must be verified in SMTP2GO. |
   | `SMILEOX_INTAKE_EMAIL` | Yes, before go-live | The practice's SmileOx intake address. It is added to the recipients. |
   | `ENQUIRY_TO` | No | Comma-separated list that **replaces** the built-in recipients. Leave empty normally. |

   The built-in recipients are `newgendental14@gmail.com` and `rowayne@gyaclients.com`, plus `SMILEOX_INTAKE_EMAIL` when it is set. They are hard-coded in `api/enquiry.js`, so a missing variable never drops a lead.
4. **Deploy.** This gives you the staging link (`*.vercel.app`) to send to the client. Every `*.vercel.app` URL is sent with `X-Robots-Tag: noindex`, so staging can't be indexed. Nothing needs switching off at go-live; the header simply does not apply on the real domain.
5. **Test the form** on staging with a real submission and confirm it reaches all three inboxes.

## Go-live

1. Confirm the domain. Canonicals, the sitemap and Open Graph URLs use `https://newgendental.com.au`. If the domain is different, find and replace `https://newgendental.com.au` across `public/`.
2. In Vercel, go to Settings, then Domains, and add the apex and `www`. Make the apex primary with `www` 308-redirecting to it. Do the reverse if the current site already ranks on `www`; check Search Console first.
3. Point DNS at Vercel: an A record `76.76.21.21` for the apex and a CNAME for `www` to `cname.vercel-dns.com`. Use the values Vercel shows, as they can differ per project.
4. Add 301 redirects from the old site's URLs in `vercel.json` (`"redirects": [{ "source": "/old-path", "destination": "/new-path/", "permanent": true }]`).
5. Submit `https://newgendental.com.au/sitemap.xml` in Google Search Console.

## Go-live checklist: open items

- [ ] **Privacy policy page.** `/privacy-policy/` is linked from the enquiry form and the footer but does not exist yet (it 404s). It is not in the copy document; GYA or the client needs to supply the wording.
- [ ] **Stock photos are hotlinked from Pexels.** 22 images (service page heroes, category cards, menu thumbnails) load from `images.pexels.com`. The house rule is that every image lives locally. Download them, convert them to WebP and put them in `public/images/`. The Pexels licence allows this. Better still, replace them with practice photography.
- [ ] **SMTP2GO.** Add the API key, confirm the sender domain is verified, and add the SmileOx intake address (not supplied yet).
- [ ] **Spam protection.** The form has a hidden honeypot field and a minimum fill time. Add Cloudflare Turnstile or reCAPTCHA if spam gets through.
- [ ] **Tracking.** Add the GA4 and Meta Pixel IDs in `public/site-config.js`. Add a cookie notice first. The notice will also need to cover the Google Maps embed and any live chat.
- [ ] **Dentflo live chat** snippet (requested earlier), if still wanted.
- [ ] **Implant Education page: resolve every `[CONFIRM: ...]` marker.** `/implantology/` carries 7 highlighted placeholders (name spelling, training, years placing implants, implant equipment, seminar venue, organiser, other teaching). They show on the page in yellow on purpose so the client can answer them on staging. None can go live. Check with `grep -c 'mark class="confirm"' public/implantology/index.html` (must be 0).
- [ ] **Seminar photos and videos: consent.** The gallery shows other dentists who attended the seminar. Confirm the organiser or each attendee is happy to appear on the practice website. The video audio was not reviewed by GYA; listen to both clips before go-live.
- [ ] **Centaur online booking embed.** The practice's D4W snippet (orgId 2893, practiceId 3304) is embedded on `/implantology/` and loads only when the visitor scrolls to the booking panel. It could not be tested from GYA's build environment; open the page on staging and confirm the booking screen appears. A link to the same booking screen sits underneath as a fallback. Add Centaur to the privacy policy and cookie notice (it sets its own cookies).
- [ ] **Blog.** Removed. Its navigation slot is now Implant Education. `vercel.json` redirects `/blog/` to `/implantology/`. Delete `public/blog/` from the GitHub repo if it is still there.
- [ ] **Hero family photograph.** Confirm the licence.
- [ ] **Reversed (white) logo.** Get it at full resolution from the client.
- [ ] **Client dashboard.** Port to the GYA Site Kit (Payload at `/admin`) after sign-off, per the standard stack.

## Details to confirm with the practice (conflicts found)

| Item | On the site | Conflict |
|---|---|---|
| Phone | 03 5792 2055 | None |
| Address | 72 Anzac Avenue, Seymour VIC 3660 | None |
| Email | newgendental14@gmail.com | None |
| Opening hours | Monday to Friday, 9am to 5pm; closed weekends. Schema has one interval per weekday. | The copy document and Build Instructions still show a 1pm to 2pm closure. The client dropped it in Round 2, and the site follows the client. Update the source documents. |
| Health funds | Smile.com.au, Bupa, Medibank | Confirm this is the full list. |
| Online booking | Centaur portal link in the header, hero and booking band | The Build Instructions list online booking as out of scope. The client reversed that in Round 2. |

## Copy notes

- **Em dashes in the approved copy.** The house rule is no em dashes. The client copy is used exactly as written, so 20 em dashes remain on these pages: Home, About, Dental Assistants and Reception, General Dentistry, Dental Hygiene, Dental Fillings, Tooth Extractions, Children's Dentistry, Dentures, Digital Dentistry, Traditional Braces, Implants and Advanced Dentistry, and TMJ and Jaw Pain. If the content team approves, they can be swapped for commas or colons in one pass. The em dashes in code comments have been removed.
- **"Specialist" in the FAQs.** Four FAQ answers use the word when explaining referral. They appear on the pages but are excluded from the FAQPage schema, so the word stays out of structured data.
- **New microcopy** (not from the copy document): the enquiry form's sent and failed messages, and the 404 page wording.
- **Implant Education page copy is a GYA draft**, not content-team copy. It needs client approval along with the `[CONFIRM]` answers. The page heading uses "Dr JohnPaul" as briefed; the rest of the site uses "Dr John Paul Lee" from the approved copy.

## Making changes before the dashboard exists

Edit the page's `index.html` under `public/` and upload it to the same path in GitHub. Vercel redeploys automatically. Add a line to `CHANGELOG.md` for each change.
