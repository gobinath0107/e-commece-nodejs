const mongoose = require('mongoose')

const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: [ true, 'Please provide a product name'],
        maxlength: [100, 'Name cant be more than 100 characters']
    },
    price: {
        type: Number,
        required: [true, 'Please provide product price'],
        default: 0
    },
    description: {
        type: String,
        required: [true, 'Please provide product desc'],
        maxlength: [1000,'Desc can not be more than 1000 characters']
    },
    category: {
        type: String,
        required: true,
        enum: ['mobile','laptops','accessory']
    },
    user:{
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true
    }

},{ timestamps: true})

module.exports = mongoose.model('Product', ProductSchema)