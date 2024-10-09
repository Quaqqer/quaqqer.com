"use client";

import { useSignal } from "@preact/signals-react";
import { assert } from "chai";
import { useEffect, useMemo, useState } from "react";

import Button from "@/components/Button";
import { Game } from "@/lib/projects/gol";
import { darkTheme } from "@/lib/projects/gol/theme";

export default function GameOfLifeComponent(): JSX.Element {
  const paused = useSignal(false);

  const [canvasRef, setCanvasRef] = useState<HTMLCanvasElement | null>(null);

  const gol = useMemo(() => new Game(25, 25), []);

  useEffect(() => {
    if (canvasRef === null) return;

    const ctx = canvasRef.getContext("2d");
    assert(ctx !== null);

    gol.render(ctx, darkTheme);

    const interval = setInterval(() => {
      if (!paused.value) {
        gol.tick();
        gol.render(ctx, darkTheme);
      }
    }, 1000);

    return () => void clearInterval(interval);
  }, [gol, canvasRef, paused.value]);

  return (
    <div>
      <canvas ref={setCanvasRef} width="500" height="500" />
      <div className="mt-4 flex flex-row justify-center space-x-3">
        <Button
          sz="lg"
          variant="secondary"
          onClick={() => (paused.value = !paused.peek())}
        >
          {paused.value ? "Resume" : "Pause"}
        </Button>

        <Button
          sz="lg"
          variant="secondary"
          onClick={() => {
            gol.tick();
            const ctx = canvasRef?.getContext("2d");
            if (ctx) gol.render(ctx, darkTheme);
          }}
        >
          Tick
        </Button>

        <Button
          sz="lg"
          variant="secondary"
          onClick={() => {
            gol.randomize();
            const ctx = canvasRef?.getContext("2d");
            if (ctx) gol.render(ctx, darkTheme);
          }}
        >
          Randomize
        </Button>
      </div>
    </div>
  );
}
