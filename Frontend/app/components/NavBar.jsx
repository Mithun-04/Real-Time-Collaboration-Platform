
import "../styles/NavBar.css";

export default function NavBar() {
    return (
        <div className="navbar">
            <div className="navbar-logo">
                <span style={{ color: "#ff3c6b" }}>Collab</span>Mate
            </div>
            <div className="navbar-links">
                <a href="#features">Features</a>
                <a href="#pricing">Pricing</a>
                <a href="#about">About Us</a>
                <a href="#contact">Contact</a>
            </div>
            <div className="navbar-buttons">
                <button className="btn-login" onClick={() => window.location.href = "/auth/login"}>Login</button>
                <button className="btn-signup" onClick={() => window.location.href = "/auth/signup"}>Sign Up</button>
            </div>
        </div>
    );
}