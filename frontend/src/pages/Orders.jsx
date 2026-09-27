import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api.js";

function Orders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                setLoading(true);
                setError("");

                const token =
                    localStorage.getItem("token");

                const response = await api.get(
                    "/orders",
                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`
                        }
                    }
                );

                setOrders(
                    response.data.orders || []
                );
            } catch (error) {
                console.error(error);

                setError(
                    error.response?.data?.message ||
                    "Failed to load orders"
                );
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    const getStatusClass = (status) => {
        switch (status?.toLowerCase()) {
            case "delivered":
                return "status delivered";

            case "cancelled":
                return "status cancelled";

            case "shipped":
                return "status shipped";

            default:
                return "status pending";
        }
    };

    if (loading) {
        return (
            <div className="container page">
                <p>Loading your orders...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container page">
                <p className="error">
                    {error}
                </p>
            </div>
        );
    }

    if (orders.length === 0) {
        return (
            <div className="container page">

                <div className="empty-orders">

                    <div className="empty-orders-icon">
                        📦
                    </div>

                    <h1>No Orders Yet</h1>

                    <p>
                        You haven't placed any medicine
                        orders yet.
                    </p>

                    <Link
                        to="/medicines"
                        className="primary-button"
                    >
                        Start Shopping
                    </Link>

                </div>

            </div>
        );
    }

    return (
        <div className="container page">

            <div className="orders-header">
                <div>
                    <h1>My Orders</h1>

                    <p>
                        View and track your medicine
                        orders.
                    </p>
                </div>
            </div>

            <div className="orders-list">

                {orders.map((order) => {

                    const orderDate =
                        order.createdAt
                            ? new Date(
                                order.createdAt
                            ).toLocaleDateString(
                                "en-IN",
                                {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric"
                                }
                            )
                            : "Date unavailable";

                    return (
                        <div
                            className="order-card-new"
                            key={order._id}
                        >

                            {/* ORDER HEADER */}

                            <div className="order-top">

                                <div>
                                    <p className="order-label">
                                        ORDER ID
                                    </p>

                                    <strong>
                                        #{order._id}
                                    </strong>
                                </div>

                                <div className="order-date">
                                    <p className="order-label">
                                        ORDER DATE
                                    </p>

                                    <span>
                                        {orderDate}
                                    </span>
                                </div>

                                <span
                                    className={getStatusClass(
                                        order.status
                                    )}
                                >
                                    {order.status ||
                                        "Pending"}
                                </span>

                            </div>

                            <div className="order-divider" />

                            {/* ITEMS */}

                            <div className="order-items">

                                {order.items?.map(
                                    (item, index) => {

                                        const medicine =
                                            item.medicine;

                                        return (
                                            <div
                                                className="order-item"
                                                key={
                                                    item._id ||
                                                    index
                                                }
                                            >

                                                <div className="order-item-image">
                                                    {medicine?.image ? (
                                                        <img
                                                            src={
                                                                medicine.image
                                                            }
                                                            alt={
                                                                medicine.name
                                                            }
                                                        />
                                                    ) : (
                                                        <span>
                                                            💊
                                                        </span>
                                                    )}
                                                </div>

                                                <div className="order-item-info">

                                                    <strong>
                                                        {medicine?.name ||
                                                            "Medicine"}
                                                    </strong>

                                                    <p>
                                                        Quantity:{" "}
                                                        {
                                                            item.quantity
                                                        }
                                                    </p>

                                                </div>

                                                <strong>
                                                    ₹
                                                    {
                                                        item.price
                                                            ? item.price *
                                                              item.quantity
                                                            : 0
                                                    }
                                                </strong>

                                            </div>
                                        );
                                    }
                                )}

                            </div>

                            <div className="order-divider" />

                            {/* FOOTER */}

                            <div className="order-bottom">

                                <div>
                                    <span>
                                        Total Amount
                                    </span>

                                    <strong>
                                        ₹
                                        {order.totalAmount ||
                                            order.total ||
                                            0}
                                    </strong>
                                </div>

                            </div>

                        </div>
                    );
                })}

            </div>

        </div>
    );
}

export default Orders;