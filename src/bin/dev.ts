import path from "path";
import chalk from "chalk";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const nodemon = require('nodemon');

// Find the app entry point (either app.ts, index.ts, or main.ts)
const findEntryPoint = (): string => {
    const possibleEntries = ["app.ts", "index.ts", "main.ts"];
    const currentDir = process.cwd();

    for (const entry of possibleEntries) {
        const entryPath = path.join(currentDir, "src", entry);
        try {
            require.resolve(entryPath);
            return entryPath;
        } catch (e) {
            // Entry point not found, try next
        }
    }

    throw new Error("No entry point found. Create either src/app.ts, src/index.ts, or src/main.ts");
};

try {
    const entryPoint = findEntryPoint();
    console.log(chalk.blue(`Starting development server with hot reload...`));
    console.log(chalk.blue(`Entry point: ${entryPoint}`));

    nodemon({
        script: entryPoint,
        ext: "ts,json",
        exec: "tsx",
        watch: ["src/**/*"],
        signal: "SIGTERM",
    })
        .on("start", () => {
            console.log(chalk.green("Server started"));
        })
        .on("restart", (files: string[]) => {
            console.log(chalk.yellow("Server restarted due to changes in: "), files);
        })
        .on("quit", () => {
            console.log(chalk.blue("Server stopped"));
            process.exit();
        })
        .on("error", (error: Error) => {
            console.error(chalk.red("Error starting server:"), error);
        });
} catch (error) {
    console.error(chalk.red("Failed to start development server:"), error);
    process.exit(1);
} 
