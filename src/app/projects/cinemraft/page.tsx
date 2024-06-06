import { NextPage } from "next";

import CineMraftComponent from "@/components/projects/CineMraftComponent";
import ProjectTemplate from "@/components/ProjectTemplate";

import Desc from "./desc.mdx";

const Page: NextPage = () => {
  return (
    <ProjectTemplate title="CineMraft" description={<Desc />}>
      <CineMraftComponent />
    </ProjectTemplate>
  );
};

export default Page;
