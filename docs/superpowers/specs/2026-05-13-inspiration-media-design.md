# Inspiration Gallery — Media Redesign

**Date:** 2026-05-13
**Status:** Approved
**Scope:** `components/InspirationGallery.tsx`, `content/inspiration.ts`, `app/globals.css`, new `public/inspiration/` directory

## Problem

The current Inspiration section is a tight 2-column grid of text-only cards (tool / title / blurb / url). It conveys *what* people built but not *what it looks like or feels like*. People learn differently — some want a screenshot, some want a 10-second loop, some want a launch video, some want to read. The gallery only supports the last mode.

## Goal

Turn the per-rung Inspiration section into a Pinterest-style masonry gallery where each card can carry one of five media types (image, self-hosted video, YouTube, Loom, or none). One artifact per card. Honour the editorial feel of the rest of the site (Instrument Serif, warm paper, sharp edges).

## Non-goals

- Tweet / X embeds (heavy, off-brand).
- Carousels or multi-media per card (Pinterest discipline: if you have two good clips, that's two cards).
- A CMS or admin UI for managing media. Curated by hand in `inspiration.ts`.
- Auto-fetching Open Graph images. Curated only.
- Full content backfill in this change. Schema + component + a handful of seeded cards; the rest stay text-only and get filled in over time.

## Decisions

### Schema (`content/inspiration.ts`)

```ts
export type InspoMedia =
  | { kind: "image";   src: string; alt: string; ratio?: number }
  | { kind: "video";   src: string; ratio?: number; poster?: string }
  | { kind: "youtube"; id: string }
  | { kind: "loom";    id: string };

export type InspoItem = {
  tool: string;
  title: string;
  blurb: string;
  url: string;
  media?: InspoMedia;
};
```

- `media` is optional. Absent = renders as the current text-only card.
- `ratio` is `width / height`. Default `16 / 9`.
- `src` for `image` and `video` is a path under `/public/inspiration/<rung-id>/`.
- `youtube` / `loom` reference IDs only — the component composes the embed URL.

### Layout

CSS multi-column masonry. No JS, no library.

```css
.inspo-grid {
  column-count: 3;
  column-gap: 14px;
}
.inspo-card {
  break-inside: avoid;
  margin-bottom: 14px;
  display: block;
}
@media (max-width: 900px) { .inspo-grid { column-count: 2; } }
@media (max-width: 540px) { .inspo-grid { column-count: 1; } }
```

- Items flow top-to-bottom per column. Acceptable for an editorial page.
- Cards vary in height by media ratio + blurb length. That variety is the feature.
- Existing per-rung target raised from ~4 to **6–10 items**, variable. Don't fake variety for rungs where the world doesn't offer it.

### Rendering rules

Each card is wrapped in a single `<a target="_blank" rel="noreferrer noopener" href={url}>`. Media renders above the existing `tool / title / blurb` block.

| Media kind | Element | Notes |
|---|---|---|
| `image` | `next/image` | `loading="lazy"`, `sizes` set for column widths, intrinsic ratio. |
| `video` | `<video autoplay muted loop playsinline preload="metadata" poster>` | IntersectionObserver pauses when off-screen so we don't burn 30 simultaneous players. |
| `youtube` | `<iframe loading="lazy" src="https://www.youtube-nocookie.com/embed/{id}">` | 16:9 ratio wrapper. |
| `loom` | `<iframe loading="lazy" src="https://www.loom.com/embed/{id}">` | 16:9 ratio wrapper. |
| (none) | text-only | Same as current card body, just inside the new masonry flow. |

Aspect-ratio wrappers prevent layout shift. Sharp edges (no rounded corners) to match site language.

### Assets

- Path convention: `public/inspiration/<rung-id>/<slug>.{webp,jpg,mp4,webm}`.
- Video budget: <500 KB each, <10 s loop, muted, no audio track, WebM (VP9) preferred with MP4 (h.264) fallback if needed.
- Image budget: serve WebP, let `next/image` handle resizing.
- Initial seeding: schema/component/CSS land first with **all existing 24 cards converted to the new shape but without media** (they render text-only in the new masonry). Real media gets added incrementally in follow-up commits as Arthur picks artifacts. The component must therefore look correct when most cards are text-only.

### Dark variant (Rung 5)

The existing `.rung-5 .inspo-*` overrides keep working. Card backgrounds invert; media itself renders the same. Add `.rung-5 .inspo-card` border-color tweaks if contrast needs it after a visual check.

## Files touched

1. `content/inspiration.ts` — extend types, leave existing entries' data unchanged (no `media` field added in this change).
2. `components/InspirationGallery.tsx` — render per media kind, masonry container, IntersectionObserver for videos.
3. `app/globals.css` — replace `.inspo-grid` rules with column-masonry, add `.inspo-media` styles per kind, update `.rung-5` overrides where needed.
4. `public/inspiration/` — new directory. Include a short `README.md` explaining the path convention so future media drops are self-documenting.

## Testing

Manual only (consistent with the rest of this project):

- Dev server: each rung's gallery renders without console errors.
- Resize: 3 → 2 → 1 columns at 900 px and 540 px breakpoints.
- Rung 5 (dark): cards invert correctly; media still renders.
- Add a single test card with each media kind under one rung, verify all five render correctly, then revert before commit.
- Lighthouse / network panel sanity check: page weight shouldn't balloon when all cards are still text-only.

## Open items / follow-up

- Content sourcing: Arthur backfills real assets over time. Out of scope for this change.
- `lite-youtube-embed` poster pattern is a deferred optimisation — only if YouTube embeds start hurting perf once content lands.
- Tweet/X embeds revisited only if a specific item demands it.
