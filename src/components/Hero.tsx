import { ReactNode } from "react";

type HeroVariant = "centered";

export default function Hero({
  title,
  description,
  eyebrow,
  variant,
}: {
  title: ReactNode;
  description: ReactNode;
  eyebrow?: ReactNode;
  variant?: HeroVariant;
}): ReactNode {
  variant = variant ?? "centered";

  return (
    <div className="px-6 py-24 sm:py-32 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        {eyebrow !== undefined && (
          <p className="text-base font-semibold leading-7 text-indigo-600">
            {eyebrow}
          </p>
        )}
        <h2 className="text-4xl font-bold tracking-tight text-gray-100 sm:text-6xl">
          {title}
        </h2>
        <p className="mt-6 text-lg leading-8 text-gray-400">{description}</p>
      </div>
    </div>
  );
}
