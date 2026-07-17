"use client";

import type { Rung as RungType } from "@/content/rungs";
import { renderInlineMarkdown } from "@/components/markdown";
import { EssayBlock, ClaudeMdSample, RepoCta } from "@/components/RungExtras";
import { GenerateDemo } from "@/components/GenerateDemo";
import { InspirationGallery } from "@/components/InspirationGallery";

type Props = {
  rung: RungType;
  getContext: () => string;
  onReadOnPaper: (rungNumber: number) => void;
};

export function RungPanel({ rung, getContext, onReadOnPaper }: Props) {
  return (
    <div className="if-panel" role="region" aria-label={rung.name}>
      <p className="if-panel-plain">{rung.plain}</p>
      <p className="rung-def">{renderInlineMarkdown(rung.definition)}</p>

      {rung.mediaImage && (
        <figure className="rung-media">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={rung.mediaImage.src} alt={rung.mediaImage.alt} loading="lazy" />
          {rung.mediaImage.caption && (
            <figcaption>{rung.mediaImage.caption}</figcaption>
          )}
        </figure>
      )}

      {rung.tools.length > 0 && (
        <div className="rung-tools">
          {rung.tools.map((t) => (
            <span key={t} className="chip">
              {t}
            </span>
          ))}
        </div>
      )}

      {rung.seedExample && (
        <div className="seed">
          <div className="seed-label">Seed example · generic</div>
          <div className="seed-text">{rung.seedExample}</div>
        </div>
      )}

      <RepoCta rungId={rung.id} />
      <EssayBlock essay={rung.essay} />
      <ClaudeMdSample rungId={rung.id} />

      {rung.skills && (
        <div className="shelf">
          {rung.skills.map((s) => (
            <div className="skill-card" key={s.name}>
              <div className="top">
                <span className="tag">{s.tag}</span>
                <span className="name">{s.name}</span>
              </div>
              <div className="trigger">
                <span className="when">Fires when</span>
                {s.trigger}
              </div>
            </div>
          ))}
        </div>
      )}

      <GenerateDemo rung={rung} getContext={getContext} />

      <InspirationGallery rungId={rung.id} />

      {rung.socraticBridge && <p className="if-bridge">{rung.socraticBridge}</p>}
      <button className="if-paper-link" onClick={() => onReadOnPaper(rung.number)}>
        Read this rung on paper →
      </button>
    </div>
  );
}
