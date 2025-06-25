import { execSync } from 'child_process'
import { showError } from '../../shared/messages.js'

export function checkPackageManager() {
    try {
        // Cek bun dulu
        execSync('bun --version', { stdio: 'ignore' })
        return 'bun'
    } catch (bunError) {
        try {
            // Klo gk ada bun, cek npm
            execSync('npm --version', { stdio: 'ignore' })
            return 'npm'
        } catch (npmError) {
            showError(
                new Error(
                    '❌ Neither Bun nor NPM is installed! Please install one of them first:\n' +
                    '   npm: https://nodejs.org\n' +
                    '   bun: https://bun.sh'
                ),
                'initialization'
            )
            process.exit(1)
        }
    }
}

export async function installDependencies(pkgManager, targetDir) {
    const dependencies = [
        'express',
        'mongodb',
        'typescript',
        'zod',
        'bcryptjs',
        'jsonwebtoken',
        'chokidar',
        'fles-js-xroutes',
        'dotenv'
    ]

    const devDependencies = [
        '@types/express',
        '@types/bcryptjs',
        '@types/jsonwebtoken',
        'bun-types',
    ]

    try {
        if (pkgManager === 'bun') {
            execSync(`bun add ${dependencies.join(' ')}`, {
                stdio: 'inherit',
                cwd: targetDir
            })

            execSync(`bun add -d ${devDependencies.join(' ')}`, {
                stdio: 'inherit',
                cwd: targetDir
            })
        } else {
            execSync(`npm install ${dependencies.join(' ')}`, {
                stdio: 'inherit',
                cwd: targetDir
            })

            execSync(`npm install -D ${devDependencies.join(' ')}`, {
                stdio: 'inherit',
                cwd: targetDir
            })
        }
    } catch (error) {
        throw new Error(`Error installing dependencies: ${error.message}`)
    }
} 