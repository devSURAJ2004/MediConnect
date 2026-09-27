import mongoose from "mongoose";

const prescriptionSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        imageUrl: {
            type: String,
            required: true
        },

        publicId: {
            type: String,
            required: true
        },

        status: {
            type: String,
            enum: [
                "pending",
                "approved",
                "rejected"
            ],
            default: "pending"
        },

        adminNote: {
            type: String,
            default: ""
        }
    },
    {
        timestamps: true
    }
);

const prescriptionModel = mongoose.model(
    "Prescription",
    prescriptionSchema
);

export default prescriptionModel;