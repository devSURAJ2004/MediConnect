import Medicine from "../models/medicineModel.js";
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