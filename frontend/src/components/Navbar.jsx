import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

function Navbar() {
    const { user, logout } = useAuth();

    return (
        <nav>

            <Link
                to="/"
                className="nav-logo"
            >
                MediConnect
            </Link>

            <div className="nav-links">

                <Link to="/">
                    Home
                </Link>

                <Link to="/medicines">
                    Medicines
                </Link>

                {user && (
                    <>
                        <Link to="/cart">
                            Cart
                        </Link>

                        <Link to="/orders">
                            Orders
                        </Link>

                        <Link to="/prescription">
                            Prescription
                        </Link>
                    </>
                )}

                {user?.role === "admin" && (
                    <Link to="/admin/dashboard">
                        Admin
                    </Link>
                )}

                {user ? (
                    <>
                        <span className="nav-user">
                            Hi, {user.name}
                        </span>

                        <button
                            className="nav-button"
                            onClick={logout}
                        >
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/login">
                            Login
                        </Link>

                        <Link to="/register">
                            Register
                        </Link>
                    </>
                )}

            </div>

        </nav>
    );
}

export default Navbar;