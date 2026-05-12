import { inspiration } from "@/content/inspiration";

type Props = { rungId: string };

export function InspirationGallery({ rungId }: Props) {
  const items = inspiration[rungId] ?? [];
  if (items.length === 0) return null;

  return (
    <section className="inspo">
      <div className="inspo-label">
        <span>⌁ Inspiration — what others have built at this rung</span>
        <span className="what">(steal liberally)</span>
      </div>
      <div className="inspo-grid">
        {items.map((it) => (
          <a
            key={it.url}
            href={it.url}
            target="_blank"
            rel="noreferrer noopener"
            className="inspo-card"
          >
            <span className="tool">{it.tool}</span>
            <span className="title">
              {it.title}
              <span className="ext">↗</span>
            </span>
            <span className="blurb">{it.blurb}</span>
          </a>
        ))}
      </div>
    </section>
  );
}
