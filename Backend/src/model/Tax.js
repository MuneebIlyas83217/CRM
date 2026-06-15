import mongoose from "mongoose"

const taxSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    value: {
        type: Number,
        required: true
    },
    enabled: {
        type: Boolean,
        default: false
    },
    default: {
        type: Boolean,
        default: false
    }

})

export default  mongoose.model("Tax", taxSchema)
