import express from "express";

import {
    getAllUsers,
    getUserById,
    updateUserRole,
    deleteUser,
    getDashboardStats
} from "../controllers/adminController.js";

import {
    getAllOrders,
    updateOrderStatus
} from "../controllers/orderController.js";

import {
    getAllPrescriptions,
    updatePrescriptionStatus
} from "../controllers/prescriptionController.js";



import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";

const router = express.Router();


// ==================== USERS ====================

router.get(
    "/users",
    authMiddleware,
    adminMiddleware,
    getAllUsers
);

router.get(
    "/users/:id",
    authMiddleware,
    adminMiddleware,
    getUserById
);

router.put(
    "/users/:id/role",
    authMiddleware,
    adminMiddleware,
    updateUserRole
);

router.delete(
    "/users/:id",
    authMiddleware,
    adminMiddleware,
    deleteUser
);


// ==================== ORDERS ====================

router.get(
    "/orders",
    authMiddleware,
    adminMiddleware,
    getAllOrders
);

router.put(
    "/orders/:id/status",
    authMiddleware,
    adminMiddleware,
    updateOrderStatus
);


// ==================== PRESCRIPTIONS ====================

router.get(
    "/prescriptions",
    authMiddleware,
    adminMiddleware,
    getAllPrescriptions
);

router.put(
    "/prescriptions/:id/status",
    authMiddleware,
    adminMiddleware,
    updatePrescriptionStatus
);

router.get(
    "/dashboard",
    authMiddleware,
    adminMiddleware,
    getDashboardStats
);


export default router;