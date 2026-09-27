import orderModel from "../models/orderModel.js";
import cartModel from "../models/cartModel.js";
import medicineModel from "../models/medicineModel.js";


// CREATE ORDER

export const createOrder = async (req, res) => {
    try {

        const {
            shippingAddress,
            paymentMethod
        } = req.body;

        const userId = req.user._id;

        if (!shippingAddress) {
            return res.status(400).json({
                message: "Shipping address is required"
            });
        }

        const cart = await cartModel
            .findOne({ user: userId })
            .populate("items.medicine");

        if (!cart || cart.items.length === 0) {
            return res.status(400).json({
                message: "Cart is empty"
            });
        }

        let totalAmount = 0;

        const orderItems = [];

        for (const item of cart.items) {

            const medicine = item.medicine;

            if (!medicine) {
                return res.status(404).json({
                    message: "Medicine not found"
                });
            }

            if (medicine.stock < item.quantity) {
                return res.status(400).json({
                    message: `Not enough stock for ${medicine.name}`
                });
            }

            const itemTotal =
                medicine.price * item.quantity;

            totalAmount += itemTotal;

            orderItems.push({
                medicine: medicine._id,
                name: medicine.name,
                price: medicine.price,
                quantity: item.quantity
            });
        }

        const order = await orderModel.create({
            user: userId,
            items: orderItems,
            totalAmount,
            shippingAddress,
            paymentMethod: paymentMethod || "COD"
        });

        for (const item of cart.items) {

            await medicineModel.findByIdAndUpdate(
                item.medicine._id,
                {
                    $inc: {
                        stock: -item.quantity
                    }
                }
            );
        }

        await cartModel.findOneAndUpdate(
            { user: userId },
            {
                $set: {
                    items: []
                }
            }
        );

        res.status(201).json({
            message: "Order placed successfully",
            order
        });

    } catch (error) {

        res.status(500).json({
            message: "Server error",
            error: error.message
        });

    }
};


// GET MY ORDERS

export const getMyOrders = async (req, res) => {
    try {

        const orders = await orderModel
            .find({
                user: req.user._id
            })
            .sort({
                createdAt: -1
            });

        res.status(200).json({
            count: orders.length,
            orders
        });

    } catch (error) {

        res.status(500).json({
            message: "Server error",
            error: error.message
        });

    }
};


// GET SINGLE ORDER

export const getOrderById = async (req, res) => {
    try {

        const order = await orderModel
            .findOne({
                _id: req.params.id,
                user: req.user._id
            });

        if (!order) {
            return res.status(404).json({
                message: "Order not found"
            });
        }

        res.status(200).json({
            order
        });

    } catch (error) {

        res.status(500).json({
            message: "Server error",
            error: error.message
        });

    }
};


// CANCEL ORDER

export const cancelOrder = async (req, res) => {
    try {

        const order = await orderModel.findOne({
            _id: req.params.id,
            user: req.user._id
        });

        if (!order) {
            return res.status(404).json({
                message: "Order not found"
            });
        }

        if (
            order.orderStatus !== "placed" &&
            order.orderStatus !== "confirmed"
        ) {
            return res.status(400).json({
                message: "Order cannot be cancelled"
            });
        }

        for (const item of order.items) {

            await medicineModel.findByIdAndUpdate(
                item.medicine,
                {
                    $inc: {
                        stock: item.quantity
                    }
                }
            );
        }

        order.orderStatus = "cancelled";

        await order.save();

        res.status(200).json({
            message: "Order cancelled successfully",
            order
        });

    } catch (error) {

        res.status(500).json({
            message: "Server error",
            error: error.message
        });

    }
};


// GET ALL ORDERS - ADMIN

export const getAllOrders = async (req, res) => {
    try {

        const orders = await orderModel
            .find()
            .populate("user", "name email")
            .sort({
                createdAt: -1
            });

        res.status(200).json({
            count: orders.length,
            orders
        });

    } catch (error) {

        res.status(500).json({
            message: "Server error",
            error: error.message
        });

    }
};


// UPDATE ORDER STATUS - ADMIN

export const updateOrderStatus = async (req, res) => {
    try {

        const { status } = req.body;

        const allowedStatuses = [
            "placed",
            "confirmed",
            "processing",
            "shipped",
            "delivered",
            "cancelled"
        ];

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                message: "Invalid order status"
            });
        }

        const order = await orderModel.findById(
            req.params.id
        );

        if (!order) {
            return res.status(404).json({
                message: "Order not found"
            });
        }

        order.orderStatus = status;

        if (status === "delivered") {
            order.paymentStatus =
                order.paymentMethod === "COD"
                    ? "paid"
                    : order.paymentStatus;
        }

        await order.save();

        res.status(200).json({
            message: "Order status updated successfully",
            order
        });

    } catch (error) {

        res.status(500).json({
            message: "Server error",
            error: error.message
        });

    }
};