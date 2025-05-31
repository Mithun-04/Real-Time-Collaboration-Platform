
import { CircleCheck } from 'lucide-react';
import '../styles/tasks.css';

export default function Tasks() {
    return (
        <div className="task-container">
            <div className="task-content">
                <h2 className="task-title">Tasks to be Done</h2>
                <div className="task-list">
                    <div className="task-item">
                        <div className="task-item-header">
                            <div className="task-title-section">
                                <CircleCheck className="completion-circle" strokeWidth={1} />
                                <h3>Task 1</h3>
                            </div>
                            <div className="task-meta">
                                <span className="task-status">To Do</span>
                            </div>
                        </div>
                        <p className="task-description">This is a description of task 1.</p>

                        <div className="task-footer">
                            <div className="task-subfooter">
                                <div className="task-assignee-avatar" title="Assigned to John Doe">JD</div>
                                <span className="task-priority high">High</span>
                            </div>
                            <div className="task-deadline-text">Deadline: June 5, 2025</div>
                        </div>

                    </div>
                    <div className="task-item">
                        <div className="task-item-header">
                            <h3>Task 2</h3>
                            <span className="task-status">To Do</span>
                        </div>
                        <p className="task-description">This is a description of task 2.</p>
                    </div>
                    <div className="add-task">
                        <h3>Add New Task</h3>
                        <div className="add-icn">+</div>
                    </div>
                </div>

            </div>
            <div className="task-content">
                <h2 className="task-title">Ongoing Tasks</h2>
                <div className="task-list">
                    <div className="task-item">
                        <div className="task-item-header">
                            <div className="task-title-section">
                                <CircleCheck className="completion-circle" strokeWidth={1} />
                                <h3>Task 1</h3>
                            </div>
                            <div className="task-meta">
                                <span className="task-status">To Do</span>
                            </div>
                        </div>
                        <p className="task-description">This is a description of task 1.</p>

                        <div className="task-footer">
                            <div className="task-subfooter">
                                <div className="task-assignee-avatar" title="Assigned to John Doe">JD</div>
                                <span className="task-priority high">High</span>
                            </div>
                            <div className="task-deadline-text">Deadline: June 5, 2025</div>
                        </div>

                    </div>
                    <div className="task-item">
                        <div className="task-item-header">
                            <h3>Task 2</h3>
                            <span className="task-status">To Do</span>
                        </div>
                        <p className="task-description">This is a description of task 2.</p>
                    </div>
                </div>

            </div>
            <div className="task-content">
                <h2 className="task-title">Completed Tasks</h2>
                <div className="task-list">
                    <div className="task-item">
                        <div className="task-item-header">
                            <div className="task-title-section">
                                <h3>Task 1</h3>
                            </div>
                            <div className="task-meta">
                                <span className="task-status">To Do</span>
                            </div>
                        </div>
                        <p className="task-description">This is a description of task 1.</p>

                        <div className="task-footer">
                            <div className="task-subfooter">
                                <div className="task-assignee-avatar" title="Assigned to John Doe">JD</div>
                                <span className="task-priority high">High</span>
                            </div>
                            <div className="task-deadline-text">Deadline: June 5, 2025</div>
                        </div>

                    </div>
                    <div className="task-item">
                        <div className="task-item-header">
                            <h3>Task 2</h3>
                            <span className="task-status">To Do</span>
                        </div>
                        <p className="task-description">This is a description of task 2.</p>
                    </div>
                </div>

            </div>


        </div>
    )
}