import fs from "fs-extra";
import path from "path";
import chalk from "chalk";
import { Command } from "commander";

const program = new Command();

// Package info
const packageJson = JSON.parse(
    fs.readFileSync(path.join(__dirname, "../../package.json"), "utf-8")
);

program
    .name("fles")
    .description("FLES.js - Modern TypeScript framework for Node.js and Bun")
    .version(packageJson.version);

program
    .command("new <projectName>")
    .description("Create a new FLES.js project")
    .action(async (projectName: string) => {
        const projectPath = path.resolve(process.cwd(), projectName);

        // Check if directory already exists
        if (fs.existsSync(projectPath)) {
            console.error(chalk.red(`Error: Directory ${projectName} already exists!`));
            process.exit(1);
        }

        console.log(chalk.blue("Creating FLES.js project..."));

        // Create project directory
        fs.mkdirSync(projectPath, { recursive: true });

        // Create basic project structure
        const srcPath = path.join(projectPath, "src");
        fs.mkdirSync(srcPath);

        // Create basic app file
        const appFilePath = path.join(srcPath, "app.ts");
        fs.writeFileSync(
            appFilePath,
            `import { Fles } from "fles-js";

const app = new Fles();

// Define a simple route
app.get("/", (req, res) => {
    res.json({ message: "Hello from FLES.js!" });
});

// Start the server
app.start(3000).then(() => {
    console.log("Server running on http://localhost:3000");
});
`
        );

        // Create package.json for the new project
        const projectPackageJson = {
            name: projectName,
            version: "0.1.0",
            description: "A FLES.js project",
            main: "dist/app.js",
            scripts: {
                dev: "fles dev",
                build: "tsc",
                start: "node dist/app.js",
            },
            dependencies: {
                "fles-js": packageJson.version,
            },
            devDependencies: {
                typescript: "^5.0.0",
                "@types/node": "^18.0.0",
            },
        };

        fs.writeFileSync(
            path.join(projectPath, "package.json"),
            JSON.stringify(projectPackageJson, null, 4)
        );

        // Create tsconfig.json
        const tsConfig = {
            compilerOptions: {
                target: "ES2022",
                module: "NodeNext",
                moduleResolution: "NodeNext",
                esModuleInterop: true,
                strict: true,
                skipLibCheck: true,
                outDir: "./dist",
                baseUrl: ".",
                paths: {
                    "@/*": ["src/*"],
                },
            },
            include: ["src/**/*.ts"],
            exclude: ["node_modules"],
        };

        fs.writeFileSync(
            path.join(projectPath, "tsconfig.json"),
            JSON.stringify(tsConfig, null, 4)
        );

        // Create .gitignore
        fs.writeFileSync(
            path.join(projectPath, ".gitignore"),
            `node_modules
dist
.env
.DS_Store
`
        );

        console.log(chalk.green(`✅ Project ${projectName} created successfully!`));
        console.log("");
        console.log(chalk.blue("Next steps:"));
        console.log(`  cd ${projectName}`);
        console.log("  npm install (or bun install)");
        console.log("  npm run dev (or bun run dev)");
    });

program
    .command("dev")
    .description("Start development server with hot reload")
    .action(() => {
        try {
            // Import the dev module at runtime
            require("./dev");
        } catch (error) {
            console.error(chalk.red("Failed to start development server:"), error);
            process.exit(1);
        }
    });

program.parse(process.argv); 