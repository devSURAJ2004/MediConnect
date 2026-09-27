import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
    {
        medicine: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Medicine",
            required: true
        },

        name: {
            type: String,
            required: true
        },

        price: {
            type: Number,
            required: true
        },

        quantity: {
            type: Number,
            required: true,
            min: 1
        }
    },
    {
        _id: false
    }
);

const orderSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        items: [orderItemSchema],

        totalAmount: {
            type: Number,
            required: true,
            min: 0
        },

        shippingAddress: {
            fullName: {
                type: String,
                required: true
            },

            phone: {
                type: String,
                required: true
            },

            address: {
                type: String,
                required: true
            },

            city: {
                type: String,
                required: true
            },

            state: {
                type: String,
                required: true
            },

            pincode: {
                type: String,
                required: true
            }
        },

        paymentMethod: {
            type: String,
            enum: ["COD", "ONLINE"],
            default: "COD"
        },

        paymentStatus: {
            type: String,
            enum: ["pending", "paid", "failed"],
            default: "pending"
        },

        orderStatus: {
            type: String,
            enum: [
                "placed",
                "confirmed",
                "processing",
                "shipped",
                "delivered",
                "cancelled"
            ],
            default: "placed"
        }
    },
    {
        timestamps: true
    }
);

const orderModel = mongoose.model("Order", orderSchema);

export default orderModel;