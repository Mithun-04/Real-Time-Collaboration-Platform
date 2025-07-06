'use client';
import { useEffect, useState } from 'react';
import Cookies from 'universal-cookie';
import { TbRefresh } from "react-icons/tb";
import '../styles/header.css';
import { TbSwitchHorizontal } from "react-icons/tb";



export default function Header({ onAddProject, selectedProject, onRefresh  , contentShown , toggleDropdown , showContentTag}) {
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
                <span className='showing-content'>
                     {showContentTag ? contentShown ? 'Your Contributions' : 'All Contributions' : ''}
                </span>
            </div>
            
            <div className="content-container">
                <div className='refresh-icon'>
                    <TbRefresh className='refresh-icon' onClick={onRefresh} />
                </div>
                <button className="add-proj" onClick={onAddProject}>
                    {selectedProject || "Select a Project"}
                </button>
                <button className="refresh-button" onClick={onRefresh}>
                    <TbSwitchHorizontal className='switch-icon' onClick={toggleDropdown} />
                </button>
                <div className='profile'>
                </div>
            </div>
        </div>
    );
}
