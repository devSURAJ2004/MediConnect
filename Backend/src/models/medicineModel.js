import mongoose from "mongoose";

const medicineSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        description: {
            type: String,
            required: true
        },

        manufacturer: {
            type: String,
            required: true
        },

        category: {
            type: String,
            required: true
        },

        price: {
            type: Number,
            required: true,
            min: 0
        },

        stock: {
            type: Number,
            required: true,
            min: 0
        },

        image: {
            type: String,
            default: ""
        },

        requiresPrescription: {
            type: Boolean,
            default: false
        }
    },

    {
        timestamps: true
    }
);

const medicineModel = mongoose.model(
    "Medicine",
    medicineSchema
);

export default medicineModel;