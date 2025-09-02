import { NextPage } from "next";

import GolComponent from "@/components/projects/GolComponent";
import {
  ProjectDescription,
  ProjectTemplate,
  ProjectTitle,
} from "@/components/ProjectTemplate";

import Desc from "./desc.mdx";

const Page: NextPage = () => {
  return (
    <ProjectTemplate>
      <ProjectTitle>Game of Life</ProjectTitle>

      <GolComponent />

      <ProjectDescription>
        <Desc />
      </ProjectDescription>
    </ProjectTemplate>
  );
};

export default Page;
