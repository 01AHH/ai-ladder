'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function TabNav({ theme = 'dark' }: { theme?: 'dark' | 'light' }) {
  const path = usePathname();
  const onTree = path?.startsWith('/tree') ?? false;
  return (
    <nav className={`tab-nav tab-nav-${theme}`} aria-label="Page mode">
      <Link href="/" className={`tab-link ${!onTree ? 'tab-link-active' : ''}`}>Essay</Link>
      <Link href="/tree" className={`tab-link ${onTree ? 'tab-link-active' : ''}`}>The tree</Link>
    </nav>
  );
}
