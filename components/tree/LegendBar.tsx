'use client';

export function LegendBar() {
  return (
    <div className="tree-legend">
      <span><span className="dot dot-root" />Root</span>
      <span><span className="dot dot-soft" />Non-technical</span>
      <span><span className="dot dot-cluster" />Critical-learn cluster</span>
      <span><span className="dot dot-tech" />Technical · building</span>
      <span className="legend-sep" />
      <span><span className="swatch swatch-bridge" />Skills' bridges to branches</span>
      <span><span className="swatch swatch-cluster" />Cluster cross-links</span>
    </div>
  );
}
