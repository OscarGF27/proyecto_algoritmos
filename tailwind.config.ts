import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        primario: "#0F766E",
        secundario: "#0EA5E9"
      }
    }
  },
  plugins: []
};

export default config;
