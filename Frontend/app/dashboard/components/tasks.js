import { useState } from 'react';
import { CircleCheck } from 'lucide-react';
import '../styles/tasks.css';


const initialTasks = [
    {
        id: 1,
        title: 'Task 1',
        description: 'This is a description of task 1.',
        status: 'to-do',
        assignee: 'JD',
        priority: 'High',   
        deadline: 'June 5, 2025',
    },
];

export default function Tasks() {
    const [tasks, setTasks] = useState(initialTasks);
    const [clickedTask, setClickedTask] = useState(null);

    const handleStatusChange = (taskId) => {
        setClickedTask(taskId);
        setTimeout(() => {
            setTasks((prevTasks) =>
                prevTasks.map((task) => {
                    if (task.id !== taskId) return task;
                    let newStatus = task.status;
                    if (task.status === 'to-do') newStatus = 'doing';
                    else if (task.status === 'doing') newStatus = 'done';
                    return { ...task, status: newStatus };
                })
            );
            setClickedTask(null);
        },200);
    };

    const renderTask = (task) => (
        <div className="task-item" key={task.id}>
            <div className="task-item-header">
                <div className="task-title-section">
                    {task.status !== 'done' && (
                        <CircleCheck
                            className="completion-circle"
                            strokeWidth={1}
                            onClick={() => handleStatusChange(task.id)}
                            fill = {clickedTask === task.id ? 'green' : 'none'}
                            style={{ cursor: 'pointer' }}
                        />
                    )}
                    <h3>{task.title}</h3>
                </div>
                <div className="task-meta">
                    <span className={`task-status ${task.status}`}>{task.status.replace('-', ' ')}</span>
                </div>
            </div>
            <p className="task-description">{task.description}</p>
            <div className="task-footer">
                <div className="task-subfooter">
                    <div className="task-assignee-avatar" title={`Assigned to ${task.assignee}`}>{task.assignee}</div>
                    <span className={`task-priority ${task.priority.toLowerCase()}`}>{task.priority}</span>
                </div>
                <div className="task-deadline-text">Deadline: {task.deadline}</div>
            </div>
        </div>
    );

    return (
        <div className="task-container">
            <div className="task-content">
                <h2 className="task-title">Tasks to be Done</h2>
                <div className="task-list">
                    {tasks.filter((t) => t.status === 'to-do').map(renderTask)}
                    <div className="add-task">
                        <h3>Add New Task</h3>
                        <div className="add-icn">+</div>
                    </div>
                </div>

            </div>

            <div className="task-content">
                <h2 className="task-title">Ongoing Tasks</h2>
                <div className="task-list">
                    {tasks.filter((t) => t.status === 'doing').map(renderTask)}
                </div>
            </div>

            <div className="task-content">
                <h2 className="task-title">Completed Tasks</h2>
                <div className="task-list">
                    {tasks.filter((t) => t.status === 'done').map(renderTask)}
                </div>
            </div>
        </div>
    );
}
