import ProjectTemplate from "@/components/ProjectTemplate";
import Desc from "./desc.mdx";
import { NextPage } from "next";
import TetrisComponent from "@/components/projects/TetrisComponent";

const Page: NextPage = () => {
  return (
    <ProjectTemplate title="Tetris" description={<Desc />}>
      <TetrisComponent />
    </ProjectTemplate>
  );
};

export default Page;
