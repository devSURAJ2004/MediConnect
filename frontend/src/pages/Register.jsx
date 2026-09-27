import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

function Register() {
    const { register } = useAuth();
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);
            setError("");

            await register(
                name,
                email,
                password
            );

            navigate("/");
        } catch (error) {
            console.error(error);

            setError(
                error.response?.data?.message ||
                "Registration failed"
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

                <h1>Create Account</h1>

                <p>
                    Join MediConnect today
                </p>
            </div>

            <form
                className="form"
                onSubmit={handleSubmit}
            >

                <div className="form-group">
                    <label>Full Name</label>

                    <input
                        type="text"
                        placeholder="Enter your name"
                        value={name}
                        onChange={(e) =>
                            setName(e.target.value)
                        }
                        required
                    />
                </div>

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
                        placeholder="Create a password"
                        value={password}
                        onChange={(e) =>
                            setPassword(e.target.value)
                        }
                        required
                        minLength="6"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="auth-button"
                >
                    {loading
                        ? "Creating Account..."
                        : "Create Account"}
                </button>

            </form>

            {error && (
                <p className="error">
                    {error}
                </p>
            )}

            <p className="auth-footer">
                Already have an account?{" "}
                <Link to="/login">
                    Login
                </Link>
            </p>

        </div>
    );
}

export default Register;