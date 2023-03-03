const mongoose = require('mongoose')

const SingleOrder = mongoose.Schema({
    name: { type: String, required: true },
    price: { type: String, required: true },
    amount: { type: Number, required: true },
    product: {
        type: mongoose.Schema.ObjectId,
        ref: 'Product',
        required: true
    }
})

const orderSchema = mongoose.Schema({
   orderItems: [ SingleOrder ],
   status: {
    type: String,
    enum: [ 'pending','failed','paid','delivered','cancelled'],
    default: 'pending'
   },
   total: {
    type: Number,
    required: true
   },
   user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
   } 
},{ timestamps: true})

module.exports = mongoose.model('Order', orderSchema)