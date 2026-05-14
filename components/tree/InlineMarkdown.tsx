import type { ReactNode } from 'react';

/** Renders *italic* and **bold** in a string. No other markdown. */
export function InlineMarkdown({ text }: { text: string }) {
  const re = /(\*\*[^*]+\*\*|\*[^*]+\*)/g;
  const out: ReactNode[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) out.push(text.slice(last, m.index));
    const token = m[0];
    if (token.startsWith('**')) out.push(<strong key={m.index}>{token.slice(2, -2)}</strong>);
    else out.push(<em key={m.index}>{token.slice(1, -1)}</em>);
    last = m.index + token.length;
  }
  if (last < text.length) out.push(text.slice(last));
  return <>{out}</>;
}
