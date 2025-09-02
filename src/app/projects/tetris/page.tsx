import { NextPage } from "next";

import TetrisComponent from "@/components/projects/TetrisComponent";
import {
  ProjectDescription,
  ProjectTemplate,
  ProjectTitle,
} from "@/components/ProjectTemplate";

import Desc from "./desc.mdx";

const Page: NextPage = () => {
  return (
    <ProjectTemplate>
      <ProjectTitle>Tetris</ProjectTitle>

      <TetrisComponent />

      <ProjectDescription>
        <Desc />
      </ProjectDescription>
    </ProjectTemplate>
  );
};

export default Page;
