"use client";

import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaGithub } from "react-icons/fa";

const navbarItems: [string, string][] = [
  ["Home", "/"],
  ["Projects", "/projects"],
];

export function Navbar() {
  const pathName = usePathname();

  return (
    <header className="mb-5 bg-gray-900">
      <div className="mx-auto max-w-screen-lg px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex h-16 items-center">
            <div className="text-md px-3 py-2 font-medium text-gray-200">
              Quaqqer.com
            </div>

            {navbarItems.map(([name, href], i) => {
              const current =
                href === "/" ? pathName === "/" : pathName.startsWith(href);

              return (
                <Link href={href} key={i}>
                  <a
                    key={i}
                    href={href}
                    className={clsx(
                      "rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white",
                      current && "bg-gray-900 text-white underline",
                    )}
                  >
                    {name}
                  </a>
                </Link>
              );
            })}
          </div>

          <a href="https://github.com/Quaqqer">
            <FaGithub className="h-6 w-6 text-white" />
          </a>
        </div>
      </div>
    </header>
  );
}
