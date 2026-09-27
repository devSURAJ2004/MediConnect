import userModel from "../models/userModel.js";
import orderModel from "../models/orderModel.js";
import medicineModel from "../models/medicineModel.js";
import prescriptionModel from "../models/prescriptionModel.js";

// GET ALL USERS
export const getAllUsers = async (req, res) => {
    try {
        const users = await userModel
            .find()
            .select("-password")
            .sort({ createdAt: -1 });

        res.status(200).json({
            count: users.length,
            users
        });
    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};

// GET USER BY ID
export const getUserById = async (req, res) => {
    try {
        const user = await userModel
            .findById(req.params.id)
            .select("-password");

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.status(200).json({
            user
        });
    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};

// UPDATE USER ROLE
export const updateUserRole = async (req, res) => {
    try {
        const { role } = req.body;

        if (!["user", "admin"].includes(role)) {
            return res.status(400).json({
                message: "Role must be user or admin"
            });
        }

        const user = await userModel
            .findByIdAndUpdate(
                req.params.id,
                { role },
                {
                    new: true,
                    runValidators: true
                }
            )
            .select("-password");

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.status(200).json({
            message: "User role updated successfully",
            user
        });
    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};

// DELETE USER
export const deleteUser = async (req, res) => {
    try {
        if (req.params.id === req.user._id.toString()) {
            return res.status(400).json({
                message: "You cannot delete your own account"
            });
        }

        const user = await userModel.findByIdAndDelete(
            req.params.id
        );

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.status(200).json({
            message: "User deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};

// DASHBOARD STATS
export const getDashboardStats = async (req, res) => {
    try {
        const totalUsers = await userModel.countDocuments();

        const totalMedicines =
            await medicineModel.countDocuments();

        const totalOrders =
            await orderModel.countDocuments();

        const totalPrescriptions =
            await prescriptionModel.countDocuments();

        const pendingOrders =
            await orderModel.countDocuments({
                orderStatus: {
                    $in: [
                        "placed",
                        "confirmed",
                        "processing"
                    ]
                }
            });

        const pendingPrescriptions =
            await prescriptionModel.countDocuments({
                status: "pending"
            });

        const deliveredOrders =
            await orderModel.find({
                orderStatus: "delivered"
            });

        const totalRevenue = deliveredOrders.reduce(
            (total, order) => total + order.totalAmount,
            0
        );

        res.status(200).json({
            totalUsers,
            totalMedicines,
            totalOrders,
            totalPrescriptions,
            pendingOrders,
            pendingPrescriptions,
            totalRevenue
        });
    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};