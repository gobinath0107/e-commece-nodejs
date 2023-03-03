const User = require('../model/users')
const { StatusCodes } = require('http-status-codes')
const CustomError = require('../errors')
const { createTokenUser,attachCookiesToRes } =require('../utils')

const register = async (req,res) => {
    const { email,name,password,role } = req.body

    const emailAlreadyExists = await User.findOne({ email })
    if(emailAlreadyExists){
        throw new CustomError.BadRequestError('E-mail already exist!')
    }
    const user = await User.create({ name,email,password,role })
    const tokenUser = createTokenUser(user)
    attachCookiesToRes({ res, user: tokenUser})
    res.status(StatusCodes.CREATED).json({ user })
}

const login = async (req,res) => {
   const { email,password } = req.body
   
   if(!email, !password){
    throw new CustomError.BadRequestError('Please provide email and password')
   }
   const user = await User.findOne({ email })

   if(!user){
    throw new CustomError.UnauthenticatedError('invalid credentials')
   }

   const isPasswordCorrect = await user.comparePassword(password)
   if(!isPasswordCorrect){
    throw new CustomError.UnauthenticatedError('invalid credentials')
   }
   const tokenUser = createTokenUser(user)
   attachCookiesToRes({ res,user: tokenUser })

   res.status(StatusCodes.OK).json({ user: tokenUser })
}

const logout = async (req,res) => {
    res.cookie('logout','getout',{
        httpOnly: true,
        expires: new Date(Date.now() + 1000)
    })
    res.status(StatusCodes.OK).json({ msg: 'User Logged Out!'})
}

module.exports = { register,login,logout }