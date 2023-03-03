const Product = require('../model/products')
const { StatusCodes } = require('http-status-codes')
const CustomError = require('../errors')

const createProduct = async(req,res) => {
 req.body.user = req.user.userId
 console.log(req.user.userId,req.body.user)
 const product = await Product.create(req.body)
 res.status(StatusCodes.CREATED).json({ product })
}

const getSingleProduct = async(req,res) => {
    const { id: productId} = req.params
    const product = await Product.findOne({ _id:productId })

    if(!product){
        throw new CustomError.NotFoundError(`no product with ${productId} id`)
    }
    
    res.status(StatusCodes.OK).json({ product})
}

const getAllProducts = async(req,res) => {
    console.log(req.user)
    const product = await Product.find({}).populate({ path: 'user' , select: 'name email role'})
    res.status(StatusCodes.OK).json({ product })
}

const updateProduct = async(req,res) => {
    const { id: productId} = req.params

    const product = await Product.findOneAndUpdate({ _id:productId}, req.body, {
        new: true,
        runValidators: true
    })
    if(!product){
        throw new CustomError.NotFoundError(`no product with ${productId} id`)
    }
    res.status(StatusCodes.OK).json({ product })
}

const deleteProduct = async(req,res) => {
    const { id: productId} = req.params

    const product = await Product.findOneAndDelete({ _id: productId })

    if(!product){
        throw new CustomError.NotFoundError(`no product with ${productId} id`)
    }

    res.status(StatusCodes.OK).json({ product })
}

module.exports = { createProduct,getSingleProduct,getAllProducts,updateProduct,deleteProduct }