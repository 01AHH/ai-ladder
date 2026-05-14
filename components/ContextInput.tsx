"use client";

type Props = {
  value: string;
  onChange: (v: string) => void;
};

const SUGGESTIONS = [
  { label: "paediatric nurse, Lagos", fill: "I'm a paediatric nurse running a small clinic in Lagos. I've used ChatGPT once or twice." },
  { label: "PM, logistics", fill: "I'm a product manager at a B2B logistics startup. I use Claude every day for prompting and have shipped one v0 prototype." },
  { label: "solo ceramics shop", fill: "I run a one-person Etsy shop selling handmade ceramics. I've never really used AI." },
  { label: "history teacher", fill: "I'm a high-school history teacher in rural Vermont. I use ChatGPT to draft worksheets but that's it." },
];

export function ContextInput({ value, onChange }: Props) {
  const filed = value.trim().length > 0;
  return (
    <div className="context" id="context-input">
      <div className="context-label">
        <span>§ Begin here</span>
        <span className={`who${filed ? " filed" : ""}`}>{filed ? "filed" : "unread"}</span>
      </div>
      <h2 className="context-question">
        Tell us <em>who you are</em>, what your knowledge is of AI, and the
        problems you bump into in your day to day work.
      </h2>
      <div className="context-input">
        <span className="marker">¶</span>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="I'm a real estate agent in Sydney, I use ChatGPT a few times a week…"
          autoComplete="off"
          spellCheck={false}
        />
      </div>
      <div className="context-hint">
        <span>try:</span>
        {SUGGESTIONS.map((s) => (
          <button key={s.label} onClick={() => onChange(s.fill)}>
            {s.label}
          </button>
        ))}
      </div>
      <div className="context-cue">
        <a href="#ladder-intro">then climb the ladder ↓</a>
      </div>
    </div>
  );
}
