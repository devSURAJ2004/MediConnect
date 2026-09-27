import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import api from "../services/api.js";

function Checkout() {
    const navigate = useNavigate();
    const { cart } = useCart();

    const [formData, setFormData] = useState({
        address: "",
        city: "",
        state: "",
        pincode: "",
        phone: ""
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    if (!cart || !cart.items || cart.items.length === 0) {
        return (
            <div className="container page">
                <div className="empty-cart">
                    <div className="empty-cart-icon">
                        🛒
                    </div>

                    <h1>Your Cart is Empty</h1>

                    <p>
                        Add some medicines before
                        proceeding to checkout.
                    </p>
                </div>
            </div>
        );
    }

    const total = cart.items.reduce(
        (sum, item) =>
            sum +
            item.medicine.price * item.quantity,
        0
    );

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);
            setError("");

            const token =
                localStorage.getItem("token");

            await api.post(
                "/orders",
                {
                    items: cart.items.map((item) => ({
                        medicine: item.medicine._id,
                        quantity: item.quantity,
                        price: item.medicine.price
                    })),
                    totalAmount: total,
                    shippingAddress: formData
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            navigate("/orders");
        } catch (error) {
            console.error(error);

            setError(
                error.response?.data?.message ||
                "Failed to place order"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container page">

            <div className="checkout-header">
                <h1>Checkout</h1>
                <p>
                    Complete your details to place
                    your medicine order.
                </p>
            </div>

            <div className="checkout-layout">

                {/* CUSTOMER DETAILS */}

                <div className="checkout-form-container">

                    <h2>Delivery Information</h2>

                    <form
                        className="checkout-form"
                        onSubmit={handleSubmit}
                    >

                        <div className="checkout-field">
                            <label>Phone Number</label>

                            <input
                                type="tel"
                                name="phone"
                                placeholder="Enter phone number"
                                value={formData.phone}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="checkout-field">
                            <label>Address</label>

                            <textarea
                                name="address"
                                placeholder="House number, street, area"
                                value={formData.address}
                                onChange={handleChange}
                                rows="3"
                                required
                            />
                        </div>

                        <div className="checkout-row">

                            <div className="checkout-field">
                                <label>City</label>

                                <input
                                    type="text"
                                    name="city"
                                    placeholder="City"
                                    value={formData.city}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="checkout-field">
                                <label>State</label>

                                <input
                                    type="text"
                                    name="state"
                                    placeholder="State"
                                    value={formData.state}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                        </div>

                        <div className="checkout-field">
                            <label>PIN Code</label>

                            <input
                                type="text"
                                name="pincode"
                                placeholder="6-digit PIN code"
                                value={formData.pincode}
                                onChange={handleChange}
                                maxLength="6"
                                required
                            />
                        </div>

                        {error && (
                            <p className="error">
                                {error}
                            </p>
                        )}

                        <button
                            type="submit"
                            className="place-order-button"
                            disabled={loading}
                        >
                            {loading
                                ? "Placing Order..."
                                : `Place Order • ₹${total}`}
                        </button>

                    </form>

                </div>

                {/* ORDER SUMMARY */}

                <div className="checkout-summary">

                    <h2>Order Summary</h2>

                    <div className="checkout-items">

                        {cart.items.map((item) => (
                            <div
                                className="checkout-item"
                                key={item.medicine._id}
                            >

                                <div>
                                    <strong>
                                        {item.medicine.name}
                                    </strong>

                                    <p>
                                        Qty: {item.quantity}
                                    </p>
                                </div>

                                <span>
                                    ₹
                                    {item.medicine.price *
                                        item.quantity}
                                </span>

                            </div>
                        ))}

                    </div>

                    <div className="summary-divider" />

                    <div className="summary-row">
                        <span>Subtotal</span>
                        <span>₹{total}</span>
                    </div>

                    <div className="summary-row">
                        <span>Delivery</span>
                        <span className="free">
                            FREE
                        </span>
                    </div>

                    <div className="summary-divider" />

                    <div className="summary-total">
                        <span>Total</span>

                        <strong>
                            ₹{total}
                        </strong>
                    </div>

                    <div className="checkout-security">
                        🔒 Your order information
                        is securely processed.
                    </div>

                </div>

            </div>

        </div>
    );
}

export default Checkout;