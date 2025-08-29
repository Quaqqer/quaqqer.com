import { NextPage } from "next";

import { SudokuComponent } from "@/components/projects/SudokuComponent";
import ProjectTemplate from "@/components/ProjectTemplate";

const Page: NextPage = () => {
  return (
    <ProjectTemplate title="Sudoku" description="">
      <SudokuComponent />
    </ProjectTemplate>
  );
};

export default Page;
