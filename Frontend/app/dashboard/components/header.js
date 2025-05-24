'use client';
import { useEffect, useState } from 'react';
import Cookies from 'universal-cookie';
import '../styles/header.css';
import { IoNotificationsOutline } from "react-icons/io5";

export default function Header({ onAddProject, selectedProject, onRefresh }) {
    const [username, setUsername] = useState(null);

    useEffect(() => {
        const cookies = new Cookies();
        const name = cookies.get("user")?.name;
        setUsername(name);
    }, []);

    return (
        <div className="header">
            <div className='header-title'>
                Hi, {username || "User"}
            </div>
            <div className="content-container">
                <button className="add-proj" onClick={onAddProject}>
                    {selectedProject || "Select a Project"}
                </button>
                <button className="refresh-button" onClick={onRefresh}>
                    <IoNotificationsOutline className="message-icon" />
                </button>
                <div className='profile'></div>
            </div>
        </div>
    );
}
