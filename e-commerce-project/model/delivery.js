const mongoose = require('mongoose')

const deliverySchema = new mongoose.Schema({

    orderId: {
        type: String,
        required: true
    },
    CustomerName: {
        type: String,
        required: true
    },
    CustomerAddress: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['under process','delivered', 'doorClosed', 'returned', 'wrongAddress'],
        default: 'under process'
    },
    Dpid:{
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Delivery', deliverySchema)