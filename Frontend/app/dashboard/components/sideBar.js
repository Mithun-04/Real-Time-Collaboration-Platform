import '../styles/sideBar.css';
import { FaTasks, FaCalendarAlt, FaFileAlt, FaSignOutAlt } from 'react-icons/fa';
import { ChartNoAxesCombined } from 'lucide-react';
import { MdManageAccounts } from "react-icons/md";

export default function SideBar({ onNavigate, onClose }) {
    return (
        <div className="sidebar">
            <div className="sidebar-header">
                <span className="logo-accent">Collab</span>Mate
            </div>

            <div className="sidebar-content">
                <ul className="sidebar-menu">
                    <li className="sidebar-item" onClick={() => onNavigate("reports")}>
                        <ChartNoAxesCombined className="sidebar-icon"  />
                        Reports
                    </li>
                    <li className="sidebar-item" onClick={() => onNavigate("tasks")}>
                        <FaTasks className="sidebar-icon" />
                        Tasks
                    </li>
                    <li className="sidebar-item">
                        <FaCalendarAlt className="sidebar-icon" />
                        Deadlines
                    </li>
                    <li className="sidebar-item">
                        <FaFileAlt className="sidebar-icon" />
                        Documents
                    </li>
                    <li className="sidebar-item logout" onClick={onClose}>
                        <FaSignOutAlt className="sidebar-icon" />
                        Logout
                    </li>
                </ul>
            </div>
            <div className="sidebar-footer">
                <p>CollabMate © 2025</p>
                <small>v1.0.0</small>
            </div>
        </div>
    );
}
