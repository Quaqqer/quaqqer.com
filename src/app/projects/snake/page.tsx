import { NextPage } from "next";

import SnakeComponent from "@/components/projects/SnakeComponent";
import {
  ProjectDescription,
  ProjectTemplate,
  ProjectTitle,
} from "@/components/ProjectTemplate";

import Desc from "./desc.mdx";

const Page: NextPage = () => {
  return (
    <ProjectTemplate>
      <ProjectTitle>Snake</ProjectTitle>

      <SnakeComponent />

      <ProjectDescription>
        <Desc />
      </ProjectDescription>
    </ProjectTemplate>
  );
};

export default Page;
