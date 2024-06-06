import { NextPage } from "next";

import Chip8JSComponent from "@/components/projects/Chip8JSComponent";
import ProjectTemplate from "@/components/ProjectTemplate";

import Desc from "./desc.mdx";

const Page: NextPage = () => {
  return (
    <ProjectTemplate title="Tetris" description={<Desc />}>
      <Chip8JSComponent />
    </ProjectTemplate>
  );
};

export default Page;
