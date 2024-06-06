import clsx from "clsx";
import { HTMLAttributes } from "react";

const buttonSizeClass = {
  xs: "rounded px-2 py-1 text-xs",
  sm: "rounded px-2 py-1 text-sm",
  md: "rounded-md px-2.5 py-1.5 text-sm",
  lg: "rounded-md px-3 py-2 text-sm",
  xl: "rounded-md px-3.5 py-2.5 text-xs",
} as const;

const buttonColors = {
  primary:
    "bg-indigo-500 text-white hover:bg-indigo-400 focus-visible:outline-indigo-500",
  secondary: "bg-white/10 text-white hover:bg-white/20",
};

export default function Button({
  sz,
  variant,
  ...props
}: HTMLAttributes<HTMLButtonElement> & {
  sz?: "xs" | "sm" | "md" | "lg" | "xl";
  variant?: "primary" | "secondary";
}): JSX.Element {
  sz = sz ?? "md";
  variant = variant ?? "primary";

  return (
    <button
      className={clsx(
        buttonSizeClass[sz],
        buttonColors[variant],
        "px-2 py-1 text-xs font-semibold shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2",
      )}
      {...props}
    />
  );
}
