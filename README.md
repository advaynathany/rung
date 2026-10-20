# Rung

A free phone tool that helps teachers find each child's reading level in a minute, by voice, and teach them from there.

Rung is pre-pilot. This repo currently holds the project website: plain HTML, CSS and JS with no build step.

## Run locally

```sh
python3 -m http.server 8000
# open http://localhost:8000
```

## Before publishing

- Publish with GitHub Pages: Settings → Pages → Deploy from branch → `main` / root.

## Files

- `index.html`: the page
- `styles.css`: self-hosted font faces, design tokens and layout ("The Divided Blackboard")
- `script.js`: slate, wood and chalk-grain textures drawn at load, the chalk-line reveal, the group spotlight and the English/Hindi samples
- `fonts/`: Kalam and Hind (woff2, Latin and Devanagari subsets)
- `PRODUCT.md`, `DESIGN.md`: product truth and the visual system
