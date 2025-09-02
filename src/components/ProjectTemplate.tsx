import { FC, ReactNode } from "react";

export interface ProjectTitleProps {
  children: string;
}
export const ProjectTitle: FC<ProjectTitleProps> = ({ children }) => {
  return (
    <h2 className="my-6 text-3xl font-medium text-gray-300">{children}</h2>
  );
};

export interface ProjectDescriptionProps {
  children?: ReactNode;
}
export const ProjectDescription: FC<ProjectDescriptionProps> = ({
  children,
}) => {
  return <div className="max-w-xl py-12 prose prose-invert">{children}</div>;
};

export interface ProjectTemplateProps {
  children?: ReactNode;
}
export const ProjectTemplate: FC<ProjectTemplateProps> = ({ children }) => {
  return (
    <div className="mt-18 mx-auto max-w-screen-lg">
      <div className="flex flex-col items-center">{children}</div>
    </div>
  );
};
