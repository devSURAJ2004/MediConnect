import express from "express";

import {
    createOrder,
    getMyOrders,
    getOrderById,
    cancelOrder
} from "../controllers/orderController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post(
    "/",
    authMiddleware,
    createOrder
);

router.get(
    "/my-orders",
    authMiddleware,
    getMyOrders
);

router.get(
    "/:id",
    authMiddleware,
    getOrderById
);

router.put(
    "/:id/cancel",
    authMiddleware,
    cancelOrder
);

export default router;