import assert from "assert";

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

  private encodeBCP(): [Assignments, Clause[]] {
    const varI = (row: number, col: number, value: number): number => {
      assert(row < 9 && col < 9 && value < 9);
      return (row * 9 + col) * 9 + value;
    };

    // Create assignments
    const variables = new Array(9 * 9 * 9).fill(undefined);
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        const value = this.tiles[row * 9 + col];

        if (value !== undefined) {
          for (let notValue = 0; notValue < 9; notValue++) {
            variables[varI(row, col, notValue)] = false;
          }
          variables[varI(row, col, value)] = true;
        }
      }
    }

    const clauses = new Array<Clause>();
    // Encode constraints
    const hasDigit = (row: number, col: number): void => {
      clauses.push(
        new Map(TILE_VALUES.map((value) => [varI(row, col, value), false])),
      );
    };
    const singleDigit = (row: number, col: number): void => {
      for (const v1 of TILE_VALUES) {
        for (const v2 of TILE_VALUES) {
          if (v1 !== v2) {
            clauses.push(
              new Map([
                [varI(row, col, v1), true],
                [varI(row, col, v2), true],
              ]),
            );
          }
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
        clauses.push(
          new Map([
            [varI(rowA, colA, value), true],
            [varI(rowB, colB, value), true],
          ]),
        );
      }
    };

    // All cells must have a value, and at most one value.
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        hasDigit(row, col);
        singleDigit(row, col);
      }
    }

    // For every group, no two cells can have the same value.
    for (let groupRow = 0; groupRow < 3; groupRow++) {
      for (let groupCol = 0; groupCol < 3; groupCol++) {
        for (let cellRowA = 0; cellRowA < 3; cellRowA++) {
          for (let cellColA = 0; cellColA < 3; cellColA++) {
            for (let cellRowB = cellRowA; cellRowB < 3; cellRowB++) {
              for (let cellColB = cellColA + 1; cellColB < 3; cellColB++) {
                const rowA = groupRow * 3 + cellRowA;
                const colA = groupCol * 3 + cellColA;

                const rowB = groupRow * 3 + cellRowB;
                const colB = groupCol * 3 + cellColB;

                if (rowA !== rowB || colA !== colB) {
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

    return [variables, clauses];
  }

  private static decodeBCP(assignments: Assignments): SudokuValue[] {
    const varI = (row: number, col: number, value: number): number => {
      return (row * 9 + col) * 9 + value;
    };

    const tiles = new Array(81).fill(undefined);

    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        for (let value = 0; value < 9; value++) {
          const hasValue = assignments[varI(row, col, value)];
          if (hasValue) {
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

    return tiles;
  }

  cheat(): SudokuState | undefined {
    const [assignments, clauses] = this.encodeBCP();

    const result = binaryConstraintPropagation(assignments, clauses);
    if (result === undefined) {
      return undefined;
    }

    const [newAssignments] = result;

    return new SudokuState(
      SudokuState.decodeBCP(newAssignments),
      this.locked,
      this.annotations,
    );
  }
}

type Assignments = readonly (boolean | undefined)[];
type Clause = Map<number, boolean>;

/**
 * Binary constraint propagation of logic in CNF form.
 * Ex. `(~a or b or c) and (~b or ~c)` where `(~b or ~c)` is a clause.
 */
export function binaryConstraintPropagation(
  assignments_: readonly (boolean | undefined)[],
  clauses_: readonly Clause[],
): [Assignments, Clause[]] | undefined {
  const assignments = assignments_.slice();
  const clauses: (Clause | undefined)[] = clauses_.map(
    (clause) => new Map(clause),
  );
  const varClauses: Map<number, Set<number>> = new Map(
    assignments.map((_, i) => [i, new Set<number>()]),
  );

  for (let clauseI = 0; clauseI < clauses_.length; clauseI++) {
    const clause = clauses_[clauseI];
    for (const variable of clause.keys()) {
      varClauses.get(variable)!.add(clauseI);
    }
  }

  const queue = new Array<number>();
  for (let variableI = 0; variableI < assignments.length; variableI++) {
    const assignment = assignments[variableI];
    if (assignment !== undefined) {
      queue.push(variableI);
    }
  }

  while (queue.length > 0) {
    const variable = queue.pop()!;
    const value = assignments[variable]!;

    for (const clauseI of varClauses.get(variable)!) {
      const clause = clauses[clauseI];

      if (clause !== undefined) {
        const negated = clause.get(variable)!;
        const satisfied = value !== negated;

        if (satisfied) {
          clauses[clauseI] = undefined;
        } else {
          clause.delete(variable);

          if (clause.size === 0) {
            // No solution
            return undefined;
          } else if (clause.size === 1) {
            const [lastVariable, lastNegated] = clause.entries().next().value!;
            const derivedValue = !lastNegated;

            if (assignments[lastVariable] === undefined) {
              assignments[lastVariable] = derivedValue;
              queue.push(lastVariable);
            } else if (assignments[lastVariable] !== derivedValue) {
              // Conflict
              return undefined;
            }
          }
        }
      }
    }
  }

  const newClauses = clauses
    .values()
    .filter((clause) => clause !== undefined)
    .toArray();
  return [assignments, newClauses];
}
//
// function dpll(
//   assignments_: Assignments,
//   clauses_: readonly Clause[],
// ): Assignments | undefined {
//   const result = binaryConstraintPropagation(assignments_, clauses_);
//
//   if (result === undefined) {
//     return undefined;
//   }
//
//   const [assignments, clauses] = result;
//
//   if (clauses.length === 0) {
//     return assignments;
//   }
//
//   const variable = assignments.findIndex((v) => v === undefined);
//   assert(
//     variable !== -1,
//     "If all variables are assigned then there should be no clauses left.",
//   );
//
//   const dpllTrue = dpll(assignments.with(variable, true), clauses);
//   if (dpllTrue !== undefined) return dpllTrue;
//   return dpll(assignments.with(variable, false), clauses);
// }
