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
import { BarChart } from '@mui/x-charts/BarChart';
import { PieChart } from '@mui/x-charts/PieChart';
import { Gauge, gaugeClasses } from '@mui/x-charts/Gauge';






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

    return (
        <div className="dashboard">
            <SideBar />
            <div className="dashboard-content">
                <Header onAddProject={() => { setShowProject(true) }} selectedProject={selectedProject} />
                <div className="dashboard-content-container">
                    <div className="container-content">
                        <div className="dashboard-widgets">
                            <div className="widget stat">Completed tasks <span>3</span></div>
                            <div className="widget stat">Incomplete tasks <span>1</span></div>
                            <div className="widget stat">Overdue tasks <span>0</span></div>
                            <div className="widget stat">Total tasks <span>4</span></div>
                        </div>

                        <div className="dashboard-charts">

                            <div className="barchart">

                                <h2 className="barchart-title">Task Progress</h2>

                                <BarChart
                                    height={300}
                                    series={[{ data: pData, label: 'Work', id: 'pvId' }]}
                                    xAxis={[{ data: xLabels }]}
                                    yAxis={[{ width: 30 }]} // optional: only if vertical layout desired
                                    colors={['#ff3b6c']}
                                    sx={{
                                        '.MuiChartsAxis-tickLabel': {
                                            fill: '#ffffff !important',
                                        },
                                        '.MuiChartsAxis-label': {
                                            color: '#ffffff !important',
                                            fontSize: '16 !important',
                                        },
                                        '.MuiChartsAxis-line, .MuiChartsAxis-tick': {
                                            stroke: '#ffffff !important',
                                            fontSize: 20,
                                        },
                                        '.MuiChartsGridLine-root': {
                                            stroke: '#ffffff',
                                        },
                                        '.MuiChartsLegend-root': {
                                            color: '#ffffff',
                                            fontSize: 20,
                                        },
                                        '.MuiChartsLegend-label': {
                                            fill: '#ffffff !important',
                                        },
                                        '.MuiChartsTooltip-root': {
                                            color: '#ffffff',
                                            backgroundColor: '#333333',
                                        },
                                        '.MuiBarElement-root': {
                                            width: '60px !important',
                                        },
                                    }}
                                />

                            </div>

                            <div className="Gaugechart">

                                <h2 className="Gauge-title">Task Completion</h2>

                                <Gauge
                                    value={3}
                                    startAngle={-110}
                                    endAngle={110}
                                    valueMin={0}
                                    cornerRadius={3}
                                    valueMax={4}
                                    width={300} // Control size here
                                    sx={{
                                        // Gauge container
                                        '& .MuiGauge-root': {
                                            strokeWidth: 14,
                                        },
                                        // Background arc
                                        '& .MuiGauge-referenceArc': {
                                            stroke: '#2e2e2e',
                                            strokeLinecap: 'round',
                                        },
                                        // Filled arc
                                        '& .MuiGauge-valueArc': {
                                            fill: '#ff3b6c', // your brand color
                                            strokeLinecap: 'round',
                                            // filter: 'drop-shadow(0 0 6px #ff3b6c)', // optional glow effect
                                        },
                                        // Value text in center
                                        '& .MuiGauge-valueText': {
                                            fontSize: '2rem',
                                            fontWeight: 600,
                                        },
                                        '& text': {
                                            fill: '#fff !important', // Fallback for SVG
                                        },
                                    }}
                                    text={({ value, valueMax }) => `${value} / ${valueMax}`}
                                />


                            </div>
                        </div>



                    </div>
                </div>
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
