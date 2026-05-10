# ClaudePro.md — Site Improvements Session

Snapshot of changes made on **May 10, 2026** during a Claude session, plus context and open items to pick up later.

## TL;DR

Code-quality cleanup of the static site (`index.html`, `style.css`, `main.js`). Same look and behavior, cleaner internals. **No auth changes** — the password gate is still client-side only, which means anyone can View Source and read all content. See "The privacy caveat" below.

## Session context

Stated priority: **code quality & structure**. The session also touched on accessibility, image-handling refactor, and a discussion of how to make the password gate actually private (no decision made — paused).

A separate scope question was raised at the end of the session: whether the custom site is even the right tool, or whether sharing Google Photos albums directly would serve the goal better. **No decision made.** If the site is abandoned, most of the open items below become moot.

## What changed

### `index.html`
- Wrapped content in a single `<main>` landmark.
- Added meta tags: `description`, `robots="noindex,nofollow"`, Open Graph tags for nicer link previews.
- Added an inline-SVG favicon (no extra HTTP request).
- Each `<section>` now has `aria-labelledby` pointing at its `<h2>`.
- Replaced `[Your Name]` placeholder in About with `Ashwani`. **Change this if the site is meant to represent someone else** — there's a `<!-- TODO -->` comment right above the line.
- Removed all inline `style=""`, `onclick=""`, and `onerror=""` attributes (moved to CSS / JS).
- Added a hidden `<label>` for the password input.
- Converted "Add a new trip" and "Write a new letter" `<div>` elements into real `<button>` elements so they're keyboard-focusable.
- All 14 `<img>` tags now use `data-fallback="🏔"` (data attribute) instead of an 80-character inline `onerror` handler.

### `style.css`
- New utility classes: `.cover-img`, `.fallback-emoji`, `.visually-hidden`, `.nav-letters`.
- New rules to replace inline styles: `#stories` background, `.story-card:not(.featured) .story-img` margin, `.hero { padding: 0 }`.
- `scroll-margin-top: 60px` on sections so the sticky nav doesn't overlap anchor jumps.
- `@media (prefers-reduced-motion: reduce)` block — turns off animations for users who've requested less motion.
- `:focus-visible` outlines for keyboard users.

### `main.js`
- Image fallback logic moved out of inline `onerror` into a single `setupImageFallbacks()` that reads `data-fallback` and swaps in a styled emoji `<span>`.
- Password button uses `addEventListener('click', ...)` instead of inline `onclick`.
- Password overlay now traps Tab inside the password box and auto-focuses the input on first load.
- Fade-up animation stagger now uses sibling index instead of IntersectionObserver entry order, so the cascade is consistent.
- Top of file has an honest comment that this is a soft gate.

## The privacy caveat (important)

The password gate is **client-side only**. The browser receives the entire HTML before the password is checked, so anyone who:

- right-clicks → View Source, OR
- runs `curl https://azashwani.github.io`, OR
- opens browser DevTools

…can read every word on the page, including the letters and the "sealed" partner letter. If actual privacy matters when you pick this up, you have three real options:

1. **Netlify password protection** — connect this repo to Netlify, turn on site-wide password (~$19/member/month historically; verify current pricing at netlify.com/pricing), or write a free Edge Function for HTTP Basic Auth (~15 lines of JS). Server-side gate.
2. **Cloudflare Access** in front of GitHub Pages or Netlify — free for up to 50 users, per-user email login, audit trail.
3. **Accept it as a soft gate** and update site copy to be honest that this isn't real privacy.

## Open items (in order of leverage)

1. **Privacy decision** — see above. No code change yet.
2. **Sensitive content in source** — "To My Partner" card is in the HTML. Decide whether to scrub it or to put real auth in front first.
3. **Empty image sources** — trip cards, gallery thumbs, and the about portrait all have `src=""`. They show emoji fallbacks until you paste real photo URLs (Google Photos direct image URLs work).
4. **Empty link destinations** — trip cards, story cards, and letter cards all have `href="#"`. They scroll to top — replace with real destinations when content exists.
5. **Name in About section** — currently "Hi, I'm Ashwani"; change if the site represents someone else.

## How to verify the changes locally

Open `index.html` in a browser:

1. Password overlay should appear. Wrong password → error message. Correct one → overlay disappears and stays gone for the session.
2. Tab through the page with the keyboard — every interactive element should show a rust-colored focus ring.
3. Scroll — sections should fade in with a staggered cascade.
4. Placeholder emojis (🏔 🌊 🏜 etc.) should appear in every photo slot since `src=""` is empty.

## Reverting

Everything is in git. To inspect the diff before pushing:

```bash
git diff HEAD
```

To revert any individual file:

```bash
git checkout -- index.html   # or style.css, main.js
```

## Where to pick up next time

If keeping the site:

1. Decide the privacy strategy (Netlify password, Cloudflare Access, or accept soft gate).
2. Add real photos by pasting Google Photos URLs into the empty `src=""` attributes.
3. Replace `href="#"` placeholders with real link destinations as content gets built.
4. Update the name in the About section if needed.

If abandoning the site for Google Photos albums or similar: nothing else to do. The cleaner code is here in git for whenever / if ever.
