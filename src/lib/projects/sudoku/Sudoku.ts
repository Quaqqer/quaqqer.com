export const TILE_VALUES: SudokuValue[] = [1, 2, 3, 4, 5, 6, 7, 8, 9];
export type SudokuValue = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export class SudokuState {
  public readonly tiles: readonly (SudokuValue | undefined)[];
  public readonly locked: readonly boolean[];
  public readonly annotations: readonly (readonly boolean[])[];

  private constructor(
    tiles: readonly (SudokuValue | undefined)[],
    locked: readonly boolean[],
    annotations: readonly (readonly boolean[])[],
  ) {
    this.tiles = tiles;
    this.locked = locked;
    this.annotations = annotations;
  }

  public static fromPreset(
    tiles: readonly (SudokuValue | undefined)[],
  ): SudokuState {
    if (tiles.length !== 81) {
      throw new Error("Sudoku board must be 81 tiles big.");
    }

    return new SudokuState(
      tiles,
      tiles.map((v) => v !== undefined),
      new Array(81).fill(new Array(9).fill(false)),
    );
  }

  public static empty(): SudokuState {
    return SudokuState.fromPreset(new Array(81).fill(undefined));
  }

  public setValue(
    i: number,
    value: SudokuValue | undefined,
  ): SudokuState | undefined {
    if (this.locked[i]) {
      return undefined;
    }

    return new SudokuState(
      this.tiles.with(i, value),
      this.locked,
      this.annotations,
    );
  }

  public toggleValue(i: number, value: SudokuValue) {
    const newValue = this.tiles[i] === value ? undefined : value;
    return this.setValue(i, newValue);
  }

  public toggleAnnotation(i: number, value: SudokuValue) {
    return new SudokuState(
      this.tiles,
      this.locked,
      this.annotations.with(
        i,
        this.annotations[i].with(value - 1, !this.annotations[i][value - 1]),
      ),
    );
  }

  public erroneousTiles() {
    const errorTiles = new Set<number>();

    // Find duplicates in rows
    for (let row = 0; row < 9; row++) {
      const rowSeen = new Map<SudokuValue, number>();

      for (let col = 0; col < 9; col++) {
        const tileValue = this.tiles[row * 9 + col];
        if (tileValue === undefined) continue;
        const seen = rowSeen.get(tileValue);
        if (seen !== undefined) {
          errorTiles.add(row * 9 + seen);
          errorTiles.add(row * 9 + col);
        }
        rowSeen.set(tileValue, col);
      }
    }

    // Find duplicates in columns
    for (let col = 0; col < 9; col++) {
      const colSeen = new Map<SudokuValue, number>();

      for (let row = 0; row < 9; row++) {
        const tileValue = this.tiles[row * 9 + col];
        if (tileValue === undefined) continue;
        const seen = colSeen.get(tileValue);
        if (seen !== undefined) {
          errorTiles.add(seen * 9 + col);
          errorTiles.add(row * 9 + col);
        }
        colSeen.set(tileValue, row);
      }
    }

    // Find duplicates in groups
    for (let groupRow = 0; groupRow < 3; groupRow++) {
      for (let groupCol = 0; groupCol < 3; groupCol++) {
        const seen = new Map<SudokuValue, number>();

        for (let dCol = 0; dCol < 3; dCol++) {
          for (let dRow = 0; dRow < 3; dRow++) {
            const tileI = (groupRow * 3 + dRow) * 9 + (groupCol * 3 + dCol);
            const value = this.tiles[tileI];
            if (value === undefined) continue;
            const prev = seen.get(value);
            if (prev !== undefined) {
              errorTiles.add(prev);
              errorTiles.add(tileI);
            }
            seen.set(value, tileI);
          }
        }
      }
    }

    return errorTiles;
  }

  hasError(): boolean {
    return this.erroneousTiles().size !== 0;
  }

  isSolved(): boolean {
    // All tiles are set
    for (let i = 0; i < 81; i++) {
      if (this.tiles[i] === undefined) {
        return false;
      }
    }

    // and no errors
    return !this.hasError();
  }
}
