'use client';
import './SignupPage.css';
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { useState } from "react";
import toast from 'react-hot-toast';
import  axios from 'axios';

export default function SignupPage() {

    const [passeyeOpen, setPassEyeOpen] = useState(false);
    const [eyeOpen, setEyeOpen] = useState(false)
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");

    async function handleSubmit(e) {
        e.preventDefault();
        if (password !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }
        if (!name || !email) {
            toast.error("Please fill all fields");
            return;
        }
        const data = {
            name,
            email,
            password
        }

        console.log(data);

        try {
            const res = await axios.post("http://localhost:5000/api/auth/signup", data);
            if (res.status === 201) {
            toast.success("User created successfully");
            setTimeout(() => {
                window.location.href = "/auth/login";
            }, 2000);
            } else {
            toast.error(res.message || "Signup failed");
            }
        }
        catch (error) {
            toast.error(error.response.data.error || "Something went wrong");
            console.log(error);
        }
           
    }

    
    return (
        <div className="signup-page">
            <div className="top-left-title" onClick={() => window.location.href = "/"} style={{ cursor: "pointer" }}>
                <span style={{ color: "#ff3c6b" }}>Collab</span>Mate
            </div>
            <div className="signup-container">
                <div className="signup-logo"></div>
                <h2 className="signup-header">Create Your Account</h2>
                <form className="signup-form">
                    <div className="input-container">
                        <FaUser className="signup-icon" />
                        <input type="text" placeholder="Username" className="signup-input" onChange={(e) => setName(e.target.value)} />
                    </div>
                    <div className="input-container">
                        <FaEnvelope className="signup-icon" />
                        <input type="email" placeholder="Email" className="signup-input" onChange={(e) => setEmail(e.target.value)} />
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
                    <button className="signup-button" onClick={handleSubmit}>Sign Up</button>
                </form>
                <p className="signup-footer">
                    Already have an account? <a href="/auth/login">Log In</a>
                </p>
            </div>
        </div>
    );

}