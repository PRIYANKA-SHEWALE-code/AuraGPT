import { useState } from "react";
import "./Register.css";

function Register({
    onRegister,
    onLogin
}) {

    const [name, setName] =
        useState("");

    const [email, setEmail] =
        useState("");

    const [password, setPassword] =
        useState("");

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");

    const [success, setSuccess] =
        useState("");


    const handleRegister =
        async (e) => {

            e.preventDefault();

            setError("");
            setSuccess("");
            setLoading(true);


            try {

                const response =
                    await fetch(
                        "http://localhost:8080/api/auth/register",
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body: JSON.stringify({
                                name,
                                email,
                                password
                            })
                        }
                    );


                const data =
                    await response.json();


                if (!response.ok) {

                    throw new Error(
                        data.error ||
                        "Registration failed"
                    );

                }


                setSuccess(
                    "Account created successfully! Please login."
                );


                setName("");
                setEmail("");
                setPassword("");


            } catch (err) {

                setError(
                    err.message
                );

            } finally {

                setLoading(false);

            }

        };


    return (

        <div className="register-page">


            {/* BACKGROUND */}

            <div className="register-glow register-glow-one"></div>

            <div className="register-glow register-glow-two"></div>


            {/* CARD */}

            <div className="register-card">


                {/* LOGO */}

                <div className="register-logo">
                    ✦
                </div>


                <h1>
                    Create your
                    <span>
                        Aura
                    </span>
                </h1>


                <p className="register-subtitle">

                    Start your personalized AI workspace.

                </p>


                {/* FORM */}

                <form
                    onSubmit={
                        handleRegister
                    }
                >


                    {/* NAME */}

                    <div className="register-input-group">

                        <label>
                            Full name
                        </label>


                        <div className="register-input">

                            <i className="fa-solid fa-user"></i>

                            <input
                                type="text"
                                placeholder="Enter your name"
                                value={name}
                                onChange={(e) =>
                                    setName(
                                        e.target.value
                                    )
                                }
                                required
                            />

                        </div>

                    </div>


                    {/* EMAIL */}

                    <div className="register-input-group">

                        <label>
                            Email address
                        </label>


                        <div className="register-input">

                            <i className="fa-solid fa-envelope"></i>

                            <input
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) =>
                                    setEmail(
                                        e.target.value
                                    )
                                }
                                required
                            />

                        </div>

                    </div>


                    {/* PASSWORD */}

                    <div className="register-input-group">

                        <label>
                            Password
                        </label>


                        <div className="register-input">

                            <i className="fa-solid fa-lock"></i>

                            <input
                                type="password"
                                placeholder="Create a password"
                                value={password}
                                onChange={(e) =>
                                    setPassword(
                                        e.target.value
                                    )
                                }
                                minLength={6}
                                required
                            />

                        </div>

                    </div>


                    {/* ERROR */}

                    {error && (

                        <div className="register-message error">

                            <i className="fa-solid fa-circle-exclamation"></i>

                            {error}

                        </div>

                    )}


                    {/* SUCCESS */}

                    {success && (

                        <div className="register-message success">

                            <i className="fa-solid fa-circle-check"></i>

                            {success}

                        </div>

                    )}


                    {/* BUTTON */}

                    <button
                        className="register-button"
                        type="submit"
                        disabled={loading}
                    >

                        {loading ? (

                            <>
                                <span className="register-spinner"></span>
                                Creating account...
                            </>

                        ) : (

                            <>
                                Create AuraGPT account
                                <i className="fa-solid fa-arrow-right"></i>
                            </>

                        )}

                    </button>

                </form>


                {/* LOGIN */}

                <div className="register-login">

                    <span>
                        Already have an account?
                    </span>

                    <button
                        onClick={onLogin}
                    >
                        Login
                    </button>

                </div>


                {/* FOOTER */}

                <div className="register-footer">

                    <span>
                        ✦
                    </span>

                    AuraGPT

                    <span>
                        •
                    </span>

                    AI powered workspace

                </div>

            </div>

        </div>

    );

}

export default Register;