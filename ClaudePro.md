# ClaudePro.md — Site Improvements Log

Snapshot of all Claude sessions, latest changes at the top.

---

## Session — May 15, 2026 (Story-first redesign)

### What changed

**Redesigned the homepage to be story-first, not photo/trip-first.**

#### Layout changes
- **Hero right panel** — replaced the animated route map + photo-count tags with a dark "Latest Story" card showing the story title, a pull quote, tag, read time, and a "Read Story →" link. Story count ("14 stories written") sits quietly in the corner.
- **Stories section moved to first** — it now appears immediately after the hero, before Trips.
- **Featured essay block** — large editorial card at the top of the Stories section for the most important piece. Has a title, full excerpt, art panel on the right with a pull quote.
- **Story cards** — 4-card grid below the featured block. Each card has a colored art band, category tag, title, excerpt, and read time.
- **Trips redesigned** — changed from photo album cards to an editorial row list: emoji icon + title + description + "X stories" pill. Cleaner, less photo-dependent.
- **Photo gallery strip removed** — the scrolling dark strip of photo thumbnails is gone entirely.

#### Story content
All stories are now **general life reflections**, not trip-specific:
- Featured: "The Thing Nobody Tells You About Slowing Down" (on learning to be still after a busy career)
- "What My Kids Got Right That I Had to Learn the Hard Way" (Family)
- "On Starting Over at an Age When You're Supposed to Be Done" (Change)
- "The Books That Quietly Changed How I Think About Time" (Reading)
- "The Friendships That Survived — and the Ones That Didn't" (Friendship)

#### Style cleanup (same session)
- Hero story tag changed from a pill/badge with background to plain uppercase text
- "Read Story →" link: removed the `border-bottom` underline, now clean small-caps
- Hero pull quote: removed the left border, just plain italic text
- Story category tags (REFLECTION, FAMILY, etc.): changed from green to subtle gray — less loud
- Dot separator between tag and read-time is now CSS-only (no extra HTML element)

### How to add a new story

Everything is **hardcoded HTML** — there is no CMS or database. The "Write a new story" button on the page is a placeholder with no function.

**To add a story card to the grid:**

1. Open `index.html`
2. Find the `<!-- Story grid -->` comment inside `<section id="stories">`
3. Copy one of the existing `<a href="#" class="story-card fade-up">` blocks
4. Paste it before the `<button class="story-add">` element
5. Update: emoji in `story-card-art`, the tag text, `story-title`, `story-excerpt`, and the date/read-time in `story-byline`
6. Change the art color class: `sc-sky` (blue), `sc-sage` (green), `sc-gold` (gold), `sc-rust` (orange)

**To update the featured essay (big card at the top of Stories):**

Find the `<a href="#" class="story-feature fade-up">` block and update:
- `story-tag` — category label
- `story-feature-title` — headline
- `story-feature-excerpt` — paragraph excerpt
- `story-byline` — date, read time, type
- `story-feature-art` — change the emoji
- `story-feature-quote` — the italic pull quote on the right

**To update the hero "Latest Story" card (top right of page):**

Find `<div class="hero-story-card">` and update:
- `hero-story-title` — headline
- `hero-story-pull` — the italic quote shown below
- `hero-story-tag` — category (e.g. Reflection, Family)
- `hero-story-time` — read time and date

**To add a trip:**

Find `<div class="trips-list">` and copy one `<a href="#" class="trip-row fade-up">` block. Update the emoji, location, title, description, date, and story count. Change the marker color class: `trip-marker-rust`, `trip-marker-sky`, or `trip-marker-sage`.

### Rollback

```bash
# Go back to before today's redesign
git checkout 32e6b15 -- index.html style.css
```

---

## Session — May 10, 2026 (Code quality cleanup)

### TL;DR

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
