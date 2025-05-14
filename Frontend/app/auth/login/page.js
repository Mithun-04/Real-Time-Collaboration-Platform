'use client';
import './LoginPage.css';
import { FaUser, FaLock, FaEye, FaEyeSlash} from "react-icons/fa";

import { useState } from "react";

export default function LoginPage() {
    const [eyeOpen, setEyeOpen] = useState(false);
    const [password, setPassword] = useState("");

    return (
        <div className="login-page"> 
            <div className="top-left-title">
                <span style={{ color: "#ff3c6b" }}>Collab</span>Mate
            </div>
            <div className="login-container">
                <div className="login-logo"></div>
                <h2 className="login-header">Welcome Back</h2>
                <form className="login-form">
                    <div className="input-container">
                        <FaUser className="login-icon" />
                        <input type="text" placeholder="Username" className="login-input" />
                    </div>
                    <div className="input-container">
                        <FaLock className="login-icon" />
                        <input
                            type={eyeOpen ? "text" : "password"}
                            placeholder="Password"
                            className="login-input"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                        />
                        <span
                            className="eye-icon"
                            onClick={() => setEyeOpen(!eyeOpen)}

                        >
                            {eyeOpen ? <FaEyeSlash /> : <FaEye />}
                        </span>
                    </div>
                    <button type="submit" className="login-button">Log In</button>
                </form>
                <p className="login-footer">
                    Don't You Have an Account? <a href="/auth/signup" className="signup-link">Sign Up</a>
                </p>
            </div>
        </div>
    );
}
