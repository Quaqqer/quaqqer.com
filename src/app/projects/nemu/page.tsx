import { NextPage } from "next";
import React from "react";

import {
  ProjectDescription,
  ProjectTemplate,
  ProjectTitle,
} from "@/components/ProjectTemplate";

import Desc from "./desc.mdx";
import NemuEmulator from "./emulator";

const Page: NextPage = () => {
  return (
    <ProjectTemplate>
      <ProjectTitle>Nemu</ProjectTitle>

      <NemuEmulator />

      <ProjectDescription>
        <Desc />
      </ProjectDescription>
    </ProjectTemplate>
  );
};

export default Page;
