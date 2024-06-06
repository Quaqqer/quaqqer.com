import ProjectTemplate from "@/components/ProjectTemplate";
import SnakeComponent from "@/components/projects/SnakeComponent";
import SnakeDesc from "./snake_desc.mdx";
import { NextPage } from "next";

const Page: NextPage = () => {
  return (
    <ProjectTemplate title="Snake" description={<SnakeDesc />}>
      <SnakeComponent />
    </ProjectTemplate>
  );
};

export default Page;
