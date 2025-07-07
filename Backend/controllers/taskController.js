import taskService from "../service/taskService.js";

// Create Task (Manager Only)
export const createTask = async (req, res) => {
    try {
        const task = await taskService.createTask({
            title: req.body.title,
            description: req.body.description,
            projectId: req.body.projectId,
            assignedTo: req.body.assignedTo,
            priority: req.body.priority,
            dueDate: req.body.dueDate,
            createdBy: req.user.id,
        });
        res.status(201).json(task);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const getProjectTasks = async (req, res) => {
    try {
        const projectId = req.params.projectId;

        if(!projectId) {
            return res.status(400).json({
                success: false,
                error: "Project ID is required"
            });
        }

        const userId = req.user.id;

        const tasks = await taskService.getProjectTasks(projectId, userId);
        res.json({
            success: true,
            data: tasks,
            message: 'Tasks retrieved successfully'
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message || 'Failed to retrieve tasks'
        });
    }
};

export const getAllTasks = async ( req, res) =>{
    try{
        const projectId = req.params.projectId;

        const response = await taskService.getAllTasks(projectId);

        res.status(201).json({
            status : true,
            data : response,
        })
    }
    catch(error){
        res.status(400).json({
            status : false,
            error : error.message
        })
    }
}

export const getUserTasks = async (req, res) => {
    try {
        const userId = req.user.id;
        console.log("User ID:", userId); // Debugging line to check the user ID
        if (!userId) {
            return res.status(400).json({ error: "User ID is required" });
        }
        const tasks = await taskService.getUserTasks(userId);
        res.json(tasks);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const updateTaskStatus = async (req, res) => {
    try {
        const taskId = req.params.id;
        const userId = req.user.id;
        const { status } = req.body;

        if (!status) {
            return res.status(400).json({ success: false, error: "Status is required" });
        }

        const updatedTask = await taskService.updateTask(taskId, userId, { status });

        res.json({
            success: true,
            data: updatedTask,
            message: "Task status updated successfully"
        });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

export const deleteTask = async (req, res) => {
    try {
        await taskService.deleteTask(req.params.id);
        res.json({ message: "Task deleted successfully" });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
