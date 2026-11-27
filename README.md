# test-devtronians
test

## About page: hand-over notes and known limitations

- **Replacing the sample story.** Edit only `src/content/story.ts`: replace
  `paragraphs` with the real text **and set `isSample` to `false`**. If
  `isSample` stays `true`, the page labels the real text as a sample.
- **Direct `/about` address.** Routing is a client-side check of
  `window.location.pathname`. The link works only if the host serves
  `index.html` for `/about` (a single-page-app fallback). A plain static host
  without that fallback returns 404 for `/about`. Host setup is out of scope
  for this change.
- **Page language.** `index.html` is `lang="en"` (the home page brand is Latin
  text). The About page sets `lang="th"` while it is shown and restores the
  previous value when it is left. The home page's About link is marked
  `lang="th"`. If more English content is added to the About page, mark it
  per element.
- **Home page checks.** The home page visual checks (dark background,
  centred, `drift` animation, `prefers-reduced-motion`, loads within seconds)
  are kept in `e2e/devtronians.spec.ts`. The earlier "only the word, nothing
  focusable" check was removed on purpose, because the home page now has the
  About link.
