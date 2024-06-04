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
    <div className="mx-auto max-w-screen-lg mt-18">
      <div className="flex flex-col items-center">
        <h2 className="text-3xl text-gray-300 font-medium my-6">{title}</h2>

        {children}

        <div className="py-12 max-w-xl">{description}</div>
      </div>
    </div>
  );
}
