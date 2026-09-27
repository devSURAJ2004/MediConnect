import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./src/components/Navbar.jsx";
import ProtectedRoute from "./src/components/ProtectedRoute.jsx";
import AdminRoute from "./src/components/AdminRoute.jsx";

import Home from "./src/pages/Home.jsx";
import Login from "./src/pages/Login.jsx";
import Register from "./src/pages/Register.jsx";
import Medicines from "./src/pages/Medicines.jsx";
import MedicineDetails from "./src/pages/MedicineDetails.jsx";
import Cart from "./src/pages/Cart.jsx";
import Checkout from "./src/pages/Checkout.jsx";
import Orders from "./src/pages/Orders.jsx";
import Prescription from "./src/pages/Prescription.jsx";

import Dashboard from "./src/pages/admin/Dashboard.jsx";
import AdminUsers from "./src/pages/admin/Users.jsx";
import AdminMedicines from "./src/pages/admin/Medicines.jsx";
import AdminOrders from "./src/pages/admin/Orders.jsx";
import AdminPrescriptions from "./src/pages/admin/Prescriptions.jsx";

function App() {
    return (
        <BrowserRouter>

            <Navbar />

            <Routes>

                <Route
                    path="/"
                    element={<Home />}
                />

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/register"
                    element={<Register />}
                />

                <Route
                    path="/medicines"
                    element={<Medicines />}
                />

                <Route
                    path="/medicines/:id"
                    element={<MedicineDetails />}
                />

                <Route
                    path="/cart"
                    element={
                        <ProtectedRoute>
                            <Cart />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/checkout"
                    element={
                        <ProtectedRoute>
                            <Checkout />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/orders"
                    element={
                        <ProtectedRoute>
                            <Orders />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/prescription"
                    element={
                        <ProtectedRoute>
                            <Prescription />
                        </ProtectedRoute>
                    }
                />

                {/* ADMIN */}

                <Route
                    path="/admin/dashboard"
                    element={
                        <AdminRoute>
                            <Dashboard />
                        </AdminRoute>
                    }
                />

                <Route
                    path="/admin/users"
                    element={
                        <AdminRoute>
                            <AdminUsers />
                        </AdminRoute>
                    }
                />

                <Route
                    path="/admin/medicines"
                    element={
                        <AdminRoute>
                            <AdminMedicines />
                        </AdminRoute>
                    }
                />

                <Route
                    path="/admin/orders"
                    element={
                        <AdminRoute>
                            <AdminOrders />
                        </AdminRoute>
                    }
                />

                <Route
                    path="/admin/prescriptions"
                    element={
                        <AdminRoute>
                            <AdminPrescriptions />
                        </AdminRoute>
                    }
                />

            </Routes>

        </BrowserRouter>
    );
}

export default App;