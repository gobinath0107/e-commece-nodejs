const express = require('express')
const router = express.Router()

const { authMiddleware,authorizePermissions } = require('../middleware/auth')

const { createOrder, getAllOrders,getSingleOrderDetails } = require('../controller/orderController')

router.route('/').post(authMiddleware,createOrder)
router.route('/').get(authMiddleware,authorizePermissions('seller'),getAllOrders)
router.route('/:id').get(authMiddleware,getSingleOrderDetails)

module.exports = router