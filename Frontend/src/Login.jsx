import { useState } from "react";
import "./Login.css";

function Login({ onLogin, onRegister }) {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");

        if (!email.trim() || !password.trim()) {
            setError("Please enter email and password.");
            return;
        }

        setLoading(true);

        try {

            const response = await fetch(
                "http://localhost:8080/api/auth/login",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    credentials: "include",

                    body: JSON.stringify({
                        email: email.trim(),
                        password
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.error || "Login failed"
                );
            }

            onLogin(data.user);

        } catch (err) {

            console.log("Login Error:", err);

            setError(
                err.message ||
                "Unable to login. Please try again."
            );

        } finally {

            setLoading(false);

        }
    };

    return (
        <div className="login-page">

            <div className="login-card">

                <div className="login-logo">
                    ✦
                </div>

                <h1>
                    Welcome to Aura<span>GPT</span>
                </h1>

                <p className="login-subtitle">
                    Your AI workspace for ideas, learning and code.
                </p>

                <form onSubmit={handleSubmit}>

                    <div className="form-group">

                        <label>
                            Email
                        </label>

                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) =>
                                setEmail(e.target.value)
                            }
                        />

                    </div>

                    <div className="form-group">

                        <label>
                            Password
                        </label>

                        <input
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) =>
                                setPassword(e.target.value)
                            }
                        />

                    </div>

                    {error && (
                        <p className="login-error">
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        className="login-button"
                        disabled={loading}
                    >
                        {loading
                            ? "Logging in..."
                            : "Log In"}
                    </button>

                </form>

                <div className="login-register">

                    <span>
                        Don't have an account?
                    </span>

                    <button
                        type="button"
                        onClick={onRegister}
                    >
                        Create account
                    </button>

                </div>

            </div>

        </div>
    );
}

export default Login;