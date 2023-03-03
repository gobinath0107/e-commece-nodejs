const express = require('express')
const router = express.Router()

const { authMiddleware,authorizePermissions } = require('../middleware/auth')

const { getAllReturns,getSingleReturn,createReturn,updateReturn,updateReturnSeller, getSingleUserReturn } = require('../controller/returnController')


router.route('/').get(authMiddleware,authorizePermissions('seller'),getAllReturns).post(authMiddleware,createReturn)
router.route('/getallreturn').get(authMiddleware,getSingleUserReturn)
router.route('/updatereturn/:id').patch(authMiddleware,authorizePermissions('seller'),updateReturnSeller)
router.route('/:id').get(authMiddleware,getSingleReturn).patch(authMiddleware,updateReturn)



module.exports = router 