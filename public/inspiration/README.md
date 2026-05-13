# Inspiration assets

Self-hosted media for the per-rung Inspiration galleries.

## Path convention

```
public/inspiration/<rung-id>/<slug>.{webp,jpg,mp4,webm}
```

`<rung-id>` matches the keys in `content/inspiration.ts`:

- `prompting`
- `vibe-coding`
- `coding-agents`
- `apis`
- `knowledge-systems`
- `integrated-systems`

## Budget

- **Images** — WebP preferred. `next/image` resizes automatically. Aim for <200 KB source.
- **Videos** — Muted loops only. <500 KB each, <10 s. WebM (VP9) preferred, MP4 (h.264) fallback. No audio track.

## Adding media to an item

In `content/inspiration.ts`, add a `media` field to any `InspoItem`:

```ts
// image
media: { kind: "image", src: "/inspiration/vibe-coding/v0.webp", alt: "v0 generating a page", ratio: 16/9 }

// self-hosted video
media: { kind: "video", src: "/inspiration/coding-agents/claude-code.webm", ratio: 16/9 }

// youtube
media: { kind: "youtube", id: "abc123XYZ" }

// loom
media: { kind: "loom", id: "abc123XYZ" }
```

Omit `media` for a text-only card.
