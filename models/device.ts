import mongoose from "mongoose";

const usage = new mongoose.Schema({
    device: {
        required: true,
        type: mongoose.Schema.Types.ObjectId, ref: 'Device'
    },
    customer: {
        required: true,
        type: mongoose.Schema.Types.ObjectId, ref: 'Customer'
    },
    minutes: {
        required: true,
        type: Number
    }
})

export default mongoose.model('Usage', usage);