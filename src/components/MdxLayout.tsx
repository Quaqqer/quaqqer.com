import clsx from "clsx";

export default function MdxLayout({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={clsx(className, "prose prose-invert")}>{children}</div>
  );
}
