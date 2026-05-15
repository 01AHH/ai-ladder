'use client';

export function LegendBar() {
  return (
    <div className="tree-legend">
      <span className="legend-item"><span className="leg-dot" style={{ background: '#E8C76A', color: '#E8C76A' }} /> Root</span>
      <span className="legend-item"><span className="leg-dot" style={{ background: '#6BA0D6', color: '#6BA0D6' }} /> Productivity</span>
      <span className="legend-item"><span className="leg-dot" style={{ background: '#D97757', color: '#D97757' }} /> Essential</span>
      <span className="legend-item"><span className="leg-dot" style={{ background: '#E8C76A', color: '#E8C76A', opacity: 0.7 }} /> Building</span>
      <span className="legend-item"><span className="leg-line dashed" /> Skills' bridges</span>
      <span className="legend-item"><span className="leg-line solid" /> Recommended path</span>
    </div>
  );
}
