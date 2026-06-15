import mongoose from "mongoose";

const invoiceSchema = new mongoose.Schema({
    client: {
        type: String,
        required: true
    },
    Number: {
        type: Number,
        required: true,
        unique: true
    },
    Year: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ["draft", "final"],
        default: "draft"
    },Date : {
        type:Date,
        required:true
    },expire_date:{
        type:Date,
        required:true   
    },note: {
        type:String,
    },items: {
        type:String,
          },
          description: {
            type:String,
            
          },
    price: {
        type: Number,
        required: true
    },
    Quentity: {
        type: String,
        required: true
    },
    total: {
        type: Number,
        required: true
    }
},{
    timestamps:true
})


export default mongoose.model("Invoice", invoiceSchema);