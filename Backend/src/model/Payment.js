import mongoose from "mongoose"

const paymentSchema = new mongoose.Schema({
    payment_mode: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    enabled: {
        type: Boolean,
        default: false
    },
    default_Mode: {
        type: Boolean,
        default: false
    }

})

export default mongoose.model("Payment", paymentSchema)