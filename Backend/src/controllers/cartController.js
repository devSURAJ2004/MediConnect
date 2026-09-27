import cartModel from "../models/cartModel.js";
import medicineModel from "../models/medicineModel.js";

export const addToCart = async (req, res) => {

    try {

        const { medicineId, quantity } = req.body;

        const userId = req.user._id;


        if (!medicineId || !quantity) {

            return res.status(400).json({
                message: "Medicine and quantity are required"
            });

        }


        const medicine = await medicineModel.findById(medicineId);


        if (!medicine) {

            return res.status(404).json({
                message: "Medicine not found"
            });

        }


        if (medicine.stock < quantity) {

            return res.status(400).json({
                message: "Not enough stock available"
            });

        }


        let cart = await cartModel.findOne({
            user: userId
        });


        // Create cart if user doesn't have one

        if (!cart) {

            cart = await cartModel.create({
                user: userId,

                items: [
                    {
                        medicine: medicineId,
                        quantity: quantity
                    }
                ]
            });

        }

        else {

            const existingItem = cart.items.find(
                item =>
                    item.medicine.toString() === medicineId
            );


            if (existingItem) {

                existingItem.quantity += Number(quantity);

            }

            else {

                cart.items.push({
                    medicine: medicineId,
                    quantity: quantity
                });

            }


            await cart.save();

        }


        const updatedCart = await cartModel
            .findOne({ user: userId })
            .populate("items.medicine");


        res.status(200).json({

            message: "Medicine added to cart",

            cart: updatedCart

        });


    } catch (error) {

        res.status(500).json({

            message: "Server error",

            error: error.message

        });

    }
};


export const getCart = async (req, res) => {

    try {

        const cart = await cartModel
            .findOne({
                user: req.user._id
            })
            .populate("items.medicine");


        if (!cart) {

            return res.status(200).json({

                cart: {
                    items: []
                }

            });

        }


        res.status(200).json({
            cart
        });


    } catch (error) {

        res.status(500).json({

            message: "Server error",

            error: error.message

        });

    }
};


export const removeFromCart = async (req, res) => {

    try {

        const { medicineId } = req.params;


        const cart = await cartModel.findOne({
            user: req.user._id
        });


        if (!cart) {

            return res.status(404).json({
                message: "Cart not found"
            });

        }


        cart.items = cart.items.filter(
            item =>
                item.medicine.toString() !== medicineId
        );


        await cart.save();


        const updatedCart = await cartModel
            .findOne({
                user: req.user._id
            })
            .populate("items.medicine");


        res.status(200).json({

            message: "Medicine removed from cart",

            cart: updatedCart

        });


    } catch (error) {

        res.status(500).json({

            message: "Server error",

            error: error.message

        });

    }
};


export const updateCartQuantity = async (req, res) => {

    try {

        const { medicineId } = req.params;

        const { quantity } = req.body;


        if (!quantity || quantity < 1) {

            return res.status(400).json({
                message: "Quantity must be at least 1"
            });

        }


        const cart = await cartModel.findOne({
            user: req.user._id
        });


        if (!cart) {

            return res.status(404).json({
                message: "Cart not found"
            });

        }


        const item = cart.items.find(
            item =>
                item.medicine.toString() === medicineId
        );


        if (!item) {

            return res.status(404).json({
                message: "Medicine not found in cart"
            });

        }


        const medicine =
            await medicineModel.findById(medicineId);


        if (!medicine) {

            return res.status(404).json({
                message: "Medicine not found"
            });

        }


        if (medicine.stock < quantity) {

            return res.status(400).json({
                message: "Not enough stock available"
            });

        }


        item.quantity = Number(quantity);

        await cart.save();


        const updatedCart = await cartModel
            .findOne({
                user: req.user._id
            })
            .populate("items.medicine");


        res.status(200).json({

            message: "Cart updated successfully",

            cart: updatedCart

        });


    } catch (error) {

        res.status(500).json({

            message: "Server error",

            error: error.message

        });

    }
};