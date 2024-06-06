type GOLGrid = boolean[][];

function newGrid(
  width: number,
  height: number,
  generator = () => false,
): GOLGrid {
  return new Array(height)
    .fill(0)
    .map(() => new Array(width).fill(0).map(generator));
}

const neighbourIter = [-1, 0, 1]
  .map((dy) => [-1, 0, 1].map((dx) => [dy, dx]))
  .flat();

export class GameOfLife {
  private state: GOLGrid;

  public constructor(
    public readonly width: number,
    public readonly height: number,
  ) {
    // Create a 2d array of false values, state[y][x]
    this.state = newGrid(width, height, () => Boolean(Math.random() > 0.7));
  }

  private isAlive(x: number, y: number): boolean {
    return this.state[y]?.[x];
  }

  private neighbours(x: number, y: number): number {
    return neighbourIter
      .map(([dy, dx]) => (dx !== 0 || dy !== 0) && this.isAlive(x + dx, y + dy))
      .reduce((a, v) => a + Number(v), 0);
  }

  private nextState(): GOLGrid {
    // Create an empy state
    return this.state.map((row, y) =>
      row.map((alive, x) => {
        const ns = this.neighbours(x, y);
        return (alive && (ns === 2 || ns === 3)) || ns === 3;
      }),
    );
  }

  public tick(): void {
    this.state = this.nextState();
  }

  public print(): void {
    console.log(
      this.state
        .map((row) => row.map((v) => (v && "X") || " ").join("") + "\n")
        .join(""),
    );
  }

  public gridIter(): [boolean, number, number][] {
    return this.state.map((row, y) => row.map((v, x) => [v, x, y])).flat() as [
      boolean,
      number,
      number,
    ][];
  }

  public randomize(): void {
    this.state = newGrid(this.width, this.height, () => Math.random() > 0.7);
  }
}
