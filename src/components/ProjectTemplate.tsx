import { ReactNode } from "react";

export default function ProjectTemplate({
  title,
  children,
  description,
}: {
  title: string;
  children: ReactNode;
  description: ReactNode;
}) {
  return (
    <div className="mt-18 mx-auto max-w-screen-lg">
      <div className="flex flex-col items-center">
        <h2 className="my-6 text-3xl font-medium text-gray-300">{title}</h2>

        {children}

        <div className="max-w-xl py-12">{description}</div>
      </div>
    </div>
  );
}
