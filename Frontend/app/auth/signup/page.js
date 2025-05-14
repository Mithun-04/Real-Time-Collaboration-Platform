import './SignupPage.css';
import { FaUser, FaEnvelope, FaLock } from "react-icons/fa";

export default function SignupPage() {
    return (
        <div className="signup-page">
            <div className="top-left-title">CollabMate</div>
            <div className="signup-container">
                <div className="signup-logo">C</div>
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
                        <input type="password" placeholder="Password" className="signup-input" />
                    </div>
                    <div className="input-container">
                        <FaLock className="signup-icon" />
                        <input type="password" placeholder="Confirm Password" className="signup-input" />
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
