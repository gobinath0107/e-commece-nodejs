const CustomError = require('../errors')
const { isTokeValid } = require('../utils')

const authMiddleware = async (req,res,next) => {
    const token = req.signedCookies.token

    if(!token){
        throw new CustomError.UnauthenticatedError('Auth failed')
    }

    try {
        const { name, userId, role, email } = isTokeValid({ token })
        req.user = { name,userId,role,email }
        next()
    } catch (error) {
        throw new CustomError.UnauthenticatedError('Auth Failed')
    }   
}

const authorizePermissions = (...roles) => {
    return (req,res,next) => {
        if(!roles.includes(req.user.role)){
            throw new CustomError.UnauthorizedError('Unauthorized Person!')
        }
         next()
    }
}

module.exports = {
    authMiddleware,authorizePermissions
}