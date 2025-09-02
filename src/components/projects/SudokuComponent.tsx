"use client";

import clsx from "clsx";
import { FC, useCallback, useEffect, useState } from "react";
import { CiEdit } from "react-icons/ci";

import {
  generateSudoku,
  SudokuState,
  SudokuValue,
  TILE_VALUES,
} from "@/lib/projects/sudoku/Sudoku";

export const SudokuComponent: FC = () => {
  const [sudoku, setSudoku] = useState(() => {
    const _ = undefined;
    return SudokuState.empty();
    // // prettier-ignore
    // return SudokuState.fromPreset([
    //   _, _, _,  1, 5, _,  6, _, 0,
    //   5, 7, _,  _, 6, _,  _, 8, _,
    //   0, 8, _,  _, _, 3,  4, _, _,
    //
    //   7, 1, _,  0, _, _,  _, 3, _,
    //   _, _, 3,  5, _, 1,  8, _, _,
    //   _, 4, _,  _, _, 2,  _, 1, 7,
    //
    //   _, _, 8,  2, _, _,  _, 6, 3,
    //   _, 3, _,  _, 4, _,  _, 2, 5,
    //   6, _, 2,  _, 0, 7,  _, _, _,
    // ]);
  });
  const warnings = sudoku.erroneousTiles();
  const [selectedTile, setSelectedTile] = useState<number | undefined>(
    undefined,
  );
  const [annotationMode, setAnnotationMode] = useState(false);

  const SudokuCell = useCallback(
    ({ cellRow, cellCol }: { cellRow: number; cellCol: number }) => {
      const tileI = cellRow * 9 + cellCol;
      const selected = selectedTile === tileI;
      const warning = warnings.has(tileI);
      const value = sudoku.tiles[tileI];
      const locked = sudoku.locked[tileI];
      const annotations = sudoku.annotations[tileI];

      return (
        <button
          className={clsx(
            "relative m-[1px] h-16 w-16 text-black outline-[1px] outline-black",
            selected && warning
              ? "bg-red-300"
              : selected
                ? "bg-gray-300"
                : warning
                  ? "bg-red-200"
                  : "bg-white",
          )}
          onClick={() => void setSelectedTile(tileI)}
        >
          {value === undefined && (
            <div className="absolute grid h-full w-full grid-cols-3 grid-rows-3">
              {TILE_VALUES.map((value) => (
                <div key={value}>{annotations[value] && value + 1}</div>
              ))}
            </div>
          )}

          <div
            className={clsx(
              "flex h-full w-full items-center justify-center text-3xl text-black",
              locked && "font-bold",
            )}
          >
            {value !== undefined && value + 1}
          </div>
        </button>
      );
    },
    [selectedTile, sudoku, warnings],
  );

  const SudokuGroup = useCallback(
    ({ groupRow, groupCol }: { groupRow: number; groupCol: number }) => (
      <div className="m-[1px] flex flex-col outline-[1px] outline-black">
        {new Array(3).fill(0).map((_, row) => (
          <div className="flex flex-row" key={row}>
            {new Array(3).fill(0).map((_, col) => (
              <SudokuCell
                cellRow={groupRow * 3 + row}
                cellCol={groupCol * 3 + col}
                key={col}
              />
            ))}
          </div>
        ))}
      </div>
    ),
    [SudokuCell],
  );

  const SudokuBoard = useCallback(
    () => (
      <div className="flex flex-col">
        {new Array(3).fill(0).map((_, groupRow) => (
          <div className="flex flex-row" key={groupRow}>
            {new Array(3).fill(0).map((_, groupCol) => (
              <SudokuGroup
                groupRow={groupRow}
                groupCol={groupCol}
                key={groupCol}
              />
            ))}
          </div>
        ))}
      </div>
    ),
    [SudokuGroup],
  );

  const toggleTile = useCallback(
    (value: SudokuValue) =>
      void setSudoku((sudoku) => {
        if (selectedTile === undefined) {
          return sudoku;
        }

        if (annotationMode) {
          return sudoku.toggleAnnotation(selectedTile, value);
        } else {
          return sudoku.toggleValue(selectedTile, value) ?? sudoku;
        }
      }),
    [annotationMode, selectedTile],
  );

  useEffect(() => {
    const listener = (ev: KeyboardEvent) => {
      switch (ev.key) {
        case "1":
        case "2":
        case "3":
        case "4":
        case "5":
        case "6":
        case "7":
        case "8":
        case "9":
          toggleTile((Number(ev.key) - 1) as SudokuValue);
          break;
        case "n":
          setAnnotationMode((mode) => !mode);
          break;
      }
    };
    document.addEventListener("keydown", listener);
    return () => void document.removeEventListener("keydown", listener);
  }, [toggleTile]);

  return (
    <div className="flex flex-col items-center">
      <SudokuBoard />

      <div className="flex flex-row">
        <button
          className={clsx(
            "m-1 mr-2 flex h-12 w-12 items-center justify-center rounded-md text-3xl text-white",
            annotationMode ? "bg-gray-700" : "bg-gray-500",
          )}
          onClick={() => void setAnnotationMode((mode) => !mode)}
        >
          <CiEdit />
        </button>

        <button onClick={() => setSudoku((sudoku) => sudoku.solve() ?? sudoku)}>
          Solve
        </button>

        <button
          onClick={() => setSudoku((sudoku) => generateSudoku() ?? sudoku)}
        >
          Randomize
        </button>

        <button onClick={() => setSudoku((sudoku) => sudoku.reset())}>
          Reset
        </button>

        {TILE_VALUES.map((value) => (
          <button
            key={value}
            className="relative m-1 flex h-12 w-12 items-center justify-center rounded-md bg-gray-500 text-3xl text-white"
            onClick={() => void toggleTile(value)}
          >
            {value + 1}
          </button>
        ))}
      </div>
    </div>
  );
};
