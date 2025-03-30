export function createMainTs(): string {
    return `import { Fles } from "fles-js";
import type { FlesRequest, FlesResponse } from "fles-js";
import router from "@/routes/index.js";
import { config } from "@/config/index.js";

const fles = new Fles();

// Global middleware - logging
fles.use((req: FlesRequest, res: FlesResponse, next) => {
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
`;
}
