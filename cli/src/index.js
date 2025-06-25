#!/usr/bin/env node
import { program } from 'commander'
import * as mongajs from './commands/mongajs/index.js'
import * as mongoejs from './commands/mongoejs/index.js'
import * as mongoets from './commands/mongoets/index.js'

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

// Get package version
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const pkg = JSON.parse(
    fs.readFileSync(
        path.join(__dirname, '..', 'package.json'),
        'utf-8'
    )
)

program
    .name('fles-js-cli')
    .description('FLES-JS CLI - The Next-Gen Development Platform')
    .version(pkg.version, '-v, --version', 'Show CLI version')
    .addHelpText('after', `
🎨 Available Commands:
  mongajs    MongoDB + Apollo GraphQL commands
  mongoejs   MongoDB + Express REST commands
  mongoets   MongoDB + Express + TypeScript commands
  mongnext   MongoDB + Next.js commands (coming soon)

📚 Learn more:
  Docs: https://github.com/fles-js-stack
  Issues: https://github.com/fles-js-stack/issues
    `)

// MonGAJS Commands
program
    .command('mongajs')
    .description('MongoDB + Apollo GraphQL commands')
    .addCommand(mongajs.init)
    .addCommand(mongajs.generate)

// MongoEJS Commands
program
    .command('mongoejs')
    .description('MongoDB + Express REST commands')
    .addCommand(mongoejs.init)
    .addCommand(mongoejs.generate)

// MongoETS Commands
program
    .command('mongoets')
    .description('MongoDB + Express + TypeScript commands')
    .addCommand(mongoets.init)
    .addCommand(mongoets.generate)

// Future Commands (commented for now)
/*
program
    .command('mongnext')
    .description('MongoDB + Next.js commands')
    .action(() => {
        console.log('Coming December 2023!')
    })
*/

program.parse() 