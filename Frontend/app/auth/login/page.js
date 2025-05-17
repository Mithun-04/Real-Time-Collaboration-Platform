'use client';
import './LoginPage.css';
import { FaUser, FaLock, FaEye, FaEyeSlash} from "react-icons/fa";
import { useState } from "react";
import axios from 'axios';
import toast from 'react-hot-toast';

export default function LoginPage() {
    const [eyeOpen, setEyeOpen] = useState(false);
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");

    async function handleLogin(e){
        e.preventDefault();
        if (!name || !password) {
            toast.error("Please fill all fields");
            return;
        }
        const data = {
            name,
            password
        }

        console.log(data);

        try {
            const res = await axios.post("http://localhost:5000/api/auth/login", data);
            if (res.status === 200) {
                toast.success("Login successful");
                setTimeout(() => {
                    window.location.href = "/dashboard";
                }, 1000);
            } else {
                toast.error(res.message || "Login failed");
            }
        }
        catch (error) {
            toast.error(error.response.data.error || "Something went wrong");
            console.log(error);
        }
    }

    return (
        <div className="login-page"> 
            <div className="top-left-title" onClick={() => window.location.href = "/"} style={{ cursor: "pointer" }}>
                <span style={{ color: "#ff3c6b" }}>Collab</span>Mate
            </div>
            <div className="login-container">
                <div className="login-logo"></div>
                <h2 className="login-header">Welcome Back</h2>
                <form className="login-form">
                    <div className="input-container">
                        <FaUser className="login-icon" />
                        <input type="text" placeholder="Username" className="login-input" onChange={e => setName(e.target.value)}/>
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
                    <button className="login-button" onClick={handleLogin}>Log In</button>
                </form>
                <p className="login-footer">
                    Don't You Have an Account? <a href="/auth/signup" className="signup-link">Sign Up</a>
                </p>
            </div>
        </div>
    );
}
