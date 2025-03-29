import { defineConfig } from "tsup";

export default defineConfig({
    entry: ["src/index.ts", "src/bin/cli.ts", "src/bin/dev.ts"],
    format: ["cjs", "esm"],
    dts: true,
    splitting: false,
    sourcemap: true,
    clean: true,
    shims: true,
    banner: {
        js: "#!/usr/bin/env node",
    },
}); 