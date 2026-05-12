"use client";

type Props = {
  text: string;
  state: "idle" | "streaming" | "done" | "error";
  errorMessage?: string;
};

export function StreamedOutput({ text, state, errorMessage }: Props) {
  if (state === "idle" && !text) return null;

  const isDone = state === "done";
  return (
    <div className="stream" hidden={state === "idle"}>
      <div className="stream-header">
        <span className={`live${isDone ? " done" : ""}`}>{isDone ? "complete" : "streaming"}</span>
        <span>vignette · rung-specific</span>
      </div>
      {state === "error" ? (
        <p className="stream-error">{errorMessage ?? "Claude couldn't generate. Try again."}</p>
      ) : (
        <div className="stream-body">
          {text}
          {state === "streaming" && <span className="caret" />}
        </div>
      )}
    </div>
  );
}
