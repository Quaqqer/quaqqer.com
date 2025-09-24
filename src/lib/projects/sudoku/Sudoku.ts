import * as Sat from "@/lib/algorithm/sat";

export const TILE_VALUES: SudokuValue[] = [0, 1, 2, 3, 4, 5, 6, 7, 8];
export type SudokuValue = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

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

  public static example(): SudokuState {
    const _ = undefined;
    // prettier-ignore
    return SudokuState.fromPreset([
      _, _, 7, _, 4, _, 2, _, 0,
      _, _, 4, 8, _, _, _, 6, _,
      1, _, _, _, _, 2, _, 5, _,
      _, _, 6, 1, _, _, 3, _, 2,
      4, 5, _, 0, _, 7, _, _, _,
      _, 1, 0, _, _, _, 4, _, _,
      _, _, _, _, 8, 1, _, _, _,
      2, 6, _, 3, 0, _, 1, _, _,
      0, _, _, 4, _, _, _, 2, 8,
    ]);
  }

  public lock(): SudokuState {
    return new SudokuState(
      this.tiles,
      this.tiles.map((tile) => tile !== undefined),
      this.annotations,
    );
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
        this.annotations[i].with(value, !this.annotations[i][value]),
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

  reset(): SudokuState {
    return new SudokuState(
      this.tiles.map((value, i) => (this.locked[i] ? value : undefined)),
      this.locked,
      new Array(81).fill(new Array(9).fill(false)),
    );
  }

  *solve(): Generator<SudokuState, void> {
    const solver = new Sat.SatSolver();

    const vars: number[] = [];
    for (let i = 0; i < 9 * 9 * 9; i++) {
      vars.push(solver.addVariable());
    }

    const getVar = (row: number, col: number, value: number): number => {
      return vars[(row * 9 + col) * 9 + value];
    };

    // Encode constraints
    const hasValue = (row: number, col: number, value: number): void => {
      solver.addClause([[getVar(row, col, value), false]]);
    };

    const hasDigit = (row: number, col: number): void => {
      solver.addClause(TILE_VALUES.map((v) => [getVar(row, col, v), false]));
    };

    const singleDigit = (row: number, col: number): void => {
      for (let v1 = 0; v1 < 9; v1++) {
        for (let v2 = v1 + 1; v2 < 9; v2++) {
          solver.addClause([
            [getVar(row, col, v1), true],
            [getVar(row, col, v2), true],
          ]);
        }
      }
    };

    const differ = (
      rowA: number,
      colA: number,
      rowB: number,
      colB: number,
    ): void => {
      for (const value of TILE_VALUES) {
        solver.addClause([
          [getVar(rowA, colA, value), true],
          [getVar(rowB, colB, value), true],
        ]);
      }
    };

    // All cells must have a value, and at most one value.
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        const currentValue = this.tiles[row * 9 + col];
        if (currentValue !== undefined) {
          hasValue(row, col, currentValue);
        }

        hasDigit(row, col);
        singleDigit(row, col);
      }
    }

    // For every group, no two cells can have the same value.
    for (let groupRow = 0; groupRow < 3; groupRow++) {
      for (let groupCol = 0; groupCol < 3; groupCol++) {
        for (let cellRowA = 0; cellRowA < 3; cellRowA++) {
          for (let cellColA = 0; cellColA < 3; cellColA++) {
            for (let cellRowB = 0; cellRowB < 3; cellRowB++) {
              for (let cellColB = 0; cellColB < 3; cellColB++) {
                const rowA = groupRow * 3 + cellRowA;
                const colA = groupCol * 3 + cellColA;

                const rowB = groupRow * 3 + cellRowB;
                const colB = groupCol * 3 + cellColB;

                // Avoid duplicate constraints
                if (rowA < rowB || (rowA == rowB && colA < colB)) {
                  differ(rowA, colA, rowB, colB);
                }
              }
            }
          }
        }
      }
    }

    // All cells in a column must differ
    for (let col = 0; col < 9; col++) {
      for (let rowA = 0; rowA < 9; rowA++) {
        for (let rowB = rowA + 1; rowB < 9; rowB++) {
          differ(rowA, col, rowB, col);
        }
      }
    }

    // All cells in a row must differ
    for (let row = 0; row < 9; row++) {
      for (let colA = 0; colA < 9; colA++) {
        for (let colB = colA + 1; colB < 9; colB++) {
          differ(row, colA, row, colB);
        }
      }
    }

    for (const solution of solver.solveDpll()) {
      const tiles = new Array(81).fill(undefined);

      for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
          for (let value = 0; value < 9; value++) {
            const hasValue = solution[getVar(row, col, value)];

            if (hasValue === true) {
              if (tiles[row * 9 + col] !== undefined) {
                throw Error(
                  "Cannot have multiple values per cell... Propagation must have gone weird.",
                );
              }

              tiles[row * 9 + col] = value;
            }
          }
        }
      }

      yield new SudokuState(tiles, this.locked, this.annotations);
    }
  }

  toString(): string {
    const buf = new Array<string>();
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        const i = row * 9 + col;
        buf.push(this.tiles[i] !== undefined ? String(this.tiles[i] + 1) : "_");
      }
      buf.push("\n");
    }
    return buf.join("");
  }
}

export const generateSudoku = (): SudokuState => {
  let state: SudokuState;
  let attempts = 0;
  while (true) {
    attempts += 1;
    // Generate a sudoku that is solved
    state = SudokuState.empty();
    for (let i = 0; i < 10; i++) {
      const cell = Math.floor(Math.random() * 9 * 9);
      const value = Math.floor(Math.random() * 9) as SudokuValue;
      state = state.setValue(cell, value)!;
    }

    const solved = state.solve().next().value;
    if (solved === undefined) continue;

    state = solved;

    break;
  }

  const hasOneSolution = (state: SudokuState): boolean => {
    const solutions = state.solve().take(2).toArray();
    return solutions.length === 1;
  };

  const removeOrder = new Array(81).fill(0).map((_, i) => i);
  for (let i = 0; i < removeOrder.length; i++) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = removeOrder[i];
    removeOrder[i] = removeOrder[j];
    removeOrder[j] = temp;
  }

  for (const toRemove of removeOrder) {
    let potentialState = state.setValue(toRemove, undefined)!;
    if (hasOneSolution(potentialState)) {
      state = potentialState;
    }
  }

  return state.lock();
};
