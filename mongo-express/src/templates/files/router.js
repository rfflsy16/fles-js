import { Router } from 'express'
import { MODELNAMEController } from '../controllers/index.js'
// import { authentication } from '../middlewares/auth.js'  // Uncomment to enable auth

const router = Router()

// Uncomment to require authentication for all routes in this router
// router.use(authentication)

// Default REST routes
router.get('/', MODELNAMEController.findAll)
router.get('/:id', MODELNAMEController.findOne)
router.post('/', MODELNAMEController.create)
router.put('/:id', MODELNAMEController.update)
router.delete('/:id', MODELNAMEController.destroy)

// Add your custom routes here
// Example:
// router.get('/custom', MODELNAMEController.customMethod)
// router.post('/:id/action', authentication, MODELNAMEController.specialAction)  // Auth per route

export default router 