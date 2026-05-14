'use client';

import { NODES, type NodeId } from '@/content/tree-nodes';
import { useClimbed } from '@/lib/tree/useClimbed';
import { stateOf, closestUnmetPrereq } from '@/lib/tree/graph';
import { InlineMarkdown } from './InlineMarkdown';

const REGION_LABEL: Record<string, string> = {
  root: 'Root', soft: 'Non-technical', cluster: 'Critical-learn cluster', tech: 'Technical · building',
};
const REGION_DOT: Record<string, string> = {
  root: '#f5efd1', soft: '#6db1ff', cluster: '#ff8c5a', tech: '#c5b572',
};

export function PanelContent({
  id,
  onJumpTo,
}: {
  id: NodeId;
  onJumpTo: (id: NodeId) => void;
}) {
  const node = NODES[id];
  const { climbed, climb, unclimb } = useClimbed();
  const state = stateOf(id, climbed);
  const hint = state === 'locked' ? closestUnmetPrereq(id, climbed) : null;

  return (
    <div className="panel-content">
      <div className="panel-crumb">{regionCrumb(node.region)}</div>
      <h3 className="panel-name">{node.label}.</h3>
      <div className="panel-tag"><em>{node.tag}</em></div>

      <div className="panel-meta">
        <span><span className="dot" />{node.timeToLearn}</span>
        <span style={{ color: REGION_DOT[node.region] }}>
          <span className="dot" style={{ background: REGION_DOT[node.region] }} />
          {REGION_LABEL[node.region]}
        </span>
      </div>

      {node.chips.length > 0 && (
        <div className="panel-chips">
          {node.chips.map((c) => <span key={c} className="chip">{c}</span>)}
        </div>
      )}

      {hint && (
        <div className="panel-hint">
          <span className="panel-hint-text">
            Easier if you&apos;ve climbed <strong>{NODES[hint].label}</strong> first.
          </span>
          <button
            type="button"
            className="panel-hint-jump"
            onClick={() => onJumpTo(hint)}
          >
            Jump to {NODES[hint].label} &rarr;
          </button>
        </div>
      )}

      {node.comingSoon ? (
        <>
          <hr />
          <div className="panel-coming-soon">
            <div className="panel-section-label">⌁ Content pending</div>
            <p className="panel-body">
              The author is still writing this rung. Mark it climbed for now and come back later for the full breakdown.
            </p>
          </div>
        </>
      ) : (
        <>
          <hr />

          <div className="panel-section-label">§ What it is</div>
          <p className="panel-body"><InlineMarkdown text={node.whatItIs} /></p>

          <hr />

          <div className="panel-section-label">↑ How to learn it</div>
          <ol className="panel-how">
            {node.howToLearn.map((step, i) => (
              <li key={i}><InlineMarkdown text={step} /></li>
            ))}
          </ol>

          {node.resources.length > 0 && (
            <>
              <hr />
              <div className="panel-section-label">⌁ Resources</div>
              <div className="panel-resources">
                {node.resources.map((r, i) => (
                  <a
                    key={i}
                    href={r.href}
                    target={r.internal ? undefined : '_blank'}
                    rel={r.internal ? undefined : 'noreferrer'}
                  >
                    <span className="src">{r.source}</span>
                    <span className="title">{r.title}</span>
                    <span className="arrow">{r.internal ? '↓' : '↗'}</span>
                  </a>
                ))}
              </div>
            </>
          )}
        </>
      )}

      <div className="panel-actions">
        <button
          type="button"
          className={`btn ${state === 'climbed' ? 'btn-done' : 'btn-primary'}`}
          onClick={() => (state === 'climbed' ? unclimb(id) : climb(id))}
        >
          {state === 'climbed' ? '✓ Complete · click to un-mark' : '↑ Mark as complete'}
        </button>
        {node.essayAnchor && (
          <a className="btn btn-secondary" href={`/${node.essayAnchor}`}>Read the essay &rarr;</a>
        )}
      </div>

      <div className="panel-footer">progress saved locally · nothing leaves your browser</div>
    </div>
  );
}

function regionCrumb(region: string) {
  switch (region) {
    case 'root': return '⌂ The shared root';
    case 'soft': return '↓ Non-technical branch';
    case 'cluster': return '◇ Critical-learn cluster';
    case 'tech': return '↓ Technical · building';
    default: return '';
  }
}
