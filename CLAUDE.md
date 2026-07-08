# Miwako Kogawa — Creative Portfolio

A single-page static portfolio site (plain HTML/CSS, no build step) for
Miwako Kogawa, a creative project coordinator / employer branding
specialist at Louis Vuitton, aimed at marketing & brand-communications
roles abroad.

- **Live site:** https://82ycsmmb68-stack.github.io/portfolio-/
- **Working branch:** `claude/portfolio-screenshot-prompt-vrnbwl`
  (continues `claude/portfolio-screenshot-prompt-k6aujs`; `main` is empty)
- **Deploys:** `.github/workflows/deploy-pages.yml` auto-deploys to GitHub
  Pages. Pages source is "GitHub Actions" in repo settings. **Gotcha:** the
  `github-pages` environment's deployment branch policy only allows `main`
  and `claude/portfolio-screenshot-prompt-k6aujs` — runs from other branches
  fail instantly with no logs. Until the owner widens that policy in repo
  Settings → Environments, deploy by fast-forwarding `…-k6aujs` to the same
  commit (`git push origin HEAD:claude/portfolio-screenshot-prompt-k6aujs`).

## Design system

Editorial / fashion-magazine aesthetic based on a Pinterest UGC-portfolio
template the owner liked:

- Cream background `#F4F1EA`, greige `#D9D2C4`, ink `#1C1B19`,
  brown `#6B5D4F`, olive `#7A7A63` (CSS vars in `css/style.css`)
- Playfair Display serif headlines, Inter body, pill-shaped outline tags
- Muted earth-tone `.photo` placeholder blocks stand in for real photos —
  swap by adding a `background-image` or `<img>`; labels mark each slot
- No bright colors, no gradients (except photo overlays), lots of white space

## Page sections (in order)

Cover → About Me → Career Timeline → Case Study → Creative Work →
Campaign Concept → Photography → Events → Employer Branding →
Marketing Ideas → Get in Touch. Content is real (from the owner's bio):
Louis Vuitton career (Client Advisor → Watches & Jewelry → HR → Retail HR
Coordinator), the recruitment-website case study, values manifesto.
Keep numbers honest — no invented metrics.

The Case Study section has a CSS laptop mockup whose screen auto-pans
through `images/case-study-site.jpg` (full-page capture of the real
recruitment site she led: https://job.mynavi.jp/conts/n/psp/27/54406_27LVJ/).
The pan is a pure-CSS `object-position` animation; respects
prefers-reduced-motion.

## Outstanding work

- **Portrait photo:** the owner wants her portrait in the About section,
  cropped waist-up (she prefers the midriff covered — keep the crop above
  the navel), full quality, 3:4 ratio to fit `.photo--portrait`. In the
  previous session chat image uploads never landed on disk, so the photo
  was never received as a file. Get it via chat upload (check
  `/root/.claude/uploads/`) or ask her to upload it to this repo branch
  via GitHub web UI.
- Other `.photo` placeholder slots (creative work grid, photography,
  events, phone screens) still await real images.
- Repo name `portfolio-` has a trailing dash; renaming to `portfolio`
  would clean up the URL (owner was told; her call).

## Notes for capturing the recruitment site

The site resets headless-Chromium connections. Working recipe (previous
session): Playwright renders while every request is fulfilled via Node
fetch (`NODE_USE_ENV_PROXY=1 NODE_EXTRA_CA_CERTS=/root/.ccr/ca-bundle.crt`),
then full-page JPEG screenshot. Environment network policy must allow
`job.mynavi.jp`. Chromium also needs the proxy CA imported into NSS
(`certutil -d sql:$HOME/.pki/nssdb -A -t "C,," -n ccr -i /root/.ccr/agent-proxy-ca.crt`).
