
import "../styles/NavBar.css";

export default function NavBar() {
    return (
        <div className="navbar">
            <div className="navbar-logo">CollabMate</div>
            <div className="navbar-links">
                <a href="#features">Features</a>
                <a href="#pricing">Pricing</a>
                <a href="#about">About Us</a>
                <a href="#contact">Contact</a>
            </div>
            <div className="navbar-buttons">
                <button className="btn-signup">Login</button>
                <button className="btn-login">Sign Up</button>
            </div>
        </div>
    );
}