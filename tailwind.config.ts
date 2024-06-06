import Typography from "@tailwindcss/typography";
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      typography: ({ theme }: any) => ({
        DEFAULT: {
          css: {
            "h1, h2, h3, h4, h5, h6": {
              color: theme("colors.gray.100"),
            },
            a: {
              color: theme("colors.blue.300"),
              textDecorationLine: "underline",
            },
          },
        },
      }),

      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [Typography],
};
export default config;
