import fs from 'fs-extra'
import { templates } from '../../../providers/mongoets/index.js'
import { showInfo } from '../../shared/messages.js'

// Map tipe data ke sample values
const sampleValueMap = {
    'z.string()': (field, i) => `Sample ${field} ${i + 1}`,
    'z.number()': () => Math.floor(Math.random() * 1000000),
    'z.boolean()': () => Math.random() > 0.5,
    'z.date()': () => new Date().toISOString(),
    'z.array(z.string())': (field, i) => [`tag1-${i}`, `tag2-${i}`, `tag3-${i}`],
    'z.string().email()': (field, i, isAuthUser) => 
        isAuthUser ? `user${i + 1}@test.com` : `sample${i + 1}@example.com`,
    'z.string().url()': (field, i) => `https://example.com/sample-${i + 1}`,
}

export async function generateSeederFile(name, fields, MODEL_PLURAL, MODEL_LC_PLURAL) {
    // Create directories
    await fs.ensureDir('./src/seeders')
    await fs.ensureDir('./src/data')

    // Check if it's User model with auth fields
    const isAuthUser = name === 'User' && 
        Object.entries(fields).some(([name]) => name === 'email') && 
        Object.entries(fields).some(([name]) => name === 'password')

    showInfo(`Generating seeder for ${name}...`)

    // Generate model seeder
    const seederContent = isAuthUser 
        ? templates.userSeeder 
        : templates.modelSeeder

    await fs.writeFile(
        `./src/seeders/${name.toLowerCase()}Seeder.ts`,
        seederContent
            .replace(/{{MODEL}}/g, name)
            .replace(/{{MODEL_LC}}/g, name.toLowerCase())
            .replace(/{{MODEL_PLURAL}}/g, MODEL_PLURAL)
            .replace(/{{MODEL_LC_PLURAL}}/g, MODEL_LC_PLURAL)
    )

    // Generate sample data
    const sampleData = Array.from({ length: 10 }, (_, i) => {
        const data = {}
        Object.entries(fields).forEach(([field, type]) => {
            const generator = sampleValueMap[type]
            data[field] = generator 
                ? generator(field, i, isAuthUser)
                : `Default ${field} value ${i + 1}`
        })
        return data
    })

    await fs.writeFile(
        `./src/data/${MODEL_LC_PLURAL}.json`,
        JSON.stringify(sampleData, null, 4)
    )

    // Update seeders index
    await updateSeederIndex(name, MODEL_PLURAL, MODEL_LC_PLURAL)
}

async function updateSeederIndex(name, MODEL_PLURAL) {
    const indexPath = './src/seeders/index.ts'
    
    if (!fs.existsSync(indexPath)) {
        const initialContent = templates.seederIndex
            .replace('{{IMPORTS}}', `import { seed${MODEL_PLURAL} } from "./${name.toLowerCase()}Seeder";`)
            .replace('{{COLLECTIONS}}', `"${MODEL_PLURAL}"`)
            .replace('{{SEEDERS}}', `seed${MODEL_PLURAL}()`)
        await fs.writeFile(indexPath, initialContent)
        return
    }

    let indexContent = await fs.readFile(indexPath, 'utf-8')

    // Add import if not exists
    const importLine = `import { seed${MODEL_PLURAL} } from "./${name.toLowerCase()}Seeder";\n`
    if (!indexContent.includes(`seed${MODEL_PLURAL}`)) {
        indexContent = importLine + indexContent
    }

    // Update collections & seeders
    indexContent = updateCollections(indexContent, MODEL_PLURAL)
    indexContent = updateSeeders(indexContent, MODEL_PLURAL)

    await fs.writeFile(indexPath, indexContent)
}

function updateCollections(content, MODEL_PLURAL) {
    if (!content.includes(`"${MODEL_PLURAL}"`)) {
        const collectionsStart = content.indexOf('const collections = [')
        const collectionsEnd = content.indexOf('];', collectionsStart)
        
        let collections = content
            .slice(collectionsStart + 'const collections = ['.length, collectionsEnd)
            .split('\n')
            .filter(line => line.trim())
            .map(line => line.trim())
        
        collections.push(`"${MODEL_PLURAL}"`)
        
        const formattedCollections = collections
            .map(c => `            ${c}`)
            .join(',\n')
            .replace(/,+/g, ',')
        
        return content.slice(0, collectionsStart) + 
               'const collections = [\n' +
               formattedCollections + '\n' +
               '        ]' +
               content.slice(collectionsEnd + 1)
    }
    return content
}

function updateSeeders(content, MODEL_PLURAL) {
    if (!content.includes(`seed${MODEL_PLURAL}()`)) {
        const promiseStart = content.indexOf('await Promise.all([')
        const promiseEnd = content.indexOf(']);', promiseStart)
        
        let seeders = content
            .slice(promiseStart + 'await Promise.all(['.length, promiseEnd)
            .split('\n')
            .filter(line => line.trim())
            .map(line => line.trim())
        
        seeders.push(`seed${MODEL_PLURAL}()`)
        
        const formattedSeeders = seeders
            .map(s => `            ${s}`)
            .join(',\n')
            .replace(/,+/g, ',')
        
        return content.slice(0, promiseStart) + 
               'await Promise.all([\n' +
               formattedSeeders + '\n' +
               '        ]' +
               content.slice(promiseEnd + 1)
    }
    return content
} 