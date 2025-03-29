import { Fles } from "fles-js";

const app = new Fles();

// Define a simple route
app.get("/", (req, res) => {
    res.json({ message: "Hello from FLES.js!" });
});

// Start the server
app.start(3000).then(() => {
    console.log("Server running on http://localhost:3000");
});
