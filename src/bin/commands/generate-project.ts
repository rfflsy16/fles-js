import fs from "fs-extra";
import path from "path";
import chalk from "chalk";
import { createMainTs } from "../../templates/project/main-template.ts";
import { createRoutesIndexTs } from "../../templates/project/routes-template.ts";
import { createConfigTs } from "../../templates/project/config-template.ts";
import { createTypesIndexTs } from "../../templates/project/types-template.ts";

export async function generateProject(projectName: string): Promise<void> {
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
	fs.mkdirSync(srcPath, { recursive: true });

	// Create directories
	const routesPath = path.join(srcPath, "routes");
	fs.mkdirSync(routesPath, { recursive: true });

	const configPath = path.join(srcPath, "config");
	fs.mkdirSync(configPath, { recursive: true });

	const modulesPath = path.join(srcPath, "modules");
	fs.mkdirSync(modulesPath, { recursive: true });

	const typesPath = path.join(srcPath, "types");
	fs.mkdirSync(typesPath, { recursive: true });

	// Create main.ts file
	const appFilePath = path.join(srcPath, "main.ts");
	fs.writeFileSync(appFilePath, createMainTs());

	// Create routes index.ts
	const routesIndexPath = path.join(routesPath, "index.ts");
	fs.writeFileSync(routesIndexPath, createRoutesIndexTs());

	// Create config/index.ts
	const configIndexPath = path.join(configPath, "index.ts");
	fs.writeFileSync(configIndexPath, createConfigTs());

	// Create types/index.ts
	const typesIndexPath = path.join(typesPath, "index.ts");
	fs.writeFileSync(typesIndexPath, createTypesIndexTs());

	// Create empty .env file
	fs.writeFileSync(
		path.join(projectPath, ".env"),
		`PORT=3000
NODE_ENV=development
DATABASE_URL=postgres://postgres:postgres@localhost:5432/fles_app
JWT_SECRET=your-secret-key-change-me
`
	);

	// Create empty .env.example file
	fs.writeFileSync(
		path.join(projectPath, ".env.example"),
		`PORT=3000
NODE_ENV=development
DATABASE_URL=postgres://postgres:postgres@localhost:5432/fles_app
JWT_SECRET=your-secret-key
`
	);

	// Create package.json with all dependencies
	const projectPackageJson = {
		name: projectName,
		version: "0.1.0",
		description: "A FLES.js project",
		type: "module",
		main: "dist/main.js",
		scripts: {
			dev: "fles dev",
			build: "tsc",
			start: "bun dist/main.js",
			seed: "bun dist/scripts/seed.js",
			migrate: "bun dist/scripts/migrate.js"
		},
		dependencies: {
			"fles-js": "^0.1.0",
			"dotenv": "^16.3.1",
			"uuid": "^9.0.0",
			"zod": "^3.22.4"
		},
		devDependencies: {
			"typescript": "^5.2.2",
			"@types/bun": "latest",
			"@types/node": "^20.8.0",
			"@types/uuid": "^9.0.4"
		},
	};

	fs.writeFileSync(
		path.join(projectPath, "package.json"),
		JSON.stringify(projectPackageJson, null, 2)
	);

	// Create tsconfig.json with path aliases
	const tsConfig = {
		compilerOptions: {
			target: "ESNext",
			module: "ESNext",
			moduleResolution: "node",
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
		JSON.stringify(tsConfig, null, 2)
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
	console.log("  bun install");
	console.log("  bun run dev");
	console.log("");
	console.log(chalk.blue("To generate a module:"));
	console.log(`  fles generate <ModuleName> field1:string field2:number ...`);
}