import '../styles/header.css';
import { TbRefresh } from 'react-icons/tb';
import { MdOutlineMessage } from "react-icons/md";

export default function Header({ onAddProject, onRefresh }) {
    return (
        <div className="header">
            <div className="content-container">
                    <button className="add-proj" onClick={onAddProject}>
                         Add Project
                    </button>
                    <button className="refresh-button" onClick={onRefresh}>
                        <MdOutlineMessage className="message-icon" />
                    </button>
                    <div className='profile'></div>
            </div>
        </div>
    );
}