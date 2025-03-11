import createWithMdx from "@next/mdx";

const withMDX = createWithMdx({ extension: /\.mdx?$/ });

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ["js", "jsx", "mdx", "ts", "tsx"],
  webpack: function (config, options) {
    config.experiments = {
      syncWebAssembly: true,
      layers: true,
    };
    return config;
  },
};

export default withMDX(nextConfig);
