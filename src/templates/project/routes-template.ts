export function createRoutesIndexTs(): string {
    return `import { Router } from "fles-js";
import type { FlesRequest, FlesResponse } from "fles-js";

// Create router instance
const router = Router();

// Register API base route
router.get("/api", (req: FlesRequest, res: FlesResponse) => {
  res.json({ 
    message: "Welcome to FLES.js API!",
    version: "1.0.0",
    documentation: "/api/docs"
  });
});

// Module routes will be registered here when generated

export default router;
`;
}
