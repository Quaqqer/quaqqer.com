import { NextPage } from "next";

import SnakeComponent from "@/components/projects/SnakeComponent";
import ProjectTemplate from "@/components/ProjectTemplate";

import Desc from "./desc.mdx";

const Page: NextPage = () => {
  return (
    <ProjectTemplate title="Snake" description={<Desc />}>
      <SnakeComponent />
    </ProjectTemplate>
  );
};

export default Page;
