"use client";

import clsx from "clsx";
import {
  FC,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { CiEdit } from "react-icons/ci";

import {
  SudokuState,
  SudokuValue,
  TILE_VALUES,
} from "@/lib/projects/sudoku/Sudoku";

const numberMap = {
  0: 0,
  1: 1,
  2: 2,
  3: 3,
  4: 4,
  5: 6,
  6: 7,
  7: 8,
  8: 9,
} as const;
const numberMapI = {
  0: 0,
  1: 1,
  2: 2,
  3: 3,
  4: 4,
  6: 5,
  7: 6,
  8: 7,
  9: 8,
} as const;

export const SudokuComponent2: FC = () => {
  const [sudoku, setSudoku] = useState(() => SudokuState.example());
  const warnings = sudoku.erroneousTiles();
  const solved = useMemo(() => sudoku.isSolved(), [sudoku]);
  const [selectedTile, setSelectedTile] = useState<number | undefined>(
    undefined,
  );
  const [annotationMode, setAnnotationMode] = useState(false);

  const NumberCell = useCallback(
    ({ className, children }: { children?: ReactNode; className?: string }) => {
      return (
        <div
          className={clsx(
            "relative m-[1px] flex h-16 w-16 items-center justify-center text-3xl text-white",
            className,
          )}
        >
          {children}
        </div>
      );
    },
    [],
  );

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
            "relative m-[1px] h-16 w-16 text-black outline-[1px] outline-black duration-1000",
            solved && cellRow == cellCol
              ? "bg-green-200"
              : selected && warning
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
                <div key={value}>{annotations[value] && numberMap[value]}</div>
              ))}
            </div>
          )}

          <div
            className={clsx(
              "flex h-full w-full items-center justify-center text-3xl text-black",
              locked && "font-bold",
            )}
          >
            {value !== undefined && numberMap[value]}
          </div>
        </button>
      );
    },
    [selectedTile, sudoku, warnings, solved],
  );

  const SudokuGroup = useCallback(
    ({ groupRow, groupCol }: { groupRow: number; groupCol: number }) => {
      return (
        <div className="m-[1px] flex flex-col outline-[1px] outline-black">
          {/* Exra row */}
          {groupRow === 0 && (
            <div className="flex flex-row">
              {groupCol === 0 && (
                <NumberCell
                  className={
                    solved ? "bg-green-200 !text-black transition-colors" : ""
                  }
                >
                  {solved && 0}
                </NumberCell>
              )}
              {new Array(3).fill(0).map((_, row) => (
                <NumberCell key={row} />
              ))}
            </div>
          )}
          {new Array(3).fill(0).map((_, row) => (
            <div className="flex flex-row" key={row}>
              {groupCol === 0 && <NumberCell />}
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
      );
    },
    [SudokuCell, NumberCell, solved],
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
      if (ev.key in numberMapI) {
        const k = Number(ev.key) as keyof typeof numberMapI;
        toggleTile(numberMapI[k]);
        ev.preventDefault();
      }

      switch (ev.key) {
        case "ArrowUp":
        case "ArrowDown":
        case "ArrowLeft":
        case "ArrowRight":
          {
            if (selectedTile === undefined) break;

            let row = Math.floor(selectedTile / 9);
            let col = selectedTile % 9;

            switch (ev.key) {
              case "ArrowUp":
                row = Math.max(0, row - 1);
                break;
              case "ArrowDown":
                row = Math.min(8, row + 1);
                break;
              case "ArrowLeft":
                col = Math.max(0, col - 1);
                break;
              case "ArrowRight":
                col = Math.min(8, col + 1);
                break;
            }

            setSelectedTile(row * 9 + col);
          }
          break;
        case "n":
          setAnnotationMode((mode) => !mode);
          ev.preventDefault();
          break;
      }
    };
    document.addEventListener("keydown", listener);
    return () => void document.removeEventListener("keydown", listener);
  }, [selectedTile, toggleTile]);

  return (
    <div className="flex flex-col items-center">
      <SudokuBoard />

      <div className="mt-3 flex flex-col items-center space-y-2">
        <div className="flex flex-row space-x-2">
          {TILE_VALUES.map((value) => (
            <button
              key={value}
              className="relative flex h-12 w-12 items-center justify-center rounded-md bg-gray-500 text-3xl text-white"
              onClick={() => void toggleTile(value)}
            >
              {numberMap[value]}
            </button>
          ))}
        </div>

        <div className="flex flex-row items-stretch space-x-2">
          <button
            title="Annotation mode"
            className={clsx(
              "flex h-12 w-12 items-center justify-center rounded-md text-3xl text-white",
              annotationMode ? "bg-gray-700" : "bg-gray-500",
            )}
            onClick={() => void setAnnotationMode((mode) => !mode)}
          >
            <CiEdit />
          </button>

          {/*
            <button
              className="text-3-xl rounded-md bg-gray-500 px-3 text-white"
              onClick={() =>
                setSudoku((sudoku) => sudoku.solve().next().value ?? sudoku)
              }
            >
              Solve
            </button>
          */}

          <button
            onClick={() => setSudoku((sudoku) => sudoku.reset())}
            className="text-3-xl rounded-md bg-gray-500 px-3 text-white"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
};
