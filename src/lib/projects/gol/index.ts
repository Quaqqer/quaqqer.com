import { GameOfLife } from "@lib/projects/gol/logic.ts";
import { render } from "@lib/projects/gol/renderer.ts";
import { lightTheme, Theme } from "@lib/projects/gol/theme.ts";

export class Game {
  private gol: GameOfLife;

  public constructor(width: number, height: number) {
    this.gol = new GameOfLife(width, height);
  }

  public tick(): void {
    this.gol.tick();
  }

  public render(
    ctx: CanvasRenderingContext2D,
    theme: Theme = lightTheme,
  ): void {
    render(ctx, this.gol, theme);
  }

  public randomize(): void {
    this.gol.randomize();
  }
}
