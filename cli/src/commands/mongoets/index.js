import { Command } from 'commander'
import { generateModel } from './generate/index.js'
import { initMongoets } from './init/index.js'

// Init command
export const init = new Command('init')
    .description('Initialize a new MongoETS project')
    .argument('[name]', 'Project name')
    .action(initMongoets)

// Generate command
export const generate = new Command('generate')
    .alias('g')
    .description('Generate a new model with controller & router')
    .argument('<name>', 'Model name (PascalCase)')
    .argument('[fields...]', 'Fields in format: name:type')
    .action(generateModel)