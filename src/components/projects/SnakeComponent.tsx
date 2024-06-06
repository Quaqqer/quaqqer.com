"use client";

import { assert } from "chai";
import { ReactNode, useCallback, useEffect, useMemo, useState } from "react";

import { Game } from "@/lib/projects/snake";
import * as snakeRenderer from "@/lib/projects/snake/renderer";

export default function SnakeComponent(): ReactNode {
  const [canvasRef, setCanvasRef] = useState<HTMLCanvasElement | null>(null);
  const endGame = useCallback((score: number) => {}, []);

  const snake = useMemo(() => new Game(endGame), [endGame]);

  useEffect(() => {
    if (canvasRef !== null) {
      const ctx = canvasRef.getContext("2d");

      assert(ctx !== null);

      const stopper = snake.run(ctx, canvasRef);
      return stopper;
    }
  }, [canvasRef, snake]);

  return (
    <canvas
      ref={setCanvasRef}
      tabIndex={1}
      width={snakeRenderer.TILES_H * snakeRenderer.TILE_SIZE}
      height={snakeRenderer.TILES_V * snakeRenderer.TILE_SIZE}
    />
  );
}
