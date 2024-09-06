import createWithMdx from "@next/mdx";

/** @type {import("@next/mdx").NextMDXOptions} */
const mdxConfig = {};

const withMDX = createWithMdx(mdxConfig);

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ["js", "jsx", "mdx", "ts", "tsx"],
  webpack: function (config, options) {
    config.experiments = { syncWebAssembly: true, layers: true };
    return config;
  },
};

export default withMDX(nextConfig);
