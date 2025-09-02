import { NextPage } from "next";

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

      <ProjectDescription>TODO</ProjectDescription>
    </ProjectTemplate>
  );
};

export default Page;
