import IMAGE_AOC from "@pub/img/aoc_article.png";
import IMAGE_CHIP8_JS from "@pub/img/chip8_article.png";
import IMAGE_CHIP8_RS from "@pub/img/chip8_rs_article.png";
import IMAGE_CINEMRAFT from "@pub/img/cinemraft_article.png";
import IMAGE_GOL from "@pub/img/gol_article.png";
import IMAGE_NEMU from "@pub/img/nemu_article.png";
import IMAGE_SAFT from "@pub/img/saft_article.jpeg";
import IMAGE_SNAKE from "@pub/img/snake_article.png";
import IMAGE_TETRIS from "@pub/img/tetris_article.jpeg";
import clsx from "clsx";
import Image, { StaticImageData } from "next/image";
import { ReactNode } from "react";
import { FaGithub, FaPlayCircle } from "react-icons/fa";

export type Project = {
  name: string;
  description: string;
  image: StaticImageData;
  imageProps?: any;
  date: string;
  href?: string;
  demo?: string;
  github?: string;
};

export const projects: Project[] = [
  {
    name: "Nemu",
    description:
      "A work-in-progress NES emulator. Currently the CPU is pretty complete, and graphics is the current focus.",
    image: IMAGE_NEMU,
    date: "2023-06-05 - now",
    href: "https://github.com/Quaqqer/nemu",
    github: "https://github.com/Quaqqer/nemu",
  },
  {
    name: "Saft",
    description:
      "Saft is my personal programming language project. I've created a lexer, parser, compiler and bytecode vm in this project.",
    image: IMAGE_SAFT,
    date: "2023-12-22 - now",
    href: "https://github.com/Quaqqer/saft",
    github: "https://github.com/Quaqqer/saft",
  },
  {
    name: "Advent of Code",
    description:
      "I have participated in Advent of Code since the year 2019. I'm one of those people who wake up at 6 am. to finish my puzzles as quickly as possible, before going back to sleep.",
    image: IMAGE_AOC,
    date: "2019-12-01 - now",
    href: "https://github.com/Quaqqer/aoc",
    github: "https://github.com/Quaqqer/aoc",
  },
  {
    name: "Tetris",
    description: "The game of tetris coded up in a single evening.",
    image: IMAGE_TETRIS,
    date: "2024-01-31",
    href: "/projects/tetris",
    demo: "/projects/tetris",
    github:
      "https://github.com/Quaqqer/Quaqqer.com/tree/trunk/lib/projects/chip8",
  },
  {
    name: "CHIP-8 in JS",
    description: "A javascript implementation of a CHIP-8 emulator.",
    image: IMAGE_CHIP8_JS,
    date: "2024-01-28",
    href: "/projects/chip8_js",
    demo: "/projects/chip8_js",
    github:
      "https://github.com/Quaqqer/Quaqqer.com/tree/trunk/lib/projects/chip8",
  },
  {
    name: "CHIP-8 in Rust",
    description:
      "A CHIP-8 emulator written in rust. CHIP-8 is an imaginary console, a popular introduction to the world of programming emulators.",
    image: IMAGE_CHIP8_RS,
    imageProps: { unoptimized: true, style: { imageRendering: "pixelated" } },
    date: "2023-06-04",
    href: "https://github.com/Quaqqer/chip8",
    github: "https://github.com/Quaqqer/chip8",
  },
  {
    name: "Cinemraft",
    description:
      "A simple voxel world generation with 3d rendering for the browser using three.js.",
    image: IMAGE_CINEMRAFT,
    date: "2022-10-28",
    href: "/projects/cinemraft",
    demo: "/projects/cinemraft",
    github:
      "https://github.com/Quaqqer/Quaqqer.com/tree/trunk/lib/projects/cinemraft",
  },
  {
    name: "Game of Life",
    description:
      "Conways game of life is popular cellular automata. I implemented it in some basic JavaScript for fun.",
    image: IMAGE_GOL,
    date: "2022-05-18",
    href: "/projects/gol",
    demo: "/projects/gol",
    github:
      "https://github.com/Quaqqer/Quaqqer.com/tree/trunk/lib/projects/gol",
  },
  {
    name: "Snake",
    description: "A simple implementation of the snake game.",
    image: IMAGE_SNAKE,
    date: "2022-05-17",
    href: "/projects/snake",
    demo: "/projects/snake",
    github:
      "https://github.com/Quaqqer/Quaqqer.com/tree/trunk/lib/projects/snake",
  },
];

export function ProjectCell({ p }: { p: Project }): ReactNode {
  return (
    <div className="group flex flex-col items-stretch justify-between">
      <a href={p.href}>
        <Image
          src={p.image}
          alt=""
          className="aspect-[16/9] w-full rounded-2xl bg-gray-100 object-cover brightness-90 group-hover:brightness-100 sm:aspect-[2/1] lg:aspect-[3/2]"
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
                <FaPlayCircle className="h-5 w-5 text-white" />
              </a>
            )}

            {p.github !== undefined && (
              <a href={p.github}>
                <FaGithub className="h-5 w-5 text-white" />
              </a>
            )}
          </div>
        </div>

        <a href={p.href}>
          <p
            className={clsx(
              "mt-5 text-sm leading-6 text-gray-400",
              p.href !== undefined && "group-hover:text-gray-300",
            )}
          >
            {p.description}
          </p>
        </a>
      </div>
    </div>
  );
}

export function ProjectsGrid(): ReactNode {
  return (
    <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 items-start justify-center gap-x-8 gap-y-10 lg:mx-0 lg:max-w-none lg:grid-cols-2">
      {projects.map((project, i) => (
        <ProjectCell p={project} key={i} />
      ))}
    </div>
  );
}
