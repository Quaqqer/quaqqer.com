"use client";

import { assert } from "chai";
import { useEffect, useState } from "react";

import * as tetris from "@/lib/projects/tetris/tetris";

export default function TetrisComponent() {
  const [canvasRef, setCanvasRef] = useState<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (canvasRef === null) return;

    const ctx = canvasRef.getContext("2d");
    assert(ctx !== null);

    const game = new tetris.Tetris();

    const stopper = game.init(canvasRef, ctx);

    return stopper;
  }, [canvasRef]);

  return (
    <canvas
      width="200"
      height="480"
      className="bg-black"
      tabIndex={1}
      ref={setCanvasRef}
    />
  );
}
