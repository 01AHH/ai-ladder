"use client";

type Props = {
  text: string;
  state: "idle" | "streaming" | "done" | "error";
  errorMessage?: string;
};

export function StreamedOutput({ text, state, errorMessage }: Props) {
  if (state === "idle" && !text) return null;

  return (
    <div className="mt-4 rounded-md bg-stone-50 p-4 text-stone-800 ring-1 ring-stone-200">
      {state === "error" && (
        <p className="text-sm text-red-700">{errorMessage ?? "Claude couldn't generate. Try again."}</p>
      )}
      {(state === "streaming" || state === "done") && (
        <p className="whitespace-pre-wrap text-sm leading-relaxed">{text}</p>
      )}
      {state === "streaming" && (
        <span className="ml-1 inline-block h-3 w-1.5 animate-pulse bg-stone-400 align-baseline" />
      )}
    </div>
  );
}
