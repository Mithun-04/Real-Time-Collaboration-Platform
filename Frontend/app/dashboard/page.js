'use client';
import { useState, useEffect } from "react";
import Project from "./components/project";
import SideBar from "./components/sideBar";
import Header from "./components/header";
import { IoMdArrowRoundBack } from "react-icons/io";
import AddProjectCard from "./components/addprojectCard";
import { TbRefresh } from "react-icons/tb";
import axios from "axios";
import Cookies from "universal-cookie";
import toast from "react-hot-toast";
import './styles/dashboard.css';

export default function Dashboard() {
    const [showAddProject, setShowAddProject] = useState(false);
    const [showProject, setShowProject] = useState(false);
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    async function fetchProjects() {
        const token = new Cookies().get("token");

        if (!token) {
            toast.error("Please login again");
            setTimeout(() => {
                window.location.href = "/auth/login";
            }, 1000);
            return;
        }

        try {
            setLoading(true);
            const res = await axios.get('http://localhost:5000/api/projects', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (res.status === 200) {
                setProjects(res.data.data);
            } else {
                toast.error(res.data.message || "Failed to fetch projects");
            }
        } catch (error) {
            console.error(error);
            toast.error(error?.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchProjects();
        setShowProject(true);
    }, []);

    return (
        <div className="dashboard">
            <div className={`backdrop ${showAddProject ? 'blurred' : ''}`}></div>
            <SideBar />
            <Header onAddProject={() => { setShowProject(true) }} />

            {showProject && (
                <div className="projects-container-overlay">
                    <div className={`projects-container ${showAddProject ? 'blurred' : ''}`}>
                        <div className="projects-header">
                            <IoMdArrowRoundBack className="back-icon" onClick={() => setShowProject(false)} />
                            <h2>Choose a Project</h2>
                            <TbRefresh className="back-icon" onClick={fetchProjects} />
                        </div>

                        <div className="projects">
                            {loading ? (
                                <> </>
                            ) : projects.length > 0 ? (
                                projects.map((project, index) => (
                                    <Project
                                        key={project.id || `project-${index}`}
                                        project={project}
                                        onClick={() => alert(`Clicked on ${project.name}`)}
                                    />
                                ))

                            ) : (<></>)
                            }

                            <div className="add-project" onClick={() => setShowAddProject(true)}>
                                <h3>Add New Project</h3>
                                <div className="add-icon">+</div>
                            </div>
                        </div>
                    </div>
                </div>)}

            {showAddProject && (
                <div className="modal-overlay">
                    <AddProjectCard onClose={() => setShowAddProject(false)} />
                </div>
            )}
        </div>


    );
}
