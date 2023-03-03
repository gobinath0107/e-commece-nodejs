const express = require('express')
const router = express.Router()

const { authMiddleware,authorizePermissions } = require('../middleware/auth')


const { createProduct,getSingleProduct,getAllProducts,updateProduct,deleteProduct } = require('../controller/productController')

router.route('/').post([authMiddleware,authorizePermissions('seller')],createProduct).get(getAllProducts)

router.route('/:id').get(getSingleProduct)
.patch([authMiddleware,authorizePermissions('seller')],updateProduct)
.delete([authMiddleware,authorizePermissions('seller')],deleteProduct)

module.exports = router