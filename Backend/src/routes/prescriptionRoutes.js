import express from "express";

import {
    uploadPrescription,
    getMyPrescriptions,
    deletePrescription
} from "../controllers/prescriptionController.js";

import authMiddleware from "../middleware/authMiddleware.js";

import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.post(
    "/",
    authMiddleware,
    upload.single("prescription"),
    uploadPrescription
);

router.get(
    "/my-prescriptions",
    authMiddleware,
    getMyPrescriptions
);

router.delete(
    "/:id",
    authMiddleware,
    deletePrescription
);

export default router;