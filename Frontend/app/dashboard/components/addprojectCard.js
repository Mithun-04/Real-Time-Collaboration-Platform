'use client';
import '../styles/addproject.css';
import { IoIosClose } from "react-icons/io";
import { useState } from 'react';
import axios from 'axios';
import Cookies from 'universal-cookie';
import toast from 'react-hot-toast';

export default function AddProjectCard({ onClose }) {
    const [projectName, setProjectName] = useState("");
    const [projectDescription, setProjectDescription] = useState("");

    async function handleAddProject() {
        if (!projectName || !projectDescription) {
            alert("Please fill all fields");
            return;
        }

        const data = {
            name: projectName,
            description: projectDescription
        };

        console.log(data);
        const token = new Cookies().get("token");
        if (!token) {
            toast.error("Please login again");
            setTimeout(() => {
                window.location.href = "/auth/login";
            }, 1000);
            return;
        }
        console.log(token);
        try {
            const res = await axios.post(
                'http://localhost:5000/api/projects',
                data,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            if (res.status === 200) {
                toast.success("Project added successfully");
                onClose();
            } else {
                toast.error(res.data.message || "Failed to add project");
            }
        } catch (error) {
            console.error(error);
            toast.error(error.response.data.message || "Something went wrong");
        }
    }

    return (
        <div className="add-project-card" >
            <div className='add-project-header'>
                <h2>
                    Project Name
                </h2>
                <IoIosClose className="close-icon" onClick={onClose} />
            </div>
            <input
                type="text"
                placeholder="Enter project name"
                className="project-name-input"
                onChange={(e) => setProjectName(e.target.value)}
            />
            <h2>
                Project Description
            </h2>
            <textarea
                placeholder="Enter project description"
                className="project-description-input"
                onChange={(e) => setProjectDescription(e.target.value)}
            />

            <button className="add-project-button" onClick={handleAddProject}>
                Add Project
            </button>
        </div>
    );
}