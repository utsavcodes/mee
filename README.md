# utsavpoudel.com.np

Personal site of **Utsav Poudel** — AI researcher in human-computer interaction, affective
computing and digital health. Static HTML, no build step, served by GitHub Pages at
[utsavpoudel.com.np](https://utsavpoudel.com.np).

## Structure

```
index.html          Landing — minimal type over an interactive graph-network canvas
about/index.html    About & research — bio, publications, positions, Fulcrum, awards, FAQ, contact
assets/css/main.css Design system: white ground, black type, one motion vocabulary
assets/js/main.js   Nav, scroll reveals, counters, FAQ accordion
assets/js/hero.js   Landing canvas animation (no dependencies)
assets/m/           Icons and social images
sitemap.xml         Submitted to Google Search Console
robots.txt          Crawl policy
404.html            Not-found page
CNAME               Custom domain
```

## Editing

Everything is hand-written HTML — open the file and edit the text. There is no framework,
no package.json and nothing to install. To preview locally:

```bash
python3 -m http.server 8080
```

Then open <http://localhost:8080>.

## SEO notes

- Both pages carry JSON-LD: `Person`, `WebSite`, `ProfilePage`, plus `AboutPage`,
  `ItemList` of publications and `FAQPage` on `/about/`.
- The `sameAs` array is the important one — it ties this domain to Google Scholar,
  ResearchGate, LinkedIn, GitHub, Medium, Google Sites and Fulcrum. Keep it in sync
  whenever a profile is added or a handle changes.
- Publication counts and citation numbers appear on `/about/`. They are the only
  figures on the site that go stale; the live list is linked out to Google Scholar.
- Update `sitemap.xml` `lastmod` when a page changes substantially.
