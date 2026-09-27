import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);
            setError("");

            await login(email, password);

            navigate("/");
        } catch (error) {
            console.error(error);

            setError(
                error.response?.data?.message ||
                "Invalid email or password"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="form-container">

            <div className="auth-header">
                <div className="auth-icon">
                    💊
                </div>

                <h1>Welcome Back</h1>

                <p>
                    Login to your MediConnect account
                </p>
            </div>

            <form
                className="form"
                onSubmit={handleSubmit}
            >

                <div className="form-group">
                    <label>Email</label>

                    <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) =>
                            setEmail(e.target.value)
                        }
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Password</label>

                    <input
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) =>
                            setPassword(e.target.value)
                        }
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="auth-button"
                >
                    {loading ? "Logging in..." : "Login"}
                </button>

            </form>

            {error && (
                <p className="error">
                    {error}
                </p>
            )}

            <p className="auth-footer">
                Don't have an account?{" "}
                <Link to="/register">
                    Create Account
                </Link>
            </p>

        </div>
    );
}

export default Login;