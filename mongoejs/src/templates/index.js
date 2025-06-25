import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const gitignoreContent = `node_modules
.env
.DS_Store
dist`

const templates = {
    modelIndex: fs.readFileSync(path.join(__dirname, 'files/models/index.js'), 'utf-8'),
    controllerIndex: fs.readFileSync(path.join(__dirname, 'files/controllers/index.js'), 'utf-8'),
    model: fs.readFileSync(path.join(__dirname, 'files/model.js'), 'utf-8'),
    controller: fs.readFileSync(path.join(__dirname, 'files/controller.js'), 'utf-8'),
    router: fs.readFileSync(path.join(__dirname, 'files/router.js'), 'utf-8'),
    routerIndex: fs.readFileSync(path.join(__dirname, 'files/routers/index.js'), 'utf-8'),
    rootIndex: fs.readFileSync(path.join(__dirname, 'files/index.js'), 'utf-8'),
    mongodb: fs.readFileSync(path.join(__dirname, 'files/config/mongodb.json'), 'utf-8'),
    auth: fs.readFileSync(path.join(__dirname, 'files/middlewares/auth.js'), 'utf-8'),
    errorHandler: fs.readFileSync(path.join(__dirname, 'files/middlewares/errorHandler.js'), 'utf-8'),
    seeder: fs.readFileSync(path.join(__dirname, 'files/seeder.js'), 'utf-8'),
    seederIndex: fs.readFileSync(path.join(__dirname, 'files/seeders/index.js'), 'utf-8'),
    gitignore: gitignoreContent
}

export default templates
