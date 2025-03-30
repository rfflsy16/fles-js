import path from "path";
import chalk from "chalk";
import fs from "fs-extra";
import { spawn } from "child_process";

export function runDevServer(): void {
    try {
        // Try to determine if user uses npm or bun
        const usingBun = fs.existsSync('bun.lockb');
        const packageManager = usingBun ? 'bun' : 'npm';

        // Check if project is a FLES.js project
        const currentDir = process.cwd();
        const srcPath = path.join(currentDir, "src");

        if (!fs.existsSync(srcPath)) {
            console.error(chalk.red("Error: src directory doesn't exist. Are you in a FLES.js project?"));
            process.exit(1);
        }

        // Find the main file
        const findEntryPoint = (): string => {
            const possibleEntries = ["main.ts", "app.ts", "index.ts"];

            for (const entry of possibleEntries) {
                const entryPath = path.join(srcPath, entry);
                if (fs.existsSync(entryPath)) {
                    return entryPath;
                }
            }

            throw new Error("No entry point found. Create either src/main.ts, src/app.ts, or src/index.ts");
        };

        const entryPoint = findEntryPoint();
        console.log(chalk.blue(`Starting development server with ${packageManager}...`));
        console.log(chalk.blue(`Entry point: ${entryPoint}`));

        let devCommand = [];
        if (usingBun) {
            // Run with Bun's watch mode
            devCommand = ['--watch', entryPoint];
        } else {
            // Fallback to tsx for npm
            devCommand = ['exec', 'tsx', '--watch', entryPoint];
        }

        const childProcess = spawn(packageManager, devCommand, {
            stdio: 'inherit',
            shell: true
        });

        childProcess.on('error', (error: Error) => {
            console.error(chalk.red("Failed to start development server:"), error);
            process.exit(1);
        });

        process.on('SIGINT', () => {
            childProcess.kill('SIGINT');
            process.exit(0);
        });

    } catch (error) {
        console.error(chalk.red("Failed to start development server:"), error);
        process.exit(1);
    }
}