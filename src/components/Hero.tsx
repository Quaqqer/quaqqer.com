import clsx from "clsx";
import { ReactNode } from "react";

type HeroVariant = "centered";

type HeroSize = "md" | "lg";

export default function Hero({
  title,
  description,
  eyebrow,
  size,
  variant,
}: {
  title: ReactNode;
  description: ReactNode;
  eyebrow?: ReactNode;
  size?: HeroSize;
  variant?: HeroVariant;
}): ReactNode {
  variant = variant ?? "centered";
  size = size ?? "lg";

  return (
    <div
      className={
        {
          md: "px-4 py-16 sm:py-16 lg:px-6",
          lg: "px-6 py-24 sm:py-32 lg:px-8",
        }[size]
      }
    >
      <div className="mx-auto max-w-2xl text-center">
        {eyebrow !== undefined && (
          <p className="text-base font-semibold leading-7 text-blue-400">
            {eyebrow}
          </p>
        )}

        <h2
          className={clsx(
            { md: "text-2xl sm:text-4xl", lg: "text-4xl sm:text-6xl" }[size],
            "font-bold tracking-tight text-gray-100",
          )}
        >
          {title}
        </h2>

        <p
          className={clsx(
            { md: "text-md mt-4", lg: "mt-6 text-lg" }[size],
            "text-gray-400",
          )}
        >
          {description}
        </p>
      </div>
    </div>
  );
}
