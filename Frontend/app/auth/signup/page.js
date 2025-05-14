'use client';
import './SignupPage.css';
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { useState } from "react";

export default function SignupPage() {

    const [passeyeOpen, setPassEyeOpen] = useState(false);
    const [eyeOpen, setEyeOpen] = useState(false)
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    return (
        <div className="signup-page">
            <div className="top-left-title">
                <span style={{ color: "#ff3c6b" }}>Collab</span>Mate
            </div>
            <div className="signup-container">
                <div className="signup-logo"></div>
                <h2 className="signup-header">Create Your Account</h2>
                <form className="signup-form">
                    <div className="input-container">
                        <FaUser className="signup-icon" />
                        <input type="text" placeholder="Username" className="signup-input" />
                    </div>
                    <div className="input-container">
                        <FaEnvelope className="signup-icon" />
                        <input type="email" placeholder="Email" className="signup-input" />
                    </div>
                    <div className="input-container">
                        <FaLock className="signup-icon" />
                        <input type={eyeOpen ? "text" : "password"} placeholder="Password" className="signup-input" onChange={e => setPassword(e.target.value)} />
                        <span className='eye-icon' onClick={() => setEyeOpen(!eyeOpen)}>
                            {eyeOpen ? <FaEyeSlash /> : <FaEye />}
                        </span>
                    </div>
                    <div className="input-container">
                        <FaLock className="signup-icon" />
                        <input type={passeyeOpen ? "text" : "password"} placeholder="Confirm Password" className="signup-input" onChange={e => setConfirmPassword(e.target.value)} />
                        <span className='eye-icon' onClick={() => setPassEyeOpen(!passeyeOpen)}>
                            {passeyeOpen ? <FaEyeSlash /> : <FaEye />}
                        </span>
                    </div>
                    <button type="submit" className="signup-button">Sign Up</button>
                </form>
                <p className="signup-footer">
                    Already have an account? <a href="/auth/login">Log In</a>
                </p>
            </div>
        </div>
    );
}
