/**
 * Socratic line that lives BETWEEN two rung scenes.
 * Renders the *italic* phrases of the bridge line as accent-coloured.
 */
type Props = {
  uptag: string;
  line: string;
  sceneKey: string;
};

function renderInline(text: string) {
  // Split on *italic* spans. Render each italic span as <em>.
  const out: React.ReactNode[] = [];
  const re = /\*([^*]+)\*/g;
  let last = 0;
  let m;
  let key = 0;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) out.push(text.slice(last, m.index));
    out.push(<em key={key++}>{m[1]}</em>);
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

export function Bridge({ uptag, line, sceneKey }: Props) {
  return (
    <div className="bridge" data-scene-key={sceneKey}>
      <div className="uptag">{uptag}</div>
      <p className="line">{renderInline(line)}</p>
    </div>
  );
}
