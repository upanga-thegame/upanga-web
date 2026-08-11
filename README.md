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
