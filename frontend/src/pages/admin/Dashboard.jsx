import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api.js";

function Dashboard() {
    const [stats, setStats] = useState({
        users: 0,
        medicines: 0,
        orders: 0,
        prescriptions: 0
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchStats = async () => {
            try {
                setLoading(true);

                const token =
                    localStorage.getItem("token");

                const response = await api.get(
                    "/admin/stats",
                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`
                        }
                    }
                );

                setStats(
                    response.data.stats ||
                    response.data
                );
            } catch (error) {
                console.error(error);

                setError(
                    error.response?.data?.message ||
                    "Failed to load dashboard"
                );
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="container page">
                <p>Loading dashboard...</p>
            </div>
        );
    }

    return (
        <div className="container page">

            <div className="admin-header">

                <div>
                    <p className="admin-label">
                        ADMIN PANEL
                    </p>

                    <h1>
                        Dashboard
                    </h1>

                    <p>
                        Manage your MediConnect
                        pharmacy platform.
                    </p>
                </div>

            </div>

            {error && (
                <div className="admin-error">
                    {error}
                </div>
            )}

            {/* STATISTICS */}

            <div className="admin-stats-grid">

                <div className="admin-stat-card">
                    <div className="admin-stat-icon">
                        👥
                    </div>

                    <div>
                        <p>
                            Total Users
                        </p>

                        <h2>
                            {stats.users}
                        </h2>
                    </div>
                </div>

                <div className="admin-stat-card">
                    <div className="admin-stat-icon">
                        💊
                    </div>

                    <div>
                        <p>
                            Medicines
                        </p>

                        <h2>
                            {stats.medicines}
                        </h2>
                    </div>
                </div>

                <div className="admin-stat-card">
                    <div className="admin-stat-icon">
                        📦
                    </div>

                    <div>
                        <p>
                            Orders
                        </p>

                        <h2>
                            {stats.orders}
                        </h2>
                    </div>
                </div>

                <div className="admin-stat-card">
                    <div className="admin-stat-icon">
                        📋
                    </div>

                    <div>
                        <p>
                            Prescriptions
                        </p>

                        <h2>
                            {stats.prescriptions}
                        </h2>
                    </div>
                </div>

            </div>

            {/* MANAGEMENT */}

            <section className="admin-management">

                <div className="admin-section-title">
                    <h2>
                        Management
                    </h2>

                    <p>
                        Manage different parts of
                        your pharmacy platform.
                    </p>
                </div>

                <div className="admin-management-grid">

                    <Link
                        to="/admin/medicines"
                        className="admin-management-card"
                    >
                        <span>
                            💊
                        </span>

                        <div>
                            <h3>
                                Medicines
                            </h3>

                            <p>
                                Add, edit and remove
                                medicines.
                            </p>
                        </div>

                        <strong>
                            →
                        </strong>
                    </Link>

                    <Link
                        to="/admin/orders"
                        className="admin-management-card"
                    >
                        <span>
                            📦
                        </span>

                        <div>
                            <h3>
                                Orders
                            </h3>

                            <p>
                                View and manage customer
                                orders.
                            </p>
                        </div>

                        <strong>
                            →
                        </strong>
                    </Link>

                    <Link
                        to="/admin/users"
                        className="admin-management-card"
                    >
                        <span>
                            👥
                        </span>

                        <div>
                            <h3>
                                Users
                            </h3>

                            <p>
                                View registered users
                                and accounts.
                            </p>
                        </div>

                        <strong>
                            →
                        </strong>
                    </Link>

                    <Link
                        to="/admin/prescriptions"
                        className="admin-management-card"
                    >
                        <span>
                            📋
                        </span>

                        <div>
                            <h3>
                                Prescriptions
                            </h3>

                            <p>
                                Review uploaded
                                prescriptions.
                            </p>
                        </div>

                        <strong>
                            →
                        </strong>
                    </Link>

                </div>

            </section>

        </div>
    );
}

export default Dashboard;