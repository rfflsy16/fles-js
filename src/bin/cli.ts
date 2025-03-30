#!/usr/bin/env bun
import { Command } from "commander";
import fs from "fs-extra";
import path from "path";
import chalk from "chalk";
import { generateProject } from "./commands/generate-project.ts";
import { generateModule } from "./commands/generate-module.ts";
import { runDevServer } from "./commands/dev-server.ts";

// Get the package info
const packageJson = JSON.parse(
  fs.readFileSync(path.resolve(import.meta.dirname, "../../package.json"), "utf-8")
);

const program = new Command();

program
  .name("fles")
  .description("FLES.js - Modern TypeScript framework for Bun")
  .version(packageJson.version);

// Command: Create a new project
program
  .command("new <projectName>")
  .description("Create a new FLES.js project")
  .action(async (projectName: string) => {
    generateProject(projectName);
  });

// Command: Generate a module
program
  .command("generate <moduleName> [fields...]")
  .description("Generate a new module with specified fields (e.g., name:string age:number)")
  .action(async (moduleName: string, fields: string[]) => {
    generateModule(moduleName, fields);
  });

// Command: Run dev server
program
  .command("dev")
  .description("Start development server with hot reload")
  .action(() => {
    runDevServer();
  });

program.parse();