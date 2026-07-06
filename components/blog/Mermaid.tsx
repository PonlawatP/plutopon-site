"use client";

import { useEffect, useId, useRef, useState } from "react";

/**
 * Renders a mermaid diagram (flowchart, sequence, etc.) on the client.
 * mermaid.js needs the DOM, so this cannot run in a Server Component.
 */
export default function Mermaid({ chart }: { chart: string }) {
  const rawId = useId();
  const id = `mermaid-${rawId.replace(/[^a-zA-Z0-9]/g, "")}`;
  const ref = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const mermaid = (await import("mermaid")).default;
        mermaid.initialize({
          startOnLoad: false,
          theme: "dark",
          securityLevel: "strict",
        });
        const { svg } = await mermaid.render(id, chart.trim());
        if (!cancelled && ref.current) {
          ref.current.innerHTML = svg;
          setError(null);
        }
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Diagram error");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [chart, id]);

  if (error) {
    return (
      <pre className="my-6 overflow-x-auto rounded-lg bg-red-950/40 p-4 text-sm text-red-300">
        mermaid error: {error}
        {"\n\n"}
        {chart}
      </pre>
    );
  }

  return <div ref={ref} className="my-6 flex justify-center overflow-x-auto" />;
}
