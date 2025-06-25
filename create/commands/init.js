import chalk from 'chalk'
import prompts from 'prompts'
import { execSync } from 'child_process'

function checkPackageManager() {
    const userCommand = process.env.npm_execpath || ''

    if (userCommand.includes('bun')) {
        return 'bun'
    }

    // Cek command yg dipake user
    if (userCommand.includes('npm')) {
        return 'npm'
    }

    // Fallback: cek instalasi
    try {
        execSync('bun --version', { stdio: 'ignore' })
        return 'bun'
    } catch (bunError) {
        try {
            execSync('npm --version', { stdio: 'ignore' })
            return 'npm'
        } catch (npmError) {
            console.log(chalk.red('\n⚠️ Neither Bun nor NPM is installed! Please install one first.'))
            process.exit(1)
        }
    }
}

export async function init(projectName) {
    const pkgManager = checkPackageManager()

    if (pkgManager === 'bun') {
        console.log(chalk.yellow('\n⚠️ Pro tip: Use "bun create fles-js@latest" to ensure you have the latest version!'))
    }

    const FRAMEWORKS = {
        'MongoDB + Apollo GraphQL': {
            name: 'mongajs',
            description: '🚀 Modern GraphQL API with MongoDB - Perfect for real-time apps',
            command: pkgManager === 'bun' ? 'bunx fles-js-cli mongajs init' : 'npx fles-js-cli mongajs init',
            available: true,
            docs: 'https://github.com/rfflsy16/fles-js'
        },
        'MongoDB + Express REST': {
            name: 'mongoejs',
            description: '🌐 Quick & clean REST API setup with MongoDB & Express',
            command: pkgManager === 'bun' ? 'bunx fles-js-cli mongoejs init' : 'npx fles-js-cli mongoejs init',
            available: true,
            docs: 'https://github.com/fles-js-stack/mongoejs'
        },
        'MongoDB + Express + TypeScript': {
            name: 'mongoets',
            description: '🛡️ Type-safe REST API with MongoDB, Express & TypeScript',
            command: pkgManager === 'bun' ? 'bunx fles-js-cli mongoets init' : 'npx fles-js-cli mongoets init',
            available: true,
            docs: 'https://github.com/fles-js-stack/mongoets'
        },
        'MongoDB + Next.js': {
            name: 'mongnext',
            description: '⚡ Full-stack Next.js 15 with MongoDB - Simple but powerful',
            command: pkgManager === 'bun' ? 'bunx fles-js-cli monext init' : 'npx fles-js-cli monext init',
            available: false,
            comingSoon: 'January 2025'
        }
    }

    const MOTIVATION_MESSAGES = [
        "Hey Developers! Remember, debugging is like detective work. You'll find clues one by one until the problem is solved. Stay patient! 🔍",
        "Coding is like writing a story, it doesn't have to be perfect right away. Start small, refactor later, just make it work first! 🚀",
        "Stuck with an error? Relax, every error is a stepping stone to becoming a better developer. Take a break, clear your mind, try again! 💪",
        "Good code is like a good joke - it needs no explanation. But remember, bad code still works. Just keep learning & improving! ✨",
        "A true programmer doesn't just know how to write code, but also knows when to Google & when to take a break. Take care of yourself! 🌟",
        "Don't fear errors! Errors are the best teachers in programming. The more errors you face, the more you learn! 📚",
        "Clean code is like keeping your room tidy, easier to maintain than to clean up. So, start now, get used to writing clean code! 🧹",
        "Remember: There's no programmer who never gets stuck. There are only programmers who don't give up when stuck! Keep pushing! 💫",
        "Coding is not about being perfect, it's about being better than yesterday. Progress over perfection! 🎯",
        "Sometimes The Best Code is No Code at All. Don't make it complicated if it can be simple. KISS - Keep It Simple, Stupid! 🎨"
    ]

    console.log(chalk.magenta(`
    ███████╗██╗     ███████╗███████╗       ██╗███████╗
    ██╔════╝██║     ██╔════╝██╔════╝       ██║██╔════╝
    █████╗  ██║     █████╗  ███████╗       ██║███████╗
    ██╔══╝  ██║     ██╔══╝  ╚════██║  ██   ██║╚════██║
    ██║     ███████╗███████╗███████║  ╚█████╔╝███████║
    ╚═╝     ╚══════╝╚══════╝╚══════╝   ╚════╝ ╚══════╝
                                                        
╔════════════════════════════════════════════════════════════════╗
║                                                                ║
║   🚀 Welcome to FLES-JS - The Next-Gen Development Platform     ║
       ${chalk.yellow('With ❤️  from Rafles Yohanes')}
║                                                                ║
╚════════════════════════════════════════════════════════════════╝

${chalk.cyan(MOTIVATION_MESSAGES[Math.floor(Math.random() * MOTIVATION_MESSAGES.length)])}
`))

    // Get project name if not provided
    let finalProjectName = projectName
    if (!projectName) {
        const response = await prompts({
            type: 'text',
            name: 'name',
            message: '📦 Project name:',
            initial: 'my-app'
        })
        if (!response.name) {
            console.log(chalk.red('\n⚠️ Project name is required'))
            process.exit(1)
        }
        finalProjectName = response.name
    }

    // Handle current directory
    if (finalProjectName === '.') {
        finalProjectName = '.'
    }

    // Choose framework
    const choices = Object.entries(FRAMEWORKS).map(([title, framework]) => ({
        title: framework.available
            ? `${title} ${chalk.green('(ready)')}`
            : `${title} ${chalk.yellow(`(coming ${framework.comingSoon})`)}`,
        description: framework.description,
        value: framework.name,
        disabled: !framework.available
    }))

    const response = await prompts({
        type: 'select',
        name: 'framework',
        message: '🎨 Choose your framework:',
        choices,
        hint: '- Space to select. Return to submit'
    })

    if (!response.framework) {
        console.log(chalk.red('\n⚠️ Please select a framework'))
        process.exit(1)
    }

    const selected = Object.values(FRAMEWORKS).find(f => f.name === response.framework)

    if (!selected.available) {
        console.log(chalk.yellow(`
🚧 Coming Soon!

${selected.description}
Expected Release: ${selected.comingSoon}

📝 Join our waitlist: https://github.com/fles-js-stack/waitlist
        `))
        process.exit(0)
    }

    // console.log(chalk.yellow(selected.command))
    console.log(chalk.blue(`\n🚀 Initializing ${selected.name} project with ${pkgManager}...\n`))

    try {
        if (pkgManager === 'bun') {
            execSync(`${selected.command} ${finalProjectName}`, { stdio: 'inherit' })
        } else {
            const npmCommand = selected.command
                .replace('bun run', 'npm run')
                .replace('bun add', 'npm install')
                .replace('bun --watch', 'nodemon')

            execSync(`${npmCommand} ${finalProjectName}`, { stdio: 'inherit' })
        }
    } catch (error) {
        console.error(chalk.red('\n❌ Error:', error.message))
        process.exit(1)
    }
}
