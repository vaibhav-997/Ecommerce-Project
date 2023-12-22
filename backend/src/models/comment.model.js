import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    comments:{
        type:String,
        required:true
    },
    product:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Product"
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }
},{timestamps:true})


const Comments = mongoose.model("Comments", commentSchema)


export {Comments}