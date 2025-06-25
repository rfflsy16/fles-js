import express from 'express'
import cors from 'cors'
import router from './routers/index.js'
import errorHandler from './middlewares/errorHandler.js'

const app = express()
const port = process.env.PORT || 3000

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api', router)

app.use(errorHandler)

app.listen(port, () => {
    // Print server info first
    console.log(`
🚀 Server ready at: http://localhost:${port}
`)
})

// Routes info will be added here