import express from "express";
import cors from "cors";

import authRoutes from "./src/routes/authRoutes.js";
import medicineRoutes from "./src/routes/medicineRoutes.js";
import cartRoutes from "./src/routes/cartRoutes.js";
import orderRoutes from "./src/routes/orderRoutes.js";
import prescriptionRoutes from "./src/routes/prescriptionRoutes.js";
import adminRoutes from "./src/routes/adminRoutes.js";

const app = express();

app.use(cors());

app.use(express.json());

app.use("/api/auth", authRoutes);

app.use("/api/medicines", medicineRoutes);

app.use("/api/cart", cartRoutes);

app.use("/api/orders", orderRoutes);

app.use("/api/prescriptions", prescriptionRoutes);

app.use("/api/admin", adminRoutes);

app.get("/", (req, res) => {
    res.json({
        message: "MediConnect API is running"
    });
});

export default app;