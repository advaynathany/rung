# Rung

An open method, and a free phone tool, for teaching every child from the level they're actually at: foundational reading and maths, then comprehension and writing. Any school can run it without joining a programme.

- **The method:** [METHOD.md](METHOD.md). Ladders, profiles, checks, grouping, the daily block and rechecks. Built on the published principles behind Teaching at the Right Level; not affiliated with Pratham.
- **The prototype:** [advaynathany.github.io/rung/try](https://advaynathany.github.io/rung/try/). Add a class, check each child on each ladder, see the groups, today's lesson for each, and every child's profile. Ladders: reading (English, Hindi), arithmetic, comprehension and writing. Optional AI marking reads a photo of a child's handwritten page (uses your own Anthropic API key, kept in the browser). Everything else stays on the device; it works offline once loaded.
- **The roadmap:** [ROADMAP.md](ROADMAP.md), v0 to v50.
- **The website:** [advaynathany.github.io/rung](https://advaynathany.github.io/rung/).

Rung is pre-pilot. Nothing has been tested with children yet. The Hindi check cards are drafts that need review by a native speaker.

## Run locally

```sh
python3 -m http.server 8000
# open http://localhost:8000 and http://localhost:8000/try/
```

Plain HTML, CSS and JS with no build step. Pushing to `main` deploys to GitHub Pages.

## Files

- `index.html`, `styles.css`, `script.js`: the website ("The Divided Blackboard")
- `try/`: the prototype. `ladders.js` and `ladders-upper.js` hold the ladders, check cards, prompts and lesson plans; `app.js` the app; `sw.js` offline caching
- `fonts/`: Kalam and Hind (woff2, Latin and Devanagari subsets)
- `METHOD.md`: the Rung method
- `ROADMAP.md`: v0 to v50
- `PRODUCT.md`, `DESIGN.md`: product truth and the visual system

## Licence

Code: MIT (see `LICENSE`). The method, ladders, check cards and lesson plans: [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).
