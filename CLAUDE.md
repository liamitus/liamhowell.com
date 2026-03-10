# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Personal website for Liam Howell (liamhowell.com). A single-page static site — plain HTML, CSS, and vanilla JS. No framework, no build step.

## Commands

- **Dev server:** `npm run dev` (serves `src/` on port 3000 via `npx serve`)
- **Deploy:** `npm run deploy` (copies `src/*` to `../liamitus.github.io` GitHub Pages repo, commits, and pushes)
- **No tests** — static site

## Architecture

- `src/index.html` — Single page with all content inline
- `src/css/main.css` — Layout and styling using CSS custom properties and flexbox
- `src/css/fonts.css` — @font-face declarations for self-hosted Bree Serif + Lato
- `src/js/main.js` — Vanilla JS: color-cycling header (click to change), rotated background geometry, email obfuscation, console easter egg
- `src/fonts/` — Self-hosted woff2 font files
- `src/images/` — Headshot photo and favicon PNGs

## Key Design Details

- Color palette defined as CSS custom properties: `--navy`, `--salmon`, `--green`, `--blue-gray`, `--gray`, `--steel`
- The rotated header background uses manual geometric calculations to rotate a div while keeping children counter-rotated. Recalculates on window resize.
- Email address (liam@send.tax) is assembled via JS to deter scrapers — not present in HTML source
- Fonts.css uses relative paths (`../fonts/`) since files are served from `src/` with directory structure intact
