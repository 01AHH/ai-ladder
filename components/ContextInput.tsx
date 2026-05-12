"use client";

type Props = {
  value: string;
  onChange: (v: string) => void;
};

const SUGGESTIONS = [
  { label: "paediatric nurse, Lagos", fill: "I'm a paediatric nurse running a small clinic in Lagos." },
  { label: "PM, logistics", fill: "I'm a product manager at a B2B logistics startup." },
  { label: "solo ceramics shop", fill: "I run a one-person Etsy shop selling handmade ceramics." },
  { label: "history teacher", fill: "I'm a high-school history teacher in rural Vermont." },
];

export function ContextInput({ value, onChange }: Props) {
  const filed = value.trim().length > 0;
  return (
    <div className="context" id="context-input">
      <div className="context-label">
        <span>§ Tell us who you are</span>
        <span className={`who${filed ? " filed" : ""}`}>{filed ? "filed" : "unread"}</span>
      </div>
      <div className="context-input">
        <span className="marker">¶</span>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="I'm a real estate agent in Sydney…"
          autoComplete="off"
          spellCheck={false}
        />
      </div>
      <div className="context-hint">
        <span>try —</span>
        {SUGGESTIONS.map((s) => (
          <button key={s.label} onClick={() => onChange(s.fill)}>
            {s.label}
          </button>
        ))}
      </div>
    </div>
  );
}
