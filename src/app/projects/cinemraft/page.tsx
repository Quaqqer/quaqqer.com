import { NextPage } from "next";

import CineMraftComponent from "@/components/projects/CineMraftComponent";
import {
  ProjectDescription,
  ProjectTemplate,
  ProjectTitle,
} from "@/components/ProjectTemplate";

import Desc from "./desc.mdx";

const Page: NextPage = () => {
  return (
    <ProjectTemplate>
      <ProjectTitle>CineMraft</ProjectTitle>

      <CineMraftComponent />

      <ProjectDescription>
        {" "}
        <Desc />
      </ProjectDescription>
    </ProjectTemplate>
  );
};

export default Page;
