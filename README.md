# Ameerah Design Studio — Website

A static, no-build website (plain HTML/CSS/JS) ready to push to GitHub and deploy on Vercel.

## File structure

```
.
├── index.html
├── css/
│   └── styles.css
├── js/
│   └── script.js
└── assets/
    └── images/
        ├── logo.svg              ← replace with your client's logo
        ├── hero-main.jpg         ← full-bleed hero banner (behind the headline)
        ├── about-primary.jpg     ← large image in the "We are a creative..." stack
        ├── about-secondary.jpg   ← smaller overlapping image in that stack
        ├── project-bedroom.jpg
        ├── project-kitchen.jpg
        ├── project-study.jpg
        ├── project-bathroom.jpg
        ├── project-entryway.jpg
        ├── project-lounge.jpg
        ├── featured-work.jpg     ← featured banner (with play-button overlay)
        └── contact.jpg
```

## Page structure (matches the latest wireframe)

1. **Header** — top utility row (nav + Say Hi / Get Started), centered logo row below it
2. **Hero** — full-bleed image with centered headline, subtext, and two buttons overlaid
3. **About + Why Choose Us** — left: heading with a stacked pair of images; right: eyebrow, intro paragraph, 2×2 process grid (Concept & Vision, Space Planning, Material & Styling, Execution & Finish)
4. **Our Services** — dark band with 4 service cards (Architecture, Custom Furniture, Interior Design, Styling)
5. **Stats** — 4 stat icons/numbers (Projects, Awards, Workforce, Years)
6. **Projects** — heading + single "All Projects" link + 3×2 project grid (name only, no category tag)
7. **Featured Work** — centered intro copy + full-width banner image with a play-button overlay
8. **Testimonials** — 3 client quote cards
9. **Contact** — centered "Get Started Today" heading, then image + form side by side
10. **Footer** — 5 columns: brand, Quick Links, Services, Follow Us On, Contact Us

## Replacing the logo

1. Drop your new logo file into `assets/images/`.
2. **Easiest:** name it `logo.svg` (or `logo.png`) to overwrite the placeholder — no code changes needed.
3. If you use a different filename, update the two `<img src="assets/images/logo.svg">` references in `index.html` (one in the header, one in the footer).
4. Recommended logo height is ~36–40px tall (wide, horizontal lockups work best in the header).

## Replacing the placeholder photos

Every image in `assets/images/` is currently a warm-toned placeholder with a small label in the corner showing its filename and recommended dimensions. To swap in real photography:

- Keep the same filename and folder, and just overwrite the file — nothing else to change.
- Or use new filenames and update the matching `src="..."` in `index.html`.
- JPG or WebP both work fine; sizes in the `gen_placeholders` labels are a guide, not a hard requirement.

## Running locally

No build step required. Either:

- Open `index.html` directly in a browser, or
- Serve it locally for a closer-to-production preview:
  ```bash
  npx serve .
  # or
  python3 -m http.server 8000
  ```

## Deploying

### GitHub
```bash
git init
git add .
git commit -m "Initial site"
git branch -M main
git remote add origin https://github.com/<your-username>/<repo-name>.git
git push -u origin main
```

### Vercel
1. Go to [vercel.com/new](https://vercel.com/new) and import the GitHub repo.
2. Framework preset: **Other** (it's static HTML — no build command or output directory needed).
3. Deploy. Vercel will give you a live `*.vercel.app` URL to share with your client.

A `vercel.json` is included to make sure Vercel treats this as a static site explicitly.

## Notes

- The contact form (bottom of the page) currently shows a demo confirmation alert and does not send data anywhere. Wire `js/script.js` up to a form backend (e.g. Formspree, Resend, Basin) or your own API before going live.
- Nav links, "Quick Links", and "Services" footer links currently point to in-page anchors (`#about`, `#services`, etc.) — update `href`s once real sub-pages exist.
- Fonts used: **Fraunces** (headings) and **Jost** (body), loaded from Google Fonts.
