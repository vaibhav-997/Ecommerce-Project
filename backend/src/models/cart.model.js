import mongoose from 'mongoose'

const cartSchema = new mongoose.Schema({
    products:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Product"
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    quantity: {
        type:Number,
        default:1
    }
},{timestamps:true})


const Cart = mongoose.model("Cart", cartSchema)
export {Cart}