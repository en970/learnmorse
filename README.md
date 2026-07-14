# Learn Morse

A small, calm web app for picking up Morse code — one letter at a time, in
English or Turkish.

Live at **https://oze05607.github.io/learnmorse/** once GitHub Pages is turned on for this repo.

## How it teaches

You start with three letters. Every word you're asked to tap out is built
only from letters you already know, so nothing ever feels out of reach.
Get a letter right a few times in a row and the next one joins the pool —
the alphabet unlocks gradually instead of all at once.

If a letter is new, its pattern and sound show up automatically so you're
never guessing blind. Once you've got it down, the hint disappears. Slip up
on something you thought you knew, and it quietly comes back to remind you.

There's no lesson plan, no lecture, no "correct!" popups. Just words,
letter by letter, and a streak that keeps count in the corner.

## Features

- English and Turkish alphabets, including Turkish's extra letters
  (ç, ğ, ı/i, ö, ş, ü) — more languages can be added the same way
- Five color palettes, light/dark/auto, switchable anytime from settings
- A single-switch input mode for anyone using a switch-access device
  instead of a keyboard — hold briefly for a dot, longer for a dash
- A review mode for a quick pass over everything learned so far
- Everything is saved to your browser, nothing leaves your device

## Running it locally

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

## Building

```bash
npm run build
```

This produces a fully static site in `out/`, ready for any static host.
`.github/workflows/deploy.yml` builds and publishes it to GitHub Pages
automatically on every push to `main` — just turn on Pages for this repo
under Settings → Pages → Source → GitHub Actions.

## Stack

Next.js and React, plain CSS (no UI framework), and the Web Audio API for
the dot/dash tones — generated on the fly rather than shipped as audio
files, so there's nothing extra to download. No backend, no accounts,
no tracking.

## Where the teaching method comes from

The letter-unlocking approach here is adapted from
[Google Creative Lab's Morse code trainer](https://github.com/googlecreativelab/morse-learn),
later maintained by [Ace Centre](https://github.com/AceCentre/morse-learn)
for accessibility research. This is an independent rewrite, not a fork —
same underlying idea, new codebase, extended to Turkish and a few other
places. The Morse codes for Turkish's extra letters come from Turkish
Wikipedia's Mors alfabesi page, cross-checked against how other European
languages extend the international alphabet for their own accented
letters — there's no official ITU standard for them, so treat ş in
particular as a community convention rather than a hard rule.

## License

MIT.
