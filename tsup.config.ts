import { defineConfig } from 'tsup';
import { readFileSync } from 'fs';

// Read tsconfig.json to get the path aliases
const tsConfigContent = readFileSync('./tsconfig.json', 'utf-8');
const tsConfig = JSON.parse(tsConfigContent);
const aliases = tsConfig.compilerOptions.paths;

export default defineConfig({
    entry: ['src/index.ts', 'src/bin/cli.ts'],
    format: ['esm'],
    dts: true,
    sourcemap: true,
    clean: true,
    esbuildOptions(options) {
        options.alias = {
            '@': './src'
        };
    }
}); 