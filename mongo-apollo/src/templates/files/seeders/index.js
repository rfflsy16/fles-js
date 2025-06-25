'use strict';

/**
 * @type {Array<import('fles-mongo-apollo').Seeder>}
 */
const seeders = [
    // {{seeders}}
]

/**
 * Execute all seeders in order
 */
async function seed() {
    try {
        console.log('🌱 Starting seed...')
        
        for (const seeder of seeders) {
            await seeder.up()
        }
        
        console.log('🎉 Seed completed successfully!')
    } catch (error) {
        console.error('❌ Error seeding:', error)
    } finally {
        process.exit(0)
    }
}

/**
 * Revert all seeders in reverse order
 */
async function clear() {
    try {
        console.log('🧹 Starting cleanup...')
        
        for (const seeder of seeders.reverse()) {
            await seeder.down()
        }
        
        console.log('🎉 Cleanup completed successfully!')
    } catch (error) {
        console.error('❌ Error cleaning:', error)
    } finally {
        process.exit(0)
    }
}

// Run based on command
const command = process.argv[2]
if (command === 'up') {
    seed()
} else if (command === 'down') {
    clear()
} else {
    console.log('⚠️ Please specify "up" or "down"')
    process.exit(1)
} 