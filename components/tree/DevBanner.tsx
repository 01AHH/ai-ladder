'use client';

import { useEffect, useState } from 'react';

const STORAGE_KEY = 'ai-ladder:tree-dev-banner-dismissed';

export function DevBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    try {
      if (window.sessionStorage.getItem(STORAGE_KEY) !== '1') setShow(true);
    } catch {
      setShow(true);
    }
  }, []);

  function dismiss() {
    setShow(false);
    try { window.sessionStorage.setItem(STORAGE_KEY, '1'); } catch {}
  }

  if (!show) return null;

  return (
    <div className="dev-banner-backdrop" role="dialog" aria-modal="true" aria-labelledby="dev-banner-title">
      <div className="dev-banner">
        <div className="dev-banner-label">⚠ heads up</div>
        <h2 id="dev-banner-title" className="dev-banner-title">This page is still in development.</h2>
        <p className="dev-banner-body">
          The skill tree is a work in progress. There are bugs. Some nodes are placeholders.
          Click around anyway — feedback welcome.
        </p>
        <button type="button" className="dev-banner-dismiss" onClick={dismiss}>
          got it →
        </button>
      </div>
    </div>
  );
}
