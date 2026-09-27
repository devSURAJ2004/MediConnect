import prescriptionModel from "../models/prescriptionModel.js";
import uploadToCloudinary from "../services/cloudinaryService.js";
import { v2 as cloudinary } from "cloudinary";


// UPLOAD PRESCRIPTION

export const uploadPrescription = async (req, res) => {

    try {

        if (!req.file) {
            return res.status(400).json({
                message: "Prescription file is required"
            });
        }

        const result = await uploadToCloudinary(
            req.file.buffer,
            "mediconnect/prescriptions"
        );

        const prescription = await prescriptionModel.create({
            user: req.user._id,
            imageUrl: result.secure_url,
            publicId: result.public_id
        });

        res.status(201).json({
            message: "Prescription uploaded successfully",
            prescription
        });

    } catch (error) {

        res.status(500).json({
            message: "Prescription upload failed",
            error: error.message
        });

    }
};


// GET MY PRESCRIPTIONS

export const getMyPrescriptions = async (req, res) => {

    try {

        const prescriptions = await prescriptionModel
            .find({
                user: req.user._id
            })
            .sort({
                createdAt: -1
            });

        res.status(200).json({
            count: prescriptions.length,
            prescriptions
        });

    } catch (error) {

        res.status(500).json({
            message: "Server error",
            error: error.message
        });

    }
};


// DELETE PRESCRIPTION

export const deletePrescription = async (req, res) => {

    try {

        const prescription = await prescriptionModel.findOne({
            _id: req.params.id,
            user: req.user._id
        });

        if (!prescription) {
            return res.status(404).json({
                message: "Prescription not found"
            });
        }

        await cloudinary.uploader.destroy(
            prescription.publicId
        );

        await prescriptionModel.findByIdAndDelete(
            prescription._id
        );

        res.status(200).json({
            message: "Prescription deleted successfully"
        });

    } catch (error) {

        res.status(500).json({
            message: "Server error",
            error: error.message
        });

    }
};


// GET ALL PRESCRIPTIONS - ADMIN

export const getAllPrescriptions = async (req, res) => {

    try {

        const prescriptions = await prescriptionModel
            .find()
            .populate("user", "name email")
            .sort({
                createdAt: -1
            });

        res.status(200).json({
            count: prescriptions.length,
            prescriptions
        });

    } catch (error) {

        res.status(500).json({
            message: "Server error",
            error: error.message
        });

    }
};


// UPDATE PRESCRIPTION STATUS - ADMIN

export const updatePrescriptionStatus = async (req, res) => {

    try {

        const {
            status,
            adminNote
        } = req.body;

        const allowedStatuses = [
            "pending",
            "approved",
            "rejected"
        ];

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                message: "Invalid prescription status"
            });
        }

        const prescription =
            await prescriptionModel.findById(
                req.params.id
            );

        if (!prescription) {
            return res.status(404).json({
                message: "Prescription not found"
            });
        }

        prescription.status = status;

        if (adminNote !== undefined) {
            prescription.adminNote = adminNote;
        }

        await prescription.save();

        res.status(200).json({
            message: "Prescription status updated",
            prescription
        });

    } catch (error) {

        res.status(500).json({
            message: "Server error",
            error: error.message
        });

    }
};