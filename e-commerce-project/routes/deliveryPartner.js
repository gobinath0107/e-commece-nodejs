const express = require('express')
const router = express.Router()
const { authMiddleware,authorizePermissions } = require('../middleware/auth')

const { getAllDPs,createOrderDp,getAllOrdersDp,updateDeliveryDp } = require('../controller/deliveryController')


router.route('/').get(authMiddleware,authorizePermissions('seller'),getAllDPs).post(authMiddleware,authorizePermissions('seller'),createOrderDp)
router.route('/deliveryPartner').get(authMiddleware,authorizePermissions('deliveryPartner','seller'),getAllOrdersDp)
router.route('/deliveryPartner/:id').patch(authMiddleware,authorizePermissions('deliveryPartner','seller'),updateDeliveryDp)

module.exports = router