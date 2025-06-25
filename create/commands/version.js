import chalk from 'chalk'
import { execSync } from 'child_process'

function getCliVersion() {
    try {
        return execSync('npx fles-js-cli --version', { stdio: ['pipe', 'pipe', 'ignore'] })
            .toString()
            .trim()
            .replace('fles-js-cli version ', '')
    } catch (e) {
        return 'not installed'
    }
}

function getPackageVersion(packageName) {
    try {
        const output = execSync(`npm list ${packageName} --json`, { stdio: ['pipe', 'pipe', 'ignore'] })
            .toString()
            .trim()
        const json = JSON.parse(output)
        return json.dependencies[packageName].version
    } catch (e) {
        try {
            // Coba cek di global packages
            const output = execSync(`npm list -g ${packageName} --json`, { stdio: ['pipe', 'pipe', 'ignore'] })
                .toString()
                .trim()
            const json = JSON.parse(output)
            return json.dependencies[packageName].version
        } catch (e) {
            return 'not installed'
        }
    }
}

export function showVersion(pkg) {
    const mongajsVersion = getPackageVersion('fles-mongo-apollo')
    const mongoejsVersion = getPackageVersion('fles-mongo-express')
    const mongoetsVersion = getPackageVersion('fles-mongo-express-typescript')

    console.log(chalk.blue(`
╔════════════════════════════════════════════════════════════════╗
║                                                                ║
║   🚀 FLES-JS Version Info                                       ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝

📦 create-fles-js  : v${pkg.version}
🛠  fles-js-cli    : v${getCliVersion()}
🔌 fles-mongo-apollo : ${mongajsVersion}
🌐 fles-mongo-express: ${mongoejsVersion}
📝 fles-mongo-express-typescript: ${mongoetsVersion}

For more details, visit: ${chalk.underline('https://github.com/fles-js-stack/versions')}
`))
} 