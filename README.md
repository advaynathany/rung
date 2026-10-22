# Rung

An open method, and a free phone tool, for teaching every child from the level they're actually at, in reading and maths. Any school can run it without joining a programme.

- **The method:** [METHOD.md](METHOD.md). Ladders, the one-minute check, grouping, the daily block and rechecks. Built on the published principles behind Teaching at the Right Level; not affiliated with Pratham.
- **The prototype:** [advaynathany.github.io/rung/try](https://advaynathany.github.io/rung/try/). Add a class, check each child, see the groups and today's lesson for each. Reading (English, Hindi) and arithmetic. Everything stays in the browser on that device; it works offline once loaded.
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
- `try/`: the prototype. `ladders.js` holds the ladders, check cards and lesson plans; `app.js` the app; `sw.js` offline caching
- `fonts/`: Kalam and Hind (woff2, Latin and Devanagari subsets)
- `METHOD.md`: the Rung method
- `PRODUCT.md`, `DESIGN.md`: product truth and the visual system

## Licence

Code: MIT (see `LICENSE`). The method, ladders, check cards and lesson plans: [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).
