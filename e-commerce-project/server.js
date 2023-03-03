require('dotenv').config()
require('express-async-errors')
const express = require('express')
const app = express()

//npm packages
const morgan = require('morgan')
const cookieParser = require('cookie-parser')

//database
const connectDB = require('./db/connect')

//routers
const authRouter = require('./routes/authRouter')
const userRouter = require('./routes/userRoutes')
const productRouter = require('./routes/productRoutes')
const orderRouter = require('./routes/orderRoutes')
const returnRouter = require('./routes/returnRoutes')
const deliverPartnerRouter = require('./routes/deliveryPartner')

//middleware
const notFoundMiddleware = require('./middleware/not-found')
const errorHandlerMiddleware = require('./middleware/error-handler')

app.get('/new', (req,res) => {
    res.send('New Project')
})

app.use(express.json())
app.use(morgan('tiny'))
app.use(cookieParser(process.env.JWT_SECRET))

app.use('/ecommerce', authRouter)
app.use('/ecommerce/user', userRouter)
app.use('/ecommerce/products', productRouter)
app.use('/ecommerce/orders', orderRouter )
app.use('/ecommerce/returns', returnRouter)
app.use('/ecommerce/delivery', deliverPartnerRouter)

app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)

const port = process.env.port || 5000

const start = async() => {
    try {
        await connectDB(process.env.MONGO_URI)
        app.listen(5000, () => console.log(`server is listening on ${port}...`))
    } catch (error) {
        console.log(error)
    }
}

start()