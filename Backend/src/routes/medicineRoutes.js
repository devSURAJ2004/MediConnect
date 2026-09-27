import express from "express";

import {
    getMedicines,
    getMedicineById,
    createMedicine,
    updateMedicine,
    deleteMedicine,
    matchMedicines
} from "../controllers/medicineController.js";

const router = express.Router();

router.get("/", getMedicines);

router.post("/match", matchMedicines);

router.get("/:id", getMedicineById);

router.post("/", createMedicine);

router.put("/:id", updateMedicine);

router.delete("/:id", deleteMedicine);

export default router;