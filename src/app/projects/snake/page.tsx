import ProjectTemplate from "@/components/ProjectTemplate";
import SnakeComponent from "@/components/projects/SnakeComponent";
import Desc from "./desc.mdx";
import { NextPage } from "next";

const Page: NextPage = () => {
  return (
    <ProjectTemplate title="Snake" description={<Desc />}>
      <SnakeComponent />
    </ProjectTemplate>
  );
};

export default Page;
