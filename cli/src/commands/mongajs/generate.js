import fs from 'fs-extra'
import { templates } from '@henscc/mongajs'
import { showError, showInfo, showSuccess } from '../shared/messages.js'

function convertToGraphQLType(type) {
    switch(type) {
        case 'string': return 'String'
        case 'number': return 'Float'
        case 'integer': return 'Int'
        case 'boolean': return 'Boolean'
        case 'date': return 'Date'
        case 'id': return 'ID'
        case 'float': return 'Float'
        case 'json': return 'JSON'
        case '[string]': return '[String]'
        case '[number]': return '[Float]'
        case '[integer]': return '[Int]'
        case '[boolean]': return '[Boolean]'
        case '[date]': return '[Date]'
        case '[id]': return '[ID]'
        case '[float]': return '[Float]'
        case '[json]': return '[JSON]'
        default: return 'String'
    }
}

function generateFields(fields, indentation = 8) {
    const spaces = ' '.repeat(indentation)
    return Object.entries(fields)
        .map(([name, type]) => `${spaces}${name}: ${convertToGraphQLType(type)}`)
        .join('\n')
}

function parseFields(args) {
    if (!args || args.length === 0) {
        throw new Error('Please provide fields (e.g., name:string age:number)')
    }

    return args.reduce((acc, field) => {
        const [name, type] = field.split(':')
        if (!name || !type) {
            throw new Error(`Invalid field format: ${field}. Use format: name:type`)
        }
        acc[name] = type.toLowerCase()
        return acc
    }, {})
}

async function generateModelFile(name, fields) {
    const modelContent = templates.model
        .replace(/MODELNAME/g, name)
        .replace(/COLLECTION/, name.toLowerCase())
        .replace(/FIELDS/, Object.entries(fields)
            .map(([name, type]) => `        ${name}: { type: '${type}' }`)
            .join(',\n'))

    await fs.writeFile(
        `./models/${name.toLowerCase()}.js`,
        modelContent
    )
}

async function generateSchemaFile(name, fields) {
    const schemaContent = templates.schema
        .replace(/MODELNAME/g, name)
        .replace(/TYPEDEFS_FIELDS/, generateFields(fields))
        .replace(/INPUT_FIELDS/, generateFields(fields))

    await fs.writeFile(
        `./schemas/${name.toLowerCase()}.js`,
        schemaContent
    )
}

async function generateSeederFile(name, fields) {
    // Create directories
    await fs.ensureDir('./seeders')
    await fs.ensureDir('./data')
    
    // Generate seeder
    const seederContent = templates.seeder
        .replace(/MODELNAME/g, name)
        .replace(/COLLECTION/g, name.toLowerCase())
    
    await fs.writeFile(
        `./seeders/${name.toLowerCase()}Seeder.js`,
        seederContent
    )
    
    // Generate sample data
    const sampleFields = Object.entries(fields).reduce((acc, [field, type]) => {
        let value;
        switch(type) {
            case 'number':
            case 'float':
                value = 99.99;
                break;
            case 'integer':
                value = 42;
                break;
            case 'boolean':
                value = true;
                break;
            case 'date':
                value = new Date();
                break;
            case 'json':
                value = { key: 'value' };
                break;
            default:
                value = `Sample ${field}`;
        }
        return { ...acc, [field]: value };
    }, {})
    
    const sampleData = [{
        _id: "000000000000000000000001",
        ...sampleFields,
        createdAt: new Date(),
        updatedAt: new Date()
    }]
    
    await fs.writeFile(
        `./data/${name.toLowerCase()}.json`,
        JSON.stringify(sampleData, null, 4)
    )
    
    // Update seeders/index.js
    const indexPath = './seeders/index.js'
    if (!fs.existsSync(indexPath)) {
        await fs.writeFile(indexPath, templates.seederIndex)
    }
    
    let content = await fs.readFile(indexPath, 'utf-8')
    content = content.replace(
        '// {{seeders}}',
        `// {{seeders}}\n    (await import('./${name.toLowerCase()}Seeder.js')).default,`
    )
    await fs.writeFile(indexPath, content)
}

async function updateIndexFile(name) {
    const indexPath = './models/index.js'
    let content = await fs.readFile(indexPath, 'utf-8')
    
    // Add export
    content = content.replace('// {{exports}}', `export { ${name} } from './${name.toLowerCase()}.js'\n// {{exports}}`)
    
    await fs.writeFile(indexPath, content)
}

async function updateRootIndex(name) {
    const indexPath = './index.js'
    let content = await fs.readFile(indexPath, 'utf-8')
    
    // Add schema import
    const importLine = `import { ${name}TypeDefs, ${name}Resolvers } from './schemas/${name.toLowerCase()}.js'`
    content = content.replace('// {{schemaImports}}', `// {{schemaImports}}\n${importLine}`)
    
    // Add to typeDefs array
    content = content.replace(
        '// {{typeDefs}}',
        `// {{typeDefs}}\n        ${name}TypeDefs,`
    )
    
    // Add to resolvers array
    content = content.replace(
        '// {{resolvers}}',
        `// {{resolvers}}\n        ${name}Resolvers,`
    )
    
    await fs.writeFile(indexPath, content)
}

function generateSampleValue(type) {
    switch(type) {
        case 'string': return 'Sample text'
        case 'number': 
        case 'float': return 99.99
        case 'integer': return 42
        case 'boolean': return true
        case 'date': return new Date()
        case 'id': return 'sample-id-123'
        case 'json': return { key: 'value' }
        case '[string]': return ['Sample 1', 'Sample 2']
        case '[number]':
        case '[float]': return [10.5, 20.5]
        case '[integer]': return [1, 2]
        case '[boolean]': return [true, false]
        case '[date]': return [new Date(), new Date()]
        case '[id]': return ['id-1', 'id-2']
        case '[json]': return [{ id: 1 }, { id: 2 }]
        default: return 'Sample text'
    }
}

export async function generateModel(name, args) {
    try {
        if (!name) {
            throw new Error('Please provide a model name')
        }

        // Capitalize first letter
        name = name.charAt(0).toUpperCase() + name.slice(1)
        
        // Check if files already exist
        const modelPath = `./models/${name.toLowerCase()}.js`
        const schemaPath = `./schemas/${name.toLowerCase()}.js`
        
        if (fs.existsSync(modelPath) || fs.existsSync(schemaPath)) {
            throw new Error(`${name} model/schema already exists`)
        }

        showInfo(`Generating ${name} model & schema...`)
        
        const fields = parseFields(args)
        
        // Generate files
        await generateModelFile(name, fields)
        await generateSchemaFile(name, fields)
        await generateSeederFile(name, fields)
        await updateIndexFile(name)
        await updateRootIndex(name)

        showSuccess(`
✨ Generated successfully:
- models/${name.toLowerCase()}.js
- schemas/${name.toLowerCase()}.js
- seeders/${name.toLowerCase()}Seeder.js
- data/${name.toLowerCase()}.json
- Updated models/index.js
- Updated index.js
- Updated seeders/index.js

${name === 'User' ? '💡 TIP: Don\'t forget to setup authentication in utils/auth.js\n' : ''}
        `)

    } catch (error) {
        showError(error, 'model generation')
        process.exit(1)
    }
}