import assert from "assert";

import * as Sat from "@/lib/algorithm/sat";

export class SuguruState {
  private rows: number;
  private cols: number;
  private tiles: (number | undefined)[];
  private locked: boolean[];
  private groups: number[];

  constructor(
    rows: number,
    cols: number,
    tiles: (number | undefined)[],
    locked: boolean[],
    groups: number[],
  ) {
    assert(tiles.length === rows * cols);
    assert(locked.length === rows * cols);
    assert(groups.length == rows * cols);

    this.rows = rows;
    this.cols = cols;
    this.tiles = tiles;
    this.locked = locked;
    this.groups = groups;
  }

  private i(row: number, col: number): number {
    assert(row < this.rows);
    assert(col < this.cols);
    return row * this.cols + col;
  }

  setValue(
    row: number,
    col: number,
    value: number | undefined,
  ): SuguruState | undefined {
    const i = this.i(row, col);

    return new SuguruState(
      this.rows,
      this.cols,
      this.tiles.with(i, value),
      this.locked,
      this.groups,
    );
  }

  getValue(row: number, col: number): number | undefined {
    return this.tiles[this.i(row, col)];
  }

  getGroup(row: number, col: number): number {
    return this.groups[this.i(row, col)];
  }

  static example() {
    const _ = undefined;

    const rows = 8;
    const cols = 8;

    // prettier-ignore
    const tiles = [
      2, _, _, _, _, 2, _, 0,
      _, _, 0, _, _, _, _, _,
      _, _, _, _, _, _, _, _,
      _, _, 2, _, _, _, _, _,
      _, _, _, _, _, _, 4, _,
      _, _, _, _, _, 0, _, _,
      0, _, _, _, _, _, _, _,
      _, _, _, _, _, _, 0, _,
    ];

    const locked = tiles.map((v) => v !== undefined);

    // prettier-ignore
    const groups = [
       0,  0,  0,  2,  2,  3,  3,  3,
       0,  0,  1,  2,  2,  3,  3,  4,
       7,  1,  1,  1,  2,  4,  4,  4,
       7,  7,  1,  6,  5,  5,  4, 15,
       8,  7,  6,  6, 15, 15, 15, 15,
       8,  7,  6,  6, 12, 12, 12, 12,
       8,  8,  9,  9,  9, 10, 10, 11,
       8,  9,  9, 10, 10, 10, 11, 11,
    ]

    return new SuguruState(rows, cols, tiles, locked, groups);
  }

  toString(): string {
    const buffer = new Array<string>();

    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        const value = this.getValue(row, col);
        buffer.push(value === undefined ? "_" : String(value + 1));
        buffer.push(" ");
      }
      buffer.push("\n");
      buffer.push("\n");
    }

    return buffer.join("");
  }

  *solve(): Generator<SuguruState, void> {
    const solver = new Sat.SatSolver();

    const vars = new Map<string, number>();

    type Key = { row: number; col: number; value: number };

    const getVar = (key: Key): number => {
      const keyS = JSON.stringify(key);
      if (!vars.has(keyS)) {
        const variable = solver.addVariable();
        vars.set(keyS, variable);
      }

      return vars.get(keyS)!;
    };

    const groupTiles = new Map<number, { row: number; col: number }[]>();
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        const group = this.getGroup(row, col);
        if (!groupTiles.has(group)) {
          groupTiles.set(group, []);
        }

        groupTiles.get(group)!.push({ row, col });
      }
    }

    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        const group = this.getGroup(row, col);
        const groupSize = groupTiles.get(group)!.length;

        // Each cell must have one value at least
        solver.addClause(
          new Array(groupSize)
            .fill(0)
            .map((_, value) => [getVar({ row, col, value }), false]),
        );

        // No cell can have two values at once
        for (let v1 = 0; v1 < groupSize; v1++) {
          for (let v2 = v1 + 1; v2 < groupSize; v2++) {
            solver.addClause([
              [getVar({ row, col, value: v1 }), true],
              [getVar({ row, col, value: v2 }), true],
            ]);
          }
        }

        // Cells that have been assigned must have their current value
        const currentValue = this.getValue(row, col);
        if (currentValue !== undefined) {
          solver.addClause([
            [getVar({ row, col, value: currentValue }), false],
          ]);
        }

        // Neighbouring cells in different groups cannot have the same values
        for (let dRow = -1; dRow < 2; dRow++) {
          for (let dCol = -1; dCol < 2; dCol++) {
            if (dRow === 0 && dCol === 0) {
              continue;
            }

            const nRow = row + dRow;
            const nCol = col + dCol;

            if (
              nRow < 0 ||
              this.rows <= nRow ||
              nCol < 0 ||
              this.cols <= nCol
            ) {
              continue;
            }

            const nGroup = this.getGroup(nRow, nCol);
            const nGroupSize = groupTiles.get(nGroup)!.length;

            if (group !== nGroup) {
              const maxValues = Math.min(groupSize, nGroupSize);

              for (let value = 0; value < maxValues; value++) {
                solver.addClause([
                  [getVar({ row, col, value }), true],
                  [getVar({ row: nRow, col: nCol, value }), true],
                ]);
              }
            }
          }
        }
      }
    }

    for (const tileGroup of groupTiles.values()) {
      const groupSize = tileGroup.length;

      for (let i = 0; i < tileGroup.length; i++) {
        for (let j = i + 1; j < tileGroup.length; j++) {
          for (let value = 0; value < groupSize; value++) {
            const tileA = tileGroup[i];
            const tileB = tileGroup[j];

            solver.addClause([
              [getVar({ ...tileA, value }), true],
              [getVar({ ...tileB, value }), true],
            ]);
          }
        }
      }
    }

    for (const solution of solver.solveDpll()) {
      const tiles = new Array<number | undefined>(this.rows * this.cols).fill(
        undefined,
      );

      for (let row = 0; row < this.rows; row++) {
        for (let col = 0; col < this.cols; col++) {
          const groupSize = groupTiles.get(this.getGroup(row, col))!.length;

          for (let value = 0; value < groupSize; value++) {
            if (solution[getVar({ row, col, value })] === true) {
              assert(tiles[this.i(row, col)] === undefined);

              tiles[this.i(row, col)] = value;
            }
          }
        }
      }

      yield new SuguruState(
        this.rows,
        this.cols,
        tiles,
        this.locked,
        this.groups,
      );
    }
  }
}
