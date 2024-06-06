export const BLOCK_SIZE = 20;
export const BLOCKS_X = 10;
export const BLOCKS_Y = 24;

function assertNever(value: never): never {
  throw new Error(`Unexpected value ${value}`);
}

/**
 * @enum {number}
 */
enum Square {
  None,
  Cyan,
  Blue,
  Orange,
  Yellow,
  Green,
  Purple,
  Red,
}

const Shape = {
  I: [
    [Square.None, Square.None, Square.None, Square.None],
    [Square.None, Square.None, Square.None, Square.None],
    [Square.Cyan, Square.Cyan, Square.Cyan, Square.Cyan],
    [Square.None, Square.None, Square.None, Square.None],
  ] as Square[][],
  J: [
    [Square.None, Square.None, Square.None],
    [Square.Blue, Square.Blue, Square.Blue],
    [Square.None, Square.None, Square.Blue],
  ] as Square[][],
  L: [
    [Square.None, Square.None, Square.None],
    [Square.Orange, Square.Orange, Square.Orange],
    [Square.Orange, Square.None, Square.None],
  ] as Square[][],
  Square: [
    [Square.Yellow, Square.Yellow],
    [Square.Yellow, Square.Yellow],
  ] as Square[][],
  S: [
    [Square.None, Square.Green, Square.Green],
    [Square.Green, Square.Green, Square.None],
  ] as Square[][],
  T: [
    [Square.None, Square.Purple, Square.None],
    [Square.Purple, Square.Purple, Square.Purple],
    [Square.None, Square.None, Square.None],
  ] as Square[][],
  Z: [
    [Square.Red, Square.Red, Square.None],
    [Square.None, Square.Red, Square.Red],
  ] as Square[][],
} as const;

class FallingBlock {
  public shape: Array<Array<Square>>;
  public x = 0;
  public y = 0;

  constructor(shape: Array<Array<Square>>) {
    this.shape = shape.map((row) => row.slice());
  }

  rotateLeft() {
    for (let i = 0; i < 3; i++) this.rotateRight();
  }

  rotateRight() {
    const rotated = new Array(this.shape[0].length)
      .fill(undefined)
      .map((_, y) =>
        new Array(this.shape.length)
          .fill(undefined)
          .map((_, x) => this.shape[this.shape.length - 1 - x][y]),
      );

    this.shape = rotated;
  }
}

export class Tetris {
  private w = BLOCKS_X;
  private h = BLOCKS_Y;
  private squares: Array<Array<Square>>;
  private fallingBlock: FallingBlock | undefined;

  constructor() {
    this.squares = new Array(this.h)
      .fill(0)
      .map(() => new Array(this.w).fill(Square.None));
  }

  init(container: HTMLElement, ctx: CanvasRenderingContext2D): () => void {
    container.addEventListener("keydown", (ev) => {
      let preventDefault = true;
      switch (ev.key) {
        case "ArrowLeft":
          this.tryLeft();
          this.render(ctx);
          break;
        case "ArrowRight":
          this.tryRight();
          this.render(ctx);
          break;
        case "x":
          this.tryRotLeft();
          this.render(ctx);
          break;
        case "z":
          this.tryRotRight();
          this.render(ctx);
          break;
        case "ArrowDown":
          this.tick();
          untickedTime = 0;
          this.render(ctx);
          break;
        default:
          preventDefault = false;
      }

      if (preventDefault) ev.preventDefault();
    });

    let untickedTime = 0;

    let start = Date.now();
    let running = true;

    const update = () => {
      if (running) {
        const end = Date.now();
        untickedTime += end - start;
        start = end;

        const TICK_TIME = 500;
        while (TICK_TIME <= untickedTime) {
          untickedTime -= TICK_TIME;
          this.tick();
          this.render(ctx);
        }

        globalThis.requestAnimationFrame(update);
      }
    };

    update();

    return () => {
      running = false;
    };
  }

  tick() {
    if (this.fallingBlock === undefined) {
      const shapes = Object.values(Shape);
      Math.floor(Math.random());

      const shape = shapes[Math.floor(Math.random() * shapes.length)];

      this.fallingBlock = new FallingBlock(shape);
      console.log("new falling block");
    }

    this.dropOrLock();
  }

  setColor(ctx: CanvasRenderingContext2D, square: Square) {
    switch (square) {
      case Square.None:
        ctx.fillStyle = "black";
        ctx.strokeStyle = "black";
        break;
      case Square.Cyan:
        ctx.fillStyle = "cyan";
        ctx.strokeStyle = "darkcyan";
        break;
      case Square.Blue:
        ctx.fillStyle = "blue";
        ctx.strokeStyle = "darkblue";
        break;
      case Square.Orange:
        ctx.fillStyle = "orange";
        ctx.strokeStyle = "darkorange";
        break;
      case Square.Yellow:
        ctx.fillStyle = "yellow";
        ctx.strokeStyle = "darkyellow";
        break;
      case Square.Green:
        ctx.fillStyle = "green";
        ctx.strokeStyle = "darkgreen";
        break;
      case Square.Purple:
        ctx.fillStyle = "magenta";
        ctx.strokeStyle = "purple";
        break;
      case Square.Red:
        ctx.fillStyle = "red";
        ctx.strokeStyle = "darkred";
        break;
      default:
        assertNever(square);
    }
  }

  render(ctx: CanvasRenderingContext2D) {
    for (let y = 0; y < this.h; y++) {
      for (let x = 0; x < this.w; x++) {
        const sq = this.squares[y][x];

        this.setColor(ctx, sq);

        ctx.fillRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
        ctx.strokeRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
      }
    }

    if (this.fallingBlock !== undefined) {
      for (let dy = 0; dy < this.fallingBlock.shape.length; dy++) {
        for (let dx = 0; dx < this.fallingBlock.shape[dy].length; dx++) {
          const sq = this.fallingBlock.shape[dy][dx];
          if (sq === Square.None) {
            continue;
          }

          this.setColor(ctx, sq);

          ctx.fillRect(
            (this.fallingBlock.x + dx) * BLOCK_SIZE,
            (this.fallingBlock.y + dy) * BLOCK_SIZE,
            BLOCK_SIZE,
            BLOCK_SIZE,
          );
          ctx.strokeRect(
            (this.fallingBlock.x + dx) * BLOCK_SIZE,
            (this.fallingBlock.y + dy) * BLOCK_SIZE,
            BLOCK_SIZE,
            BLOCK_SIZE,
          );
        }
      }
    }
  }

  doesFallingBlockCollide(fallingBlock: FallingBlock): boolean {
    for (let dy = 0; dy < fallingBlock.shape.length; dy++) {
      for (let dx = 0; dx < fallingBlock.shape[0].length; dx++) {
        const x = fallingBlock.x + dx;
        const y = fallingBlock.y + dy;

        const fallingSq = fallingBlock.shape[dy]?.[dx] ?? Square.None;
        const boardSq = this.squares[y]?.[x] ?? Square.None;

        if (
          fallingSq !== Square.None &&
          (x < 0 || this.w <= x || y < 0 || this.h <= y)
        ) {
          return true;
        }

        if (fallingSq !== Square.None && boardSq !== Square.None) {
          return true;
        }
      }
    }

    return false;
  }

  withBlock(f: (block: FallingBlock) => void) {
    if (this.fallingBlock !== undefined) {
      f(this.fallingBlock);
    }
  }

  tryRotRight() {
    this.withBlock((block) => {
      block.rotateRight();

      if (this.doesFallingBlockCollide(block)) {
        // Try moving right
        block.x++;
        if (!this.doesFallingBlockCollide(block)) {
          return;
        }
        block.x--;

        // Try moving left
        block.x--;
        if (!this.doesFallingBlockCollide(block)) {
          return;
        }
        block.x++;

        // Fail
        block.rotateLeft();
      }
    });
  }

  tryRotLeft() {
    this.withBlock((block) => {
      block.rotateLeft();
      if (this.doesFallingBlockCollide(block)) {
        // Try moving right
        block.x++;
        if (!this.doesFallingBlockCollide(block)) {
          return;
        }
        block.x--;

        // Try moving left
        block.x--;
        if (!this.doesFallingBlockCollide(block)) {
          return;
        }
        block.x++;

        // Fail
        block.rotateRight();
      }
    });
  }

  tryLeft() {
    this.withBlock((block) => {
      block.x--;
      if (this.doesFallingBlockCollide(block)) {
        block.x++;
      }
    });
  }

  tryRight() {
    this.withBlock((block) => {
      block.x++;
      if (this.doesFallingBlockCollide(block)) {
        block.x--;
      }
    });
  }

  lock(fallingBlock: FallingBlock) {
    for (let dy = 0; dy < fallingBlock.shape.length; dy++) {
      for (let dx = 0; dx < fallingBlock.shape[0].length; dx++) {
        const x = fallingBlock.x + dx;
        const y = fallingBlock.y + dy;

        const sq = fallingBlock.shape[dy]?.[dx] ?? Square.None;

        if (sq !== Square.None) {
          this.squares[y][x] = sq;
        }
      }
    }
  }

  dropOrLock() {
    if (this.fallingBlock !== undefined) {
      this.fallingBlock.y++;

      if (this.doesFallingBlockCollide(this.fallingBlock)) {
        this.fallingBlock.y--;

        this.lock(this.fallingBlock);
        this.fallingBlock = undefined;
        this.clearRows();
      }
    }
  }

  clearRows() {
    const allFilled = (row: Square[]): boolean => {
      for (const sq of row) {
        if (sq === Square.None) return false;
      }
      return true;
    };

    let clearedRows = 0;

    let y = this.h - 1;
    while (0 <= y) {
      if (allFilled(this.squares[y])) {
        clearedRows++;

        for (let y2 = y - 1; y2 >= 0; y2--) {
          this.squares[y2 + 1] = this.squares[y2];
        }
        this.squares[0] = new Array(this.w).fill(Square.None);
      } else {
        y--;
      }
    }

    return clearedRows;
  }
}
