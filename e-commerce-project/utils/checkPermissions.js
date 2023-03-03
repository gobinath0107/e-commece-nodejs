const CustomError = require('../errors')

const checkPermissons = (reqUser, currUserId) => {
   if(reqUser.role === 'seller')return
   if(reqUser.userId === currUserId.toString())return
   throw new CustomError.UnauthorizedError(
    'Oops , Youre not authorized to access thiss route!'
   ) 
}

module.exports = checkPermissons