import chalk from 'chalk'

export function showLogo() {
    console.log(chalk.bold.cyan(`
╔════════════════════════════════════════════════════════════════╗
║                                                                ║
║   🚀 Welcome to FLES-JS - The Next-Gen Development Platform    ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝
`))
}

export function showError(error, context = '') {
    console.error(chalk.red(`❌ Error${context ? ` in ${context}` : ''}:`), error)
}

export function showSuccess(message) {
    console.log(chalk.green(`\n✨ ${message}`))
}

export function showInfo(message) {
    console.log(chalk.blue(`\n📝 ${message}`))
}

export function showWarning(message) {
    console.log(chalk.yellow(`\n⚠️ ${message}`))
} 