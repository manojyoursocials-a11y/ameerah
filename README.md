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
        ├── logo.svg            ← replace with your client's logo
        ├── hero-main.jpg       ← placeholder photography (replace all of these)
        ├── why-choose.jpg
        ├── project-bedroom.jpg
        ├── project-kitchen.jpg
        ├── project-study.jpg
        ├── project-bathroom.jpg
        ├── project-entryway.jpg
        ├── project-lounge.jpg
        ├── featured-work.jpg
        └── contact.jpg
```

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
