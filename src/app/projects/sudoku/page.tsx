import { NextPage } from "next";
import Link from "next/link";

import { SudokuComponent } from "@/components/projects/SudokuComponent";
import {
  ProjectDescription,
  ProjectTemplate,
  ProjectTitle,
} from "@/components/ProjectTemplate";

const Page: NextPage = () => {
  return (
    <ProjectTemplate>
      <ProjectTitle>Sudoku</ProjectTitle>

      <SudokuComponent />

      <ProjectDescription>
        <h3>Description</h3>

        <p>
          A Sudoku game I programmed. Hopefully it is self explanatory. Press a
          cell to mark it, press a number to enter it into the cell. You can use
          the keyboard as well. Press the pencil to enter annotation mode.
        </p>

        <p>
          I also implemented a Sudoku solver, using a{" "}
          <Link href="https://en.wikipedia.org/wiki/Boolean_satisfiability_problem">
            SAT
          </Link>{" "}
          solver I created. I used the{" "}
          <Link href="https://en.wikipedia.org/wiki/DPLL_algorithm">DPLL</Link>{" "}
          algorithm for my SAT solver. I want to use{" "}
          <Link href="https://en.wikipedia.org/wiki/Conflict-driven_clause_learning">
            CDCL
          </Link>{" "}
          to solve it faster, but I&aposll do it when I have some more spare
          time.
        </p>

        <p>
          To generate a new board, I create an empty board and set 10 of the
          tiles to some random values, think of it like a random seed. Then I
          solve it using my solver. When it is fully solved I start removing
          random cells, making sure that there is a unique solution at all
          times.
        </p>
      </ProjectDescription>
    </ProjectTemplate>
  );
};

export default Page;
