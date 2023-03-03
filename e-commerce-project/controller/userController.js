const User = require('../model/users')
const { StatusCodes } = require('http-status-codes')
const CustomError = require('../errors')

const {
    createTokenUser,attachCookiesToRes,checkPermissons
} = require('../utils')

const getAllUsers = async(req,res) => {
    const user = await User.find({ role: 'user'}).select('-password')
    res.status(StatusCodes.OK).json({ user })
}

const getSingleUsers = async(req,res) => {
   const user = await User.findOne({ _id: req.params.id}).select('-password')
   if(!user){
    throw new CustomError.NotFoundError(`No user with ${req.params} id`)
   }
   checkPermissons(req.user, user._id)

   res.status(StatusCodes.OK).json({ user })
}

const showCurrentUser = async(req,res) => {
    res.status(StatusCodes.OK).json({ user:req.user })
}

const updateUser = async(req,res) => {
    const { email,name } = req.body
    if(!email || !name ){
        throw new CustomError.BadRequestError('Please Provide all the values')
    }

    const user = await User.findOne({ _id: req.user.userId})

    user.name = name
    user.email = email

    await user.save()
    const tokenUser = createTokenUser(user)
    attachCookiesToRes({ res, user: tokenUser})
    res.status(StatusCodes.OK).json({ user: tokenUser })
}



const deleteUser = async(req,res) => {
   const { id: userId } = req.params

   const user = await User.findOne({ _id: userId})

   if(!user){
    throw new CustomError.NotFoundError(`No user present with ${userId} id`)
   }

   user.remove()

   res.status(StatusCodes.OK).json({ msg: 'User Deleted!'})
}

module.exports = { 
    getAllUsers,getSingleUsers,showCurrentUser,updateUser,deleteUser
}