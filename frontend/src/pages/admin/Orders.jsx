import { useEffect, useState } from "react";
import api from "../../services/api.js";

function Orders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchOrders = async () => {
        try {
            const token = localStorage.getItem("token");

            const response = await api.get(
                "/admin/orders",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setOrders(response.data.orders);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const updateStatus = async (id, orderStatus) => {
        try {
            const token = localStorage.getItem("token");

            await api.put(
                `/admin/orders/${id}/status`,
                {
                    orderStatus
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            fetchOrders();
        } catch (error) {
            alert(
                error.response?.data?.message ||
                "Failed to update order"
            );
        }
    };

    if (loading) {
        return <h2>Loading orders...</h2>;
    }

    return (
        <div style={{ padding: "30px 50px" }}>

            <h1>Manage Orders</h1>

            {orders.length === 0 && (
                <p>No orders found.</p>
            )}

            {orders.map((order) => (

                <div key={order._id}>

                    <h3>
                        Order #{order._id}
                    </h3>

                    <p>
                        Customer:{" "}
                        {order.user?.name}
                    </p>

                    <p>
                        Email:{" "}
                        {order.user?.email}
                    </p>

                    <p>
                        Total: ₹{order.totalAmount}
                    </p>

                    <p>
                        Current Status:{" "}
                        {order.orderStatus}
                    </p>

                    <select
                        value={order.orderStatus}
                        onChange={(e) =>
                            updateStatus(
                                order._id,
                                e.target.value
                            )
                        }
                    >
                        <option value="placed">
                            Placed
                        </option>

                        <option value="confirmed">
                            Confirmed
                        </option>

                        <option value="processing">
                            Processing
                        </option>

                        <option value="shipped">
                            Shipped
                        </option>

                        <option value="delivered">
                            Delivered
                        </option>

                        <option value="cancelled">
                            Cancelled
                        </option>
                    </select>

                    <h4>Items</h4>

                    {order.items.map((item, index) => (
                        <p key={index}>
                            {item.name} × {item.quantity}
                        </p>
                    ))}

                    <hr />

                </div>

            ))}

        </div>
    );
}

export default Orders;