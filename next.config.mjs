import createWithMdx from "@next/mdx";

/** @type {import("@next/mdx").NextMDXOptions} */
const mdxConfig = {};

const withMDX = createWithMdx(mdxConfig);

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {typedRoutes: true},
  pageExtensions: ["js", "jsx", "mdx", "ts", "tsx"],
};

export default withMDX(nextConfig);
