import Hero from "@/components/Hero";

import { ProjectsGrid } from "./projects";

export default function Page() {
  return (
    <div className="mx-auto max-w-7xl px-6 pb-24 lg:px-8">
      <Hero
        size="md"
        title="Projects"
        description="Here are some of the projects I've worked on in my free time. Some of them are just links to GitHub, but some have a demo in the browser, if you see a play button, why don't you click it?"
      />

      <ProjectsGrid />
    </div>
  );
}
