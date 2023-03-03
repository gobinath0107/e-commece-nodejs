const { StatusCodes } = require('http-status-codes')
const Order = require('../model/order')
const Return = require('../model/return')
const CustomError = require('../errors')
const { checkPermissons } = require('../utils')
const sendEmail = require('../utils/sendMail')

const getAllReturns = async(req,res) => {
    const returns = await Return.find({}).populate({ path: 'user', select: 'name email'})
    res.status(StatusCodes.OK).json({ returns , count: returns.length})
}

const getSingleReturn = async(req,res) => {
    const { id: returnId } = req.params

    const returns = await Return.findOne({ _id: returnId })

    if(!returns){
        throw new CustomError.NotFoundError(`No return found with ${returnId} id`)
    }

    checkPermissons(req.user,returns.user)
    res.status(StatusCodes.OK).json({ returns})
}

const getSingleUserReturn = async(req,res) => {
    const returns = await Return.find({ user: req.user.userId})

    res.status(StatusCodes.OK).json({ returns, count: returns.length})
}

const createReturn = async(req,res) => {
    req.body.user = req.user.userId
    const { isReturn, reason, order:orderId } = req.body

    if(!isReturn || !reason ){
        throw new CustomError.BadRequestError('Please provide all the details!')
    }
    
    const order = await Order.findOne({ _id: orderId})

    if(!order){
        throw new CustomError.BadRequestError('No order for return found')
    }

    const alreadySubmitted = await Return.findOne({ order: orderId, user: req.user.userId})
    
    if(alreadySubmitted){
        throw new CustomError.BadRequestError('Already submitted a return, please wait for seller to respond')
    }

    const returns = await Return.create(req.body)
    res.status(StatusCodes.CREATED).json({ returns })
}

const updateReturn = async(req,res) => {
   const { id: returnId} = req.params

   const { isReturn,reason } = req.body

    const returns = await Return.findOne({ _id: returnId })

    if(!returns){
        throw new CustomError.NotFoundError(`No return found with ${returnId} id`)
    }

    checkPermissons(req.user,returns.user)
    
    returns.isReturn = isReturn,
    returns.reason = reason

    await returns.save()
    res.status(StatusCodes.OK).json({ returns})
}

const updateReturnSeller = async(req,res) => {
    const { id: returnId } = req.params
    const { statusOfReturn } = req.body
    const returns = await Return.findOne({ _id: returnId}).populate({ path: 'user', select: 'name email'})

   if(!returns){
    throw new CustomError.NotFoundError(`No return found with ${returnId} id`)
    }

    returns.statusOfReturn = statusOfReturn

    await returns.save()
    sendEmail({
        to: returns.user.email,
        subject: "Return Status Update E-Mail",
        html: `Your request for return is ${statusOfReturn},
               in case of refund, your refund will be intiated to
               your bank account within 3 business days`
    })
    res.status(StatusCodes.OK).json({ returns})
}

module.exports = { getAllReturns,getSingleReturn,createReturn,updateReturn,updateReturnSeller, getSingleUserReturn}