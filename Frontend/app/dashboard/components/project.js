'use client';

import './project.css';
import { useState } from 'react';


export default function Project({ project, onClick }) {
  const [isHovered, setIsHovered] = useState(false);

  // Color palette for logos
  const colors = [
    '#FFB6C1', // Light Pink
    '#87CEFA', // Light Blue
    '#90EE90', // Light Green
    '#FFD700', // Gold
    '#FFA07A', // Light Salmon
    '#9370DB', // Medium Purple
    '#FF7F50', // Coral
    '#40E0D0', // Turquoise
    '#F08080', // Light Coral
    '#B0C4DE'  // Light Steel Blue
  ];

  // Hash function to pick a color based on project name
  function getColor(name) {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 8) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  }

  const logoBg = getColor(project.name || '');

  return (
    <div
        className={`project ${isHovered ? 'hovered' : ''}`}
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
    >
        <div
          className='logo'
          style={{ backgroundColor: logoBg }}
        >
          {project.name && project.name[0]}
        </div>
        <h3>{project.name}</h3>
        <p>{project.description}</p>
    </div>
  );
}