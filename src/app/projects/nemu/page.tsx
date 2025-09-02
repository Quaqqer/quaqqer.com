import { NextPage } from "next";
import React from "react";

import {
  ProjectDescription,
  ProjectTemplate,
  ProjectTitle,
} from "@/components/ProjectTemplate";

import Desc from "./desc.mdx";

const NemuComponent = React.lazy(
  () => import("@/components/projects/NemuComponent"),
);

const Page: NextPage = () => {
  return (
    <ProjectTemplate>
      <ProjectTitle>Nemu</ProjectTitle>

      <NemuComponent />

      <ProjectDescription>
        <Desc />
      </ProjectDescription>
    </ProjectTemplate>
  );
};

export default Page;
