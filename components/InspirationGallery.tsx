"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { inspiration, type InspoItem, type InspoMedia } from "@/content/inspiration";

type Props = { rungId: string };

export function InspirationGallery({ rungId }: Props) {
  const items = inspiration[rungId] ?? [];
  if (items.length === 0) return null;

  return (
    <section className="inspo">
      <div className="inspo-label">
        <span>⌁ Inspiration · what others have built at this rung</span>
        <span className="what">(steal liberally)</span>
      </div>
      <div className="inspo-grid">
        {items.map((it) => (
          <InspoCard key={it.url} item={it} />
        ))}
      </div>
    </section>
  );
}

function InspoCard({ item }: { item: InspoItem }) {
  return (
    <a
      href={item.url}
      target="_blank"
      rel="noreferrer noopener"
      className="inspo-card"
      data-has-media={item.media ? "true" : "false"}
    >
      {item.media && <Media media={item.media} title={item.title} />}
      <span className="tool">{item.tool}</span>
      <span className="title">
        {item.title}
        <span className="ext">↗</span>
      </span>
      <span className="blurb">{item.blurb}</span>
    </a>
  );
}

function Media({ media, title }: { media: InspoMedia; title: string }) {
  switch (media.kind) {
    case "image":
      return (
        <div
          className="inspo-media inspo-media-image"
          style={{ aspectRatio: media.ratio ?? 16 / 9 }}
        >
          <Image
            src={media.src}
            alt={media.alt}
            fill
            sizes="(max-width: 540px) 100vw, (max-width: 900px) 50vw, 33vw"
          />
        </div>
      );

    case "video":
      return (
        <div
          className="inspo-media inspo-media-video"
          style={{ aspectRatio: media.ratio ?? 16 / 9 }}
        >
          <LoopingVideo src={media.src} poster={media.poster} title={title} />
        </div>
      );

    case "youtube":
      return (
        <div
          className="inspo-media inspo-media-embed"
          style={{ aspectRatio: 16 / 9 }}
        >
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${media.id}?rel=0`}
            title={title}
            loading="lazy"
            allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      );

    case "loom":
      return (
        <div
          className="inspo-media inspo-media-embed"
          style={{ aspectRatio: 16 / 9 }}
        >
          <iframe
            src={`https://www.loom.com/embed/${media.id}`}
            title={title}
            loading="lazy"
            allow="fullscreen"
            allowFullScreen
          />
        </div>
      );
  }
}

function LoopingVideo({
  src,
  poster,
  title,
}: {
  src: string;
  poster?: string;
  title: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            el.play().catch(() => {});
          } else {
            el.pause();
          }
        }
      },
      { threshold: 0.15 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <video
      ref={ref}
      src={src}
      poster={poster}
      title={title}
      muted
      loop
      playsInline
      preload="metadata"
    />
  );
}
