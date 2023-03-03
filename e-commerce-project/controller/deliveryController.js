const Order = require('../model/order')
const { StatusCodes } = require('http-status-codes')
const User = require('../model/users')
const Delivery = require('../model/delivery')
const CustomError = require('../errors')

const getAllDPs = async(req,res) => {
    const user = await User.find({ role: 'deliveryPartner'})
    res.status(StatusCodes.OK).json({ user })
}

const createOrderDp = async(req,res) => {
    // Access only by seller
    //orderId, userName , userAddress , Dpid
     const { orderId, CustomerName } = req.body
    const order = await Order.findOne( { _id: orderId }).populate({ path: 'user', select: 'name email'})
    if(!order){ 
        throw new CustomError.NotFoundError(`No order found with this ${orderId} id`)
     }
    if(order.user.name !== CustomerName ){ 
        throw new CustomError.BadRequestError('')
     }
     const alreadyMadeaOrder = await Delivery.findOne({ orderId: orderId, CustomerName: CustomerName})
     if(alreadyMadeaOrder){
        throw new CustomError.BadRequestError('Already submitted a request!')
     }
    //if(order.user.address !== CustomerAddress ){ error }
    const delivery = await Delivery.create( req.body )
    res.status(StatusCodes.CREATED).json({ delivery })
}

const getAllOrdersDp = async(req,res) => {
    //Access only to Dp
    //Dpid ==== orders should match
    const delivery = await Delivery.find({ Dpid: req.user.userId })
    res.status(StatusCodes.OK).json({ delivery })
}

const updateDeliveryDp = async(req,res) => {
    //Access only to deliveryP
    const { id: deliveryId } = req.params
    const delivery = await Delivery.findOneAndUpdate({ _id: deliveryId }, req.body , { new: true, runValidators: true})
    if(!delivery){
        throw new CustomError.NotFoundError(`Given delivery Id ${deliveryId} doesn't exist`)
    }
    res.status(StatusCodes.OK).json({ delivery })
}

module.exports = { getAllDPs,createOrderDp,getAllOrdersDp,updateDeliveryDp }