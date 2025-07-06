'use client';
import { useState, useEffect, useRef } from "react";
import Project from "./components/project";
import SideBar from "./components/sideBar";
import Header from "./components/header";
import AddProjectCard from "./components/addprojectCard";
import { IoMdArrowRoundBack } from "react-icons/io";
import { TbRefresh } from "react-icons/tb";
import axios from "axios";
import Cookies from "universal-cookie";
import toast from "react-hot-toast";
import './styles/dashboard.css';
import Reports from "./components/reports";
import Tasks from "./components/tasks";
import Notification from "./components/notification";

export default function Dashboard() {

    const pData = [5, 6, 4];
    const xLabels = [
        'To Do',
        'Doing',
        'Done',
    ];

    const [showAddProject, setShowAddProject] = useState(false);
    const [showProject, setShowProject] = useState(false);
    const [projects, setProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState('');
    const [loading, setLoading] = useState(true);
    const [activeSection, setActiveSection] = useState("reports");
    const [isYourself, setIsYourself] = useState(false);


    const tasksRef = useRef();
    const notificationRef = useRef();
    const reportsRef = useRef();

    const toggleDropdown = (e) => {
        e.stopPropagation(); // Prevent triggering onRefresh
        setIsYourself(!isYourself);
    };

    const handleSectionChange = (section) => {
        setActiveSection(section);
    }

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
        // setShowProject(true);
    }, []);

    const onRefreshActiveSession = () => {
        if (!selectedProject) {
            toast.error("No project selected");
            return;
        }
        if (activeSection === "tasks" && tasksRef.current) {
            tasksRef.current.refreshTasks && tasksRef.current.refreshTasks();
        } else if (activeSection === "notification" && notificationRef.current) {
            notificationRef.current.refreshNotifications && notificationRef.current.refreshNotifications();
        } else if (activeSection === "reports" && reportsRef.current) {
            reportsRef.current.refreshReports && reportsRef.current.refreshReports();
        } else {
            toast("Nothing to refresh for this section");
        }
    };

    return (
        <div className="dashboard">
            <SideBar onNavigate={handleSectionChange} />
            <div className="dashboard-content">
                <Header onAddProject={() => { setShowProject(true) }} selectedProject={selectedProject} onRefresh={onRefreshActiveSession} contentShown={isYourself} toggleDropdown={toggleDropdown} showContentTag = {activeSection === 'notification' ?  false : true}/>
                {activeSection === "reports" && <Reports ref={reportsRef} contentShown={isYourself} selectedProjectId={projects.find(p => p.name === selectedProject)?.id || projects.find(p => p.name === selectedProject)?._id || ''} />}
                {activeSection === "tasks" && <Tasks ref={tasksRef} contentShown={isYourself} selectedProjectId={projects.find(p => p.name === selectedProject)?.id || projects.find(p => p.name === selectedProject)?._id || ''} />}
                {activeSection === "notification" && <Notification ref={notificationRef} selectedProjectId={projects.find(p => p.name === selectedProject)?.id || projects.find(p => p.name === selectedProject)?._id || ''} />}
            </div>

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
                                        onClick={() => {
                                            setSelectedProject(project.name);
                                            setShowProject(false);
                                        }}
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
