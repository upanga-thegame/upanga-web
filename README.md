# Upanga: The Soul Blade — official website

This repository contains the official website for **Upanga: The Soul Blade**,
published at [upanga-game.com](https://upanga-game.com).

The site uses a low-dependency static setup: root HTML pages, shared CSS and
JavaScript, generated JSON content, local game media, and a `CNAME` for the
production domain. GSAP, Lenis, and Three.js are loaded from pinned browser CDN
URLs for the immersive scrolling and animated presentation.

## Pages

- `index.html` — immersive home page, trailer, regions, heroes, enemies, and guardians
- `gallery.html` — compatibility redirect to the home-page gallery section
- `changelog.html` — development changelog
- `faq.html` — frequently asked questions
- `privacy.html`, `terms.html`, `data-deletion.html` — legal pages

## Content workflow

- Edit `docs/CHANGELOG.MD` and `docs/FAQ.MD`.
- Run `node scripts/generate-changelog.mjs` and `node scripts/generate-faq.mjs`.
- GitHub Actions regenerates `data/*.json` when the source documents change.

Only website-ready, cleared game assets are stored in this repository. Source
game media remains in the separate `upanga-game` project.

## Social links

Edit `data/social-links.json`, then run `node scripts/generate-social.mjs` before
committing. This generates the home-page banner and every page footer as static,
accessible links, including when JavaScript is disabled. Do not edit the generated
`social:*` blocks directly. Local SVG brand icons come from Simple Icons 16.0.0;
see `images/social-icons/README.md`.

Production uses GitHub Pages from the root of `main`. Push the reviewed generated
HTML, configuration, icons, and styles together, then confirm the Pages build and
the custom domain.
