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
        fs.mkdirSync(path.join(srcPath, "modules"));
        fs.mkdirSync(path.join(srcPath, "routes"));

        // Create basic app file
        const appFilePath = path.join(srcPath, "main.ts");
        fs.writeFileSync(
            appFilePath,
            `import { Fles } from "fles-js";
import type { FlesRequest, FlesResponse } from "fles-js";
import routes from "./routes/index.js";

const fles = new Fles();

// Register API routes with /api prefix
fles.use((req, res, next) => {
    console.log(\`\${req.method} \${req.url}\`);
    next();
});

// Apply all routes
routes(fles);

// Start the server with the new run method
fles.run(3000).then(() => {
    console.log("🚀 Server running on http://localhost:3000");
});
`
        );

        // Create routes index file
        const routesIndexPath = path.join(srcPath, "routes", "index.ts");
        fs.writeFileSync(
            routesIndexPath,
            `import { Fles } from "fles-js";
import userRoutes from "../modules/user/main.js";
// Import other module routes here

export default function routes(fles: Fles) {
    // Register all module routes with /api prefix
    fles.get("/api", (req, res) => {
        res.json({ message: "Welcome to FLES.js API!" });
    });
    
    // Register module routes
    userRoutes(fles);
    // Register other module routes here
}
`
        );

        // Create example module structure
        const userModulePath = path.join(srcPath, "modules", "user");
        fs.mkdirSync(userModulePath);

        // Create user module files
        const userMainPath = path.join(userModulePath, "main.ts");
        fs.writeFileSync(
            userMainPath,
            `import { Fles } from "fles-js";
import type { FlesRequest, FlesResponse } from "fles-js";
import UserService from "./user.service.js";

// User routes
export default function userRoutes(fles: Fles) {
    const userService = new UserService();

    // API routes for user module
    fles.get("/api/users", async (req: FlesRequest, res: FlesResponse) => {
        const users = await userService.getAllUsers();
        res.json(users);
    });

    fles.get("/api/users/:id", async (req: FlesRequest, res: FlesResponse) => {
        const userId = req.params.id;
        const user = await userService.getUserById(userId);
        
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        
        res.json(user);
    });

    fles.post("/api/users", async (req: FlesRequest, res: FlesResponse) => {
        // Handle user creation
        const newUser = await userService.createUser(req.body);
        res.status(201).json(newUser);
    });
}
`
        );

        // Create user service
        const userServicePath = path.join(userModulePath, "user.service.ts");
        fs.writeFileSync(
            userServicePath,
            `import UserRepository from "./user.repository.js";
import { User } from "./user.types.js";

class UserService {
    private userRepository: UserRepository;

    constructor() {
        this.userRepository = new UserRepository();
    }

    async getAllUsers(): Promise<User[]> {
        return this.userRepository.findAll();
    }

    async getUserById(id: string): Promise<User | null> {
        return this.userRepository.findById(id);
    }

    async createUser(userData: Partial<User>): Promise<User> {
        // Add validation logic here
        return this.userRepository.create(userData as User);
    }
}

export default UserService;
`
        );

        // Create user repository
        const userRepositoryPath = path.join(userModulePath, "user.repository.ts");
        fs.writeFileSync(
            userRepositoryPath,
            `import { User } from "./user.types.js";

// In a real app, this would connect to a database
class UserRepository {
    private users: User[] = [
        { id: "1", name: "John Doe", email: "john@example.com" },
        { id: "2", name: "Jane Smith", email: "jane@example.com" }
    ];

    async findAll(): Promise<User[]> {
        return this.users;
    }

    async findById(id: string): Promise<User | null> {
        const user = this.users.find(u => u.id === id);
        return user || null;
    }

    async create(user: User): Promise<User> {
        const newUser = { ...user, id: String(this.users.length + 1) };
        this.users.push(newUser);
        return newUser;
    }
}

export default UserRepository;
`
        );

        // Create user types
        const userTypesPath = path.join(userModulePath, "user.types.ts");
        fs.writeFileSync(
            userTypesPath,
            `export interface User {
    id: string;
    name: string;
    email: string;
    createdAt?: Date;
    updatedAt?: Date;
}
`
        );

        // Create migration example
        const userMigrationPath = path.join(userModulePath, "user.migration.ts");
        fs.writeFileSync(
            userMigrationPath,
            `/*
 * This is just an example of what a migration file might look like.
 * In a real application, you would use a proper migration tool.
 */

export default {
    up: \`
        CREATE TABLE IF NOT EXISTS users (
            id VARCHAR PRIMARY KEY,
            name VARCHAR NOT NULL,
            email VARCHAR NOT NULL UNIQUE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    \`,
    down: \`DROP TABLE IF EXISTS users\`
};
`
        );

        // Create seed example
        const userSeedPath = path.join(userModulePath, "user.seed.ts");
        fs.writeFileSync(
            userSeedPath,
            `/*
 * This is just an example of what a seed file might look like.
 * In a real application, you would use a proper seeding tool.
 */

export default {
    seed: \`
        INSERT INTO users (id, name, email)
        VALUES 
            ('1', 'John Doe', 'john@example.com'),
            ('2', 'Jane Smith', 'jane@example.com')
    \`
};
`
        );

        // Create package.json for the new project
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