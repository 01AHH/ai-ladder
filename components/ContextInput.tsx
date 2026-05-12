"use client";

type Props = {
  value: string;
  onChange: (v: string) => void;
};

export function ContextInput({ value, onChange }: Props) {
  return (
    <section id="context-input" className="mx-auto max-w-2xl px-6 pt-16 pb-12">
      <h1 className="text-3xl font-semibold tracking-tight">AI Ladder</h1>
      <p className="mt-2 text-stone-600">
        Six rungs. See one vivid example tailored to you, then take one small step.
      </p>
      <label className="mt-8 block">
        <span className="text-sm font-medium text-stone-800">
          Tell Claude about you. What do you do, what do you care about, what are you stuck on?
        </span>
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={4}
          className="mt-2 w-full resize-y rounded-md border border-stone-300 bg-white px-3 py-2 text-stone-900 shadow-sm focus:border-stone-500 focus:outline-none"
          placeholder="I'm a real estate agent who hates spreadsheets..."
        />
      </label>
    </section>
  );
}
