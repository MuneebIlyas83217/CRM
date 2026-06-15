import mongoose from "mongoose";

const clientSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },isActive:{
        type: Boolean,
        default: true
    },otp:{
        type: Number
    },
    role: {
        type: String,
        enum: ['admin', 'manager', 'accountant', 'customer'],
        default: 'admin'
    }
},{
    timestamps:true
})


export default mongoose.model("Client", clientSchema);