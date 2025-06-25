import chalk from 'chalk'

export function showHelp() {
    console.log(chalk.blue(`
╔════════════════════════════════════════════════════════════════╗
║                                                                ║
║   🤝 FLES-JS Help Guide                                         ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝

Usage:
    npx create-fles-js <project-name>
    npx create-fles-js .
    npx create-fles-js

Options:
    -h, --help      Show this help message
    -v, --version   Show version information

Examples:
    npx create-fles-js my-app    Create new project in "my-app" folder
    npx create-fles-js .         Create in current directory
    npx create-fles-js           Interactive project creation

Available Frameworks:
    - MongoDB + Apollo GraphQL  (Ready!) 🚀
    - MongoDB + Express REST    (Ready!) 🚀
    - MongoDB + Express + TS    (Coming Soon) ⏳
    - MongoDB + Next.js         (Coming Soon) ⏳

For more details, visit: ${chalk.underline('https://github.com/rfflsy16/fles-js')}
`))
} 