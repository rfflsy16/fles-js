#!/usr/bin/env node
import { fileURLToPath } from 'url'
import fs from 'fs'
import path from 'path'
import { showHelp } from './commands/help.js'
import { showVersion } from './commands/version.js'
import { init } from './commands/init.js'

// Get project name from args
const projectName = process.argv[2]

// Get package version
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const pkg = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json'), 'utf-8'))

// Handle version flag
if (process.argv.includes('--version') || process.argv.includes('-v')) {
    showVersion(pkg)
    process.exit(0)
}

// Handle help flag
if (process.argv.includes('--help') || process.argv.includes('-h')) {
    showHelp()
    process.exit(0)
}

// Initialize project
init(projectName).catch(console.error)