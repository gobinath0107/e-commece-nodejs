const mongoose = require('mongoose')

const returnSchema = new mongoose.Schema({

    isReturn: {
    type: Boolean,
    default: false
    },
    order: {
    type: mongoose.Schema.ObjectId,
    ref: 'Order',
    required: true
    },
    reason: {
      type: String,
      required: true  
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    statusOfReturn: {
        type: String,
        enum: ['approved', 'rejected', 'pending'],
        default: 'pending'
    }
})

module.exports = mongoose.model('Return', returnSchema)