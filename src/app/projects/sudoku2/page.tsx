import { NextPage } from "next";

import { SudokuComponent2 } from "@/components/projects/SudokuComponent2";
import { ProjectTemplate, ProjectTitle } from "@/components/ProjectTemplate";

const Page: NextPage = () => {
  return (
    <ProjectTemplate>
      <ProjectTitle>Sudoku</ProjectTitle>

      <SudokuComponent2 />
    </ProjectTemplate>
  );
};

export default Page;
