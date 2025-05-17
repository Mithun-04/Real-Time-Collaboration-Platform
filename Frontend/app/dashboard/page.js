'use client';
import Project from "./components/project";
import './dashboard.css';
import { IoMdArrowRoundBack } from "react-icons/io";
import { TbRefresh } from "react-icons/tb";

export default function Dashboard() {
    const projects = [
        {
            id: 1,
            name: "Project 1",
            description: "Description for project 1",
            image: "/assets/pfp_1.jpg",
        },
        {
            id: 2,
            name: "Project 2",
            description: "Description for project 2",
            image: "/project2.jpg",
        },
        {
            id: 3,
            name: "Project 3",
            description: "Description for project 3",
            image: "/project3.jpg",
        },
        {
            id: 4,
            name: "Project 4",
            description: "Description for project 4",
            image: "/project4.jpg",
        },
        {
            id: 5,
            name: "Project 5",
            description: "Description for project 5",
            image: "/project5.jpg",
        },
        // {
        //     id: 6,
        //     name: "Project 6",
        //     description: "Description for project 6",
        //     image: "/project6.jpg",
        // },
        // {
        //     id: 7,
        //     name: "Project 7",
        //     description: "Description for project 7",
        //     image: "/project7.jpg",
        // },
        // {
        //     id: 8,
        //     name: "Project 8",
        //     description: "Description for project 8",
        //     image: "/project8.jpg",
        // },
    ];

    return (
        <div className="dashboard">
            <div className="backdrop"></div>
            <div className="projects-container">
                <div className="projects-header">
                    <IoMdArrowRoundBack className="back-icon" onClick={() => window.location.href = "/auth/login"}/>
                    <h2>Choose a Project</h2>
                    <TbRefresh className="back-icon" onClick={() => alert("Refreshed")} />
                </div>
                <div className="projects">
                    {projects.map((project) => (
                        <Project key={project.id} project={project} onClick={() => alert(`Clicked on ${project.name}`)} />
                    ))}
                    <div className="add-project">
                        <h3>Add New Project</h3>
                        <div className="add-icon">+</div>
                    </div>
                </div>
            </div>
        </div>
    );
}