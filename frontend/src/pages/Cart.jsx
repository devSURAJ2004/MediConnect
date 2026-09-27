import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";

function Cart() {
    const {
        cart,
        loading,
        updateQuantity,
        removeFromCart
    } = useCart();

    if (loading) {
        return (
            <div className="container page">
                <p>Loading cart...</p>
            </div>
        );
    }

    if (!cart || !cart.items || cart.items.length === 0) {
        return (
            <div className="container page">

                <div className="empty-cart">

                    <div className="empty-cart-icon">
                        🛒
                    </div>

                    <h1>Your Cart is Empty</h1>

                    <p>
                        You haven't added any medicines
                        to your cart yet.
                    </p>

                    <Link
                        to="/medicines"
                        className="primary-button"
                    >
                        Browse Medicines
                    </Link>

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

    const handleIncrease = async (item) => {
        try {
            await updateQuantity(
                item.medicine._id,
                item.quantity + 1
            );
        } catch (error) {
            console.error(error);
        }
    };

    const handleDecrease = async (item) => {
        try {
            if (item.quantity === 1) {
                await removeFromCart(
                    item.medicine._id
                );
                return;
            }

            await updateQuantity(
                item.medicine._id,
                item.quantity - 1
            );
        } catch (error) {
            console.error(error);
        }
    };

    const handleRemove = async (medicineId) => {
        try {
            await removeFromCart(medicineId);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="container page">

            <div className="cart-header">

                <div>
                    <h1>Your Cart</h1>

                    <p>
                        {cart.items.length}{" "}
                        {cart.items.length === 1
                            ? "medicine"
                            : "medicines"}{" "}
                        in your cart
                    </p>
                </div>

                <Link
                    to="/medicines"
                    className="continue-shopping"
                >
                    ← Continue Shopping
                </Link>

            </div>

            <div className="cart-layout">

                {/* CART ITEMS */}

                <div className="cart-items">

                    {cart.items.map((item) => {

                        const medicine =
                            item.medicine;

                        const itemTotal =
                            medicine.price *
                            item.quantity;

                        return (
                            <div
                                className="cart-product"
                                key={medicine._id}
                            >

                                <div className="cart-product-image">

                                    {medicine.image ? (
                                        <img
                                            src={medicine.image}
                                            alt={medicine.name}
                                        />
                                    ) : (
                                        <span>💊</span>
                                    )}

                                </div>

                                <div className="cart-product-info">

                                    <h2>
                                        {medicine.name}
                                    </h2>

                                    <p>
                                        {medicine.category}
                                    </p>

                                    <span className="cart-unit-price">
                                        ₹{medicine.price} / unit
                                    </span>

                                </div>

                                <div className="cart-product-actions">

                                    <div className="cart-quantity">

                                        <button
                                            onClick={() =>
                                                handleDecrease(item)
                                            }
                                        >
                                            −
                                        </button>

                                        <span>
                                            {item.quantity}
                                        </span>

                                        <button
                                            onClick={() =>
                                                handleIncrease(item)
                                            }
                                            disabled={
                                                item.quantity >=
                                                medicine.stock
                                            }
                                        >
                                            +
                                        </button>

                                    </div>

                                    <strong className="cart-item-total">
                                        ₹{itemTotal}
                                    </strong>

                                    <button
                                        className="remove-button"
                                        onClick={() =>
                                            handleRemove(
                                                medicine._id
                                            )
                                        }
                                    >
                                        Remove
                                    </button>

                                </div>

                            </div>
                        );
                    })}

                </div>

                {/* ORDER SUMMARY */}

                <div className="cart-summary">

                    <h2>Order Summary</h2>

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

                    <Link
                        to="/checkout"
                        className="checkout-button"
                    >
                        Proceed to Checkout →
                    </Link>

                    <p className="secure-text">
                        🔒 Secure checkout
                    </p>

                </div>

            </div>

        </div>
    );
}

export default Cart;