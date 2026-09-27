import Medicine from "../models/medicineModel.js";

// Get all medicines
export const getMedicines = async (req, res) => {
    try {
        const { search } = req.query;

        let query = {};

        if (search) {
            query = {
                name: {
                    $regex: search,
                    $options: "i"
                }
            };
        }

        const medicines = await Medicine.find(query);

        res.status(200).json({
            medicines
        });

    } catch (error) {
        console.error("Get medicines error:", error);

        res.status(500).json({
            message: "Failed to get medicines"
        });
    }
};
// Get medicine by ID
export const getMedicineById = async (req, res) => {
    try {
        const medicine = await Medicine.findById(req.params.id);

        if (!medicine) {
            return res.status(404).json({
                message: "Medicine not found"
            });
        }

        res.status(200).json({
            medicine
        });

    } catch (error) {
        console.error("Get medicine by ID error:", error);

        res.status(500).json({
            message: "Failed to get medicine"
        });
    }
};

// Create medicine
export const createMedicine = async (req, res) => {
    try {
        const medicine = await Medicine.create(req.body);

        res.status(201).json({
            message: "Medicine created successfully",
            medicine
        });
    } catch (error) {
        console.error("Create medicine error:", error);
        res.status(500).json({
            message: "Failed to create medicine"
        });
    }
};

// Update medicine
export const updateMedicine = async (req, res) => {
    try {
        const medicine = await Medicine.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!medicine) {
            return res.status(404).json({
                message: "Medicine not found"
            });
        }

        res.status(200).json({
            message: "Medicine updated successfully",
            medicine
        });
    } catch (error) {
        console.error("Update medicine error:", error);
        res.status(500).json({
            message: "Failed to update medicine"
        });
    }
};

// Delete medicine
export const deleteMedicine = async (req, res) => {
    try {
        const medicine = await Medicine.findByIdAndDelete(req.params.id);

        if (!medicine) {
            return res.status(404).json({
                message: "Medicine not found"
            });
        }

        res.status(200).json({
            message: "Medicine deleted successfully"
        });
    } catch (error) {
        console.error("Delete medicine error:", error);
        res.status(500).json({
            message: "Failed to delete medicine"
        });
    }
};

// Match medicines from prescription
export const matchMedicines = async (req, res) => {
    try {
        const { medicines } = req.body;

        if (!medicines || !Array.isArray(medicines)) {
            return res.status(400).json({
                message: "Medicines must be provided as an array"
            });
        }

        const matchedMedicines = [];

        for (const medicineName of medicines) {
            const medicine = await Medicine.findOne({
                name: {
                    $regex: medicineName,
                    $options: "i"
                }
            });

            if (medicine) {
                matchedMedicines.push(medicine);
            }
        }

        res.status(200).json({
            count: matchedMedicines.length,
            medicines: matchedMedicines
        });

    } catch (error) {
        console.error("Medicine matching error:", error);

        res.status(500).json({
            message: "Failed to match medicines"
        });
    }
};