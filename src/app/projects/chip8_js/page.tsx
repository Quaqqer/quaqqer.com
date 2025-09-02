import { NextPage } from "next";

import Chip8JSComponent from "@/components/projects/Chip8JSComponent";
import {
  ProjectDescription,
  ProjectTemplate,
  ProjectTitle,
} from "@/components/ProjectTemplate";

import Desc from "./desc.mdx";

const Page: NextPage = () => {
  return (
    <ProjectTemplate>
      <ProjectTitle>Chip8</ProjectTitle>

      <Chip8JSComponent />

      <ProjectDescription>
        <Desc />
      </ProjectDescription>
    </ProjectTemplate>
  );
};

export default Page;
