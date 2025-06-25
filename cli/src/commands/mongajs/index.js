import { Command } from 'commander'

// Init command
export const init = new Command('init')
    .description('Initialize a new MongaJS project')
    .argument('[name]', 'Project name')
    .action(async (name) => {
        const { initMongajs } = await import('./init.js')
        await initMongajs(name)
    })

// Generate command
export const generate = new Command('generate')
    .alias('g')
    .description('Generate a new model with schema')
    .argument('<name>', 'Model name (PascalCase)')
    .argument('[fields...]', 'Fields in format: name:type')
    .action(async (name, fields) => {
        const { generateModel } = await import('./generate.js')
        await generateModel(name, fields)
    })
 