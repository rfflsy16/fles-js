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
        fs.mkdirSync(srcPath, { recursive: true });

        // Create routes directory
        const routesPath = path.join(srcPath, "routes");
        fs.mkdirSync(routesPath, { recursive: true });

        // Create config directory
        const configPath = path.join(srcPath, "config");
        fs.mkdirSync(configPath, { recursive: true });

        // Create modules directory (but don't add any modules yet)
        const modulesPath = path.join(srcPath, "modules");
        fs.mkdirSync(modulesPath, { recursive: true });

        // Create types directory
        const typesPath = path.join(srcPath, "types");
        fs.mkdirSync(typesPath, { recursive: true });

        // Create main.ts file
        const appFilePath = path.join(srcPath, "main.ts");
        fs.writeFileSync(
            appFilePath,
            `import { Fles } from "fles-js";
import type { FlesRequest, FlesResponse } from "fles-js";
import router from "@/routes/index.js";
import { config } from "@/config/index.js";

const fles = new Fles();

// Global middleware - logging
fles.use((req, res, next) => {
    console.log(\`\${req.method} \${req.url}\`);
    next();
});

// Register all routes
fles.use(router);

// Start the server
const PORT = config.port || 3000;
fles.run(PORT).then(() => {
    console.log(\`🚀 Server running on http://localhost:\${PORT}\`);
});
`
        );

        // Create routes index.ts
        const routesIndexPath = path.join(routesPath, "index.ts");
        fs.writeFileSync(
            routesIndexPath,
            `import { Router } from "fles-js";

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

// Module routes will be registered here when generated

export default router;
`
        );

        // Create config/index.ts
        const configIndexPath = path.join(configPath, "index.ts");
        fs.writeFileSync(
            configIndexPath,
            `import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

export const config = {
    // Server configuration
    port: process.env.PORT ? parseInt(process.env.PORT) : 3000,
    env: process.env.NODE_ENV || "development",
    
    // Database configuration
    database: {
        url: process.env.DATABASE_URL || "postgres://postgres:postgres@localhost:5432/fles_app",
        ssl: process.env.DATABASE_SSL === "true",
    },
    
    // JWT configuration
    jwt: {
        secret: process.env.JWT_SECRET || "super-secret-key-change-in-production",
        expiresIn: process.env.JWT_EXPIRES_IN || "1d",
    },
    
    // CORS configuration
    cors: {
        origin: process.env.CORS_ORIGIN || "*",
    },
};
`
        );

        // Create types/index.ts
        const typesIndexPath = path.join(typesPath, "index.ts");
        fs.writeFileSync(
            typesIndexPath,
            `import { FlesRequest, FlesResponse } from "fles-js";

// Common types used throughout the application
export interface BaseEntity {
    id: string;
    createdAt: Date;
    updatedAt: Date;
}

// Repository interface for consistent data access patterns
export interface BaseRepository<T extends BaseEntity> {
    findAll(): Promise<T[]>;
    findById(id: string): Promise<T | null>;
    create(data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): Promise<T>;
    update(id: string, data: Partial<T>): Promise<T | null>;
    delete(id: string): Promise<boolean>;
}

// Service interface for consistent business logic patterns
export interface BaseService<T extends BaseEntity> {
    getAll(): Promise<T[]>;
    getById(id: string): Promise<T | null>;
    create(data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): Promise<T>;
    update(id: string, data: Partial<T>): Promise<T | null>;
    delete(id: string): Promise<boolean>;
}

// Controller type for route handlers
export type Controller = (req: FlesRequest, res: FlesResponse) => Promise<void> | void;

// Extend the app-specific types here as needed
`
        );

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
                start: "node dist/main.js",
                seed: "node dist/scripts/seed.js",
                migrate: "node dist/scripts/migrate.js"
            },
            dependencies: {
                "fles-js": packageJson.version,
                "dotenv": "^16.0.3",
                "uuid": "^9.0.0"  // Pastikan uuid ada di sini
            },
            devDependencies: {
                "typescript": "^5.0.0",
                "@types/node": "^18.0.0",
                "@types/uuid": "^9.0.0"  // Pastikan @types/uuid jg ada
            },
        };

        fs.writeFileSync(
            path.join(projectPath, "package.json"),
            JSON.stringify(projectPackageJson, null, 4)
        );

        // Create tsconfig.json with path aliases
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
        console.log("");
        console.log(chalk.blue("To generate a module:"));
        console.log(`  fles generate <ModuleName> field1:string field2:number ...`);
    });

program
    .command("dev")
    .description("Start development server with hot reload")
    .action(() => {
        try {
            // Try to determine if user uses npm or bun
            const packageManager = fs.existsSync('bun.lockb') ? 'bun' : 'npm';

            // Execute the script in a child process
            const { spawn } = require('child_process');
            console.log(chalk.blue(`Starting development server with ${packageManager}...`));

            const childProcess = spawn(`${packageManager}`, ['run', 'dev'], {
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
    });

program
    .command("generate <moduleName> [fields...]")
    .description("Generate a new module with specified fields")
    .action(async (moduleName: string, fields: string[]) => {
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

                // Create routes index if it doesn't exist
                const routesIndexPath = path.join(routesPath, "index.ts");
                if (!fs.existsSync(routesIndexPath)) {
                    fs.writeFileSync(
                        routesIndexPath,
                        `import { Fles } from "fles-js";

export default function routes(fles: Fles) {
    // Register all module routes with /api prefix
    fles.get("/api", (req, res) => {
        res.json({ message: "Welcome to FLES.js API!" });
    });
    
    // Register module routes here
}
`
                    );
                }
            }

            // Create module directory
            const modulePath = path.join(modulesPath, moduleNameLower);
            fs.mkdirSync(modulePath, { recursive: true });

            // Generate interface types
            const typeContent = generateTypeInterface(moduleNameCapitalized, parsedFields);
            fs.writeFileSync(
                path.join(modulePath, `${moduleNameLower}.types.ts`),
                typeContent
            );

            // Generate repository
            const repoContent = generateRepository(moduleNameCapitalized, moduleNameLower, parsedFields);
            fs.writeFileSync(
                path.join(modulePath, `${moduleNameLower}.repository.ts`),
                repoContent
            );

            // Generate service
            const serviceContent = generateService(moduleNameCapitalized, moduleNameLower, parsedFields);
            fs.writeFileSync(
                path.join(modulePath, `${moduleNameLower}.service.ts`),
                serviceContent
            );

            // Generate route file (main.ts)
            const routeContent = generateRoutes(moduleNameCapitalized, moduleNameLower, parsedFields);
            fs.writeFileSync(
                path.join(modulePath, `main.ts`),
                routeContent
            );

            // Generate migration
            const migrationContent = generateMigration(moduleNameCapitalized, moduleNameLower, parsedFields);
            fs.writeFileSync(
                path.join(modulePath, `${moduleNameLower}.migration.ts`),
                migrationContent
            );

            // Generate seed
            const seedContent = generateSeed(moduleNameCapitalized, moduleNameLower, parsedFields);
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
    });

// Helper functions for generating module files
function generateTypeInterface(moduleName: string, fields: Array<{ name: string; type: string }>): string {
    let interfaceContent = `import { BaseEntity } from "@/types/index.js";\n\n`;
    interfaceContent += `export interface ${moduleName} extends BaseEntity {\n`;

    fields.forEach(field => {
        if (field.name !== 'id') { // Skip id since it's in BaseEntity
            interfaceContent += `    ${field.name}: ${field.type};\n`;
        }
    });

    interfaceContent += `}\n`;
    return interfaceContent;
}

function generateRepository(moduleName: string, moduleNameLower: string, fields: Array<{ name: string; type: string }>): string {
    return `import { v4 as uuidv4 } from "uuid";
import { BaseRepository } from "@/types/index.js";
import { ${moduleName} } from "./${moduleNameLower}.types.js";

/**
 * Repository for ${moduleName} entity
 * Handles data access and storage operations
 */
class ${moduleName}Repository implements BaseRepository<${moduleName}> {
    // In-memory storage (replace with actual database in production)
    private ${moduleNameLower}s: ${moduleName}[] = [];

    constructor() {
        // Initialize with sample data
        this.${moduleNameLower}s = this.generateSampleData();
    }

    /**
     * Find all ${moduleNameLower}s
     */
    async findAll(): Promise<${moduleName}[]> {
        return this.${moduleNameLower}s;
    }

    /**
     * Find a ${moduleNameLower} by ID
     */
    async findById(id: string): Promise<${moduleName} | null> {
        const ${moduleNameLower} = this.${moduleNameLower}s.find(item => item.id === id);
        return ${moduleNameLower} || null;
    }

    /**
     * Create a new ${moduleNameLower}
     */
    async create(data: Omit<${moduleName}, 'id' | 'createdAt' | 'updatedAt'>): Promise<${moduleName}> {
        const now = new Date();
        const new${moduleName} = { 
            ...data, 
            id: uuidv4(),
            createdAt: now,
            updatedAt: now
        } as ${moduleName};
        
        this.${moduleNameLower}s.push(new${moduleName});
        return new${moduleName};
    }

    /**
     * Update an existing ${moduleNameLower}
     */
    async update(id: string, data: Partial<${moduleName}>): Promise<${moduleName} | null> {
        const index = this.${moduleNameLower}s.findIndex(item => item.id === id);
        if (index === -1) return null;

        const updated${moduleName} = { 
            ...this.${moduleNameLower}s[index], 
            ...data,
            updatedAt: new Date()
        };
        
        this.${moduleNameLower}s[index] = updated${moduleName};
        return updated${moduleName};
    }

    /**
     * Delete a ${moduleNameLower} by ID
     */
    async delete(id: string): Promise<boolean> {
        const initialLength = this.${moduleNameLower}s.length;
        this.${moduleNameLower}s = this.${moduleNameLower}s.filter(item => item.id !== id);
        return initialLength > this.${moduleNameLower}s.length;
    }

    /**
     * Generate sample data for development
     */
    private generateSampleData(): ${moduleName}[] {
        return [
            this.createSampleItem(1),
            this.createSampleItem(2)
        ];
    }

    /**
     * Create a sample ${moduleNameLower} item
     */
    private createSampleItem(idx: number): ${moduleName} {
        // Generate object data fields
        const fieldsData: Record<string, any> = {};
        
        fields.filter(f => f.name !== 'id').forEach(field => {
            const fieldName = field.name;
            
            switch (field.type) {
                case 'string':
                    fieldsData[fieldName] = \`Sample \${ fieldName } \${ idx } \`;
                    break;
                case 'number':
                    fieldsData[fieldName] = idx * 10;
                    break;
                case 'boolean':
                    fieldsData[fieldName] = true;
                    break;
                case 'Date':
                    fieldsData[fieldName] = new Date();
                    break;
                default:
                    fieldsData[fieldName] = \`Sample \${ fieldName } \${ idx } \`;
            }
        });
        
        return {
            id: uuidv4(),
            ...fieldsData,
            createdAt: new Date(),
            updatedAt: new Date()
        } as ${moduleName};
    }
}

export default ${moduleName}Repository;
`;
}

function generateService(moduleName: string, moduleNameLower: string, fields: Array<{ name: string; type: string }>): string {
    return `import { BaseService } from "@/types/index.js";
import ${moduleName}Repository from "./${moduleNameLower}.repository.js";
import { ${moduleName} } from "./${moduleNameLower}.types.js";

/**
 * Service for ${moduleName} entity
 * Handles business logic operations
 */
class ${moduleName}Service implements BaseService<${moduleName}> {
    private ${moduleNameLower}Repository: ${moduleName}Repository;

    constructor() {
        this.${moduleNameLower}Repository = new ${moduleName}Repository();
    }

    /**
     * Get all ${moduleNameLower}s
     */
    async getAll(): Promise<${moduleName}[]> {
        return this.${moduleNameLower}Repository.findAll();
    }

    /**
     * Get ${moduleNameLower} by ID
     */
    async getById(id: string): Promise<${moduleName} | null> {
        return this.${moduleNameLower}Repository.findById(id);
    }

    /**
     * Create a new ${moduleNameLower}
     */
    async create(data: Omit<${moduleName}, 'id' | 'createdAt' | 'updatedAt'>): Promise<${moduleName}> {
        // Add validation logic here
        this.validate(data);
        return this.${moduleNameLower}Repository.create(data);
    }

    /**
     * Update an existing ${moduleNameLower}
     */
    async update(id: string, data: Partial<${moduleName}>): Promise<${moduleName} | null> {
        // Add validation logic here
        this.validate(data, true);
        return this.${moduleNameLower}Repository.update(id, data);
    }

    /**
     * Delete a ${moduleNameLower}
     */
    async delete(id: string): Promise<boolean> {
        return this.${moduleNameLower}Repository.delete(id);
    }

    /**
     * Validate ${moduleNameLower} data
     */
    private validate(data: Partial<${moduleName}>, isUpdate = false): void {
        // Add custom validation logic here
        // Throw errors for validation failures
        // Example:
        // if (!data.name) {
        //     throw new Error('Name is required');
        // }
    }
}

export default ${moduleName}Service;
`;
}

function generateRoutes(moduleName: string, moduleNameLower: string, fields: Array<{ name: string; type: string }>): string {
    return `import { Router } from "fles-js";
import type { FlesRequest, FlesResponse } from "fles-js";
import { Controller } from "@/types/index.js";
import ${moduleName}Service from "./${moduleNameLower}.service.js";

// Create router instance
const router = Router();

// Create an instance of the service
const ${moduleNameLower}Service = new ${moduleName}Service();

/**
 * Handler to get all ${moduleNameLower}s
 */
const getAll${moduleName}s: Controller = async (req: FlesRequest, res: FlesResponse) => {
    try {
        const ${moduleNameLower}s = await ${moduleNameLower}Service.getAll();
        res.json(${moduleNameLower}s);
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        res.status(500).json({ error: \`Failed to get ${moduleNameLower}s: \${errorMessage}\` });
    }
};

/**
 * Handler to get a ${moduleNameLower} by ID
 */
const get${moduleName}ById: Controller = async (req: FlesRequest, res: FlesResponse) => {
    try {
        const id = req.params.id;
        const ${moduleNameLower} = await ${moduleNameLower}Service.getById(id);
        
        if (!${moduleNameLower}) {
            return res.status(404).json({ error: "${moduleName} not found" });
        }
        
        res.json(${moduleNameLower});
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        res.status(500).json({ error: \`Failed to get ${moduleNameLower}: \${errorMessage}\` });
    }
};

/**
 * Handler to create a new ${moduleNameLower}
 */
const create${moduleName}: Controller = async (req: FlesRequest, res: FlesResponse) => {
    try {
        const new${moduleName} = await ${moduleNameLower}Service.create(req.body);
        res.status(201).json(new${moduleName});
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        res.status(400).json({ error: \`Failed to create ${moduleNameLower}: \${errorMessage}\` });
    }
};

/**
 * Handler to update a ${moduleNameLower}
 */
const update${moduleName}: Controller = async (req: FlesRequest, res: FlesResponse) => {
    try {
        const id = req.params.id;
        const updated${moduleName} = await ${moduleNameLower}Service.update(id, req.body);
        
        if (!updated${moduleName}) {
            return res.status(404).json({ error: "${moduleName} not found" });
        }
        
        res.json(updated${moduleName});
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        res.status(400).json({ error: \`Failed to update ${moduleNameLower}: \${errorMessage}\` });
    }
};

/**
 * Handler to delete a ${moduleNameLower}
 */
const delete${moduleName}: Controller = async (req: FlesRequest, res: FlesResponse) => {
    try {
        const id = req.params.id;
        const success = await ${moduleNameLower}Service.delete(id);
        
        if (!success) {
            return res.status(404).json({ error: "${moduleName} not found" });
        }
        
        res.status(204).json({});
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        res.status(500).json({ error: \`Failed to delete ${moduleNameLower}: \${errorMessage}\` });
    }
};

// Register API routes for ${moduleNameLower} module
router.get("/", getAll${moduleName}s);
router.get("/:id", get${moduleName}ById);
router.post("/", create${moduleName});
router.put("/:id", update${moduleName});
router.delete("/:id", delete${moduleName});

export default router;
`;
}

function generateMigration(moduleName: string, moduleNameLower: string, fields: Array<{ name: string; type: string }>): string {
    // Map TypeScript types to SQL types
    const sqlTypeMap: Record<string, string> = {
        'string': 'VARCHAR(255)',
        'number': 'INTEGER',
        'boolean': 'BOOLEAN',
        'Date': 'TIMESTAMP',
    };

    let tableColumns = fields
        .filter(field => field.name !== 'id') // Skip id since we add it specifically
        .map(field => {
            const sqlType = sqlTypeMap[field.type] || 'VARCHAR(255)';
            return `    ${field.name} ${sqlType} NOT NULL`;
        }).join(',\n');

    return `/**
 * Migration for ${moduleName} entity
 */
export default {
    up: \`
        CREATE TABLE IF NOT EXISTS ${moduleNameLower}s (
            id UUID PRIMARY KEY,
${tableColumns},
            created_at TIMESTAMP NOT NULL DEFAULT NOW(),
            updated_at TIMESTAMP NOT NULL DEFAULT NOW()
        )
    \`,
    down: \`DROP TABLE IF EXISTS ${moduleNameLower}s\`
};
`;
}

function generateSeed(moduleName: string, moduleNameLower: string, fields: Array<{ name: string; type: string }>): string {
    // Generate sample seed data
    const fieldNames = fields
        .filter(field => field.name !== 'id') // Skip id since we generate it
        .map(field => field.name);

    const seedColumns = ['id', ...fieldNames, 'created_at', 'updated_at'].join(', ');

    let seedRows = '';
    for (let i = 1; i <= 3; i++) {
        const values = [
            `'11111111-1111-1111-1111-11111111111${i}'`, // UUID
            ...fields
                .filter(field => field.name !== 'id')
                .map(field => {
                    switch (field.type) {
                        case 'string':
                            return `'Sample ${field.name} ${i}'`;
                        case 'number':
                            return i * 10;
                        case 'boolean':
                            return 'true';
                        case 'Date':
                            return 'NOW()';
                        default:
                            return `'Sample ${field.name} ${i}'`;
                    }
                }),
            'NOW()', // created_at
            'NOW()'  // updated_at
        ].join(', ');

        seedRows += `            (${values})${i < 3 ? ',\n' : ''}`;
    }

    return `/**
 * Seed data for ${moduleName} entity
 */
export default {
    seed: \`
        INSERT INTO ${moduleNameLower}s (${seedColumns})
        VALUES 
${seedRows}
    \`
};
`;
}

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

program.parse(process.argv); 