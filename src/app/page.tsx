import MdxLayout from "@/components/MdxLayout";

import Content from "./content.md";

export default function Page() {
  return (
    <>
      <div className="mx-auto max-w-2xl px-6 py-12 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-2xl">
          <h2 className="tracking-light text-center text-3xl font-bold text-gray-100 sm:text-5xl">
            Quaqqer.com
          </h2>

          <MdxLayout className="mx-auto mt-20 max-w-2xl">
            <Content />
          </MdxLayout>
        </div>
      </div>
    </>
  );
}
