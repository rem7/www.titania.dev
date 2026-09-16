# TITANIA R+D

Minimal static site for https://www.titania.dev, featuring the approved animated crater line study.

## Hosting

In repository Settings > Pages, publish from `main` and `/ (root)`. The existing `CNAME` keeps `www.titania.dev` as the custom domain. At your DNS provider, point the `www` CNAME to `rem7-ai.github.io`. Enable Enforce HTTPS after domain validation.

## Development

No build step or dependencies. Edit the HTML, CSS, or JavaScript and push to `main`.

For a local preview, run `python3 -m http.server 8000` in this directory and open http://localhost:8000.

The Raleway font is bundled locally; its license is in `OFL-Raleway.txt`. Animation respects reduced-motion preferences.
