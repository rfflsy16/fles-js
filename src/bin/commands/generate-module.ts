import fs from "fs-extra";
import path from "path";
import chalk from "chalk";
import {
    createTypeInterface,
    createRepository,
    createService,
    createRoutes,
    createMigration,
    createSeed
} from "../../templates/module/index.ts";

export async function generateModule(moduleName: string, fields: string[]): Promise<void> {
    try {
        // Convert moduleName to proper format
        const moduleNameLower = moduleName.toLowerCase();
        const moduleNameCapitalized = moduleName.charAt(0).toUpperCase() + moduleName.slice(1);

        console.log(chalk.blue(`Generating ${moduleNameCapitalized} module...`));

        // Parse fields
        const parsedFields: Array<{ name: string; type: string }> = [];
        fields.forEach(field => {
            const [name, type] = field.split(':');
            if (name && type) {
                parsedFields.push({ name, type });
            } else {
                console.warn(chalk.yellow(`Warning: Skipping invalid field format: ${field}`));
            }
        });

        // Ensure id field exists
        if (!parsedFields.some(field => field.name === 'id')) {
            parsedFields.unshift({ name: 'id', type: 'string' });
        }

        // Get current directory
        const currentDir = process.cwd();
        const srcPath = path.join(currentDir, "src");

        // Check if src directory exists
        if (!fs.existsSync(srcPath)) {
            console.error(chalk.red("Error: src directory doesn't exist. Are you in a FLES.js project?"));
            process.exit(1);
        }

        // Create module directory if it doesn't exist
        const modulesPath = path.join(srcPath, "modules");
        if (!fs.existsSync(modulesPath)) {
            fs.mkdirSync(modulesPath, { recursive: true });
        }

        // Create routes directory if it doesn't exist
        const routesPath = path.join(srcPath, "routes");
        if (!fs.existsSync(routesPath)) {
            fs.mkdirSync(routesPath, { recursive: true });
        }

        // Create module directory
        const modulePath = path.join(modulesPath, moduleNameLower);
        fs.mkdirSync(modulePath, { recursive: true });

        // Generate interface types
        const typeContent = createTypeInterface(moduleNameCapitalized, parsedFields);
        fs.writeFileSync(
            path.join(modulePath, `${moduleNameLower}.types.ts`),
            typeContent
        );

        // Generate repository
        const repoContent = createRepository(moduleNameCapitalized, moduleNameLower, parsedFields);
        fs.writeFileSync(
            path.join(modulePath, `${moduleNameLower}.repository.ts`),
            repoContent
        );

        // Generate service
        const serviceContent = createService(moduleNameCapitalized, moduleNameLower, parsedFields);
        fs.writeFileSync(
            path.join(modulePath, `${moduleNameLower}.service.ts`),
            serviceContent
        );

        // Generate route file (main.ts)
        const routeContent = createRoutes(moduleNameCapitalized, moduleNameLower, parsedFields);
        fs.writeFileSync(
            path.join(modulePath, `main.ts`),
            routeContent
        );

        // Generate migration
        const migrationContent = createMigration(moduleNameCapitalized, moduleNameLower, parsedFields);
        fs.writeFileSync(
            path.join(modulePath, `${moduleNameLower}.migration.ts`),
            migrationContent
        );

        // Generate seed
        const seedContent = createSeed(moduleNameCapitalized, moduleNameLower, parsedFields);
        fs.writeFileSync(
            path.join(modulePath, `${moduleNameLower}.seed.ts`),
            seedContent
        );

        // Update routes index to import new module routes
        updateRoutesIndex(moduleNameLower, routesPath);

        console.log(chalk.green(`✅ ${moduleNameCapitalized} module generated successfully!`));
        console.log(chalk.blue("The following files were created:"));
        console.log(`  src/modules/${moduleNameLower}/main.ts`);
        console.log(`  src/modules/${moduleNameLower}/${moduleNameLower}.service.ts`);
        console.log(`  src/modules/${moduleNameLower}/${moduleNameLower}.repository.ts`);
        console.log(`  src/modules/${moduleNameLower}/${moduleNameLower}.types.ts`);
        console.log(`  src/modules/${moduleNameLower}/${moduleNameLower}.migration.ts`);
        console.log(`  src/modules/${moduleNameLower}/${moduleNameLower}.seed.ts`);
        console.log(chalk.blue("Routes index was updated."));
    } catch (error) {
        console.error(chalk.red("Failed to generate module:"), error);
        process.exit(1);
    }
}

// Update routes index.ts to include the new module
function updateRoutesIndex(moduleNameLower: string, routesPath: string): void {
    const routesIndexPath = path.join(routesPath, "index.ts");

    if (fs.existsSync(routesIndexPath)) {
        let content = fs.readFileSync(routesIndexPath, 'utf-8');

        // Check if the module import already exists
        if (!content.includes(`import ${moduleNameLower}Router from "@/modules/${moduleNameLower}/main.js"`)) {
            // Add import statement
            let importSection = content.split('import')[0];
            importSection += `import { Router } from "fles-js";\n`;

            // Add other imports
            const otherImports = content.match(/import .* from ".*";/g) || [];
            if (otherImports.length > 0) {
                importSection += otherImports.join('\n') + '\n';
            }

            // Add new import with @ alias
            importSection += `import ${moduleNameLower}Router from "@/modules/${moduleNameLower}/main.js";\n`;

            // Build the rest of the content
            const restOfContent = content.substring(content.indexOf('const router'));

            // Check if we need to add module to the routes function
            if (!restOfContent.includes(`router.use('/api/${moduleNameLower}s'`)) {
                // Find position where we need to add the router registration
                const registerPosition = restOfContent.lastIndexOf('export default');

                // New line for router registration
                const routerRegistration = `// Register ${moduleNameLower} routes\nrouter.use('/api/${moduleNameLower}s', ${moduleNameLower}Router);\n\n`;

                // Update the file
                const updatedContent =
                    importSection +
                    restOfContent.substring(0, registerPosition) +
                    routerRegistration +
                    restOfContent.substring(registerPosition);

                fs.writeFileSync(routesIndexPath, updatedContent);
            } else {
                fs.writeFileSync(routesIndexPath, importSection + restOfContent);
            }
        }
    } else {
        // Create routes index if it doesn't exist
        fs.writeFileSync(
            routesIndexPath,
            `import { Router } from "fles-js";
import ${moduleNameLower}Router from "@/modules/${moduleNameLower}/main.js";

// Create router instance
const router = Router();

// Register API base route
router.get("/api", (req, res) => {
  res.json({ 
    message: "Welcome to FLES.js API!",
    version: "1.0.0",
    documentation: "/api/docs"
  });
});

// Register ${moduleNameLower} routes
router.use('/api/${moduleNameLower}s', ${moduleNameLower}Router);

export default router;
`
        );
    }
}
