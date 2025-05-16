import express from 'express'
import dotenv from 'dotenv'
import InstituteRouter from './routes/institute.route.js'
import AuthRouter from './routes/auth.route.js'
import connectDB from './config/DB.js'
import cors from 'cors'

dotenv.config()

const app = express()
app.use(express.json())
app.use(cors())

app.use('/api/v1/institute', InstituteRouter)
app.use('/api/auth',AuthRouter)

app.listen(3000, () => {
    connectDB()
    console.log('Server running on port 3000')
})