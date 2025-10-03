
const mongoose = require("mongoose");

const todoSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        date: {
            type: Date,
            required: true,
        },
        priority: {
            type: String,
            enum: ["Extreme", "Moderate", "Low"],
            required: true
        },
        completed: {
            type: Boolean,
            default: false
        },
        expireAt: {
            type: Date,
        },
        status: {
            type: String,
            enum: ["Pending", "Completed", "Expired"],
            default: "Pending"
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
    },
    { timestamps: true }
)
module.exports = mongoose.model("Todo", todoSchema);