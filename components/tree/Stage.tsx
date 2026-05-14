'use client';

import { TabNav } from './TabNav';
import { Galaxy } from './Galaxy';
import type { ReactNode } from 'react';

export function Stage({ children }: { children: ReactNode }) {
  return (
    <div className="tree-stage">
      <Galaxy />
      <div className="tree-tabs"><TabNav theme="dark" /></div>
      <div className="tree-stage-inner">{children}</div>
    </div>
  );
}
