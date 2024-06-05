import clsx from "clsx";
import { HTMLAttributes, Key, ReactNode } from "react";
import { FaGithub, FaPlayCircle } from "react-icons/fa";

export type Project = {
  name: string;
  description: string;
  imageUrl: string;
  imageProps?: HTMLAttributes<HTMLImageElement>;
  date: string;
  href?: string;
  demo?: string;
  github?: string;
};

export const projects: Project[] = [
  {
    name: "Saft",
    description:
      "Saft is my personal programming language project. I've created a lexer, parser, compiler and bytecode vm in this project.",
    imageUrl: "/img/saft_article.jpeg",
    date: "2023-12-22 - now",
    href: "https://github.com/Quaqqer/saft",
    github: "https://github.com/Quaqqer/saft",
  },
  {
    name: "Nemu",
    description:
      "A work-in-progress NES emulator. Currently the CPU is pretty complete, and graphics is the current focus.",
    imageUrl: "/img/nemu_article.jpeg",
    date: "2023-06-05 - now",
    href: "https://github.com/Quaqqer/nemu",
    github: "https://github.com/Quaqqer/nemu",
  },
  {
    name: "Advent of Code",
    description:
      "I have participated in Advent of Code since the year 2019. I'm one of those people who wake up at 6 am. to finish my puzzles as quickly as possible, before going back to sleep.",
    imageUrl: "/img/aoc_article.jpeg",
    date: "2019-12-01 - now",
    href: "https://github.com/Quaqqer/aoc",
    github: "https://github.com/Quaqqer/aoc",
  },
  {
    name: "Tetris",
    description: "The game of tetris coded up in a single evening.",
    imageUrl: "/img/tetris_article.jpeg",
    date: "2024-01-31",
    href: "/projects/tetris",
    demo: "/projects/tetris",
    github:
      "https://github.com/Quaqqer/Quaqqer.dev/tree/trunk/lib/projects/chip8",
  },
  {
    name: "CHIP-8 in JS",
    description: "A javascript implementation of a CHIP-8 emulator.",
    imageUrl: "/img/chip8_article.jpeg",
    date: "2024-01-28",
    href: "/projects/chip8",
    demo: "/projects/chip8",
    github:
      "https://github.com/Quaqqer/Quaqqer.dev/tree/trunk/lib/projects/chip8",
  },
  {
    name: "CHIP-8 in Rust",
    description:
      "A CHIP-8 emulator written in rust. CHIP-8 is an imaginary console, a popular introduction to the world of programming emulators.",
    imageUrl: "/img/chip8_rs_article.png",
    imageProps: { style: { imageRendering: "pixelated" } },
    date: "2023-06-04",
    href: "https://github.com/Quaqqer/chip8",
    github: "https://github.com/Quaqqer/chip8",
  },
  {
    name: "Cinemraft",
    description:
      "A simple voxel world generation with 3d rendering for the browser using three.js.",
    imageUrl: "/img/cinemraft_article.png",
    date: "2022-10-28",
    href: "/projects/cinemraft",
    demo: "/projects/cinemraft",
    github:
      "https://github.com/Quaqqer/Quaqqer.dev/tree/trunk/lib/projects/cinemraft",
  },
  {
    name: "Game of Life",
    description:
      "Conways game of life is popular cellular automata. I implemented it in some basic JavaScript for fun.",
    imageUrl: "/img/gol_article.png",
    date: "2022-05-18",
    href: "/projects/gol",
    demo: "/projects/gol",
    github:
      "https://github.com/Quaqqer/Quaqqer.dev/tree/trunk/lib/projects/gol",
  },
  {
    name: "Snake",
    description: "A simple implementation of the snake game.",
    imageUrl: "/img/snake_article.png",
    date: "2022-05-17",
    href: "/projects/snake",
    demo: "/projects/snake",
    github:
      "https://github.com/Quaqqer/Quaqqer.dev/tree/trunk/lib/projects/snake",
  },
];

export function ProjectCell(p: Project, key?: Key): ReactNode {
  return (
    <div
      className="flex flex-col items-stretch justify-between group"
      key={key}
    >
      <a href={p.href}>
        <img
          src={p.imageUrl}
          alt=""
          className="aspect-[16/9] w-full rounded-2xl bg-gray-100 object-cover sm:aspect-[2/1] lg:aspect-[3/2] brightness-90 group-hover:brightness-100"
          {...p.imageProps}
        />
      </a>

      <div className="lg:px-2">
        <div className="mt-8 flex items-center justify-between">
          <div className="flex items-center gap-x-4 text-xs">
            <a href={p.href}>
              <h3 className="text-lg font-semibold text-gray-100">{p.name}</h3>
            </a>

            <div className="text-gray-500">{p.date}</div>
          </div>

          <div className="flex items-center gap-x-4">
            {p.demo !== undefined && (
              <a href={p.demo}>
                <FaPlayCircle className="h-6 w-6 text-white" />
              </a>
            )}

            {p.github !== undefined && (
              <a href={p.github}>
                <FaGithub className="h-5 w-5" />
              </a>
            )}
          </div>
        </div>

        <a href={p.href}>
          <p
            className={clsx(
              "mt-5 text-sm leading-6 text-gray-400",
              p.href !== undefined && "group-hover:text-gray-300"
            )}
          >
            {p.description}
          </p>
        </a>
      </div>
    </div>
  );
}
