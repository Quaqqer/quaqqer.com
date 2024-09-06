import { NextPage } from "next";

import NemuComponent from "@/components/projects/NemuComponent";
import ProjectTemplate from "@/components/ProjectTemplate";

import Desc from "./desc.mdx";

const Page: NextPage = () => {
  return (
    <ProjectTemplate title="Nemu" description={<Desc />}>
      <NemuComponent />
    </ProjectTemplate>
  );
};

export default Page;
