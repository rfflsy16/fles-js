import repository from './files/repository.js'
import schema from './files/schema.js'
import service from './files/service.js'
import rootIndex from './files/index.js'
import homeController from './files/home-controller.js'
import mongodbConfig from './files/config/mongodb-config.js'
import mongodbJson from './files/config/mongodb-json.js'
import seederIndex from './files/seeder-index.js'
import modelSeeder from './files/model-seeder.js'
import errorHandler from './files/error-handler.js'
import { routeController, routeIdController } from './files/route-controller.js'

// User specific templates
import bcryptUtil from './files/utils/bcrypt.js'
import jwtUtil from './files/utils/jwt.js'
import userRepository from './files/user/repository.js'
import userService from './files/user/service.js'
import userController from './files/user/controller.js'
import userIdController from './files/user/id-controller.js'
import userSessionsController from './files/user/sessions-controller.js'
import userRegisterController from './files/user/register-controller.js'
import userSeeder from './files/user/seeder.js'
import userAuthService from './files/user/auth-service.js'

const gitignoreContent = `node_modules
.env
.DS_Store
dist
.turbo`

const templates = {
    // Standard templates
    repository,
    schema,
    service,
    rootIndex,
    homeController,
    mongodbConfig,
    mongodbJson,
    gitignore: gitignoreContent,
    seederIndex,
    modelSeeder,
    errorHandler,
    routeController,
    routeIdController,

    // User specific templates
    bcryptUtil,
    jwtUtil,
    userRepository,
    userService,
    userController,
    userIdController,
    userSessionsController,
    userRegisterController,
    userSeeder,
    userAuthService
}

export default templates 