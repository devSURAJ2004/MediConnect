import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../services/api.js";
import { useCart } from "../context/CartContext.jsx";

function MedicineDetails() {
    const { id } = useParams();
    const { addToCart } = useCart();

    const [medicine, setMedicine] = useState(null);
    const [quantity, setQuantity] = useState(1);

    const [loading, setLoading] = useState(true);
    const [adding, setAdding] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        const fetchMedicine = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await api.get(
                    `/medicines/${id}`
                );

                setMedicine(response.data.medicine);
            } catch (error) {
                console.error(error);

                setError(
                    error.response?.data?.message ||
                    "Failed to load medicine"
                );
            } finally {
                setLoading(false);
            }
        };

        fetchMedicine();
    }, [id]);

    const handleAddToCart = async () => {
        try {
            setAdding(true);
            setError("");
            setSuccess("");

            await addToCart(
                medicine._id,
                quantity
            );

            setSuccess(
                "Medicine added to cart successfully!"
            );
        } catch (error) {
            console.error(error);

            setError(
                error.response?.data?.message ||
                "Please login to add medicines to cart"
            );
        } finally {
            setAdding(false);
        }
    };

    if (loading) {
        return (
            <div className="container page">
                <p>Loading medicine...</p>
            </div>
        );
    }

    if (error && !medicine) {
        return (
            <div className="container page">
                <p className="error">{error}</p>

                <Link
                    to="/medicines"
                    className="details-button"
                >
                    Back to Medicines
                </Link>
            </div>
        );
    }

    return (
        <div className="container page">

            <Link
                to="/medicines"
                className="back-link"
            >
                ← Back to Medicines
            </Link>

            <div className="product-details">

                {/* IMAGE */}

                <div className="product-image-section">

                    {medicine.image ? (
                        <img
                            src={medicine.image}
                            alt={medicine.name}
                            className="product-image"
                        />
                    ) : (
                        <div className="product-image-placeholder">
                            💊
                        </div>
                    )}

                </div>

                {/* INFORMATION */}

                <div className="product-info">

                    <p className="medicine-category">
                        {medicine.category}
                    </p>

                    <h1>
                        {medicine.name}
                    </h1>

                    <p className="product-manufacturer">
                        Manufactured by{" "}
                        <strong>
                            {medicine.manufacturer}
                        </strong>
                    </p>

                    <div className="product-price">
                        ₹{medicine.price}
                    </div>

                    <p className="product-description">
                        {medicine.description}
                    </p>

                    <div className="product-stock">

                        {medicine.stock > 0 ? (
                            <span className="in-stock">
                                ✓ In Stock
                            </span>
                        ) : (
                            <span className="out-of-stock">
                                ✕ Out of Stock
                            </span>
                        )}

                        <span>
                            {medicine.stock} units available
                        </span>

                    </div>

                    {medicine.requiresPrescription && (
                        <div className="prescription-notice">
                            📋 Prescription required for
                            purchasing this medicine.
                        </div>
                    )}

                    {medicine.stock > 0 && (
                        <div className="purchase-section">

                            <div className="quantity-control">

                                <button
                                    type="button"
                                    onClick={() =>
                                        setQuantity(
                                            Math.max(
                                                1,
                                                quantity - 1
                                            )
                                        )
                                    }
                                >
                                    −
                                </button>

                                <span>
                                    {quantity}
                                </span>

                                <button
                                    type="button"
                                    onClick={() =>
                                        setQuantity(
                                            Math.min(
                                                medicine.stock,
                                                quantity + 1
                                            )
                                        )
                                    }
                                >
                                    +
                                </button>

                            </div>

                            <button
                                className="add-cart-button"
                                onClick={handleAddToCart}
                                disabled={adding}
                            >
                                {adding
                                    ? "Adding..."
                                    : "🛒 Add to Cart"}
                            </button>

                        </div>
                    )}

                    {success && (
                        <div className="success-message">
                            {success}

                            <Link to="/cart">
                                View Cart →
                            </Link>
                        </div>
                    )}

                    {error && (
                        <p className="error">
                            {error}
                        </p>
                    )}

                </div>

            </div>

        </div>
    );
}

export default MedicineDetails;