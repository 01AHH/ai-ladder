"use client";

import { rungs, type Rung as RungType } from "@/content/rungs";
import { InspirationGallery } from "./InspirationGallery";
import { GenerateDemo } from "./GenerateDemo";
import { renderInlineMarkdown } from "./markdown";
import { EssayBlock, ClaudeMdSample, RepoCta } from "./RungExtras";

type Props = {
  rung: RungType;
  getContext: () => string;
};

const TOTAL = String(
  rungs.filter((r) => Number.isInteger(r.number)).length,
).padStart(2, "0");

function fmtNum(n: number): string {
  return n < 10 ? `0${n}` : String(n);
}

export function Rung({ rung, getContext }: Props) {
  const isClimax = rung.id === "skills";

  const meta = (
    <div className="rung-meta">
      <span className="step">↑ Step {rung.number} of {TOTAL}</span>
      <span>{rung.tagline}</span>
      <span>{rung.time}</span>
    </div>
  );

  const tools = rung.tools.length > 0 && (
    <div className="rung-tools">
      {rung.tools.map((t) => (
        <span key={t} className="chip">
          {t}
        </span>
      ))}
    </div>
  );

  if (isClimax) {
    return (
      <section
        className="scene rung climax"
        id={`rung-${rung.number}`}
        data-scene-key={rung.sceneKey}
      >
        <div className="scene-inner">
          <div className="rung-stage">
            <div className="climax-stamp">Where the agent gets opinions</div>
            <h2 className="rung-numeral">{fmtNum(rung.number)}</h2>
            <div className="rung-meta" style={{ marginTop: 12 }}>
              <span className="step">↑ Step {rung.number} of {TOTAL}</span>
              <span>{rung.tagline}</span>
            </div>
            <h3 className="rung-name">
              <em>{rung.name}.</em>
            </h3>
            <p className="rung-plain">{rung.plain}</p>
            {rung.crit && (
              <p className="crit">{renderInlineMarkdown(rung.crit)}</p>
            )}
          </div>

          <div className="rung-body">
            <p className="rung-def">{renderInlineMarkdown(rung.definition)}</p>

            <GenerateDemo rung={rung} getContext={getContext} />

            <section className="inspo shelf-inspo">
              <div className="inspo-label">
                <span>⌁ Your skill shelf · a few examples</span>
                <span className="what">(install one)</span>
              </div>
              <div className="shelf">
                {rung.skills?.map((s) => (
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
            </section>

            <InspirationGallery rungId={rung.id} />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      className="scene rung"
      id={`rung-${rung.number}`}
      data-scene-key={rung.sceneKey}
    >
      <div className="scene-inner">
        <div className="rung-stage">
          {meta}
          <h2
            className={`rung-numeral${
              Number.isInteger(rung.number) ? "" : " sub"
            }`}
          >
            {fmtNum(rung.number)}
            <span className="of">/{TOTAL}</span>
          </h2>
          <h3 className="rung-name">
            <em>{rung.name}.</em>
          </h3>
          <p className="rung-plain">{rung.plain}</p>
          {tools}
        </div>

        <div className="rung-body">
          <p className="rung-def">{renderInlineMarkdown(rung.definition)}</p>

          {rung.mediaImage && (
            <figure className="rung-media">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={rung.mediaImage.src}
                alt={rung.mediaImage.alt}
                loading="lazy"
              />
              {rung.mediaImage.caption && (
                <figcaption>{rung.mediaImage.caption}</figcaption>
              )}
            </figure>
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

          <GenerateDemo rung={rung} getContext={getContext} />

          <InspirationGallery rungId={rung.id} />
        </div>
      </div>
    </section>
  );
}
