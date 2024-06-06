import { NextPage } from "next";

import TetrisComponent from "@/components/projects/TetrisComponent";
import ProjectTemplate from "@/components/ProjectTemplate";

import Desc from "./desc.mdx";

const Page: NextPage = () => {
  return (
    <ProjectTemplate title="Tetris" description={<Desc />}>
      <TetrisComponent />
    </ProjectTemplate>
  );
};

export default Page;
