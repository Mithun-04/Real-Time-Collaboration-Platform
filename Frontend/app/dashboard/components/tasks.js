import { useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import { CircleCheck } from 'lucide-react';
import { X } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';
import Cookies from 'universal-cookie';
import '../styles/tasks.css';
import { user } from '@heroui/theme';


// const initialTasks = [
//     {
//         id: 1,
//         title: 'Task 1',
//         description: 'This is a description of task 1.',
//         status: 'to-do',
//         assignee: 'JD',
//         priority: 'High',
//         deadline: 'June 5, 2025',
//     },
// ];

const Tasks = forwardRef(function Tasks({ selectedProjectId, contentShown }, ref) {
    const [tasks, setTasks] = useState([]);
    const [taskName, setTaskName] = useState('');
    const [taskDescription, setTaskDescription] = useState('');
    const [taskDeadline, setTaskDeadline] = useState('');
    const [taskPriority, setTaskPriority] = useState('');
    const [clickedTask, setClickedTask] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [showTaskAssignment, setShowTaskAssignment] = useState(false);
    const [projectMembers, setProjectMembers] = useState([]);

    const cookies = new Cookies();
    const [username, setUsername] = useState(null);

    useEffect(() => {
        const name = cookies.get("user")?.name;
        setUsername(name);
    }, []);

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

    function getColor(name) {
        let hash = 0;
        for (let i = 0; i < name.length; i++) {
            hash = name.charCodeAt(i) + ((hash << 6) - hash);
        }
        return colors[Math.abs(hash) % colors.length];
    }

    useEffect(() => {
        if (!selectedProjectId) return;
        getProjectTasks();
        fetchProjectMembers(selectedProjectId);
    }, [selectedProjectId, contentShown]);

    useImperativeHandle(ref, () => ({
        refreshTasks: getProjectTasks
    }));

    const handleStatusChange = async (taskId) => {
        setClickedTask(taskId);
        setTimeout(async () => {
            const taskToUpdate = tasks.find((task) => task._id === taskId);
            if (!taskToUpdate) {
                setClickedTask(null);
                return;
            }
            let newStatus = taskToUpdate.status;
            if (taskToUpdate.status === 'to-do') newStatus = 'doing';
            else if (taskToUpdate.status === 'doing') newStatus = 'done';

            const token = cookies.get('token');
            if (!token) {
                toast.error("You are not logged in. Please log in to update task status.");
                setClickedTask(null);
                return;
            }

            try {
                const response = await axios.put(`http://localhost:5000/api/tasks/${taskId}`, { status: newStatus }, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (response.status === 200) {
                    setTasks((prevTasks) =>
                        prevTasks.map((task) =>
                            task._id === taskId ? { ...task, status: newStatus } : task
                        )
                    );
                }
            } catch (error) {
                console.error('Error updating task status:', error);
                toast.error(error?.response?.data?.message || "Something went wrong while updating task status");
            }
            setClickedTask(null);
        }, 200);
    };

    const fetchProjectMembers = async (projectId) => {
        try {
            if (!projectId) {
                toast.error('No project selected');
                return;
            }
            const token = cookies.get('token');
            if (!token) {
                toast.error('You must be logged in to send invitations');
                return;
            }
            const response = await axios.get(`http://localhost:5000/api/projects/${projectId}/members`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            setProjectMembers(response.data.data || []);
        } catch (error) {
            console.error('Error fetching project members:', error);
            toast.error('Error fetching project members');
        }
    };

    const handleUserSelect = (user) => {
        if (!selectedUsers.some(u => u.name === user.name)) {
            console.log('Selected user:', user);
            setSelectedUsers([user]); // Only one user for "Assign To"
            setSearchQuery(user.name); // Fill input with selected user
            setSearchResults([]); // Hide results
        }
    };

    const handleSearchChange = (e) => {
        const query = e.target.value;
        setSearchQuery(query);
    };


    const handleCancel = () => {
        setShowTaskAssignment(false);
        setSearchQuery('');
        setTaskName('');
        setTaskDescription('');
        setTaskDeadline('');
        setTaskPriority('');
        setSelectedUsers([]);
    }

    const getProjectTasks = async () => {
        const token = cookies.get('token');
        if (!token) {
            toast.error("You are not logged in. Please log in to view tasks.");
            return;
        }
        const url = contentShown
            ? `http://localhost:5000/api/tasks/${selectedProjectId}`
            : `http://localhost:5000/api/tasks/allTasks/${selectedProjectId}`;
        try {
            const response = await axios.get(url, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.status) {
                console.log('Response :', response.data.data.length);
                if (response.data?.data?.length === 0) {
                    setTasks([]);
                    // toast.success("No tasks found for this project");
                    return;
                }
                setTasks(response.data.data);
            } else {
                toast.error(response.data.message || "Failed to fetch tasks");
            }
        }
        catch (error) {
            console.error('Error fetching tasks:', error);
            toast.error(error?.response?.data?.message || "Something went wrong while fetching tasks");
        }
    }


    const renderTask = (task) => (
        <div className="task-item" key={task._id}>
            <div className="task-item-header">
                <div className="task-title-section">
                    {task.status !== 'done' && task.assignedTo?.name === username && (
                        <CircleCheck
                            className="completion-circle"
                            strokeWidth={1}
                            onClick={() => handleStatusChange(task._id)}
                            fill={clickedTask === task._id ? 'green' : 'none'}
                            style={{ cursor: 'pointer' }}
                        />
                    )}
                    <h3 className={task.dueDate ? new Date(task.dueDate) < new Date() && task.status !== 'done' ? 'overdue-task' : '' : ''}>{task.title}</h3>
                </div>
                <div className="task-meta">
                    <span className={`task-status ${task.status}`}>{task.status.replace('-', ' ')}</span>
                </div>
            </div>
            <p className="task-description">{task.description}</p>
            <div className="task-footer">
                <div className="task-subfooter">
                    <div className="task-assignee-avatar" style={{ backgroundColor: getColor(task.assignedTo?.name || ''), color: 'black' }} title={`Assigned to ${task.assignedTo?.name}`}>{task.assignedTo?.name ? task.assignedTo.name[0] : '?'}</div>
                    <span className={`task-priority ${task.priority.toLowerCase()}`}>{task.priority}</span>
                </div>
                <div className={`task-deadline-text ${task.dueDate ? new Date(task.dueDate) < new Date() && task.status !== 'done' ? 'overdue' : '' : ''}`}>Deadline: <span>
                    {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : ''}
                    </span>
                </div>
            </div>
        </div>
    );

    const handleAssign = async () => {
        if (!taskName || !taskDescription || !taskDeadline || !taskPriority || selectedUsers.length === 0) {
            toast.error("Please fill in all fields and assign to at least one user.");
            return;
        }
        const newTask = {
            id: tasks.length + 1,
            title: taskName,
            description: taskDescription,
            status: 'to-do',
            assignee: selectedUsers[0].name,
            priority: taskPriority,
            deadline: taskDeadline,
        };


        console.log('New task:', newTask);

        const token = cookies.get('token');


        if (!token) {
            toast.error("You are not logged in. Please log in to create a task.");
            return;
        }


        try {
            const response = await axios.post('http://localhost:5000/api/tasks/create', {
                title: taskName,
                description: taskDescription,
                projectId: selectedProjectId,
                assignedTo: selectedUsers[0].userId, // Assuming selectedUsers[0] has userId
                priority: taskPriority,
                dueDate: taskDeadline,
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.status == 201) {
                toast.success("Task created successfully");
                handleCancel();
                return;
            }
        } catch (error) {
            console.error('Error creating task:', error);
            toast.error(error?.response?.data?.error || "Something went wrong while creating the task");
            return;
        }
        setShowTaskAssignment(false);
        setTaskName('');
        setTaskDescription('');
        setTaskDeadline('');
        setTaskPriority('');
        setSelectedUsers([]);
        setSearchQuery('');
    }

    return (
        <>
            <div className={`task-assignment-overlay ${showTaskAssignment ? "show" : ""}`}></div>
            <div className="task-container">
                <div className="task-content">
                    <h2 className="task-title">Tasks to be Done</h2>
                    <div className="task-list">
                        {tasks.filter((t) => t.status === 'to-do').map(renderTask)}
                        <div className="add-task" onClick={() => setShowTaskAssignment(true)}>
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
            <div className={`task-assignment-container ${showTaskAssignment ? "show" : ""}`}style={{ display: showTaskAssignment ? 'block' : 'none' }   }>
                <div className='task-assignment-header'>
                    <h1 className='task-assignment-title'>Task Assignment</h1>
                    <X className='task-assignment-close' onClick={() => setShowTaskAssignment(false)} />
                </div>
                <div className='task_assignment-body'>
                    <div>
                        <label className='task-assignment-label'>Task Name</label>
                        <input type="text" className='task-assignment-input' placeholder='Enter the Task Name' value={taskName} onChange={e => {
                            setTaskName(e.target.value);
                        }} />
                    </div>
                    <div className='assign-to-container'>
                        <label className='task-assignment-label'>Assign To</label>
                        <div className='selected-user-strip-container'>
                            {selectedUsers.map(user => (
                                <div key={user.name} className="selected-user-strip">
                                    <div className='selected-user-info'>
                                        <div
                                            className="user-avatar-strip"
                                            style={{ backgroundColor: getColor(user.name), color: 'black' }}
                                        >
                                            {user.name[0]}
                                        </div>
                                        <span className="user-name">{user.name}</span>
                                    </div>
                                    <X
                                        size={16}
                                        className="remove-user-icon"
                                        onClick={() => {
                                            setSelectedUsers([])
                                            setSearchQuery(''); // Clear search query when removing user
                                        }}
                                    />
                                </div>
                            ))}
                        </div>
                        <>{selectedUsers.length === 0 && (
                            <input
                                type="text"
                                className='task-assignment-input'
                                placeholder='Search user...'
                                value={searchQuery}
                                onChange={handleSearchChange}
                            />
                        )}
                        </>

                        {selectedUsers.length === 0 && searchQuery && (
                            <div className="search-results">
                                {projectMembers.filter(user => user.name.toLowerCase().includes(searchQuery.toLowerCase())).length > 0 ? (
                                    projectMembers.filter(user => user.name.toLowerCase().includes(searchQuery.toLowerCase())).map(user => (
                                        <div
                                            key={user.name}
                                            className={`search-result-item${selectedUsers.some(selected => selected.name === user.name) ? ' selected' : ''}`}
                                            onClick={() => handleUserSelect(user)}
                                        >
                                            <div className="user-avatar" style={{ backgroundColor: getColor(user.name), color: 'black' }}>
                                                {user.name[0]}
                                            </div>
                                            <div className="user-name">{user.name}</div>
                                        </div>
                                    ))
                                ) : (
                                    <>{selectedUsers.length === 0 && (
                                        <div className="no-users-found">No users found</div>
                                    )}
                                    </>
                                )}
                            </div>
                        )}

                    </div>

                    <div>
                        <label className='task-assignment-label'>Deadline</label>
                        <input type="date" className='task-assignment-input' style={{ color: "white" }} value={taskDeadline} onChange={e => setTaskDeadline(e.target.value)} />
                    </div>
                    <div>
                        <label className='task-assignment-label'>Priority</label>
                        <select className='task-assignment-input' value={taskPriority} onChange={e => setTaskPriority(e.target.value)}>
                            <option value="High">High</option>
                            <option value="Medium">Medium</option>
                            <option value="Low">Low</option>
                        </select>
                    </div>

                    <div>
                        <label className='task-assignment-label'>Description</label>
                        <textarea className='task-assignment-textarea' placeholder='Enter the Task Description' value={taskDescription} onChange={e => setTaskDescription(e.target.value)}></textarea>
                    </div>

                </div>
                <div className='task_assignment-footer'>
                    <button className='task-assignment-btn' onClick={handleAssign}>Assign</button>
                    <button className='task-assignment-btn cancel' onClick={handleCancel}>Cancel</button>
                </div>
            </div>

        </>
    );
});

export default Tasks;
