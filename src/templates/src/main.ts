export default `import { Fles } from "fles-js";
import type { FlesRequest, FlesResponse } from "fles-js";

const fles = new Fles();

// Define a simple route
fles.get("/", (req: FlesRequest, res: FlesResponse) => {
    res.json({ message: "Hello from FLES.js!" });
});

// Define another route with typed parameters
fles.get("/greeting/:name", (req: FlesRequest, res: FlesResponse) => {
    const name = req.params.name || "Guest";
    res.json({ greeting: \`Hello, \${name}! Welcome to FLES.js\` });
});

// Start the server with the new run method
fles.run(3000).then(() => {
    console.log("🚀 Server running on http://localhost:3000");
});
`;
