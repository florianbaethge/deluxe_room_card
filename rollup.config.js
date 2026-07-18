import { nodeResolve } from "@rollup/plugin-node-resolve";
import replace from "@rollup/plugin-replace";
import terser from "@rollup/plugin-terser";
import typescript from "@rollup/plugin-typescript";
import { readFileSync } from "fs";

// The VERSION file in the project root is the single source of truth.
const version = readFileSync("VERSION", "utf-8").trim();

export default {
  input: "src/deluxe-room-card.ts",
  output: {
    file: "dist/deluxe-room-card.js",
    format: "es",
    sourcemap: true,
  },
  plugins: [
    replace({
      preventAssignment: true,
      values: {
        __VERSION__: `"${version}"`,
      },
    }),
    nodeResolve({ extensions: [".ts", ".js"] }),
    typescript({ tsconfig: "./tsconfig.json", include: ["src/**/*.ts"] }),
    terser({ format: { comments: false } }),
  ],
};
