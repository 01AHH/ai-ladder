'use client';

import { TabNav } from './TabNav';
import type { ReactNode } from 'react';

export function Stage({ children }: { children: ReactNode }) {
  return (
    <div className="tree-stage">
      <div className="tree-tabs"><TabNav theme="dark" /></div>
      <div className="tree-stage-inner">{children}</div>
    </div>
  );
}
