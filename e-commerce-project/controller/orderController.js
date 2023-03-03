const Order = require('../model/order')
const Product = require('../model/products')
const { StatusCodes } = require('http-status-codes')
const CustomError = require('../errors')
const { sendMail } = require('../utils')

const createOrder = async(req,res) => {

    const { items: cartItems} = req.body

    if(!cartItems || cartItems.length < 1){
        throw new CustomError.BadRequestError('No items provided')
    }

    if(cartItems.length >= 5){
        throw new CustomError.BadRequestError('Cart shouldnt be more than 5 items')
    }

    let orderItems = []
    let total = 0 

    for(const item of cartItems){
        const dbProduct = await Product.findOne({ _id: item.product })

        if(!dbProduct){
            throw new CustomError.NotFoundError(`No Product found with id: ${item.product}`)
        }

        const { name, price, _id} = dbProduct
        const SingleOrderItem = {
            amount: item.amount,
            name,
            price,
            product: _id
        }

        orderItems = [ ...orderItems, SingleOrderItem]
        total += item.amount * price
    }
   
    const order = await Order.create({
        orderItems,
        total,
        user: req.user.userId
    })
    sendMail({
        to: req.user.email,
        subject: 'Product Verification E-Mail',
        html: ` 
        <table>
       <tr>
         <th>Product Name</th>
         <th>Product Price</th>
         <th>Product Quantity</th>
       </tr>
       <tr>
         <td>${orderItems[0]?.name || ''}</td>
         <td>${orderItems[0]?.price || ''}</td>
         <td>${orderItems[0]?.amount || ''}</td>
       </tr>
       <tr>
          <td>${orderItems[1]?.name || ''}</td>
         <td>${orderItems[1]?.price || ''}</td>
         <td>${orderItems[1]?.amount || ''}</td>
       </tr>
     <tr>
          <td>${orderItems[2]?.name || ''}</td>
         <td>${orderItems[2]?.price || ''}</td>
         <td>${orderItems[2]?.amount || ''}</td>
       </tr>
     <tr>
          <td>${orderItems[3]?.name || ''}</td>
         <td>${orderItems[3]?.price || ''}</td>
         <td>${orderItems[3]?.amount || ''}</td>
       </tr>
     <tr>
          <td>${orderItems[4]?.name || ''}</td>
         <td>${orderItems[4]?.price || ''}</td>
         <td>${orderItems[4]?.amount || ''}</td>
       </tr>
     </table> 
        <h4>E-mail Id : ${req.user.email}
        Total : Rs.${order.total}</h4>`
    })
        res.status(StatusCodes.CREATED).json({ order })   
}

const getAllOrders = async (req,res) => {
    const order = await Order.find({}).populate({ path: 'user' , select: 'name email'})
    res.status(StatusCodes.OK).json({ order, count: order.length })
}

const getSingleOrderDetails = async(req,res) => {
    const { id: orderId } = req.params
    const order = await Order.findOne({ _id: orderId}).populate({ path: 'user' , select: 'name email'})
    if(!order){
        throw new CustomError.NotFoundError(`no order found with ${orderId} id`)
    }
    res.status(StatusCodes.OK).json({ order })
}

module.exports = { createOrder,getAllOrders,getSingleOrderDetails }