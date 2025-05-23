import express from 'express'
import dotenv from 'dotenv'
import InstituteRouter from './routes/institute.route.js'
import AuthRouter from './routes/auth.routes.js'
import UserRouter from './routes/user.route.js'
import SubscriptionRouter from './routes/subscription.routes.js'
import StudentRouter from './routes/student.route.js'
import connectDB from './config/DB.js'
import cors from 'cors'
import wishlistRoutes from './routes/wishlist.routes.js'
import analyticsRoutes from './routes/analytics.routes.js'

dotenv.config()

const app = express()
app.use(express.json())
app.use(cors())

app.use('/api/v1/institute', InstituteRouter)
app.use('/api/v1/auth', AuthRouter)
app.use('/api/v1/users', UserRouter)
app.use('/api/v1/subscriptions', SubscriptionRouter)
app.use('/api/v1/students', StudentRouter)
app.use('/api/v1/wishlist', wishlistRoutes)
app.use('/api/v1/analytics', analyticsRoutes)

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ message: 'Something went wrong!' })
})

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    connectDB()
    console.log(`Server is running on port ${PORT}`)
})