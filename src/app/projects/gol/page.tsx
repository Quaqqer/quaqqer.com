import { NextPage } from "next";

import GolComponent from "@/components/projects/GolComponent";
import ProjectTemplate from "@/components/ProjectTemplate";

import Desc from "./desc.mdx";

const Page: NextPage = () => {
  return (
    <ProjectTemplate title="Game of Life" description={<Desc />}>
      <GolComponent />
    </ProjectTemplate>
  );
};

export default Page;
