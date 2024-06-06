import { GameOfLife } from "./logic";
import { render } from "./renderer";
import { lightTheme, Theme } from "./theme";

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
