import express from "express";

import {
    addToCart,
    getCart,
    removeFromCart,
    updateCartQuantity
} from "../controllers/cartController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();


router.get(
    "/",
    authMiddleware,
    getCart
);


router.post(
    "/",
    authMiddleware,
    addToCart
);


router.put(
    "/:medicineId",
    authMiddleware,
    updateCartQuantity
);


router.delete(
    "/:medicineId",
    authMiddleware,
    removeFromCart
);


export default router;