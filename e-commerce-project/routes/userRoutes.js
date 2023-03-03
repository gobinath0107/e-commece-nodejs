const express = require('express')
const router = express.Router()

const { authMiddleware,authorizePermissions } = require('../middleware/auth')

const { 
    getAllUsers,getSingleUsers,showCurrentUser,updateUser,deleteUser
} = require('../controller/userController')

router.route('/').get(authMiddleware,authorizePermissions('seller'),getAllUsers)

router.route('/showuser').get(authMiddleware,showCurrentUser)
router.route('/updateuser').patch(authMiddleware,updateUser)

router.route('/:id').get(authMiddleware,getSingleUsers).delete(authMiddleware,deleteUser)

module.exports = router