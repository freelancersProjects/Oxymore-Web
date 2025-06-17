import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  outDir: "dist",
  format: ["esm"],
  outExtension: () => ({ js: ".js" }),
  dts: true,
  clean: true,
  splitting: false,
  sourcemap: false,
  bundle: false,
  onSuccess: 'cpx "src/**/*.{scss,tsx,ts}" dist/ && cpx "src/assets/**/*" dist/assets/',
});
